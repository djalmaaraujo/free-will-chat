var FWControllers = FWControllers || angular.module('freewill.controllers', ['freewill.factories']);

FWControllers.controller('UserController', ['socketServer', 'userInfo', function (socketServer, userInfo) {
  var self      = this;

  self.userName = '';
  self.isValid  = false;
  self.dialogOn = true;
  self.setNameForm = false;

  self.setName = function () {
    if (self.userName.trim()) {
      socketServer.emit('setName', { name: self.userName });
      userInfo.set(self.userName);
    }
  };

  self.logout = function () {
    self.isValid  = false;
    self.dialogOn = true;
    self.setNameForm = true;
    userInfo.set('');
    socketServer.emit('logout', { success: true });
  };

  socketServer.on('joined', function (data) {
    self.clients = data.clients;
    self.isValid = true;
    self.dialogOn = false;
  });

  socketServer.on('logout', function (data) {
    self.clients = data.clients;
  });

  if (userInfo.get()) {
    self.userName = userInfo.get();
    self.setName();
  } else {
    self.setNameForm = true;
  }
}]);

