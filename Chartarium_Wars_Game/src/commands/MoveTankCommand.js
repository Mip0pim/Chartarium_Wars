import { Command } from "./Command";

export class MoveTankCommand extends Command {

    constructor(tank, direction) {
        super();
        this.tank = tank;
        this.direction = direction; 
    
    }
    
    execute() {
        if (this.direction === 'up') {
            this.tank.sprite.setVelocityY(-this.tank.baseSpeed*this.tank.speedMultiplier);
            this.tank.turret.rotate();
            this.tank.turret.shoot(false);
        
        } else if (this.direction === 'down') {
            this.tank.sprite.setVelocityY(+this.tank.baseSpeed*this.tank.speedMultiplier);
            this.tank.turret.rotate();
            this.tank.turret.shoot(false);

            
        }else if (this.direction === 'right') {
            this.tank.sprite.setVelocityX(this.tank.baseSpeed*this.tank.speedMultiplier);
            this.tank.turret.rotate();
            this.tank.turret.shoot(false);

            
        }else if (this.direction === 'left') {
            this.tank.sprite.setVelocityX(-this.tank.baseSpeed*this.tank.speedMultiplier);
            this.tank.turret.rotate();
            this.tank.turret.shoot(false);

            
        } else {
            this.tank.sprite.setVelocityY(0);
            this.tank.sprite.setVelocityX(0);
            this.tank.turret.sprite.setVelocityY(0);
            this.tank.turret.sprite.setVelocityX(0);
            this.tank.turret.shoot(true); //hay qie limitarlo
        }
        this.tank.turret.SetPosition(this.tank.GetX(),this.tank.GetY());
        this.tank.turret.aim();
        if (this.tank.sprite.body) {
            const vx = this.tank.sprite.body.velocity.x;
            const vy = this.tank.sprite.body.velocity.y;

            // atan2 devuelve el ángulo en radianes según la dirección del vector
            this.tank.sprite.rotation = Math.atan2(vy, vx)+(Math.PI/2);
        }
    }


}