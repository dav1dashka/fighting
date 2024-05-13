import { Container } from 'pixi.js';
import { Person } from './Person';
import { GameStatus } from './GameStatus';
import { GameOverScreen } from './GameOverScreen';

export class Game {
    constructor({ app, gameLoader }) {
        this.app = app;
        this.gameLoader = gameLoader;
        this.pressedKeys = {};
        this.reset = this.reset.bind(this);
    }

    setup() {
        this.container = new Container();
        this.app.stage.addChild(this.container);

        this.initPersons();
        this.dude.setUp();
        this.tanka.setUp();
        this.allowMovement = true;
        
        this.gameStatus = new GameStatus(100, 100);
        this.container.addChild(this.gameStatus.container)
        this.gameOverScreen = new GameOverScreen();

        this.gameStatus.startTimer();

        this.addTicker();
    }

    reset() {
        this.container.removeChild(this.gameOverScreen.container)

        this.gameStatus.timer.timer = 60;
        this.gameStatus.timer.timerEnded = false;
        this.gameStatus.timer.startTimer();

        this.dude.setUp();
        this.tanka.setUp();
        this.allowMovement = true;
    }

    addTicker() {
        this.app.ticker.add(this.gameUpdate, this);
    }

    async initPersons() {
        this.dude = new Person(this.gameLoader, "dude-idle", window.innerWidth / 1.5, window.innerHeight, true);
        this.container.addChild(this.dude.sprite);

        this.tanka = new Person(this.gameLoader, "tanka-idle", window.innerWidth / 3, window.innerHeight);
        this.container.addChild(this.tanka.sprite);

        window.addEventListener("keydown", (e) => this.handleKeyDown(e));
        window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        window.removeEventListener("keydown", (e) => this.handleKeyDown(e));
        this.pressedKeys[e.key] = true;

        switch (e.key) {
            case '4':
                this.dude.movement.left = true;
                this.dude.movement.lastKey = '4';
                break;
            case '6':
                this.dude.movement.right = true;
                this.dude.movement.lastKey = '6';
                break;
            case '8':
                this.dude.movement.jump = true;
                this.dude.movement.lastKey = '8';
                break;
            case '5':
                this.dude.movement.down = true;
                this.dude.movement.lastKey = '5';
                break;
            case '0':
                this.dude.movement.attack = true;
                this.dude.movement.lastKey = '0';
                break;

            case 'a':
                this.tanka.movement.left = true;
                this.tanka.movement.lastKey = 'a';
                break;
            case 'd':
                this.tanka.movement.right = true;
                this.tanka.movement.lastKey = 'd';
                break;
            case 'w':
                this.tanka.movement.jump = true;
                this.tanka.movement.lastKey = 'w';
                break;
            case ' ':
                this.tanka.movement.attack = true;
                this.tanka.movement.lastKey = ' ';
                break;
        }
    }

    handleKeyUp(e) {
        window.removeEventListener("keyup", (e) => this.handleKeyUp(e));
        this.pressedKeys[e.key] = false;

        switch (e.key) {
            case '4':
                this.dude.movement.left = false;
                this.dude.movement.lastKey = null;
                this.dude.isLeft = true;
                this.dude.isAttacking = false;
                break;
            case '6':
                this.dude.movement.right = false;
                this.dude.movement.lastKey = null;
                this.dude.isRight = true;
                this.dude.isAttacking = false;
                break;
            case '8':
                this.dude.movement.jump = false;
                this.dude.isJump = true;
                break;
            case '0':
                this.dude.movement.attack = false;
                this.dude.isAttack = true;
                break;

            case 'a':
                this.tanka.movement.left = false;
                this.tanka.movement.lastKey = null;
                this.tanka.isLeft = true;
                this.tanka.isAttacking = false;
                break;
            case 'd':
                this.tanka.movement.right = false;
                this.tanka.movement.lastKey = null;
                this.tanka.isRight = true;
                this.tanka.isAttacking = false;
                break;
            case 'w':
                this.tanka.movement.jump = false;
                this.tanka.isJump = true;
                break;
            case ' ':
                this.tanka.movement.attack = false;
                this.tanka.isAttack = true;
                break;
        }
    }

    checkSpecDudeKeys() {
        if (this.pressedKeys['4']) {
            this.dude.movement.left = true;
            this.dude.movement.lastKey = '4';
        }
        if (this.pressedKeys['6']) {
            this.dude.movement.right = true;
            this.dude.movement.lastKey = '6';
        }
        if (this.pressedKeys['8']) {
            this.dude.movement.jump = true;
            this.dude.movement.lastKey = '8';
        }
        if (this.pressedKeys['0']) {
            this.dude.movement.attack = true;
            this.dude.movement.lastKey = '0';
        }
    }

    checkSpecTankaKeys() {
        if (this.pressedKeys['a']) {
            this.tanka.movement.left = true;
            this.tanka.movement.lastKey = 'a';
        }
        if (this.pressedKeys['d']) {
            this.tanka.movement.right = true;
            this.tanka.movement.lastKey = 'd';
        }
        if (this.pressedKeys['w']) {
            this.tanka.movement.jump = true;
            this.tanka.movement.lastKey = 'w';
        }
        if (this.pressedKeys[' ']) {
            this.tanka.movement.attack = true;
            this.tanka.movement.lastKey = ' ';
        }
    }


