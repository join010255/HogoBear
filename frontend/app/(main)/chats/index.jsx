import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shield, Search, Settings, Lock, Circle, CheckCheck, Mic, Clock, Plus, Key } from "lucide-react-native";

const colors = {
  background: "#0A0A0A", // Very dark background
  green: "#1C1C1C",
  white: "#FFFFFF",
  smoletext: "#adadadff",
  pillActive: "#FFFFFF",
  pillActiveText: "#000000",
  pillInactive: "#1A1A1A",
  bannerBg: "#121212",
  inputBg: "#1A1A1A",
  divider: "#222222",
  avatarBg: "#222",
};

const chatData = [
  {
    id: '1',
    name: 'Cipher Fox',
    message: 'did you verify the new safety fing...',
    time: '10:43 AM',
    unreadCount: 2,
    avatar: 'https://i.pravatar.cc/150?u=cipher',
    icon: 'shield',
  },
  {
    id: '2',
    name: 'Shadow Raven',
    message: 'Voice note (0:34)',
    time: 'Yesterday',
    isVoice: true,
    read: true,
    avatar: 'https://i.pravatar.cc/150?u=shadow',
  },
  {
    id: '3',
    name: 'Ghost Badger',
    message: 'Key exchange complete.',
    time: 'Mon',
    isLocked: true,
    avatar: 'https://i.pravatar.cc/150?u=ghost',
    icon: 'key',
  },
  {
    id: '4',
    name: 'Neon Lynx',
    message: 'See you in the encrypted room.',
    time: 'Oct 14',
    isPending: true,
    avatar: 'https://i.pravatar.cc/150?u=neon',
  },
];

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Chats');

  const filters = [
    { label: 'All Chats' },
    { label: 'Direct' },
    { label: 'Vaults', icon: 'lock' },
    { label: 'Unread', icon: 'dot' }
  ];

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={style.chatItem}>
      <Image source={{ uri: item.avatar }} style={style.avatarLarge} />
      
      <View style={style.chatContent}>
        <View style={style.chatHeader}>
          <View style={style.chatNameContainer}>
            <Text style={style.chatName}>{item.name}</Text>
            {item.icon === 'shield' && <Shield color={colors.smoletext} size={14} style={style.nameIcon} />}
            {item.icon === 'key' && <Key color={colors.smoletext} size={14} style={style.nameIcon} />}
          </View>
          <Text style={[style.chatTime, item.unreadCount > 0 ? style.chatTimeUnread : null]}>{item.time}</Text>
        </View>
        
        <View style={style.chatFooter}>
          <View style={style.messagePreviewContainer}>
            {item.isVoice && <Mic color={colors.smoletext} size={14} style={style.msgIcon} />}
            <Text style={[style.chatMessage, item.unreadCount > 0 && style.chatMessageUnread]} numberOfLines={1}>
              {item.message}
            </Text>
          </View>
          
          <View style={style.chatStatus}>
            {item.unreadCount > 0 && (
              <View style={style.unreadBadge}>
                <Text style={style.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
            {item.read && <CheckCheck color={colors.smoletext} size={16} />}
            {item.isLocked && <Lock color={colors.smoletext} size={14} />}
            {item.isPending && <Clock color={colors.smoletext} size={14} />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={style.screen}>
      {/* Header */}
      <View style={style.header}>
        <View style={style.headerLeft}>
          <Shield color={colors.white} size={28} />
          <View style={style.headerTitleContainer}>
            <Text style={style.headerSubtitle}>RACCOON CHAT</Text>
            <Text style={style.headerTitle}>Chats</Text>
          </View>
        </View>
        <View style={style.headerRight}>
          <TouchableOpacity style={style.iconButton}>
            <Search color={colors.smoletext} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={style.iconButton}>
            <Settings color={colors.smoletext} size={22} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={style.avatarSmall} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={style.searchContainer}>
        <Search color={colors.smoletext} size={18} style={style.searchIcon} />
        <TextInput
          style={style.searchInput}
          placeholder="Search conversations or Raccoon IDs..."
          placeholderTextColor={colors.smoletext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={style.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={style.filtersContent}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter.label;
            return (
              <TouchableOpacity 
                key={filter.label}
                style={[style.filterPill, isActive ? style.filterPillActive : style.filterPillInactive]}
                onPress={() => setActiveFilter(filter.label)}
              >
                {filter.icon === 'lock' && <Lock color={isActive ? colors.pillActiveText : colors.smoletext} size={14} style={{ marginRight: 6 }} />}
                <Text style={[style.filterText, isActive ? style.filterTextActive : null]}>
                  {filter.label}
                </Text>
                {filter.icon === 'dot' && <View style={[style.unreadDot, { backgroundColor: isActive ? colors.pillActiveText : colors.smoletext }]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={style.scrollViewContent} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Banner */}
        <View style={style.bannerContainer}>
          <View style={style.bannerLeft}>
            <Shield color="#8CA1BC" size={24} /> 
            <View style={style.bannerTextContainer}>
              <Text style={style.bannerTitle}>Zero-Knowledge State</Text>
              <Text style={style.bannerSubtitle}>Quantum-resistant peer ratchet active</Text>
            </View>
          </View>
        </View>

        {/* Chat List */}
        <View style={style.chatListContainer}>
          {chatData.map((item) => (
            <React.Fragment key={item.id}>
              {renderChatItem({ item })}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={style.fab}>
        <Plus color={colors.background} size={20} style={style.fabIcon} />
        <Text style={style.fabText}>Add Friend</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleContainer: {
    marginLeft: 10,
  },
  headerSubtitle: {
    color: colors.smoletext,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 4,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.avatarBg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingRight: 32, // extra padding to ensure full scrolling
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterPillActive: {
    backgroundColor: colors.pillActive,
  },
  filterPillInactive: {
    backgroundColor: colors.pillInactive,
  },
  filterText: {
    color: colors.smoletext,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.pillActiveText,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.smoletext,
    marginLeft: 6,
  },
  scrollViewContent: {
    flex: 1,
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bannerBg,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  bannerTitle: {
    color: '#8CA1BC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: colors.smoletext,
    fontSize: 13,
  },
  chatListContainer: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.avatarBg,
  },
  chatContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  nameIcon: {
    marginLeft: 6,
  },
  chatTime: {
    color: colors.smoletext,
    fontSize: 12,
  },
  chatTimeUnread: {
    color: colors.white,
    fontWeight: '600',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  msgIcon: {
    marginRight: 4,
  },
  chatMessage: {
    color: colors.smoletext,
    fontSize: 14,
    flex: 1,
  },
  chatMessageUnread: {
    color: colors.white,
    fontWeight: '500',
  },
  chatStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 30,
  },
  unreadBadge: {
    backgroundColor: colors.white,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabIcon: {
    marginRight: 8,
  },
  fabText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
