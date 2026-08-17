import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { DEFAULT_CONTENT, newId } from "../data/content.js";
import { supabase } from "./supabase.js";

const ContentContext = createContext(null);

/** Keep only the columns that exist on the `deals` table. */
const toRow = (d) => ({
    id: d.id,
    cat: d.cat ?? "",
    icon: d.icon ?? "ShoppingBag",
    name: d.name ?? "",
    spec: d.spec ?? "",
    was: Number(d.was) || 0,
    now: Number(d.now) || 0,
    stock: Number(d.stock) || 0,
    hot: !!d.hot,
    image: d.image ?? "",
    sort: Number(d.sort) || 0,
});

async function fetchDeals() {
    const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("sort", { ascending: true })
        .order("updated_at", { ascending: false });
    if (error) {
        console.warn("Could not load deals from Supabase:", error.message);
        return null;
    }
    return data;
}

async function fetchSite() {
    const { data, error } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", "main")
        .maybeSingle();
    if (error) {
        console.warn("Could not load site content:", error.message);
        return null;
    }
    return data?.data ?? {};
}

export function ContentProvider({ children }) {
    // null = loading; [] = loaded-empty; array = loaded
    const [deals, setDeals] = useState(null);
    // Editable site-content overrides (merged over DEFAULT_CONTENT).
    const [site, setSite] = useState({});

    // Latest values for use inside debounced callbacks.
    const dealsRef = useRef([]);
    useEffect(() => {
        dealsRef.current = deals || [];
    }, [deals]);
    const siteRef = useRef({});
    useEffect(() => {
        siteRef.current = site;
    }, [site]);

    // Debounce timers + "actively editing" guards.
    const timersRef = useRef({});
    const dirtyRef = useRef(new Set());
    const siteTimer = useRef(null);
    const siteDirty = useRef(false);

    // Initial load + realtime sync (so every visitor updates live).
    useEffect(() => {
        let active = true;

        fetchDeals().then((d) => {
            if (!active) return;
            setDeals(d ?? DEFAULT_CONTENT.deals);
        });
        fetchSite().then((s) => {
            if (active && s) setSite(s);
        });

        const channel = supabase
            .channel("public:content")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "deals" },
                async () => {
                    const fresh = await fetchDeals();
                    if (!active || !fresh) return;
                    setDeals((prev) => {
                        const localById = new Map(
                            (prev || []).map((d) => [d.id, d]),
                        );
                        return fresh.map((r) =>
                            dirtyRef.current.has(r.id) && localById.has(r.id)
                                ? localById.get(r.id)
                                : r,
                        );
                    });
                },
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "site_content" },
                async () => {
                    if (siteDirty.current) return; // don't clobber active edits
                    const s = await fetchSite();
                    if (active && s) setSite(s);
                },
            )
            .subscribe();

        return () => {
            active = false;
            supabase.removeChannel(channel);
        };
    }, []);

    // Merge defaults ← saved overrides ← live deals.
    const content = useMemo(
        () => ({
            ...DEFAULT_CONTENT,
            ...site,
            ui: { ...DEFAULT_CONTENT.ui, ...(site.ui || {}) },
            featured: { ...DEFAULT_CONTENT.featured, ...(site.featured || {}) },
            ticker: site.ticker ?? DEFAULT_CONTENT.ticker,
            extras: site.extras ?? DEFAULT_CONTENT.extras,
            deals: deals || [],
        }),
        [site, deals],
    );

    const api = useMemo(() => {
        const scheduleSave = (id) => {
            dirtyRef.current.add(id);
            clearTimeout(timersRef.current[id]);
            timersRef.current[id] = setTimeout(async () => {
                const row = dealsRef.current.find((d) => d.id === id);
                if (!row) return;
                const { error } = await supabase
                    .from("deals")
                    .update({
                        ...toRow(row),
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", id);
                if (error) console.warn("Save failed:", error.message);
                dirtyRef.current.delete(id);
            }, 600);
        };

        const scheduleSiteSave = () => {
            siteDirty.current = true;
            clearTimeout(siteTimer.current);
            siteTimer.current = setTimeout(async () => {
                const { error } = await supabase.from("site_content").upsert({
                    id: "main",
                    data: siteRef.current,
                    updated_at: new Date().toISOString(),
                });
                if (error) console.warn("Site save failed:", error.message);
                siteDirty.current = false;
            }, 600);
        };

        return {
            content,
            loading: deals === null,

            /** Patch editable site content (ticker, featured, extras, ui…). */
            updateSite(patch) {
                setSite((prev) => ({ ...prev, ...patch }));
                scheduleSiteSave();
            },

            async addDeal(partial = {}) {
                const item = {
                    id: newId(),
                    cat: "",
                    icon: "ShoppingBag",
                    name: "",
                    spec: "",
                    was: 0,
                    now: 0,
                    stock: 0,
                    hot: false,
                    image: "",
                    sort: 0,
                    ...partial,
                };
                setDeals((d) => [item, ...(d || [])]);
                const { error } = await supabase
                    .from("deals")
                    .insert(toRow(item));
                if (error) console.warn("Add failed:", error.message);
                return item;
            },

            updateDeal(id, patch) {
                setDeals((d) =>
                    (d || []).map((x) =>
                        x.id === id ? { ...x, ...patch } : x,
                    ),
                );
                scheduleSave(id);
            },

            async removeDeal(id) {
                setDeals((d) => (d || []).filter((x) => x.id !== id));
                dirtyRef.current.delete(id);
                clearTimeout(timersRef.current[id]);
                const { error } = await supabase
                    .from("deals")
                    .delete()
                    .eq("id", id);
                if (error) console.warn("Delete failed:", error.message);
            },

            async seedSamples() {
                const rows = DEFAULT_CONTENT.deals.map((d, i) =>
                    toRow({ ...d, sort: i }),
                );
                const { error } = await supabase.from("deals").insert(rows);
                if (error) {
                    console.warn("Seed failed:", error.message);
                    return error.message;
                }
                const fresh = await fetchDeals();
                if (fresh) setDeals(fresh);
                return null;
            },
        };
    }, [content, deals]);

    return (
        <ContentContext.Provider value={api}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    const ctx = useContext(ContentContext);
    if (!ctx)
        throw new Error("useContent must be used within a <ContentProvider>");
    return ctx;
}
