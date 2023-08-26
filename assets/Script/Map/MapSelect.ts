import Map from "../Map";
import Global from "../nativets/Global";
import Main from "../Main";
import Menu from "../Menu";
import AllText from "../i18n/Language";
import TextureMgr from "../TextureMgr";
import HeroGlobal from "../Hero/HeroGlobal";
import AudioMgr from "../Audio";
import { PetName, HeroName, MapData } from "../nativets/Config";
import RewardMgr from "../Reward/RewardMgr";
import RewardMapMgr from "../Reward/RewardMapMgr";
import AdMgr from "../Ad/AdMgr";
import AdList from "../Ad/AdList";


const {ccclass, property} = cc._decorator;
const POSXARRS: number[] = [-110.5, 0, 110.5];

@ccclass
export default class MapSelect extends cc.Component {
    static instance: MapSelect = null;
    @property([cc.SpriteFrame])
    miniMaps: cc.SpriteFrame[] = [];
    lv: number;
    rightNode: cc.Node;
    titleLabel: cc.Label;
    miniMap: cc.Sprite;
    icons: cc.Sprite[] = [];
    selectNode: cc.Node;
    isPet: number;
    selectIndex: number;
    selectLight: cc.Node;
    leftNode: cc.Node;
    preFight: cc.Node;
    preFightLight: cc.Node;
    preFightIndex: number;
    ceLabel: cc.Label;
    iconPreFightArrs: cc.Sprite[];
    nameLabelArrs: cc.Label[];
    rightLayout: cc.Node;
    mapdata: any;
    rewardItmeArrs: any[];
    buffNode: cc.Node;
    buffLabel: cc.Label;
    buffLight: cc.Node;
    lockNode: cc.Node;


    // LIFE-CYCLE CALLBACKS:
    init(){
        MapSelect.instance = this;
        this.rightNode = this.node.getChildByName('Right');
        this.leftNode = this.node.getChildByName('Left');
        this.preFight = this.leftNode.getChildByName('PreFight');
        this.preFightLight = this.preFight.getChildByName('light');

        this.buffNode = this.preFight.getChildByName('3');
        this.buffLabel = this.buffNode.getChildByName('text').getComponent(cc.Label);
        this.buffLight = this.buffNode.getChildByName('light');

        this.rightLayout = this.rightNode.getChildByName('Layout');

        this.titleLabel = this.rightNode.getChildByName('title').getComponent(cc.Label);
        this.miniMap = this.rightNode.getChildByName('minimap').getComponent(cc.Sprite);

        this.ceLabel = this.preFight.getChildByName('ce').getComponent(cc.Label);

        this.selectNode = this.node.getChildByName('select');
        this.selectLight = this.selectNode.getChildByName('select');

        this.lockNode = this.selectNode.getChildByName('lock');
        this.lockNode.getComponent(cc.Sprite).spriteFrame = TextureMgr.instance.lockSf;
        this.lockNode.active = false;

        this.nameLabelArrs = [];
        this.iconPreFightArrs = [];
        for (let i = 0; i < 3; i++) {
            this.icons.push(this.selectNode.getChildByName('' + i).getComponent(cc.Sprite));
            let n = this.preFight.getChildByName('' + i);
            this.nameLabelArrs.push(n.getChildByName('name').getComponent(cc.Label));
            this.iconPreFightArrs.push(n.getChildByName('icon').getComponent(cc.Sprite));
            
        }

    }

    open(lv: number){
        this.lv = lv;
        Menu.instance.hideRight();
        Main.instance.menuNode.active = true;
        Map.instance.base.active = false;
        this.node.active = true;
        this.refreshTitle();
        this.refreshMiniMap();
        this.setPreFight(0);

        this.refreshBuff();
    }

    onLoad () {

    }

    start () {

    }

    // 刷新战斗力
    refreshCE(){
        // this.ceLabel.string = '' + HeroGlobal.instance.HeroDataArrs[this.selectIndex].CE;
        this.ceLabel.string = '' + HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE;
    }

    refreshTitle(){
        let dif: number = Map.instance.index + 1;
        let tlv = this.lv % 10;
        if(tlv == 0) tlv = 10;
        let str: string = AllText.mapSelectMission.replace('${x}', AllText[dif]) + '  ' + AllText.mapSelectTurn.replace('${x}', AllText[tlv]);
        this.titleLabel.string = str;

        this.getRewardItemArrs();
    }

