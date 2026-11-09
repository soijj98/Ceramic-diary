
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { StepWithPhotos } from "@/types";
import { StepTypeBadge } from "@/components/StepTypeBadge";
import { colors, radius, spacing } from "@/constants/theme";
import { photoUrl } from "@/lib/supabase";

type Props = {
  step: StepWithPhotos;
  onEdit: () => void;
  onDelete: () => void;
};

function StepPhotoImage({
  storagePath,
  width,
  height,
  onPress,
}: {
  storagePath: string;
  width: number;
  height: number;
  onPress: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPhoto() {
      try {
        const signedUrl = await photoUrl(storagePath);
        if (active) setUrl(signedUrl);
      } catch (error) {
        console.error("Kuvan lataus epäonnistui:", error);
      }
    }

    loadPhoto();

    return () => {
      active = false;
    };
  }, [storagePath]);

  if (!url) {
    return (
      <View
        style={[
          styles.photoPlaceholder,
          { width, height },
        ]}
      />
    );
  }

  return (
    <Pressable onPress={onPress}>
      <Image
        source={{ uri: url }}
        style={[styles.photo, { width, height }]}
        resizeMode="cover"
      />
    </Pressable>
  );
}

export function StepCard({ step, onEdit, onDelete }: Props) {
  const { width: screenWidth } = useWindowDimensions();

  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<
    string | null
  >(null);

  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(
    null
  );

  const date = new Date(step.created_at).toLocaleDateString("fi-FI");

  const photoWidth = Math.max(180, screenWidth - spacing.md * 4);
  const photoHeight = 210;

  const details = [
    step.weight_g != null ? `Paino: ${step.weight_g} g` : null,
    step.kiln_temp_c != null
      ? `Uunilämpötila: ${step.kiln_temp_c} °C`
      : null,
    step.firing_program
      ? `Poltto-ohjelma: ${step.firing_program}`
      : null,
    step.glaze_name
      ? `Lasite / enkooppi: ${step.glaze_name}`
      : null,
    step.glaze_application_method
      ? `Levitystapa: ${step.glaze_application_method}`
      : null,
  ].filter((value): value is string => value !== null);

  const hasMore =
    (step.note?.length ?? 0) > 110 || details.length > 0;

  useEffect(() => {
    let active = true;

    if (!fullscreenPhoto) {
      setFullscreenUrl(null);
      return;
    }

    async function loadFullscreen() {
      try {
        const url = await photoUrl(fullscreenPhoto!);
        if (active) setFullscreenUrl(url);
      } catch (error) {
        console.error(error);
      }
    }

    loadFullscreen();

    return () => {
      active = false;
    };
  }, [fullscreenPhoto]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <StepTypeBadge type={step.step_type} />

        <View style={styles.headerRight}>
          <Text style={styles.date}>{date}</Text>

          <Pressable
            onPress={() => setMenuOpen(!menuOpen)}
            style={styles.menuButton}
            hitSlop={8}
          >
            <Text style={styles.menuIcon}>⋯</Text>
          </Pressable>
        </View>
      </View>

      {menuOpen && (
        <View style={styles.menu}>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              onEdit();
            }}
          >
            <Text style={styles.menuText}>✎ Muokkaa</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
              onDelete();
            }}
          >
            <Text style={styles.deleteText}>Poista vaihe</Text>
          </Pressable>
        </View>
      )}

      {step.photos.length > 0 && (
        <View style={styles.gallerySection}>
          <ScrollView
            horizontal
            pagingEnabled
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / photoWidth
              );
              setActivePhoto(index);
            }}
          >
            {step.photos.map((photo) => (
              <StepPhotoImage
                key={photo.id}
                storagePath={photo.storage_path}
                width={photoWidth}
                height={photoHeight}
                onPress={() =>
                  setFullscreenPhoto(photo.storage_path)
                }
              />
            ))}
          </ScrollView>

          {step.photos.length > 1 && (
            <View style={styles.pagination}>
              {step.photos.map((photo, index) => (
                <View
                  key={photo.id}
                  style={[
                    styles.dot,
                    activePhoto === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {!!step.note && (
        <Text
          style={styles.note}
          numberOfLines={expanded ? undefined : 3}
        >
          {step.note}
        </Text>
      )}

      {expanded && details.length > 0 && (
        <View style={styles.detailsBox}>
          {details.map((detail, index) => (
            <Text key={index} style={styles.detail}>
              {detail}
            </Text>
          ))}
        </View>
      )}

      {hasMore && (
        <Pressable
          style={styles.expandButton}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.expandText}>
            {expanded ? "Näytä vähemmän ▲" : "Näytä kaikki tiedot ▼"}
          </Text>
        </Pressable>
      )}

      <Modal
        visible={!!fullscreenPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenPhoto(null)}
      >
        <View style={styles.fullscreen}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setFullscreenPhoto(null)}
          >
            <Text style={styles.closeText}>✕ Sulje</Text>
          </Pressable>

          {fullscreenUrl && (
            <Image
              source={{ uri: fullscreenUrl }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
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
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuIcon: {
    fontSize: 25,
    fontWeight: "700",
    color: colors.text,
  },
  menu: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    padding: spacing.md,
  },
  menuText: {
    color: colors.text,
    fontWeight: "600",
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "600",
  },
  gallerySection: {
    marginTop: spacing.md,
    overflow: "hidden",
    borderRadius: radius.sm,
  },
  photo: {
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  photoPlaceholder: {
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  note: {
    fontSize: 15,
    color: colors.text,
    marginTop: spacing.md,
    lineHeight: 21,
  },
  detailsBox: {
    marginTop: spacing.md,
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
  },
  detail: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  expandButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  expandText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  fullscreen: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "85%",
  },
  closeButton: {
    position: "absolute",
    top: 45,
    right: 20,
    zIndex: 10,
    padding: 12,
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
