import * as ImagePicker from "expo-image-picker";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { Category, Mood, Session, SessionPhoto, SessionWithPhotos } from "@/types";

export async function listSessions(category?: Category): Promise<Session[]> {
  let query = supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listSessionPhotos(
  sessionIds: string[]
): Promise<SessionPhoto[]> {
  if (sessionIds.length === 0) return [];
  const { data, error } = await supabase
    .from("session_photos")
    .select("*")
    .in("session_id", sessionIds);
  if (error) throw error;
  return data ?? [];
}

// Convenience helper for screens that want sessions + their photos
// in one call, e.g. a detail view.
export async function listSessionsWithPhotos(
  category?: Category
): Promise<SessionWithPhotos[]> {
  const sessions = await listSessions(category);
  const photos = await listSessionPhotos(sessions.map((s) => s.id));
  return sessions.map((session) => ({
    ...session,
    photos: photos.filter((p) => p.session_id === session.id),
  }));
}

export async function getSession(id: string): Promise<SessionWithPhotos> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  const photos = await listSessionPhotos([id]);
  return { ...data, photos };
}

export async function createSession(input: {
  title: string;
  category: Category;
  clay_body?: string;
  technique?: string;
  firing_temp?: string;
  glaze?: string;
  mood?: Mood;
  notes?: string;
}): Promise<Session> {
  const { data, error } = await supabase
    .from("sessions")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Lets the user pick a photo from their library and uploads it to
// Supabase Storage under the given session, recording it in
// session_photos.
export async function pickAndUploadSessionPhoto(
  sessionId: string
): Promise<SessionPhoto | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Kuvakirjaston käyttöoikeus puuttuu.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });
  if (result.canceled || result.assets.length === 0) return null;

  const asset = result.assets[0];
  const response = await fetch(asset.uri);
  const arrayBuffer = await response.arrayBuffer();
  const fileExt = asset.uri.split(".").pop() ?? "jpg";
  const storagePath = `${sessionId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: asset.mimeType ?? "image/jpeg",
    });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("session_photos")
    .insert({ session_id: sessionId, storage_path: storagePath })
    .select()
    .single();
  if (error) throw error;
  return data;
}