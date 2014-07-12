(function() {
  'use strict';

  function Farm() {
  }

  Farm.prototype = {

    someFunction: function () {
    }
  };

  window['ganja-farmer'] = window['ganja-farmer'] || {};
  window['ganja-farmer'].Farm = Farm;

}());

