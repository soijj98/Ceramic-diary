import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "600" },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Kappaleet",
          tabBarLabel: "Kappaleet",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profiili",
          tabBarLabel: "Profiili",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Piilotetaan kirjautumis- ja rekisteröitymissivut alavalikosta, mutta pidetään reitit auki */}
      <Tabs.Screen
        name="login"
        options={{
          title: "Kirjaudu sisään",
          href: null, 
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "Luo tunnus",
          href: null,
        }}
      />
    </Tabs>
  );
}

