const socket = io();

document.getElementById("chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let text = $(`#chat-input`).val(), username = $(`#chat-user-name`).val(), userId = $(`#chat-user-id`).val();
    socket.emit("message", {
        content: text,
        username: username,
        userId: userId
    });
    $(`#chat-input`).val("");
    return false;
})

socket.on("message", (message) => {
    displayMessage(message);
});

let displayMessage = (message) => {
    $("#chat").append($(`<div class='message ${getCurrentUserClass(message.userId)}'>`).html(`
    <div class="text">
        ${message.content}
    </div>
    `));
};

let getCurrentUserClass = (id) => {
    let userId = $("#chat-user-id").val();
    return userId === id ? "userMessage" : "";
};
