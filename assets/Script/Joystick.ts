import Global from "./nativets/Global";
import Hero from "./Hero/Hero";
import HeroFSM from "./Hero/HeroFSM";
import Director from "./Director";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    AttackBtn: cc.Node = null;
    joybg: cc.Node;
    joytouch: cc.Node;
    radius: number;
    State:number = 0;
    canTouch: boolean;
    // heroScript: Hero;
    originPos: cc.Vec2;
    AttackState: boolean;
    AttackSpace: number;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(){
        Global.getInstance().MoveState = this.State;
        this.joybg = this.node;
        this.canTouch = true;
        this.joytouch = this.node.getChildByName('joytouch');
        this.radius = this.node.width/2;
        this.originPos = cc.v2(-71, -266);
        this.node.position = this.originPos;
        this.AttackState = false;
        this.AttackSpace = 0;
    }

    start () {
        this.init();
        
        
        this.node.parent.on('touchstart',this.touchs,this);
        this.node.parent.on('touchmove',this.touchm,this);
        this.node.parent.on('touchend',this.touche,this);
        this.node.parent.on('touchcancel',this.touche,this);
       
        this.AttackBtn.on('touchstart',this.onAttack,this);
        this.AttackBtn.on('touchend',this.onAttackC,this);
        this.AttackBtn.on('touchcancel',this.onAttackC,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        
    }

    onAttack(){
        Hero.instance.onBtnAttack();
        this.AttackState = true;
        this.AttackSpace = 0;
    }

    onAttackC(){
        this.AttackState = false;
        // this.touche();
    }

    touchs(event) {
        // cc.log('touchs');
        let locPos: any = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        // if(locPos.x < 0){
            this.canTouch = true;
            this.joybg.opacity = 120;
            // this.joytouch.isCascadeOpacityEnabled();
            // this.joytouch.opacity = 255;
            this.node.position = locPos;
        // }else{
        //     this.canTouch = false;
        // }
        // let locPos = this.node.convertToNodeSpaceAR(event.getLocation());
        // this.joytouch.position = locPos;
        // if(locPos.x > 0){
            // this.State = Global.getInstance().STATE.RIGHT;
        // }else{
            // this.State = Global.getInstance().STATE.LEFT;
        // }
        // Global.getInstance().MoveState = this.State;
    }

    touchm(event) {
        if(Director.instance.node.active) return;
        // cc.log('touchm');
        //直接点关闭 下一行
        // if(!this.canTouch) return;
        // 获取触摸坐标
        // if(!Global.getInstance().inGame) return;
        // cc.log(event.getLocation());
        var x=this.joybg.convertToNodeSpaceAR(event.getLocation()).x;
        var y=this.joybg.convertToNodeSpaceAR(event.getLocation()).y;
        // var dis=this.joybg.node.convertToNodeSpaceAR(e.getLocation()).pDistance(cc.p(0,0));

        //圆形
        var rad=Math.atan2(x,y);  //当前坐标的弧度
        var tlength=cc.v2(x,y).mag(); //当前坐标到原点的距离
        /**
         * 
         * 
         * 
         */
        if(tlength>this.radius) tlength=this.radius;  
        // this.joytouch.setPosition(cc.pForAngle(rad).x*tlength,cc.pForAngle(rad).y*tlength);
        this.joytouch.setPosition(cc.v2(Math.sin(rad)).x*tlength,cc.v2(Math.cos(rad)).x*tlength);
        //打开原来的控制模式
        
        if(x > this.node.width / 2){
            x = this.node.width / 2;
        }
        if(x < - this.node.width / 2){
            x = - this.node.width / 2;
        }
        if(y > this.node.height / 2){
            y = this.node.height / 2;
        }
        if(y < -this.node.height / 2){
            y = - this.node.height / 2;
        }
        this.joytouch.setPosition(x,y);

        // 4向
        // var rad_45=cc.pToAngle(cc.v2(1,1));
        // var rad_135=cc.pToAngle(cc.v2(-1,1));
        // var rad_225=cc.pToAngle(cc.v2(-1,-1));
        // var rad_315=cc.pToAngle(cc.v2(1,-1));

        // if(rad>rad_45&&rad<rad_135)
        //     this.State=STATE.UP;
        // else if(rad>rad_135||rad<rad_225)
        //     this.State=STATE.LEFT
        // else if(rad>rad_225&&rad<rad_315)
        //     this.State=STATE.DOWN;
        // else if(rad>rad_315&&rad<rad_45)
        //     this.State=STATE.RIGHT

        // 2向
        var rad_90 = Math.atan2(0,1); 
        var rad_270 = Math.atan2(0,-1); 

        if(rad>rad_90)
            this.State = Global.getInstance().STATE.RIGHT;
        else 
            this.State = Global.getInstance().STATE.LEFT;

        Global.getInstance().MoveState = this.State;
        // cc.log(this.State);
    }

    touche(event) {
        // cc.log('touche');
        //直接点关闭 下一行
        // if(!this.canTouch) return;
        this.node.position = this.originPos;
        this.joytouch.setPosition(0,0);
        this.State = Global.getInstance().STATE.STOP;
        this.joybg.opacity = 255;
        Global.getInstance().MoveState = this.State;
    }

    onKeyDown(event) {
        if(!Global.getInstance().inGame) return;
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                Global.getInstance().MoveState |= Global.getInstance().STATE.LEFT;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                Global.getInstance().MoveState |= Global.getInstance().STATE.RIGHT;
                break;
            
            case cc.macro.KEY.w:
            case cc.macro.KEY.j:
            case cc.macro.KEY.space:
                Hero.instance.onBtnJump();
                
                break;
        }
    }

    onKeyUp(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                Global.getInstance().MoveState &= ~Global.getInstance().STATE.LEFT;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                Global.getInstance().MoveState &= ~Global.getInstance().STATE.RIGHT;
                break;
                case cc.macro.KEY.j:
            case cc.macro.KEY.space:

                // Hero.instance.onBtnJump();

                
                break;
        }
    }

    update (dt) {
        if(this.AttackState){
            if(this.AttackSpace == 0){
                Hero.instance.onBtnAttack();
            }
            this.AttackSpace ++;
            if(this.AttackSpace > 7){
                this.AttackSpace = 0;
            }
        }
    }

    onDestroy(){
        this.node.parent.off('touchstart',this.touchs,this);
        this.node.parent.off('touchmove',this.touchm,this);
        this.node.parent.off('touchend',this.touche,this);
        this.node.parent.off('touchcancel',this.touche,this);
       
        this.AttackBtn.off('touchstart',this.onAttack,this);
        this.AttackBtn.off('touchend',this.onAttackC,this);
        this.AttackBtn.off('touchcancel',this.onAttackC,this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
