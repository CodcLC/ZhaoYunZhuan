import AudioMgr from "../Audio";
import { load, save } from "../nativets/SaveMgr";
import TimeMgr from "../Tool/TimeMgr";
import TextureMgr from "../TextureMgr";
import Menu from "../Menu";
import HeroGlobal from "../Hero/HeroGlobal";
import AdMgr from "../Ad/AdMgr";
import AdList from "../Ad/AdList";
import { loadSpinePromise } from "../Tool/LoadPromise";
import { PetSpName } from "../nativets/Config";

const {ccclass, property} = cc._decorator;

let STATE = cc.Enum({
    补签: 0,
    签到: 1,
    已签: 2,
})

/**
 *  1 150金币
 *  2 10 体力
 *  3 似水流年
 *  4 100钻石
 *  5 涅槃神凤翼
 *  6 1000金币
 *  7 宠物-凤凰
 */

@ccclass
export default class Sign extends cc.Component {
    static instance: Sign = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    // 3
    @property([cc.SpriteFrame])
    stateSf: cc.SpriteFrame[] = [];

    // 6
    @property([cc.SpriteFrame])
    haveSf: cc.SpriteFrame[] = [];
    // 6
    @property([cc.SpriteFrame])
    nowSf: cc.SpriteFrame[] = [];
    // 6
    @property([cc.SpriteFrame])
    nothaveSf: cc.SpriteFrame[] = [];

    layoutNode: cc.Node;
    layoutArrs: cc.Node[];
    layoutSfArrs: cc.Sprite[];
    signIndex: number;
    start_date: string;     //完整年月日 8位  如 '20180808'
    sign_arrs: string;      //7个字符 '0100101';
    needreset: boolean;
    hadretro: string;       //已经补签过就显示已领取
    curr_day: number;
    signBtn: cc.Node;
    retroBtn: cc.Node;
    itemBg: cc.Sprite[];
    itemIcon: cc.Sprite[];
    itemTitle: cc.Sprite[];
    itemName: cc.Label[];
    itemNum: cc.Label[];
    retro_day: number;
    videoDay: number;
    petSk: any;

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.layoutNode = this.node.getChildByName('Layout');
        this.signBtn = this.node.getChildByName('sign');
        this.retroBtn = this.node.getChildByName('retro');

