import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { 
  ChevronLeft, Settings, Camera, BadgeCheck, Lock, 
  Shield, Copy, QrCode, Key, ChevronRight, Fingerprint, 
  Download, Trash2, AlertTriangle, Hexagon, LogOut, Check
} from 'lucide-react-native';
import { useAuthStore } from '../../../src/store/authStore';
import UserStore from '../../../src/store/userStore';

const colors = {
  background: "#0A0A0A",
  cardBg: "#121212",
  cardBgLight: "#1A1A1A",
  text: "#FFFFFF",
  muted: "#8CA1BC",
  accent: "#FFFFFF",
  red: "#FF453A",
  gold: "#D4AF37", 
};

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const clearVerifyData = useAuthStore(state => state.clearVerifyData);
  
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);

  const displayName = user?.username || 'SlyRaccoon_99';
  const handle = `@${displayName.toLowerCase()}`;
  const fullId = user?.tokenUser || '';
  const displayId = fullId.length > 25 ? `RC-${fullId.substring(0, 25)}...` : `RC-${fullId}`;

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(fullId);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  const handleLogout = async () => {
    await UserStore.ramoveData("userToken");
    clearVerifyData();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(main)/chats')}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.onlineDotSmall} />
          <Text style={styles.headerTitle}>ENCLAVE IDENTITY</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Image 
                source={require('../../../assets/RACCON_Chat.png')} 
                style={styles.avatarImage} 
                resizeMode="contain" 
              />
            </View>
          
            <View style={styles.statusBadge}>
              <View style={styles.statusInnerDot} />
            </View>
          </View>
          
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{displayName}</Text>
            
          </View>
          <Text style={styles.handleText}>{handle}</Text>

          <View style={styles.meshPill}>
            <Lock color={colors.text} size={12} />
            <Text style={styles.meshText}>ZERO-KNOWLEDGE MESH ACTIVE</Text>
          </View>
        </View>

        {/* Universal ID Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Hexagon color={colors.muted} size={16} />
              <Text style={styles.cardTitle}>RACCOON UNIVERSAL ID</Text>
            </View>
            
          </View>
          <View style={styles.idRow}>
            <Text style={styles.idText}>{displayId}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              {hasCopied ? <Check color="#000" size={16} /> : <Copy color="#000" size={16} />}
              <Text style={styles.copyText}>{hasCopied ? 'Copied' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
        </View>


        
        <View style={styles.togglesCard}>
          
          <TouchableOpacity style={styles.toggleRow}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(255, 69, 58, 0.1)'}]}>
              <Trash2 color={colors.red} size={20} />
            </View>
            <View style={styles.actionTexts}>
              <Text style={[styles.actionTitle, {color: colors.red}]}>Purge Local Enclave</Text>
              <Text style={styles.actionSubtitle}>Instant zeroization of ephemeral caches</Text>
            </View>
            <AlertTriangle color={colors.red} size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.toggleRow, {borderBottomWidth: 0}]} onPress={handleLogout}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(255, 69, 58, 0.1)'}]}>
              <LogOut color={colors.red} size={20} />
            </View>
            <View style={styles.actionTexts}>
              <Text style={[styles.actionTitle, {color: colors.red}]}>Logout</Text>
              <Text style={styles.actionSubtitle}>Disconnect from current session</Text>
            </View>
            <ChevronRight color={colors.red} size={20} />
          </TouchableOpacity>
        </View>



      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.muted,
    marginRight: 6,
  },
  headerTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  settingsText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#222',
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 60,
    height: 60,
  },
  cameraBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#222',
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.background,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  statusInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.text,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  nameText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  handleText: {
    color: colors.gold,
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  meshPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  meshText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  badgeLabel: {
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idText: {
    color: colors.muted,
    fontSize: 14,
    fontFamily: 'monospace',
    flex: 1,
    marginRight: 10,
  },
  copyButton: {
    backgroundColor: colors.text,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  copyText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrInfo: {
    flex: 1,
    paddingRight: 20,
  },
  cardSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  qrBox: {
    backgroundColor: colors.text,
    padding: 10,
    borderRadius: 12,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTexts: {
    flex: 1,
  },
  actionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  actionSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  togglesCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F1F1F',
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: 6,
  },
});