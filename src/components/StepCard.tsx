import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { StepWithPhotos } from "@/types";
import { StepTypeBadge } from "@/components/StepTypeBadge";
import { colors, radius, spacing } from "@/constants/theme";
import { photoUrl } from "@/lib/supabase";

function StepPhotoImage({ storagePath }: { storagePath: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPhoto() {
      const signedUrl = await photoUrl(storagePath);

      if (active) {
        setUrl(signedUrl);
      }
    }

    loadPhoto();

    return () => {
      active = false;
    };
  }, [storagePath]);

  if (!url) {
    return <View style={styles.photoPlaceholder} />;
  }

  return <Image source={{ uri: url }} style={styles.photo} />;
}

export function StepCard({ step }: { step: StepWithPhotos }) {
  const date = new Date(step.created_at).toLocaleDateString("fi-FI");

  const details: string[] = [];

  if (step.weight_g) details.push(`${step.weight_g} g`);
  if (step.kiln_temp_c) details.push(`${step.kiln_temp_c} °C`);
  if (step.firing_program) details.push(step.firing_program);
  if (step.glaze_name) details.push(step.glaze_name);
  if (step.glaze_application_method) {
    details.push(step.glaze_application_method);
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <StepTypeBadge type={step.step_type} />
        <Text style={styles.date}>{date}</Text>
      </View>

      {step.note ? <Text style={styles.note}>{step.note}</Text> : null}

      {details.length > 0 && (
        <Text style={styles.details}>{details.join(" · ")}</Text>
      )}

      {step.photos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photoRow}
        >
          {step.photos.map((photo) => (
            <StepPhotoImage
              key={photo.id}
              storagePath={photo.storage_path}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  date: {
    fontSize: 12,
    color: colors.textMuted,
  },

  note: {
    fontSize: 15,
    color: colors.text,
    marginTop: spacing.sm,
    lineHeight: 21,
  },

  details: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  photoRow: {
    marginTop: spacing.sm,
  },

  photo: {
    width: 120,
    height: 120,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceMuted,
  },

  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceMuted,
  },
});