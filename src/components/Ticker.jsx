import React, { useLayoutEffect, useRef, useState } from "react";
import { useContent } from "../store/ContentContext.jsx";

/**
 * Scrolling marquee of promo strings (dark terminal strip).
 *
 * Two identical rows animated by the plain CSS keyframe in index.css
 * (translateX(-50% → 0), left-to-right). The items are repeated enough times
 * that each row is at least as wide as the viewport, so the -50% loop never
 * runs out of content — it won't disappear at the edge on wide screens. The
 * outer wrapper is `overflow-hidden`, so the wide track never overflows the page.
 */
export default function Ticker() {
    const { content } = useContent();
    const items = content.ticker;

    const wrapRef = useRef(null);
    const rowRef = useRef(null);
    const [reps, setReps] = useState(1);

    useLayoutEffect(() => {
        const measure = () => {
            const cw = wrapRef.current?.clientWidth || 0;
            const rw = rowRef.current?.scrollWidth || 0;
            if (!cw || !rw) return;
            const single = rw / reps; // width of one set of items
            const need = Math.max(1, Math.ceil(cw / single) + 1);
            if (need !== reps) setReps(need);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [items, reps]);

    const row = (ariaHidden, ref) => (
        <div
            ref={ref}
            className="flex items-center gap-7 px-7 whitespace-nowrap"
            aria-hidden={ariaHidden || undefined}
        >
            {Array.from({ length: reps }).map((_, r) =>
                items.map((t, i) => (
                    <React.Fragment key={`${r}-${i}`}>
                        <span>{t}</span>
                        <span className="opacity-30">●</span>
                    </React.Fragment>
                )),
            )}
        </div>
    );

    return (
        <div
            ref={wrapRef}
            className="overflow-hidden border-b"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#1f1f1f" }}
        >
            <div className="py-2.5 relative">
                <div
                    className="ticker-track font-mono text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--green-bg)" }}
                >
                    {row(false, rowRef)}
                    {row(true, null)}
                </div>
            </div>
        </div>
    );
}
