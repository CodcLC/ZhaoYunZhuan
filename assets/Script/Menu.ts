import Main from "./Main";
import Equipment from "./Equipment";
import { HeroSpName, PetSpName, HeroName } from "./nativets/Config";
import { loadSpinePromise, loadWXSubPromise } from "./Tool/LoadPromise";
import MenuSelect from "./MenuSelect";
import HeroGlobal from "./Hero/HeroGlobal";
import TextureMgr from "./TextureMgr";
import AudioMgr from "./Audio";
import Others from "./Others/Others";
import AdMgr from "./Ad/AdMgr";
import Message from "./Message";
import WXAdMgr from "./Ad/WXAdMgr";
import TimeMgr from "./Tool/TimeMgr";
import DataMgr from "./DataMgr";
import { getPlatform, Platform } from "./nativets/Platform";
import NativeAd from "./Ad/NativeAd";
import TimeLimit from "./Others/TimeLimit/TimeLimit";
import AdList from "./Ad/AdList";
import Qimen from "./Others/Qimen/Qimen";
import Statistics from "./Tool/Statistics";
import Global from "./nativets/Global";
import NewHttp from "./lib/NewHttp";
import TTAdMgr from "./Ad/TTAdMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
    static instance: Menu = null;
    heroSk: sp.Skeleton;
    BottomNode: cc.Node;
    RightNode: cc.Node;
    hero: cc.Node;
    LeftNode: cc.Node;
    TopNode: cc.Node;
    lvLabel: cc.Label;
    jadeLabel: cc.Label;
    lifeLabel: cc.Label;
    coinsLabel: cc.Label;
    ceLabel: cc.Label;
    LeftRoot: cc.Node;
    TopIconNode: cc.Node;
    nameLabel: cc.Label;
    heroIcon: cc.Sprite;
    timeLimitBtn: cc.Node;
    timeLimitLabel: cc.Label;
    timeLimitNode: cc.Node;
    timeLimitSaveCount: number = 0;
    isScrolling: boolean;
    onceNative: boolean = false;
    // DetailNode: cc.Node;
    // detailName: cc.Label;
    // detailHp: cc.Label;
    // detailDef: cc.Label;
    // detailAtk: cc.Label;
    // detailBouns: cc.Label;
    // detailCr: cc.Label;
    // detailMiss: cc.Label;

    
    // LIFE-CYCLE CALLBACKS:

    init(){
        this.LeftNode = this.node.getChildByName('Left');
        this.LeftRoot = this.LeftNode.getChildByName('root');
        this.hero = this.LeftRoot.getChildByName('Hero');
        this.heroSk = this.hero.getComponent(sp.Skeleton);
        this.BottomNode = this.node.getChildByName('Bottom');
        this.RightNode = this.node.getChildByName('Right');
        this.timeLimitBtn = this.RightNode.getChildByName('TimeLimit');
        this.timeLimitLabel = this.timeLimitBtn.getChildByName('text').getComponent(cc.Label);
        this.timeLimitNode = cc.find('Canvas').getChildByName('TimeLimit');
        
        if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
            this.RightNode.getChildByName('More').active = true;
        }

        this.TopNode = this.node.getChildByName('Top');
        this.TopIconNode = this.TopNode.getChildByName('icon');
        this.lvLabel = this.TopIconNode.getChildByName('lv').getComponent(cc.Label);
        this.ceLabel = this.TopIconNode.getChildByName('ce').getComponent(cc.Label);
        
        this.nameLabel = this.TopIconNode.getChildByName('name').getComponent(cc.Label);
        this.heroIcon = this.TopIconNode.getChildByName('icon').getComponent(cc.Sprite);

        this.jadeLabel = this.TopNode.getChildByName('jade').getComponent(cc.Label);
        this.lifeLabel = this.TopNode.getChildByName('life').getComponent(cc.Label);
        this.coinsLabel = this.TopNode.getChildByName('coins').getComponent(cc.Label);

        cc.director.on('CloseEquipment', this.showRight, this);
        cc.director.on('RefreshSelect', this.refreshSpine, this);
        cc.director.on('RefreshMapSelect', this.refreshMapSelect, this);
        cc.director.on('RefreshIcon', this.refreshSelect, this);
    }

    onLoad () {
        Menu.instance = this;
        this.init();
        this.setTimeLimitState();
        this.loadDefaultHeroSpAsync();
        // this.preLoadMap();

        // Statistics.getInstance().getVivoSwitchRate(1).then((rate)=>{
        //     cc.log('VIVORATE',rate);
        // });

        // Statistics.getInstance().reportEvent('6666');
        // NewHttp.reportStage(Global.getInstance().uuid, 1, '第1关', 'complete');
        // NewHttp.register(2, Global.getInstance().uuid, '', '', '1001', '', null);
        // NewHttp.updateUserInfo(Global.getInstance().uuid, 'sjsssfas', 'http://aa.jpg', null);
        // NewHttp.report(1,Global.getInstance().uuid,200);
        // NewHttp.getRank(1,50,Global.getInstance().uuid,null);

        // let uuid = 'aa7cf2f52c052c62cb885163fee710d7aa7cf2f52c052c';
        // NewHttp.register(1, uuid, '', '', '', '', null);
    }

    start () {
        if(DataMgr.instance.needOpenSign){
            DataMgr.instance.needOpenSign = false;
            this.OpenSign();
        }

        this.checkLaunch();
    }

    checkLaunch(){
        if(!DataMgr.instance.needCheckMark){
            return;
        }
        let success = ()=>{
            if(AdMgr.instance){
                AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.收藏礼包);
            }else{
                this.addCoins(1000);
            }
        }
        
        if(getPlatform() == Platform.WX && wx.getLaunchOptionsSync().scene == 1089){
            Menu.instance.addCoins(1000);
            DataMgr.instance.saveWXMarkData();
            Message.instance.show('收藏礼包', '恭喜获得收藏礼包1000金币，是否观看视频翻倍', success);
        }
        if(getPlatform() == Platform.QQ && (wx.getLaunchOptionsSync().scene == 3003 || wx.getLaunchOptionsSync().scene == 1023 || wx.getLaunchOptionsSync().scene == 1131)){
            Menu.instance.addCoins(1000);
            DataMgr.instance.saveWXMarkData();
            Message.instance.show('收藏礼包', '恭喜获得收藏礼包1000金币，是否观看视频翻倍', success);
        }
    }


    loadDefaultHeroSpAsync(){
        this.loadMenuHeroSp(HeroGlobal.instance.MainHeroIndex);
        this.refreshHero(HeroGlobal.instance.MainHeroIndex);
    }

    async loadMenuHeroSp(index: number){
        if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
            await loadWXSubPromise('hero' + index);
        }
        let sp: any = await loadSpinePromise(HeroSpName[index]);
        this.hero.y = -210;
        this.heroSk.skeletonData = sp;
        this.heroSk.animation = 'stay';
        this.heroSk._updateSkeletonData();
        this.heroSk.setSkin('001');
        cc.director.emit('RefreshSp', index);
        console.log('loadHero', 'hero' + index)
    }

    async loadMenuPetSp(index: number){
        let sp: any = await loadSpinePromise(PetSpName[index]);
        console.log('loadPet', PetSpName[index])
        this.hero.y = -20;
        this.heroSk.skeletonData = sp;
        this.heroSk.animation = 'fly';
        this.heroSk._updateSkeletonData();
        this.heroSk.setSkin('default');
        // Main.instance.PreLoadEquipment();
    }

    refreshSelect(index: number){
        console.log('RefreshSelect')
        this.LeftNode.active = (Equipment.instance.listIndex == 0 || Equipment.instance.listIndex == 3);
        if(Equipment.instance.listIndex == 3){
            // cc.log('petindex', HeroGlobal.instance.PetIndex);
            // this.LeftNode.active = false;
            let petIndex = HeroGlobal.instance.PetIndex;
            if(petIndex < 0){
                petIndex = 0;
            }
            MenuSelect.instance.setSelect(petIndex);
            this.loadMenuPetSp(petIndex);
        }else{
            // this.LeftNode.active = true;
            MenuSelect.instance.setSelect(HeroGlobal.instance.MainHeroIndex);

            this.loadMenuHeroSp(HeroGlobal.instance.MainHeroIndex);
        }
    }

    refreshMapSelect(index: number, preFigheIndex: number){
        if(preFigheIndex == 2){
            this.loadMenuPetSp(index);
        }else{
            this.loadMenuHeroSp(index);
        }
        

    }

    refreshSpine(index: number){
        // cc.log('ispet', MenuSelect.instance.isPet, Equipment.instance.listIndex);
        if(Equipment.instance && Equipment.instance.listIndex == 3){
            this.refreshPet(index);
            HeroGlobal.instance.setPetIndex(index);
        }else{
            this.refreshHero(index);
        }
    }
    
    refreshHero(index: number){
        console.log('refreshHero')
        if(Equipment.instance)
        Equipment.instance.refreshDetail(index);
        this.loadMenuHeroSp(index);
        
        this.heroIcon.spriteFrame = TextureMgr.instance.heroIconRectSf[index];
        this.nameLabel.string = HeroName[index];
        this.ceLabel.string = HeroGlobal.instance.HeroDataArrs[index].CE + '';
    }

    refreshPet(index: number){
        this.loadMenuPetSp(index);
    }

    refreshTopLabel(notRefresh?: boolean){
        if(!this.lvLabel){
            return;
        }
        this.lvLabel.string = 'Lv.' + HeroGlobal.instance.Level;
        // let oldJade = parseInt(this.jadeLabel.string);
        // let jadeLen = this.jadeLabel.string.length;
        // if(HeroGlobal.instance.Jade > oldJade){
        //     this.schedule(()=>{
        //         this.jadeLabel.string = this.getRandomStr(jadeLen);
        //     }, .2, 7);
        //     this.scheduleOnce(()=>{
        //         this.jadeLabel.string = '' + HeroGlobal.instance.Jade;
        //     }, 1.5);
        // }

        if(notRefresh){
            this.jadeLabel.string = '' + HeroGlobal.instance.Jade;
            this.coinsLabel.string = '' + HeroGlobal.instance.Coins;
            this.lifeLabel.string = '' + HeroGlobal.instance.Life;
        }else{
            this.setTopLabel('jade');
            this.setTopLabel('coins');
            this.setTopLabel('life');
        }
        
    }

    setTopLabel(type: string){
        let label: cc.Label = null;
        let num = 0;
        switch (type) {
            case 'jade':
                label = this.jadeLabel;
                num = HeroGlobal.instance.Jade;
                break;
            case 'coins':
                label = this.coinsLabel;
                num = HeroGlobal.instance.Coins;
                break;
            case 'life':
                label = this.lifeLabel;
                num = HeroGlobal.instance.Life;
                break;
            default:
                break;
        }
        let oldJade = parseInt(label.string);
        let jadeLen = label.string.length;
        if(num > oldJade){
            // this.schedule(()=>{
            //     label.string = this.getRandomStr(jadeLen);
            // }, .05, 15);
            // this.scheduleOnce(()=>{
            //     label.string = '' + num;
            // }, 1);
            if(!this.isScrolling){
                AudioMgr.instance.playAudio('TopScroll');
                this.isScrolling = true;
            }
            
            let gen = this.generateRandomString(type);
            this.schedule(()=>{
                if (gen.next().done) {
                    gen = null;
                    label.string = '' + num;
                    this.isScrolling = false;
                }
            }, .05, 15);
        }else{
            label.string = '' + num;
        }
        
    }

    *generateRandomString(type: string) {
        for (let i = 0; i < 15; i++) {
            yield this.setTopLabel2(type);
        }
    }

    setTopLabel2(type: string){
        let label: cc.Label = null;
        let num = 0;
        switch (type) {
            case 'jade':
                label = this.jadeLabel;
                num = HeroGlobal.instance.Jade;
                break;
            case 'coins':
                label = this.coinsLabel;
                num = HeroGlobal.instance.Coins;
                break;
            case 'life':
                label = this.lifeLabel;
                num = HeroGlobal.instance.Life;
                break;
            default:
                break;
        }
        
        let jadeLen = label.string.length;
        label.string = this.getRandomStr(jadeLen);


        // let oldJade = parseInt(label.string);
        // let jadeLen = label.string.length;
        // if(num > oldJade){
        //     this.schedule(()=>{
        //         label.string = this.getRandomStr(jadeLen);
        //     }, .05, 15);
        //     this.scheduleOnce(()=>{
        //         label.string = '' + num;
        //     }, 1);
        // }else{
        //     label.string = '' + num;
        // }
        
    }

    getRandomStr(len: number){
        let str = '';
        for (let i = 0; i < len; i++) {
            str += Math.floor(Math.random() * 10) + '';
        }
        return str;
    }

    preLoadMap(){
        cc.loader.loadRes('Map',cc.Prefab,(err,prefab)=>{
            if(err) return;
            let n: cc.Node = cc.instantiate(prefab);
            Main.instance.mapNode.active = false;
            n.parent = Main.instance.mapNode;
        });
    }

    onBtnStart(){
        // this.node.destroy();
        // this.Test();
        // this.node.parent.active = false;
        AudioMgr.instance.playAudio('BtnClick');
        this.loadMap();
    }

    onBtnOthers(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);

    }

    onBtnSetting(){
        AudioMgr.instance.playAudio('BtnClick');
        cc.find('Canvas').getChildByName('Setting').active = true;
    }

    onBtnAddLife(){
        AudioMgr.instance.playAudio('BtnClick');

        Message.instance.showLack('life');
    }

    addLife(num: number){
        HeroGlobal.instance.Life += num;
        // HeroGlobal.instance.setLife(HeroGlobal.instance.Life + 10);
        HeroGlobal.instance.saveHeroGlobal();
        this.refreshTopLabel();
    }

    onBtnAddCoins(){
        AudioMgr.instance.playAudio('BtnClick');


        Message.instance.showLack('coins');
    }

    addCoins(num: number){
        HeroGlobal.instance.Coins += num;
        HeroGlobal.instance.saveHeroGlobal();
        this.refreshTopLabel();
    }

    onBtnAddJade(){
        AudioMgr.instance.playAudio('BtnClick');
        Message.instance.showLack('jade');
    }

    addJade(num: number){
        HeroGlobal.instance.Jade += num;
        HeroGlobal.instance.saveHeroGlobal();
        this.refreshTopLabel();
    }

    onBtnMoreGame(){
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            AdMgr.instance.showGamePortal();
            // AdMgr.instance.showGridAd();
        }
    }

    onBtnOpenTimeLimit(){
        AudioMgr.instance.playAudio('BtnClick');
        // this.timeLimitNode.active = true;
        TimeLimit.instance.open(true);
        Statistics.getInstance().reportEvent('限时神宠');
    }

    onBtnOpenQimen(){
        AudioMgr.instance.playAudio('BtnClick');
        // TimeLimit.instance.open(true);
        Qimen.instance.open();
        Statistics.getInstance().reportEvent('奇门抽奖');
    }

    setTimeLimitState(){
        this.timeLimitBtn.active = HeroGlobal.instance.PetLvArrs[1] < 1;
    }

    refreshTimeLimit(){
        let time = Math.floor(DataMgr.instance.timeLimitNum);
        if(time <= 0){
            this.timeLimitBtn.active = false;
            this.timeLimitSaveCount = 0;
            DataMgr.instance.saveTimeLimitData();
        }
        let ftime = TimeMgr.formatTime(time);
        if(this.timeLimitLabel.string != ftime){
            this.timeLimitLabel.string = ftime;
            this.timeLimitSaveCount ++;
            if(this.timeLimitSaveCount > 20){
                this.timeLimitSaveCount = 0;
                DataMgr.instance.saveTimeLimitData();
            }
        }
    }

    Test(){
        // this.ReleaseMenu();
        
    }

    onBtnTestSubs(){
        WXAdMgr.instance.WXSubscribe(0);
    }

    onBtnTestSubs1(){
        WXAdMgr.instance.WXSubscribe(1);
    }

    loadMap(){
        // if(Main.instance.mapNode.children.length == 0){
        //     cc.log('没map');

        //     cc.loader.loadRes('Map',cc.Prefab,(err,prefab)=>{
        //         cc.log('没map2',err);
        //         if(err) return;
        //         let n: cc.Node = cc.instantiate(prefab);
        //         n.parent = Main.instance.mapNode;
        //         Main.instance.mapNode.active = true;
        //         this.node.parent.active = false;
        //     });
        // }else{
        //     cc.log('有map');
        //     Main.instance.mapNode.active = true;
        //     this.node.parent.active = false;
        // }

        Main.instance.loadMap(()=>{
            this.node.parent.active = false;
            if(AdMgr.instance)
            AdMgr.instance.showBannerAd(AdList.BANNERLIST.地图右上);
        });
        
    }

    loadMapSafe(){

    }

    showBase(isshow: boolean){
        
    }

    showRight(){
        this.LeftNode.active = true;
        this.BottomNode.active = true;
        this.RightNode.active = true;
        this.loadMenuHeroSp(HeroGlobal.instance.MainHeroIndex);
    }

    hideRight(){
        this.BottomNode.active = false;
        this.RightNode.active = false;
    }



    ReleaseMenu(){
        let uuidArrs: string[] = cc.loader.getDependsRecursively('Menu');
        for (let i = 0; i < uuidArrs.length; i++) {
            cc.loader.release(uuidArrs[i]);
        }
    }

    onBtnListSelect(event: cc.Event){
        // AudioMgr.instance.playAudio('BtnClick');
        Main.instance.LoadEquipment(()=>{
            this.hideRight();
            Equipment.instance.onBtnListSelect(event);
        })
    }

    onBtnOthersSelect(event: cc.Event){
        if(getPlatform() == Platform.TT && event.target.name == '1'){
            // 头条排行榜
            if(!Global.getInstance().ttAuthor){
                wx.login({
                    success: ((res)=>{
                        tt.authorize({
                            scope: "scope.userInfo",
                            success() {
                              // 用户同意授权用户信息
                              console.log('AuthorSuccess');
                                if(TTAdMgr.instance){
                                    TTAdMgr.instance.getUserInfo();
                                }
                                Global.getInstance().ttAuthor = true;
                            },
                            fail() {
                                console.log('AuthorFail');
                                if(TTAdMgr.instance){
                                    TTAdMgr.instance.guideActive();
                                }
                            }
                            
                          });
                    }
                    )
                })

            }else{
                console.log('AuthorOpenRank');
                this.OpenRank();
            }
            
        }else{
            Main.instance.LoadOthers(()=>{
                this.LeftNode.active = false;
                this.RightNode.active = false;
                this.BottomNode.active = false;
                Others.instance.onBtnListSelect(event);
            })
    
            if(AdMgr.instance){
                if(Math.random() < .6){
                    if(!this.onceNative){
                        AdMgr.instance.showNativeAd();
                        this.onceNative = true;
                    }else{
                        AdMgr.instance.showInterstitial();
                    }
                    
                }
                
            }
        }

        
    }

    OpenRank(){
        AudioMgr.instance.playAudio('BtnClick');
        this.OpenOthers(1);
    }

    OpenFriend(){
        this.OpenOthers(9);
    }

    OpenSign(){
        this.OpenOthers(0);
    }

    OpenOthers(index: number){
        Main.instance.LoadOthers(()=>{
            this.LeftNode.active = false;
            this.RightNode.active = false;
            this.BottomNode.active = false;
            Others.instance.open(index);
        })
    }

    onEnable(){
        this.refreshTopLabel(true);
        if(AudioMgr.instance)
        AudioMgr.instance.stopBgm('game');
        this.scheduleOnce(()=>{
            AudioMgr.instance.playBgm('menu');
        }, 2);
    }

    onDestroy(){
        AudioMgr.instance.stopBgm('menu');
        cc.director.off('CloseEquipment', this.showRight, this);
        cc.director.off('RefreshSelect', this.refreshSelect, this);
        cc.director.off('RefreshIcon', this.refreshSelect, this);
        cc.director.off('RefreshMapSelect', this.refreshMapSelect, this);
    }

    update (dt) {
        if(this.timeLimitBtn.active){
            DataMgr.instance.timeLimitNum -= dt;
            this.refreshTimeLimit();
        }
        
    }
}
