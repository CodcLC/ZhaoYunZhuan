import AdList from "./AdList";
import Global from "../nativets/Global";
import AdRewradMgr from "./AdRewardMgr";
import Game from "../Game";
import DataMgr from "../DataMgr";
import { load } from "../nativets/SaveMgr";
import Shortcut from "./Shortcut";
import NativeBanner from "./NativeBanner";
import Statistics from "../Tool/Statistics";
import NativeBanner2 from "./NativeBanner2";
import NativeBanner3 from "./NativeBanner3";
import NativeBanner4 from "./NativeBanner4";

const {ccclass, property} = cc._decorator;

// 三国-视频-02
// posID：4dfc0f3912294a42bc0012c34481e248


// 三国-视频-01
// posID：37e8460a834a4585b8418e3d70a85b42

// 用
// 三国-原生-02
// posID：aaab4f80bb33414bb886f62b6df5c98a


// 三国-原生-01
// posID：b4e2e0c887ed42fe9d6947f5e573d72f


// 三国-插屏-01
// posID：cd35c14b52874b75ad13e5e96b25ccd5


// 三国-banner-01
// posID：ce3e5243fee144c1915ee8de8b944257

const VIVOVIDEO1: string = '37e8460a834a4585b8418e3d70a85b42';
const VIVOVIDEO2: string = '4dfc0f3912294a42bc0012c34481e248';
const VIVOVIDEO3: string = '66e55a1192a9457383aa1ca91a801a51';
const VIVONATIVE1: string = 'b4e2e0c887ed42fe9d6947f5e573d72f';
const VIVONATIVE2: string = 'aaab4f80bb33414bb886f62b6df5c98a';
const VIVOINTERSTITITAL1: string = 'cd35c14b52874b75ad13e5e96b25ccd5';
const VIVOINTERSTITITAL2: string = 'f9b8dd17e8004d7c9c818f80ad15c4bc';
const VIVOINTERSTITITAL3: string = '81cb5047e29042aea6f09ab5fc11d7b7';

const VIVOOPEN: string = '176985';
const VIVOBANNER: string = 'ce3e5243fee144c1915ee8de8b944257';
const VIVOINTERSTITITALSWITCH: number = 69;

@ccclass
export default class VIVOAdMgr{
    static instance: VIVOAdMgr = null;
    VIVOBannerAd: any;
    VIVOBannerIndex: number;
    VIVORewardAd1: any;
    VIVORewardIndex1: number;
    VIVOVideoLoad1: boolean;
    VIVOInterstitialAd: any;
    windowWidth: number;
    windowHeight: number;
    zoomRateW: number;
    zoomRateH: number;
    VIVOIntersitialRate: any;

    static getInstance(){
        if(!this.instance){
            this.instance = new VIVOAdMgr();
        }
        return this.instance;
    }
    

    init(){
        this.windowWidth = qg.getSystemInfoSync().screenWidth;
        this.windowHeight = qg.getSystemInfoSync().screenHeight;
        // this.zoomRateW = this.windowWidth / cc.winSize.width;
        // this.zoomRateH = this.windowHeight / cc.winSize.height;
        console.log('WH',qg.getSystemInfoSync(), this.windowHeight, this.windowWidth);
        this.VIVOInit();
        
    }

    VIVOInit(){

        this.VIVOBannerInit();
        this.VIVORewardInit();
        this.VIVOInfoLoad();
        this.VIVOSwitchInit();
        this.VIVOInterstitialLoad();
    }

    async VIVOSwitchInit(){
        this.VIVOIntersitialRate = await Statistics.getInstance().getVivoSwitchRate(VIVOINTERSTITITALSWITCH);
    }

    VIVOInfoLoad(){
        let vivoinfo: string = load('VIVOInfo');
        if(!vivoinfo){
            // HeroGlobal.instance.BgmSwitch = true;
            // HeroGlobal.instance.EffectSwitch = true;
        }else{
            let json = JSON.parse(vivoinfo);
            console.log('VIVOJSON', json);
            Global.getInstance().vivoName = json.vivoName;
            Global.getInstance().vivoHead = json.vivoHead;
        }
    }

