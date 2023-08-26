import BulletMgr from "../BulletMgr";
import Hero from "../Hero/Hero";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterBulletItem extends cc.Component {
    using: boolean;
    direct: number;
    sp: number;
    life: number;
    index: number;
    lastAngle: number;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(index: number){
        //pos dir sf life ?sp
        this.index = index;
        this.direct = this.node.scaleX > 0 ? 1 : -1;
        this.sp = 500;
        this.life = 3;
        this.use();

        cc.director.on('GameStart', this.unuse, this);
    }

    start () {
        // this.init();
    }

    use(){
        // if(this.index == 2){
        //     // let dis: cc.Vec2 = Hero.instance.node.position.sub(this.node.position).normalize();
        //     // let degree = Math.atan2(dis.y, dis.x);
        //     // let an = degree / Math.PI * 180;
        //     let angle: number = 20;
        //     this.node.angle = angle;
        //     this.lastAngle = angle;
        // }else{
            this.node.angle = 0;
        // }
        this.using = true;
        this.life = 3;
        this.node.opacity = 255;
    }

    unuse(){
        if(!this.node) return;
        this.life = 0;
        this.using = false;
        BulletMgr.instance.monsterbulletPool.put(this.node);
    }

    update (dt) {

        // if(!Global.getInstance().inGame) return;


        // 暂时不用跟踪箭
        // if(this.index == 3){
            if(this.using && this.life > 0){
                // let v: number = 300 + this.sp / 2.4 * this.life;
                let v: number = 600;
                this.node.x += this.direct * dt * v;
                this.life -= dt;
                if(this.life <= 0){
                    // cc.log('自然');
                    this.unuse();
                }
            }
        // }else{
        //     this.updateFollow(dt);
        // }
        
    }

    updateFollow(dt: number){
        if(this.using && this.life > 0){
            // let dis: cc.Vec2 = Hero.instance.node.position.sub(this.node.position).normalize();
            // let xx: number = 1000 * dis.x;
            // let yy: number = 400;

            // this.node.x += xx * dt;
            // this.node.y -= yy * dt;

            // // let r: number = Math.atan2(dis.y, dis.x);
            // // let degree: number = r * 180 / Math.PI;
            // // degree = 360 - degree + 90;
            // // this.node.angle = degree;
            // // cc.log('degree',-degree);
            // this.node.angle -= 2;
            // cc.log('degree',)


            let dis: cc.Vec2 = cc.v2(Hero.instance.node.x, Hero.instance.node.y + 100).sub(this.node.position).normalize();

            if(this.node.scaleX > 0){
                var curAngle: number = Math.atan2(dis.y,dis.x) / Math.PI * 180;
                if(curAngle < this.lastAngle){
                    this.node.angle -= 1;
                }
                this.node.x += Math.cos(this.node.angle / 180 * Math.PI) * dt * 600;
                this.node.y += Math.sin(this.node.angle / 180 * Math.PI) * dt * 400;
            }else{
                var curAngle: number = Math.atan2(dis.y,dis.x) / Math.PI * 180 - 180;
                if(curAngle > this.lastAngle){
                    this.node.angle += 2;
                }
                this.node.x -= Math.cos(this.node.angle / 180 * Math.PI) * dt * 600;
                this.node.y -= Math.sin(this.node.angle / 180 * Math.PI) * dt * 400;
            }
            

            let angle: number = this.node.angle / 180 * Math.PI;
            

            
            // this.node.angle = curAngle / Math.PI * 180;
            // cc.log('degree', curAngle);
            // let angle2: number = this
            
            this.lastAngle = curAngle;
            // cc.log(this.node.angle);


            // if(this.node.angle > -50){
                // this.node.angle -= 1.2;
            // }

            if(this.node.angle > 90){
                this.unuse();
            }

            if(this.node.angle < -90){
                this.unuse();
            }

            this.life -= dt;
            if(this.life <= 0){
                // cc.log('自然');
                this.unuse();
            }

        }
    }

    onDestroy(){
        cc.director.off('GameStart', this.unuse, this);
    }
}
