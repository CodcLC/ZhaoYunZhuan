
import Main from "./Main";
import AudioMgr from "./Audio";
import Game from "./Game";
import BATips from "./BizarreAdventure/BATips";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Tips extends cc.Component {
    static instance: Tips = null;

    // 成功 失败 进阶成功 进阶失败 强化成功 强化失败
    @property([cc.SpriteFrame])
    sfArrs: cc.SpriteFrame[] = [];


    anim: cc.Animation;
    label: cc.Label;
    ceNode: cc.Node;
    bg: cc.Sprite;
    upNode: cc.Node;
    upIcon: cc.Sprite;
    // LIFE-CYCLE CALLBACKS:

    init(){
        this.anim = this.node.getComponent(cc.Animation);
        this.bg = this.node.getChildByName('bg').getComponent(cc.Sprite);
        this.ceNode = this.node.getChildByName('ce');
        this.upNode = this.node.getChildByName('up');
        this.upIcon = this.upNode.getComponent(cc.Sprite);
        this.label = this.ceNode.getChildByName('num').getComponent(cc.Label);
        this.anim.on(cc.Animation.EventType.FINISHED, this.hideSuccess, this);
    }

    onLoad () {
        Tips.instance = this;
        this.init();
    }

    start () {

    }

    showSuccess(str?: string){
        // cc.log('success', str);
        if(Main.instance.gameNode.getChildByName('Game')){
            if( (Game.instance && Game.instance.gameEndNode && !Game.instance.gameEndNode.active) && (BATips.instance && BATips.instance.node && !BATips.instance.node.active))
            return;
        }
        if(Main.instance.loadingNode && Main.instance.loadingNode.active){
            return;
        }
        AudioMgr.instance.playAudio('CEUp');
        if(!this.anim){
            return;
        }

        this.bg.spriteFrame = this.sfArrs[0];
        if(this.ceNode)
        this.ceNode.active = true;
        this.upIcon.spriteFrame = null;

        this.anim.stop();
        this.unscheduleAllCallbacks();
        if(this.node)
        this.node.active = true;
        this.anim.play();
        if(str){
            this.label.string = str;
        }
        // this.anim.on(cc.Animation.EventType.FINISHED, this.hideSuccess, this);
    }

    hideSuccess(){
        this.scheduleOnce(()=>{
            this.node.active = false;
        }, 1.5);
    }

    showSuccessInGame(str?: string){
        AudioMgr.instance.playAudio('CEUp');
        if(!this.anim){
            return;
        }

        this.bg.spriteFrame = this.sfArrs[0];
        this.ceNode.active = true;
        this.upIcon.spriteFrame = null;

        this.anim.stop();
        this.unscheduleAllCallbacks();
        this.node.active = true;
        this.anim.play();
        if(str){
            this.label.string = str;
        }
    }

    showRankUp(success: boolean){
        AudioMgr.instance.playAudio('CEUp');
        if(!this.anim){
            return;
        }

        this.bg.spriteFrame = success ? this.sfArrs[0] : this.sfArrs[1];
        this.ceNode.active = false;
        this.upIcon.spriteFrame = success ? this.sfArrs[2] : this.sfArrs[3];
        // this.upNode.active = true;

        this.anim.stop();
        this.unscheduleAllCallbacks();
        this.node.active = true;
        this.anim.play();
    }

    showUpgrade(success: boolean){
        AudioMgr.instance.playAudio('CEUp');
        if(!this.anim){
            return;
        }

        this.bg.spriteFrame = success ? this.sfArrs[0] : this.sfArrs[1];
        this.ceNode.active = false;
        this.upIcon.spriteFrame = success ? this.sfArrs[4] : this.sfArrs[5];
        // this.upNode.active = true;

        this.anim.stop();
        this.unscheduleAllCallbacks();
        this.node.active = true;
        this.anim.play();
    }

    onDestroy(){
        this.anim.off(cc.Animation.EventType.FINISHED, this.hideSuccess, this);
    }

    // update (dt) {}
}
