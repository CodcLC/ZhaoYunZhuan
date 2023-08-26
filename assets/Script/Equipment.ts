import HeroGlobal from "./Hero/HeroGlobal";
import { Weapon, HeroSpName, HeroName, PetName, getTypeId, getLvId, getIndexId, Ornament, getWhoId, SkillNameArrs, getSoulId, getSoulIndexById, Skill, getDataById, Pet, SoulRate, SoulSubRate } from "./nativets/Config";
import TextureMgr from "./TextureMgr";
import EquipmentDialog from "./EquipmentDialog";
import MenuSelect from "./MenuSelect";
import SoulDialog from "./SoulDialog";
import Menu from "./Menu";
import Message from "./Message";
import AudioMgr from "./Audio";
import AllText from "./i18n/Language";
import Statistics from "./Tool/Statistics";
import Hero from "./Hero/Hero";
import DataMgr from "./DataMgr";
import Tips from "./Tips";
import AdMgr from "./Ad/AdMgr";
import Global from "./nativets/Global";
import AdList from "./Ad/AdList";

const {ccclass, property} = cc._decorator;
const EARRS: string[] = ['Weapon', 'Armor', 'Wing', 'Ornament', 'Ring'];

let baseArrs: string[] = ['atk', 'def', 'hp', 'ls', 'sp', 'cr', 'arp', 'bonus', 'cd', 'miss', 'exp', 'gold'];
let tailArrs: string[] = ['', '', '', '%', '%', '%', '', '%', '%', '%', '%', '%'];
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
export default class Equipment extends cc.Component {
    static instance: Equipment = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property([cc.SpriteFrame])
    leftSf: cc.SpriteFrame[] = [];

    listSelect: cc.Node;
    listIndex: number = -1;
    leftNode: cc.Node;
    rightNode: cc.Node;
    equipmentNode: cc.Node;
    titleSelects: cc.Node[] = [];
    boxLvArrs: cc.Sprite[] = [];
    boxIconsArrs: cc.Sprite[] = [];
    titleIndex: number;
    equipmentLayout: cc.Node;
    boxSelect: cc.Node;
    DetailNode: cc.Node;
    detailName: cc.Label;
    detailHp: cc.Label;
    detailDef: cc.Label;
    detailAtk: cc.Label;
    detailBouns: cc.Label;
    detailCr: cc.Label;
    detailMiss: cc.Label;
    petNode: cc.Node;
    petIcon: cc.Sprite;
    petName: cc.Label;
    petLv: cc.Label;
    petLvnow: cc.Label;
    petLvnext: cc.Label;
    petHpnow: cc.Label;
    petHpnext: cc.Label;
    petAtknow: cc.Label;
    petAtknext: cc.Label;
    skillNode: cc.Node;
    soulNode: cc.Node;
    listLayoutArrs: cc.Node[];
    skillStarArrs: cc.Sprite[];
    equipmentRight: cc.Node;
    petRight: cc.Node;
    petLeftName: cc.Label;
    petLeftValue0: cc.Label;
    petLeftValue1: cc.Label;
    skillRight: cc.Node;
    equipmentDialog: cc.Node;
    dataArrs: number[];
    equipmentIconArrs: cc.Sprite[];
    equipmentBgArrs: cc.Sprite[];
    equipmentLockArrs: cc.Node[];
    skillIconArrs: cc.Sprite[];
    skillLvArrs: cc.Label[];
    skillNameArrs: cc.Label[];
    skillIndex: number;
    skillSelect: cc.Node;
    skillName: cc.Label;
    skillIcon: cc.Sprite;
    soulRight: cc.Node;
    soulBoxSelect: cc.Node;
    soulLayout: cc.Node;
    soulTitleSelects: cc.Node[];
    soulTitleIndex: number;
    soulBoxLvArrs: cc.Sprite[] = [];
    soulBoxIconsArrs: cc.Sprite[] = [];
    equipedArrs: number[];
    soulDialog: cc.Node;
    soulDataArrs: number[];
    icon0: cc.Sprite;
    icon1: cc.Sprite;
    icon2: cc.Sprite;
    soulCompressArrs: any[];
    soulIconArrs: cc.Sprite[];
    equipmentLeft: cc.Node;
    soulLeft: cc.Node;
    soulHC: cc.Node;
    soulFM: cc.Node;
    fmIcon0: cc.Sprite;
    fmIcon1: cc.Sprite;
    fmlv: cc.Sprite;
    soulBg: cc.Node;
    soulEffect: cc.Node;
    soulEnchantArrs: number[];
    skillLv: cc.Label;
    skillDmg: cc.Label;
    skillDes: cc.Label;
    skillCd: cc.Label;
    heroSkillArrs: number[];
    skillBgArrs: cc.Node[];
    skillUp: cc.Node;
    skillCionsLabel: cc.Label;
    skillPrice: number;

    soulHCTitle: cc.Label;
    soulHCText: cc.Label;
    soulFMTitle: cc.Label;
    soulFMText: cc.Label;
    soulHCJade: cc.Label;
    soulHCBtnMain: cc.Node;
    soulHCBtnSub: cc.Node;
    heroIndex: number;
    petLevel: number;
    petPrice: number;
    petJade: cc.Label;
    petIndex: number;
    petItem: cc.Sprite;
    petLeftText0: cc.Label;
    petleftText1: cc.Label;
    petDescription0: cc.Label;
    petDescription1: cc.Label;
    petUpgrade: cc.Node;
    soulCheck0: cc.Toggle;
    soulCheck1: cc.Toggle;
    extJade: number = 0;
    soulHCRate: cc.Label;
    extRate: number;
    soulRateVideo: number;

    


