import { View } from "react-native";
import { colors } from "../../theme";

export function Card({ children, style }) {
  return <View style={[{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 8, borderWidth: 1, padding: 16 }, style]}>{children}</View>;
}