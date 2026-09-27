export type PieceStatus = "luonnos" | "aktiivinen" | "valmis";

export const PIECE_STATUS_LABELS: Record<PieceStatus, string> = {
  luonnos: "Luonnos",
  aktiivinen: "Aktiivinen",
  valmis: "Valmis",
};

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

export const ALL_STEP_TYPES = Object.keys(STEP_TYPE_LABELS) as StepType[];

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
  owner_id: string;
  title: string;
  description: string | null;
  status: PieceStatus;
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

export interface StepWithPhotos extends Step {
  photos: StepPhoto[];
}

export interface Idea {
  id: string;
  owner_id: string;
  title: string;
  note: string | null;
  link: string | null;
  storage_path: string | null;
  created_at: string;
}
