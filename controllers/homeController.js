const Post = require("../models/post");
const User = require("../models/user");

module.exports = {
    getAllPosts: (req, res, next) => {
        Post.find({}).populate("user").exec()
            .then((posts) => {
                res.locals.searchType = "post";
                res.locals.posts = posts;
                res.locals.redirect = "/";
                next()
            })
            .catch((error) => {
                console.log(error.message);
                res.render("error.ejs");
            })
    },
    home: (req, res) => {
        if (req.query.format === "json"){
            res.json(res.locals.posts)
        } else {
            res.locals.title = "Creape";
            res.render("home.ejs");
        }
    },
    search: (req, res) => {
        res.locals.redirect = "/";
        res.locals.title = "Home";
        let payload = req.body.payload.trim();
        let searchType = req.body.searchType;
        res.locals.searchType = searchType;
        if(searchType === "post"){
            Post.find({
                $or: [
                    {title: {$regex: new RegExp('.*' + payload + '.*', 'i')}},
                    {description: {$regex: new RegExp('.*' + payload + '.*', 'i')}},
                ],
            }).populate("user").limit(20).exec()
                .then(posts => {
                    res.locals.posts = posts;
                    res.render("home.ejs");
                })
                .catch(() => {
                    res.locals.posts = null;
                    res.render("home.ejs");
                })
        }
        if(searchType === "user"){
            User.find({username: {$regex: new RegExp('^' + payload + '.*', 'i')}}).limit(20).sort({username: 1}).exec()
                .then(users => {
                    res.locals.users = users;
                    res.render("home.ejs");
                })
                .catch(() => {
                    res.locals.users = null;
                    res.render("home.ejs");
                })
        }
    },
};
