import { Application, Sprite } from 'pixi.js';
import { GameLoader } from './GameLoader';
import { Game } from './Game';

(async () => {
    const gameLoader = new GameLoader()
    await gameLoader.preload()

    const app = new Application();
    await app.init({ resizeTo: window });
    app.stage.interactive = true;
    document.body.appendChild(app.canvas);

    const bg = new Sprite(gameLoader.textures.textures['bg.png'])
    bg.width = app.screen.width;
    bg.height = app.screen.height;
    app.stage.addChild(bg)

    const game = new Game({ app, gameLoader });
    game.setup();
})();