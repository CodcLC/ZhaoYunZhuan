import TextureMgr from "../../TextureMgr";

const {ccclass, property} = cc._decorator;



@ccclass
export default class QimenItem extends cc.Component {
    index: number;
    icon: cc.Sprite;
    bg: cc.Sprite;
    nameLabel: cc.Label;
    textLabel: cc.Label;
    attLabel: cc.Label;

    init(){
        this.index = -1;
        this.icon = this.node.getChildByName('icon').getComponent(cc.Sprite);
        this.bg = this.node.getChildByName('bg').getComponent(cc.Sprite);
        this.nameLabel = this.node.getChildByName('name').getComponent(cc.Label);
        this.textLabel = this.node.getChildByName('text').getComponent(cc.Label);
        this.attLabel = this.node.getChildByName('att').getComponent(cc.Label);
    
    }

    onLoad () {

    }

    start () {

    }

    setItem(index: number,icon: cc.SpriteFrame, name: string, text: string, att: string){
        // cc.log(index, icon);
        this.index = index;
        this.icon.node.scale = index < 4 ? 1.2 : 1;
        this.bg.spriteFrame = index < 4 ? TextureMgr.instance.rewardBg : null;
        this.icon.spriteFrame = icon;
        this.nameLabel.string = name;
        this.textLabel.string = text;
        this.attLabel.string = att;
    }

    // update (dt) {}
}
