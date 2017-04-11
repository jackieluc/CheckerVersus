var $gameBoard = $('#gameBoard tBody');
var board = [];
$(function() {

    var socket = io();
	var $users = $('#users');

	socket.emit('userConnected', 'New client has connected');
	
	socket.on('usersOnline', function(data) {
		var html ='';
		for(x = 0; x < data.length; x++) {
			html = html + data[x] + "<br/>";
		}
		$users.html(html);
	});
	
	socket.on('initBoard', function(boardData) {
		$gameBoard.html(boardData.html);
		board = boardData.data;
	});

	$gameBoard.click(function() {
        $('.player1, .player2').click( function() {
            console.log("this: " + this.id);
        });
    })
});