    init(){
        this.listSelect = this.node.getChildByName('list').getChildByName('select');
        this.leftNode = this.node.getChildByName('Left');
        
        this.rightNode = this.node.getChildByName('Right');
        this.equipmentNode = this.node.getChildByName('Equipment');
        this.equipmentLeft = this.equipmentNode.getChildByName('Left');
        this.skillNode = this.node.getChildByName('Skill');
        this.soulNode = this.node.getChildByName('Soul');
        this.petNode = this.node.getChildByName('Pet');
        this.listLayoutArrs = [this.equipmentNode, this.skillNode, this.soulNode, this.petNode];


        this.initEquipment();
        this.initSkill();
        this.initPet();
        this.initSoul();

        this.titleIndex = 0;
        this.refreshTitle();
        this.soulTitleIndex = 0;
        this.refreshSoulTitle();
        cc.loader.setAutoRelease(this.itemPrefab, true);
        cc.director.on('RefreshSelect', this.refreshOnSelect, this);
        cc.director.on('RefreshSp', this.onRefreshSp, this);
        
    }

    onRefreshSp(index: number){
        if(this.heroIndex != index){
            this.heroIndex = index;
            if(this.equipmentDialog.active){
                this.equipmentRight.active = true;
                this.equipmentDialog.active = false;
            }
        }
        
        
        
        this.refreshEquipmentIcon(index);
    }

    initEquipment(){
        this.DetailNode = this.equipmentLeft.getChildByName('Detail');
        this.detailName = this.DetailNode.getChildByName('name').getComponent(cc.Label);
        this.detailHp = this.DetailNode.getChildByName('hp').getComponent(cc.Label);
        this.detailDef = this.DetailNode.getChildByName('def').getComponent(cc.Label);
        this.detailAtk = this.DetailNode.getChildByName('atk').getComponent(cc.Label);
        this.detailBouns = this.DetailNode.getChildByName('bonus').getComponent(cc.Label);
        this.detailCr = this.DetailNode.getChildByName('cr').getComponent(cc.Label);
        this.detailMiss = this.DetailNode.getChildByName('miss').getComponent(cc.Label);

        this.equipmentRight = this.equipmentNode.getChildByName('Right');
        this.equipmentDialog = this.equipmentNode.getChildByName('Dialog');
        this.equipmentDialog.getComponent(EquipmentDialog).init();
        this.equipmentLayout = this.equipmentRight.getChildByName('Layout');
        this.boxSelect = this.equipmentLayout.getChildByName('select');
        for (let i = 0; i < 5; i++) {
            this.titleSelects.push(this.equipmentRight.getChildByName('' + i).getChildByName('select'));
        }
        this.equipmentIconArrs = [];
        this.equipmentBgArrs = [];
        this.equipmentLockArrs = [];
        for (let j = 0; j < 5; j++) {
            let item = this.equipmentLeft.getChildByName(EARRS[j]);
            this.equipmentIconArrs.push(item.getChildByName('icon').getComponent(cc.Sprite));
            this.equipmentBgArrs.push(item.getChildByName('bg').getComponent(cc.Sprite));
            this.equipmentLockArrs.push(item.getChildByName('lock'));
        }
        this.createLayout();
    }

    initSoul(){
        this.soulLeft = this.soulNode.getChildByName('Left');
        this.soulRight = this.soulNode.getChildByName('Right');
        this.soulBg = this.soulNode.getChildByName('bg');
        this.soulHC = this.soulLeft.getChildByName('hc');
        this.soulFM = this.soulLeft.getChildByName('fm');
        this.soulEffect = this.soulHC.getChildByName('effect');
        this.soulLayout = this.soulRight.getChildByName('Layout');
        this.soulBoxSelect = this.soulLayout.getChildByName('select');
        
        //视频加30%成功率
        this.soulRateVideo = -1;

        this.soulCompressArrs = [0, 0, 0];
        this.soulEnchantArrs = [0, 0];
        this.soulTitleSelects = [];
        for (let i = 0; i < 6; i++) {
            this.soulTitleSelects.push(this.soulRight.getChildByName('' + i).getChildByName('select'));
        }
        this.soulIconArrs = [];
        this.icon0 = this.soulHC.getChildByName('0').getComponent(cc.Sprite);
        this.icon1 = this.soulHC.getChildByName('1').getComponent(cc.Sprite);
        this.icon2 = this.soulHC.getChildByName('2').getComponent(cc.Sprite);
        this.soulHCTitle = this.soulHC.getChildByName('title').getComponent(cc.Label);
        this.soulHCText = this.soulHC.getChildByName('text').getComponent(cc.Label);
        this.soulHCJade = this.soulHC.getChildByName('compress').getChildByName('jade').getComponent(cc.Label);

        this.soulHCRate = this.soulHC.getChildByName('rate').getComponent(cc.Label);
        this.soulCheck0 = this.soulHC.getChildByName('check0').getComponent(cc.Toggle);
        this.soulCheck1 = this.soulHC.getChildByName('check1').getComponent(cc.Toggle);

        

        this.soulIconArrs = [this.icon0, this.icon1, this.icon2];

        this.fmIcon0 = this.soulFM.getChildByName('0').getComponent(cc.Sprite);
        this.fmIcon1 = this.soulFM.getChildByName('1').getComponent(cc.Sprite);
        this.soulFMTitle = this.soulFM.getChildByName('title').getComponent(cc.Label);
        this.soulFMText = this.soulFM.getChildByName('text').getComponent(cc.Label);
        this.fmlv = this.soulFM.getChildByName('lv').getComponent(cc.Sprite);

        this.createSoulLayout();
        this.soulDialog = this.soulNode.getChildByName('Dialog');
        this.soulDialog.getComponent(SoulDialog).init();
    }

