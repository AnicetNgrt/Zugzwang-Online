
(function () {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'gameContainer', null, false, false);

    game.state.add('Boot',          FunkyMultiplayerGame.Boot);
    game.state.add('Preload',       FunkyMultiplayerGame.Preload);
    game.state.add('Menu',          FunkyMultiplayerGame.Menu);
    game.state.add('Game',          FunkyMultiplayerGame.Game);

    document.getElementById("gameContainer").style.display = "none";

    game.state.start('Boot');
})();