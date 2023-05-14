const mongoose = require("mongoose"),
    userSchema = mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    });
module.exports = mongoose.model("User", userSchema);