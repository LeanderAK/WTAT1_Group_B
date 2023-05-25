const Post = require("../models/post");
const User = require("../models/user");

module.exports = {
    show: (req, res, next) => {
        let postId = req.params.postId;
        Post.findById(postId).populate("user").exec()
            .then(post => {
                res.locals.post = post;
                next();
            })
            .catch(error => {
                console.log(`Error fetching post by ID: ${postId}\n${error.message}`);
                next(error);
            });
    },
    showView: (req, res) => {
        res.render("post/post.ejs")
    },
    new: (req, res) => {
        res.render("post/create_post.ejs")
    },
    create: (req, res, next) => {
        let stepsArray = JSON.parse(req.body.steps);
        let postParams = {
            img: req.body.img,
            title: req.body.title,
            description: req.body.description,
            steps: stepsArray,
            user: req.user._id,
        };
        Post.create(postParams)
            .then(post => {
                User.findByIdAndUpdate(postParams.user, {
                    $push: {posts: post._id}
                })
                    .then(() => {
                        res.locals.post = post;
                        res.locals.redirect = `/post/${post._id}`;
                        req.flash("success", `Post ${post._id} created successfully!`);
                        console.log(`Created Post: ${post._id}`);
                        next();
                    })
                    .catch(error => {
                        res.locals.redirect = `/post/create`;
                        req.flash("error", `Failed to create post because: ${error.message}`);
                        console.log(`Error creating post: ${error.message}`);
                        next();
                    });
            })
            .catch(error => {
                res.locals.redirect = `/post/create`;
                req.flash("error", `Failed to create post because: ${error.message}`);
                console.log(`Error creating post: ${error.message}`);
                next();
            });
    },
    editView: (req, res, next) => {
        let postId = req.params.postId;
        Post.findById(postId).exec()
            .then(post => {
                res.render("post/edit_post.ejs", {post: post});
            })
            .catch(error => {
                console.log(`Error fetching post by ID: ${postId}\n${error.message}`);
                next(error);
            });
    },
    update: (req, res, next) => {
        let postId = req.params.postId;
        let stepsArray = JSON.parse(req.body.steps);
        let postParams = {
            img: req.body.img,
            title: req.body.title,
            description: req.body.description,
            steps: stepsArray,
        };
        Post.findByIdAndUpdate(postId, {
            $set: postParams
        },{runValidators: true})
            .then(post => {
                res.locals.post = post;
                res.locals.redirect = `/post/${postId}`;
                req.flash("success", `Post ${postId} updated successfully!`);
                console.log(`Updated Post: ${postId}`);
                next();
            })
            .catch(error => {
                res.locals.redirect = `/post/${postId}/edit`;
                req.flash("error", `Failed to update post ${postId} because: ${error.message}`);
                console.log(`Error updating post by ID: ${postId}\n${error.message}`);
                next();
            });
    },
    delete: (req, res, next) => {
        let postId = req.params.postId;
        Post.findById(postId)
            .then(post => {
                User.findByIdAndUpdate(post.user, {
                    $pull: {posts: postId}
                })
                    .then(() => {
                        Post.findByIdAndRemove(postId)
                            .then(() => {
                                res.locals.redirect = "/";
                                req.flash("success", `Post ${postId} deleted successfully!`);
                                console.log(`Deleted Post: ${postId}`);
                                next();
                            })
                            .catch(error => {
                                res.locals.redirect = `/post/${postId}`;
                                req.flash("error", `Failed to delete post ${postId} because: ${error.message}`);
                                console.log(`Error deleting post by ID: ${postId}\n${error.message}`);
                                next();
                            });
                    })
                    .catch(error => {
                        res.locals.redirect = `/post/${postId}`;
                        req.flash("error", `Failed to remove post ${postId} from User because: ${error.message}`);
                        console.log(`Error removing post by User: ${post.user}\n${error.message}`);
                        next();
                    });
            })
            .catch(error => {
                res.locals.redirect = `/post/${postId}`;
                req.flash("error", `Cannot find User ${post.user} because: ${error.message}`);
                console.log(`Error finding User ${post.user}: ${error.message}`)
            })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
};
