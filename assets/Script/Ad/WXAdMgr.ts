import Global from "../nativets/Global";
import AdRewradMgr from "./AdRewardMgr";
import AdList from "./AdList";
import Statistics from "../Tool/Statistics";
import { save, load } from "../nativets/SaveMgr";
import Game from "../Game";
import WXFLoat from "./WXFLoat";

// 视频1-复活，buff
const WXVIDEO1: string = 'adunit-90add2032634a60c';
// 视频2-加金币钻石体力
const WXVIDEO2: string = 'adunit-f00eb3c8cad7ed3d';

const WXBANNER: string = 'adunit-aa8bcb718d1c1800';
// 腾讯的交叉推广 
const WXGAMEPORTAL: string = 'PBgAAyAVEGWVHwUM';

const BOXVERSION: string = ',1.0.25,';

const WXBOXGIFTWINSWITCH = 76;
const WXBOXGIFTFAILSWITCH = 75;

const WXMOREGAMEOTHERS = 74;

export default class WXAdMgr{
    static instance: WXAdMgr = null;
    windowWidth: any;
    windowHeight: any;
    zoomRateW: number;
    zoomRateH: number;
    WXBannerAd: any;
    WXRewardAd1: any;
    WXVideoLoad1: boolean;
    WXRewardIndex1: number;
    WXRewardAd2: any;
    WXRewardIndex2: any;
    WXVideoLoad2: boolean;
    WXBannerIndex: number;
    realHeight: any;
    WXGamePortal: any;
    shareStartTime: number;
    shareIndex: number;
    shareCount: number = 0;
    shareSuccess: number = 0;
    WXGridAd: any;
    menuPosition: cc.Vec2;
    BoxBannerAd: any;
    realBoxHeight: any;
    winRate: number;
    winLimit: number;
    failRate: number;
    failLimit: number;
    moreGameRate: number;

    static getInstance(){
        if(!this.instance){
            this.instance = new WXAdMgr();
        }
        return this.instance;
    }
    
    init(){
        WXAdMgr.instance = this;
        this.WXInit();
    }
    
    WXInit(){
        this.windowWidth = wx.getSystemInfoSync().windowWidth;
        this.windowHeight = wx.getSystemInfoSync().windowHeight;
        this.zoomRateW = this.windowWidth / cc.winSize.width;
        this.zoomRateH = this.windowHeight / cc.winSize.height;

        let menuRect = wx.getMenuButtonBoundingClientRect();
        let menuY = cc.winSize.height * .5 - ((menuRect.bottom + menuRect.height * .25) / this.zoomRateH);
        let menuX = ((menuRect.left + menuRect.width * .25) / this.zoomRateH) - cc.winSize.width * .5;
        this.menuPosition = cc.v2(menuX, menuY);

        this.WXBannerInit();
        this.WXRewardInit();
        this.WXGamePortalInit();
        // this.WXGridAdInit();
        this.WXHideShow();
        this.WXInfoLoad();
        this.initShareSuccess();
        this.WXSwitchInit();
    }

    initShareSuccess(){
        let ss: string = load('shareSuccess');
        if(ss){
            this.shareSuccess = parseInt(ss);
        }
    }

