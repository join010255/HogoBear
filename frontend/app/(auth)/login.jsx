import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button2 } from "../../src/components/common/Button";
import { Input } from "../../src/components/common/Input";
import AuthApi from "../../src/api/auth.api";
import UserStore from "../../src/store/userStore";
import { useAuthStore } from "../../src/store/authStore";
import { LogoutCard } from "../../src/components/common/Card";

const colors = {
  background: "#0A0A0A",
  green: "#1C1C1C",
  white: "#FFFFFF",
  smoletext: "#adadadff"
};

export default function LoginScreen() {
  const [tokenUser, setTokenUser] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();
  const setVerifyData = useAuthStore((state) => state.setVerifyData);

  const handleLogin = async () => {
    if (!tokenUser || !password) {
      setErrorMsg("Please enter both Raccoon ID and password.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    try {
      const response = await AuthApi.login(tokenUser, password);
      // The backend uses 'acessToken' instead of 'accessToken'
      const token = response.data.data.acessToken;
      await UserStore.setData("userToken", token);

      // Fetch user data
      const verifyResponse = await AuthApi.verifyToken();
      setVerifyData(verifyResponse.data);

      router.replace("/(main)/chats");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Modal transparent={true} visible={showWarning} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <LogoutCard
            onLogout={() => {
              setShowWarning(false);
              router.replace("/(auth)/splash");
            }}
            onCancel={() => setShowWarning(false)}
          />
        </View>
      </Modal>

      <TouchableOpacity style={styles.logout} onPress={() => setShowWarning(true)}>
        <ChevronLeft size={35} color={colors.white} />
      </TouchableOpacity>
      
      <View style={styles.logoSection}>
        <View style={styles.logoBox}>
          <Image
            source={require("../../assets/RACCON_Chat.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={{ alignItems: "center", paddingTop: "1%" }}>
        <Text style={styles.titreText}>Welcome Back</Text>
        <Text style={styles.smoleText}>Enter your Raccoon ID and password to access your encrypted chats.</Text>
      </View>

      <View style={{ marginTop: 40 }}>
        <Input 
          label="Raccoon ID (Token User)" 
          autoCapitalize="none"
          placeholder="Enter your 64-character ID"
          value={tokenUser}
          onChangeText={setTokenUser}
          returnKeyType="next"
        />
        <Input 
          label="Password" 
          secureTextEntry 
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
        />
        {errorMsg ? (
          <Text style={{ color: "red", fontSize: 14, marginTop: 10, textAlign: "center" }}>
            {errorMsg}
          </Text>
        ) : null}
      </View>

      <View style={{ marginTop: 50, flex: 1 }}>
        <Button2 
          title={isLoading ? "Logging in..." : "Log in"} 
          onPress={handleLogin} 
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 20 }}>
          <Link href="/(auth)/create-account" style={styles.recoveryLink}>Create account</Link>
          <Link href="/(auth)/recovery" style={styles.recoveryLink}>Recover account</Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 20,
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
  },
  recoveryLink: {
    color: colors.smoletext,
    textAlign: "center",
    fontSize: 16,
    textDecorationLine: "underline"
  }
});