import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const MESSAGES = [
  { id: '1', type: 'system_encryption', text: 'Messages are end-to-end encrypted. No server stores this conversation.' },
  { id: '2', type: 'received', text: 'hello my friend', time: '10:41 AM' },
  { id: '3', type: 'received_audio', duration: '0:24', time: '10:41 AM' },
  { id: '4', type: 'sent', text: 'hello', time: '10:42 AM', read: true },
  { id: '5', type: 'sent', text: 'did you verify the new safety fingerprint on the device?', time: '10:43 AM', read: true },
  { id: '6', type: 'sent', text: 'yes, everything matches the hash perfectly.', time: '10:43 AM', read: true },
];

export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams();
  const router = useRouter();
  const [inputText, setInputText] = useState('');

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
      {/* Header Area */}
      

      {/* Sub Header (Contact Info) */}
      <View style={styles.contactHeader}>
        <View style={styles.contactInfo}>
          <View>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=cipher' }} 
              style={styles.avatar} 
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactName}>Cipher Fox</Text>
            <Text style={styles.activeStatus}>• ACTIVE NOW</Text>
          </View>
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
          data={MESSAGES}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          ListHeaderComponent={
            <View style={styles.dateBadgeContainer}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>TODAY</Text>
              </View>
            </View>
          }
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Feather name="plus" size={24} color="#888" />
          </TouchableOpacity>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Message..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.micButton}>
              <Feather name="mic" size={20} color="#888" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={18} color="#000" />
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
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
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
