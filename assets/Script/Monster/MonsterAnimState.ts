const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    init(){
        
    }

    // onLoad () {}

    start () {

    }

    showCollision(){
        this.node.group = 'default';
    }

    hideCollision(){
        this.node.group = 'monsterhit';
    }

    // update (dt) {}
}
