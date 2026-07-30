import { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Category, Session } from "@/types";
import { listSessions } from "@/lib/data";
import { SessionCard } from "@/components/SessionCard";
import { CategoryFilterBar } from "@/components/CategoryFilterBar";
import { colors, radius, spacing } from "@/constants/theme";

export default function ClayBookScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setErrorMsg(null);
      setSessions(await listSessions());
    } catch (err) {
      setErrorMsg(
        "Merkintöjen lataus epäonnistui. Tarkista Supabase-asetukset .env-tiedostossa."
      );
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

  const visibleSessions = useMemo(
    () => (filter === "all" ? sessions : sessions.filter((s) => s.category === filter)),
    [sessions, filter]
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>YOUR STUDIO JOURNAL</Text>
          <Text style={styles.title}>Clay Book</Text>
        </View>
        <View style={styles.avatar} />
      </View>

      <CategoryFilterBar value={filter} onChange={setFilter} />

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <FlatList
        data={visibleSessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => router.push(`/session/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🏺</Text>
              <Text style={styles.emptyText}>No notes in this category yet.</Text>
            </View>
          ) : null
        }
      />

      <Pressable style={styles.fab} onPress={() => router.push("/session/new")}>
        <Text style={styles.fabText}>+ New Session Note</Text>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 2,
    borderColor: colors.border,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: 96,
  },
  empty: {
    marginTop: spacing.xl * 2,
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
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
    color: "#FFF8EE",
    fontWeight: "700",
    fontSize: 16,
  },
});