$(function () {
  var socket            = io.connect('http://127.0.0.1:8009');
  var $chatRoomMessages = $(".chat-room-messages");
  var userName          = localStorage.getItem('chat_userName');

  var updateScroll = function () {
    $chatRoomMessages.scrollTop($chatRoomMessages[0].scrollHeight);
  };

  var startChat = function () {
    $('.wrapper').removeClass('disabled');
    $('.dialogs-container').addClass('hide');
    $('.chat-txt input').focus();
  };

  if (userName) {
    socket.emit('setName', { name: userName })
    startChat();
  }

  socket.on('joined', function (data) {
    var clients = _.sortBy(data.clients, ['name']);
    var users   = [];

    clients.forEach(function(obj, index) {
      users.push($('<li />').html(obj.name));
    });

    $('.online-users-list').html(users);
  });

  updateScroll();
});
