import Global from "./nativets/Global";
import TextureMgr from "./TextureMgr";
import { HeroName } from "./nativets/Config";
import HeroFSM from "./Hero/HeroFSM";
import AudioMgr from "./Audio";
import HeroGlobal from "./Hero/HeroGlobal";
import MonsterNodePool from "./Monster/MonsterNodePool";
import Game from "./Game";
import Main from "./Main";
import Hero from "./Hero/Hero";
import Box from "./Map/Box";

const {ccclass, property} = cc._decorator;

const ACTIONSSPEED: number = 0.04;

const NAME1: string[] = ['赵云', '貂蝉', '大乔', '夏侯惇', '曹操', '许褚'];
const NAME2: string[] = ['步兵', '枪兵', '狂战士', '狂战士', '方术师', '方术师'];

// iconIndex:
// 1: 赵云
// 2：貂蝉
// 3：大乔
// 4：夏侯惇
// 5：曹操
// 6：许褚
// 11：步兵
// 12：枪兵
// 13：狂战士近战
// 14：狂战士远攻
// 16：方术红
// 17：方术紫

let dirData = [[{isLeft: true, iconIndex: 1, text: '这是哪里我又穿越了么'},
                {isLeft: false, iconIndex: 3, text: '将军，欢迎来到火柴人三国的世界，光复汉室的使命全靠你了'},
                {isLeft: false, iconIndex: 1, text: '前方有一波黄巾贼，请将军小心'},
                {isLeft: true, iconIndex: 1, text: '好啦好啦，我知道了'},
				{isLeft: true, iconIndex: 1, text: '（点击攻击按钮可以攻击前方敌人，长按攻击可以连招，对敌人造成更多伤害）'}
                ],
                [{isLeft: true, iconIndex: 3, text: '将军小心，前方有敌人的弓箭手埋伏，注意优先攻击敌人远程单位喔'},
                {isLeft: false, iconIndex: 3, text: '嗯'}],

                [{isLeft: true, iconIndex: 3, text: '前方出现叛军将领，消灭他可以获得额外奖励喔'},
                {isLeft: false, iconIndex: 3, text: '我知道了'}]
            ];

            let testData = [{
                level: 1,    
				data1:[{isLeft: true, iconIndex: 0, text: '这是哪里,又穿越了么-_-'},
                {isLeft: false, iconIndex: 3, text: '将军,欢迎来到火柴人三国,光复汉室靠您了^ ^'},
				{isLeft: false, iconIndex: 1, text: '前方有一波黄巾贼，请将军小心'},
                {isLeft: true, iconIndex: 1, text: '好啦好啦，我知道了'},
				{isLeft: true, iconIndex: 1, text: '（点击攻击按钮可以攻击前方敌人，长按攻击可以连招，对敌人造成更多伤害）'}],	
                data4:[{isLeft: false, iconIndex: 11,text: '将军饶命，我只是出来打酱油的'},
                {isLeft: false, iconIndex: 11,text: '这是我多年珍藏，将军您挑一件，放过我吧>.<'},
                {isLeft: true, iconIndex: 0,text: '我看一看（小孩子才做选择题！）'}]			
                },       
                {
                level: 2, 
				data1:[
	     	    {isLeft: false, iconIndex: 3, text: '前方有黄巾贼弓箭手,请将军小心'},
                 {isLeft: true, iconIndex: 1, text: '好啦好啦,我会的'}],	
				data2:[{isLeft: true, iconIndex: 3, text: '洞穴内会有宝箱和更强的敌人,风险和机遇共存喔'},
                {isLeft: false, iconIndex: 1, text: '好的'}],
                 data4:[{isLeft: false, iconIndex: 3,text: '真的有宝箱掉落，快选一件吧~'},
                {isLeft: true, iconIndex: 0,text: '弱水三千，我只取一瓢'}]					
                },
				{
                level: 3, 
				data1:[{isLeft: true, iconIndex: 3, text: '小心前方的巨人,注意拉开距离喔'},
                {isLeft: false, iconIndex: 1, text: '（使用技能可以远程消耗敌人）'}],
                data4:[{isLeft: false, iconIndex: 12,text: '将军威武！这些都是营长的宝物，将军您看下'},
                {isLeft: true, iconIndex: 0,text: '(都拿了不太好吧。。）'},
                ]
				
                },
				{
                level: 4, 
				data2:[{isLeft: true, iconIndex: 3, text: '小心空中单位,试试跳跃加攻击的连招吧'},
                {isLeft: false, iconIndex: 0, text: '听起来不错'}],
                 data4:[{isLeft: false, iconIndex: 3,text: '又有宝箱掉落，快选一件吧~'},
                {isLeft: true, iconIndex: 0,text: '（注意形象，不能全拿了）'}]					
                },
                {				
                level: 5, 
				data2:[{isLeft: false, iconIndex: 4, text: '阁下何人,胆敢闯我营地'},
                {isLeft: true, iconIndex: 0, text: '曹操荒淫无道,切勿助纣为虐！'},
		     	{isLeft: false, iconIndex: 4, text: '废话少说,吃我一枪！'}
				],
                data4:[{isLeft: false, iconIndex: 4,text: '功夫不错，跟随主公吧，这些全是你的'},
                {isLeft: true, iconIndex: 0,text: '（我才不要呢。。）'}]					
                },
				{
                level: 6, 
				data4:[{isLeft: false, iconIndex: 16,text: '放过老朽吧，我只是一个江湖术士'},
                {isLeft: true, iconIndex: 0,text: '助纣为虐，该死！'},
                {isLeft: false, iconIndex: 11,text: '将军饶命！我全部家当在此！'},
                {isLeft: true, iconIndex: 0,text: '（不骗人，那有这么多家当。。）'}
				]	         
                },
				{
                level: 7, 
				data4:[{isLeft: false, iconIndex: 3, text: '宝箱！'},
				{isLeft: true, iconIndex: 0, text: '嗯哼'},
				]	         
                },
                {
				level: 8, 
				data4:[{isLeft: false, iconIndex: 16,text: '将军威武！宝物奉上！'},
                {isLeft: true, iconIndex: 0,text: '（我就看看。。）'}
				]	         
                },
				{
                level: 9, 
				data4:[{isLeft: false, iconIndex: 3, text: '宝箱！！'},
				{isLeft: true, iconIndex: 0, text: '（运气也太好了吧！）'}
				]	         
                },
				{
                level: 10, 
				data3:[{isLeft: false, iconIndex: 4, text: '又是你,可敢与俺大战三百回合！！'},
				{isLeft: true, iconIndex: 0, text: '阁下的首级,我就收下了！'},
				],
                data4:[{isLeft: false, iconIndex: 4, text: '好武功！你再考虑一下！！'},
				{isLeft: true, iconIndex: 0, text: '....'},
				]				
                },
				{
                level: 11, 
				data2:[{isLeft: false, iconIndex: 3, text: '前面是什么动物！这也太大了'},
				{isLeft: true, iconIndex: 0, text: '（...居然有大象,小心点）'},
				],
	            data4:[{isLeft: false, iconIndex: 3, text: '哇！！宝箱！！'},
				{isLeft: true, iconIndex: 0, text: '（嘿嘿！）'},
				]				
                },
				{
                level: 12, 
				data4:[{isLeft: false, iconIndex: 16,text: '将军。。我其实是卧底'},
                {isLeft: true, iconIndex: 0,text: '（怎么又是你）'},
                {isLeft: false, iconIndex: 11,text: '我。。给宝。。'},
                {isLeft: true, iconIndex: 0,text: '（。。。。。）'},
				]	         
                },
                {
				level: 13, 
	            data4:[{isLeft: false, iconIndex: 3, text: '哇！！宝箱！！'},
				{isLeft: true, iconIndex: 0, text: '（嘿嘿！）'},
				]				
                },
                {
				level: 14, 
				data4:[{isLeft: false, iconIndex: 12,text: '我上有老下有小。。'},
                {isLeft: true, iconIndex: 0,text: '（我就听听。。）'}
				]	         
                },
				{
                level: 15,  // 貂蝉解锁boss
				data3:[
				{isLeft: false, iconIndex: 6, text: '你这矮子，吃俺一锤！'},
				{isLeft: true, iconIndex: 0, text: '休得猖狂！'}
				],
				data4:[{isLeft: false, iconIndex: 6, text: '好本事，你这朋友俺交了！'},
				{isLeft: true, iconIndex: 0, text: '（一言不合就送装备？？）'}
				]				
                },
				{
                level: 16, 
				data4:[{isLeft: false, iconIndex: 11,text: '将军.不要！'},
                {isLeft: true, iconIndex: 0,text: '（。。。。。）'}
				]	         
                },
                {
				level: 17, 
	            data4:[{isLeft: false, iconIndex: 3, text: '哇！！宝箱！！'},
				{isLeft: true, iconIndex: 0, text: '（我果然是主角！）'}
				]				
                },
                {
				level: 18, 
				data4:[{isLeft: true, iconIndex: 0,text: '宝物呢'},
				{isLeft: false, iconIndex: 12,text: '-_-'}
				]	         
                },
                {
				level: 19, 
	            data4:[{isLeft: false, iconIndex: 3, text: '(又是宝箱。。)'},
				{isLeft: true, iconIndex: 0, text: '（嘿嘿）'}
				]				
                },
                {
                level: 20, 
				data3:[{isLeft: true, iconIndex: 0, text: '许褚！莫要愚忠,曹操已经入魔了！'},
				{isLeft: false, iconIndex: 6, text: '...,誓死追随主公！'},
				{isLeft: false, iconIndex: 6, text: '杀！！'}
				],
               data4:[{isLeft: false, iconIndex: 6, text: '你们不是主公的对手，拿上这些装备，快点逃吧'},
				{isLeft: true, iconIndex: 0, text: '。。。'}
				]				
                },
                {
				level: 21, 
	            data4:[
				{isLeft: true, iconIndex: 0, text: '^_^'}
				]				
                },
                {
				level: 22, 
				data4:[{isLeft: true, iconIndex: 0,text: '宝物'},
				{isLeft: false, iconIndex: 12,text: '-_-'},
				]	         
                },
                {
				level: 23, 
	            data4:[{isLeft: false, iconIndex: 3, text: '(有毒吧。。)'},
				{isLeft: true, iconIndex: 0, text: '-_-'},
				]				
                },	
                {
				level: 24, 
				data4:[{isLeft: true, iconIndex: 0,text: '宝!'},
				{isLeft: false, iconIndex: 12,text: '-_-'},
				]	         
                },				
                {	
                level: 25, // 小乔解锁boss
				data4:[{isLeft: false, iconIndex: 4, text: '请劝主公回头'},
				{isLeft: true, iconIndex:0, text: '我会的！'}
				]	    				
                },
                {
				level: 26, 
				data4:[{isLeft: false, iconIndex: 12,text: '太倒霉了，每次都遇到这个灾星'},
				{isLeft: true, iconIndex: 0,text: '嘿嘿'}
				]	         
                },
                {
				level: 27, 
	            data4:[{isLeft: false, iconIndex: 3, text: '这个箱子貌似还不错'},
				{isLeft: true, iconIndex: 0, text: '嘿'}
				]				
                },	
                {
				level: 28, 
				data4:[{isLeft: true, iconIndex: 0,text: '嘿嘿!'},
				{isLeft: false, iconIndex: 12,text: '我自己来'}
				]	         
                },
                {	
				level: 29, 
	            data4:[
				{isLeft: true, iconIndex: 0, text: '(出点好货吧！）'}
				]				
                },					
				{
                level: 30, 
				data3:[{isLeft: true, iconIndex: 3, text: '夏侯惇！邪不胜正,停手吧！'},
				{isLeft: false, iconIndex: 5, text: '呵呵！'},
				],
				data4:[{isLeft: false, iconIndex: 5, text: '...只有你们能阻止主公了..'},
				{isLeft: false, iconIndex: 1, text: '安息吧！'},
				],	    				
                },
                {
				level: 31, 
	            data4:[{isLeft: false, iconIndex: 3, text: '666'},
				{isLeft: true, iconIndex: 0, text: '嘿嘿'}
				]				
                },	
                {
				level: 32, 
				data4:[{isLeft: true, iconIndex: 0,text: '嘿嘿!'},
				{isLeft: false, iconIndex: 12,text: '我自己来'}
				]	         
                },	
                {
				level: 33, 
	            data4:[
				{isLeft: true, iconIndex: 0, text: '（出点好货吧！）'}
				]				
                },
                {
				level: 32, 
				data4:[
				{isLeft: false, iconIndex: 12,text: '将军威武，曹贼就在前面'},
				{isLeft: true, iconIndex: 0,text: '（要小心了）'}
				]	         
                },				
				{
                level: 35, 
				data3:[{isLeft: false, iconIndex: 5, text: '不错！你们居然能到这里！'},
				{isLeft: false, iconIndex: 5, text: '来助我吧！朕封你们一方诸侯！'},
				{isLeft: true, iconIndex: 0, text: '...'},
				{isLeft: true, iconIndex: 0, text: '...'},
				],
				data4:[{isLeft: false, iconIndex: 5, text: '呵呵！居然能接我一招,你们在考虑下'},
				{isLeft: true, iconIndex: 0, text: '曹贼休走'}
				]	    				
                },
                {
				level: 36, 
	            data4:[
				{isLeft: true, iconIndex: 0, text: '（人品爆发吧！）'}
				]				
                },
                {
				level: 37, 
				data4:[
				{isLeft: false, iconIndex: 17,text: '老朽一点心意，将军务必笑纳！'},
				{isLeft: true, iconIndex: 0,text: '（给老人家留点吧）'}
				]	         
                },
                {
				level: 38, 
	            data4:[
				{isLeft: true, iconIndex: 0, text: '（试试新的开箱大法！）'}
				]				
                },
                {
				level: 39, 
				data4:[
				{isLeft: false, iconIndex: 16,text: '将军，曹操背后的魔气像是有人操作'},
				{isLeft: false, iconIndex: 16,text: '老朽一点心意，将军务必笑纳！'},
				{isLeft: true, iconIndex: 0,text: '（是有点可疑）'}
				]	         
                },				
				{
                level: 40,                      
				data3:[{isLeft: false, iconIndex: 5, text: '子龙,朕甚惜才！随朕,整个蜀地封于你！！'},
				{isLeft: true, iconIndex: 0, text: '...'}
				],
				data4:[{isLeft: true, iconIndex: 0, text: '魔气已经消失！'},
				{isLeft: false, iconIndex: 5, text: '是我执念太深,小心左慈！'},
				{isLeft: true, iconIndex: 0, text: '不！！'},
				{isLeft: false, iconIndex: 5, text: '..(曹操已经自尽）'},
				{isLeft: false, iconIndex: 3, text: '走吧,幕后主谋另有其人！'}
				]		
                }
              ];		
								
				
			

