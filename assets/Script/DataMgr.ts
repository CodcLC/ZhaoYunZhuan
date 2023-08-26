import { load, save } from "./nativets/SaveMgr";
import HeroGlobal from "./Hero/HeroGlobal";
import Global from "./nativets/Global";
import MD5 = require("./lib/md5");
import Statistics from "./Tool/Statistics";
import TimeMgr from "./Tool/TimeMgr";
import { Pet } from "./nativets/Config";
import { Platform, getPlatform } from "./nativets/Platform";
import AdMgr from "./Ad/AdMgr";



const {ccclass, property} = cc._decorator;

@ccclass
export default class DataMgr extends cc.Component {
    static instance: DataMgr = null;
    loadingFirst: any;
    http: any;
    lifeCount: number;
    coinsCount: number;
    jadeCount: number;
    coinsArrs: number[];
    lifeArrs: number[];
    jadeArrs: number[];
    activityCount: number;
    // task1LoginCount: number;
    // task2AdventureCount: number;
    // task3KillCount: number;
    // task4StarCount: number;
    // task5ViewRankCount: number;
    // task6SkillUpCount: number;
    // task7EquipmentUpCount: number;
    // task8CompressSoulCount: number;
    // task9PetUpCount: number;
    taskCountData: number[];
    taskGetCountData: number[];
    timeLimitNum: number;
    oppoLimitNum: number;
    vivoLimitNum: number;
    needOpenSign: boolean = false;
    needCheckMark: boolean;
    winLimit: number = 0;
    failLimit: number = 0;
    limitCount: number = 8;

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.coinsArrs = [200, 300, 400];
        this.lifeArrs = [5, 7, 10];
        this.jadeArrs = [20, 30, 40];

