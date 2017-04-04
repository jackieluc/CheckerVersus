$(function() {

    var socket = io();
	var $users = $('#users');
	var $gameBoard = $('#gameBoard tBody');

	socket.emit('userConnected', 'New client has connected');
	
	socket.on('usersOnline', function(data) {
		var html ='';
		for(x = 0; x < data.length; x++) {
			html = html + data[x] + "<br/>";
		}
		$users.html(html);
	});
	
	socket.on('BOARD', function(data) {
		var row = new Array(9).join('<td></td>');
		var body = new Array(9).join('<tr>' + row + '</tr>');
		$gameBoard.html(body);
	});
});