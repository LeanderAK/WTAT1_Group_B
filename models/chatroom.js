const mongoose = require("mongoose"),
    messageSchema = mongoose.Schema({
        content: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        user: {
            required: true,
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
    }, { timestamps: true }),
    chatroomSchema = mongoose.Schema({
        messages: [messageSchema],
        users: {
            type: [{
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],
            validate: [usersLimit, `Tried to assign less or more than two Users to the Chatroom`]
        }
    }, { timestamps: true });

function usersLimit(val) {
    return val.length === 2;
}

module.exports = mongoose.model("Chatroom", chatroomSchema);