        this.loadUuid();
        this.loadSetting();
        this.loadMapData();
        this.loadMapBox();
        this.loadHeroGlobal();
        this.loadHeroData();
        this.loadTimeLimitData();
        this.loadOPPOLimitData();
        this.loadVIVOLimitData();
        this.loadSaveDate();
        this.loadWXMarkData();
    }

    onLoad () {
        DataMgr.instance = this;
        this.init();
    }

    start () {
        
    }

    loadUuid(){
        // if(!load("openId")){
             
        //     Global.getInstance().uuid = MD5(Date.now()+"");
        //     save("openId",Global.getInstance().uuid);
        //     console.log("uuid= "+Global.getInstance().uuid);
        // }else{
        //     Global.getInstance().uuid = load("openId");
        // }

        Statistics.getInstance().reportEvent('进入游戏');
        // if(CC_WECHATGAME){    
        //     var options=wx.getLaunchOptionsSync();
        //     var game_scene=cc.sys.localStorage.getItem('game_scene');
        //     if(game_scene==null || game_scene==''){
        //         game_scene=options.scene;
        //         cc.sys.localStorage.setItem('game_scene',options.scene);
        //         console.log('scene:'+game_scene);
        //     }
        //     // this.http.register(Global.getInstance().uuid,Global.getInstance().wxName,Global.getInstance().wxHead,game_scene,"",data=>{
        //     //     console.log("注册返回："+data);
        //     //     if(data.code==1){
        //     //         console.log("当前地区："+data.city);
        //     //         cc.sys.localStorage.setItem("city",data.city);
        //     //     }
        //     // });
        //     // console.log("register");
        //     Statistics.getInstance().register(Global.getInstance().wxName,Global.getInstance().wxHead,game_scene,"",data=>{
        //         console.log("注册返回：",data);
        //         if(data.code==1){
        //             Global.getInstance().registerName = data.name;
        //             Global.getInstance().registerHead = data.headpic;
        //             console.log("当前地区："+data.city);
        //             cc.sys.localStorage.setItem("city",data.city);
        //         }
        //     })
        // }

        // if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO){

        //     // if (qg.getSystemInfoSync().platformVersionCode >= 1053) {
        //     //     qg.getUserInfo().then((res) => {
        //     //         if (res.data) {
        //     //             console.log('当前用户信息: ' + JSON.stringify(res.data));
        //     //             let vdata: any = JSON.stringify(res.data);
        //     //             Global.getInstance().vivoName = vdata.nickName;
        //     //             Global.getInstance().vivoHead = vdata.smallAvatar;
        //     //             let vivodata = {
        //     //                 vivoName: Global.getInstance().vivoName,
        //     //                 vivoHead: Global.getInstance().vivoHead
        //     //             }
        //     //             save('VIVOInfo', JSON.stringify(vivodata));
        //     //         }
        //     //     }, (err) => {
        //     //         console.log('获取用户信息失败' + JSON.stringify(err));
        //     //     });
        //     // }

            

        //     Statistics.getInstance().register(Global.getInstance().vivoName,Global.getInstance().vivoHead,'',"",data=>{
        //         console.log("注册返回：", data);
        //         if(data.code==1){
        //             Global.getInstance().registerName = data.name;
        //             Global.getInstance().registerHead = data.headpic;
        //             console.log("当前地区："+data.city);
        //             cc.sys.localStorage.setItem("city",data.city);
        //         }
        //     })
        // }
         
    }

    loadSetting(){
        let st: string = load('Setting');
        if(!st){
            // HeroGlobal.instance.BgmSwitch = true;
            // HeroGlobal.instance.EffectSwitch = true;
        }else{
            let json = JSON.parse(st);
            HeroGlobal.instance.BgmSwitch = json.bgm;
            HeroGlobal.instance.EffectSwitch = json.effect;
        }

    }

    loadMapData(){
        let md: string = load('MapData');
        if(!md){
            HeroGlobal.instance.initMapData();
        }else{
            HeroGlobal.instance.setMapData(JSON.parse(md));
        }
    }

    loadMapBox(){
        let mb: string = load('MapBox');
        if(!mb){
            HeroGlobal.instance.initMapBox();
        }else{
            HeroGlobal.instance.setMapBox(JSON.parse(mb));
        }
    }

    loadHeroGlobal(){
        let hg: string = load('HeroGlobal');
        if(!hg){
            hg = JSON.stringify({
                Exp: 0,
                Life: 40,
                Coins: 300,
                Jade: 40,
                Unlock: 1,
                MainHeroIndex: 0,
                OtherHeroIndex: 1,
                PetIndex: -1,
                MonsterKillCount: 0,
                HighestCE: 0,
                AchieveCountData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                AchieveGetCountData: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],

            })
            
        }else{
            // this.LoadFirst(()=>{

            // });
        }
        HeroGlobal.instance.setHeroGlobal(JSON.parse(hg));
    }

    LoadFirst(callback: Function){
        if(!this.node.getChildByName('Menu').getChildByName('Menu').getChildByName('FirstSelect')){
            if(this.loadingFirst){
                return;
            }
            this.loadingFirst = true;
            cc.loader.loadRes('FirstSelect',cc.Prefab,(err,prefab)=>{
                this.loadingFirst = false;
                if(err) return;
                let n: cc.Node = cc.instantiate(prefab);
                n.parent = this.node.getChildByName('Menu').getChildByName('Menu');
                n.active = true;
                callback();
            });
        }else{
            this.node.getChildByName('Menu').getChildByName('Menu').getChildByName('FirstSelect').active = true;
            callback();
        }
    }

    loadHeroData(){
        let defaultWeapon = [111010000, 121040000, 131070000];
        let defaultArmor = [211010000, 221040000, 231070000];
        for (let i = 0; i < 3; i++) {
            let hd: string = load('HeroData' + i);
            if(!hd){
                hd = JSON.stringify({
                    // Weapon: 0+ 3*i,
                    // Armor: 0 + 3*i,
                    
                    Weapon: defaultWeapon[i],
                    Armor: defaultArmor[i],
                    Wing: -1,
                    Ring: -1,
                    Ornament: -1,
                    SkillArrs: [0, 0, 0, 0, 0, -1, -1]
                })
            }
            HeroGlobal.instance.setHeroData(i, JSON.parse(hd));
        }
    }

    loadSaveDate(){
        let isNew = false;
        // 时间和每日刷新的数据
        let sd: string = load('saveDate');
        if(!sd){
            isNew = true;
            sd = JSON.stringify({
                date: TimeMgr.getFullYMDYesterday(),
                lifeCount: 0,
                coinsCount: 0,
                jadeCount: 0,
                activityCount: 0,
                taskCountData: [1, 0, 0, 0, 0, 0, 0, 0, 0],
                taskGetCountData: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            })
        }
        let saveDate: any = JSON.parse(sd);
        if(TimeMgr.getDelayNow(saveDate.date) > 0){
            // 存档 重置
            if(!isNew){
                this.needOpenSign = true;
            }
            let sd1 = JSON.stringify({
                date: TimeMgr.getFullYMDToday(),
                lifeCount: 0,
                coinsCount: 0,
                jadeCount: 0,
                activityCount: 0,
                taskCountData: [1, 0, 0, 0, 0, 0, 0, 0, 0],
                taskGetCountData: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            })
            save('saveDate', sd1);

            this.lifeCount = 0;
            this.coinsCount = 0;
            this.jadeCount = 0;

            this.activityCount = 0;

            this.taskCountData = [1, 0, 0, 0, 0, 0, 0, 0, 0];
            this.taskGetCountData = [0, 0, 0, 0, 0, 0, 0, 0, 0];

            this.timeLimitNum = 3600;

            this.oppoLimitNum = 7;
            this.vivoLimitNum = 7;

            HeroGlobal.instance.AchieveCountData[0] ++;
            HeroGlobal.instance.saveHeroGlobal();

            if(AdMgr.instance){
                this.winLimit = AdMgr.instance.getBoxGiftLimit(true);
                this.failLimit = AdMgr.instance.getBoxGiftLimit(false);
                this.saveLimitData();
                // console.log('Datamgr',this.winLimit,this.failLimit); 
            }
            

        }else{
            if(HeroGlobal.instance.Life < 20){
                HeroGlobal.instance.setLife(20);
                HeroGlobal.instance.saveHeroGlobal();
            }

            this.lifeCount = saveDate.lifeCount;
            
            this.coinsCount = saveDate.coinsCount;
            this.jadeCount = saveDate.jadeCount;

            this.activityCount = saveDate.activityCount;

            // 兼容存档

            this.taskCountData = saveDate.taskCountData ? saveDate.taskCountData : [1, 0, 0, 0, 0, 0, 0, 0, 0];
            this.taskGetCountData = saveDate.taskGetCountData ? saveDate.taskGetCountData : [0, 0, 0, 0, 0, 0, 0, 0, 0];

            this.loadLimitData();
        }
    }

    saveSaveDate(){
        let sd1 = JSON.stringify({
            date: TimeMgr.getFullYMDToday(),
            lifeCount: this.lifeCount,
            coinsCount: this.coinsCount,
            jadeCount: this.jadeCount,
            activityCount: this.activityCount,
            taskCountData: this.taskCountData,
            taskGetCountData: this.taskGetCountData,
        })
        save('saveDate', sd1);
    }

    loadLimitData(){
        if(AdMgr.instance){
            let bl: string = load('BoxLimit');
            if(!bl){ 
                this.winLimit = AdMgr.instance.getBoxGiftLimit(true);
                this.failLimit = AdMgr.instance.getBoxGiftLimit(false);
                this.saveLimitData();
            }else{
                let data = JSON.parse(bl);
                this.winLimit = data.win;
                this.failLimit = data.fail;
                if(data.limitCount == null || data.limitCount == undefined || data.limitCount == NaN){
                    // this.limitCount = 8;
                }else
                this.limitCount = data.limitCount;
            }
            // console.log('Data',this.winLimit,this.failLimit);     
        }
        
    }

    saveLimitData(){
        if(AdMgr.instance){
            save('BoxLimit', JSON.stringify({win: this.winLimit, fail: this.failLimit, limitCount: this.limitCount}));
        }
    }

    loadTimeLimitData(){
        let tl: string = load('TimeLimit');
        if(!tl){
            this.timeLimitNum = 3600;
        }else{
            this.timeLimitNum = parseInt(tl);
        }
    }

    saveTimeLimitData(){
        save('TimeLimit', Math.floor(this.timeLimitNum) + '');
    }

    loadOPPOLimitData(){
        if(getPlatform() != Platform.OPPO){
            return;
        }
        let ol: string = load('OPPOLimit');
        if(!ol){
            this.oppoLimitNum = 7;
        }else{
            this.oppoLimitNum = parseInt(ol);
        }
    }

    saveOPPOLimitData(){
        if(getPlatform() != Platform.OPPO){
            return;
        }
        save('OPPOLimit', this.oppoLimitNum + '');
    }

    loadVIVOLimitData(){
        if(getPlatform() != Platform.VIVO){
            return;
        }
        let vl: string = load('VIVOLimit');
        if(!vl){
            this.vivoLimitNum = 7;
        }else{
            this.vivoLimitNum = parseInt(vl);
        }
    }

    saveVIVOLimitData(){
        if(getPlatform() != Platform.VIVO){
            return;
        }
        save('VIVOLimit', this.vivoLimitNum + '');
    }

    loadWXMarkData(){
        if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
            let wm: string = load('WXMark');
            if(!wm){
                this.needCheckMark = true;
            }else{
                this.needCheckMark = false;
            }
        }
        

    }

    saveWXMarkData(){
        if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
            this.needCheckMark = false;
            save('WXMark', 'true');
        }
        
    }

    // update (dt) {}
}
