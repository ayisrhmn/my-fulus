import { createClient } from "@supabase/supabase-js";

// Service-role client. Server-only: it bypasses RLS, so every query MUST
// scope by `user_id` explicitly. Never import this from client code — the
// service role key is not a NEXT_PUBLIC var and must never reach the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
