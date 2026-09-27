import { useCallback, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Piece } from "@/types";
import { listPieces } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { PieceCard } from "@/components/PieceCard";
import { colors, radius, spacing } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "";

  const load = useCallback(async () => {
    try {
      setPieces(await listPieces());
    } catch (err) {
      console.error(err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.greeting}>Hei{firstName ? ` ${firstName}` : ""}! 👋</Text>
        <View style={styles.avatar} />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={colors.textMuted} />
        <Text style={styles.searchPlaceholder}>Hae töitä, ideoita…</Text>
      </View>

      <View style={styles.quickActions}>
        <QuickAction
          icon="add-circle-outline"
          label="Uusi työ"
          onPress={() => router.push("/piece/new")}
        />
        <QuickAction
          icon="bulb-outline"
          label="Ideat"
          onPress={() => router.push("/(tabs)/ideas")}
        />
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Viimeisimmät työt</Text>
        <Pressable onPress={() => router.push("/(tabs)/works")}>
          <Text style={styles.sectionLink}>Näytä kaikki</Text>
        </Pressable>
      </View>

      {pieces.length === 0 ? (
        <Text style={styles.empty}>
          Ei vielä yhtään työtä. Aloita painamalla "Uusi työ".
        </Text>
      ) : (
        <FlatList
          data={pieces.slice(0, 5)}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <PieceCard piece={item} onPress={() => router.push(`/piece/${item.id}`)} />
          )}
        />
      )}
    </ScrollView>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickActionIcon}>
        <Ionicons name={icon} size={22} color={colors.accentDark} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 24, fontWeight: "800", color: colors.text },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 2,
    borderColor: colors.border,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginTop: spacing.md,
  },
  searchPlaceholder: { color: colors.textMuted, fontSize: 14 },
  quickActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  quickAction: { alignItems: "center", gap: spacing.xs },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: { fontSize: 12, color: colors.textMuted },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: colors.text },
  sectionLink: { fontSize: 13, color: colors.accent, fontWeight: "600" },
  empty: { color: colors.textMuted, fontSize: 14, marginTop: spacing.sm },
});
