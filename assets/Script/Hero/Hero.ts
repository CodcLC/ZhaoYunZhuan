import HeroFSM from "./HeroFSM";
import Global from "../nativets/Global";
import Main from "../Main";
import AudioMgr from "../Audio";
import BulletMgr from "../BulletMgr";
import SkillMgr from "../SkillMgr";
import HeroGlobal from "./HeroGlobal";
import { HeroSkillName } from "../nativets/Config";
import Game from "../Game";
import LifeProgress from "../LifeProgress";
import HeroPet from "./HeroPet";
import BgMgr from "../BgMgr";
import ArrowRain from "../Map/ArrowRain";
import Monster from "../Monster/Monster";
import { getPlatform, Platform } from "../nativets/Platform";
const {ccclass, property} = cc._decorator;

const HERO_SCALEX: number = .70;
const HERO_Y: number = -200;
let GRAVITY: number = 4000;
const HERO_SPEED: number = 700;
const HERO_JUMP_SPEED: number = 1700;
@ccclass
export default class Hero extends cc.Component {

    static instance: Hero = null;
    speed: number = 400;
    HeroFSM: HeroFSM;

    ATK: number;
    DEF: number;
    CR: number;
    SP: number;
    LS: number;

    HP: number;

    ARP: number;  //固定穿
    BONUS: number;  //伤害百分比
    CD: number;     //所有技能减
    MISS: number; //闪避率

    canJump: boolean;
    jumping: boolean;
    speedY: number;
    NodeWidth: number = 160;

    //伤害判定
    dmg: number = 999;
    isCR: boolean = false;

    nextFlag: boolean = false;
    skillNameArrs: string[];
    hit: cc.Node;
    hitbody: cc.Node;
    lifeProgress: LifeProgress;
    hitbox: cc.BoxCollider;
    dmgNode: cc.Node;
    leftDistance: number;
    hitfinal: cc.Node;
    material: any;
    hitrotate: cc.Node;
    showAudioArrs: string[];
    failAudioArrs: string[];
    bloodAnim: cc.Animation;
    hurtSpace: number = 0;
    missNode: cc.Node;
    coinsNode: cc.Node;
    coinsLabel: cc.Label;
    reviveCount: number;
    arrowRain: cc.Node;
    arrowTime: number;
    checkPassSpace: number = 0;
    checkPassCount: number = 0;
    dmgLabel: cc.Label;
    bsNode: cc.Node;
    bsLabel: cc.Label;

    

    

    initInstance(){
        Hero.instance = this;
        this.node.getComponent(HeroFSM).initInstance();
    }

    init(){
        this.hit = this.node.getChildByName('hit');
        this.hitrotate = this.node.getChildByName('hitrotate');
        this.hitfinal = this.node.getChildByName('hitfinal');
        this.hitbody = this.node.getChildByName('hitbody');
        this.hitbox = this.hit.getComponent(cc.BoxCollider);
        this.lifeProgress = Game.instance.hudNode.getChildByName('icon').getChildByName('lifeProgress').getComponent(LifeProgress);
        this.dmgNode = this.node.getChildByName('dmg');
        this.dmgLabel = this.dmgNode.getComponent(cc.Label);
        this.bsNode = this.node.getChildByName('bs');
        this.bsLabel = this.bsNode.getComponent(cc.Label);
        this.missNode = this.node.getChildByName('miss');
        this.coinsNode = this.node.getChildByName('coins');
        this.coinsLabel = this.coinsNode.getComponent(cc.Label);
        this.missNode.active = false;
        this.material = this.node.getComponent(sp.Skeleton).getMaterial(0);
        this.showAudioArrs = [Global.getInstance().ZYAudio.出场, Global.getInstance().DCAudio.出场, Global.getInstance().DQAudio.出场];
        this.failAudioArrs = [Global.getInstance().ZYAudio.失败, Global.getInstance().DCAudio.失败, Global.getInstance().DQAudio.失败];
        this.bloodAnim = this.node.parent.getChildByName('blood').getComponent(cc.Animation);

        HeroFSM.instance.init();

        // cc.director.on('GameStart', this.onShow, this);
        cc.director.on('HeroShow', this.onShow, this);
    }

