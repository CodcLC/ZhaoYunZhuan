import Map from "../Map";
import AudioMgr from "../Audio";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapItem extends cc.Component {
    bossNode: cc.Node;
    normalLight: cc.Node;
    bossLight: cc.Node;
    lock: cc.Node;
    levelText: cc.Label;
    starArrs: cc.Node[];
    light: cc.Node;
    level: number;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(){
        this.bossNode = this.node.getChildByName('boss');
        this.normalLight = this.node.getChildByName('light');
        this.bossLight = this.bossNode.getChildByName('bosslight');
        this.light = this.normalLight;
        this.lock = this.node.getChildByName('lock');
        this.levelText = this.node.getChildByName('level').getComponent(cc.Label);
        this.starArrs = [];
        for (let i = 0; i < 3; i++) {
            this.starArrs.push(this.node.getChildByName('' + i));
        }
    }

    setLevel(level: number){
        this.level = level;
        this.levelText.string = '' + level;
    }

    setLockState(lock: boolean){
        this.lock.active = lock;
    }

    setStar(num: number){
        for (let i = 0; i < 3; i++) {
            this.starArrs[i].active = i < num ? true : false;
        }
    }

    setIsBoss(isBoss: boolean){
        this.light = isBoss ? this.bossLight : this.normalLight;
        this.bossNode.active = isBoss;
        this.light.active = false;
    }

    setSelect(select: boolean){
        this.light.active = select;
    }

    start () {

    }

    onBtnLevel(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        if(this.lock.active){
            return;
        }
        // let index: number = parseInt(event.target.name);
        // Map.instance.onBtnLevel(event);
        Map.instance.onBtnOpenHeroSelect(event);
    }

    // update (dt) {}
}
