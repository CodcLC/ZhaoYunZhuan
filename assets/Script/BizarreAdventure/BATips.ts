import Game from "../Game";
import BizarreAdventure from "./BizarreAdventure";
import TextureMgr from "../TextureMgr";
import Tips from "../Tips";
import HeroGlobal from "../Hero/HeroGlobal";
import AdMgr from "../Ad/AdMgr";
import AdList from "../Ad/AdList";
import AudioMgr from "../Audio";
import { getWhoId } from "../nativets/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BATips extends cc.Component {
    static instance: BATips = null;
    icon: cc.Sprite;
    bg: cc.Sprite;
    index: number;
    dataArrs: any[];
    nameLabel: cc.Label;
    oldCE: number;
    bookId: number;
    okBtn: cc.Node;
    doubleBtn: cc.Node;
    closeBtn: cc.Node;
    autoBtn: cc.Node;
    autoLabel: cc.Label;
    time: number;
    autoId: any;
    boxBtn: cc.Node;

    init () {
        let boxNode = this.node.getChildByName('box');
        this.icon = boxNode.getChildByName('icon').getComponent(cc.Sprite);
        this.bg = boxNode.getChildByName('bg').getComponent(cc.Sprite);
        this.nameLabel = boxNode.getChildByName('name').getComponent(cc.Label);
        this.okBtn = boxNode.getChildByName('ok');
        this.doubleBtn = boxNode.getChildByName('double');
        this.closeBtn = boxNode.getChildByName('close');
        this.autoBtn = boxNode.getChildByName('auto');
        this.boxBtn = boxNode.getChildByName('box');
        this.autoLabel = this.autoBtn.getChildByName('text').getComponent(cc.Label);
    }

    onLoad () {
        BATips.instance = this;
        this.init();
        this.node.active = false;
    }

    start () {

    }

    // 全都要
    onOpen(){
        this.index = 0;
        this.dataArrs = [];
        let bdata: any = BizarreAdventure.instance.dataArrs;
        for (let i = 0; i < bdata.length; i++) {
            //除开金币仙玉军粮
            // if(bdata[i].index > 2){
                this.dataArrs.push(bdata[i]);
            // }
        }
        if(this.dataArrs.length == 0){
            return;
        }
        this.showTips();
        // this.oldCE = HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE;
    }

    // 单个
    onOpenSingle(index: number){
        let bdata: any = BizarreAdventure.instance.dataArrs;
        // if(bdata[index] && bdata[index].index > 2){
            this.index = 0;
            this.dataArrs = [];
            this.dataArrs.push(bdata[index]);
            this.showTips();
            
            
        // }else{
        //     Game.instance.onEnd(true);
        // }
        // this.oldCE = HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE;
    }

    showTips(){
        let tindex = this.dataArrs[this.index].index;
        let id = this.dataArrs[this.index].id;
        this.bg.spriteFrame = tindex == 3 ? TextureMgr.instance.rewardBg : null;
        this.icon.spriteFrame = BizarreAdventure.instance.getImgByJson(tindex, id);
        this.icon.node.setScale(1);
        this.nameLabel.string = BizarreAdventure.instance.getNameByJson(tindex, id);
        
        
        // Tips.instance.showSuccessInGame(HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE + '上' + '666');
        // 秘籍
        if(tindex == 5){
            // let oldCE = HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE;
            // HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].updateAttribute();
            this.bookId = id;
            Tips.instance.showSuccessInGame(this.oldCE + '上' + (HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE - this.oldCE));
            this.setButtonState(1);
        }else if(tindex == 3){
            //装备

            // 自动装备
            if(getWhoId(id) != 0 && getWhoId(id) != HeroGlobal.instance.MainHeroIndex + 1){
                this.setButtonState(0);
            }else{
                let type = Math.floor(id / 10000);
                let equidedData = Math.floor(HeroGlobal.instance.getMainHeroData().getDataByType(type) / 10000);
                let total = equidedData % 1000;
                let nowTotal = id % 1000;
                if(nowTotal <= total){
                    this.setButtonState(0);
                }else{
                    this.autoId = id;
                    this.time = 6;
                    this.autoLabel.string = '自动装备' + 5;
                    let callback = ()=>{
                        this.time --;
                        this.autoLabel.string = '自动装备' + this.time;
                        if(this.time <= 0){
                            this.autoSetEuipment();
                        }
                    };

                    this.schedule(callback, 1, 5);
                    this.setButtonState(2);
                }
            }
            
        }else{
            // 武魂
            this.setButtonState(0);
            if(tindex != 4){
                this.icon.node.setScale(1.1);
                this.nameLabel.string = BizarreAdventure.instance.getNameByJson(tindex, id) + ' x ' + id;
            }
        }
        this.node.active = true;
    }

    showBoxGiftReward(){
        this.bg.spriteFrame = null;
        let tindex = 0;
        let id = 0;
        
        this.icon.node.setScale(1.1);
        
        // 50%几率 40钻石 50%几率 500金币
        if(Math.random() < .5){
            tindex = 0,
            id = 40;
            HeroGlobal.instance.Jade += id;
            HeroGlobal.instance.saveHeroGlobal();
        }else{
            tindex = 1,
            id = 500;
            HeroGlobal.instance.Coins += id;
            HeroGlobal.instance.saveHeroGlobal();
        }
        this.icon.spriteFrame = BizarreAdventure.instance.getImgByJson(tindex, id);
        this.nameLabel.string = BizarreAdventure.instance.getNameByJson(tindex, id) + ' x ' + id;
        this.setButtonState(9);
        this.node.active = true;
    }

    onBtnAuto(){
        AudioMgr.instance.playAudio('BtnClick');
        this.autoSetEuipment();
    }

    autoSetEuipment(){
        HeroGlobal.instance.getMainHeroData().setEquip(Math.floor(this.autoId / 10000), this.autoId * 10000);

        this.onNext();
    }

    setButtonState(state: number){
        let showClose = ()=>{
            this.closeBtn.active = state == 1;
        }

        this.unschedule(showClose);
        this.okBtn.active = state == 0;
        this.doubleBtn.active = state == 1;
        this.closeBtn.active = state == 2;

        
        if(!this.closeBtn.active){
            this.scheduleOnce(showClose, 0);
        }
        this.autoBtn.active = state == 2;

        this.boxBtn.active = state == 9;
    }

    onBtnBoxClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.node.active = false;
    }

    //秘籍双倍领取
    onBtnDouble(){
        if(AdMgr.instance){
            AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.秘籍双倍);
        }else{
            this.onDoubleReward();
        }
    }

    onDoubleReward(){
        HeroGlobal.instance.pushEquipmentData(this.bookId);
        BATips.instance.oldCE = HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE;
        HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].updateAttribute();
        Tips.instance.showSuccessInGame(this.oldCE + '上' + (HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE - this.oldCE));
        this.onNext();
    }

    onBtnNext(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onNext();
    }

    onNext(){
        this.index ++;
        if(this.index == this.dataArrs.length){
            this.onClose();
        }else{
            this.showTips();
        }
    }

    onClose(){
        this.node.active = false;
        Game.instance.onEnd(true);
    }

    // update (dt) {}
}
