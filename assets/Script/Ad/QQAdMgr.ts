import Global from "../nativets/Global";
import AdRewradMgr from "./AdRewardMgr";
import AdList from "./AdList";
import Statistics from "../Tool/Statistics";
import { save, load } from "../nativets/SaveMgr";
import Game from "../Game";
import WXFLoat from "./WXFLoat";
import Shortcut from "./Shortcut";
import Main from "../Main";

// 视频1-复活，buff
const QQVIDEO1: string = 'e893cc27a85d4f38b3aecf99238ad4c0';
// 视频2-加金币钻石体力
const QQVIDEO2: string = 'e893cc27a85d4f38b3aecf99238ad4c0';

const QQBANNER: string = 'de33e0421f121bf4ee3052c1eefab4c3';
// 腾讯的交叉推广 
const QQAPPBOX: string = 'b239dbac5a76ebf443481d2ce07a80ca';

const QQBLOCKAD: string = 'fbf16d295ccb2bddaaf742ef907c01ae';

const BOXVERSION: string = '1.0.33';

const VIDEOARRS: string[] = ['7ad24b000cfae42985356dcda4b22713',
                            'c37cb44aa7714175f097c4362a646afe',
                            'ee84493d63363d61b9212dedfbd13407',
                            'c9d1bc6c63390886738519a27cf62ad0',
                            '4363693e0ef4db023f9612fee9236a5d',
                            '7fce461336fde389cd19a50b05c15289',
                            '503b56c49f761f3a390e9ceaf16af370',
                            'fa3b90388b52185cd8454c726b83789c',
                            '0e027f6a92427be5db636d29b07f575f',
                            '99a97f4d82140526180748de28761cf0',
                            '9466951bcaedf1565e4ae3c81eac2fd9',
                            '403be8a704961495ca6bb97f7c410f8a',
                            '465f890a0fb15f8b22f7e6ed5e8053f8',
                            '3e33cad4cb8d49291fecd0c21e944c66',
                            '20a2e0a57b4e8ce247973a41f5f51525',
                            '13a3ebdfc0ce7acec320888c714817cc',
];

const VIDEOINDEX = [101,102,201,202,203,204,205,206,207,208,209,210,211,212,213,214];

const BANNERARRS: string[] = [
                            'c24fc318e33b1ae1d080271a0dba82f9',
                            '227cfc9ff0a0b5e6d4e98f6846482e83',
                            'c17a9e49f4872c41b38aebbbb3c1b0c1',
                            'a752ded1ed0a3359921f92ac08c41824',
                            '998aef9397cbca1a0fec6e266b29f305',
                            '7a8b4fbb3ac79dbccc86aaddd22b4fc9',
                            '546a231e5713973bd43935ca462ad431',
                            '9da5956416c6cc031e7e0c4d04a5e53c',
                            '957637c4bb5a56d4053df1afabd8f858',

];

const BOXARRS: string[] = [
    'f0504ef851ebe204124b3554871b494e',
    'd61c5383336f24e286c6b2583846bfca',
];

const BLOCKARRS: string[] = [
    'e09f6ee28d026eb350f2528730f48679',
    '5959b3cf8f44fb1d47cbbbb0c7b0510a',
    '0c55abbae0712256f4a34e8cdf0d8e14',
];

// qqsercrt 4t3v0OE7gPyXwDdO

// const QQBOXGIFTWINSWITCH = 72;
// const QQBOXGIFTFAILSWITCH = 73;

// const QQMOREGAMEOTHERS = 74;

const QQBOXGIFTWINSWITCH = 1;
const QQBOXGIFTFAILSWITCH = 2;

const QQMOREGAMEOTHERS = 3;

const QQBASWITCH = 4;

export default class QQAdMgr{
    static instance: QQAdMgr = null;
    windowWidth: any;
    windowHeight: any;
    zoomRateW: number;
    zoomRateH: number;
    QQBannerAd: any;
    QQRewardAd1: any;
    QQVideoLoad1: boolean;
    QQRewardIndex1: number;
    QQRewardAd2: any;
    QQRewardIndex2: any;
    QQVideoLoad2: boolean;
    QQBannerIndex: number;
    realHeight: any;
    QQGamePortal: any;
    shareStartTime: number;
    shareIndex: number;
    shareCount: number = 0;
    shareSuccess: number = 0;
    QQGridAd: any;
    QQAppBox: any;
    menuPosition: cc.Vec2;
    winRate: number;
    winLimit: number;
    failRate: number;
    failLimit: number;
    baRate: number;
    baLimit: number;
    baDelay: number;
    moreGameRate: number = .5;
    QQBlockAd: any;
    blockLeft: number;
    blockTop: number;
    QQAppBoxTime: number;
    inVideo: boolean;

