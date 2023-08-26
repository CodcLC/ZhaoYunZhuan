import AudioMgr from "./Audio";
import DataMgr from "./DataMgr";
import AdMgr from "./Ad/AdMgr";
import AdList from "./Ad/AdList";
import HeroGlobal from "./Hero/HeroGlobal";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Message extends cc.Component {
    static instance: Message = null;
    anim: cc.Animation;
    box: cc.Node;
    title: cc.Label;
    text: cc.Label;
    callback: Function;
    cancekCallback: Function;
    // LIFE-CYCLE CALLBACKS:

    init(){
        // this.anim = this.node.getComponent(cc.Animation);
        this.box = this.node.getChildByName('box');
        this.title = this.box.getChildByName('title').getComponent(cc.Label);
        this.text = this.box.getChildByName('text').getComponent(cc.Label);
        this.node.active = false;
    }

    onLoad () {
        Message.instance = this;
        this.init();
    }

    start () {

    }

    onBtnOk(){
        AudioMgr.instance.playAudio('BtnClick');
        if(this.callback){
            this.callback();
        }
        this.onClose();
    }

    onBtnClose(){
        AudioMgr.instance.playAudio('BtnClick');
        if(this.cancekCallback){
            this.cancekCallback();
        }
        this.onClose();
    }

    onClose(){
        this.node.active = false;
    }

    show(title: string, mes: string, callback?: Function, havecancel?: boolean, cancelCallback?: Function){
        this.title.string = title;
        this.text.string = mes;
        this.node.active = true;
        this.callback = callback;
        this.cancekCallback = cancelCallback;
    }

    showLack(type: string){
        
        this.title.string = '每日福利';
        let str = '';
        // let strHead = '观看视频获得';
        let strHead = '今日可以领取';
        let strTail = '';
        let num = 0;
        switch (type) {
            case 'life':
                strTail = '军粮';
                let index1 = DataMgr.instance.lifeCount;
                if(index1 < 3){
                    num = DataMgr.instance.lifeArrs[index1];
                    str = strHead + num + strTail;
                    this.callback = ()=>{
                        if(AdMgr.instance)
                        AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.加体力);
                    }
                    
                }else{
                    str = '今天已经达到最大领取次数，请明天再试^^';
                    this.callback = ()=>{};
                }
                

                break;
            case 'coins':
                strTail = '金币';
                let index2 = DataMgr.instance.coinsCount;
                if(index2 < 3){
                    // num = DataMgr.instance.coinsArrs[index2];
                    num = 300 + HeroGlobal.instance.Level * 10;
                    str = strHead + num + strTail;
                    this.callback = ()=>{
                        if(AdMgr.instance)
                        AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.加金币);
                    }
                    
                }else{
                    str = '今天已经达到最大领取次数，请明天再试^^';
                    this.callback = ()=>{};
                }

                break;
            case 'jade':
                strTail = '钻石';
                let index3 = DataMgr.instance.jadeCount;
                if(index3 < 3){
                    num = DataMgr.instance.jadeArrs[index3];
                    str = strHead + num + strTail;
                    this.callback = ()=>{
                        if(AdMgr.instance)
                        AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.加仙玉);
                    }
                    
                }else{
                    str = '今天已经达到最大领取次数，请明天再试^^';
                    this.callback = ()=>{};
                }
                break;
            default:
                break;
        }


        this.text.string = str;
        this.node.active = true;


    }

    // update (dt) {}
}
