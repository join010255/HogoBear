// Empty file
import Users from "./user.model";
import Friends from "./friend.model";
import Conversation from "./conversation.model";


// hadi 5adi i traje3 mzyan

// user wahed i 9dar i kono ando fzaf diyal frands
Users.hasMany(Friends , {
    foreignKey : "user_id"
});

// user wahed i 9dar i kon f howa frand and bzaf diyal diyale users
Users.hasMany(Friends, {
    foreignKey : "friend_id"
});

// kola frand rah mt3al9 b user_id ya3ni hta frand rah user bhad dato
Friends.belongsTo(Users, {
    foreignKey : "user_id"
});

Friends.belongsTo(Users, {
    foreignKey : "friend_id"
});


Users.hasMany(Conversation, {
    foreignKey : "user_on"
})

Users.hasMany(Conversation, {
    foreignKey : "user_two"
})

Conversation.belongsTo(Users, {
    foreignKey : "user_on"
})

Conversation.belongsTo(Users, {
    foreignKey : "user_two"
})