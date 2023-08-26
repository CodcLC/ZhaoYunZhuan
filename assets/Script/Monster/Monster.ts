import MonsterNodePool from "./MonsterNodePool";
import MonsterFSM from "./MonsterFSM";
import Hero from "../Hero/Hero";
import Global from "../nativets/Global";
import BulletMgr from "../BulletMgr";
import Game from "../Game";
import HeroFSM from "../Hero/HeroFSM";
import LifeProgress from "../LifeProgress";
import RewardMgr from "../Reward/RewardMgr";
import Director from "../Director";
import Main from "../Main";
import AudioMgr from "../Audio";
import { MonsterArmor, MonsterHP, MonsterATK } from "../nativets/Config";
import BizarreAdventure from "../BizarreAdventure/BizarreAdventure";
import BossShow from "./BossShow";

const {ccclass, property} = cc._decorator;
const MONSTER_SCALEX: number = 0.4;
const LANCER_SCALEX: number = 0.6;
const BOSS_SCALEX: number = -1.2;
const BERSERKER_SCALEX: number = -1;
const ELEPHANT_SCALEX: number = -1;
const FANGSHU_SCALEX: number = -1;
const EAGLE_SCALEX: number = -.3;
const DMG_SCALE: number = 1.6;
const DRAGON_SCALEX: number = .8;
const BODYWIDTH: number = 200;
// const SKARRS: string[] = ['刀_', '枪_', '弓箭_', '弓箭_'];
const SKARRS: string[] = ['sword_', 'spear_', 'bow_', 'bow_'];
//从0开始依次 刀 枪 箭塔弓 弓 狂战近战 狂战远程 象 鹰 方术士
// 第一位皮肤1-3 第二三位种类 
// 如 101代表默认皮肤的刀兵
// const SKINNAMES: string[] = ['02_黄头巾','01' , '03_高级'];
const SKINNAMES: string[] = ['02_huangtoujin','01' , '03_gaojixiaobing'];
const FSSKINNAMES: string[] = ['001_冰', '002_火'];
const BKSKINNAMES: string[] = ['001_近战', '001_远攻'];
@ccclass
export default class Monster extends cc.Component {

    @property(cc.String)
    skstr: string = '刀_';

    attackRange:number = 100;
    move:number = 0;
    speed:number = 300;
    count:number = 0;
    attackSpace: number = 0;
    attackSpaceCount: number = 0;
    eyeRange: number;
    AiActive: boolean = false;
    HP: number;
    nextFlag: boolean;
    hitspace: number;
    type: number;
    standTime: number = 0;
    MonsterFSM: MonsterFSM;
    isBoss: boolean = false;
    BASE_SCALEX: number;
    bodyWidth: number;
    body: cc.Node;
    hitbox: cc.Node;
    isRemote: number;
    bossLifeMgr: LifeProgress;
    hitball: cc.Node;
    ballBone: any;
    down: boolean;
    material: cc.Material;
    fangshuskin: number;
    armor: number;
    baseHP: number;
    baseATK: number;
    hitCollider: cc.BoxCollider;
    hitaoe: cc.Node;
    hitaoeCollider: cc.BoxCollider;
    bossMagic: boolean;
    bossMagicTime: number;
    scaleFlag: number;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(){
        this.body = this.node.getChildByName('body');
        this.hitbox = this.node.getChildByName('hitbox');
        this.hitaoe = this.node.getChildByName('hitaoe');
        this.hitCollider = this.hitbox.getComponent(cc.BoxCollider);
        if(this.hitaoe)
        this.hitaoeCollider = this.hitaoe.getComponent(cc.BoxCollider);
        this.MonsterFSM = this.node.getComponent(MonsterFSM);
        this.MonsterFSM.init();
        this.material = this.node.getComponent(sp.Skeleton).getMaterial(0);
        this.initEvent();
    }

    initEvent(){
        this.body.on('Hit', this.customHit, this);
        cc.director.on('TowerDestroy', this.onTowerDestroy, this);
    }

