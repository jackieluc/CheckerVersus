var $gameBoard = $('#gameBoard tBody');
var $users = $('#users');
var board = [];
var player = "";
var players = [];

$(function() {

    var socket = io();

    socket.on('usersOnline', function(data) {
		var html ='';
		for(x = 0; x < data.length; x++) {
			html = html + data[x] + "<br/>";
		}
		$users.html(html);
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
        // cannot click on the board if you are not a player
        if (players.includes(player)) {
            $('.player1, .player2').click(function () {

                console.log("this: " + this.id);
            });
            socket.emit('move', this.id);
        }
        else {
            console.log("Not player");
        }
    });

});
