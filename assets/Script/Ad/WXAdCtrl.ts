
import AdMgr from "./AdMgr";
import AdList from "./AdList";
import Main from "../Main";
import Others from "../Others/Others";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WXAdCtrl extends cc.Component {
    @property({type: cc.Enum(AdList.BANNERLIST), displayName: 'Banner位置'})
    style: number =  AdList.BANNERLIST.首页右下;

    // onLoad () {}

    start () {

    }

    onEnable(){
        cc.log('baseonenable');
        if(AdMgr.instance){
            if(this.style == AdList.BANNERLIST.周边左下){
                this.scheduleOnce(()=>{
                    if(Others.instance && Others.instance.node.active){
                        AdMgr.instance.showBannerAd(this.style);
                    }
                }, 1);
            }else{
                // if(!Main.instance.loadingNode.active)
                AdMgr.instance.showBannerAd(this.style);
            }
            
            
        }
    }

    onDisable(){
        this.unscheduleAllCallbacks();
        if(AdMgr.instance){
            AdMgr.instance.hideBanner();
        }
    }

    // update (dt) {}
}
