const Post = require("../models/post");

module.exports = {
    show: (req, res, next) => {
        if (req.isAuthenticated()) {
            Post.find({favorites: {$in: [req.user._id]}}).populate("user").exec()
                .then(posts => {
                    if (req.query.format === "json") {
                        res.json(posts)
                    } else {
                        res.locals.posts = posts;
                        res.render("favorites.ejs");
                    }
                })
                .catch(error => {
                    console.log(`Error fetching favorite posts`);
                    next(error);
                });
        } else {
            req.flash("error", "You are not logged in");
            res.locals.redirect = "/login";
            next();
        }
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
};