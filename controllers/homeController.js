const Post = require("../models/post")

module.exports = {
    showHome: (req, res) => {
        Post.find({}).populate("user").exec()
            .then((posts) => {
                res.render("home.ejs", {posts: posts});
            })
            .catch((error) => {
                console.log(error.message);
                res.render("error.ejs");
            })
    }
};
