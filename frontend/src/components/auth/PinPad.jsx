import { View } from "react-native";
import { Button } from "../common/Button";

export function PinPad({ onDigit }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => <View key={digit} style={{ width: "30%" }}><Button title={String(digit)} onPress={() => onDigit?.(String(digit))} variant="secondary" /></View>)}</View>;
}