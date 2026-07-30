import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { createPiece } from "@/lib/data";
import { colors, radius, spacing } from "@/constants/theme";

export default function NewPieceScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [clayType, setClayType] = useState("");
  const [startWeight, setStartWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim()) {
      setErrorMsg("Anna kappaleelle nimi.");
      return;
    }
    setSaving(true);
    try {
      const piece = await createPiece({
        title: title.trim(),
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
    <View style={styles.container}>
      <Text style={styles.label}>Nimi</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Esim. Kahvikuppi #3"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Savityyppi</Text>
      <TextInput
        style={styles.input}
        value={clayType}
        onChangeText={setClayType}
        placeholder="Esim. Punasavi, Kivitavara"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Alkupaino (g)</Text>
      <TextInput
        style={styles.input}
        value={startWeight}
        onChangeText={setStartWeight}
        keyboardType="numeric"
        placeholder="Esim. 450"
        placeholderTextColor={colors.textMuted}
      />

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <Pressable style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? "Tallennetaan…" : "Tallenna"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
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
  error: {
    color: colors.danger,
    marginTop: spacing.md,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
