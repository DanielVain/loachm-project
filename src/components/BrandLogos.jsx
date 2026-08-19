import { useEffect, useState } from "react";
import { useContent } from "../store/ContentContext.jsx";

/** A small framed showcase under the hero title that cross-fades through the
    brand logos set in the CMS. Hidden until at least one logo has an image. */
export default function BrandLogos() {
    const { content } = useContent();
    const logos = (content.brandLogos || []).filter((l) => l.image);
    const [i, setI] = useState(0);

    useEffect(() => {
        if (logos.length < 2) return;
        const t = setInterval(
            () => setI((x) => (x + 1) % logos.length),
            2600,
        );
        return () => clearInterval(t);
    }, [logos.length]);

    if (logos.length === 0) return null;
    const active = i % logos.length;

    return (
        <div className="brand-logos">
            <span className="uppercase-mono t-mute">מותגים מובילים</span>
            <div className="brand-logo-frame">
                {logos.map((l, idx) => (
                    <img
                        key={l.id}
                        src={l.image}
                        alt={l.name}
                        className={`brand-logo ${idx === active ? "is-active" : ""}`}
                    />
                ))}
            </div>
        </div>
    );
}
