import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View, TextInput } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { SessionWithPhotos, CATEGORY_LABELS, MOOD_META } from "@/types";
import { getSession } from "@/lib/data";
import { photoUrl, supabase } from "@/lib/supabase";
import { colors, radius, spacing } from "@/constants/theme";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<SessionWithPhotos | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  
  const [isEditing, setIsEditing] = useState(false);
  const [clayBody, setClayBody] = useState("");
  const [technique, setTechnique] = useState("");
  const [firingTemp, setFiringTemp] = useState("");
  const [glaze, setGlaze] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);


  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      getSession(id)
        .then((data) => {
            setSession(data);
            if (data) {
                setClayBody(data.clay_body || "");
                setTechnique(data.technique || "");
                setFiringTemp(data.firing_temp || "");
                setGlaze(data.glaze || "");
                setNotes(data.notes || "");
            }
        })
        .catch((err) => {
          setErrorMsg("Merkinnän lataus epäonnistui.");
          console.error(err);
        });
    }, [id])
  );

  const handleUpdateSession = async () => {
        if (!id) return;
        setSaving(true);
        try {
            const { error } = await supabase
            .from("sessions")
            .update({
                clay_body: clayBody.trim() || null,
                technique: technique.trim() || null,
                firing_temp: firingTemp.trim() || null,
                glaze: glaze.trim() || null,
                notes: notes.trim() || null,
            })
            .eq("id", id);
            if (error) throw error;

            const updated = await getSession(id);
            setSession(updated);
            setIsEditing(false);
        } catch (err) {
            setErrorMsg("Merkinnän päivittäminen epäonnistui.");
            console.error(err);
            } finally {
            setSaving(false);
        }
    };

    if (errorMsg) {
        return (
        <View style={styles.container}>
            <Text style={styles.error}>{errorMsg}</Text>
        </View>
        );
    }

  if (!session) return null;

  const date = new Date(session.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const details: string[] = [];
  if (session.clay_body) details.push(session.clay_body);
  if (session.technique) details.push(session.technique);
  if (session.firing_temp) details.push(session.firing_temp);
  if (session.glaze) details.push(session.glaze);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{session.title}</Text>
        {session.mood && <Text style={styles.mood}>{MOOD_META[session.mood].emoji}</Text>}
      </View>
      <Text style={styles.date}>{date}</Text>

      <View style={styles.categoryTag}>
        <Text style={styles.categoryTagText}>
          {CATEGORY_LABELS[session.category].toUpperCase()}
        </Text>
      </View>

      {!isEditing ? (
        <>
            {details.length > 0 && <Text style={styles.details}>{details.join(" · ")}</Text>}
            {session.notes ? <Text style={styles.notes}>{session.notes}</Text> : null}

            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>+ Lisää tai muokkaa tietoja </Text>
            </TouchableOpacity>
        </>
      ) : (
            <View style={styles.editContainer}>
               <Text style={styles.label}>CLAY BODY</Text>
               <TextInput
                 style={styles.input}
                 value={clayBody}
                 onChangeText={setClayBody}
                 placeholder="e.g. Stoneware 202"
                 placeholderTextColor={colors.textMuted}
               />

               <Text style={styles.label}>TECHNIQUE</Text>
               <TextInput
                 style={styles.input}
                 value={technique}
                 onChangeText={setTechnique}
                 placeholder="e.g. Wheel thrown"
                 placeholderTextColor={colors.textMuted}
               />



               <Text style={styles.label}>FIRING TEMP</Text>
               <TextInput
                 style={styles.input}
                 value={firingTemp}
                 onChangeText={setFiringTemp}
                 placeholder="e.g. Cone 10"
                 placeholderTextColor={colors.textMuted} />


               <Text style={styles.label}>GLAZE</Text>
               <TextInput
                 style={styles.input}
                 value={glaze}
                 onChangeText={setGlaze}
                 placeholder="e.g. Tenmoku"
                 placeholderTextColor={colors.textMuted} />
            

                <Text style={styles.label}>SESSION NOTES</Text>
                <TextInput
                 style={[styles.input, styles.multiline]}
                 value={notes}
                 onChangeText={setNotes}
                 placeholder="What worked, what didn't, observations, ideas for next time…"
                 placeholderTextColor={colors.textMuted} />

                 <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.saveButton, { flex: 1 }]} onPress={handleUpdateSession} disabled={saving}>
                    <Text style={styles.cancelButtonText}>Peruuta</Text>
                  </TouchableOpacity>
                 </View>
            </View>
      )}

      {session.photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
            {session.photos.map((photo) => (
                <Image
                    key={photo.id}
                    source={{ uri: photoUrl(photo.storage_path) }}
                    style={styles.photo}
                />
            ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  mood: {
    fontSize: 24,
  },
  date: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: spacing.md,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accentDark,
  },
  details: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  notes: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  photoRow: {
    marginTop: spacing.md,
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: radius.md,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceMuted,
  },
  error: {
    color: colors.danger,
    padding: spacing.md,
  },
  editButton: {
    marginTop: spacing.lg,
    padding: spacing.sm, borderWidth: 1, 
    borderColor: colors.accent, 
    borderRadius: radius.sm, 
    alignItems: "center"
  },

  editButtonText: {
    color: colors.accent, 
    fontWeight: "600" 
},
  editContainer: {
    marginTop: spacing.md 
},
  label: { 
    fontSize: 11, 
    fontWeight: "700", 
    color: colors.textMuted, 
    marginTop: spacing.sm, 
    marginBottom: 4 
},
  input: { 
    backgroundColor: colors.surface, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: radius.sm, 
    padding: spacing.sm, 
    fontSize: 16, 
    color: colors.text 
},
  multiline: {
    minHeight: 80, 
    textAlignVertical: "top" 
},
  buttonRow: { 
    flexDirection: "row", 
    gap: spacing.sm, 
    marginTop: spacing.md 
},
  saveButton: {
    backgroundColor: colors.accentDark, 
    borderRadius: radius.sm, 
    padding: spacing.sm, 
    alignItems: "center" 
},
  saveButtonText: { 
    color: "#FFF8EE", 
    fontWeight: "700" 
},
  cancelButton: { 
    backgroundColor: colors.surfaceMuted, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: radius.sm, 
    padding: spacing.sm, 
    alignItems: "center" 
},
  cancelButtonText: {
     color: colors.text, 
     fontWeight: "600" 
},
});