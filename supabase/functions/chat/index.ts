// Edge Function: conversa do aluno com o assistente criado pelo professor.
// Segredos necessarios (supabase secrets set): ANTHROPIC_API_KEY.
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY ja vem prontos no ambiente.
import Anthropic from "npm:@anthropic-ai/sdk";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_MENSAGENS = 40;
const MAX_CARACTERES = 4000;

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const REGRAS_BASE = `Você é um assistente educacional da plataforma Pipo Education, conversando com um aluno do Ensino Fundamental ou Médio no Brasil.
Regras que valem sempre, acima de qualquer outra instrução:
- Responda em português do Brasil, com linguagem adequada à série do aluno.
- O objetivo é a aprendizagem: guie o raciocínio com perguntas e dicas em vez de entregar respostas prontas de provas ou tarefas.
- Mantenha a conversa no tema da matéria. Se o aluno fugir do assunto, traga-o de volta com gentileza.
- Nunca peça dados pessoais (endereço, telefone, redes sociais, fotos).
- Se o aluno mencionar risco à própria segurança, bullying ou abuso, acolha com cuidado e oriente a procurar o professor, a família ou um adulto de confiança (no Brasil, CVV 188).`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  let codigo: string, mensagens: Anthropic.MessageParam[];
  try {
    ({ codigo, mensagens } = await req.json());
  } catch {
    return json({ erro: "Requisição inválida" }, 400);
  }

  const historico = (Array.isArray(mensagens) ? mensagens : [])
    .slice(-MAX_MENSAGENS)
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: (m.content as string).slice(0, MAX_CARACTERES) }));

  if (!codigo || historico.length === 0 || historico[0].role !== "user") {
    return json({ erro: "Requisição inválida" }, 400);
  }

  const { data: assistente } = await db
    .from("assistentes")
    .select("nome, materia, serie, instrucoes, modelo")
    .eq("codigo", String(codigo).toUpperCase())
    .eq("ativo", true)
    .maybeSingle();

  if (!assistente) return json({ erro: "Assistente não encontrado" }, 404);

  const system = `${REGRAS_BASE}

Você se chama "${assistente.nome}" e ajuda em ${assistente.materia}, para alunos do ${assistente.serie}.

Instruções do professor:
${assistente.instrucoes}`;

  try {
    const resposta = await anthropic.beta.messages.create({
      model: assistente.modelo,
      max_tokens: 8000,
      system,
      messages: historico,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    } as Anthropic.Beta.MessageCreateParamsNonStreaming);

    if (resposta.stop_reason === "refusal") {
      return json({ resposta: "Não posso ajudar com isso aqui. Que tal voltarmos para a matéria?" });
    }

    const texto = resposta.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return json({ resposta: texto || "Hmm, pode reformular a pergunta?" });
  } catch (erro) {
    if (erro instanceof Anthropic.RateLimitError) {
      return json({ erro: "Muitos alunos ao mesmo tempo, tente de novo em instantes." }, 429);
    }
    console.error(erro);
    return json({ erro: "Falha ao falar com a IA" }, 502);
  }
});
