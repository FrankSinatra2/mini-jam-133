import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import TilemapKeys from "../consts/TilemapKeys";
import SoundKeys from "../consts/SoundKeys";
import SpriteKeys from "../consts/SpriteKeys";

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
        this.load.image(TextureKeys.TestCollision, 'inca_back2.png');
        this.load.image(TextureKeys.DebugTileset, 'assets/tilesets/debug-tileset.png');
        this.load.image(TextureKeys.LayerHighlight, 'assets/highlight.png');
        this.load.tilemapTiledJSON(TilemapKeys.TestMap, 'testMap1.json');
        this.load.tilemapTiledJSON(TilemapKeys.TestCollisionMap, 'testCollisionMap.json');
        this.load.tilemapTiledJSON(TilemapKeys.DebugMap, 'assets/tilemaps/debug-map.json');
        
        // audio
        this.load.audio(SoundKeys.Bgm, ["assets/audio/bgm.mp3"]);
        this.load.audio(SoundKeys.Walking, ["assets/audio/squidwardWalk.mp3"]);
        this.load.audio(SoundKeys.Jump, ["assets/audio/jump.mp3"]);
        this.load.audio(SoundKeys.Win, ["assets/audio/win.mp3"]);
    
        // sprites
        this.load.image(TextureKeys.Flag, ["assets/sprites/flag.png"]);
    }

    create(): void {
        this.anims.createFromAseprite(TextureKeys.Character);

        this.scene.start(SceneKeys.Game);
    }
}
