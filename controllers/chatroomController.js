const Chatroom = require("../models/chatroom");

module.exports = {
    checkForExistingChatroom: (req, res, next) => {
        let userId = req.user._id;
        let requestedUserId = req.body.requestedUserId;
        Chatroom.find({users: {$all: [userId, requestedUserId]}}).exec()
            .then(chatrooms => {
                if(chatrooms.length === 0) {
                    next();
                } else {
                    //redirect to chat of both of these users
                    let chatroom = chatrooms[0];
                    res.redirect(`/chats/${chatroom._id}`);
                }
            })
            .catch(error => {
                console.log(error);
                res.redirect("/chats");
            })
    },
    create: (req, res, next) => {
        let chatroomParams = {
            messages: [],
            users: [req.user._id, req.body.requestedUserId],
        };
        Chatroom.create(chatroomParams)
            .then(chatroom => {
                console.log("Created new Chatroom: " + chatroom._id);
                res.locals.redirect = `/chats/${chatroom._id}`;
                next();
            })
            .catch(error => {
                res.locals.redirect = `/`;
                console.log("Error creating new Chatroom: " + error.message);
                next();
            })
    },
    getAllChatrooms: (req, res, next) => {
        if(req.isAuthenticated) {
            let userId = req.user._id;
            Chatroom.find({users: {$in: [userId]}}).populate("users").exec()
                .then(chatrooms => {
                    res.locals.chatrooms = chatrooms;
                    next();
                })
                .catch(error => {
                    console.log(error);
                    next(error);
                })
        } else {
            req.flash("error", `You are not logged in`);
            res.redirect("/login");
        }
    },
    showAllChatrooms: (req, res, next) => {
        res.render("chatrooms.ejs");
    },
    getChatroom: (req, res, next) => {
        if (req.isAuthenticated()) {
            let chatroomId = req.params.chatId;
            Chatroom.findById(chatroomId).populate("users messages").exec()
                .then(chatroom => {
                    res.locals.chatroom = chatroom;
                    next();
                })
                .catch(error => {
                    console.log("Could not find chatroom: " + error);
                    res.redirect("/");
                })
        } else {
            req.flash("error", `You are not logged in`);
            res.redirect("/login");
        }
    },
    showChatroom: (req, res, next) => {
        res.render("chat.ejs");
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
}