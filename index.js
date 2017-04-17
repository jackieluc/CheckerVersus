var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

var players = [];
var spectators = [];
var nicknames = [];
var numUsers = 0;
var board = [];
var piecesIndex = [];
var turn = "player1";
var p1Pieces = [];
var p2Pieces = [];
var selectedPieceID;
var pieceTracker = [['#piece00', 0, '#piece02', 0, '#piece04', 0, '#piece06', 0, '#piece08'], 
					[0, '#piece11', 0, '#piece13', 0, '#piece15', 0, '#piece17', 0],
					['#piece20', 0, '#piece22', 0, '#piece24', 0, '#piece26', 0, '#piece28'],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					['#piece60', 0, '#piece62', 0, '#piece64', 0, '#piece66', 0, '#piece68'],
					[0, '#piece71', 0, '#piece73', 0, '#piece75', 0, '#piece77', 0],
					['#piece80', 0, '#piece82', 0, '#piece84', 0, '#piece86', 0, '#piece88']]

io.on('connection', function(socket) {

	console.log('A user connected');

	numUsers++;
	if(numUsers == 2) {
		board = initBoard();
	}
	socket.nickname = "anonymous" + numUsers;
	nicknames.push(socket.nickname);
	socket.emit('nickname', socket.nickname);
	io.emit('usersOnline', nicknames);
	io.emit('turn', turn);

    if (players.length < 2) {
        players.push( { nickname: socket.nickname, player: "player" + players.length } )
        socket.emit('player', { nickname: socket.nickname, player: "player" + players.length } );
    }
    else {
        spectators.push( { nickname: socket.nickname, player: "none" } );
        io.emit('spectator', players);
    }

    // we need to do .join here to convert the array structure to string
	io.emit('initBoard', { html: board.join(), data: board });

	
//	socket.on('move', function(playerData) {
//       if (isValidMove(playerData.player, playerData.piece)) {
//           move(playerData.player, playerData.piece);
//        }
//        else {
//
//		}
//	});
	
	socket.on('move', function(playerData) {
		var movePiece = move(playerData.piece);
		if (isValidMove(playerData.player)) {
			io.emit('updatePieces', { player: playerData.player, oldPosition: movePiece[0], newPosition: movePiece[1]});
			changeTurn();
			io.emit('turn', turn);
		}
    });
/*
		if (playerData.player == turn) {
			var movePiece = move(playerData.player, playerData.piece);
			io.emit('updatePieces', {oldPosition: movePiece[0], newPosition: movePiece[1]});
			console.log(movePiece[0] + " " + movePiece[1]);
		}
	});
*/

	socket.on('selectPiece', function(playerData) {		
		if (playerData.player == turn) {
			console.log("Server: Player " + playerData.player + " has selected piece " + playerData.piece);
			selectedPieceID = playerData.piece;
			console.log(playerData.piece);
			console.log(p1Pieces.indexOf("#piece" + selectedPieceID));
			if (turn == "player1") {
				if(p1Pieces.indexOf("#piece" + selectedPieceID) > 0) {
					console.log("SHOWING " + playerData.player + "VALID MOVES");
					var list = getValidMoves(playerData.player, playerData.piece);
					if(list.length == 2) {
						socket.emit('grab2Piece', {left: list[0], right: list[1]});
					}
				}
			}else{
				if(p2Pieces.indexOf("#piece" + selectedPieceID) > 0) {
					console.log("SHOWING " + playerData.player + "VALID MOVES");
					var list = getValidMoves(playerData.player, playerData.piece);
					if(list.length == 2) {
						socket.emit('grab2Piece', {left: list[0], right: list[1]});
					}
				}
			}
		}
		
		// get a list of valid moves, store in var list
		/*if(turn == "player1") {
			selectedPieceID = playerData.piece;
			console.log(playerData.piece);
			console.log(p1Pieces.indexOf("#piece" + selectedPieceID));
			if(p1Pieces.indexOf("#piece" + selectedPieceID) > 0) {
			    console.log("SHOWING PLAYER 1 VALID MOVES");
				var list = getValidMoves(playerData.player, playerData.piece);
				if(list.length == 2) {
					socket.emit('grab2Piece', {left: list[0], right: list[1]});
				}
			}
		}
		
		if(turn == "player2") {
			selectedPieceID = playerData.piece;
			if(p2Pieces.indexOf("#piece" + selectedPieceID) > 0) {
			    console.log("SHOWING PLAYER 2 VALID MOVES");
				var list = getValidMoves(playerData.player, playerData.piece);
				if(list.length == 2) {
					socket.emit('grab2Piece', {left: list[0], right: list[1]});
				}
			}
		}*/

		/*selectedPieceID = playerData.piece;
		var list = getValidMoves(playerData.player, playerData.piece);
		
		if(list.length == 2)
			socket.emit('grab2Piece', {left: list[0], right: list[1]});*/
		
		//else if (list.length == 4)
			// socket.emit('grab4Piece'
			// do to later
		
	});
	
	// socket.on('send2Piece', function(retrieve2Pieces) {
	// 	showPossibleMoves(retrieve2Pieces.left, retrieve2Pieces.right);
	// });
});


