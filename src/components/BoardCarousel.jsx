import { useEffect, useRef } from "react";
import DealCard from "./DealCard.jsx";

const SPEED = 0.5; // px per frame (~30px/s)

/**
 * A 2-row horizontal strip of board items that auto-advances back and forth
 * (ping-pong) and pauses on hover/touch/focus. Natively scrollable too, so
 * users can swipe/drag through it. RTL-aware via the computed direction.
 */
export default function BoardCarousel({ items, autoplay = true }) {
    const ref = useRef(null);
    const dir = useRef(1); // +1 toward the end, -1 back toward the start
    const paused = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // -1 in RTL (scrollLeft goes negative toward the end), +1 in LTR.
        const sign =
            getComputedStyle(el).direction === "rtl" ? -1 : 1;

        let raf;
        const tick = () => {
            raf = requestAnimationFrame(tick);
            if (!autoplay || paused.current) return;
            const max = el.scrollWidth - el.clientWidth;
            if (max <= 1) return; // nothing to scroll
            let p = sign * el.scrollLeft + dir.current * SPEED; // normalized 0..max
            if (p >= max) {
                p = max;
                dir.current = -1;
            } else if (p <= 0) {
                p = 0;
                dir.current = 1;
            }
            el.scrollLeft = sign * p;
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [autoplay, items.length]);

    const pause = () => (paused.current = true);
    const resume = () => (paused.current = false);

    return (
        <div
            ref={ref}
            className="board-scroller"
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
            onFocusCapture={pause}
            onBlurCapture={resume}
        >
            <div className="board-track">
                {items.map((d) => (
                    <DealCard key={d.id} deal={d} />
                ))}
            </div>
        </div>
    );
}
