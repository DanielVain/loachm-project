import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { useContent } from "../store/ContentContext.jsx";

const SPEED = 40; // px per second — a slow, readable crawl

/**
 * Promo marquee (dark terminal strip).
 *
 * The full promo strip repeats with a fixed ~30%-of-viewport gap between copies,
 * sliding slowly left-to-right forever. We render just enough copies to overflow
 * the screen and animate by exactly one copy's measured width (content + gap),
 * so the loop point is pixel-identical — seamless, no jump.
 *
 * Performance: only `transform` is animated (compositor thread — no main-thread
 * work / no layout / no repaint), the animation is paused when the strip scrolls
 * off-screen, resize measuring is rAF-debounced, and it honors reduced-motion.
 */
export default function Ticker() {
    const { content } = useContent();
    const items = content.ticker;

    const wrapRef = useRef(null);
    const copyRef = useRef(null);
    const [copies, setCopies] = useState(2);
    const [shift, setShift] = useState(0);
    const [active, setActive] = useState(true);

    // Measure one copy's width (content + gap) → drives copy count + loop shift.
    useLayoutEffect(() => {
        let raf = 0;
        const measure = () => {
            const cw = wrapRef.current?.clientWidth || 0;
            const copyW = copyRef.current?.offsetWidth || 0;
            if (!cw || !copyW) return;
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
    }, [items]);

    // Pause the animation while the strip isn't visible (no compositor work).
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
            style={{ paddingInlineEnd: "30vw" }} // the gap between repeats
            aria-hidden={hidden || undefined}
        >
            {items.map((t, i) => (
                <React.Fragment key={i}>
                    <span>{t}</span>
                    <span className="opacity-30">●</span>
                </React.Fragment>
            ))}
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
