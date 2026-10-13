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
      transports: ['websocket'],
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

    // استقبال معلومات الصديق والـ Public Key بعد الانضمام للشات
    socket.on('conversation:joined', (data) => {
      console.log('Successfully joined conversation:', data);
      if (onPeerInfoLoaded && data?.peer) {
        onPeerInfoLoaded(data.peer); // { id, username, publicKey, tokenUser, isOnline }
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

    // تأكيد استلام المسج من طرف الصديق (علامتين ✓✓)
    socket.on('message_delivered', (data) => {
      if (onMessageDelivered) onMessageDelivered(data);
    });

    // مزامنة مسجات الأوفلاين
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
      console.error('Socket error event:', err?.message || err);
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

  // ==========================
  // EMITTERS (Actions)
  // ==========================

  // إرسال مسج مشفر
  const sendMessage = useCallback((tempId, recipientId, payload) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('send_message', {
        tempId,
        recipientId,
        conversationId,
        payload, // { nonce, ciphertext } أو أي بيانات
      });
    }
  }, [conversationId]);

  // تأكيد تسليم المسج للصديق
  const sendDeliveryAck = useCallback((messageId, senderId) => {
    if (socketRef.current) {
      socketRef.current.emit('message_delivered_ack', { messageId, senderId });
    }
  }, []);

  // تأكيد مسح مسجات الأوفلاين بعد حفظها محلياً
  const acknowledgePendingSynced = useCallback((messageIds) => {
    if (socketRef.current) {
      socketRef.current.emit('ack_pending_synced', { messageIds });
    }
  }, []);

  // بدء الكتابة
  const startTyping = useCallback((recipientId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('typing_start', { recipientId, conversationId });
    }
  }, [conversationId]);

  // توقف عن الكتابة
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

export default useChatSocket;