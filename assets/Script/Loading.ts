import AdMgr from "./Ad/AdMgr";
import { Platform, getPlatform } from "./nativets/Platform";
import Statistics from "./Tool/Statistics";
import Global from "./nativets/Global";
import { load, save } from "./nativets/SaveMgr";
import MD5 = require("./lib/md5");

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    progressbar: cc.ProgressBar;
    progress2: number;
    btnStart: cc.Node;
    progress: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.loadUuid();
    }

    loadUuid(){
        if(!load("openId")){
             
            Global.getInstance().uuid = MD5(Date.now()+"");
            save("openId",Global.getInstance().uuid);
            console.log("uuid= "+Global.getInstance().uuid);
        }else{
            Global.getInstance().uuid = load("openId");
        }

        // if(getPlatform() == Platform.TT){
        //     wx.login({
        //         success: ((res)=>{
        //         console.log('ttlogin',res);
        //         // this.wxCode = res.code;
        //         }
        //         )
        //     })
        // }

        if(CC_WECHATGAME){    
            var options=wx.getLaunchOptionsSync();
            var game_scene=cc.sys.localStorage.getItem('game_scene');
            if(game_scene==null || game_scene==''){
                game_scene=options.scene;
                cc.sys.localStorage.setItem('game_scene',options.scene);
                console.log('scene:'+game_scene);
            }
            Statistics.getInstance().register(Global.getInstance().wxName,Global.getInstance().wxHead,wx.getLaunchOptionsSync().scene,"",data=>{
                console.log("注册返回：",data);
                if(data.code==1){
                    Global.getInstance().registerName = data.name;
                    Global.getInstance().registerHead = data.headpic;
                    console.log("当前地区："+data.city);
                    cc.sys.localStorage.setItem("city",data.city);
                }
            })
        }

        if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO){
            Statistics.getInstance().register(Global.getInstance().vivoName,Global.getInstance().vivoHead,'',"",data=>{
                console.log("注册返回：", data);
                if(data.code==1){
                    Global.getInstance().registerName = data.name;
                    Global.getInstance().registerHead = data.headpic;
                    console.log("当前地区："+data.city);
                    cc.sys.localStorage.setItem("city",data.city);
                }
            })
        }
    }

    init(){
        this.progress = this.node.getChildByName('Progress');
        this.btnStart = this.node.getChildByName('Start');
        this.progressbar = this.progress.getChildByName('ProgressBar').getComponent(cc.ProgressBar);
        let node = new cc.Node();
        node.parent = cc.director.getScene();
        node.addComponent(AdMgr);
    }

    start () {
        this.chechUpdate();
        this.init();
        this.OVLoad();
        this.WXLoad();
    }

    chechUpdate(){
        if (window.wx) {
            //创建 UpdateManager 实例
            const updateManager = wx.getUpdateManager();
            console.log('是否进入模拟更新');
            //检测版本更新
            updateManager.onCheckForUpdate(function(res) {
             console.log('是否获取版本');
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                //监听小程序有版本更新事件
                updateManager.onUpdateReady(function() {
                
                //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
                updateManager.applyUpdate();
                })
                updateManager.onUpdateFailed(function() {
                // 新版本下载失败
                wx.showModal({
                    title: '已经有新版本喽~',
                    content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
                })
                })
            }
            })
        }
    }

    onBtnStart(){
        if(this.progress2 >= 1){
            cc.director.loadScene('game');  
        }else{
            this.progress.active = true;
            this.btnStart.active = false;
            // this.node.getChildByName('Text').active = true;
        }
    }

    onBtnClean(){
        if(wx){
            console.log('clean');
            wxDownloader.cleanAllAssets();

        }
    }

    WXSplitLoad(){
        console.log("WXSplitLoad");
        this.progress2 = 0;
        let progress: number = 0;
        let once1: boolean = true;
        let once2: boolean = true;
        cc.director.preloadScene('game',(c,t)=>{
            let tProgress: number = c / t;
            progress = /*.5*/0 + tProgress * 3 % 1;
            if(progress > this.progressbar.progress)
            this.progressbar.progress = progress;
            if(tProgress > 1 / 3 && tProgress < 2 / 3){
                if(once1){
                    this.progressbar.progress = 0;
                    // if(this.node.getChildByName('Text'))
                    // this.node.getChildByName('Text').getComponent(cc.Label).string = '正在擦亮装甲';
                    once1 = false;
                }
            }else if(tProgress >= 2 / 3){
                if(once2){
                    this.progressbar.progress = 0;
                    // if(this.node.getChildByName('Text'))
                    // this.node.getChildByName('Text').getComponent(cc.Label).string = '正在锻造武器';
                    once2 = false;
                }
            }
        },
        ()=>{
            // WXAdMgr.instance.zsInit();
            this.progress2 = 1;
            this.progressbar.progress = 1;
            // if(!this.btnStart.active){
            //     setTimeout(() => {
            //         cc.director.loadScene('game');  
            //     }, 200); 
            // }
            cc.director.loadScene('game');
        });
    }

    OVLoad(){
        if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO){
            var self = this;
        var subTask = qg.loadSubpackage({
            // manifest.json中配置的子包包名
            name:"sub",
            // 子包加载成功回调
            success:function(){
                console.log("sub1 子包加载成功");
                self.WXSplitLoad();
            }
        })
        subTask.onProgressUpdate(function(res){
            // 加载进度百分比
            var progress = res["progress"];
            // 下载数据
            var totalBytesWritten = res["totalBytesWritten"];
            // 总长度
            var totalBytesExpectedToWrite = res["totalBytesExpectedToWrite"];
            let p: number = progress / 100;
            if(this.progressbar)
            this.progressbar.progress = p;
        })
        }
    }

    WXLoad(){
        if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
            const loadTask2 = wx.loadSubpackage({
                name: 'sub', // name 可以填 name 或者 root
                success: (res)=> {
                    this.progressbar.progress = 0;
                    // this.WXSplitLoad();
                    const loadTask4 = wx.loadSubpackage({
                        name: 'scripts', // name 可以填 name 或者 root
                        success: (res)=> {
                            this.progressbar.progress = 0;
                            this.WXSplitLoad();
                        },
                        fail: function(res) {
                            // 分包加载失败通过 fail 回调
                        }
                        
                    })
                    loadTask4.onProgressUpdate(res => {
                        cc.log('下载进度', res.progress)
                        cc.log('已经下载的数据长度', res.totalBytesWritten)
                        cc.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
                        let p: number = res.progress / 100;
                        this.progressbar.progress = p;
                    })
                    const loadTask3 = wx.loadSubpackage({
                        name: 'sub1', // name 可以填 name 或者 root
                        success: (res)=> {
                            this.progressbar.progress = 0;
                            this.WXSplitLoad();
                        },
                        fail: function(res) {
                            // 分包加载失败通过 fail 回调
                        }
                        
                    })
                    loadTask3.onProgressUpdate(res => {
                        cc.log('下载进度', res.progress)
                        cc.log('已经下载的数据长度', res.totalBytesWritten)
                        cc.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
                        let p: number = res.progress / 100;
                        this.progressbar.progress = p;
                    })
                },
                fail: function(res) {
                    // 分包加载失败通过 fail 回调
                }
                
            })
            loadTask2.onProgressUpdate(res => {
                cc.log('下载进度', res.progress)
                cc.log('已经下载的数据长度', res.totalBytesWritten)
                cc.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
                let p: number = res.progress / 100;
                this.progressbar.progress = p;
            })

            
        }else{
            this.WXSplitLoad();
        }
        
    }

    // update (dt) {}
}
