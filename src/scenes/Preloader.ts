import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import TilemapKeys from "../consts/TilemapKeys";
import SoundKeys from "../consts/SoundKeys";

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
        this.load.tilemapTiledJSON(TilemapKeys.Map1, 'assets/tilemaps/map1.json');
        
        // audio
        this.load.audio(SoundKeys.Bgm, ["assets/audio/bgm.mp3"]);
        this.load.audio(SoundKeys.Walking, ["assets/audio/squidwardWalk.mp3"]);
        this.load.audio(SoundKeys.Jump, ["assets/audio/jump.mp3"]);
        this.load.audio(SoundKeys.Win, ["assets/audio/win.mp3"]);

        this.load.audio(SoundKeys.TileClick1, 'assets/audio/tileclick/click-1.ogg');
        this.load.audio(SoundKeys.TileClick2, 'assets/audio/tileclick/click-2.ogg');
        this.load.audio(SoundKeys.TileClick3, 'assets/audio/tileclick/click-3.ogg');
        this.load.audio(SoundKeys.TileClick4, 'assets/audio/tileclick/click-4.ogg');
        this.load.audio(SoundKeys.TileClick5, 'assets/audio/tileclick/click-5.ogg');
        this.load.audio(SoundKeys.TileClick6, 'assets/audio/tileclick/click-6.ogg');

        this.load.audio(SoundKeys.TileMoveLower, 'assets/audio/tilemove/lower.ogg');
        this.load.audio(SoundKeys.TileMoveStandard, 'assets/audio/tilemove/standard.ogg');
        this.load.audio(SoundKeys.TileMoveHigher, 'assets/audio/tilemove/higher.ogg');
        // sprites
        this.load.image(TextureKeys.Flag, ["assets/sprites/flag.png"]);
    }

    create(): void {
        this.anims.createFromAseprite(TextureKeys.Character);

        this.scene.start(SceneKeys.Game);
    }
}
