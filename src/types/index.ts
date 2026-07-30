export type StepType =
  | "muotoilu"
  | "kuivatus"
  | "raakapoltto"
  | "enkoopointi"
  | "lasitus"
  | "lasipoltto"
  | "muu";

export const STEP_TYPE_LABELS: Record<StepType, string> = {
  muotoilu: "Muotoilu",
  kuivatus: "Kuivatus",
  raakapoltto: "Raakapoltto",
  enkoopointi: "Enkoopointi",
  lasitus: "Lasitus",
  lasipoltto: "Lasipoltto",
  muu: "Muu vaihe",
};

// Which optional fields make sense to show for each step type.
// Used to drive the "Lisää vaihe" form.
export const STEP_TYPE_FIELDS: Record<
  StepType,
  Array<"weight" | "kiln" | "glaze">
> = {
  muotoilu: ["weight"],
  kuivatus: ["weight"],
  raakapoltto: ["kiln"],
  enkoopointi: ["glaze"],
  lasitus: ["glaze"],
  lasipoltto: ["kiln"],
  muu: ["weight", "kiln", "glaze"],
};

export interface Piece {
  id: string;
  title: string;
  clay_type: string | null;
  start_weight_g: number | null;
  cover_photo_path: string | null;
  created_at: string;
}

export interface Step {
  id: string;
  piece_id: string;
  step_type: StepType;
  note: string | null;
  weight_g: number | null;
  kiln_temp_c: number | null;
  firing_program: string | null;
  glaze_name: string | null;
  glaze_application_method: string | null;
  created_at: string;
}

export interface StepPhoto {
  id: string;
  step_id: string;
  storage_path: string;
  created_at: string;
}

// A step together with its photos, as used by the timeline view.
export interface StepWithPhotos extends Step {
  photos: StepPhoto[];
}
