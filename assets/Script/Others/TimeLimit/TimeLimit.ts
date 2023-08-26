import AudioMgr from "../../Audio";
import AdMgr from "../../Ad/AdMgr";
import AdList from "../../Ad/AdList";
import AdRewradMgr from "../../Ad/AdRewardMgr";
import { loadSpinePromise } from "../../Tool/LoadPromise";
import { PetSpName } from "../../nativets/Config";
import Menu from "../../Menu";
import { load } from "../../nativets/SaveMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TimeLimit extends cc.Component {
    static instance: TimeLimit = null;
    petSk: sp.Skeleton;
    closeBtn: cc.Node;
    isPet: boolean;
    petNode: cc.Node;
    wingNode: cc.Node;
    titleLabel: cc.Label;

    init () {
        this.closeBtn = this.node.getChildByName('box').getChildByName('close');
        this.petNode = this.node.getChildByName('pet');
        this.wingNode = this.node.getChildByName('wing');
        this.titleLabel = this.node.getChildByName('box').getChildByName('title').getComponent(cc.Label);
    }

    onLoad () {
        TimeLimit.instance = this;
        this.init();
        this.node.active = false;
        // this.loadPet();
    }

    start () {

    }

    open(isPet: boolean){
        if(!isPet){
            if(load('WingReward')){
                return;
            }
        }
        this.isPet = isPet;
        this.petNode.active = isPet;
        this.wingNode.active = !isPet;
        this.titleLabel.string = isPet ? '限时神宠礼包' : '限时神翅';
        if(isPet){
            this.loadPet();
        }else{

        }

        this.node.active = true;
    }

    async loadPet(){
        let psp: any = await loadSpinePromise(PetSpName[1]);
        this.petSk = this.petNode.getComponent(sp.Skeleton);
        this.petSk.skeletonData = psp;
        this.petSk.animation = 'fly';
        this.petSk._updateSkeletonData();
        this.petSk.setSkin('default');
    }

    onBtnVideo () {
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            AdMgr.instance.showRewardAd(this.isPet ? AdList.WXVIDEOLIST2.限时武魂 : AdList.WXVIDEOLIST2.神翅);
        }else{
            AdRewradMgr.getInstance().onSuccess(this.isPet ? AdList.WXVIDEOLIST2.限时武魂 : AdList.WXVIDEOLIST2.神翅);
        }
        this.onClose();
    }

    onBtnClose () {
        AudioMgr.instance.playAudio('BtnClick');
        this.onClose();
    }

    onClose () {
        this.node.active = false;
        Menu.instance.setTimeLimitState();
    }

    onEnable(){
        if(!this.closeBtn){
            this.init();
        }
        this.unscheduleAllCallbacks();
        this.closeBtn.active = false;
        this.scheduleOnce(()=>{
            this.closeBtn.active = true;
        }, 2);
    }

    update (dt) {

    }
}
