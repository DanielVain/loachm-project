import { useContent } from "../store/ContentContext.jsx";

/** A prominent, centered brand showcase: a semi-large title with all the brand
    logos shown side by side. Hidden until at least one logo has an image. */
export default function BrandLogos() {
    const { content } = useContent();
    const logos = (content.brandLogos || []).filter((l) => l.image);
    if (logos.length === 0) return null;

    return (
        <div className="brand-strip">
            <h2 className="brand-strip-title">{content.ui.brandsTitle}</h2>
            <div className="brand-strip-logos">
                {logos.map((l) => (
                    <div key={l.id} className="brand-logo-item">
                        <img src={l.image} alt={l.name} loading="lazy" />
                    </div>
                ))}
            </div>
        </div>
    );
}
