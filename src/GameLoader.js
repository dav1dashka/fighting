import { Assets } from "pixi.js";

export class GameLoader {
    constructor() {
        this.textures;
    }
    async preload() {
        const sheet = await Assets.load('/spritesheet.json');
        this.textures = sheet;
    }
}