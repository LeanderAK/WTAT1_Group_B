const User = require("../models/user")

let dummyUser = {
    username: "dummyUser123",
    email: "dummy.user123@abc.de",
    password: "12345678",
    favorites: [],
    posts: [],
}

exports.dummyUserPage = (req, res) => {
    res.render("user.ejs", {user: dummyUser})
}

exports.userPage = (req, res) => {
    let userId = req.params.userId;
    User.findById(userId).exec()
        .then(user => {
            if(user !== null) {
                res.render("user.ejs", {user: user});
            }else{
                res.render("error");
            }
        }).catch(error => {
        console.log(error.message);
        res.render("error.ejs");
    });
};
exports.createUser = (req, res, next) => {
    User.create(
        {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }
    ).then(user => {
        console.log("Created user of id: " + user._id)
        res.redirect(`/`);
    }).catch(error => {
        console.log(`Error creating user!\n${error.message}`);
        next();
    });
};
exports.editUserPage = (req, res) => {
    let userId = req.params.userId;
    res.send(`This is the page to edit the profile of ${userName}`);
};
exports.deleteUser = (req, res, next) => {
    let userId = req.params.userId;
    User.findByIdAndDelete(userId)
        .then(() => {
            res.redirect(`/register`)
            console.log("deleted User: " + userId);
        })
        .catch(error => {
            console.log(`Error deleting user by ID: ${userId}\n${error.message}`);
            next();
        });
};