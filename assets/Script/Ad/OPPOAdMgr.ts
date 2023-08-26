import AdList from "./AdList";
import Global from "../nativets/Global";
import Game from "../Game";
import AdRewradMgr from "./AdRewardMgr";
import DataMgr from "../DataMgr";
import Shortcut from "./Shortcut";
import Statistics from "../Tool/Statistics";
import NativeBanner from "./NativeBanner";
import NativeBanner2 from "./NativeBanner2";
import NativeBanner3 from "./NativeBanner3";
import NativeBanner4 from "./NativeBanner4";

const {ccclass, property} = cc._decorator;

// 原生广告用插屏样式
// 视频2个切换

// 激励视频-02
// ID: 176997

	
// 激励视频-01
// ID: 176996
	
	
// 原生-02
// ID: 176994
	
	
// 原生-01
// ID: 176991
	
	
// 插屏-01
// ID: 176987
	
	
// 开屏-01
// ID: 176985

	
// banner-01
// ID: 176982

const OPPOVIDEO1: string = '176996';
const OPPOVIDEO2: string = '176997';
const OPPOVIDEO3: string = '191268';
const OPPONATIVE1: string = '176991';
const OPPONATIVE2: string = '176994';
const OPPOINTERSTITITAL: string = '176987';
const OPPOOPEN: string = '176985';
const OPPOBANNER: string = '176982';

const OPPOINTERSTITITALSWITCH: number = 1;

@ccclass
export default class OPPOAdMgr{
    static instance: OPPOAdMgr = null;
    windowWidth: any;
    windowHeight: any;
    zoomRateW: number;
    zoomRateH: number;
    OPPOBannerAd: any;
    realHeight: any;
    OPPOBannerIndex: any;
    OPPORewardAd1: any;
    OPPOVideoLoad1: boolean;
    OPPORewardIndex1: number;
    OPPOInterstitialAd: any;
    OPPOIntersitialRate: any;


    static getInstance(){
        if(!this.instance){
            this.instance = new OPPOAdMgr();
        }
        return this.instance;
    }
    

    init(){
        // OPPOAdMgr.instance = this;
        this.OPPOInit();
    }

    OPPOInit(){
        this.windowWidth = qg.getSystemInfoSync().windowWidth;
        this.windowHeight = qg.getSystemInfoSync().windowHeight;
        this.zoomRateW = this.windowWidth / cc.winSize.width;
        this.zoomRateH = this.windowHeight / cc.winSize.height;
        qg.reportMonitor('game_scene', 0);
        this.OPPOBannerInit();
        this.OPPORewardInit();
        this.OPPOSwitchInit();
    }
    
    async OPPOSwitchInit(){
        // this.OPPOIntersitialRate = Statistics.getInstance().getSwitchRate(OPPOINTERSTITITALSWITCH);
        this.OPPOIntersitialRate = Statistics.getInstance().getVivoSwitchRate(OPPOINTERSTITITALSWITCH);
    }

