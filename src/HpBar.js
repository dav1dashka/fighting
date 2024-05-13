import { Container, Graphics } from "pixi.js";

export class HpBar {
    constructor(currentHp, maxHp, color, xPos = 0, yPos = 10) {
        this.currentHp = currentHp;
        this.maxHp = maxHp;
        this.color = color;
        this.hpBar = new Graphics();
        this.container = new Container();
        this.container.addChild(this.hpBar);

        this.container.x = xPos;
        this.container.y = yPos;
    }

    draw(person) {
        this.hpBar.clear();
        this.hpBar.fill(this.color);
        let hpPortion = this.currentHp / this.maxHp;

        if (person === 'tanka') {
            this.hpBar.poly([
                50 + (400 * (1 - hpPortion)), 0,
                450, 0,
                425, 25,
                25 + (400 * (1 - hpPortion)), 25,
            ]);
            this.hpBar.fill();
        } else {
            this.hpBar.poly([
                0, 0,
                0 + (400 * hpPortion), 0,
                25 + (400 * hpPortion), 25,
                25, 25,
            ]);
            this.hpBar.fill();
        }
    }
}