import { Text } from "react-native";
import { AddFriendSearchBar } from "../../../src/components/friends/AddFriendSearchBar";
import { ScreenContainer } from "../../../src/components/common/ScreenContainer";
import { colors } from "../../../src/theme";

export default function AddFriendScreen() {
  return <ScreenContainer><Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Add a friend</Text><AddFriendSearchBar /></ScreenContainer>;
}