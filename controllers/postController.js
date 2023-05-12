const Post = require("../models/post")

exports.postPage = (req, res) => {
    let postId = req.params.postId;
    Post.findById(postId).exec()
    .then(post => {
        res.render("post.ejs", { post: post });
    }).catch(error => {
        console.log(error.message);
        res.render("error.ejs");;
    });
}
exports.createPostPage = (req, res) => {
    res.render("create_post.ejs");
};
exports.savePost = (req, res) => {
    console.log(req.body)
    Post.create(
    {
        img: req.body.img,
        title: req.body.title,
        description: req.body.description
    })
    .then(post => {
        console.log("rendering with postid" + post._id)
        res.redirect(`/post/${post._id}`);    
    });
};
exports.editPostPage = (req, res) => {
    let postId = req.params.postId;
    res.send(`This is the page to edit the post of id: ${postId}`);
};
exports.deletePostPage = (req, res) => {
    let postId = req.params.postId;
    res.send(`This is the page to delete the post of id : ${postId}`);
};