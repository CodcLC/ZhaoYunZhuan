import TextureMgr from "./TextureMgr";
import { getDataById, getLvId, getUpgradeId, getSoulId, getSoulDataById } from "./nativets/Config";
import AllText from "./i18n/Language";
import HeroGlobal from "./Hero/HeroGlobal";
import MenuSelect from "./MenuSelect";
import Equipment from "./Equipment";
import Menu from "./Menu";
import AudioMgr from "./Audio";
import Message from "./Message";
import AdMgr from "./Ad/AdMgr";
import Statistics from "./Tool/Statistics";
import DataMgr from "./DataMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EquipmentDialog extends cc.Component {
    static instance: EquipmentDialog = null;
    icon: cc.Sprite;
  
    nameLabel: cc.Label;
    lvLabel: cc.Label;
    textlabel1: cc.Label;
    textlabel2: cc.Label;
    recycleBtn: cc.Button;
    upBtn: cc.Button;
    equipBtn: cc.Button;
    unequipBtn: cc.Button;
    lvBg: cc.Sprite;
    id: number;
    typeIndex: number;
    textlabel0: cc.Label;
    equipLabel: cc.Label;
    soulIcon: cc.Sprite;
    isEquiped: boolean;
    equipIndex: number;
    equipPrice: number;
    priceLabel: cc.Label;
    // LIFE-CYCLE CALLBACKS:

    init(){
        EquipmentDialog.instance = this;
        this.icon = this.node.getChildByName('icon').getComponent(cc.Sprite);
        this.lvBg = this.node.getChildByName('lvbg').getComponent(cc.Sprite);
        this.soulIcon = this.node.getChildByName('soulicon').getComponent(cc.Sprite);
        this.nameLabel = this.node.getChildByName('name').getComponent(cc.Label);
        this.lvLabel = this.node.getChildByName('lv').getComponent(cc.Label);
        this.equipLabel = this.node.getChildByName('textequip').getComponent(cc.Label);
        this.textlabel0 = this.node.getChildByName('text0').getComponent(cc.Label);
        this.textlabel1 = this.node.getChildByName('text1').getComponent(cc.Label);
        this.textlabel2 = this.node.getChildByName('text2').getComponent(cc.Label);
        this.upBtn = this.node.getChildByName('up').getComponent(cc.Button);
        this.priceLabel = this.upBtn.node.getChildByName('coins').getComponent(cc.Label);
        this.recycleBtn = this.node.getChildByName('recycle').getComponent(cc.Button);
        this.equipBtn = this.node.getChildByName('equip').getComponent(cc.Button);
        this.unequipBtn = this.node.getChildByName('unequip').getComponent(cc.Button);

    }

    // onLoad () {}

    setButtonState(isEquip: boolean){
        this.equipBtn.node.active = !isEquip;
        this.equipBtn.node.active = isEquip;
    }

    onOpen(id: number){
        cc.log(id);
        this.typeIndex = Equipment.instance.titleIndex + 1;
        this.id = id;
        this.icon.spriteFrame = TextureMgr.instance.getEquipmentIconById(id);
        this.lvBg.spriteFrame = TextureMgr.instance.getLvIconById(id);
        if(Equipment.instance.equipedArrs.indexOf(id) != -1){
            // this.isEquiped = true;
            // this.equipIndex = HeroGlobal.instance.getDataArrsByIndex(this.typeIndex).indexOf(this.id);
            // this.equipLabel.string = AllText.equiped;
            this.setEquipState(true);
        }else{
            // this.isEquiped = false;
            // this.equipLabel.string = AllText.notEquip;
            this.setEquipState(false);
        }
        let data = getDataById(id);
        // cc.log(data);
        this.nameLabel.string = data.name;
        let lv = getUpgradeId(id);
        this.lvLabel.string = AllText.lv + (lv + 1);
        this.equipPrice = (parseFloat(data.price) + lv * parseFloat(data.priceup));
        this.priceLabel.string = this.equipPrice + '';

        let strad: string = '';
        if(data.atk){
            strad += AllText.equipmentAtk + '+' + (parseFloat(data.atk) + lv * parseFloat(data.atkup)) + '\n';
        }
        if(data.def){
            strad += AllText.equipmentDef + '+' + (parseFloat(data.def) + lv * parseFloat(data.defup)) + '';
        }
        this.textlabel0.string = strad;

        let str: string = '';

        // let count: number = 0;
        // let arrs: string[] = ['hp', 'ls', 'sp', 'cr', 'arp', 'bonus', 'cd', 'miss', 'exp', 'gold'];
        // for (let i = 0; i < arrs.length; i++) {
        //     let item = arrs[i];
        //     if(data[item]){
        //         count ++;
        //     }
        // }

        // if(count > 3){

        // }

        if(data.hp){
            str += AllText.equipmentHp +  '+' + (parseFloat(data.hp) + lv * parseFloat(data.hpup)).toFixed(1) + '        ';
        }
        if(data.ls){
            str += AllText.equipmentLs + '+' + (parseFloat(data.ls) + lv * parseFloat(data.lsup)).toFixed(1) + '%        ';
        }
        if(data.sp){
            str += AllText.equipmentSp + '+' + (parseFloat(data.sp) + lv * parseFloat(data.spup)).toFixed(1) + '%        ';
        }
        if(data.cr){
            str += AllText.equipmentCr + '+' + (parseFloat(data.cr) + lv * parseFloat(data.crup)).toFixed(1) + '%        ';
        }
        if(data.arp){
            str += AllText.equipmentArp + '+' + (parseFloat(data.arp) + lv * parseFloat(data.arpup)).toFixed(1) + '        ';
        }
        if(data.bonus){
            str += AllText.equipmentBonus + '+' + (parseFloat(data.bonus) + lv * parseFloat(data.bonusup)).toFixed(1) + '%        ';
        }
        if(data.cd){
            str += AllText.equipmentCd + '-' + (parseFloat(data.cd) + lv * parseFloat(data.cdup)).toFixed(1) + '%        ';
        }
        if(data.miss){
            str += AllText.equipmentMiss + '+' + (parseFloat(data.miss) + lv * parseFloat(data.missup)).toFixed(1) + '%        ';
        }
        if(data.exp){
            str += AllText.equipmentExp + '+' + (parseFloat(data.exp) + lv * parseFloat(data.expup)).toFixed(1) + '%        ';
        }
        if(data.gold){
            str += AllText.equipmentGold + '+' + (parseFloat(data.gold) + lv * parseFloat(data.goldup)).toFixed(1) + '%        ';
        }
        
        this.textlabel1.string = str;

        let soulStr: string = '';
        let soulIndex: number = getSoulId(id);
        if(soulIndex == 0){
            soulStr = AllText.textNull;
            this.soulIcon.spriteFrame = null;
        }else{
            
            let soulData: any = getSoulDataById(soulIndex - 1);
            this.nameLabel.string = soulData.name + '·' + this.nameLabel.string;
            this.soulIcon.spriteFrame = TextureMgr.instance.getSoulIconById(soulData.id);


            if(soulData.atk){
                soulStr += AllText.equipmentAtk +  '+' + soulData.atk + '        ';
            }
            if(soulData.def){
                soulStr += AllText.equipmentDef +  '+' + soulData.def + '        ';
            }

            if(soulData.hp){
                soulStr += AllText.equipmentHp +  '+' + soulData.hp + '        ';
            }
            if(soulData.ls){
                soulStr += AllText.equipmentLs + '+' + soulData.ls + '%        ';
            }
            if(soulData.sp){
                soulStr += AllText.equipmentSp + '+' + soulData.sp + '%        ';
            }
            if(soulData.cr){
                soulStr += AllText.equipmentCr + '+' + soulData.cr + '%        ';
            }
            if(soulData.arp){
                soulStr += AllText.equipmentArp + '+' + soulData.arp + '        ';
            }
            if(soulData.bonus){
                soulStr += AllText.equipmentBonus + '+' + soulData.bonus + '%        ';
            }
            if(soulData.cd){
                soulStr += AllText.equipmentCd + '-' + soulData.cd + '%        ';
            }
            if(soulData.miss){
                soulStr += AllText.equipmentMiss + '+' + soulData.miss + '%        ';
            }
            if(soulData.exp){
                soulStr += AllText.equipmentExp + '+' + soulData.exp + '%        ';
            }
            if(soulData.gold){
                soulStr += AllText.equipmentGold + '+' + soulData.gold + '%        ';
            }
        }

        this.textlabel2.string = soulStr;

        this.node.active = true;
    }

    onBtnEquip(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onEquip();

    }

    onEquip(){
        // let lv = getLvId(this.id);
        let index: number = HeroGlobal.instance.getDataArrsByIndex(this.typeIndex).indexOf(this.id);
        let data = HeroGlobal.instance.HeroDataArrs[MenuSelect.instance.selectIndex];
        // data.setWeapon(index);
        cc.log(this.typeIndex);
        // data.setEquip(this.typeIndex, index);
        data.setEquip(this.typeIndex, this.id);
        this.setEquipState(true);
        Equipment.instance.refreshTitle();
        cc.log('equipmentarrs',Equipment.instance.equipedArrs);
    }

    onBtnUneuquip(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onUnequip();
    }

    onUnequip(){
        let data = HeroGlobal.instance.HeroDataArrs[MenuSelect.instance.selectIndex];
        // data.setWeapon(index);
        cc.log(this.typeIndex);
        data.setEquip(this.typeIndex, -1);
        this.setEquipState(false);
        Equipment.instance.refreshTitle();
    }

    setEquipState(isEquiped: boolean){
        this.isEquiped = isEquiped;
        this.equipIndex = HeroGlobal.instance.getDataArrsByIndex(this.typeIndex).indexOf(this.id);
        this.equipLabel.string = isEquiped == true ? AllText.equiped : AllText.notEquip;
        this.equipBtn.node.active = !isEquiped;
        this.unequipBtn.node.active = isEquiped;
        if(isEquiped)
        this.unequipBtn.interactable = this.typeIndex > 2;
    }

    onBtnWeaponToSoul(){
        AudioMgr.instance.playAudio('BtnClick');
        Equipment.instance.equipmentNode.active = false;
        Equipment.instance.listIndex = 3;
        Equipment.instance.soulNode.active = true;
        Equipment.instance.soulDialog.active = false;
        Equipment.instance.soulHC.active = false;
        Equipment.instance.soulFM.active = true;
        Equipment.instance.soulEnchantArrs[0] = this.id;
        Equipment.instance.fmIcon0.spriteFrame = this.icon.spriteFrame;
        Equipment.instance.fmlv.spriteFrame = this.lvBg.spriteFrame;
        
        MenuSelect.instance.node.active = false;
        Menu.instance.LeftNode.active = false;
        
    }

    onBtnSoulMain(){
        
    }

    onBtnSoulSub(){

    }

    // onBtnUnequip(){
    //     AudioMgr.instance.playAudio('BtnClick');
    //     let data = HeroGlobal.instance.HeroDataArrs[MenuSelect.instance.selectIndex];
    //     data.setEquip(5, -1);
    // }

    onBtnRecycle(){

    }

    onBtnUpgrade(){
        AudioMgr.instance.playAudio('BtnClick');
        let lv = getUpgradeId(this.id);
        if(lv >= 19){
            return;
        }
        if(HeroGlobal.instance.Coins > this.equipPrice){
            HeroGlobal.instance.Coins -= this.equipPrice;
            HeroGlobal.instance.setCoins(HeroGlobal.instance.Coins);
            
            this.onUpgrade();
            Menu.instance.refreshTopLabel();
            HeroGlobal.instance.saveHeroGlobal();
            Statistics.getInstance().reportEvent('升级装备');
        }else{
            Message.instance.showLack('coins');
        }
        
    }

    onUpgrade(){
        DataMgr.instance.taskCountData[6] ++;
        DataMgr.instance.saveSaveDate();

        HeroGlobal.instance.AchieveCountData[6] ++;


        let lv = getUpgradeId(this.id);
        if(lv >= 19){
            return;
        }
        lv ++;
        let estr = lv > 9 ? '' + lv : '0' + lv;
        
        let newId = parseInt(this.id.toString().substr(0, 7) + estr);
        cc.log(lv, estr, newId, 'TITLEINDEX', Equipment.instance.titleIndex);


        let index: number = HeroGlobal.instance.getDataArrsByIndex(this.typeIndex).indexOf(this.id);
        // cc.log(HeroGlobal.instance.getDataArrsByIndex(this.typeIndex), index);


        switch (Equipment.instance.titleIndex) {
            case 0:
                HeroGlobal.instance.WeaponArrs[index] = newId;
                break;
            case 1:
                HeroGlobal.instance.ArmorArrs[index] = newId;
                break;
            case 2:
                HeroGlobal.instance.RingArrs[index] = newId;
                break;
            case 3:
                HeroGlobal.instance.OrnamentArrs[index] = newId;
                break;
            case 4:
                HeroGlobal.instance.WingArrs[index] = newId;
                break;
            default:
                break;
        }
        // HeroGlobal.instance.getDataArrsByIndex(this.typeIndex)[index] = newId;
        HeroGlobal.instance.saveEquipmentArrs();
        if(this.isEquiped){
            // this.onEquip();
            // cc.log('装备');
            let data = HeroGlobal.instance.HeroDataArrs[MenuSelect.instance.selectIndex];
            // data.setEquip(this.typeIndex, this.equipIndex);
            data.setEquip(this.typeIndex, newId);
        }
        this.onOpen(newId);
    }

    start () {

    }


    // update (dt) {}
}
