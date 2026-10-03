import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import UserStore from "../../src/store/userStore";

const colors = {
  primary: "#FFFFFF",
  secondary: "#1C1C1C",
  tertiary: "#FFFFFF",
  neutral: "#0A0A0A"
};

const MOCK_MESSAGES = [
  { id: '1', text: "Welcome to Raccoon Chat", type: 'left' },
  { id: '2', text: "Raccoon is engineered\nto protect your privacy.", type: 'right' },
  { id: '3', text: "You don't even need a\nphone number to sign up.", type: 'left' },
  { id: '4', text: "Creating an account is\ninstant, free, and\nanonymous", type: 'right' },
];

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const user = await UserStore.getData();
      if (user) {
        console.log('user found in secure store');
        router.replace("/(main)/chats");
      }
    }
    checkUser();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.logoBox}>
            <Image
              source={require("../../assets/RACCON_Chat.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logoText}>Privacy in your pocket</Text>
        </View>

        <View style={styles.chatContainer}>
          {MOCK_MESSAGES.map((msg) => {
            const isLeft = msg.type === 'left';
            return (
              <View
                key={msg.id}
                style={[
                  styles.bubbleWrapper,
                  isLeft ? styles.bubbleWrapperLeft : styles.bubbleWrapperRight
                ]}
              >
                <View style={[styles.bubble, isLeft ? styles.bubbleLeft : styles.bubbleRight]}>
                  <Text style={isLeft ? styles.textLeft : styles.textRight}>{msg.text}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={() => {
            if (router) router.push("/create-account");
          }}
        >
          <Text style={styles.primaryButtonText}>Create account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => {
            if (router) router.push("/login");
          }}
        >
          <Text style={styles.secondaryButtonText}>I have an account</Text>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: "center", marginBottom: "5%"}}>
        <Text style={{ color: "white", fontSize: 12, marginTop: "2%" }}>
          By using this using, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.neutral,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  logoSection: {
    alignItems: "center",
    marginTop: "2%",
    marginBottom: 24,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: colors.secondary,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)"
  },
  logo: {
    width: 130,
    height: 130,
  },
  logoText: {
    color: colors.primary,
    fontSize: 19,
    marginTop: 16,
    fontWeight: "500",
  },
  chatContainer: {
    paddingHorizontal: 30,
    gap: 16,
    marginTop: 50,
    
  },
  bubbleWrapper: {
    width: '100%',
    flexDirection: 'row',
  },
  bubbleWrapperLeft: {
    justifyContent: 'flex-start',
  },
  bubbleWrapperRight: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  bubbleLeft: {
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  textLeft: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  textRight: {
    color: colors.neutral,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
    gap: 16,
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
  }
});