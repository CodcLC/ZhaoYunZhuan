import HeroFSM from "./HeroFSM";
import Hero from "./Hero";
import Global from "../nativets/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroBody extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onCollisionEnter(other,self){
        if(HeroFSM.instance.fsm.can('hit')){
            // cc.log('hit');
            if(Global.getInstance().inGame)
            Hero.instance.onHit(other.tag);
        }
    }

    // update (dt) {}
}
