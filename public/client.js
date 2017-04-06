$(function() {

    var socket = io();
	var $users = $('#users');
	var $gameBoard = $('#gameBoard tBody');
    var board = [];
    var piecesIndex = [];

	socket.emit('userConnected', 'New client has connected');
	
	socket.on('usersOnline', function(data) {
		var html ='';
		for(x = 0; x < data.length; x++) {
			html = html + data[x] + "<br/>";
		}
		$users.html(html);
	});
	
	socket.on('BOARD', function(data) {

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
                        row.push("<td><div id=piece" + i + j + " class='player1'></div></td>");

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
                        row.push("<td><div id=piece" + i + j + " class='player1'></div></td>");
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

        // we need to do .join here to convert the array structure to string
		$gameBoard.html(board.join());
	});
});