import { save, load } from "./nativets/SaveMgr";
import HeroGlobal from "./Hero/HeroGlobal";
import Game from "./Game";
import Global from "./nativets/Global";
import AudioGame from "./AudioGame";

const {ccclass, property} = cc._decorator;
// const clipArrs: string[] = ['ZYattack1', 'ZYattack2', 'ZYattack3up', 'ZYattackmulti', 'ZYfalsh', 'ZYthunder', 'ZYsplitground', 'ZYshow', 'ZYfail', 'ZYultimate',
//                             'DCshow', 'DCfail', 'DCultimate',
//                             'DQshow', 'DQfail', 'DQultimate',
//                             'monsterSword', 'monsterLancer', 'monsterSkill', 'DCArrow', 
//                             'ZYhurt0', 'ZYhurt1', 'ZYhurt2', 
//                             'DChurt0', 'DChurt1', 'DChurt2', 
//                             'DQhurt0', 'DQhurt1', 'DQhurt2',
                            
//                             'BtnClick', 'MonsterShow', 'addHp', 'MonsterDead', 'GetCoins', 'Typing', 'Win', 'Lose',
//                             'ZYpd', 'DCjudge', 'DCmulti',

//                             'Eleplantattack', 'Eleplantdead', 'Monsterfire', 'Monsterice', 'Giantstone', 'Giantdead', 'Giantroll', 'Eagleattack', 'Eagledead', 
//                             'ZYleidong', 'DCjianyu', 'monsterArrow',
//                             'DCjumpattack', 'DCattack3',
//                             'CEUp', 'ArrowRain', 'BossWarn',

//                             'XHDSkill1', 'XHDSkill2', 'XHDSkill3',
//                             'CCSkill1', 'CCSkill2', 'CCSkill3',
//                             'XXSkill1', 'XXSkill2', 'XXSkill3',
                            
//                             'DQattack1','DQattack2','DQattack3','DQjumpattack','DQyanluo','DQliuxingyu','DQheidong','DQdibaotianxing',

//                             'TopScroll', //数字滚动
//                             'Eight',
//                             ];

const clipArrs1: string[] = ['ZYshow', 'DCshow', 'DQshow', 'BtnClick', 'CEUp', 'TopScroll', 'Eight'];       

const clipArrs2: string[] = ['ZYattack1', 'ZYattack2', 'ZYattack3up', 'ZYattackmulti', 'ZYfalsh', 'ZYthunder', 'ZYsplitground', /*'ZYshow',*/ 'ZYfail', 'ZYultimate',
                            /*'DCshow',*/ 'DCfail', 'DCultimate',
                            /*'DQshow',*/ 'DQfail', 'DQultimate',
                            'monsterSword', 'monsterLancer', 'monsterSkill', 'DCArrow', 
                            'ZYhurt0', 'ZYhurt1', 'ZYhurt2', 
                            'DChurt0', 'DChurt1', 'DChurt2', 
                            'DQhurt0', 'DQhurt1', 'DQhurt2',
                            
                            /*'BtnClick',*/ 'MonsterShow', 'addHp', 'MonsterDead', 'GetCoins', 'Typing', 'Win', 'Lose',
                            'ZYpd', 'DCjudge', 'DCmulti',

                            'Eleplantattack', 'Eleplantdead', 'Monsterfire', 'Monsterice', 'Giantstone', 'Giantdead', 'Giantroll', 'Eagleattack', 'Eagledead', 
                            'ZYleidong', 'DCjianyu', 'monsterArrow',
                            'DCjumpattack', 'DCattack3',
                            /*'CEUp',*/ 'ArrowRain', 'BossWarn',

                            'XHDSkill1', 'XHDSkill2', 'XHDSkill3',
                            'CCSkill1', 'CCSkill2', 'CCSkill3',
                            'XXSkill1', 'XXSkill2', 'XXSkill3',
                            
                            'DQattack1','DQattack2','DQattack3','DQjumpattack','DQyanluo','DQliuxingyu','DQheidong','DQdibaotianxing',

                            /*'TopScroll', //数字滚动
                            'Eight',*/
                            ];

const monsterClipArrs: string[] = ['monsterSword', 'monsterLancer', 'monsterSkill'];

@ccclass
export default class AudioMgr extends cc.Component {
    static instance: AudioMgr = null;

    @property({type: cc.AudioClip})
    audioArrs: cc.AudioClip[] = [];

    @property({type: cc.AudioClip})
    monsterAudioArrs: cc.AudioClip[] = [];

    @property({type: cc.AudioClip})
    menubgmclip: cc.AudioClip = null;

    @property({type: cc.AudioClip})
    gamebgmclip: cc.AudioClip = null;

    @property({type: cc.AudioClip})
    loadingclip: cc.AudioClip = null;


    @property({type: cc.AudioClip})
    walkclip: cc.AudioClip = null;

    // @property({type: cc.AudioClip})
    // btnclip: cc.AudioClip = null;

    // @property({type: cc.AudioClip})
    // monstershowclip: cc.AudioClip = null;

    bgm1: number = null;
    bgm2: number = null;
    BGvolume: number = 0.6;
    volume: number = 0.9;
    walk: number;
    showId: number;
    loaded: any;
    bgm3: number;
    firstId: number;
    loadBgm: boolean;

    // LIFE-CYCLE CALLBACKS:

    init(){
        cc.audioEngine.setFinishCallback(this.showId, ()=>{
            cc.log('effect stop');
        });
    }


    // onLoad () {}

    start () {
        AudioMgr.instance = this;
        // this.playBgm('game');
    }


