var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function (socket) {
    socket.broadcast.emit('userOnline');
    
    socket.on('drawing', function(position) {
        socket.broadcast.emit('drawing', position);
    });
    
    socket.on('progressDrawing', function(drawing) {
        socket.broadcast.emit('updateCanvas', drawing);
    });
    
    socket.on('guess', function(word) {
        socket.emit('guess', word);
        socket.broadcast.emit('guess', word);
    });
});

server.listen(process.env.PORT || 8080);
