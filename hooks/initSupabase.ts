import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "@env";
// Better put your these secret keys in .env file

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;