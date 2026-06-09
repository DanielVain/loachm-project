import { Navigate } from "react-router-dom";
import { isAuthed } from "../store/auth.js";

/** Gate a route behind the admin password; bounce to /admin otherwise. */
export default function RequireAuth({ children }) {
    return isAuthed() ? children : <Navigate to="/admin" replace />;
}
