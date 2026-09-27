import { Text } from "react-native";
import { RecoveryHintForm } from "../../src/components/auth/RecoveryHintForm";
import { ScreenContainer } from "../../src/components/common/ScreenContainer";
import { colors } from "../../src/theme";

export default function RecoveryScreen() {
  return (
    <ScreenContainer>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>Recovery hint</Text>
      <Text style={{ color: colors.muted }}>Choose a private hint to help recover your account.</Text>
      <RecoveryHintForm />
    </ScreenContainer>
  );
}