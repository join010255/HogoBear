import Users from "./users/user.model.js";
import Friends from "./friends/friend.model.js";
import Conversation from "./conversations/conversation.model.js";

// ==================== FRIENDS ====================

// User -> friends records
Users.hasMany(Friends, {
    foreignKey: "user_id",
    as: "friends"
});

// User -> records where he is the friend
Users.hasMany(Friends, {
    foreignKey: "friend_id",
    as: "friendOf"
});

// Friends -> user who created the friendship
Friends.belongsTo(Users, {
    foreignKey: "user_id",
    as: "user"
});

// Friends -> actual friend
Friends.belongsTo(Users, {
    foreignKey: "friend_id",
    as: "friend"
});


// ==================== CONVERSATIONS ====================

Users.hasMany(Conversation, {
    foreignKey: "user_one",
    as: "conversationsAsUserOne"
});

Users.hasMany(Conversation, {
    foreignKey: "user_two",
    as: "conversationsAsUserTwo"
});

Conversation.belongsTo(Users, {
    foreignKey: "user_one",
    as: "userOne"
});

Conversation.belongsTo(Users, {
    foreignKey: "user_two",
    as: "userTwo"
});

export { Users, Friends, Conversation };
