import Global from "../nativets/Global";
import AudioMgr from "../Audio";
import { TipString } from "../nativets/Config";
import AdMgr from "../Ad/AdMgr";
import { getPlatform, Platform } from "../nativets/Platform";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Gradient extends cc.Component {
    static instance: Gradient = null;
    material;
    time: number = 0;
    canClose: any;
    textLabel: cc.Label;

    onLoad(){
        Gradient.instance = this;
        // 获取材质
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0);
        
    }

    start () {
        // this.hideBanner();
    }

    effect(){
        // 刷新函数
        this.schedule(this.upd, 0, cc.macro.REPEAT_FOREVER, 1);
    }

    upd() {
        this.time += 0.01;
        this.material.effect.setProperty('time', this.time);
        if (this.time > 1.2) {
            
            this.unschedule(this.upd);
            this.material.effect.setProperty('time', 0);
            this.time = 0;
            this.node.active = false;
            Global.getInstance().inGame = true;
        }
    }

    setTips(){
        this.setTipsLocation();
        let str = TipString[Math.floor(Math.random() * TipString.length)];
        this.textLabel.string = str;
    }

    setTipsLocation(){
        if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO){
            this.textLabel.node.y = -105;
        }else{
            this.textLabel.node.y = -290;
        }
    }

    hideBanner(){
        if(AdMgr.instance){
            AdMgr.instance.hideBanner();
        }
    }

    onEnable(){
        // this.effect();
        AudioMgr.instance.playBgm('loading');
        if(!this.textLabel)
        this.textLabel = this.node.getChildByName('text').getComponent(cc.Label);

        this.setTips();
        this.time = 1.5;
        this.canClose = false;
    }

    onDisable(){
        AudioMgr.instance.stopBgm('loading');
    }

    update(dt){
        if(this.time > 0){
            this.time -= dt;
            if(this.time <= 0){
                if(this.canClose){
                    this.node.active = false;
                    cc.director.emit('HeroShow');
                }
                this.canClose = true;
            }
        }

    }

}
