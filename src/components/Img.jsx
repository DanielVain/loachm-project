import { useState } from "react";

/**
 * Image that fades in once it has loaded (or errored), so pictures don't pop in
 * abruptly on slow connections. Renders a plain <img>, so existing
 * `container img { … }` styles keep applying. Pair it with a container that has
 * the `.img-loading-bg` shimmer for a placeholder while the picture loads.
 */
export default function Img({ className = "", onLoad, onError, ...props }) {
    const [loaded, setLoaded] = useState(false);
    const done = () => setLoaded(true);
    return (
        <img
            {...props}
            loading={props.loading || "lazy"}
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
