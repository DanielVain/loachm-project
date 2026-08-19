import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Flame, Phone } from "lucide-react";
import { fmt, pct, iconFor, splitSpec } from "../data/content.js";
import { useContent } from "../store/ContentContext.jsx";
import Led from "./Led.jsx";
import Img from "./Img.jsx";

/** Full-screen detail view for a board item: big photo, specs, price, call CTA. */
export default function DealModal({ deal, onClose }) {
    const { content } = useContent();
    const Icon = iconFor(deal.icon);
    const discount = pct(deal.was, deal.now);
    const specs = splitSpec(deal.spec);

    // Close on outside-click, but only when the press *starts* on the backdrop
    // (so dragging/selecting inside the panel never closes it by accident).
    //
    // The modal is rendered through a portal — and React bubbles portal events
    // up the *component* tree, not the DOM tree. Without stopPropagation the
    // click would reach the DealCard's onClick and instantly reopen the modal,
    // so every handler here stops propagation back into the app.
    const pressedOutside = useRef(false);
    const onBackdropPointerDown = (e) => {
        e.stopPropagation();
        pressedOutside.current = e.target === e.currentTarget;
    };
    const onBackdropClick = (e) => {
        e.stopPropagation();
        if (pressedOutside.current && e.target === e.currentTarget) onClose();
    };

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    return createPortal(
        <div
            className="deal-modal-backdrop"
            onPointerDown={onBackdropPointerDown}
            onClick={onBackdropClick}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={deal.name}
        >
            <div className="deal-modal t-card" dir="rtl">
                <button
                    className="deal-modal-close"
                    onClick={onClose}
                    aria-label="סגירה"
                >
                    <X className="w-5 h-5" />
                </button>

                {deal.image ? (
                    <div className="deal-modal-photo">
                        <Img src={deal.image} alt={deal.name} />
                    </div>
                ) : (
                    <div className="deal-modal-photo deal-modal-photo--icon">
                        <Icon className="w-24 h-24 t-mute" strokeWidth={1} />
                    </div>
                )}

                <div className="deal-modal-body">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {deal.cat && (
                            <span className="deal-cat" dir="auto">
                                {deal.cat}
                            </span>
                        )}
                        {deal.hot && (
                            <span className="deal-hot-pill">
                                <Flame className="w-3 h-3" strokeWidth={2.5} />
                                חם
                            </span>
                        )}
                    </div>

                    <h3
                        className="font-display text-3xl md:text-4xl leading-tight mb-3"
                        dir="auto"
                    >
                        {deal.name}
                    </h3>

                    {specs.length > 0 && (
                        <div className="font-mono text-sm t-mute mb-6 deal-spec">
                            {specs.map((s, i) => (
                                <span
                                    key={i}
                                    className="deal-spec-item"
                                    dir="auto"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-baseline gap-3 mb-1">
                        {deal.was > deal.now && (
                            <span className="font-mono t-mute line-through">
                                {fmt(deal.was)} ₪
                            </span>
                        )}
                        {discount > 0 && (
                            <span
                                className="t-green-bg px-2 py-0.5 font-mono text-xs font-bold"
                                style={{ color: "#0a0a0a" }}
                            >
                                −{discount}%
                            </span>
                        )}
                    </div>
                    <div className="font-display text-4xl md:text-5xl t-green leading-none mb-4">
                        {fmt(deal.now)} ₪
                    </div>

                    <div className="uppercase-mono t-mute mb-6 flex items-center gap-2">
                        <Led px={6} />
                        {deal.stock} במלאי
                    </div>

                    <a
                        href={`tel:${content.contact.phoneTel}`}
                        className="deal-modal-cta t-green-bg"
                        style={{ color: "#0a0a0a" }}
                    >
                        <Phone className="w-4 h-4" strokeWidth={2.5} />
                        לפרטים והזמנה · {content.contact.phone}
                    </a>
                </div>
            </div>
        </div>,
        document.body,
    );
}
