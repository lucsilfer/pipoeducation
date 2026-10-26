import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function AcessoAluno() {
  const [codigo, setCodigo] = useState("");
  const navegar = useNavigate();

  function entrar(e: FormEvent) {
    e.preventDefault();
    navegar(`/aluno/${codigo.trim().toUpperCase()}`);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-pipo-50 px-4">
      <div className="card w-full max-w-sm text-center">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-6 text-xl font-bold">Qual é o código da sua turma?</h1>
        <form onSubmit={entrar} className="mt-4 space-y-3">
          <input
            required maxLength={6} autoFocus aria-label="Código da turma"
            className="input text-center font-mono text-2xl font-extrabold uppercase tracking-[0.4em]"
            value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="ABC123"
          />
          <button className="btn-primary w-full">Entrar</button>
        </form>
      </div>
    </div>
  );
}
