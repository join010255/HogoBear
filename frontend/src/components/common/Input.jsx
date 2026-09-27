import { Text, TextInput, View } from "react-native";
import { colors } from "../../theme";

export function Input({ label, ...props }) {
  return <View style={{ gap: 7, width: "100%" }}>{label ? <Text style={{ color: colors.text, fontSize: 14 }}>{label}</Text> : null}<TextInput placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 8, borderWidth: 1, color: colors.text, minHeight: 48, paddingHorizontal: 14 }} {...props} /></View>;
}