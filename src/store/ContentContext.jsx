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

export function ContentProvider({ children }) {
    // null = loading; [] = loaded-empty; array = loaded
    const [deals, setDeals] = useState(null);

    // Latest deals for use inside debounced callbacks.
    const dealsRef = useRef([]);
    useEffect(() => {
        dealsRef.current = deals || [];
    }, [deals]);

    // Per-row debounce timers + the set of rows with unsaved local edits.
    const timersRef = useRef({});
    const dirtyRef = useRef(new Set());

    // Initial load + realtime sync (so every visitor's board updates live).
    useEffect(() => {
        let active = true;

        fetchDeals().then((d) => {
            if (!active) return;
            setDeals(d ?? DEFAULT_CONTENT.deals); // fall back to seed if offline
        });

        const channel = supabase
            .channel("public:deals")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "deals" },
                async () => {
                    const fresh = await fetchDeals();
                    if (!active || !fresh) return;
                    // Don't clobber rows the admin is actively editing.
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
            .subscribe();

        return () => {
            active = false;
            supabase.removeChannel(channel);
        };
    }, []);

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

        return {
            content: { ...DEFAULT_CONTENT, deals: deals || [] },
            loading: deals === null,

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
                setDeals((d) => [item, ...(d || [])]); // optimistic
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

            /** Insert the built-in sample items (used when the board is empty). */
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
    }, [deals]);

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
