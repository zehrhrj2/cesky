import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          lang: "ua" | "ru";
          xp: number;
          streak: number;
          words_learned: number;
          lessons_completed: number;
          completed_units: string[];
          last_active: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      word_progress: {
        Row: {
          id: string;
          user_id: string;
          word_cz: string;
          lesson_id: string;
          difficulty: "easy" | "medium" | "hard";
          next_review: string;
          review_count: number;
          created_at: string;
        };
      };
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          mode: string;
          messages: { role: string; text: string }[];
          created_at: string;
        };
      };
    };
  };
};

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
}

export async function upsertProfile(profile: Partial<Database["public"]["Tables"]["profiles"]["Insert"]> & { id: string }) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id" })
    .select()
    .single();
  return { data, error };
}

export async function syncProgress(
  userId: string,
  updates: {
    xp?: number;
    streak?: number;
    words_learned?: number;
    lessons_completed?: number;
    completed_units?: string[];
  }
) {
  return supabase
    .from("profiles")
    .update({ ...updates, last_active: new Date().toISOString() })
    .eq("id", userId);
}
