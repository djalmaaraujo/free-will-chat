var app = angular.module('freewill', ['btford.socket-io', 'angularMoment']);

app.factory('socketServer', function (socketFactory) {
  return socketFactory({
    ioSocket: io.connect('http://pian.in:8009')
  });
});

app.filter('convertToHour', function () {
  return function (input) {
    var date = new Date(input);
    return date.getHours() + ':' + date.getMinutes()
  }
});

app.factory('userInfo', function () {
  return {
    get: function () {
      return localStorage.getItem('freewill_username');
    },

    set: function (name) {
      return localStorage.setItem('freewill_username', name);
    }
  };
});

app.controller('UserController', ['socketServer', 'userInfo', function (socketServer, userInfo) {
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

app.controller('MessageController', ['socketServer', 'userInfo', function (socketServer, userInfo) {
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

app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});
