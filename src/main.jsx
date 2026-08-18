import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Self-hosted fonts (served from our own origin — no third-party round-trip,
// so they load faster and reliably even on slow machines/connections). Only
// the Latin + Hebrew subsets we actually use, to keep the CSS small.
import "@fontsource/archivo-black/latin-400.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-800.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import "@fontsource/heebo/hebrew-400.css";
import "@fontsource/heebo/hebrew-700.css";
import "@fontsource/heebo/hebrew-900.css";
import "@fontsource/heebo/latin-400.css";
import "@fontsource/heebo/latin-700.css";
import "@fontsource/heebo/latin-900.css";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./store/AuthContext.jsx";
import { ContentProvider } from "./store/ContentContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ContentProvider>
                    <App />
                </ContentProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);
