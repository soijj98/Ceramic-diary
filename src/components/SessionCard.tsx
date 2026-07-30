import { Pressable, StyleSheet, Text, View } from "react-native";
import { Session, CATEGORY_LABELS, MOOD_META } from "@/types";
import { colors, radius, spacing } from "@/constants/theme";

export function SessionCard({
  session,
  onPress,
}: {
  session: Session;
  onPress?: () => void;
}) {
  const date = new Date(session.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const moodEmoji = session.mood ? MOOD_META[session.mood].emoji : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {session.title}
        </Text>
        {moodEmoji && <Text style={styles.mood}>{moodEmoji}</Text>}
      </View>

      <Text style={styles.date}>{date}</Text>

      {session.notes ? (
        <Text style={styles.notes} numberOfLines={3}>
          {session.notes}
        </Text>
      ) : null}

      <View style={styles.footerRow}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryTagText}>
            {CATEGORY_LABELS[session.category].toUpperCase()}
          </Text>
        </View>
        {session.clay_body ? (
          <Text style={styles.clayBody} numberOfLines={1}>
            {session.clay_body}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginRight: spacing.sm,
  },
  mood: {
    fontSize: 18,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  categoryTag: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accentDark,
  },
  clayBody: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
});