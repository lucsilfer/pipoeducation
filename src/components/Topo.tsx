import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { modoDemo } from "../lib/supabase";
import Logo from "./Logo";

export default function Topo() {
  const { email, sair } = useAuth();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Logo pequeno />
        <div className="flex items-center gap-3 text-sm">
          <Link to="/painel" className="btn-ghost">Meus assistentes</Link>
          <span className="hidden text-slate-500 sm:inline">{email}</span>
          {!modoDemo && <button onClick={sair} className="btn-ghost">Sair</button>}
        </div>
      </div>
    </header>
  );
}
