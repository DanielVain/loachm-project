import { useContent } from "../store/ContentContext.jsx";
import { iconFor } from "../data/content.js";

/** NONSTOP exclusive showcase — dark panel with a bright blue gradient glow. */
export default function NonstopFeature() {
    const { content } = useContent();
    const f = content.featured;
    const c = content.nonstopColors;

    return (
        <section
            id="nonstop"
            className="nonstop-section"
            style={{
                "--ns-bg": c.bg,
                "--ns-accent": c.accent,
                "--ns-title": c.title,
            }}
        >
            {/* decorative blue glows */}
            <span className="nonstop-glow nonstop-glow--a" aria-hidden="true" />
            <span className="nonstop-glow nonstop-glow--b" aria-hidden="true" />

            <div className="nonstop-inner max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                <div className="font-mono uppercase tracking-[0.14em] text-[0.7rem] mb-8 flex items-center gap-3 nonstop-accent">
                    <span className="w-8 h-px nonstop-accent-bar" />
                    <span>{f.label}</span>
                </div>

                <div className="grid grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-14">
                    <div className="col-span-12 md:col-span-7">
                        <div className="flex items-baseline gap-4 md:gap-6 flex-wrap">
                            <span
                                className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9]"
                                style={{ letterSpacing: "-0.03em" }}
                            >
                                {content.brand.lead}
                                <span className="nonstop-accent-text">
                                    {content.brand.accent}
                                </span>
                            </span>
                            <span className="font-mono text-3xl md:text-5xl opacity-40">
                                ×
                            </span>
                            <span
                                className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] nonstop-wordmark"
                                style={{ letterSpacing: "-0.02em" }}
                            >
                                {f.title}
                            </span>
                        </div>
                        <p className="font-mono uppercase tracking-[0.22em] text-sm md:text-base mt-5 font-bold nonstop-accent">
                            {f.slogan}
                        </p>
                    </div>
                    <div className="col-span-12 md:col-span-5">
                        <p
                            className="font-display text-xl md:text-2xl mb-3"
                            style={{ letterSpacing: "-0.01em" }}
                        >
                            {f.headline}
                        </p>
                        <p
                            className="text-base leading-relaxed"
                            style={{ color: "#c5d6e6" }}
                        >
                            {f.body}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {f.items.map((item) => {
                        const Icon = iconFor(item.icon);
                        return (
                            <div
                                key={item.name}
                                className="nonstop-tile border-2 p-4 md:p-5 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <span className="font-mono uppercase text-[0.7rem] tracking-wider">
                                        {item.type}
                                    </span>
                                    {Icon && (
                                        <Icon
                                            className="w-5 h-5"
                                            strokeWidth={1.6}
                                        />
                                    )}
                                </div>
                                <div
                                    className="font-display text-base md:text-lg leading-tight mb-3"
                                    dir="auto"
                                >
                                    {item.name}
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-mono text-[0.7rem] uppercase opacity-70">
                                        החל מ-
                                    </span>
                                    <span className="font-display text-xl md:text-2xl">
                                        {item.price} ₪
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
