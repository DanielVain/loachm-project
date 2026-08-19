import { useState } from "react";
import {
    Plus,
    X,
    Trash2,
    ImagePlus,
    Loader2,
    Image as ImageIcon,
} from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import { uploadProductImage } from "../store/supabase.js";
import { ICON_OPTIONS, iconFor, WEEKDAYS_HE, newId } from "../data/content.js";

const MAX_IMAGE_BYTES = 5_000_000; // 5 MB

/* ── Small building blocks ─────────────────────────────────────── */

/** Thumbnail + upload/remove control for a single image URL. */
function ImageField({ label, value, onChange, hint }) {
    const [uploading, setUploading] = useState(false);
    const [err, setErr] = useState("");

    async function pick(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_IMAGE_BYTES) {
            setErr("התמונה גדולה מדי (מקסימום 5MB).");
            return;
        }
        setErr("");
        setUploading(true);
        try {
            const url = await uploadProductImage(file);
            onChange(url);
        } catch {
            setErr("העלאת התמונה נכשלה.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="flex flex-col gap-1">
            {label && <span className="uppercase-mono t-mute">{label}</span>}
            <div className="flex items-center gap-3">
                <div className="cms-thumb">
                    {uploading ? (
                        <Loader2 className="w-5 h-5 t-mute animate-spin" />
                    ) : value ? (
                        <img src={value} alt="" />
                    ) : (
                        <ImageIcon className="w-5 h-5 t-mute" strokeWidth={1.5} />
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="cms-upload uppercase-mono">
                        <ImagePlus className="w-3 h-3" strokeWidth={2.5} />
                        {value ? "החלפה" : "העלאה"}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={pick}
                        />
                    </label>
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="uppercase-mono t-mute h-green flex items-center gap-1"
                        >
                            <X className="w-3 h-3" /> הסר תמונה
                        </button>
                    )}
                    {hint && (
                        <span className="text-[0.7rem] t-mute">{hint}</span>
                    )}
                </div>
            </div>
            {err && (
                <span className="text-xs" style={{ color: "#e5484d" }}>
                    {err}
                </span>
            )}
        </div>
    );
}

/** Color picker + hex input pair. */
function ColorField({ label, value, onChange }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="uppercase-mono t-mute">{label}</span>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    className="cms-color"
                    value={value || "#000000"}
                    onChange={(e) => onChange(e.target.value)}
                />
                <input
                    className="cms-input flex-1"
                    dir="ltr"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </label>
    );
}

