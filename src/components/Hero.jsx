import { useEffect, useState } from "react";
import { Flame, MapPin } from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import Led from "./Led.jsx";
import TrustBar from "./TrustBar.jsx";

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
                        <div
                            className="border-2 t-card p-5 md:p-6"
                            style={{ borderColor: "var(--green-bg)" }}
                        >
                            <div className="uppercase-mono t-green mb-3 flex items-center gap-2">
                                <Flame className="w-3 h-3" strokeWidth={2.5} />
                                המבצע השבועי
                            </div>
                            <div className="font-display text-5xl md:text-6xl mb-1 leading-none big-drop">
                                −{content.weeklyDrop.pct}%
                            </div>
                            <div className="text-sm t-mute mb-4 mt-2">
                                {content.weeklyDrop.note}
                            </div>
                            <div className="border-t t-rule pt-3 flex items-center justify-between uppercase-mono">
                                <span className="t-mute">מסתיים</span>
                                <span>שישי · 15:30</span>
                            </div>
                        </div>
                    </div>
                </div>

                <TrustBar />
            </div>
        </section>
    );
}
