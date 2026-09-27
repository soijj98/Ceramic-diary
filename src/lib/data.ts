import * as ImagePicker from "expo-image-picker";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { Idea, Piece, PieceStatus, Step, StepPhoto, StepType, StepWithPhotos } from "@/types";

// ---- Pieces ----

export async function listPieces(status?: PieceStatus): Promise<Piece[]> {
  let query = supabase.from("pieces").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPiece(id: string): Promise<Piece> {
  const { data, error } = await supabase.from("pieces").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createPiece(input: {
  title: string;
  description?: string;
  clay_type?: string;
  start_weight_g?: number;
}): Promise<Piece> {
  const { data, error } = await supabase
    .from("pieces")
    .insert({ ...input, status: "luonnos" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePieceStatus(id: string, status: PieceStatus): Promise<void> {
  const { error } = await supabase.from("pieces").update({ status }).eq("id", id);
  if (error) throw error;
}

// ---- Steps ----

export async function listStepsWithPhotos(pieceId: string): Promise<StepWithPhotos[]> {
  const { data: steps, error } = await supabase
    .from("steps")
    .select("*")
    .eq("piece_id", pieceId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  if (!steps || steps.length === 0) return [];

  const { data: photos, error: photosError } = await supabase
    .from("step_photos")
    .select("*")
    .in("step_id", steps.map((s) => s.id));
  if (photosError) throw photosError;

  return steps.map((step) => ({
    ...step,
    photos: (photos ?? []).filter((p: StepPhoto) => p.step_id === step.id),
  }));
}

export async function createStep(input: {
  piece_id: string;
  step_type: StepType;
  note?: string;
  weight_g?: number;
  kiln_temp_c?: number;
  firing_program?: string;
  glaze_name?: string;
  glaze_application_method?: string;
}): Promise<Step> {
  const { data, error } = await supabase.from("steps").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function deleteStep(stepId: string): Promise<void> {
  // Haetaan ensin kuvat
  const { data: photos, error: photosError } = await supabase
    .from("step_photos")
    .select("storage_path")
    .eq("step_id", stepId);

  if (photosError) throw photosError;

  // Poistetaan kuvat Storagesta
  if (photos && photos.length > 0) {
    const paths = photos.map((photo) => photo.storage_path);

    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(paths);

    if (storageError) throw storageError;
  }

  // Poistetaan step_photos-rivit
  const { error: photoRowsError } = await supabase
    .from("step_photos")
    .delete()
    .eq("step_id", stepId);

  if (photoRowsError) throw photoRowsError;

  // Lopuksi poistetaan itse vaihe
  const { error: stepError } = await supabase
    .from("steps")
    .delete()
    .eq("id", stepId);

  if (stepError) throw stepError;
}

export async function pickPhoto(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return result.assets[0].uri;
}

export async function uploadStepPhoto(
  stepId: string,
  ownerId: string,
  uri: string
): Promise<StepPhoto> {
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error(`Kuvan lukeminen epäonnistui: ${response.status}`);
  }

  const blob = await response.blob();

  const fileExt = uri.split(".").pop()?.split("?")[0] ?? "jpg";
  const storagePath = `${ownerId}/${stepId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data, error } = await supabase
    .from("step_photos")
    .insert({
      step_id: stepId,
      storage_path: storagePath,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
// ---- Ideas ----

export async function listIdeas(): Promise<Idea[]> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createIdea(input: {
  title: string;
  note?: string;
  link?: string;
}): Promise<Idea> {
  const { data, error } = await supabase.from("ideas").insert(input).select().single();
  if (error) throw error;
  return data;
}
