import { getPlatform, Platform } from "../nativets/Platform";
import WXAdMgr from "./WXAdMgr";
import AdRewradMgr from "./AdRewardMgr";
import QQAdMgr from "./QQAdMgr";
import OPPOAdMgr from "./OPPOAdMgr";
import VIVOAdMgr from "./VIVOAdMgr";
import NativeAd from "./NativeAd";
import AndroidAdMgr from "./AndroidAdMgr";
import TTAdMgr from "./TTAdMgr";

const {ccclass, property} = cc._decorator;


@ccclass
export default class AdMgr extends cc.Component {
    static instance: AdMgr = null;
    PlatformString: string;
    OPPOInterstitialCount: number;
    VIVOInterstitialCount: number;
    

    init(){
        // Statistics.getInstance();
        AdRewradMgr.getInstance();
        this.PlatformString = getPlatform();
        console.log(this.PlatformString);
        switch (this.PlatformString) {
            case Platform.WX:
                WXAdMgr.getInstance().init();
                break;
            case Platform.QQ:
                QQAdMgr.getInstance().init();
                break;
            case Platform.OPPO:
                OPPOAdMgr.getInstance().init();
                this.OPPOInterstitialCount = 0;
                break;
            case Platform.VIVO:
                VIVOAdMgr.getInstance().init();
                this.VIVOInterstitialCount = 0;
                break;
            case Platform.Android:
                AndroidAdMgr.getInstance().init();
                break;
            case Platform.TT:
                TTAdMgr.getInstance().init();
                break;
            default:
                break;
        }
    }

    showBannerAd(index: number){
        switch (this.PlatformString) {
            case Platform.WX:
                WXAdMgr.instance.WXBannerShow(index);
                break;
            case Platform.QQ:
                QQAdMgr.instance.QQBannerShow(index);
                break;
            case Platform.OPPO:
                OPPOAdMgr.instance.OPPOBannerShow(index);
                break;
            case Platform.VIVO:
                VIVOAdMgr.instance.VIVOBannerShow(index);
                break;
            case Platform.Android:
                AndroidAdMgr.instance.AndroidBannerShow();
                break;
            case Platform.TT:
                TTAdMgr.instance.TTBannerShow(index);
            default:
                break;
        }
    }

    reloadBanner(){
        switch (this.PlatformString) {
            case Platform.WX:
                WXAdMgr.instance.WXBannerInit();
                break;
            case Platform.QQ:
                QQAdMgr.instance.QQBannerInit();
                // this.scheduleOnce(()=>{
                //     QQAdMgr.instance.QQBannerHide();
                // }, .5);
                
                break;
            // case Platform.OPPO:
            //     OPPOAdMgr.instance.OPPOBannerShow(index);
            //     break;
            // case Platform.VIVO:
            //     VIVOAdMgr.instance.VIVOBannerShow(index);
            //     break;
            // case Platform.Android:
            //     AndroidAdMgr.instance.AndroidBannerShow();
            //     break;
            default:
                break;
        }

    }

    getBoxGiftRate(win: boolean){
        
        switch (this.PlatformString) {
            case Platform.WX:
                return win ? WXAdMgr.instance.winRate : WXAdMgr.instance.failRate;
                break;
            case Platform.QQ:
                console.log('BoxRate',QQAdMgr.instance.winRate, QQAdMgr.instance.failRate);
                return win ? QQAdMgr.instance.winRate : QQAdMgr.instance.failRate;
                break;
            default:
                break;
        }
    }

    getBoxGiftLimit(win: boolean){
        switch (this.PlatformString) {
            case Platform.WX:
                return win ? WXAdMgr.instance.winLimit : WXAdMgr.instance.failLimit;
                break;
            case Platform.QQ:
                return win ? QQAdMgr.instance.winLimit : QQAdMgr.instance.failLimit;
                break;
            default:
                break;
        }
    }

    showRewardAd(index: number){
        cc.log('showRewardAd',index);
        switch (this.PlatformString) {
            case Platform.WX:
                WXAdMgr.instance.WXRewardShow(index);
                break;
            case Platform.QQ:
                QQAdMgr.instance.QQRewardShow(index);
                break;
            case Platform.OPPO:
                // AdRewradMgr.instance.onSuccess(index);
                // OPPOAdMgr.instance.OPPOShowToast('视频准备中...');
                OPPOAdMgr.instance.OPPORewardShow(index);
                break;
            case Platform.VIVO:
                // AdRewradMgr.instance.onSuccess(index);
                // VIVOAdMgr.instance.VIVOShowToast('视频准备中...');
                VIVOAdMgr.instance.VIVORewardShow(index);
                break;
            case Platform.Android:
                AndroidAdMgr.instance.AndroidRewardShow(index);
                break;
            case Platform.TT:
                TTAdMgr.instance.TTRewardShow(index);
                break;
            default:
                break;
        }
    }

