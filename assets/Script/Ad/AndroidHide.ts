const {ccclass, property} = cc._decorator;

@ccclass
export default class AndroidHide extends cc.Component {
    static instance: AndroidHide = null;

    onLoad () {
        AndroidHide.instance = this;
        this.node.active = false;
        cc.director.on('AndroidHide', this.show, this);
    }

    // start () {

    // }

    show(){
        // this.scheduleOnce(()=>{
            this.node.active = true;
        // }, 1);
    }

    close(){
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'hideInterstitial', '()V');
        this.node.active = false;
    }

    onBtnClose(){
        this.close();
    }

    onDestroy(){
        cc.director.off('AndroidHide', this.show, this);
    }

    // update (dt) {}
}
