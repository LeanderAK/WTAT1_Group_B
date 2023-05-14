const Post = require("../models/post");

exports.postPage = (req, res) => {
    let postId = req.params.postId;
    Post.findById(postId).exec()
        .then(post => {
            if(post !== null) {
                res.render("post.ejs", {post: post});
            }else{
                res.render("error");
            }
        }).catch(error => {
        console.log(error.message);
        res.render("error.ejs");
    });
}
exports.createPostPage = (req, res) => {
    res.render("create_post.ejs");
};
exports.savePost = (req, res, next) => {
    let stepsArray = JSON.parse(req.body.steps);
    Post.create(
        {
            img: req.body.img,
            title: req.body.title,
            description: req.body.description,
            steps: stepsArray,
        })
        .then(post => {
            console.log("Created and rendered post of id: " + post._id)
            res.redirect(`/post/${post._id}`);
        })
        .catch(error => {
            console.log(`Error creating post!\n${error.message}`);
            next();
        })
};
exports.editPostPage = (req, res) => {
    let postId = req.params.postId;
    res.send(`This is the page to edit the post of id: ${postId}`);
};
exports.deletePostPage = (req, res, next) => {
    let postId = req.params.postId;
    Post.findByIdAndDelete(postId)
        .then(() => {
            res.redirect(`/`);
            console.log("deleted Post: " + postId);
        })
        .catch(error => {
            console.log(`Error deleting post by ID: ${postId}\n${error.message}`);
            next();
        });
};