import Global from "../nativets/Global";
import Hero from "./Hero";
import RewardMgr from "../Reward/RewardMgr";
import AudioMgr from "../Audio";

const {ccclass, property} = cc._decorator;
const BASE_SCALEX: number = .56;

@ccclass
export default class HeroPet extends cc.Component {
    static instance: HeroPet = null;
    updateCount: number = 0;
    lastX: number;
    petSk: sp.Skeleton;
    move: number = 0;
    speed: number = 500;
    followDistance: number = 170;

    // LIFE-CYCLE CALLBACKS:

    init(){
        HeroPet.instance = this;
        this.petSk = this.node.getComponent(sp.Skeleton);
        this.petSk.setCompleteListener(()=>{
            if(this.petSk.animation == 'claim'){
                this.petSk.setAnimation(0, 'fly', true);
            }
        });
    }

    pickup(){
        AudioMgr.instance.playAudio('GetCoins');
        Hero.instance.showCoins(1);
        this.petSk.setAnimation(0, 'claim', false);
    }

    onLoad () {
        this.init();
    }

    start () {

    }

    getCloseCoin(){
        let close: number = 9000;
        let index: number = -1;
        for (let i = 0; i < RewardMgr.instance.unColleted.length; i++) {
            let c: cc.Node = RewardMgr.instance.unColleted[i];
            let dis: number = this.getDistance(c);
            if(dis < close){
                close = dis;
                index = i;
            }
        }
        if(-1 != index){
            // cc.log(RewardMgr.instance.unColleted);
            return RewardMgr.instance.unColleted[index];
        }else{
            return null;
        }
    }

    getDistance(n: cc.Node):number{
        return Math.abs(this.node.x - n.x);
    }

    petUpdate(){
        if(RewardMgr.instance.unColleted.length > 0){
            let c: cc.Node = this.getCloseCoin();
            if(c){
                if(this.node.x < c.x){
                    this.node.scaleX = BASE_SCALEX;
                }else{
                    this.node.scaleX = -BASE_SCALEX;
                }
    
                if(this.getDistance(c) > 10){
                    if(this.node.scaleX < 0){
                        this.move = -1;
                    }else{
                        this.move = 1;
                    }
                }else{
                    this.move = 0;
                }
            }
        }else{
            if(this.node.x < Hero.instance.node.x){
                this.node.scaleX = BASE_SCALEX;
            }else{
                this.node.scaleX = -BASE_SCALEX;
            }

            if(this.getDistance(Hero.instance.node) > this.followDistance){
                if(this.node.scaleX < 0){
                    this.move = -1;
                }else{
                    this.move = 1;
                }
            }else{
                this.move = 0;
            }
        }
    }

    emitEvent(isHero?: boolean){
        if(this.lastX == this.node.x && RewardMgr.instance.unColleted.length == 0){
            // cc.log('returnPet');
            return;
        }
        this.lastX = this.node.x;
        if(isHero){
            this.lastX = Hero.instance.node.x;
        }
        cc.director.emit('PetMove', this.lastX);
    }

    update (dt) {
        if(!Global.getInstance().inGame) return;
        if(!this.petSk.skeletonData){
            this.updateCount ++;
            if(this.updateCount == 10){
                this.updateCount = 0;
                this.emitEvent(true);
            }
            return;
        };
        this.petUpdate();
        this.updateCount ++;
        if(this.updateCount == 10){
            this.updateCount = 0;
            this.emitEvent();
        }

        // this.node.x = Hero.instance.node.x - 170;

        switch (this.move) {
            case -1:
                this.node.x -= this.speed * dt;
                break;
            case 1:
                this.node.x += this.speed * dt;
                break;
            
            default:
                break;
        }
    }
}
