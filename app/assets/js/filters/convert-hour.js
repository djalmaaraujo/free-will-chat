angular.module('freewill.filters', [])
  .filter('convertToHour', function () {
    return function (input) {
      var date = new Date(input);
      return date.getHours() + ':' + date.getMinutes()
    }
  });

