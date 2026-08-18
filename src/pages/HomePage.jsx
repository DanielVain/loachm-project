import { useEffect, useState } from "react";
import { useContent } from "../store/ContentContext.jsx";
import Ticker from "../components/Ticker.jsx";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import NonstopFeature from "../components/NonstopFeature.jsx";
import DealsGrid from "../components/DealsGrid.jsx";
import ExtrasGrid from "../components/ExtrasGrid.jsx";
import VisitContact from "../components/VisitContact.jsx";
import PageSkeleton from "../components/PageSkeleton.jsx";

const prefersDark = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;

/** Initial theme: an explicit saved choice wins, otherwise follow the OS. */
const initialDark = () => {
    try {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") return true;
        if (saved === "light") return false;
    } catch {
        /* localStorage unavailable */
    }
    return prefersDark();
};

/** The public storefront. */
export default function HomePage() {
    const { loading } = useContent();
    const [dark, setDark] = useState(initialDark);

    useEffect(() => {
        document.documentElement.dataset.theme = dark ? "dark" : "light";
    }, [dark]);

    // Follow the OS light/dark setting live — unless the user has toggled
    // manually (a saved choice takes precedence).
    useEffect(() => {
        const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
        if (!mq) return;
        const onChange = (e) => {
            try {
                if (localStorage.getItem("theme")) return;
            } catch {
                /* ignore */
            }
            setDark(e.matches);
        };
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

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

    return (
        <div className="min-h-screen">
            <Ticker />
            <Header dark={dark} onToggleTheme={toggleTheme} />
            {loading ? (
                <PageSkeleton />
            ) : (
                <div className="content-fade-in">
                    <Hero />
                    <NonstopFeature />
                    <DealsGrid />
                    <ExtrasGrid />
                    <VisitContact />
                </div>
            )}
        </div>
    );
}