    OPPORewardInit(){
        let arrs = [OPPOVIDEO1, OPPOVIDEO2, OPPOVIDEO3];
        let vid = arrs[Math.floor(Math.random() * 3)];
        this.OPPORewardAd1 = qg.createRewardedVideoAd({ adUnitId: vid });

        this.OPPORewardAd1.onLoad(() => {
            console.log('激励视频1 广告加载成功');
            this.OPPOVideoLoad1 = true;
        })

        this.OPPORewardAd1.onError(err => {
            console.log('reward error:',err, err.errMsg);
            // this.OPPORewardAd1 = qg.createRewardedVideoAd({ adUnitId: OPPOVIDEO1 });
        })

        this.OPPORewardAd1.onClose(res => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            console.log('videoClose', res);
            if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
                if(this.OPPORewardIndex1){
                    // cc.sun.mainjs.onNativeAndroidSuccess(this.WXRewardIndex);
                    // 奖励
                    AdRewradMgr.instance.onSuccess(this.OPPORewardIndex1);
                    this.OPPORewardIndex1 = null;
                }
            }
            else {
                // 播放中途退出，不下发游戏奖励
                if(Global.getInstance().inGame == false){
                    Global.getInstance().inGame = true;
                }

                if(this.OPPORewardIndex1 == AdList.WXVIDEOLIST1.复活 && !Game.instance.reviveNode.active){
                    Game.instance.reviveNode.active = true;
                }
            }
        })
    }

    OPPOBannerInit(){
        this.OPPOBannerAd = qg.createBannerAd({
            adUnitId: OPPOBANNER,
            style: {
              height: 90,
              left: /*this.windowWidth - 305*/0,
              top: this.windowHeight - 95,
              width: 300
            }
          })

        this.OPPOBannerAd.onResize(res => {
            console.log('resize',this.windowHeight,this.OPPOBannerAd.style.realHeight,this.OPPOBannerAd.style.top);
            this.realHeight = this.OPPOBannerAd.style.realHeight;
          })

        this.OPPOBannerAd.onError(err => {
            console.log(err)
        })
        this.OPPOBannerAd.onLoad(() => {
            console.log('banner 广告加载成功');
        })
    }

    OPPOShowToast(title: string){
        qg.showToast({
            title: title,
            icon: 'none',
            duration: 2000
          })
    }

    // oppo的banner只能底下居中
    OPPOBannerShow(index: number, back?: boolean){
        // if(!this.OPPOBannerAd){
        //     return;
        // }
        this.OPPOBannerIndex = index;
        switch (index) {
            case AdList.BANNERLIST.加载右下:
                if(!this.OPPOBannerAd){
                    return;
                }
                // this.OPPOBannerAd.style.left = /*this.windowWidth - 305*/ 0;
                // this.OPPOBannerAd.style.top = this.windowHeight - 90;
                this.OPPOBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.首页右下:
            
                // break;
            case AdList.BANNERLIST.地图详情右下:
                if(NativeBanner.instance){
                    NativeBanner.instance.open();
                }
                break;
            case AdList.BANNERLIST.游戏内暂停中下:
                if(!this.OPPOBannerAd){
                    return;
                }
                // this.OPPOBannerAd.style.left = /*this.windowWidth - 305*/ 0;
                // this.OPPOBannerAd.style.top = this.windowHeight - 90;
                this.OPPOBannerAd.show().catch(err => console.log(err));
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
                if(NativeBanner3.instance){
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

    OPPOBannerHide(){
        if(this.OPPOBannerAd){
            this.OPPOBannerAd.hide();
            this.OPPOBannerIndex = null;
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

    OPPOBannerDestroy(){
        if(this.OPPOBannerAd){
            this.OPPOBannerAd.destroy();
            this.OPPOBannerIndex = null;
        }
    }

    OPPORewardShow(index: number){
        this.OPPORewardIndex1 = index;
        if(this.OPPORewardAd1){
            this.OPPORewardAd1.show()
            .catch(err => {
                this.OPPORewardAd1.load()
                .then(() => this.OPPORewardAd1.show());
            }).then(()=>{
                if(this.needPause(index)){
                    if(this.OPPOVideoLoad1)
                    Global.getInstance().inGame = false;
                }
                if(!this.OPPOVideoLoad1){
                    //如果没有直接给
                    if(this.OPPORewardIndex1){
                        // this.OPPOShare(this.OPPORewardIndex1);
                        // AdRewradMgr.instance.onSuccess(this.OPPORewardIndex1);
                        this.OPPOShowToast('视频准备中...');
                    }
                }
            });
        }else{
            // this.OPPOShowToast('视频准备中...');
            // this.OPPORewardInit();
        }
        
        
    }

    OPPOInterstitialShow(){
        // console.log('插屏',DataMgr.instance.oppoLimitNum);
        // if(DataMgr.instance.oppoLimitNum <= 0){
        //     return;
        // }
       

        this.OPPOInterstitialAd = qg.createInterstitialAd({ adUnitId: OPPOINTERSTITITAL })
        this.OPPOInterstitialAd.onLoad(() => {
            console.log('插屏 广告加载成功')
            this.OPPOInterstitialAd.show().catch((err) => {
                console.error(err)
              })
            DataMgr.instance.oppoLimitNum --;
            DataMgr.instance.saveOPPOLimitData();
        })

        this.OPPOInterstitialAd.onError(err => {
            console.log(err)
        })
    }

    OPPOShortcutShow(){
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

    OPPOShortcutAdd(){
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
