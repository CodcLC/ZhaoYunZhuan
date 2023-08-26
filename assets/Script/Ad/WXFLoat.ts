import WXAdMgr from "./WXAdMgr";
import QQAdMgr from "./QQAdMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WXFLoat extends cc.Component {
    static instance: WXFLoat = null;

    init(){

    }

    onLoad () {
        WXFLoat.instance = this;
        if(WXAdMgr.instance){
            this.node.position = WXAdMgr.instance.menuPosition;
        }
        if(QQAdMgr.instance){
            this.node.position = QQAdMgr.instance.menuPosition;
        }
        this.node.active = false;
    }

    open(){
        this.node.active = true;
        this.scheduleOnce(()=>{
            this.close();
        }, 10)
    }

    close(){
        this.node.active = false;
    }

    start () {

    }

    // update (dt) {}
}
