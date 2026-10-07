import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { ChevronLeft, Lock, HelpCircle, Copy, Check, BookOpen, Car, Hash, KeyRound, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react-native";
import { useRouter } from "expo-router";
import { createAccountStore, useAuthStore } from "../../src/store/authStore";
import { useState, useEffect } from "react";
import * as Clipboard from 'expo-clipboard';
import { Button2 } from "../../src/components/common/Button";
import AuthApi from "../../src/api/auth.api";
import UserStore from "../../src/store/userStore";

const colors = {
  background: "#0A0A0A",
  card: "#171717",
  white: "#FFFFFF",
  muted: "#94A3B8",
  chipBg: "#1F1F1F",
  border: "rgba(255,255,255,0.05)"
}

const style = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  backBtn: {
    backgroundColor: "#1C1C1C",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.chipBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.2
  },
  inputCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  inputLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  charCount: {
    color: colors.muted,
    fontSize: 12
  },
  input: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 28,
    minHeight: 100,
    textAlignVertical: "top",
    fontWeight: "500"
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginRight: 8
  },
  optimalText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700"
  },
  sectionTitle: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: "uppercase"
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.chipBg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  chipText: {
    color: colors.white,
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "600"
  },
  guaranteeBox: {
    flexDirection: "row",
    backgroundColor: colors.chipBg,
    padding: 20,
    borderRadius: 20,
    marginTop: 32,
    borderWidth: 1,
    borderColor: colors.border
  },
  guaranteeTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6
  },
  guaranteeDesc: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20
  },
  nextButton: {
    backgroundColor: colors.white,
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  },
  nextButtonText: {
    color: "#000",
    fontSize: 17,
    fontWeight: "700"
  },
  footerText: {
    color: "#333",
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1.5,
    marginBottom: 20
  }
});

export default function RecoveryScreen() {
  const router = useRouter();
  const { recovery_accout_text, username, tokenUser, password, setAccountDetails } = createAccountStore();
  const setVerifyData = useAuthStore(state => state.setVerifyData);
  const [hint, setHint] = useState("");
  const [hasCopied, setHasCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (recovery_accout_text) {
      setHint(recovery_accout_text);
    }
  }, [recovery_accout_text]);

  const copyToClipboard = async () => {
    if (hint) {
      await Clipboard.setStringAsync(hint);
      setHasCopied(true);

      
      setTimeout(() => {
        setHasCopied(false);
      }, 3000);
    }
  };

  const handleRefresh = async () => {
    if (!tokenUser || !password) {
      return
    };
    try {
      setIsRefreshing(true);
      const result = await AuthApi.refreshRecoveryText(tokenUser, password);
      console.log(result)
      setAccountDetails(result.data.data);
    } catch (error) {
      Alert.alert("Error", "Failed to refresh recovery text");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNext = async () => {
    const result = await AuthApi.login(tokenUser, password);

    if (result.data) {

      // Store the token securely and navigate to the main app
      await UserStore.setData("userToken", result.data.data.acessToken);

      // Fetch user data
      const verifyResponse = await AuthApi.verifyToken();
      setVerifyData(verifyResponse.data);

      router.replace("/(main)/chats");
    } else {
      Alert.alert("Error", "Failed to log in with the provided credentials.");
    }
  };

  return (
    <SafeAreaView style={style.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>

        {/* Header */}
        <View style={style.header}>
          <TouchableOpacity onPress={() => router.push('/(auth)/create-account')} style={style.backBtn}>
            <ChevronLeft size={28} color={colors.white} />
          </TouchableOpacity>

          <View style={style.badge}>
            <Lock size={14} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={style.badgeText}>{username}</Text>
          </View>

          <View style={{ width: 28 }} />
        </View>

        {/* Titles */}
        <View style={{ marginTop: 20 }}>
          <Text style={style.title}>Recovery Hint<Text style={{ color: colors.muted }}>•</Text></Text>
          <Text style={style.description}>
            Set a zero-knowledge mnemonic hint to trigger your local password recall. Because Raccoon Chat never stores your credentials, this encrypted hint is your only fallback.
          </Text>
        </View>

        {/* Input Card */}
        <View style={style.inputCard}>
          <View style={style.inputHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <HelpCircle size={14} color={colors.muted} />
              <Text style={style.inputLabel}>PERSONAL MNEMONIC KEY</Text>
            </View>
            <Text style={style.charCount}>{hint.length} / 120</Text>
          </View>

          <TextInput
            style={style.input}
            multiline
            value={hint}
            editable={false}
            placeholder="No hint generated."
            placeholderTextColor={colors.muted}
          />

          <View style={style.inputFooter}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={style.greenDot} />
              <Text style={style.optimalText}>Optimal Mnemonic</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={handleRefresh} disabled={isRefreshing} style={{ padding: 4, marginRight: 8, opacity: isRefreshing ? 0.5 : 1 }}>
                <RefreshCw size={20} color={colors.muted} />
              </TouchableOpacity>
              <TouchableOpacity onPress={copyToClipboard} style={{ padding: 4 }}>
                {hasCopied ? (
                  <Check size={20} color="#6EE7B7" />
                ) : (
                  <Copy size={20} color={colors.muted} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tactical Inspirations */}



        {/* Guarantee Box */}
        <View style={style.guaranteeBox}>
          <ShieldCheck size={24} color={colors.muted} style={{ marginTop: 4 }} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={style.guaranteeTitle}>Zero-Knowledge Guarantee</Text>
            <Text style={style.guaranteeDesc}>
              Never include your actual password or raw master key in this hint. Anyone with physical access to your device could trigger this reminder.
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 'auto' }}>
          <View style={{ marginBottom: 16 }}>
            <Button2 title="Next" onPress={handleNext} />
          </View>
          <Text style={style.footerText}>END-TO-END ENCRYPTED VAULT</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
