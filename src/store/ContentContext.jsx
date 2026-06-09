import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { DEFAULT_CONTENT, newId } from "../data/content.js";

const STORAGE_KEY = "loachm:content:v1";

/* Load persisted content, falling back to (and shallow-merging) the seed so
   newly added top-level fields keep working across versions. */
function loadContent() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_CONTENT;
        const saved = JSON.parse(raw);
        return { ...DEFAULT_CONTENT, ...saved };
    } catch {
        return DEFAULT_CONTENT;
    }
}

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
    const [content, setContent] = useState(loadContent);

    // Persist on every change.
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
        } catch (e) {
            // Most likely the quota was exceeded by large data-URL images.
            console.warn("Could not save content to localStorage:", e);
        }
    }, [content]);

    const api = useMemo(() => {
        const setDeals = (updater) =>
            setContent((c) => ({
                ...c,
                deals:
                    typeof updater === "function" ? updater(c.deals) : updater,
            }));

        return {
            content,

            /** Add a new board item. Returns the created item. */
            addDeal(partial = {}) {
                const item = {
                    id: newId(),
                    cat: "",
                    icon: "ShoppingBag",
                    name: "",
                    spec: "",
                    was: 0,
                    now: 0,
                    stock: 0,
                    hot: false,
                    image: "",
                    ...partial,
                };
                setDeals((deals) => [item, ...deals]);
                return item;
            },

            /** Patch an existing board item by id. */
            updateDeal(id, patch) {
                setDeals((deals) =>
                    deals.map((d) => (d.id === id ? { ...d, ...patch } : d)),
                );
            },

            /** Remove a board item by id. */
            removeDeal(id) {
                setDeals((deals) => deals.filter((d) => d.id !== id));
            },

            /** Wipe all local edits and restore the seed data. */
            resetContent() {
                localStorage.removeItem(STORAGE_KEY);
                setContent(DEFAULT_CONTENT);
            },
        };
    }, [content]);

    return (
        <ContentContext.Provider value={api}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    const ctx = useContext(ContentContext);
    if (!ctx)
        throw new Error("useContent must be used within a <ContentProvider>");
    return ctx;
}