    initSkill(){
        this.skillRight = this.skillNode.getChildByName('Right');
        this.skillName = this.skillRight.getChildByName('name').getComponent(cc.Label);
        this.skillIcon = this.skillRight.getChildByName('icon').getComponent(cc.Sprite);
        this.skillLv = this.skillRight.getChildByName('lv').getComponent(cc.Label);
        this.skillCd = this.skillRight.getChildByName('cd').getComponent(cc.Label);
        this.skillUp = this.skillRight.getChildByName('up');
        this.skillCionsLabel = this.skillUp.getChildByName('coins').getComponent(cc.Label);
        this.skillDmg = this.skillRight.getChildByName('dmgLabel').getComponent(cc.Label);
        this.skillDes = this.skillRight.getChildByName('desLabel').getComponent(cc.Label);
        
        let star: cc.Node = this.skillRight.getChildByName('0');
        this.skillStarArrs = [star.getComponent(cc.Sprite)];
        for (let i = 1; i < 20; i++) {
            let s = cc.instantiate(star);
            let row: number = i < 10 ? 0 : 1;
            let col: number = row == 0 ? i : i - 10;
            s.parent = this.skillRight;
            s.x = -157.5 + col * 35;
            s.y = -112 - 32 * row;
            this.skillStarArrs.push(s.getComponent(cc.Sprite));
        }
        this.setStar(1);

        this.skillSelect = this.skillNode.getChildByName('select');
        this.skillIconArrs = [];
        this.skillLvArrs = [];
        this.skillNameArrs = [];
        this.skillBgArrs = [];
        for (let j = 0; j < 7; j++) {
            this.skillIconArrs.push(this.skillNode.getChildByName('' + j).getComponent(cc.Sprite));
            this.skillLvArrs.push(this.skillNode.getChildByName('lv' + j).getComponent(cc.Label));
            this.skillBgArrs.push(this.skillNode.getChildByName('c' + j));
            this.skillNameArrs.push(this.skillNode.getChildByName('name' + j).getComponent(cc.Label));
        }
    }

    initPet(){
        this.petRight = this.petNode.getChildByName('Right');
        this.petIcon = this.petRight.getChildByName('icon').getComponent(cc.Sprite);
        this.petName = this.petRight.getChildByName('name').getComponent(cc.Label);
        this.petLv = this.petRight.getChildByName('lv').getComponent(cc.Label);
        this.petLvnow = this.petRight.getChildByName('lvnow').getComponent(cc.Label);
        this.petLvnext = this.petRight.getChildByName('lvnext').getComponent(cc.Label);
        this.petHpnow = this.petRight.getChildByName('hpnow').getComponent(cc.Label);
        this.petHpnext = this.petRight.getChildByName('hpnext').getComponent(cc.Label);

        this.petDescription0 = this.petRight.getChildByName('d0').getComponent(cc.Label);
        this.petDescription1 = this.petRight.getChildByName('d1').getComponent(cc.Label);

        this.petJade = this.petRight.getChildByName('coins').getComponent(cc.Label);
        this.petItem = this.petRight.getChildByName('item').getComponent(cc.Sprite);
        this.petUpgrade = this.petRight.getChildByName('upgrade');
        // 暂时只用仙玉升级
        this.petItem.spriteFrame = TextureMgr.instance.rewardSfInGame[0];
        // this.petAtknow = this.petRight.getChildByName('atknow').getComponent(cc.Label);
        // this.petAtknext = this.petRight.getChildByName('atknext').getComponent(cc.Label);

        this.petLeftName = this.petNode.getChildByName('name').getComponent(cc.Label);
        this.petLeftValue0 = this.petNode.getChildByName('v0').getComponent(cc.Label);
        this.petLeftValue1 = this.petNode.getChildByName('v1').getComponent(cc.Label);
        this.petLeftText0 = this.petNode.getChildByName('t0').getComponent(cc.Label);
        this.petleftText1 = this.petNode.getChildByName('t1').getComponent(cc.Label);


    }

