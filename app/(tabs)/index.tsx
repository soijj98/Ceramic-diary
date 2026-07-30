import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Piece } from "@/types";
import { listPieces } from "@/lib/data";
import { PieceCard } from "@/components/PieceCard";
import { colors, radius, spacing } from "@/constants/theme";

export default function PiecesScreen() {
  const router = useRouter();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setErrorMsg(null);
      setPieces(await listPieces());
    } catch (err) {
      setErrorMsg(
        "Kappaleiden lataus epäonnistui. Tarkista Supabase-asetukset .env-tiedostossa."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch every time the screen regains focus, e.g. after adding a piece.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={styles.container}>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <FlatList
        data={pieces}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PieceCard piece={item} onPress={() => router.push(`/piece/${item.id}`)} />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>
              Ei vielä yhtään kappaletta. Lisää ensimmäinen alta.
            </Text>
          ) : null
        }
      />

      <Pressable style={styles.fab} onPress={() => router.push("/piece/new")}>
        <Text style={styles.fabText}>+ Uusi kappale</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  list: {
    paddingBottom: 96,
  },
  empty: {
    marginTop: spacing.xl,
    textAlign: "center",
    color: colors.textMuted,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  fab: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    left: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  fabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
