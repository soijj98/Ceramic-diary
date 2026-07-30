import { Pressable, StyleSheet, Text, View } from "react-native";
import { Piece } from "@/types";
import { colors, radius, spacing } from "@/constants/theme";

export function PieceCard({
  piece,
  onPress,
}: {
  piece: Piece;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.swatch} />
      <View style={styles.info}>
        <Text style={styles.title}>{piece.title}</Text>
        <Text style={styles.meta}>
          {piece.clay_type ?? "Savityyppi ei tiedossa"}
          {piece.start_weight_g ? ` · ${piece.start_weight_g} g` : ""}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
