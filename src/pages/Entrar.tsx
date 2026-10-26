import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import Logo from "../components/Logo";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";

export default function Entrar() {
  const { logado } = useAuth();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (logado) return <Navigate to="/painel" replace />;

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setEnviando(true);
    setErro("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/painel` },
    });
    setEnviando(false);
    if (error) setErro(error.message);
    else setEnviado(true);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-pipo-50 px-4">
      <div className="card w-full max-w-sm">
        <Logo />
        <h1 className="mt-6 text-xl font-bold">Entrar como professor</h1>
        {enviado ? (
          <p className="mt-3 text-slate-600">Enviamos um link de acesso para <b>{email}</b>. Abra seu e-mail para entrar.</p>
        ) : (
          <form onSubmit={enviar} className="mt-4 space-y-3">
            <label className="label" htmlFor="email">E-mail</label>
            <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@escola.com.br" />
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            <button className="btn-primary w-full" disabled={enviando}>{enviando ? "Enviando…" : "Receber link de acesso"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
