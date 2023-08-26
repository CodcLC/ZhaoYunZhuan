import RewardMgr from "../Reward/RewardMgr";
import Game from "../Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Box extends cc.Component {
    @property(cc.SpriteFrame)
    normal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    open: cc.SpriteFrame = null;

    light: cc.Node;
    sprite: cc.Sprite;
    life: number;

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.light = this.node.getChildByName('light');
        this.sprite = this.node.getComponent(cc.Sprite);
        this.light.active = false;
        this.sprite.spriteFrame = this.normal;
        this.life = 1;
    }

    onLoad () {
        this.init();
    }

    openBox(){
        this.light.active = true;
        this.sprite.spriteFrame = this.open;
        this.scheduleOnce(()=>{
            this.hideBox();
        }, 0.5);
        // cc.log(Game.instance.mapdata.boxId);
        RewardMgr.instance.createCoins(Game.instance.mapdata.boxId, cc.v2(this.node.x, this.node.y + 60));
    }

    onlyOpen(){
        this.light.active = true;
        this.sprite.spriteFrame = this.open;
    }

    hideBox(){
        this.light.active = false;
        this.node.active = false;
        this.node.destroy();
    }

    // onCollisionEnter(other, self){
    //     this.openBox();
    // }

    start () {

    }

    // update (dt) {}
}
