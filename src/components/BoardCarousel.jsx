import { useEffect, useRef } from "react";
import DealCard from "./DealCard.jsx";

const SPEED = 0.014; // px per millisecond (~14 px/s) — gentle drift

/**
 * A 2-row horizontal strip of board items that scrolls infinitely in one
 * direction. The strip is rendered twice; once the scroll passes the first
 * copy we jump back by exactly one copy's width, so the loop is seamless.
 * Pauses on hover/touch/focus, and is natively scrollable (swipe/drag).
 * RTL-aware via the computed direction.
 */
export default function BoardCarousel({ items, autoplay = true }) {
    const scrollerRef = useRef(null);
    const copyARef = useRef(null);
    const copyBRef = useRef(null);
    const paused = useRef(false);

    useEffect(() => {
        const el = scrollerRef.current;
        const a = copyARef.current;
        const b = copyBRef.current;
        if (!el || !a || !b) return;

        const sign = getComputedStyle(el).direction === "rtl" ? -1 : 1;
        let raf;
        let last = performance.now();

        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            const dt = now - last;
            last = now;
            if (!autoplay || paused.current) return;

            // Distance between the two identical copies = one loop length.
            const wrap = Math.abs(b.offsetLeft - a.offsetLeft);
            const max = el.scrollWidth - el.clientWidth;
            if (wrap <= 1 || max <= wrap) return; // not enough to loop cleanly

            let p = sign * el.scrollLeft + SPEED * dt; // advance forward
            if (p >= wrap) p -= wrap; // seamless wrap
            el.scrollLeft = sign * p;
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [autoplay, items.length]);

    const pause = () => (paused.current = true);
    const resume = () => {
        paused.current = false;
    };

    return (
        <div
            ref={scrollerRef}
            className="board-scroller"
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
            onFocusCapture={pause}
            onBlurCapture={resume}
        >
            <div className="board-loop">
                <div className="board-grid" ref={copyARef}>
                    {items.map((d) => (
                        <DealCard key={d.id} deal={d} />
                    ))}
                </div>
                <div className="board-grid" ref={copyBRef} aria-hidden="true">
                    {items.map((d) => (
                        <DealCard key={d.id + "-dup"} deal={d} />
                    ))}
                </div>
            </div>
        </div>
    );
}
