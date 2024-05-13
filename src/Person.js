import { AnimatedSprite } from 'pixi.js';

export class Person {
    constructor(gameLoader, asset, xPos = 0, yPos = 0, mirror = false) {
        this.gameLoader = gameLoader;
        this.asset = asset;
        this.mirror = mirror;

        this.xPos = xPos;
        this.yPos = yPos;

        this.gravity = 0.1;
        this.velocity = 0;

        this.init();
    }

    get left() {
        return this.sprite.x - this.sprite.width / 2;
    }

    get right() {
        return this.left + this.sprite.width;
    }

    get top() {
        return this.sprite.y;
    }

    get bottom() {
        return this.top + this.sprite.height;
    }

    get nextbottom() {
        return this.bottom + this.dy;
    }

    init() {
        this.sprite = new AnimatedSprite(this.gameLoader.textures.animations[`${this.asset}`]);
        this.sprite.anchor.x = 0.5;

        this.setUp();
        this.sprite.play();
    }

    setUp() {
        this.sprite.scale.set(2);
        this.mirror ? this.sprite.scale.set(-2, 2) : null;
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;

        this.sprite.x = this.xPos;
        this.sprite.y = this.yPos;

        this.health = 100;

        this.movement = {
            left: false,
            right: false,
            jump: false,
            down: false,
            attack: false,
            attackPressed: false,
            lastKey: null
        };

        this.isIdle = true;
        this.isLeft = true;
        this.isRight = true;
        this.isJump = true;
        this.isAttack = true;
        this.isHurt = true;
        this.isDead = true;
        this.inAir = false;
        this.isJumping = false;
        this.isAttacking = false;
    }

    idle(person) {
        if (this.isIdle) {
            this.isIdle = false;

            this.sprite.textures = this.gameLoader.textures.animations[`${person}-idle`];
            this.sprite.animationSpeed = 0.1;
            this.sprite.loop = true;
            this.sprite.play();
        }
    }

    moveLeft(person, type = 'run') {
        if (this.left <= 0 && type === 'run') {
            this.idle(person);
        } else if (this.left <= 0 && type === 'jump') {
            this.jumpAnimate(person);
        } else {
            if (type === 'run' && this.isAttacking != true) {
                if (!this.inAir) {
                    this.moveLeftAnimate(person)
                    this.sprite.x -= 5;
                } else if (this.inAir) {
                    this.sprite.x -= 5;
                }
            }
            if (type === 'jump') {
                this.jumpAnimate(person);
                this.sprite.x -= 5;
            }
        }
        this.sprite.scale.set(-2, 2);
    }

    moveLeftAnimate(person) {
        if (this.isLeft) {
            this.isLeft = false;
            this.isIdle = true;
            this.isRight = true;
            this.isAttacking = false;

            this.sprite.textures = this.gameLoader.textures.animations[`${person}-run`];
            this.sprite.loop = true;
            this.sprite.play();
        }
    }

    moveRight(person, type = 'run') {
        if (this.right >= window.innerWidth && type === 'run') {
            this.idle(person);
        } else if (this.right >= window.innerWidth && type === 'jump') {
            this.jumpAnimate(person);
        } else {
            if (type === 'run' && this.isAttacking != true) {
                if (!this.inAir) {
                    this.moveRightAnimate(person)
                    this.sprite.x += 5;
                } else if (this.inAir) {
                    this.sprite.x += 5;
                }
            }
            if (type === 'jump') {
                this.jumpAnimate(person);
                this.sprite.x += 5;
            }
        }

        this.sprite.scale.set(2);
    }

    moveRightAnimate(person) {
        if (this.isRight) {
            this.isRight = false;
            this.isIdle = true;
            this.isLeft = true;
            this.isAttacking = false;

            this.sprite.textures = this.gameLoader.textures.animations[`${person}-run`];
            this.sprite.loop = true;
            this.sprite.play();
        }
    }

    attack(person) {
        if (this.isAttack && !this.isAttacking) {
            this.isAttack = false;
            this.isAttacking = true;
            this.movement.attackPressed = false;
            this.attackRegistered = false;

            this.sprite.textures = this.gameLoader.textures.animations[`${person}-attack`];
            this.sprite.animationSpeed = 0.25;
            this.sprite.loop = false;
            this.sprite.play();

            this.sprite.onComplete = () => {
                this.isAttacking = false;
                this.attackRegistered = false;
                this.isIdle = true;
                this.isRight = true;
                this.isLeft = true;
                this.isIdle = true;
                this.isHurt = true;

                if (this.movement.left && this.isAttack != false) {
                    this.moveLeft(person, 'run');
                } else if (this.movement.right && this.isAttack != false) {
                    this.moveRight(person, 'run');
                } else {
                    this.idle(person);
                }
            };
        }
    }

    jump(person) {
        const jumpHeight = window.innerHeight / 3;
        if (!this.isJumpingPhys) {
            this.isJumpingPhys = true;
            this.velocity = -Math.sqrt(2 * this.gravity * jumpHeight);
            this.jumpAnimate(person);
        }
    }

    jumpAnimate(person) {
        if (this.isJump) {
            this.isJump = false;

            this.sprite.textures = this.gameLoader.textures.animations[`${person}-jump`];
            this.sprite.animationSpeed = 0.09;
            this.sprite.loop = true;
            this.sprite.play();
        }
    }

    hurtAnimate(person) {
        if (this.isHurt) {
            this.isHurt = false;

            this.sprite.textures = this.gameLoader.textures.animations[`${person}-hurt`];
            this.sprite.animationSpeed = 0.1;
            this.sprite.loop = false;
            this.sprite.play();

            this.sprite.onComplete = () => {
                this.isIdle = true;
                this.isLeft = true;
                this.isRight = true;
                this.isJump = true;
                this.isAttack = true;
                this.isHurt = true;

                this.inAir ? this.jumpAnimate(person) : this.idle(person);
            };
        }
    }

    deadAnimate(person) {
        if (this.isDead) {
            this.isDead = false;

            this.sprite.textures = this.gameLoader.textures.animations[`${person}-dead`];
            this.sprite.loop = false;
            this.sprite.play();
            this.sprite.onComplete = () => {
                this.sprite.stop()
            }
        }
    }

    update() {
        if (this.isAttacking && this.sprite.currentFrame >= 4 && this.sprite.currentFrame <= 4 && !this.attackRegistered) {
            this.movement.attackPressed = true;
            this.attackRegistered = true;
        } else {
            this.movement.attackPressed = false;
        }

        if (!this.isJumpingPhys) {
            this.sprite.y = window.innerHeight / 1.3 - this.sprite.height;
        } else {
            this.sprite.y += this.velocity;

            if (this.bottom >= window.innerHeight / 1.3) {
                this.sprite.y = window.innerHeight / 1.3 - this.sprite.height;
                this.velocity = 0;
                this.isJumpingPhys = false;

                this.isIdle = true;
                this.isLeft = true;
                this.isRight = true;
                this.isJump = true;
                this.isAttack = true;
                this.isHurt = true;
                this.isDead = true;
                this.inAir = false;
                this.isJumping = false;
                this.isAttacking = false;
            } else {
                this.velocity += this.gravity;
                this.inAir = true;
            }
        }

        this.left <= 0 ? this.sprite.x = this.sprite.width / 2 : null;
        this.right >= window.innerWidth ? this.sprite.x = window.innerWidth - this.sprite.width / 2 : null;
        this.top <= 0 ? this.sprite.y = 0 : null;
    }
}