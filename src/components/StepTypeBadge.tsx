import { StyleSheet, Text, View } from "react-native";
import { StepType, STEP_TYPE_LABELS } from "@/types";
import { colors } from "@/constants/theme";

const STEP_COLOR: Record<StepType, string> = {
  muotoilu: colors.accent,
  kuivatus: "#B99C7B",
  raakapoltto: "#8C4A3B",
  enkoopointi: "#3E5C63",
  lasitus: "#3E5C63",
  lasipoltto: "#8C4A3B",
  muu: colors.textMuted,
};

export function StepTypeBadge({ type }: { type: StepType }) {
  const color = STEP_COLOR[type];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{STEP_TYPE_LABELS[type]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  text: { fontSize: 12, fontWeight: "600" },
});
