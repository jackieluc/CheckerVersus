var BOARD = {};

$(function() {

    var socket = io();

    // initialize the game board on client side
    socket.on('BOARD', function(gameBoard) {
        updateBoard(gameBoard);
    });

});

// =======================================================
// Helper Functions
// =======================================================

// update the board
function updateBoard(gameBoard) {
   for (let row in gameBoard) {
       for (let column in gameBoard[row]) {

       }
   }
};