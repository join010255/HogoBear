import { ChevronLeft, User, KeyRound } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../../src/components/common/Input";
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button1, Button2 } from "../../src/components/common/Button";
import { usernameSchema, password as passwordSchema } from "../../src/utils/validators";
import { LogoutCard } from "../../src/components/common/Card"
import createAccountStore from "../../src/store/authStore";
import AuthApi from "../../src/api/auth.api"



const colors = {
  background: "#0A0A0A",
  green: "#1C1C1C",
  white: "#FFFFFF",
  smoletext: "#adadadff"
}

export default function CreateAccountScreen() {
  const [showWarning, setShowWarning] = useState(false);

  const { username, password, setAuthData, setAccountDetails } = createAccountStore();

  const [isloading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  const onchangeUsername = (e) => {
    const result = usernameSchema.safeParse({ username: e });
    if (!result.success) {
      setUsernameError(result.error.issues[0].message);
    } else {
      setAuthData(e, password);
      setUsernameError(null);
    }
  }

  const onChangePassword = (e) => {

    const result = passwordSchema.safeParse({ password: e })
    if (!result.success) {
      setPasswordError(result.error.issues[0].message)
    } else {
      setAuthData(username, e);
      setPasswordError(null)
    }
  }

  const handelCreateAccount = async() => {
    try {
      setLoading(true);
      setServerError(null);
      setUsernameError(null);

      const result = await AuthApi.createAccount({
        username: username,
        password: password
      })
      console.log(result.data.data)
      
      // Kan sauviw l'data f Zustand
      setAccountDetails(result.data.data)
      
      // Kandiwh l'page dyal recovery
      route.push("/recovery")
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create account";
      
      if (errorMsg.toLowerCase().includes("username")) {
        setUsernameError(errorMsg);
      } else {
        setServerError(errorMsg);
      }
    } finally {
      setLoading(false)
    }
  }

  const route = useRouter()
  return (
    <SafeAreaView style={style.screen}>
      <TouchableOpacity style={style.logout} onPress={() => setShowWarning(true)}>
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
          onChangeText={onchangeUsername}
          hasError={Boolean(usernameError)}
          returnKeyType="next"
        />
        {usernameError && (
          <Text style={{ color: "red", fontSize: 12 }}>
            {usernameError}
          </Text>
        )}

        <Input
          label="Password"
          icon={<KeyRound size={22} color="#94A3B8" />}
          placeholder="Password"
          onChangeText={onChangePassword}
          hasError={Boolean(passwordError)}
          returnKeyType="done"
        />
        {passwordError && (
          <Text style={{ color: "red", fontSize: 12 }}>
            {passwordError}
          </Text>
        )}

      </View>

      <View style={{ marginTop: 50, flex: 1 }}>
        <Button2 title={"Continue"} onPress={() => {
          if (usernameError || passwordError) {
            return
          }
          if (!username) {
            setUsernameError("can you write a username")
          }
          if (!password) {
            setPasswordError("can you write a username")
          } else {
            handelCreateAccount()
            // route.push("/recovery")
          }
        }} />
      </View>

      {/* {this modale is } */}
      <Modal transparent={true} visible={showWarning} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <LogoutCard
            onLogout={() => {
              setShowWarning(false);
              route.replace("/splash");
            }}
            onCancel={() => setShowWarning(false)}
          />
        </View>
      </Modal>

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

