import HeroGlobal from "../Hero/HeroGlobal";
import Menu from "../Menu";
import Statistics from "../Tool/Statistics";

const {ccclass, property} = cc._decorator;

const TIME =  1 * 60 * 5;
const REPORTTIME = 10;

@ccclass
export default class LifeMgr extends cc.Component {
    static instance: LifeMgr = null;
    time: number;
    reportTime: number;
    startTime: number;

    init(){
        this.time = TIME;
        this.reportTime = REPORTTIME;
    }

    onLoad () {
        LifeMgr.instance = this;
        this.init();
        this.onHideShow();
    }

    start () {
        
    }

    onHideShow(){
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
    }

    onHide(){
        this.startTime = Date.now();
    }

    onShow(){
        if(!this.startTime){
            return;
        }
        
        // 10分钟
        let count = Math.floor((Date.now() - this.startTime) / 600000);
        // cc.log('LIFEONSHOW',Date.now(), this.startTime, count);
        this.startTime = null;
        if(HeroGlobal.instance.Life < 40){
            let life = HeroGlobal.instance.Life + count;
            if(life > 40){
                life = 40;
            }
            HeroGlobal.instance.Life = life;
            HeroGlobal.instance.saveHeroGlobal();
            if(Menu.instance){
                Menu.instance.refreshTopLabel();
            }
        }
        

    }

    onDestroy(){
        cc.game.off(cc.game.EVENT_HIDE, this.onHide, this);

        cc.game.off(cc.game.EVENT_SHOW, this.onShow, this);
    }

    update (dt) {
        if(this.time > 0){
            this.time -= dt;
        }else{
            this.time = TIME;

            if(HeroGlobal.instance.Life < 40){
                HeroGlobal.instance.Life += 1;
                HeroGlobal.instance.saveHeroGlobal();
                if(Menu.instance){
                    Menu.instance.refreshTopLabel();
                }
            }
        }


        if(this.reportTime > 0){
            this.reportTime -= dt;
        }else{
            this.reportTime = REPORTTIME;
            Statistics.getInstance().newReportAd();
        }
    }
}
