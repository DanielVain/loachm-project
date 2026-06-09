import React, { useState, useEffect } from "react";
import {
    Phone,
    MapPin,
    Clock,
    Zap,
    Shield,
    ShoppingBag,
    Smartphone,
    Keyboard,
    Mouse,
    Headphones,
    Bluetooth,
    Speaker,
    ArrowUpLeft,
    Flame,
    Sun,
    Moon,
    Sparkles,
    Boxes,
    Mic2,
    Cable,
    Plug,
    BatteryCharging,
} from "lucide-react";

/* ───────────────────────────────────────────────────────────────
   תוכן — ניתן לעריכה דרך CMS
   בעל החנות עורך זאת דרך Sanity Studio (ראו CMS-SETUP.md).
   בפרודקשן, החליפו את האובייקט הזה ב: useSanityContent()
   ─────────────────────────────────────────────────────────────── */
const content = {
    brand: {
        lead: "לוח",
        accent: "M",
        taglineHe: "כל עולם הגיימינג, במחירי לוח.",
        established: 2019,
    },
    contact: {
        phone: "058-7748846",
        phoneTel: "+972587748846",
        whatsapp: "058-7748846",
        street: "דוד שכטמן 10",
        addressHe: "מול החוף וילג'",
        city: "חדרה",
        landmark: "משחקי מחשב וקונסולות",
    },
    hours: [
        { days: "ראשון – רביעי", time: "09:30 – 21:30" },
        { days: "יום חמישי", time: "09:30 – 22:00" },
        { days: "יום שישי", time: "09:00 – 15:30" },
        { days: "שבת", time: "20:00 – 23:00", note: "מוצאי שבת" },
    ],
    ticker: [
        "מבצעים עכשיו",
        "iPhone 15 Pro — 500 ₪ הנחה",
        "NONSTOP GaN 65W החל מ-149 ₪",
        "Keychron K8 Pro 449 ₪",
        "AirPods Pro 2 799 ₪",
        "JBL Charge 5 599 ₪",
        "פתוח במוצאי שבת 20:00–23:00",
        "תיקון ושדרוג מחשבים וקונסולות",
        "גל פאנקו מארוול חדש הגיע",
    ],
    weeklyDrop: { pct: 30, note: "על מקלדות, עכברים ואוזניות נבחרים." },
    featured: {
        label: "בלעדי בישראל",
        title: "NONSTOP",
        slogan: "מהיר. יציב. עוצמה טהורה.",
        headline: "המשווק המורשה היחיד בארץ.",
        body: "כבלים שלא נפרמים. מטענים שלא שורפים את הסוללה. סוללות ניידות שמגיעות ל-mAh הנקוב. אנחנו מחזיקים את כל קו ה-NONSTOP — ואנחנו היחידים שעושים את זה.",
        items: [
            {
                type: "כבל",
                icon: "Cable",
                name: "USB-C קלוע 2 מ'",
                price: 59,
            },
            { type: "מטען", icon: "Plug", name: "GaN 65W", price: 149 },
            {
                type: "סוללה ניידת",
                icon: "BatteryCharging",
                name: "PowerBank 20K",
                price: 199,
            },
            { type: "לרכב", icon: "Zap", name: "מטען לרכב 45W", price: 89 },
        ],
    },
    deals: [
        {
            cat: "טלפון",
            icon: Smartphone,
            name: "iPhone 15 Pro",
            spec: "128GB · טיטניום · אטום",
            was: 4799,
            now: 4299,
            stock: 12,
            hot: false,
        },
        {
            cat: "מקלדת",
            icon: Keyboard,
            name: "Keychron K8 Pro",
            spec: "Hot-swap · RGB · אלחוטי",
            was: 549,
            now: 449,
            stock: 7,
            hot: true,
        },
        {
            cat: "עכבר",
            icon: Mouse,
            name: "Logitech G Pro X",
            spec: "HERO 25K · אלחוטי · 60 גרם",
            was: 599,
            now: 499,
            stock: 11,
            hot: false,
        },
        {
            cat: "אוזניות גיימינג",
            icon: Headphones,
            name: "HyperX Cloud III",
            spec: "DTS 7.1 · USB/חוטי · מיקרופון נשלף",
            was: 449,
            now: 359,
            stock: 8,
            hot: false,
        },
        {
            cat: "אוזניות אלחוטיות",
            icon: Bluetooth,
            name: "AirPods Pro 2",
            spec: "USB-C · ANC · סירי בעברית",
            was: 999,
            now: 799,
            stock: 22,
            hot: false,
        },
        {
            cat: "רמקול",
            icon: Speaker,
            name: "JBL Charge 5",
            spec: "Bluetooth · IP67 · PartyBoost",
            was: 799,
            now: 599,
            stock: 14,
            hot: true,
        },
    ],
    extras: [
        {
            icon: Sparkles,
            name: "Funko Pops",
            desc: "תמיד 40+ דמויות. מארוול, אנימה, סרטים, NBA.",
            from: 79,
        },
        {
            icon: Boxes,
            name: "דמויות Minix",
            desc: "אספנות כדורגל, NBA ו-NFL.",
            from: 119,
        },
        {
            icon: Mic2,
            name: "מערכות קריוקי",
            desc: "בלוטות', שני מיקרופונים, חבילות שירים בעברית.",
            from: 349,
        },
    ],
};

