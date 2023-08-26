import AllText from "../../i18n/Language";
import { Eight, getDataById, Soul, getLvId, Book } from "../../nativets/Config";
import HeroGlobal from "../../Hero/HeroGlobal";
import TextureMgr from "../../TextureMgr";
import QimenItem from "./QimenItem";
import AdMgr from "../../Ad/AdMgr";
import AdList from "../../Ad/AdList";
import AudioMgr from "../../Audio";
import Menu from "../../Menu";
import Message from "../../Message";
import QQAdMgr from "../../Ad/QQAdMgr";

let LIST = [[50105,50101,40102,40101,30105,30104],
            [50204,40103,30107],
            [50302,40207,40204,30203,30202],
            [50303,40305,30206],
            [50306,40306,30308,30301]];

let LISTSOUL = [[60101,60102,60103,60104,60105,60106,60107,60108],
                [60201,60202,60203,60204,60205,60206,60207,60208],
                [60301,60302,60303,60304,60305,60306,60307,60308],
                [60401,60402,60403,60404,60405,60406,60407,60408],
                [60501,60502,60503,60504,60505,60506,60507,60508],
                [60601,60602,60603,60604,60605,60606,60609]];

let LISTBOOK = [[71101,71102,72101,72102,73101,73102,75101,75102,74101,74102],
                [71201,71202,72201,72202,73201,73202,73203,75201,75202,74201,74202],
                [71301,71302,71303,73301,73302,73303,73304,75301,74301]];

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

const {ccclass, property} = cc._decorator;

@ccclass
export default class Qimen extends cc.Component {
    static instance: Qimen = null;

    @property(cc.Prefab)
    qimenItmePrefab: cc.Prefab = null;

    @property([cc.SpriteFrame])
    iconSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    iconBgSf: cc.SpriteFrame[] = [];

    box1Node: cc.Node;
    box2Node: cc.Node;
    resultNode: cc.Node;
    eightNode: cc.Node;
    anim: cc.Animation;
    cardArrs: cc.Node[];
    resultArrs: cc.Node[];
    itemScripts: QimenItem[];
    iconSp: cc.Sprite;
    iconBgSp: cc.Sprite;
    allBtn: cc.Node;
    closeBtn: cc.Node;
    dataArrs: any[];
    videoBtn: cc.Button;
    openBtn: cc.Button;
    chanceCount: number;
    leftNode: cc.Node;
    eightMidNode: cc.Node;
    eightCenterNode: cc.Node;
    box2TextNode: cc.Node;

    init(){
        this.box1Node = this.node.getChildByName('box1');
        this.box2Node = this.node.getChildByName('box2');
        this.resultNode = cc.instantiate(this.qimenItmePrefab);
        this.resultNode.parent = this.box2Node;
        this.resultNode.scaleX = 0;

        this.leftNode = this.box1Node.getChildByName('left');

        this.box2TextNode = this.box2Node.getChildByName('text');        
        this.iconSp = this.box2Node.getChildByName('icon').getComponent(cc.Sprite);
        this.iconBgSp = this.box2Node.getChildByName('iconBg').getComponent(cc.Sprite);

        this.videoBtn = this.box1Node.getChildByName('video').getComponent(cc.Button);
        this.openBtn = this.box1Node.getChildByName('open').getComponent(cc.Button);

        this.allBtn = this.box2Node.getChildByName('all');
        this.closeBtn = this.box2Node.getChildByName('close');

        this.eightNode = this.box1Node.getChildByName('eight');
        this.eightMidNode = this.box1Node.getChildByName('mid');
        this.eightCenterNode = this.box1Node.getChildByName('center');
        this.anim = this.eightNode.getComponent(cc.Animation);

        this.cardArrs = [];
        this.resultArrs = [];
        this.itemScripts = [];
        for (let i = 0; i < 3; i++) {
            this.cardArrs.push(this.box2Node.getChildByName('' + i));
            let r = cc.instantiate(this.qimenItmePrefab);
            r.parent = this.box2Node;
            r.scaleX = 0;
            r.position = this.cardArrs[i].position;
            this.resultArrs.push(r);
            this.itemScripts.push(r.getComponent(QimenItem));
            this.itemScripts[i].init();
        }
    }

    onLoad () {
        Qimen.instance = this;
        this.node.active = false;
        this.init();
        
        // this.initJson();
        // this.initSoulJson();
        
    }

    // initJson(){
    //     let arrs = [[], [], [], [], []];
    //     for (let i = 0; i < EA.length; i++) {
    //         let e = EA[i];
    //         arrs[e.level - 1].push(e.id);
            
    //     }
    //     cc.log(JSON.stringify({data: arrs}));
    // }

