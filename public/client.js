var $gameBoard = $('#gameBoard tBody');
var $users = $('#users');
var board = [];
var player = "";
var players = [];
var nickname = "";
var $turn = $('#turn');
var turn;

$(function() {

    var socket = io();

    socket.on('usersOnline', function(data) {
		var html ='';
		for(x = 0; x < data.length; x++) {
			html = html + data[x] + "<br/>";
		}
		$users.html(html);
	});

    socket.on('nickname', function(nick) {
       nickname = nick;
       $("#nickname").text("You are: " + nickname);
    });
    
    socket.on('turn', function(playerTurn) {
    	turn = playerTurn;
    	$turn.html("Turn: " + turn);	
    });

	socket.on('player', function(data) {
        player = data.player;
        players.push(player);
    });

	socket.on('spectator', function(list) {
	   players = list;
	   player = "";
	   // TODO add the nicknames of those who are playing with list[0].nickname & list[1].nickname
    });
	
	socket.on('initBoard', function(boardData) {
		$gameBoard.html(boardData.html);
		board = boardData.data;
	});
	
	socket.on('grab2Piece', function(piecesToGrab) {

	    if (turn == player) {
            $('.blank').removeClass('posMove');
            $('.blank').addClass('noPiece');

            var leftPiece = document.getElementById(piecesToGrab.left);
            var rightPiece = document.getElementById(piecesToGrab.right);

            //console.log("left: " + leftPiece + " right: " + rightPiece);
            if (leftPiece != null) {
                if (leftPiece.classList.contains("noPiece")) {
                    leftPiece.classList.remove("noPiece");
                    leftPiece.classList.add("posMove");
                }
            }
            if (rightPiece != null) {
                if (rightPiece.classList.contains("noPiece")) {
                    rightPiece.classList.remove("noPiece");
                    rightPiece.classList.add("posMove");
                }
            }
        }
	});

	socket.on('movePieces', function(playerData) {
		var oldPos = document.getElementById(playerData.oldPosition);
		var newPos = document.getElementById(playerData.newPosition);

		if (turn == playerData.player) {
            oldPos.classList.remove(playerData.player);
            oldPos.classList.add("noPiece");
            newPos.classList.remove("noPiece");
            newPos.classList.remove("posMove");
            newPos.classList.add(playerData.player);
        }
		// //if(oldPos.classList.contains("player1") {
		// 	oldPos.classList.remove("player1");
		// 	oldPos.classList.add("noPiece");
		// 	newPos.classList.remove("noPiece");
		// 	newPos.classList.remove("posMove");
		// 	newPos.classList.add("player1");
		// //}
		// /*
		// if (oldPos.classList.contains("player2") {
		// 	oldPos.classList.remove("player2");
		// 	oldPos.classList.add("noPiece");
		// 	newPos.classList.remove("noPiece");
		// 	newPos.classList.add("player2");
		// }
		// */
	});
	

    $gameBoard.click(function () {
        // cannot click on the pieces if you are not a player
        if (players.includes(player)) {
            console.log("Player: " + player + " nickname: " + nickname);
            if (player == turn) {
                $(`.${player}`).click(function () {
                    console.log("player: " + player + " piece: " + this.id);
                    $(`.${player}`).removeClass("active");
                    $(this).addClass("active");
                    socket.emit('selectPiece', { player: player, piece: this.id });
                });

                $('.posMove').click(function () {
                    console.log("player: " + player + " move to: " + this.id);
                    $('.blank').removeClass('posMove');
                    $('.blank').addClass('noPiece');

                    socket.emit('move', { player: player, piece: this.id });
                });
            }
        }
        else {
            console.log("Not a player");
        }
    });
});