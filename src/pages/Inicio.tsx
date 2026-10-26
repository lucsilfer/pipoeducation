import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const passos = [
  { t: "Crie seu assistente", d: "Defina matéria, série e como a IA deve ensinar: tom de voz, regras e conteúdo." },
  { t: "Compartilhe o código", d: "Cada assistente gera um código de 6 letras para os alunos entrarem, sem cadastro." },
  { t: "Alunos estudam com apoio", d: "A IA tira dúvidas e guia o raciocínio, sem entregar a resposta pronta." },
];

export default function Inicio() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pipo-50 to-white">
      <div className="mx-auto max-w-5xl px-4">
        <header className="flex items-center justify-between py-5">
          <Logo />
          <Link to="/entrar" className="btn-ghost">Sou professor</Link>
        </header>

        <section className="py-14 text-center sm:py-20">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Assistentes de IA criados por <span className="text-pipo-500">professores</span>, para os seus alunos
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Monte em minutos um tutor virtual para sua turma do Ensino Fundamental ou Médio,
            com as suas regras e o seu jeito de ensinar.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/painel/novo" className="btn-primary px-6 py-3 text-lg">Criar meu assistente</Link>
            <Link to="/aluno" className="btn border border-slate-300 bg-white px-6 py-3 text-lg hover:bg-slate-50">
              Sou aluno, tenho um código
            </Link>
          </div>
        </section>

        <section className="grid gap-4 pb-20 sm:grid-cols-3">
          {passos.map((p, i) => (
            <div key={p.t} className="card">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sol/20 font-extrabold text-amber-700">{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{p.t}</h3>
              <p className="mt-1 text-slate-600">{p.d}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
