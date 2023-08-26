import AllText from "./Language";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class i18n extends cc.Component {
    @property(cc.String)
    text: string = '';
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.log('ssssss',AllText[this.text]);
        this.node.getComponent(cc.Label).string = AllText[this.text];
    }

    start () {

    }

    // update (dt) {}
}