function isValidMove(playerTurn, pieceID) {
    console.log("Turn: " + turn + ", Player: " + playerTurn + " ID: " + pieceID);
    if((turn == "player1") && (playerTurn == turn)) {
        console.log("Turn: " + turn + ", Player: " + playerTurn);
        return true;
    }
    if ((turn == "player2") && (playerTurn == turn)) {
        console.log("Turn: " + turn + ", Player: " + playerTurn);
		return true;
    }
}


function getValidMoves(player, pieceID) 
{
	//var selected = document.getElementById(pieceID);
	//if (selected.classList.contains("king"))
	//	king = true;
	
	// split the piece ID to get it's coordinates, store as int
	var row = parseInt(pieceID.substring(0, 1));
	var col = parseInt(pieceID.substring(1));
	
	// if it is a king, check all directions. set to false for now to skip king check
	if (false)
	{
		var checkRowBelow = row++;
		var checkRowAbove = row--;
		
		var checkColLeft = col--;
		var checkColRight = col++;
		
		var idSW = toString(checkRowBelow) + toString(checkColLeft);
		var idSE = toString(checkRowBelow) + toString(checkColRight);
		var idNW = toString(checkRowAbove) + toString(checkColLeft);
		var idNE = toString(checkRowAbove) + toString(checkColRight);
		
		var checkSW = document.getElementById(idSW);
		var checkSE = document.getElementById(idSE);
		var checkNW = document.getElementById(idNW);
		var checkNE = document.getElementById(idNE);
		
		if(checkSW.class == "noPiece")
			checkSW.class = "posMove";
		
		if(checkSE.class == "noPiece")
			checkSE.class = "posMove";
		
		if(checkNW.class == "noPiece")
			checkNW.class = "posMove";
		
		if(checkNE.class == "noPiece")
			checkNE.class = "posMove";
		
	}
	else // if not king, do this
	{
		// player 1 is on top side of the game board
		if(player == "player1")
			var checkRow = row + 1;
		
		// P2 is bottom of game board
		else 
			var checkRow = row - 1;
		
		
		checkColLeft = col - 1;
		checkColRight = col + 1;
		
		var idLeft = checkRow.toString() + checkColLeft.toString();
		var idRight = checkRow.toString() + checkColRight.toString();

		var toReturn = [idLeft, idRight];
		
		return toReturn;
	}
}

function move(pieceID) {
	
	var initialRow = parseInt(selectedPieceID.substring(0,1));
	var initialCol = parseInt(selectedPieceID.substring(1));
	
	var newRow = parseInt(pieceID.substring(0,1));
	var newCol = parseInt(pieceID.substring(1));
	
	var piece = '#piece' + selectedPieceID;
	
	pieceTracker[initialRow][initialCol] = 0;
	pieceTracker[newRow][newCol] = piece;
	
	var oldPosition = initialRow.toString() + initialCol.toString();
	var newPosition = newRow.toString() + newCol.toString();
	
	console.log("old pos: " + oldPosition + " // new pos: " + newPosition);
	
	return [oldPosition, newPosition];
}

