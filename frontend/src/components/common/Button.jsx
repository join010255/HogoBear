import { Pressable, Text } from "react-native";
import { colors } from "../../theme";

export function Button({ title, onPress, variant = "primary" }) {
  const secondary = variant === "secondary";
  return <Pressable onPress={onPress} style={{ alignItems: "center", backgroundColor: secondary ? colors.surface : colors.accent, borderColor: secondary ? colors.border : colors.accent, borderRadius: 8, borderWidth: 1, minHeight: 48, justifyContent: "center", paddingHorizontal: 20, width: "100%" }}><Text style={{ color: secondary ? colors.text : colors.background, fontSize: 16, fontWeight: "700" }}>{title}</Text></Pressable>;
}