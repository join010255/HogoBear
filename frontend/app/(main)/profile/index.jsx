import { Text } from "react-native";
import { ScreenContainer } from "../../../src/components/common/ScreenContainer";
import { colors } from "../../../src/theme";

export default function ProfileScreen() {
  return <ScreenContainer><Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Profile</Text><Text style={{ color: colors.muted }}>Manage your account and security settings.</Text></ScreenContainer>;
}