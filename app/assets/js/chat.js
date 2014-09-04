$(function () {
  var socket            = io.connect('http://pian.in:8009');
  var $chatRoomMessages = $(".chat-room-messages");
  var $inputChat = $('.chat-form input');

  var getUserName = function () {
    return localStorage.getItem('chat_userName');
  };

  var updateScroll = function () {
    $chatRoomMessages.scrollTop($chatRoomMessages[0].scrollHeight);
  };

  var startChat = function () {
    socket.emit('setName', { name: getUserName() })
    $('.wrapper').removeClass('disabled');
    $('.dialogs-container').addClass('hide');
    $('.chat-txt input').focus();
    updateScroll();
  };

  var addMessage = function (message) {
    var source   = $("#message-template").html();
    var template = Handlebars.compile(source);

    var data = {
      name: message.user,
      message: message.text,
      time: moment(message.time).format('h:mm a'),
      class: message.class
    };

    $chatRoomMessages.append(template(data));
  };

  var refreshUsers = function (clients) {
    var clients = _.sortBy(clients, ['name']);
    var users   = [];

    clients.forEach(function(obj, index) {
      users.push($('<li />').html(obj.name));
    });

    $('.online-users-list').html(users);
  };

  socket.on('joined', function (data) {
    addMessage({
      user: data.client[0].name,
      text: 'Joined the room',
      time: new Date(),
      class: 'joined'
    });

    refreshUsers(data.clients);
    updateScroll();
  });

  socket.on('logout', function (data) {
    addMessage({
      user: data.client[0].name,
      text: 'Left the room',
      time: new Date(),
      class: 'logout'
    });

    refreshUsers(data.clients);
    updateScroll();
  })

  socket.on('chat', function (data) {
    addMessage({
      user: data.client[0].name,
      text: data.message,
      time: new Date(),
      class: 'message'
    });

    updateScroll();
  });

  if (getUserName()) {
    startChat();
  }

  // Login
  $('.insert-your-name-form').on('submit', function (e) {
    e.preventDefault();

    var name = $(this).find('input').val();
    localStorage.setItem('chat_userName', name);

    startChat();
  });

  // Send Messages
  $inputChat.on('keypress', function (e) {
    if (e.which == 13) {
      e.preventDefault();

      if ($inputChat.val()) {
        socket.emit('chat', { message: $inputChat.val() });

        $inputChat.val('');
      }
    }
  });
});
