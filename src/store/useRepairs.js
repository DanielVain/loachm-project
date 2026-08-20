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
    movements: Array.isArray(r.movements) ? r.movements : [],
});

/** Build a movement/timeline entry (Amazon-style status update). */
const newMovement = (mv = {}) => ({
    id: newId(),
    at: new Date().toISOString(),
    status: "received",
    by: "",
    note: "",
    ...mv,
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
                const payload = {
                    ...toRow(row),
                    updated_at: new Date().toISOString(),
                };
                let { error } = await supabase
                    .from("repairs")
                    .update(payload)
                    .eq("id", id);
                // If the `movements` column isn't there yet, save everything
                // else so repair editing keeps working (timeline persists once
                // the column is added).
                if (error && /movements|schema cache|column/i.test(error.message)) {
                    const { movements, ...rest } = payload;
                    ({ error } = await supabase
                        .from("repairs")
                        .update(rest)
                        .eq("id", id));
                }
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
                    movements: [newMovement({ status: "received", note: "נפתח תיקון" })],
                    created_at: new Date().toISOString(),
                };
                setRepairs((r) => [item, ...(r || [])]);
                let { error } = await supabase
                    .from("repairs")
                    .insert(toRow(item));
                if (error && /movements|schema cache|column/i.test(error.message)) {
                    const { movements, ...rest } = toRow(item);
                    ({ error } = await supabase.from("repairs").insert(rest));
                }
                if (error) console.warn("Add repair failed:", error.message);
                return item;
            },
            updateRepair(id, patch) {
                setRepairs((r) =>
                    (r || []).map((x) => (x.id === id ? { ...x, ...patch } : x)),
                );
                scheduleSave(id);
            },
            /** Append a timeline entry (and, if given, move the ticket's status). */
            addMovement(id, mv) {
                const entry = newMovement(mv);
                setRepairs((r) =>
                    (r || []).map((x) =>
                        x.id === id
                            ? {
                                  ...x,
                                  status: mv?.status ?? x.status,
                                  movements: [...(x.movements || []), entry],
                              }
                            : x,
                    ),
                );
                scheduleSave(id);
            },
            removeMovement(id, mid) {
                setRepairs((r) =>
                    (r || []).map((x) =>
                        x.id === id
                            ? {
                                  ...x,
                                  movements: (x.movements || []).filter(
                                      (m) => m.id !== mid,
                                  ),
                              }
                            : x,
                    ),
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

/**
 * The single source of truth for repair statuses — drives the editor's status
 * dropdowns, filters and timeline badges. Add or reorder here and it flows
 * everywhere. `customerVisible` is a forward-looking hook: today the whole
 * board is internal, but a future customer-facing timeline can filter on this
 * flag to hide states we'd rather not expose (set it `false` on those).
 */
export const REPAIR_STATUSES = [
    { value: "received", label: "התקבל", color: "#6b7280", customerVisible: true },
    { value: "diagnosing", label: "באבחון", color: "#2f9be6", customerVisible: true },
    { value: "in_progress", label: "בטיפול", color: "#e0a415", customerVisible: true },
    { value: "waiting_part", label: "ממתין לחלק", color: "#b45309", customerVisible: true },
    { value: "sent_supplier", label: "הועבר לספק", color: "#8b5cf6", customerVisible: true },
    { value: "awaiting_supplier", label: "ממתין לתשובה מספק", color: "#6d28d9", customerVisible: true },
    // Supplier outcome branches — one or the other, before the item is ready.
    { value: "replacement", label: "התקבלה החלפה", color: "#14b8a6", customerVisible: true },
    { value: "refund", label: "התקבל זיכוי", color: "#0891b2", customerVisible: true },
    { value: "ready", label: "מוכן לאיסוף", color: "#98c838", customerVisible: true },
    { value: "delivered", label: "נמסר", color: "#16a34a", customerVisible: true },
    { value: "cancelled", label: "בוטל", color: "#e5484d", customerVisible: false },
];

/** Statuses safe to show a visiting customer (used by any future public view). */
export const CUSTOMER_STATUSES = REPAIR_STATUSES.filter((s) => s.customerVisible);

export const statusMeta = (value) =>
    REPAIR_STATUSES.find((s) => s.value === value) || REPAIR_STATUSES[0];
