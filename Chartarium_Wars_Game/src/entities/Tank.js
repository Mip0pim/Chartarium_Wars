import { Turret } from './Turret';
export class Tank {
    constructor(scene, id, x, y,color) {
        this.id = id;
        this.scene = scene;
        this.lives = 5;
        this.dirX = 0;
        this.dirY = 0;
        this.baseSpeed = 200;
        this.speedMultiplier = 1;
        this.x=x;
        this.y=y;
        this.color=color;
        this.target=null;//donde apunta

        

        if(this.color==="red"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseRoja');
        }
        if(this.color==="green"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseVerde');
        }
        if(this.color==="blue"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseAzul');
        }
        if(this.color==="yellow"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseAmarilla');
        }
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;
        this.sprite.setDepth(8);
        this.turret = new Turret(scene,this,x ,y,this.color );

        this.GetX = ()=>{return this.sprite.x;};
        this.GetY = ()=>{return this.sprite.y;};
    }

    SetTarget(tar){
        this.target=tar;
        this.turret.setTarget(this.target);
    }
    
}