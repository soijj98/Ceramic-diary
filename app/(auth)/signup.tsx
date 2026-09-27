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

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  async function handleSignup() {
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg("Täytä kaikki kentät.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Salasanan pitää olla vähintään 6 merkkiä.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await signUp(email.trim(), password, fullName.trim());
      setInfoMsg(
        "Tili luotu! Jos Supabase-projektissasi on sähköpostivahvistus päällä, tarkista sähköpostisi ennen kirjautumista."
      );
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Tilin luonti epäonnistui.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <Text style={styles.back}>← Takaisin</Text>
      </Pressable>

      <Text style={styles.title}>Luo uusi tili</Text>

      <Text style={styles.label}>Nimi</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Etunimi Sukunimi"
        placeholderTextColor={colors.textMuted}
      />

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
        placeholder="Vähintään 6 merkkiä"
        placeholderTextColor={colors.textMuted}
      />

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      {infoMsg && <Text style={styles.info}>{infoMsg}</Text>}

      <Pressable style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Luodaan…" : "Luo tili"}</Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/login")} style={styles.switchLink}>
        <Text style={styles.switchLinkText}>Onko sinulla jo tili? Kirjaudu sisään</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
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
  info: {
    color: colors.success,
    marginTop: spacing.md,
  },
  button: {
    backgroundColor: colors.accentDark,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonText: {
    color: "#FFF8EE",
    fontWeight: "700",
    fontSize: 16,
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
