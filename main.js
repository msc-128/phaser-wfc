const TILE_SIZE = 64;
const GRID_COLS = 20;
const GRID_ROWS = 15;

var config = {
    type: Phaser.AUTO,
    width: GRID_COLS * TILE_SIZE,
    height: GRID_ROWS * TILE_SIZE,
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
            if (this.resolvedGrid[x][y]) continue;
            let options = this.grid[x][y].length;
            if(options > 0 && options < min){
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
    let totalWeight = 0;
    for(let tile of options){
        totalWeight += this.weights[tile] || 1;
    }
    let rand = Math.random() * totalWeight;
    let chosen = options[0];
    for(let tile of options){
        rand -= this.weights[tile] || 1;
        if(rand <= 0){
            chosen = tile;
            break;
        }
    }
    console.log(chosen);
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
            let index = parseInt(options);
            return rules[n.dir].includes(index);
        })
    }
}

function decorate(){
    for(let x = 0; x < GRID_COLS; x++) {
        for(let y = 0; y < GRID_ROWS; y++) {
            console.log(this.grid[x][y][0]);
            if (this.grid[x][y][0] != 16 && this.grid[x][y][0] != 15 &&
                this.grid[x][y][0] != 14 && this.grid[x][y][0] != 13 &&
                this.grid[x][y][0] != 12 && this.grid[x][y][0] != 11 &&
                this.grid[x][y][0] != 10) {
                let r = Math.random();
                let decorX = ((x+1) * TILE_SIZE) - TILE_SIZE/2;
                let decorY = ((y+1) * TILE_SIZE) - TILE_SIZE/2;
                if (r < 0.6) {
                    continue;
                } else if (r < 0.7) {
                    this.add.image(decorX, decorY, `${terrain}_dec0`)
                } else if (r < 0.8) {
                    this.add.image(decorX, decorY, `${terrain}_dec1`)
                } else if (r < 0.9) {
                    this.add.image(decorX, decorY, `${terrain}_dec2`)
                } else {
                    this.add.image(decorX, decorY, `${terrain}_dec3`)
                }
            }
        }
    }
}

function step(){
    if (this.isDone) {return};
    let pos = getLowestEntropy.call(this);
    if(!pos){
        console.log("done!");
        this.isDone = true;
        this.wfcTimer.remove();
        decorate.call(this);
        return;
    }
    let [x, y] = pos;
    let tile = collapse.call(this, x, y);
    propagate.call(this, x, y);
    this.resolvedGrid[x][y] = true;
    this.add.image((x * TILE_SIZE) + TILE_SIZE/2, (y * TILE_SIZE) + TILE_SIZE/2, `${terrain}${tile}`);
    if (this.grid[x][y].length === 0) {
    console.error("Contradiction at", x, y);
    this.scene.restart();
    }
}

var game = new Phaser.Game(config);
let grassTextures = [];
let dirtTextures = [];
let rockyTextures = [];
let sandTextures = [];
let snowyTextures = [];
let decorGrassTextures = [];
let decorDirtTextures = [];
let decorRockyTextures = [];
let decorSandTextures = [];
let decorSnowyTextures = [];
let terrain = Phaser.Utils.Array.GetRandom(["grass", "dirt", "rocky", "sand", "snowy"]);

function preload ()
{
    // Loading grass tiles
    this.grassTiles = []
    for(let i = 0; i <= 16; i++){
        const name = `grass${i}`;
        grassTextures.push(name);
        this.load.image(name, `./PNG/grass_tiles/grass${i}.png`);
    }
    // Loading dirt tiles
    this.dirtTiles = []
    for(let i = 0; i <= 16; i++){
        const name = `dirt${i}`;
        dirtTextures.push(name);
        this.load.image(name, `./PNG/dirt_tiles/dirt${i}.png`);
    }
    // Loading rocky tiles
    this.rockyTiles = []
    for(let i = 0; i <= 16; i++){
        const name = `rocky${i}`;
        rockyTextures.push(name);
        this.load.image(name, `./PNG/rocky_tiles/rocky${i}.png`);
    }
    // Loading sand tiles
    this.sandTiles = []
    for(let i = 0; i <= 16; i++){
        const name = `sand${i}`;
        sandTextures.push(name);
        this.load.image(name, `./PNG/sand_tiles/sand${i}.png`);
    }
    // Loading snowy tiles
    this.snowyTiles = []
    for(let i = 0; i <= 16; i++){
        const name = `snowy${i}`;
        snowyTextures.push(name);
        this.load.image(name, `./PNG/snowy_tiles/snowy${i}.png`);
    }

    // Loading decor
    this.decorGrass = [];
    for (let i = 0; i <= 3; i++) {
        const name = `grass_dec${i}`;
        decorGrassTextures.push(name);
        this.load.image(name, `./PNG/decor_grass/dec${i}.png`);
    }
    this.decorDirt = [];
    for (let i = 0; i <= 3; i++) {
        const name = `dirt_dec${i}`;
        decorDirtTextures.push(name);
        this.load.image(name, `./PNG/decor_dirt/dec${i}.png`);
    }
    this.decorRocky = [];
    for (let i = 0; i <= 3; i++) {
        const name = `rocky_dec${i}`;
        decorRockyTextures.push(name);
        this.load.image(name, `./PNG/decor_rocky/dec${i}.png`);
    }
    this.decorSand = [];
    for (let i = 0; i <= 3; i++) {
        const name = `sand_dec${i}`;
        decorSandTextures.push(name);
        this.load.image(name, `./PNG/decor_sand/dec${i}.png`);
    }
    this.decorSnowy = [];
    for (let i = 0; i <= 3; i++) {
        const name = `snowy_dec${i}`;
        decorSnowyTextures.push(name);
        this.load.image(name, `./PNG/decor_snowy/dec${i}.png`);
    }
    // Load water
    this.load.image('water', './PNG/water3.png')
}

