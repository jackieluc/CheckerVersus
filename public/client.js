var BOARD = {};

$(function() {

    var socket = io();

    socket.on('BOARD', function(data) {
        updateBoard(data);
    });

});

// =======================================================
// Helper Functions
// =======================================================

// update the board
function updateBoard(data) {
    var rows = data.split('|');
    var board = $('#board');
    board.html(''); // Clear existing board contents

    for (var i=0; i<rows.length; i++) {

        var row = rows[i];
        var pieces = row.split('');
        var $row = $('<row>');
        board.append($row);

        for (var j=0; j<pieces.length; j++) {

            var piece = pieces[j];
            var $space = $('<space>');
            $row.append($space);

            if ((j + (i % 2)) % 2 != 0) {
                $space.addClass('usable');
                $space.on('dragover', allowDrop);
                $space.on('drop', dropPiece);
            }

            var $piece = $('<piece>');

            $piece.on('dragstart', dragPiece);
            $piece.on('touchstart', touchDrag);
            $piece.on('touchmove', touchMove);
            $piece.on('touchend', touchDrop);

            if (piece.toLowerCase() == 'r') {
                $piece.addClass('red');
            } else if (piece.toLowerCase() == 'b') {
                $piece.addClass('black');
            } else {
                continue;
            }
            $space.append($piece);
            if (piece >= 'A' && piece <= 'Z')
                $piece.addClass('king');
        }
    }
    $(getElement('game')).css('visibility', 'visible');
    resizeGame();
};