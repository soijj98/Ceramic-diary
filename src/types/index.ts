export type Category =
  | "wheel"
  | "handbuilding"
  | "glaze"
  | "firing"
  | "sketches"
  | "other";

export const CATEGORY_LABELS: Record<Category, string> = {
  wheel: "Wheel",
  handbuilding: "Handbuilding",
  glaze: "Glaze",
  firing: "Firing",
  sketches: "Sketches",
  other: "Other",
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export type Mood = "learning" | "in_flow" | "struggling" | "nailed_it";

export const MOOD_META: Record<Mood, { label: string; emoji: string }> = {
  learning: { label: "Learning", emoji: "🌱" },
  in_flow: { label: "In flow", emoji: "🔥" },
  struggling: { label: "Struggling", emoji: "💧" },
  nailed_it: { label: "Nailed it", emoji: "🎯" },
};

export const ALL_MOODS = Object.keys(MOOD_META) as Mood[];

export interface Session {
  id: string;
  title: string;
  category: Category;
  clay_body: string | null;
  technique: string | null;
  firing_temp: string | null;
  glaze: string | null;
  mood: Mood | null;
  notes: string | null;
  created_at: string;
}

export interface SessionPhoto {
  id: string;
  session_id: string;
  storage_path: string;
  created_at: string;
}

export interface SessionWithPhotos extends Session {
  photos: SessionPhoto[];
}
