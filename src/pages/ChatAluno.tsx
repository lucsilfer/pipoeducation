import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from "../components/Logo";
import { assistentePorCodigo, enviarMensagem, type AssistentePublico, type Mensagem } from "../lib/dados";

export default function ChatAluno() {
  const { codigo = "" } = useParams();
  const [assistente, setAssistente] = useState<AssistentePublico | null | undefined>(undefined);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const fim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    assistentePorCodigo(codigo).then(setAssistente).catch(() => setAssistente(null));
  }, [codigo]);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, pensando]);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo || pensando) return;
    const novas: Mensagem[] = [...mensagens, { role: "user", content: conteudo }];
    setMensagens(novas);
    setTexto("");
    setPensando(true);
    try {
      const resposta = await enviarMensagem(codigo, novas);
      setMensagens([...novas, { role: "assistant", content: resposta }]);
    } catch {
      setMensagens([...novas, { role: "assistant", content: "Ops, não consegui responder agora. Tente de novo em instantes." }]);
    } finally {
      setPensando(false);
    }
  }

  if (assistente === undefined) return <p className="p-8 text-center text-slate-500">Carregando…</p>;

  if (assistente === null)
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <p className="text-xl font-bold">Código não encontrado</p>
          <p className="mt-1 text-slate-600">Confira com seu professor se o código <b>{codigo}</b> está certo.</p>
          <Link to="/aluno" className="btn-primary mt-4">Tentar outro código</Link>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen flex-col bg-pipo-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Logo pequeno />
          <div className="text-right">
            <p className="font-bold leading-tight">{assistente.nome}</p>
            <p className="text-xs text-slate-500">{assistente.materia} · {assistente.serie}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-3 px-4 py-6">
          {mensagens.length === 0 && (
            <div className="card text-center">
              <p className="text-lg font-bold">Olá! Eu sou o {assistente.nome} 👋</p>
              <p className="mt-1 text-slate-600">Me conte sua dúvida de {assistente.materia}. Vamos resolver juntos!</p>
            </div>
          )}
          {mensagens.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 ${m.role === "user" ? "bg-pipo-500 text-white" : "border border-slate-200 bg-white"}`}>
                {m.content}
              </div>
            </div>
          ))}
          {pensando && <p className="text-sm text-slate-500">{assistente.nome} está pensando…</p>}
          <div ref={fim} />
        </div>
      </main>

      <form onSubmit={enviar} className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl gap-2 px-4 py-3">
          <input className="input" aria-label="Sua mensagem" placeholder="Escreva sua dúvida…" value={texto} onChange={(e) => setTexto(e.target.value)} />
          <button className="btn-primary" disabled={pensando || !texto.trim()}>Enviar</button>
        </div>
      </form>
    </div>
  );
}
