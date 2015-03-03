var net = require('net');
var events = require('events');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
    this.clients[id] = client;
    this.subscriptions[id] = function (senderID, message) {
        if (id != senderID) {
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function (id) {
    this.removeListener('broadcast', this.subscriptions[id]);
    this.emit('broadcast', id, id + " has left the chat room!");
});

var server = net.createServer(function (client) {
    var id = client.remoteAddress + client.remotePort;
    channel.emit('join', id, client);

    client.on('data', function (data) {
        data = data.toString();
        channel.emit('broadcast', id, data);
    });

    client.on('close', function () {
        channel.emit('leave', id);
    })
});

server.listen(8888);

// the simple verison
/*
var server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        // here we can write other informations like the system informations.
        socket.write(data);
    });
});


server.listen(8888);
*/