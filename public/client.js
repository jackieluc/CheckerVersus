var $gameBoard = $('#gameBoard tBody');
var $users = $('#users');
var board = [];
var player = "";
var players = [];
var nickname = "";

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

	socket.on('player', function(data) {
        player = data.player;
        players.push(player);
    });

	socket.on('spectator', function(list) {
	   players = list;
	   player = "";
    });
	
	socket.on('initBoard', function(boardData) {
		$gameBoard.html(boardData.html);
		board = boardData.data;
	});

    $gameBoard.click(function () {
        // cannot click on the pieces if you are not a player
        if (players.includes(player)) {
            console.log("Player: " + player + " nickname: " + nickname);
            if (player == "player1") {
                $('.player1').click(function () {

                    console.log("player: " + player + " piece: " + this.id);
                    socket.emit('move', { player: player, piece: this.id });
                });
            }
            else if (player == "player2") {
                $('.player2').click(function () {

                    console.log("player: " + player + " piece: " + this.id);
                    socket.emit('move', { player: player, piece: this.id });
                });
            }

        }
        else {
            console.log("Not a player");
        }
    });

});
