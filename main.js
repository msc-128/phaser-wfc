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
    // Loading grass tiles
    this.grassTiles = []
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
    // Grid data
    this.cols = 20;
    this.rows = 15;
    this.grid = [];

    // Rules - im killing myself
    this.rules = { // UP RIGHT LEFT DOWN
        // empty means only connection is water
        // numbers correlate to the ith grass tile
        G0: {
            up: [2,6,8,9],
            right: [4,6,7,8],
            left: [4],
            down: [9]
        },
        G1: {
            up: [],
            right: [2,3],
            left: [],
            down: [5,13,10]
        },
        G2: {
            up: [],
            right: [2,3],
            left: [2,1],
            down: [0,6,4,14,11]
        },
        G3: {
            up: [],
            right: [],
            left: [1,2],
            down: [7,12,15]
        },
        G4: {
            up: [2,6,8,9],
            right: [0],
            left: [0,5,6,9],
            down: [8]
        },
        G5: {
            up: [1,5],
            right: [4,6,7,8],
            left: [],
            down: [5,10,13]
        },
        G6: {
            up: [2,6,8,9],
            right: [4,6,7,8],
            left: [0,5,6,9],
            down: [0,4,6,11,14]
        },
        G7: {
            up: [3,7],
            right: [],
            left: [0,5,6,9],
            down: [7,12,15]
        },
        G8: {
            up: [4],
            right: [9],
            left: [0,5,6,9],
            down: [0,4,6,11,14]
        },
        G9: {
            up: [0],
            right: [4,6,7,8],
            left: [8],
            down: [0,4,6,11,14]
        },
        G10: {
            up: [1,5],
            right: [11,12],
            left: [],
            down: []
        },
        G11: {
            up: [2,6,8,9],
            right: [11,12],
            left: [10,11],
            down: []
        },
        G12: {
            up: [3,7],
            right: [],
            left: [10,11],
            down: []
        },
        G13: {
            up: [1,5],
            right: [14, 15],
            left: [],
            down: []
        },
        G14: {
            up: [2,6,8,9],
            right: [14,15],
            left: [13,14],
            down: []
        },
        G15: {
            up: [3,7],
            right: [],
            left: [13,14],
            down: []
        }
    }

    for(let x = 0; x < this.cols; x++){
        this.grid[x] = [];
        for(let y = 0; y < this.rows; y++){
            this.grid[x][y] = grassTextures.slice()
        }
    }
    
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