    reset(){
        this.checkPassSpace = 0;
        this.checkPassCount = 0;
        HeroFSM.instance.fsm.reset();
        this.node.x = -300;
        this.arrowTime = 5;
        Global.getInstance().deltaX = -300;
        this.node.y = HERO_Y;
        this.canJump = true;
        setTimeout(() => {
            this.node.x = 300;
        Global.getInstance().deltaX = 300;
            HeroFSM.instance.fsm.show(); 

            AudioMgr.instance.playAudio(this.showAudioArrs[HeroGlobal.instance.MainHeroIndex]);
        }, 500);
        this.initHeroData();
        
        this.reviveCount = 0;
    }

    onChangeHero(){
        
    }

    onGameStart(){
        this.reset();
        Global.getInstance().HP = this.HP;
        this.lifeProgress.setHP(100);
        // this.node.x = 300;

        this.scheduleOnce(()=>{
            if(HeroGlobal.instance.isGod){
                // if(false){
                this.HP = 500000;
                Global.getInstance().HP = this.HP;
                // this.ATK = 500000;
                // HeroGlobal.instance.MapData[0][29] = 0;
                HeroGlobal.instance.Unlock = 30;
            }
        }, 1);

        if(Global.getInstance().preBuff){
            this.scheduleOnce(()=>{
                
                this.ATK *= 1.25;
                Global.getInstance().preBuff = false;
            }, 1);
        }
        
        
        Global.getInstance().deltaX = 300;
        this.leftDistance = 0;
    }

    onExitHole(){
        this.node.x = 300;
        BgMgr.instance.reset();
        HeroPet.instance.node.x = 130;
        Global.getInstance().deltaX = 300;
        this.leftDistance = 300;
    }

    initHeroData(){
        let heroData = HeroGlobal.instance.getMainHeroData();
        heroData.updateAttribute();
        cc.director.emit('RefreshSp', HeroGlobal.instance.MainHeroIndex);
        this.ATK = heroData.ATK;
        this.DEF = heroData.DEF;
        this.SP = heroData.SP;
        this.CR = heroData.CR;
        this.LS = heroData.LS;
        this.MISS = heroData.MISS;
        this.HP = heroData.HP;
    
        Global.getInstance().HP = this.HP;
        this.lifeProgress.setHP(100);
        
        this.skillNameArrs = HeroSkillName[HeroGlobal.instance.MainHeroIndex];

        this.setHitBox();
        // cc.log('material', this.material);
    }

    buff(){
        this.ATK *= 1 + Hero.instance.reviveCount * .2;
        this.DEF *= 1 + Hero.instance.reviveCount * .15;
    }

