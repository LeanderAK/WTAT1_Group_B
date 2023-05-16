const User = require("../models/user");

exports.showAllUsers = (req, res, next) => {
    User.find({})
        .then(users => {
            res.render("adminUsers.ejs", {users: users})
        })
        .catch(error => {
            console.log(error);
            res.render("error.ejs");
        });
}