@ccclass
export default class Director extends cc.Component {
    static instance: Director = null;

    @property(cc.Prefab)
    monsterPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    berserkerPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    fangshuPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    boxPrefab: cc.Prefab = null;

    leftIcon: cc.Sprite;
    rightIcon: cc.Sprite;
    index: number;
    right: cc.Node;
    left: cc.Node;
    leftLabel: cc.Label;
    rightLabel: cc.Label;
    count: number;
    data: { isLeft: boolean; iconIndex: number; text: string; }[];
    leftName: cc.Label;
    rightName: cc.Label;
    needWin: boolean;
    textLength: number;
    subText: string;
    tindex: number;
    originText: string;
    tLabel: cc.Label;
    gen: any;
    openLv: number;
    openIndex: number;

    // LIFE-CYCLE CALLBACKS:



    init(){
        Director.instance = this;
        this.left = this.node.getChildByName('left');
        this.right = this.node.getChildByName('right');
        this.leftIcon = this.left.getChildByName('icon').getComponent(cc.Sprite);
        this.rightIcon = this.right.getChildByName('icon').getComponent(cc.Sprite);
        this.leftLabel = this.left.getChildByName('text').getComponent(cc.Label);
        this.rightLabel = this.right.getChildByName('text').getComponent(cc.Label);
        this.leftName = this.left.getChildByName('name').getComponent(cc.Label);
        this.rightName = this.right.getChildByName('name').getComponent(cc.Label);
    }

