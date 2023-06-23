const mongoose = require("mongoose"),
    stepSchema = mongoose.Schema({
        number: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    }),
    postSchema = mongoose.Schema({
        title: {
            type: String,
            required: true,
            maxLength: [50, "post title too long"]
        },
        description: {
            type: String,
            required: true,
            maxLength: [250, "post description too long"]
        },
        img: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            index: true
        },
        steps: [stepSchema],
        favoritedByUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        user: {required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    });
module.exports = mongoose.model("Post", postSchema);