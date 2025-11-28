import { Turret } from './Turret';
export class Tank {
    constructor(scene, id, x, y,color) {
        this.id = id;
        this.scene = scene;
        this.dirX = 0;
        this.dirY = 0;
        this.baseSpeed = 100;
        this.speedMultiplier = 1;
        this.x=x;
        this.y=y;
        this.color=color;
        this.target=null;//donde apunta
        this.vidas = 5;
        this.invulnerable = false;

        if(this.color==="Red"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseRed');
            this.sprite.setSize(40,35);
        }
        if(this.color==="Green"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseGreen');
            this.sprite.setSize(42,35);
        }
        if(this.color==="Blue"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseBlue');
            this.sprite.setSize(45,35);
        }
        if(this.color==="Yellow"){
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseYellow');
            this.sprite.setSize(45,35);
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
    
receiveDamage(amount) {       
        if (this.invulnerable) return;       
        this.vidas -= amount;      
        this.scene.actualizarVidas(this.id, this.vidas);   
        if (this.vidas <= 0) {          
        this.destroy();        
    } 
else {            
    this.makeInvulnerable();        
}    
}
    
makeInvulnerable() {
    this.invulnerable = true;
    let blinkCount = 0;
    this.scene.time.addEvent({
        delay: 100,
        repeat: 9,
        callback: () => {
            this.sprite.setAlpha(this.sprite.alpha === 1 ? 0.3 : 1);
            blinkCount++;
            if (blinkCount >= 9) {
                this.sprite.setAlpha(1); 
                this.invulnerable = false; 
            }
        }
    });
}

destroy() {
        this.sprite.destroy();
        this.turret.destroy();
}
}