    // initSoulJson(){
    //     let arrs = [[], [], [], [], [], []];
    //     for (let i = 0; i < Book.length; i++) {
    //         let e = Book[i];
    //         arrs[getLvId(parseInt(e.id)) - 1].push(parseInt(e.id));
            
    //     }
    //     cc.log(JSON.stringify({data: arrs}));
    // }

    start () {

    }

    open(){
        this.node.active = true;
        this.box1Node.active = true;
        this.eightNode.stopAllActions();
        this.eightMidNode.stopAllActions();
        this.eightCenterNode.stopAllActions();
        this.eightNode.opacity = 255;
        this.eightMidNode.opacity = 255;
        this.eightCenterNode.opacity = 255;
        AudioMgr.instance.playAudio('CEUp');
        this.leftNode.opacity = 0;
        this.leftNode.stopAllActions();
        this.leftNode.runAction(cc.fadeIn(.3));

        this.eightNode.runAction(cc.rotateBy(.5, -30));
        this.openBtn.interactable = true;
        this.videoBtn.interactable = true;

        this.openBtn.node.active = false;
        this.videoBtn.node.active = false;

        this.scheduleOnce(()=>{
            this.openBtn.node.active = true;
            this.videoBtn.node.active = true;
        }, 1);

        this.box2Node.active = false;
        // this.getArrs(this.getEightJson());

        
    }

