-- Brief de descubrimiento — tabla única de respuestas + RPC de guardado atómico.
-- Re-ejecutable (idempotente): pegar completo en el SQL Editor de Supabase.
--
-- Decisiones de diseño:
--  - answers en jsonb, NO tabla por pregunta: el esquema de preguntas cambia
--    entre clientes; la estructura la garantiza Zod en la capa de aplicación.
--  - El merge de respuestas ocurre EN Postgres (answers || patch) vía el RPC
--    brief_save_answers: 3-4 personas llenan el formulario a la vez desde el
--    mismo enlace y un read-modify-write en la aplicación perdería claves.
--  - updated_at lo mantiene un trigger (moddatetime): ningún path de
--    escritura puede olvidarlo.
--  - RLS activo sin políticas: todo acceso ocurre desde el servidor con la
--    service key. El anon key no puede leer ni escribir nada.

create table if not exists brief_responses (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed')),
  contact_name text,
  contact_email text,
  organization text not null default 'Sin especificar',
  answers jsonb not null default '{}'::jsonb,
  progress smallint not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- El UNIQUE de token ya crea su índice; no se duplica.
create index if not exists brief_responses_status_created_idx
  on brief_responses (status, created_at desc);

alter table brief_responses enable row level security;

-- updated_at automático en todo UPDATE, venga de donde venga.
create extension if not exists moddatetime with schema extensions;
drop trigger if exists brief_responses_updated_at on brief_responses;
create trigger brief_responses_updated_at
  before update on brief_responses
  for each row execute function extensions.moddatetime(updated_at);

-- Guardado atómico: merge del jsonb en un solo UPDATE. Devuelve la fila
-- actualizada, o ninguna si la respuesta no existe o ya fue enviada
-- (la aplicación distingue ambos casos releyendo por token).
create or replace function brief_save_answers(
  p_token text,
  p_answers jsonb,
  p_progress smallint,
  p_contact_name text default null,
  p_contact_email text default null
) returns setof brief_responses
language sql
security invoker
set search_path = public
as $$
  update brief_responses
     set answers = answers || coalesce(p_answers, '{}'::jsonb),
         progress = greatest(0, least(100, p_progress)),
         contact_name = coalesce(p_contact_name, contact_name),
         contact_email = coalesce(p_contact_email, contact_email)
   where token = p_token
     and status = 'in_progress'
  returning *;
$$;

-- Solo el servidor (service role) puede ejecutar el RPC.
revoke all on function brief_save_answers(text, jsonb, smallint, text, text)
  from public, anon, authenticated;
