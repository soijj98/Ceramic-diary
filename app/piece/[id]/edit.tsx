
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getPiece, updatePiece } from "@/lib/data";
import { colors, radius, spacing } from "@/constants/theme";

export default function EditPieceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clayType, setClayType] = useState("");
  const [startWeight, setStartWeight] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPiece() {
      if (!id) {
        setErrorMsg("Työn tunniste puuttuu.");
        setLoading(false);
        return;
      }

      try {
        const piece = await getPiece(id);
        if (!active) return;

        setTitle(piece.title);
        setDescription(piece.description ?? "");
        setClayType(piece.clay_type ?? "");
        setStartWeight(piece.start_weight_g?.toString() ?? "");
      } catch (err) {
        console.error(err);
        if (active) {
          setErrorMsg("Työn tietojen lataaminen epäonnistui.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPiece();

    return () => {
      active = false;
    };
  }, [id]);

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else if (id) {
      router.replace(`/piece/${id}`);
    }
  }

  async function handleSave() {
    if (!id || saving) return;

    if (!title.trim()) {
      setErrorMsg("Anna työlle nimi.");
      return;
    }

    const weightText = startWeight.trim().replace(",", ".");
    const weight = weightText ? Number(weightText) : null;

    if (
      weight !== null &&
      (!Number.isFinite(weight) || weight < 0)
    ) {
      setErrorMsg("Anna kelvollinen alkupaino.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      await updatePiece(id, {
        title: title.trim(),
        description: description.trim() || null,
        clay_type: clayType.trim() || null,
        start_weight_g: weight,
      });

      goBack();
    } catch (err) {
      console.error(err);
      setErrorMsg("Muutosten tallennus epäonnistui.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.loadingText}>Ladataan työn tietoja...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={goBack} disabled={saving} hitSlop={8}>
        <Text style={styles.back}>← Takaisin</Text>
      </Pressable>

      <Text style={styles.title}>Muokkaa työtä</Text>

      <Text style={styles.label}>Nimi</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Esim. Kahvikuppi"
        placeholderTextColor={colors.textMuted}
        editable={!saving}
      />

      <Text style={styles.label}>Kuvaus</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder="Lyhyt kuvaus projektista"
        placeholderTextColor={colors.textMuted}
        multiline
        editable={!saving}
      />

      <Text style={styles.label}>Savityyppi</Text>
      <TextInput
        style={styles.input}
        value={clayType}
        onChangeText={setClayType}
        placeholder="Esim. Kivitavara (800)"
        placeholderTextColor={colors.textMuted}
        editable={!saving}
      />

      <Text style={styles.label}>Alkupaino (g)</Text>
      <TextInput
        style={styles.input}
        value={startWeight}
        onChangeText={setStartWeight}
        keyboardType="decimal-pad"
        placeholder="Esim. 600"
        placeholderTextColor={colors.textMuted}
        editable={!saving}
      />

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <Pressable
        style={[styles.button, saving && styles.disabled]}
        onPress={handleSave}
        disabled={saving || !id}
      >
        <Text style={styles.buttonText}>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textMuted,
  },
  back: {
    color: colors.accent,
    fontWeight: "600",
    fontSize: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
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
  multiline: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  error: {
    color: colors.danger,
    marginTop: spacing.md,
  },
  button: {
    backgroundColor: colors.accentDark,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFF8EE",
    fontWeight: "700",
    fontSize: 16,
  },
});
