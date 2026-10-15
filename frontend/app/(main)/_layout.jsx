import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { colors } from "../../src/theme";
import UserStore from "../../src/store/userStore";
import { connectSocket } from "../../src/sockets/socket";
import { useAuthStore } from "../../src/store/authStore";

export default function MainLayout() {
  const updateUserPresence = useAuthStore(state => state.updateUserPresence);

  useEffect(() => {
    let socket = null;
    const initSocket = async () => {
      try {
        const token = await UserStore.getData("userToken");
        if (token) {
          socket = connectSocket(token);

          socket.on("connect", () => {
            console.log("Global Socket connected:", socket.id);
          });

          socket.on("user_online", (data) => {
            if (data?.userId) {
              updateUserPresence(data.userId, true);
            }
          });

          socket.on("user_offline", (data) => {
            if (data?.userId) {
              updateUserPresence(data.userId, false);
            }
          });
        }
      } catch (err) {
        console.log("Socket init error:", err);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

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