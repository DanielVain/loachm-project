import { Phone, Sun, Moon } from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import Led from "./Led.jsx";
import Brand from "./Brand.jsx";

const NAV = [
    { href: "#nonstop", label: "NONSTOP" },
    { href: "#deals", label: "מבצעים" },
    { href: "#extras", label: "בחנות" },
    { href: "#visit", label: "איך מגיעים" },
];

/** Top bar: brand, anchor nav, theme toggle and a one-tap call button. */
export default function Header({ dark, onToggleTheme }) {
    const { content } = useContent();

    return (
        <header className="border-b t-rule t-bg">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Led px={8} />
                    <Brand size="text-xl md:text-2xl" />
                </div>

                <nav className="hidden md:flex items-center gap-7 uppercase-mono t-mute">
                    {NAV.map((n) => (
                        <a
                            key={n.href}
                            href={n.href}
                            className="h-green transition-colors"
                        >
                            {n.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleTheme}
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
    );
}
