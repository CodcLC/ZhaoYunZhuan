import { Task } from "../../nativets/Config";
import DataMgr from "../../DataMgr";
import TextureMgr from "../../TextureMgr";
import Menu from "../../Menu";
import AudioMgr from "../../Audio";
import Others from "../Others";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TaskItem extends cc.Component {
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
        let json = Task[index];
        let total = json.amount;
        let count = DataMgr.instance.taskCountData[index];
        if(count > total){
            count = total;
        }
        let progress = count / total;

        let got = DataMgr.instance.taskGetCountData[index];
        let state = -1;
        if(got == 0){
            if(count == total){
                state = 0;
            }
        }else{
            state = 1;
        }

        this.setState(state);

        if(json.gold){
            this.icon.spriteFrame = TextureMgr.instance.rewardSfInGame[1];
            this.rewardNum = json.gold;
            this.isGold = true;
        }else{
            this.icon.spriteFrame = TextureMgr.instance.rewardSfInGame[0];
            this.rewardNum = json.dimond;
            this.isGold = false;
        }

        this.coinsLabel.string = 'x ' + this.rewardNum;
        this.textLabel.string = json.name + json.amount + json.unit;
        this.countLabel.string = count + '/' + json.amount;
        this.titleLabel.string = json.title;
        this.progressBar.progress = progress;
        
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
        if(this.isGold){
            Menu.instance.addCoins(this.rewardNum);
        }else{
            Menu.instance.addJade(this.rewardNum);
        }
        DataMgr.instance.taskGetCountData[this.index] = 1;
        DataMgr.instance.saveSaveDate();
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
