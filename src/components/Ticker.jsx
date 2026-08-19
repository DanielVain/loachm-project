import React from "react";
import { useContent } from "../store/ContentContext.jsx";

/**
 * Static promo strip (dark terminal bar).
 *
 * The promo strings are laid out once, centered, and wrap onto more lines on
 * narrow screens instead of scrolling — no marquee animation, and nothing ever
 * overflows the bar.
 */
export default function Ticker() {
    const { content } = useContent();
    const items = content.ticker;

    return (
        <div
            className="border-b"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#1f1f1f" }}
        >
            <div
                className="max-w-[1280px] mx-auto px-5 md:px-8 py-2.5 flex flex-wrap items-center justify-center gap-x-7 gap-y-1 font-mono text-xs font-medium uppercase tracking-wider text-center"
                style={{ color: "var(--green-bg)" }}
            >
                {items.map((t, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <span className="opacity-30">●</span>}
                        <span>{t}</span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
