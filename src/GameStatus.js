import { Container } from "pixi.js";
import { HpBar } from "./HpBar";
import { Timer } from './Timer';

export class GameStatus {
    constructor(currentHp, maxHp) {
        this.container = new Container();
        this.container.x = 0;
        this.container.y = 10;

        this.timer = new Timer(60);
        this.container.addChild(this.timer.container);

        this.dudeBgHpBar = new HpBar(currentHp, maxHp, 0xFFFFFF, window.innerWidth / 2 + this.timer.container.width / 2);
        this.container.addChild(this.dudeBgHpBar.container);

        this.dudeViewHpBar = new HpBar(currentHp, maxHp, 0xFF0000, window.innerWidth / 2 + this.timer.container.width / 2);
        this.container.addChild(this.dudeViewHpBar.container);

        this.tankaBgHpBar = new HpBar(currentHp, maxHp, 0xFFFFFF, window.innerWidth / 2 - 425 - this.timer.container.width);
        this.container.addChild(this.tankaBgHpBar.container);

        this.tankaViewHpBar = new HpBar(currentHp, maxHp, 0xFF0000, window.innerWidth / 2 - 425 - this.timer.container.width);
        this.container.addChild(this.tankaViewHpBar.container);
    }

    drawBars() {
        this.dudeBgHpBar.draw('dude');
        this.dudeViewHpBar.draw('dude');

        this.tankaBgHpBar.draw('tanka');
        this.tankaViewHpBar.draw('tanka');
    }

    startTimer() {
        this.timer.startTimer();
    }

    update(dudeCurrentHp, tankaCurrentHp) {
        this.dudeViewHpBar.currentHp = dudeCurrentHp;
        this.tankaViewHpBar.currentHp = tankaCurrentHp;
        this.drawBars();
        this.timer.updateText();
    }
}