import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Sem .env configurado o app roda em modo demo (localStorage, IA simulada).
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const modoDemo = supabase === null;
