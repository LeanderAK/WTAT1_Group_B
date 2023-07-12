const Chatroom = require("../models/chatroom");

module.exports = {
    checkForExistingChatroom: (req, res, next) => {
        if(req.isAuthenticated()) {
            let userId = req.user._id;
            let requestedUserId = req.body.requestedUserId;
            Chatroom.find({users: {$all: [userId, requestedUserId]}}).exec()
                .then(chatrooms => {
                    if (chatrooms.length === 0) {
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
        } else {
            req.flash("error", `You are not logged in`);
            res.redirect("/login");
        }
    },
    create: (req, res, next) => {
        if(req.isAuthenticated()) {
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
        } else {
            req.flash("error", `You are not logged in`);
            res.redirect("/login");
        }
    },
    getAllChatrooms: (req, res, next) => {
        if(req.isAuthenticated()) {
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
        res.locals.title = "Messages";
        res.render("chatrooms.ejs");
    },
    getChatroom: (req, res, next) => {
        if (req.isAuthenticated()) {
            let chatroomId = req.params.chatId;
            let userId = req.user._id;
            Chatroom.findById(chatroomId).populate("users messages").exec()
                .then(chatroom => {
                    let userIds = chatroom.users.map(user => {return user._id.toString()});
                    if(userIds.includes(userId.toString())){
                        res.locals.chatroom = chatroom;
                        let chatPartner = chatroom.users.find(user => user._id.toString() !== (userId.toString()));
                        res.locals.chatroomUsername = chatPartner.username;
                        next();
                    } else {
                        req.flash("error", `You are not part of this chat`);
                        res.redirect("/chats");
                    }
                })
                .catch(error => {
                    console.log("Could not find chatroom: " + error);
                    req.flash("error", `Sorry, we could not find the requested Chatroom`);
                    res.redirect("/chats");
                })
        } else {
            req.flash("error", `You are not logged in`);
            res.redirect("/login");
        }
    },
    showChatroom: (req, res, next) => {
        res.locals.title = "Chat with " + res.locals.chatroomUsername;
        res.render("chat.ejs");
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }
}