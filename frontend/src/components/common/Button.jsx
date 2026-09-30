import { Pressable, Text } from "react-native";
import { colors } from "../../theme";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

export function Button1({ title, onPress, variant = "primary" }) {
  const secondary = variant === "secondary";
  return <Pressable onPress={onPress} style={{ alignItems: "center", backgroundColor: secondary ? colors.surface : colors.accent, borderColor: secondary ? colors.border : colors.accent, borderRadius: 8, borderWidth: 1, minHeight: 48, justifyContent: "center", paddingHorizontal: 20, width: "100%" }}><Text style={{ color: secondary ? colors.text : colors.background, fontSize: 16, fontWeight: "700" }}>{title}</Text></Pressable>;
}

export function Button2 ({ title, onPress}) {
  <TouchableOpacity
    style={styles.secondaryButton}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Text style={styles.secondaryButtonText}>{title}</Text>
  </TouchableOpacity>

}


const style = StyleSheet.create({
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});