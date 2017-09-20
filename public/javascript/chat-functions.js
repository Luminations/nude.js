function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

document.getElementById('draw-emote').addEventListener('click', function(event){
    event.preventDefault();
    var content;
    $.ajax({
        url: "/chat/overlay",
        context: document.body,
        success: function(response) {
            content = response;
            var overlay = jQuery( content );
            overlay.appendTo(document.body);
        }
    });
});


var roomname = readCookie('Roomname');
var nickname = readCookie('Nickname');
$(function () {
    console.log("aye");
    var socket = io();
    socket.on("connect", function() {
        var data = {nick: nickname, room: roomname};
        socket.emit("first-visit", data);
    });
    $('form').submit(function(){
        var scrollContainer = $("#chat-output-container");
        var messageString = '<li class="message-area"><span class="message-span leftie"><div class="message-sender"><b>You:</b></div><div class="message-content"><p>' + $('#message').val() + '</p></div></span></li>';
        $('#messages').append(messageString);
        scrollContainer.scrollTop(scrollContainer[0].scrollHeight);
        var data = {type: 'text', channel: roomname, user: nickname, data: $('#message').val()};
        socket.emit('chat', data);
        $('#message').val('');
        return false;
    });
    socket.on('chat', function(msg){
        var scrollContainer = $("#chat-output-container");
        var user = msg.user;
        var data = msg.data;
        var type = msg.type;
        var isOtherUser = readCookie('Nickname') !== user;
        var messageString;
        switch(type){
            case 'text':
                if (isOtherUser) {
                    messageString = '<li class="message-area"><span class="message-span rightie"><div class="message-sender">' + user + ':</div><div class="message-content"><p>' + data + '</p></div></span></li>';
                    $('#messages').append(messageString);
                }
                break;
            case 'drawing':
                if (isOtherUser) {
                    messageString = '<li class="message-area"><span class="message-span rightie"><div class="message-sender">' + user + ':</div><div class="message-content"><img class="drawn-emote" src="' + data + '"/></div></span></li>';
                    $('#messages').append(messageString);
                }
                break;
            case 'user':
                messageString = '<li class="message-area"><span class="notice"><div class="message-content">' + user + " " + data + " the room." + '</div></span></li>';
                $('#messages').append(messageString);
                break;
        }
        var scrollHeight = scrollContainer[0].scrollHeight;
        scrollContainer.scrollTop(scrollHeight);
    });
});