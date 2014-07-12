window.onload = function () {
  'use strict';

  var game
    , ns = window['ganja-farmer'];

  game = new Phaser.Game(320, 240, Phaser.AUTO, 'ganja-farmer-game');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
  game.state.start('boot');
};
