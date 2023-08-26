import Global from "../nativets/Global";
import { Platform, getPLATID, getPlatform } from "../nativets/Platform";
import NewHttp from "../lib/NewHttp";



var httpjs = require('../lib/httpjs');
export default class Statistics{
    static instance: Statistics = null;
    adInfo = new Map();
    static RANKLIST = cc.Enum({
        战力榜: 1,
        通关榜: 2,
        杀戮榜: 3
    })
    // 456 分别是 vivo 789 分别是oppo

    static getInstance(){
        if(!this.instance){
            this.instance = new Statistics();
        }
        return this.instance;
    }

    // 获取开关ov插屏
    getSwitchRate(id: number): number{
        // if(CC_PREVIEW){
        //     return;
        // }
        // let CallBack = (ret: any)=>{
        //     if(ret.code==200){
        //         console.log("概率",ret.data);
        //         return ret.data.rate;
        //     }else{
        //         return .65;
        //     }
        // }
        // httpjs.getSwitch(id, CallBack);
    }

    // 获取开关ov插屏
    getVivoSwitchRate(id: number){
        // if(CC_PREVIEW){
        //     return;
        // }

        // return new Promise((resolve, reject) => {

        //     // httpjs.getSwitch(id, (ret)=>{
        //     //     if(ret.code==200){
        //     //         console.log("概率",ret.data);
        //     //         resolve(ret.data.rate);
        //     //         // return ret.data.rate;
        //     //     }else{
        //     //         // return .65;
        //     //         reject(.65);
        //     //     }
        //     // });

        //     NewHttp.getSwitch(id, (ret)=>{
        //         if(ret.code==1){
        //             // console.log("概率",ret.data);
        //             resolve(ret.data.rate);
        //         }else{
        //             // return .65;
        //             reject(.65);
        //         }
        //     });

        // });
    }

    getSwitch(id: number, CallBack: Function){
        // if(CC_PREVIEW){
        //     return;
        // }
        // // httpjs.getSwitch(id, CallBack);
        // NewHttp.getSwitch(id, CallBack);
    }

    //上报自定义事件数据
    reportEvent(event: string){
        // if(CC_PREVIEW){
        //     return;
        // }
        // if(getPlatform() == Platform.Android || getPlatform() == Platform.m4399){
        //     jsb.reflection.callStaticMethod("com/td/AnalyticsManager", "reportEvent", "(Ljava/lang/String;)V", event);
        // }else{
        //     httpjs.reportEvent(Global.getInstance().uuid, event);
        // }
        
        // NewHttp.reportEvent(Global.getInstance().uuid, event);
    }

    // 上报关卡
    reportStage(stageid: number, success: boolean, begin?: boolean){
        // if(CC_PREVIEW){
        //     return;
        // }
        // if(getPlatform() == Platform.Android || getPlatform() == Platform.m4399){
        //     let type = 0;
        //     if(begin){
        //         type = 0;
        //     }else{
        //         type = success ? 1 : -1;
        //     }
        //     jsb.reflection.callStaticMethod("com/td/AnalyticsManager", "reportStage", "(II)V", stageid, type);
        // }else{
        //     let event: string = success ? 'complete' : 'fail';
        //     if(begin){
        //         event = '';
        //     }
        //     let stagename = '第' + stageid + '关';
        //     // httpjs.reportStage(Global.getInstance().uuid, stageid, stagename, event);
        //     NewHttp.reportStage(Global.getInstance().uuid, stageid, stagename, event);
        // }
        
        
    }

    //注册
    register(name: string, headpic: string, sceneid: string, openid: string, CallBack: Function){
        // if(CC_PREVIEW){
        //     return;
        // }
        // // httpjs.register(getPLATID(), Global.getInstance().uuid, name, headpic, sceneid, openid, CallBack);
        // console.log('uuid：',Global.getInstance().uuid,'PLAT:',getPLATID());
        // NewHttp.register(getPLATID(), Global.getInstance().uuid, name, headpic, sceneid, openid, CallBack);
    }

