const mongoose = require("mongoose"),
    stepSchema = mongoose.Schema({
        number: String,
        description: String,
    }),
    postSchema = mongoose.Schema({
        title: String,
        description: String,
        img: String,
        steps: [stepSchema],
    });
module.exports = mongoose.model("Post", postSchema);