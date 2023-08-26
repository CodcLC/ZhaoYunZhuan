import AudioMgr from "../Audio";
import RewardItem from "./RewardItem";
import HeroGlobal from "../Hero/HeroGlobal";
import { getWhoId } from "../nativets/Config";
import Global from "../nativets/Global";
import AdMgr from "../Ad/AdMgr";
import { getPlatform, Platform } from "../nativets/Platform";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RewardAuto extends cc.Component {
    static instance: RewardAuto = null;
    rewardScript: RewardItem;
    textLabel: cc.Label;
    time: number;
    id: number;

    init(){
        this.rewardScript = this.node.getChildByName('rewardItem').getComponent(RewardItem);
        this.textLabel = this.node.getChildByName('text').getComponent(cc.Label);
    }

    onLoad () {
        RewardAuto.instance = this;
        this.init();
        this.node.active = false;
    }



    start () {

    }

    open(id: number){
        this.id = id;

        if(getWhoId(id) != 0 && getWhoId(id) != HeroGlobal.instance.MainHeroIndex + 1){
            return;
        }

        let type = Math.floor(this.id / 10000);
        let equidedData = Math.floor(HeroGlobal.instance.getMainHeroData().getDataByType(type) / 10000);
        let total = equidedData % 1000;
        let nowTotal = id % 1000;
        if(nowTotal <= total){
            return;
        }

        // 神行符
        this.rewardScript.setByIdLayout(id);
        this.node.active = true;
        this.time = 6;
        this.textLabel.string = '自动装备' + 5;
        let callback = ()=>{
            this.time --;
            this.textLabel.string = '自动装备' + this.time;
            if(this.time <= 0){
                this.autoSetEuipment();
            }
        };

        this.schedule(callback, 1, 5);
    }

    onBtnAuto(){
        AudioMgr.instance.playAudio('BtnClick');
        this.autoSetEuipment();
    }

    autoSetEuipment(){
        HeroGlobal.instance.getMainHeroData().setEquip(Math.floor(this.id / 10000), this.id * 10000);

        this.onClose();
    }

    onClose(){
        this.unscheduleAllCallbacks();
        this.node.active = false;

        if(Global.getInstance().nowLevel == 1){
            if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO){
                if(AdMgr.instance){
                    AdMgr.instance.showShortcut();
                }
            }
            
        }
    }

    // update (dt) {}
}
