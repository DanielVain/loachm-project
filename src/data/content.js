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
    /* Section headings / labels — all editable in the CMS "site content" tab. */
    ui: {
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
   Opening-hours logic — powers the live "פתוח עכשיו / סגור" badge.

   OPEN_HOURS mirrors the human-readable `hours` above as machine
   ranges, keyed by JS weekday (0 = Sunday … 6 = Saturday), each an
   array of [openMinute, closeMinute] windows (minutes from midnight).
   Kept here (static) because opening hours are a fixed feature.
   ─────────────────────────────────────────────────────────────── */
const M = (h, m = 0) => h * 60 + m;
export const OPEN_HOURS = {
    0: [[M(9, 30), M(21, 30)]], // ראשון
    1: [[M(9, 30), M(21, 30)]], // שני
    2: [[M(9, 30), M(21, 30)]], // שלישי
    3: [[M(9, 30), M(21, 30)]], // רביעי
    4: [[M(9, 30), M(22, 0)]], // חמישי
    5: [[M(9, 0), M(15, 30)]], // שישי
    6: [[M(20, 0), M(23, 0)]], // מוצאי שבת
};

export const HE_DAYS = [
    "יום ראשון",
    "יום שני",
    "יום שלישי",
    "יום רביעי",
    "יום חמישי",
    "יום שישי",
    "שבת",
];

const fromMinutes = (mins) =>
    `${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(
        mins % 60,
    ).padStart(2, "0")}`;

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
 * Live open/closed status for the store, evaluated in Israel time.
 * Returns { open, closesLabel } when open, or
 * { open:false, opensLabel, opensWhen } with the next opening.
 */
export function storeStatus(date = new Date()) {
    const { day, minutes } = nowInTZ("Asia/Jerusalem", date);
    const today = OPEN_HOURS[day] || [];

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
        const ranges = OPEN_HOURS[d];
        if (ranges && ranges.length) {
            return {
                open: false,
                opensWhen: i === 1 ? "מחר" : HE_DAYS[d],
                opensLabel: fromMinutes(ranges[0][0]),
            };
        }
    }
    return { open: false };
}
