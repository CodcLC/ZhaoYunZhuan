import Game from "../Game";
import BATips from "../BizarreAdventure/BATips";
import { save } from "../nativets/SaveMgr";
import Statistics from "../Tool/Statistics";
import HeroGlobal from "../Hero/HeroGlobal";
import Menu from "../Menu";
import AdList from "./AdList";
import AdRewradMgr from "./AdRewardMgr";
import Global from "../nativets/Global";

const {ccclass, property} = cc._decorator;

const ttid = 'tt241a52a7bb20e56d';
const TTINTERSTISTER = 'd30i34i5fd5dgki7uh';
const TTVIDEO = '220e52hfnkn3ggao3e';
const TTBANNER = '32memq0e04i9e3g5b6';

@ccclass
export default class TTAdMgr {
    static instance: TTAdMgr = null;
    mVideoPath: string;
    gameRecorderManager: any;
    ttName: string = '';
    ttHead: string = '';
    windowWidth: any;
    windowHeight: any;
    zoomRateW: number;
    zoomRateH: number;
    TTBannerAd: any;
    realHeight: any;
    TTBannerIndex: number;
    TTRewardAd: any;
    WXRewardIndex1: any;
    TTVideoLoad: boolean;

    static getInstance(){
        if(!this.instance){
            this.instance = new TTAdMgr();
        }
        return this.instance;
    }
    
    init(){
        TTAdMgr.instance = this;
        this.TTInit();
    }

    TTInit(){
        this.windowWidth = wx.getSystemInfoSync().windowWidth;
        this.windowHeight = wx.getSystemInfoSync().windowHeight;
        this.zoomRateW = this.windowWidth / cc.winSize.width;
        this.zoomRateH = this.windowHeight / cc.winSize.height;

        // let menuRect = wx.getMenuButtonBoundingClientRect();
        // let menuY = cc.winSize.height * .5 - ((menuRect.bottom + menuRect.height * .25) / this.zoomRateH);
        // let menuX = ((menuRect.left + menuRect.width * .25) / this.zoomRateH) - cc.winSize.width * .5;
        // this.menuPosition = cc.v2(menuX, menuY);

        this.TTBannerInit();
        this.TTRewardInit();
    }

    TTBannerInit(){
        this.TTBannerAd = wx.createBannerAd({
            adUnitId: TTBANNER,
            style: {
              adIntervals: 30,
              left: this.windowWidth - 250,
              top: this.windowHeight - (150 / 16) * 9 - 12,
              width: 150
            }
          })

        this.TTBannerAd.onResize(res => {
            // cc.log('resize',res);
            // // this.realHeight = this.TTBannerAd.style.realHeight;

            // this.TTBannerAd.style.top = this.windowHeight - res.hright;
            // // this.bw = 304 / this.zoomRateW;
            // // this.bh = (this.bannerAd.style.realHeight + 4) / this.zoomRateH;
          })

        this.TTBannerAd.onError(err => {
            cc.log(err)
        })
        this.TTBannerAd.onLoad(() => {
            cc.log('banner 广告加载成功');
        })
    }

    TTBannerShow(index: number, back?: boolean){
        if(!this.TTBannerAd){
            return;
        }
        this.TTBannerIndex = index;
        this.TTBannerAd.style.width = index == AdList.BANNERLIST.通关宝箱 ? 550 : 300;
        switch (index) {
            case AdList.BANNERLIST.首页右下:
            case AdList.BANNERLIST.地图详情右下:
                // this.TTBannerAd.style.left = this.windowWidth - 305;
                // this.TTBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                // if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                //     this.TTBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                // }
                this.TTBannerAd.show().catch(err => console.log(err));
                break;
            // case AdList.BANNERLIST.游戏内暂停中下:
            //     this.TTBannerAd.style.left = this.windowWidth * .5 - 150;
            //     this.TTBannerAd.style.top = this.windowHeight - this.realHeight - 0;
            //     if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
            //         this.TTBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
            //     }
            //     this.TTBannerAd.show().catch(err => console.log(err));
            //     break;
            // case AdList.BANNERLIST.奇遇中下:
            //     this.TTBannerAd.style.left = this.windowWidth * .5 - 150;
            //     this.TTBannerAd.style.top = this.windowHeight - this.realHeight - 0;
            //     if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
            //         this.TTBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
            //     }
            //     this.TTBannerAd.show().catch(err => console.log(err));
            //     break;
            // case AdList.BANNERLIST.通关宝箱:
            //     this.TTBannerAd.style.left = this.windowWidth * .5 - 275;
            //     this.TTBannerAd.style.top = this.windowHeight * .5 - this.realHeight * .5;
            //     this.TTBannerAd.show().catch(err => console.log(err));
            //     break;
            default:
                break;
        }
    }

    TTBannerHide(){
        if(this.TTBannerAd){
            this.TTBannerAd.hide();
            
        }
        this.TTBannerIndex = null;
    }

