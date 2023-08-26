import SkillMgr from "../SkillMgr";
import Hero from "./Hero";
import HeroFSM from "./HeroFSM";
import HeroGlobal from "./HeroGlobal";
import Game from "../Game";
import AudioMgr from "../Audio";
import Global from "../nativets/Global";
import { Skill, HeroSkillName } from "../nativets/Config";


const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroSkill extends cc.Component {

    hit: cc.Node;
    sk: sp.Skeleton;
    playing: boolean = false;
    bone: any;
    heroBone: any;
    hitaoe: cc.Node;
    hitjump: cc.Node;
    hitall: cc.Node;
    hitBox: cc.BoxCollider|cc.CircleCollider;
    hitaoeBox: cc.BoxCollider|cc.CircleCollider;
    hitallBox: cc.BoxCollider|cc.CircleCollider;
    isFollowHero: boolean;
    // LIFE-CYCLE CALLBACKS:

    init(){
        this.sk = this.node.getComponent(sp.Skeleton);
        this.hit = this.node.getChildByName('hit');
        this.hitBox = this.hit.getComponent(cc.BoxCollider);
        if(!this.hitBox){
            this.hitBox = this.hit.getComponent(cc.CircleCollider);
        }
        this.hitaoe = this.node.getChildByName('hitaoe');
        
        this.hitaoeBox = this.hitaoe.getComponent(cc.BoxCollider);
        if(!this.hitaoeBox){
            this.hitaoeBox = this.hitaoe.getComponent(cc.CircleCollider);
        }

        this.hitall = this.node.getChildByName('hitall');
        if(this.hitall){
            this.hitallBox = this.hitall.getComponent(cc.BoxCollider);
        }

        this.hitjump = this.node.getChildByName('hitjump');
        if(this.sk)
        this.sk.setCompleteListener(()=>{
            if(this.sk.animation == 'skill_guangbo'){
                this.hit.active = false;
            }
            this.stop();
        })
        this.isFollowHero = false;
        cc.director.on('GameStart', this.stop, this);
    }

    onLoad () {
        this.init();
    }

    play(anim: string){
        // this.node.position = Hero.instance.node.position;
        // this.node.scaleX = Hero.instance.node.scaleX;
        this.node.opacity = 255;
        if(this.sk)
        this.sk.setAnimation(0, anim, false);

        this.playing = true;
        

        switch (anim) {
            case 'skill_guangbo':
                this.hitBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                AudioMgr.instance.playAudio(Global.getInstance().DCAudio.审判);
                this.scheduleOnce(()=>{
                    this.hit.active = true;
                    this.bone = this.sk.findSlot('guangbo').bone;
                    this.hit.y = this.bone.worldY;
                }, .5);
                break;
            case 'attack_a':
            case 'attack_b':
                // this.hitBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                if(HeroGlobal.instance.MainHeroIndex == 2){
                // this.scheduleOnce(()=>{
                    AudioMgr.instance.playAudio(Global.getInstance().DQAudio.攻击1);
                    this.node.y += 20;
                    this.hit.active = true;
                    this.bone = this.sk.findBone('qiou');
                    if(this.bone && this.bone.worldY)
                    this.hit.y = this.bone.worldY;
                // }, .1);
                }
                
                break;
            case 'attack_c':
                // this.hitBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                if(HeroGlobal.instance.MainHeroIndex == 2){
                // this.scheduleOnce(()=>{
                    this.hit.active = true;
                    this.bone = this.sk.findBone('fenghuang');
                    AudioMgr.instance.playAudio(Global.getInstance().DQAudio.攻击3);
                    if(this.bone && this.bone.worldY)
                    this.hit.y = this.bone.worldY;
                // }, .1);
                }
                
                break;
            case 'attack_e':
                this.hitBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                if(HeroGlobal.instance.MainHeroIndex != 2){
                    this.scheduleOnce(()=>{
                        this.hit.active = true;
                        this.bone = this.sk.findSlot('arrow').bone;
                        this.hit.y = this.bone.worldY;
                    }, .1);
                }else{
                    AudioMgr.instance.playAudio(Global.getInstance().DQAudio.攻击2);
                    this.hit.active = true;
                    this.bone = this.sk.findBone('acttack_guangqiou');
                    if(this.bone && this.bone.worldY)
                    this.hit.y = this.bone.worldY;
                }
                
                break;
            case 'texiao_jianyu':
                this.hitaoeBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                this.scheduleOnce(()=>{
                    this.hitaoe.active = true;
                }, .3);
                break;    
            case 'skill_duochongjian':
                this.hitBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                AudioMgr.instance.playAudio(Global.getInstance().DCAudio.多重箭);
                this.hit.active = true;
                this.bone = this.sk.findBone('jianqi2');
                break; 
                
            case 'skill_shunyi+gongji':
                this.hitBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                this.node.opacity = 0;
                this.hit.active = true;
                this.hit.y = 20;
                this.heroBone = HeroFSM.instance.sk.findBone('jianqi');
                break;

            case 'jump_middle_attack':
                if(HeroGlobal.instance.MainHeroIndex == 1){
                    // this.node.opacity = 0;
                    this.hit.active = true;
                    this.hit.y = 20;
                    this.bone = this.sk.findBone('jianqi2');
                }else if(HeroGlobal.instance.MainHeroIndex == 2){
                    AudioMgr.instance.playAudio(Global.getInstance().DQAudio.跳攻);
                    this.hitjump.active = true;
                    this.isFollowHero = true;
                }else{
                    this.stop();
                }
                break;
                
                

            //赵云
            case 'skill_leidian':
               this.hitaoeBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                this.schedule(()=>{
                    this.hitaoe.active = true;
                    this.scheduleOnce(()=>{
                        this.hitaoe.active = false;
                    });
                    // AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.雷击);
                }, .2, 4, .7);
                this.schedule(()=>{
                    AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.雷击);
                }, .2, 4, 0.9);
                    // this.scheduleOnce(()=>{
                    //     this.hitaoe.active = true;
                    // }, .7);
                    this.scheduleOnce(()=>{
                        this.stop();
                    }, 1.6);
                break;
            case 'skill_leidongjiutian':
                this.hitaoeBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                this.schedule(()=>{
                    this.hitaoe.active = true;
                    this.scheduleOnce(()=>{
                        this.hitaoe.active = false;
                    });

                }, .2, 4, 1.5);

                this.scheduleOnce(()=>{
                    AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.雷动九天);
                }, 1);
                    // this.scheduleOnce(()=>{
                    //     this.hitaoe.active = true;
                    // }, .7);
                    this.scheduleOnce(()=>{
                        // Audio.instance.playAudio(Global.getInstance().ZYAudio.攻击3多段);
                        this.stop();
                    }, 1.6);
                // let arrs: number[] = [-45, -10, 10, 40];
                // let i: number = 0;
                // this.hitjump.active = true;
                // this.schedule(()=>{
                //     // this.hitaoe.active = true;
                //     // this.scheduleOnce(()=>{
                //     //     this.hitaoe.active = false;
                //     // });
                //     this.hitjump.angle = -arrs[i];
                //     i ++;
                // }, .2, 4,);

                //     // this.scheduleOnce(()=>{
                //     //     this.hitaoe.active = true;
                //     // }, .7);
                //     this.scheduleOnce(()=>{
                //         this.stop();
                //     }, 1);
                break;

            case 'skill_pd':
                // let index = HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim);
                // let dmg = this.getDmgByIndex(index);
                // if(!dmg){
                //     dmg = 0;
                // }
                this.hitBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                // this.hit.active = true;
                AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.劈地);
                this.scheduleOnce(()=>{
                    this.hit.active = true;
                }, .7);
                this.scheduleOnce(()=>{
                    // this.hit.active = false;
                    this.stop();
                }, .72);
                break;

            case 'skill_shunyi':
                
                this.hitBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.瞬移);
                Hero.instance.hitbody.active = true;
                this.scheduleOnce(()=>{
                    Hero.instance.hitbody.active = false;
                    this.stop();
                }, .8);
                // this.hit.y = 20;
                break;

            //大乔
            case 'skill_dipotianxing':
                // this.scheduleOnce(()=>{
                //     this.hitaoe.active = true;
                //     this.scheduleOnce(()=>{
                //         this.stop();
                //     })
                // }, 2.4);
                AudioMgr.instance.playAudio(Global.getInstance().DQAudio.地爆天星);
                this.hitallBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                this.node.y = -200;
                this.schedule(()=>{
                    this.hitall.active = true;
                    this.scheduleOnce(()=>{
                        this.hitall.active = false;
                    });

                }, .2, 8, 1.2);
                this.scheduleOnce(()=>{
                    Game.instance.node.getChildByName('bg').x = cc.find('Canvas').getChildByName('heroCamera').x;
                    Game.instance.node.getChildByName('bg').active = true;
                    this.scheduleOnce(()=>{
                        Game.instance.node.getChildByName('bg').active = false;
                    }, 2);
                }, 1.5);
                break;
            case 'skill_heidong':
                    AudioMgr.instance.playAudio(Global.getInstance().DQAudio.黑洞);
                    this.hitallBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                    this.node.y = -200;
                    this.schedule(()=>{
                        this.hitall.active = true;
                        this.scheduleOnce(()=>{
                            this.hitall.active = false;
                        });
    
                    }, .2, 4, 1.5);
                    this.scheduleOnce(()=>{
                        Game.instance.node.getChildByName('bg').x = cc.find('Canvas').getChildByName('heroCamera').x;
                        Game.instance.node.getChildByName('bg').active = true;
                        this.scheduleOnce(()=>{
                            Game.instance.node.getChildByName('bg').active = false;
                        }, 1);
                    }, 1.2);
                break;
            case 'skill_liuxingyu':
                    // this.schedule(()=>{
                    //     this.hitaoe.active = true;
                    //     this.scheduleOnce(()=>{
                    //         this.hitaoe.active = false;
                    //     });
                    // }, .4, 4, .8);
                    // this.scheduleOnce(()=>{
                    //     this.stop();
                    // }, 2.5);
                    // this.scheduleOnce(()=>{
                    //     Game.instance.node.getChildByName('bg').x = cc.find('Canvas').getChildByName('heroCamera').x;
                    //     Game.instance.node.getChildByName('bg').active = true;
                    //     this.scheduleOnce(()=>{
                    //         Game.instance.node.getChildByName('bg').active = false;
                    //     }, 2);
                    // }, 1.5);
                    AudioMgr.instance.playAudio(Global.getInstance().DQAudio.流星雨);
                    this.hitaoeBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                    this.node.y = -200;
                    // AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.劈地);
                    // this.scheduleOnce(()=>{
                    //     this.hitaoe.active = true;
    
                    //     // cc.log(this.hitaoe.position, this.node.position);
                    //     this.scheduleOnce(()=>{
                    //         this.stop();
                    //     });
                    // }, 1.1);

                    this.schedule(()=>{
                        this.hitaoe.active = true;
                        this.scheduleOnce(()=>{
                            this.hitaoe.active = false;
                        });
                    }, .15, 7, 1.1);

                break;
            case 'skill_yanlouzhan':
                this.scheduleOnce(()=>{
                    AudioMgr.instance.playAudio(Global.getInstance().DQAudio.炎落斩);
                }, .5);
                
                this.hitaoeBox.tag = this.getDmgByIndex(HeroSkillName[HeroGlobal.instance.MainHeroIndex].indexOf(anim));
                this.node.y = -200;
                // AudioMgr.instance.playAudio(Global.getInstance().ZYAudio.劈地);
                this.scheduleOnce(()=>{
                    this.hitaoe.active = true;

                    // cc.log(this.hitaoe.position, this.node.position);
                    this.scheduleOnce(()=>{
                        this.stop();
                    });
                }, .7);
                

                // this.scheduleOnce(()=>{
                //     this.stop();
                // }, 2);
                break;
            default:
                break;
        }
    }

    stop(){
        if(!this.hit) return;
        // this.node.opacity = 0;
        this.hit.active = false;
        this.hitaoe.active = false;
        this.isFollowHero = false;
        if(this.hitjump)
        this.hitjump.active = false;
        if(this.hitall)
        this.hitall.active = false;
        this.playing = false;
        this.hitBox.tag = 0;
        this.hitaoeBox.tag = 0;
        this.bone = null;
        this.heroBone = null;
        if(this.node.name == 'dceffect'){
            SkillMgr.instance.getSkillPool(1).put(this.node);
        }else if(this.node.name == 'zyeffect'){
            SkillMgr.instance.getSkillPool(0).put(this.node);
        }else{
            SkillMgr.instance.getSkillPool(2).put(this.node);
        }
        
    }

    start () {

    }

    getDmgByIndex(index: number){
        let zyJson: any = Skill[HeroGlobal.instance.MainHeroIndex * 7 + index];
        let sLv = HeroGlobal.instance.HeroDataArrs[HeroGlobal.instance.MainHeroIndex].SkillArrs[index];
        let dmg = parseFloat(zyJson.dmg) + parseFloat(zyJson.dmgup) * sLv;
        if(dmg)
        return dmg;
        else
        return 0;
    }

    update (dt) {
        if(this.playing){
            if(this.bone){
                this.hit.x = this.bone.worldX;
                this.hit.y = this.bone.worldY;
            }
            if(this.heroBone){
                this.hit.x = this.heroBone.worldX;
                if(this.hit.x < -1500){
                    this.stop();
                }
            }
            if(this.isFollowHero){
                this.node.x = Hero.instance.node.x + (Hero.instance.node.scaleX > 0 ? 200 : -200);
            }
        }
    }

    onDestroy(){
        cc.director.off('GameStart', this.stop, this);
    }
}
