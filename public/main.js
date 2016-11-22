var socket = io();
var mousedown = false;

$(document).mousedown(function() {
    mousedown = true;
});

$(document).mouseup(function() {
    mousedown = false;
});

var pictionary = function() {
    var canvas, context, guessBox, guesses, role, designatedDrawer = false;
    
    var canvasHtml = document.getElementById('canvas');
    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    
    var draw = function(position) {
        if (mousedown) {
            context.beginPath();
            context.arc(position.x, position.y,
                             6, 0, 2 * Math.PI);
            context.fill();
            socket.emit('drawing', position);
        }
    };
    
    var drawRemote = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };
    
    guessBox = $('#guess input');
    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }

        socket.emit('guess', guessBox.val());
        console.log(guessBox.val());
        guessBox.val('');
    };
    guessBox.on('keydown', onKeyDown);

    canvas.on('mousemove', function(event) {
        // Only the designated drawer gets to draw.
        if (designatedDrawer) {
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
            draw(position);
        }
    });
    
    socket.on('drawing', function(position) {
        drawRemote(position);
    });
    
    socket.on('userOnline', function() {
        socket.emit('progressDrawing', canvas[0].toDataURL('image/png'));
    });
    
    socket.on('progressDrawing', function(drawing) {
        var image = new Image();
        image.src = drawing;
        context.drawImage(image, 0, 0);
    });
    
    guesses = $('#guesses');
    socket.on('guess', function(word) {
        guesses.text(word);
    });
    
    role = $('#role');
    socket.on('designated', function() {
        role.empty().text('Designated Drawer');
        designatedDrawer = true;
    });
    
    socket.on('guesser', function() {
        role.empty().text('Guesser');
        designatedDrawer = false;
    })
};

$(document).ready(function() {
    pictionary();
});