function create ()
{
    // Grid data
    this.cols = GRID_COLS;
    this.rows = GRID_ROWS;
    this.grid = [];
    this.resolvedGrid = [];

    // Rules
    this.sockets = {
        0:  { up: "AA", right: "AA", down: "BA", left: "AB" },
        1:  { up: "BB", right: "BA", down: "BA", left: "BB" },
        2:  { up: "BB", right: "BA", down: "AA", left: "BA" },
        3:  { up: "BB", right: "BB", down: "AB", left: "BA" },
        4:  { up: "AA", right: "AB", down: "AB", left: "AA" },
        5:  { up: "BA", right: "AA", down: "BA", left: "BB" },
        6:  { up: "AA", right: "AA", down: "AA", left: "AA" },
        7:  { up: "AB", right: "BB", down: "AB", left: "AA" },
        8:  { up: "AB", right: "BA", down: "AA", left: "AA" },
        9:  { up: "BA", right: "AA", down: "AA", left: "BA" },
        10: { up: "BA", right: "AB", down: "BB", left: "BB" },
        11: { up: "AA", right: "AB", down: "BB", left: "AB" },
        12: { up: "AB", right: "BB", down: "BB", left: "AB" },
        13: { up: "BA", right: "AB", down: "BB", left: "BB" },
        14: { up: "AA", right: "AB", down: "BB", left: "AB" },
        15: { up: "AB", right: "BB", down: "BB", left: "AB" },
        16: { up: "BB", right: "BB", down: "BB", left: "BB" }
    };

    this.weights = {
        0: 3,
        1: 3,
        2: 8,
        3: 3,
        4: 3,
        5: 8,
        6: 50,
        7: 8,
        8: 3,
        9: 3,
        10: 3,
        11: 8,
        12: 3,
        13: 3,
        14: 8,
        15: 3,
        16: 150,
    };

    this.rules = {};
    const tileKeys = Object.keys(this.sockets);

    for (let key of tileKeys) {
        this.rules[key] = { up: [], right: [], left: [], down: [] };
    }

    for (let t1 of tileKeys) {
        for (let t2 of tileKeys) {
        
            let index2 = parseInt(t2);

           // If Tile 1's UP socket matches Tile 2's DOWN socket
            if (this.sockets[t1].up === this.sockets[t2].down) {
                this.rules[t1].up.push(index2);
            }
            
            // If Tile 1's RIGHT socket matches Tile 2's LEFT socket
            if (this.sockets[t1].right === this.sockets[t2].left) {
                this.rules[t1].right.push(index2);
            }
        
            // If Tile 1's DOWN socket matches Tile 2's UP socket
            if (this.sockets[t1].down === this.sockets[t2].up) {
                this.rules[t1].down.push(index2);
            }
            
            // If Tile 1's LEFT socket matches Tile 2's RIGHT socket
            if (this.sockets[t1].left === this.sockets[t2].right) {
                this.rules[t1].left.push(index2);
            }
        }
    }

    // Fill grid with all possible tile options
    for(let x = 0; x < this.cols; x++){
        this.grid[x] = [];
        this.resolvedGrid[x] = [];
        for(let y = 0; y < this.rows; y++){
            this.grid[x][y] = Object.keys(this.rules)
            this.resolvedGrid[x][y] = false;
        }
    }
    
    // Fill entire grid with water
    for(let x = 1; x <= GRID_COLS; x++){
        for(let y = 1; y <= GRID_ROWS; y++){
            this.add.image((x * TILE_SIZE) - TILE_SIZE/2, (y * TILE_SIZE) - TILE_SIZE/2, 'water')
        }
    }
   
    this.regenKey = this.input.keyboard.addKey('R')
    this.wfcTimer = this.time.addEvent({
        delay: 5,
        loop: true,
        callback: step,
        callbackScope: this
    })
}

function update ()
{
    if(Phaser.Input.Keyboard.JustDown(this.regenKey)){
        terrain = Phaser.Utils.Array.GetRandom(["grass", "dirt", "rocky", "sand", "snowy"]);
        this.isDone = false;
        this.scene.restart();
    }
}