import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Topo from "../components/Topo";
import {
  buscarAssistente, excluirAssistente, salvarAssistente, MODELOS, SERIES, type NovoAssistente,
} from "../lib/dados";

const VAZIO: NovoAssistente = {
  nome: "",
  materia: "",
  serie: "6º ano EF",
  instrucoes:
    "Você é um tutor paciente e animado. Explique com exemplos do dia a dia. " +
    "Não entregue a resposta final dos exercícios: faça perguntas que levem o aluno a chegar nela sozinho.",
  modelo: "claude-opus-5-5",
  ativo: true,
};

export default function EditorAssistente() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [form, setForm] = useState<NovoAssistente>(VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) return;
    buscarAssistente(id).then((a) => {
      if (a) setForm({ nome: a.nome, materia: a.materia, serie: a.serie, instrucoes: a.instrucoes, modelo: a.modelo, ativo: a.ativo });
    });
  }, [id]);

  const set = <K extends keyof NovoAssistente>(k: K, v: NovoAssistente[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      await salvarAssistente(form, id);
      navegar("/painel");
    } catch (err) {
      setErro((err as Error).message);
      setSalvando(false);
    }
  }

  async function excluir() {
    if (!id || !confirm("Excluir este assistente? Os alunos perdem o acesso.")) return;
    await excluirAssistente(id);
    navegar("/painel");
  }

  return (
    <div className="min-h-screen">
      <Topo />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-extrabold">{id ? "Editar assistente" : "Novo assistente"}</h1>
        <form onSubmit={salvar} className="card mt-6 space-y-5">
          <div>
            <label className="label" htmlFor="nome">Nome do assistente</label>
            <input id="nome" required className="input" placeholder="Ex.: Professor Pipo de Frações" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="materia">Matéria</label>
              <input id="materia" required className="input" placeholder="Matemática" value={form.materia} onChange={(e) => set("materia", e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="serie">Série</label>
              <select id="serie" className="input" value={form.serie} onChange={(e) => set("serie", e.target.value)}>
                {SERIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="instrucoes">Como o assistente deve agir</label>
            <textarea id="instrucoes" required rows={7} className="input" value={form.instrucoes} onChange={(e) => set("instrucoes", e.target.value)} />
            <p className="mt-1 text-xs text-slate-500">Conteúdo da unidade, tom de voz, o que pode e o que não pode fazer. Regras de segurança para menores já são aplicadas automaticamente.</p>
          </div>
          <div>
            <span className="label">Modelo de IA</span>
            <div className="grid gap-2 sm:grid-cols-3">
              {MODELOS.map((m) => (
                <label key={m.id} className={`cursor-pointer rounded-xl border p-3 ${form.modelo === m.id ? "border-pipo-500 bg-pipo-50" : "border-slate-200"}`}>
                  <input type="radio" name="modelo" className="sr-only" checked={form.modelo === m.id} onChange={() => set("modelo", m.id)} />
                  <span className="block font-bold">{m.nome}</span>
                  <span className="text-xs text-slate-500">{m.desc}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.ativo} onChange={(e) => set("ativo", e.target.checked)} />
            <span className="font-semibold">Ativo (alunos podem conversar)</span>
          </label>
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <div className="flex flex-wrap justify-between gap-2">
            {id ? <button type="button" onClick={excluir} className="btn-ghost text-red-600">Excluir</button> : <span />}
            <div className="flex gap-2">
              <button type="button" onClick={() => navegar("/painel")} className="btn-ghost">Cancelar</button>
              <button className="btn-primary" disabled={salvando}>{salvando ? "Salvando…" : "Salvar"}</button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
