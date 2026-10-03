import { Link } from "expo-router";
import { Text } from "react-native";
import { Button } from "../../src/components/common/Button";
import { Input } from "../../src/components/common/Input";
import { ScreenContainer } from "../../src/components/common/ScreenContainer";
import { colors } from "../../src/theme";

export default function LoginScreen() {
  return (
    <ScreenContainer>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Welcome back</Text>
      <Input label="Username or email" autoCapitalize="none" />
      <Input label="Password" secureTextEntry />
      <Button title="Log in" />
      <Link href="/(auth)/recovery" style={{ color: colors.accent }}>Recover account</Link>
    </ScreenContainer>
  );
}