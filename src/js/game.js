(function () {
    'use strict';

    function Game() {
        this.player = null;
        this.bullets = null;

        this.fireRate = 100;
        this.nextFire = 0;
    }

    Game.prototype = {

        create: function () {
            this.addBackground();
            this.addVan();
            this.addChopper();
            this.addPlayer();
            this.input.onDown.add(this.onInputDown, this);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.addBullets();
        },

        addPlayer: function() {
            var x = this.game.width / 2,
                y = this.game.height - this.van.height;

            this.player = this.add.sprite(x, y, 'player');
            this.player.anchor.setTo(0.5, 1);
        },

        addVan: function() {
            var x = this.game.width / 2,
                y = this.game.height;

            this.van = this.add.sprite(x, y, 'van');
            this.van.anchor.setTo(0.5, 1);
        },
        addChopper: function() {
            var x = this.game.width / 4,
                y = this.game.height/2;

            this.chopper = this.add.sprite(x, y, 'chopper');
            this.chopper.anchor.setTo(0.5, 3);
            this.chopper.animations.add('fly_left');
            this.chopper.animations.play('fly_left', 20, true, true);
        },

        addBackground: function() {
            this.add.sprite(0, 0, 'background');
        },

        addBullets: function() {
          this.bullets = this.game.add.group();
          this.bullets.enableBody = true;
          this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

          this.bullets.createMultiple(50, 'bullet');
          this.bullets.setAll('checkWorldBounds', true);
          this.bullets.setAll('outOfBoundsKill', true);
        },

        update: function () {
            if (this.game.input.activePointer.isDown) {
              this.fire();
            }
        },

        fire: function() {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                    this.nextFire = this.game.time.now + this.fireRate;
                    var bullet = this.bullets.getFirstDead();
                    bullet.reset(this.player.x - this.player.width/20, this.player.y - this.player.height);
                    this.game.physics.arcade.moveToPointer(bullet, 300);
            }
        },

        onInputDown: function () {
        }

    };

    window['ganja-farmer'] = window['ganja-farmer'] || {};
    window['ganja-farmer'].Game = Game;

}());
