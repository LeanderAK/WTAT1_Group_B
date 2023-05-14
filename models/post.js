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
        steps: [stepSchema],
    });
module.exports = mongoose.model("Post", postSchema);