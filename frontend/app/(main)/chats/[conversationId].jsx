import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { ChatInputBar } from "../../../src/components/chat/ChatInputBar";
import { ScreenContainer } from "../../../src/components/common/ScreenContainer";
import { colors } from "../../../src/theme";

export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams();
  return <ScreenContainer><Text style={{ color: colors.text, fontSize: 24, fontWeight: "700" }}>Conversation</Text><Text style={{ color: colors.muted }}>ID: {conversationId}</Text><ChatInputBar /></ScreenContainer>;
}