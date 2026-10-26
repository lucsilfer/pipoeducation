import { supabase } from "./supabase";

export const MODELOS = [
  { id: "claude-opus-5-5", nome: "Claude Opus 5.5", desc: "Mais inteligente, ideal para explicações profundas" },
  { id: "claude-sonnet-5-5", nome: "Claude Sonnet 5.5", desc: "Equilíbrio entre qualidade e velocidade" },
  { id: "claude-haiku-5-5", nome: "Claude Haiku 5.5", desc: "Rápido e econômico, ótimo para exercícios" },
] as const;

export const SERIES = [
  "1º ano EF", "2º ano EF", "3º ano EF", "4º ano EF", "5º ano EF",
  "6º ano EF", "7º ano EF", "8º ano EF", "9º ano EF",
  "1º ano EM", "2º ano EM", "3º ano EM",
];

export type Assistente = {
  id: string;
  nome: string;
  materia: string;
  serie: string;
  instrucoes: string;
  modelo: string;
  codigo: string;
  ativo: boolean;
  created_at: string;
};

export type AssistentePublico = Pick<Assistente, "nome" | "materia" | "serie" | "codigo">;

export type Mensagem = { role: "user" | "assistant"; content: string };

export type NovoAssistente = Omit<Assistente, "id" | "codigo" | "created_at">;

function gerarCodigo() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => letras[Math.floor(Math.random() * letras.length)]).join("");
}

// ---------- Modo demo (localStorage) ----------
const CHAVE = "pipo-demo-assistentes";

function lerDemo(): Assistente[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
  } catch {
    return [];
  }
}

function salvarDemo(lista: Assistente[]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {
    /* navegador sem storage: segue só em memória */
  }
}

// ---------- API usada pelas telas ----------
export async function listarAssistentes(): Promise<Assistente[]> {
  if (!supabase) return lerDemo();
  const { data, error } = await supabase
    .from("assistentes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Assistente[];
}

export async function buscarAssistente(id: string): Promise<Assistente | null> {
  if (!supabase) return lerDemo().find((a) => a.id === id) ?? null;
  const { data, error } = await supabase.from("assistentes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Assistente | null;
}

export async function salvarAssistente(dados: NovoAssistente, id?: string): Promise<Assistente> {
  if (!supabase) {
    const lista = lerDemo();
    if (id) {
      const i = lista.findIndex((a) => a.id === id);
      lista[i] = { ...lista[i], ...dados };
      salvarDemo(lista);
      return lista[i];
    }
    const novo: Assistente = {
      ...dados,
      id: crypto.randomUUID(),
      codigo: gerarCodigo(),
      created_at: new Date().toISOString(),
    };
    salvarDemo([novo, ...lista]);
    return novo;
  }
  const query = id
    ? supabase.from("assistentes").update(dados).eq("id", id)
    : supabase.from("assistentes").insert({ ...dados, codigo: gerarCodigo() });
  const { data, error } = await query.select().single();
  if (error) throw error;
  return data as Assistente;
}

export async function excluirAssistente(id: string) {
  if (!supabase) {
    salvarDemo(lerDemo().filter((a) => a.id !== id));
    return;
  }
  const { error } = await supabase.from("assistentes").delete().eq("id", id);
  if (error) throw error;
}

export async function assistentePorCodigo(codigo: string): Promise<AssistentePublico | null> {
  const cod = codigo.trim().toUpperCase();
  if (!supabase) {
    const a = lerDemo().find((x) => x.codigo === cod && x.ativo);
    return a ? { nome: a.nome, materia: a.materia, serie: a.serie, codigo: a.codigo } : null;
  }
  const { data, error } = await supabase.rpc("assistente_por_codigo", { p_codigo: cod });
  if (error) throw error;
  return (data?.[0] as AssistentePublico) ?? null;
}

export async function enviarMensagem(codigo: string, mensagens: Mensagem[]): Promise<string> {
  if (!supabase) {
    await new Promise((r) => setTimeout(r, 700));
    return "🤖 (Modo demo) Aqui a IA responderia ao aluno seguindo as instruções do professor. Configure o Supabase e a chave da Anthropic para respostas reais.";
  }
  const { data, error } = await supabase.functions.invoke("chat", {
    body: { codigo, mensagens },
  });
  if (error) throw error;
  return (data as { resposta: string }).resposta;
}
