import { Achieve } from "../../nativets/Config";

import TextureMgr from "../../TextureMgr";
import Menu from "../../Menu";
import AudioMgr from "../../Audio";
import Others from "../Others";
import HeroGlobal from "../../Hero/HeroGlobal";


const {ccclass, property} = cc._decorator;

@ccclass
export default class AchieveLv extends cc.Component {
    goBtn: cc.Node;
    getBtn: cc.Node;
    icon: cc.Sprite;
    progressBar: cc.ProgressBar;
    textLabel: cc.Label;
    countLabel: cc.Label;
    coinsLabel: cc.Label;
    index: number;
    rewardNum: number;
    isGold: boolean;
    titleLabel: cc.Label;
    title0: cc.Node;
    title1: cc.Node;
    coins1Label: cc.Label;
    coins2Label: cc.Label;
    rewardNum2: number;
    rewardNum1: number;

    init(index: number){
        this.goBtn =  this.node.getChildByName('go');
        this.getBtn = this.node.getChildByName('get');
        this.icon = this.node.getChildByName('icon').getComponent(cc.Sprite);

        this.textLabel = this.node.getChildByName('text').getComponent(cc.Label);

        // this.coinsLabel = this.node.getChildByName('coins').getComponent(cc.Label);
        this.title0 = this.node.getChildByName('0');
        this.title1 = this.node.getChildByName('1');

        this.node.getChildByName('icon1').getComponent(cc.Sprite).spriteFrame = TextureMgr.instance.rewardSfInGame[0];
        this.node.getChildByName('icon2').getComponent(cc.Sprite).spriteFrame = TextureMgr.instance.rewardSfInGame[1];
        
        this.coins1Label = this.node.getChildByName('coins1').getComponent(cc.Label);
        this.coins2Label = this.node.getChildByName('coins2').getComponent(cc.Label);
    }

    onLoad () {

    }

    onRefresh(index: number){
        if(!this.coins1Label){
            this.init(9);
        }
        this.index = index;
        let json = Achieve[index];
        let amount = json.amount;

        let achieveProgress = HeroGlobal.instance.AchieveGetCountData[index] + 1;
        if(achieveProgress > amount.length - 1){
            achieveProgress = amount.length - 1;
        }

        let total = amount[achieveProgress];
        let count = HeroGlobal.instance.AchieveCountData[index];
        if(count > total){
            if(index != 4)
            count = total;
        }
        let progress = count / total;

        if(index == 4 && count < total){
            progress = 1;
            if(count == 0){
                progress = 0;
            }
        }

        // if(json.gold){
        //     this.icon.spriteFrame = TextureMgr.instance.rewardSfInGame[1];
            this.rewardNum2 = json.gold[achieveProgress];
        //     this.isGold = true;
        // }else{
        //     this.icon.spriteFrame = TextureMgr.instance.rewardSfInGame[0];
            this.rewardNum1 = json.dimond[achieveProgress];
        //     this.isGold = false;
        // }

        // this.coinsLabel.string = 'x ' + this.rewardNum;
        this.coins1Label.string = 'x ' + json.dimond[achieveProgress];
        this.coins2Label.string = 'x ' + json.gold[achieveProgress];
        this.textLabel.string = '等级达到' + json.amount[achieveProgress] + '级可领取';
        // this.countLabel.string = count + '/' + json.amount[achieveProgress];
        // this.titleLabel.string = json.title;
        // this.progressBar.progress = progress;

        // index为4,排行榜 要小于
        // this.progressBar.node.active = index != 4;

        let state = -1;
        let got = HeroGlobal.instance.AchieveGetCountData[index];
        if(progress == 1){
            state = 0;
        }else{
            state = -1;
        }
        if(got >= json.amount.length - 1){
            state = 1;
        }
        this.setState(state);
    }

    setState(state: number){
        this.goBtn.active = state == -1;
        this.getBtn.active = state == 0;

        this.title0.active = state == 0;
        this.title1.active = state != 0;
    }

    onBtnGet(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onGet();
    }

    onGet(){
        HeroGlobal.instance.AchieveGetCountData[this.index] ++;
        // if(this.isGold){
            Menu.instance.addCoins(this.rewardNum2);
        // }else{
            Menu.instance.addJade(this.rewardNum1);
        // }
        
        // HeroGlobal.instance.saveHeroGlobal();
        this.onRefresh(this.index);
    }

    onBtnGo(){
        AudioMgr.instance.playAudio('BtnClick');
        Others.instance.onClose();
    }

    start () {

    }

    // update (dt) {}
}
