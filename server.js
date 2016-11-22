var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var designatedDrawerAssigned = false;

io.on('connection', function (socket) {
    var designatedDrawer = false;
    
    socket.broadcast.emit('userOnline');
    
    socket.on('drawing', function(position) {
        socket.broadcast.emit('drawing', position);
    });
    
    socket.on('progressDrawing', function(drawing) {
        socket.broadcast.emit('progressDrawing', drawing);
    });
    
    socket.on('guess', function(word) {
        socket.emit('guess', word);
        socket.broadcast.emit('guess', word);
    });
    
    if (!designatedDrawerAssigned) {
        designatedDrawerAssigned = true;
        designatedDrawer = true;
        
        socket.emit('designated');
    } else {
        socket.emit('guesser');
    }
    
    socket.on('disconnect', function () {
        if (designatedDrawer) {
            designatedDrawerAssigned = false;
            designatedDrawer = false;
        }
    });
});

server.listen(process.env.PORT || 8080);
