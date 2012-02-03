var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(4000);
var connections = [];

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  connections.push(socket);
  socket.emit('chat', {'msg': 'Bienvenido al chat'});
  socket.on('chat', function (data) {
    console.log(data);
    for(i=0, l=connections.length; i < l; i++) {
      connections[i].emit('chat', {'msg': data.msg});
    }
  });
});
