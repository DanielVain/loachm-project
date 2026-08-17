import { useMemo, useState } from "react";
import { Plus, Trash2, Search, X, Phone } from "lucide-react";
import {
    useRepairs,
    REPAIR_STATUSES,
    statusMeta,
} from "../store/useRepairs.js";

function Field({ label, children, className = "" }) {
    return (
        <label className={`flex flex-col gap-1 ${className}`}>
            <span className="uppercase-mono t-mute">{label}</span>
            {children}
        </label>
    );
}

function fmtDate(iso) {
    if (!iso) return "";
    try {
        return new Date(iso).toLocaleDateString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        });
    } catch {
        return "";
    }
}

function RepairCard({ repair, onChange, onRemove }) {
    const meta = statusMeta(repair.status);
    const telHref =
        "tel:" + (repair.phone || "").replace(/[^\d+]/g, "").replace(/^00/, "+");

    return (
        <div className="cms-card t-card border t-rule p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
                <span
                    className="status-badge"
                    style={{ color: meta.color, borderColor: meta.color }}
                >
                    <span
                        className="status-dot"
                        style={{ backgroundColor: meta.color }}
                    />
                    {meta.label}
                </span>
                <span className="uppercase-mono t-mute">
                    התקבל {fmtDate(repair.created_at)}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Field label="פריט">
                    <input
                        className="cms-input"
                        value={repair.item}
                        placeholder="לדוגמה: iPhone 13"
                        onChange={(e) => onChange({ item: e.target.value })}
                    />
                </Field>
                <Field label="שם לקוח">
                    <input
                        className="cms-input"
                        value={repair.customer}
                        onChange={(e) => onChange({ customer: e.target.value })}
                    />
                </Field>
                <Field label="טלפון">
                    <input
                        className="cms-input"
                        dir="ltr"
                        value={repair.phone}
                        onChange={(e) => onChange({ phone: e.target.value })}
                    />
                </Field>
                <Field label="סטטוס">
                    <select
                        className="cms-input"
                        value={repair.status}
                        onChange={(e) => onChange({ status: e.target.value })}
                    >
                        {REPAIR_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="תקלה" className="col-span-2">
                    <input
                        className="cms-input"
                        value={repair.issue}
                        placeholder="תיאור התקלה"
                        onChange={(e) => onChange({ issue: e.target.value })}
                    />
                </Field>
                <Field label="מחיר (₪)">
                    <input
                        type="number"
                        dir="ltr"
                        className="cms-input"
                        value={repair.price}
                        onChange={(e) =>
                            onChange({ price: Number(e.target.value) || 0 })
                        }
                    />
                </Field>
                <Field label="הערות">
                    <input
                        className="cms-input"
                        value={repair.notes}
                        onChange={(e) => onChange({ notes: e.target.value })}
                    />
                </Field>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t t-rule-soft">
                {repair.phone ? (
                    <a
                        href={telHref}
                        className="uppercase-mono t-green flex items-center gap-1.5"
                    >
                        <Phone className="w-3.5 h-3.5" strokeWidth={2.2} />
                        חייג ללקוח
                    </a>
                ) : (
                    <span />
                )}
                <button
                    type="button"
                    onClick={onRemove}
                    className="uppercase-mono flex items-center gap-1.5"
                    style={{ color: "#e5484d" }}
                >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                    מחיקה
                </button>
            </div>
        </div>
    );
}

export default function RepairsEditor() {
    const { repairs, loading, addRepair, updateRepair, removeRepair } =
        useRepairs();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");

    const list = repairs || [];
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return list.filter((r) => {
            const matchS = status === "all" || r.status === status;
            const matchQ =
                !q ||
                [r.item, r.customer, r.phone, r.issue].some((v) =>
                    (v || "").toLowerCase().includes(q),
                );
            return matchS && matchQ;
        });
    }, [list, query, status]);

    // Count open (not delivered/cancelled) tickets.
    const openCount = list.filter(
        (r) => r.status !== "delivered" && r.status !== "cancelled",
    ).length;

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-2xl md:text-3xl">תיקונים</h1>
                    <p className="t-mute text-sm mt-1">
                        {openCount} פתוחים · {list.length} סה״כ
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="board-search">
                        <Search
                            className="w-4 h-4 t-mute flex-shrink-0"
                            strokeWidth={2}
                        />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="חיפוש לקוח / פריט / טלפון…"
                            className="board-search-input"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="t-mute h-green"
                                aria-label="נקה"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => addRepair()}
                        className="t-green-bg px-4 py-2.5 font-bold text-sm flex items-center gap-2"
                        style={{ color: "#0a0a0a" }}
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        תיקון חדש
                    </button>
                </div>
            </div>

            {/* status filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setStatus("all")}
                    className={`cat-chip ${status === "all" ? "cat-chip--active" : ""}`}
                >
                    הכל
                </button>
                {REPAIR_STATUSES.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => setStatus(s.value)}
                        className={`cat-chip ${status === s.value ? "cat-chip--active" : ""}`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {filtered.map((r) => (
                    <RepairCard
                        key={r.id}
                        repair={r}
                        onChange={(patch) => updateRepair(r.id, patch)}
                        onRemove={() => removeRepair(r.id)}
                    />
                ))}

                {loading && (
                    <div className="t-mute font-mono text-sm py-12 text-center">
                        טוען…
                    </div>
                )}
                {!loading && list.length === 0 && (
                    <div className="t-mute font-mono text-sm py-12 text-center border t-rule">
                        אין תיקונים עדיין. לחצו "תיקון חדש" כדי להתחיל.
                    </div>
                )}
                {!loading && list.length > 0 && filtered.length === 0 && (
                    <div className="t-mute font-mono text-sm py-12 text-center border t-rule">
                        לא נמצאו תיקונים תואמים.
                    </div>
                )}
            </div>
        </div>
    );
}
