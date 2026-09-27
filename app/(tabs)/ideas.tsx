import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Idea } from "@/types";
import { createIdea, listIdeas } from "@/lib/data";
import { IdeaCard } from "@/components/IdeaCard";
import { colors, radius, spacing } from "@/constants/theme";

export default function IdeasScreen() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIdeas(await listIdeas());
    } catch (err) {
      console.error(err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleSave() {
    if (!title.trim()) {
      setErrorMsg("Anna idealle nimi.");
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      await createIdea({
        title: title.trim(),
        note: note.trim() || undefined,
        link: link.trim() || undefined,
      });
      setTitle("");
      setNote("");
      setLink("");
      setShowForm(false);
      load();
    } catch (err) {
      setErrorMsg("Idean tallennus epäonnistui.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ideat</Text>
        <Pressable style={styles.addButton} onPress={() => setShowForm((v) => !v)}>
          <Text style={styles.addButtonText}>{showForm ? "Sulje" : "+ Uusi idea"}</Text>
        </Pressable>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Idean nimi"
            placeholderTextColor={colors.textMuted}
          />
          <TextInput
            style={[styles.input, styles.multiline]}
            value={note}
            onChangeText={setNote}
            placeholder="Muistiinpano (valinnainen)"
            placeholderTextColor={colors.textMuted}
            multiline
          />
          <TextInput
            style={styles.input}
            value={link}
            onChangeText={setLink}
            placeholder="Linkki, esim. Pinterest (valinnainen)"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
          />
          {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
          <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? "Tallennetaan…" : "Tallenna idea"}</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={ideas}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <IdeaCard idea={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Ei vielä ideoita. Lisää ensimmäinen yllä olevasta napista.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "800", color: colors.text },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addButtonText: { color: "#FFF8EE", fontWeight: "700", fontSize: 13 },
  form: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  multiline: { minHeight: 60, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: colors.accentDark,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF8EE", fontWeight: "700" },
  error: { color: colors.danger },
  list: { paddingTop: spacing.md, paddingBottom: 32 },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: spacing.xl },
});
