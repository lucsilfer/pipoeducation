import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, modoDemo } from "./supabase";

type Ctx = { logado: boolean; carregando: boolean; email: string | null; sair: () => Promise<void> };

const AuthCtx = createContext<Ctx>({ logado: false, carregando: true, email: null, sair: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(!modoDemo);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      setCarregando(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSessao(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const valor: Ctx = modoDemo
    ? { logado: true, carregando: false, email: "professor@demo", sair: async () => {} }
    : {
        logado: !!sessao,
        carregando,
        email: sessao?.user.email ?? null,
        sair: async () => {
          await supabase!.auth.signOut();
        },
      };

  return <AuthCtx.Provider value={valor}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
