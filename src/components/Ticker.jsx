import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { useContent } from "../store/ContentContext.jsx";

const SPEED = 40; // px per second — a slow, readable crawl
const GAP_VW = 0.3; // gap between repeats, as a fraction of the viewport width

/**
 * Promo marquee (dark terminal strip).
 *
 * The promo strip repeats with a ~30%-of-viewport gap between copies, sliding
 * slowly left-to-right forever. The items are repeated enough times that each
 * copy's text block is at least as wide as the screen — so the viewport is full
 * of text on the very first frame (no empty "sliding-in-from-the-left" start),
 * and the gap only passes through periodically. The loop shifts by exactly one
 * copy width, so it's seamless.
 *
 * Performance: only `transform` animates (compositor thread — no layout/paint),
 * the animation pauses when the strip scrolls off-screen, resize measuring is
 * rAF-debounced, and it honors prefers-reduced-motion.
 */
export default function Ticker() {
    const { content } = useContent();
    const items = content.ticker;

    const wrapRef = useRef(null);
    const copyRef = useRef(null);
    const [reps, setReps] = useState(1);
    const [copies, setCopies] = useState(2);
    const [shift, setShift] = useState(0);
    const [active, setActive] = useState(true);

    useLayoutEffect(() => {
        let raf = 0;
        const measure = () => {
            const cw = wrapRef.current?.clientWidth || 0;
            const copyW = copyRef.current?.offsetWidth || 0;
            if (!cw || !copyW) return;
            const blockW = Math.max(1, copyW - GAP_VW * cw); // text only, no gap
            const single = blockW / reps; // width of one items set
            const needReps = Math.max(1, Math.ceil(cw / single)); // fill viewport
            if (needReps !== reps) {
                setReps(needReps); // re-measure with the new repeat count
                return;
            }
            setShift(copyW);
            setCopies(Math.max(2, Math.ceil(cw / copyW) + 1));
        };
        measure();
        const onResize = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(measure);
        };
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, [items, reps]);

    // Pause while the strip isn't visible (no compositor work).
    useEffect(() => {
        const el = wrapRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;
        const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const copy = (hidden, ref) => (
        <div
            ref={ref}
            className="flex items-center gap-7 whitespace-nowrap"
            style={{ paddingInlineEnd: `${GAP_VW * 100}vw` }} // the gap
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

    const duration = shift ? Math.max(18, Math.round(shift / SPEED)) : 30;

    return (
        <div
            ref={wrapRef}
            className="overflow-hidden border-b"
            style={{ backgroundColor: "#0a0a0a", borderColor: "#1f1f1f" }}
        >
            <div className="py-2.5 relative">
                <div
                    className={`ticker-track font-mono text-xs font-medium uppercase tracking-wider ${
                        active ? "" : "is-paused"
                    }`}
                    style={{
                        color: "var(--green-bg)",
                        "--ticker-shift": `${shift}px`,
                        "--ticker-duration": `${duration}s`,
                    }}
                >
                    {Array.from({ length: copies }).map((_, i) =>
                        copy(i > 0, i === 0 ? copyRef : null),
                    )}
                </div>
            </div>
        </div>
    );
}
