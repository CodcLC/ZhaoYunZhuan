import Hero from "./Hero";
import HeroFSM from "./HeroFSM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillProgress extends cc.Component {
    progressBar: cc.ProgressBar;
    time: number;
    cd: number;
    count: number;
    index: number;
    sprite: cc.Sprite;
    barSprite: cc.Sprite;

    init(){
        this.progressBar = this.node.getComponent(cc.ProgressBar);
        this.node.on('touchstart',this.onClick,this);
        this.count = 0;
        this.sprite = this.node.getComponent(cc.Sprite);
        this.barSprite = this.node.getChildByName('bar').getComponent(cc.Sprite);
    }

    onLoad () {
        // this.init();

    }

    start () {

    }

    setSkill(index: number, cd: number, img: cc.SpriteFrame){
        if(!this.sprite){
            this.init();
        }
        this.index = index;
        this.cd = cd;
        
        this.sprite.spriteFrame = img;
        this.barSprite.spriteFrame = img;
    }

    resetCD(){
        this.time = 0;
        this.progressBar.progress = 0;
    }
    
    onClick(){
        if(!this.getCanClick()) return;
        if(!HeroFSM.instance.fsm.can('skill')){
            return;
        }
        if(Hero.instance.node.y > -200){
            // 空中不能技能
            return;
        }
        this.time = this.cd;
        Hero.instance.onSkill(this.index);
    }

    getCanClick(): boolean{
        if(this.cd == -1){
            return false;
        }
        if(this.progressBar.progress == 0){
            return true;
        }else{
            return false;
        }
    }

    updateProgress(){
        let progress: number = this.time / this.cd;
        this.progressBar.progress = progress;

        // let restTime = Math.ceil(this.time)
        // if(!this.text.node.active){
        //     // this.text.node.active = true;
        // }
        // if(restTime == 0){
        //     this.text.node.active = false;
        // }
        // this.text.string = restTime + '';
    }

    update (dt) {
        if(this.time > 0){
            this.time -= dt;
            if(this.time <= 0){
                this.time = 0;
                this.progressBar.progress = 0;
                // this.text.node.active = false;
            }

            this.count ++;
            if(this.count == 10){
                this.count = 0;
                this.updateProgress();
            }
        }
    }
}
