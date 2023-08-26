import Hero from "./Hero/Hero";
import HeroFSM from "./Hero/HeroFSM";
import Global from "./nativets/Global";
import Main from "./Main";
import Game from "./Game";
import AudioMgr from "./Audio";
import HeroGlobal from "./Hero/HeroGlobal";
// import Texture from "./Texture";
const {ccclass, property} = cc._decorator;

@ccclass
export default class BgMgr extends cc.Component {
    static instance: BgMgr = null;
    @property(cc.Node)
    nearBg: cc.Node = null;

    @property(cc.Node)
    nearBg1: cc.Node = null;
    
    @property(cc.Node)
    farBg: cc.Node = null;

    @property(cc.Node)
    farBg1: cc.Node = null;

    @property(cc.Node)
    midBg: cc.Node = null;

    @property(cc.Node)
    midBg1: cc.Node = null;

    @property(cc.Node)
    hero: cc.Node = null;

    heroScript: Hero;

    farSpeed = 30;
    nearSpeed = 300;
    canScroll: boolean;

    heroCamera:cc.Node = null;
    heroFSM: HeroFSM;
    hole: cc.Node;
    holeSprite: cc.Sprite;

    // LIFE-CYCLE CALLBACKS:

    init(){
        BgMgr.instance = this;
        //初始化坐标
        if(!this.nearBg) return;
        this.hole = this.node.getChildByName('hole');
        this.holeSprite = this.hole.getComponent(cc.Sprite);
        this.heroCamera = Main.instance.heroCamera;
    
        cc.director.on('MapAction',this.MapAction,this);
        cc.director.on('MapActionHit',this.MapActionHit,this);
        cc.director.on('MapActionBase',this.MapActionBase,this);  
    }

    reset(){
        this.heroCamera.position = cc.v2(0,0);
        this.nearBg.x = 0;
        this.nearBg1.x = this.nearBg.width * this.nearBg.scaleX;
        this.farBg.x = 0;
        this.farBg1.x = this.farBg.width * this.farBg.scaleX;
        this.midBg.x = 0;
        this.midBg1.x = this.midBg.width * this.midBg.scaleX;
        Global.getInstance().canScrollLeft = false;
        Global.getInstance().canScrollRight = false;
        

    }

    onGameStart(){
        this.reset();
        // this.setMapByIndex();
    }

    setBg(hole: boolean){
        this.nearBg.getComponent(cc.Sprite).spriteFrame = hole ? Game.instance.holeNearSf : Game.instance.nearSf;
        this.nearBg1.getComponent(cc.Sprite).spriteFrame = hole ? Game.instance.holeNearSf : Game.instance.nearSf;
        this.midBg.getComponent(cc.Sprite).spriteFrame = hole ? Game.instance.holeMidSf : Game.instance.midSf;
        this.midBg1.getComponent(cc.Sprite).spriteFrame = hole ? Game.instance.holeMidSf : Game.instance.midSf;
        this.farBg.getComponent(cc.Sprite).spriteFrame = hole ? Game.instance.holeFarSf : Game.instance.farSf;
        this.farBg1.getComponent(cc.Sprite).spriteFrame = hole ? Game.instance.holeFarSf : Game.instance.farSf;
    }

    setMapByIndex(isHole: boolean){
        this.midBg.getChildByName('other').active = Global.getInstance().BgIndex == 2 ? true :false;
        this.midBg1.getChildByName('other').active = Global.getInstance().BgIndex == 2 ? true :false;
        if(isHole){
            switch (Global.getInstance().MapLevelIndex) {
                case 0:
                    this.holeSprite.spriteFrame = Game.instance.holeSf;
                    this.hole.x = Global.getInstance().MapSplitWidth + 10;
                    this.setBg(false);
                    break;
                case 1:  
                    this.hole.x = (Global.getInstance().MapLevelIndex + 1) * Global.getInstance().MapSplitWidth + 10;
                    this.setBg(true);
                    break;
                case 2:
                    this.reset();
                    this.hole.x = /*Global.getInstance().MapLevelIndex * Global.getInstance().MapSplitWidth*/ + 10;
                    this.setBg(false);
                    break;
                default:
                    break;
            }
        }else{
            this.holeSprite.spriteFrame = null;
            this.setBg(false);
        }
        
        
    }

