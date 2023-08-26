/**
 * 
 * 1. 金币 =200+math.floor(等级/10)*100 
 * 2. 钻石=20+math.floor(等级/20)*5
 * 3. 体力=10 
 * 4. 武魂 武魂等级=math.floor(等级/15) 封顶 5级
*/

import AdMgr from "../Ad/AdMgr";
import AdList from "../Ad/AdList";
import DataMgr from "../DataMgr";
import Menu from "../Menu";
import HeroGlobal from "../Hero/HeroGlobal";
import TextureMgr from "../TextureMgr";
import { getDataById } from "../nativets/Config";

const {ccclass, property} = cc._decorator;
const SOULID = 6010203;

@ccclass
export default class Activity extends cc.Component {
    static instance: Activity = null;

    @property(cc.Prefab)
    activityItem: cc.Prefab = null;

    // 3
    @property([cc.SpriteFrame])
    bgSf: cc.SpriteFrame[] = [];

    // 4
    @property([cc.SpriteFrame])
    haveSf: cc.SpriteFrame[] = [];
    // 4
    @property([cc.SpriteFrame])
    nowSf: cc.SpriteFrame[] = [];
    // 4
    @property([cc.SpriteFrame])
    nothaveSf: cc.SpriteFrame[] = [];

    progressArrs: cc.Node[];
    btnGet: cc.Button;
    itemBg: cc.Sprite[];
    itemIcon: cc.Sprite[];
    itemTitle: cc.Sprite[];
    itemName: cc.Label[];
    itemNum: cc.Label[];
    

    init(){
        let progressNode = this.node.getChildByName('progress');
        this.progressArrs = [];
        for (let i = 0; i < 3; i++) {
            this.progressArrs.push(progressNode.getChildByName('' + i));
        }
        this.btnGet = this.node.getChildByName('get').getComponent(cc.Button);
        this.initLayout();
    }

    onLoad () {
        Activity.instance = this;
        this.init();
        this.refreshState();
    }

    start () {

    }

    getCoinsNum(){
        // return 200 + Math.floor(HeroGlobal.instance.Level * .1) * 100;
        return 400 + HeroGlobal.instance.Level * 15;
    }

    getJadeNum(){
        return 20 + Math.floor(HeroGlobal.instance.Level * .05) * 5;
    }

    getLifeNum(){
        return 10;
    }

    initLayout(){
        this.itemBg = [];
        this.itemIcon = [];
        this.itemName = [];
        this.itemNum = [];
        this.itemTitle = [];
        for (let i = 0; i < 4; i++) {
            let aitem = cc.instantiate(this.activityItem);
            aitem.parent = this.node;
            aitem.name = '' + i;
            aitem.position = cc.v2(-350 + 230 * i, -20);
            this.itemBg.push(aitem.getComponent(cc.Sprite));
            this.itemTitle.push(aitem.getChildByName('title').getComponent(cc.Sprite));
            this.itemIcon.push(aitem.getChildByName('icon').getComponent(cc.Sprite));
            this.itemName.push(aitem.getChildByName('name').getComponent(cc.Label));
            this.itemNum.push(aitem.getChildByName('num').getComponent(cc.Label));
            switch (i) {
                case 0:
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.rewardSfInGame[1];
                    this.itemName[i].string = '金币';
                    break;
                case 1:
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.rewardSfInGame[0];
                    this.itemName[i].string = '钻石';
                    break;
                case 2:
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.rewardSfInGame[2];
                    this.itemName[i].string = '军粮';
                    break;
                case 3:
                    let sjson = getDataById(SOULID);
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.getSoulIconById(SOULID);
                    this.itemName[i].string = '武魂';
                    this.itemNum[i].string = sjson.name;
                    break;
                default:
                    break;
            }
        }
    }

    refreshLayout(){
        for (let i = 0; i < 4; i++) {
            this.itemBg[i].spriteFrame = this.getBgSf(i);
            this.itemTitle[i].spriteFrame = this.getTitleSf(i)[i];
            switch (i) {
                case 0:
                    this.itemNum[i].string = 'x' + this.getCoinsNum();
                    break;
                case 1:
                    this.itemNum[i].string = 'x' + this.getJadeNum();
                    break;
                case 2:
                    this.itemNum[i].string = 'x' + this.getLifeNum();
                    break;
                case 3:
                    break;
                default:
                    break;
            }
        }
    }

    getTitleSf(i: number){
        if(i < DataMgr.instance.activityCount){
            return this.haveSf;
        }else if( i == DataMgr.instance.activityCount){
            return this.nowSf;
        }else{
            return this.nothaveSf;
        }
    }

    getBgSf(i: number){
        if(i < DataMgr.instance.activityCount){
            return this.bgSf[0];
        }else if( i == DataMgr.instance.activityCount){
            return this.bgSf[1];
        }else{
            return this.bgSf[2];
        }
    }

    onBtnGet(){
        if(DataMgr.instance.activityCount < 4){
            if(AdMgr.instance){
                AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.每日);
            }else{
                this.onGet();
                DataMgr.instance.activityCount ++;
                DataMgr.instance.saveSaveDate();
            }
        }
        this.refreshState();
    }

    onGet(){
        if(DataMgr.instance.activityCount < 4){
            switch (DataMgr.instance.activityCount) {
                case 0:
                    // let coins = 200 + Math.floor(HeroGlobal.instance.Level * .1) * 100;
                    Menu.instance.addCoins(this.getCoinsNum());  
                    break;
                case 1:
                    // let jade = 20 + Math.floor(HeroGlobal.instance.Level * .05) * 5;
                    Menu.instance.addJade(this.getJadeNum());  
                    break;
                case 2:
                    // let life = 10;
                    Menu.instance.addLife(this.getLifeNum());  
                    break;
                case 3:
                    HeroGlobal.instance.pushEquipmentData(6010203);
                    break;
                default:
                    break;
            }
        }
    }

    refreshState(){
        let p = DataMgr.instance.activityCount;
        this.setState(p);
        this.setProgress(p);
        this.refreshLayout();
    }

    setState(p: number){
        this.btnGet.interactable = p < 4;
    }

    setProgress(p: number){
        for (let i = 0; i < 3; i++) {
            this.progressArrs[i].active = i < p;
        }
    }

    onEnable(){
        if(!this.btnGet){
            return;
        }
        this.refreshState();
    }
    // update (dt) {}
}
