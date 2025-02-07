import { createClient } from "@supabase/supabase-js";

export const sup = createClient(
  process.env.NEXT_PUBLIC_SUP_PROJECT_URL!,
  process.env.NEXT_PUBLIC_SUP_CLIENT_KEY!
);
