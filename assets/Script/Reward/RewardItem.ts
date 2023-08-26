import RewardMgr from "./RewardMgr";
import HeroPet from "../Hero/HeroPet";
import { getTypeId, getLvId, getIndexId, getDataById } from "../nativets/Config";
import TextureMgr from "../TextureMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RewardItem extends cc.Component {
    bgSprite: cc.Sprite;
    lightSprite: cc.Sprite;
    itemSprite: cc.Sprite;
    nameLabel: cc.Label;

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.bgSprite = this.node.getChildByName('bg').getComponent(cc.Sprite);
        this.lightSprite = this.node.getChildByName('light').getComponent(cc.Sprite);
        this.itemSprite = this.node.getChildByName('item').getComponent(cc.Sprite);
        this.nameLabel = this.node.getChildByName('name').getComponent(cc.Label);
        cc.director.on('PetMove', this.onPetMove, this);
    }

    onLoad () {
        this.init();
    }

    start () {

    }

    setById(id: number){
        // 作为index都需要-1
        // let type: number = Math.floor(id / 10000);   //第一位
        // let lv: number = Math.floor(id % 1000 / 100);   //第三位
        // let iconIndex: number = id % 100;  //后两位

        let type = getTypeId(id);
        let lv = getLvId(id);
        let iconIndex = getIndexId(id);
        this.nameLabel.string = '';

        //金币
        if(type == 9){
            this.bgSprite.spriteFrame = null;
            // this.lightSprite.spriteFrame = null;
            this.lightSprite.node.active = false;
            // this.itemSprite.spriteFrame = TextureMgr.instance.coinSf;
            this.itemSprite.spriteFrame = TextureMgr.instance.rewardSfInGame[1];
            this.itemSprite.node.scale = .8;
        }else if(type == 6){
            this.bgSprite.spriteFrame = null;
            // let soulRank = parseInt(id.toString().substr(2, 1));
            this.itemSprite.spriteFrame = TextureMgr.instance.getSoulRankIconById(id);
        }else{
            // cc.log('reward,Item');
            this.lightSprite.node.active = true;
            // this.itemSprite.spriteFrame = TextureMgr.instance.rewardSf;
            this.itemSprite.spriteFrame = TextureMgr.instance.getEquipmentIconById(id);
            this.itemSprite.node.scale = 1;
        }
    }

    setByIdLayout(id: number){
        if(!this.lightSprite){
            this.init();
        }
        let type = getTypeId(id);
        cc.log('IDDD',type)
        this.lightSprite.node.active = false;
        this.bgSprite.node.active = true;

        if(type == 6){
            this.bgSprite.spriteFrame = null;
            this.itemSprite.spriteFrame = TextureMgr.instance.getSoulIconById(id);
        }else{
            this.bgSprite.spriteFrame = TextureMgr.instance.getLvIconById(id);
            this.itemSprite.spriteFrame = TextureMgr.instance.getEquipmentIconById(id);
        }
        
        this.nameLabel.string = getDataById(id).name;
    }

    onPetMove(petX: number){
        if(this.node.y == 900){
            return;
        }
        
        if(Math.abs(petX - this.node.x) < 80){
            //音效
            if(RewardMgr.instance.rewardPool){
                HeroPet.instance.pickup();
                // RewardMgr.instance.rewardPool.put(this.node);
                RewardMgr.instance.recycle(this.node);
            }
        }
    }

    // update (dt) {}
}
