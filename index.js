var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: './public' });
});

app.get('/spectate', function(req, res) {
    res.sendFile('spectate.html', { root: './public' });
});

app.use(express.static(__dirname + '/public'));

// =======================================================
// Global Variables
// =======================================================
var USE_DEBUG_MSG = true;
// var STATUSES = ['BOARD', 'NICKNAME', 'JUMP', 'WINNER', 'TURN', 'KING', 'LIST SPECTATORS', 'LIST'];


io.on('connection', function(socket) {

    socket.emit('BOARD', {test : 'hello123'});

});

// =======================================================
// Functions
// =======================================================

// easy debug message generation
function d(data) {
    if (USE_DEBUG_MSG)
        console.log(data);
}