import AdRewradMgr from "./AdRewardMgr";
import AndroidHide from "./AndroidHide";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AndroidAdMgr{
    static instance: AndroidAdMgr = null;
    AndroidRewardIndex: number;

    static getInstance(){
        if(!this.instance){
            this.instance = new AndroidAdMgr();
        }
        return this.instance;
    }
    

    init(){
        this.AndroidInit();
    }

    AndroidInit(){
        cc.director.on('AndroidSuccess', this.onAndroidSuccess, this);
        cc.director.on('AndroidFail', this.onAndroidFail, this);
    }

    onAndroidSuccess(index: number){
        AdRewradMgr.instance.onSuccess(index);
    }

    onAndroidFail(index: number){
        // cc.director.emit('AndroidSuccess');
    }

    AndroidRewardShow(index: number){
        // this.AndroidShowToast();
        this.AndroidRewardIndex = index;
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showAd', '(I)V', index);
    }

    AndroidBannerShow(){
        // this.AndroidNativeShow();
        return;
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showBanner', '()V');
    }

    AndroidBannerHide(){
        // jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'hideNative', '()V');
        return;
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'hideBanner', '()V');
    }

    AndroidShowToast(){
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showToast', '()V');
    }

    AndroidInterstitialShow(){
        // if(AndroidHide.instance){
        //     AndroidHide.instance.show();
        // }
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showInterstitial', '()V');
    }

    AndroidInterstitialHide(){
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'hideInterstitial', '()V');
    }

    AndroidNativeShow(){
        jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showNative', '()V');
    }
}
