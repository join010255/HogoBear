import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

// استبدل بـ IP ديال جهازك المحلي أو السيرفر الحقيقي
const SOCKET_URL = 'http://192.168.1.5:3000'; 

export const useChatSocket = ({
  token,
  conversationId,
  onPeerInfoLoaded,
  onReceiveMessage,
  onMessageSentAck,
  onMessageDelivered,
  onSyncPending,
  onUserTyping,
  onPresenceChange,
}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // 1. إنشاء الاتصال مع إرسال JWT Token فـ auth handshake
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'], // فرض استخدام الـ WebSocket للسرعة
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected successfully:', socket.id);

      // إذا كنا فـ محادثة معينة، ندخلو للـ Room مباشرة
      if (conversationId) {
        socket.emit('conversation:join', { conversation_id: conversationId });
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // ==========================
    // LISTENERS (Event Handlers)
    // ==========================

    // استقبال الـ Public Key ومعلومات الصديق بعد الانضمام للشات
    socket.on('conversation:joined', (data) => {
      console.log('Successfully joined conversation:', data);
      if (onPeerInfoLoaded) {
        onPeerInfoLoaded(data.peer); // { id, publicKey, avatar }
      }
    });

    // استقبال رسالة مشفرة جديدة
    socket.on('receive_message', (message) => {
      if (onReceiveMessage) onReceiveMessage(message);
    });

    // تأكيد استلام السيرفر للمسج (علامة واحدة ✓)
    socket.on('message_sent_ack', (data) => {
      if (onMessageSentAck) onMessageSentAck(data);
    });

    // تأكيد استلام المسج وفك تشفيره من طرف الصديق (علامتين ✓✓)
    socket.on('message_delivered', (data) => {
      if (onMessageDelivered) onMessageDelivered(data);
    });

    // مزامنة مسجات الأوفلاين فاش كيتكونيكتا اليوزر
    socket.on('sync_pending_messages', (messages) => {
      if (onSyncPending) onSyncPending(messages);
    });

    // مؤشر الكتابة (Typing indicator)
    socket.on('user_typing', (data) => {
      if (onUserTyping) onUserTyping(data);
    });

    // حالة التواجد (Online / Offline)
    socket.on('user_online', (data) => {
      if (onPresenceChange) onPresenceChange({ ...data, isOnline: true });
    });

    socket.on('user_offline', (data) => {
      if (onPresenceChange) onPresenceChange({ ...data, isOnline: false });
    });

    socket.on('error', (err) => {
      console.error('Socket error event:', err.message);
    });

    // Cleanup فاش كيخرج اليوزر من الشات أو الـ Component
    return () => {
      if (socket) {
        if (conversationId) {
          socket.emit('conversation:leave', { conversation_id: conversationId });
        }
        socket.disconnect();
      }
    };
  }, [token, conversationId]);


  const sendMessage = useCallback((tempId, recipientId, payload) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('send_message', {
        tempId,
        recipientId,
        conversationId,
        payload, // { nonce, ciphertext }
      });
    }
  }, [conversationId]);

  // تأكيد تسليم المسج للصديق
  const sendDeliveryAck = useCallback((messageId, senderId) => {
    if (socketRef.current) {
      socketRef.current.emit('message_delivered_ack', { messageId, senderId });
    }
  }, []);


  const acknowledgePendingSynced = useCallback((messageIds) => {
    if (socketRef.current) {
      socketRef.current.emit('ack_pending_synced', { messageIds });
    }
  }, []);


  const startTyping = useCallback((recipientId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('typing_start', { recipientId, conversationId });
    }
  }, [conversationId]);


  const stopTyping = useCallback((recipientId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('typing_stop', { recipientId, conversationId });
    }
  }, [conversationId]);

  return {
    socket: socketRef.current,
    sendMessage,
    sendDeliveryAck,
    acknowledgePendingSynced,
    startTyping,
    stopTyping,
  };
};