import { Text, View } from "react-native";
import { Avatar } from "../common/Avatar";
import { colors } from "../../theme";

export function ChatListItem({ name, preview }) { return <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}><Avatar name={name} /><View><Text style={{ color: colors.text, fontWeight: "700" }}>{name}</Text><Text style={{ color: colors.muted }}>{preview}</Text></View></View>; }