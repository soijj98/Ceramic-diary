import * as ImagePicker from "expo-image-picker";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { Piece, Step, StepPhoto, StepWithPhotos, StepType } from "@/types";

export async function listPieces(): Promise<Piece[]> {
  const { data, error } = await supabase
    .from("pieces")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createPiece(input: {
  title: string;
  clay_type?: string;
  start_weight_g?: number;
}): Promise<Piece> {
  const { data, error } = await supabase
    .from("pieces")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getPiece(id: string): Promise<Piece> {
  const { data, error } = await supabase
    .from("pieces")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function listStepsWithPhotos(
  pieceId: string
): Promise<StepWithPhotos[]> {
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
    .in(
      "step_id",
      steps.map((s) => s.id)
    );
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
  const { data, error } = await supabase
    .from("steps")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Lets the user pick a photo from their library and uploads it to
// Supabase Storage under the given step, recording it in step_photos.
export async function pickAndUploadPhoto(stepId: string): Promise<StepPhoto | null> {
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
  const storagePath = `${stepId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: asset.mimeType ?? "image/jpeg",
    });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("step_photos")
    .insert({ step_id: stepId, storage_path: storagePath })
    .select()
    .single();
  if (error) throw error;
  return data;
}
