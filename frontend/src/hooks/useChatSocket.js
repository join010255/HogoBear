import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../constants/config';

export const useChatSocket = ({
  token,
  conversationId,
  onPeerInfoLoaded,
  onReceiveMessage,
  onMessageSentAck,
  onMessageDelivered,
  onPresenceChange,
  isOnline
}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    
    // connect socket 
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected successfully:', socket.id, 'to', SOCKET_URL);

      if (conversationId) {
        socket.emit('conversation:join', { conversation_id: conversationId });
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message, `(Target: ${SOCKET_URL})`);
    });

    socket.on('conversation:joined', (data) => {
      console.log('Successfully joined conversation:');
      if (onPeerInfoLoaded && data?.peer) {
        onPeerInfoLoaded(data.peer);
      }
    });

    socket.on('receive_message', (message) => {
      // console.log('Received message:', message);
      if (onReceiveMessage) onReceiveMessage(message);
    });

    socket.on('message_sent_ack', (data) => {
      if (onMessageSentAck) onMessageSentAck(data);
    });

    socket.on('message_delivered', (data) => {
      if (onMessageDelivered) onMessageDelivered(data);
    });

    socket.on('user_online', (data) => {
      if (onPresenceChange) onPresenceChange({ ...data, isOnline: true });
    });

    socket.on('user_offline', (data) => {
      if (onPresenceChange) onPresenceChange({ ...data, isOnline: false });
    });

    socket.on('error', (err) => {
      console.error('Socket error event:', err?.message || err);
    });

    return () => {
      if (socket) {
        if (conversationId) {
          socket.emit('conversation:leave', { conversation_id: conversationId });
        }
        socket.disconnect();
      }
    };
  }, [token, conversationId, isOnline]);

  const sendMessage = useCallback((tempId, recipientId, payload) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('send_message', {
        tempId,
        recipientId,
        conversationId,
        payload,
      });
    }
  }, [conversationId]);

  return {
    socket: socketRef.current,
    sendMessage,
  };
};

export default useChatSocket;