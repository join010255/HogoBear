import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "../../src/components/common/Button";
import { ScreenContainer } from "../../src/components/common/ScreenContainer";
import { colors } from "../../src/theme";

export default function SplashScreen() {
  return (
    <ScreenContainer centered>
      <View style={{ alignItems: "center", gap: 14 }}>
        <Text style={{ color: colors.accent, fontSize: 52 }}>H</Text>
        <Text style={{ color: colors.text, fontSize: 32, fontWeight: "700" }}>HogoBear</Text>
        <Text style={{ color: colors.muted, fontSize: 16 }}>Private conversations, your way.</Text>
        <Link href="/(auth)/create-account" asChild><Button title="Create account" /></Link>
        <Link href="/(auth)/login" asChild><Button title="Log in" variant="secondary" /></Link>
      </View>
    </ScreenContainer>
  );
}