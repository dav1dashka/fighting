import { Graphics, Container, Text } from "pixi.js";

export class Timer {
    constructor(timer = 60) {
        this.timer = timer;
        this.timerId = null;
        this.timerEnded = false;
        this.timerSquare = new Graphics();
        this.container = new Container();
        this.drawTimer();
    }

    drawTimer() {
        let circleRadius = window.innerWidth * 0.02;
        let outlineThickness = circleRadius * 0.15;
        let position = { x: window.innerWidth / 2, y: window.innerHeight / 20 };

        this.timerSquare.lineStyle(outlineThickness, 0x8B2D2D);
        this.timerSquare.beginFill(0xECECEC);
        this.timerSquare.drawCircle(position.x, position.y, circleRadius);
        this.timerSquare.endFill();
        this.container.addChild(this.timerSquare)

        this.timerText = new Text(this.timer, {
            fontFamily: 'Trebuchet MS',
            fontSize: 80,
            fill: 0x000000,
            align: 'center'
        });
        this.timerText.height = 34
        this.timerText.width = 34

        this.timerText.anchor.set(0.5);
        this.timerText.x = position.x;
        this.timerText.y = position.y;

        this.container.addChild(this.timerText)
    }

    startTimer() {
        this.timerId ? clearTimeout(this.timerId) : null;
        

        if (this.timer > 0) {
            this.timerId = setTimeout(this.startTimer.bind(this), 1000);
            this.timer--;
        } else this.timerEnded = true;
    }

    endTimer() {
        clearTimeout(this.timerId)
    }

    updateText() {
        this.timerText.text = this.timer;
    }
}