    // onLoad () {}

    start () {

    }

    onOpen(lv: number, index: number){
        this.openLv = lv;
        this.openIndex = index;
        Global.getInstance().MoveState = 0;
        // return;
        this.needWin = false;
        let dirData = this.getDataByLv(lv);
        if(!dirData){
            if(!Global.getInstance().inGame)
            Global.getInstance().inGame = true;
            if(index == 3){
                if(HeroFSM.instance.fsm.can('win')){
                    HeroFSM.instance.fsm.win();
                }
            }
            return;
        }
        this.data = null;
        switch (index) {
            case 0:
                if(dirData.data1){
                    this.data = dirData.data1;
                }
                break;
            case 1:
                if(dirData.data2){
                    this.data = dirData.data2;
                }
                break;
            case 2:
                if(dirData.data3){
                    this.data = dirData.data3;
                }
                break;
            case 3:
                if(dirData.data4){
                    this.data = dirData.data4;
                    this.needWin = true;
                }else{
                    if(HeroFSM.instance.fsm.can('win')){
                        HeroFSM.instance.fsm.win();
                    }
                }
                break;
            default:
                break;
        }
        if(!this.data){
            if(!Global.getInstance().inGame)
            Global.getInstance().inGame = true;
            return;
        }
        Global.getInstance().inGame = false;
        // this.data = dirData[index];
        this.index = 0;
        this.count = this.data.length;
        this.showDialog();
        this.node.active = true;
    }

