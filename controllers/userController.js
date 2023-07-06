const User = require("../models/user"),
    passport = require("passport");
const jsonWebToken = require("jsonwebtoken");
const { redirectView } = require("./postController");
const { isAuthorized } = require("../public/js/authFunctions");
const fs = require('fs');
const path = require("path");
const Post = require("../models/post");
const {pageNotFoundError} = require("./errorController");
const user = require("../models/user");

module.exports = {
    index: (req, res, next) => {
        User.find().exec()
            .then(users => {
                res.locals.title = "All Users";
                res.locals.users = users;
                next();
            })
            .catch(error => {
                console.log(error.message);
                next(error);
            });
    },
    indexView: (req, res) => {
        res.render("adminUsers.ejs");
    },
    show: (req, res, next) => {
        let userId = req.params.userId;
        User.findById(userId).populate("posts").exec()
            .then(user => {
                res.locals.title = user.username;
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${userId}\n${error.message}`);
                res.locals.error = "user";
                pageNotFoundError(req, res);
            });
    },
    showView: (req, res) => {
        res.render("user/user.ejs")
    },
    register: (req, res) => {
        res.locals.title = "Register";
        res.render("user/register.ejs")
    },
    create: (req, res, next) => {
        if (req.skip) next();
        if (req.body.password.length < 8) {
            req.flash("error", "Password must contain at least 8 symbols");
            res.locals.redirect = "/register";
            redirectView(req, res, next);
        } else {
            let name = req.body.username;
            User.findOne({ username: name }).exec()
                .then(user => {
                    req.flash("error", `Username \"${user.username}\" already exists`);
                    res.locals.redirect = "/register";
                    redirectView(req, res, next);
                })
                .catch(() => {
                    let userParams = {
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        profilePicture: {
                            data: fs.readFileSync(path.join(__dirname, '../public/images/ProfilePictureDefault.jpeg')),
                            contentType: 'image/png'
                        },
                        isAdmin: req.body.isAdmin,
                    };
                    let newUser = new User(userParams);
                    User.register(newUser, req.body.password, (error, user) => {
                        if (user) {
                            req.flash("success", `${user.username}'s account created`);
                            console.log(`Created User: ${user._id}`);
                            next();
                        } else {
                            req.flash("error", `Failed to register user`);
                            console.log(`Error creating user: ${error.message}`);
                            next();
                        }
                    });
                })
        }
    },
    editView: (req, res, next) => {
        let userId = req.params.userId;
        if (req.isAuthenticated()) {
            User.findById(userId).exec()
                .then(user => {
                    if (isAuthorized(req.user, userId)) {
                        res.locals.title = "Edit " + user.username;
                        res.render("user/edit_user.ejs", { user: user });
                    } else {
                        res.locals.redirect = "/user/" + userId;
                        req.flash("error", `You are not authorised to edit this user`);
                        next();
                    }
                })
                .catch(error => {
                    console.log(`Error fetching user by ID: ${userId}\n${error.message}`);
                    next(error);
                });
        } else {
            res.locals.redirect = "/user/" + userId;
            req.flash("error", `You are not logged in`);
            next();
        }
    },
    checkUsername: (req, res, next) => {
        let userId = req.params.userId;
        User.findOne({ username: req.body.username }).exec()
            .then(user => {
                if (!user._id.equals(userId)) {
                    res.locals.redirect = `/user/${userId}/edit`;
                    req.flash("error", `Username already exists`);
                    console.log(`Error updating user by ID: ${userId}\n User with this username already exists.`);
                    redirectView(req, res, next);
                } else {
                    //username was not changed
                    res.locals.usernameHasChanged = false;
                    next();
                }
            })
            .catch(() => {
                res.locals.usernameHasChanged = true;
                next();
            }
            )
    },
    update: (req, res, next) => {
        let userId = req.params.userId;
        let profilePicture;
        let userParams;
        const profilePictureHasChanged = JSON.parse(req.body.profilePictureHasChanged).value;
        if (!profilePictureHasChanged) {
            userParams = {
                username: req.body.username,
                email: req.body.email,
            };
        } else {
            if (req.file === undefined) {
                profilePicture = fs.readFileSync(path.join(__dirname, '../public/images/ProfilePictureDefault.jpeg'));
            } else {
                try {
                    profilePicture = req.file.buffer;
                } catch (error) {
                    res.locals.redirect = `/user/${userId}/edit`;
                    req.flash("error", `Problem with Profile Picture Occured`);
                    console.log(`Error reading profile picture of user by ID: ${userId}\n${error.message}`);
                    next();
                }
            }
            userParams = {
                username: req.body.username,
                email: req.body.email,
                profilePicture: {
                    data: profilePicture,
                    contentType: 'image/png'
                }
            };
        }
        User.findByIdAndUpdate(userId, {
            $set: userParams
        }, { runValidators: true }).exec()
            .then(user => {
                if (res.locals.usernameHasChanged) {
                    res.locals.redirect = `/login`;
                } else {
                    res.locals.redirect = `/user/${userId}`;
                }
                res.locals.user = user;
                req.flash("success", `${req.body.username}'s account updated`);
                console.log(`Updated User: ${userId}`);
                next();
            })
            .catch(error => {
                res.locals.redirect = `/user/${userId}/edit`;
                req.flash("error", `Failed to update user`);
                console.log(`Error updating user by ID: ${userId}\n${error.message}`);
                next();
            });
    },
    follow: (req, res, next) => {
        if (req.isAuthenticated()) {
            let userId = req.params.userId;
            let currentUserId = req.user._id;

            //User that is followed
            User.findById(userId).exec().then(user => {
                if(user.followers.includes(currentUserId)) {
                    User.findByIdAndUpdate(userId, {
                        $pull: { followers: currentUserId }
                    }).exec()
                        .then(() => {
                            User.findById(userId).exec()
                                .then(updatedUser => {
                                    res.json(updatedUser);
                                    next();
                                })
                        })
                        .catch(error => {
                            console.log("Error while pulling user from followers: "  + error)
                    })
                } else {
                    User.findByIdAndUpdate(userId, {
                        $push: { followers: currentUserId }
                    }).exec()
                        .then(() => {
                            User.findById(userId).exec()
                                .then(updatedUser => {
                                    res.json(updatedUser);
                                    next();
                                })
                        })
                        .catch(error => {
                            console.log("Error while pushing user to followers: "  + error)
                    })
                }
            }).catch(error => {
                console.log("Error finding user to follow: " + error)
            })
        }
    },
    updateFollowing: (req, res, next) => {
        if (req.isAuthenticated()) {
            let userId = req.params.userId;
            let currentUserId = req.user._id;

            //User that is following
            User.findById(currentUserId).exec().then(user => {
                if(user.following.includes(userId)) {
                    User.findByIdAndUpdate(currentUserId, {
                        $pull: { following: userId }
                    }).exec()
                        .catch(error => {
                            console.log("Error while pulling user from following: " + error)
                        })
                } else {
                    User.findByIdAndUpdate(currentUserId, {
                        $push: { following: userId }
                    }).exec()
                        .catch(error => {
                            console.log("Error while pushing user to following: " + error)
                        })
                }
            }).catch(error => {
                console.log("Error finding following user: " + error)
            })
        }
    },
    delete: (req, res, next) => {
        //future: delete posts from favorites of all users having favoritised it
        let userId = req.params.userId;
        User.findById(userId).exec()
            .then(user => {
                Promise.all([
                    user.posts.forEach(postId => {
                        User.updateMany({$expr: {$in: [postId, "$favoritedPosts"]}}, {$pull: {favoritedPosts: postId}}).exec()
                            .catch(error => {
                                console.log("Error while removing post from favoritedPosts: " + error);
                            })
                        Post.deleteOne({_id: postId}).exec()
                            .catch(error => {
                                console.log("Error deleting post: " + error);
                            })
                    }),
                    user.followers.forEach(followerId => {
                        User.findByIdAndUpdate(followerId, {
                            $pull: {following: userId}
                        }).exec().catch(error => {
                            console.log(error);
                        })
                    }),
                    user.following.forEach(followingId => {
                        User.findByIdAndUpdate(followingId, {
                            $pull: {followers: userId}
                        }).exec().catch(error => {
                            console.log(error);
                        })
                    })
                ]).then(() => {
                    if (req.isAuthenticated()) {
                        if (isAuthorized(req.user, userId)) {
                            User.findByIdAndRemove(userId).exec()
                                .then(() => {
                                    res.locals.redirect = "/register";
                                    req.flash("success", `User deleted successfully`);
                                    console.log(`Deleted User: ${userId}`);
                                    next();
                                })
                                .catch(error => {
                                    res.locals.redirect = `/user/${userId}`;
                                    req.flash("error", `Failed to delete user`);
                                    console.log(`Error deleting user by ID: ${userId}\n${error.message}`);
                                    next();
                                });
                        } else {
                            res.locals.redirect = "/user/" + userId;
                            req.flash("error", `You are not authorised to delete this user`);
                            next();
                        }
                    } else {
                        res.locals.redirect = "/user/" + userId;
                        req.flash("error", `You are not logged in`);
                        next();
                    }})
                    .catch(error => {
                        console.log(`Error deleting references to user by ID: ${userId}\n${error.message}`);
                        res.locals.redirect = "/user/" + userId;
                        req.flash("error", "Failed to delete references to User");
                        next();
                    })
            })
            .catch(error => {
                console.log(`Failed to delete User: ${error}`);
                res.locals.redirect = "/user/" + userId;
                req.flash("error", "Failed to delete User");
                next();
            });

    },
    apiAuthenticate: (req, res, next) => {
        passport.authenticate("local", (errors, user) => {
            if (user) {
                let signedToken = jsonWebToken.sign(
                    {
                        data: user._id,
                        exp: new Date().setDate(new Date().getDate() + 1)
                    },
                    "secret_encoding_passphrase"
                );
                res.json({
                    success: true,
                    token: signedToken
                });
            } else
                res.json({
                    success: false,
                    message: "Could not authenticate user."
                });
        })(req, res, next);
    },
    verifyJWT : (req, res ,next ) => {
        let token = req.headers.token;
        if (token) {
            jsonWebToken.verify(
                token,
                "secret_encoding_passphrase",
                (errors, payload) => {
                    if(payload) {
                        User.findByID(payload.data).then(user => {
                            if (user) {
                                next();
                            } else {
                                res.status(httpStatus.FORBIDDEN).json({
                                    error: true,
                                    message: "No User account found."
                                });
                            }
                        });
                    } else {
                        res.status(httpStatus.UNAUTHORIZED).json({
                            error: true,
                            message: "Cannot verify API token."
                        });
                        next();
                    }
                }
            );
        } else {
            res.status(httpStatus.UNAUTHORIZED).json({
                error: true,
                message: "Provide Token"
            });
        }
    },
    login: (req, res) => {
        res.locals.title = "Login";
        res.render("user/login.ejs");
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Username or Password incorrect",
        successRedirect: "/",
        successFlash: "Logged in"
    }),
    logout: (req, res, next) => {
        req.logout(error => {
            if (error) {
                return next(error);
            } else {
                req.flash("success", "You have been logged out");
                res.locals.redirect = "/login";
                next();
            }
        });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
};
