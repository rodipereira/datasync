// Use environment variables so we can point the app to a local Supabase / Postgres
// instance when developing locally. Vite requires variables to be prefixed with
// VITE_ to be exposed to the browser (process.env.VITE_*).
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Prefer Vite env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). If they are
// not provided, fall back to bundled values to preserve current behavior.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://amdmertwiomzgcnxrojz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ||
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZG1lcnR3aW9temdjb2xueXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDI1NjUsImV4cCI6MjA2MjcxODU2NX0.q0QcoCQ0sLGH_vCFahKxcxm5noIzNoUBUzgzZChIRMg';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);