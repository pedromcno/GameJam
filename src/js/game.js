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
            this.addPlayer();
            this.input.onDown.add(this.onInputDown, this);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.addBullets();
        },

        addPlayer: function() {
            var x = this.game.width / 2,
                y = this.game.height / 2;

            this.player = this.add.sprite(x, y, 'player');
            this.player.anchor.setTo(0.5, 0.5);
        },

        addBackground: function() {
            var background = this.add.sprite(0, 0, 'background');
            background.scale.x = 2;
            background.scale.y = 2;
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
            var x, y, cx, cy, dx, dy, angle, scale;

            x = this.input.position.x;
            y = this.input.position.y;
            cx = this.world.centerX;
            cy = this.world.centerY;

            angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
            this.player.angle = angle;

            dx = x - cx;
            dy = y - cy;
            scale = Math.sqrt(dx * dx + dy * dy) / 100;

            this.player.scale.x = scale * 0.6;
            this.player.scale.y = scale * 0.6;

            if (this.game.input.activePointer.isDown) {
              this.fire();
            }
        },

        fire: function() {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                    this.nextFire = this.game.time.now + this.fireRate;
                    var bullet = this.bullets.getFirstDead();
                    bullet.reset(this.player.x - 8, this.player.y - 8);
                    this.game.physics.arcade.moveToPointer(bullet, 300);
            }
        },

        onInputDown: function () {
        }

    };

    window['ganja-farmer'] = window['ganja-farmer'] || {};
    window['ganja-farmer'].Game = Game;

}());
