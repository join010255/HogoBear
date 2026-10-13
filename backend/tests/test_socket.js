import { io } from '../../frontend/node_modules/socket.io-client/build/esm/index.js';
import Users from '../src/modules/users/user.model.js';
import Conversation from '../src/modules/conversations/conversation.model.js';
import JWT from '../src/core/utils/jwt.js';

async function runTest() {
    console.log("=== STARTING FULL WEBSOCKET SUITE TEST ===");

    // 1. Fetch conversation & participants
    const conversation = await Conversation.findOne();
    if (!conversation) {
        console.error("No conversation found in DB to test");
        process.exit(1);
    }

    const tokenUser1 = await JWT.generateToken({ id: conversation.user_one });
    const tokenUser2 = await JWT.generateToken({ id: conversation.user_two });

    console.log(`Testing with conversation: ${conversation.id}`);

    // 2. Connect User 1 (Sender)
    const socket1 = io('http://localhost:3000', {
        auth: { token: tokenUser1 },
        transports: ['websocket'],
    });

    // 3. Connect User 2 (Receiver)
    const socket2 = io('http://localhost:3000', {
        auth: { token: tokenUser2 },
        transports: ['websocket'],
    });

    let joinedSuccess = false;
    let ackReceived = false;
    let messageReceived = false;
    let typingReceived = false;

    await new Promise((resolve) => {
        let connectedCount = 0;
        const checkDone = () => {
            connectedCount++;
            if (connectedCount === 2) resolve();
        };
        socket1.on('connect', checkDone);
        socket2.on('connect', checkDone);
    });

    console.log("✓ Both User 1 and User 2 authenticated and connected!");

    // Test conversation join on Socket 1
    socket1.on('conversation:joined', (data) => {
        console.log("✓ User 1 received 'conversation:joined' with peer info:", data.peer?.username || data.peer?.id);
        joinedSuccess = true;
    });
    socket1.emit('conversation:join', { conversation_id: conversation.id });

    // User 2 joins the room to receive messages
    socket2.emit('conversation:join', { conversation_id: conversation.id });

    // Listen for incoming message on Socket 2
    socket2.on('receive_message', (msg) => {
        console.log("✓ User 2 received 'receive_message':", msg.payload);
        messageReceived = true;

        // User 2 sends delivery ack
        socket2.emit('message_delivered_ack', {
            messageId: msg.messageId,
            senderId: msg.senderId
        });
    });

    // Listen for delivered ack on Socket 1
    socket1.on('message_delivered', (ack) => {
        console.log("✓ User 1 received 'message_delivered' ack for message:", ack.messageId);
    });

    // Listen for typing indicator on Socket 2
    socket2.on('user_typing', (data) => {
        console.log(`✓ User 2 received 'user_typing' (isTyping: ${data.isTyping})`);
        typingReceived = true;
    });

    // User 1 listens for server ACK
    socket1.on('message_sent_ack', (ack) => {
        console.log("✓ User 1 received 'message_sent_ack':", ack.status, ack.messageId);
        ackReceived = true;
    });

    // Wait a brief moment for room joins to register
    await new Promise((r) => setTimeout(r, 400));

    // Send a message from User 1
    socket1.emit('send_message', {
        tempId: 'temp-12345',
        recipientId: conversation.user_two,
        conversationId: conversation.id,
        payload: { ciphertext: 'ENCRYPTED_SECRET_TEST', nonce: 'NONCE_TEST' }
    });

    // Send typing event
    socket1.emit('typing_start', {
        recipientId: conversation.user_two,
        conversationId: conversation.id
    });

    // Wait for events to process
    await new Promise((r) => setTimeout(r, 800));

    socket1.disconnect();
    socket2.disconnect();

    console.log("\n=== TEST RESULTS ===");
    console.log("Joined Room:", joinedSuccess ? "PASSED" : "FAILED");
    console.log("Server Sent ACK:", ackReceived ? "PASSED" : "FAILED");
    console.log("Peer Received Message:", messageReceived ? "PASSED" : "FAILED");
    console.log("Typing Indicator:", typingReceived ? "PASSED" : "FAILED");

    if (joinedSuccess && ackReceived && messageReceived && typingReceived) {
        console.log("\n🎉 ALL WEBSOCKET TESTS PASSED SUCCESSFULLY! 🎉");
        process.exit(0);
    } else {
        console.error("\n❌ Some tests failed");
        process.exit(1);
    }
}

runTest().catch((err) => {
    console.error("Test error:", err);
    process.exit(1);
});
