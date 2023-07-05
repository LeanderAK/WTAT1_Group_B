function favorite(postId) {
    var userId = document.getElementById('currentUserId').value;
    var url = window.location.origin
    $.post(`${url}/post/${postId}/favorite?format=json`, (post) => {
        $(`#post-favorite-count-${postId}`).html(post.favoritedByUsers.length);

        if (post.favoritedByUsers.includes(userId)) {
            $(`#post-favorite-button-${postId}`).attr('fill', '#EAE34B')
        } else {
            $(`#post-favorite-button-${postId}`).attr('fill', 'none')
        }
    });
}

function follow(userId) {
    let currentUserId = document.getElementById('currentUserId').value;
    let url = window.location.origin
    $.post(`${url}/user/${userId}/follow?format=json`, (user) => {
        let followButtons = $(`.follow-${userId}`);
        if(user.followers.includes(currentUserId)) {
            for(let i = 0; i < followButtons.length; i++) {
                followButtons[i].innerHTML = "Unfollow";
                followButtons[i].style.backgroundColor = '#EAE34B';
                followButtons[i].style.border = 'solid #EAE34B 1px';
            }
        } else {
            for(let i = 0; i < followButtons.length; i++) {
                followButtons[i].innerHTML = "Follow";
                followButtons[i].style.backgroundColor = 'white';
                followButtons[i].style.border = 'solid black 1px';
            }
        }
    })
}