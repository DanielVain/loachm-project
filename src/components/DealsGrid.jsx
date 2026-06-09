import { useContent } from "../store/ContentContext.jsx";
import DealCard from "./DealCard.jsx";

/** "הלוח" — the editable board of deals shown on the home page. */
export default function DealsGrid() {
    const { content } = useContent();

    return (
        <section id="deals" className="border-t border-b t-rule">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                <div className="flex items-end justify-between mb-8 md:mb-10">
                    <div>
                        <div className="uppercase-mono t-green mb-2">
                            // במלאי עכשיו
                        </div>
                        <h2 className="font-display text-3xl md:text-5xl">
                            הלוח.
                        </h2>
                    </div>
                </div>

                {content.deals.length === 0 ? (
                    <div className="t-mute font-mono text-sm py-10 text-center border t-rule">
                        אין פריטים בלוח כרגע.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {content.deals.map((d) => (
                            <DealCard key={d.id} deal={d} />
                        ))}
                    </div>
                )}

                <div className="mt-8 uppercase-mono t-mute text-center">
                    המחירים כוללים מע״מ. הכמויות מוגבלות לכל לקוח.
                </div>
            </div>
        </section>
    );
}
