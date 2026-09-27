import { Pressable, StyleSheet, Text, View } from "react-native";
import { Idea } from "@/types";
import { colors, radius, spacing } from "@/constants/theme";

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <View style={styles.card}>
      <View style={styles.swatch} />
      <Text style={styles.title} numberOfLines={2}>{idea.title}</Text>
      {idea.note ? (
        <Text style={styles.note} numberOfLines={2}>{idea.note}</Text>
      ) : null}
      {idea.link ? (
        <Text style={styles.link} numberOfLines={1}>{idea.link}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    margin: spacing.xs,
  },
  swatch: {
    height: 90,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.xs,
  },
  title: { fontSize: 13, fontWeight: "700", color: colors.text },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  link: { fontSize: 11, color: colors.accent, marginTop: 4 },
});
