import BAItem from "./BAItem";
import { BizarreAdventureData, getSoulDataById, getDataById } from "../nativets/Config";
import Global from "../nativets/Global";
import HeroGlobal from "../Hero/HeroGlobal";
import Game from "../Game";
import AllText from "../i18n/Language";
import TextureMgr from "../TextureMgr";
import Director from "../Director";
import AudioMgr from "../Audio";
import AdMgr from "../Ad/AdMgr";
import BATips from "./BATips";
import AdList from "../Ad/AdList";
import Tips from "../Tips";

const {ccclass, property} = cc._decorator;
const ATTARRS: string[] = ['gem', 'gold', 'life', 'item', 'soul', 'book'];
const DESARRS: string[] = ['可获得宝石', '可获得金币', '可获得军粮', '可获得装备', '可与装备融合', '永久提升属性'];

let baseArrs: string[] = ['atk', 'def', 'hp', 'ls', 'sp', 'cr', 'arp', 'bonus', 'cd', 'miss', 'exp', 'gold'];
let textArrs: string[] = [
                        AllText.equipmentAtk,
                        AllText.equipmentDef,
                        AllText.equipmentHp,
                        AllText.equipmentLs,
                        AllText.equipmentSp,
                        AllText.equipmentCr,
                        AllText.equipmentArp,
                        AllText.equipmentBonus,
                        AllText.equipmentCd,
                        AllText.equipmentMiss,
                        AllText.equipmentExp,
                        AllText.equipmentGold];

@ccclass
export default class BizarreAdventure extends cc.Component {
    static instance: BizarreAdventure = null;

    @property(cc.Prefab)
    baItemPrefab: cc.Prefab = null;
    boxNode: cc.Node;
    itemScripts: BAItem[];
    isWin: boolean;
    inOpen: boolean;
    dataArrs: any[];


    init(){
        this.boxNode = this.node.getChildByName('box');
        this.initLayout();
        this.node.active = false;
        
    }

    initLayout(){
        this.itemScripts = [];
        for (let i = 0; i < 3; i++) {
            let b = cc.instantiate(this.baItemPrefab);
            b.name = '' + i;
            b.parent = this.boxNode;
            b.position = cc.v2((i - 1) * 300, 0);
            this.itemScripts.push(b.getComponent(BAItem));
            this.itemScripts[i].init();
        }
    }

    onLoad () {
        BizarreAdventure.instance = this;
        this.init();
    }

    start () {

    }

    onOpen(isWin: boolean){
        
        if(this.inOpen){
            return;
        }
        this.inOpen = true;

        this.isWin = isWin;
        let data: any = BizarreAdventureData[Global.getInstance().nowLevel - 1];
        if(!data){
            //无奖励不触发
            this.onClose();
            Game.instance.onEnd(true);
            return;
        }

        // 类型，1代表宝箱，2代表小兵，3代表boss boss 什么不触发直接给
        let baType = parseInt(data.type);
        let rate = parseFloat(data.rate);
        if(Math.random() > rate){
            // 低于几率不触发
            this.onClose();
            Game.instance.onEnd(true);
            return;
        }

        if(rate == 1 && HeroGlobal.instance.MapData[Global.getInstance().gameDifficulty][Global.getInstance().nowLevel - Global.getInstance().gameDifficulty * 40 - 1] > 0){
            //拿过后不触发
            this.onClose();
            Game.instance.onEnd(true);
            return;
        }

        // if(baType == 2){
        //     MonsterNodePool.instance.create()
        // }      

        Director.instance.showType(baType);
        
        // Director.instance.onOpen(Global.getInstance().nowLevel, 3);
        
        this.getArrs(data);
        // this.node.active = true;
    }

