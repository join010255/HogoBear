import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Conversation: {conversationId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
  }
});
