const homeController = require("./controllers/homeController")
const userController = require("./controllers/userController")
const postController = require("./controllers/postController")
const loginController = require("./controllers/loginController")
const registerController = require("./controllers/registerController")
const adminController = require("./controllers/adminController")
const express = require('express');
const router = express.Router();

const methodOverride = require("method-override");
router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

router.get('/test', (req, res, next) => {
    return res.status(200).json({
        data : "Service is running! "
    });
})

/*
All accessible routes. The function call from the specified controller renders the view.
The ':' indicates the use of a parameter within the path.
*/

router.get("/", homeController.showHome);

router.get("/login", loginController.loginPage);
router.get("/register", registerController.registerPage);

router.post("/user/create", userController.createUser);
router.get("/user/dummyuser", userController.dummyUserPage);
router.get("/user/:userId", userController.userPage);
router.get("/user/:userId/edit", userController.editUserPage);
router.put("/user/:userId", userController.updateUser);
router.delete('/user/:userId', userController.deleteUser);

router.get("/admin/users", adminController.showAllUsers);

router.get("/post/create", postController.createPostPage)
router.post("/post/create", postController.savePost);
router.get("/post/:postId", postController.postPage);
router.get("/post/:postId/edit", postController.editPostPage)
router.put("/post/:postId", postController.updatePost);
router.delete("/post/:postId", postController.deletePost);

module.exports = router;