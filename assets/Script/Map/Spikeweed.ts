import Global from "../nativets/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Spikeweed extends cc.Component {
    attackSpace: number = 2;
    attackTime: number = .5;
    playing: boolean;
    hit: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    init(){
        this.attackSpace = 2;
        this.hit = this.node.getChildByName('hit');
    }


    onLoad () {
        this.init();
        this.playing = true;
    }

    use(){
        this.playing = true;
        this.hit.active = false;
    }

    unuse(){
        this.playing = false;
    }

    start () {

    }

    update (dt) {
        if(Global.getInstance().inGame && this.playing){
            this.attackSpace -= dt;
            this.hit.active = this.attackSpace > 1.6 ? true : false;
            if(this.attackSpace < 0){
                this.attackSpace = 2;
            }
        }
    }
}