function changeTurn() {
	if (turn == "player1") turn = "player2";
	else if (turn == "player2") turn = "player1";
	
	io.emit('turn', turn);

	console.log("changed turn... It is " + turn + "'s turn");
}

function initBoard() {
    // iterate through the rows
    for (var i = 0; i < 9; i++) {
        var row = [];
        board[i] = row;
        board[i].push("<tr>");

        // these indices represent the rows that will have pieces placed on
        if (i == 0 || i == 2 || i == 6 || i == 8) {
            // iterate through the columns
            for (var j = 0; j < 9; j++) {
                // if the index is even, place a piece
                if (j % 2 == 0) {
                    row.push("<td id='b" + i + j + "'><div id='" + i + j + "'></div></td>");

                    // this array is intended to keep track of all the indices of the pieces
                    piecesIndex.push("#piece" + i + j);
                }
                else
                    row.push("<td></td>");
            }
        }
        // these indices represent the rows that will have pieces placed on
        else if (i == 1 || i == 7) {
            for (var j = 0; j < 9; j++) {
                if (j % 2 == 1) {
                    row.push("<td id='b" + i + j + "'><div id='" + i + j + "'></div></td>");
                    piecesIndex.push("#piece" + i + j);
                }
                else
                    row.push("<td></td>");
            }
        }
        // the row will not contain any pieces
        else if (i == 3 || i == 5) {
            for (var j = 0; j < 9; j++) {
				if (j % 2 == 1) {
					row.push("<td id='b" + i + j + "'><div id='" + i + j + "' class='noPiece'></div></td>");
				}else{
					row.push("<td></td>");
				}
			}
		}else if(i == 4) {
			for (var j = 0; j < 9; j++) {
				if (j % 2 == 0) {
					row.push("<td id='b" + i + j + "'><div id='" + i + j + "' class='noPiece'></td>");
				}else{
					row.push("<td></td>");	
				}
			}
		}

        // assign the row to the board
        board[i] = row;
        board[i].push("</tr>");
    }

    // add the start pieces. Only intialize pieces when 2 players are joined
		initPieces();
		p1Pieces = piecesIndex.slice(0, 14);
		p2Pieces = piecesIndex.slice(14);
	
	//console.log(p1Pieces);
	//console.log(p2Pieces);
	// console.log(piecesIndex);
	// console.log(board);

    return board;
}

function initPieces() {

    for (var i = 0; i < piecesIndex.length; i++) {
        var pieceRowIndex = parseInt(piecesIndex[i].split("")[6]);

        if (pieceRowIndex >= 0 && pieceRowIndex <= 2) {

            for(var j = 0; j < board[pieceRowIndex].length; j++) {
                if (board[pieceRowIndex][j].length) {
                    var place = board[pieceRowIndex][j].lastIndexOf("'") + 1;
                    //board[pieceRowIndex][j].id = "player1-" + pieceRowIndex + j;
                    board[pieceRowIndex][j] = board[pieceRowIndex][j].substring(0, place) + " class='player1'" + board[pieceRowIndex][j].substring(place, board[pieceRowIndex][j].length);
                }
            }
        }
        else if (pieceRowIndex >= 6) {

            for(var j = 0; j < board[pieceRowIndex].length; j++) {
                if (board[pieceRowIndex][j].length) {
                    var place = board[pieceRowIndex][j].lastIndexOf("'") + 1;
                    //board[pieceRowIndex][j].id = "player2-" + pieceRowIndex + j;
                    board[pieceRowIndex][j] = board[pieceRowIndex][j].substring(0, place) + " class='player2'" + board[pieceRowIndex][j].substring(place, board[pieceRowIndex][j].length);
                }
            }
        }
    }
}