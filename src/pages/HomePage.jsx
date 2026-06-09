import { useEffect, useState } from "react";
import Ticker from "../components/Ticker.jsx";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import NonstopFeature from "../components/NonstopFeature.jsx";
import DealsGrid from "../components/DealsGrid.jsx";
import ExtrasGrid from "../components/ExtrasGrid.jsx";
import VisitContact from "../components/VisitContact.jsx";

/** The public storefront. */
export default function HomePage() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        document.documentElement.dataset.theme = dark ? "dark" : "light";
    }, [dark]);

    return (
        <div className="min-h-screen">
            <Ticker />
            <Header dark={dark} onToggleTheme={() => setDark((d) => !d)} />
            <Hero />
            <NonstopFeature />
            <DealsGrid />
            <ExtrasGrid />
            <VisitContact />
        </div>
    );
}