    onBtnHome(){
        AudioMgr.instance.playAudio('BtnClick');
        Main.instance.gameNode.active = false;
        Main.instance.menuNode.active = true;
    }

    MapAction(){
        let act11 = cc.sequence(cc.moveBy(.05,cc.v2(-10,12)),cc.moveBy(.05,cc.v2(10,-12)));
        let act12 = cc.sequence(cc.moveBy(.1,cc.v2(-10,12)),cc.moveBy(.1,cc.v2(10,-12)));
        let act13 = cc.sequence(cc.moveBy(.2,cc.v2(-10,12)),cc.moveBy(.2,cc.v2(10,-12)));
        let act1: cc.Action = cc.sequence(act11,act12,act13);
        this.nearBg.runAction(act1);
        let act21 = cc.sequence(cc.moveBy(.05,cc.v2(-10,12)),cc.moveBy(.05,cc.v2(10,-12)));
        let act22 = cc.sequence(cc.moveBy(.1,cc.v2(-10,12)),cc.moveBy(.1,cc.v2(10,-12)));
        let act23 = cc.sequence(cc.moveBy(.2,cc.v2(-10,12)),cc.moveBy(.2,cc.v2(10,-12)));
        let act2: cc.Action = cc.sequence(act21,act22,act23);
        this.nearBg1.runAction(act2);
        let act31 = cc.sequence(cc.moveBy(.05,cc.v2(-10,12)),cc.moveBy(.05,cc.v2(10,-12)));
        let act32 = cc.sequence(cc.moveBy(.1,cc.v2(-10,12)),cc.moveBy(.1,cc.v2(10,-12)));
        let act33 = cc.sequence(cc.moveBy(.2,cc.v2(-10,12)),cc.moveBy(.2,cc.v2(10,-12)));
        let act3: cc.Action = cc.sequence(act31,act32,act33);
        this.midBg.runAction(act3);
        let act41 = cc.sequence(cc.moveBy(.05,cc.v2(-10,12)),cc.moveBy(.05,cc.v2(10,-12)));
        let act42 = cc.sequence(cc.moveBy(.1,cc.v2(-10,12)),cc.moveBy(.1,cc.v2(10,-12)));
        let act43 = cc.sequence(cc.moveBy(.2,cc.v2(-10,12)),cc.moveBy(.2,cc.v2(10,-12)));
        let act4: cc.Action = cc.sequence(act41,act42,act43);
        this.midBg1.runAction(act4);
    }

    MapActionHit(){
        let act1: cc.Action = cc.sequence(cc.moveBy(.02,cc.v2(-8,10)).easing(cc.easeBackInOut()),cc.moveBy(.04,cc.v2(8,-10)));
        this.nearBg.runAction(act1);
        let act2: cc.Action = cc.sequence(cc.moveBy(.02,cc.v2(-8,10)).easing(cc.easeBackInOut()),cc.moveBy(.04,cc.v2(8,-10)));
        this.nearBg1.runAction(act2);
        let act3: cc.Action = cc.sequence(cc.moveBy(.02,cc.v2(-8,10)).easing(cc.easeBackInOut()),cc.moveBy(.04,cc.v2(8,-10)));
        this.midBg.runAction(act3);
        let act4: cc.Action = cc.sequence(cc.moveBy(.02,cc.v2(-8,10)).easing(cc.easeBackInOut()),cc.moveBy(.04,cc.v2(8,-10)));
        this.midBg1.runAction(act4);
    }

