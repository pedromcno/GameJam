(function () {
    'use strict';

    function Game() {
        this.player = null;
        this.bullets = null;

        this.fireRate = 100;
        this.nextFire = 0;
		
		// Sound Files
		this.soundShoot = null;
		this.soundSmoke = null;
		this.soundDead = null;
		this.soundExplosion = null;
        this.farm = new window['ganja-farmer'].Farm();
    }

    Game.prototype = {

        create: function () {
            this.addBackground();
            this.addVan();
            this.addChopper();
            this.addPlayer();
			this.addSound();
            this.input.onDown.add(this.onInputDown, this);
            console.log(this.farm);

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
                    this.nextFire = this.game.time.now + this.fireRate;
                    var bullet = this.bullets.getFirstDead();
                    bullet.reset(this.player.x - this.player.width/20, this.player.y - this.player.height);
                    this.game.physics.arcade.moveToPointer(bullet, 300);
					this.soundShoot.play();
            }
        },

        checkOverlap: function (spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);
        },

        onInputDown: function () {
        }

    };

    window['ganja-farmer'] = window['ganja-farmer'] || {};
    window['ganja-farmer'].Game = Game;

}());
