import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { login } from "../store/auth.js";
import Brand from "../components/Brand.jsx";

/** Password gate for the CMS. On success, redirects to /admin/cms. */
export default function AdminLogin() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    function onSubmit(e) {
        e.preventDefault();
        if (login(password)) {
            navigate("/admin/cms");
        } else {
            setError(true);
            setPassword("");
        }
    }

    return (
        <div className="admin-shell min-h-screen flex items-center justify-center px-5">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-4">
                        <Brand size="text-3xl" />
                    </Link>
                    <div className="uppercase-mono t-mute flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" strokeWidth={2.5} />
                        ניהול תוכן
                    </div>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="t-card border t-rule p-6 flex flex-col gap-4"
                >
                    <label className="uppercase-mono t-mute">סיסמה</label>
                    <input
                        type="password"
                        autoFocus
                        dir="ltr"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        className="cms-input"
                        placeholder="••••••••"
                    />
                    {error && (
                        <div className="text-sm font-mono" style={{ color: "#e5484d" }}>
                            סיסמה שגויה
                        </div>
                    )}
                    <button
                        type="submit"
                        className="t-green-bg py-3 font-bold text-sm"
                        style={{ color: "#0a0a0a" }}
                    >
                        כניסה
                    </button>
                    <Link
                        to="/"
                        className="uppercase-mono t-mute text-center h-green transition-colors"
                    >
                        ← חזרה לאתר
                    </Link>
                </form>
            </div>
        </div>
    );
}
