(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(320, 240, 'preloader');
      this.asset.anchor.setTo(0.5, 0.5);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      this.load.spritesheet('player', 'assets/sprites/rasta.png', 29, 32, 10);
      this.load.spritesheet('chopper', 'assets/sprites/chopper2.png', 137, 42, 4);
      this.load.image('background', 'assets/background.png');
      this.load.image('van', 'assets/sprites/van.png');
      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
      this.load.image('bullet', 'assets/bullet.png');
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['ganja-farmer'] = window['ganja-farmer'] || {};
  window['ganja-farmer'].Preloader = Preloader;

}());