    showType(type: number){
        switch (type) {
            case 2:
                let data = this.getDataByLv(Global.getInstance().nowLevel);
                let iconIndex = data.data4[0].iconIndex;

                // MonsterNodePool.instance.create(1100, Hero.instance.node.position);
                // this.scheduleOnce(()=>{
                //     this.onOpen(Global.getInstance().nowLevel, 3);
                // }, 2);
                this.showRewardMonster(iconIndex);
                break;
            case 1:
                // MonsterNodePool.instance.create(1100, Hero.instance.node.position);
                // this.scheduleOnce(()=>{
                //     this.onOpen(Global.getInstance().nowLevel, 3);
                // }, 2);
                // this.showRewardMonster(iconIndex);
                this.showRewardBox();
                break;
            case 3:
                this.onOpen(Global.getInstance().nowLevel, 3);
                break;
            default:
                break;
        }
    }

    // 11：步兵
    // 12：枪兵
    // 13：狂战士近战
    // 14：狂战士远攻
    // 16：方术红
    // 17：方术紫

    showRewardMonster(id: number){
        let m: cc.Node = null;
        switch (id) {
            case 11:
            case 12:
                m = cc.instantiate(this.monsterPrefab);
                break;
            case 13:
            case 14:
                m = cc.instantiate(this.berserkerPrefab);
                break;
            case 17:
            case 16:
                m = cc.instantiate(this.fangshuPrefab);
                break;  
            default:
                this.onOpen(Global.getInstance().nowLevel, 3);
                return;
                break;
        }

        // m = cc.instantiate(this.monsterPrefab);
        m.parent = Game.instance.gameEventNode;
        m.position = cc.v2(Main.instance.heroCamera.x + cc.winSize.width * 0.5, -192);
        if(Hero.instance.node.x < m.x){
            m.scaleX *= -1;
        // }else{
        //     m.scaleX = 0.4;
        }
        let sk = m.getComponent(sp.Skeleton);
        let strhead: string = '';
        switch (id) {
            case 11:
                strhead = 'sword_';
                break;
            case 12:
                strhead = 'spear_';
                break;
            case 13:
                sk.setSkin('001_近战');
                break;
            case 14:
                sk.setSkin('001_远攻');
                break;
            case 17:
                sk.setSkin('001_冰');
                
                break;
            case 16:
                sk.setSkin('002_火');
                
                break;
            default:
                break;
        }
        
        let animShow = strhead == '' ? '进场' : 'show';
        let animStand = strhead == '' ? '站立' : 'stand';
        sk.setAnimation(0, strhead + animShow, false);
        sk.setCompleteListener(()=>{
            if(sk.animation != strhead + animStand){
                sk.setAnimation(0, strhead + animStand, true);
                this.onOpen(Global.getInstance().nowLevel, 3);
            }
        });


    }

