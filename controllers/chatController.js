const Chatroom = require("../models/chatroom");
const mongoose = require("mongoose");

module.exports = io => {
    io.on("connection", client => {
        console.log("new connection");
        //highly dirty
        let currentUrl = client.handshake.headers.referer;
        let chatroomId = currentUrl.substring(currentUrl.length - 24);

        Chatroom.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(chatroomId)}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$limit: 20},
            {$replaceRoot: {"newRoot": "$messages"}}
            ]).exec()
            .then(messages => {
                client.emit("load all messages", messages.reverse(), chatroomId);
            })
            .catch(error => {
                console.log("Error in aggregation: " + error);
            });

        client.on("disconnect", () => {
            console.log("user disconnected");
        });

        client.on("message", (data) => {
            let messageData = {
                content: data.content,
                username: data.username,
                user: data.user,
            };
            Chatroom.findByIdAndUpdate(data.chatroom, {
                $push: {messages: messageData}
            }, {runValidators: true}).exec()
                .then(() => {
                    io.emit("message", messageData, data.chatroom);
                })
                .catch(error => {
                    console.log(`Error saving Message: ${error.message}`);
                })
        });
    });
};