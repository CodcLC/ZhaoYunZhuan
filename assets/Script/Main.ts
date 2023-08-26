import {getPlatform, Platform} from "./nativets/Platform";
import Global from "./nativets/Global";
import Hero from "./Hero/Hero";
import HeroData from "./Hero/HeroData";
import Gradient from "./Shader/Gradient";
import CustomRelease from "./nativets/ReleaseMgr";
import { load } from "./nativets/SaveMgr";
import Menu from "./Menu";
import TimeLimit from "./Others/TimeLimit/TimeLimit";
import Qimen from "./Others/Qimen/Qimen";
import Statistics from "./Tool/Statistics";
import MapSelect from "./Map/MapSelect";
import AdMgr from "./Ad/AdMgr";
import AdList from "./Ad/AdList";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    static instance: Main = null;

    @property(cc.Node)
    menuNode: cc.Node = null;

    @property(cc.Node)
    mapNode: cc.Node = null;

    @property(cc.Node)
    gameNode: cc.Node = null;

    @property(cc.Node)
    loadingNode: cc.Node = null;

    hd: HeroData;
    heroCamera: cc.Node;

    loadProgressNode: cc.Node;
    loadProgressBar: cc.ProgressBar;
    loadTime: number;
    loadOnce: boolean;
    loadingMap: boolean = false;
    loadingGame: boolean;
    loadingMenu: boolean;
    loadingEquipment: boolean;
    loadingOthers: boolean;
    loadingFirst: any;
    menuCount: number = 0;
    loadingOV: boolean;

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.heroCamera = this.node.getChildByName('heroCamera');
        // this.loadProgressNode = this.loadingNode.getChildByName('Progress');
        // this.loadProgressBar = this.loadProgressNode.getChildByName('ProgressBar').getComponent(cc.ProgressBar);
    }

    onLoad () {
        Main.instance = this;
        this.init();
        if(!load('FirstSelect')){
            this.LoadFirst(()=>{});
        }else{
            if(this.menuNode.getChildByName('Menu').getChildByName('FirstSelect')){
                this.menuNode.getChildByName('Menu').getChildByName('FirstSelect').active = false;
            }
        }
        
    }

    start () {
        this.loadOVNative();
    }

    loadOVNative(){
        if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO){
            let arrs = ['NativeAd', 'NativeBanner', 'NativeBanner2', 'NativeBanner3', 'NativeBanner4'];
            for (let i = 0; i < arrs.length; i++) {
                this.loadOVRes(arrs[i]);
            }
        }
    }

    loadOVRes(name: string){
        if(!this.node.getChildByName(name)){
            cc.loader.loadRes('OV/' + name,cc.Prefab,(err,prefab)=>{
                if(err) return;
                let n: cc.Node = cc.instantiate(prefab);
                n.parent = this.node;
            });
        }
    }

    loadMenu(callback?: Function){
        if(Main.instance.menuNode.children.length == 0){
            if(this.loadingMenu){
                return;
            }
            this.loadingMenu = true;
            cc.loader.loadRes('Menu',cc.Prefab,(err,prefab)=>{
                this.loadingMenu = false;
                if(err) return;
                let n: cc.Node = cc.instantiate(prefab);
                n.parent = Main.instance.menuNode;
                this.menuCount ++;
                
                callback();
                Main.instance.menuNode.active = true;
                this.scheduleOnce(()=>{
                    if(this.menuCount == 2){
                        Menu.instance.OpenSign();
                    }
    
                    if(this.menuCount == 2){
                        TimeLimit.instance.open(false);
                        Statistics.getInstance().reportEvent('限时神翅');
                    }

                    if(this.menuCount == 3){
                        Qimen.instance.open();
                    }
                }, .5);
                
                // this.node.parent.active = false;
                
            });
        }else{
            cc.log('LOADMENU');
            callback();
            Main.instance.menuNode.active = true;
            // this.node.parent.active = false;
            if(CC_NATIVERENDERER){
                cc.log('LOADMENU2');
                Main.instance.menuNode.children[0].active = true;
                Menu.instance.showRight();
            }
        }
        
    }

    loadMap(callback?: Function){
        if(Main.instance.mapNode.children.length == 0){
            if(this.loadingMap){
                return;
            }
            this.loadingMap = true;
            cc.loader.loadRes('Map',cc.Prefab,(err,prefab)=>{
                this.loadingMap = false;
                if(err) return;
                
                let n: cc.Node = cc.instantiate(prefab);
                n.parent = Main.instance.mapNode;
                Main.instance.mapNode.active = true;
                // this.node.parent.active = false;
                callback();
            });
        }else{
            Main.instance.mapNode.active = true;
            // this.node.parent.active = false;
            if(CC_NATIVERENDERER){
                Main.instance.mapNode.children[0].active = true;
                if(MapSelect.instance){
                    MapSelect.instance.onBtnClose();
                }
                
            }
            callback();
        }
        
    }

    loadGame(callback?: Function){
        this.loadingNode.active = true;

        if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
            const loadTask5 = wx.loadSubpackage({
                name: 'subMusic', // name 可以填 name 或者 root
                success: (res)=> {
                    const loadTask3 = wx.loadSubpackage({
                        name: 'sub2', // name 可以填 name 或者 root
                        success: (res)=> {
        
                            if(Global.getInstance().nowLevel > 9){
                                const loadTask4 = wx.loadSubpackage({
                                    name: 'sub3', // name 可以填 name 或者 root
                                    success: (res)=> {
                                        this.toGame(callback);
                                    },
                                    fail: function(res) {
                                        // 分包加载失败通过 fail 回调
                                    }
                                    
                                })
                                loadTask4.onProgressUpdate(res => {
                                })
                            }else{
                                this.toGame(callback);
                            }
                            
                        },
                        fail: function(res) {
                            // 分包加载失败通过 fail 回调
                        }
                        
                    })
                    loadTask3.onProgressUpdate(res => {
                    })
                },
                fail: function(res) {
                    // 分包加载失败通过 fail 回调
                }
                
            })
            loadTask5.onProgressUpdate(res => {
            })
        }else if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO){
            const loadTask5 = qg.loadSubpackage({
                name: 'subMusic', // name 可以填 name 或者 root
                success: (res)=> {
                    const loadTask3 = qg.loadSubpackage({
                        name: 'sub2', // name 可以填 name 或者 root
                        success: (res)=> {
                            this.toGame(callback);
                        },
                        fail: function(res) {
                            // 分包加载失败通过 fail 回调
                        }
                        
                    })
                    loadTask3.onProgressUpdate(res => {
                    })
                },
                fail: function(res) {
                    // 分包加载失败通过 fail 回调
                }
                
            })
            loadTask5.onProgressUpdate(res => {
            })

            

        }else{
            this.toGame(callback);
        }
        

        
    }

    toGame(callback?: Function){
        // this.showLoadingProgress();
        Main.instance.ReleaseMap();
        Main.instance.ReleaseMenu();
        if(AdMgr.instance)
        AdMgr.instance.showBannerAd(AdList.BANNERLIST.加载右下);
        // this.menuNode.active = false;
        // this.mapNode.active = false;
        if(Main.instance.gameNode.children.length == 0){
            if(this.loadingGame){
                return;
            }
            this.loadingGame = true;
            cc.loader.loadRes('Game',cc.Prefab,(err,prefab)=>{
                this.loadingGame = false;
                if(err) return;
                
                let n: cc.Node = cc.instantiate(prefab);
                n.parent = Main.instance.gameNode;
                
                // this.node.parent.active = false;
                callback();
                Main.instance.gameNode.active = true;
                // this.loadingNode.active = false;
            });
        }else{
            
            // this.node.parent.active = false;
            callback();
            Main.instance.gameNode.active = true;
            if(CC_NATIVERENDERER){
                Main.instance.gameNode.children[0].active = true;
            }
            // this.loadingNode.active = false;
        }
    }

    LoadEquipment(callback: Function){
        if(!this.menuNode.getChildByName('Menu').getChildByName('Equipment')){
            if(this.loadingEquipment){
                return;
            }
            this.loadingEquipment = true;
            cc.loader.loadRes('Equipment',cc.Prefab,(err,prefab)=>{
                this.loadingEquipment = false;
                if(err) return;
                
                let n: cc.Node = cc.instantiate(prefab);
                n.parent = this.menuNode.getChildByName('Menu');
                n.active = true;
                callback();
            });
        }else{
            this.menuNode.getChildByName('Menu').getChildByName('Equipment').active = true;
            callback();
        }
    }

    PreLoadEquipment(){
        cc.loader.loadRes('Equipment',cc.Prefab,(err,prefab)=>{
            // let n: cc.Node = cc.instantiate(prefab);
            // n.parent = this.menuNode.getChildByName('Menu');
            // n.active = false;
            // this.loadingEquipment = false;
        });
    }

    LoadFirst(callback: Function){
        // return;
        if(!this.menuNode.getChildByName('Menu').getChildByName('FirstSelect')){
            if(this.loadingFirst){
                return;
            }
            this.loadingFirst = true;
            cc.loader.loadRes('FirstSelect',cc.Prefab,(err,prefab)=>{
                this.loadingFirst = false;
                if(err) return;
                let n: cc.Node = cc.instantiate(prefab);
                n.parent = this.menuNode.getChildByName('Menu');
                n.active = true;
                callback();
            });
        }else{
            this.menuNode.getChildByName('Menu').getChildByName('FirstSelect').active = true;
            callback();
        }
    }

    LoadOthers(callback: Function){
        if(!this.menuNode.getChildByName('Menu').getChildByName('Others')){
            if(this.loadingOthers){
                return;
            }
            this.loadingOthers = true;
            cc.loader.loadRes('Others',cc.Prefab,(err,prefab)=>{
                this.loadingOthers = false;
                if(err) return;
                let n: cc.Node = cc.instantiate(prefab);
                n.parent = this.menuNode.getChildByName('Menu');
                n.active = true;
                callback();
            });
        }else{
            this.menuNode.getChildByName('Menu').getChildByName('Others').active = true;
            callback();
        }
    }

    ReleaseMenu(){
        this.menuNode.active = false;
        this.ReleaseEquipment();
        if(CC_NATIVERENDERER){
            if(this.menuNode.children[0]){
                this.menuNode.children[0].active = true;
                
            }
        }else{
            if(this.menuNode.children[0]){
                this.menuNode.children[0].destroy();
                
            }
            // setTimeout(() => {
                let uuidArrs: string[] = cc.loader.getDependsRecursively('Menu');
                // cc.log('uuid relaseMe', uuidArrs);
                for (let i = 0; i < uuidArrs.length; i++) {
                    
                    // if(uuidArrs[i].indexOf('res/import/12/1234') != -1){
                    //     cc.log('menu13reeeeeeeeeeeeeeeeee');
                    //     return;
                    // }
                    // if(uuidArrs[i].indexOf('res/import/13/1397') != -1){
                    //     cc.log('menu13reeeeeeeeeeeeeeeeee');
                    //     return;
                    // }
                    // cc.loader.release(uuidArrs[i]);
                    CustomRelease(uuidArrs[i]);
                }
                
        }
        
        // }, 3000);
        
    }

    ReleaseEquipment(){
        if(CC_NATIVERENDERER){
            if(this.menuNode.getChildByName('Menu').getChildByName('Equipment')){
                this.menuNode.getChildByName('Menu').getChildByName('Equipment').active = false;
                
            }
        }else{
            if(this.menuNode.getChildByName('Menu').getChildByName('Equipment')){
                this.menuNode.getChildByName('Menu').getChildByName('Equipment').destroy();
                let uuidArrs: string[] = cc.loader.getDependsRecursively('Equipment');
                for (let i = 0; i < uuidArrs.length; i++) {
                    CustomRelease(uuidArrs[i]);
                }  
            }
        }
        
        
    }

    ReleaseMap(){
        this.mapNode.active = false;
        if(CC_NATIVERENDERER){
            if(this.mapNode.children[0]){
                this.mapNode.children[0].active = false;
            }
        }else{
            if(this.mapNode.children[0]){
                this.mapNode.children[0].destroy();
            }
            let uuidArrs: string[] = cc.loader.getDependsRecursively('Map');
            // cc.log('uuid relase', uuidArrs);
            for (let i = 0; i < uuidArrs.length; i++) {
                
                // if(uuidArrs[i].indexOf('res/import/12/1234') != -1){
                //     cc.log('map13reeeeeeeeeeeeeeeeee');
                //     continue;
                // }
                // if(uuidArrs[i].indexOf('res/import/13/1397') != -1){
                //     cc.log('map13reeeeeeeeeeeeeeeeee');
                //     continue;
                // }
                // cc.loader.release(uuidArrs[i]);
                CustomRelease(uuidArrs[i]);
            }
        }
        
    }

    ReleaseGame(){
        this.gameNode.active = false;
        if(CC_NATIVERENDERER){
            if(this.gameNode.children[0]){
                this.gameNode.children[0].active = false;
            }
        }
        if(this.gameNode.children[0]){
            this.gameNode.children[0].destroy();
        }
        let uuidArrs: string[] = cc.loader.getDependsRecursively('Game');
        // cc.log('uuidarrs', uuidArrs);
        for (let i = 0; i < uuidArrs.length; i++) {
           
            
            // if(uuidArrs[i].indexOf('res/import/12/1234') != -1){
            //     cc.log('game13reeeeeeeeeeeeeeeeee');
            //     continue;
            // }
            // if(uuidArrs[i].indexOf('res/import/13/1397') != -1){
            //     cc.log('game13reeeeeeeeeeeeeeeeee');
            //     continue;
            // }
            // cc.loader.release(uuidArrs[i]);
            CustomRelease(uuidArrs[i]);
        }
    }

    // showLoadingProgress(){
    //     this.loadProgressNode.active = true;
    //     this.loadProgressBar.progress = 0;
    //     this.loadTime = 0;
    //     this.loadOnce = true;
    // }


    createNext(){
        
    }

    update (dt) {
        
        // if(this.loadProgressNode.active){
        //     this.loadTime += dt;
            
        //     this.loadProgressBar.progress = this.loadTime;
        //     if(this.loadTime >= 1){
        //         this.loadProgressNode.active = false;
        //         this.loadTime = 0;
                
                
        //     }
        //     if(this.loadTime > .2 && this.loadOnce){
        //         this.loadOnce = false;
        //         this.loadingNode.getComponent(Gradient).effect();
        //     }
        // }
    }
}
