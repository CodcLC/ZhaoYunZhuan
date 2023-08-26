import Global from "./nativets/Global";
import Game from "./Game";
import Hero from "./Hero/Hero";

// import Texture from "./Texture";
const {ccclass, property} = cc._decorator;

@ccclass
export default class LifeProgress extends cc.Component {
    @property(cc.ProgressBar)
    bar1: cc.ProgressBar = null;
    @property(cc.ProgressBar)
    bar2: cc.ProgressBar = null;
    @property
    delay: number = 300;
    isBoss: boolean;
    HPCount: number;
    CountLabel: cc.Label;
    // textureMgr: Texture;
    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    init(isBoss?: boolean){
        this.bar1.progress = 1;
        this.bar2.progress = 1;
        if(isBoss){
            this.isBoss = true;
            this.HPCount = 4;  //4条血
            this.CountLabel = this.node.getChildByName('count').getComponent(cc.Label);
            this.CountLabel.string = 'x4';
            // this.textureMgr = cc.find('Canvas').getComponent(Texture);
            // this.bar2.node.getChildByName('bar').getComponent(cc.Sprite).spriteFrame = this.textureMgr.bosshpsf[this.HPCount - 1];
            this.bar2.node.getChildByName('bar').getComponent(cc.Sprite).spriteFrame = Game.instance.bossHpSf[this.HPCount - 1];
            for (let i = 0; i < 4; i++) {
            //     this.node.getChildByName('bg' + i).active = false;
            //     this.node.parent.getChildByName('' + i).active = false;
            }
            this.node.getChildByName('bg' + (this.HPCount - 1)).active = true;
            // this.node.parent.getChildByName('' + (this.HPCount - 1)).active = true;
        }
        
    } 

    start () {
        //拖动节点不存在脚本加载顺序问题
        // this.bar1 = this.node.getComponent(cc.ProgressBar);
        // this.bar2 = this.node.getChildByName('P2').getComponent(cc.ProgressBar);
        this.init();
    }

    setHP(hp: number){
        let precent: number = hp / 100;
        Global.getInstance().HP = Hero.instance.HP * precent;
        this.bar1.progress = precent;
        this.bar2.progress = precent;
    }

    addHP(hp: number){
        this.unscheduleAllCallbacks();
        let precent: number = hp / 100;
        Global.getInstance().HP += Hero.instance.HP * precent;
        if(Global.getInstance().HP > Hero.instance.HP){
            Global.getInstance().HP = Hero.instance.HP;
        }
        
        let p: number = this.bar2.progress + precent;
        if(p > 1){
            p = 1;
        }
        this.bar1.progress = p;
        this.bar2.progress = p;
    }

    damage(dmg: number){
        let precent: number = dmg / 100;
        let p: number = this.bar2.progress;
        this.unscheduleAllCallbacks();
        this.bar1.progress = p;
        if(this.isBoss){
            if(precent > p){
                let n: number = Math.ceil(precent - p);
                
                this.HPCount -= n;
                this.CountLabel.string = 'x' + this.HPCount;
                if(this.HPCount > 0){
                    // this.bar2.node.getChildByName('bar').getComponent(cc.Sprite).spriteFrame = this.textureMgr.bosshpsf[this.HPCount - 1];
                    this.bar2.node.getChildByName('bar').getComponent(cc.Sprite).spriteFrame = Game.instance.bossHpSf[this.HPCount - 1];
                    for (let i = 0; i < 4; i++) {
                        this.node.getChildByName('bg' + i).active = false;
                        // this.node.parent.getChildByName('' + i).active = false;
                    }
                    this.node.getChildByName('bg' + (this.HPCount - 1)).active = true;
                    // this.node.parent.getChildByName('' + (this.HPCount - 1)).active = true;
                }
                
                let result: number = (p + n - precent) % 1;
                if(this.HPCount < 1){
                    result = 0;   
                }
                cc.log(this.HPCount, dmg);
                this.bar1.progress = 1;
                this.bar2.progress = result;
                this.scheduleOnce(()=>{
                    this.bar1.progress = result;
                    if(this.HPCount < 1){
                        // result = 0;  
                        this.node/*.parent*/.active = false; 
                    }
                },this.delay / 1000);
            }else{
                this.bar2.progress = p - precent;
                this.scheduleOnce(()=>{
                    this.bar1.progress = p - precent;
                },this.delay / 1000);
            }
        }else{
            
            this.bar2.progress = p - precent;
            this.scheduleOnce(()=>{
                this.bar1.progress = p - precent;
            },this.delay / 1000);
        }
        
        // setTimeout(() => {
        //     this.bar1.progress = p - precent;
        // }, this.delay);
    }

    move(x: number, y?: number){
        if(this.node.x != x){
            this.node.x = x;
        }
        if(y){
            if(this.node.y != y)
            this.node.y = y + 200;
        }
    }

    // update (dt) {}
}