    onBtnAll(){
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.奇门抽奖);
        }else{
            this.getAll();
        }
    }

    getAll(){
        for (let i = 0; i < 3; i++) {
            this.showCard(i);
        }
    }

    getEightJson(){
        let ran = Math.random();
        cc.log(ran);

        let index = 0;
        if(ran <= .25){

        }else if(ran > .25 && ran <= .4){
            index = 1;
        }else if(ran > .4 && ran <= .5){
            index = 2;
        }else if(ran > .5 && ran <= .6){
            index = 3;
        }else if(ran > .6 && ran <= .8){
            index = 4;
        }else{
            index = 5;
        }
        this.iconBgSp.spriteFrame = this.iconBgSf[index];
        this.iconSp.spriteFrame = this.iconSf[index];
        return Eight[index];
    }

    getArrs(json: any){
        
        let dataArrs = [];
        for (let i = 0; i < ATTARRS.length; i++) {

            if(json[ATTARRS[i]]){
                let arrs = json[ATTARRS[i]];
                for (let j = 0; j < arrs.length; j++) {
                    let offset = json.factor[j] * HeroGlobal.instance.Level;
                    let id = Math.floor(arrs[j] + offset);
                    console.log(id);
                    
                    switch (i) {
                        case 3:
                            // 装备
                            if(id > LIST.length){
                                id = LIST.length;
                            }
                            id = LIST[id - 1][Math.floor(Math.random() * LIST[id - 1].length)];
                            break;
                        case 4:
                            // 武魂
                            if(id > LISTSOUL.length){
                                id = LISTSOUL.length;
                            }
                            id = LISTSOUL[id - 1][Math.floor(Math.random() * LISTSOUL[id - 1].length)];
                            break;
                        case 5:
                            // 秘籍
                            if(id > LISTBOOK.length){
                                id = LISTBOOK.length;
                            }
                            id = LISTBOOK[id - 1][Math.floor(Math.random() * LISTBOOK[id - 1].length)];
                            break;
                        default:
                            break;
                    }
                    dataArrs.push({index: i, id: id});
                }
                // let num = parseInt(arrs[Math.floor(Math.random() * arrs.length)]);
                // dataArrs.push({index: i, id: num});
            }
        }


        

        // 打乱顺序
        for (let ii = 0; ii < dataArrs.length; ii++) {
            // const element = dataArrs[ii];
            let ran = Math.floor(Math.random() * dataArrs.length);
            let temp = dataArrs[ran];
            dataArrs[ran] = dataArrs[ii];
            dataArrs[ii] = temp;
        }
        console.log('DataArrs1', dataArrs);

        this.dataArrs = dataArrs;
        for (let k = 0; k < dataArrs.length; k++) {
            let dIndex = dataArrs[k].index;
            let dId = dataArrs[k].id;
            let img = this.getImgByJson(dIndex, dId);
            let name = this.getNameByJson(dIndex, dId);
            let text = this.getAttInData(dIndex, dId);
            this.itemScripts[k].setItem(dIndex, img, name, DESARRS[dataArrs[k].index], text);
        }

    }

    unlockReward(data: any){
        if(!data) return;
        cc.log('reward',data);
        let id = parseInt(data.id);
        switch (data.index) {
            case 0:
                // HeroGlobal.instance.Jade += id;
                // HeroGlobal.instance.saveHeroGlobal();
                Menu.instance.addJade(id);
                break;
            case 1:
                // HeroGlobal.instance.Coins += id;
                // HeroGlobal.instance.saveHeroGlobal();
                Menu.instance.addCoins(id);
                break;
            case 2:
                // HeroGlobal.instance.Life += id;
                // HeroGlobal.instance.saveHeroGlobal();
                Menu.instance.addLife(id);
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
        this.close();
    }

    close(){
        this.node.active = false;
    }

    onBtnOpen(){
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.免费奇门);
        }else{
            this.onOpen();
        }
    }

    onBtnOpenByJada(){
        AudioMgr.instance.playAudio('BtnClick');
        if(HeroGlobal.instance.Jade >= 40){
            HeroGlobal.instance.Jade -= 40;
            Menu.instance.refreshTopLabel(true);
            HeroGlobal.instance.saveHeroGlobal();
            this.onOpen();
        }else{
            Message.instance.showLack('jade');
        }
    }

    onOpen(){
        AudioMgr.instance.playAudio('Eight');
        this.scheduleOnce(()=>{
            AudioMgr.instance.playAudio('CEUp');
        }, 4.8);
        this.leftNode.stopAllActions();
        this.leftNode.runAction(cc.fadeOut(3));
        this.openBtn.interactable = false;
        this.videoBtn.interactable = false;
        this.anim.stop();
        this.anim.play();
        this.eightMidNode.runAction(cc.sequence(cc.delayTime(.5), cc.rotateBy(3.5, -1080)));
        this.eightCenterNode.runAction(cc.sequence(cc.delayTime(1), cc.rotateBy(3, -4096)));
        this.anim.on(cc.Animation.EventType.FINISHED, this.showBox2, this);
        
        this.getArrs(this.getEightJson());
    }

    showBox2(){
        this.eightNode.runAction(cc.fadeOut(.9));
        this.eightMidNode.runAction(cc.fadeOut(.9));
        this.eightCenterNode.runAction(cc.fadeOut(.9));
        this.scheduleOnce(()=>{
            this.box1Node.active = false;
            this.initCards();
            this.chanceCount = 1;
            this.box2Node.active = true;
            this.iconSp.node.opacity = 0;
            this.iconBgSp.node.opacity = 0;
            this.iconSp.node.runAction(cc.fadeIn(.3));
            this.iconBgSp.node.runAction(cc.fadeIn(.3));
            this.allBtn.active = false;
            // this.scheduleOnce(()=>{
            //     this.allBtn.active = true;
            // }, 2);
            this.closeBtn.active = false;
            // this.scheduleOnce(()=>{
            //     this.closeBtn.active = true;
            // }, 4.5);
        }, 1);
        
    }

    initCards(){
        // this.resultNode.scaleX = 0;
        for (let i = 0; i < this.cardArrs.length; i++) {
            this.cardArrs[i].scaleX = 1;
            this.cardArrs[i].stopAllActions();
            this.cardArrs[i].opacity = 0;
            this.cardArrs[i].runAction(cc.sequence(cc.delayTime(.45 * (i + 1)), cc.fadeIn(.3)));
            this.resultArrs[i].scaleX = 0;
        }
        this.box2TextNode.active = false;
        this.scheduleOnce(()=>{
            this.box2TextNode.active = true;
        }, 1.65);
    }

    onBtnCard(event: cc.Event){
        let index = parseInt(event.target.name);
        if(this.chanceCount < 1){
            return;
        }
        AudioMgr.instance.playAudio('BtnClick');
        this.chanceCount --;
        this.showCard(index);
    }

    showCard(index: number){
        let card = this.cardArrs[index];
        if(card.scaleX != 1){
            //已经开过
            return;
        }
        AudioMgr.instance.playAudio('CEUp');
        card.stopAllActions();
        let act = cc.sequence(cc.scaleTo(.5, 0, 1), cc.callFunc(()=>{
            this.resultArrs[index].runAction(cc.scaleTo(.12, .85, .85));
            this.unlockReward(this.dataArrs[index]);
            if(!this.allBtn.active){
                this.allBtn.active = true;
                this.scheduleOnce(()=>{
                    this.closeBtn.active = true;
                }, 0);
            }
        }));
        card.runAction(act);
    }

    onEnable(){
        if(AdMgr.instance){
            AdMgr.instance.hideBanner();
        }
        if(QQAdMgr.instance){
            QQAdMgr.instance.QQBlockAdHide();
        }
    }

    onDisable(){
        if(AdMgr.instance){        
            AdMgr.instance.showBannerAd(AdList.BANNERLIST.首页右下);
        }
        if(QQAdMgr.instance){
            QQAdMgr.instance.QQBlockAdShow(1);
        }
    }

    // update (dt) {}
}
