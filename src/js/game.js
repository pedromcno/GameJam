(function () {
    'use strict';

    function Game() {
        this.player = null;
    }

    Game.prototype = {

        create: function () {
            this.addBackground();
            this.addVan();
            this.addPlayer();
            this.input.onDown.add(this.onInputDown, this);
        },

        addPlayer: function() {
            var x = this.game.width / 2,
                y = this.game.height - this.van.height;

            this.player = this.add.sprite(x, y, 'player');
            this.player.anchor.setTo(0.5, 1);
            this.player.scale.x = 2;
            this.player.scale.y = 2;
        },

        addVan: function() {
            var x = this.game.width / 2,
                y = this.game.height;

            this.van = this.add.sprite(x, y, 'van');
            this.van.anchor.setTo(0.5, 1);
            this.van.scale.x = 2;
            this.van.scale.y = 2;
        },

        addBackground: function() {
            var background = this.add.sprite(0, 0, 'background');
            background.scale.x = 2;
            background.scale.y = 2;
        },

        update: function () {
        },

        onInputDown: function () {
        }

    };

    window['ganja-farmer'] = window['ganja-farmer'] || {};
    window['ganja-farmer'].Game = Game;

}());
