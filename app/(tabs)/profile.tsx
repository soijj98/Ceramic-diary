import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { listPieces } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { colors, radius, spacing } from "@/constants/theme";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [pieceCount, setPieceCount] = useState<number | null>(null);
  const [claySum, setClaySum] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      listPieces()
        .then((pieces) => {
          setPieceCount(pieces.length);
          const total = pieces.reduce((sum, p) => sum + (p.start_weight_g ?? 0), 0);
          setClaySum(total);
        })
        .catch(() => {
          setPieceCount(null);
          setClaySum(null);
        });
    }, [])
  );

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? "Sinun nimesi";

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>🏺</Text>
      </View>

      <Text style={styles.name}>{fullName}</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{pieceCount ?? "–"}</Text>
          <Text style={styles.statLabel}>Työtä</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {claySum !== null ? `${(claySum / 1000).toFixed(1)} kg` : "–"}
          </Text>
          <Text style={styles.statLabel}>Käytetty savi</Text>
        </View>
      </View>

      <Pressable style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Kirjaudu ulos</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md, alignItems: "center" },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  avatarText: { fontSize: 36 },
  name: { fontSize: 20, fontWeight: "700", color: colors.text, marginTop: spacing.md },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  statsRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xl },
  statBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  statNumber: { fontSize: 20, fontWeight: "700", color: colors.accent },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  signOutButton: {
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  signOutText: { color: colors.danger, fontWeight: "700" },
});
