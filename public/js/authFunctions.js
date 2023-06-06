module.exports = {
    isAuthorized: (requestUser, documentUserId) => {
        if (requestUser.isAdmin || requestUser._id.equals(documentUserId)) {
            return true;
        } else {
            return false;
        }
    }
}