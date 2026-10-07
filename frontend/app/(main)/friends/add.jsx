import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MoreVertical, Lock, Fingerprint, QrCode, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import FriendApi from '../../../src/api/friend.api';
import AuthApi from '../../../src/api/auth.api';
import { useAuthStore } from '../../../src/store/authStore';

const colors = {
  background: "#0A0A0A",
  card: "#171717",
  white: "#FFFFFF",
  muted: "#94A3B8",
  chipBg: "#1F1F1F",
  inputBg: "#1A1A1A",
  border: "rgba(255,255,255,0.05)",
  accent: "#1C1C1C",
};

export default function AddFriendScreen() {
  const router = useRouter();
  const [friendId, setFriendId] = useState('');
  const [loading, setLoading] = useState(false);
  const setVerifyData = useAuthStore(state => state.setVerifyData);

  const handleConnect = async () => {
    if (!friendId.trim()) return;
    setLoading(true);
    try {
      await FriendApi.addFriend(friendId.trim());
      
      const verifyResponse = await AuthApi.verifyToken();
      setVerifyData(verifyResponse.data);

      router.push('/(main)/chats');
    } catch (error) {
      Alert.alert('Connection Failed', error.response?.data?.error || error.response?.data?.message || 'Could not connect with peer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/(main)/chats')} style={styles.backButton}>
            <ChevronLeft color={colors.white} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Friend</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical color={colors.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileAvatar}>
            <Image 
              source={require('../../../assets/RACCON_Chat.png')} 
              style={styles.avatarImage} 
              resizeMode="contain" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Main Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.logoCircle}>
            <Image 
              source={require('../../../assets/RACCON_Chat.png')} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
          </View>
          <View style={styles.lockBadge}>
            <Lock color={colors.white} size={12} />
          </View>
        </View>

        {/* Titles */}
        <Text style={styles.title}>Add Direct Peer</Text>
        <Text style={styles.subtitle}>
          Connect securely using an air-gapped cryptographic Raccoon ID or scan their tactile matrix key.
        </Text>

        {/* Input Form */}
        <View style={styles.formContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>FRIEND'S PUBLIC KEY ID</Text>
            <View style={styles.zeroKnowledge}>
              <View style={styles.dot} />
              <Text style={styles.zeroKnowledgeText}>Zero-Knowledge</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Fingerprint color={colors.muted} size={20} style={styles.inputIconLeft} />
            <TextInput
              style={styles.input}
              placeholder="RC-9481-e2a0-4fbc"
              placeholderTextColor={colors.muted}
              value={friendId}
              onChangeText={setFriendId}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.qrButton}>
              <QrCode color={colors.white} size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.verifyButton} onPress={handleConnect} disabled={loading}>
          <Text style={styles.verifyButtonText}>{loading ? 'CONNECTING...' : 'VERIFY & CONNECT'}</Text>
          {!loading && <ArrowRight color="#000" size={20} style={{ marginLeft: 8 }} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarImage: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    alignSelf: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoImage: {
    width: 44,
    height: 44,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: colors.background,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#8CA1BC', // Slightly bluish grey
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  formContainer: {
    marginBottom: 30,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  zeroKnowledge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.muted,
    marginRight: 6,
  },
  zeroKnowledgeText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIconLeft: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  qrButton: {
    backgroundColor: '#333333',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});