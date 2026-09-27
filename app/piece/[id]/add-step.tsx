import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ALL_STEP_TYPES, StepType, STEP_TYPE_FIELDS, STEP_TYPE_LABELS } from "@/types";
import { createStep, pickPhoto, uploadStepPhoto } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { colors, radius, spacing } from "@/constants/theme";

export default function AddStepScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [stepType, setStepType] = useState<StepType>("muotoilu");
  const [note, setNote] = useState("");
  const [weight, setWeight] = useState("");
  const [kilnTemp, setKilnTemp] = useState("");
  const [firingProgram, setFiringProgram] = useState("");
  const [glazeName, setGlazeName] = useState("");
  const [glazeMethod, setGlazeMethod] = useState("");
  const [photoCount, setPhotoCount] = useState(0);

  const [localPhotos, setLocalPhotos] = useState<string[]>([])
  
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingStepId, setPendingStepId] = useState<string | null>(null);

  const fields = STEP_TYPE_FIELDS[stepType];

  async function handleSave() {
    if (!id || !user) return;
    setSaving(true);
    setErrorMsg(null);
    try {
      const step = await createStep({
        piece_id: id,
        step_type: stepType,
        note: note.trim() || undefined,
        weight_g: fields.includes("weight") && weight ? Number(weight) : undefined,
        kiln_temp_c: fields.includes("kiln") && kilnTemp ? Number(kilnTemp) : undefined,
        firing_program: fields.includes("kiln") ? firingProgram.trim() || undefined : undefined,
        glaze_name: fields.includes("glaze") ? glazeName.trim() || undefined : undefined,
        glaze_application_method: fields.includes("glaze") ? glazeMethod.trim() || undefined : undefined,
      });

      if (localPhotos.length > 0) {
        await Promise.all(
          localPhotos.map((uri) => uploadStepPhoto(step.id, user.id, uri))
        );
      }

      router.back()

      //setPendingStepId(step.id);
    } catch (err) {
      setErrorMsg("Vaiheen tai kuvien tallennus epäonnistui.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddPhoto() {
    //if (!pendingStepId || !user) return;
    
    try {
      const uri = await pickPhoto();
      if (uri) {
        setLocalPhotos((prev) => [...prev, uri]);
      }
    } catch (err) {
      setErrorMsg("Kuvan lataus epäonnistui.");
      console.error(err);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.back}>← Takaisin</Text>
      </Pressable>
      <Text style={styles.pageTitle}>Lisää vaihe</Text>

     <Text style={styles.label}>VAIHE</Text>
     <View style={styles.chipRow}>
          {ALL_STEP_TYPES.map((type) => {
            const active = type === stepType;
            return (
              <Pressable
                key={type}
                onPress={() => setStepType(type)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {STEP_TYPE_LABELS[type]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>MUISTIINPANO</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={note}
          onChangeText={setNote}
          placeholder="Mitä teit tässä vaiheessa?"
          placeholderTextColor={colors.textMuted}
          multiline
        />

        {fields.includes("weight") && (
          <>
            <Text style={styles.label}>PAINO (G)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="Esim. 410"
              placeholderTextColor={colors.textMuted}
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
              placeholder="Esim. 1000"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>POLTTOPOHJELMA</Text>
            <TextInput
              style={styles.input}
              value={firingProgram}
              onChangeText={setFiringProgram}
              placeholder="Esim. Hidas nosto, 8h"
              placeholderTextColor={colors.textMuted}
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
              placeholder="Esim. P30"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>LEVITYSTAPA</Text>
            <TextInput
              style={styles.input}
              value={glazeMethod}
              onChangeText={setGlazeMethod}
              placeholder="Esim. Kastaminen, sivellin, ruiskutus"
              placeholderTextColor={colors.textMuted}
            />
          </>
        )}

        <Text style={styles.label}>KUVAT</Text>
        <Pressable style={styles.secondaryButton} onPress={handleAddPhoto}>
          <Text style={styles.secondaryButtonText}>
            {localPhotos.length > 0 ? `+ Lisää kuva (${localPhotos.length} valittu)` : "+ Lisää kuva" }
          </Text>
        </Pressable>

        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      
        <Pressable style={styles.button} onPress={handleSave} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? "Tallennetaan..." : "Tallenna vaihe" }</Text>
        </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  back: { color: colors.accent, fontWeight: "600", fontSize: 15 },
  pageTitle: { fontSize: 24, fontWeight: "800", color: colors.text, marginTop: spacing.sm, marginBottom: spacing.sm },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, color: colors.textMuted, marginBottom: spacing.xs, marginTop: spacing.md },
  savedNote: { fontSize: 15, color: colors.text, marginBottom: spacing.md, lineHeight: 21 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  multiline: { minHeight: 90, textAlignVertical: "top" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipActive: { backgroundColor: colors.accentDark, borderColor: colors.accentDark },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.text },
  chipTextActive: { color: "#FFF8EE" },
  error: { color: colors.danger, marginTop: spacing.md },
  button: {
    backgroundColor: colors.accentDark,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonText: { color: "#FFF8EE", fontWeight: "700", fontSize: 16 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  secondaryButtonText: { color: colors.accent, fontWeight: "600" },
});
