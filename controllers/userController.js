const User = require("../models/user"),
    passport = require("passport");

let dummyUser = {
    username: "dummyUser123",
    email: "dummy.user123@abc.de",
    password: "12345678",
    favorites: [],
    posts: [],
}

module.exports = {
    index: (req, res, next) => {
        User.find().exec()
            .then(users => {
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
        User.findById(userId).exec()
            .then(user => {
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
    dummyUserPage: (req, res) => {
        res.render("user/user.ejs", {user: dummyUser})
    },
    register: (req, res) => {
        res.render("user/register.ejs")
    },
    create: (req, res, next) => {
        if (req.skip) next();
        if (req.body.password.length < 8) {
            req.flash("error", "Password must contain at least 8 symbols!");
            res.locals.redirect = "/register";
            next();
        } else {
            let userParams = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            };
            let newUser = new User(userParams);
            User.register(newUser, req.body.password, (error, user) => {
                if (user) {
                    req.flash("success", `${user.username}'s account created successfully!`);
                    console.log(`Created User: ${user._id}`);
                    next();
                } else {
                    req.flash("error", `Failed to create user account because: ${error.message}`);
                    console.log(`Error creating user: ${error.message}`);
                    next();
                }
            });
        }
    },
    editView: (req, res, next) => {
        let userId = req.params.userId;
        User.findById(userId).exec()
            .then(user => {
                res.render("user/edit_user.ejs", {user: user});
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${userId}\n${error.message}`);
                next(error);
            });
    },
    update: (req, res, next) => {
        let userId = req.params.userId;
        let userParams = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };
        User.findByIdAndUpdate(userId, {
            $set: userParams
        }, {runValidators: true})
            .then(user => {
                res.locals.user = user;
                res.locals.redirect = `/user/${userId}`;
                req.flash("success", `${user.username}'s account updated successfully!`);
                console.log(`Updated User: ${userId}`);
                next();
            })
            .catch(error => {
                res.locals.redirect = `/user/${userId}/edit`;
                req.flash("error", `Failed to update user ${userId} because: ${error.message}`);
                console.log(`Error updating user by ID: ${userId}\n${error.message}`);
                next();
            });
    },
    delete: (req, res, next) => {
        let userId = req.params.userId;
        User.findByIdAndRemove(userId)
            .then(() => {
                res.locals.redirect = "/register";
                req.flash("success", `User ${userId} deleted successfully!`);
                console.log(`Deleted User: ${userId}`);
                next();
            })
            .catch(error => {
                res.locals.redirect = `/user/${userId}`;
                req.flash("error", `Failed to delete user ${userId} because: ${error.message}`);
                console.log(`Error deleting user by ID: ${userId}\n${error.message}`);
                next();
            });
    },
    login: (req, res) => {
        res.render("user/login.ejs");
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
        successFlash: "Logged in!"
    }),
    logout: (req, res, next) => {
        req.logout(error => {
            if (error) {
                return next(error);
            } else {
                req.flash("success", "You have been logged out!");
                res.locals.redirect = "/";
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
