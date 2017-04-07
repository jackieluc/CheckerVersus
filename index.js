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
var board = [];
var piecesIndex = [];

io.on('connection', function(socket) {

    board = initBoard();
	console.log('A user connected');

	numUsers++;
	console.log(numUsers);
	socket.nickname = "User " + numUsers;
	nicknames.push(socket.nickname);
	io.emit('usersOnline', nicknames);

    // we need to do .join here to convert the array structure to string
    io.emit('initBoard', board.join());

});

function initBoard() {

    // iterate through the rows
    for (let i = 0; i < 9; i++) {
        var row = [];
        board[i] = row;
        board[i].push("<tr>");

        // these indices represent the columns that will have pieces placed on
        if (i == 0 || i == 2 || i == 6 || i == 8) {
            // iterate through the columns
            for (let j = 0; j < 9; j++) {
                // if the index is even, place a piece
                if (j % 2 == 0) {
                    row.push("<td><div id='piece" + i + j + "'></div></td>");

                    // this array is intended to keep track of all the indicies of the pieces
                    piecesIndex.push("#piece" + i + j);
                    // $("#piece" + i + j).addClass("player1");
                }
                else
                    row.push("<td></td>");
            }
        }
        // these indices represent the columns that will have pieces placed on
        else if (i == 1 || i == 7) {
            for (let j = 0; j < 9; j++) {
                if (j % 2 == 1) {
                    row.push("<td><div id='piece" + i + j + "'></div></td>");
                    piecesIndex.push("#piece" + i + j);
                    // $("#piece" + i + j).addClass("player1");
                }
                else
                    row.push("<td></td>");
            }
        }
        // the row will not contain any pieces
        else {
            for (let j = 0; j < 9; j++) {
                row.push("<td></td>");
            }
        }

        // assign the row to the board
        board[i] = row;
        board[i].push("</tr>");
    }

    // add the start pieces
    initPieces();

    return board;
}

function initPieces() {
    for (let i = 0; i < piecesIndex.length; i++) {
        let pieceRowIndex = parseInt(piecesIndex[i].split("")[6]);

        if (pieceRowIndex >= 0 && pieceRowIndex <= 2) {
            for(let j = 0; j < board[pieceRowIndex].length; j++) {

                if (board[pieceRowIndex][j].length) {
                    let place = board[pieceRowIndex][j].lastIndexOf("'");
                    board[pieceRowIndex][j] = board[pieceRowIndex][j].substring(0, place) + " class='player1'" + board[pieceRowIndex][j].substring(place);
                }
            }
        }
        else if (pieceRowIndex >= 6) {
            for(let j = 0; j < board[pieceRowIndex].length; j++) {

                if (board[pieceRowIndex][j].length) {
                    let place = board[pieceRowIndex][j].lastIndexOf("'");
                    board[pieceRowIndex][j] = board[pieceRowIndex][j].substring(0, place) + " class='player2" + board[pieceRowIndex][j].substring(place);
                }
            }
        }
    }
}