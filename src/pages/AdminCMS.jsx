import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Trash2, ImagePlus, X, LogOut, Loader2 } from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import { useAuth } from "../store/AuthContext.jsx";
import { uploadProductImage } from "../store/supabase.js";
import {
    ICON_CHOICES,
    iconFor,
    pct,
    splitSpec,
    joinSpec,
} from "../data/content.js";
import Brand from "../components/Brand.jsx";
import SiteEditor from "./SiteEditor.jsx";
import RepairsEditor from "./RepairsEditor.jsx";

const MAX_IMAGE_BYTES = 5_000_000; // 5 MB

function Field({ label, children }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="uppercase-mono t-mute">{label}</span>
            {children}
        </label>
    );
}

function DealEditor({ deal, onChange, onRemove }) {
    const [imgError, setImgError] = useState("");
    const [uploading, setUploading] = useState(false);
    const Icon = iconFor(deal.icon);

    // Spec edited as a list; persisted as a "·"-joined string.
    const [specItems, setSpecItems] = useState(() => {
        const arr = splitSpec(deal.spec);
        return arr.length ? arr : [""];
    });
    const syncSpecs = (arr) => {
        setSpecItems(arr);
        onChange({ spec: joinSpec(arr) });
    };
    const setSpecAt = (i, v) =>
        syncSpecs(specItems.map((x, j) => (j === i ? v : x)));
    const removeSpec = (i) => {
        const next = specItems.filter((_, j) => j !== i);
        syncSpecs(next.length ? next : [""]);
    };
    const addSpec = () => setSpecItems([...specItems, ""]);

    async function onPickImage(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_IMAGE_BYTES) {
            setImgError("התמונה גדולה מדי (מקסימום 5MB).");
            return;
        }
        setImgError("");
        setUploading(true);
        try {
            const url = await uploadProductImage(file);
            onChange({ image: url });
        } catch (err) {
            setImgError("העלאת התמונה נכשלה: " + (err.message || ""));
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="cms-card t-card border t-rule p-4 md:p-5">
            <div className="flex items-start gap-4">
                {/* image / thumbnail */}
                <div className="flex flex-col items-center gap-2 w-28 flex-shrink-0">
                    <div className="cms-thumb">
                        {uploading ? (
                            <Loader2 className="w-6 h-6 t-mute animate-spin" />
                        ) : deal.image ? (
                            <img src={deal.image} alt={deal.name} />
                        ) : (
                            <Icon className="w-8 h-8 t-mute" strokeWidth={1.3} />
                        )}
                    </div>
                    <label className="cms-upload uppercase-mono">
                        <ImagePlus className="w-3 h-3" strokeWidth={2.5} />
                        תמונה
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onPickImage}
                        />
                    </label>
                    {deal.image && (
                        <button
                            type="button"
                            onClick={() => onChange({ image: "" })}
                            className="uppercase-mono t-mute flex items-center gap-1 h-green"
                        >
                            <X className="w-3 h-3" /> הסר
                        </button>
                    )}
                </div>

                {/* fields */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Field label="שם">
                        <input
                            className="cms-input"
                            value={deal.name}
                            onChange={(e) => onChange({ name: e.target.value })}
                        />
                    </Field>
                    <Field label="קטגוריה">
                        <input
                            className="cms-input"
                            list="cms-categories"
                            placeholder="לדוגמה: מקלדת"
                            value={deal.cat}
                            onChange={(e) => onChange({ cat: e.target.value })}
                        />
                    </Field>
                    <Field label="אייקון">
                        <select
                            className="cms-input"
                            value={deal.icon}
                            onChange={(e) => onChange({ icon: e.target.value })}
                        >
                            {ICON_CHOICES.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <div className="col-span-2 md:col-span-3 flex flex-col gap-1.5">
                        <span className="uppercase-mono t-mute">מפרט</span>
                        <div className="flex flex-col gap-2">
                            {specItems.map((s, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2"
                                >
                                    <span className="spec-bullet">·</span>
                                    <input
                                        className="cms-input flex-1"
                                        value={s}
                                        placeholder="תכונה (לדוגמה: אלחוטי)"
                                        onChange={(e) =>
                                            setSpecAt(i, e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSpec(i)}
                                        aria-label="הסר תכונה"
                                        className="t-mute h-green"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addSpec}
                                className="cms-add-row uppercase-mono"
                            >
                                <Plus className="w-3 h-3" strokeWidth={2.5} />
                                הוסף תכונה
                            </button>
                        </div>
                    </div>
                    <Field label="מחיר קודם (₪)">
                        <input
                            type="number"
                            dir="ltr"
                            className="cms-input"
                            value={deal.was}
                            onChange={(e) =>
                                onChange({ was: Number(e.target.value) })
                            }
                        />
                    </Field>
                    <Field label="מחיר נוכחי (₪)">
                        <input
                            type="number"
                            dir="ltr"
                            className="cms-input"
                            value={deal.now}
                            onChange={(e) =>
                                onChange({ now: Number(e.target.value) })
                            }
                        />
                    </Field>
                    <Field label="מלאי">
                        <input
                            type="number"
                            dir="ltr"
                            className="cms-input"
                            value={deal.stock}
                            onChange={(e) =>
                                onChange({ stock: Number(e.target.value) })
                            }
                        />
                    </Field>
                    <label className="flex items-end gap-2 pb-2">
                        <input
                            type="checkbox"
                            checked={deal.hot}
                            onChange={(e) => onChange({ hot: e.target.checked })}
                        />
                        <span className="uppercase-mono">מוצר חם 🔥</span>
                    </label>
                    <div className="flex items-end justify-end">
                        <span className="uppercase-mono t-green">
                            {pct(deal.was, deal.now) > 0
                                ? `−${pct(deal.was, deal.now)}%`
                                : "—"}
                        </span>
                    </div>
                </div>
            </div>

            {imgError && (
                <div
                    className="text-sm font-mono mt-3"
                    style={{ color: "#e5484d" }}
                >
                    {imgError}
                </div>
            )}

            <div className="flex justify-end mt-3 pt-3 border-t t-rule-soft">
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

export default function AdminCMS() {
    const { content, loading, addDeal, updateDeal, removeDeal, seedSamples } =
        useContent();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [seeding, setSeeding] = useState(false);
    const [tab, setTab] = useState("board");

    // Existing categories, offered as autocomplete suggestions in each editor.
    const categories = useMemo(() => {
        const set = new Set();
        content.deals.forEach((d) => {
            const c = (d.cat || "").trim();
            if (c) set.add(c);
        });
        return Array.from(set);
    }, [content.deals]);

    async function onLogout() {
        await signOut();
        navigate("/admin");
    }

    async function onSeed() {
        setSeeding(true);
        await seedSamples();
        setSeeding(false);
    }

    return (
        <div className="admin-shell min-h-screen">
            <header className="border-b t-rule t-bg sticky top-0 z-20">
                <div className="max-w-[1100px] mx-auto px-5">
                    <div className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Brand size="text-xl" />
                            <span className="uppercase-mono t-mute">
                                / ניהול
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                to="/"
                                className="uppercase-mono border t-rule px-3 py-2 h-green transition-colors"
                            >
                                צפייה באתר ↗
                            </Link>
                            <button
                                onClick={onLogout}
                                className="uppercase-mono border t-rule px-3 py-2 flex items-center gap-1.5"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                יציאה
                            </button>
                        </div>
                    </div>

                    <div className="board-cats flex flex-wrap gap-2 pb-3">
                        <button
                            onClick={() => setTab("board")}
                            className={`cat-chip ${tab === "board" ? "cat-chip--active" : ""}`}
                        >
                            הלוח
                        </button>
                        <button
                            onClick={() => setTab("site")}
                            className={`cat-chip ${tab === "site" ? "cat-chip--active" : ""}`}
                        >
                            תוכן האתר
                        </button>
                        <button
                            onClick={() => setTab("repairs")}
                            className={`cat-chip ${tab === "repairs" ? "cat-chip--active" : ""}`}
                        >
                            תיקונים
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto px-5 py-8">
                {tab === "site" && <SiteEditor />}
                {tab === "repairs" && <RepairsEditor />}

                {tab === "board" && (
                    <>
                        <datalist id="cms-categories">
                            {categories.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>

                        <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl">
                            פריטי הלוח
                        </h1>
                        <p className="t-mute text-sm mt-1">
                            {content.deals.length} פריטים · נשמר אוטומטית ומסונכרן
                            לכל המבקרים.
                        </p>
                    </div>
                    <button
                        onClick={() => addDeal()}
                        className="t-green-bg px-4 py-2.5 font-bold text-sm flex items-center gap-2"
                        style={{ color: "#0a0a0a" }}
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        פריט חדש
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {content.deals.map((deal) => (
                        <DealEditor
                            key={deal.id}
                            deal={deal}
                            onChange={(patch) => updateDeal(deal.id, patch)}
                            onRemove={() => removeDeal(deal.id)}
                        />
                    ))}

                    {!loading && content.deals.length === 0 && (
                        <div className="t-mute font-mono text-sm py-12 text-center border t-rule flex flex-col items-center gap-4">
                            <span>הלוח ריק.</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => addDeal()}
                                    className="uppercase-mono border t-rule px-3 py-2 h-green"
                                >
                                    + פריט חדש
                                </button>
                                <button
                                    onClick={onSeed}
                                    disabled={seeding}
                                    className="uppercase-mono border t-rule px-3 py-2 disabled:opacity-60"
                                >
                                    {seeding ? "טוען…" : "טען פריטי דוגמה"}
                                </button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="t-mute font-mono text-sm py-12 text-center">
                            טוען…
                        </div>
                    )}
                </div>

                        <div className="mt-10 pt-6 border-t t-rule">
                            <p className="uppercase-mono t-mute max-w-xl">
                                השינויים נשמרים בענן (Supabase) ומופיעים מיד אצל
                                כל מי שגולש באתר.
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
