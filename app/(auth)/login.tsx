import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { colors, radius, spacing } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [mode, setMode] = useState<"welcome" | "form">("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setErrorMsg("Täytä sähköposti ja salasana.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await signIn(email.trim(), password);
      // Root layout redirects to (tabs) automatically once session updates.
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Kirjautuminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  }

  if (mode === "welcome") {
    return (
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.heroTitle}>Keramiikka{"\n"}päiväkirja</Text>
          <Text style={styles.heroSubtitle}>Tallenna. Kehitä. Jaa.</Text>
        </View>

        <View style={styles.heroButtons}>
          <Pressable style={styles.primaryButton} onPress={() => setMode("form")}>
            <Text style={styles.primaryButtonText}>Kirjaudu sisään</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push("/signup")}>
            <Text style={styles.secondaryButtonText}>Luo uusi tili</Text>
          </Pressable>
          <Text style={styles.heroFooter}>Kaikki keramiikkasi yhdessä paikassa ♡</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.formContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable onPress={() => setMode("welcome")} hitSlop={8}>
        <Text style={styles.back}>← Takaisin</Text>
      </Pressable>

      <Text style={styles.formTitle}>Kirjaudu sisään</Text>

      <Text style={styles.label}>Sähköposti</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="sina@esimerkki.fi"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Salasana</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor={colors.textMuted}
      />

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      <Pressable style={styles.primaryButtonDark} onPress={handleLogin} disabled={loading}>
        <Text style={styles.primaryButtonText}>
          {loading ? "Kirjaudutaan…" : "Kirjaudu sisään"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/signup")} style={styles.switchLink}>
        <Text style={styles.switchLinkText}>Ei vielä tiliä? Luo uusi tili</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    backgroundColor: colors.heroDark,
    justifyContent: "space-between",
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
    paddingBottom: spacing.xl,
  },
  heroTop: {
    marginTop: spacing.xl,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#F4EADA",
    fontStyle: "italic",
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#D9C9AE",
    marginTop: spacing.sm,
  },
  heroButtons: {
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  primaryButtonDark: {
    backgroundColor: colors.accentDark,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  primaryButtonText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#FFF8EE",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#D9C9AE",
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#F4EADA",
  },
  heroFooter: {
    textAlign: "center",
    color: "#B7A78D",
    fontSize: 12,
    marginTop: spacing.sm,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  back: {
    color: colors.accent,
    fontWeight: "600",
    fontSize: 15,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    marginTop: spacing.md,
  },
  switchLink: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  switchLinkText: {
    color: colors.accent,
    fontWeight: "600",
  },
});