    WXSwitchInit(){
        // this.boxGiftWin = 
        let onGet1 = (ret: any)=>{
            console.log("当前城市：", cc.sys.localStorage.getItem('city'));
            if(ret.code == 200){
                console.log("概率", ret.data);
                
                // ((ret.data.area.search(cc.sys.localStorage.getItem('city')) == -1) && ret.data.rate > 0 && (ret.data.version.search(BOXVERSION) == -1)) ? true : false
                if((ret.data.area.search(cc.sys.localStorage.getItem('city')) == -1) && ret.data.rate > 0 && (ret.data.version.search(BOXVERSION) == -1)){
                    this.winRate = ret.data.rate;
                    this.winLimit = ret.data.show_limit;
                }else{
                    this.winRate = 0;
                    this.winLimit = 0;
                }
            }else{
                this.winRate = 0;
                this.winLimit = 0;
            }
        }
        Statistics.getInstance().getSwitch(WXBOXGIFTWINSWITCH, onGet1);

        let onGet2 = (ret: any)=>{
            if(ret.code == 200){
                console.log("概率", ret.data);
                if((ret.data.area.search(cc.sys.localStorage.getItem('city')) == -1) && ret.data.rate > 0 && (ret.data.version.search(BOXVERSION) == -1)){
                    this.failRate = ret.data.rate;
                    this.failLimit = ret.data.show_limit;
                }else{
                    this.failRate = 0;
                    this.failLimit = 0;
                }
            }else{
                this.failRate = 0;
                this.failLimit = 0;
            }
        }
        Statistics.getInstance().getSwitch(WXBOXGIFTFAILSWITCH, onGet2);

        let onGet3 = (ret: any)=>{
            if(ret.code==200){
                console.log("概率"+ret.data);
                this.moreGameRate = ret.data.rate;
            }else{
                this.moreGameRate = .5;
            }
            
        }
        Statistics.getInstance().getSwitch(WXMOREGAMEOTHERS, onGet3);
    }

    WXHideShow(){
        cc.game.on(cc.game.EVENT_HIDE,()=>{
            cc.log('切到后台');
            if(WXFLoat.instance && WXFLoat.instance.node.active){
                WXFLoat.instance.node.active = true;
            }
        });

        cc.game.on(cc.game.EVENT_SHOW,()=>{
            var options=wx.getLaunchOptionsSync();
            var game_scene=cc.sys.localStorage.getItem('game_scene');
            console.log('scene:',options.scene);
            if(game_scene==null || game_scene==''){
                game_scene=options.scene;
                cc.sys.localStorage.setItem('game_scene',options.scene);
                console.log('scene:'+game_scene);
            }
            // if(cc.sun.uuid)http.register(cc.sun.uuid,cc.sun.wxName,cc.sun.wxHead,game_scene,"",null);
            Statistics.getInstance().register(Global.getInstance().wxName,Global.getInstance().wxHead,game_scene,"",null);
            if(this.WXBannerAd){
                if(this.WXBannerIndex != null){
                    let tempIndex = this.WXBannerIndex;
                    this.WXBannerHide();
                    this.WXBannerShow(tempIndex, true);
                }
                
            }


            if(this.shareStartTime){
                let shareTime: number = Date.now() - this.shareStartTime;
                if(this.shareCount == 0){
                    if(shareTime > 5000){
                        
                        if(this.shareCount < 9){
                            console.log('分享成功');
                            AdRewradMgr.instance.onSuccess(this.shareIndex);
                            this.shareSuccess ++;
                            save('shareSuccess',this.shareSuccess + '');
                        }else{
                            wx.showToast({
                                title: '分享次数已满，请明天再试',
                                icon: 'none',
                                duration: 3500
                              })
                        }
                        
                    }else{
                        //fail
                        console.log('分享失败');
                        wx.showToast({
                            title: '分享失败，请勿频繁打扰同一个群',
                            icon: 'none',
                            duration: 3500
                          })
                    }
                }else{
                    if(shareTime > 2500){
                        if(this.shareCount < 9){
                            console.log('分享成功');
                            AdRewradMgr.instance.onSuccess(this.shareIndex);
                            this.shareSuccess ++;
                            save('shareSuccess',this.shareSuccess + '');
                        }else{
                            wx.showToast({
                                title: '分享次数已满，请明天再试',
                                icon: 'none',
                                duration: 2000
                              })
                        }
                        
                    }else{
                        //fail
                        console.log('分享失败');
                        wx.showToast({
                            title: '分享失败，请分享到不同群',
                            icon: 'none',
                            duration: 2000
                          })
                    }
                }
 
                this.shareStartTime = null;
                this.shareCount ++;
            }
        
        }
        
        )
            
            
    }

