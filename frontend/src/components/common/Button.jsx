import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";


const colors = {
  primary: "#FFFFFF",
  secondary: "#1C1C1C",
  tertiary: "#FFFFFF",
  neutral: "#0A0A0A"
};
export function Button1({ title, onPress }) {
  return (
    <TouchableOpacity
      style={style.secondaryButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={style.secondaryButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export function Button2({title, onPress}){
  return (
    <TouchableOpacity
      style={style.primaryButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={style.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}


const style = StyleSheet.create({
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
    primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.neutral,
    fontSize: 16,
    fontWeight: "700",
  },
});