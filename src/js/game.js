(function () {
    'use strict';

    function Game() {
        this.player = null;
        this.bullets = null;
        this.choppers = null;

        this.fireRate = 100;
        this.nextFire = 0;

        // Sound Files
        this.soundShoot = null;
        this.soundSmoke = null;
        this.soundDead = null;
        this.soundExplosion = null;
    }

    Game.prototype = {

        create: function () {
            this.addBackground();
            this.addVan();
            this.addChopper();
            this.addFarm();
            this.addPlayer();
            this.addSound();
            this.input.onDown.add(this.onInputDown, this);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.addBullets();
        },

        addSound: function() {
            this.soundShoot = this.add.audio('fire');
            this.soundSmoke = this.add.audio('smoking');
            this.soundDead = this.add.audio('dead');
            this.soundExplosion = this.add.audio('explosion');
        },

        addPlayer: function() {
            var x = this.game.width / 2,
                y = this.game.height - this.van.height;

            this.player = this.add.sprite(x, y, 'player');
            this.player.anchor.setTo(0.5, 1);

            // states & animation
            this.player.animations.add('defaultU',[0],15,false);
            this.player.animations.add('fireU',[0,1],15,true);

            this.player.animations.add('defaultUR',[2],15,false);
            this.player.animations.add('fireUR',[2,3],15,true);

            this.player.animations.add('defaultR',[6],15,false);
            this.player.animations.add('fireR',[6,7],15,true);

            this.player.animations.add('defaultUL',[4],15,false);
            this.player.animations.add('fireUL',[4,5],15,true);

            this.player.animations.add('defaultL',[8],15,false);
            this.player.animations.add('fireL',[8,9],15,true);
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
            this.chopper.animations.add('fly_left', [0, 1], 20, true);
            this.chopper.animations.add('fly_right', [2, 3], 20, true);
            this.chopper.animations.play('fly_right');
            this.game.physics.enable(this.chopper, Phaser.Physics.ARCADE);
            this.chopper.body.velocity.x = 50;
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

        addFarm: function() {
            this.farm = this.game.add.group();
            for(var i = 0; i < 25 ; i++) {
                this.farm.create(7+i * 12, 155, 'plant', false);
            }
            this.farm.callAll('animations.add', 'animations', 'burn', [2, 3, 4], 10, true);
        },

        incineratePlantAt: function(index) {
            this.farm.getAt(index).animations.play('burn', 7, true);
        },

        update: function () {
            this.playerAiming();
            if (this.game.input.activePointer.isDown) {
              this.fire();
            }
            for (var i = 0; i < this.bullets.length; i++) {
              if (this.checkOverlap(this.bullets.getAt(i), this.chopper)) {
                  this.chopper.kill();
              }
              else {
                  //text.text = 'Drag the sprites. Overlapping: false';
              }
            }

        },

        fire: function() {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                    var bullet = this.bullets.getFirstDead();
                    var x = this.player.x - (this.player.width / 20),
                        y = this.player.y - (this.player.height / 2);

                    bullet.reset(x, y);

                    this.nextFire = this.game.time.now + this.fireRate;
                    this.game.physics.arcade.moveToPointer(bullet, 300);
					          this.soundShoot.play();
            }
        },

        checkOverlap: function (spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);
        },

        playerAiming: function() {
          var aimPosition = this.physics.arcade.angleToPointer(this.player);

          var fireState = 'default';
          if (this.game.input.activePointer.isDown) {
            fireState = 'fire';
          }

          var aimDirection = 'U';
          if (aimPosition < -2.3) {
            aimDirection = 'L';
          }
          else if (aimPosition < -1.7) {
            aimDirection = 'UL';
          }
          else if (aimPosition > -0.6) {
            aimDirection = 'R';
          }
          else if (aimPosition > -1.2) {
            aimDirection = 'UR';
          }

          this.player.animations.play(fireState + '' + aimDirection);
        },

        onInputDown: function () {
        }

    };

    window['ganja-farmer'] = window['ganja-farmer'] || {};
    window['ganja-farmer'].Game = Game;

}());
