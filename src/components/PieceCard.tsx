import { Pressable, StyleSheet, Text, View } from "react-native";
import { Piece, PIECE_STATUS_LABELS } from "@/types";
import { colors, radius, spacing } from "@/constants/theme";

const STATUS_COLOR: Record<Piece["status"], string> = {
  luonnos: colors.textMuted,
  aktiivinen: colors.accent,
  valmis: colors.success,
};

export function PieceCard({ piece, onPress }: { piece: Piece; onPress: () => void }) {
  const date = new Date(piece.created_at).toLocaleDateString("fi-FI");
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.swatch} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{piece.title}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[piece.status] }]} />
          <Text style={styles.meta}>
            {PIECE_STATUS_LABELS[piece.status]} · {date}
          </Text>
        </View>
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
  pressed: { opacity: 0.7 },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  meta: { fontSize: 12, color: colors.textMuted },
});
