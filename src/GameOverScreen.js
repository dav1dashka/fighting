import { Container, Sprite, Texture, Text } from "pixi.js";

export class GameOverScreen {
    constructor() {
        this.container = new Container();
        this.setup();
    }

    setup() {
        this.bg = new Sprite(Texture.WHITE)
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.bg.tint = 0xf0f4fa;
        this.bg.alpha = 0.5
        this.container.addChild(this.bg)

        this.addWinText();
        this.addButton();
        this.addButtonText();
    }

    addWinText() {
        this.winText = new Text('', {
            fontFamily: 'Trebuchet MS',
            fontSize: 80,
            fill: 0x000000,
            align: 'center'
        });
        this.winText.height = 60
        this.winText.width = 64

        this.winText.anchor.set(0.5);
        this.winText.x = window.innerWidth / 2;
        this.winText.y = window.innerHeight / 2;

        this.container.addChild(this.winText)
    }

    addButton() {
        this.button = new Sprite(Texture.WHITE);
        this.button.width = 100;
        this.button.height = 50;
        this.button.tint = 0xffffff;

        this.button.anchor.set(0.5);
        this.button.x = window.innerWidth / 2;
        this.button.y = window.innerHeight / 2 + this.winText.height * 2;

        this.button.interactive = true;
        this.button.buttonMode = true;

        this.button.on('pointerup', this.onButtonUp);

        this.container.addChild(this.button);
    }

    addButtonText() {
        this.buttonText = new Text('Restart', {
            fontFamily: 'Trebuchet MS',
            fontSize: 60,
            fill: 0x000000,
            align: 'center'
        });
        this.buttonText.height = 28;
        this.buttonText.width = 60;

        this.buttonText.anchor.set(0.5);
        this.buttonText.x = window.innerWidth / 2;
        this.buttonText.y = window.innerHeight / 2 + this.winText.height * 2;

        this.container.addChild(this.buttonText)
    }

    onButtonUp() {
        this.isdown = false;
        this.emit('buttonClicked');
    }

    updateText(text) {
        this.winText.text = text;
    }
}