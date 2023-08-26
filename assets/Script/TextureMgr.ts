import { getIndexId, getTypeId, getLvId } from "./nativets/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TextureMgr extends cc.Component {
    static instance: TextureMgr = null;

    @property([cc.SpriteFrame])
    heroIconSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    heroIconGameSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    heroIconRectSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    heroIconRectMapselectSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    bossIconGameSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    monsterIconGameSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    petIconSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    petIconBoxSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    petIconBoxMapselectSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    lvSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    weaponSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    armorSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    ringSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    ornamentSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    wingSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    soulSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    skillZYSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    skillDCSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    skillDQSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    rewardSfInGame: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    rewardBg: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    coinSf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    rewardSf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    addHpSf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    lockSf: cc.SpriteFrame = null;

    @property([cc.SpriteFrame])
    soulRankSf: cc.SpriteFrame[] = [];

    typeArrs: cc.SpriteFrame[][];
    skillArrs: cc.SpriteFrame[][];


    // LIFE-CYCLE CALLBACKS:

    init(){
        this.typeArrs = [this.weaponSf, this.armorSf, this.ringSf, this.ornamentSf, this.wingSf, this.soulSf];
        this.skillArrs = [this.skillZYSf, this.skillDCSf, this.skillDQSf];
    }

    onLoad () {
        TextureMgr.instance = this;
        this.init();
        // cc.dynamicAtlasManager.enabled = false;
    }

    start () {

    }

    getLvIconById(id: number){
        let lv = getLvId(id);
        return this.lvSf[lv - 1];
    }

    getEquipmentIconById(id: number){
        let type: number = getTypeId(id) - 1;
        let index: number = getIndexId(id) - 1;
        
        let arrs1 = this.typeArrs[type];
        return arrs1[index];
    }

    getSoulIconById(id: number){
        let lv: number = getLvId(id) - 1;
        let index: number = getIndexId(id) - 1;
        return this.soulSf[lv * 9 + index];
    }

    getSoulRankIconById(id: number){
        let lv: number = getLvId(id) - 1;
        return this.soulRankSf[lv];
    }

    // update (dt) {}
}