    //出场动画
    onShow(){
        if(!this.node){
            return;
        }
        this.node.x = 300;
        Global.getInstance().deltaX = 300;
        HeroFSM.instance.fsm.show();
        
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {
        // this.init();
    }

    onBS(hp: number,double: boolean){

        let n: number = hp * this.LS * 0.01 * (double? 2:1);
        this.showBS(n);
        n = n * 100 / this.HP;
        //百分比
        this.onAddHp(n);
    }
    
    showBS(hp: number,forgive?: boolean){
        // return
        hp = Math.ceil(hp);
        if(hp == 0)return;
        let damageNode: cc.Node = this.bsNode;
        let dY: number = 250;
        let tY: number = 50;
          
        damageNode.stopAllActions();

        this.bsLabel.string = '+' + hp + '';
        damageNode.active = true;

        damageNode.position = cc.v2(0,dY);
        damageNode.runAction(cc.sequence(cc.moveBy(.3,cc.v2(0,tY)),cc.delayTime(.3),cc.callFunc(()=>{
            damageNode.active = false;
        })));
        
    }

    showCoins(coins: number){
        this.coinsLabel.string = '金+' + coins;
        this.coinsNode.stopAllActions();
        this.coinsNode.y = 220;
        this.coinsNode.active = true;
        var act1 = cc.moveBy(.3,cc.v2(0,70 /*+ Math.random() * 40*/));
        var act2 = cc.sequence(cc.scaleTo(.1,1.2),cc.delayTime(0.3),cc.scaleTo(.1,0));
        var act3 = cc.spawn(act1,act2);
        this.coinsNode.runAction(cc.sequence(act3,cc.delayTime(0),cc.callFunc(()=>{
        this.coinsNode.active = false;
        })));
    }

    showDmg(hp: number){
        //实际数值
        hp = Math.ceil(hp);
        if(hp == 0)return;
        let damageNode: cc.Node = this.dmgNode;
        let dY: number = 250;
        let tY: number = 50;
          
        damageNode.stopAllActions();
        // damageNode.color = cc.color(177,177,177);

        this.dmgLabel.string = '-' + hp + '';
        damageNode.active = true;
        damageNode.position = cc.v2(0,dY);
        // if(isCR){
        //     damageNode.runAction(cc.sequence(cc.moveBy(.2,cc.v2(0,30)),cc.delayTime(.5),cc.callFunc(()=>{
        //         damageNode.active = false;
        //     })));
        // }else{
            damageNode.runAction(cc.sequence(cc.moveBy(.3,cc.v2(0,tY)),cc.delayTime(.3),cc.callFunc(()=>{
                damageNode.active = false;
            })));
        // }
    }

    onBtnAttack(){
        if(!Global.getInstance().inGame) return;
        // AudioMgr.instance.playAudio('BtnClick');
        if(HeroFSM.instance.fsm.can('attack')){
            if(!Global.getInstance().comboFlag){
                HeroFSM.instance.fsm.attack();
            }
        }
    }

    attack(){
        if(HeroGlobal.instance.MainHeroIndex == 0){
            this.hit.active = true;
            this.scheduleOnce(()=>{
                this.hit.active = false;
            });
        }else if(HeroGlobal.instance.MainHeroIndex == 1){
            let dir: number = this.node.scaleX > 0 ? 1 : -1;
            let posX: number = this.node.x + dir * 50;
            let posY: number = this.node.y + 85;
            BulletMgr.instance.create(0, cc.v2(posX, posY), dir);
            AudioMgr.instance.playAudio(Global.getInstance().DCAudio.箭);
        }else{
            // this.hit.active = true;
            // this.scheduleOnce(()=>{
            //     this.hit.active = false;
            // });
        }
        
    }

    attackFinal(){
        if(HeroGlobal.instance.MainHeroIndex == 0){
            this.schedule(()=>{
                this.hit.active = true;
                this.scheduleOnce(()=>{
                    this.hit.active = false;
                });
            }, .2, 2);
        }else if(HeroGlobal.instance.MainHeroIndex == 1){
            SkillMgr.instance.create('attack_e');
            AudioMgr.instance.playAudio(Global.getInstance().DCAudio.三段);
        }else{
            // this.scheduleOnce(()=>{
            //     this.hit.active = true;
            //     this.scheduleOnce(()=>{
            //         this.hit.active = false;
            //     });
            // }, .3);
        }
    }

    attackZYFinal(){
        this.hitfinal.active = true;
        this.scheduleOnce(()=>{
            this.hitfinal.active = false;
        });
    }

    attackRotate(){
        this.hitrotate.active = true;
        this.scheduleOnce(()=>{
            this.hitrotate.active = false;
        });
    }

    showMiss(){
        this.missNode.stopAllActions();
        this.missNode.y = 220;
        this.missNode.active = true;
        var act1 = cc.moveBy(.3,cc.v2(0,70 /*+ Math.random() * 40*/));
        var act2 = cc.sequence(cc.scaleTo(.1,1.2),cc.delayTime(0.3),cc.scaleTo(.1,0));
        var act3 = cc.spawn(act1,act2);
        this.missNode.runAction(cc.sequence(act3,cc.delayTime(0),cc.callFunc(()=>{
        this.missNode.active = false;
        })));
    }

    onHit(dmg: number){
        
        if(Math.random() * 100 < this.MISS){
            //闪避
            this.showMiss();
            // cc.log('Miss',this.MISS);
            return;
        }

        let d: number = dmg * (1 - (this.DEF / (this.DEF + 2500)));
        
        this.showDmg(d);
        // cc.log('hit', dmg, d, this.DEF, this.HP, Global.getInstance().HP);
        let precent: number = d * 100 / this.HP;
        // let precent: number = d * Global.getInstance().HP / this.HP;
        this.lifeProgress.damage(precent);
        Global.getInstance().HP -= d;
        // cc.log(Global.getInstance().HP);
        if(Global.getInstance().HP <= 0){
            if(HeroFSM.instance.fsm.can('hit')){
                HeroFSM.instance.fsm.hit();
            }
            this.dead();
        }
        if(Math.random() < 1){
            let arrs: string[] = ['ZY', 'DC', 'DQ'];
            let str: string = arrs[HeroGlobal.instance.MainHeroIndex] + 'hurt' + Math.floor(Math.random() * 3);
            if(this.hurtSpace == 0){
                this.hurtSpace = 1.5;
                // cc.log('strrrrrrr',str);
                AudioMgr.instance.playAudio(str);
            }
            // AudioMgr.instance.playAudio(str);
            

            this.material.effect.setProperty('isFlash', 1.1);
            if(CC_NATIVERENDERER)
            HeroFSM.instance.sk.setMaterial(0, HeroFSM.instance.sk.getMaterial(0));
            this.scheduleOnce(()=>{
                this.material.effect.setProperty('isFlash', 0.5);
                if(CC_NATIVERENDERER)
                HeroFSM.instance.sk.setMaterial(0, HeroFSM.instance.sk.getMaterial(0));
            },.15);
        }
        
    }



    // hit(dmg: number){
    //     if(this.HeroFSM.fsm.can('hit')){
    //         this.HeroFSM.fsm.hit();
            
    //         let d: number = dmg * (100 - this.DEF) / 100;
    //         this.showDmg(d);
    //         this.HPNode.getComponent(LifeProgress).damage(d * 100 / this.HP);
    //         cc.sun.HP -= d * 100 / this.HP;
    //         // cc.log(cc.sun.HP,this.HPNode.getComponent(LifeProgress).bar2.progress);
    //         if(cc.sun.HP <= 0){
    //             // cc.sun.mainjs.onEnd();
    //             this.dead();
    //             // this.afterDead();
    //         }
    //     }
    // }

    // hitInHyperArmor(dmg: number){
    //     let d: number = dmg * (100 - this.DEF) / 100;
    //     this.showDmg(d);
    //     this.HPNode.getComponent(LifeProgress).damage(d * 100 / this.HP);
    //     cc.sun.HP -= d * 100 / this.HP;
    //     // cc.log(cc.sun.HP,this.HPNode.getComponent(LifeProgress).bar2.progress);
    //     if(cc.sun.HP <= 0){
    //         // cc.sun.mainjs.onEnd();
    //         if(this.HeroFSM.fsm.can('hit')){
    //             this.HeroFSM.fsm.hit();
    //             // cc.log('hitinhyperArmor');
    //             this.dead();
    //         }
    //     }
    // }

    dead(){
        if(HeroFSM.instance.fsm.can('dead')){
            HeroFSM.instance.fsm.dead();
        }
    }

    afterDead(){
        if(this.reviveCount == 2){
            Game.instance.onEnd(false);
        }else{
            Game.instance.reviveNode.active = true;
            Global.getInstance().inGame = false;
            this.reviveCount ++;
            Game.instance.reviveLabel.string = 'x ' + (this.reviveCount == 1 ? 20 : 25);
        }
        
    }

    

    revive(){
        Global.getInstance().HP = 100;
        this.buff();
        this.lifeProgress.setHP(60);
        HeroFSM.instance.fsm.show();
    }

    onBtnJump(){
        // AudioMgr.instance.playAudio('BtnClick');
        if(this.canJump && HeroFSM.instance.fsm.can('jump')){
            HeroFSM.instance.fsm.jump();
            
            this.speedY = HERO_JUMP_SPEED;
            this.jumping = true;
            this.canJump = false;
        }
    }

    onBtnFlash(){
        AudioMgr.instance.playAudio('BtnClick');
        if(HeroFSM.instance.fsm.can('flash')){
            HeroFSM.instance.fsm.flash();
        }
    }

    onBtnSkill1(){
        this.onSkill(0);
    }

    onBtnSkill2(){
        this.onSkill(1);
    }

    onBtnSkill3(){
        this.onSkill(2);
    }

    onBtnSkill4(){
        this.onSkill(3);
    }



    onBtnSkillAddHp(){
        AudioMgr.instance.playAudio('addHp');
        if(HeroGlobal.instance.Life < 1){
            //生命不足
            return;
        }
        HeroGlobal.instance.Life -= 1;
        HeroGlobal.instance.saveHeroGlobal();
        Game.instance.refreshLife();
        this.onAddHp(40);
    }

    onAddHp(hp: number){
        this.lifeProgress.addHP(hp);
        // hp = hp / 100 * this.HP;
        // this.showBS(hp,true);
    }

    onSkill(index: number){
        if(index == 4){
            this.onBtnSkillAddHp();
            return
        }
        if(this.node.y > HERO_Y){
            // 空中不能技能
            return;
        }
        let sname: string = this.skillNameArrs[index];
        if(sname == 'skill_shunyi+gongji' || sname == 'skill_shunyi' /*|| sname == 'skill_pd'*/){
            if(!HeroFSM.instance.fsm.can('flash')){
                return;
            }
            HeroFSM.instance.fsm.flash();
        }else{
            if(!HeroFSM.instance.fsm.can('skill')){
                return;
            }
            HeroFSM.instance.fsm.skill();
        }

        HeroFSM.instance.sk.setAnimation(0, sname, false);
        switch (sname) {
            case 'skill_guangbo':
                SkillMgr.instance.create(sname);
                this.scheduleOnce(()=>{
                    if(HeroFSM.instance.fsm.can('flash')){
                        HeroFSM.instance.fsm.flash();
                    }
                }, .8);
                break;
            case 'skill_duochongjian':
                SkillMgr.instance.create(sname);
                break;

            case 'skill_leidian':
                AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.大招);
                SkillMgr.instance.create(sname);
                break;
            case 'skill_leidongjiutian':
            case 'skill_shunyi':
            case 'skill_pd':
                SkillMgr.instance.create(sname);
                break;

            case 'skill_dipotianxing':
                this.scheduleOnce(()=>{
                    if(HeroFSM.instance.fsm.can('flash')){
                        HeroFSM.instance.fsm.flash();
                    }
                }, 2.2);
                AudioMgr.instance.playAudio(Global.getInstance().DQAudio.大招);
                SkillMgr.instance.create(sname);
                break;
            case 'skill_heidong':
            case 'skill_liuxingyu':
            case 'skill_yanlouzhan':
                SkillMgr.instance.create(sname);
                break;
            case 'skill_jianyu':
                AudioMgr.instance.playAudio(Global.getInstance().DCAudio.大招);
                break;
            default:
                break;
        }
        
    }

