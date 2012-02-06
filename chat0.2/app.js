var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var url = require('url');

var conns = [];

function handler (req, res) {
    if (req.url.match(/^\/chat\?nick=/))
        show('/chat.html', res);
    else
        show('/login.html', res);
}

app.listen(8000);

function show(filename, res) {
    fs.readFile(__dirname + filename, function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + __dirname + filename);
        }
        res.writeHead(200);
        res.end(data);
    });
}

io.sockets.on('connection', function (socket) {
    socket.on('login', function (nick) {
        var nick_exists = false;
        for (var i=0; i<conns.length; i++) {
            if (conns[i].nick == nick) {
                nick_exists = true;
                break;
            }
        }
        if (nick_exists) {
            msg = { nick:  '_SERVER_',
                    msg:   nick + ' already exists',
                    time:  Date.now(),
                    error: true };
        }
        else {
            socket.nick = nick; // Save nickname in socket
            conns.push(socket);
            msg = { nick:  '_SERVER_',
                    msg:   'Hello ' + nick,
                    time:  Date.now(),
                    error: false };
        }
        console.log(msg);
        socket.emit('chat', msg);
    });
    socket.on('msg', function (data) {
        console.log(data);
        for (var i=0; i<conns.length; i++) {
            conns[i].emit('chat', { nick:  socket.nick,
                                    msg:   data.msg,
                                    time:  Date.now(),
                                    error: false });
        }
    });
});
