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

// const clipArrs1: string[] = ['ZYshow', 'DCshow', 'DQshow', 'BtnClick', 'CEUp', 'TopScroll', 'Eight'];       

// const clipArrs2: string[] = ['ZYattack1', 'ZYattack2', 'ZYattack3up', 'ZYattackmulti', 'ZYfalsh', 'ZYthunder', 'ZYsplitground', /*'ZYshow',*/ 'ZYfail', 'ZYultimate',
//                             /*'DCshow',*/ 'DCfail', 'DCultimate',
//                             /*'DQshow',*/ 'DQfail', 'DQultimate',
//                             'monsterSword', 'monsterLancer', 'monsterSkill', 'DCArrow', 
//                             'ZYhurt0', 'ZYhurt1', 'ZYhurt2', 
//                             'DChurt0', 'DChurt1', 'DChurt2', 
//                             'DQhurt0', 'DQhurt1', 'DQhurt2',
                            
//                             /*'BtnClick',*/ 'MonsterShow', 'addHp', 'MonsterDead', 'GetCoins', 'Typing', 'Win', 'Lose',
//                             'ZYpd', 'DCjudge', 'DCmulti',

//                             'Eleplantattack', 'Eleplantdead', 'Monsterfire', 'Monsterice', 'Giantstone', 'Giantdead', 'Giantroll', 'Eagleattack', 'Eagledead', 
//                             'ZYleidong', 'DCjianyu', 'monsterArrow',
//                             'DCjumpattack', 'DCattack3',
//                             /*'CEUp',*/ 'ArrowRain', 'BossWarn',

//                             'XHDSkill1', 'XHDSkill2', 'XHDSkill3',
//                             'CCSkill1', 'CCSkill2', 'CCSkill3',
//                             'XXSkill1', 'XXSkill2', 'XXSkill3',
                            
//                             'DQattack1','DQattack2','DQattack3','DQjumpattack','DQyanluo','DQliuxingyu','DQheidong','DQdibaotianxing',

//                             /*'TopScroll', //数字滚动
//                             'Eight',*/
//                             ];

@ccclass
export default class AudioGame extends cc.Component {
    static instance: AudioGame = null;

    @property({type: cc.AudioClip})
    audioArrs: cc.AudioClip[] = [];

    onLoad () {
        AudioGame.instance = this;
    }

    getClip(index: number){
        return this.audioArrs[index];
    }

    start () {

    }

    // update (dt) {}
}