    setHitBox(){
        let hitRange: number = 0;
        if(HeroGlobal.instance.MainHeroIndex == 0){
            hitRange = 370;
        }else if(HeroGlobal.instance.MainHeroIndex == 2){
            hitRange = 750;
        }
        this.hitbox.size = new cc.Size(hitRange, 40);
        this.hitbox.offset = cc.v2(hitRange / 2, 0);
    }

    //头上的数值正反问题
    resetNumber(){
        let dmg: cc.Node = this.dmgNode;
        let miss: cc.Node = this.missNode;
        let coins: cc.Node = this.coinsNode;
        let bs: cc.Node = this.bsNode;
        // let lr: cc.Node = this.node.getChildByName('LR');
        let arrs: cc.Node[] = [dmg,bs,/*lr*/miss, coins];
        for (let i = 0; i < arrs.length; i++) {
            if(arrs[i].active){
                if(this.node.scaleX > 0){
                    arrs[i].scaleX = 1;
                }else{
                    arrs[i].scaleX = -1;
                }
            }
            
        }
    }

    //受伤声音间隔
    dealHurtSpace(dt: number){
        this.hurtSpace -= dt;
        if(this.hurtSpace <= 0){
            // cc.log('============0');
            this.hurtSpace = 0;
        }
    }