    onBtnAll(){
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.全都要);
        }else
        this.getAll();
    }

    getAll(){
        for (let i = 0; i < this.dataArrs.length; i++) {
            this.unlockReward(this.dataArrs[i]);
        }
        HeroGlobal.instance.saveEquipmentArrs();
        this.onClose();
        BATips.instance.onOpen();
    }

    onReward(index: number){
        this.unlockReward(this.dataArrs[index]);
        HeroGlobal.instance.saveEquipmentArrs();
        this.onClose();
        BATips.instance.onOpenSingle(index);
    }

    onClose(){
        //流程结束弹结算
        this.node.active = false;
        this.inOpen = false;
        // Game.instance.onEnd(true);
    }

    getArrs(json: any){
        let dataArrs = [];
        for (let i = 0; i < ATTARRS.length; i++) {

            if(json[ATTARRS[i]]){
                let arrs = json[ATTARRS[i]].split(', ');
                let num = parseInt(arrs[Math.floor(Math.random() * arrs.length)]);
                dataArrs.push({index: i, id: num});
            }
        }
        console.log('DataArrs1', dataArrs);
        if(dataArrs.length > 3){
            dataArrs.splice(Math.floor(Math.random() * 3), 1);
        }
        this.dataArrs = dataArrs;

        console.log('DataArrs2', dataArrs);
        for (let j = 0; j < 3; j++) {
            let dIndex = dataArrs[j].index;
            let dId = dataArrs[j].id;
            let img = this.getImgByJson(dIndex, dId);
            let name = this.getNameByJson(dIndex, dId);
            let text = this.getAttInData(dIndex, dId);
            this.itemScripts[j].setItem(dIndex, img, name, DESARRS[dataArrs[j].index], text);
        }

    }

    unlockReward(data: any){
        if(!data) return;
        cc.log('reward',data);
        let id = parseInt(data.id);
        switch (data.index) {
            case 0:
                HeroGlobal.instance.Jade += id;
                HeroGlobal.instance.saveHeroGlobal();
                break;
            case 1:
                HeroGlobal.instance.Coins += id;
                HeroGlobal.instance.saveHeroGlobal();
                break;
            case 2:
                HeroGlobal.instance.Life += id;
                HeroGlobal.instance.saveHeroGlobal();
                break;
            case 3:
                HeroGlobal.instance.pushEquipmentData(id * 10000);
                break;
            case 4:
                //武魂
                HeroGlobal.instance.pushEquipmentData(id);
                break;
            case 5:
                //秘籍
                HeroGlobal.instance.pushEquipmentData(id);
                BATips.instance.oldCE = HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE;
                HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].updateAttribute();
                // let oldCE = HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE;
                // HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].updateAttribute();
                // Tips.instance.showSuccessInGame(oldCE + '上' + (HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].CE - oldCE));
                break;
            default:
                break;
        }
    }

    getNameByJson(index: number, id: number){
        switch (index) {
            case 0:
                return '宝石';
                break;
            case 1:
                return '金币';
                break;
            case 2:
                return '军粮';
                break;
            case 3:
                //装备
                let ejson = getDataById(id);
                return ejson.name;
                break;
            case 4:
                //武魂
                let sjson = getDataById(id);
                return sjson.name + '·武魂';
                break;
            case 5:
                //秘籍
                let bjson = getDataById(id);
                return bjson.name;
                break;
            default:
                break;
        }
        return index + '' + id;
    }

    getImgByJson(index: number, id: number){
        switch (index) {
            case 0:
            case 1:
            case 2:
                return TextureMgr.instance.rewardSfInGame[index];
                break;
            case 3:
                //装备
                return TextureMgr.instance.getEquipmentIconById(id);
                break;
            case 4:
                //武魂
                return TextureMgr.instance.getSoulIconById(id);
                break;
            case 5:
                return TextureMgr.instance.rewardSfInGame[3];
        
            default:
                break;
        }
    }

    getAttInData(index: number, id: number){
        switch (index) {
            case 0:
                return '宝石 x ' + id;
                break;
            case 1:
                return '金币 x ' + id;
                break;
            case 2:
                return '军粮 x ' + id;
                break;
            case 3:
                //装备
                let ejson = getDataById(id);
                return this.getDetailByJson(ejson);
                break;

            case 4:
                //武魂
                let sjson = getDataById(id);
                return this.getDetailByJson(sjson);
                break;
            case 5:
                //秘籍
                let bjson = getDataById(id);
                return this.getDetailByJson(bjson);
                break;
            default:
                break;
        }
        return index + '' + id;
    }

    getDetailByJson(json: any){
        let count: number = 0;
        let str: string = '';
        for (let i = 0; i < baseArrs.length; i++) {
            let item = baseArrs[i];
            if(json[item]){
                str += textArrs[i] + '+' + json[item];
                count ++;
                if(count % 2 == 0){
                    str += '\n';
                }else{
                    str += '  ';
                }
            }
        }
        return str;
    }
    

    // update (dt) {}
}