    use(monsterId: number){
        this.MonsterFSM.fsm.reset();
        let type = Game.instance.getMonsterIndex(monsterId);
        let color = Game.instance.getMonsterColor(monsterId) - 1;
        this.type = type;

        this.armor = MonsterArmor[Global.getInstance().gameDifficulty][Global.getInstance().nowLevel - Global.getInstance().gameDifficulty * 40 - 1];

        this.baseHP = MonsterHP[Global.getInstance().gameDifficulty][Global.getInstance().nowLevel - Global.getInstance().gameDifficulty * 40 - 1];
        this.baseATK = MonsterATK[Global.getInstance().gameDifficulty][Global.getInstance().nowLevel - Global.getInstance().gameDifficulty * 40 - 1];

        if(this.type == 99 || this.type == 98 || this.type == 97){
            this.isBoss = true;
            this.attackRange = 500;
            this.bossLifeMgr = Game.instance.bossHp.getComponent(LifeProgress);
            this.bossLifeMgr.init(true);
            this.HP = 40000;
            // this.HP = 5 * this.baseHP;
            this.attackSpace = 1.5 + Math.floor(Math.random() * 2);
        }else{
            this.isBoss = false;
            this.HP = 4000;
            // this.HP = this.baseHP;
            this.attackSpace = 3 + Math.floor(Math.random() * 5);
        }

        if(this.isBoss){
            this.HP = this.baseHP * 20;
            this.hitCollider.tag = this.baseATK * 1.2;
            this.hitaoeCollider.tag = this.baseATK * 1.3;
        }else{
            if(this.isElite()){
                this.HP = this.baseHP * 6;
                this.hitCollider.tag = this.baseATK * 1.1;
            }else{
                this.HP = this.baseHP *4;
                this.hitCollider.tag = this.baseATK * 1;
            }
        }

        

        if(this.type == 3){
            this.isRemote = 1;
            this.attackRange = 1000 + Math.floor(Math.random() * 150);
        }else if(this.type == 2){
            this.isRemote = 0;
            this.attackRange = cc.winSize.width;
        }
        else if(this.type == 4){
            this.isRemote = -1;
            this.attackRange = 700 + Math.floor(Math.random() * 150);
        }else if(this.type == 5){
            this.hitball = this.node.getChildByName('hitball');
            this.ballBone = this.MonsterFSM.sk.findBone('B');
            this.isRemote = 1;
            this.attackRange = 1000 + Math.floor(Math.random() * 150);
        }
        else if(this.type == 6){
            this.isRemote = -1;
            this.attackRange = 400 + Math.floor(Math.random() * 150);
        }else if(this.type == 7){
            this.isRemote = -1;
            this.attackRange = 200 + Math.floor(Math.random() * 150);
        }else if(this.type == 8){
            this.isRemote = 1;
            this.attackRange = 1000 + Math.floor(Math.random() * 150);
            this.fangshuskin = color;
            this.MonsterFSM.setSkin(FSSKINNAMES[color]);
        }


        else{
            this.isRemote = -1;
            this.attackRange = 100 + Math.floor(Math.random() * 150);
        }
        
        this.setSkStr(this.type);
        // if(!this.isBoss)
        if(this.type < 4)
        // this.MonsterFSM.setSkin(SKINNAMES[Math.floor(Math.random() * 3)]);
        this.MonsterFSM.setSkin(SKINNAMES[color]);
        if(this.type == 4 || this.type == 5){
            this.MonsterFSM.setSkin(BKSKINNAMES[this.type - 4]);

        }
        this.MonsterFSM.fsm.show();
        if(this.isInScreen()){
            this.scheduleOnce(()=>{
                AudioMgr.instance.playAudio('MonsterShow');
            }, 0.3)
        }
        this.body.active = true;
        this.BASE_SCALEX = MONSTER_SCALEX;
        if(this.isBoss){
            this.BASE_SCALEX = BOSS_SCALEX;
        }
        if(this.type == 4 || this.type == 5){
            this.BASE_SCALEX = BERSERKER_SCALEX;
        }
        if(this.type == 6){
            this.BASE_SCALEX = ELEPHANT_SCALEX;
        }
        if(this.type == 7){
            this.BASE_SCALEX = EAGLE_SCALEX;
        }
        if(this.type == 8){
            this.BASE_SCALEX = FANGSHU_SCALEX;
        }
        this.speed = 350;
        
        this.bodyWidth = BODYWIDTH;
        // this.attackRange = 100 + Math.floor(Math.random() * 150);
        this.eyeRange = cc.winSize.width * 2;
        
        
        this.scaleFlag = this.BASE_SCALEX > 0 ? 1 : -1;
    
    }

