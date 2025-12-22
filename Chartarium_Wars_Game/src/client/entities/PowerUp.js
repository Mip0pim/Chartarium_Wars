

export class PowerUp {
    constructor(scene, x, y, type, generator) {
        this.scene = scene;
        this.generator = generator;
        this.x = x;
        this.y = y;
        this.type = type; 
        if (type==='Heal')
            this.sprite = this.scene.physics.add.sprite(x, y, 'Vida').setScale(0.05);//cambiar cuando se tengan
        if (type==='Speed')
            this.sprite = this.scene.physics.add.sprite(x, y, 'Bubble');//cambiar cuando se tengan
        if (type==='Shield')
            this.sprite = this.scene.physics.add.sprite(x, y, 'BaseBlue');//cambiar cuando se tengan
        this.sprite.setDepth(1);
        this.createCollistions();
    }


    aplyPowerUp(tank, type){
        switch(type){
            case 'Heal':
                if (tank.vidas<5){
                    tank.vidas+=1;
                    this.scene.actualizarVidas(tank.id, tank.vidas);
                }
                break;
            case 'Speed':
                tank.speedMultiplier=1.5;    
                this.scene.time.delayedCall(5000, () => {
                    tank.speedMultiplier=1;
                }, [], this);
                break;  
            case 'Shield':
                tank.invulnerable = true;    
                this.scene.time.delayedCall(5000, () => {
                    tank.invulnerable = false;
                }, [], this);
                break;  
        }

    }


    createCollistions(){
        this.scene.players.forEach(tank => {
            this.scene.physics.add.collider(this.sprite, tank.sprite, () => {
                this.aplyPowerUp(tank, this.type);//se podria pasar el otro tanque para cosas negativas
                this.sprite.destroy();
                this.generator.maxPowerUps-=1;
            });
        });
    }
} 
   