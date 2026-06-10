import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import BoardCarousel from "./BoardCarousel.jsx";

/** "הלוח" — the board: filterable 2-row auto-scrolling carousel of deals. */
export default function DealsGrid() {
    const { content } = useContent();
    const deals = content.deals;

    const [query, setQuery] = useState("");
    const [cat, setCat] = useState("all");

    const categories = useMemo(() => {
        const set = new Set();
        deals.forEach((d) => {
            const c = (d.cat || "").trim();
            if (c) set.add(c);
        });
        return Array.from(set);
    }, [deals]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return deals.filter((d) => {
            const matchCat = cat === "all" || (d.cat || "").trim() === cat;
            const matchQ =
                !q ||
                [d.name, d.cat, d.spec].some((v) =>
                    (v || "").toLowerCase().includes(q),
                );
            return matchCat && matchQ;
        });
    }, [deals, query, cat]);

    const hasFilter = query.trim() !== "" || cat !== "all";

    return (
        <section id="deals" className="border-t border-b t-rule">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <div className="uppercase-mono t-green mb-2">
                            // במלאי עכשיו
                        </div>
                        <h2 className="font-display text-3xl md:text-5xl">
                            הלוח.
                        </h2>
                    </div>

                    {/* search box */}
                    <div className="board-search">
                        <Search
                            className="w-4 h-4 t-mute flex-shrink-0"
                            strokeWidth={2}
                        />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="חיפוש מוצר…"
                            className="board-search-input"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                aria-label="נקה חיפוש"
                                className="t-mute h-green"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* category chips */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        <button
                            onClick={() => setCat("all")}
                            className={`cat-chip ${cat === "all" ? "cat-chip--active" : ""}`}
                        >
                            הכל
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCat(c)}
                                className={`cat-chip ${cat === c ? "cat-chip--active" : ""}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                {filtered.length === 0 ? (
                    <div className="t-mute font-mono text-sm py-12 text-center border t-rule">
                        {deals.length === 0
                            ? "אין פריטים בלוח כרגע."
                            : "לא נמצאו פריטים תואמים."}
                    </div>
                ) : (
                    <BoardCarousel items={filtered} autoplay={!hasFilter} />
                )}

                <div className="mt-6 flex items-center justify-between gap-3 uppercase-mono t-mute">
                    <span>
                        {filtered.length} פריטים
                        {hasFilter ? ` (מתוך ${deals.length})` : ""}
                    </span>
                    <span className="hidden md:inline">
                        גוללים לצדדים · מרחפים כדי לעצור
                    </span>
                </div>

                <div className="mt-6 uppercase-mono t-mute text-center">
                    המחירים כוללים מע״מ. הכמויות מוגבלות לכל לקוח.
                </div>
            </div>
        </section>
    );
}