    updateUserInfo(name,headpic,CallBack){
        // if(CC_PREVIEW){
        //     return;
        // }
        // NewHttp.updateUserInfo(Global.getInstance().uuid, name, headpic, CallBack)
    }

    // 上报订阅
    reportSubscribe(tpl_id: string){
        // if(CC_PREVIEW){
        //     return;
        // }
        // let wxVersion = wx.getSystemInfoSync().version;
        // httpjs.reportSubs(getPLATID(), Global.getInstance().wxOpenId, tpl_id, wxVersion);
    }

    // 获得Openid
    getOpenid(code: string){
        // if(CC_PREVIEW){
        //     return;
        // }
        // // httpjs.getOpenid(getPLATID(), code, (ret)=>{
        // //     cc.log('WXOPENID', ret);
        // //     Global.getInstance().wxOpenId = ret.openid;
        // // });
        // NewHttp.getOpenid(getPLATID(), code, (ret)=>{
        //     cc.log('WXOPENID', ret);
        //     Global.getInstance().wxOpenId = ret.openid;
        // });
    }

    /**
     * issue：下发广告
        show：展示广告
        click：点击广告
     */
    reportAd(id: number, event: number){
        // let str = '';
        // switch (event) {
        //     case 0:
        //         str = 'issue';
        //         break;
        //     case 1:
        //         str = 'show';
        //         break;
        //     case 2:
        //         str = 'click';
        //         break;
        //     default:
        //         break;
        // }
        // console.log('ra', id, str);

        // let a = null;
        // if(this.adInfo){
        //     a = this.adInfo[id];
        // }else{
        //     this.adInfo = new Map();
        // }
        
        // if(a){
        //     a[str] ++;
        //     this.adInfo[id] = a;
        // }else{
        //     this.adInfo[id] = {};
        //     this.adInfo[id]['issue'] = 0;
        //     this.adInfo[id]['show'] = 0;
        //     this.adInfo[id]['click'] = 0;
        //     this.adInfo[id][str] = 1;
        // }
        
        // NewHttp.reportAd(id, str, Global.getInstance().uuid);
    }

    newReportAd(){
        // if(this.adInfo){
        //     NewHttp.newReportAd(JSON.stringify(this.adInfo), Global.getInstance().uuid);
        //     this.adInfo = new Map();
        // }
    }

    // 战力 1
    // 通关 2
    // 杀戮 3

    // 阈值
    // 90231
    // 124
    // 1053
    //上报游戏排行榜数据
    reportRank(rid: number, score: number){
        // if(CC_PREVIEW){
        //     return;
        // }
        // let arrs = [90231, 124, 1053];
        // console.log('REPORTRANK', rid + this.getRanKIdOffset(), Global.getInstance().uuid);
        // // if(score > arrs[rid - 1]){
        //     // httpjs.report(rid + this.getRanKIdOffset(), Global.getInstance().uuid, score);
        //     NewHttp.report(rid + this.getRanKIdOffset(), Global.getInstance().uuid, score);
        // }else{
        //     console.log('未上报', rid, score);
        // }
        
    }

    //获取排行榜
    getRank(rid: number, CallBack, isNewbie?: boolean){
        // if(CC_PREVIEW){
        //     return;
        // }
        // if(isNewbie){
        //     // httpjs.getRank(rid + 99, 50, Global.getInstance().uuid, CallBack); 
        //     NewHttp.getRank(rid + 99, 50, Global.getInstance().uuid, CallBack); 
        // }else{
            // httpjs.getRank(rid + this.getRanKIdOffset(), 50, Global.getInstance().uuid, CallBack);
            // NewHttp.getRank(rid + this.getRanKIdOffset(), 50, Global.getInstance().uuid, CallBack);
        // }
        
    }

    // 456 分别是 vivo 789 分别是oppo
    getRanKIdOffset(){
        return 0;
        switch (getPlatform()) {
            case Platform.WX:
                return 3;
            case Platform.OPPO:
                return 0;
                break;
            case Platform.VIVO:
                return 0;
                break;
            default:
                return 0;
                break;
        }

    }
}