import StateMachine = require('../lib/state-machine.min.js');
import Monster from "./Monster";
import AudioMgr from '../Audio';
import Global from '../nativets/Global';
const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterFSM extends cc.Component {
    fsm: any;
    // LIFE-CYCLE CALLBACKS:
    skColor: any[] = [{a: 1, r: 0, g: 0, b: 0}, {a: 1, r: 0.4, g: 0.4, b: 0.4},
        {a: 1, r: 0.4, g: 0, b: 0}, {a: 1, r: 0.25, g: 0.31, b: 0.43},
        {a: 1, r: 0.4, g: 0, b: 0.2}, {a: 1, r: 1, g: 1, b: 1}];
    sk: sp.Skeleton;
    MonsterScript: Monster;
    hitTime: number = .25;
    material: any;
    DoubleIndex: number;
    
    // onLoad () {}

    init(){
        this.MonsterScript = this.node.getComponent(Monster);
        this.sk = this.node.getComponent(sp.Skeleton);
        this.material = this.node.getComponent(sp.Skeleton).getMaterial(0);
        this.sk.setCompleteListener(()=>{
            // cc.log('Sk_Complete');
            if(this.fsm.is('state_move') || this.fsm.is('state_stand')) return;
            if(this.fsm.is('state_bossmagic')){
                this.MonsterScript.bossMagicEnd();
            }  
            if(this.fsm.can('stop')){
                this.fsm.stop();
            }
             
            if(this.fsm.is('state_dead')){
                this.MonsterScript.recycle();
            }   
        });

        this.sk.setEventListener((track, event)=>{
            let ename: string = event.data.name;
            if(this.MonsterScript.isBoss){
                cc.log('Monsterskevent',ename);
            }
            
            if(ename == 'gongji_dao' || ename == 'gongji_qiang' || ename == 'gongji_shejian' || ename == 'gongji2' || ename == 'gongji_jingong' || ename == 'gongji' || ename == 'gongji1' || ename == '攻击'){
                this.MonsterScript.attack();
            }

            if(this.MonsterScript.type == 98 && ename == 'gongji2'){
                AudioMgr.instance.playAudio('CCSkill2');
            }

            if(this.MonsterScript.type == 99 && ename == 'gongji3'){
                AudioMgr.instance.playAudio('XXSkill3');
            }

            if(this.MonsterScript.type == 99 && ename == 'gongji2'){
                AudioMgr.instance.playAudio('XXSkill2');
            }

            if(ename == 'gongji_yuangong'){
                this.MonsterScript.berserkerAttack();
            }

            if(ename == 'gongji3'){
                if(this.DoubleIndex == 1){
                    this.DoubleIndex --;
                    this.MonsterScript.hitaoe.scaleX = 1;
                    AudioMgr.instance.playAudio('CCSkill3');
                }
                else if(this.DoubleIndex == 0){
                    this.MonsterScript.hitaoe.scaleX = -1;
                    this.DoubleIndex = null;
                    AudioMgr.instance.playAudio('CCSkill3');
                }

                this.MonsterScript.bossAttack();
            }
        });

        this.fsm = new StateMachine({
            init: 'state_stand',
            transitions: [
            { name: 'reset',     from: '*',  to: 'state_stand' },
            { name: 'move',     from: 'state_stand',  to: 'state_move' },
            { name: 'attack',   from: ['state_stand','state_move'], to: 'state_attack'  },
            { name: 'bossAttack',   from: ['state_stand','state_move'], to: 'state_bossattack'  },
            { name: 'bossDouble',   from: ['state_stand','state_move'], to: 'state_bossdouble'  },
            { name: 'bossMagic',   from: ['state_stand','state_move'], to: 'state_bossmagic'  },
            { name: 'lancerDash',   from: ['state_stand','state_move'], to: 'state_lancerdash'  },
            { name: 'dragonAttack',   from: ['state_stand','state_move'], to: 'state_dragonattack'  },
            { name: 'stop', from: ['state_attack','state_bossattack','state_bossdouble','state_bossmagic','state_lancerdash','state_dragonattack','state_move','state_hit','state_fall','state_show'], to: 'state_stand'    },
            
            { name: 'hit', from: ['state_attack','state_bossattack','state_bossdouble','state_bossmagic','state_lancerdash','state_dragonattack','state_move','state_stand','state_hit','state_fall','state_show'], to: 'state_hit'    },
            { name: 'fall', from: 'state_hit', to: 'state_fall'    },
            { name: 'dead', from: 'state_hit', to: 'state_dead'    },
            { name: 'show',     from: '*', to: 'state_show'    },
            ],
            methods: {  
                onShow:()=>{
                    this.playAuto('进场', 0);
                    
                    
                },
                onReset:()=>{
                    // cc.log('Reset');
                    // this.anim.play('monster_stand');
                    this.playAuto('站立',0);

                },
                onMove:()=>{
                    // cc.log('Move');
                    // this.anim.play('monster_move');
                    this.playAuto('跑',0);
                },
                onAttack:()=>{
                    // cc.log('Attack');
                    // this.anim.play('monster_attack');
                    this.playAuto('攻击',1);

                    // this.scheduleOnce(()=>{
                    //     this.MonsterScript.attack();
                    // }, this.hitTime);
                },
                // onBossAttack:()=>{
                //     // cc.log('BossAttack');
                //     // let arrs: string[] = ['攻击','二段','三段'];
                //     // let name: string = '攻击';
                //     // if(Math.random() < .4){
                //     //     name = '二段';
                //     //     cc.sun.audioMgr.playAudio('fire');
                //     // }
                //     // if(Math.random() < .2){
                //     //     name = '三段';
                //     //     cc.sun.audioMgr.playAudio('waterdragon');
                //     // }

                //     // this.playAuto(name,1);
                //     // setTimeout(() => {
                //     //     this.MonsterScript.bossAttack();
                //     // }, this.hitTime);

                // },

                onBossDouble:()=>{
                    this.playAuto('攻击3',1);
                    this.DoubleIndex = 1;
                },

                onBossMagic:()=>{
                    this.playAuto('技能1',1);
                    
                },

                // onLancerDash:()=>{
                //     this.playAuto('站立',0);
                //     if(this.MonsterScript.type == 4){
                //         this.schedule(()=>{
                //             this.MonsterScript.skillSwordDash();
                //         },0.1,1);
                //     }
                //     setTimeout(() => {
                //         // this.MonsterScript.bossAttack();
                //         // this.MonsterScript.bossMagic();
                //         if(this.fsm.can('stop')){
                //             this.fsm.stop();
                //         }
                //     }, 200);
                // },

                // onDragonAttack:()=>{
                //     let arrs: string[] = ['攻击','二段'];
                //     let name: string = '攻击';
                //     if(Math.random() < .5){
                //         name = '二段';
                //         // cc.sun.audioMgr.playAudio('fire');
                //     }else{
                        
                //     }

                //     this.playAuto(name,1);
                    
                //     setTimeout(() => {
                //         this.MonsterScript.dragonAttack();
                //         if(name == '攻击')
                //         cc.sun.audioMgr.playAudio('fire');
                //         if(name == '二段')
                //         cc.sun.audioMgr.playAudio('sword');
                //     }, this.hitTime);
                // },
                
                onStop:()=>{
                    // cc.log('Stop');
                    // this.anim.play('monster_stand');
                    this.playAuto('站立',0);
                },
                onHit:()=>{
                    // cc.log('Hit');
                    // this.anim.play('monster_hit');
                    this.playAuto('被攻击',1);
                    // this.node.color = cc.Color.RED;
                    // this.scheduleOnce(()=>{
                    //     this.node.color = cc.Color.WHITE;
                    // }, .6);

                    // if(this.MonsterScript.type == 4 || this.MonsterScript.type == 5){
                    //     this.material.effect.setProperty('isFlash', 1.1);
                    //     this.scheduleOnce(()=>{
                    //     this.material.effect.setProperty('isFlash', 0.5);
                    
                    // },.1);}
                },
                onFall:()=>{
                    // cc.log('Fall');
                    this.playAuto('击飞',1);
                    
                },
                onDead:()=>{
                    // cc.log('Dead');
                    this.playAuto('死亡',1);
                },
            }
        });
    }

    playAuto(name: string, time: number){
        if(this.MonsterScript.isBoss){
            switch (name) {
                case '进场':
                    name = '出场';
                    break;
                case '攻击':
                    name = '攻击2';
                    if(Math.random() < .2){
                        if(this.MonsterScript.type == 99){
                            name = '攻击3';
                        }
                        
                        if(this.MonsterScript.type == 98){
                            name = '攻击';
                            // AudioMgr.instance.playAudio('CCSkill2');
                        }

                        
                        
                    }
                    
                    if(this.MonsterScript.type == 97){
                        AudioMgr.instance.playAudio('XHDSkill1');
                        if(Math.random() < .2){
                            name = '攻击1';
                            AudioMgr.instance.playAudio('XHDSkill1');
                        }
                        
                        if(Math.random() >.8){
                            name = '攻击3';
                            AudioMgr.instance.playAudio('XHDSkill2');
                        }
                    }
                    break;
                case '跑':
                    name = '行走';
                    break;
                default:
                    break;
            }
        }else if(this.MonsterScript.type == 4 || this.MonsterScript.type == 5){
            switch (name) {
                case '攻击':
                    name = this.MonsterScript.type == 4 ? '近战' : '远攻';
                    if(this.MonsterScript.type == 4){
                        this.scheduleOnce(()=>{
                            AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.巨人攻击);
                        }, 1.2);
                        
                    }else{
                        AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.巨人滚石);
                    }
                    break;
                case '死亡':
                    AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.巨人死亡);
                    break;
                case '跑':
                    name = '走';
                    break;
                default:
                    break;
            }
        }else if(this.MonsterScript.type == 6){
            switch (name) {
                case '攻击':
                    name = 'attack';
                    AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.大象攻击);
                    break;
                case '跑':
                    name = 'run';
                    break;
                case '进场':
                    return;
                    break;
                case '站立':
                    name = 'idle';
                    break; 
                case '死亡':
                    name = 'die';
                    AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.大象死亡);
                    break; 
                case '被攻击':
                    name = 'get_hurt';
                    break; 
                default:
                    break;
            }
        }else if(this.MonsterScript.type == 7){
            switch (name) {
                case '攻击':
                    name = '攻击1';
                    AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.老鹰攻击);
                    break;
                case '死亡':
                    AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.老鹰死亡);
                    break;
                case '跑':
                    name = '飞行1';
                    break;
                case '进场':
                    return;
                    break;
                case '站立':
                    name = '飞行2';
                    break; 
            }
        }else if(this.MonsterScript.type == 8){
 
        }
        else{
            switch (name) {
                case '攻击':
                    name = 'attack';
                    break;
                case '死亡':
                    name = 'dead';
                    break;
                case '跑':
                    name = 'run';
                    break;
                case '进场':
                    name = 'show';
                    break;
                case '站立':
                    name = 'stand';
                    break; 
                case '被攻击':
                    name = 'hit';
                    break; 
            }
            name = this.MonsterScript.skstr + name;
            if(name == 'sword_attack'){
                AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.刀);
            }else if(name == 'spear_attack'){
                AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.枪);
            }else if(name == 'bow_attack'){
                AudioMgr.instance.playAudio(Global.getInstance().MonsterAudio.箭);
            }

        }
        this.sk.setAnimation(0, name, time == 0 ? true : false);
    }

    setSkin(skinName: string){
        this.sk.setSkin(skinName);
    }

    start () {

    }

    // update (dt) {}
}
