exports.creatorPage = (req, res) => {
    let creatorName = req.params.creatorName;
    res.render("creator", {name: creatorName});
};
exports.createCreatorPage = (req, res) => {
    res.send(`This is the page to create a new creator!`);
};
exports.editCreatorPage = (req, res) => {
    let creatorName = req.params.creatorName;
    res.send(`This is the page to edit the profile of ${creatorName}`);
};
exports.deleteCreatorPage = (req, res) => {
    let creatorName = req.params.creatorName;
    res.send(`This is the page to delete the profiel of ${creatorName}`);
};