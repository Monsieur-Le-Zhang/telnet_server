var net = require('net');

var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        // here we can write other informations like the system informations.
        socket.write(data);
    });
});

server.listen(8888);