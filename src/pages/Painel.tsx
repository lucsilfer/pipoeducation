import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topo from "../components/Topo";
import { listarAssistentes, MODELOS, type Assistente } from "../lib/dados";

export default function Painel() {
  const [lista, setLista] = useState<Assistente[] | null>(null);
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState("");

  useEffect(() => {
    listarAssistentes().then(setLista).catch((e) => setErro(e.message));
  }, []);

  function copiarLink(codigo: string) {
    navigator.clipboard?.writeText(`${window.location.origin}/aluno/${codigo}`);
    setCopiado(codigo);
    setTimeout(() => setCopiado(""), 1500);
  }

  return (
    <div className="min-h-screen">
      <Topo />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">Meus assistentes</h1>
          <Link to="/painel/novo" className="btn-primary">+ Novo assistente</Link>
        </div>

        {erro && <p className="mt-6 text-red-600">{erro}</p>}
        {lista === null && !erro && <p className="mt-6 text-slate-500">Carregando…</p>}

        {lista?.length === 0 && (
          <div className="card mt-6 text-center">
            <p className="text-lg font-bold">Você ainda não criou nenhum assistente</p>
            <p className="mt-1 text-slate-600">Comece com um tutor de Matemática para o 6º ano, por exemplo.</p>
            <Link to="/painel/novo" className="btn-primary mt-4">Criar o primeiro</Link>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {lista?.map((a) => (
            <div key={a.id} className="card flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold">{a.nome}</h2>
                  <p className="text-sm text-slate-500">{a.materia} · {a.serie}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${a.ativo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {a.ativo ? "Ativo" : "Pausado"}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{MODELOS.find((m) => m.id === a.modelo)?.nome ?? a.modelo}</p>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-pipo-50 px-3 py-2">
                <span className="text-sm text-slate-600">Código da turma</span>
                <span className="font-mono text-lg font-extrabold tracking-widest text-pipo-700">{a.codigo}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={`/painel/${a.id}`} className="btn-ghost flex-1 border border-slate-200">Editar</Link>
                <button onClick={() => copiarLink(a.codigo)} className="btn-ghost flex-1 border border-slate-200">
                  {copiado === a.codigo ? "Copiado!" : "Copiar link"}
                </button>
                <Link to={`/aluno/${a.codigo}`} className="btn-ghost flex-1 border border-slate-200">Testar</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
