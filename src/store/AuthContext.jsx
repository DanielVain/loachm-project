import { createContext, useContext, useEffect, useState } from "react";
import { getSupabase } from "./supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // undefined = still loading; null = signed out; object = signed in
    const [session, setSession] = useState(undefined);

    useEffect(() => {
        let active = true;
        let subscription;
        getSupabase().then((supabase) => {
            if (!active) return;
            supabase.auth
                .getSession()
                .then(({ data }) => active && setSession(data.session));
            subscription = supabase.auth.onAuthStateChange((_e, s) =>
                setSession(s),
            ).data.subscription;
        });
        return () => {
            active = false;
            subscription?.unsubscribe();
        };
    }, []);

    const value = {
        session,
        loading: session === undefined,
        isAuthed: !!session,
        async signIn(email, password) {
            const supabase = await getSupabase();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return error ? error.message : null;
        },
        async signOut() {
            const supabase = await getSupabase();
            await supabase.auth.signOut();
        },
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
    return ctx;
}
