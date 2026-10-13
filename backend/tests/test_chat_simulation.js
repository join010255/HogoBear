import crypto from "crypto";
import bcrypt from "bcrypt";
import { io } from "../../frontend/node_modules/socket.io-client/build/esm/index.js";
import Users from "../src/modules/users/user.model.js";
import Conversation from "../src/modules/conversations/conversation.model.js";
import JWT from "../src/core/utils/jwt.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
};

async function createTestUser(name) {
    const randomHex = crypto.randomBytes(4).toString("hex");
    const username = `${name}_${randomHex}`;
    const tokenUser = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const recoveryText = `recovery_${username}_${crypto.randomBytes(16).toString("hex")}`;
    const fakePublicKey = Buffer.from(`curve25519_pk_${username}`).toString("base64");

    const user = await Users.create({
        username,
        tokenUser,
        password: hashedPassword,
        recovery_accout_text: recoveryText,
        publicKey: fakePublicKey,
        is_online: false,
    });

    const jwtToken = await JWT.generateToken({ id: user.id });

    return { user, jwtToken };
}

async function startConversationSimulation() {
    console.log(`\n${colors.bright}${colors.cyan}====================================================${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  🦝 RACCOON CHAT — TWO USERS LIVE CHAT SIMULATION ${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}====================================================${colors.reset}\n`);

    // 1. Create 2 Users in Database
    console.log(`[1/5] Creating 2 new users in Database...`);
    const aliceData = await createTestUser("Alice");
    const bobData = await createTestUser("Bob");
    console.log(`  ✓ Created User 1: ${colors.green}${aliceData.user.username}${colors.reset} (ID: ${aliceData.user.id})`);
    console.log(`  ✓ Created User 2: ${colors.green}${bobData.user.username}${colors.reset} (ID: ${bobData.user.id})`);

    // 2. Create Conversation between Alice and Bob
    console.log(`\n[2/5] Creating conversation between Alice and Bob...`);
    const conversation = await Conversation.create({
        user_one: aliceData.user.id,
        user_two: bobData.user.id,
    });
    console.log(`  ✓ Conversation created: ${colors.yellow}${conversation.id}${colors.reset}`);

    // 3. Connect both users to Socket.IO Server
    console.log(`\n[3/5] Connecting Alice & Bob to WebSocket server (http://localhost:3000)...`);
    const socketAlice = io("http://localhost:3000", {
        auth: { token: aliceData.jwtToken },
        transports: ["websocket"],
    });

    const socketBob = io("http://localhost:3000", {
        auth: { token: bobData.jwtToken },
        transports: ["websocket"],
    });

    await new Promise((resolve) => {
        let connected = 0;
        const check = () => {
            connected++;
            if (connected === 2) resolve();
        };
        socketAlice.on("connect", () => {
            console.log(`  🟢 Alice connected to socket: ${socketAlice.id}`);
            check();
        });
        socketBob.on("connect", () => {
            console.log(`  🟢 Bob connected to socket: ${socketBob.id}`);
            check();
        });
    });

    // 4. Setup Event Listeners
    console.log(`\n[4/5] Setting up chat listeners for Alice and Bob...`);

    // --- ALICE LISTENERS ---
    socketAlice.on("conversation:joined", (data) => {
        console.log(`  [Alice] Received peer info for: ${colors.magenta}${data.peer?.username}${colors.reset} (PK: ${data.peer?.publicKey})`);
    });

    socketAlice.on("message_sent_ack", (ack) => {
        console.log(`  [Alice] Message status: ${colors.green}✓ Sent to server${colors.reset} (MsgID: ${ack.messageId})`);
    });

    socketAlice.on("message_delivered", (data) => {
        console.log(`  [Alice] Message status: ${colors.cyan}✓✓ Delivered to Bob!${colors.reset}`);
    });

    socketAlice.on("user_typing", (data) => {
        if (data.isTyping) {
            console.log(`  ${colors.yellow}✍️  Alice sees: Bob is typing...${colors.reset}`);
        } else {
            console.log(`  ${colors.yellow}✍️  Alice sees: Bob stopped typing.${colors.reset}`);
        }
    });

    socketAlice.on("receive_message", (msg) => {
        console.log(`\n  💬 ${colors.green}[Alice Received from Bob]:${colors.reset} "${colors.bright}${msg.payload?.text || JSON.stringify(msg.payload)}${colors.reset}"`);
        // Alice sends delivery ack
        socketAlice.emit("message_delivered_ack", {
            messageId: msg.messageId,
            senderId: msg.senderId,
        });
    });

    // --- BOB LISTENERS ---
    socketBob.on("conversation:joined", (data) => {
        console.log(`  [Bob] Received peer info for: ${colors.magenta}${data.peer?.username}${colors.reset} (PK: ${data.peer?.publicKey})`);
    });

    socketBob.on("message_sent_ack", (ack) => {
        console.log(`  [Bob] Message status: ${colors.green}✓ Sent to server${colors.reset} (MsgID: ${ack.messageId})`);
    });

    socketBob.on("message_delivered", (data) => {
        console.log(`  [Bob] Message status: ${colors.cyan}✓✓ Delivered to Alice!${colors.reset}`);
    });

    socketBob.on("user_typing", (data) => {
        if (data.isTyping) {
            console.log(`  ${colors.yellow}✍️  Bob sees: Alice is typing...${colors.reset}`);
        } else {
            console.log(`  ${colors.yellow}✍️  Bob sees: Alice stopped typing.${colors.reset}`);
        }
    });

    socketBob.on("receive_message", async (msg) => {
        console.log(`\n  💬 ${colors.cyan}[Bob Received from Alice]:${colors.reset} "${colors.bright}${msg.payload?.text || JSON.stringify(msg.payload)}${colors.reset}"`);
        // Bob sends delivery ack
        socketBob.emit("message_delivered_ack", {
            messageId: msg.messageId,
            senderId: msg.senderId,
        });
    });

    // Both join conversation
    socketAlice.emit("conversation:join", { conversation_id: conversation.id });
    socketBob.emit("conversation:join", { conversation_id: conversation.id });

    await delay(500);

    // 5. START CONVERSATION FLOW
    console.log(`\n${colors.bright}[5/5] Live Conversation Simulation Starting...${colors.reset}\n`);

    // Step A: Alice starts typing
    console.log(`👉 Step 1: Alice starts typing...`);
    socketAlice.emit("typing_start", {
        recipientId: bobData.user.id,
        conversationId: conversation.id,
    });
    await delay(1200);

    // Step B: Alice stops typing & sends Message 1
    socketAlice.emit("typing_stop", {
        recipientId: bobData.user.id,
        conversationId: conversation.id,
    });
    await delay(300);

    console.log(`👉 Step 2: Alice sends Message 1 to Bob...`);
    socketAlice.emit("send_message", {
        tempId: `alice_msg_${Date.now()}`,
        recipientId: bobData.user.id,
        conversationId: conversation.id,
        payload: {
            text: "Salam Bob! Kif dayr? Wach WebSocket mzyan daba? 🦝🔒",
            nonce: "e2e_nonce_sample_123",
            ciphertext: "sample_ciphertext_hash_abc",
        },
    });

    await delay(1500);

    // Step C: Bob starts typing reply
    console.log(`\n👉 Step 3: Bob starts typing a reply...`);
    socketBob.emit("typing_start", {
        recipientId: aliceData.user.id,
        conversationId: conversation.id,
    });
    await delay(1200);

    socketBob.emit("typing_stop", {
        recipientId: aliceData.user.id,
        conversationId: conversation.id,
    });
    await delay(300);

    // Step D: Bob sends Message 2 back to Alice
    console.log(`👉 Step 4: Bob sends reply to Alice...`);
    socketBob.emit("send_message", {
        tempId: `bob_msg_${Date.now()}`,
        recipientId: aliceData.user.id,
        conversationId: conversation.id,
        payload: {
            text: "Wa 3alaykom salam Alice! Labas lhamdullah, kolchi khdam nadi 100%! 🚀✨",
            nonce: "e2e_nonce_sample_456",
            ciphertext: "sample_ciphertext_hash_def",
        },
    });

    await delay(1500);

    // Disconnect
    console.log(`\nClosing connections...`);
    socketAlice.disconnect();
    socketBob.disconnect();

    console.log(`\n${colors.bright}${colors.green}====================================================${colors.reset}`);
    console.log(`${colors.bright}${colors.green}  🎉 CONVERSATION SIMULATION COMPLETED SUCCESSFULLY! ${colors.reset}`);
    console.log(`${colors.bright}${colors.green}====================================================${colors.reset}\n`);

    process.exit(0);
}

startConversationSimulation().catch((err) => {
    console.error("Simulation error:", err);
    process.exit(1);
});
