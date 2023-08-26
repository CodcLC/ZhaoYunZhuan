import StateMachine = require('../lib/state-machine.min.js');
import Global from "../nativets/Global";
import Hero from "./Hero";
import AudioMgr from '../Audio';
import SkillMgr from '../SkillMgr';
import Game from '../Game';
import HeroGlobal from './HeroGlobal';
import BizarreAdventure from '../BizarreAdventure/BizarreAdventure';


const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroFSM extends cc.Component {
    static instance: HeroFSM = null;
    fsm: any;
    sk: sp.Skeleton;
    jumpRotateCount: number = 4;
    jumpCount: number = 1;
    finalList: number = 0;

    // LIFE-CYCLE CALLBACKS:

    initInstance(){
        HeroFSM.instance = this;
    }

    init(){
       this.sk = this.node.getComponent(sp.Skeleton); 

       this.sk.setCompleteListener(()=>{
            if(this.fsm.is('state_move') || this.fsm.is('state_stand')) return;
            if(this.fsm.is('state_jumpattack')){
                if(this.jumpRotateCount > 0){
                    this.jumpRotateCount --;
                    Hero.instance.attackRotate();
                    if(HeroGlobal.instance.MainHeroIndex == 0){
                        AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.攻击1);
                    }
                    if(HeroGlobal.instance.MainHeroIndex == 1){
                        this.sk.setAnimation(0, 'jump_middle_attack', true);
                        SkillMgr.instance.create('jump_middle_attack');
                        AudioMgr.instance.playAudio(Global.getInstance().DCAudio.跳攻);
                    }
                    
                    return
                }
                Global.getInstance().gravity = 4000;
                cc.director.emit('MapActionBase');
            }
            if(this.fsm.is('state_jump')){
                if(this.jumpCount > 0){
                    this.jumpCount --;
                    this.sk.setAnimation(0, 'jump_middle', false);
                    return
                }
            }
            if(this.sk.animation == 'skill_guangbo'){
                // cc.log('光波');
                // Hero.instance.node.x -= 410 * Hero.instance.node.scaleX;
                // Global.getInstance().deltaX -= 410 * Hero.instance.node.scaleX;
            }
            if(this.sk.animation == 'skill_shunyi+gongji'){
                Hero.instance.node.scaleX = -Hero.instance.node.scaleX;
            }

            if(this.sk.animation == 'skill_pd'){
                // Hero.instance.node.x -= 10;
                // Global.getInstance().deltaX -= 10;
            }

            // if(this.sk.animation == 'lose'){
            //     Hero.instance.afterDead();
            // }

            if(this.sk.animation == 'win'){
                // Hero.instance.afterDead();
                // Game.instance.onEnd(true);
                // BizarreAdventure.instance.onOpen(true);
                BizarreAdventure.instance.node.active = true;
            }

            if(this.fsm.can('stop')){
                this.fsm.stop();
            }
       });

       this.sk.setEventListener((track, event)=>{
        let ename: string = event.data.name;
        // cc.log('skevent',ename);
        if(ename == 'gongji1'){
            Global.getInstance().comboFlag = false;
            Hero.instance.attack();
        }
        if(ename == 'gongji2'){
            Global.getInstance().comboFlag = false;
            Global.getInstance().attackMove = false;
            Hero.instance.attack();
        }
        if(ename == 'gongji4' || ename == 'gongji5' || ename == 'gongji6'){
            Global.getInstance().attackMove = false;
            cc.director.emit('MapAction');
            if(ename == 'gongji5' && HeroGlobal.instance.MainHeroIndex == 0){
                Hero.instance.attackZYFinal();
            }

            if(ename == 'gongji6'){
                Hero.instance.attackZYFinal();
                // cc.director.emit('MapActionBase');
                AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.裂地);
            }
            // Hero.instance.attack();
        }

        if(ename == 'gongji_jianyu'){
            cc.log('寒冰风暴');
            this.scheduleOnce(()=>{
                AudioMgr.instance.playAudio(Global.getInstance().DCAudio.寒冰风暴);
            },.06);
            
            this.scheduleOnce(()=>{
                SkillMgr.instance.create('texiao_jianyu');
            }, .2);
        }

        // if(ename == 'gongji_pd_1')
        //     if(this.fsm.can('skill')){
        //         this.fsm.skill();
        //     }
        
        });

        /*
        fsm.current ：返回当前状态。
        * fsm.is(s) ：返回一个布尔值，表示状态s是否为当前状态。
        * fsm.can(e) ：返回一个布尔值，表示事件e是否能在当前状态触发。
        * fsm.cannot(e) ：返回一个布尔值，表示事件e是否不能在当前状态触发。
        callbacks:
        * onbeforeevent ：任一事件发生之前触发。例：onbeforeplay
        * onleavestate ：离开任一状态时触发。例：onleavegame
        * onenterstate ：进入任一状态时触发。例：onentergame
        * onafterevent ：任一事件结束后触发。例：onafterplay
        */
        // return;
        this.fsm = new StateMachine({
            init: 'state_stand',
            transitions: [
            { name: 'reset',    from: '*',  to: 'state_stand' },
            { name: 'move',     from: 'state_stand',  to: 'state_move' },
            { name: 'jump',     from: ['state_stand','state_move','state_attack','state_attack1','state_attack2',],  to: 'state_jump' },
            { name: 'attack',   from: 'state_jump',  to: 'state_jumpattack' },
            { name: 'attack',   from: ['state_stand','state_move'], to: 'state_attack'  },
            { name: 'attack',   from: ['state_attack'], to: 'state_attack1'  },
            { name: 'attack',   from: ['state_attack1'], to: 'state_attack2'  },
            { name: 'attack',   from: ['state_attack2'], to: 'state_attack'  },
            { name: 'heavy',    from: ['state_stand','state_move'], to: 'state_heavy'  },
            { name: 'spin',     from: ['state_stand','state_move'], to: 'state_spin'  },
            { name: 'double',   from: ['state_stand','state_move'], to: 'state_double'  },
            { name: 'ten',      from: ['state_stand','state_move'], to: 'state_ten'  },
            { name: 'skill',    from: ['state_stand','state_move','state_flash'], to: 'state_skill'  },
            { name: 'skill1',   from: ['state_stand','state_move'], to: 'state_skill1'  },
            { name: 'skill2',   from: ['state_stand','state_move'], to: 'state_skill2'  },
            // { name: 'skill3',   from: ['state_stand','state_move'], to: 'state_skill3'  },
            { name: 'flash',    from: ['state_stand','state_move','state_attack','state_attack1','state_attack2','state_skill','state_skill1','state_skill2',], to: 'state_flash'  },
            { name: 'block',    from: ['state_stand','state_move','state_attack','state_attack1','state_attack2','state_skill','state_skill1','state_skill2',], to: 'state_block'  },
            { name: 'stop',     from: ['state_attack','state_attack1','state_attack2','state_heavy','state_spin','state_double','state_skill','state_skill1','state_skill2','state_ten','state_move','state_hit','state_flash','state_jump','state_jumpattack','state_show','state_win'], to: 'state_stand'    },
            { name: 'hit',      from: ['state_attack','state_attack1','state_attack2','state_heavy','state_spin','state_double',/*'state_skill',*/'state_skill1','state_skill2','state_ten','state_move','state_stand','state_jump','state_jumpattack'], to: 'state_hit'    },
            { name: 'dead',     from: ['state_hit'/*,'state_heavy','state_ten'*/], to: 'state_dead'    },
            { name: 'show',     from: '*', to: 'state_show'    },
            { name: 'win',     from: '*', to: 'state_win'    },
            // { name: 'lose',     from: '*', to: 'state_lose'    },
            ],
            methods: {

                onLeaveStateAttack:()=>{
                    Global.getInstance().comboFlag = false;
                    // Global.getInstance().attackMove = false;
                },

                onLeaveStateAttack1:()=>{
                    Global.getInstance().comboFlag = false;
                    Global.getInstance().attackMove = false;
                },

                onLeaveStateAttack2:()=>{
                    Global.getInstance().comboFlag = false;
                    Global.getInstance().attackMove = false;
                },

                // onLeaveStateSkill(){
                //     // 
                //     Hero.instance.material.effect.setProperty('isFlash', 0.5);
                // },

                // onSkill:()=>{
                //     Hero.instance.material.effect.setProperty('isFlash', 1.1);
                // },

                onShow:()=>{
                    this.sk.setAnimation(0, 'show', false);
                },

                onWin:()=>{
                    this.sk.setAnimation(0, 'win', true);
                    // this.sk.setAnimation(0, 'victory', true);
                    AudioMgr.instance.stopBgm('game');
                    AudioMgr.instance.playAudio('Win');
                },

                onReset:()=>{
                    // cc.log('Reset');
                    this.sk.setAnimation(0, 'stay', true);
                    // Global.getInstance().audioMgr.stopAudio('walk');
                    AudioMgr.instance.stopAudio(Global.getInstance().ZYAudio.行走);
                },
                onMove:()=>{
                    // cc.log('Move');
                    this.sk.setAnimation(0, 'run', true);
                    this.finalList = 0;
                    // Global.getInstance().audioMgr.playAudio('walk');
                    AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.行走);
                },
                onJump:()=>{
                    // cc.log('Jump');
                    this.sk.setAnimation(0, 'jump_start', false);
                    this.jumpCount = 1;
                    // Global.getInstance().audioMgr.playAudio('jump');
                },

                // onJumpattack:()=>{
                //     cc.log('JumpAttack');
                //     this.playAuto('横扫',1);
                //     if(this.heroScript.Weapon == 9){
                //         Global.getInstance().audioMgr.playAudio('stick');
                //     }else{
                //         Global.getInstance().audioMgr.playAudio('sword');
                //     }   
                // },

                onAttack:()=>{
                    AudioMgr.instance.stopAudio(Global.getInstance().ZYAudio.行走);
                    // cc.log('Attack',this.fsm.state);
                    Global.getInstance().comboFlag = true;
                    if(this.fsm.is('state_attack')){
                        let ranTail: string = '';
                        // if(Math.random() < 0.5){
                        //     ranTail = '_2';
                        // }
                        this.sk.setAnimation(0, 'attack_a' + ranTail, false);
                        if(HeroGlobal.instance.MainHeroIndex == 2)
                        SkillMgr.instance.create('attack_a');
                        // cc.log('sdasdasdasfasf',ranTail);

                        if(HeroGlobal.instance.MainHeroIndex == 0)
                        AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.攻击1);
                    }
                    else if(this.fsm.is('state_attack1')){
                        let ranTail: string = '';
                        // if(Math.random() < 0.5){
                        //     ranTail = '_2';
                        // }
                        this.sk.setAnimation(0, 'attack_b' + ranTail, false);
                        if(HeroGlobal.instance.MainHeroIndex == 2)
                        SkillMgr.instance.create('attack_b');
                        if(HeroGlobal.instance.MainHeroIndex == 0)
                        AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.攻击2);
                        Global.getInstance().attackMove = true;
                    }
                    else if(this.fsm.is('state_attack2')){
                        let ranTail: string = 'attack_e';

                        if(Math.random() < 0.5){
                            ranTail = 'attack_f';
                        }
                        
                        // switch (this.finalList % 3) {
                        switch (Math.floor(Math.random() * 3)) {
                            case 0:
                                ranTail = 'attack_e';
                                if(HeroGlobal.instance.MainHeroIndex == 0)
                                AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.攻击3多段);
                                break;
                            case 1:
                                ranTail = 'attack_f';
                                if(HeroGlobal.instance.MainHeroIndex == 0)
                                AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.攻击3上挑);
                                break;
                            case 2:
                                ranTail = 'attack_g';
                                // Audio.instance.playAudio(Global.getInstance().ZYAudio.裂地);
                                break;
                            default:
                                break;
                        }
                        this.finalList ++;
                        if(HeroGlobal.instance.MainHeroIndex == 0){
                            this.sk.setAnimation(0, ranTail, false);
                        }else{
                            this.sk.setAnimation(0, 'attack_e', false);
                        }
                        
                        if(HeroGlobal.instance.MainHeroIndex == 2){
                            let attstr = 'attack_e';
                            
                            if(Math.random() < .5){
                                attstr = 'attack_c';
                                
                            }
                            SkillMgr.instance.create(attstr);
                        }
                        
                        Global.getInstance().attackMove = true;   
                        Hero.instance.attackFinal();
                    }
                    else if(this.fsm.is('state_jumpattack')){
                        this.sk.setAnimation(0, 'jump_middle_attack', true);
                        SkillMgr.instance.create('jump_middle_attack');
                        if(HeroGlobal.instance.MainHeroIndex == 0){
                            AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.攻击1);
                            this.jumpRotateCount = 3;
                        }else if(HeroGlobal.instance.MainHeroIndex == 1){
                            let actTime = 0.1;
                            if(this.node.y < -100) actTime = 0.3;
                            cc.log('actTime', actTime);
                            let act = cc.sequence(cc.moveTo(actTime, cc.v2(this.node.x, 60)), cc.callFunc(()=>{
                                AudioMgr.instance.playAudio(Global.getInstance().DCAudio.跳攻);
                                this.jumpRotateCount = 1;
                            }));
                            this.node.runAction(act);
                        }
                        
                    }
                },
                onHeavy:()=>{
                    cc.log('heavy');
                    
                },
                onSpin:()=>{
                    cc.log('spin');
                },
                onDouble:()=>{
                    cc.log('double');
                },

                onFlash:()=>{
                    cc.log('flash');
                    
                    this.scheduleOnce(()=>{
                        if(HeroFSM.instance.fsm.can('skill') && this.sk.animation == 'skill_shunyi+gongji'){
                            HeroFSM.instance.fsm.skill();
                            SkillMgr.instance.create('skill_shunyi+gongji');
                        }
                    }, .8);
                },
                onBlock:()=>{
                    cc.log('block');
                },
                // onSkill:()=>{
                //     cc.log('Skill');
                // },
                onSkill1:()=>{
                    
                },
                onSkill2:()=>{             
                    
                },
                
                onStop:()=>{
                    // cc.log('Stop');
                    Global.getInstance().comboFlag = false;
                    this.sk.setAnimation(0, 'stay', true);
                    AudioMgr.instance.stopAudio(Global.getInstance().ZYAudio.行走);
                },
                onHit:()=>{
                    // cc.log('Hit');
                    this.sk.setAnimation(0, 'hurt', true);
                    AudioMgr.instance.stopAudio(Global.getInstance().ZYAudio.行走);
                },
                onDead:()=>{
                    // cc.log('Dead');
                    this.sk.setAnimation(0, 'lose', true);
                    AudioMgr.instance.stopAudio(Global.getInstance().ZYAudio.行走);
                    // this.scheduleOnce(()=>{
                    //     AudioMgr.instance.stopBgm('game');
                    //     AudioMgr.instance.playAudio('Lose');
                    // }, 1.5);
                    Hero.instance.afterDead();
                },
            }
        });
    }

    // onLoad () {}

    start () {
        this.init();
    }

    //是否能跳
    canJump(): boolean{
        if(this.fsm.is('state_stand') || this.fsm.is('state_move')){
            return true;
        }else{
            return false;
        }
    }

    //攻击是否带击退
    canPushAway(): boolean{
        if(this.fsm.is('state_attack1') || this.fsm.is('state_attack2') || this.fsm.is('state_heavy') || this.fsm.is('state_spin')){
            return true;
        }else{
            return false;
        }
    }

    //判定是否是攻击状态
    isAttack(): boolean{
        if(this.fsm.is('state_attack') || this.fsm.is('state_attack1') || this.fsm.is('state_attack2')){
            return true;
        }else{
            return false;
        }
    }

    //判定是否是霸体状态
    isHyperArmor(): boolean{
        if(this.fsm.is('state_heavy') || this.fsm.is('state_ten') || this.fsm.is('state_attack2')){
            return true;
        }else{
            return false;
        }
    }

    //判断是否是多段攻击
    isMulti(): boolean{
        if(this.fsm.is('state_double') || this.fsm.is('state_ten')){
            return true;
        }else{
            return false;
        }
    }

    //判定胜利动画
    isWin(){
        if(this.fsm.is('state_win')){
            return true;
        }else{
            return false;
        }
    }

    update (dt) {

    }
}