    arrowRainUpdate(dt){
        if(Global.getInstance().nowLevel == 1){
            return;
        }
        // this.arrowTime = 5;
        this.arrowTime -= dt;

        let rate = 0.15;
        if(Global.getInstance().nowLevel >= 15 && Global.getInstance().nowLevel <= 40){
            rate = 0.25;
        }
        if(Global.getInstance().nowLevel > 40){
            rate = 0.35;
        }
        if(this.arrowTime <= 0){
            if(Math.random() < rate){
                ArrowRain.instance.use()
            }
            this.arrowTime = 3 + Math.random() * 2;
        }
    }

    checkPass(dt: number){
        this.checkPassSpace ++;
        // 2s判定一次
        if(Global.getInstance().monsterCount > 0 && this.checkPassSpace > 120){
            this.checkPassSpace = 0;
            // if(!Game.instance.gameEventNode.getChildByName('monster') && !Game.instance.gameEventNode.getChildByName('boss')){
            if(!Game.instance.gameEventNode.getComponentInChildren(Monster)){
                this.checkPassCount ++;
                cc.log('PassCount',this.checkPassCount);
                if(this.checkPassCount == 8){
                    Game.instance.onEnd(true);
                }
            }else{
                this.checkPassCount = 0;
            }
        }


    }

