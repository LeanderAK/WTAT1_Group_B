const Post = require("../models/post");
const User = require("../models/user");
const {isAuthorized} = require("../public/js/authFunctions");

module.exports = {
    show: (req, res, next) => {
        let postId = req.params.postId;
        Post.find({ favorites: { $in: [req.user._id] } }).populate("user").exec()
            .then(posts => {
                if (req.query.format === "json"){
                    res.json(posts)
                } else {
                    res.locals.posts = posts;
                    res.render("favorites.ejs");
                }
            })
            .catch(error => {
                console.log(`Error fetching posts`);
                next(error);
            });
    },
};