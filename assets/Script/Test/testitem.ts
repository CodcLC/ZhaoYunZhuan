const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onCollisionEnter(other, self){
        this.node.color = cc.Color.RED;
    }

    onCollisionExit(other, self){
        this.node.color = cc.Color.WHITE;
    }

    // update (dt) {}
}
