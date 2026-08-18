import React from "react";
import { useContent } from "../store/ContentContext.jsx";

/** Scrolling marquee of promo strings (dark terminal strip). */
export default function Ticker() {
    const { content } = useContent();

    const row = (ariaHidden) => (
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
        <div
            className="overflow-hidden border-b"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#1f1f1f" }}
        >
            <div className="py-2.5 relative">
                <div
                    className="ticker-track font-mono text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--green-bg)" }}
                >
                    {row(false)}
                    {row(true)}
                </div>
            </div>
        </div>
    );
}
