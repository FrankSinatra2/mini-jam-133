import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Preloader);
    }
   
    preload(): void {
        this.load.aseprite({
            key: TextureKeys.Character,
            textureURL: 'assets/character/character.png',
            atlasURL: 'assets/character/character.json'
        });
    }

    create(): void {
        this.anims.createFromAseprite(TextureKeys.Character);

        this.scene.start(SceneKeys.Game);
    }
}
