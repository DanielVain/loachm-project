import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./supabase.js";
import { newId } from "../data/content.js";

/* Admin-only repair tickets. RLS restricts every operation to authenticated
   sessions, so this is only usable from inside the protected CMS. */

const toRow = (r) => ({
    id: r.id,
    item: r.item ?? "",
    customer: r.customer ?? "",
    phone: r.phone ?? "",
    issue: r.issue ?? "",
    status: r.status ?? "received",
    price: Number(r.price) || 0,
    notes: r.notes ?? "",
});

async function fetchRepairs() {
    const { data, error } = await supabase
        .from("repairs")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) {
        console.warn("Could not load repairs:", error.message);
        return null;
    }
    return data;
}

export function useRepairs() {
    const [repairs, setRepairs] = useState(null); // null = loading
    const ref = useRef([]);
    useEffect(() => {
        ref.current = repairs || [];
    }, [repairs]);

    const timers = useRef({});
    const dirty = useRef(new Set());

    useEffect(() => {
        let active = true;
        fetchRepairs().then((d) => {
            if (active) setRepairs(d ?? []);
        });

        const channel = supabase
            .channel("admin:repairs")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "repairs" },
                async () => {
                    const fresh = await fetchRepairs();
                    if (!active || !fresh) return;
                    setRepairs((prev) => {
                        const local = new Map(
                            (prev || []).map((r) => [r.id, r]),
                        );
                        return fresh.map((r) =>
                            dirty.current.has(r.id) && local.has(r.id)
                                ? local.get(r.id)
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
            dirty.current.add(id);
            clearTimeout(timers.current[id]);
            timers.current[id] = setTimeout(async () => {
                const row = ref.current.find((r) => r.id === id);
                if (!row) return;
                const { error } = await supabase
                    .from("repairs")
                    .update({
                        ...toRow(row),
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", id);
                if (error) console.warn("Repair save failed:", error.message);
                dirty.current.delete(id);
            }, 600);
        };

        return {
            async addRepair() {
                const item = {
                    id: newId(),
                    item: "",
                    customer: "",
                    phone: "",
                    issue: "",
                    status: "received",
                    price: 0,
                    notes: "",
                    created_at: new Date().toISOString(),
                };
                setRepairs((r) => [item, ...(r || [])]);
                const { error } = await supabase
                    .from("repairs")
                    .insert(toRow(item));
                if (error) console.warn("Add repair failed:", error.message);
                return item;
            },
            updateRepair(id, patch) {
                setRepairs((r) =>
                    (r || []).map((x) => (x.id === id ? { ...x, ...patch } : x)),
                );
                scheduleSave(id);
            },
            async removeRepair(id) {
                setRepairs((r) => (r || []).filter((x) => x.id !== id));
                dirty.current.delete(id);
                clearTimeout(timers.current[id]);
                const { error } = await supabase
                    .from("repairs")
                    .delete()
                    .eq("id", id);
                if (error) console.warn("Delete repair failed:", error.message);
            },
        };
    }, []);

    return { repairs, loading: repairs === null, ...api };
}

export const REPAIR_STATUSES = [
    { value: "received", label: "התקבל", color: "#6b7280" },
    { value: "diagnosing", label: "באבחון", color: "#2f9be6" },
    { value: "in_progress", label: "בטיפול", color: "#e0a415" },
    { value: "waiting_part", label: "ממתין לחלק", color: "#b45309" },
    { value: "ready", label: "מוכן לאיסוף", color: "#98c838" },
    { value: "delivered", label: "נמסר", color: "#16a34a" },
    { value: "cancelled", label: "בוטל", color: "#e5484d" },
];

export const statusMeta = (value) =>
    REPAIR_STATUSES.find((s) => s.value === value) || REPAIR_STATUSES[0];
