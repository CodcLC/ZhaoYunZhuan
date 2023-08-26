import AudioMgr from "../Audio";
import { getPlatform, Platform } from "../nativets/Platform";

const {ccclass, property} = cc._decorator;

const OPPONATIVE1: string = '176991';
const OPPONATIVE2: string = '176994';

const VIVONATIVE1: string = 'b4e2e0c887ed42fe9d6947f5e573d72f';
const VIVONATIVE2: string = 'aaab4f80bb33414bb886f62b6df5c98a';

@ccclass
export default class NativeBanner extends cc.Component {
    static instance: NativeBanner = null;
    desLabel: cc.Label;
    imgSprite: cc.Sprite;
    nativeAd: any;
    nativeCurrentAd: any;
    widget: cc.Widget;

    init(){
        this.desLabel = this.node.getChildByName('des').getComponent(cc.Label);
        this.imgSprite = this.node.getChildByName('img').getComponent(cc.Sprite);
        this.widget = this.node.getComponent(cc.Widget);
    }

    onLoad () {
        NativeBanner.instance = this;
        this.init();
        this.node.active = false;
    }

    start () {

    }

    open(isCenter?: boolean){
        if(window.qg){
            this.loadNaitveAd();
            if(isCenter){
                // this.widget.isAlignHorizontalCenter = true;
                // this.widget.horizontalCenter = 0;
                this.widget.enabled = false;
                this.node.x = 0;
            }else{
                this.widget.enabled = true;
            }
            this.node.active = true;
        }
    }

    loadNaitveAd(){
        if(getPlatform() == Platform.OPPO){
            this.nativeAd = qg.createNativeAd({
                adUnitId: Math.random() < .5 ? OPPONATIVE1 : OPPONATIVE2
            });
        }else if(getPlatform() == Platform.VIVO){
            this.nativeAd = qg.createNativeAd({
                posId: Math.random() < .5 ? VIVONATIVE1 : VIVONATIVE2
            });
        }
        

        this.nativeAd.onLoad((res)=> {
            console.log('原生广告加载完成', JSON.stringify(res));
            if (res && res.adList) {
                // this.reportAdShow();
                this.nativeCurrentAd = res.adList.pop();

                // this.titleLabel.string = this.nativeCurrentAd.title;
                this.desLabel.string = this.nativeCurrentAd.desc;
                // this.node.active = true;
                let imgUrl = this.nativeCurrentAd.imgUrlList[0];
                cc.loader.load(imgUrl, (err, texture)=> {
                    if(texture == null)return;
                    var frame = new cc.SpriteFrame(texture);
                    this.imgSprite.spriteFrame=frame;
                });
            }
        })

        this.show();

        
    }

    show() {
        console.log('原生广告show');
        let adLoad = this.nativeAd.load()
        adLoad && adLoad.then(() => {
            this.reportAdShow();
            // console.log('原生广告加载完成', JSON.stringify(res));
            // this.reportAdShow();
            this.nativeAd.show().then(() => {
                // this.reportAdShow();
            });
        }).catch(err => {
            console.log('加载失败', JSON.stringify(err));
            // this.node.active = false;
            if(err.errMsg){
                this.node.active = false;
            }
        })
    }

    reportAdShow() {
        console.log('原生广告show上');
        this.nativeAd.reportAdShow({ adId: this.nativeCurrentAd.adId.toString() });
    }

    reportAdClick() {
        this.nativeAd.reportAdClick({ adId: this.nativeCurrentAd.adId.toString() });
    }

    onBtnClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onClose()
    }

    onClose(){
        this.node.active = false;
    }

    onBtnOk(){
        AudioMgr.instance.playAudio('BtnClick');
        this.reportAdClick();
    }

    onEnable(){
        // this.loadNaitveAd();
    }

    onDisable(){
        if(this.nativeAd && getPlatform() == Platform.OPPO){
            this.nativeAd.destroy();
            this.nativeAd = null;
        }
    }

    // update (dt) {}
}
