var gui = require('nw.gui');
var win = gui.Window.get();

Mousetrap.bind(['mod+w', 'mod+q'], function(e) {
  e.preventDefault();

  if (window.confirm("Do you really want to leave?")) {
    win.close();
  }
});
