-- Pipo Education: estrutura inicial

create table public.assistentes (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null,
  materia text not null,
  serie text not null,
  instrucoes text not null,
  modelo text not null default 'claude-opus-5-5'
    check (modelo in ('claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5')),
  codigo text not null unique check (codigo ~ '^[A-Z0-9]{6}$'),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create index assistentes_professor_idx on public.assistentes (professor_id);

alter table public.assistentes enable row level security;

-- Cada professor ve e mexe so nos proprios assistentes
create policy "professor le os seus" on public.assistentes
  for select using (professor_id = auth.uid());
create policy "professor cria" on public.assistentes
  for insert with check (professor_id = auth.uid());
create policy "professor edita os seus" on public.assistentes
  for update using (professor_id = auth.uid()) with check (professor_id = auth.uid());
create policy "professor exclui os seus" on public.assistentes
  for delete using (professor_id = auth.uid());

-- Aluno (sem login) so enxerga nome/materia/serie pelo codigo; instrucoes ficam escondidas
create or replace function public.assistente_por_codigo(p_codigo text)
returns table (nome text, materia text, serie text, codigo text)
language sql
security definer
set search_path = public
as $$
  select a.nome, a.materia, a.serie, a.codigo
  from public.assistentes a
  where a.codigo = upper(p_codigo) and a.ativo;
$$;

grant execute on function public.assistente_por_codigo(text) to anon, authenticated;
