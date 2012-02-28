var app = require('http').createServer(handler).listen(8000);
var io = require('socket.io').listen(app);
var fs = require('fs');
var url = require('url');

var servername = 'SERVER';
var conns = [];

function handler (req, res) {
    if (req.url.match(/^\/chat\?nick=/))
        show('/chat.html', res);
    else if (req.url.match(/^(\/|\/\?error=.*)$/))
        show('/login.html', res);
    else if (req.url.match(/^\/bootstrap\//))
        show(req.url, res)
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
        var now = Date.now();

        var nick_exists = false;
        for (var i=0; i<conns.length; i++) {
            if (conns[i].nick == data.nick) {
                nick_exists = true;
                break;
            }
        }

        if (data.nick == servername || nick_exists) {
            msg = { nick:  servername,
                    msg:   data.nick + ' already exists',
                    time:  now,
                    type:  'server',
                    error: true };
        }
        else {
            socket.nick = data.nick; // Save nickname in socket
            conns.push(socket);
            sendNickList();
            // Broadcast message (user joined)
            socket.broadcast.emit('chat',
                                  { nick: servername,
                                    msg:  data.nick + ' has joined',
                                    time: now,
                                    type: 'server' });
            // Welcome message (user only)
            msg = { nick: servername,
                    msg:  'Hello ' + data.nick,
                    time: now,
                    type: 'server' };
        }

        console.log(msg);
        socket.emit('chat', msg);
    });

    socket.on('logout', function(data) {
        logout(data);
    });

    socket.on('msg', function (data) {
        console.log(data);
        var now = Date.now();
        data.msg = data.msg.replace(/^\s+|\s+$/, ''); //trim
        var msgTokens = data.msg.split(' ');

        // Private msg
        if (msgTokens[0] == '/msg') {
            var nick = msgTokens.splice(0, 2)[1];
            var msg = msgTokens.join(' ');
            for (var i=0; i<conns.length; i++) {
                console.log(conns[i].nick);
                if (conns[i].nick == nick) {
                    var msg = { nick: socket.nick,
                                msg:  msg,
                                time: now,
                                type: 'private',
                                to:   nick };
                    conns[i].emit('chat', msg); // private msg target
                    socket.emit('chat', msg); // private msg source
                }
            }
        }
        // Normal msg
        else {
            io.sockets.emit('chat', { nick: socket.nick,
                                      msg:  data.msg,
                                      time: now,
                                      type: 'normal' });
        }
    });

});

function sendNickList() {
    var nicks = [];
    for (var i=0; i<conns.length; i++) {
        nicks.push(conns[i].nick);
    }
    io.sockets.emit('nickList', {'nicks': nicks});
}

function logout (data) {
    for (var i=0; i<conns.length; i++) {
        if (conns[i].nick == data.nick) {
            conns[i].broadcast.emit('chat',
                                    { nick: servername,
                                      msg:  data.nick + ' has quit',
                                      time: Date.now(),
                                      type: 'server' });
            s = conns.splice(i, 1);
            break;
        }
    }
    sendNickList();
}
