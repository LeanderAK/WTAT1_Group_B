const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
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
        profilePicture: {
            data: Buffer,
            contentType: String,
        },

        followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        favoritedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
        posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
        isAdmin: {
            type: Boolean,
            default: false,
        },
    });

userSchema.plugin(passportLocalMongoose, {
    usernameField: "username",
});

module.exports = mongoose.model("User", userSchema);