    VIVOBannerInit(){
        this.VIVOBannerAd = qg.createBannerAd({
            posId: VIVOBANNER,
            style: {
              height: 170,
              left: this.windowWidth * .5 - 540,
              top: this.windowHeight - 175,
              width: 1080
            }
          })

          this.VIVOBannerAd.onSize(res => {
            // console.log('resize',this.windowHeight,this.VIVOBannerAd.style.realHeight,this.VIVOBannerAd.style.top);
            console.log('banner 广告size',res,this.VIVOBannerAd);
            // this.VIVOBannerAd.Style.left = 0;
            // this.VIVOBannerAd.style.left = 0;
            // this.realHeight = this.VIVOBannerAd.style.realHeight;
          })

        this.VIVOBannerAd.onResize(res => {
            // console.log('resize',this.windowHeight,this.VIVOBannerAd.style.realHeight,this.VIVOBannerAd.style.top);
            console.log('banner 广告resize',res);
            // this.realHeight = this.VIVOBannerAd.style.realHeight;
          })

        this.VIVOBannerAd.onError(err => {
            console.log('banner 广告加载失败',err,err.errCode,err.errMsg)
        })
        this.VIVOBannerAd.onLoad(() => {
            console.log('banner 广告加载成功',this.VIVOBannerAd.style);
        })
    }