    MapActionBase(){
        let act1: cc.Action = cc.sequence(cc.moveBy(.02,cc.v2(-3,12)).easing(cc.easeBackInOut()),cc.moveBy(.04,cc.v2(3,-12)));
        this.nearBg.runAction(act1);
        let act2: cc.Action = cc.sequence(cc.moveBy(.02,cc.v2(-3,12)).easing(cc.easeBackInOut()),cc.moveBy(.04,cc.v2(3,-12)));
        this.nearBg1.runAction(act2);
        let act3: cc.Action = cc.sequence(cc.moveBy(.02,cc.v2(-3,12)).easing(cc.easeBackInOut()),cc.moveBy(.04,cc.v2(3,-12)));
        this.midBg.runAction(act3);
        let act4: cc.Action = cc.sequence(cc.moveBy(.02,cc.v2(-3,12)).easing(cc.easeBackInOut()),cc.moveBy(.04,cc.v2(3,-12)));
        this.midBg1.runAction(act4);
    }

    // onLoad () {}

    start () {
        this.init();
    }

    getLeftNearBg(): cc.Node{
        if(this.nearBg.x < this.nearBg1.x){
            return this.nearBg;
        }else{
            return this.nearBg1;
        }
    }

    getLeftFarBg(): cc.Node{
        if(this.farBg.x < this.farBg1.x){
            return this.farBg;
        }else{
            return this.farBg1;
        }
    }

    getLeftMidBg(): cc.Node{
        if(this.midBg.x < this.midBg1.x){
            return this.midBg;
        }else{
            return this.midBg1;
        }
    }

    getRightNearBg(): cc.Node{
        if(this.nearBg.x > this.nearBg1.x){
            return this.nearBg;
        }else{
            return this.nearBg1;
        }
    }

    getRightFarBg(): cc.Node{
        if(this.farBg.x > this.farBg1.x){
            return this.farBg;
        }else{
            return this.farBg1;
        }
    }

    getRightMidBg(): cc.Node{
        if(this.midBg.x > this.midBg1.x){
            return this.midBg;
        }else{
            return this.midBg1;
        }
    }

    //人物向左
    extendLeft(dt: number){
        let leftnearbg = this.getLeftNearBg();
        let rightnearbg = this.getRightNearBg();

        let pos = cc.v2(0,0);
        this.heroCamera.getComponent(cc.Camera).getWorldToScreenPoint(rightnearbg.position, pos);
        if(pos.x > cc.winSize.width){
            rightnearbg.x = leftnearbg.x - this.nearBg.width * this.nearBg.scaleX;
        }

        if(Global.getInstance().canScrollLeft && (HeroFSM.instance.fsm.is('state_move') || HeroFSM.instance.fsm.is('state_jump') || HeroFSM.instance.fsm.is('state_flash') || HeroFSM.instance.fsm.is('state_jumpattack') )){
            let speed: number = Hero.instance.SP;
            if(!speed){
                speed = 300;
            }
            let leftfarbg = this.getLeftFarBg();
            let rightfarbg = this.getRightFarBg();

            let s = Math.floor(speed / 2 * dt * 100) / 100;
            if(HeroGlobal.instance.MainHeroIndex > 0 && HeroFSM.instance.fsm.is('state_jumpattack')){
                s *= 0.1;
            }

            if(HeroFSM.instance.sk.animation == 'skill_guangbo' || HeroFSM.instance.sk.animation == 'skill_dipotianxing'){
                s = s / 10;
            }
            leftfarbg .x += -s;
            rightfarbg.x += -s;

            let pos1 = cc.v2(0,0);
            this.heroCamera.getComponent(cc.Camera).getWorldToScreenPoint(rightfarbg.position, pos1);
            if(pos1.x > cc.winSize.width){
                rightfarbg.x = leftfarbg.x - this.farBg.width * this.farBg.scaleX;
            }

            let leftmidbg = this.getLeftMidBg();
            let rightmidbg = this.getRightMidBg();

            let s2 = Math.floor(speed / 4 * dt * 100) / 100;
            if(HeroGlobal.instance.MainHeroIndex > 0 && HeroFSM.instance.fsm.is('state_jumpattack')){
                s2 *= 0.1;
            }
            if(HeroFSM.instance.sk.animation == 'skill_guangbo' || HeroFSM.instance.sk.animation == 'skill_dipotianxing'){
                s2 = s2 / 10;
            }
            leftmidbg .x += -s2;
            rightmidbg.x += -s2;

            let pos2 = cc.v2(0,0);
            this.heroCamera.getComponent(cc.Camera).getWorldToScreenPoint(rightmidbg.position, pos2);
            if(pos2.x > cc.winSize.width){
                rightmidbg.x = leftmidbg.x - this.midBg.width * this.midBg.scaleX;
            }
        }
        
    }