    showRewardBox(){
        let b = cc.instantiate(this.boxPrefab);
        b.parent = Game.instance.gameEventNode;
        b.position = cc.v2(Main.instance.heroCamera.x + cc.winSize.width * 0.5, 200);
        let bScript = b.getComponent(Box);
        bScript.init();
        let act = cc.sequence(cc.moveBy(.5, cc.v2(0, -392)), cc.callFunc(()=>{
            bScript.onlyOpen();
            this.onOpen(Global.getInstance().nowLevel, 3);
        }));
        b.runAction(act);
    }

    

    onClose(){
        this.left.active = false;
        this.right.active = false;
        this.node.active = false;
        Global.getInstance().inGame = true;
        if(this.needWin){
            if(HeroFSM.instance.fsm.can('win')){
                HeroFSM.instance.fsm.win();
            }
        }
    }

    onBtnNext(){
        // AudioMgr.instance.playAudio('BtnClick');
        if(this.gen) return;
        this.index ++;
        if(this.index == this.count){
            this.onClose();
            if(this.openLv == 1 && this.openIndex == 0){
                Game.instance.skillHalo.active = true;
                this.scheduleOnce(()=>{
                    Game.instance.skillHalo.active = false;
                },3);
            }
        }else{
            this.showDialog();
        }
    }

