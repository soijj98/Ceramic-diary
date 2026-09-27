import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Piece, PieceStatus, PIECE_STATUS_LABELS } from "@/types";
import { listPieces } from "@/lib/data";
import { PieceCard } from "@/components/PieceCard";
import { colors, radius, spacing } from "@/constants/theme";

type FilterValue = "all" | PieceStatus;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Kaikki" },
  { value: "aktiivinen", label: "Aktiiviset" },
  { value: "valmis", label: "Valmiit" },
  { value: "luonnos", label: "Luonnokset" },
];

export default function WorksScreen() {
  const router = useRouter();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setErrorMsg(null);
      setPieces(await listPieces());
    } catch (err) {
      setErrorMsg("Töiden lataus epäonnistui.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const visible = useMemo(
    () => (filter === "all" ? pieces : pieces.filter((p) => p.status === filter)),
    [pieces, filter]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Omat työt</Text>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f.value === filter;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PieceCard piece={item} onPress={() => router.push(`/piece/${item.id}`)} />
        )}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>Ei töitä tässä näkymässä.</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { fontSize: 26, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.md },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.surfaceMuted,
  },
  chipActive: { backgroundColor: colors.accentDark },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.text },
  chipTextActive: { color: "#FFF8EE" },
  list: { paddingBottom: 32 },
  empty: { color: colors.textMuted, marginTop: spacing.xl, textAlign: "center" },
  error: { color: colors.danger, marginBottom: spacing.sm },
});
