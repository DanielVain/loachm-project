import { useEffect, useState } from "react";
import { Flame, MapPin } from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import { heroImageList } from "../data/content.js";
import Led from "./Led.jsx";
import BrandLogos from "./BrandLogos.jsx";

/** Live HH:MM:SS clock for the "system online" status line. */
function useClock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const p = (n) => String(n).padStart(2, "0");
    return `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
}

/** Hero picture frame — a single photo, or a crossfading gallery of store photos. */
function HeroFrame({ images, alt }) {
    const [i, setI] = useState(0);

    useEffect(() => {
        if (images.length < 2) return;
        setI(0);
        const t = setInterval(
            () => setI((n) => (n + 1) % images.length),
            2600,
        );
        return () => clearInterval(t);
    }, [images.length]);

    if (images.length === 1) {
        return (
            <div className="hero-frame">
                <img src={images[0]} alt={alt} loading="lazy" />
            </div>
        );
    }

    return (
        <div className="hero-frame hero-frame-gallery" role="img" aria-label={alt}>
            {images.map((src, idx) => (
                <img
                    key={src + idx}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="hero-frame-slide"
                    style={{ opacity: idx === i ? 1 : 0 }}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
}

export default function Hero() {
    const { content } = useContent();
    const clock = useClock();

    return (
        <section className="scanlines border-b t-rule">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                <div className="flex items-center justify-between uppercase-mono t-mute mb-10">
                    <div className="flex items-center gap-2">
                        <Led px={6} />
                        <span className="t-green">המערכת מקוונת</span>
                        <span className="hidden sm:inline">
                            · <span dir="ltr">{clock}</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-5">
                        <span>מלאי · {content.deals.length} פריטים</span>
                        <span>·</span>
                        <span>שבוע מבצעים 19</span>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
                    <div className="col-span-12 md:col-span-8">
                        <div className="font-heb text-base md:text-lg t-mute mb-4">
                            {content.brand.taglineHe}
                        </div>

                        <h1 className="font-brand text-[18vw] md:text-[10rem] lg:text-[12rem] leading-[0.85]">
                            {content.brand.lead}
                            <span className="t-green">
                                {content.brand.accent}
                            </span>
                        </h1>

                        <div className="mt-5 inline-flex items-center gap-2.5 font-heb text-xl md:text-2xl font-bold">
                            <MapPin
                                className="w-5 h-5 md:w-6 md:h-6 t-green flex-shrink-0"
                                strokeWidth={2.2}
                            />
                            <span>
                                {content.contact.addressHe}, {content.contact.city}
                            </span>
                        </div>

                        <p className="mt-6 md:mt-8 text-lg md:text-2xl max-w-2xl leading-snug">
                            משחקי מחשב וקונסולות, ציוד גיימינג, ומדף ה-
                            <span className="t-green font-bold">NONSTOP</span>{" "}
                            היחיד בישראל. במלאי. יוצא מהדלת עוד היום.
                        </p>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        {content.layout.heroPanel === "image" &&
                        heroImageList(content.layout).length ? (
                            <HeroFrame
                                images={heroImageList(content.layout)}
                                alt={
                                    content.layout.heroImageAlt ||
                                    "תמונות של החנות"
                                }
                            />
                        ) : (
                            <div className="weekly-drop-box p-5 md:p-6">
                                <div className="uppercase-mono mb-3 flex items-center gap-2 weekly-drop-ink">
                                    <Flame
                                        className="w-3 h-3"
                                        strokeWidth={2.5}
                                    />
                                    {content.weeklyDrop.title}
                                </div>
                                <div className="font-display text-6xl md:text-7xl mb-1 leading-none weekly-drop-pct">
                                    −{content.weeklyDrop.pct}%
                                </div>
                                <div className="text-sm mb-4 mt-2 weekly-drop-ink-soft">
                                    {content.weeklyDrop.note}
                                </div>
                                <div className="weekly-drop-rule pt-3 flex items-center justify-between uppercase-mono weekly-drop-ink">
                                    <span className="opacity-70">
                                        {content.weeklyDrop.endsLabel}
                                    </span>
                                    <span className="font-bold">
                                        {content.weeklyDrop.endsValue}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <BrandLogos />
            </div>
        </section>
    );
}
