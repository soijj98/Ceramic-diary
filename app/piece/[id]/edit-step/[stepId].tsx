
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ALL_STEP_TYPES,
  STEP_TYPE_FIELDS,
  STEP_TYPE_LABELS,
  StepPhoto,
  StepType,
} from "@/types";
import {
  deleteStepPhoto,
  getStepWithPhotos,
  pickPhoto,
  updateStep,
  uploadStepPhoto,
} from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { colors, radius, spacing } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { STORAGE_BUCKET } from "@/lib/supabase";

export default function EditStepScreen() {
  const { id, stepId } = useLocalSearchParams<{
    id: string;
    stepId: string;
  }>();

  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [stepType, setStepType] = useState<StepType>("muotoilu");
  const [note, setNote] = useState("");
  const [weight, setWeight] = useState("");
  const [kilnTemp, setKilnTemp] = useState("");
  const [firingProgram, setFiringProgram] = useState("");
  const [glazeName, setGlazeName] = useState("");
  const [glazeMethod, setGlazeMethod] = useState("");

  const [savedPhotos, setSavedPhotos] = useState<StepPhoto[]>([]);
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [removedPhotos, setRemovedPhotos] = useState<StepPhoto[]>([]);

  const fields = STEP_TYPE_FIELDS[stepType];

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (id) {
      router.replace(`/piece/${id}`);
    }
  };

  useEffect(() => {
    if (!stepId) {
      setErrorMsg("Vaiheen tunniste puuttuu.");
      setLoading(false);
      return;
    }

    let active = true;

    async function loadStep() {
      try {
        const step = await getStepWithPhotos(stepId);

        if (!active) return;

        if (step.piece_id !== id) {
          throw new Error("Vaihe ei kuulu tähän työhön.");
        }

        setStepType(step.step_type);
        setNote(step.note ?? "");
        setWeight(step.weight_g?.toString() ?? "");
        setKilnTemp(step.kiln_temp_c?.toString() ?? "");
        setFiringProgram(step.firing_program ?? "");
        setGlazeName(step.glaze_name ?? "");
        setGlazeMethod(step.glaze_application_method ?? "");
        setSavedPhotos(step.photos);
      } catch (err) {
        console.error(err);
        if (active) setErrorMsg("Vaiheen lataaminen epäonnistui.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStep();

    return () => {
      active = false;
    };
  }, [id, stepId]);

  async function addPhoto() {
    try {
      const uri = await pickPhoto();
      if (uri) setNewPhotos((prev) => [...prev, uri]);
    } catch (err) {
      console.error(err);
      setErrorMsg("Kuvan valitseminen epäonnistui.");
    }
  }

  function removeSavedPhoto(photo: StepPhoto) {
    setSavedPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setRemovedPhotos((prev) => [...prev, photo]);
  }

  function photoUrl(photo: StepPhoto) {
    return supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(photo.storage_path).data.publicUrl;
  }

  async function handleSave() {
    if (!stepId || !id || !user || saving) return;

    const parseNumber = (value: string) => {
      const trimmed = value.trim().replace(",", ".");
      if (!trimmed) return null;
      const parsed = Number(trimmed);
      if (!Number.isFinite(parsed)) {
        throw new Error("Tarkista numeroarvot.");
      }
      return parsed;
    };

    setSaving(true);
    setErrorMsg(null);

    try {
      await updateStep(stepId, {
        step_type: stepType,
        note: note.trim() || null,
        weight_g: fields.includes("weight") ? parseNumber(weight) : null,
        kiln_temp_c: fields.includes("kiln")
          ? parseNumber(kilnTemp)
          : null,
        firing_program: fields.includes("kiln")
          ? firingProgram.trim() || null
          : null,
        glaze_name: fields.includes("glaze")
          ? glazeName.trim() || null
          : null,
        glaze_application_method: fields.includes("glaze")
          ? glazeMethod.trim() || null
          : null,
      });

      for (const uri of newPhotos) {
        await uploadStepPhoto(stepId, user.id, uri);
      }

      for (const photo of removedPhotos) {
        await deleteStepPhoto(photo);
      }

      goBack();
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err instanceof Error ? err.message : "Tallennus epäonnistui."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.muted}>Ladataan vaihetta...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Pressable onPress={goBack} disabled={saving}>
        <Text style={styles.back}>← Takaisin</Text>
      </Pressable>

      <Text style={styles.title}>Muokkaa vaihetta</Text>

      <Text style={styles.label}>VAIHE</Text>
      <View style={styles.chips}>
        {ALL_STEP_TYPES.map((type) => (
          <Pressable
            key={type}
            disabled={saving}
            onPress={() => setStepType(type)}
            style={[
              styles.chip,
              stepType === type && styles.chipActive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                stepType === type && styles.chipTextActive,
              ]}
            >
              {STEP_TYPE_LABELS[type]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>KUVAT</Text>
      <ScrollView horizontal contentContainerStyle={styles.gallery}>
        <Pressable
          style={styles.addPhoto}
          onPress={addPhoto}
          disabled={saving}
        >
          <Text style={styles.plus}>+</Text>
        </Pressable>

        {savedPhotos.map((photo) => (
          <View key={photo.id} style={styles.photoWrapper}>
            <Image
              source={{ uri: photoUrl(photo) }}
              style={styles.photo}
            />
            <Pressable
              style={styles.remove}
              onPress={() => removeSavedPhoto(photo)}
              disabled={saving}
            >
              <Text style={styles.removeText}>×</Text>
            </Pressable>
          </View>
        ))}

        {newPhotos.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.photoWrapper}>
            <Image source={{ uri }} style={styles.photo} />
            <Pressable
              style={styles.remove}
              disabled={saving}
              onPress={() =>
                setNewPhotos((prev) =>
                  prev.filter((_, i) => i !== index)
                )
              }
            >
              <Text style={styles.removeText}>×</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.label}>MUISTIINPANO</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={note}
        onChangeText={setNote}
        multiline
        editable={!saving}
        placeholder="Mitä teit tässä vaiheessa?"
        placeholderTextColor={colors.textMuted}
      />

      {fields.includes("weight") && (
        <>
          <Text style={styles.label}>PAINO (G)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            editable={!saving}
          />
        </>
      )}

      {fields.includes("kiln") && (
        <>
          <Text style={styles.label}>UUNILÄMPÖTILA (°C)</Text>
          <TextInput
            style={styles.input}
            value={kilnTemp}
            onChangeText={setKilnTemp}
            keyboardType="numeric"
            editable={!saving}
          />

          <Text style={styles.label}>POLTTO-OHJELMA</Text>
          <TextInput
            style={styles.input}
            value={firingProgram}
            onChangeText={setFiringProgram}
            editable={!saving}
          />
        </>
      )}

      {fields.includes("glaze") && (
        <>
          <Text style={styles.label}>LASITE / ENKOOPIN NIMI</Text>
          <TextInput
            style={styles.input}
            value={glazeName}
            onChangeText={setGlazeName}
            editable={!saving}
          />

          <Text style={styles.label}>LEVITYSTAPA</Text>
          <TextInput
            style={styles.input}
            value={glazeMethod}
            onChangeText={setGlazeMethod}
            editable={!saving}
          />
        </>
      )}

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <Pressable
        style={[styles.saveButton, saving && styles.disabled]}
        onPress={handleSave}
        disabled={saving || !!errorMsg && !stepId}
      >
        <Text style={styles.saveText}>
          {saving ? "Tallennetaan..." : "Tallenna muutokset"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  muted: { color: colors.textMuted },
  back: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.md,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accentDark,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFF8EE",
  },
  gallery: {
    gap: spacing.sm,
    alignItems: "center",
  },
  addPhoto: {
    width: 88,
    height: 88,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontSize: 30,
    color: colors.accent,
  },
  photoWrapper: {
    position: "relative",
  },
  photo: {
    width: 88,
    height: 88,
    borderRadius: radius.sm,
  },
  remove: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  error: {
    color: colors.danger,
    marginTop: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.accentDark,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  saveText: {
    color: "#FFF8EE",
    fontSize: 16,
    fontWeight: "700",
  },
});
