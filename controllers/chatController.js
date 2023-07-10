module.exports = io => {
    io.on("connection", client => {
        console.log("new connection");

        client.on("disconnect", () => {
            console.log("user disconnected");
        });

        client.on("message", (data) => {
            let messageData = {
                content: data.content,
                username: data.username,
                userId: data.userId
            };
            io.emit("message", messageData);
        });
    });
};