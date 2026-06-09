/* ───────────────────────────────────────────────────────────────
   MVP admin auth — a simple client-side password gate.

   ⚠️  This is NOT real security. The password lives in the bundle, so
   anyone can read it in dev tools. It only keeps casual visitors out of
   the CMS UI. When we move the CMS to a real backend, replace this with
   proper server-side auth (e.g. Vercel + a session cookie).
   ─────────────────────────────────────────────────────────────── */

// TODO: change this, and move to real auth before treating the CMS as secure.
const ADMIN_PASSWORD = "loachm2026";

const FLAG_KEY = "loachm:admin";

export function login(password) {
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(FLAG_KEY, "1");
        return true;
    }
    return false;
}

export function logout() {
    sessionStorage.removeItem(FLAG_KEY);
}

export function isAuthed() {
    return sessionStorage.getItem(FLAG_KEY) === "1";
}
