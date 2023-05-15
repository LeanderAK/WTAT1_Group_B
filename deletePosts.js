const mongoose = require("mongoose"),
    Post = require("./models/post");
//User = require("./user");
mongoose.connect(
    "mongodb://127.0.0.1:27017/creape_db",
    { useNewUrlParser: true }
);

mongoose.connection;

Post.deleteMany()
    .exec()
    .then(() => {
        console.log("Post data is empty!");
        mongoose.connection.close();
    }).catch(error => { console.log(error) });