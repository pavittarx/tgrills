import {createClient} from "@supabase/supabase-js";
import { SUP_CLIENT_KEY, SUP_PROJECT_URL } from "../app/config";

export const sup = createClient(SUP_PROJECT_URL!, SUP_CLIENT_KEY!);