    showShortcut(){
        switch (this.PlatformString) {
            case Platform.WX:
                WXAdMgr.instance.WXFLoatShow();
                break;
            case Platform.QQ:
                QQAdMgr.instance.QQFLoatShow();
                QQAdMgr.instance.QQShortcutShow();
                break;
            case Platform.OPPO:
                OPPOAdMgr.instance.OPPOShortcutShow();
                break;
            case Platform.VIVO:
                VIVOAdMgr.instance.VIVOShortcutShow();
                break;
            default:
                break;
        }
    }

    addShortcut(){
        switch (this.PlatformString) {
            case Platform.WX:
                // WXAdMgr.instance.WXBannerShow(index);
                break;
            case Platform.QQ:
                // QQAdMgr.instance.QQBannerShow(index);
                QQAdMgr.instance.QQShortcutAdd();
                break;
            case Platform.OPPO:
                OPPOAdMgr.instance.OPPOShortcutAdd();
                break;
            case Platform.VIVO:
                VIVOAdMgr.instance.VIVOShortcutAdd();
                break;
            default:
                break;
        }
    }

    showGamePortal(){
        switch (this.PlatformString) {
            case Platform.WX:
                WXAdMgr.instance.WXGamePortalShow();
                break;
            case Platform.QQ:
                QQAdMgr.instance.QQAppBoxShow();
                break;
            default:
                break;
        }
    }

    showGridAd(){
        switch (this.PlatformString) {
            case Platform.WX:
                WXAdMgr.instance.WXGridAdShow();
                break;
            default:
                break;
        }
    }

    showInterstitial(){
        switch (this.PlatformString) {
            case Platform.WX:
                // WXAdMgr.instance.WXRewardShow(index);
                break;
            case Platform.QQ:
                // QQAdMgr.instance.QQRewardShow(index);
                break;
            case Platform.OPPO:
                
                // // 前2次原生
                // if(this.OPPOInterstitialCount < 2){
                //     this.showNativeAd();
                // }else{
                    OPPOAdMgr.instance.OPPOInterstitialShow();
                // }
                // this.OPPOInterstitialCount ++;
                break;
            case Platform.VIVO:

                VIVOAdMgr.instance.VIVOInterstitialShow();
                break;
            case Platform.Android:
                AndroidAdMgr.instance.AndroidInterstitialShow();
            default:
                break;
        }
    }

    showNativeAd(){
        switch (this.PlatformString) {
            case Platform.WX:
                // WXAdMgr.instance.WXRewardShow(index);
                break;
            case Platform.QQ:
                // QQAdMgr.instance.QQRewardShow(index);
                break;
            case Platform.OPPO:
                // if(NativeAd.instance){
                //     NativeAd.instance.open();
                // }
                 // 前2次原生
                // console.log('this.OPPOInterstitialCount', this.OPPOInterstitialCount);
                // if(this.OPPOInterstitialCount < 2){
                //     // this.showNativeAd();
                //     if(NativeAd.instance){
                //         NativeAd.instance.open();
                //     }
                // }else{
                //     OPPOAdMgr.instance.OPPOInterstitialShow();
                // }
                // this.OPPOInterstitialCount ++;
                break;
            case Platform.VIVO:
                if(NativeAd.instance){
                    NativeAd.instance.open();
                }
                // if(this.VIVOInterstitialCount < 2){
                //     // this.showNativeAd();
                //     if(NativeAd.instance){
                //         NativeAd.instance.open();
                //     }
                // }else{
                //     VIVOAdMgr.instance.VIVOInterstitialShow();
                // }
                // this.VIVOInterstitialCount ++;
                break;
            case Platform.Android:
                // AndroidAdMgr.instance.AndroidBannerShow();
                break;
            default:
                break;
        }
    }

    hideBanner(){
        switch (this.PlatformString) {
            case Platform.WX:
                WXAdMgr.instance.WXBannerHide();
                break;
            case Platform.QQ:
                QQAdMgr.instance.QQBannerHide();
                break;
            case Platform.OPPO:
                OPPOAdMgr.instance.OPPOBannerHide();
                break;
            case Platform.VIVO:
                VIVOAdMgr.instance.VIVOBannerHide();
                break;
            case Platform.Android:
                AndroidAdMgr.instance.AndroidBannerHide();
                break;
            case Platform.TT:
                TTAdMgr.instance.TTBannerHide();
            default:
                break;
        }
        this.reloadBanner();
    }

    onLoad () {
        AdMgr.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.init();
    }

    
    


    start () {

    }

    // update (dt) {}
}
