import AllText from "../i18n/Language";
import MapBoxItem from "./MapBoxItem";
import AudioMgr from "../Audio";
import { getDataById } from "../nativets/Config";
import TextureMgr from "../TextureMgr";
import HeroGlobal from "../Hero/HeroGlobal";
import AdMgr from "../Ad/AdMgr";
import AdList from "../Ad/AdList";
import Map from "../Map";

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
export default class MapBoxLayout extends cc.Component {
    static instance: MapBoxLayout = null;

    @property(cc.Prefab)
    mbItemPrefab: cc.Prefab = null;
    boxNode: cc.Node;
    itemScripts: any[];
    dataArrs: any[];
    titleLabel: cc.Label;
    doubleBtn: cc.Node;
    closeBtn: cc.Node;
    closeLabel: cc.Node;

    init(){
        this.boxNode = this.node.getChildByName('box');
        this.titleLabel = this.boxNode.getChildByName('title').getComponent(cc.Label);
        this.doubleBtn = this.boxNode.getChildByName('double');
        this.closeBtn = this.boxNode.getChildByName('btnclose');
        this.closeLabel = this.boxNode.getChildByName('close');

        this.initLayout();
        this.node.active = false;
    }

    initLayout(){
        this.itemScripts = [];
        for (let i = 0; i < 3; i++) {
            let b = cc.instantiate(this.mbItemPrefab);
            b.name = '' + i;
            b.parent = this.boxNode;
            b.position = cc.v2((i - 1) * 210, 0);
            this.itemScripts.push(b.getComponent(MapBoxItem));
            this.itemScripts[i].init();
        }
    }
    
    onLoad () {
        MapBoxLayout.instance = this;
        this.init();
    }

    onOpen(json: any, state: number, i: number, j: number){
        this.getArrs(json);
        this.setState(state, i, j);
        
        this.node.active = true;
    }

    setState(state: number, i: number, j: number){
        // 未解锁 可领取 已经领取

        switch (state) {
            case -1:
                this.titleLabel.string = '未解锁';
                this.doubleBtn.active = false;
                this.closeBtn.active = true;
                this.closeLabel.active = false;
                break;
            case 0:
                this.titleLabel.string = '领取成功';
                this.doubleBtn.active = true;
                this.closeBtn.active = false;
                this.closeBtn.active = true;
                this.getAll();
                HeroGlobal.instance.MapBox[i][j] = 1;
                HeroGlobal.instance.setMapBox(HeroGlobal.instance.MapBox);
                break;
            case 1:
                this.titleLabel.string = '已领取';
                this.doubleBtn.active = false;
                this.closeBtn.active = true;
                this.closeBtn.active = false;
                break;
            default:
                break;
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
                HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].updateAttribute();
                break;
            default:
                break;
        }
    }

    onBtnAll(){
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.双倍领取);
        }else
        this.getAll();
    }

    getAll(){
        for (let i = 0; i < this.dataArrs.length; i++) {
            this.unlockReward(this.dataArrs[i]);
        }
        HeroGlobal.instance.saveEquipmentArrs();
        this.onClose();
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
        this.dataArrs = dataArrs;

        for (let j = 0; j < dataArrs.length; j++) {
            let dIndex = dataArrs[j].index;
            let dId = dataArrs[j].id;
            let img = this.getImgByJson(dIndex, dId);
            let name = this.getNameByJson(dIndex, dId);
            let text = this.getAttInData(dIndex, dId);
            this.itemScripts[j].setItem(dIndex, img, name, DESARRS[dataArrs[j].index], text);
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

    onBtnClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onClose();
    }

    onClose(){
        this.node.active = false;
        // this.inOpen = false; 
        Map.instance.refreshMapBoxState(Map.instance.curStar);
    }

    start () {

    }

    // update (dt) {}
}
