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
};