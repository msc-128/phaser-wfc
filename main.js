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

function getLowestEntropy(){
    let min = Infinity;
    let valid = [];
    
    for(let x = 0; x < this.cols; x++){
        for(let y = 0; y < this.rows; y++){
            let options = this.grid[x][y].length;
            if(options > 1 && options < min){
                min = options;
                valid = [[x, y]];
            }
            else if(options === min){
                valid.push([x, y]);
            }
        }
    }
    if(valid.length === 0) return null;
    return Phaser.Utils.Array.GetRandom(valid);
}

function collapse(x, y){
    let options = this.grid[x][y];
    let chosen = Phaser.Utils.Array.GetRandom(options);
    this.grid[x][y] = [chosen];
    return chosen;
}

function propagate(x, y){
    let tile = this.grid[x][y][0];
    let rules = this.rules[tile];

    let neighbors = [
        { dx: 0, dy: -1, dir: "up" },
        { dx: 1, dy: 0, dir: "right" },
        { dx: -1, dy: 0, dir: "left" },
        { dx: 0, dy: 1, dir: "down" }
    ];

    for(let n of neighbors){
        let nx = x + n.dx;
        let ny = y + n.dy;

        if(!this.grid[nx]?.[ny]) continue;

        this.grid[nx][ny] = this.grid[nx][ny].filter(options => {
            let index = parseInt(options.replace("grass", ""));
            return rules[n.dir].includes(index);
        })
    }
}

function step(){
    let pos = getLowestEntropy.call(this);
    if(!pos){
        console.log("done!");
        return;
    }
    let [x, y] = pos;
    let tile = collapse.call(this, x, y);
    propagate.call(this, x, y);
    this.add.image((x * 64) + 32, (y * 64) + 32, tile);
    if (this.grid[x][y].length === 0) {
    console.error("Contradiction at", x, y);
    this.scene.restart();
}
}

var game = new Phaser.Game(config);
let grassTextures = []; // store grass

function preload ()
{
    // Loading grass tiles
    this.grassTiles = []
    for(let i = 0; i <= 16; i++){
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

    // Rules
    this.rules = { // UP RIGHT LEFT DOWN
        // numbers correlate to the ith grass tile
        // 16 is the empty tile
        grass0: {
            up: [2,6,8,9],
            right: [4,6,7,8],
            left: [4],
            down: [9]
        },
        grass1: {
            up: [16],
            right: [16],
            left: [3,7],
            down: [5,13,10]
        },
        grass2: {
            up: [16],
            right: [2,3],
            left: [2,1],
            down: [0,6,4,14,11]
        },
        grass3: {
            up: [16],
            right: [16],
            left: [1,2],
            down: [7,12,15]
        },
        grass4: {
            up: [2,6,8,9],
            right: [0],
            left: [0,5,6,9],
            down: [8]
        },
        grass5: {
            up: [1,5],
            right: [4,6,7,8],
            left: [16],
            down: [5,10,13]
        },
        grass6: {
            up: [2,6,8,9],
            right: [4,6,7,8],
            left: [0,5,6,9],
            down: [0,4,6,11,14]
        },
        grass7: {
            up: [3,7],
            right: [16],
            left: [0,5,6,9],
            down: [7,12,15]
        },
        grass8: {
            up: [4],
            right: [9],
            left: [0,5,6,9],
            down: [0,4,6,11,14]
        },
        grass9: {
            up: [0],
            right: [4,6,7,8],
            left: [8],
            down: [0,4,6,11,14]
        },
        grass10: {
            up: [1,5],
            right: [11,12],
            left: [16],
            down: [16]
        },
        grass11: {
            up: [2,6,8,9],
            right: [11,12],
            left: [10,11],
            down: [16]
        },
        grass12: {
            up: [3,7],
            right: [16],
            left: [10,11],
            down: [16]
        },
        grass13: {
            up: [1,5],
            right: [14, 15],
            left: [16],
            down: [16]
        },
        grass14: {
            up: [2,6,8,9],
            right: [14,15],
            left: [13,14],
            down: [16]
        },
        grass15: {
            up: [3,7],
            right: [16],
            left: [13,14],
            down: [16]
        },
        grass16: {
            up: [10,11,12,13,14,15,16],
            right: [1,5,10,13,16],
            left: [3,7,12,15,16],
            down: [1,2,3,16]
        }
    }
    // Fill grid with all possible tile options
    for(let x = 0; x < this.cols; x++){
        this.grid[x] = [];
        for(let y = 0; y < this.rows; y++){
            this.grid[x][y] = Object.keys(this.rules)
        }
    }
    
    // Fill entire grid with water
    for(let x = 1; x <= 20; x++){
        for(let y = 1; y <= 15; y++){
            this.add.image((x * 64) - 32, (y * 64) - 32, 'water')
        }
    }
   
    this.regenKey = this.input.keyboard.addKey('R')
    this.time.addEvent({
        delay: 50,
        loop: true,
        callback: step,
        callbackScope: this
    })
}

function update ()
{
    if(Phaser.Input.Keyboard.JustDown(this.regenKey)){
        this.scene.restart();
    }
}