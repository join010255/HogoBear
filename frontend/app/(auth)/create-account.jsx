import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button1 as Button } from "../../src/components/common/Button";
import { Input } from "../../src/components/common/Input";
import { ScreenContainer } from "../../src/components/common/ScreenContainer";
import { colors } from "../../src/theme";

export default function CreateAccountScreen() {
  return (
    <View>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Create account</Text>
      <Input label="Username" autoCapitalize="none" />
      <Input label="Email" keyboardType="email-address" autoCapitalize="none" />
      <Input label="Password" secureTextEntry />
      <Button title="Continue" />
      <Link href="/(auth)/recovery" style={{ color: colors.accent }}>Set up a recovery hint</Link>
    </View>
  );
}