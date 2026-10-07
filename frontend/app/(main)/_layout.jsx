import { Tabs } from "expo-router";
import { colors } from "../../src/theme";

export default function MainLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.muted,
    }}>
      <Tabs.Screen name="chats" options={{ 
        title: "Chats", 
        headerShown: false,
        tabBarStyle: { display: "none" }
      }} />
      <Tabs.Screen name="friends" options={{ title: "Friends", headerShown: false, tabBarStyle: { display: "none" } }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", headerShown: false, tabBarStyle: { display: "none" } }} />
    </Tabs>
  );
}