// import { useCallback, useState } from "react";
// import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
// import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
// import { Piece, StepWithPhotos } from "@/types";
// import { getPiece, listStepsWithPhotos } from "@/lib/data";
// import { StepCard } from "@/components/StepCard";
// import { colors, radius, spacing } from "@/constants/theme";

// export default function PieceTimelineScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();
//   const [piece, setPiece] = useState<Piece | null>(null);
//   const [steps, setSteps] = useState<StepWithPhotos[]>([]);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     if (!id) return;
//     try {
//       setErrorMsg(null);
//       const [pieceData, stepsData] = await Promise.all([
//         getPiece(id),
//         listStepsWithPhotos(id),
//       ]);
//       setPiece(pieceData);
//       setSteps(stepsData);
//     } catch (err) {
//       setErrorMsg("Tietojen lataus epäonnistui.");
//       console.error(err);
//     }
//   }, [id]);

//   useFocusEffect(
//     useCallback(() => {
//       load();
//     }, [load])
//   );

//   return (
//     <View style={styles.container}>
//       {piece && (
//         <View style={styles.header}>
//           <Text style={styles.title}>{piece.title}</Text>
//           <Text style={styles.subtitle}>
//             {piece.clay_type ?? "Savityyppi ei tiedossa"}
//             {piece.start_weight_g ? ` · alku ${piece.start_weight_g} g` : ""}
//           </Text>
//         </View>
//       )}

//       {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

//       <FlatList
//         data={steps}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.list}
//         renderItem={({ item }) => <StepCard step={item} />}
//         ListEmptyComponent={
//           <Text style={styles.empty}>
//             Ei vielä vaiheita. Lisää ensimmäinen alta.
//           </Text>
//         }
//       />

//       <Pressable
//         style={styles.fab}
//         onPress={() => router.push(`/piece/${id}/add-step`)}
//       >
//         <Text style={styles.fabText}>+ Lisää vaihe</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     padding: spacing.md,
//   },
//   header: {
//     marginBottom: spacing.md,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: colors.text,
//   },
//   subtitle: {
//     fontSize: 13,
//     color: colors.textMuted,
//     marginTop: 2,
//   },
//   list: {
//     paddingBottom: 96,
//   },
//   empty: {
//     marginTop: spacing.xl,
//     textAlign: "center",
//     color: colors.textMuted,
//   },
//   error: {
//     color: colors.danger,
//     marginBottom: spacing.sm,
//   },
//   fab: {
//     position: "absolute",
//     bottom: spacing.lg,
//     right: spacing.lg,
//     left: spacing.lg,
//     backgroundColor: colors.accent,
//     borderRadius: radius.lg,
//     paddingVertical: spacing.md,
//     alignItems: "center",
//   },
//   fabText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });
