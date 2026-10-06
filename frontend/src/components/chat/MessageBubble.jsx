import { Text, View } from "react-native";
import { colors } from "../../theme";

export function MessageBubble({ text, mine = false }) { return <View style={{ alignSelf: mine ? "flex-end" : "flex-start", backgroundColor: mine ? colors.accent : colors.surface, borderRadius: 8, maxWidth: "82%", padding: 12 }}><Text style={{ color: mine ? colors.background : colors.text }}>{text}</Text></View>; }