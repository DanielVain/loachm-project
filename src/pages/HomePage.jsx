import { useEffect, useState } from "react";
import { useContent } from "../store/ContentContext.jsx";
import { resolveSections } from "../data/content.js";
import Ticker from "../components/Ticker.jsx";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import NonstopFeature from "../components/NonstopFeature.jsx";
import DealsGrid from "../components/DealsGrid.jsx";
import ExtrasGrid from "../components/ExtrasGrid.jsx";
import VisitContact from "../components/VisitContact.jsx";
import PageSkeleton from "../components/PageSkeleton.jsx";

/** Body sections the layout editor can reorder / hide. */
const SECTION_COMPONENTS = {
    nonstop: NonstopFeature,
    deals: DealsGrid,
    extras: ExtrasGrid,
    visit: VisitContact,
};

/**
 * Initial theme: dark by default. Only an explicit choice of "light" opts out —
 * the OS setting is not followed, so visitors always land on the dark look.
 */
const initialDark = () => {
    try {
        if (localStorage.getItem("theme") === "light") return false;
    } catch {
        /* localStorage unavailable */
    }
    return true;
};

/** The public storefront. */
export default function HomePage() {
    const { content, loading } = useContent();
    const [dark, setDark] = useState(initialDark);

    useEffect(() => {
        document.documentElement.dataset.theme = dark ? "dark" : "light";
    }, [dark]);

    const toggleTheme = () => {
        setDark((d) => {
            const next = !d;
            try {
                localStorage.setItem("theme", next ? "dark" : "light");
            } catch {
                /* ignore */
            }
            return next;
        });
    };

    const sections = resolveSections(content.layout);

    return (
        <div className="min-h-screen">
            <Ticker />
            <Header dark={dark} onToggleTheme={toggleTheme} />
            {loading ? (
                <PageSkeleton />
            ) : (
                <div className="content-fade-in">
                    <Hero />
                    {sections
                        .filter((s) => s.visible)
                        .map((s) => {
                            const C = SECTION_COMPONENTS[s.id];
                            return C ? <C key={s.id} /> : null;
                        })}
                </div>
            )}
        </div>
    );
}
