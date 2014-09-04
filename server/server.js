var port    = process.PORT || 8009;
var io      = require('socket.io').listen(port);
var CLIENTS = [];
var _       = require('lodash');

var getClient = function (clientID) {
  return _.where(CLIENTS, { id: clientID });
};

io.sockets.on('connection', function (socket) {
  socket.on('setName', function (data) {
    var client = {id: socket.id, name: data.name};
    CLIENTS.push(client);

    io.sockets.emit('joined', { client: client, clients: CLIENTS });
    console.log('User connected: ' + client.name);
  });

  socket.on('message', function (data) {
    var client = getClient(socket.id);

    io.sockets.emit('message', {client: client, message: data.message});
  });

  socket.on('disconnect', function () {
    var client = getClient(socket.id);
    _.remove(CLIENTS, function(cli) { return cli.id == socket.id; } );

    io.sockets.emit('logout', { client: client, clients: CLIENTS });
  });
});

console.log(' ### FREE WILL CHAT ###')
console.log('Listening on port ' + port);
console.log(' ### NO HISTORY AT ALL ###')
