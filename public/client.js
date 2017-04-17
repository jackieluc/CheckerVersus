var $gameBoard = $('#gameBoard tBody');
var $users = $('#users');
var board = [];
var player = "";
var players = [];
var nickname = "";
var $turn = $('#turn');
var turn;
// var shadowPieces = [];

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
    });
    
    socket.on('turn', function(playerTurn) {
    	turn = playerTurn;
    	$turn.html("Turn: " + turn);	
    });

	socket.on('player', function(data) {
        player = data.player;
        players.push(player);
        $("#nickname").text("You are playing as: " + nickname);
    });

	socket.on('spectator', function(list) {
	   players = list;
	   player = "";
        $("#nickname").text("You are spectating as: " + nickname);
	   // TODO add the nicknames of those who are playing with list[0].nickname & list[1].nickname
    });
	
	socket.on('initBoard', function(boardData) {
		$gameBoard.html(boardData.html);
		board = boardData.data;
	});
	
	socket.on('grab2Piece', function(piecesToGrab) {
	    if (turn == player) {

            var leftPiece = document.getElementById(piecesToGrab.left);
            var rightPiece = document.getElementById(piecesToGrab.right);

            // shadowPieces.push(leftPiece);
            // shadowPieces.push(rightPiece);
            // console.log("pushed shadowPieces: " + shadowPieces[0].id);

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

/*
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
*/
	
socket.on('updatePieces', function(piece) {
		var oldPos = document.getElementById(piece.oldPosition);
		var newPos = document.getElementById(piece.newPosition);
		console.log("Piece has been updated");
		
		if(oldPos.classList.contains("player1")) {
			console.log("piece at " + piece.oldPosition + " is no longer of class 'Player1'");
			// oldPos.classList.remove("player1");
			oldPos.classList.remove("active");
			oldPos.classList.add("noPiece");
			newPos.classList.remove("noPiece");
            newPos.classList.add("player1");
			// newPos.classList.add("active");
			console.log(oldPos.classList);
			console.log(newPos.classList);

		}
		
		if (oldPos.classList.contains("player2")) {
			// oldPos.classList.remove("player2");
			oldPos.classList.remove("active");
			oldPos.classList.add("noPiece");
			newPos.classList.remove("noPiece");
			newPos.classList.add("player2");
		}
	});
	

    $gameBoard.click(function () {
        // cannot click on the pieces if you are not a player

        // if (players.includes(player)) {
        //     console.log("Player: " + player + " nickname: " + nickname);
        //     if (player == turn) {
        //         $(`.${player}`).click(function () {
        //             console.log("player: " + player + " piece: " + this.id);
        //             $(`.${player}`).removeClass("active");
        //             $(this).addClass("active");
        //             socket.emit('selectPiece', { player: player, piece: this.id });
        //         });
        //
        //         $('.posMove').click(function () {
        //             console.log("player: " + player + " move to: " + this.id);
        //             $('.blank').removeClass('posMove');
        //             $('.blank').addClass('noPiece');
        //
        //             socket.emit('move', { player: player, piece: this.id });

		// player is clicking a piece
		
        if (player == turn) {
            if (players.includes(player)) {
                if (player == "player1") {
                    $('.player1').click(function () {
                        console.log("player: " + player + " has selected piece: " + this.id + " of class " + this.classList);
                        console.log(this.classList);
                        $('.player1').removeClass("active");
                        $(this).addClass("active");
                        socket.emit('selectPiece', {player: player, piece: this.id});
                    });

                    $('.posMove').click(function () {
                        console.log("player: " + player + " is moving a piece to: " + this.id);
                        $('.posMove').removeClass("posMove");
                        // $(shadowPieces[0]).removeClass("posMove");
                        // $(shadowPieces[1]).removeClass("posMove");
                        // if (this.id == shadowPieces[0].id) $(shadowPieces[1]).addClass("noPiece");
                        // else if (this.id == shadowPieces[1].id) $(shadowPieces[0]).addClass("noPiece");
                        //
                        // shadowPieces = [];

                        socket.emit('move', {player: player, piece: this.id});
                    });
                }
                else if (player == "player2") {
                    $('.player2').click(function () {
                        console.log("player turn: " + player);
                        console.log("player: " + player + " has selected piece: " + this.id);
                        $('.player2').removeClass("active");
                        $(this).addClass("active");
                        socket.emit('selectPiece', {player: player, piece: this.id});
                    });

                    $('.posMove').click(function () {
                        console.log("player: " + player + " is moving a piece to: " + this.id);
                        $('.posMove').removeClass("posMove");
                        // $(shadowPieces[0]).removeClass("posMove");
                        // $(shadowPieces[1]).removeClass("posMove");
                        // if (this.id == shadowPieces[0].id) $(shadowPieces[1]).addClass("noPiece");
                        // else if (this.id == shadowPieces[1].id) $(shadowPieces[0]).addClass("noPiece");

                        // shadowPieces = [];

                        socket.emit('move', {player: player, piece: this.id});
                    });
                }
            }
            else {
                console.log("Not a player");
            }
        }
    });
});