import TextureMgr from "./TextureMgr";
import { getDataById, getLvId, getUpgradeId, getSoulId } from "./nativets/Config";
import AllText from "./i18n/Language";
import Equipment from "./Equipment";
import AudioMgr from "./Audio";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoulDialog extends cc.Component {
    static instance: SoulDialog = null;
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
    // LIFE-CYCLE CALLBACKS:

    init(){
        SoulDialog.instance = this;
        this.icon = this.node.getChildByName('icon').getComponent(cc.Sprite);
        this.lvBg = this.node.getChildByName('lvbg').getComponent(cc.Sprite);
        this.nameLabel = this.node.getChildByName('name').getComponent(cc.Label);
        this.lvLabel = this.node.getChildByName('lv').getComponent(cc.Label);
        this.equipLabel = this.node.getChildByName('textequip').getComponent(cc.Label);
        this.textlabel0 = this.node.getChildByName('text0').getComponent(cc.Label);
        // this.textlabel1 = this.node.getChildByName('text1').getComponent(cc.Label);
        // this.textlabel2 = this.node.getChildByName('text2').getComponent(cc.Label);
        this.upBtn = this.node.getChildByName('up').getComponent(cc.Button);
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
        this.typeIndex = Equipment.instance.soulTitleIndex + 1;
        let setedId = Equipment.instance.soulCompressArrs[0];
        if(Equipment.instance.soulCompressArrs.indexOf(id) != -1){
            this.upBtn.node.active = false;
            this.equipBtn.node.active = false;
        }else{
            if(setedId == 0){
                this.upBtn.node.active = true;
                this.equipBtn.node.active = false;
            }else{
                this.upBtn.node.active = false;
                this.equipBtn.node.active = true;
                let lv = getLvId(setedId);
                if(lv == 6){
                    this.equipBtn.node.active = false;
                }
            }
        }
        
        



        this.id = id;
        this.icon.spriteFrame = TextureMgr.instance.getSoulIconById(id);
        // this.icon.spriteFrame = TextureMgr.instance.soulSf[Math.floor(Math.random() * TextureMgr.instance.soulSf.length)];
        this.lvBg.spriteFrame = TextureMgr.instance.getLvIconById(id);
        // if(Equipment.instance.equipedArrs.indexOf(id) != -1){
        //     this.equipLabel.string = AllText.equiped;
        // }else{
        //     this.equipLabel.string = AllText.notEquip;
        // }
        let data = getDataById(id);
        // cc.log(data);
        this.nameLabel.string = data.name;
        this.lvLabel.string = AllText['star' + getLvId(id)] + AllText.soul;
        let strad: string = '';
        if(data.atk){
            strad += AllText.equipmentAtk + '+' + data.atk + '                   \n';
        }
        if(data.def){
            strad += AllText.equipmentDef + '+' + data.def + '                   \n';
        }
        // this.textlabel0.string = strad;

        let str: string = '' + strad;

        if(data.hp){
            str += AllText.equipmentHp +  '+' + data.hp + '                   \n';
        }
        if(data.ls){
            str += AllText.equipmentLs + '+' + data.ls + '%                   \n';
        }
        if(data.sp){
            str += AllText.equipmentSp + '+' + data.sp + '%                   \n';
        }
        if(data.cr){
            str += AllText.equipmentCr + '+' + data.cr + '%                   \n';
        }
        if(data.arp){
            str += AllText.equipmentArp + '+' + data.arp + '                   \n';
        }
        if(data.bonus){
            str += AllText.equipmentBonus + '+' + data.bonus + '%                   \n';
        }
        if(data.cd){
            str += AllText.equipmentCd + '-' + data.cd + '%                   \n';
        }
        if(data.miss){
            str += AllText.equipmentMiss + '+' + data.miss + '%                   \n';
        }
        if(data.exp){
            str += AllText.equipmentExp + '+' + data.exp + '%                   \n';
        }
        if(data.gold){
            str += AllText.equipmentGold + '+' + data.gold + '%                   \n';
        }
        
        this.textlabel0.string = str;

        // this.equipBtn.node.active = true;

        this.node.active = true;
    }

    // onBtnEquip(){
    //     // let lv = getLvId(this.id);
    //     let index: number = HeroGlobal.instance.getDataArrsByIndex(this.typeIndex).indexOf(this.id);
    //     let data = HeroGlobal.instance.HeroDataArrs[MenuSelect.instance.selectIndex];
    //     // data.setWeapon(index);
    //     cc.log(this.typeIndex);
    //     data.setEquip(this.typeIndex, index);

    // }

    onBtnSoulMain(){
        AudioMgr.instance.playAudio('BtnClick');
        Equipment.instance.soulCompressArrs[0] = this.id;
        Equipment.instance.icon0.spriteFrame = this.icon.spriteFrame;
        this.equipBtn.node.active = false;
        Equipment.instance.soulHC.active = true;
        Equipment.instance.setSoulHCDialog(this.id);
        Equipment.instance.soulFM.active = false;
        this.upBtn.node.active = false;
        Equipment.instance.onSoulDialogClose();
    }

    onBtnSoulSub(){
        AudioMgr.instance.playAudio('BtnClick');
        if(Equipment.instance.soulCompressArrs[1] == 0){
            Equipment.instance.soulCompressArrs[1] = this.id;
            Equipment.instance.icon1.spriteFrame = this.icon.spriteFrame;
        }else{
            Equipment.instance.soulCompressArrs[2] = this.id;
            Equipment.instance.icon2.spriteFrame = this.icon.spriteFrame;
        }
        Equipment.instance.soulHC.active = true;
        Equipment.instance.soulFM.active = false;
        this.equipBtn.node.active = false;
        Equipment.instance.onSoulDialogClose();
        Equipment.instance.refreshSoulCompressRate();
    }

    onBtnSoulToWeapon(){
        AudioMgr.instance.playAudio('BtnClick');
        Equipment.instance.soulHC.active = false;
        Equipment.instance.soulFM.active = true;

        Equipment.instance.soulRight.active = false;
        Equipment.instance.equipmentNode.active = true;
        Equipment.instance.equipmentLeft.active = false;

        this.node.active = false;

        Equipment.instance.fmIcon0.spriteFrame = this.icon.spriteFrame;
        
    }

    onBtnUnequip(){

    }

    onBtnRecycle(){

    }

    onBtnUpgrade(){

    }

    start () {

    }


    // update (dt) {}
}
