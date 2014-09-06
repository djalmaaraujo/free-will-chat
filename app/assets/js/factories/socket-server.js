angular.module('freewill.factories', ['btford.socket-io'])
  .factory('socketServer', function (socketFactory) {
    return socketFactory({
      ioSocket: io.connect('http://pian.in:8009')
    });
  })

  .factory('userInfo', function () {
    return {
      get: function () {
        return localStorage.getItem('freewill_username');
      },

      set: function (name) {
        return localStorage.setItem('freewill_username', name);
      }
    };
  });
