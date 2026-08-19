import { ShoppingBag } from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import { iconFor } from "../data/content.js";

/** "גם בחנות" — secondary in-store offerings. */
export default function ExtrasGrid() {
    const { content } = useContent();

    return (
        <section id="extras" className="t-bg-2 border-b t-rule">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="uppercase-mono t-green mb-2">
                            {content.ui.extrasKicker}
                        </div>
                        <h2 className="font-display text-2xl md:text-4xl">
                            {content.ui.extrasTitle}
                        </h2>
                    </div>
                    <ShoppingBag
                        className="t-mute w-5 h-5 hidden md:block"
                        strokeWidth={1.5}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {content.extras.map((e) => {
                        const Icon = iconFor(e.icon);
                        return (
                            <div
                                key={e.name}
                                className="t-card border t-rule p-5 flex items-start gap-4 deal-card"
                            >
                                {e.image ? (
                                    <div className="extra-photo flex-shrink-0">
                                        <img
                                            src={e.image}
                                            alt={e.name}
                                            loading="lazy"
                                        />
                                    </div>
                                ) : (
                                    <div className="t-green-bg p-3 flex-shrink-0">
                                        <Icon
                                            className="w-[22px] h-[22px]"
                                            strokeWidth={1.6}
                                            style={{ color: "#0a0a0a" }}
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div
                                        className="font-display text-lg md:text-xl mb-1"
                                        dir="auto"
                                    >
                                        {e.name}
                                    </div>
                                    <div
                                        className="text-xs t-mute mb-2 leading-relaxed"
                                        dir="auto"
                                    >
                                        {e.desc}
                                    </div>
                                    <div className="uppercase-mono t-green">
                                        החל מ-{e.from} ₪
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