    static getInstance(){
        if(!this.instance){
            this.instance = new QQAdMgr();
        }
        return this.instance;
    }
    
    init(){
        QQAdMgr.instance = this;
        this.QQInit();
    }
    
    QQInit(){
        this.windowWidth = wx.getSystemInfoSync().windowWidth;
        this.windowHeight = wx.getSystemInfoSync().windowHeight;
        this.zoomRateW = this.windowWidth / cc.winSize.width;
        this.zoomRateH = this.windowHeight / cc.winSize.height;

        let menuRect = wx.getMenuButtonBoundingClientRect();
        let menuY = cc.winSize.height * .5 - ((menuRect.bottom + menuRect.height * .25) / this.zoomRateH);
        let menuX = ((menuRect.left + menuRect.width * .25) / this.zoomRateH) - cc.winSize.width * .5;
        this.menuPosition = cc.v2(menuX, menuY);

        // this.QQBannerInit();
        // this.QQRewardInit();
        // // this.QQGamePortalInit();
        // // this.QQGridAdInit();
        // this.QQAppBoxInit();
        this.QQHideShow();
        this.initShareSuccess();
        this.QQSwitchInit();
    }

    initShareSuccess(){
        let ss: string = load('shareSuccess');
        if(ss){
            this.shareSuccess = parseInt(ss);
        }
    }

    QQSwitchInit(){
        let onGet1 = (ret: any)=>{
            console.log("当前城市：", cc.sys.localStorage.getItem('city'));
            if(ret.code == 1){
                console.log("概率", ret.data);
                
                // ((ret.data.area.search(cc.sys.localStorage.getItem('city')) == -1) && ret.data.rate > 0 && (ret.data.version.search(BOXVERSION) == -1)) ? true : false
                if((ret.data.area.search(cc.sys.localStorage.getItem('city')) == -1) && ret.data.rate > 0 && (ret.data.version.search(BOXVERSION) == -1)){
                    this.winRate = ret.data.rate;
                    this.winLimit = ret.data.show_limit;
                }else{
                    this.winRate = 0;
                    this.winLimit = 0;
                }
                console.log('mytest', this.winRate, this.winLimit);
            }else{
                this.winRate = 0;
                this.winLimit = 0;
            }
        }
        Statistics.getInstance().getSwitch(QQBOXGIFTWINSWITCH, onGet1);

        let onGet2 = (ret: any)=>{
            if(ret.code == 1){
                console.log("概率", ret.data);
                if((ret.data.area.search(cc.sys.localStorage.getItem('city')) == -1) && ret.data.rate > 0 && (ret.data.version.search(BOXVERSION) == -1)){
                    this.failRate = ret.data.rate;
                    this.failLimit = ret.data.show_limit;
                }else{
                    this.failRate = 0;
                    this.failLimit = 0;
                }
                console.log('mytest', this.failRate, this.failLimit);
            }else{
                this.failRate = 0;
                this.failLimit = 0;
            }
            
        }
        Statistics.getInstance().getSwitch(QQBOXGIFTFAILSWITCH, onGet2);

        let onGet3 = (ret: any)=>{
            if(ret.code==1){
                console.log("概率"+ret.data);
                this.moreGameRate = ret.data.rate;
            }else{
                this.moreGameRate = .5;
            }
            
        }
        Statistics.getInstance().getSwitch(QQMOREGAMEOTHERS, onGet3);

        let onGet4 = (ret: any)=>{
            if(ret.code == 1){
                console.log("概率", ret.data);
                if((ret.data.area.search(cc.sys.localStorage.getItem('city')) == -1) && ret.data.rate > 0 && (ret.data.version.search(BOXVERSION) == -1)){
                    this.baRate = ret.data.rate;
                    this.baLimit = ret.data.show_limit;
                    this.baDelay = parseInt(ret.data.delaytime);
                }else{
                    this.baRate = 0;
                    this.baLimit = 0;
                }
                console.log('mytest', this.baRate, this.baLimit, this.baDelay);
            }else{
                this.baRate = 0;
                this.baLimit = 0;
            }
            
        }
        Statistics.getInstance().getSwitch(QQBASWITCH, onGet4);
    }

