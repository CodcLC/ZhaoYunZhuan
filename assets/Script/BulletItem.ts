import BulletMgr from "./BulletMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletItem extends cc.Component {
    using: boolean;
    direct: number;
    sp: number;
    life: number;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(index: number){
        //pos dir sf life ?sp
        this.direct = this.node.scaleX > 0 ? 1 : -1;
        this.sp = 1000;
        this.life = 3;
        this.use();

        cc.director.on('GameStart', this.unuse, this);
    }

    start () {
        // this.init();
    }

    use(){
        this.using = true;
        this.life = 3;
        this.node.opacity = 255;
    }

    unuse(){
        this.life = 0;
        this.using = false;
        // cc.log('非自然',this.node.x);
        // BulletMgr.instance.put(this.node);
        if(BulletMgr.instance.bulletPool)
        BulletMgr.instance.bulletPool.put(this.node);
    }

    update (dt) {
        // if(!Global.getInstance().inGame) return;
        if(this.using && this.life > 0){
            let v: number = 300 + this.sp / 2.4 * this.life
            this.node.x += this.direct * dt * v;
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