    createLayout(){
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = 'Equipment';
        eventHandler.handler = 'onBtnBoxSelect';
        let row: number = 5;
        let col: number = 4;
        this.boxLvArrs = [];
        this.boxIconsArrs = [];
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let index: number = i * 4 + j;
                let n = cc.instantiate(this.itemPrefab);
                n.name = index + '';
                n.getComponent(cc.Button).clickEvents.push(eventHandler);
                n.parent = this.equipmentLayout;
                n.position = cc.v2(-165 + 110 * j, 192.5 - 107 * i);
                this.boxLvArrs.push(n.getChildByName('lv').getComponent(cc.Sprite));
                this.boxIconsArrs.push(n.getChildByName('icon').getComponent(cc.Sprite));
            } 
        }
        this.boxSelect.parent = null;
        this.boxSelect.parent = this.equipmentLayout;
    }

    createSoulLayout(){
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = 'Equipment';
        eventHandler.handler = 'onBtnSoulBoxSelect';
        let row: number = 5;
        let col: number = 4;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let index: number = i * 4 + j;
                let n = cc.instantiate(this.itemPrefab);
                n.name = index + '';
                n.getComponent(cc.Button).clickEvents.push(eventHandler);
                n.parent = this.soulLayout;
                n.position = cc.v2(-165 + 110 * j, 192.5 - 107 * i);
                this.soulBoxLvArrs.push(n.getChildByName('lv').getComponent(cc.Sprite));
                this.soulBoxIconsArrs.push(n.getChildByName('icon').getComponent(cc.Sprite));
            } 
        }
        this.soulBoxSelect.parent = null;
        this.soulBoxSelect.parent = this.soulLayout;
    }


    onLoad () {
        Equipment.instance = this;
        this.init();
    }

    start () {

    }

    onBtnTitleSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        if(this.titleIndex != index){
            this.titleIndex = index;
            this.refreshTitle();
        }
    }

    onBtnEquipmentLeftSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        let arrs: number[] = [0, 1, 3, 4, 2];
        
        let id: number = this.equipedArrs[arrs[index]];
        cc.log(this.equipedArrs, id);
        if(id){
            if(this.titleIndex != index){
                this.titleIndex = index;
                this.refreshTitle();
            }
            EquipmentDialog.instance.onOpen(id);
            this.equipmentRight.active = false;
        }else{
            this.equipmentRight.active = true;
            this.equipmentDialog.active = false;
            if(this.titleIndex != index){
                this.titleIndex = index;
                this.refreshTitle();
            }
        }
    }

    onBtnSoulTitleSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        if(this.soulTitleIndex != index){
            this.soulTitleIndex = index;
            this.refreshSoulTitle();
        }
    }

    setSoulTitleIndex(index: number){
        this.soulTitleIndex = index;
        this.refreshSoulTitle();
    }

    onBtnListSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        this.onListSelect(index);
    }

    onListSelect(index: number){
        // if(Equipment.instance.listIndex != index){
            Equipment.instance.listIndex = index;
            for (let i = 0; i < 4; i++) {
                this.listLayoutArrs[i].active = i == index;
            }
            //Soul界面默认是合成界面
            this.soulHC.active = true;
            this.soulFM.active = false;
            this.soulRight.active = !this.soulDialog.active;

            //Equipment界面默认右边打开
            this.equipmentLeft.active = true;

            MenuSelect.instance.node.active = (index != 2);
            cc.director.emit('RefreshIcon');
            this.refreshList();
        // }
    }

    onBtnBoxSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        if(this.equipmentLeft.active){
            let index: number = parseInt(event.target.name);
            this.boxSelect.position = cc.v2(event.target.x, event.target.y + 2);
            if(this.dataArrs){
                if(this.dataArrs[index]){
                    EquipmentDialog.instance.onOpen(this.dataArrs[index]);
                    this.equipmentRight.active = false;
                }
            }
        }else{
            // 附魔界面
            let sf: cc.SpriteFrame = event.target.getChildByName('icon').getComponent(cc.Sprite).spriteFrame;
            let lvsf: cc.SpriteFrame = event.target.getChildByName('lv').getComponent(cc.Sprite).spriteFrame;
            this.fmIcon1.spriteFrame = sf;
            this.fmlv.spriteFrame = lvsf;
        }
        
                                                                                                                                                                                                                                                                                                       
    }

    onBtnSoulBoxSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        this.soulBoxSelect.position = cc.v2(event.target.x, event.target.y + 2);

        if(this.soulHC.active){
            if(this.soulDataArrs){
                if(this.soulDataArrs[index]){
                    SoulDialog.instance.onOpen(this.soulDataArrs[index]);
                    this.soulRight.active = false;
                }
            }  
        }else{
            // 附魔界面
            this.soulEnchantArrs[1] = this.soulDataArrs[index];
            let sf: cc.SpriteFrame = event.target.getChildByName('icon').getComponent(cc.Sprite).spriteFrame;
            // let lvsf: cc.SpriteFrame = event.target.getChildByName('lv').getComponent(cc.Sprite).spriteFrame;
            this.fmIcon1.spriteFrame = sf;
            // this.fmlv.spriteFrame = lvsf;

            let soulData = getDataById(this.soulDataArrs[index]);
            
            this.soulFMTitle.string = soulData.name;
            let soulStr: string = this.getDetailByJson(soulData);

            this.soulFMText.string = soulStr;
            
        }

                                                                                                                                                                                                                                                                                            
    }

    getDetailByJson(json: any){
        let count: number = 0;
        let str: string = '';
        for (let i = 0; i < baseArrs.length; i++) {
            let item = baseArrs[i];
            if(json[item]){
                str += textArrs[i] + '+' + json[item] + tailArrs[i];
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

    refreshSoulCompressRate(){
        if(this.soulCompressArrs[0]){
            if(this.soulCompressArrs[1] || this.soulCompressArrs[2]){
                let mainLv = getLvId(this.soulCompressArrs[0]);
                
                let extRate = SoulRate[mainLv - 1];
                let extJade = 0;
                if(this.soulCheck0.isChecked){
                    extRate += .15;
                    extJade += 20;
                }
                if(this.soulCheck1.isChecked){
                    extRate += .3;
                    extJade += 40;
                }

                let subRate = 0;
                if(this.soulCompressArrs[1]){
                    subRate += SoulSubRate[getLvId(this.soulCompressArrs[1]) - 1];
                }

                if(this.soulCompressArrs[2]){
                    subRate += SoulSubRate[getLvId(this.soulCompressArrs[2]) - 1];
                }

                cc.log(mainLv, extJade, extRate, subRate);

                this.extJade = mainLv * 10 + extJade;
                this.extRate = extRate + subRate;

                if(this.soulRateVideo == 1){
                    this.extRate += .3;
                }

                if(this.extRate > 1){
                    this.extRate = 1;
                }
                


                this.soulHCJade.string = this.extJade + '';
                this.soulHCRate.string = `(进阶成功率: ${(this.extRate * 100).toFixed(0)}%)`;

            }else{
                this.soulHCRate.string = ''; 
            }
            
        }else{
            this.soulHCRate.string = '';
        }
        

        
    }

    onBtnSoulCheck(){
        this.refreshSoulCompressRate();
    }

    onBtnSoulCompress(){
        AudioMgr.instance.playAudio('BtnClick');

        if(this.soulCompressArrs[0] && (this.soulCompressArrs[1] || this.soulCompressArrs[2])){
            //消耗2个
            let index1: number = HeroGlobal.instance.SoulArrs.indexOf(this.soulCompressArrs[1]);
            if(index1 != -1)
            HeroGlobal.instance.SoulArrs.splice(index1, 1);
            let index2: number = HeroGlobal.instance.SoulArrs.indexOf(this.soulCompressArrs[2]);
            if(index2 != -1)
            HeroGlobal.instance.SoulArrs.splice(index2, 1);

            // 视频点
            if(this.soulRateVideo == -1 && this.extRate <= .7){
                let success = ()=>{
                    if(AdMgr.instance){

                        Global.getInstance().inGame = false;
                        AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.武魂合成);
                    }else{
                        this.soulRateVideo = 1;
                        this.refreshSoulCompressRate();
                    }
                }

                let cancel = ()=>{
                    this.soulRateVideo = 0;
                }

                Message.instance.show('提示', '本次进阶成功率低，是否观看视频提升30%成功几率?', success, true, cancel);
                return;
            }

            if(HeroGlobal.instance.Jade >= this.extJade){
                HeroGlobal.instance.Jade -= this.extJade;
                Menu.instance.refreshTopLabel();

                this.soulRateVideo = -1;
                //如果成功

                if(Math.random() < this.extRate){
                    
                    DataMgr.instance.taskCountData[7] ++;
                    DataMgr.instance.saveSaveDate();

                    HeroGlobal.instance.AchieveCountData[7] ++;
                    HeroGlobal.instance.saveHeroGlobal();

                    this.soulBg.runAction(cc.sequence(cc.rotateBy(1, 360), cc.callFunc(()=>{
                        let id: number = parseInt(this.soulCompressArrs[0]);
                        let lv: number = getLvId(id);
                        if(lv < 6){
                            if(id == 60508 || id ==60507){
                                id = 60609;
                            }else
                            id += 100;
                            let index: number = HeroGlobal.instance.SoulArrs.indexOf(this.soulCompressArrs[0]);
                            HeroGlobal.instance.SoulArrs[index] = id;
                            cc.log(HeroGlobal.instance.SoulArrs);
                            this.icon1.spriteFrame = null;
                            this.icon2.spriteFrame = null;
                            this.soulCompressArrs[1] = 0;
                            this.soulCompressArrs[2] = 0;
                            this.icon0.spriteFrame = TextureMgr.instance.getSoulIconById(id);
                            this.soulCompressArrs[0] = id;
                            this.setSoulHCDialog(id);
                            this.setSoulTitleIndex(lv);
                            this.showSoulEffect();
                            HeroGlobal.instance.saveEquipmentArrs();
                        }
                    })));
                    Tips.instance.showRankUp(true);
                    Statistics.getInstance().reportEvent('升级武魂');
                }else{
                    this.showSoulEffect();
                    this.icon1.spriteFrame = null;
                    this.icon2.spriteFrame = null;
                    this.soulCompressArrs[1] = 0;
                    this.soulCompressArrs[2] = 0;
                    this.refreshSoulCompressRate();
                    this.setSoulTitleIndex(this.soulTitleIndex);
                    Tips.instance.showRankUp(false);
                    HeroGlobal.instance.saveHeroGlobal();
                }

            }else{
                Message.instance.showLack('jade');
            }

            
        }

        
    }

    showSoulEffect(){
        this.soulEffect.active = true;
        let anim = this.soulEffect.getComponent(cc.Animation);
        anim.play();
        anim.on(cc.Animation.EventType.LASTFRAME, ()=>{
            this.soulEffect.active = false;
        });
    }

    onBtnSoulEnchant(){
        AudioMgr.instance.playAudio('BtnClick');
        this.soulBg.runAction(cc.sequence(cc.rotateBy(1, 360), cc.callFunc(()=>{
            let arrs2 = HeroGlobal.instance.getDataArrsByIndex(this.titleIndex + 1);
            let index1: number = arrs2.indexOf(this.soulEnchantArrs[0]);
            let soulIndex: number = getSoulIndexById(this.soulEnchantArrs[1]);
            let soulStr = soulIndex > 9 ? '' + soulIndex : '0' + soulIndex;
            let newId = this.soulEnchantArrs[0] + '';
            let arrs = newId.split('');
            
            arrs[5] = soulStr[0];
            arrs[6] = soulStr[1];
            newId = arrs.join('');

            // 删除附魔上的武魂
            let indexInSoul: number = HeroGlobal.instance.SoulArrs.indexOf(this.soulEnchantArrs[1]);
            HeroGlobal.instance.SoulArrs.splice(indexInSoul, 1);

            // cc.log('outtttttttt',this.soulEnchantArrs, newId);

            // HeroGlobal.instance.WeaponArrs[index1] = parseInt(newId);
            switch (this.titleIndex) {
                case 0:
                    HeroGlobal.instance.WeaponArrs[index1] = parseInt(newId);
                    break;
                case 1:
                    HeroGlobal.instance.ArmorArrs[index1] = parseInt(newId);
                    break;
                case 2:
                    HeroGlobal.instance.RingArrs[index1] = parseInt(newId);
                    break;
                case 3:
                    HeroGlobal.instance.OrnamentArrs[index1] = parseInt(newId);
                    break;
                case 4:
                    HeroGlobal.instance.WingArrs[index1] = parseInt(newId);
                    break;
                default:
                    break;
            }
            
            HeroGlobal.instance.saveEquipmentArrs();

            //装备上的id也替换
            let eIndex = this.equipedArrs.indexOf(this.soulEnchantArrs[0])
            if(eIndex != -1){
                this.equipedArrs[eIndex] = parseInt(newId);

                //武魂附魔也显示战力提升
                let data = HeroGlobal.instance.HeroDataArrs[MenuSelect.instance.selectIndex];
                // data.setEquip(this.typeIndex, this.equipIndex);
                data.setEquip(this.titleIndex + 1, parseInt(newId));
            }
            this.fmIcon0.spriteFrame = null;
            this.fmIcon1.spriteFrame = null;
            this.fmlv.spriteFrame = null;
            this.equipmentNode.active = false;
            this.soulRight.active = true;

            // //战力提升
            // Tips.instance.showSuccess();

            this.onListSelect(0);
            EquipmentDialog.instance.onOpen(parseInt(newId));
            this.equipmentRight.active = false;
            
            // 附魔完刷新
            HeroGlobal.instance.HeroDataArrs[MenuSelect.instance.selectIndex].updateAttribute();
            this.refreshEquipmentIcon(MenuSelect.instance.selectIndex);

            Statistics.getInstance().reportEvent('点击镶嵌武魂');
            // HeroGlobal.instance.saveEquipmentArrs();
        })));
    }


    showSoulBgRotate(){
        this.soulBg.runAction(cc.sequence(cc.rotateBy(1, 360).easing(cc.easeBackIn()), cc.callFunc(()=>{
            this.fmIcon0.spriteFrame = null;
            this.fmIcon1.spriteFrame = null;
            this.fmlv.spriteFrame = null;
            this.equipmentNode.active = false;
            this.soulRight.active = true;
        })));
    }

    onBtnSoulIconCancel(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        
        let index: number = parseInt(event.target.name);
        this.soulCompressArrs[index] = 0;
        if(index == 0){
            this.setSoulHCDialog(null);
        }
        this.soulIconArrs[index].spriteFrame = null;
        this.refreshSoulCompressRate();
    }

    onBtnSkillSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        let type: number = index < 4 ? 0 : 1;
        this.setSkillByIndex(index);
    }

    onBtnClose(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        this.node.active = false;
        cc.director.emit('CloseEquipment');
    }

    onBtnDialogClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.equipmentRight.active = true;
        this.equipmentDialog.active = false;
    }

    onBtnSoulDialogClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onSoulDialogClose();
    }

    onSoulDialogClose(){
        this.soulRight.active = true;
        this.soulDialog.active = false;
    }

    setSoulHCDialog(id: any){
        if(id){
            this.refreshSoulCompressRate();
            let lv: number = getLvId(id);
            id = parseInt(id);
            if(lv < 6){
                //鲲和鹏统一合成为鲲鹏
                if(id == 60508 || id ==60507){
                    id = 60609;
                }else{
                    id += 100;
                }
                
                
            }
            // this.soulHCJade.string = (lv * 10 + this.extJade) + '';
            let soulJson = getDataById(id);
            let rate = 0
            // this.soulHCTitle.string = '进阶为：' + soulJson.name + `(成功率:${rate}%)`;
            this.soulHCTitle.string = `${soulJson.name}`;//  (成功率:${rate}%)`;
            let soulStr: string = this.getDetailByJson(soulJson);

            this.soulHCText.string = soulStr;
        }else{
            this.soulHCJade.string = 10 + '';
            this.soulHCTitle.string = '';
            this.soulHCText.string = '';
        }
    }

    setStar(num: number){
        for (let i = 0; i < 20; i++) {
            if(i < num){
                this.skillStarArrs[i].setMaterial(0, cc.MaterialVariant.createWithBuiltin('2d-sprite', this.skillStarArrs[i]));
            }else{
                this.skillStarArrs[i].setMaterial(0, cc.MaterialVariant.createWithBuiltin('2d-gray-sprite', this.skillStarArrs[i]));
            }
        }
    }

    setSkillLv(){
        // this.heroSkillArrs;
        for (let i = 0; i < this.heroSkillArrs.length; i++) {
            let lv = this.heroSkillArrs[i];
            if(lv > -1){
                // this.skillBgArrs[i].active = true;
                this.skillLvArrs[i].string = (this.heroSkillArrs[i] + 1) + '';

            }else{
                // this.skillBgArrs[i].active = false;
                // this.skillLvArrs[i].string = '';
                // this.skillIconArrs[i].spriteFrame = TextureMgr.instance.lockSf;
                // this.skillNameArrs[i].string = '未解锁';
            }
            let skillJson: any = Skill[MenuSelect.instance.selectIndex * 7 + i];
            // 锁定
            if(HeroGlobal.instance.Level < parseInt(skillJson.unlock)){
                this.skillNameArrs[i].string = skillJson.unlock + '级解锁';
                this.skillBgArrs[i].active = false;
                this.skillIconArrs[i].spriteFrame = TextureMgr.instance.lockSf;
                this.skillLvArrs[i].string = '';
            }else{
                this.skillBgArrs[i].active = true;
                this.skillLvArrs[i].string = (this.heroSkillArrs[i] + 1) + '';
            }
        }
    }


    //skill详情
    setSkillByIndex(index: number){
        this.skillIndex = index;
        this.skillSelect.position = this.skillIconArrs[index].node.position;
        this.skillName.string = SkillNameArrs[MenuSelect.instance.selectIndex][index];

        let skillJson: any = Skill[MenuSelect.instance.selectIndex * 7 + index];

        let heroData = HeroGlobal.instance.HeroDataArrs[MenuSelect.instance.selectIndex];
        let skillArrs = heroData.SkillArrs;
        this.heroSkillArrs = skillArrs;
        let skillLevel = skillArrs[index] + 1;
        // this.skillUp.active = skillLevel == 0 ? false : true;
        this.skillUp.active = HeroGlobal.instance.Level >= parseInt(skillJson.unlock);
        this.setStar(skillLevel);
        this.setSkillLv();
        this.skillLv.string = 'LV.' + skillLevel + '';
        let cdStr = '无';

        let slv = skillArrs[index];
            if(slv == -1){
                slv = 0;
            }

        this.skillPrice = parseFloat(skillJson.price) + parseFloat(skillJson.priceup) * (slv + Math.floor(slv/3));
        this.skillCionsLabel.string = this.skillPrice + '';

        if(skillJson.cd){
            //主动

            cdStr = (parseFloat(skillJson.cd) - parseFloat(skillJson.cdup) * slv) + '';
            let text1: string = skillJson.text;
            this.skillDmg.string = text1.replace('wave*dmg',(parseFloat(skillJson.wave) * (parseFloat(skillJson.dmg) + parseFloat(skillJson.dmgup) * slv)) + '%');
     
        }else{
            //被动
            let text2: string = skillJson.text;
            
            this.skillDmg.string = text2.replace('dmg',(parseFloat(skillJson.dmg) + parseFloat(skillJson.dmgup) * slv) + '');
        }
        this.skillCd.string = cdStr;
        
        this.skillDes.string = skillJson.description;

        //icon
        if(index > 3){
            index += 2;
        }
        this.skillIcon.spriteFrame = TextureMgr.instance.skillArrs[MenuSelect.instance.selectIndex][index];
    }

    onBtnSKillUpgrade(){
        AudioMgr.instance.playAudio('BtnClick');
        let lv = this.heroSkillArrs[this.skillIndex];
        if(lv < 19){
            if(HeroGlobal.instance.Coins > this.skillPrice){
                HeroGlobal.instance.Coins -= this.skillPrice;
                HeroGlobal.instance.setCoins(HeroGlobal.instance.Coins);
                
                this.onSkillUpgrade();
                Menu.instance.refreshTopLabel();
                HeroGlobal.instance.saveHeroGlobal();
                Statistics.getInstance().reportEvent('升级技能');
            }else{
                Message.instance.showLack('coins');
            }
        }
        
        
    }

    onSkillUpgrade(){
        DataMgr.instance.taskCountData[5] ++;
        DataMgr.instance.saveSaveDate();

        HeroGlobal.instance.AchieveCountData[5] ++;

        let lv = this.heroSkillArrs[this.skillIndex];
        if(lv < 19){
            lv ++;
        }
        this.heroSkillArrs[this.skillIndex] = lv;
        this.setSkillByIndex(this.skillIndex);
        HeroGlobal.instance.HeroDataArrs[MenuSelect.instance.selectIndex].setSkillArrs(this.heroSkillArrs);
    }

    refreshOnSelect(index: number){
        if(this.listIndex == 3){
            this.refreshPet(index);
        }
        if(this.listIndex == 1){
            this.refreshSkill(index);
        }
    }

    refreshPet(index: number){
        // cc.log('refreshPet');
        if(index < 0){
            index = 0;
        }
        this.petIndex = index;
        this.petIcon.spriteFrame = TextureMgr.instance.petIconBoxSf[index];
        let petJson: any = Pet[index];
        
        this.petName.string = PetName[index];
        this.petLeftName.string = PetName[index];
        let lv: number = HeroGlobal.instance.PetLvArrs[index];
        if(lv == -1){
            lv = 0;
        }
        if(lv == 0){
            this.petLv.string = '20关解锁';
            if(index == 0){
                this.petLv.string = '签到解锁';
            }else if(index == 1){
                this.petLv.string = '限时领取';
            }
            this.petUpgrade.active = false;
            this.petJade.string = '';
            this.petItem.node.active = false;
        }else{
            this.petUpgrade.active = true;
            this.petLv.string = 'LV.' + lv + '';
            this.petPrice = parseFloat(petJson.price) + parseFloat(petJson.priceup) * lv;
            this.petJade.string = 'x' + this.petPrice + '';
            this.petItem.node.active = true;
        }
        this.petLevel = lv;
        
        
        // this.petLv.string = index == 2 ? '防御型' : '进攻型';

        let arrs = this.getPetDetailByJson(petJson, lv);
        // cc.log('PetArrs', arrs);


        // this.petLvnow.string = lv + '';
        // this.petLvnext.string = (lv + 1) + '';
        // this.petHpnow.string = (10 + lv * 3) + '%';
        // this.petHpnext.string = (13 + lv * 3) + '%';
        // this.petLeftValue0.string = (10 + lv * 3) + '%';
        // this.petLeftValue1.string = (5 + lv * 2) + '%';

        this.petLvnow.string = arrs[0].value;
        this.petLvnext.string = arrs[0].valueNext;
        this.petHpnow.string = arrs[1].value;
        this.petHpnext.string = arrs[1].valueNext;
        this.petLeftText0.string = arrs[0].text;
        this.petleftText1.string = arrs[1].text;
        this.petLeftValue0.string = arrs[0].value
        this.petLeftValue1.string = arrs[1].value;

        this.petDescription0.string = arrs[0].text + '提升';
        this.petDescription1.string = arrs[1].text + '提升';
        
    }

    getPetDetailByJson(json: any, lv?: number){
        let count: number = 0;
        let arrs = [];
        let str: string = '';
        for (let i = 0; i < baseArrs.length; i++) {
            let item = baseArrs[i];
            if(json[item]){
                let v =  parseFloat(json[item]) + lv * parseFloat(json[item + 'up']);
                let vn = v;
                if(lv < 19){
                    vn =  parseFloat(json[item]) + (lv + 1) * parseFloat(json[item + 'up']);
                }
                
                let data = {
                    text: textArrs[i],
                    value: v + tailArrs[i],
                    valueNext: vn + tailArrs[i]
                };
                arrs.push(data);
                count ++;
            }
        }
        return arrs;
    }

    onBtnPetUpgrade(){
        AudioMgr.instance.playAudio('BtnClick');
        if(this.petLevel < 20){
            if(HeroGlobal.instance.Jade > this.petPrice){
                DataMgr.instance.taskCountData[8] ++;
                DataMgr.instance.saveSaveDate();

                HeroGlobal.instance.AchieveCountData[8] ++;

                HeroGlobal.instance.Jade -= this.petPrice;
                HeroGlobal.instance.setJade(HeroGlobal.instance.Jade);
                Menu.instance.refreshTopLabel();
                HeroGlobal.instance.saveHeroGlobal();
                HeroGlobal.instance.PetLvArrs[this.petIndex] = this.petLevel + 1;
                HeroGlobal.instance.saveEquipmentArrs();
                this.refreshPet(this.petIndex);
            }else{
                Message.instance.showLack('jade');
            }
        }
    }

    //skillicon
    refreshSkill(index: number){
        for (let i = 0; i < 4; i++) {
            this.skillIconArrs[i].spriteFrame = TextureMgr.instance.skillArrs[index][i];
            this.skillNameArrs[i].string = SkillNameArrs[index][i];
        }
        for (let j = 4; j < 7; j++) {
            this.skillIconArrs[j].spriteFrame = TextureMgr.instance.skillArrs[index][j+2];
            this.skillNameArrs[j].string = SkillNameArrs[index][j];
            
        }
        this.setSkillByIndex(0);
    }

    refreshList(){
        this.listSelect.y = -40 - 80 * this.listIndex;
    }

    refreshTitle(){
        for (let i = 0; i < this.titleSelects.length; i++) {
            this.titleSelects[i].active = this.titleIndex == i;
        }

        for (let j = 0; j < this.boxLvArrs.length; j++) {
            this.boxLvArrs[j].spriteFrame = null;
            this.boxIconsArrs[j].spriteFrame = null; 
        }

        let arrs2 = HeroGlobal.instance.getDataArrsByIndex(this.titleIndex + 1);
        let arrs = [];
        let sIndex: number = HeroGlobal.instance.MainHeroIndex;
        if(MenuSelect.instance){
            sIndex = MenuSelect.instance.selectIndex;
        }
        for (let ii = 0; ii < arrs2.length; ii++) {
            let whoId = getWhoId(arrs2[ii]);
            // 通用或者专属
            if(whoId == 0 || whoId == (sIndex + 1)){
                if(!this.checkEquiped(arrs2[ii]))
                arrs.push(arrs2[ii]);
            }
        }
        this.dataArrs = arrs;
        for (let k = 0; k < arrs.length; k++) {
            this.boxLvArrs[k].spriteFrame = TextureMgr.instance.getLvIconById(arrs[k]);
            this.boxIconsArrs[k].spriteFrame = TextureMgr.instance.getEquipmentIconById(arrs[k]);
        }
    }

    inBlackList(id: number){
        let arrs = [122050000, 131070000, 112020000, 113030000, 123060000, 132080000, 133090000, 222050000, 231070000, 212030000, 213020000, 223060000, 232080000, 233090000];
        if(arrs.indexOf(id) != -1){
            return true;
        }
        return false;
    }

    checkEquiped(id: number){
        for (let i = 0; i < 3; i++) {

            if(HeroGlobal.instance.HeroDataArrs[i].equipedArrs && HeroGlobal.instance.HeroDataArrs[i].equipedArrs.indexOf(id) != -1){
                return true;
            } 
        }
        return false;
    }

    refreshSoulTitle(){
        for (let i = 0; i < this.soulTitleSelects.length; i++) {
            this.soulTitleSelects[i].active = this.soulTitleIndex == i;
        }

        for (let j = 0; j < this.soulBoxLvArrs.length; j++) {
            this.soulBoxLvArrs[j].spriteFrame = null;
            this.soulBoxIconsArrs[j].spriteFrame = null; 
        }

        let arrs2: number[] = HeroGlobal.instance.SoulArrs;
        let arrs = [];

        for (let k = 0; k < arrs2.length; k++) {
            let lv = getLvId(arrs2[k]);
            if(lv == (this.soulTitleIndex + 1)){
                arrs.push(arrs2[k]);
            }
        }
        this.soulDataArrs = arrs;

        for (let l = 0; l < arrs.length; l++) {
            this.soulBoxIconsArrs[l].spriteFrame = TextureMgr.instance.getSoulIconById(arrs[l]);
            
        }
    }

    refreshDetail(index: number){
        if(!this.detailName){
            return;
        }
        this.detailName.string = HeroName[index];
        let data = HeroGlobal.instance.HeroDataArrs[index];
        this.detailHp.string = data.HP + '';
        this.detailAtk.string = data.ATK + '';
        this.detailDef.string = data.DEF + '';
        this.detailBouns.string = ((data.BONUS + 100) | 0)  + '%';
        this.detailCr.string = ((data.CR) | 0) + '%';
        this.detailMiss.string = ((data.MISS) | 0) + '%';
    }

    refreshEquipmentIcon(index: number){
        
        this.equipedArrs = [];
        let data = HeroGlobal.instance.HeroDataArrs[index];
        //修复人物不同武器一个Icon
        this.equipmentIconArrs[0].spriteFrame = TextureMgr.instance.getEquipmentIconById(data.Weapon);
        this.equipmentBgArrs[0].spriteFrame = TextureMgr.instance.getLvIconById(data.Weapon);
        this.equipmentLockArrs[0].active = data.Weapon == -1 ? true : false;
        this.equipmentIconArrs[1].spriteFrame = TextureMgr.instance.getEquipmentIconById(data.Armor);
        this.equipmentBgArrs[1].spriteFrame = TextureMgr.instance.getLvIconById(data.Armor);
        this.equipmentLockArrs[1].active = data.Armor == -1 ? true : false;
        this.equipedArrs = [data.Weapon, data.Armor];
        this.reSizeEquipmentIcon();
        if(data.Wing > -1){
            this.equipmentIconArrs[2].spriteFrame = TextureMgr.instance.getEquipmentIconById(data.Wing);
            this.equipmentBgArrs[2].spriteFrame = TextureMgr.instance.getLvIconById(data.Wing);
            this.equipmentLockArrs[2].active = /*data.Wing == -1 ? true : */false;
            this.equipedArrs.push(data.Wing);
            this.equipmentIconArrs[2].node.setContentSize(84, 84);
            this.equipmentBgArrs[2].node.setContentSize(84, 84);
        }else{
            this.equipedArrs.push(null);
            this.equipmentIconArrs[2].spriteFrame = this.leftSf[0];
            this.equipmentBgArrs[2].spriteFrame = null;
        }

        

        if(data.Ring > -1){
            this.equipmentIconArrs[4].spriteFrame = TextureMgr.instance.getEquipmentIconById(data.Ring);
            this.equipmentBgArrs[4].spriteFrame = TextureMgr.instance.getLvIconById(data.Ring);
            this.equipedArrs.push(data.Ring);
            this.equipmentIconArrs[4].node.setContentSize(84, 84);
            this.equipmentBgArrs[4].node.setContentSize(84, 84);
        }else{
            this.equipedArrs.push(null);
            this.equipmentIconArrs[4].spriteFrame = this.leftSf[2];
            this.equipmentBgArrs[4].spriteFrame = null;
        }
        this.equipmentLockArrs[4].active = /*data.Ring == -1 ? true : */false;
        

        if(data.Ornament > -1){
            this.equipmentIconArrs[3].spriteFrame = TextureMgr.instance.getEquipmentIconById(data.Ornament);
            this.equipmentBgArrs[3].spriteFrame = TextureMgr.instance.getLvIconById(data.Ornament);
            this.equipedArrs.push(data.Ornament);
            this.equipmentIconArrs[3].node.setContentSize(84, 84);
            this.equipmentBgArrs[3].node.setContentSize(84, 84);
        }else{
            this.equipedArrs.push(null);
            this.equipmentIconArrs[3].spriteFrame = this.leftSf[1];
            this.equipmentBgArrs[3].spriteFrame = null;
        }
        this.equipmentLockArrs[3].active = /*data.Ornament == -1 ? true : */false;
        
        this.refreshTitle();
        this.refreshDetail(index);
        Menu.instance.ceLabel.string = HeroGlobal.instance.HeroDataArrs[index].CE + '';
        HeroGlobal.instance.HeroDataArrs[index].equipedArrs = this.equipedArrs;
    }

    reSizeEquipmentIcon(){
        for (let i = 0; i < 2; i++) {
            this.equipmentIconArrs[i].node.setContentSize(84, 84);
            this.equipmentBgArrs[i].node.setContentSize(84, 84);
        }
    }

    // update (dt) {}

    onDestroy(){
        cc.director.off('RefreshSelect', this.refreshOnSelect, this);
    }
}
