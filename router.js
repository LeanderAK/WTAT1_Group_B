const creatorController = require("./controllers/creatorController")
const postController = require("./controllers/postController")
const express = require('express');
const router = express.Router();

router.get('/test', (req, res, next) => {
    return res.status(200).json({
        data : "Service is running! "

    });
})

router.post("/creator/create", creatorController.createCreatorPage);
router.get("/creator/:creatorName", creatorController.creatorPage);
router.patch('/creator/:creatorName', creatorController.editCreatorPage);
router.delete('/creator/:creatorName', creatorController.deleteCreatorPage);

router.post("/post/create", postController.createPostPage);
router.get("/post/:postId", postController.postPage);
router.patch("/post/:postId", postController.editPostPage);
router.delete("/post/:postId", postController.deletePostPage);

module.exports = router;