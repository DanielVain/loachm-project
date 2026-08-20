import { useState } from "react";
import { Phone, Sun, Moon, Menu, X } from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import Led from "./Led.jsx";
import Brand from "./Brand.jsx";
import OpenStatus from "./OpenStatus.jsx";

const NAV = [
    { href: "#nonstop", label: "NONSTOP" },
    { href: "#deals", label: "מבצעים" },
    { href: "#extras", label: "בחנות" },
    { href: "#visit", label: "איך מגיעים" },
];

/** Sticky top bar: brand, desktop inline nav, mobile hamburger menu, theme + call. */
export default function Header({ dark, onToggleTheme }) {
    const { content } = useContent();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="site-header sticky top-0 z-40 border-b t-rule t-bg">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8">
                <div className="py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <Led px={8} />
                        <Brand size="text-xl md:text-2xl" />
                        <span className="village-badge hidden sm:inline-block">
                            {content.contact.addressHe}, {content.contact.city}
                        </span>
                        <OpenStatus className="header-open hidden lg:inline-flex" />
                    </div>

                    <nav
                        aria-label="ניווט ראשי"
                        className="hidden md:flex items-center gap-7 uppercase-mono t-mute"
                    >
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

                    <div className="flex items-center gap-2 flex-shrink-0">
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

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="theme-toggle md:hidden w-9 h-9 border t-rule flex items-center justify-center"
                            aria-label="תפריט"
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? (
                                <X className="w-4 h-4" />
                            ) : (
                                <Menu className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile collapsible menu */}
                {menuOpen && (
                    <nav
                        aria-label="ניווט נייד"
                        className="mobile-menu md:hidden border-t t-rule py-3 flex flex-col"
                    >
                        <div className="pb-3">
                            <OpenStatus />
                        </div>
                        {NAV.map((n) => (
                            <a
                                key={n.href}
                                href={n.href}
                                onClick={() => setMenuOpen(false)}
                                className="mobile-menu-link h-green"
                            >
                                {n.label}
                            </a>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
