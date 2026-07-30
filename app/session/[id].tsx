import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { SessionWithPhotos, CATEGORY_LABELS, MOOD_META } from "@/types";
import { getSession } from "@/lib/data";
import { photoUrl } from "@/lib/supabase";
import { colors, radius, spacing } from "@/constants/theme";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<SessionWithPhotos | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      getSession(id)
        .then(setSession)
        .catch((err) => {
          setErrorMsg("Merkinnän lataus epäonnistui.");
          console.error(err);
        });
    }, [id])
  );

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

      {details.length > 0 && <Text style={styles.details}>{details.join(" · ")}</Text>}

      {session.notes ? <Text style={styles.notes}>{session.notes}</Text> : null}

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
});