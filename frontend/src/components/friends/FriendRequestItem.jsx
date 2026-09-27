import { Text, View } from "react-native";
import { Button } from "../common/Button";
import { colors } from "../../theme";

export function FriendRequestItem({ name, onAccept }) { return <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}><Text style={{ color: colors.text, flex: 1 }}>{name}</Text><View style={{ width: 112 }}><Button title="Accept" onPress={onAccept} /></View></View>; }