    //人物向右
    extendRight(dt: number){
        let leftnearbg = this.getLeftNearBg();
        let rightnearbg = this.getRightNearBg();

        let pos = cc.v2(0,0);
        this.heroCamera.getComponent(cc.Camera).getWorldToScreenPoint(rightnearbg.position, pos);
        if(pos.x < 0){
            leftnearbg.x = rightnearbg.x + this.nearBg.width * this.nearBg.scaleX;
        }

        if(Global.getInstance().canScrollRight && (HeroFSM.instance.fsm.is('state_move') || HeroFSM.instance.fsm.is('state_jump') || HeroFSM.instance.fsm.is('state_flash') || HeroFSM.instance.fsm.is('state_jumpattack'))){
            let speed: number = Hero.instance.SP;
            if(!speed){
                speed = 300;
            }
            // cc.log('SPEED',speed);
            let leftfarbg = this.getLeftFarBg();
            let rightfarbg = this.getRightFarBg();
    
            let s = Math.floor(speed / 2 * dt * 100) / 100;
            if(HeroGlobal.instance.MainHeroIndex > 0 && HeroFSM.instance.fsm.is('state_jumpattack')){
                s *= 0.1;
            }
            if(HeroFSM.instance.sk.animation == 'skill_guangbo' || HeroFSM.instance.sk.animation == 'skill_dipotianxing'){
                s = s / 10;
            }
            leftfarbg.x += s;
            rightfarbg.x += s;
    
            let pos1 = cc.v2(0,0);
            this.heroCamera.getComponent(cc.Camera).getWorldToScreenPoint(rightfarbg.position, pos1);
            if(pos1.x < 0){
                leftfarbg.x = rightfarbg.x + this.farBg.width * this.farBg.scaleX;
            }

            let leftmidbg = this.getLeftMidBg();
            let rightmidbg = this.getRightMidBg();

            
            let s2 = Math.floor(speed / 4 * dt * 100) / 100;
            if(HeroGlobal.instance.MainHeroIndex > 0 && HeroFSM.instance.fsm.is('state_jumpattack')){
                s2 *= 0.1;
            }
            if(HeroFSM.instance.sk.animation == 'skill_guangbo' || HeroFSM.instance.sk.animation == 'skill_dipotianxing'){
                s2 = s2 / 10;
            }
            leftmidbg .x += s2;
            rightmidbg.x += s2;

            let pos2 = cc.v2(0,0);
            this.heroCamera.getComponent(cc.Camera).getWorldToScreenPoint(rightmidbg.position, pos2);
            if(pos2.x < 0){
                leftmidbg.x = rightmidbg.x + this.midBg.width * this.midBg.scaleX;
            }
        }
    }

    onBtnResume(){
        AudioMgr.instance.playAudio('BtnClick');
        cc.director.resume();
        // Global.getInstance().audioMgr.playAudio('button');
    }

    update (dt) {
        // if(!Global.getInstance().inGame) return;
        if(Global.getInstance().MoveState == Global.getInstance().STATE.LEFT || Global.getInstance().MoveState == Global.getInstance().STATE.RIGHT || HeroFSM.instance.fsm.is('state_flash') || HeroFSM.instance.fsm.is('state_jumpattack') || Global.getInstance().attackMove){
            this.extendRight(dt);
            this.extendLeft(dt);
            // cc.log(Global.getInstance().canScrollLeft,Global.getInstance().canScrollRight);
        }
    }

    onEnable(){
        this.init();
    }

    onDestroy(){
        cc.director.off('MapAction', this.MapAction, this);
        cc.director.off('MapActionHit', this.MapActionHit, this);
        cc.director.off('MapActionBase', this.MapActionBase, this);
    }

}
