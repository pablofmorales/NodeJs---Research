var app = require('express').createServer();
var io  = require('socket.io').listen(app);

app.listen(8080);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

app.get('/js/drawer.js', function (req, res) {
    res.sendfile(__dirname + '/js/drawer.js');
});

io.sockets.on('connection', function (socket) {
  socket.on('dot', function (data) {
    socket.broadcast.emit('dot', data);
  });
});