function Text({ label, value, onChange, placeholder }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="uppercase-mono t-mute">{label}</span>
            <input
                className="cms-input"
                value={value ?? ""}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

function Area({ label, value, onChange }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="uppercase-mono t-mute">{label}</span>
            <textarea
                className="cms-input"
                rows={4}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}

function IconSelect({ label, value, onChange }) {
    const Icon = iconFor(value);
    return (
        <label className="flex flex-col gap-1">
            <span className="uppercase-mono t-mute">{label}</span>
            <div className="flex items-stretch gap-2">
                <select
                    className="cms-input flex-1"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {ICON_OPTIONS.map((it) => (
                        <option key={it.key} value={it.key}>
                            {it.label}
                        </option>
                    ))}
                </select>
                <span className="icon-preview" title={value}>
                    <Icon className="w-6 h-6" strokeWidth={2} />
                </span>
            </div>
        </label>
    );
}

function Card({ title, children }) {
    return (
        <section className="t-card border t-rule p-4 md:p-5 flex flex-col gap-4">
            <h2 className="font-display text-lg md:text-xl">{title}</h2>
            {children}
        </section>
    );
}

/* ── Editor ────────────────────────────────────────────────────── */

export default function SiteEditor() {
    const { content, updateSite } = useContent();
    const { ui, featured, ticker, extras, weeklyDrop, hours, layout, brandLogos, nonstopColors } =
        content;

    const setHour = (i, patch) =>
        updateSite({
            hours: hours.map((h, j) => (j === i ? { ...h, ...patch } : h)),
        });

    const setLayout = (patch) => updateSite({ layout: { ...layout, ...patch } });
    const setNsColor = (key, val) =>
        updateSite({ nonstopColors: { ...nonstopColors, [key]: val } });
    const setLogo = (i, patch) =>
        updateSite({
            brandLogos: brandLogos.map((l, j) =>
                j === i ? { ...l, ...patch } : l,
            ),
        });
    const addLogo = () =>
        updateSite({
            brandLogos: [...brandLogos, { id: newId(), name: "", image: "" }],
        });
    const removeLogo = (i) =>
        updateSite({ brandLogos: brandLogos.filter((_, j) => j !== i) });

    const setUi = (key, val) => updateSite({ ui: { ...ui, [key]: val } });
    const setWeekly = (key, val) =>
        updateSite({ weeklyDrop: { ...weeklyDrop, [key]: val } });
    const setFeatured = (key, val) =>
        updateSite({ featured: { ...featured, [key]: val } });
    const setFeaturedItem = (i, patch) =>
        updateSite({
            featured: {
                ...featured,
                items: featured.items.map((it, j) =>
                    j === i ? { ...it, ...patch } : it,
                ),
            },
        });
    const setExtra = (i, patch) =>
        updateSite({
            extras: extras.map((e, j) => (j === i ? { ...e, ...patch } : e)),
        });

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            {/* ── Ticker ── */}
            <Card title="רצועת חדשות (טיקר)">
                <div className="flex flex-col gap-2">
                    {ticker.map((t, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="spec-bullet">›</span>
                            <input
                                className="cms-input flex-1"
                                value={t}
                                onChange={(e) =>
                                    updateSite({
                                        ticker: ticker.map((x, j) =>
                                            j === i ? e.target.value : x,
                                        ),
                                    })
                                }
                            />
                            <button
                                type="button"
                                aria-label="הסר"
                                className="t-mute h-green"
                                onClick={() =>
                                    updateSite({
                                        ticker: ticker.filter(
                                            (_, j) => j !== i,
                                        ),
                                    })
                                }
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="cms-add-row uppercase-mono"
                        onClick={() =>
                            updateSite({ ticker: [...ticker, "טקסט חדש"] })
                        }
                    >
                        <Plus className="w-3 h-3" strokeWidth={2.5} />
                        הוסף שורה
                    </button>
                </div>
            </Card>

            {/* ── Hero layout ── */}
            <Card title="פריסת ההירו (Layout)">
                <label className="flex flex-col gap-1">
                    <span className="uppercase-mono t-mute">
                        בתיבה שליד הכותרת מוצג
                    </span>
                    <select
                        className="cms-input"
                        value={layout.heroPanel}
                        onChange={(e) =>
                            setLayout({ heroPanel: e.target.value })
                        }
                    >
                        <option value="image">מסגרת תמונה</option>
                        <option value="weeklyDrop">תיבת מבצע שבועי</option>
                    </select>
                </label>
                {layout.heroPanel === "image" && (
                    <ImageField
                        label="תמונת ההירו"
                        value={layout.heroImage}
                        onChange={(url) => setLayout({ heroImage: url })}
                        hint="אם ריק — תוצג תיבת המבצע השבועי"
                    />
                )}

                <div className="uppercase-mono t-mute mt-2">
                    לוגו מותגים (מתחלפים מתחת לכותרת)
                </div>
                <div className="flex flex-col gap-3">
                    {brandLogos.map((l, i) => (
                        <div
                            key={l.id}
                            className="flex items-center gap-3 border-t t-rule-soft pt-3 first:border-t-0 first:pt-0"
                        >
                            <ImageField
                                value={l.image}
                                onChange={(url) => setLogo(i, { image: url })}
                            />
                            <input
                                className="cms-input flex-1"
                                placeholder="שם המותג"
                                value={l.name}
                                onChange={(e) =>
                                    setLogo(i, { name: e.target.value })
                                }
                            />
                            <button
                                type="button"
                                aria-label="הסר לוגו"
                                className="t-mute h-green"
                                onClick={() => removeLogo(i)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="cms-add-row uppercase-mono"
                        onClick={addLogo}
                    >
                        <Plus className="w-3 h-3" strokeWidth={2.5} />
                        הוסף לוגו
                    </button>
                </div>
            </Card>

            {/* ── Weekly sale (hero) ── */}
            <Card title="מבצע שבועי (בהירו)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Text
                        label="כותרת"
                        value={weeklyDrop.title}
                        onChange={(v) => setWeekly("title", v)}
                    />
                    <Text
                        label="אחוז הנחה"
                        value={weeklyDrop.pct}
                        onChange={(v) => setWeekly("pct", Number(v) || 0)}
                    />
                    <Text
                        label="הערה"
                        value={weeklyDrop.note}
                        onChange={(v) => setWeekly("note", v)}
                    />
                    <Text
                        label="תווית סיום"
                        value={weeklyDrop.endsLabel}
                        onChange={(v) => setWeekly("endsLabel", v)}
                    />
                    <Text
                        label="מועד סיום"
                        value={weeklyDrop.endsValue}
                        onChange={(v) => setWeekly("endsValue", v)}
                    />
                </div>
            </Card>

            {/* ── Opening hours ── */}
            <Card title="שעות פתיחה">
                <div className="flex flex-col gap-1">
                    {WEEKDAYS_HE.map((label, i) => {
                        const h = hours[i] || {};
                        return (
                            <div
                                key={i}
                                className="flex flex-wrap items-center gap-2 border-t t-rule-soft py-2 first:border-t-0"
                            >
                                <span
                                    className="font-bold text-sm"
                                    style={{ width: 68 }}
                                >
                                    {i === 6 ? "שבת" : "יום " + label}
                                </span>
                                <input
                                    type="time"
                                    dir="ltr"
                                    className="cms-input"
                                    style={{ width: 118 }}
                                    value={h.open || ""}
                                    disabled={!!h.closed}
                                    onChange={(e) =>
                                        setHour(i, { open: e.target.value })
                                    }
                                />
                                <span className="t-mute">–</span>
                                <input
                                    type="time"
                                    dir="ltr"
                                    className="cms-input"
                                    style={{ width: 118 }}
                                    value={h.close || ""}
                                    disabled={!!h.closed}
                                    onChange={(e) =>
                                        setHour(i, { close: e.target.value })
                                    }
                                />
                                <input
                                    className="cms-input"
                                    style={{ width: 130 }}
                                    placeholder="הערה"
                                    value={h.note || ""}
                                    onChange={(e) =>
                                        setHour(i, { note: e.target.value })
                                    }
                                />
                                <label className="flex items-center gap-1.5 text-sm t-mute cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!h.closed}
                                        onChange={(e) =>
                                            setHour(i, {
                                                closed: e.target.checked,
                                            })
                                        }
                                    />
                                    סגור
                                </label>
                            </div>
                        );
                    })}
                </div>
                <p className="uppercase-mono t-mute">
                    ימים עם שעות זהות מתאחדים אוטומטית בתצוגה · השעות מזינות גם את
                    תגית "פתוח / סגור".
                </p>
            </Card>

            {/* ── NONSTOP design ── */}
            <Card title="עיצוב מקטע NONSTOP">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={layout.showNonstop}
                        onChange={(e) =>
                            setLayout({ showNonstop: e.target.checked })
                        }
                    />
                    <span className="uppercase-mono">הצג את מקטע NONSTOP</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ColorField
                        label="צבע רקע"
                        value={nonstopColors.bg}
                        onChange={(v) => setNsColor("bg", v)}
                    />
                    <ColorField
                        label="צבע הדגשה"
                        value={nonstopColors.accent}
                        onChange={(v) => setNsColor("accent", v)}
                    />
                    <ColorField
                        label="צבע כותרת NONSTOP"
                        value={nonstopColors.title}
                        onChange={(v) => setNsColor("title", v)}
                    />
                </div>
            </Card>

            {/* ── NONSTOP feature (text) ── */}
            <Card title="מקטע NONSTOP — טקסט">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Text
                        label="תווית עליונה"
                        value={featured.label}
                        onChange={(v) => setFeatured("label", v)}
                    />
                    <Text
                        label="כותרת (שם המותג)"
                        value={featured.title}
                        onChange={(v) => setFeatured("title", v)}
                    />
                    <Text
                        label="סלוגן"
                        value={featured.slogan}
                        onChange={(v) => setFeatured("slogan", v)}
                    />
                    <Text
                        label="כותרת משנה"
                        value={featured.headline}
                        onChange={(v) => setFeatured("headline", v)}
                    />
                </div>
                <Area
                    label="תיאור"
                    value={featured.body}
                    onChange={(v) => setFeatured("body", v)}
                />

                <div className="uppercase-mono t-mute mt-2">מוצרים במקטע</div>
                {featured.items.map((it, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t t-rule-soft pt-3"
                    >
                        <Text
                            label="סוג"
                            value={it.type}
                            onChange={(v) => setFeaturedItem(i, { type: v })}
                        />
                        <Text
                            label="שם"
                            value={it.name}
                            onChange={(v) => setFeaturedItem(i, { name: v })}
                        />
                        <Text
                            label="מחיר (₪)"
                            value={it.price}
                            onChange={(v) =>
                                setFeaturedItem(i, { price: Number(v) || 0 })
                            }
                        />
                        <IconSelect
                            label="אייקון"
                            value={it.icon}
                            onChange={(v) => setFeaturedItem(i, { icon: v })}
                        />
                    </div>
                ))}
            </Card>

            {/* ── Extras ── */}
            <Card title="גם בחנות">
                {extras.map((e, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t t-rule-soft pt-3 first:border-t-0 first:pt-0"
                    >
                        <Text
                            label="שם"
                            value={e.name}
                            onChange={(v) => setExtra(i, { name: v })}
                        />
                        <IconSelect
                            label="אייקון"
                            value={e.icon}
                            onChange={(v) => setExtra(i, { icon: v })}
                        />
                        <Text
                            label="תיאור"
                            value={e.desc}
                            onChange={(v) => setExtra(i, { desc: v })}
                        />
                        <Text
                            label="החל מ- (₪)"
                            value={e.from}
                            onChange={(v) =>
                                setExtra(i, { from: Number(v) || 0 })
                            }
                        />
                        <div className="md:col-span-2">
                            <ImageField
                                label="תמונה (אופציונלי)"
                                value={e.image}
                                onChange={(url) => setExtra(i, { image: url })}
                                hint="אם ריק — יוצג אייקון במקום"
                            />
                        </div>
                    </div>
                ))}
            </Card>

            {/* ── Section headings ── */}
            <Card title="כותרות מקטעים">
                <div className="uppercase-mono t-mute">מקטע הלוח</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Text
                        label="תווית"
                        value={ui.dealsKicker}
                        onChange={(v) => setUi("dealsKicker", v)}
                    />
                    <Text
                        label="כותרת"
                        value={ui.dealsTitle}
                        onChange={(v) => setUi("dealsTitle", v)}
                    />
                </div>
                <Text
                    label="הערת מחירים"
                    value={ui.dealsNote}
                    onChange={(v) => setUi("dealsNote", v)}
                />

                <div className="uppercase-mono t-mute mt-2">מקטע גם בחנות</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Text
                        label="תווית"
                        value={ui.extrasKicker}
                        onChange={(v) => setUi("extrasKicker", v)}
                    />
                    <Text
                        label="כותרת"
                        value={ui.extrasTitle}
                        onChange={(v) => setUi("extrasTitle", v)}
                    />
                </div>

                <div className="uppercase-mono t-mute mt-2">מקטע יצירת קשר</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Text
                        label="תווית"
                        value={ui.visitKicker}
                        onChange={(v) => setUi("visitKicker", v)}
                    />
                    <Text
                        label="כותרת"
                        value={ui.visitTitle}
                        onChange={(v) => setUi("visitTitle", v)}
                    />
                </div>
                <Text
                    label="כותרת משנה"
                    value={ui.visitSubtitle}
                    onChange={(v) => setUi("visitSubtitle", v)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Text
                        label="כותרת וואטסאפ"
                        value={ui.whatsappTitle}
                        onChange={(v) => setUi("whatsappTitle", v)}
                    />
                    <Text
                        label="תיאור וואטסאפ"
                        value={ui.whatsappDesc}
                        onChange={(v) => setUi("whatsappDesc", v)}
                    />
                </div>
                <Text
                    label="שורת פוטר"
                    value={ui.footerNote}
                    onChange={(v) => setUi("footerNote", v)}
                />
            </Card>

            <p className="uppercase-mono t-mute">
                השינויים נשמרים בענן ומופיעים מיד באתר · ההירו והטלפונים נשארים
                קבועים.
            </p>
        </div>
    );
}
