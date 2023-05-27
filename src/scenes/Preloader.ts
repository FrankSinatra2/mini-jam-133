import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import TilemapKeys from "../consts/TilemapKeys";

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

        this.load.image(TextureKeys.IncaTilesetFront, 'inca_front.png');
        this.load.image(TextureKeys.IncaTilesetBack, 'inca_back2.png');
        this.load.image(TextureKeys.DebugTileset, 'assets/tilesets/debug-tileset.png');
        this.load.image(TextureKeys.LayerHighlight, 'assets/highlight.png');
        this.load.tilemapTiledJSON(TilemapKeys.TestMap, 'testMap1.json');
        this.load.tilemapTiledJSON(TilemapKeys.DebugMap, 'assets/tilemaps/debug-map.json');
    }

    create(): void {
        this.anims.createFromAseprite(TextureKeys.Character);

        this.scene.start(SceneKeys.Game);
    }
}