    QQHideShow(){
        cc.game.on(cc.game.EVENT_HIDE,()=>{
            cc.log('切到后台');
        });

        cc.game.on(cc.game.EVENT_SHOW,()=>{
            var options=wx.getLaunchOptionsSync();
            console.log('QQscene:',options.scene);
            var game_scene=cc.sys.localStorage.getItem('game_scene');
            if(game_scene==null || game_scene==''){
                game_scene=options.scene;
                cc.sys.localStorage.setItem('game_scene',options.scene);
                console.log('scene:'+game_scene);
            }
            // if(cc.sun.uuid)http.register(cc.sun.uuid,cc.sun.wxName,cc.sun.wxHead,game_scene,"",null);
            Statistics.getInstance().register(Global.getInstance().wxName,Global.getInstance().wxHead,game_scene,"",null);

            if(this.inVideo){
                // this.inVideo = false;
                console.log('video');
                if(this.QQRewardIndex1){
                    Statistics.getInstance().reportAd(1000 + this.QQRewardIndex1, 2);
                }else if(this.QQRewardIndex2){
                    Statistics.getInstance().reportAd(1000 + this.QQRewardIndex2, 2);
                }
                
                return;
            }

            if(this.QQBannerAd){
                if(this.QQBannerIndex != null){
                    let tempIndex = this.QQBannerIndex;
                    
                    // this.QQBannerShow(tempIndex, true);
                    console.log('banner');
                    Statistics.getInstance().reportAd(2000 + this.QQBannerIndex, 2);
                    this.QQBannerHide();
                }
                
            }

            if(!this.QQBannerIndex){
                if(this.QQAppBoxTime){
                    console.log('appbox');
                    if(Date.now() - this.QQAppBoxTime < 15000){
                        if(Main.instance){
                            if(Main.instance.mapNode.active){
                                Statistics.getInstance().reportAd(3002, 2);
                            }else{
                                Statistics.getInstance().reportAd(3001, 2);
                            }
                        }
                        
                        
                        this.QQAppBoxTime = null;
                    }
                }
    
                if(this.QQBlockAd){
                    console.log('block');
                    
                    if(Main.instance){
                        if(Main.instance.mapNode.active){
                            Statistics.getInstance().reportAd(4002, 2);
                        }else{
                            if(Main.instance.gameNode.active)
                            Statistics.getInstance().reportAd(4003, 2);
                            else
                            Statistics.getInstance().reportAd(4001, 2);
                        }
                    }
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

    QQBannerInit(){
        return;
        Statistics.getInstance().reportAd(2000, 0);
        
        this.QQBannerAd = wx.createBannerAd({
            adUnitId: QQBANNER,
            style: {
              adIntervals: 30,
              left: this.windowWidth - 305,
              top: this.windowHeight - 95,
              width: 300
            }
          })

        this.QQBannerAd.onResize(res => {
            cc.log('resize',this.windowHeight,this.QQBannerAd.style.realHeight,this.QQBannerAd.style.top);
            this.realHeight = this.QQBannerAd.style.realHeight;
            // this.bw = 304 / this.zoomRateW;
            // this.bh = (this.bannerAd.style.realHeight + 4) / this.zoomRateH;
          })

        this.QQBannerAd.onError(err => {
            cc.log(err)
        })
        this.QQBannerAd.onLoad(() => {
            cc.log('banner 广告加载成功');
            this.QQBannerHide();
            
        })
    }

    QQBannerNew(index: number, back?: boolean){
        let idx = index - 1;
        let adid = BANNERARRS[idx];

        
        
        this.QQBannerAd = wx.createBannerAd({
            adUnitId: adid,
            style: {
              adIntervals: 30,
              left: this.windowWidth - 305,
              top: this.windowHeight - 95,
              width: 300
            }
          })

        this.QQBannerAd.onResize(res => {
            cc.log('resize',this.windowHeight,this.QQBannerAd.style.realHeight,this.QQBannerAd.style.top);
            this.realHeight = this.QQBannerAd.style.realHeight;
          })

        this.QQBannerAd.onError(err => {
            cc.log(err)
        })
        this.QQBannerAd.onLoad(() => {
            cc.log('banner 广告加载成功');
            this.QQBannerHide();
            
        })

        if(!this.QQBannerAd){
            return;
        }

        if(!this.realHeight){
            return;
        }
        
        // this.QQBannerHide();
        this.QQBannerIndex = index;
        this.QQBannerAd.style.width = index == AdList.BANNERLIST.通关宝箱 ? 450 : 300;
        switch (index) {
            case AdList.BANNERLIST.首页右下:
                this.QQBannerAd.style.left = this.windowWidth - 305;
                this.QQBannerAd.style.top = this.windowHeight - this.realHeight;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.QQBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.QQBannerAd.show();
                break;
            case AdList.BANNERLIST.地图详情右下:
                this.QQBannerAd.style.left = this.windowWidth - 305;
                this.QQBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.QQBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.QQBannerAd.show();
                break;
            case AdList.BANNERLIST.游戏内暂停中下:
                this.QQBannerAd.style.left = this.windowWidth / 2 - 150;
                this.QQBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.QQBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.QQBannerAd.show();
                break;
            case AdList.BANNERLIST.奇遇中下:
                if(this.baLimit > 0 && Math.random() < this.baRate){
                // if(true){
                    this.baLimit --;
                    // this.QQBannerAd.style.width = 480;
                    console.log('奇遇banner',this.QQBannerAd.style.width);
                    this.QQBannerAd.style.left = this.windowWidth / 2 - 220;
                    this.QQBannerAd.style.top = this.windowHeight * .25;
                    setTimeout(() => {
                        
                        this.QQBannerAd.show();
                        this.QQBannerAd.style.width = 480;
                        this.QQBannerAd.style.left = this.windowWidth / 2 - 225;
                        this.QQBannerAd.style.top = this.windowHeight * .25;
                        console.log('奇遇bannershow',this.QQBannerAd.style.width);
                    }, this.baDelay);
                }else{
                    this.QQBannerAd.style.width = 300;
                    this.QQBannerAd.style.left = this.windowWidth / 2 - 150;
                    this.QQBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                    if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                        this.QQBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                    }
                    this.QQBannerAd.show();
                }
                
                break;
            case AdList.BANNERLIST.通关宝箱:
                this.QQBannerAd.style.left = this.windowWidth * .5 - 225;
                this.QQBannerAd.style.top = this.windowHeight * .5 - this.realHeight * .5;
                this.QQBannerAd.show();
                Statistics.getInstance().reportAd(2000 + index, 0);
                Statistics.getInstance().reportAd(2000 + index, 1);
                break;
            default:
                break;
        }

        
    }

    QQRewardInit(){
        Statistics.getInstance().reportAd(1000, 0);
        this.QQRewardAd1 = wx.createRewardedVideoAd({ adUnitId: QQVIDEO1 });

        this.QQRewardAd1.onLoad(() => {
            cc.log('激励视频1 广告加载成功');
            this.QQVideoLoad1 = true;
            
        })

        this.QQRewardAd1.onError(err => {
            cc.log('reward error:'+err)
        })

        this.QQRewardAd1.onClose(res => {
            this.inVideo = false;
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
                if(this.QQRewardIndex1){
                    // cc.sun.mainjs.onNativeAndroidSuccess(this.QQRewardIndex);
                    // 奖励
                    AdRewradMgr.instance.onSuccess(this.QQRewardIndex1);
                    this.QQRewardIndex1 = null;
                }
            }
            else {
                // 播放中途退出，不下发游戏奖励
                if(Global.getInstance().inGame == false){
                    Global.getInstance().inGame = true;
                }

                if(this.QQRewardIndex1 == AdList.QQVIDEOLIST1.复活 && !Game.instance.reviveNode.active){
                    Game.instance.reviveNode.active = true;
                }
            }
        })

        this.QQRewardAd2 = wx.createRewardedVideoAd({ adUnitId: QQVIDEO2 });

        this.QQRewardAd2.onLoad(() => {
            cc.log('激励视频2 广告加载成功');
            this.QQVideoLoad2 = true;
            // Statistics.getInstance().reprotAd(1, 0);
        })

        this.QQRewardAd2.onError(err => {
            cc.log('reward error:'+err)
        })

        this.QQRewardAd2.onClose(res => {
            this.inVideo = false;
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
                if(this.QQRewardIndex2){
                    // cc.sun.mainjs.onNativeAndroidSuccess(this.QQRewardIndex);
                    // 奖励
                    AdRewradMgr.instance.onSuccess(this.QQRewardIndex2);
                    this.QQRewardIndex2 = null;
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

    QQRewardNew(index: number) {
        let idx = VIDEOINDEX.indexOf(index);
        if(idx == -1){
            return;
        }
        let adid = VIDEOARRS[idx];
        Statistics.getInstance().reportAd(1000 + index, 0);
        this.QQRewardAd1 = null;
        this.QQRewardAd1 = wx.createRewardedVideoAd({ adUnitId: adid });

        if(true){

            if(this.QQRewardAd1){
                this.QQVideoLoad1 = true;
                Statistics.getInstance().reportAd(1000 + index, 1);
                this.inVideo = true;
                
                this.QQRewardIndex1 = index;
                // this.QQRewardAd1.show()
                // .then(()=>{
                //     if(!this.QQVideoLoad1){
                //         //如果没有直接给
                //         if(this.QQRewardIndex1){
                //             // AdRewradMgr.instance.onSuccess(this.QQRewardIndex1);
                //             // this.QQRewardIndex1 = null;
                //             this.QQShare(this.QQRewardIndex1);
                //         }
                //     }
                // });
                console.log('video2');
                this.QQRewardAd1.show()
                .catch(err => {
                    this.QQRewardAd1.load()
                    .then(() => this.QQRewardAd1.show());
            }).then(()=>{
                    if(!this.QQVideoLoad1){
                        //如果没有直接给
                        if(this.QQRewardIndex1){
                            // AdRewradMgr.instance.onSuccess(this.QQRewardIndex1);
                            // this.QQRewardIndex1 = null;
                            this.QQShare(this.QQRewardIndex1);
                        }
                    }
                });
            }
        }

        this.QQRewardAd1.onLoad(() => {
            console.log('激励视频1 广告加载成功');
            this.QQVideoLoad1 = true;
        })

        this.QQRewardAd1.onError(err => {
            console.log('reward error:'+err);
            // this.QQShare(this.QQRewardIndex1);
        })

        this.QQRewardAd1.onClose(res => {
            this.inVideo = false;
            if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
                if(this.QQRewardIndex1){
                    // cc.sun.mainjs.onNativeAndroidSuccess(this.QQRewardIndex);
                    // 奖励
                    AdRewradMgr.instance.onSuccess(this.QQRewardIndex1);
                    this.QQRewardIndex1 = null;
                }
            }
            else {
                // 播放中途退出，不下发游戏奖励
                if(Global.getInstance().inGame == false){
                    Global.getInstance().inGame = true;
                }

                if(this.QQRewardIndex1 == AdList.QQVIDEOLIST1.复活 && !Game.instance.reviveNode.active){
                    Game.instance.reviveNode.active = true;
                }
            }
        })

        
    }

    QQGridAdInit(){
        // 创建格子广告实例，提前初始化
        if(wx.createGridAd){
        this.QQGridAd = wx.createGridAd({
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

    QQBlockAdInit(size: number, left: number, top: number){
        // Statistics.getInstance().reportAd(4000, 0);
        this.QQBlockAdHide();
        if(qq.createBlockAd){
            
            this.QQBlockAd = qq.createBlockAd({
                adUnitId: QQBLOCKAD,
                size: size,
                orientation: 'landscape',
                style: {
                    left: left,
                    top: top
                }
            })
            console.log('InitBlockAd', this.QQBlockAd);
            this.QQBlockAd.onLoad(()=>{
                console.log('BlockAdLoaded');
                this.QQBlockAd && this.QQBlockAd.show();
            })

            this.QQBlockAd.onError((res)=>{
                console.log(res.errMsg);
            })
        }
    }

    QQBlockAdNew(index: number){
        let idx = -1;
        if(Main.instance){
            if(Main.instance.mapNode.active){
                idx = 1;
            }else{
                if(Main.instance.gameNode.active)
                idx = 2;
                else
                idx = 0;
            }
        }
        if(idx == -1){
            return;
        }
        let adid = BLOCKARRS[idx];
        Statistics.getInstance().reportAd(4000 + idx + 1, 0);
        Statistics.getInstance().reportAd(4000 + idx + 1, 1);
        console.log('ShowBlockAd', index ,this.blockLeft, this.blockTop)
        switch (index) {
            case AdList.QQBlockList.首页单个:
                this.QQBlockAdInit(1, this.blockLeft, this.blockTop);
                // this.QQBlockAd && this.QQBlockAd.show();
                break;
            case AdList.QQBlockList.结算5个:
                this.QQBlockAdInit(5, this.windowWidth / 2 - 150, cc.winSize.height);
                // this.QQBlockAd && this.QQBlockAd.show();
                break;
            default:
                break;
        }
    }

    QQGridAdShow(){
        if(this.QQGridAd){
            this.QQGridAd.show();
        }
    }

    QQAppBoxInit(){
        Statistics.getInstance().reportAd(3000, 0);
        if(qq.createAppBox){
            this.QQAppBox = qq.createAppBox({
                adUnitId: QQAPPBOX
            })
        }
        // this.QQAppBox.load();
    }

    QQAppBoxNew(){
        

        let idx = -1;
        if(Main.instance){
            if(Main.instance.mapNode.active){
                // Statistics.getInstance().reportAd(3002, 1);
                idx = 1;
            }else{
                // Statistics.getInstance().reportAd(3001, 1);
                idx = 0;
            }
        }

        if(idx == -1){
            return;
        }
        let adid = BOXARRS[idx];
        Statistics.getInstance().reportAd(3000 + idx + 1, 0);
        if(qq.createAppBox){
            this.QQAppBox = qq.createAppBox({
                adUnitId: adid
            })
        }
        if (this.QQAppBox) {
            this.QQAppBox.load().then(() => {
                Statistics.getInstance().reportAd(3000 + idx + 1, 1);
                this.QQAppBox.show();
                this.QQAppBoxTime = Date.now();
            }).catch((err) => {
                console.error(err)
            })
        }
    }

    QQAppBoxShow(){
        this.QQAppBoxNew();
        return;
        // Statistics.getInstance().reportAd(3, 1);
        if(Main.instance){
            if(Main.instance.mapNode.active){
                Statistics.getInstance().reportAd(3002, 1);
            }else{
                Statistics.getInstance().reportAd(3001, 1);
            }
        }
        if (this.QQAppBox) {
            this.QQAppBox.load().then(() => {
                this.QQAppBox.show();
                this.QQAppBoxTime = Date.now();
            }).catch((err) => {
                console.error(err)
            })
        }
    }

    QQGamePortalInit(){
        if(wx.createGamePortal){
            this.QQGamePortal = wx.createGamePortal({
                adUnitId: 'PBgAAyAVEGWVHwUM'
            })
        }
    }

    QQGamePortalShow(){
        // 在适合的场景显示推荐位
        // err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
        if (this.QQGamePortal) {
            this.QQGamePortal.load().then(() => {
                this.QQGamePortal.show()
            }).catch((err) => {
                console.error(err)
            })
        }
    }

    QQBannerShow(index: number, back?: boolean){
        this.QQBannerNew(index, back);
        return;
        if(!this.QQBannerAd){
            return;
        }
        Statistics.getInstance().reportAd(2000 + index, 1);
        this.QQBannerHide();
        this.QQBannerIndex = index;
        this.QQBannerAd.style.width = index == AdList.BANNERLIST.通关宝箱 ? 450 : 300;
        switch (index) {
            case AdList.BANNERLIST.首页右下:
                this.QQBannerAd.style.left = this.windowWidth - 305;
                this.QQBannerAd.style.top = this.windowHeight - this.realHeight;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.QQBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.QQBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.地图详情右下:
                this.QQBannerAd.style.left = this.windowWidth - 305;
                this.QQBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.QQBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.QQBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.游戏内暂停中下:
                this.QQBannerAd.style.left = this.windowWidth / 2 - 150;
                this.QQBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.QQBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.QQBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.奇遇中下:
                this.QQBannerAd.style.left = this.windowWidth / 2 - 150;
                this.QQBannerAd.style.top = this.windowHeight - this.realHeight - 0;
                if(cc.sys.os == cc.sys.OS_IOS && ((cc.winSize.height / cc.winSize.width) > (16 / 9))){
                    this.QQBannerAd.style.top = this.windowHeight - this.realHeight + (back ? 15 : 30);
                }
                this.QQBannerAd.show().catch(err => console.log(err));
                break;
            case AdList.BANNERLIST.通关宝箱:
                this.QQBannerAd.style.left = this.windowWidth * .5 - 225;
                this.QQBannerAd.style.top = this.windowHeight * .5 - this.realHeight * .5;
                this.QQBannerAd.show().catch(err => console.log(err));
                break;
            default:
                break;
        }
    }

    QQBannerHide(){
        if(this.QQBannerAd){
            this.QQBannerAd.hide();
            this.QQBannerIndex = null;
        }
    }

    QQBannerDestroy(){
        if(this.QQBannerAd){
            this.QQBannerAd.destroy();
            this.QQBannerIndex = null;
        }
    }


    QQRewardShow(index: number){
        this.QQRewardNew(index);
        return;
        Statistics.getInstance().reportAd(1000 + index, 1);
        this.inVideo = true;
        if(Math.floor(index / 100) == 1){
            this.QQRewardIndex1 = index;
            this.QQRewardAd1.show()
            .catch(err => {
                this.QQRewardAd1.load()
                .then(() => this.QQRewardAd1.show());
            }).then(()=>{
                if(this.needPause(index)){
                    if(this.QQVideoLoad1)
                    Global.getInstance().inGame = false;
                }
                if(!this.QQVideoLoad1){
                    //如果没有直接给
                    if(this.QQRewardIndex1){
                        // AdRewradMgr.instance.onSuccess(this.QQRewardIndex1);
                        // this.QQRewardIndex1 = null;
                        this.QQShare(this.QQRewardIndex1);
                    }
                }
            });
        }else{
            this.QQRewardIndex2 = index;
            this.QQRewardAd2.show()
            .catch(err => {
                this.QQRewardAd2.load()
                .then(() => this.QQRewardAd2.show());
            }).then(()=>{
                if(this.needPause(index)){
                    if(this.QQVideoLoad2)
                    Global.getInstance().inGame = false;
                }
                if(!this.QQVideoLoad2){
                    //如果没有直接给
                    if(this.QQRewardIndex2){
                        // AdRewradMgr.instance.onSuccess(this.QQRewardIndex2);
                        // this.QQRewardIndex2 = null;
                        this.QQShare(this.QQRewardIndex2);
                    }
                }
            });
        }
    }

    QQShare(index: number){
        wx.shareAppMessage({
            imageUrlId: 'LIIp5vEGRPyw9qy+UwZg==',
            imageUrl: 'https://mmocgame.qpic.cn/wechatgame/QdFKpXpcRxAqNjzd4G3ap1Mibr8WWzc35WgUNIZOp4oAXkpBdVrn6vRCd5NdUzdHX/0'
          })
        this.shareStartTime = Date.now();
        this.shareIndex = index;
    }

    QQFLoatShow(){
        if(WXFLoat.instance){
            WXFLoat.instance.open();
        }
    }

    QQBlockAdShow(index: number){
        this.QQBlockAdNew(index);
        return;
        if(Main.instance){
            if(Main.instance.mapNode.active){
                Statistics.getInstance().reportAd(4002, 1);
            }else{
                if(Main.instance.gameNode.active)
                Statistics.getInstance().reportAd(4003, 1);
                else
                Statistics.getInstance().reportAd(4001, 1);
            }
        }
        console.log('ShowBlockAd', index ,this.blockLeft, this.blockTop)
        switch (index) {
            case AdList.QQBlockList.首页单个:
                this.QQBlockAdInit(1, this.blockLeft, this.blockTop);
                // this.QQBlockAd && this.QQBlockAd.show();
                break;
            case AdList.QQBlockList.结算5个:
                this.QQBlockAdInit(5, this.windowWidth / 2 - 150, cc.winSize.height);
                // this.QQBlockAd && this.QQBlockAd.show();
                break;
            default:
                break;
        }
    }

    // QQBlockAdShow(size: number, left: number, top: number){
    //     this.QQBlockAdInit(size, left, top);
    //     this.QQBlockAd && this.QQBlockAd.show();
    // }

    QQBlockAdHide(){
        if(this.QQBlockAd){
            this.QQBlockAd.destroy();
        }
    }

    needPause(index: number){
        return false;
    }

    QQShortcutShow(){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            if(Shortcut.instance){
                Shortcut.instance.open();
            }
        }
    }

    QQShortcutAdd(){
        
        if(qq.saveAppToDesktop)
        qq.saveAppToDesktop({
            success: function(res) {
            // 执行用户创建图标奖励
            if(Shortcut.instance){
                Shortcut.instance.onReward();
            }
            },
            fail: function(res) {
            
            }
        });
        
        
    }

    /**
     * QQ BlockAd 类似交叉推广
     */


}
