import Hero from "./Hero/Hero";
import Main from "./Main";
import Global from "./nativets/Global";
import HeroGlobal from "./Hero/HeroGlobal";
import HeroFSM from "./Hero/HeroFSM";
import MonsterNodePool from "./Monster/MonsterNodePool";
import BgMgr from "./BgMgr";
import { Exp, getLevelCoins, getLevelExp, BgName, HeroSpName, PetSpName, MapData, HeroName, Skill } from "./nativets/Config";
import AllText from "./i18n/Language";
import TextureMgr from "./TextureMgr";
import AudioMgr from "./Audio";
import Director from "./Director";
import RewardMgr from "./Reward/RewardMgr";
import SkillProgress from "./Hero/SkillProgress";
import AdMgr from "./Ad/AdMgr";
import Statistics from "./Tool/Statistics";
import AdList from "./Ad/AdList";
import Gradient from "./Shader/Gradient";
import DataMgr from "./DataMgr";
import RewardAuto from "./Reward/RewardAuto";
import Message from "./Message";
import { getPlatform, Platform } from "./nativets/Platform";
import OPPOAdMgr from "./Ad/OPPOAdMgr";
import VIVOAdMgr from "./Ad/VIVOAdMgr";
import { loadWXSubPromise, loadSpinePromise } from "./Tool/LoadPromise";
import BoxGift from "./Others/BoxGift/BoxGift";
import TTAdMgr from "./Ad/TTAdMgr";
import QQAdMgr from "./Ad/QQAdMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    static instance: Game = null;

    // @property([sp.SkeletonData])
    heroSpArrs: sp.SkeletonData[] = [];

    @property([cc.SpriteFrame])
    bossHpSf: cc.SpriteFrame[] = [];

    @property(cc.Material)
    flashMaterial: cc.Material = null;

    @property(cc.Prefab)
    boxPrefab: cc.Prefab = null;

    gameEventNode: cc.Node;
    gameEffectNode: cc.Node;
    dmgEventNode: cc.Node;

    startDate: number;
    pauseDate: number = 0;

    hero: cc.Node;
    heroScript: Hero;
    uiNode: cc.Node;
    gamePauseNode: cc.Node;
    gameEndNode: cc.Node;
    heroSk: sp.Skeleton;
    hudNode: cc.Node;
    nextArrow: cc.Node;

    nearSf: cc.SpriteFrame;
    midSf: cc.SpriteFrame;
    farSf: cc.SpriteFrame;

    holeSf: cc.SpriteFrame;

    holeNearSf: cc.SpriteFrame;
    holeMidSf: cc.SpriteFrame;
    holeFarSf: cc.SpriteFrame;
    bgMgr: BgMgr;
    gameEndWin: cc.Node;
    gameEndLose: cc.Node;
    gameEndBase: cc.Node;
    gameEndProgress: cc.ProgressBar;
    pauseStartDate: any;

    combo: number = 0;
    maxCombo: number = 0;

    LevelHelpSkill: boolean;
    LevelTime: number;
    ComboCount: number;
    LevelArrs: number[];
    gamePauseTask1: cc.Label;
    gamePauseTask2: cc.Label;
    gameEndTask1: cc.Label;
    gameEndTask2: cc.Label;
    gameEndExp: cc.Label;
    gameEndLv: cc.Label;
    bossHp: cc.Node;
    createMonsterTime: number;
    createMonsterIndex: number;
    gen: any;
    pet: cc.Node;
    petSk: any;
    rewardEventNode: cc.Node;
    ctrlNode: cc.Node;
    skillIconArrs: cc.Sprite[];
    skillTextArrs: cc.Label[];
    mapProgress: cc.Node;
    mapP1: cc.Node[];
    mapP2: cc.Node[];
    monsterCount: number;
    monsterTypeArrs: number[];
    lifeLable: cc.Label;
    directorNode: cc.Node;
    heroIcon0: cc.Sprite;
    heroIcon1: cc.Sprite;
    heroName0: cc.Label;
    heroName1: cc.Label;
    isHole: boolean;
    skillProgressArrs: SkillProgress[];
    gameEndBox: cc.Node;
    hudLv: cc.Label;
    bossIcon: cc.Sprite;
    bossName: cc.Label;
    gameEndBg: cc.Node;
    mapdata: any;
    reviveNode: cc.Node;
    bossWarnOnce: boolean;
    gameEndLayout: cc.Node;
    rewardItmeArrs: number[];
    rewardSoulArrs: number[];
    skillHalo: cc.Node;
    multIndex: number;
    mult: number;
    reviveLabel: cc.Label;
    onceNative: boolean = false;
    loadingShortcut: any;
    ttShareBtn: cc.Button;


    // LIFE-CYCLE CALLBACKS:
    init() {
        this.gameEventNode = this.node.getChildByName('GameEvent');
        this.gameEffectNode = this.node.getChildByName('GameEffect');
        this.dmgEventNode = this.node.getChildByName('DmgEvent');
        this.rewardEventNode = this.node.getChildByName('RewardEvent');
        this.uiNode = this.node.getChildByName('UI');
        this.hudNode = this.uiNode.getChildByName('HUD');
        this.initSkillIcon();
        this.gamePauseNode = this.uiNode.getChildByName('GamePause');
        let pauseBox: cc.Node = this.gamePauseNode.getChildByName('box');
        this.gamePauseTask1 = pauseBox.getChildByName('task1').getComponent(cc.Label);
        this.gamePauseTask2 = pauseBox.getChildByName('task2').getComponent(cc.Label);
        this.gameEndNode = this.uiNode.getChildByName('GameEnd');
        
        this.nextArrow = this.hudNode.getChildByName('next');
        this.bossHp = this.hudNode.getChildByName('bossHp');
        this.bossIcon = this.bossHp.getChildByName('icon').getComponent(cc.Sprite);
        this.bossName = this.bossHp.getChildByName('name').getComponent(cc.Label);
        this.mapProgress = this.hudNode.getChildByName('progress');
        this.mapP1 = [this.mapProgress.getChildByName('1'), this.mapProgress.getChildByName('11')];
        this.mapP2 = [this.mapProgress.getChildByName('2'), this.mapProgress.getChildByName('22')];

        let box: cc.Node = this.gameEndNode.getChildByName('box');
        this.gameEndBg = this.gameEndNode.getChildByName('bg');
        this.gameEndBox = box;
        this.gameEndWin = box.getChildByName('win');
        this.gameEndLose = box.getChildByName('lose');
        this.gameEndBase = box.getChildByName('Base');
        this.gameEndLayout = this.gameEndWin.getChildByName('layout');
        this.ttShareBtn = this.gameEndWin.getChildByName('share').getComponent(cc.Button);
        this.ttShareBtn.node.active = getPlatform() == Platform.TT;
        this.gameEndProgress = this.gameEndBase.getChildByName('ProgressBar').getComponent(cc.ProgressBar);
        this.gameEndTask1 = this.gameEndBase.getChildByName('task1').getComponent(cc.Label);
        this.gameEndTask2 = this.gameEndBase.getChildByName('task2').getComponent(cc.Label);
        this.gameEndExp = this.gameEndBase.getChildByName('exp').getComponent(cc.Label);
        this.gameEndLv = this.gameEndBase.getChildByName('lv').getComponent(cc.Label);

        this.reviveNode = this.uiNode.getChildByName('Revive');
        this.reviveLabel = this.reviveNode.getChildByName('box').getChildByName('cancel').getChildByName('text').getComponent(cc.Label);

        // Global.getInstance().inGame = true;

        this.hero = this.node.getChildByName('HeroRoot').getChildByName('Hero');
        this.heroSk = this.hero.getComponent(sp.Skeleton);
        this.heroScript = this.hero.getComponent(Hero);
        this.heroScript.initInstance();
        this.heroScript.init();
        cc.log('Main Other', HeroGlobal.instance.MainHeroIndex, HeroGlobal.instance.OtherHeroIndex);
        this.heroIcon0 = this.ctrlNode.getChildByName('0').getComponent(cc.Sprite);
        this.heroIcon1 = this.ctrlNode.getChildByName('1').getComponent(cc.Sprite);
        let hudIcon = this.hudNode.getChildByName('icon');
        this.hudLv = hudIcon.getChildByName('lv').getComponent(cc.Label);
        this.hudLv.string = 'LV' + HeroGlobal.instance.Level;
        this.heroName0 = hudIcon.getChildByName('name0').getComponent(cc.Label);
        this.heroName1 = hudIcon.getChildByName('name1').getComponent(cc.Label);
        this.heroIcon0.spriteFrame = TextureMgr.instance.heroIconGameSf[HeroGlobal.instance.MainHeroIndex];
        this.heroIcon1.spriteFrame = TextureMgr.instance.heroIconGameSf[HeroGlobal.instance.OtherHeroIndex];
        this.heroName0.string = HeroName[HeroGlobal.instance.MainHeroIndex];
        this.heroName1.string = HeroName[HeroGlobal.instance.OtherHeroIndex];

        this.pet = this.node.getChildByName('HeroRoot').getChildByName('pet');
        this.petSk = this.pet.getComponent(sp.Skeleton);

        this.directorNode = this.node.getChildByName('Director');
        this.directorNode.getComponent(Director).init();

        this.bgMgr = this.node.getChildByName('BgRoot').getComponent(BgMgr);
        this.bgMgr.init();

    }

    initSkillIcon(){
        this.ctrlNode = this.uiNode.getChildByName('Ctrl');

        this.skillHalo = this.ctrlNode.getChildByName('attack').getChildByName('halo');

        this.lifeLable = this.ctrlNode.getChildByName('skill4').getChildByName('life').getComponent(cc.Label);
        this.refreshLife();
        this.skillIconArrs = [];
        this.skillProgressArrs = [];
        this.skillTextArrs = [null];
        let arrs: string[] = ['skill0', 'skill1', 'skill2', 'skill3', 'jump', 'attack'];
        for (let i = 0; i < arrs.length; i++) {
            if(i < 4){
                this.skillProgressArrs.push(this.ctrlNode.getChildByName(arrs[i]).getComponent(SkillProgress));
                this.skillProgressArrs[i].init();
                if(i != 0)
                this.skillTextArrs.push(this.ctrlNode.getChildByName('t' + i).getComponent(cc.Label));
            }
            this.skillIconArrs.push(this.ctrlNode.getChildByName(arrs[i]).getComponent(cc.Sprite));
        }
        // this.ctrlNode.getChildByName('addhp').getComponent(cc.Sprite).spriteFrame = TextureMgr.instance.addHpSf;

        let skillp = this.ctrlNode.getChildByName('skill4').getComponent(SkillProgress);
        skillp.init();
        skillp.setSkill(4, 8, TextureMgr.instance.addHpSf);


    }

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        // cc.game.setFrameRate(20);
        Game.instance = this;
        this.init();
        this.setHeroSp();
        this.loadBgAsync(Global.getInstance().BgIndex);
        this.loadHeroSpArrs();
        this.onGameStart();
        // cc.sys.garbageCollect();
    }

    start() {
        // Main.instance.ReleaseMap();
        // Main.instance.ReleaseMenu();

        let uuidArrs: string[] = cc.loader.getDependsRecursively(this.heroSpArrs[0]);
        cc.log('uuids', uuidArrs);
    }

    resetCD(){
        for (let i = 0; i < this.skillProgressArrs.length; i++) {
            this.skillProgressArrs[i].resetCD();
            
        }
        this.ctrlNode.getChildByName('skill4').getComponent(SkillProgress).resetCD();
    }

    onGameStart() {
        Statistics.getInstance().reportStage(Global.getInstance().nowLevel, true, true);
        this.bossWarnOnce = false;
        this.gamePauseNode.active = false;
        this.gameEndNode.active = false;
        this.bossHp.active = false;
        this.monsterCount = 0;
        this.ttShareBtn.interactable = true;
        MonsterNodePool.instance.GCAll();
        if(RewardMgr.instance)
        RewardMgr.instance.GCAll();
        cc.director.emit('GameStart');
        Global.getInstance().inGame = true;
        this.resetCD();
        this.refreshLife();
        this.startDate = Date.now();
        this.setLevelTask();

        this.unscheduleAllCallbacks();
        Global.getInstance().MapLevelIndex = 0;
        

        
        // let mapdata = MapData[/*Global.getInstance().nowLevel - 1*/0];
        let mindex = Global.getInstance().nowLevel % 40 - 1;
        if(mindex == -1){
            mindex = 39;
        }
        let mapdata = MapData[mindex];
        
        this.mapdata = mapdata;
        this.getRewardItemArrs();

        Global.getInstance().MapLevelCount = this.mapdata.monster.length - 1;
        let mult: number = parseInt(mapdata.wave);
        this.mult = mult;
        this.multIndex = 0;

        // this.monsterCount = this.getMonsterCount(mapdata.monster[Global.getInstance().MapLevelIndex]) * mult;
        this.monsterTypeArrs = [];

            for (let j = 0; j < mapdata.monster[Global.getInstance().MapLevelIndex].length; j++) {
                let c = this.getMonsterNum(mapdata.monster[Global.getInstance().MapLevelIndex][j]);
                for (let k = 0; k < c; k++) {
                    this.monsterTypeArrs.push(mapdata.monster[Global.getInstance().MapLevelIndex][j]);
                }
            } 

        Global.getInstance().monsterCount = this.getMonsterCount(mapdata.monster[Global.getInstance().MapLevelIndex]) * mult;
        this.monsterCount += Global.getInstance().monsterCount;

        this.scheduleOnce(()=>{
            this.gen = this.generateMonster();
            this.createMonsterTime = 0;
            this.createMonsterIndex = -1;
        }, 5);

        // this.schedule(()=>{
            
        // }, 5, mult - 1, 5);

        this.scheduleOnce(()=>{
            cc.log('OnOpen');
            Director.instance.onOpen(Global.getInstance().nowLevel, 0);
            // Director.instance.onOpen(30, 2);
        }, 3.5)
        
        
        HeroGlobal.instance.onGameStart();
        this.heroScript.onGameStart();
        BgMgr.instance.onGameStart();
        // Global.getInstance().inGame = true;
        this.setMapProgress(0);

        // 加载Shortcut
        // if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO && Global.getInstance().nowLevel == 1){
        //     this.loadOVShortcut();
        // }
        this.loadOVShortcut();
        this.loadQQShortcut();

        if(TTAdMgr.instance){
            this.scheduleOnce(()=>{
                TTAdMgr.instance.startRecoder();
            }, 1);
            
        }
    }

    loadOVShortcut(){
        // 加载Shortcut
        if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO && Global.getInstance().nowLevel == 1){
            if(!this.node.getChildByName('Shortcut')){
                if(this.loadingShortcut){
                    return;
                }
                this.loadingShortcut = true;
                cc.loader.loadRes('OV/Shortcut',cc.Prefab,(err,prefab)=>{
                    this.loadingShortcut = false;
                    if(err) return;
                    let n: cc.Node = cc.instantiate(prefab);
                    n.parent = this.node;
                    // n.active = true;
                });
            }
        }
    }

    loadQQShortcut(){
        // 加载Shortcut
        if(getPlatform() == Platform.QQ && cc.sys.os == cc.sys.OS_ANDROID && Global.getInstance().nowLevel == 1){
            if(!this.node.getChildByName('Shortcut')){
                if(this.loadingShortcut){
                    return;
                }
                this.loadingShortcut = true;
                cc.loader.loadRes('OV/Shortcut',cc.Prefab,(err,prefab)=>{
                    this.loadingShortcut = false;
                    if(err) return;
                    let n: cc.Node = cc.instantiate(prefab);
                    n.parent = this.node;
                    // n.active = true;
                });
            }
        }
    }

    createNext() {

        Global.getInstance().MapLevelIndex++;
        this.setMapProgress(Global.getInstance().MapLevelIndex);
        BgMgr.instance.setMapByIndex(this.isHole);

        let mapdata = this.mapdata;
        let mult: number = mapdata.wave;
        this.mult = mult;
        this.multIndex = 0;

        this.monsterTypeArrs = [];
        // for (let i = 0; i < mapdata.monster.length; i++) {
            for (let j = 0; j < mapdata.monster[Global.getInstance().MapLevelIndex].length; j++) {
                let c = this.getMonsterNum(mapdata.monster[Global.getInstance().MapLevelIndex][j]);
                for (let k = 0; k < c; k++) {
                    this.monsterTypeArrs.push(mapdata.monster[Global.getInstance().MapLevelIndex][j]);
                }
            } 
        // }
        // cc.log('monstertype', this.monsterTypeArrs);

        Global.getInstance().monsterCount = this.getMonsterCount(mapdata.monster[Global.getInstance().MapLevelIndex]) * mult;
        this.monsterCount += Global.getInstance().monsterCount;

        this.scheduleOnce(()=>{
            this.gen = this.generateMonster();
            this.createMonsterTime = 0;
            this.createMonsterIndex = -1;
        }, 5);
        // this.schedule(()=>{
            
        // }, 5, mult - 1, 5);

        
        // this.gen.next();

        
        if (Global.getInstance().MapLevelIndex == Global.getInstance().MapLevelCount) {
            // if(this.isHole)
            if(Global.getInstance().MapLevelIndex == 2)
            Hero.instance.onExitHole();

            if(Global.getInstance().nowLevel % 5 == 0){

               
                
                this.showBossWarn();

                
            }else{
                this.scheduleOnce(()=>{
                    cc.log('OnOpen');
                    Director.instance.onOpen(Global.getInstance().nowLevel, Global.getInstance().MapLevelIndex);
                }, 2);
            }
        }else{
            this.scheduleOnce(()=>{
                cc.log('OnOpen');
                Director.instance.onOpen(Global.getInstance().nowLevel, Global.getInstance().MapLevelIndex);
            }, 2);
        }

        Global.getInstance().canMove = false;

        if (Global.getInstance().MapLevelIndex == Global.getInstance().MapLevelCount) {
            Global.getInstance().levelNext = false;
            Game.instance.nextArrow.active = false;
            Global.getInstance().canMove = true;
        } else
            Main.instance.heroCamera.runAction(cc.sequence(cc.moveBy(.3, cc.v2(cc.winSize.width * .25, 0)), cc.callFunc(() => {
                Global.getInstance().levelNext = false;
                Game.instance.nextArrow.active = false;
                Global.getInstance().canMove = true;

            })));
        // this.heroScript.midbg.runAction(cc.moveBy(.3,cc.v2(cc.winSize.width*.25,0)));

        // this.scheduleOnce(()=>{
        //     cc.log('OnOpen');
        //     Director.instance.onOpen(Global.getInstance().nowLevel, Global.getInstance().MapLevelIndex);
        // }, 2);
        
    }

    showBossWarn(){
        // boss来袭
        
        let bossWarn = this.hudNode.getChildByName('boss');
        bossWarn.active = true;
        let wordArrs = [];
        let animArrs: cc.Animation[] = [];
        for (let i = 0; i < 4; i++) {
            wordArrs.push(bossWarn.getChildByName('' + i));
            wordArrs[i].active = false;
            animArrs.push(wordArrs[i].getComponent(cc.Animation));
            animArrs[i].stop();
        }

        AudioMgr.instance.playAudio('BossWarn');
        wordArrs[0].active = true;
        animArrs[0].play();
        animArrs[0].on(cc.Animation.EventType.FINISHED, ()=>{
            // Global.getInstance().inGame = false;
            wordArrs[1].active = true;
            animArrs[1].play();
            animArrs[1].on(cc.Animation.EventType.FINISHED, ()=>{
                wordArrs[2].active = true;
                animArrs[2].play();
                animArrs[2].on(cc.Animation.EventType.FINISHED, ()=>{
                    wordArrs[3].active = true;
                    animArrs[3].play();
                    animArrs[3].on(cc.Animation.EventType.FINISHED, ()=>{

                        if(bossWarn.active){
                            bossWarn.active = false;
                            Global.getInstance().inGame = true;
    
                            // 出boss
                            Global.getInstance().monsterCount ++;
                            this.monsterCount ++;
                            let bossType = parseInt(this.mapdata.boss.toString().substr(2,2));
                            this.setBossHp(bossType);
                            this.bossHp.active = true;
                            MonsterNodePool.instance.create(1100 + bossType, cc.v2(/*this.hero.x +*/Main.instance.heroCamera.x + 2 * cc.winSize.width / 4, -192));
                        }
                        

                        // this.scheduleOnce(()=>{
                        //     cc.log('OnOpen');
                        //     Director.instance.onOpen(Global.getInstance().nowLevel, Global.getInstance().MapLevelIndex);
                        // }, 2);
                    });
                });
            });
        });
    }

    setBossHp(type: number){
        let names: string[] = ['夏侯惇', '曹操', '许褚'];
        let index = type - 97;
        this.bossName.string = names[index];
        this.bossIcon.spriteFrame = TextureMgr.instance.bossIconGameSf[index];
    }

    *generateMonster() {
        for (let i = 0; i < this.monsterTypeArrs.length; i++) {
            yield this.createMonster();
        }
    }

    createMonster() {
        // let monsterId = this.monsterTypeArrs[Math.floor(this.createMonsterTime / 20) - 1];
        let monsterId = this.monsterTypeArrs[this.createMonsterIndex];
        let type = this.getMonsterIndex(monsterId);
        let posY: number = -192;
        if (type == 7) posY = 160;
        // type = 8;
        let XArrs: number[] = [-400, 1000, 1600];
        let mi = Global.getInstance().MapLevelIndex;
        if(mi == 2) mi = 0;
        let rx: number = mi * Global.getInstance().MapSplitWidth + XArrs[Math.floor(Math.random() * 3)] -25 + Math.random() * 50;
        MonsterNodePool.instance.create(monsterId, cc.v2(rx, posY));
    }


    onEnd(win: boolean) {
        Global.getInstance().inGame = false;
        if (this.gameEndNode.active) {
            return;
        }
        if(TTAdMgr.instance){
            TTAdMgr.instance.stopRecoder();
        }
        this.gameEndNode.active = true;
        this.gameEndTask1.string = this.getTaskString(this.LevelArrs[0]);
        this.gameEndTask2.string = this.getTaskString(this.LevelArrs[1]);
        this.gameEndBg.active = win;
        this.gameEndBox.active = win;
        this.showGameEnd(win);

        Statistics.getInstance().reportStage(Global.getInstance().nowLevel, win);
    }

    showGameEnd(win: boolean) {
        this.gameEndWin.active = win;
        this.gameEndLose.active = !win;

        // if(Global.getInstance().nowLevel > 1){
        //     let interRate = win ? .4 : .8;
        //     if(Math.random() < interRate){
        //         if(AdMgr.instance){
        //             AdMgr.instance.showInterstitial();
        //         }
        //     }
        // }

        if(getPlatform() == Platform.OPPO || getPlatform() == Platform.VIVO){
            let rate = .8;
            if(win){
                if(getPlatform() == Platform.OPPO){
                    rate = OPPOAdMgr.instance.OPPOIntersitialRate;
                }else{
                    rate = VIVOAdMgr.instance.VIVOIntersitialRate;
                    console.log('插屏几率',rate);
                }
            }

            if(Math.random() < rate){
                if(AdMgr.instance){
                    // if(!this.onceNative){
                    //     AdMgr.instance.showNativeAd();
                    //     this.onceNative = true;
                    // }else{
                        AdMgr.instance.showInterstitial();
                    // }
                    
                }
            }
        }

        if(win && Global.getInstance().nowLevel == 1){
            if(DataMgr.instance.needCheckMark){
                if(getPlatform() == Platform.WX|| getPlatform() == Platform.QQ){
                    AdMgr.instance.showShortcut();
                }
            }
        }

        if((getPlatform() == Platform.QQ || getPlatform() == Platform.WX) && (Global.getInstance().nowLevel > 1)){
            // console.log('trueGameEnd', win);
            if(QQAdMgr.instance){
                if(win){
                    if(QQAdMgr.instance.winLimit > 0 && Math.random() < AdMgr.instance.getBoxGiftRate(win)){

                        QQAdMgr.instance.winLimit = parseInt(QQAdMgr.instance.winLimit) - 1;
                        // DataMgr.instance.saveLimitData();
                        BoxGift.instance.open();
                        
                        
                    }
                }else{
                    
                    if(QQAdMgr.instance.failLimit > 0 && Math.random() < AdMgr.instance.getBoxGiftRate(win)){

                        QQAdMgr.instance.failLimit = parseInt(QQAdMgr.instance.failLimit) - 1;
                        BoxGift.instance.open();
                        
                    }
                }
            }
            
        }
        

        if (win) {
            
            let b1: boolean = this.getLevelTaskBool(this.LevelArrs[0]);
            let b2: boolean = this.getLevelTaskBool(this.LevelArrs[1]);
            let star: number = 1;
            if (b1) star++;
            if (b2) star++;
            this.setEndStar(star);
            this.showTask(true, b1, b2);

            this.showRewardItem();

            let coins: number = getLevelCoins(Global.getInstance().nowLevel);
            let exp: number = getLevelExp(Global.getInstance().nowLevel);

            HeroGlobal.instance.setExp(HeroGlobal.instance.Exp + exp);
            HeroGlobal.instance.setCoins(HeroGlobal.instance.Coins + coins);
            HeroGlobal.instance.setLife(HeroGlobal.instance.Life + 1);
            //解锁
            if (Global.getInstance().nowLevel == HeroGlobal.instance.Unlock) {
                HeroGlobal.instance.Unlock++;
                HeroGlobal.instance.setUnlock(HeroGlobal.instance.Unlock);
            }

            // HeroGlobal.instance.saveHeroGlobal();

            

            HeroGlobal.instance.MonsterKillCount += this.monsterCount;
            Statistics.getInstance().reportRank(Statistics.RANKLIST.杀戮榜, HeroGlobal.instance.MonsterKillCount);

            DataMgr.instance.taskCountData[1] ++;
            DataMgr.instance.taskCountData[2] += this.monsterCount;

            HeroGlobal.instance.AchieveCountData[1] ++;
            HeroGlobal.instance.AchieveCountData[2] += this.monsterCount;
            
            DataMgr.instance.saveSaveDate();

            let p0: number = HeroGlobal.instance.getProgress(0);
            let p1: number = HeroGlobal.instance.getProgress(exp);
            let lvup: number = HeroGlobal.instance.Level - HeroGlobal.instance.getIndex(HeroGlobal.instance.Exp - exp, Exp);
            this.gameEndExp.string = HeroGlobal.instance.Exp + '/' + Exp[HeroGlobal.instance.Level - 1];
            this.showProgress(p1, p0, lvup);

            HeroGlobal.instance.Life += 5;
            HeroGlobal.instance.saveHeroGlobal();

        } else {
            AudioMgr.instance.playAudio(Hero.instance.failAudioArrs[HeroGlobal.instance.MainHeroIndex]);

            this.showProgress(HeroGlobal.instance.getProgress(0), HeroGlobal.instance.getProgress(0), 0);
            this.gameEndExp.string = HeroGlobal.instance.Exp + '/' + Exp[HeroGlobal.instance.Level - 1];
            this.setEndStar(0);
            this.showTask(false, false, false);
        }

    }

    getRewardItemArrs(){
        

        let soulArrs = this.mapdata.soul[Global.getInstance().gameDifficulty];
        let soulRateArrs = this.mapdata.soulrate[Global.getInstance().gameDifficulty];

        
        let arrs2 = [];

        for (let j = 0; j < soulArrs.length; j++) {
            if(Math.random() < soulRateArrs[i]){
                arrs2.push(soulRateArrs[i]);
            }
        }
        this.rewardSoulArrs = arrs2;
        
        // if(Global.getInstance().gameDifficulty != 0){
        //     arrs = [];
        // }

        if(!this.mapdata.item){
            this.rewardItmeArrs = [];
            return;
        }

        // 第一关重复领取
        if(Global.getInstance().nowLevel == 1 && HeroGlobal.instance.MapData[0][0] != 0){
            this.rewardItmeArrs = [];
            return;
        }

        let itemArrs = this.mapdata.item[Global.getInstance().gameDifficulty];
        let itemRateArrs = this.mapdata.itemrate[Global.getInstance().gameDifficulty];
        let arrs = [];
        if(itemArrs)
        for (let i = 0; i < itemArrs.length; i++) {
            if(Math.random() < itemRateArrs[i]){
                arrs.push(itemArrs[i]);
            }
        }

        this.rewardItmeArrs = arrs;
        
    }

    showRewardItem(){
        this.gameEndLayout.removeAllChildren();
        // if(!this.rewardItmeArrs){
        //     return;
        // }

        for (let i = 0; i < this.rewardItmeArrs.length; i++) {
            HeroGlobal.instance.pushEquipmentData(this.rewardItmeArrs[i] * 10000);
            RewardMgr.instance.createRewardEnd(this.rewardItmeArrs[i]);
        }
        if(this.rewardItmeArrs[0]){
            RewardAuto.instance.open(this.rewardItmeArrs[0]);
        }

        for (let j = 0; j < this.rewardSoulArrs.length; j++) {
            let ran = 1 + Math.floor(Math.random() * 8);
            HeroGlobal.instance.pushEquipmentData(this.rewardSoulArrs[j] + ran);
            RewardMgr.instance.createRewardEnd(this.rewardSoulArrs[j] + ran);
        }

    }

    showProgress(p1: number, p2: number, lvup: number) {
        cc.log(p1, p2, lvup);
        let progressbar: cc.ProgressBar = this.gameEndProgress;
        progressbar.progress = p1;
        let num: number = lvup;

        let dis: number = p2 + num - p1;
        let space: number = dis / 30;
        this.schedule(() => {
            let p: number = progressbar.progress + space;
            if (p > 1) {
                p = p - 1;
                this.gameEndLv.string = 'Lv' + HeroGlobal.instance.Level + '';
            }
            progressbar.progress = p;
        }, 0.03, 29);
    }

    showTask(b0: boolean, b1: boolean, b2: boolean) {
        this.gameEndBase.getChildByName('s' + 0).active = b0;
        this.gameEndBase.getChildByName('s' + 1).active = b1;
        this.gameEndBase.getChildByName('s' + 2).active = b2;
        // for (let i = 0; i < 3; i++) {
        //     this.gameEndBase.getChildByName('s' + i).active = false;
        // }
        // var ii = 0;
        // this.schedule(()=>{
        //     let star: cc.Node = this.gameEndBase.getChildByName('s' + ii);
        //     star.stopAllActions();
        //     star.scale = 1;
        //     star.active = true;
        //     star.runAction(cc.sequence(cc.scaleTo(.1,1.15),cc.scaleTo(.1,1)));
        //     ii ++;
        // }, .6, 2);
    }

    showReward(){
        // 装备掉落
        return;
        for (let i = 0; i < this.mapdata.rewardId.length; i++) {
            
            let rewardId: number = this.mapdata.rewardId[i];
            cc.log('rewardID',rewardId);
            if(Math.random() < this.mapdata.rewardRate[i]){
                RewardMgr.instance.createReward(rewardId, cc.v2(this.node.x + Math.random() * 50 -25, -190));
                //掉落的同时已经获取
                HeroGlobal.instance.pushEquipmentData(rewardId);
            }
        }
    }

    setMapProgress(p: number){
        switch (p) {
            case 0:
                this.mapP1[0].active = false;
                this.mapP1[1].active = false;        
                this.mapP2[0].active = false;
                this.mapP2[1].active = false;        
                break;
            case 1:
                this.mapP1[0].active = true;
                this.mapP1[1].active = true;        
                this.mapP2[0].active = false;
                this.mapP2[1].active = false;        
                break;
            case 2:
                this.mapP1[0].active = true;
                this.mapP1[1].active = true;        
                this.mapP2[0].active = true;
                this.mapP2[1].active = true;        
                break;
            default:
                break;
        }
    }

    setEndStar(n: number) {
        //通关星数存档
        let mapdata = HeroGlobal.instance.MapData[Global.getInstance().gameDifficulty][Global.getInstance().nowLevel - Global.getInstance().gameDifficulty * 40 - 1];
        if(n > mapdata){
            HeroGlobal.instance.MapData[Global.getInstance().gameDifficulty][Global.getInstance().nowLevel - Global.getInstance().gameDifficulty * 40 - 1] = n;
            HeroGlobal.instance.setMapData(HeroGlobal.instance.MapData);
            DataMgr.instance.taskCountData[3] += (n - mapdata);
            HeroGlobal.instance.AchieveCountData[3] += (n - mapdata);
        }

        // let count = 0;

        for (let i = 0; i < 3; i++) {
            this.gameEndBase.getChildByName(i + '').active = false;
            
        }

        // for (let k = 0; k < 3; k++) {
        //     for (let j = 0; j < HeroGlobal.instance.MapData[k].length; j++) {
        //         let num = HeroGlobal.instance.MapData[k][j];
        //         if(num != 0){
        //             count += num;
        //         }else{
        //             break;
        //         }
        //     }
        // }
        // HeroGlobal.instance.StarCount = count;
        // Statistics.getInstance().reportRank(Statistics.RANKLIST.通关榜, count);


        var ii = 0;
        this.schedule(() => {
            let star: cc.Node = this.gameEndBase.getChildByName(ii + '');
            star.stopAllActions();
            star.scale = 1;
            star.active = true;
            star.runAction(cc.sequence(cc.scaleTo(.1, 1.55), cc.scaleTo(.1, 1)));
            ii++;
        }, .6, n - 1);
    }

    setLevelTask() {
        this.LevelArrs = [Math.floor(Math.random() * 2), 2 + Math.floor(Math.random() * 2)];
        // this.LevelArrs = this.json.levelTask;
        this.LevelHelpSkill = false;
        this.LevelTime = Math.floor(Global.getInstance().MapSplitWidth * 3 / 100);
        // this.ComboCount = 10 + 3 * (Global.getInstance().nowLevel - 1);
        // 3 + 5 * (math.floor(mapLevel/4)) 
        this.ComboCount = 3 + 5 * Math.floor(Global.getInstance().nowLevel * .25);
    }

    getLevelTaskBool(index: number): boolean {
        let b1: boolean = false;
        switch (index) {
            case 0:
                b1 = (Date.now() - this.startDate - this.pauseDate) <= (this.LevelTime * 1000) ? true : false;
                break;
            case 1:
                b1 = !this.LevelHelpSkill ? true : false;
                break;
            case 2:
                b1 = this.maxCombo >= this.ComboCount ? true : false;
                break;
            case 3:
                b1 = Global.getInstance().HP > 80 ? true : false;
                break;
            default:
                break;
        }
        return b1;
    }

    getTaskString(index: number): string {
        let str: string = '';
        switch (index) {
            case 0:
                // str = 'Complete in ' + this.LevelTime + 'S';
                // str = this.heroScript.LevelTime + '秒内通关';
                str = AllText.Task1.replace('${time}', '' + this.LevelTime);
                break;
            case 1:
                // str = 'Do not use Buff Skills';
                // str = '不使用辅助技能';
                str = AllText.Task2;
                break;
            case 2:
                // str = 'Complete with' + this.ComboCount + 'Combo';
                // str = '连击达到' + this.ComboCount;
                str = AllText.Task3.replace('${combo}', '' + this.ComboCount);
                break;
            case 3:
                // str = 'Complete with HP above 80%';
                // str = '血量' + this.heroScript.LevelHP + '%通关';
                str = AllText.Task4.replace('${hp}', '' + 60);
                break;
            default:
                break;
        }
        return str;
    }


    async setHeroSp() {
        let skeleton = this.heroSk;
        this.setSkillIcon(HeroGlobal.instance.MainHeroIndex);
        // if (this.heroSpArrs[HeroGlobal.instance.MainHeroIndex]) {
        //     skeleton.skeletonData = this.heroSpArrs[HeroGlobal.instance.MainHeroIndex];
        //     skeleton.animation = 'stay';
        //     skeleton._updateSkeletonData();
        //     skeleton.setSkin('001');
        //     this.heroScript.initHeroData();
        // } else {
        //     cc.loader.loadRes(HeroSpName[HeroGlobal.instance.MainHeroIndex], sp.SkeletonData, (err, sp) => {
        //         if (err) {
        //             cc.log(err);
        //             return;
        //         }
        //         this.heroSpArrs[HeroGlobal.instance.MainHeroIndex] = sp;
        //         skeleton.skeletonData = this.heroSpArrs[HeroGlobal.instance.MainHeroIndex];
        //         skeleton.animation = 'stay';
        //         skeleton._updateSkeletonData();
        //         skeleton.setSkin('001');
        //         this.heroScript.initHeroData();
        //     })
        // }

        if (!this.heroSpArrs[HeroGlobal.instance.MainHeroIndex]) {
            await this.loadHeroSpArrs();
        }
        skeleton.skeletonData = this.heroSpArrs[HeroGlobal.instance.MainHeroIndex];
        skeleton.animation = 'stay';
        skeleton._updateSkeletonData();
        skeleton.setSkin('001');
        this.heroScript.initHeroData();
        
    }

    setSkillIcon(index: number){
        for (let i = 0; i < this.skillIconArrs.length; i++) {
            this.skillIconArrs[i].spriteFrame = TextureMgr.instance.skillArrs[index][i];
        }

        for (let j = 0; j < this.skillProgressArrs.length; j++) {
            let sf: cc.SpriteFrame = TextureMgr.instance.skillArrs[index][j];
            let skillJson = Skill[index * 7 + j];
            let heroData = HeroGlobal.instance.HeroDataArrs[index];
            let skillArrs = heroData.SkillArrs;

            let slv = skillArrs[j];
            if(slv == -1){
                slv = 0;
            }

            let cd = (parseFloat(skillJson.cd) - parseFloat(skillJson.cdup) * slv);
            if(HeroGlobal.instance.Level < parseInt(skillJson.unlock)){
                sf = TextureMgr.instance.lockSf;
                cd = -1;
                this.skillTextArrs[j].string = skillJson.unlock + '级解锁';
            }else{
                if(this.skillTextArrs[j])
                this.skillTextArrs[j].string = '';
            }
            this.skillProgressArrs[j].setSkill(j, cd, sf);
        }
        
    }

    onBtnExchange(event: cc.Event) {
        AudioMgr.instance.playAudio('BtnClick');
        let skeleton = this.hero.getComponent(sp.Skeleton);

        let index: number = parseInt(event.target.name);
        if (HeroGlobal.instance.MainHeroIndex != index && HeroFSM.instance.fsm.is('state_stand')) {
            HeroGlobal.instance.OtherHeroIndex = HeroGlobal.instance.MainHeroIndex;
            HeroGlobal.instance.MainHeroIndex = index;
            this.heroIcon0.spriteFrame = TextureMgr.instance.heroIconGameSf[HeroGlobal.instance.MainHeroIndex];
            this.heroIcon1.spriteFrame = TextureMgr.instance.heroIconGameSf[HeroGlobal.instance.OtherHeroIndex];
            this.heroName0.string = HeroName[HeroGlobal.instance.MainHeroIndex];
            this.heroName1.string = HeroName[HeroGlobal.instance.OtherHeroIndex];
            skeleton.skeletonData = this.heroSpArrs[index];
            skeleton.animation = 'stay';
            skeleton._updateSkeletonData();
            skeleton.setMaterial(0, this.flashMaterial);
            skeleton.setSkin('001');
            
            this.setSkillIcon(index);
            
            this.heroScript.initHeroData();
        }
    }

    // loadPetSp(index: number){
    //     return new Promise((resolve, reject)=>{
    //         cc.loader.loadRes(PetSpName[index], sp.SkeletonData, (err, sp)=>{
    //             if(err){
    //                 cc.log(err);
    //                 reject(err);
    //                 return;
    //             }

    //             this.heroSk.skeletonData = sp;
    //             this.heroSk.animation = 'stay';
    //             this.heroSk._updateSkeletonData();
    //             this.heroSk.setSkin('001');
    //             resolve(sp);
    //         })
    //     })
    // }

    async loadPet(index: number) {
        
        if(index < 0){
            return;
        }
        if(HeroGlobal.instance.PetLvArrs[index] > 0){
            let sp = await loadSpinePromise(PetSpName[index]);
            this.petSk.skeletonData = sp;
            this.petSk.animation = 'fly';
            this.petSk._updateSkeletonData();
            this.petSk.setSkin('default');
        }
        
    }

    // loadSpinePromise(path: string) {
    //     return new Promise((resolve, reject) => {
    //         cc.loader.loadRes(path, sp.SkeletonData, (err, sp) => {
    //             if (err) {
    //                 cc.log(err);
    //                 reject(err);
    //                 return;
    //             }
    //             resolve(sp);
    //         })
    //     })
    // }

    onBtnHome() {
        AudioMgr.instance.playAudio('BtnClick');
        Main.instance.loadMenu(() => {
            this.heroIcon0.spriteFrame = null;
            this.heroIcon1.spriteFrame = null;
            Main.instance.ReleaseGame();
        });

        if(TTAdMgr.instance){
            TTAdMgr.instance.stopRecoder();
        }
    }

    onBtnShareVideo() {
        if (TTAdMgr.instance) {
            TTAdMgr.instance.TTVideoShare();
        }
    }

    onBtnNextLevel() {
        AudioMgr.instance.playAudio('BtnClick');
        Main.instance.loadingNode.active = true;
        // Main.instance.loadMenu(() => {
        //     this.heroIcon0.spriteFrame = null;
        //     this.heroIcon1.spriteFrame = null;
        //     Main.instance.ReleaseGame();
        // });
        if(HeroGlobal.instance.Life < 5){
            //生命不足
            return;
        }
        HeroGlobal.instance.Life -= 5;
        HeroGlobal.instance.saveHeroGlobal();
        
        // let index = Math.floor((HeroGlobal.instance.Unlock - 40 * Global.getInstance().unlockDifficulty - 1) / 10);
        // Global.getInstance().nowLevel = HeroGlobal.instance.Unlock;
        if(Global.getInstance().nowLevel < 120){
            Global.getInstance().nowLevel ++;
        }

        Global.getInstance().gameDifficulty = Math.floor((Global.getInstance().nowLevel - 1) / 40);
        let index = Math.floor((Global.getInstance().nowLevel - 40 * Global.getInstance().gameDifficulty - 1) / 10);
        // Global.getInstance().nowLevel = HeroGlobal.instance.Unlock;

        if((getPlatform() == Platform.WX || getPlatform() == Platform.QQ) && Global.getInstance().nowLevel > 9){
            const loadTask4 = wx.loadSubpackage({
                name: 'sub3', // name 可以填 name 或者 root
                success: (res)=> {
                    this.loadBgAsync(index);
                    this.hudLv.string = 'LV' + HeroGlobal.instance.Level;
                    this.setSkillIcon(HeroGlobal.instance.MainHeroIndex);
                    this.onGameStart();
                },
                fail: function(res) {
                    // 分包加载失败通过 fail 回调
                }
                
            })
            loadTask4.onProgressUpdate(res => {
            })
        }else{
            this.loadBgAsync(index);
            this.hudLv.string = 'LV' + HeroGlobal.instance.Level;
            this.setSkillIcon(HeroGlobal.instance.MainHeroIndex);
            this.onGameStart();
        }
        

        

        
    }



    onBtnPause() {
        AudioMgr.instance.playAudio('BtnClick');
        Global.getInstance().inGame = false;
        if (this.gamePauseNode.active) {
            return;
        }

        this.gamePauseNode.active = true;
        this.gamePauseTask1.string = this.getTaskString(this.LevelArrs[0]);
        this.gamePauseTask2.string = this.getTaskString(this.LevelArrs[1]);
        this.pauseStartDate = Date.now();

        if(TTAdMgr.instance){
            TTAdMgr.instance.pauseRecoder();
        }
    }

    onBtnResume() {
        AudioMgr.instance.playAudio('BtnClick');
        this.gamePauseNode.active = false;
        Global.getInstance().inGame = true;

        if (this.pauseStartDate) {
            this.pauseDate += Date.now() - this.pauseStartDate;
            this.pauseStartDate = null;
        }
        if(TTAdMgr.instance){
            TTAdMgr.instance.resumeRecoder();
        }
    }

    onBtnRestart() {
        AudioMgr.instance.playAudio('BtnClick');
        if(TTAdMgr.instance){
            TTAdMgr.instance.stopRecoder();
        }
        this.onGameStart();
        this.gamePauseNode.active = false;
        Global.getInstance().inGame = true;
        
    }

    onBtnRevive() {
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            // 观看 复活 视频
            Statistics.getInstance().reportEvent('观看 复活 视频');
            Global.getInstance().inGame = false;
            AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST1.复活);
        }else{
            this.onRevive();
        }
        
    }

    onBtnReviveByVideo(){
        this.onBtnRevive();
        this.reviveNode.active = false;
    }

    onBtnReviveByJade(){
        let cost = Hero.instance.reviveCount == 1 ? 20 : 25;
        if(HeroGlobal.instance.Jade < cost){
            //仙玉不足
            Message.instance.showLack('jade');
            return;
        }
        HeroGlobal.instance.Jade -= cost;
        HeroGlobal.instance.saveHeroGlobal();
        this.onRevive();
        this.reviveNode.active = false;
    }

    onBtnReviveCancel(){
        AudioMgr.instance.playAudio('BtnClick');
        this.reviveNode.active = false;
        this.onEnd(false);
    }

    onRevive() {
        this.heroScript.revive();
        
        this.gameEndNode.active = false;
        // AudioMgr.instance.playAudio('game');
        Global.getInstance().inGame = true;
    }

    onBtnCreateMonster() {
        AudioMgr.instance.playAudio('BtnClick');
        this.onGameStart();
    }

    getGameTime(): number {
        //游戏时长
        return Date.now() - this.startDate - this.pauseDate;
    }

    ReleaseGame() {
        let uuidArrs: string[] = cc.loader.getDependsRecursively('Game');
        for (let i = 0; i < uuidArrs.length; i++) {
            cc.loader.release(uuidArrs[i]);
        }
    }

    async loadHeroSpArrs() {
        this.heroSpArrs = [null, null, null];
        for (let i = 0; i < 3; i++) {
            if(i == HeroGlobal.instance.MainHeroIndex)
            // this.loadHeroSp(HeroSpName[i], i);
            await this.loadGameHeroSp(i);
        }
    }

    loadHeroSp(name: string, i: number) {
        cc.loader.loadRes(name, sp.SkeletonData, (err, sp) => {
            if (err) {
                cc.log(err);
                return;
            }
            this.heroSpArrs[i] = sp;
        })
    }

    async loadGameHeroSp(index: number){
        if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
            await loadWXSubPromise('hero' + index);
        }
        let sp = await loadSpinePromise(HeroSpName[index]) as any;
        cc.log('sp', sp);
        this.heroSpArrs[index] = sp;
    }

    // loadBg(index: number){

    //     this.loadSpriteFrame('BG/bg' + index + '/定军山-路面')
    //     .then((sf: cc.SpriteFrame)=>{
    //         this.nearSf = sf;
    //         return this.loadSpriteFrame('BG/bg' + index + '/定军山-中景');
    //     }).then((sf: cc.SpriteFrame)=>{
    //         this.midSf = sf;
    //         return this.loadSpriteFrame('BG/bg' + index + '/定军山-背景');
    //     }).then((sf: cc.SpriteFrame)=>{
    //         this.farSf = sf;
    //         return this.loadSpriteFrame('BG/bg' + index + '/定军山-洞');
    //     }).then((sf: cc.SpriteFrame)=>{
    //         this.holeSf = sf;
    //         BgMgr.instance.setMapByIndex();
    //         // Main.instance.loadingNode.active = false;
    //         return this.loadSpriteFrame('BG/bg' + index + '/定军山山洞-地面');
    //     }).then((sf: cc.SpriteFrame)=>{
    //         this.holeNearSf = sf;
    //         return this.loadSpriteFrame('BG/bg' + index + '/定军山山洞-中景');
    //     }).then((sf: cc.SpriteFrame)=>{
    //         this.holeMidSf = sf;
    //         return this.loadSpriteFrame('BG/bg' + index + '/定军山山洞-背景');
    //     }).then((sf: cc.SpriteFrame)=>{
    //         this.holeFarSf = sf;
    //     })
    // }

    async loadBgAsync(index: number) {

        let head: string = 'BG/bg' + (index + 1);
        this.nearSf = await this.loadSpriteFrame(head + BgName[index][0]);
        this.midSf = await this.loadSpriteFrame(head + BgName[index][1]);
        this.farSf = await this.loadSpriteFrame(head + BgName[index][2]);
        this.holeSf = await this.loadSpriteFrame(head + BgName[index][3]);
        let mindex = Global.getInstance().nowLevel % 40 - 1;
        if(mindex == -1){
            mindex = 39;
        }
        let mapdata = MapData[mindex];

        // Main.instance.loadingNode.active = false;
        if(Gradient.instance.canClose){
            Gradient.instance.node.active = false;
            cc.director.emit('HeroShow');
        }else{
            Gradient.instance.canClose = true;
        }


        Global.getInstance().inGame = true;
        
        // this.isHole = mapdata.boxId == 0 ? false : true;
        this.isHole = false;
        this.isHole = mapdata.cave ? true : false;
        this.createBox();
        BgMgr.instance.setMapByIndex(this.isHole);
        this.holeNearSf = await this.loadSpriteFrame(head + BgName[index][4]);
        this.holeMidSf = await this.loadSpriteFrame(head + BgName[index][5]);
        this.holeFarSf = await this.loadSpriteFrame(head + BgName[index][6]);
        this.loadPet(HeroGlobal.instance.PetIndex);
    }

    createBox(){
        return;
        if(this.isHole){
            let h: cc.Node = cc.instantiate(this.boxPrefab);
            h.parent = this.rewardEventNode;
            h.position = cc.v2(2543, -191);
        }
    }

    loadSpriteFrame(name: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            // cc.log('StartPromise');
            cc.loader.loadRes(name, cc.SpriteFrame, (err, sf) => {
                if (err) {
                    // cc.log(err);
                    reject(err);
                    return;
                }
                cc.log(name + '加载完成');
                resolve(sf);
            });
        });

        return promise;

    }

    releaseHeroSp() {
        this.heroSk.skeletonData = null;
        for (let i = 0; i < this.heroSpArrs.length; i++) {
            let uuidArrs: string[] = cc.loader.getDependsRecursively(this.heroSpArrs[i]);
            for (let j = 0; j < uuidArrs.length; j++) {
                cc.loader.release(uuidArrs[j]);
            }
        }
    }

    getMonsterCount(arrs: number[]){
        let count: number = 0;
        for (let i = 0; i < arrs.length; i++) {
            count += this.getMonsterNum(arrs[i]);
        }
        return count;
    }

    getMonsterNum(id: number){
        return parseInt(id.toString().substr(0, 1));
    }

    getMonsterColor(id: number){
        return parseInt(id.toString().substr(1, 1));
    }

    getMonsterIndex(id: number){
        return parseInt(id.toString().substr(2, 2));
    }

    refreshLife(){
        this.lifeLable.string = HeroGlobal.instance.Life + '';
    }

    onDestroy(){
        AudioMgr.instance.stopBgm('game');
    }

    update(dt) {
        if (!Global.getInstance().inGame) return;

        // 使用帧数判定生成时间，在低帧率手机上会造成无法通关
        // if (this.gen) {
        //     this.createMonsterTime++;
        //     // cc.log(this.createMonsterTime);
        //     if(this.createMonsterTime % 20 == 0){
        //         if (this.gen.next().done) {
        //             this.gen = null;
        //         }
        //     }
        // }

        if (this.gen) {
            this.createMonsterTime += dt;
            if(this.createMonsterTime > 0.2){
                this.createMonsterTime = 0;
                this.createMonsterIndex ++;
                if (this.gen.next().done) {
                    this.gen = null;

                    this.multIndex ++;
                    if(this.multIndex < this.mult)
                    this.scheduleOnce(()=>{
                        this.gen = this.generateMonster();
                        this.createMonsterTime = 0;
                        this.createMonsterIndex = -1;
                    }, 5);
                    
                }

            }
        }


    }
}
