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
        res.render("post/post.ejs");
    },
    new: (req, res, next) => {
        if(req.isAuthenticated()) {
            res.render("post/create_post.ejs")
        }else{
            res.locals.redirect = "/";
            req.flash("error", `You are not logged in`);
            next();
        }
    },
    create: (req, res, next) => {
        let postParams = {
            img: req.body.img,
            title: req.body.title,
            description: req.body.description,
            tags: JSON.parse(req.body.tags),
            time: req.body.time,
            steps: JSON.parse(req.body.steps),
            user: req.user._id,
        };
        Post.create(postParams)
            .then(post => {
                User.findByIdAndUpdate(postParams.user, {
                    $push: {posts: post._id}
                }).exec()
                    .then(() => {
                        res.locals.post = post;
                        res.locals.redirect = `/post/${post._id}`;
                        req.flash("success", `Post uploaded`);
                        console.log(`Created Post: ${post._id}`);
                        next();
                    })
                    .catch(error => {
                        res.locals.redirect = `/post/create`;
                        req.flash("error", `Failed to create post`);
                        console.log(`Error creating post: ${error.message}`);
                        next();
                    });
            })
            .catch(error => {
                res.locals.redirect = `/post/create`;
                req.flash("error", `Failed to create post`);
                console.log(`Error creating post: ${error.message}`);
                next();
            });
    },
    editView: (req, res, next) => {
        let postId = req.params.postId;
        if(req.isAuthenticated()) {
            Post.findById(postId).populate("user").exec()
                .then(post => {
                    if(req.user.isAdmin || (post.user === req.user)) {
                        res.render("post/edit_post.ejs", {post: post});
                    }else{
                        res.locals.redirect = "/post/" + postId;
                        req.flash("error", `You are not authorised to edit this post`);
                        next();
                    }
                })
                .catch(error => {
                    console.log(`Error fetching post by ID: ${postId}\n${error.message}`);
                    next(error);
                });
        }else{
            res.locals.redirect = "/post/" + postId;
            req.flash("error", `You are not logged in`);
            next();
        }
    },
    update: (req, res, next) => {
        let postId = req.params.postId;
        let postParams = {
            img: req.body.img,
            title: req.body.title,
            description: req.body.description,
            tags: JSON.parse(req.body.tags),
            time: req.body.time,
            steps: JSON.parse(req.body.steps),
        };
        Post.findByIdAndUpdate(postId, {
            $set: postParams
        },{runValidators: true}).exec()
            .then(post => {
                res.locals.post = post;
                res.locals.redirect = `/post/${postId}`;
                req.flash("success", `Post updated`);
                console.log(`Updated Post: ${postId}`);
                next();
            })
            .catch(error => {
                res.locals.redirect = `/post/${postId}/edit`;
                req.flash("error", `Failed to update post`);
                console.log(`Error updating post by ID: ${postId}\n${error.message}`);
                next();
            });
    },
    delete: (req, res, next) => {
        let postId = req.params.postId;
        if(req.isAuthenticated()) {
            Post.findById(postId).exec()
                .then(post => {
                    if((req.user.isAdmin) || (post.user === req.user)) {
                        User.findByIdAndUpdate(post.user, {
                            $pull: {posts: postId}
                        }).exec()
                            .then(() => {
                                Post.findByIdAndRemove(postId).exec()
                                    .then(() => {
                                        res.locals.redirect = "/";
                                        req.flash("success", `Post deleted`);
                                        console.log(`Deleted Post: ${postId}`);
                                        next();
                                    })
                                    .catch(error => {
                                        res.locals.redirect = `/post/${postId}`;
                                        req.flash("error", `Failed to delete post`);
                                        console.log(`Error deleting post by ID: ${postId}\n${error.message}`);
                                        next();
                                    });
                            })
                            .catch(error => {
                                res.locals.redirect = `/post/${postId}`;
                                req.flash("error", `Failed to remove post from your Account`);
                                console.log(`Error removing post by User: ${post.user}\n${error.message}`);
                                next();
                            });
                    } else {
                        res.locals.redirect = "/post/" + postId;
                        req.flash("error", `You are not authorised to delete this post`);
                        next();
                    }
                })
                .catch(error => {
                    res.locals.redirect = `/post/${postId}`;
                    req.flash("error", `Cannot find User`);
                    console.log(`Error finding User ${post.user}: ${error.message}`)
                })
        } else {
            res.locals.redirect = "/post/" + postId;
            req.flash("error", `You are not logged in`);
            next();
        }
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
};
