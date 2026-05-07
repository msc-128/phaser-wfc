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

function preload ()
{
    this.load.image('temp', './PNG/mapTile_001.png')
    this.load.image('water', './PNG/mapTile_188.png')
}

function create ()
{
    for(let x  = 1; x <= 20; x++){
        for(let y = 1; y <= 15; y++){
            this.add.image((x * 64) - 32, (y * 64) - 32, 'water')
        }
    }
    

}

function update ()
{
}