    update (dt) {
        if(!Global.getInstance().inGame){

            return;
        } 
        this.checkPass(dt);
        this.dealHurtSpace(dt);
        this.arrowRainUpdate(dt);

        //攻击转向
        if(!HeroFSM.instance.fsm.is('state_jumpattack')){
            if(!HeroFSM.instance.fsm.is('state_flash'))
            if(!HeroFSM.instance.fsm.is('state_skill'))
            switch (Global.getInstance().MoveState) {
                case Global.getInstance().STATE.LEFT:
                        this.node.scaleX = -HERO_SCALEX;
                    break;
                case Global.getInstance().STATE.RIGHT:
                        this.node.scaleX = HERO_SCALEX;
                    break;
                default:
                    break;
            }
        }
        this.resetNumber();

        //跳跃
        if(this.jumping){
            // this.speedY -= dt * GRAVITY;
            this.speedY -= dt * Global.getInstance().gravity;
            this.node.y += this.speedY * dt;
            Main.instance.heroCamera.y += this.speedY * dt * .12;
            if(this.node.y < HERO_Y){
                this.node.y = HERO_Y;
                Main.instance.heroCamera.y = 0;
                this.jumping = false;
                this.canJump = true;
                if(HeroFSM.instance.fsm.can('stop')){
                    if(!HeroFSM.instance.isWin())
                    HeroFSM.instance.fsm.stop();
                }
            }
        }

        if(HeroFSM.instance.fsm.is('state_flash')){
            if(HeroFSM.instance.sk.animation == 'skill_guangbo' || HeroFSM.instance.sk.animation == 'skill_dipotianxing'){
                let sf = Math.floor(this.speed * .3 * dt * 100) / 100;
                if(this.node.scaleX < 0){
                    this.node.x += sf;
                    Global.getInstance().deltaX += sf;
                }else if(this.node.scaleX >= 0){
                    this.node.x += -sf;
                    Global.getInstance().deltaX += -sf;
                }
            }else{
                let sf = Math.floor(this.speed * 3 * dt * 100) / 100;
                if(this.node.scaleX < 0){
                    this.node.x += -sf;
                    Global.getInstance().deltaX += -sf;
                }else if(this.node.scaleX >= 0){
                    this.node.x += sf;
                    Global.getInstance().deltaX += sf;
                }
            }
        }
        else if(HeroFSM.instance.fsm.is('state_jumpattack')){
            
            let sf = Math.floor(this.speed * dt * 2 * 100) / 100;
            if(HeroGlobal.instance.MainHeroIndex > 0){
                sf *= 0.3;
            }
            // cc.log('state_jumpattack', sf, this.node.scaleX, HERO_SCALEX);
            if(this.node.scaleX < 0){
                this.node.x += -sf;
                Global.getInstance().deltaX += -sf;
            }else if(this.node.scaleX >= 0){
                this.node.x += sf;
                Global.getInstance().deltaX += sf;
            }
        }else{
            //左右移动
            if(Global.getInstance().canMove){
                switch (Global.getInstance().MoveState) {
                    case Global.getInstance().STATE.LEFT:
                        if(HeroFSM.instance.fsm.is('state_move') || HeroFSM.instance.fsm.is('state_jump')){
                            let s = Math.floor(this.SP * dt * 100) / 100;
                            this.node.x += -s;
                            this.node.scaleX = -HERO_SCALEX;
                            // cc.log('state_move', this.node.scaleX, HERO_SCALEX);
                            Global.getInstance().deltaX += -s;
                        }
                        
                        if(HeroFSM.instance.fsm.can('move')){
                            HeroFSM.instance.fsm.move();
                        }else{
                            // return;
                        }
                        
                        break;
                    case Global.getInstance().STATE.RIGHT:
                        if(HeroFSM.instance.fsm.is('state_move')|| HeroFSM.instance.fsm.is('state_jump')){
                            let s1 = Math.floor(this.SP * dt * 100) / 100;
                            this.node.x += s1;
                            this.node.scaleX = HERO_SCALEX;
                            Global.getInstance().deltaX += s1;
                        }
                        
                        if(HeroFSM.instance.fsm.can('move')){
                            HeroFSM.instance.fsm.move();
                        }else{
                            // return;
                        }
                        break;
                    case Global.getInstance().STATE.STOP:
                        if(HeroFSM.instance.fsm.is('state_move')){
                            HeroFSM.instance.fsm.stop();
                        }
                        return;
                        break;
                    default:
                        break;
                }
            }
        }
        
        
        Global.getInstance().canScrollLeft = false;
        Global.getInstance().canScrollRight = false;

        let heroCamera = cc.find('Canvas').getChildByName('heroCamera');
        let pos = cc.v2(0,0);
        heroCamera.getComponent(cc.Camera).getWorldToScreenPoint(this.node.position, pos);
        if(Global.getInstance().canMove){
            if(Global.getInstance().MapLevelIndex != 2 && pos.x > cc.winSize.width * .75 && Global.getInstance().deltaX < Global.getInstance().MapSplitWidth * (Global.getInstance().MapLevelIndex + 1) - cc.winSize.width * .25){
                // cc.log('右边相机移动人不动');
                heroCamera.x = this.node.x - cc.winSize.width * .75;
                // this.midbg.x = heroCamera.x + cc.winSize.width * .5;
                Global.getInstance().canScrollRight = true;
            }
            if(Global.getInstance().MapLevelIndex == 2 && pos.x > cc.winSize.width * .75 && Global.getInstance().deltaX < Global.getInstance().MapSplitWidth - cc.winSize.width * .25){
                // cc.log('右边第三段移动');
                heroCamera.x = this.node.x - cc.winSize.width * .75;
                // this.midbg.x = heroCamera.x + cc.winSize.width * .5;
                Global.getInstance().canScrollRight = true;
            }
        }
        
        // if(Global.getInstance().MapLevelIndex > 0){
        if(Global.getInstance().MapLevelIndex == 1){
                if(pos.x < cc.winSize.width * .25 && Global.getInstance().deltaX > Global.getInstance().MapSplitWidth * (Global.getInstance().MapLevelIndex) - cc.winSize.width * .5){
                    heroCamera.x = this.node.x - cc.winSize.width * .25;
                    // this.midbg.x = heroCamera.x + cc.winSize.width * .5;
                    Global.getInstance().canScrollLeft = true;
                }

                // if(pos.x < cc.winSize.width * .25 && Global.getInstance().deltaX >)
        }else{
            // 第一段回来在坐标1/4处
            if(pos.x < cc.winSize.width * .25 && Global.getInstance().deltaX > cc.winSize.width * .25){
                    heroCamera.x = this.node.x - cc.winSize.width * .25;
                    // this.midbg.x = heroCamera.x + cc.winSize.width * .5;
                    Global.getInstance().canScrollLeft = true;
                }
        }

        //人物始终在摄像机内
        let halfWidth = this.NodeWidth * Math.abs(this.node.scaleX) / 2;
        if(Global.getInstance().deltaX < halfWidth + this.leftDistance){
            this.node.x = halfWidth + this.leftDistance;
            Global.getInstance().deltaX = halfWidth + this.leftDistance;
        }

        if(Global.getInstance().MapLevelIndex > 0 && Global.getInstance().MapLevelIndex < 2){
            
            if(Global.getInstance().deltaX < Global.getInstance().MapSplitWidth * Global.getInstance().MapLevelIndex - cc.winSize.width * .75 + halfWidth){
                // cc.log('边界左');
                this.node.x = Global.getInstance().MapSplitWidth * Global.getInstance().MapLevelIndex - cc.winSize.width * .75 + halfWidth
                Global.getInstance().deltaX = Global.getInstance().MapSplitWidth * Global.getInstance().MapLevelIndex - cc.winSize.width * .75 + halfWidth
            }
        }

        if(Global.getInstance().MapLevelIndex == 2){
            if(Global.getInstance().deltaX > Global.getInstance().MapSplitWidth - halfWidth){
                // cc.log('右边第三段边界');
                this.node.x = Global.getInstance().MapSplitWidth - halfWidth;
                Global.getInstance().deltaX = Global.getInstance().MapSplitWidth - halfWidth;
            }
        }else{
            if(Global.getInstance().deltaX > Global.getInstance().MapSplitWidth * (Global.getInstance().MapLevelIndex + 1) - halfWidth){
                // cc.log('边界');
                if(Global.getInstance().levelNext){
                    Game.instance.createNext();
                    
                }else{
                    this.node.x = Global.getInstance().MapSplitWidth * (Global.getInstance().MapLevelIndex + 1) - halfWidth;
                    Global.getInstance().deltaX = Global.getInstance().MapSplitWidth * (Global.getInstance().MapLevelIndex + 1) - halfWidth;
                }
                
            }
        }
    }

    onEnable(){
        // this.onShow();
    }
    
    onDestroy(){
        // cc.director.off('GameStart', this.onShow, this);
        cc.director.off('HeroShow', this.onShow, this);
    }
}
