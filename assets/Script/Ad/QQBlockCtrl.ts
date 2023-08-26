import QQAdMgr from "./QQAdMgr";
import AdList from "./AdList";
import { getPlatform, Platform } from "../nativets/Platform";

const {ccclass, property} = cc._decorator;

@ccclass
export default class QQBlockCtrl extends cc.Component {

    @property({type: cc.Enum(AdList.QQBlockList), displayName: '位置'})
    style: number =  AdList.QQBlockList.首页单个;

    WXLeft: number;
    WXTop: number;

    // onLoad () {}

    onEnable () {
        if(getPlatform() != Platform.QQ){
            return;
        }
        switch (this.style) {
            case AdList.QQBlockList.首页单个:
                this.scheduleOnce(()=>{
                    
                        let zoomRateW: number = wx.getSystemInfoSync().windowWidth / cc.winSize.width;
                        let zoomRateH: number = wx.getSystemInfoSync().windowHeight / cc.winSize.height
            
                        // let pos = cc.v2(0,0);
                        // cc.find('Canvas').getChildByName('Main Camera').getComponent(cc.Camera).getWorldToScreenPoint(rightnearbg.position, pos);
            
                        let posX: number = 0;
                        let posY: number = 0;
        
                        let pos = this.node.convertToWorldSpace(cc.v2(0, this.node.height));
                        posX = pos.x;
                        posY = cc.winSize.height - pos.y;
        
                        
                        this.WXLeft = posX * zoomRateW;
                        this.WXTop = posY * zoomRateH;
                        cc.log('WXTL',this.WXLeft, this.WXTop);
                        if(QQAdMgr.instance){
                            // QQAdMgr.instance.QQBlockAdShow(this.style, this.WXLeft, this.WXTop);
                            QQAdMgr.instance.blockLeft = this.WXLeft;
                            QQAdMgr.instance.blockTop = this.WXTop;
                            QQAdMgr.instance.QQBlockAdShow(this.style);
                        }
                    
                });
                break;
            case AdList.QQBlockList.结算5个:
                if(QQAdMgr.instance){
                    QQAdMgr.instance.QQBlockAdShow(this.style);
                }
                break;
            default:
                break;
        }
        
    }

    onDisable(){
        if(QQAdMgr.instance){
            QQAdMgr.instance.QQBlockAdHide();
        }
    }
    

    // update (dt) {}
}
