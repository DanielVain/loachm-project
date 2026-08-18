import React, { useLayoutEffect, useRef, useState } from "react";
import { useContent } from "../store/ContentContext.jsx";

/**
 * Scrolling marquee of promo strings (dark terminal strip).
 *
 * The track is two identical halves animated by translateX(-50%), which loops
 * seamlessly only when each half is at least as wide as the viewport — so we
 * repeat the items enough times (measured against the container) to guarantee
 * no gap on any screen, and the marquee runs infinitely without flashing back.
 *
 * The track lays out LTR for predictable tiling, so the source list is reversed
 * to keep the Hebrew reading order correct as it scrolls right-to-left. Each
 * half carries only a trailing gap (pe-7) so the seam spacing matches the gap
 * between items and translateX(-50%) lands exactly on the loop point.
 */
export default function Ticker() {
    const { content } = useContent();
    // Reverse so items read in natural order under the LTR track (see above).
    const items = [...content.ticker].reverse();

    const wrapRef = useRef(null);
    const halfRef = useRef(null);
    const [reps, setReps] = useState(1);

    useLayoutEffect(() => {
        const measure = () => {
            const cw = wrapRef.current?.clientWidth || 0;
            const half = halfRef.current;
            if (!cw || !half) return;
            const single = half.scrollWidth / reps; // width of one item set
            if (single > 0) {
                const need = Math.max(1, Math.ceil(cw / single) + 1);
                if (need !== reps) setReps(need);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [content.ticker, reps]);

    const half = (hidden, ref) => (
        <div
            ref={ref}
            className="flex items-center gap-7 pe-7 whitespace-nowrap"
            aria-hidden={hidden || undefined}
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
                    {half(false, halfRef)}
                    {half(true, null)}
                </div>
            </div>
        </div>
    );
}
