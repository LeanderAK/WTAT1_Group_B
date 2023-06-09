const User = require("../models/user"),
    passport = require("passport");
const {redirectView} = require("./postController");
const {isAuthorized} = require("../public/js/authFunctions");
const fs = require('fs');
const path = require("path");

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
                next(error);
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
            User.findOne({username: name}).exec()
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
                        res.render("user/edit_user.ejs", {user: user});
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
        User.findOne({username: req.body.username}).exec()
            .then(user => {
                if (!user._id.equals(userId)) {
                    res.locals.redirect = `/user/${userId}/edit`;
                    req.flash("error", `Username already exists`);
                    console.log(`Error updating user by ID: ${userId}\n User with this username already exists.`);
                    redirectView(req, res, next);
                } else {
                    next();
                }
            })
            .catch(() => {
                    next();
                }
            )
    },
    update: (req, res, next) => {
        let userId = req.params.userId;
        let profilePicture;
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
        let userParams = {
            username: req.body.username,
            email: req.body.email,
            profilePicture: {
                data: profilePicture,
                contentType: 'image/png'
            }
        };
        User.findByIdAndUpdate(userId, {
            $set: userParams
        }, {runValidators: true}).exec()
            .then(user => {
                res.locals.user = user;
                res.locals.redirect = `/login`;
                req.flash("success", `${user.username}'s account updated`);
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
    delete: (req, res, next) => {
        //delete all posts created by the user
        //future: delete posts from favorites of all users having favoritised it
        let userId = req.params.userId;
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
