import { ChevronLeft, User, KeyRound } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../../src/components/common/Input";
import { StyleSheet, View, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native"
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button1, Button2 } from "../../src/components/common/Button";


const colors = {
  background: "#0A0A0A",
  green: "#1C1C1C",
  white: "#FFFFFF",
  smoletext: "#adadadff"
}

export default function CreateAccountScreen() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  
  const route = useRouter()
  return (
    <SafeAreaView style={style.screen}>
      <TouchableOpacity style={style.logout} onPress={() => { route.replace("/splash") }}>
        <ChevronLeft size={35} color={colors.white} />
      </TouchableOpacity>
      <View style={style.logoSection}>
        <View style={style.logoBox}>
          <Image
            source={require("../../assets/RACCON_Chat.png")}
            style={style.logo}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={{ alignItems: "center", paddingTop: "1%" }}>
        <Text style={style.titreText}>Create Account</Text>
        <Text style={style.smoleText}>Generate your local cryptographic identity. No passwords leave this device.</Text>
      </View>

      <View style={{ marginTop: 40 }}>
        <Input
          label="Username"
          icon={<User size={22} color="#94A3B8" />}
          placeholder="Enter your display name"
          onChangeText={(text) => { setEmail(text) }}
          returnKeyType="next"
        />

        <Input
          label="Password"
          icon={<KeyRound size={22} color="#94A3B8" />}
          placeholder="Password"
          onChangeText={(password) => { setpassword(password) }}
          returnKeyType="done"
        />
        
      </View>
      <View style={{ marginTop: 50, flex: 1}}>
        <Button2 title={"Continue"} onPress={() => ''} />
      </View>


    </SafeAreaView>
  );
}


const style = StyleSheet.create({
  screen: {
    backgroundColor: "#0A0A0A",
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logout: {
    backgroundColor: colors.green,
    width: 40,
    height: 40,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center"
  },
  logoSection: {
    alignItems: "center",
    marginTop: "5%",
    marginBottom: 24
  },
  logoBox: {
    width: 120,
    height: 120,
    backgroundColor: colors.green,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)"
  },
  logo: {
    width: 160,
    height: 160,
  },
  titreText: {
    color: colors.white,
    fontSize: 32,
    marginTop: 16,
    fontWeight: "bold",
  },
  smoleText: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    paddingHorizontal: 40,
  }
})

