import { createClient } from "@supabase/supabase-js";
import { setupURLPolyfill } from "react-native-url-polyfill";
import { SUPABASE_URL, SUPABASE_KEY } from "@env";

setupURLPolyfill();

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
  },
});

export default supabase;
