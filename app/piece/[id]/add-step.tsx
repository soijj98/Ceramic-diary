// import { useState } from "react";
// import {
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { StepType, STEP_TYPE_FIELDS, STEP_TYPE_LABELS } from "@/types";
// import { createStep, pickAndUploadPhoto } from "@/lib/data";
// import { colors, radius, spacing, stepTypeColor } from "@/constants/theme";

// const ALL_STEP_TYPES = Object.keys(STEP_TYPE_LABELS) as StepType[];

// export default function AddStepScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const router = useRouter();

//   const [stepType, setStepType] = useState<StepType>("muotoilu");
//   const [note, setNote] = useState("");
//   const [weight, setWeight] = useState("");
//   const [kilnTemp, setKilnTemp] = useState("");
//   const [firingProgram, setFiringProgram] = useState("");
//   const [glazeName, setGlazeName] = useState("");
//   const [glazeMethod, setGlazeMethod] = useState("");
//   const [photoCount, setPhotoCount] = useState(0);
//   const [saving, setSaving] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [pendingStepId, setPendingStepId] = useState<string | null>(null);

//   const fields = STEP_TYPE_FIELDS[stepType];

//   async function handleSave() {
//     if (!id) return;
//     setSaving(true);
//     setErrorMsg(null);
//     try {
//       const step = await createStep({
//         piece_id: id,
//         step_type: stepType,
//         note: note.trim() || undefined,
//         weight_g: fields.includes("weight") && weight ? Number(weight) : undefined,
//         kiln_temp_c: fields.includes("kiln") && kilnTemp ? Number(kilnTemp) : undefined,
//         firing_program: fields.includes("kiln") ? firingProgram.trim() || undefined : undefined,
//         glaze_name: fields.includes("glaze") ? glazeName.trim() || undefined : undefined,
//         glaze_application_method: fields.includes("glaze")
//           ? glazeMethod.trim() || undefined
//           : undefined,
//       });
//       setPendingStepId(step.id);
//     } catch (err) {
//       setErrorMsg("Vaiheen tallennus epäonnistui.");
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   }

