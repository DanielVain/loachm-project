import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";

/** Gate a route behind a Supabase session; bounce to /admin otherwise. */
export default function RequireAuth({ children }) {
    const { loading, isAuthed } = useAuth();

    if (loading) {
        return (
            <div className="admin-shell min-h-screen flex items-center justify-center">
                <span className="uppercase-mono t-mute">טוען…</span>
            </div>
        );
    }
    return isAuthed ? children : <Navigate to="/admin" replace />;
}
