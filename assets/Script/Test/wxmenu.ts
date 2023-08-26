import WXAdMgr from "../Ad/WXAdMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // onLoad () {}

    start () {
        if(WXAdMgr.instance){
            console.log(WXAdMgr.instance.menuPosition);
            this.node.position = WXAdMgr.instance.menuPosition;
        }
        
    }

    // update (dt) {}
}
