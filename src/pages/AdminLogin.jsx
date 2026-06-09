import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../store/AuthContext.jsx";
import Brand from "../components/Brand.jsx";

/** Email + password gate (Supabase Auth). On success → /admin/cms. */
export default function AdminLogin() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setBusy(true);
        setError("");
        const err = await signIn(email.trim(), password);
        setBusy(false);
        if (err) {
            setError("התחברות נכשלה — בדקו אימייל וסיסמה.");
            setPassword("");
        } else {
            navigate("/admin/cms");
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
                    <label className="uppercase-mono t-mute">אימייל</label>
                    <input
                        type="email"
                        autoFocus
                        dir="ltr"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        className="cms-input"
                        placeholder="admin@example.com"
                    />
                    <label className="uppercase-mono t-mute">סיסמה</label>
                    <input
                        type="password"
                        dir="ltr"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        className="cms-input"
                        placeholder="••••••••"
                    />
                    {error && (
                        <div
                            className="text-sm font-mono"
                            style={{ color: "#e5484d" }}
                        >
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={busy}
                        className="t-green-bg py-3 font-bold text-sm disabled:opacity-60"
                        style={{ color: "#0a0a0a" }}
                    >
                        {busy ? "מתחבר…" : "כניסה"}
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