    unuse(){
        
    }

    start () {
        // this.init();
    }

    onTowerDestroy(){
        this.node.runAction(cc.sequence(cc.moveTo(.5, cc.v2(this.node.x, -191)), cc.callFunc(()=>{
            this.type = 3;
            this.isRemote = 1;
            this.attackRange = 1000 + Math.floor(Math.random() * 150);
        })));
    }

    setSkStr(type){
        this.skstr = SKARRS[type];
    }

    attack(){
        if(this.isRemote > -1){
            this.remoteAttack();
        }else{
            this.closeAttack();
        }
    }

    closeAttack(){
        this.hitbox.active = true;
        this.scheduleOnce(()=>{
            this.hitbox.active = false;
        });
    }

    bossAttack(){
        this.hitaoe.active = true;
        this.scheduleOnce(()=>{
            this.hitaoe.active = false;
        });
    }

    berserkerAttack(){
        this.hitball.active = true;
    }

    remoteAttack(){
        if(this.type == 8){
            if(this.fangshuskin == 0){
                BulletMgr.instance.createForMonsterIce(Hero.instance.node.x, this.baseATK * 0.9);
                AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.冰);
            }else{
                BulletMgr.instance.createForMonsterFire(Hero.instance.node.x, this.baseATK * 0.9);
                AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.火);
            }
            
        }else{
            let dir: number = this.node.scaleX > 0 ? 1 : -1;
            let posX: number = this.node.x + dir * 50;
            let posY: number = this.node.y + 85;
            BulletMgr.instance.createForMonster(this.type, cc.v2(posX, posY), dir, this.baseATK * 0.9);
        }
        
        // BulletMgr.instance.create(0, cc.v2(posX, posY), dir);
    }

    onCustomHit(direct: number, dmg: number, isCR: boolean, range: number){
        if(direct > 0){
            if(this.node.x > Hero.instance.node.x && this.getDistance() <= (range - 30 + this.bodyWidth)){
                this.hit(dmg, isCR);
            }
            if(this.node.x <= Hero.instance.node.x && this.getDistance() <= 30 + this.bodyWidth){
                this.hit(dmg, isCR);
            }
        }else{
            if(this.node.x < Hero.instance.node.x && this.getDistance() <= (range - 30 + this.bodyWidth)){
                this.hit(dmg, isCR);
            }
            if(this.node.x >= Hero.instance.node.x && this.getDistance() <= 30 + this.bodyWidth){
                this.hit(dmg, isCR);
            }
        }
    }

    customHit(dmg: number, isCR: boolean, canPushAway){
        if(canPushAway){
            this.away();
        }
    
        this.hit(dmg, isCR);
    }

    hit(dmg: number, isCR: boolean){

        dmg = dmg * (1 - (this.armor / (this.armor + 2000)));

        this.HP -= dmg * (isCR ? 2 : 1); 
        this.showDamage(dmg, isCR);
        this.refreshLifeProgress(dmg * (isCR ? 2 : 1));
        // if(this.type == 4 || this.type == 5){
            this.material.effect.setProperty('isFlash', 1.1);
            if(CC_NATIVERENDERER)
            this.MonsterFSM.sk.setMaterial(0, this.MonsterFSM.sk.getMaterial(0));
            this.scheduleOnce(()=>{
            this.material.effect.setProperty('isFlash', 0.5);
            if(CC_NATIVERENDERER)
            this.MonsterFSM.sk.setMaterial(0, this.MonsterFSM.sk.getMaterial(0));
        },.1);
    // }
        if(this.MonsterFSM.fsm.can('hit')){
            if(this.HP <= 0){
                this.MonsterFSM.fsm.hit();
                this.CoinsFall();
                this.dead();
                return;
            }

            if(this.isBoss){
                if(Math.random() < 0.07)
                this.MonsterFSM.fsm.hit();
            }else{
                if(this.isElite()){
                    if(Math.random() < 0.12)
                    this.MonsterFSM.fsm.hit();
                }else{
                    if(Math.random() < 0.2)
                    this.MonsterFSM.fsm.hit();
                }
                
            }
            
            
        }
    }

    refreshLifeProgress(dmg: number){
        if(!this.isBoss) return;
        let d: number = dmg * 100 / (this.baseHP * 5);
        this.bossLifeMgr.damage(4 * d);
    }

    dead(){
        // if(CC_WECHATGAME){
        //     wx.vibrateShort(null);
        // }

        if(this.MonsterFSM.fsm.can('dead')){
            this.MonsterFSM.fsm.dead();
            if(this.type < 6){
                AudioMgr.instance.playAudio('MonsterDead');
            }
            this.body.active = false;
        }
        
        Global.getInstance().monsterCount --;
        cc.log('monstercount',Global.getInstance().monsterCount);
        // cc.log('dead',Global.getInstance().monsterCount);
        if(Global.getInstance().monsterCount <= 0){
            if(Global.getInstance().MapLevelIndex == Global.getInstance().MapLevelCount){
                // success
                // Director.instance.onOpen(Global.getInstance().nowLevel, 3);
                
                // if(HeroFSM.instance.fsm.can('win')){
                //     HeroFSM.instance.fsm.win();
                // }
                // // Game.instance.onEnd(true);

                let delay = 0;

                for (let i = 0; i < Game.instance.rewardItmeArrs.length; i++) {
                    RewardMgr.instance.createReward(Game.instance.rewardItmeArrs[i], cc.v2(this.node.x - 400 + Math.random() * 400, -172));
                    delay = 2;
                }

                // this.scheduleOnce(()=>{
                    BizarreAdventure.instance.onOpen(true);
                    Game.instance.showReward();
                // }, delay);
                
            }else{
                Global.getInstance().levelNext = true;
                Game.instance.nextArrow.active = true;
            }
            

        }
    }

    away(){
        if(this.node.x > Hero.instance.node.x){
            //向右
            this.node.x += 60;
        }else{
            //向左
            this.node.x -= 60;
        }
    }

    showDamage(dmg: number, isCR: boolean){
        dmg = Math.floor(dmg);
        cc.director.emit('showdmg',dmg,this.node.x,isCR,this.isBoss,Hero.instance.node.scaleX);
    }

    getDistance():number{
        return Math.abs(this.node.x - Hero.instance.node.x);
    }

    getPosInScreen(){
        let pos: cc.Vec2 = cc.v2(0, 0);
        Main.instance.heroCamera.getComponent(cc.Camera).getWorldToScreenPoint(this.node.position, pos);
        // cc.log('getPosInScreen',pos.x);
        return pos;
    }

    isInScreen(){
        let spos = this.getPosInScreen();
        if(spos.x > 0 && spos.x < cc.winSize.width){
            return true;
        }else{
            return false;
        }
    }

    isElite(){
        if(this.type == 4 || this.type == 5 || this.type == 6){
            return true;
        }else{
            return false;
        }
    }

    getPosInScreenCustom(){

    }

    bossMagicStart(){
        this.bossMagic = true;
        this.bossMagicTime = 0;
        AudioMgr.instance.playAudio('XHDSkill3');
    }

    bossMagicEnd(){
        this.bossMagic = false;
    }

    updateBossMagic(dt: number){
        if(!this.bossMagic) return;
        if(this.bossMagicTime > 0){
            this.bossMagicTime -= dt;
            
        }else{
            this.bossMagicTime = 0.1;
            this.node.getChildByName('hitmagic').getComponent(cc.CircleCollider).tag = this.baseATK * 0.2;
            this.node.getChildByName('hitmagic').active = true;
            this.scheduleOnce(()=>{
                this.node.getChildByName('hitmagic').active = false;
            });
        }
    }

    activeBoss(){
        
    }

    setBossShowType(node: cc.Node){

    }

    MonsterUpdate(){
        if(this.move == 3) return;
        this.attackSpaceCount ++;
        // if(this.type == 4){
        //     this.attackSpaceCount ++;
        // }
        if(!this.AiActive && this.isBoss && !Game.instance.gameEventNode.getChildByName('bossShow')){
            let bossShow = MonsterNodePool.instance.getBossShow();
            bossShow.position = cc.v2(this.node.x, this.node.y + 120);
            let anim = bossShow.getComponent(cc.Animation);
            bossShow.getComponent(BossShow).setType(this.type);
            anim.stop();
            anim.play();
            Global.getInstance().inGame = false;
            anim.on(cc.Animation.EventType.FINISHED, ()=>{
                bossShow.active = false;
                this.AiActive = true;
                Director.instance.onOpen(Global.getInstance().nowLevel, Global.getInstance().MapLevelIndex);
            });
        }

        if((!this.AiActive) && this.getDistance() < this.eyeRange){
            if(!this.isBoss)
            this.AiActive = true;
        }
        if(!this.AiActive) return;
        if(Hero.instance.node.x <= this.node.x){
            this.node.scaleX = -this.BASE_SCALEX;
            // this.HPNode.scaleX = 1;
        }else{
            this.node.scaleX = this.BASE_SCALEX;
            // this.HPNode.scaleX = -1;
        }

        // cc.log(this.isInScreen());

        if(!this.isInScreen()){
            //在屏幕内优先级最高
            if(this.MonsterFSM.fsm.can('move'))
                this.MonsterFSM.fsm.move();
                if(this.node.scaleX < 0){
                    this.move = -1 * this.scaleFlag;
                }else{
                    this.move = 1 * this.scaleFlag;
                }



        }else{

            if(this.getDistance() > this.attackRange){
            
                if(this.MonsterFSM.fsm.can('move'))
                this.MonsterFSM.fsm.move();
                if(this.node.scaleX < 0){
                    this.move = -1 * this.scaleFlag;
                }else{
                    this.move = 1 * this.scaleFlag;
                }
                if(this.isBoss){
                    // if(Math.random() < .1){
                    //     if(this.type == 4){
                    //         if(Math.random() < .5){
                    //             // this.bossMagic();
                    //         }else{
                    //             if(this.MonsterFSM.fsm.can('lancerDash'))
                    //             this.MonsterFSM.fsm.lancerDash();
                    //         }
                            
                    //     }else{
                    //         if(this.MonsterFSM.fsm.can('bossMagic'))
                    //         this.MonsterFSM.fsm.bossMagic();
                    //     }
                        
                    // }

                    // if(this.type == 97){
                    //     if(HeroFSM.instance.fsm.is('state_skill')){

                    //         if(this.node.scaleX < 0){
                    //             this.move = -1;
                    //         }else{
                    //             this.move = 1;
                    //         }
                    //         if(this.MonsterFSM.fsm.can('bossMagic'))
                    //         this.MonsterFSM.fsm.bossMagic();
                    //     }
                    // }
                }else{
                    //长枪兵
                    if(this.type == 3){
                        if(this.node.type != 8)
                        if(Math.random() < .1){
                            if(this.MonsterFSM.fsm.can('lancerDash'))
                            this.MonsterFSM.fsm.lancerDash();
                        }  
                    }
                }
                
            }else if(this.getDistance() < 30){
                if(Math.random() < .05){
                    if(this.MonsterFSM.fsm.can('move'))
                    this.MonsterFSM.fsm.move();
                    if(this.node.scaleX < 0){
                        this.move = 1 * this.scaleFlag;
                    }else{
                        this.move = -1 * this.scaleFlag;
                    }
                }
                
            }
            else{

                if(this.type == 97){
                    if(Math.random() < .35){

                        if(this.node.scaleX < 0){
                            this.move = -1 * this.scaleFlag;
                        }else{
                            this.move = 1 * this.scaleFlag;
                        }
                        if(this.MonsterFSM.fsm.can('bossMagic')){
                            this.MonsterFSM.fsm.bossMagic();
                            this.bossMagicStart();
                        }
                        
                    }
                }

                // 曹操
                if(this.type == 98){
                    if(Math.random() < .25){
                        if(this.MonsterFSM.fsm.can('bossDouble')){
                            this.MonsterFSM.fsm.bossDouble();
                        }
                        
                    }
                }

                this.move = 0;
                if(this.MonsterFSM.fsm.is('state_move'))
                    this.MonsterFSM.fsm.reset();
                if(this.attackSpaceCount >= this.attackSpace){
                    this.attackSpaceCount = 0;
                    if(this.isBoss){
                        if(this.MonsterFSM.fsm.can('attack'))
                        this.MonsterFSM.fsm.attack();
                    }else{
                        if(this.MonsterFSM.fsm.can('attack')){
                            if(this.type == 7){
                                if(this.node.y > -140){
                                    if(this.MonsterFSM.fsm.can('move'))
                                        this.MonsterFSM.fsm.move();
                                    //     this.move == 3;
                                    this.down = true;
                                }else{
                                    this.MonsterFSM.fsm.attack();
                                }
                            }else{
                                this.MonsterFSM.fsm.attack();
                            }
                        }
                    }
                }
            }
        }
    }

    remoteMonsterUpdate(){
        this.attackSpaceCount ++;
        if((!this.AiActive) && this.getDistance() < this.eyeRange){
            this.AiActive = true;
            
        }
        if(!this.AiActive) return;
        if(Hero.instance.node.x <= this.node.x){
            this.node.scaleX = -this.BASE_SCALEX;
            // this.HPNode.scaleX = 1;
        }else{
            this.node.scaleX = this.BASE_SCALEX;
            // this.HPNode.scaleX = -1;
        }
        

        if(!this.isInScreen()){
            //在屏幕内优先级最高
            if(this.MonsterFSM.fsm.can('move'))
                this.MonsterFSM.fsm.move();
                if(this.node.scaleX < 0){
                    this.move = -1 * this.scaleFlag;
                }else{
                    this.move = 1 * this.scaleFlag;
                }



        }else{
            if(this.getDistance() > this.attackRange * (.6 + Math.random() * .4)){
                //靠近
                if(this.MonsterFSM.fsm.can('move'))
                this.MonsterFSM.fsm.move();
                if(this.node.scaleX < 0){
                    this.move = -1 * this.scaleFlag;
                }else{
                    this.move = 1 * this.scaleFlag;
                }
            }else if(this.getDistance() < this.attackRange * (.3 + Math.random() * .3)){
                //逃离
                // if(this.MonsterFSM.fsm.can('move'))
                // this.MonsterFSM.fsm.move();
                // if(this.node.scaleX == this.BASE_SCALEX){
                //     this.move = -1;
                // }else{
                //     this.move = 1;
                // }
                this.move = 0;
                if(this.MonsterFSM.fsm.is('state_move'))
                    this.MonsterFSM.fsm.reset();
                if(this.attackSpaceCount >= this.attackSpace){
                    this.attackSpaceCount = 0;
                    if(this.MonsterFSM.fsm.can('attack')){
                        this.MonsterFSM.fsm.attack();
                        this.standTime = 3;
                    }
                    
                }
            }else{
                this.move = 0;
                if(this.MonsterFSM.fsm.is('state_move'))
                    this.MonsterFSM.fsm.reset();
                if(this.attackSpaceCount >= this.attackSpace){
                    this.attackSpaceCount = 0;
                    if(this.MonsterFSM.fsm.can('attack')){
                        this.MonsterFSM.fsm.attack();
                        this.standTime = 3;
                    }
                    
                }
            }
        }


        
    }

    towerMonsterUpdate(){
        this.attackSpaceCount ++;
        if((!this.AiActive) && this.getDistance() < this.eyeRange){
            this.AiActive = true;
        }
        if(!this.AiActive) return;
        if(Hero.instance.node.x <= this.node.x){
            this.node.scaleX = -this.BASE_SCALEX;
            // this.HPNode.scaleX = 1;
        }else{
            this.node.scaleX = this.BASE_SCALEX;
            // this.HPNode.scaleX = -1;
        }

        if(!this.isInScreen()){
            //在屏幕内优先级最高
            if(this.MonsterFSM.fsm.can('move'))
                this.MonsterFSM.fsm.move();
                if(this.node.scaleX < 0){
                    this.move = -1 * this.scaleFlag;
                }else{
                    this.move = 1 * this.scaleFlag;
                }

        }else{
            this.move = 0;
            if(this.MonsterFSM.fsm.is('state_move'))
                this.MonsterFSM.fsm.reset();
            if(this.attackSpaceCount >= this.attackSpace){
                this.attackSpaceCount = 0;
                if(this.MonsterFSM.fsm.can('attack')){
                    this.MonsterFSM.fsm.attack();
                    this.standTime = 3;
                }
            }
        }
    }

    CoinsFall(){
        RewardMgr.instance.createCoins(90000, cc.v2(this.node.x, -172));
    }

    recycle(){
        // this.CoinsFall();
        if(this.node.name != 'boss' && this.node.name != 'berserker' && this.node.name != 'elephant' && this.node.name != 'eagle'){
            MonsterNodePool.instance.recycle(this.node);
        }else{
            this.node.destroy();
        }
        
    }

    update (dt) {

        if(!Global.getInstance().inGame) return;
        this.updateBossMagic(dt);
        if(this.hitball && this.hitball.active){
            this.hitball.x = this.ballBone.worldX;
            if(this.hitball.x < -1250){
                this.hitball.active = false;
            }
        }
    
        if(this.standTime > 0){
            this.standTime -= dt;
        }
        this.count += 1;
        //判定时间一定要小于攻击距离除以移动速度 否则会两头打转 1s判定3次
        if(this.count == 20){
            this.count = 0;
            if(this.MonsterFSM.fsm.is('state_dead')) return;
            switch (this.isRemote) {
                case -1:
                    this.MonsterUpdate();
                    break;
                case 0:
                    if(this.standTime <= 0)
                    // this.towerMonsterUpdate();
                    this.remoteMonsterUpdate();
                    break;
                case 1:
                    if(this.standTime <= 0)
                    this.remoteMonsterUpdate();
                    break;
                default:
                    break;
    
            }
            
        }
        if(this.MonsterFSM.fsm.is('state_move') || this.MonsterFSM.fsm.is('state_bossmagic')){
            switch (this.move) {
                case -1:
                    this.node.x -= this.speed * dt;
                    break;
                case 1:
                    this.node.x += this.speed * dt;
                    break;
                
                default:
                    break;
            }
    
            if(this.down){
                this.node.y -= this.speed * dt;
                if(this.node.y <= -140){
                    this.down = false;
                }
            }
        }
        
        
    }

    onDestroy(){
        this.body.off('Hit', this.customHit, this);
        cc.director.off('TowerDestroy', this.onTowerDestroy, this);
    }
}