    handleDudeMovement() {
        if (!this.allowMovement) return;

        this.dude.movement.left && this.dude.movement.jump ? this.dude.moveLeft('dude', 'jump') : null;
        this.dude.movement.right && this.dude.movement.jump ? this.dude.moveRight('dude', 'jump') : null;

        this.dude.movement.left && this.dude.movement.attack ? this.dude.moveLeft('dude', 'attack') : null;
        this.dude.movement.right && this.dude.movement.attack ? this.dude.moveRight('dude', 'attack') : null;

        switch (true) {
            case this.dude.movement.left && this.dude.movement.lastKey === '4':
                this.dude.moveLeft('dude', 'run');
                break;
            case this.dude.movement.right && this.dude.movement.lastKey === '6':
                this.dude.moveRight('dude', 'run');
                break;
            case this.dude.movement.jump && this.dude.movement.lastKey === '8':
                this.dude.jump('dude');
                break;
            case this.dude.movement.attack && this.dude.movement.lastKey === '0':
                this.dude.attack('dude');
                break;
            case !this.dude.inAir:
                this.dude.idle('dude');
        }
    }

    handleTankaMovement() {
        if (!this.allowMovement) return;

        this.tanka.movement.left && this.tanka.movement.jump ? this.tanka.moveLeft('tanka', 'jump') : null;
        this.tanka.movement.right && this.tanka.movement.jump ? this.tanka.moveRight('tanka', 'jump') : null;

        this.tanka.movement.left && this.tanka.movement.attack ? this.tanka.moveLeft('tanka', 'attack') : null;
        this.tanka.movement.right && this.tanka.movement.attack ? this.tanka.moveRight('tanka', 'attack') : null;

        switch (true) {
            case this.tanka.movement.left && this.tanka.movement.lastKey === 'a':
                this.tanka.moveLeft('tanka', 'run');
                break;
            case this.tanka.movement.right && this.tanka.movement.lastKey === 'd':
                this.tanka.moveRight('tanka', 'run');
                break;
            case this.tanka.movement.jump && this.tanka.movement.lastKey === 'w':
                this.tanka.jump('tanka');
                break;
            case this.tanka.movement.attack && this.tanka.movement.lastKey === ' ':
                this.tanka.attack('tanka');
                break;
            case !this.tanka.inAir:
                this.tanka.idle('tanka');
        }
    }

    detectCollision() {
        if (this.dude.movement.attackPressed &&
            this.dude.movement.lastKey != null &&
            this.dude.right > this.tanka.left &&
            this.dude.left < this.tanka.right &&
            this.dude.bottom > this.tanka.top &&
            this.dude.top < this.tanka.bottom
        ) {
            this.tanka.health -= 10;
            this.dude.movement.attackPressed = false;
            this.tanka.health <= 0 ? this.tanka.deadAnimate('tanka') : this.tanka.hurtAnimate('tanka');
        }

        if (this.tanka.movement.attackPressed &&
            this.tanka.right > this.dude.left &&
            this.tanka.left < this.dude.right &&
            this.tanka.bottom > this.dude.top &&
            this.tanka.top < this.dude.bottom
        ) {
            this.dude.health -= 10;
            this.tanka.movement.attackPressed = false;
            this.dude.health <= 0 ? this.dude.deadAnimate('dude') : this.dude.hurtAnimate('dude');
        }
    }

    gameOver() {
        switch (true) {
            case this.dude.health <= 0:
                this.showGameOverScreen('Tanka');
                break;
            case this.tanka.health <= 0:
                this.showGameOverScreen('Dude');
                break;
            case this.dude.health > this.tanka.health && this.gameStatus.timer.timerEnded:
                this.showGameOverScreen('Dude');
                break;
            case this.dude.health < this.tanka.health && this.gameStatus.timer.timerEnded:
                this.showGameOverScreen('Tanka');
                break;
            case this.dude.health === this.tanka.health && this.gameStatus.timer.timerEnded:
                this.showGameOverScreen('Tie');
                break;
        }
    }

    showGameOverScreen(person) {
        this.allowMovement = false;
        this.dude.isDead ? this.dude.idle('dude') : null;
        this.tanka.isDead ? this.tanka.idle('tanka') : null;

        this.gameStatus.timer.endTimer();
        
        switch (person) {
            case 'Dude':
                this.gameOverScreen.updateText('Dude won this battle');
                break;
            case 'Tanka':
                this.gameOverScreen.updateText('Tanka won this battle');
                break;
            case 'Tie':
                this.gameOverScreen.updateText('Tie');
                break;
        }

        this.container.addChild(this.gameOverScreen.container)
        this.gameOverScreen.button.on('buttonClicked', this.reset, this);
    }

    gameUpdate() {
        this.checkSpecDudeKeys();
        this.checkSpecTankaKeys();

        this.handleDudeMovement();
        this.handleTankaMovement();

        this.detectCollision();
        this.gameOver()

        this.dude.update();
        this.tanka.update();

        this.gameStatus.timer.timerEnded ? this.gameOver() : null;

        this.gameStatus.update(this.dude.health, this.tanka.health);
    };
}