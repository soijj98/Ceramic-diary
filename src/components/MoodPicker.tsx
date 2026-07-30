import { Pressable, StyleSheet, Text, View } from "react-native";
import { ALL_MOODS, Mood, MOOD_META } from "@/types";
import { colors, radius, spacing } from "@/constants/theme";

export function MoodPicker({
  value,
  onChange,
}: {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}) {
  return (
    <View style={styles.grid}>
      {ALL_MOODS.map((mood) => {
        const active = value === mood;
        const meta = MOOD_META[mood];
        return (
          <Pressable
            key={mood}
            onPress={() => onChange(mood)}
            style={[styles.box, active && styles.boxActive]}
          >
            <Text style={styles.emoji}>{meta.emoji}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  box: {
    width: "47%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  boxActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  emoji: {
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.accentDark,
  },
});