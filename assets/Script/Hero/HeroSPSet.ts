import HeroGlobal from "./HeroGlobal";
import { getLvId, getIndexId } from "../nativets/Config";

const {ccclass, property} = cc._decorator;
const ArmorNameArrs: string[][] = [
    ["AF", "AE", "BX", "BW", "GY", "CY", "OY", "KY", "CYY", "HY", "EY", "OX", "KX", "P", "B"],
    ["AF", "AE", "BX", "BY", "GY", "HY", "EY", "OX", "KX", "P", "PH", "PHH"],
    ["AF", "AQF", "AHF", "AE", "AFS", "BY", "BOY", "BKY", "BYY", "GY", "HY", "EY", "OY", "KY", "OX", "KX"]
];
@ccclass
export default class HeroSPSet extends cc.Component {
    sk: sp.Skeleton;
    Weapon: number;
    Armor: number;
    Wing: number;
    skData: any;
    wingLeftSlot: any;
    wingRightSlot: any;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(){
        this.sk = this.node.getComponent(sp.Skeleton);
        cc.director.on('RefreshSp', this.onRefresh, this);
    }

    start () {
        this.init();
    }


    setWeaponSlot(weapon: number){
        if(this.Weapon == weapon){
            return;
        }
        // this.sk.setSkin('00' + (getLvId(HeroGlobal.instance.WeaponArrs[weapon]) + 0));
        this.sk.setSkin('00' + (getLvId(weapon) + 0));
    }

    setArmorSlot(index: number, armor: number){
        if(this.Armor == armor){
            return;
        }
        
        let arrs: string[] = ArmorNameArrs[index];
        // let skinName: string = '00' + (getLvId(HeroGlobal.instance.ArmorArrs[armor]) + 0);
        let skinName: string = '00' + (getLvId(armor) + 0);
        for (let i = 0; i < arrs.length; i++) {
            // cc.log('sssss', arrs[i]);
            this.setSpineSLot(skinName, arrs[i]);
        }
    }

    setWingSlot(wing: number){
        cc.log('WIng',wing);
        if(this.Wing == wing){
            return;
        }
        if(wing == -1){
            this.sk.findSlot('chibang_zuo').setAttachment(null);
            this.sk.findSlot('chibang_you').setAttachment(null);
        }else{
        let id: number = wing;
        let wIndex: number = getIndexId(id);
        // this.Wing = wing;

        
        
            this.sk.findSlot('chibang_zuo').setAttachment(this.getAttachment('00' + (wIndex), 'chibang_zuo'));
            this.sk.findSlot('chibang_you').setAttachment(this.getAttachment('00' + (wIndex), 'chibang_you'));
        }

        
    }

    setSpineSLot(skinName: string, slotName: string){
        if(this.sk && this.sk.findSlot(slotName))
        this.sk.findSlot(slotName).setAttachment(this.getAttachment(skinName, slotName));
    }

    getAttachment(skinName: string, slotName: string){
        this.skData = this.sk.skeletonData.getRuntimeData();
        let skin = this.skData.findSkin(skinName);
        // let slot = this.sk.findSlot(slotName);
        let index = this.skData.findSlotIndex(slotName);
        // cc.log(this.skData);
        let atta = skin.getAttachment(index,slotName);
        return atta;
    }

    onRefresh(index: number){
        // 改武器直接修改皮肤
        let data = HeroGlobal.instance.HeroDataArrs[index];
        this.setWeaponSlot(data.Weapon);
        this.setWingSlot(data.Wing);
        this.setArmorSlot(index, data.Armor);
    }

    onDestroy(){
        cc.director.off('RefreshSp', this.onRefresh, this);
    }

    // update (dt) {}
}
