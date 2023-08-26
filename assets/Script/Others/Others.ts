import Menu from "../Menu";
import AudioMgr from "../Audio";
import DataMgr from "../DataMgr";
import { getPlatform, Platform } from "../nativets/Platform";
import Global from "../nativets/Global";
import { save } from "../nativets/SaveMgr";
import Statistics from "../Tool/Statistics";
import HeroGlobal from "../Hero/HeroGlobal";
import Game from "../Game";
import Main from "../Main";
import AdMgr from "../Ad/AdMgr";
import QQAdMgr from "../Ad/QQAdMgr";
import WXAdMgr from "../Ad/WXAdMgr";
import TTAdMgr from "../Ad/TTAdMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Others extends cc.Component {
    static instance: Others = null;
    listNode: cc.Node;
    listSelect: cc.Node;
    listIndex: number;
    layoutNode: cc.Node;
    layoutArrs: cc.Node[];
    moreBtn: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    init(){
        Others.instance = this;
        this.listNode = this.node.getChildByName('list');
        this.listSelect = this.listNode.getChildByName('light');
        this.layoutNode = this.node.getChildByName('Layout');
        this.layoutArrs = [];
        for (let i = 0; i < 6; i++) {
            let n = this.layoutNode.getChildByName('' + i);
            this.layoutArrs.push(n);   
        }
        this.layoutArrs.push(this.layoutNode.getChildByName('' + 9));
        this.moreBtn = this.node.getChildByName('more');
        // this.moreBtn.active = getPlatform() == Platform.WX || getPlatform() == Platform.QQ;
    }

    onLoad () {
        this.init();
    }

    start () {
        
    }

    onBtnMoreGame(){
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            AdMgr.instance.showGamePortal();
            // AdMgr.instance.showGridAd();
        }
    }

    onBtnListSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        // if(this.listIndex != index){
        //     this.listIndex = index;

        //     this.refreshList();
        // }

        let textArrs = ['签到', '排行榜', '', '活动', '任务', '成就'];
        if(index != 9 && index != 2){
            Statistics.getInstance().reportEvent(textArrs[index]);
        }

        if(getPlatform() == Platform.TT && index == 1){
            // 头条排行榜
            if(!Global.getInstance().ttAuthor){
                tt.login({
                    success: ((res)=>{
                        tt.authorize({
                            scope: "scope.userInfo",
                            success() {
                              // 用户同意授权用户信息
                              if(TTAdMgr.instance){
                                TTAdMgr.instance.getUserInfo();
                            }
                            Global.getInstance().ttAuthor = true;
                            },
                            fail(){
                                if(TTAdMgr.instance){
                                    TTAdMgr.instance.guideActive();
                                }
                            }
                          });
                    }
                    )
                })

                
                  return;
            }else{
                this.open(index);
            }
            
        }else
        this.open(index);

    }

    open(index){
        if(index == 9){
            this.layoutArrs[6].active = true;
        }
        if(this.listIndex != index){
            this.listIndex = index;
            this.refreshList();

            // 排行榜
            if(index == 1){
                DataMgr.instance.taskCountData[4] ++;
                DataMgr.instance.saveSaveDate();
                console.log('VIVOINFO', Global.getInstance().vivoHead);
                if(getPlatform() == Platform.VIVO && (Global.getInstance().vivoHead == '' || Global.getInstance().vivoHead == undefined || Global.getInstance().vivoHead == null)){
                    if (qg.getSystemInfoSync().platformVersionCode >= 1053) {
                        qg.getUserInfo().then((res) => {
                            if (res.data) {
                                let vdata: any = res.data;
                                console.log('当前用户信息: ',vdata, vdata.nickName,vdata.smallAvatar);
                                // let vdata: any = JSON.stringify(res.data);
                                Global.getInstance().vivoName = vdata.nickName;
                                Global.getInstance().vivoHead = vdata.smallAvatar;
                                let vivodata = {
                                    vivoName: Global.getInstance().vivoName,
                                    vivoHead: Global.getInstance().vivoHead
                                }
                                save('VIVOInfo', JSON.stringify(vivodata));
                                let onGet = (ret: any) => {
                                    cc.log('register', ret);
                        
                                    if(ret.code == 1){
                                        cc.director.emit('FirstReport');
                                        if(HeroGlobal.instance.MonsterKillCount > 0)
                                        Statistics.getInstance().reportRank(Statistics.RANKLIST.杀戮榜, HeroGlobal.instance.MonsterKillCount);
                                        
                                    }else{
                                        cc.log(ret.error);
                                    }
                                }
                                // Statistics.getInstance().register(Global.getInstance().vivoName, Global.getInstance().vivoHead, '', '', onGet);
                                Statistics.getInstance().updateUserInfo(Global.getInstance().vivoName, Global.getInstance().vivoHead, onGet);
                            }
                        }, (err) => {
                            console.log('获取用户信息失败' + JSON.stringify(err));
                        });
                    }
        
                }
            }
        }
    }

    refreshList(){
        // this.listSelect.y = -31 - 62 * this.listIndex;
        let arrs = [0, 1, 3, 4, 5];
        let index = arrs.indexOf(this.listIndex);
        this.listSelect.y = -31 - 62 * index;
        cc.log('ssss',this.listIndex);
        for (let i = 0; i < 6; i++) {
            let n = this.layoutArrs[i];
            if(n){
                n.active = this.listIndex == i;
            }
        }
        // 好友排行榜
        if(this.listIndex == 9){
            this.listSelect.y = -31 - 62;
            // this.layoutNode.getChildByName('9').active = true;
        }

        this.layoutArrs[6].active = this.listIndex == 9;
    }

    onBtnClose(){
        AudioMgr.instance.playAudio('BtnClick');
        this.onClose();
        this.layoutArrs[6].active = false;
    }

    onClose(){
        this.node.active = false;
        if(Menu.instance){
            Menu.instance.showRight();
        }else{
            // if(Main.instance.menuNode.getChildByName('Menu')){
            //     Main.instance.menuNode.getChildByName('Menu').LeftNode.active = true;
            //     Main.instance.menuNode.getChildByName('Menu').BottomNode.active = true;
            //     Main.instance.menuNode.getChildByName('Menu').RightNode.active = true;
            // }
        }
        
    }

    onEnable(){
        if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
            if(getPlatform() == Platform.QQ){
                if(Math.random() < QQAdMgr.instance.moreGameRate){
                    this.moreBtn.active = true;
                }else{
                    this.moreBtn.active = false;
                }
            }else{
                if(Math.random() < WXAdMgr.instance.moreGameRate){
                    this.moreBtn.active = true;
                }else{
                    this.moreBtn.active = false;
                }
            }

        }else{
            this.moreBtn.active = false;
        }
    }

    // update (dt) {}
}
