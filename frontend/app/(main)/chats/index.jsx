import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";


const colors = {
  background: "#0A0A0A",
  green: "#1C1C1C",
  white: "#FFFFFF",
  smoletext: "#adadadff"
}


export default function ChatsScreen() {
  return (
    <SafeAreaView style={style.screen}>

    </SafeAreaView>
  )
}


const style = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1
  }
})