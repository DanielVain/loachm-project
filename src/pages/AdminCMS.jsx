import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Trash2, ImagePlus, X, LogOut, RotateCcw } from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import { ICON_CHOICES, iconFor, pct } from "../data/content.js";
import { logout } from "../store/auth.js";
import Brand from "../components/Brand.jsx";

const MAX_IMAGE_BYTES = 1_500_000; // ~1.5 MB after encoding; keep localStorage sane

/** Read a File into a compressed-ish data URL we can store inline. */
function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

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
    const Icon = iconFor(deal.icon);

    async function onPickImage(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_IMAGE_BYTES) {
            setImgError("התמונה גדולה מדי (מקסימום ~1.5MB). בחרו תמונה קטנה יותר.");
            return;
        }
        setImgError("");
        const url = await fileToDataUrl(file);
        onChange({ image: url });
    }

    return (
        <div className="cms-card t-card border t-rule p-4 md:p-5">
            <div className="flex items-start gap-4">
                {/* image / thumbnail */}
                <div className="flex flex-col items-center gap-2 w-28 flex-shrink-0">
                    <div className="cms-thumb">
                        {deal.image ? (
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
                    <Field label="מפרט">
                        <input
                            className="cms-input"
                            value={deal.spec}
                            onChange={(e) => onChange({ spec: e.target.value })}
                        />
                    </Field>
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
                            onChange={(e) =>
                                onChange({ hot: e.target.checked })
                            }
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
                <div className="text-sm font-mono mt-3" style={{ color: "#e5484d" }}>
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
    const { content, addDeal, updateDeal, removeDeal, resetContent } =
        useContent();
    const navigate = useNavigate();

    function onLogout() {
        logout();
        navigate("/admin");
    }

    return (
        <div className="admin-shell min-h-screen">
            <header className="border-b t-rule t-bg sticky top-0 z-20">
                <div className="max-w-[1100px] mx-auto px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Brand size="text-xl" />
                        <span className="uppercase-mono t-mute">/ ניהול הלוח</span>
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
            </header>

            <main className="max-w-[1100px] mx-auto px-5 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl">
                            פריטי הלוח
                        </h1>
                        <p className="t-mute text-sm mt-1">
                            {content.deals.length} פריטים · נשמר אוטומטית בדפדפן
                            זה.
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
                    {content.deals.length === 0 && (
                        <div className="t-mute font-mono text-sm py-12 text-center border t-rule">
                            אין פריטים. לחצו "פריט חדש" כדי להתחיל.
                        </div>
                    )}
                </div>

                <div className="mt-10 pt-6 border-t t-rule flex items-center justify-between">
                    <p className="uppercase-mono t-mute max-w-md">
                        שינויים נשמרים בדפדפן הזה בלבד (MVP). מעבר לשרת אמיתי
                        יסונכרן בין כל המבקרים.
                    </p>
                    <button
                        onClick={() => {
                            if (
                                confirm(
                                    "לאפס את כל התוכן לברירת המחדל? פעולה זו תמחק את כל השינויים.",
                                )
                            )
                                resetContent();
                        }}
                        className="uppercase-mono border t-rule px-3 py-2 flex items-center gap-1.5"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        איפוס
                    </button>
                </div>
            </main>
        </div>
    );
}
