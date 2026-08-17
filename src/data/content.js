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
