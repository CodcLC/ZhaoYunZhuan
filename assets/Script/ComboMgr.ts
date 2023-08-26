import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComboMgr extends cc.Component {
    static instance: ComboMgr = null;
    comboTime: number = 2;
    time: number;
    text: cc.Label;
    comboSpace: number;

    // LIFE-CYCLE CALLBACKS:

    init(){
        Game.instance.combo = 0;
        this.comboSpace = 0;
        this.text = this.node.getChildByName('combo').getComponent(cc.Label);
        this.node.active = false;
    }

    onLoad () {
        ComboMgr.instance = this;
        this.init();
    }

    start () {

    }

    attack(){
        Game.instance.combo ++;
        if(Game.instance.combo > Game.instance.maxCombo){
            Game.instance.maxCombo = Game.instance.combo;
        }
        this.time = this.comboTime;
        this.node.active = true;
    }

    update (dt) {
        if(Game.instance.combo > 0){
            this.time -= dt;
            this.comboSpace -= dt;
            if(this.time <= 0){
                Game.instance.combo = 0;
                this.text.string = '0';
                this.node.active = false;
            }else{
                if(this.comboSpace <= 0){
                    this.comboSpace = .5;
                    this.text.string = Game.instance.combo + '';
                    this.node.active = true;
                    this.text.node.runAction(cc.sequence(cc.scaleTo(.3,1.2),cc.scaleTo(.2,1)));
                }
            }
        }
    }
}
