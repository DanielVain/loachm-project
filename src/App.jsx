import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

// Admin/CMS is never needed by storefront visitors — load it on demand so it
// stays out of the initial bundle.
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const AdminCMS = lazy(() => import("./pages/AdminCMS.jsx"));

export default function App() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route
                    path="/admin/cms"
                    element={
                        <RequireAuth>
                            <AdminCMS />
                        </RequireAuth>
                    }
                />
            </Routes>
        </Suspense>
    );
}
