import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
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