    TTRewardInit(){
        this.TTRewardAd = wx.createRewardedVideoAd({ adUnitId: TTVIDEO });

        this.TTRewardAd.onLoad(() => {
            cc.log('激励视频1 广告加载成功');
            this.TTVideoLoad = true;
        })

        this.TTRewardAd.onError(err => {
            cc.log('reward error:'+err)
        })

        this.TTRewardAd.onClose(res => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
                if(this.WXRewardIndex1){
                    // cc.sun.mainjs.onNativeAndroidSuccess(this.WXRewardIndex);
                    // 奖励
                    AdRewradMgr.instance.onSuccess(this.WXRewardIndex1);
                    this.WXRewardIndex1 = null;
                }
            }
            else {
                // 播放中途退出，不下发游戏奖励
                if(Global.getInstance().inGame == false){
                    Global.getInstance().inGame = true;
                }

                if(this.WXRewardIndex1 == AdList.WXVIDEOLIST1.复活 && !Game.instance.reviveNode.active){
                    Game.instance.reviveNode.active = true;
                }
            }
        })
    }

    TTRewardShow(index: number){
        // this.TTToastShow();
        this.WXRewardIndex1 = index;
        this.TTRewardAd.show()
        .catch(err => {
            this.TTRewardAd.load()
            .then(() => this.TTRewardAd.show());
        }).then(()=>{

            if(!this.TTVideoLoad){
                //如果没有直接给
                if(this.WXRewardIndex1){
                    // this.TTToastShow();
                }
            }
        });
    }

    TTToastShow(){
        tt.showToast({
            title: "视频准备中...",
            // duration: 2000,
            icon: 'none',
            success(res) {
              console.log(`${res}`);
            },
            fail(res) {
              console.log(`showToast调用失败`);
            }
          });
    }

    startRecoder(){
        console.log("调用录屏");
        if(window.tt){
            if(!this.gameRecorderManager){
                this.gameRecorderManager=tt.getGameRecorderManager();
            }
            this.gameRecorderManager.start({
                duration:300,
            });
            this.gameRecorderManager.onStart(res=>{
                cc.log("录屏开始,弹出提示");
                tt.showToast({
                    title: '开始录屏',
                    duration: 2000,
                    success (res) {
                        console.log("弹出提示成功");
                    },
                    fail (res) {
                        console.log("弹出提示失败");
                    }
                });
                
            });
            this.gameRecorderManager.onPause(res=>{
                cc.log("暂停录屏");
            });
            this.gameRecorderManager.onResume(res=>{
                cc.log("继续录屏");
            });
            this.gameRecorderManager.onStop(res=>{
                this.mVideoPath = res.videoPath;
                cc.log("录屏结束： "+this.mVideoPath);
                // this.share();
            });
        }
    }

    pauseRecoder(){
        if(this.gameRecorderManager)
        this.gameRecorderManager.pause();
    }

    resumeRecoder(){
        if(this.gameRecorderManager)
        this.gameRecorderManager.resume();
    }

    stopRecoder(){
        if(this.gameRecorderManager)
        this.gameRecorderManager.stop();
    }

    getUserInfo(){
        console.log('ttgetuserinfo');
        let self = this;
        wx.getUserInfo({
            fail: function (res) {
                if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                    // 处理用户拒绝授权的情况
                    this.guideActive()
                }
            }.bind(this),
            success: function (res) {
                console.log('ttgetuserinfoSuccess');
                this.setUserData(res)
            }.bind(this)
        })
    }

    guideActive() {
        wx.showModal({
        title: '警告',
        content: '拒绝授权将无法正常使用排行榜',
        cancelText: '取消',
        showCancel: true,
        confirmText: '设置',
        success: (function (res) {
            if (res.confirm) {
            wx.openSetting({
                success: (function (res) {
                if (res.authSetting['scope.userInfo'] === true) {
                    this.getUserInfo()
                }
                }).bind(this)
            })
            }else {
            }
        }).bind(this)
        })
    }

    setUserData(res) {
        this.ttName = res.userInfo.nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '');  //去除昵称中的emoji
        this.ttHead = res.userInfo.avatarUrl;

        // let ttdata = {
        //     ttName: this.ttName,
        //     ttHead: this.ttHead
        // }
        // save('TTInfo', JSON.stringify(ttdata));
        
        let onGet = (ret: any) => {
            console.log('register', ret);

            if(ret.code == 1){
                cc.director.emit('FirstReport');
                Statistics.getInstance().reportRank(Statistics.RANKLIST.杀戮榜, HeroGlobal.instance.MonsterKillCount);
                // Statistics.getInstance().reportRank(Statistics.RANKLIST.战力榜, HeroGlobal.instance.HighestCE);
                Statistics.getInstance().reportRank(Statistics.RANKLIST.通关榜, HeroGlobal.instance.StarCount);
                if(Menu.instance){
                    Menu.instance.OpenRank();
                }
            }else{
                cc.log(ret.error);
            }
        }
        Statistics.getInstance().updateUserInfo(this.ttName, this.ttHead,onGet);
    }

    TTVideoShare(){
        cc.log("调用分享");
        tt.shareVideo({
            videoPath:this.mVideoPath,
            success () {
                cc.log('分享成功！');
                Game.instance.ttShareBtn.interactable = false;
                if(BATips.instance){
                    BATips.instance.showBoxGiftReward();
                }
              },
            fail (e) {
                cc.log('分享失败！');
                // cc.sun.mainjs.shareRecoderCallback();
              }
        });
    }
}
