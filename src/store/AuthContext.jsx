import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // undefined = still loading; null = signed out; object = signed in
    const [session, setSession] = useState(undefined);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
            setSession(s),
        );
        return () => sub.subscription.unsubscribe();
    }, []);

    const value = {
        session,
        loading: session === undefined,
        isAuthed: !!session,
        async signIn(email, password) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return error ? error.message : null;
        },
        async signOut() {
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
