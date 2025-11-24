import { Turret } from './Turret';
export class Tank {
    constructor(scene, id, x, y,color) {
        this.id = id;
        this.scene = scene;
        this.lives = 5;
        this.dirX = 0;
        this.dirY = 0;
        this.baseSpeed = 100;
        this.speedMultiplier = 1;
        this.x=x;
        this.y=y;
        this.color=color;
        this.target=null;//donde apunta
        this.vidas = 3;
        

        if(this.color==="Red"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseRed');
        }
        if(this.color==="Green"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseGreen');
        }
        if(this.color==="Blue"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseBlue');
        }
        if(this.color==="Yellow"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseYellow');
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