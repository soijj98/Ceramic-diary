import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { createPiece } from "@/lib/data";
import { colors, radius, spacing } from "@/constants/theme";

export default function NewPieceScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clayType, setClayType] = useState("");
  const [startWeight, setStartWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim()) {
      setErrorMsg("Anna työlle nimi.");
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const piece = await createPiece({
        title: title.trim(),
        description: description.trim() || undefined,
        clay_type: clayType.trim() || undefined,
        start_weight_g: startWeight ? Number(startWeight) : undefined,
      });
      router.replace(`/piece/${piece.id}`);
    } catch (err) {
      setErrorMsg("Tallennus epäonnistui. Yritä uudelleen.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.back}>← Takaisin</Text>
      </Pressable>

      <Text style={styles.title}>Uusi työ</Text>

      <Text style={styles.label}>Nimi</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Esim. Kahvikuppi"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Kuvaus</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder="Lyhyt kuvaus projektista"
        placeholderTextColor={colors.textMuted}
        multiline
      />

      <Text style={styles.label}>Savityyppi</Text>
      <TextInput
        style={styles.input}
        value={clayType}
        onChangeText={setClayType}
        placeholder="Esim. Kivitavara (800)"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Alkupaino (g)</Text>
      <TextInput
        style={styles.input}
        value={startWeight}
        onChangeText={setStartWeight}
        keyboardType="numeric"
        placeholder="Esim. 600"
        placeholderTextColor={colors.textMuted}
      />

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <Pressable style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? "Tallennetaan…" : "Tallenna"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  back: { color: colors.accent, fontWeight: "600", fontSize: 15 },
  title: { fontSize: 26, fontWeight: "800", color: colors.text, marginTop: spacing.md },
  label: { fontSize: 12, fontWeight: "700", color: colors.textMuted, marginBottom: spacing.xs, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  multiline: { minHeight: 70, textAlignVertical: "top" },
  error: { color: colors.danger, marginTop: spacing.md },
  button: {
    backgroundColor: colors.accentDark,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonText: { color: "#FFF8EE", fontWeight: "700", fontSize: 16 },
});
