(function () {
    'use strict';

    function Boot() {}

    Boot.prototype = {

        preload: function () {
            this.load.image('preloader', 'assets/preloader.gif');
        },

        create: function () {
            this.game.input.maxPointers = 1;
            // this.game.stage.disableVisibilityChange = true;

            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.state.start('preloader');
        }
    };

    window['ganja-farmer'] = window['ganja-farmer'] || {};
    window['ganja-farmer'].Boot = Boot;

}());
