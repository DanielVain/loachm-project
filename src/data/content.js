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
    Flame,
    Sparkles,
    Boxes,
    Mic2,
    Cable,
    Plug,
    BatteryCharging,
    Monitor,
    Gamepad2,
    Watch,
    Camera,
    Tv,
    HardDrive,
    Cpu,
    Tablet,
} from "lucide-react";

/* ───────────────────────────────────────────────────────────────
   ICON_MAP — icons are referenced by string name everywhere in the
   content so the data stays JSON-serializable (CMS / localStorage).
   Add more here to offer them in the CMS icon picker.
   ─────────────────────────────────────────────────────────────── */
export const ICON_MAP = {
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
    Flame,
    Sparkles,
    Boxes,
    Mic2,
    Cable,
    Plug,
    BatteryCharging,
    Monitor,
    Gamepad2,
    Watch,
    Camera,
    Tv,
    HardDrive,
    Cpu,
    Tablet,
};

/** Icon names exposed in the CMS picker. */
export const ICON_CHOICES = Object.keys(ICON_MAP);

/** Hebrew display labels for the icon picker (value stays the English key). */
export const ICON_LABELS_HE = {
    Phone: "טלפון",
    MapPin: "מיקום",
    Clock: "שעון",
    Zap: "חשמל",
    Shield: "אחריות / מגן",
    ShoppingBag: "קניות",
    Smartphone: "סמארטפון",
    Keyboard: "מקלדת",
    Mouse: "עכבר",
    Headphones: "אוזניות",
    Bluetooth: "בלוטות'",
    Speaker: "רמקול",
    Flame: "חם / אש",
    Sparkles: "מבצע / נצנוץ",
    Boxes: "אספנות",
    Mic2: "מיקרופון",
    Cable: "כבל",
    Plug: "מטען / תקע",
    BatteryCharging: "סוללה",
    Monitor: "מסך",
    Gamepad2: "בקר משחק",
    Watch: "שעון יד",
    Camera: "מצלמה",
    Tv: "טלוויזיה",
    HardDrive: "כונן",
    Cpu: "מעבד",
    Tablet: "טאבלט",
};
export const iconLabel = (name) => ICON_LABELS_HE[name] || name;

/** Icons as {key,label}, sorted alphabetically by Hebrew label, for the picker. */
export const ICON_OPTIONS = ICON_CHOICES.map((key) => ({
    key,
    label: iconLabel(key),
})).sort((a, b) => a.label.localeCompare(b.label, "he"));

/** Resolve a string icon name to a component, with a safe fallback. */
export const iconFor = (name) => ICON_MAP[name] || ShoppingBag;

/* ───────────────────────────────────────────────────────────────
   DEFAULT_CONTENT — seed data. The CMS loads this the first time,
   then persists edits to localStorage (see store/ContentContext).
   ─────────────────────────────────────────────────────────────── */