    WXBannerInit(){
        this.WXBannerAd = wx.createBannerAd({
            adUnitId: WXBANNER,
            style: {
              adIntervals: 30,
              left: this.windowWidth - 305,
              top: this.windowHeight - 95,
              width: 300
            }
          })

        this.WXBannerAd.onResize(res => {
            cc.log('resize',this.windowHeight,this.WXBannerAd.style.realHeight,this.WXBannerAd.style.top);
            this.realHeight = this.WXBannerAd.style.realHeight;
            // this.bw = 304 / this.zoomRateW;
            // this.bh = (this.bannerAd.style.realHeight + 4) / this.zoomRateH;
          })

        this.WXBannerAd.onError(err => {
            cc.log(err)
        })
        this.WXBannerAd.onLoad(() => {
            cc.log('banner 广告加载成功');
        })
    }

    WXRewardInit(){
        this.WXRewardAd1 = wx.createRewardedVideoAd({ adUnitId: WXVIDEO1 });

        this.WXRewardAd1.onLoad(() => {
            cc.log('激励视频1 广告加载成功');
            this.WXVideoLoad1 = true;
        })

        this.WXRewardAd1.onError(err => {
            cc.log('reward error:'+err)
        })

        this.WXRewardAd1.onClose(res => {
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

        this.WXRewardAd2 = wx.createRewardedVideoAd({ adUnitId: WXVIDEO2 });

        this.WXRewardAd2.onLoad(() => {
            cc.log('激励视频2 广告加载成功');
            this.WXVideoLoad2 = true;
        })

        this.WXRewardAd2.onError(err => {
            cc.log('reward error:'+err)
        })

        this.WXRewardAd2.onClose(res => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
                if(this.WXRewardIndex2){
                    // cc.sun.mainjs.onNativeAndroidSuccess(this.WXRewardIndex);
                    // 奖励
                    AdRewradMgr.instance.onSuccess(this.WXRewardIndex2);
                    this.WXRewardIndex2 = null;
                }
            }
            else {
                // 播放中途退出，不下发游戏奖励
                if(Global.getInstance().inGame == false){
                    Global.getInstance().inGame = true;
                }
            }
        })
    }

    WXGridAdInit(){
        // 创建格子广告实例，提前初始化
        if(wx.createGridAd){
        this.WXGridAd = wx.createGridAd({
            adUnitId: 'adunit-4aaa88f45a957542',
            adTheme: 'white',
            gridCount: 5,
            style: {
            left: 0,
            top: 0,
            width: 330,
            opacity: 0.8
            }
        })
        }
    }

    WXGridAdShow(){
        if(this.WXGridAd){
            this.WXGridAd.show();
        }
    }

    WXGamePortalInit(){
        if(wx.createGamePortal){
            this.WXGamePortal = wx.createGamePortal({
                adUnitId: 'PBgAAyAVEGWVHwUM'
            })
        }
    }

    WXGamePortalShow(){
        // 在适合的场景显示推荐位
        // err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
        if (this.WXGamePortal) {
            this.WXGamePortal.load().then(() => {
                this.WXGamePortal.show()
            }).catch((err) => {
                console.error(err)
            })
        }
    }

    WXBannerShow(index: number, back?: boolean){
        if(!this.WXBannerAd){
            return;
        }
        this.WXBannerIndex = index;
        this.WXBannerAd.style.width = index == AdList.BANNERLIST.通关宝箱 ? 550 : 300;
        switch (index) {
            case AdList.BANNERLIST.首页右下:
                this.WXBannerAd.style.left = this.windowWidth - 305;
                this.WXBannerAd.style.top = this.windowHeight - this.realHeight;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.WXBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.WXBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.地图详情右下:
                this.WXBannerAd.style.left = this.windowWidth - 305;
                this.WXBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.WXBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.WXBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.游戏内暂停中下:
                this.WXBannerAd.style.left = this.windowWidth * .5 - 150;
                this.WXBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.WXBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.WXBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.奇遇中下:
                this.WXBannerAd.style.left = this.windowWidth * .5 - 150;
                this.WXBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.WXBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.WXBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.通关宝箱:
                this.WXBannerAd.style.left = this.windowWidth * .5 - 275;
                this.WXBannerAd.style.top = this.windowHeight * .5 - this.realHeight * .5;
                this.WXBannerAd.show().catch(err => console.log(err));
                break;
            default:
                break;
        }
    }

    WXBannerHide(){
        if(this.WXBannerAd){
            this.WXBannerAd.hide();
            
        }
        this.WXBannerIndex = null;
    }

