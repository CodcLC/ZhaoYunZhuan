import AudioMgr from "../../Audio";
import AdMgr from "../../Ad/AdMgr";
import AdList from "../../Ad/AdList";
import BATips from "../../BizarreAdventure/BATips";

const {ccclass, property} = cc._decorator;

const FingerSpace = .35;

@ccclass
export default class BoxGift extends cc.Component {
    static instance: BoxGift = null;

    @property([cc.SpriteFrame])
    boxSf: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    fingerSf: cc.SpriteFrame[] = [];

    backBtn: cc.Node;
    progressBar: cc.ProgressBar;
    boxSprite: cc.Sprite;
    fingerSprite: cc.Sprite;
    space: number;
    fingerIndex: number;
    clickBtn: cc.Node;
    boxActive: boolean;

    init(){
        this.progressBar = this.node.getChildByName('ProgressBar').getComponent(cc.ProgressBar);
        this.backBtn = this.node.getChildByName('back');
        this.clickBtn = this.node.getChildByName('Btn');
        // this.clickBtn.on('touchstart', this.onBtnClick, this);
        this.boxSprite = this.node.getChildByName('box').getComponent(cc.Sprite);
        this.fingerSprite = this.node.getChildByName('finger').getComponent(cc.Sprite);
        this.space = FingerSpace;
        this.fingerIndex = 0;
    }

    onLoad () {
        BoxGift.instance = this;
        this.node.active = false;
        this.init();
        
    }

    start () {
        // this.open();
    }

    open(){
        this.boxActive = true;
        
        this.node.active = true;
        this.progressBar.node.active = true;
        this.fingerSprite.node.active = true;
        this.backBtn.active = false;
        if(AdMgr.instance){
            AdMgr.instance.hideBanner();
            // AdMgr.instance.reloadBanner();
        }
        
        this.boxSprite.spriteFrame = this.boxSf[0];
        this.progressBar.progress = 0;

        this.scheduleOnce(()=>{
            this.backBtn.active = true;
        }, 2.5);
    }

    onBtnClick(){
        if(CC_WECHATGAME)
        wx.vibrateShort(null);//震动
        if(this.progressBar.progress <= .9){
            console.log('click');
            this.progressBar.progress += .1;
        }
    }

    onBtnClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.close();
    }

    close(){
        this.node.active = false;
        if(AdMgr.instance){
            AdMgr.instance.hideBanner();
            // AdMgr.instance.reloadBanner();
        }
    }

    openBox(){
        if(!this.boxActive){
            return;
        }
        this.boxActive = false;
        if(AdMgr.instance){
            AdMgr.instance.showBannerAd(AdList.BANNERLIST.通关宝箱);
        }
        this.scheduleOnce(()=>{
            
            this.progressBar.progress = 0;
            this.progressBar.node.active = false;
            this.fingerSprite.node.active = false;
            let i = 5;
            this.schedule(()=>{
                i ++;
                cc.log('i',i);
                this.boxSprite.spriteFrame = this.boxSf[i];
            }, .2, 2);
            
        }, .5);

        // this.scheduleOnce(()=>{
        //     if(BATips.instance){
        //         BATips.instance.showBoxGiftReward();
        //     }
        // }, 1);

        this.scheduleOnce(()=>{
            this.close();
            if(BATips.instance){
                BATips.instance.showBoxGiftReward();
            }
        }, 3);
    }

    update (dt) {
        if(!this.boxActive){
            return;
        }
        if(this.progressBar.progress > 0){
            this.progressBar.progress -= 0.0015 + Math.floor(Math.random() * 3) * 0.001;
        }else{
            this.progressBar.progress = 0;
        }

        let index = Math.floor(this.progressBar.progress / .15);
        cc.log(index);
        if(index < 0){
            index = 0;
        }
        this.boxSprite.spriteFrame = this.boxSf[index];

        let tr: number = Math.random() * 0.3 + 0.5;
        if(this.progressBar.progress > tr){
            this.openBox();
        }

        this.space -= dt;
        if(this.space <= 0){
            this.space = FingerSpace;
            this.fingerIndex = this.fingerIndex == 1 ? 0 : 1;
            this.fingerSprite.spriteFrame = this.fingerSf[this.fingerIndex];
        }
    }


}
