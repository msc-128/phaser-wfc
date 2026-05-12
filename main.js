var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 960,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
let grassTextures = []; // store grass

function preload ()
{
    this.grassTiles = []
    // Loading grass tiles
    for(let i = 0; i <= 12; i++){
        const name = `grass${i}`;
        grassTextures.push(name);
        this.load.image(name, `./PNG/grass_tiles/grass${i}.png`);
    }

    // Load water
    this.load.image('water', './PNG/water3.png')
}

function create ()
{
    // Fill entire grid with water
    for(let x = 1; x <= 20; x++){
        for(let y = 1; y <= 15; y++){
            this.add.image((x * 64) - 32, (y * 64) - 32, 'water')
        }
    }
    // Load grass sprites
    let index = 0
    for(let x = 1; x <= 13; x++){
        let tile = this.add.image((x * 64) + 32, 96, grassTextures[index])
        this.grassTiles.push(tile)
        index++;
    }
    this.regenKey = this.input.keyboard.addKey('R')
}

function update ()
{
    if(Phaser.Input.Keyboard.JustDown(this.regenKey)){
        for(let tile of this.grassTiles){
            tile.setPosition(Phaser.Math.Between(0, 1280), Phaser.Math.Between(0, 960)) // will alter to fit WFC later
        }
    }
}