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
    var socket = io();
    $('form').submit(function(){
        var messageString = '<li class="message-area"><span class="message-span leftie"><div class="message-sender"><b>You:</b></div><div class="message-content"><p>' + $('#message').val() + '</p></div></span></li>';
        $('#messages').append(messageString);
        var data = {'type': 'text', 'channel': roomname, 'user': nickname, 'data': $('#message').val()};
        socket.emit('chat', data);
        $('#message').val('');
        return false;
    });
    socket.on('chat/' + roomname, function(msg){
        var objDiv = $("#messages");
        objDiv.scrollTop = objDiv.scrollHeight;
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
                    messageString = '<li class="message-area"><span class="message-span rightie"><div class="message-sender">' + user + ':</div><div class="message-content"><img src="' + data + '"/></div></span></li>';
                    $('#messages').append(messageString);
                }
                break;
        }


    });
});