import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import ConversationApi from '../../../src/api/conversations.api';
import { useAuthStore } from '../../../src/store/authStore';
import UserStore from '../../../src/store/userStore';
import { useChatSocket } from '../../../src/hooks/useChatSocket';
import Keys from "../../../src/crypto/keys"


export default function ConversationScreen() {
  const router = useRouter();
  const { conversationId } = useLocalSearchParams();
  const currentUser = useAuthStore((state) => state.user);
  const [friend, setFriend] = useState(null);
  const [inputText, setInputText] = useState('');
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [shareKey, setSharedKey] = useState(null);
  const isOnline = Boolean(friend?.is_online);



  useEffect(() => {
    const loadToken = async() => {
      const userToken = await UserStore.getData("userToken")
      if(userToken){
        setToken(userToken)
      }
    }
    loadToken()
  }, []);

    const { sendMessage } = useChatSocket({
    token,
    conversationId,
    onPeerInfoLoaded: async(peer) => {
      if (peer) {
        if(peer?.publicKey){
          const key = await Keys.exchangeKeys(peer.publicKey)
          setSharedKey(key)
          console.log(key)
        }  
        setFriend((prev) => ({
          ...prev,
          ...peer,
          is_online: peer.isOnline !== undefined ? peer.isOnline : prev?.is_online,
        }));
      }
    },
    onReceiveMessage: (msg) => {
      const receivedMsg = {
        id: msg.messageId || msg.tempId || Date.now().toString(),
        text: typeof msg.payload === 'string' ? msg.payload : msg.payload?.text,
        type: 'received',
        time: new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, receivedMsg]);
    },
    onPresenceChange: ({ userId, isOnline }) => {
      setFriend((prev) => {
        if (prev && (!userId || prev.id === userId)) {
          return { ...prev, is_online: isOnline };
        }
        return prev;
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputText.trim() || !isOnline || !friend?.id) return;

    const tempId = Date.now().toString();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: tempId,
      text: inputText.trim(),
      type: 'sent',
      time: timeNow,
    };
    setMessages((prev) => [...prev, newMsg]);

    sendMessage(tempId, friend.id, inputText.trim());
    setInputText('');
  };

  const renderMessage = ({ item }) => {
    if (item.type === 'system_encryption') {
      return (
        <View style={styles.encryptionContainer}>
          <View style={styles.encryptionBadge}>
            <Feather name="lock" size={12} color="#fff" style={styles.lockIcon} />
            <Text style={styles.encryptionText}>{item.text}</Text>
          </View>
        </View>
      );
    }

    const isSent = item.type === 'sent';
    const isAudio = item.type === 'received_audio';

    return (
      <View style={[styles.messageRow, isSent ? styles.messageRowSent : styles.messageRowReceived]}>
        <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
          {isAudio ? (
            <View style={styles.audioContainer}>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={16} color="#fff" />
              </TouchableOpacity>
              <View style={styles.waveform}>
                {[1, 2, 3, 4, 3, 2, 1, 2, 4, 5, 4, 2, 1].map((val, idx) => (
                  <View key={idx} style={[styles.waveBar, { height: val * 4 }]} />
                ))}
              </View>
              <Text style={styles.audioDuration}>{item.duration}</Text>
            </View>
          ) : (
            <Text style={[styles.messageText, isSent ? styles.sentText : styles.receivedText]}>
              {item.text}
            </Text>
          )}
        </View>
        <View style={[styles.timeContainer, isSent ? styles.timeContainerSent : styles.timeContainerReceived]}>
          <Text style={styles.timeText}>{item.time}</Text>
          {isSent && item.read && (
            <Ionicons name="checkmark-done" size={14} color="#888" style={styles.readIcon} />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.contactHeader}>
        <View style={styles.contactInfo}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={{ marginRight: 10, padding: 4 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.contactTextContainer} 
            onPress={() => {
              if (!friend) return;
              router.push({
                pathname: '/(main)/profile',
                params: {
                  friendId: friend.id,
                  username: friend.username,
                  tokenUser: friend.tokenUser,
                  is_online: isOnline ? 'true' : 'false',
                  publicKey: friend.publicKey || ''
                }
              });
            }}
          >
            <Text style={styles.contactName}>
              {friend?.username || "Loading..."}
            </Text>
            <Text style={[styles.activeStatus, { color: isOnline ? "#4ade80" : "#888888" }]}>
              {isOnline ? "• ONLINE" : "• OFFLINE"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactActions}>
          <TouchableOpacity style={styles.actionIcon}>
            <Feather name="more-vertical" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          
          <View style={[styles.textInputWrapper, !isOnline && { opacity: 0.5 }]}>
            <TextInput
              style={styles.textInput}
              placeholder={isOnline ? "Message..." : "User is offline (cannot send message)"}
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              editable={isOnline}
              multiline
            />
            
          </View>
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!isOnline || !inputText.trim()) && { backgroundColor: "#333", opacity: 0.5 }
            ]}
            disabled={!isOnline || !inputText.trim()}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={18} color={isOnline && inputText.trim() ? "#000" : "#666"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerRightIcon: {
    padding: 5,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextContainer: {
    marginLeft: 12,
  },
  contactName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeStatus: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginLeft: 20,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  dateBadgeContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dateBadge: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  encryptionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  encryptionBadge: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    maxWidth: '85%',
  },
  lockIcon: {
    marginRight: 8,
  },
  encryptionText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    flex: 1,
  },
  messageRow: {
    marginBottom: 15,
  },
  messageRowSent: {
    alignItems: 'flex-end',
  },
  messageRowReceived: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sentBubble: {
    backgroundColor: '#262626',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#000',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeContainerSent: {
    justifyContent: 'flex-end',
  },
  timeContainerReceived: {
    justifyContent: 'flex-start',
  },
  timeText: {
    color: '#666',
    fontSize: 11,
  },
  readIcon: {
    marginLeft: 4,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
    marginRight: 10,
  },
  waveBar: {
    width: 3,
    backgroundColor: '#000',
    borderRadius: 1.5,
  },
  audioDuration: {
    color: '#000',
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 10,

  },
  attachButton: {
    padding: 10,
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    minHeight: 40,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
  },
  micButton: {
    padding: 5,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
