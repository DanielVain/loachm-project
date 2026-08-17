import { useState } from "react";
import { Flame, Maximize2 } from "lucide-react";
import { fmt, pct, iconFor, splitSpec } from "../data/content.js";
import Led from "./Led.jsx";
import DealModal from "./DealModal.jsx";

/** A single board item. Shows a product photo when one is set, otherwise
    falls back to the category icon. Click / tap opens a detail lightbox. */
export default function DealCard({ deal }) {
    const Icon = iconFor(deal.icon);
    const discount = pct(deal.was, deal.now);
    const [open, setOpen] = useState(false);

    return (
        <div
            className="deal-card t-card border t-rule p-5 md:p-6 flex flex-col relative"
            role="button"
            tabIndex={0}
            aria-label={`פרטים על ${deal.name}`}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(true);
                }
            }}
        >
            {deal.hot && (
                <div
                    className="absolute top-0 left-0 t-green-bg px-2 py-1 font-mono text-[0.7rem] font-bold tracking-wider flex items-center gap-1 z-10"
                    style={{ color: "#0a0a0a" }}
                >
                    <Flame className="w-2.5 h-2.5" strokeWidth={2.5} />
                    חם
                </div>
            )}

            {deal.image ? (
                <div className="deal-photo mb-5">
                    <img src={deal.image} alt={deal.name} loading="lazy" />
                    <span className="deal-photo-zoom" aria-hidden="true">
                        <Maximize2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                </div>
            ) : null}

            <div className="flex items-start justify-between mb-6">
                {deal.cat ? (
                    <span className="deal-cat" dir="auto">
                        {deal.cat}
                    </span>
                ) : (
                    <span />
                )}
                <Icon className="deal-icon t-mute w-7 h-7" strokeWidth={1.3} />
            </div>

            <div
                className="font-display text-2xl md:text-3xl mb-2 leading-tight"
                dir="auto"
            >
                {deal.name}
            </div>
            {splitSpec(deal.spec).length > 0 && (
                <div className="font-mono text-xs t-mute mb-6 deal-spec">
                    {splitSpec(deal.spec).map((s, i) => (
                        <span key={i} className="deal-spec-item" dir="auto">
                            {s}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-auto">
                <div className="flex items-baseline gap-2 mb-1">
                    {deal.was > deal.now && (
                        <span className="font-mono text-sm t-mute line-through">
                            {fmt(deal.was)} ₪
                        </span>
                    )}
                    {discount > 0 && (
                        <span
                            className="t-green-bg px-1.5 py-0.5 font-mono text-[0.7rem] font-bold"
                            style={{ color: "#0a0a0a" }}
                        >
                            −{discount}%
                        </span>
                    )}
                </div>
                <div className="font-display text-3xl md:text-4xl t-green leading-none mb-4">
                    {fmt(deal.now)} ₪
                </div>
                <div className="flex items-center border-t t-rule-soft pt-3">
                    <span className="uppercase-mono t-mute flex items-center gap-2">
                        <Led px={6} />
                        {deal.stock} במלאי
                    </span>
                </div>
            </div>

            {open && (
                <DealModal deal={deal} onClose={() => setOpen(false)} />
            )}
        </div>
    );
}
