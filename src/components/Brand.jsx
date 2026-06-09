import { useContent } from "../store/ContentContext.jsx";

/** Wordmark: "לוח" + accented "M". `size` is a Tailwind text-size class. */
export default function Brand({ size = "text-xl" }) {
    const { content } = useContent();
    return (
        <span
            className={`font-brand ${size} t-text`}
            style={{ letterSpacing: "-0.04em" }}
        >
            {content.brand.lead}
            <span className="t-green">{content.brand.accent}</span>
        </span>
    );
}
