import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://twelmnurbonnttwtsxzk.supabase.co";

const supabaseKey = "sb_publishable_uihaTd8UB0mnddI4YC8gMw_qQJmMDwI";

export const supabase = createClient(supabaseUrl, supabaseKey);
