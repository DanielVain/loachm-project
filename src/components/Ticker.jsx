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
 * Two identical copies animated by translateX(-50% → 0) — left-to-right, looping
 * seamlessly (plain-percentage keyframe, so it works in Safari too). The items
 * are repeated enough times that each copy's text block is at least as wide as
 * the screen, so the strip is full of text on the first frame (no empty start),
 * with a ~30%-of-viewport gap between repeats.
 *
 * Performance: only `transform` animates (compositor thread), it pauses when
 * scrolled off-screen, resize is rAF-debounced, and it honors reduced-motion.
 */
export default function Ticker() {
    const { content } = useContent();
    const items = content.ticker;

    const wrapRef = useRef(null);
    const copyRef = useRef(null);
    const [reps, setReps] = useState(1);
    const [dur, setDur] = useState(30);
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
            setDur(Math.max(12, Math.round(copyW / SPEED)));
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
                        animationDuration: `${dur}s`,
                    }}
                >
                    {copy(false, copyRef)}
                    {copy(true, null)}
                </div>
            </div>
        </div>
    );
}