    getRewardItemArrs(){
        this.mapdata = MapData[this.lv - 1];
        // cc.log(this.mapdata);
       
        this.rightLayout.removeAllChildren();

        
        

        let soulArrs = this.mapdata.soul[Global.getInstance().gameDifficulty];
        let soulRateArrs = this.mapdata.soulrate[Global.getInstance().gameDifficulty];

        for (let j = 0; j < soulArrs.length; j++) {
            RewardMapMgr.instance.createRewardMap(soulArrs[j] + 1 + Math.floor(Math.random() * 8));
        }
        // this.rewardItmeArrs = arrs;

        if(!this.mapdata.item){
            this.rewardItmeArrs = [];
            return;
        }

        // if(Global.getInstance().gameDifficulty == 0){
            let itemArrs = this.mapdata.item[Global.getInstance().gameDifficulty];
            let itemRateArrs = this.mapdata.itemrate[Global.getInstance().gameDifficulty];
    
            if(itemArrs)
            for (let i = 0; i < itemArrs.length; i++) {
                RewardMapMgr.instance.createRewardMap(itemArrs[i]);
    
            }
        // }
    }

    refreshMiniMap(){
        this.miniMap.spriteFrame = this.miniMaps[Map.instance.index];
    }

    onBtnStart(){
        AudioMgr.instance.playAudio('BtnClick');
        let trueLv: number = Global.getInstance().gameDifficulty * 40 + this.lv;
        Map.instance.onBtnLevel(trueLv);
    }

    onBtnClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.node.active = false;
        Map.instance.base.active = true;
        Main.instance.menuNode.active = false;
        Menu.instance.showRight();
    }


    setIcons(type: number){
        if(this.isPet == type){
            return;
        }
        this.isPet = type;
        let arrs: cc.SpriteFrame[] = type == 0 ? TextureMgr.instance.heroIconSf : TextureMgr.instance.petIconSf;
        for (let i = 0; i < 3; i++) {
            this.icons[i].spriteFrame = arrs[i];
        }
        this.lockNode.active = (type == 0 && HeroGlobal.instance.Level < 10);
        if(this.lockNode.active)
        this.icons[2].spriteFrame = null;
    }

    // setDefault()

    setSelect(index: number){
        this.selectIndex = index;
        this.selectLight.x = POSXARRS[index];
        // 原本和menu界面的共用，现在单独出来
        // cc.director.emit('RefreshSelect', index);
        if(this.isPet == 1){
            if(HeroGlobal.instance.PetLvArrs[index] > 0){
                HeroGlobal.instance.PetIndex = index;
                this.nameLabelArrs[2].string = PetName[index];
                this.iconPreFightArrs[2].spriteFrame = TextureMgr.instance.petIconBoxMapselectSf[index];
            }else{
                HeroGlobal.instance.PetIndex = -1;
                this.nameLabelArrs[2].string = '未解锁';
                this.iconPreFightArrs[2].spriteFrame = null;
            }
            let heroData = HeroGlobal.instance.getMainHeroData();
            heroData.updateAttribute();
        }else{
            HeroGlobal.instance.OtherHeroIndex = HeroGlobal.instance.MainHeroIndex;
            HeroGlobal.instance.MainHeroIndex = index;

            this.nameLabelArrs[0].string = HeroName[index];
            this.iconPreFightArrs[0].spriteFrame = TextureMgr.instance.heroIconRectMapselectSf[index];
        }
        

        cc.director.emit('RefreshMapSelect', this.selectIndex, this.preFightIndex);
        this.refreshCE();
    }

    onBtnSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        if(index == 2 && this.isPet == 0){
            // 大乔未解锁
            if(HeroGlobal.instance.Level < 10)
            return;
        }
        this.setSelect(index);
    }

    setPreFight(index: number){
        this.preFightIndex = index;
        this.preFightLight.x = -485 + 100 * index;
        switch (index) {
            case 0:
                this.setIcons(0);
                this.setSelect(HeroGlobal.instance.MainHeroIndex);
                break;
            case 1:
                this.setIcons(0);
                this.setSelect(HeroGlobal.instance.OtherHeroIndex);
                break;
            case 2:
                this.setIcons(1);
                let petIndex = HeroGlobal.instance.PetIndex;
                if(petIndex < 0){
                    petIndex = 0;
                }
                this.setSelect(petIndex);
                break;
            default:
                break;
        }
        
    }

    onBtnVideoBuff(){
        if(Global.getInstance().preBuff){
            return;
        }
        if(AdMgr.instance){
            AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST1.开局Buff);
        }else{
            Global.getInstance().preBuff = true;
            this.refreshBuff();
        }
    }

    refreshBuff(){
        this.buffLight.active = Global.getInstance().preBuff;
        this.buffLabel.string = Global.getInstance().preBuff ? 'BUFF' : '观看视频';
        
    }

    onBtnPreFight(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        this.setPreFight(index);
    }

    // update (dt) {}
}
