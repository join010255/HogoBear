import { Text } from "react-native";
import { ScreenContainer } from "../../../src/components/common/ScreenContainer";
import { colors } from "../../../src/theme";

export default function ChatsScreen() {
  return <ScreenContainer><Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Chats</Text><Text style={{ color: colors.muted }}>Your conversations will appear here.</Text></ScreenContainer>;
}