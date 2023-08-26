import Global from "../nativets/Global";
import Hero from "../Hero/Hero";
import { MonsterATK } from "../nativets/Config";
import AudioMgr from "../Audio";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ArrowRain extends cc.Component {
    static instance: ArrowRain = null;

    attackSpace: number = 3;
    attackTime: number = .5;
    playing: boolean;
    hit: cc.Node;
    speedY: number;
    isStop: boolean;
    hitBox: cc.BoxCollider;
    warn: cc.Node;
    warnBg: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    init(){
        this.attackSpace = 3;
        this.hit = this.node.getChildByName('hit');
        this.hitBox = this.hit.getComponent(cc.BoxCollider);
        this.warn = this.node.getChildByName('warn');
        this.warnBg = this.node.getChildByName('warnBg');
    }


    onLoad () {
        ArrowRain.instance = this;
        this.init();
        // this.playing = true;
        // this.playBegin();
    }

    use(){
        // cc.log('ArrowRainUSE', this.node.x);
        AudioMgr.instance.playAudio('ArrowRain');
        this.playing = true;
        // this.hit.active = false;
        this.node.x = Hero.instance.node.x;
        this.hitBox.tag = 1.5 * MonsterATK[Global.getInstance().gameDifficulty][Global.getInstance().nowLevel - Global.getInstance().gameDifficulty * 40 - 1];
        this.playBegin();
    }

    unuse(){
        this.node.x = -900;
        this.playing = false;
    }

    setWarnActive(active: boolean){
        this.warn.active = active;
        this.warnBg.active = active;
    }

    playBegin(){
        this.setWarnActive(true);
        this.isStop = false;
        this.node.y = -220;
        this.hit.y = 900;
        this.speedY = 0;
        // AudioMgr.instance.playAudio(Global.getInstance().DCAudio.多重箭);
    }

    reset(){
        this.node.y = -900;
    }

    playEnd(){
        this.setWarnActive(false);
        this.isStop = true;
    }

    start () {

    }

    update (dt) {
        if(Global.getInstance().inGame && this.playing){

            if(this.hit.y <= 0){
                if(!this.isStop){
                    this.playEnd();

                    this.scheduleOnce(()=>{
                        this.unuse();
                    }, 1.5);
                }
                
            }else{
                this.speedY += dt * -1800;
                this.hit.y += this.speedY * dt;
                // cc.log(this.hit.y);
            }
        }else{
            this.playBegin();
        }
    }
}
