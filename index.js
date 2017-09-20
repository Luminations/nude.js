var express = require('express');
var app = express();
var request = require('request');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var io = require('socket.io')(http);
var pure = require('purecss');

app.use('/purecss', express.static(__dirname + '/node_modules/purecss/build/'));
app.use(cookieParser());
app.use('/data', express.static(__dirname + '/public/'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/markup/preparation.html');
});

app.post('/', function(req, res){
    var roomname = req.body.roomname.replace(/([ /])/g, '_');
    var nickname = req.body.nickname.replace(/([ /])/g, '_');
    if(roomname !== "" && nickname !== ""){
        res.cookie('Roomname' , roomname);
        res.cookie('Nickname' , nickname);

        res.redirect('/chat');
    } else {
        res.redirect('/');
    }
});

app.post('/send-drawing', function(req, res){
    console.log(req);
});

app.get('/chat', function(req, res){
    var cookies = req.cookies;
    if(typeof cookies.Roomname === 'undefined'
        || typeof cookies.Nickname === 'undefined'
        || cookies.Roomname === ''
        || cookies.Nickname === ''){
        res.redirect('/');
        return;
    }
    res.sendFile(__dirname + '/markup/chat.html');
});

app.get('/draw', function(req, res){
    res.sendFile(__dirname + '/markup/draw.html');
});

app.get('/chat/overlay', function(req, res){
    res.sendFile(__dirname + '/markup/overlay-content.html');
});

io.on('connection', function(socket){
    socket.on('chat', function(msg){
        switch(msg.type){
            case 'text':
                socket.broadcast.to(socket.room).emit('chat', {type: 'text', user: msg.user, data: msg.data});
                break;
            case 'drawing':
                io.broadcast.to(socket.room).emit('chat', {type: 'drawing', user: msg.user, data: msg.data});
                break;
            case 'user':
                io.broadcast.to(socket.room).emit('chat', {type: 'user', user: msg.user, data: msg.data});
                break;
        }

    });
    socket.on('disconnect', function(e){
        console.log("disconnect");
        var data = {type: 'user', channel: socket.room, user: socket.username, data: "left"};
        socket.broadcast.to(socket.room).emit('chat', data );
    });
    socket.on('first-visit', function( userData ){
        console.log("first visit");
        socket.username = userData.nick;
        socket.join(userData.room);
        socket.room = userData.room;
        var data = {type: 'user', channel: socket.room, user: socket.username, data: "joined"};
        socket.broadcast.to(socket.room).emit('chat', data );
    });
});

http.listen(2000, function(){
  console.log('I\'m startup like a kickstarter my man');
});