export const DEFAULT_CONTENT = {
    brand: {
        lead: "לוח",
        accent: "M",
        taglineHe: "כל עולם הגיימינג, במחירי לוח.",
        established: 2019,
    },
    contact: {
        phone: "058-7748846",
        phoneTel: "+972587748846",
        whatsapp: "051-5454891",
        street: "דוד שכטמן 10",
        addressHe: "מול החוף וילג'",
        city: "חדרה",
        landmark: "משחקי מחשב וקונסולות",
    },
    // Opening hours — one entry per weekday (index 0 = Sunday … 6 = Saturday).
    // Editable in the CMS; drives BOTH the displayed hours list and the live
    // "פתוח / סגור" badge. Use { closed: true } for a day off.
    hours: [
        { open: "09:30", close: "21:30" }, // ראשון
        { open: "09:30", close: "21:30" }, // שני
        { open: "09:30", close: "21:30" }, // שלישי
        { open: "09:30", close: "21:30" }, // רביעי
        { open: "09:30", close: "22:00" }, // חמישי
        { open: "09:00", close: "15:30" }, // שישי
        { open: "20:00", close: "23:00", note: "מוצאי שבת" }, // שבת
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
    weeklyDrop: {
        title: "המבצע השבועי",
        pct: 30,
        note: "על מקלדות, עכברים ואוזניות נבחרים.",
        endsLabel: "מסתיים",
        endsValue: "שישי · 15:30",
    },
    featured: {
        label: "בלעדי בישראל",
        title: "NONSTOP",
        slogan: "מהיר. יציב. עוצמה טהורה.",
        headline: "המשווק המורשה היחיד בארץ.",
        body: "כבלים שלא נפרמים. מטענים שלא שורפים את הסוללה. סוללות ניידות שמגיעות ל-mAh הנקוב. אנחנו מחזיקים את כל קו ה-NONSTOP — ואנחנו היחידים שעושים את זה.",
        items: [
            { type: "כבל", icon: "Cable", name: "USB-C קלוע 2 מ'", price: 59 },
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
    /* ── Layout / customization (managed in the CMS "layout" controls) ── */
    layout: {
        heroPanel: "image", // "image" (picture frame) | "weeklyDrop" (sale box)
        heroImage: "", // legacy single image (kept for back-compat)
        heroImages: [], // gallery of store photos — crossfades if more than one
        heroImageAlt: "תמונות של החנות", // alt text for the hero picture frame
        showNonstop: true, // legacy; superseded by `sections` below
        // Ordered, toggleable body sections (Hero is always pinned on top).
        sections: [
            { id: "nonstop", visible: true },
            { id: "deals", visible: true },
            { id: "extras", visible: true },
            { id: "visit", visible: true },
        ],
    },
    /* Cycling brand-logo strip under the hero title (images uploaded in CMS). */
    brandLogos: [
        { id: "bl1", name: "Apple", image: "" },
        { id: "bl2", name: "Samsung", image: "" },
        { id: "bl3", name: "Xiaomi", image: "" },
        { id: "bl4", name: "JBL", image: "" },
        { id: "bl5", name: "NONSTOP", image: "" },
    ],
    /* Editable colors for the NONSTOP section. */
    nonstopColors: {
        bg: "#0a1426",
        accent: "#5cc6f5",
        title: "#7cc9ff",
    },
    /* Section headings / labels — all editable in the CMS "site content" tab. */
    ui: {
        brandsTitle: "המותגים שאנחנו מוכרים",
        dealsKicker: "// במלאי עכשיו",
        dealsTitle: "הלוח.",
        dealsNote: "המחירים כוללים מע״מ. הכמויות מוגבלות לכל לקוח.",
        extrasKicker: "// גם על המדף",
        extrasTitle: "מעבר לכבלים.",
        visitKicker: "// יש שאלות?",
        visitTitle: "מתקשרים. אוספים.",
        visitSubtitle: "או פשוט קופצים. אנחנו מול החוף וילג', בחדרה.",
        whatsappTitle: "וואטסאפ",
        whatsappDesc: "לבדיקת מלאי, הצעות מחיר וטרייד-אין.",
        footerNote: "© 2026 · כל המחירים בשקלים · כולל מע״מ",
    },
    deals: [
        {
            id: "d1",
            cat: "טלפון",
            icon: "Smartphone",
            name: "iPhone 15 Pro",
            spec: "128GB · טיטניום · אטום",
            was: 4799,
            now: 4299,
            stock: 12,
            hot: false,
            image: "",
        },
        {
            id: "d2",
            cat: "מקלדת",
            icon: "Keyboard",
            name: "Keychron K8 Pro",
            spec: "Hot-swap · RGB · אלחוטי",
            was: 549,
            now: 449,
            stock: 7,
            hot: true,
            image: "",
        },
        {
            id: "d3",
            cat: "עכבר",
            icon: "Mouse",
            name: "Logitech G Pro X",
            spec: "HERO 25K · אלחוטי · 60 גרם",
            was: 599,
            now: 499,
            stock: 11,
            hot: false,
            image: "",
        },
        {
            id: "d4",
            cat: "אוזניות גיימינג",
            icon: "Headphones",
            name: "HyperX Cloud III",
            spec: "DTS 7.1 · USB/חוטי · מיקרופון נשלף",
            was: 449,
            now: 359,
            stock: 8,
            hot: false,
            image: "",
        },
        {
            id: "d5",
            cat: "אוזניות אלחוטיות",
            icon: "Bluetooth",
            name: "AirPods Pro 2",
            spec: "USB-C · ANC · סירי בעברית",
            was: 999,
            now: 799,
            stock: 22,
            hot: false,
            image: "",
        },
        {
            id: "d6",
            cat: "רמקול",
            icon: "Speaker",
            name: "JBL Charge 5",
            spec: "Bluetooth · IP67 · PartyBoost",
            was: 799,
            now: 599,
            stock: 14,
            hot: true,
            image: "",
        },
    ],
    extras: [
        {
            icon: "Sparkles",
            name: "Funko Pops",
            desc: "תמיד 40+ דמויות. מארוול, אנימה, סרטים, NBA.",
            from: 79,
        },
        {
            icon: "Boxes",
            name: "דמויות Minix",
            desc: "אספנות כדורגל, NBA ו-NFL.",
            from: 119,
        },
        {
            icon: "Mic2",
            name: "מערכות קריוקי",
            desc: "בלוטות', שני מיקרופונים, חבילות שירים בעברית.",
            from: 349,
        },
    ],
};

/* TRUST badges — icon by string name. */
export const TRUST = [
    {
        icon: "Cable",
        title: "בלעדיות NONSTOP",
        desc: "המשווק המורשה היחיד בישראל",
    },
    { icon: "Shield", title: "אחריות 15 חודשים", desc: "על ציוד גיימינג" },
    { icon: "Zap", title: "סוחר מורשה", desc: "Apple · Samsung · JBL · Sony" },
    { icon: "Clock", title: "מוצאי שבת", desc: "שבת 20:00 – 23:00" },
];

/* Spec helpers — `spec` is stored as a "·"-joined string but edited and
   rendered as a list of individual items. */
export const SPEC_SEP = " · ";
export const splitSpec = (spec) =>
    String(spec || "")
        .split(/[·•]/)
        .map((s) => s.trim())
        .filter(Boolean);
export const joinSpec = (arr) =>
    (arr || [])
        .map((s) => s.trim())
        .filter(Boolean)
        .join(SPEC_SEP);

/* Formatting helpers. */
export const fmt = (n) => Number(n || 0).toLocaleString("en-US");
export const pct = (was, now) =>
    was > 0 ? Math.round((1 - now / was) * 100) : 0;

/** Stable-ish id generator for new board items. */
export const newId = () =>
    "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ───────────────────────────────────────────────────────────────
   Layout editor — the reorderable body sections of the storefront.
   Hero is always pinned at the top and is not part of this list.
   ─────────────────────────────────────────────────────────────── */
export const HOME_SECTIONS = [
    { id: "nonstop", label: "מקטע NONSTOP", hint: "המדף הבלעדי" },
    { id: "deals", label: "הלוח — מבצעים", hint: "רשת המוצרים" },
    { id: "extras", label: "גם על המדף", hint: "פריטים נוספים" },
    { id: "visit", label: "יצירת קשר וביקור", hint: "טלפון · מפה · שעות" },
];

/**
 * Reconcile a saved `layout.sections` array with the known set: keep the saved
 * order + visibility, append any sections added since (so new features show up),
 * and drop unknown ids. Falls back to the legacy `showNonstop` flag when no
 * sections were ever saved. Returns [{ id, label, hint, visible }].
 */
export function resolveSections(layout = {}) {
    const known = new Map(HOME_SECTIONS.map((s) => [s.id, s]));
    const saved = Array.isArray(layout.sections) ? layout.sections : [];
    const seen = new Set();
    const out = [];
    for (const s of saved) {
        const meta = known.get(s?.id);
        if (!meta || seen.has(s.id)) continue;
        seen.add(s.id);
        out.push({ ...meta, visible: s.visible !== false });
    }
    for (const meta of HOME_SECTIONS) {
        if (seen.has(meta.id)) continue;
        const visible = !(meta.id === "nonstop" && layout.showNonstop === false);
        out.push({ ...meta, visible });
    }
    return out;
}

/** The store photos shown in the hero picture frame (new gallery, or legacy single). */
export function heroImageList(layout = {}) {
    const list = Array.isArray(layout.heroImages) ? layout.heroImages : [];
    const clean = list.filter((s) => typeof s === "string" && s.trim());
    if (clean.length) return clean;
    return layout.heroImage ? [layout.heroImage] : [];
}

/* ───────────────────────────────────────────────────────────────
   Opening-hours logic — shared by the displayed hours list and the
   live "פתוח / סגור" badge. Both derive from content.hours: one
   { open, close, closed?, note? } entry per weekday (Sunday → Saturday),
   so editing the hours in the CMS updates the badge automatically.
   ─────────────────────────────────────────────────────────────── */
export const WEEKDAYS_HE = [
    "ראשון",
    "שני",
    "שלישי",
    "רביעי",
    "חמישי",
    "שישי",
    "שבת",
];

export const HE_DAYS = [
    "יום ראשון",
    "יום שני",
    "יום שלישי",
    "יום רביעי",
    "יום חמישי",
    "יום שישי",
    "שבת",
];

/** "HH:MM" → minutes from midnight, or null if unparseable. */
export const parseHM = (s) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || "").trim());
    if (!m) return null;
    const mins = Number(m[1]) * 60 + Number(m[2]);
    return mins >= 0 && mins < 24 * 60 ? mins : null;
};

