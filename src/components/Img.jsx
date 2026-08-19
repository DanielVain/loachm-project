import { useEffect, useRef, useState } from "react";

/**
 * Lazy image: it doesn't fetch until it's near the viewport, then fades in once
 * loaded. A generous rootMargin means below-the-fold pictures finish loading
 * *before* you scroll to them, so you never watch them pop/fade in — they're
 * simply already there. Pass `eager` for above-the-fold images (e.g. the hero).
 *
 * Renders a plain <img>, so existing `container img { … }` styles keep applying.
 */
export default function Img({
    className = "",
    eager = false,
    onLoad,
    onError,
    src,
    ...props
}) {
    const ref = useRef(null);
    const [show, setShow] = useState(eager);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (show) return;
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === "undefined") {
            setShow(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setShow(true);
                    io.disconnect();
                }
            },
            { rootMargin: "600px 0px" },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [show]);

    const done = () => setLoaded(true);
    return (
        <img
            ref={ref}
            {...props}
            src={show ? src : undefined}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className={`img-fade${loaded ? " is-loaded" : ""}${
                className ? " " + className : ""
            }`}
            onLoad={(e) => {
                done();
                onLoad?.(e);
            }}
            onError={(e) => {
                done();
                onError?.(e);
            }}
        />
    );
}
