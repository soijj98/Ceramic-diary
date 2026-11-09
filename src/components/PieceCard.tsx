
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Piece, PIECE_STATUS_LABELS } from "@/types";
import { colors, radius, spacing } from "@/constants/theme";
import { getLatestPiecePhotoPath } from "@/lib/data";
import { photoUrl } from "@/lib/supabase";

const STATUS_COLOR: Record<Piece["status"], string> = {
  luonnos: colors.textMuted,
  aktiivinen: colors.accent,
  valmis: colors.success,
};

export function PieceCard({
  piece,
  onPress,
}: {
  piece: Piece;
  onPress: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const date = new Date(piece.created_at).toLocaleDateString("fi-FI");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadLatestPhoto() {
        try {
          const storagePath = await getLatestPiecePhotoPath(piece.id);

          if (!storagePath) {
            if (active) setImageUrl(null);
            return;
          }

          const url = await photoUrl(storagePath);

          if (active) {
            setImageUrl(url);
          }
        } catch (error) {
          console.error("Kansikuvan lataus epäonnistui:", error);
        }
      }

      loadLatestPhoto();

      return () => {
        active = false;
      };
    }, [piece.id])
  );
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.swatch}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.swatch} />
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {piece.title}
        </Text>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: STATUS_COLOR[piece.status] },
            ]}
          />

          <Text style={styles.meta}>
            {PIECE_STATUS_LABELS[piece.status]} · {date}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
