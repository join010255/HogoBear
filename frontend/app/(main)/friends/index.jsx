import { Link } from "expo-router";
import { Text } from "react-native";
import { Button } from "../../../src/components/common/Button";
import { ScreenContainer } from "../../../src/components/common/ScreenContainer";
import { colors } from "../../../src/theme";

export default function FriendsScreen() {
  return <ScreenContainer><Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Friends</Text><Text style={{ color: colors.muted }}>Your friends and requests will appear here.</Text><Link href="/(main)/friends/add" asChild><Button title="Add a friend" /></Link></ScreenContainer>;
}