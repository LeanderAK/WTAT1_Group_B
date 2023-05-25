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
        favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
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