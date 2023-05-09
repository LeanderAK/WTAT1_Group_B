const mongoose = require("mongoose"),
 postSchema = mongoose.Schema({
    title: String,
    description: String,
    img: String,
 });
module.exports = mongoose.model("Post", postSchema);