    WXBannerDestroy(){
        if(this.WXBannerAd){
            this.WXBannerAd.destroy();
            this.WXBannerIndex = null;
        }
    }


    WXRewardShow(index: number){
        
        if(Math.floor(index / 100) == 1){
            this.WXRewardIndex1 = index;
            this.WXRewardAd1.show()
            .catch(err => {
                this.WXRewardAd1.load()
                .then(() => this.WXRewardAd1.show());
            }).then(()=>{
                if(this.needPause(index)){
                    if(this.WXVideoLoad1)
                    Global.getInstance().inGame = false;
                }
                if(!this.WXVideoLoad1){
                    //如果没有直接给
                    if(this.WXRewardIndex1){
                        // AdRewradMgr.instance.onSuccess(this.WXRewardIndex1);
                        // this.WXRewardIndex1 = null;
                        this.WXShare(this.WXRewardIndex1);
                    }
                }
            });
        }else{
            this.WXRewardIndex2 = index;
            this.WXRewardAd2.show()
            .catch(err => {
                this.WXRewardAd2.load()
                .then(() => this.WXRewardAd2.show());
            }).then(()=>{
                if(this.needPause(index)){
                    if(this.WXVideoLoad2)
                    Global.getInstance().inGame = false;
                }
                if(!this.WXVideoLoad2){
                    //如果没有直接给
                    if(this.WXRewardIndex2){
                        // AdRewradMgr.instance.onSuccess(this.WXRewardIndex2);
                        // this.WXRewardIndex2 = null;
                        this.WXShare(this.WXRewardIndex2);
                    }
                }
            });
        }
    }

    WXShare(index: number){
        wx.shareAppMessage({
            imageUrlId: 'LIIp5vEGRPyw9qy+UwZg==',
            imageUrl: 'https://mmocgame.qpic.cn/wechatgame/QdFKpXpcRxAqNjzd4G3ap1Mibr8WWzc35WgUNIZOp4oAXkpBdVrn6vRCd5NdUzdHX/0'
          })
        this.shareStartTime = Date.now();
        this.shareIndex = index;
    }

    needPause(index: number){
        return false;
    }

    WXInfoLoad(){
        let wxinfo: string = load('WXInfo');
        if(!wxinfo){
            // HeroGlobal.instance.BgmSwitch = true;
            // HeroGlobal.instance.EffectSwitch = true;
        }else{
            let json = JSON.parse(wxinfo);
            Global.getInstance().wxName = json.wxName;
            Global.getInstance().wxHead = json.wxHead;
        }
    }

    WXFLoatShow(){
        if(WXFLoat.instance){
            WXFLoat.instance.open();
        }
    }

    WXSubscribe(index: number){
        // wx.requestSubscribeSystemMessage({
        //     msgTypeList: ['1x7vvnRfIifokNXPkZsKHl9FUlc1lSSERSWUN1xpcGA', 'xwdX9_xc_uG-MSlglpBcQH9Ahd0JQWbCDGxi9xAFN1U'],
        //     success(res) {
        //       console.log(res)
        //       // {
        //       //      errMsg: "requestSubscribeSystemMessage:ok",
        //       //      SYS_MSG_TYPE_INTERACTIVE: 'accept'
        //       //      SYS_MSG_TYPE_RANK: 'reject'
        //       // }
        //     },
        //     fail(res) {
        //       console.log(res)
        //     },
        //     complete(res) {
        //       console.log(res)
        // } })
        let ids = ['1x7vvnRfIifokNXPkZsKHl9FUlc1lSSERSWUN1xpcGA', 'xwdX9_xc_uG-MSlglpBcQH9Ahd0JQWbCDGxi9xAFN1U'];
        var self = this;
        wx.requestSubscribeMessage({
            tmplIds: [ids[index]],
            success (res) {
              console.log(res)
              res === {
                 errMsg: "requestSubscribeMessage:ok",
                 "zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE": "accept"
              }
              Statistics.getInstance().reportSubscribe('1x7vvnRfIifokNXPkZsKHl9FUlc1lSSERSWUN1xpcGA');
            },
                fail(res) {
              console.log(res)
            },
          })

    }

}
