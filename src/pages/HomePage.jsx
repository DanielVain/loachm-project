import { useEffect, useState } from "react";
import { useContent } from "../store/ContentContext.jsx";
import { resolveSections, heroImageList } from "../data/content.js";
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

    // Keep the skeleton up until the hero photo (the topmost image) has loaded,
    // so it's already there the moment real content replaces the skeleton — no
    // watching it load. Extra gallery photos preload quietly without gating; a
    // timeout makes sure the skeleton never hangs on a slow/broken image.
    const [heroReady, setHeroReady] = useState(false);
    useEffect(() => {
        if (loading) return;
        const urls = heroImageList(content.layout);
        const first = urls[0];
        if (!first) {
            setHeroReady(true);
            return;
        }
        let cancelled = false;
        const ready = () => !cancelled && setHeroReady(true);
        const img = new Image();
        img.fetchPriority = "high";
        img.onload = ready;
        img.onerror = ready;
        img.src = first;
        if (img.complete) ready();
        urls.slice(1).forEach((u) => {
            const pre = new Image();
            pre.src = u;
        });
        const t = setTimeout(ready, 3000);
        return () => {
            cancelled = true;
            clearTimeout(t);
        };
    }, [loading, content.layout]);

    const sections = resolveSections(content.layout);
    const showSkeleton = loading || !heroReady;

    return (
        <div className="min-h-screen">
            <Ticker />
            <Header dark={dark} onToggleTheme={toggleTheme} />
            <main id="main">
                {showSkeleton ? (
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
            </main>
        </div>
    );
}
