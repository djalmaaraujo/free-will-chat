var FWControllers = FWControllers || angular.module('freewill.controllers', ['freewill.factories']);

FWControllers.controller('MessageController', ['socketServer', 'userInfo', function (socketServer, userInfo) {
  var self = this;

  self.messages = [];
  self.newMessage = '';

  self.sendMessage = function () {
    console.log(self.newMessage.trim());
    if (self.newMessage.trim()) {
      socketServer.emit('chat', { message: self.newMessage });
      self.newMessage = '';
    }
  };

  socketServer.on('joined', function (data) {
    var user = data.client[0];

    self.messages.push({
      class: 'joined',
      name: user.name,
      message: 'Joined the chat',
      time: Date.now()
    });
  });

  socketServer.on('chat', function (data) {
    var user = data.client[0];

    self.messages.push({
      class: 'message',
      name: user.name,
      message: data.message,
      time: Date.now()
    });
  });

  socketServer.on('logout', function (data) {
    var user = data.client[0];

    self.messages.push({
      class: 'logout',
      name: user.name,
      message: 'Left the chat',
      time: Date.now()
    });
  });
}]);
