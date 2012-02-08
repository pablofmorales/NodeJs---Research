var app = require('http').createServer(handler).listen(8000, '10.0.5.93');
var io = require('socket.io').listen(app);
var fs = require('fs');
var url = require('url');

var servername = 'SERVER BOT';
var conns = [];

function handler (req, res) {
    if (req.url.match(/^\/chat\?nick=/))
        show('/chat.html', res);
    else if (req.url.match(/^(\/|\/\?error=.*)$/))
        show('/login.html', res);
    else {
        res.writeHead(404);
        res.end('Document not found');
    }
}

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

io.set('heartbeats', false);
io.sockets.on('connection', function (socket) {

    socket.on('disconnect', function () {
        logout({'nick': socket.nick});
        console.log(socket.nick + ' has disconnected');
    })

    socket.on('login', function (data) {
        var nick_exists = false;
        for (var i=0; i<conns.length; i++) {
            if (conns[i].nick == data.nick) {
                nick_exists = true;
                break;
            }
        }
        if (nick_exists) {
            msg = { nick:  servername,
                    msg:   data.nick + ' already exists',
                    time:  Date.now(),
                    error: true };
        }
        else {
            socket.nick = data.nick; // Save nickname in socket
            conns.push(socket);
            // Broadcast message
            socket.broadcast.emit('chat',
                                  { nick: servername,
                                    msg:  data.nick + ' has joined',
                                    time: Date.now() });
            // Welcome message
            msg = { nick: servername,
                    msg:  'Hello ' + data.nick,
                    time: Date.now() };
        }
        console.log(msg);
        socket.emit('chat', msg);
    });

    socket.on('logout', function(data) {
        logout(data);
    });

    socket.on('msg', function (data) {
        console.log(data);
        for (var i=0; i<conns.length; i++) {
            conns[i].emit('chat', { nick: socket.nick,
                                    msg:  data.msg,
                                    time: Date.now() });
        }
    });

    socket.on('getList', function(data ){
        var result = '';
        for (var i=0; i<conns.length; i++) {
            result += '<li>' + conns[i].nick + '</li>';
        }
        socket.emit('userlist', {'nicks': result});
    });

});

function logout (data) {
    for (var i=0; i<conns.length; i++) {
        if (conns[i].nick == data.nick) {
            conns[i].broadcast.emit('chat',
                                    { nick: servername,
                                      msg:  data.nick + ' has quit',
                                      time: Date.now() });
            s = conns.splice(i, 1);
            break;
        }
    }
}
