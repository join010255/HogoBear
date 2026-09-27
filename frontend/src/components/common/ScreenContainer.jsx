import { ScrollView, View } from "react-native";
import { colors } from "../../theme";

export function ScreenContainer({ children, centered = false }) {
  return <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: centered ? "center" : "flex-start", padding: 24, gap: 18 }} style={{ backgroundColor: colors.background }}><View style={{ alignItems: centered ? "center" : "stretch", gap: 16, width: "100%" }}>{children}</View></ScrollView>;
}