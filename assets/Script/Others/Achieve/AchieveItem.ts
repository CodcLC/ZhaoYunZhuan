import { Achieve } from "../../nativets/Config";

import TextureMgr from "../../TextureMgr";
import Menu from "../../Menu";
import AudioMgr from "../../Audio";
import Others from "../Others";
import HeroGlobal from "../../Hero/HeroGlobal";


const {ccclass, property} = cc._decorator;

@ccclass
export default class AchieveItem extends cc.Component {
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

    init(index: number){
        this.goBtn =  this.node.getChildByName('go');
        this.getBtn = this.node.getChildByName('get');
        this.icon = this.node.getChildByName('icon').getComponent(cc.Sprite);
        this.progressBar = this.node.getChildByName('ProgressBar').getComponent(cc.ProgressBar);
        this.textLabel = this.node.getChildByName('text').getComponent(cc.Label);
        this.countLabel = this.node.getChildByName('count').getComponent(cc.Label);
        this.coinsLabel = this.node.getChildByName('coins').getComponent(cc.Label);
        this.titleLabel = this.node.getChildByName('title').getComponent(cc.Label);
        // this.onRefresh(index);
    }

    onLoad () {

    }

    onRefresh(index: number){
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

        if(json.gold){
            this.icon.spriteFrame = TextureMgr.instance.rewardSfInGame[1];
            this.rewardNum = json.gold[achieveProgress];
            this.isGold = true;
        }else{
            this.icon.spriteFrame = TextureMgr.instance.rewardSfInGame[0];
            this.rewardNum = json.dimond[achieveProgress];
            this.isGold = false;
        }

        this.coinsLabel.string = 'x ' + this.rewardNum;
        this.textLabel.string = json.name + json.amount[achieveProgress] + json.unit;
        this.countLabel.string = count + '/' + json.amount[achieveProgress];
        this.titleLabel.string = json.title;
        this.progressBar.progress = progress;

        // index为4,排行榜 要小于
        this.progressBar.node.active = index != 4;

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
    }

    onBtnGet(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onGet();
    }

    onGet(){
        HeroGlobal.instance.AchieveGetCountData[this.index] ++;
        if(this.isGold){
            Menu.instance.addCoins(this.rewardNum);
        }else{
            Menu.instance.addJade(this.rewardNum);
        }
        
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
