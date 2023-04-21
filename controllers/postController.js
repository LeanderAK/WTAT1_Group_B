exports.postPage = (req, res) => {
    let postId = req.params.postId;
    res.send(`This is the page for the post of id: ${postId}`);
};
exports.createPostPage = (req, res) => {
    res.send(`This is the page to create a new post!`);
};
exports.editPostPage = (req, res) => {
    let postId = req.params.postId;
    res.send(`This is the page to edit the post of id: ${postId}`);
};
exports.deletePostPage = (req, res) => {
    let postId = req.params.postId;
    res.send(`This is the page to delete the post of id : ${postId}`);
};