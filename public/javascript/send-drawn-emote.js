function sendEmote (event){
    event.preventDefault();
    var socket = io();
    var canvasContent = document.getElementById("char").toDataURL('image/jpg');
    var message = {'type': 'drawing', 'channel': roomname, 'user': nickname, 'data': canvasContent}
    socket.emit('chat', message);
    var overlay = document.getElementById('overlay');
    var messageString = '<li class="message-area"><span class="message-span leftie"><div class="message-sender"><b>You:</b></div><div class="message-content"><img src="' + canvasContent + '"/></div></span></li>';
    $('#messages').append(messageString);
    var overlayWrapper = document.getElementById('overlay-wrapper');
    overlay.parentNode.removeChild(overlay);
    overlayWrapper.parentNode.removeChild(overlayWrapper);
    return;
}