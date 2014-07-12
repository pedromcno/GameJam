(function () {
    'use strict';

    function Game() {
        this.player = null;
        this.bullets = null;
        this.choppers = null;
        this.troopers = null;
        this.explosion = null;

        this.fireRate = 50;
        this.nextFire = 0;
        this.score = 0;
        this.scoreText = null;

        // Sound Files
        this.soundShoot = null;
        this.soundSmoke = null;
        this.soundDead = null;
        this.soundExplosion = null;
    }

    Game.prototype = {

        create: function () {
            this.addBackground();
            this.addChoppers();
            this.addTroopers();
            this.addFarm();
            this.addVan();
            this.addPlayer();
            this.addSound();
            this.input.onDown.add(this.onInputDown, this);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.addBullets();

            this.scoreText = this.add.text(8, 8, 'score: 0', { font: '12px monospace', fill: '#000' });
        },

        addSound: function() {
            this.soundShoot = this.add.audio('fire');
            this.soundSmoke = this.add.audio('smoking');
            this.soundDead = this.add.audio('dead');
            this.soundExplosion = this.add.audio('explosion');
        },

        addPlayer: function() {
            var x = this.game.width / 2,
                y = this.game.height - this.van.height-40;

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

            this.van = this.add.sprite(x, y-40, 'van');
            this.van.anchor.setTo(0.5, 1);
        },
        
        addChoppers: function() {
            this.choppers = this.game.add.group();


            for (var i = 0; i < 6; i++)
            {
                //  This creates a new Phaser.Sprite instance within the group
                //  It will be randomly placed within the world and use the 'baddie' image to display
                var heli = this.choppers.create(400, Math.random() * 100, 'chopper');
                heli.enableBody = true;
                this.game.physics.enable(heli, Phaser.Physics.ARCADE);

                heli.body.velocity.x =  (10 + Math.random() * 50) * (-1);

                heli.hits = 0;
            }

            this.choppers.callAll('animations.add', 'animations', 'fly_left', [0, 1], 20, true);
            this.choppers.callAll('animations.play', 'animations', 'fly_left');
            this.choppers.enableBody = true;
            this.choppers.physicsBodyType = Phaser.Physics.ARCADE;


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
            if(this.farm.getAt(index).animations) {
                this.farm.getAt(index).animations.play('burn', 7, true);
            }
        },

        update: function () {
            this.playerAiming();
            if (this.game.input.activePointer.isDown) {
              this.fire();
            }
            this.game.physics.arcade.overlap(this.choppers, this.bullets, this.hitChopper, null, this);
            this.game.physics.arcade.overlap(this.troopers, this.bullets, this.hitTrooper, null, this);

            this.choppers.forEachAlive(function(chopper) {
              if (chopper.hits === 10) {
                this.killChopper(chopper);
              }
            }, this);

            

            this.spanTrooper();
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

        hitChopper: function (chopper, bullet) {
            chopper.hits += 1;
            bullet.kill();
        },

        
        killChopper: function (chopper) {
          
          this.explosion = this.add.sprite(chopper.body.x, chopper.body.y-chopper.height, 'explosion');

            var ani = this.explosion.animations.add('run', null, 20, false);
            this.explosion.animations.play('run');

            chopper.kill();
            this.soundExplosion.play();

            this.addScore(10);
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

        addScore : function(points) {
          this.score +=points;
          this.scoreText.text = 'score: '+ this.score;
    		},

        onInputDown: function () {
        },

        spanTrooper: function() {
          var chanceForSpawn = 0.02;

          if (Math.random() < chanceForSpawn) {
            var trooper = this.troopers.getFirstDead();

            var x = Math.round(this.game.width * Math.random()),
                y = 0;

            trooper.reset(x, y);
            trooper.body.velocity.y = 50;
            trooper.events.onOutOfBounds.add(function() {
              this.incineratePlantAt(Math.floor(Math.random() * (25 + 1)));
            },this);
          }
        },

        addTroopers: function() {

          this.troopers = this.game.add.group();
          this.troopers.enableBody = true;
          this.troopers.physicsBodyType = Phaser.Physics.ARCADE;

          this.troopers.createMultiple(50, 'paraTrooper');
          this.troopers.setAll('checkWorldBounds', true);
          this.troopers.setAll('outOfBoundsKill', true);

          this.troopers.callAll('animations.add', 'animations', 'fly', [0, 1, 2, 3, 4, 3 ,2, 1, 0], 8, true);
          this.troopers.callAll('animations.play', 'animations', 'fly');



        },

        hitTrooper: function(trooper) {
          trooper.kill();
          this.addScore(1);
          this.soundDead.play();
        }

    };

    window['ganja-farmer'] = window['ganja-farmer'] || {};
    window['ganja-farmer'].Game = Game;

}());
