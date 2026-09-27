import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase-ympäristömuuttujat puuttuvat. Kopioi .env.example -> .env ja täytä " +
      "EXPO_PUBLIC_SUPABASE_URL sekä EXPO_PUBLIC_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const STORAGE_BUCKET = "ceramics-diary";

export async function photoUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, 60 * 60);

  if (error) {
    console.error("Kuvan URL:n luominen epäonnistui:", error);
    return null;
  }

  return data.signedUrl;
}