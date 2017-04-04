var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

var nicknames = [];
var numUsers = 0;


io.on('connection', function(socket) {
	console.log('A user connected');
	socket.on('userConnected', function(data) {
		numUsers++;
		console.log(numUsers);
		socket.nickname = "User " + numUsers;
		nicknames.push(socket.nickname);
		io.sockets.emit('usersOnline', nicknames);
		io.sockets.emit('BOARD', 'BOARD');
	});

});