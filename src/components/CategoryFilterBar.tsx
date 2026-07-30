import { ScrollView, Pressable, StyleSheet, Text } from "react-native";
import { ALL_CATEGORIES, Category, CATEGORY_LABELS } from "@/types";
import { colors, radius, spacing } from "@/constants/theme";

export function CategoryFilterBar({
  value,
  onChange,
}: {
  value: Category | "all";
  onChange: (value: Category | "all") => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Pill label="All" active={value === "all"} onPress={() => onChange("all")} />
      {ALL_CATEGORIES.map((category) => (
        <Pill
          key={category}
          label={CATEGORY_LABELS[category]}
          active={value === category}
          onPress={() => onChange(category)}
        />
      ))}
    </ScrollView>
  );
}

function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
    >
      <Text style={[styles.pillText, active ? styles.pillTextActive : styles.pillTextInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: spacing.xs,
  },
  pillActive: {
    backgroundColor: colors.accentDark,
  },
  pillInactive: {
    backgroundColor: colors.surfaceMuted,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  pillTextActive: {
    color: "#FFF8EE",
  },
  pillTextInactive: {
    color: colors.text,
  },
});