//   // Photos are attached after the step exists, since a photo row
//   // needs a step_id to link to. Once the step is saved, this screen
//   // switches into a "lisää kuvia" phase before returning to the
//   // timeline.
//   async function handleAddPhoto() {
//     if (!pendingStepId) return;
//     try {
//       const photo = await pickAndUploadPhoto(pendingStepId);
//       if (photo) setPhotoCount((c) => c + 1);
//     } catch (err) {
//       setErrorMsg("Kuvan lataus epäonnistui.");
//       console.error(err);
//     }
//   }

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       {!pendingStepId ? (
//         <>
//           <Text style={styles.label}>Vaihe</Text>
//           <View style={styles.typeRow}>
//             {ALL_STEP_TYPES.map((type) => {
//               const active = type === stepType;
//               const color = stepTypeColor[type];
//               return (
//                 <Pressable
//                   key={type}
//                   onPress={() => setStepType(type)}
//                   style={[
//                     styles.typeChip,
//                     { borderColor: color },
//                     active && { backgroundColor: color },
//                   ]}
//                 >
//                   <Text style={[styles.typeChipText, { color: active ? "#fff" : color }]}>
//                     {STEP_TYPE_LABELS[type]}
//                   </Text>
//                 </Pressable>
//               );
//             })}
//           </View>

//           <Text style={styles.label}>Muistiinpano</Text>
//           <TextInput
//             style={[styles.input, styles.multiline]}
//             value={note}
//             onChangeText={setNote}
//             placeholder="Mitä teit tässä vaiheessa?"
//             placeholderTextColor={colors.textMuted}
//             multiline
//           />

//           {fields.includes("weight") && (
//             <>
//               <Text style={styles.label}>Paino (g)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={weight}
//                 onChangeText={setWeight}
//                 keyboardType="numeric"
//                 placeholder="Esim. 410"
//                 placeholderTextColor={colors.textMuted}
//               />
//             </>
//           )}

//           {fields.includes("kiln") && (
//             <>
//               <Text style={styles.label}>Uunilämpötila (°C)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={kilnTemp}
//                 onChangeText={setKilnTemp}
//                 keyboardType="numeric"
//                 placeholder="Esim. 1000"
//                 placeholderTextColor={colors.textMuted}
//               />
//               <Text style={styles.label}>Polttopohjelma</Text>
//               <TextInput
//                 style={styles.input}
//                 value={firingProgram}
//                 onChangeText={setFiringProgram}
//                 placeholder="Esim. Hidas nosto, 8h"
//                 placeholderTextColor={colors.textMuted}
//               />
//             </>
//           )}

//           {fields.includes("glaze") && (
//             <>
//               <Text style={styles.label}>Lasite / enkoopin nimi</Text>
//               <TextInput
//                 style={styles.input}
//                 value={glazeName}
//                 onChangeText={setGlazeName}
//                 placeholder="Esim. Selkeä läpinäkyvä"
//                 placeholderTextColor={colors.textMuted}
//               />
//               <Text style={styles.label}>Levitystapa</Text>
//               <TextInput
//                 style={styles.input}
//                 value={glazeMethod}
//                 onChangeText={setGlazeMethod}
//                 placeholder="Esim. Kastaminen, sivellin, ruiskutus"
//                 placeholderTextColor={colors.textMuted}
//               />
//             </>
//           )}

//           {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

//           <Pressable style={styles.button} onPress={handleSave} disabled={saving}>
//             <Text style={styles.buttonText}>
//               {saving ? "Tallennetaan…" : "Tallenna vaihe"}
//             </Text>
//           </Pressable>
//         </>
//       ) : (
//         <>
//           <Text style={styles.label}>Vaihe tallennettu</Text>
//           <Text style={styles.note}>
//             Lisää tähän vaiheeseen kuvia, tai jatka suoraan aikajanalle.
//           </Text>

//           <Pressable style={styles.secondaryButton} onPress={handleAddPhoto}>
//             <Text style={styles.secondaryButtonText}>
//               {photoCount > 0 ? `+ Lisää kuva (${photoCount} lisätty)` : "+ Lisää kuva"}
//             </Text>
//           </Pressable>

//           {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

//           <Pressable style={styles.button} onPress={() => router.back()}>
//             <Text style={styles.buttonText}>Valmis</Text>
//           </Pressable>
//         </>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   content: {
//     padding: spacing.md,
//     paddingBottom: spacing.xl,
//   },
//   label: {
//     fontSize: 13,
//     color: colors.textMuted,
//     marginBottom: spacing.xs,
//     marginTop: spacing.md,
//   },
//   note: {
//     fontSize: 15,
//     color: colors.text,
//     marginBottom: spacing.md,
//   },
//   typeRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: spacing.xs,
//   },
//   typeChip: {
//     borderWidth: 1,
//     borderRadius: 999,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     marginRight: spacing.xs,
//     marginBottom: spacing.xs,
//   },
//   typeChipText: {
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   input: {
//     backgroundColor: colors.surface,
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: radius.sm,
//     padding: spacing.sm,
//     fontSize: 16,
//     color: colors.text,
//   },
//   multiline: {
//     minHeight: 90,
//     textAlignVertical: "top",
//   },
//   secondaryButton: {
//     borderWidth: 1,
//     borderColor: colors.accent,
//     borderRadius: radius.md,
//     paddingVertical: spacing.sm,
//     alignItems: "center",
//   },
//   secondaryButtonText: {
//     color: colors.accent,
//     fontWeight: "600",
//   },
//   error: {
//     color: colors.danger,
//     marginTop: spacing.md,
//   },
//   button: {
//     backgroundColor: colors.accent,
//     borderRadius: radius.md,
//     paddingVertical: spacing.md,
//     alignItems: "center",
//     marginTop: spacing.lg,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });
