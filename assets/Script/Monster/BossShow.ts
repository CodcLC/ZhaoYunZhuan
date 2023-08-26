
// 夏侯惇 枪  独眼是男人的浪漫  许褚 锤 脱！ 曹操 剑  宁叫我负天下人

// b a s

const WEAPONS = ['枪', '剑', '锤'];
const TEXTS = ['独眼是男人的浪漫', '宁叫我负天下人', '脱！'];
const NAMES = ['夏\n侯\n惇', '曹\n操', '许\n褚'];
// bsa

const {ccclass, property} = cc._decorator;

@ccclass
export default class BossShow extends cc.Component {

    @property([cc.SpriteFrame])
    rareSfArrs: cc.SpriteFrame[] = [];

    rareSf: cc.Sprite;
    weaponLabel: cc.Label;
    nameLabel: cc.Label;
    textLabel: cc.Label;

    // onLoad () {}

    init(){
        let rightNode = this.node.getChildByName('right');
        this.rareSf = rightNode.getChildByName('S').getComponent(cc.Sprite);
        this.weaponLabel = rightNode.getChildByName('weapon').getComponent(cc.Label);
        this.nameLabel = rightNode.getChildByName('name').getComponent(cc.Label);
        this.textLabel = rightNode.getChildByName('text').getComponent(cc.Label);
    }

    setType(type: number){
        if(!this.rareSf){
            this.init();
        }
        // 97 98 99 夏侯惇 曹操 许褚
        let i = type - 97;
        this.rareSf.spriteFrame = this.rareSfArrs[i];
        this.weaponLabel.string = WEAPONS[i];
        this.nameLabel.string = NAMES[i];
        this.textLabel.string = TEXTS[i];
    }

    start () {

    }

    // update (dt) {}
}
