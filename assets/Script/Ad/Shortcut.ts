import AudioMgr from "../Audio";
import Global from "../nativets/Global";
import HeroGlobal from "../Hero/HeroGlobal";
import AdMgr from "./AdMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Shortcut extends cc.Component {
    static instance: Shortcut = null;
    closeBtn: cc.Node;

    init(){
        let boxNode = this.node.getChildByName('box');
        this.closeBtn = boxNode.getChildByName('close');
    }

    onLoad () {
        Shortcut.instance = this;
        this.init();
        this.node.active = false;
    }

    start () {

    }

    open(){
        this.node.active = true;
        this.closeBtn.active = false;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(()=>{
            this.closeBtn.active = true;
        }, 3);
    }

    onBtnClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onClose();
    }

    onClose(){
        this.node.active = false;
    }

    onBtnAdd(){
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            AdMgr.instance.addShortcut();
        }
    }

    onReward(){
        HeroGlobal.instance.Coins += 1000;
        HeroGlobal.instance.saveHeroGlobal();
        this.onClose();
    }

    // update (dt) {}
}
