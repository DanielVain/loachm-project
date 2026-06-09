import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminCMS from "./pages/AdminCMS.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
    return (
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
    );
}
