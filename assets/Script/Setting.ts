import { save } from "./nativets/SaveMgr";
import HeroGlobal from "./Hero/HeroGlobal";
import AudioMgr from "./Audio";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Setting extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onBtnChick(){
        AudioMgr.instance.playAudio('BtnClick');
        this.node.scaleX *= -1;
        if(this.node.name == 'effect'){
            HeroGlobal.instance.EffectSwitch = !HeroGlobal.instance.EffectSwitch;
        }
        if(this.node.name == 'bgm'){
            HeroGlobal.instance.BgmSwitch = !HeroGlobal.instance.BgmSwitch;
            if(!cc.find('Canvas').getChildByName('Setting').active){
                if(HeroGlobal.instance.BgmSwitch){
                    AudioMgr.instance.playBgm('game');
                }else
                AudioMgr.instance.stopBgm('game');
            }
            
        }
        let data = {
            bgm: HeroGlobal.instance.BgmSwitch,
            effect: HeroGlobal.instance.EffectSwitch
        }
        save('Setting', JSON.stringify(data));
    }

    onBtnClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.node.parent.parent.active = false;
    }

    // update (dt) {}

    onEnable(){
        if(this.node.name == 'effect'){
            this.node.scaleX = HeroGlobal.instance.EffectSwitch ? -1 : 1;
        }
        if(this.node.name == 'bgm'){
            this.node.scaleX = HeroGlobal.instance.BgmSwitch ? -1 : 1;
            if(!HeroGlobal.instance.BgmSwitch){
                AudioMgr.instance.stopBgm('game');
            }
        }
    }
}
