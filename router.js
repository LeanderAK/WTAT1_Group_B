const homeController = require("./controllers/homeController")
const userController = require("./controllers/userController")
const postController = require("./controllers/postController")
const express = require('express');
const router = express.Router();

const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const connectFlash = require("connect-flash");
router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

router.get('/test', (req, res, next) => {
    return res.status(200).json({
        data : "Service is running! "
    });
})

const passcode = "Gy76@5B7ZxGiQ4MQ";
router.use(cookieParser(passcode));
router.use(expressSession({
    secret: passcode,
    cookie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
}));
router.use(connectFlash());

const passport = require("passport");
router.use(passport.initialize());
router.use(passport.session());

const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

/*
All accessible routes. The function call from the specified controller renders the view.
The ':' indicates the use of a parameter within the path.
*/

//General Routes
router.get("/", homeController.showHome);

//Auth Routes
router.get("/login", userController.login);
router.post("/login", userController.authenticate);
router.get("/logout", userController.logout, userController.redirectView);
router.get("/register", userController.register);
router.post("/user/create", userController.create, userController.authenticate);

//User Routes
router.get("/user/:userId", userController.show, userController.showView);
router.get("/user/:userId/edit", userController.editView);
router.put("/user/:userId", userController.update, userController.redirectView);
router.delete('/user/:userId', userController.delete, userController.redirectView);

//Post Routes
router.get("/post/create", postController.new)
router.post("/post/create", postController.create, postController.redirectView);
router.get("/post/:postId", postController.show, postController.showView);
router.get("/post/:postId/edit", postController.editView)
router.put("/post/:postId", postController.update, userController.redirectView);
router.delete("/post/:postId", postController.delete, postController.redirectView);

//Admin Routes
router.get("/admin/users", userController.index, userController.indexView);

module.exports = router;