    playBgm(bgname: string){
        // return;
        if(!HeroGlobal.instance.BgmSwitch){
            return;
        }
        // return
        // if(!this.loaded){
        //     this.loadSave();
        // }
        switch (bgname) {
            case 'menu':
                    if(this.bgm1 == null){
                        if(this.menubgmclip)
                        this.bgm1 = cc.audioEngine.play(this.menubgmclip,true,this.BGvolume); 
                    }
                break;
            case 'game':
                    if(this.bgm2 == null){
                        if(this.gamebgmclip){
                            this.bgm2 = cc.audioEngine.play(this.gamebgmclip,true,this.BGvolume); 
                        }else{
                            if(!this.loadBgm){
                                this.loadBgm = true;
                                cc.loader.loadRes('bgm/game_bgm', cc.AudioClip, (err, au)=>{
                                    this.gamebgmclip = au;
                                    this.bgm2 = cc.audioEngine.play(this.gamebgmclip,true,this.BGvolume);
                                    this.loadBgm = false;
                                });
                            }
                            
                        }
                        
                    }
                break;
            case 'loading':
                    if(this.bgm3 == null){
                        if(this.loadingclip)
                        this.bgm3 = cc.audioEngine.play(this.loadingclip,false,this.BGvolume); 
                    }
                break;
        
            default:
                break;
        }
        
    }

    stopBgm(bgname: string){
        // return;
        switch (bgname) {
            case 'menu':
                    if(this.bgm1 != null){
                        cc.audioEngine.stop(this.bgm1);
                        this.bgm1 = null; 
                    }
                break;
            case 'game':
                    if(this.bgm2 != null){
                        cc.audioEngine.stop(this.bgm2);
                        this.bgm2 = null; 
                    }
                break;

            case 'loading':
                    if(this.bgm3 != null){
                        cc.audioEngine.stop(this.bgm3);
                        this.bgm3 = null; 
                    }
                break;
        
            default:
                break;
        }
        
    }

    playAudio(clip: string){
        // return;
        if(!HeroGlobal.instance.EffectSwitch){
            if(clip == 'ZYfail' || clip == 'DCfail' || clip == 'DQfail'){
                this.scheduleOnce(()=>{
                    if(Game.instance.node){
                        this.stopBgm('game');
                        this.playAudio('Lose');
                        Game.instance.gameEndBg.active = true;
                        Game.instance.gameEndBox.active = true;
                    }
                }, 1.5);
                
            }
            

            if(clip == 'ZYshow' || clip == 'DCshow' || clip == 'DQshow'){
                if(Global.getInstance().inGame)
                this.scheduleOnce(()=>{
                    this.playBgm('game');
                }, 3);     
            }

            return;
        }
        if(clip == 'walk'){
            if(this.walkclip)
            this.walk = cc.audioEngine.play(this.walkclip, true, this.volume);
        }else{
            let index: number = clipArrs1.indexOf(clip);
            let Arrs = this.audioArrs;
            let ad = this.audioArrs[index];
            if(index == -1){

                index = clipArrs2.indexOf(clip);
                if(AudioGame.instance){
                    Arrs = AudioGame.instance.audioArrs;
                    ad = AudioGame.instance.getClip(index);
                }
                
                
                // console.log('playaudio', index, Arrs);
            }

            
            if(index != -1){
                // if(index == 7){
                if(clip == 'ZYshow' || clip == 'DCshow' || clip == 'DQshow'){
                    if(ad)
                    this.showId = cc.audioEngine.play(ad, false, this.volume);
                    // cc.log('showid', this.showId);
                    if(Global.getInstance().inGame)
                    cc.audioEngine.setFinishCallback(this.showId, ()=>{
                        // cc.log('effect stop');
                        this.playBgm('game');
                    });
                }else if(clip == 'ZYfail' || clip == 'DCfail' || clip == 'DQfail'){
                    if(ad)
                    this.showId = cc.audioEngine.play(ad, false, this.volume);
                    cc.audioEngine.setFinishCallback(this.showId, ()=>{
                        // cc.log('effect stop');
                        
                        if(Game.instance.node){
                            this.stopBgm('game');
                            this.playAudio('Lose');
                            Game.instance.gameEndBg.active = true;
                            Game.instance.gameEndBox.active = true;
                        }
                        
                    });
                }
                
                else{
                    if(ad)
                    cc.audioEngine.play(ad, false, this.volume);
                }
                
            }
        }  
            
    }

    stopAudio(clip: string){
        switch (clip) {
            case 'walk':
                    if(this.walk != null){
                        cc.audioEngine.stop(this.walk);
                        this.walk = null; 
                    }
                break;
        
            default:
                break;
        }
    }

    playFirst(clip: string){
        let index: number = clipArrs1.indexOf(clip);
        if(this.firstId){
            cc.audioEngine.stop(this.firstId);
        }
        if(index != -1){
            if(this.audioArrs[index])
            this.firstId = cc.audioEngine.play(this.audioArrs[index], false, this.volume);
        }
    }

    // setSFXVolume(v: number){
    //     if(this.volume != v){
    //         save("sfxVolume",v + '');
    //         this.volume = v;
    //     }
    // }

    // setBGMVolume(v: number){
    //     if(this.BGvolume != v){
    //         save("bgmVolume",v + '');
    //         this.BGvolume = v;
    //         if(this.bgm1 != null){
    //             cc.audioEngine.setVolume(this.bgm1,v);
    //         }
    //         if(this.bgm2 != null){
    //             cc.audioEngine.setVolume(this.bgm2,v);
    //         }
    //     }
    // }

    // setGameBgmVOlume(v: number){
    //     if(this.BGvolume != v){
    //         this.BGvolume = v;
    //         if(this.bgm2 != null){
    //             cc.audioEngine.setVolume(this.bgm2,v);
    //         }
    //     }
    // }

    // update (dt) {}
}
