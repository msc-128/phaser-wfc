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
let grassTiles = []

function preload ()
{
    for(let i = 0; i <= 12; i++){
        const name = `grass${i}`;
        grassTiles.push(name);
        this.load.image(name, `./PNG/grass_tiles/grass${i}.png`);
    }

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
        this.add.image((x * 64) + 32, 96, grassTiles[index])
        index++;
    }

}

function update ()
{
}