    VIVORewardInit(){
        let arrs = [VIVOVIDEO1, VIVOVIDEO2, VIVOVIDEO3];
        let vid = arrs[Math.floor(Math.random() * 3)];
        this.VIVORewardAd1 = qg.createRewardedVideoAd({ posId: vid });

        this.VIVORewardAd1.onLoad(() => {
            console.log('激励视频1 广告加载成功');
            this.VIVOVideoLoad1 = true;
        })

        this.VIVORewardAd1.onError(err => {
            console.log('reward error:',err, err.errMsg)
            // this.VIVORewardAd1 = qg.createRewardedVideoAd({ adUnitId: VIVOVIDEO1 });
        })

        this.VIVORewardAd1.onClose(res => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            console.log('videoClose', res);
            if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
                if(this.VIVORewardIndex1){
                    // cc.sun.mainjs.onNativeAndroidSuccess(this.WXRewardIndex);
                    // 奖励
                    AdRewradMgr.instance.onSuccess(this.VIVORewardIndex1);
                    this.VIVORewardIndex1 = null;
                }
            }
            else {
                // 播放中途退出，不下发游戏奖励
                if(Global.getInstance().inGame == false){
                    Global.getInstance().inGame = true;
                }

                if(this.VIVORewardIndex1 == AdList.WXVIDEOLIST1.复活 && !Game.instance.reviveNode.active){
                    Game.instance.reviveNode.active = true;
                }
            }
        })
    }

    VIVOBannerShow(index: number, back?: boolean){
        
        this.VIVOBannerIndex = index;
        switch (index) {
            case AdList.BANNERLIST.加载右下:
                if(!this.VIVOBannerAd){
                    this.VIVOBannerInit();
                    return;
                }
                this.VIVOBannerAd.show().catch(err => console.log(err));
                break;

            case AdList.BANNERLIST.首页右下:
            
                // break;
            case AdList.BANNERLIST.地图详情右下:
                if(NativeBanner.instance){
                    NativeBanner.instance.open();
                }
                break;
            case AdList.BANNERLIST.游戏内暂停中下:
                // this.VIVOBannerAd.style.left = 0;
                // this.VIVOBannerAd.style.top = 0;
                if(!this.VIVOBannerAd){
                    return;
                }
                this.VIVOBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.游戏结算右上:
                if(NativeBanner2.instance){
                    NativeBanner2.instance.open();
                }
                break;
            case AdList.BANNERLIST.奇遇中下:
                if(NativeBanner.instance){
                    NativeBanner.instance.open(true);
                }
                break;
            case AdList.BANNERLIST.周边左下:
                // console.log('showBanner3', NativeBanner3.instance.node.x , NativeBanner3.instance.node.y);
                if(NativeBanner3.instance){
                    // console.log('showBanner3222');
                    NativeBanner3.instance.open();
                }
                break;
            case AdList.BANNERLIST.地图右上:
                if(NativeBanner4.instance){
                    NativeBanner4.instance.open();
                }
                break;
            default:
                break;
        }
    }

    VIVOBannerHide(){
        if(this.VIVOBannerAd){
            this.VIVOBannerAd.hide();
            this.VIVOBannerIndex = null;
        }
        if(NativeBanner.instance){
            NativeBanner.instance.onClose();
        }
        if(NativeBanner2.instance){
            NativeBanner2.instance.onClose();
        }
        if(NativeBanner3.instance){
            NativeBanner3.instance.onClose();
        }
        if(NativeBanner4.instance){
            NativeBanner4.instance.onClose();
        }
    }

    VIVOBannerDestroy(){
        if(this.VIVOBannerAd){
            this.VIVOBannerAd.destroy();
            this.VIVOBannerIndex = null;
        }
    }

    VIVOShowToast(title: string){
        qg.showToast({
            message: title
          })
    }

    // VIVORewardShow(index: number){
    //     this.VIVORewardIndex1 = index;
    //     if(this.VIVORewardAd1){
    //         this.VIVORewardAd1.show()
    //         .catch(err => {
    //             this.VIVORewardAd1.load()
    //             .then(() => this.VIVORewardAd1.show());
    //         }).then(()=>{
    //             if(this.needPause(index)){
    //                 if(this.VIVOVideoLoad1)
    //                 Global.getInstance().inGame = false;
    //             }
    //             if(!this.VIVOVideoLoad1){
    //                 //如果没有直接给
    //                 if(this.VIVORewardIndex1){
    //                     // this.VIVOShare(this.VIVORewardIndex1);
    //                     // AdRewradMgr.instance.onSuccess(this.VIVORewardIndex1);
    //                     this.VIVOShowToast('视频准备中...');
    //                 }
    //             }
    //         });
    //     }else{
    //         // this.VIVOShowToast('视频准备中...');
    //         // this.VIVORewardInit();
    //     }
        
        
    // }

    VIVORewardShow(index: number){
        this.VIVORewardIndex1 = index;
        let adLoad = this.VIVORewardAd1.load();//第一次调用 可能会报-3  广告能正常展示就可以忽略
        // 捕捉load失败的错误
        adLoad && adLoad.catch(err=>{
            console.log("激励广告load失败"+JSON.stringify(err))
            this.VIVOShowToast('视频准备中...');
        })
        this.VIVORewardAd1.onLoad(()=>{
            let adshow = this.VIVORewardAd1.show();
            // 捕捉show失败的错误
            adshow && adshow.catch(err=>{
                console.log("激励广告展示失败"+JSON.stringify(err))
                this.VIVOShowToast('视频准备中...');
            })
        })
    }

    VIVOInterstitialLoad(){
        let arrs = [VIVOINTERSTITITAL1, VIVOINTERSTITITAL2, VIVOINTERSTITITAL3];
        let adId = arrs[Math.floor(Math.random() * 3)];
        this.VIVOInterstitialAd = qg.createInterstitialAd({ posId: adId })
        this.VIVOInterstitialAd.onLoad(() => {
            console.log('插屏 广告加载成功')
            // DataMgr.instance.vivoLimitNum --;
            // DataMgr.instance.saveVIVOLimitData();
            // this.VIVOInterstitialAd.show().catch((err) => {
            //     console.error(err)
            //   })
        })

        this.VIVOInterstitialAd.onError(err => {
            console.log('插屏 广告加载失败',err)
            setTimeout(() => {
                let arrs = [VIVOINTERSTITITAL1, VIVOINTERSTITITAL2, VIVOINTERSTITITAL3];
                let adId = arrs[Math.floor(Math.random() * 3)];
                this.VIVOInterstitialAd = qg.createInterstitialAd({ posId: adId })
                this.VIVOInterstitialAd.onLoad(() => {
                    console.log('插屏 广告重载成功')
                    // DataMgr.instance.vivoLimitNum --;
                    // DataMgr.instance.saveVIVOLimitData();
                    // this.VIVOInterstitialAd.show().catch((err) => {
                    //     console.error(err)
                    //   })
                })
            }, 5);
        })
    }

    VIVOInterstitialShow(){
        // if(DataMgr.instance.vivoLimitNum <= 0){
        //     return;
        // }
        console.error('显示插屏')


        this.VIVOInterstitialAd && this.VIVOInterstitialAd.show().catch((err) => {
            console.error('插屏 广告显示失败',err)
            
            })
        this.VIVOInterstitialLoad();
    }

    VIVOShortcutShow(){
        qg.hasShortcutInstalled({
            success: function(res) {
              // 判断图标未存在时，创建图标
              if (res == false) {
                // qg.installShortcut({
                //   success: function() {
                //     // 执行用户创建图标奖励
                //   },
                //   fail: function(err) {},
                //   complete: function() {}
                // })
                if(Shortcut.instance){
                    Shortcut.instance.open();
                }
              }
            },
            fail: function(err) {},
            complete: function() {}
          })
    }

    VIVOShortcutAdd(){
        qg.installShortcut({
        success: function() {
        // 执行用户创建图标奖励
        if(Shortcut.instance){
            Shortcut.instance.onReward();
        }
        },
        fail: function(err) {},
        complete: function() {}
    })
    }


    needPause(index: number){
        return false;
    }

}