        this.signIndex = 1;
        this.initLayout();
    }

    initLayout(){
        this.itemBg = [];
        this.itemIcon = [];
        this.itemName = [];
        this.itemNum = [];
        this.itemTitle = [];
        this.loadPet();
        for (let i = 0; i < 6; i++) {
            let item = cc.instantiate(this.itemPrefab);
            item.name = '' + i;
            item.parent = this.layoutNode;
            if(i < 3){
                item.position = cc.v2(-240 + i * 240, 70);
            }else{
                item.position = cc.v2(-240 + (i - 3) * 240, -126);
            }
            this.itemBg.push(item.getComponent(cc.Sprite));
            this.itemTitle.push(item.getChildByName('title').getComponent(cc.Sprite));
            this.itemIcon.push(item.getChildByName('icon').getComponent(cc.Sprite));
            this.itemName.push(item.getChildByName('name').getComponent(cc.Label));
            this.itemNum.push(item.getChildByName('num').getComponent(cc.Label));

            switch (i) {
                case 0:
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.rewardSfInGame[1];
                    this.itemName[i].string = '金币';
                    this.itemNum[i].string = 'x150';
                    break;
                case 1:
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.rewardSfInGame[2];
                    this.itemName[i].string = '军粮';
                    this.itemNum[i].string = 'x10';
                    break;
                case 2:
                    // 303080000 戒指
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.getEquipmentIconById(30308);
                    this.itemName[i].string = '戒指';
                    this.itemNum[i].string = '似水流年';
                    break;
                case 3:
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.rewardSfInGame[0];
                    this.itemName[i].string = '钻石';
                    this.itemNum[i].string = 'x100';
                    break;
                case 4:
                    // 503030000
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.getEquipmentIconById(50303);
                    this.itemName[i].string = '翅膀';
                    this.itemNum[i].string = '涅槃神凤翼';
                    break;
                case 5:
                    this.itemIcon[i].spriteFrame = TextureMgr.instance.rewardSfInGame[1];
                    this.itemName[i].string = '金币';
                    this.itemNum[i].string = 'x1500';
                    break;
                // case 6:
                //     this.itemIcon[i].spriteFrame = TextureMgr.instance.rewardSfInGame[1];
                //     this.itemName[i].string = '金币';
                //     this.itemNum[i].string = 'x1500';
                //     break;  
                default:
                    break;
            }
        }
    }


    onLoad () {
        this.init();
        this.loadSignData();
    }

    start () {

    }

    async loadPet(){
        let psp: any = await loadSpinePromise(PetSpName[0]);
        this.petSk = this.layoutNode.getChildByName('7').getComponent(sp.Skeleton);
        this.petSk.skeletonData = psp;
        this.petSk.animation = 'fly';
        this.petSk._updateSkeletonData();
        this.petSk.setSkin('default');
    }

    
    loadSignData(){
        let sd: string = load('SignData');
        if(!sd){
            sd = JSON.stringify({
                start_date: TimeMgr.getFullYMDToday(),
                sign_arrs: '0000000',
                needreset: false,
                hadretro: TimeMgr.getFullYMDYesterday(),
            })
        }
        let data = JSON.parse(sd);
        this.start_date = data.start_date;
        this.sign_arrs = data.sign_arrs;
        this.needreset = data.needreset;
        this.hadretro = data.hadretro;
        
        this.curr_day = TimeMgr.getDelayDay(this.start_date, TimeMgr.getFullYMDToday()) + 1;

        if(this.needreset && this.curr_day > 0){
            this.sign_arrs = '0000000';
            this.needreset = false;
        }
        this.saveSignData();
        this.initSignItem();
    }

    saveSignData(){
        let data = {
            start_date: this.start_date,
            sign_arrs: this.sign_arrs,
            needreset: this.needreset,
            hadretro: this.hadretro,
        }
        save('SignData', JSON.stringify(data));
    }

    initSignItem(){
        let t = this.sign_arrs + '';
        let arrs = t.split('');

        for (let ii = 0; ii < 6; ii++) {
            this.setItemState(ii, STATE.签到);
        }

        // 如果是刚签完的当天，全部变成已签到
        if(this.curr_day == 0 && this.needreset){
            for (let i = 0; i < 6; i++) {
                this.setItemState(i, STATE.已签);
            }
            return;
        }
        

        for (let j = 0; j < this.curr_day - 1; j++) {
            if(arrs[j] == '0'){
                this.setItemState(j, STATE.补签);
            }else if(arrs[j] == '1'){
                this.setItemState(j, STATE.已签);
            }
        }

        // 如果当天没签到，全部关闭，按钮为获得，否则打开已签到
        let needretro = false;
        if(arrs[this.curr_day - 1] == '1'){
            this.setItemState(this.curr_day - 1, STATE.已签);
            for (let k = 0; k < this.curr_day - 1; k++) {
                if(arrs[k] == '0'){
                    this.retro_day = k + 1;
                    needretro = true;
                    break;
                }
            }

            if(needretro) this.setButtonState(STATE.补签);
            else{
                this.setButtonState(STATE.已签);
            }
        }else{
            this.setButtonState(STATE.签到);
        }

        if(this.curr_day > 7){
            for (let l = 0; l < this.curr_day - 1; l++) {
                if(arrs[l] == '0'){
                    this.retro_day = l + 1;
                    needretro = true;
                    break;
                }
                
            }

            if(needretro)
            this.setButtonState(STATE.补签);
            else
            this.setButtonState(STATE.已签);
        }

        // 如果已经补签过
        if(TimeMgr.getFullYMDToday() == this.hadretro){
            this.setButtonState(STATE.已签);
        }
    }

    setButtonState(state: number){
        // -1 已
        // 0 补
        // 1 签到
        this.signBtn.active = false;
        this.retroBtn.active = false;
        switch (state) {
            case STATE.签到:
                this.signBtn.active = true;
                break;
            case STATE.补签:
                this.retroBtn.active = true;
                break;
            default:
                break;
        }
    }

    setItemState(itemIndex: number, state: number){
        if(itemIndex == 6){
            return;
        }
        this.itemBg[itemIndex].spriteFrame = this.stateSf[state];
        let arrs = [ this.nothaveSf, this.haveSf,this.nowSf,];
        this.itemTitle[itemIndex].spriteFrame = arrs[state][itemIndex];
        // switch (state) {
        //     case STATE.签到:
        //         this.itemTitle[itemIndex].spriteFrame = arrs[state][itemIndex];
        //         break;
        //     case STATE.补签:
                
        //         break;
        //     case STATE.已签:
                
        //         break;
        //     default:
        //         break;
        // }
    }

    onBtnSign(){
        AudioMgr.instance.playAudio('BtnClick');
        // this.signIndex ++;
        // if(this.signIndex > 7){
        //     this.signIndex = 1;
        // }

        // this.refreshLayout();

        this.onSign();
    }

    onSign(){
        if(this.curr_day == null){
            return;
        }
        this.onUpdateSign(this.curr_day);
    }

    onBtnRetro(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onRetro();
    }

    onRetro(){
        if(this.retro_day == null){
            return;
        }
        this.hadretro = TimeMgr.getFullYMDToday();
        this.onUpdateSign(this.retro_day, true);
        
    }

    onUpdateSign(day: number, isRetro?: boolean){
        let t = this.sign_arrs + '';
        let arrs = t.split('');
        arrs[day - 1] = '1';
        this.sign_arrs = arrs.join('');

        if(this.sign_arrs == '1111111'){
            this.start_date = TimeMgr.getFullYMDTomorrow();
            this.needreset = true;
        }
        this.saveSignData();
        if(isRetro){
            if(AdMgr.instance){
                AdMgr.instance.showRewardAd(AdList.WXVIDEOLIST2.补签);
                this.videoDay = day;
            }else{
                this.onReward(day);
            }
        }else{
            this.onReward(day);
        }
        
        
        this.initSignItem();
    }

    onSuccess(){
        if(this.videoDay){
            this.onReward(this.videoDay);
        }
    }

    onReward(day: number){
        cc.log('Reward',day);
        switch (day - 1) {
            case 0:
                Menu.instance.addCoins(150);
                break;
            case 1:
                Menu.instance.addLife(10);
                break;
            case 2:
                HeroGlobal.instance.pushEquipmentData(303080000);
                break;
            case 3:
                Menu.instance.addJade(100);
                break;
            case 4:
                HeroGlobal.instance.pushEquipmentData(503030000);
                break;
            case 5:
                Menu.instance.addCoins(1500);
                break;
            case 6:
                // Menu.instance.addCoins(1500);
                HeroGlobal.instance.unlockPet(0);
                
                break;
            default:
                break;
        }
        this.videoDay = null;

    }

    refreshState(){
        this.initSignItem();
        this.refreshLayout();

    }

    refreshLayout(){
        for (let i = 1; i < 6; i++) {
            
        }
    }

    onEnable(){
        if(!this.layoutNode){
            return;
        }
        this.refreshState();
    }

    // update (dt) {}
}
