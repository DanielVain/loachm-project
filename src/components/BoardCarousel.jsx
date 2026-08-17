import { useEffect, useRef, useState } from "react";
import DealCard from "./DealCard.jsx";

const SPEED = 0.045; // px per millisecond (~45 px/s)

/**
 * A 2-row horizontal strip of board items that auto-scrolls infinitely AND can
 * be grabbed and dragged (or swiped / scrolled) by the user.
 *
 * Position is tracked as a float we own (`pos`) so sub-pixel auto-advance isn't
 * lost to scrollLeft's integer rounding. Enough identical copies are rendered to
 * cover the viewport; whenever the position drifts past one copy's width it
 * wraps by exactly one copy, which is invisible (copies are identical) — so it
 * loops forever in either direction. Auto-advance pauses on hover/drag.
 */
export default function BoardCarousel({ items, autoplay = true }) {
    const scrollerRef = useRef(null);
    const copyRef = useRef(null);
    const paused = useRef(false);
    const [copies, setCopies] = useState(3);
    const [grabbing, setGrabbing] = useState(false);

    // Drag bookkeeping.
    const dragging = useRef(false); // true once movement passes the threshold
    const pending = useRef(false); // mouse is down, not yet a drag
    const didDrag = useRef(false); // a real drag happened → swallow the click
    const dragStartX = useRef(0);
    const dragStartScroll = useRef(0);
    const pointerId = useRef(null);
    const DRAG_THRESHOLD = 5; // px before a press becomes a drag (vs. a click)

    const copyWidth = () => {
        const copy = copyRef.current;
        if (!copy) return 0;
        const cs = getComputedStyle(copy);
        const gap = parseFloat(cs.marginInlineEnd || cs.marginRight || "0") || 0;
        return copy.offsetWidth + gap;
    };

    // Render enough copies to cover the viewport plus slack for seamless wrap.
    useEffect(() => {
        const el = scrollerRef.current;
        const cw = copyWidth();
        if (!el || cw <= 0) return;
        const needed = Math.max(3, Math.ceil(el.clientWidth / cw) + 3);
        if (needed !== copies) setCopies(needed);
    }, [items.length, copies]);

    // Auto-advance + infinite wrap. `pos` is the float source of truth.
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;
        const sign = getComputedStyle(el).direction === "rtl" ? -1 : 1;
        const cw = copyWidth();
        const max = el.scrollWidth - el.clientWidth;
        const canLoop = cw > 1 && max > 2 * cw;
        const lower = cw;
        const upper = max - cw;

        let pos = canLoop ? cw : sign * el.scrollLeft;
        let lastSet = Math.round(pos);
        el.scrollLeft = sign * lastSet;

        let raf;
        let last = performance.now();
        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            const dt = now - last;
            last = now;
            if (dragging.current) return; // user is in control

            // Adopt any manual scroll (wheel / swipe / scrollbar).
            const current = sign * el.scrollLeft;
            if (Math.abs(current - lastSet) > 1) pos = current;

            if (autoplay && !paused.current) pos += SPEED * dt;

            if (canLoop) {
                while (pos < lower) pos += cw;
                while (pos > upper) pos -= cw;
            }

            const target = Math.round(pos);
            if (target !== lastSet) {
                el.scrollLeft = sign * target;
                lastSet = target;
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [autoplay, items.length, copies]);

    // ── Drag-to-move (mouse only; touch uses native scrolling) ──
    // A press only becomes a drag after the pointer moves past a threshold, so a
    // plain click still reaches the card (and opens its detail lightbox).
    const onPointerDown = (e) => {
        if (e.pointerType !== "mouse") return;
        pending.current = true;
        didDrag.current = false;
        dragStartX.current = e.clientX;
        dragStartScroll.current = scrollerRef.current.scrollLeft;
        pointerId.current = e.pointerId;
    };
    const onPointerMove = (e) => {
        if (!pending.current) return;
        const el = scrollerRef.current;
        const dx = e.clientX - dragStartX.current;
        if (!dragging.current) {
            if (Math.abs(dx) < DRAG_THRESHOLD) return; // still a potential click
            dragging.current = true;
            didDrag.current = true;
            setGrabbing(true);
            el.setPointerCapture?.(e.pointerId);
        }
        el.scrollLeft = dragStartScroll.current - dx;
    };
    const endDrag = (e) => {
        pending.current = false;
        if (!dragging.current) return;
        dragging.current = false;
        setGrabbing(false);
        scrollerRef.current?.releasePointerCapture?.(e.pointerId);
    };
    // If a drag just happened, cancel the click it would otherwise fire so the
    // lightbox doesn't pop open at the end of a drag.
    const onClickCapture = (e) => {
        if (didDrag.current) {
            e.stopPropagation();
            e.preventDefault();
            didDrag.current = false;
        }
    };

    const pause = () => (paused.current = true);
    const resume = () => (paused.current = false);

    return (
        <div
            ref={scrollerRef}
            className={`board-scroller ${grabbing ? "is-grabbing" : ""}`}
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
            onFocusCapture={pause}
            onBlurCapture={resume}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onClickCapture}
        >
            <div className="board-track">
                {Array.from({ length: copies }).map((_, ci) => (
                    <div
                        key={ci}
                        className="board-grid"
                        ref={ci === 0 ? copyRef : undefined}
                        aria-hidden={ci > 0 ? "true" : undefined}
                    >
                        {items.map((d) => (
                            <DealCard key={`${d.id}-${ci}`} deal={d} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
