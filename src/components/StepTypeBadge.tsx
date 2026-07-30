import { StyleSheet, Text, View } from "react-native";
import { StepType, STEP_TYPE_LABELS } from "@/types";
import { stepTypeColor } from "@/constants/theme";

export function StepTypeBadge({ type }: { type: StepType }) {
  const color = stepTypeColor[type];
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
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
