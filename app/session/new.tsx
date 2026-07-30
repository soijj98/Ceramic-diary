import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ALL_CATEGORIES, Category, CATEGORY_LABELS, Mood } from "@/types";
import { createSession, pickAndUploadSessionPhoto } from "@/lib/data";
import { MoodPicker } from "@/components/MoodPicker";
import { colors, radius, spacing } from "@/constants/theme";

export default function NewSessionScreen() {
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("wheel");
  const [clayBody, setClayBody] = useState("");
  const [technique, setTechnique] = useState("");
  const [firingTemp, setFiringTemp] = useState("");
  const [glaze, setGlaze] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [photoCount, setPhotoCount] = useState(0);

  async function handleSave() {
    if (!title.trim()) {
      setErrorMsg("Kirjoita ensin mitä teit.");
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      const session = await createSession({
        title: title.trim(),
        category,
        clay_body: clayBody.trim() || undefined,
        technique: technique.trim() || undefined,
        firing_temp: firingTemp.trim() || undefined,
        glaze: glaze.trim() || undefined,
        mood: mood ?? undefined,
        notes: notes.trim() || undefined,
      });
      setSavedSessionId(session.id);
    } catch (err) {
      setErrorMsg("Tallennus epäonnistui. Yritä uudelleen.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddPhoto() {
    if (!savedSessionId) return;
    try {
      const photo = await pickAndUploadSessionPhoto(savedSessionId);
      if (photo) setPhotoCount((c) => c + 1);
    } catch (err) {
      setErrorMsg("Kuvan lataus epäonnistui.");
      console.error(err);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.pageTitle}>New Session</Text>
      <Text style={styles.date}>{today}</Text>
      <View style={styles.divider} />

      {!savedSessionId ? (
        <>
          <Text style={styles.label}>WHAT DID YOU MAKE?</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Trimming the bowl set"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>CATEGORY</Text>
          <View style={styles.chipRow}>
            {ALL_CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {CATEGORY_LABELS[c]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>CLAY BODY</Text>
              <TextInput
                style={styles.input}
                value={clayBody}
                onChangeText={setClayBody}
                placeholder="e.g. Stoneware 202"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>TECHNIQUE</Text>
              <TextInput
                style={styles.input}
                value={technique}
                onChangeText={setTechnique}
                placeholder="e.g. Wheel thrown"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>FIRING TEMP</Text>
              <TextInput
                style={styles.input}
                value={firingTemp}
                onChangeText={setFiringTemp}
                placeholder="e.g. Cone 10"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>GLAZE</Text>
              <TextInput
                style={styles.input}
                value={glaze}
                onChangeText={setGlaze}
                placeholder="e.g. Tenmoku"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <Text style={styles.label}>HOW DID IT GO?</Text>
          <MoodPicker value={mood} onChange={setMood} />

          <Text style={styles.label}>SESSION NOTES</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={notes}
            onChangeText={setNotes}
            placeholder="What worked, what didn't, observations, ideas for next time…"
            placeholderTextColor={colors.textMuted}
            multiline
          />

          {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

          <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveButtonText}>
              {saving ? "Saving…" : "Save to Clay Book"}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.label}>SAVED</Text>
          <Text style={styles.savedNote}>
            Merkintä tallennettu. Lisää siihen kuvia halutessasi, tai jatka suoraan
            Clay Bookiin.
          </Text>

          <Pressable style={styles.secondaryButton} onPress={handleAddPhoto}>
            <Text style={styles.secondaryButtonText}>
              {photoCount > 0 ? `+ Add photo (${photoCount} added)` : "+ Add photo"}
            </Text>
          </Pressable>

          {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

          <Pressable style={styles.saveButton} onPress={() => router.replace("/(tabs)")}>
            <Text style={styles.saveButtonText}>Done</Text>
          </Pressable>
        </>
      )}
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
    paddingBottom: spacing.xl,
  },
  back: {
    color: colors.accent,
    fontWeight: "600",
    fontSize: 15,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.sm,
  },
  date: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
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
    minHeight: 100,
    textAlignVertical: "top",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipActive: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accentDark,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  chipTextActive: {
    color: "#FFF8EE",
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  col: {
    flex: 1,
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
    marginTop: spacing.lg,
  },
  saveButtonText: {
    color: "#FFF8EE",
    fontWeight: "700",
    fontSize: 16,
  },
  savedNote: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    marginTop: spacing.md,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontWeight: "600",
  },
});