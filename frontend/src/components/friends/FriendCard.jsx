import { Text, View } from "react-native";
import { Avatar } from "../common/Avatar";
import { colors } from "../../theme";

export function FriendCard({ name }) { return <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}><Avatar name={name} /><Text style={{ color: colors.text, fontWeight: "700" }}>{name}</Text></View>; }