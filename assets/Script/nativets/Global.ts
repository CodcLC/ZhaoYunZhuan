export default class Global {
  
    static instance: Global = null;
    
    inGame: boolean = false;
    STATE = cc.Enum({
        // UP:1,
        // DOWN:2,
        LEFT:3,
        RIGHT:4,
        STOP:0,
    }) 

    MonsterAudio = cc.Enum({
        刀: 'monsterSword',
        枪: 'monsterLancer',
        箭: 'monsterArrow',
        魔法: 'monsterSkill',
        大象攻击: 'Eleplantattack', 
        大象死亡: 'Eleplantdead', 
        火:'Monsterfire',
        冰:'Monsterice', 
        巨人攻击:'Giantstone', 
        巨人死亡:'Giantdead', 
        巨人滚石:'Giantroll', 
        老鹰攻击:'Eagleattack', 
        老鹰死亡:'Eagledead'



    })

    ZYAudio = cc.Enum({
        攻击1: 'ZYattack1',
        攻击2:'ZYattack2',
        攻击3上挑: 'ZYattack3up',
        攻击3多段: 'ZYattackmulti',
        瞬移: 'ZYfalsh',
        雷击: 'ZYthunder',
        裂地: 'ZYsplitground',
        行走: 'walk',
        出场: 'ZYshow',
        失败:'ZYfail',
        大招:'ZYultimate',
        劈地: 'ZYpd',
        雷动九天: 'ZYleidong'
    })

    DCAudio = cc.Enum({
        // 攻击1: 'ZYattack1',
        // 攻击2:'ZYattack2',
        // 攻击3上挑: 'ZYattack3up',
        // 攻击3多段: 'ZYattackmulti',
        // 瞬移: 'ZYfalsh',
        // 雷击: 'ZYthunder',
        // 裂地: 'ZYsplitground',
        // 行走: 'walk',
        寒冰风暴: 'DCjianyu',
        多重箭: 'DCmulti',
        审判: 'DCjudge',
        出场: 'DCshow',
        失败:'DCfail',
        大招:'DCultimate',
        箭: 'DCArrow',
        跳攻: 'DCjumpattack',
        三段: 'DCattack3'
    })

    DQAudio = cc.Enum({
        // 攻击1: 'ZYattack1',
        // 攻击2:'ZYattack2',
        // 攻击3上挑: 'ZYattack3up',
        // 攻击3多段: 'ZYattackmulti',
        // 瞬移: 'ZYfalsh',
        // 雷击: 'ZYthunder',
        // 裂地: 'ZYsplitground',
        // 行走: 'walk',


        攻击1: 'DQattack1',
        攻击2: 'DQattack2',
        攻击3: 'DQattack3',
        跳攻: 'DQjumpattack',
        炎落斩: 'DQyanluo',
        流星雨: 'DQliuxingyu',
        黑洞: 'DQheidong',
        地爆天星: 'DQdibaotianxing',

        出场: 'DQshow',
        失败:'DQfail',
        大招:'DQultimate'
    })

    MoveState: number = 0;
    canMove: boolean = true;
    deltaX: number = 0;
    comboFlag: boolean = true;
    attackMove: boolean = false;
    canScrollLeft: boolean;
    canScrollRight: boolean;
    MapSplitWidth: number = 2160;
    MapLevelIndex: number = 0;
    MapLevelCount: number = 2;
    levelNext: boolean = false;
    HP: number;
    monsterCount: number = 0;

    isMapFocus: boolean = true;
    gameDifficulty: number = 0;
    unlockDifficulty: number = 0;
    nowLevel: number = 1;
    BgIndex: number;

    gravity: number = 4000;
    uuid: string = '';
    wxHead: string = '';
    wxName: string = '';
    wxOpenId: string = '';

    vivoHead: string = '';
    vivoName: string = '';

    registerName: string = '';
    registerHead: string = '';

    preBuff: boolean = false;
    ttAuthor: boolean = false;

    static getInstance(){
        if(!this.instance){
            this.instance = new Global();
        }
        return this.instance;
    }
}