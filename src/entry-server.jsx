import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App.jsx";
import { AuthProvider } from "./store/AuthContext.jsx";
import { ContentProvider } from "./store/ContentContext.jsx";

/**
 * Render the storefront to an HTML string at build time (see
 * scripts/prerender.mjs), seeded with the content fetched from Supabase. This
 * bakes the hero (the LCP element) straight into the initial HTML, so it paints
 * before the JS bundle boots — then the client re-renders the same content and
 * takes over with live updates.
 */
export function render(url, initialContent) {
    return renderToString(
        <StrictMode>
            <StaticRouter location={url}>
                <AuthProvider>
                    <ContentProvider initialContent={initialContent}>
                        <App />
                    </ContentProvider>
                </AuthProvider>
            </StaticRouter>
        </StrictMode>,
    );
}
