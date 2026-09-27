import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { Piece, PieceStatus, PIECE_STATUS_LABELS, StepWithPhotos } from "@/types";
import { getPiece, listStepsWithPhotos, updatePieceStatus } from "@/lib/data";
import { StepCard } from "@/components/StepCard";
import { colors, radius, spacing } from "@/constants/theme";

const STATUS_ORDER: PieceStatus[] = ["luonnos", "aktiivinen", "valmis"];

export default function PieceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [piece, setPiece] = useState<Piece | null>(null);
  const [steps, setSteps] = useState<StepWithPhotos[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setErrorMsg(null);
      const [pieceData, stepsData] = await Promise.all([getPiece(id), listStepsWithPhotos(id)]);
      setPiece(pieceData);
      setSteps(stepsData);
    } catch (err) {
      setErrorMsg("Tietojen lataus epäonnistui.");
      console.error(err);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function cycleStatus() {
    if (!piece) return;
    const nextIndex = (STATUS_ORDER.indexOf(piece.status) + 1) % STATUS_ORDER.length;
    const next = STATUS_ORDER[nextIndex];
    try {
      await updatePieceStatus(piece.id, next);
      setPiece({ ...piece, status: next });
    } catch (err) {
      console.error(err);
    }
  }

  // poisto funktio
  async function handleDeleteStep(stepId: string) {
    try {
      await deleteStep(stepId);
      setSteps((prev) => prev.filter((s) => s.id !== stepId));
    } catch (err) {
      setErrorMsg("Vaiheen poisto epäonnistui.");
      console.error(err);
    }
  }


  //Swaippauksen toiminta
  const renderRightActions = (stepId: string) => (
    <View style={styles.swipeActions}>
      <Pressable
        style={[styles.swipeAction, styles.editAction]}
        onPress={() => router.push(`/piece/${id}/edit-step/${stepId}`)}
       >
        <Text style={styles.swipeActionText}>
          Muokkaa
        </Text>
        </Pressable> 
        <Pressable
          style={[styles.swipeAction, styles.deleteAction]}
          onPress={() => handleDeleteStep(stepId)}
        >
          <Text style={styles.swipeActionText}>Poista</Text>
        </Pressable>
        </View>
  )

  return (
    <View style={styles.container}>
      {piece && (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{piece.title}</Text>
            <Pressable style={styles.statusPill} onPress={cycleStatus}>
              <Text style={styles.statusPillText}>{PIECE_STATUS_LABELS[piece.status]}</Text>
            </Pressable>
          </View>
          {piece.description ? <Text style={styles.description}>{piece.description}</Text> : null}
          <Text style={styles.subtitle}>
            {piece.clay_type ?? "Savityyppi ei tiedossa"}
            {piece.start_weight_g ? ` · alku ${piece.start_weight_g} g` : ""}
          </Text>
        </>
      )}

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <FlatList
        data={steps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <StepCard step={item} />
       
          </Swipeable>
        )}        
        ListEmptyComponent={<Text style={styles.empty}>Ei vielä vaiheita. Lisää ensimmäinen alta.</Text>}
      />

      <Pressable style={styles.fab} onPress={() => router.push(`/piece/${id}/add-step`)}>
        <Text style={styles.fabText}>+ Lisää vaihe</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { flex: 1, fontSize: 24, fontWeight: "800", color: colors.text, marginRight: spacing.sm },
  statusPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusPillText: { fontSize: 12, fontWeight: "700", color: colors.accentDark },
  description: { fontSize: 14, color: colors.text, marginTop: spacing.sm, lineHeight: 20 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  list: { paddingBottom: 96 },
  empty: { marginTop: spacing.xl, textAlign: "center", color: colors.textMuted },
  error: { color: colors.danger, marginBottom: spacing.sm },
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
  fabText: { color: "#FFF8EE", fontWeight: "700", fontSize: 16 },
  swipeActions: { flexDirection: "row", alignItems: "stretch", marginVertical: spacing.xs },
  swipeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    borderRadius: radius.md,
    marginLeft: spacing.sm,
  },
  editAction: { backgroundColor: colors.accent },
  deleteAction: { backgroundColor: colors.danger },
  swipeActionText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
});
