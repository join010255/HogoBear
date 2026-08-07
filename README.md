# HogoBear -- Final Project Specification

# Phase 1 -- Project Overview

## Project Idea

**HogoBear** is a secure, privacy-focused messaging application.

The main goal of the project is to create a messaging platform where the
**server acts only as a relay** between users. The server is responsible
for connecting users, managing friendships, and forwarding encrypted
messages without being able to read their contents.

Unlike traditional messaging applications, passwords never leave the
user's device, and private encryption keys are never stored on the
server.

------------------------------------------------------------------------

# Phase 2 -- Technologies

## Mobile

-   React Native
-   Expo
-   JavaScript
-   Zustand
-   TanStack Query
-   Axios
-   Socket.IO Client

### Purpose

The mobile application is responsible for:

-   User registration
-   Local authentication
-   Encrypting messages
-   Decrypting received messages
-   Managing chats and friends
-   Communicating with the server

## Backend

-   Express.js
-   JavaScript
-   PostgreSQL
-   Sequelize ORM
-   Socket.IO
-   libsodium
-   dotenv
-   zod
-   helmet

### Purpose

The backend is responsible for:

-   Managing users
-   Managing friendships
-   Managing conversations
-   Forwarding encrypted messages
-   Real-time communication
-   Database management

The backend never decrypts user messages.

------------------------------------------------------------------------

# Phase 3 -- Security

-   End-to-End Encryption
-   X25519 Key Exchange
-   AES-256-GCM Encryption
-   HTTPS
-   Local Password Protection

The server stores only: - Public Key - Hogo Token

The server never stores: - Password - Private Key - Plain text messages

------------------------------------------------------------------------

# Phase 4 -- System Architecture

``` text
User A
   |
Encrypt Message
   |
Express Server (Relay)
   |
User B
   |
Decrypt Message
```

## Flow

1.  User A writes a message.
2.  The app encrypts it locally.
3.  The encrypted message is sent to the Express server.
4.  The server forwards it.
5.  User B decrypts it locally.

------------------------------------------------------------------------

# Phase 5 -- Registration

1.  User creates a local Password or PIN.
2.  The app generates:
    -   Hogo Token
    -   Public Key
    -   Private Key
3.  The Private Key is encrypted locally.
4.  The server stores only:
    -   Hogo Token
    -   Public Key

------------------------------------------------------------------------

# Phase 6 -- Login

1.  User enters the local password.
2.  The app decrypts the Private Key.
3.  The app connects using the stored Hogo Token.

------------------------------------------------------------------------

# Phase 7 -- Messaging

1.  User A requests User B's Public Key.
2.  The message is encrypted locally.
3.  Ciphertext is sent to the server.
4.  The server forwards the message.
5.  User B decrypts it locally.

------------------------------------------------------------------------

# Phase 8 -- Server Responsibilities

The server is responsible for:

-   User management
-   Friend management
-   Conversation management
-   Socket.IO connections
-   Forwarding encrypted messages

------------------------------------------------------------------------

# Phase 9 -- Database

## users

-   Hogo Token
-   Public Key
-   Avatar
-   Created At

## friends

-   User A
-   User B
-   Status

## conversations

-   User A
-   User B
-   Created At

------------------------------------------------------------------------

# Phase 10 -- Main Modules

-   Authentication
-   User Profile
-   Friends
-   Conversations
-   Messages
-   Notifications
-   Settings
-   Socket.IO
-   Encryption

------------------------------------------------------------------------

# Phase 11 -- Development Plan

1.  Express.js Setup
2.  PostgreSQL + Sequelize
3.  Authentication
4.  Users
5.  Friends
6.  Conversations
7.  Socket.IO
8.  End-to-End Encryption
9.  Notifications
10. Testing
11. Deployment

------------------------------------------------------------------------

# Final Goal

-   Server acts only as a relay.
-   Passwords remain on the user's device.
-   Messages are encrypted before leaving the sender.
-   Only the receiver can decrypt messages.
-   User privacy is the highest priority.
