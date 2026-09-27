import { Text, View } from "react-native";
import { colors } from "../../theme";

export function Avatar({ name = "?", size = 44 }) {
  return <View style={{ alignItems: "center", backgroundColor: colors.accent, borderRadius: size / 2, height: size, justifyContent: "center", width: size }}><Text style={{ color: colors.background, fontSize: size * 0.4, fontWeight: "700" }}>{name.slice(0, 1).toUpperCase()}</Text></View>;
}