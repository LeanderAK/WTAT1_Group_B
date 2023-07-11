const socket = io();

document.getElementById("chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let text = $(`#chat-input`).val(),
        username = $(`#chat-user-name`).val(),
        userId = $(`#chat-user-id`).val(),
        chatroomId = $(`#chatroom-id`).val();
    socket.emit("message", {
        content: text,
        username: username,
        user: userId,
        chatroom: chatroomId,
    });
    $(`#chat-input`).val("");
    return false;
})

function updateScroll() {
    let chatBox = document.getElementById("chat");
    chatBox.scrollTop = chatBox.scrollHeight;
}

socket.on("message", (message, chatroomId) => {
    let openChatroomId = $(`#chatroom-id`).val();
    if(openChatroomId === chatroomId) {
        // needs to be deconstructed here again to add Date
        // as this message comes from socket IO, not from the DB
        let messageData = {
            content: message.content,
            username: message.username,
            user: message.user,
            createdAt: new Date().toISOString(),
        }
        displayMessage(messageData);
    }
    updateScroll();
});

socket.on("load all messages", (messages, chatroomId) => {
    let openChatroomId = $(`#chatroom-id`).val();
    if(openChatroomId === chatroomId) {
        messages.forEach(message => {
            displayMessage(message);
        })
    }
    updateScroll();
})

var prevMessageTimestamp;
let displayMessage = (message) => {
    if(checkForDayChange(prevMessageTimestamp, message.createdAt)) {
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        $("#chat").append($(`<div class='dateLabel'>${new Date(message.createdAt).toLocaleDateString('de-DE', options)}</div>`))
    }
    $("#chat").append($(`<div class='messageContainer ${getCurrentUserClass(message.user)}'>`).html(`
    <div class='message'>
        <div class="text">
            ${message.content}
        </div>
    </div>
    <div class='messageTimestamp'>${getTimestampToTime(message.createdAt)}</div>
    `));
    prevMessageTimestamp = message.createdAt;
};

let getCurrentUserClass = (id) => {
    let userId = $("#chat-user-id").val();
    return userId === id ? "userMessageContainer" : "";
};

let getTimestampToTime = (timestamp) => {
    let date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

let checkForDayChange = (prevMessageTimestamp, nextMessageTimestamp) => {
    if(prevMessageTimestamp) {
        let prevDate = new Date(prevMessageTimestamp);
        let nextDate = new Date(nextMessageTimestamp);
        return prevDate.getDay() !== nextDate.getDay();
    } else {
        return true;
    }
}
