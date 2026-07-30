import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="piece/new" options={{ title: "Uusi kappale" }} />
        <Stack.Screen name="piece/[id]/index" options={{ title: "Kappale" }} />
        <Stack.Screen name="piece/[id]/add-step" options={{ title: "Lisää vaihe" }} />
      </Stack>
    </>
  );
}