const fromMinutes = (mins) =>
    `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(
        mins % 60,
    ).padStart(2, "0")}`;

/** Open ranges [[start,end]] (minutes) for a weekday entry — empty if closed. */
const dayRanges = (h) => {
    if (!h || h.closed) return [];
    const o = parseHM(h.open);
    const c = parseHM(h.close);
    if (o == null || c == null || c <= o) return [];
    return [[o, c]];
};

/** Current weekday + minutes-from-midnight in a given timezone. */
function nowInTZ(tz = "Asia/Jerusalem", date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).formatToParts(date);
    const p = {};
    for (const part of parts) p[part.type] = part.value;
    const dayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
        day: dayIndex[p.weekday] ?? new Date().getDay(),
        minutes: (Number(p.hour) % 24) * 60 + Number(p.minute),
    };
}

/**
 * Collapse the 7-day hours into display rows, merging consecutive days that
 * share identical hours (e.g. "ראשון – רביעי · 09:30 – 21:30").
 */
export function groupedHours(hours) {
    const list = Array.isArray(hours) ? hours : DEFAULT_CONTENT.hours;
    const dayName = (i, single) =>
        i === 6 ? "שבת" : (single ? "יום " : "") + WEEKDAYS_HE[i];
    const key = (h) =>
        h?.closed ? "closed" : `${h?.open}|${h?.close}|${h?.note || ""}`;
    const rows = [];
    let i = 0;
    while (i < 7) {
        let j = i;
        while (j + 1 < 7 && key(list[j + 1]) === key(list[i])) j++;
        const h = list[i] || {};
        rows.push({
            days: i === j ? dayName(i, true) : `${dayName(i)} – ${dayName(j)}`,
            time: h.closed ? "סגור" : `${h.open} – ${h.close}`,
            note: h.note || "",
        });
        i = j + 1;
    }
    return rows;
}

/**
 * Live open/closed status, evaluated in Israel time against `hours`.
 * Returns { open, closesLabel } when open, or
 * { open:false, opensLabel, opensWhen } with the next opening.
 */
export function storeStatus(hours, date = new Date()) {
    const list = Array.isArray(hours) ? hours : DEFAULT_CONTENT.hours;
    const { day, minutes } = nowInTZ("Asia/Jerusalem", date);
    const today = dayRanges(list[day]);

    for (const [start, end] of today) {
        if (minutes >= start && minutes < end) {
            return { open: true, closesLabel: fromMinutes(end) };
        }
    }
    // Later today?
    for (const [start] of today) {
        if (start > minutes) {
            return {
                open: false,
                opensWhen: "היום",
                opensLabel: fromMinutes(start),
            };
        }
    }
    // Scan forward for the next day that has any hours.
    for (let i = 1; i <= 7; i++) {
        const d = (day + i) % 7;
        const ranges = dayRanges(list[d]);
        if (ranges.length) {
            return {
                open: false,
                opensWhen: i === 1 ? "מחר" : HE_DAYS[d],
                opensLabel: fromMinutes(ranges[0][0]),
            };
        }
    }
    return { open: false };
}