const ICONS = { Cable, Plug, BatteryCharging, Zap };

const TRUST = [
    {
        icon: Cable,
        title: "בלעדיות NONSTOP",
        desc: "המשווק המורשה היחיד בישראל",
    },
    {
        icon: Shield,
        title: "אחריות 15 חודשים",
        desc: "על ציוד גיימינג",
    },
    {
        icon: Zap,
        title: "סוחר מורשה",
        desc: "Apple · Samsung · JBL · Sony",
    },
    {
        icon: Clock,
        title: "מוצאי שבת",
        desc: "שבת 20:00 – 23:00",
    },
];

const fmt = (n) => n.toLocaleString("en-US");
const pct = (was, now) => Math.round((1 - now / was) * 100);

export default function MloachLanding() {
    const [dark, setDark] = useState(false);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme = dark ? "dark" : "light";
    }, [dark]);

    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    const Brand = ({ size = "text-xl" }) => (
        <span
            className={`font-brand ${size} t-text`}
            style={{ letterSpacing: "-0.04em" }}
        >
            {content.brand.lead}
            <span className="t-green">{content.brand.accent}</span>
        </span>
    );

    const Led = ({ px = 6 }) => (
        <span className="led" style={{ width: px, height: px }} />
    );

    const tickerRow = (ariaHidden) => (
        <div
            className="flex items-center gap-7 px-7 whitespace-nowrap"
            aria-hidden={ariaHidden || undefined}
        >
            {content.ticker.map((t, i) => (
                <React.Fragment key={i}>
                    <span>{t}</span>
                    <span className="opacity-30">●</span>
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen">
            {/* ═════════════ טיקר (טרמינל מסחר כהה) ═════════════ */}
            <div
                className="overflow-hidden border-b"
                style={{ backgroundColor: "#0a0a0a", borderColor: "#1f1f1f" }}
            >
                <div className="py-2.5 relative">
                    <div
                        className="ticker-track font-mono text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--green-bg)" }}
                    >
                        {tickerRow(false)}
                        {tickerRow(true)}
                    </div>
                </div>
            </div>

            {/* ═════════════ כותרת עליונה ═════════════ */}
            <header className="border-b t-rule t-bg">
                <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Led px={8} />
                        <Brand size="text-xl md:text-2xl" />
                    </div>

                    <nav className="hidden md:flex items-center gap-7 uppercase-mono t-mute">
                        <a
                            href="#nonstop"
                            className="h-green transition-colors"
                        >
                            NONSTOP
                        </a>
                        <a href="#deals" className="h-green transition-colors">
                            מבצעים
                        </a>
                        <a href="#extras" className="h-green transition-colors">
                            בחנות
                        </a>
                        <a href="#visit" className="h-green transition-colors">
                            איך מגיעים
                        </a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setDark((d) => !d)}
                            className="theme-toggle w-9 h-9 border t-rule flex items-center justify-center"
                            aria-label="החלפת מצב תצוגה"
                        >
                            {dark ? (
                                <Sun className="w-3.5 h-3.5" />
                            ) : (
                                <Moon className="w-3.5 h-3.5" />
                            )}
                        </button>
                        <a
                            href={`tel:${content.contact.phoneTel}`}
                            className="t-green-bg px-4 md:px-5 py-2.5 font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                            style={{ color: "#0a0a0a" }}
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                                {content.contact.phone}
                            </span>
                            <span className="sm:hidden">חיוג</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* ═════════════ HERO ═════════════ */}
            <section className="scanlines border-b t-rule">
                <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                    <div className="flex items-center justify-between uppercase-mono t-mute mb-10">
                        <div className="flex items-center gap-2">
                            <Led px={6} />
                            <span className="t-green">המערכת מקוונת</span>
                            <span className="hidden sm:inline">
                                ·{" "}
                                <span dir="ltr">
                                    {hh}:{mm}:{ss}
                                </span>
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-5">
                            <span>מלאי · 312 יחידות</span>
                            <span>·</span>
                            <span>שבוע מבצעים 19</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
                        <div className="col-span-12 md:col-span-8">
                            <div className="font-heb text-base md:text-lg t-mute mb-4">
                                {content.brand.taglineHe}
                            </div>

                            <h1 className="font-brand text-[18vw] md:text-[10rem] lg:text-[12rem] leading-[0.85]">
                                {content.brand.lead}
                                <span className="t-green">
                                    {content.brand.accent}
                                </span>
                            </h1>

                            <p className="mt-6 md:mt-8 text-lg md:text-2xl max-w-2xl leading-snug">
                                משחקי מחשב וקונסולות, ציוד גיימינג, ומדף ה-
                                <span className="t-green font-bold">
                                    NONSTOP
                                </span>{" "}
                                היחיד בישראל. במלאי. יוצא מהדלת עוד היום.
                            </p>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <div
                                className="border-2 t-card p-5 md:p-6"
                                style={{ borderColor: "var(--green-bg)" }}
                            >
                                <div className="uppercase-mono t-green mb-3 flex items-center gap-2">
                                    <Flame
                                        className="w-3 h-3"
                                        strokeWidth={2.5}
                                    />
                                    המבצע השבועי
                                </div>
                                <div className="font-display text-5xl md:text-6xl mb-1 leading-none big-drop">
                                    −{content.weeklyDrop.pct}%
                                </div>
                                <div className="text-sm t-mute mb-4 mt-2">
                                    {content.weeklyDrop.note}
                                </div>
                                <div className="border-t t-rule pt-3 flex items-center justify-between uppercase-mono">
                                    <span className="t-mute">מסתיים</span>
                                    <span>שישי · 15:30</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* רצועת אמון */}
                    <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-px t-bg-2 border t-rule">
                        {TRUST.map((t) => {
                            const Icon = t.icon;
                            return (
                                <div
                                    key={t.title}
                                    className="t-bg p-4 md:p-5 flex items-start gap-3"
                                >
                                    <Icon
                                        className="w-[18px] h-[18px] t-green flex-shrink-0 mt-0.5"
                                        strokeWidth={1.6}
                                    />
                                    <div>
                                        <div className="font-bold text-sm md:text-base">
                                            {t.title}
                                        </div>
                                        <div className="text-xs t-mute mt-0.5">
                                            {t.desc}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═════════════ NONSTOP בלעדי (שחור) ═════════════ */}
            <section
                id="nonstop"
                style={{ backgroundColor: "#0a0a0a", color: "#f5f5f0" }}
            >
                <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                    <div
                        className="font-mono uppercase tracking-[0.14em] text-[10px] mb-8 flex items-center gap-3"
                        style={{ color: "var(--green-bg)" }}
                    >
                        <span
                            className="w-8 h-px"
                            style={{ backgroundColor: "var(--green-bg)" }}
                        />
                        <span>{content.featured.label}</span>
                    </div>

                    <div className="grid grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-14">
                        <div className="col-span-12 md:col-span-7">
                            <div className="flex items-baseline gap-4 md:gap-6 flex-wrap">
                                <span
                                    className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9]"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    {content.brand.lead}
                                    <span style={{ color: "var(--green-bg)" }}>
                                        {content.brand.accent}
                                    </span>
                                </span>
                                <span className="font-mono text-3xl md:text-5xl opacity-40">
                                    ×
                                </span>
                                <span
                                    className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9]"
                                    style={{ letterSpacing: "-0.02em" }}
                                >
                                    {content.featured.title}
                                </span>
                            </div>
                            <p
                                className="font-mono uppercase tracking-[0.22em] text-sm md:text-base mt-5 font-bold"
                                style={{ color: "var(--green-bg)" }}
                            >
                                {content.featured.slogan}
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <p
                                className="font-display text-xl md:text-2xl mb-3"
                                style={{ letterSpacing: "-0.01em" }}
                            >
                                {content.featured.headline}
                            </p>
                            <p
                                className="text-base leading-relaxed"
                                style={{ color: "#bbb" }}
                            >
                                {content.featured.body}
                            </p>
                        </div>
                    </div>

                    {/* רצועת מוצרי NONSTOP */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {content.featured.items.map((item) => {
                            const Icon = ICONS[item.icon];
                            return (
                                <div
                                    key={item.name}
                                    className="nonstop-tile border-2 p-4 md:p-5 cursor-pointer"
                                    style={{ borderColor: "#2a2a2a" }}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <span className="font-mono uppercase text-[10px] tracking-wider">
                                            {item.type}
                                        </span>
                                        {Icon && (
                                            <Icon
                                                className="w-5 h-5"
                                                strokeWidth={1.6}
                                            />
                                        )}
                                    </div>
                                    <div className="font-display text-base md:text-lg leading-tight mb-3">
                                        {item.name}
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-mono text-[10px] uppercase opacity-70">
                                            החל מ-
                                        </span>
                                        <span className="font-display text-xl md:text-2xl">
                                            {item.price} ₪
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═════════════ רשת מבצעים ═════════════ */}
            <section id="deals" className="border-t border-b t-rule">
                <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                    <div className="flex items-end justify-between mb-8 md:mb-10">
                        <div>
                            <div className="uppercase-mono t-green mb-2">
                                // במלאי עכשיו
                            </div>
                            <h2 className="font-display text-3xl md:text-5xl">
                                הלוח.
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {content.deals.map((d) => {
                            const Icon = d.icon;
                            return (
                                <div
                                    key={d.name}
                                    className="deal-card t-card border t-rule p-5 md:p-6 flex flex-col relative"
                                >
                                    {d.hot && (
                                        <div
                                            className="absolute top-0 left-0 t-green-bg px-2 py-1 font-mono text-[10px] font-bold tracking-wider flex items-center gap-1"
                                            style={{ color: "#0a0a0a" }}
                                        >
                                            <Flame
                                                className="w-2.5 h-2.5"
                                                strokeWidth={2.5}
                                            />
                                            חם
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="uppercase-mono t-mute">
                                            {d.cat}
                                        </div>
                                        <Icon
                                            className="deal-icon t-mute w-7 h-7"
                                            strokeWidth={1.3}
                                        />
                                    </div>
                                    <div className="font-display text-2xl md:text-3xl mb-2 leading-tight">
                                        {d.name}
                                    </div>
                                    <div className="font-mono text-xs t-mute mb-6">
                                        {d.spec}
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="font-mono text-sm t-mute line-through">
                                                {fmt(d.was)} ₪
                                            </span>
                                            <span
                                                className="t-green-bg px-1.5 py-0.5 font-mono text-[10px] font-bold"
                                                style={{ color: "#0a0a0a" }}
                                            >
                                                −{pct(d.was, d.now)}%
                                            </span>
                                        </div>
                                        <div className="font-display text-3xl md:text-4xl t-green leading-none mb-4">
                                            {fmt(d.now)} ₪
                                        </div>
                                        <div className="flex items-center justify-between border-t t-rule-soft pt-3">
                                            <span className="uppercase-mono t-mute flex items-center gap-2">
                                                <Led px={6} />
                                                {d.stock} במלאי
                                            </span>
                                            <button className="deal-cta uppercase-mono border t-rule px-3 py-1.5 flex items-center gap-1.5 transition-all">
                                                שריון
                                                <ArrowUpLeft
                                                    className="w-3 h-3"
                                                    strokeWidth={2.5}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 uppercase-mono t-mute text-center">
                        המחירים כוללים מע״מ. הכמויות מוגבלות לכל לקוח.
                    </div>
                </div>
            </section>

            {/* ═════════════ גם בחנות ═════════════ */}
            <section id="extras" className="t-bg-2 border-b t-rule">
                <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <div className="uppercase-mono t-green mb-2">
                                // גם על המדף
                            </div>
                            <h2 className="font-display text-2xl md:text-4xl">
                                מעבר לכבלים.
                            </h2>
                        </div>
                        <ShoppingBag
                            className="t-mute w-5 h-5 hidden md:block"
                            strokeWidth={1.5}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        {content.extras.map((e) => {
                            const Icon = e.icon;
                            return (
                                <div
                                    key={e.name}
                                    className="t-card border t-rule p-5 flex items-start gap-4 deal-card"
                                >
                                    <div className="t-green-bg p-3 flex-shrink-0">
                                        <Icon
                                            className="w-[22px] h-[22px]"
                                            strokeWidth={1.6}
                                            style={{ color: "#0a0a0a" }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-display text-lg md:text-xl mb-1">
                                            {e.name}
                                        </div>
                                        <div className="text-xs t-mute mb-2 leading-relaxed">
                                            {e.desc}
                                        </div>
                                        <div className="uppercase-mono t-green">
                                            החל מ-{e.from} ₪
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═════════════ פוטר / יצירת קשר ═════════════ */}
            <section id="visit" className="t-bg">
                <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                    <div className="text-center mb-10 md:mb-14">
                        <div className="uppercase-mono t-green mb-3">
                            // יש שאלות?
                        </div>
                        <h2 className="font-display text-4xl md:text-6xl mb-2">
                            מתקשרים. אוספים.
                        </h2>
                        <p className="text-base md:text-lg t-mute">
                            או פשוט קופצים. אנחנו מול החוף וילג', בחדרה.
                        </p>
                    </div>

                    <a
                        href={`tel:${content.contact.phoneTel}`}
                        className="block group border-2 transition-all p-6 md:p-10 text-center t-card hover:bg-[var(--green-bg)] hover:text-[#0a0a0a]"
                        style={{ borderColor: "var(--green-bg)" }}
                    >
                        <div className="uppercase-mono t-green group-hover:text-[#0a0a0a] mb-3 transition-colors flex items-center justify-center gap-2">
                            <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                            קו ישיר
                        </div>
                        <div
                            dir="ltr"
                            className="font-display text-5xl md:text-8xl lg:text-9xl t-green group-hover:text-[#0a0a0a] leading-none transition-colors"
                        >
                            {content.contact.phone}
                        </div>
                        <div className="uppercase-mono t-mute group-hover:text-[#0a0a0a] mt-4 transition-colors opacity-70">
                            הקישו לחיוג
                        </div>
                    </a>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 border-t t-rule pt-10">
                        {/* החנות */}
                        <div>
                            <div className="uppercase-mono t-green mb-3 flex items-center gap-2">
                                <MapPin className="w-3 h-3" strokeWidth={2.5} />
                                החנות
                            </div>
                            <div className="font-bold mb-1 font-heb">
                                {content.contact.street}, {content.contact.city}
                            </div>
                            <div className="t-mute text-sm">
                                {content.contact.addressHe}
                            </div>
                            <div className="t-mute text-sm">
                                {content.contact.landmark}
                            </div>
                        </div>

                        {/* שעות פתיחה */}
                        <div>
                            <div className="uppercase-mono t-green mb-3 flex items-center gap-2">
                                <Clock className="w-3 h-3" strokeWidth={2.5} />
                                שעות פתיחה
                            </div>
                            <div className="hours-list">
                                {content.hours.map((h) => (
                                    <div key={h.days} className="hours-row">
                                        <span className="days">{h.days}</span>
                                        <span className="time">
                                            {h.time}
                                            {h.note && (
                                                <span className="note">
                                                    {h.note}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* וואטסאפ */}
                        <div>
                            <div className="uppercase-mono t-green mb-3 flex items-center gap-2">
                                <Zap className="w-3 h-3" strokeWidth={2.5} />
                                וואטסאפ
                            </div>
                            <div className="t-mute mb-2 text-sm">
                                לבדיקת מלאי, הצעות מחיר וטרייד-אין.
                            </div>
                            <div
                                className="font-mono text-sm font-bold"
                                dir="ltr"
                            >
                                {content.contact.whatsapp}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t t-rule flex flex-wrap items-center justify-between gap-3 uppercase-mono t-mute">
                        <div className="flex items-center gap-3">
                            <Led px={6} />
                            <Brand size="text-base" />
                            <span>· משנת {content.brand.established}</span>
                        </div>
                        <div>© 2026 · כל המחירים בשקלים · כולל מע״מ</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