    showActionText(lb: cc.Label, text: string){
        
 
        this.textLength = text.length;
        this.tindex = 0;
        this.originText = text;
        this.tLabel = lb;
        this.subText = '';
        this.gen = this.generateText();
        this.schedule(()=>{
            if (this.gen.next().done) {
                cc.log('isDone');
                this.gen = null;
            }
        }, ACTIONSSPEED, this.textLength);
    }

    *generateText() {
        for (let i = 0; i < this.textLength; i++) {
            yield this.getSubText();
        }
    }

    getSubText(){
        this.tindex ++;
        this.subText = this.originText.substr(0, this.tindex);
        if(this.tindex % 12 == 1){
            AudioMgr.instance.playAudio('Typing');
        }
        this.tLabel.string = this.subText;
    }



    showDialog(){
        let data = this.data[this.index];
        cc.log(this.index, data);
        if(!data){
            return;
        }
        if(!this.left.active && data.isLeft){
            this.leftIcon.spriteFrame = this.getIcon(data.iconIndex);
            this.leftName.string = this.getName(data.iconIndex);
            
            this.left.active = true;
        }

        if(!this.right.active && !data.isLeft){
            this.rightIcon.spriteFrame = this.getIcon(data.iconIndex);
            this.rightIcon.node.scaleX = 1;
            if(data.iconIndex > 3 && data.iconIndex < 7){
                this.rightIcon.node.scaleX = -1;
            }
            if(data.iconIndex > 10){
                this.rightIcon.node.scaleX = -1;
            }
            this.rightName.string = this.getName(data.iconIndex);
            this.right.active = true;
        }

        if(data.isLeft){
            // this.leftLabel.string = data.text;
            this.leftLabel.string = '';
            this.showActionText(this.leftLabel, data.text);
        }else{
            // this.rightLabel.string = data.text;
            this.rightLabel.string = '';
            this.showActionText(this.rightLabel, data.text);
        }
    }

    getName(index: number){
        if(index == 0){
            return NAME1[HeroGlobal.instance.MainHeroIndex];
        }
        if(index > 10 && index < 15){
            index -= 11;
            return NAME2[index];
        }
        if(index > 15){
            index -= 12;
            return NAME2[index];
        }
        return NAME1[index - 1];
    }

    getIcon(index: number){
        if(index == 0){
            return TextureMgr.instance.heroIconGameSf[HeroGlobal.instance.MainHeroIndex];
        }
        if(index > 3 && index < 7){
            return TextureMgr.instance.bossIconGameSf[index - 4];
        }
        if(index > 10 && index < 15){
            index -= 11;
            return TextureMgr.instance.monsterIconGameSf[index];
        }
        if(index > 15){
            index -= 12;
            return TextureMgr.instance.monsterIconGameSf[index];
        }
        return TextureMgr.instance.heroIconGameSf[index - 1];
    }
    
    getDataByLv(lv: number){
        for (let i = 0; i < testData.length; i++) {
            if(testData[i].level == lv){
                return testData[i];
            }
        }
        return null;
    }

    // update (dt) {}
}
