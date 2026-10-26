import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./lib/auth";
import { modoDemo } from "./lib/supabase";
import Inicio from "./pages/Inicio";
import Entrar from "./pages/Entrar";
import Painel from "./pages/Painel";
import EditorAssistente from "./pages/EditorAssistente";
import AcessoAluno from "./pages/AcessoAluno";
import ChatAluno from "./pages/ChatAluno";

function Protegida({ children }: { children: ReactNode }) {
  const { logado, carregando } = useAuth();
  if (carregando) return <p className="p-8 text-center text-slate-500">Carregando…</p>;
  return logado ? <>{children}</> : <Navigate to="/entrar" replace />;
}

export default function App() {
  return (
    <>
      {modoDemo && (
        <div className="bg-sol/20 px-4 py-1.5 text-center text-xs font-semibold text-amber-800">
          Modo demo — dados ficam só neste navegador. Configure o .env para usar o Supabase.
        </div>
      )}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/painel" element={<Protegida><Painel /></Protegida>} />
        <Route path="/painel/novo" element={<Protegida><EditorAssistente /></Protegida>} />
        <Route path="/painel/:id" element={<Protegida><EditorAssistente /></Protegida>} />
        <Route path="/aluno" element={<AcessoAluno />} />
        <Route path="/aluno/:codigo" element={<ChatAluno />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
