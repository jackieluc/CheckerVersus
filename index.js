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

var gameBoard = [
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 2, 0, 2, 0, 2, 0, 2, 0 ],
    [ 0, 2, 0, 2, 0, 2, 0, 2 ],
    [ 2, 0, 2, 0, 2, 0, 2, 0 ]
];

var allPieces = [];


io.on('connection', function(socket) {
    Game.initialize();

    socket.emit('BOARD', Game.board);

});

// =======================================================
// Objects / Functions
// =======================================================
var Game = {
    board: gameBoard,
    turn: 1,
    // initialize: function() {
    //
    //     for (let row in this.board) {
    //         for (let column in this.board[row]) {
    //
    //         }
    //     }
    // },
    isValidMove: function(row, column) {

    },
    changeTurn: function() {

    },
    resetGame: function() {
        this.board = gameBoard;
    }
};

// Piece object instance
function Piece(id, position) {

    // position in gameBoard[row][column]
    this.position = position;

    // each player has 12 pieces
    // (#0 - 12 pieces = player 1)
    // (#12 - 23 pieces = player 2)
    this.player = '';
    if (id < 12)    this.player = 1;
    else            this.player = 2;

    // default is false
    this.king = false;

    this.makeIntoKing = function() {
        // TODO: use css to change what king piece looks like
        this.king = true;
    };

    this.move = function() {

    };


};



// easy debug message generation
function d(data) {
    if (USE_DEBUG_MSG)
        console.log(data);
}