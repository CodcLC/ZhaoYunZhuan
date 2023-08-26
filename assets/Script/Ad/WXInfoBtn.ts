import Global from "../nativets/Global";
import Statistics from "../Tool/Statistics";
import { save } from "../nativets/SaveMgr";
import Menu from "../Menu";
import HeroGlobal from "../Hero/HeroGlobal";
import { getPlatform, Platform } from "../nativets/Platform";

const APPID: string = 'wx3ba81b9d6157cd69';
const VERSION: string = '1.0.35';
const ENV: string = 'online';
const {ccclass, property} = cc._decorator;

@ccclass
export default class WXInfoBtn extends cc.Component {
    WXInfoButton: any;
    WXLeft: number;
    WXTop: number;
    WXHeight: number;
    WXWidth: number;
    wxCode: string;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
            this.scheduleOnce(()=>{
            
                let zoomRateW: number = wx.getSystemInfoSync().windowWidth / cc.winSize.width;
                let zoomRateH: number = wx.getSystemInfoSync().windowHeight / cc.winSize.height
    
                // let pos = cc.v2(0,0);
                // cc.find('Canvas').getChildByName('Main Camera').getComponent(cc.Camera).getWorldToScreenPoint(rightnearbg.position, pos);
    
                let posX: number = 0;
                let posY: number = cc.winSize.height * .5 + this.node.y + this.node.height + 100;
                if(this.node.getComponent(cc.Widget)){
                    posX = cc.winSize.width - this.node.getComponent(cc.Widget).right/**widget*/ - this.node.width;
                    posY = cc.winSize.height * .5 + this.node.y + this.node.height;
                }
    
                let pos = this.node.convertToWorldSpace(cc.v2(0, this.node.height));
                posX = pos.x;
                posY = cc.winSize.height - pos.y;
                // let posY: number = -this.node.y + this.node.height / 2;
                
                this.WXLeft = posX * zoomRateW;
                this.WXTop = posY * zoomRateH;
                cc.log('WXTL',this.WXLeft, this.WXTop);
                this.WXHeight = this.node.height * zoomRateH * this.node.scaleX;
                this.WXWidth = this.node.width * zoomRateW * this.node.scaleX;
                wx.login({
                    success: ((res)=>{
                    console.log('wxlogin',res);
                    this.wxCode = res.code;
                    
                    this.wxGetOpenid();
                    this.wxGetUserState();
                    }
                    )
                })
    
                cc.director.on('WXHideInfo',()=>{
                    if(this.WXInfoButton){
                        this.WXInfoButton.hide();
                    }
                });
                
            });
        }else if(getPlatform() == Platform.TT){
            // if(this.node.name != 'Advan')
            // cc.director.on('ttLogin', this.ttLogin, this);
        }
    }

    ttLogin(){
        wx.login({
            success: ((res)=>{
            console.log('ttlogin',res);
            // this.wxCode = res.code;
            
            // this.wxGetOpenid();
            this.wxGetUserState();
            }
            )
        })
    }

    wxGetOpenid(){
        if(getPlatform() == Platform.WX)
        Statistics.getInstance().getOpenid(this.wxCode);
    }


    wxGetUserState() {
        wx.getSetting({
            fail: function (res) {
                this.wxGetUserInfo()
            }.bind(this),
    
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    Global.getInstance().ttAuthor = true;
                    this.getUserInfo()

                }
                else{
                    this.wxGetUserInfo()
                }
            }.bind(this)
            })
    }
    
    wxGetUserInfo() {
        if(getPlatform() == Platform.TT){
            Global.getInstance().ttAuthor = false;
            return;
        }
        this.WXInfoButton = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: this.WXLeft,
                top: this.WXTop,
                width: this.WXWidth,
                height: this.WXHeight,
                lineHeight: 600,
                backgroundColor: '#00000000',
                borderColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 40,
                borderRadius: 4
            }
        })
        this.WXInfoButton.onTap((res) => {
            if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                // 处理用户拒绝授权的情况
                this.guideActive();
            }else {
                this.setUserDataOnTap(res);
                this.WXInfoButton.hide();
            }
            
        })
        // if(!cc.find('Canvas').getChildByName('Game').active)
         this.WXInfoButton.show()

    }
    
    getUserInfo() {
        wx.getUserInfo({
            fail: function (res) {
                if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                    // 处理用户拒绝授权的情况
                    this.guideActive()
                }
            }.bind(this),
            success: function (res) {
                this.setUserData(res)
            }.bind(this)
        })
    }
    
    guideActive() {
        wx.showModal({
        title: '警告',
        content: '拒绝授权将无法正常使用排行榜',
        cancelText: '取消',
        showCancel: true,
        confirmText: '设置',
        success: (function (res) {
            if (res.confirm) {
            wx.openSetting({
                success: (function (res) {
                if (res.authSetting['scope.userInfo'] === true) {
                    this.getUserInfo()
                }
                }).bind(this)
            })
            }else {
            }
        }).bind(this)
        })
    }

    setUserDataOnTap(res){
        this.setUserData(res);
        if(this.WXInfoButton){
            this.WXInfoButton.destroy();
            cc.director.emit('WXHideInfo');
        }
        // cc.find('Canvas').getChildByName('Rank').active = true;
        if(this.node.name == 'Advan'){
            Menu.instance.OpenFriend();
        }else
        Menu.instance.OpenRank();
    }
    
    
    setUserData(res) {
        Global.getInstance().wxName = res.userInfo.nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '');  //去除昵称中的emoji
        Global.getInstance().wxHead = res.userInfo.avatarUrl;

        let wxdata = {
            wxName: Global.getInstance().wxName,
            wxHead: Global.getInstance().wxHead
        }
        save('WXInfo', JSON.stringify(wxdata));
        
        let onGet = (ret: any) => {
            cc.log('register', ret);

            if(ret.code == 1){
                // cc.director.emit('FirstReport');
                // Statistics.getInstance().reportRank(Statistics.RANKLIST.杀戮榜, HeroGlobal.instance.MonsterKillCount);
                
                cc.director.emit('FirstReport');
                Statistics.getInstance().reportRank(Statistics.RANKLIST.杀戮榜, HeroGlobal.instance.MonsterKillCount);
                // Statistics.getInstance().reportRank(Statistics.RANKLIST.战力榜, HeroGlobal.instance.HighestCE);
                Statistics.getInstance().reportRank(Statistics.RANKLIST.通关榜, HeroGlobal.instance.StarCount);
                // if(Menu.instance){
                //     Menu.instance.OpenRank();
                // }
            }else{
                cc.log(ret.error);
            }
        }
        // Statistics.getInstance().register(Global.getInstance().wxName, Global.getInstance().wxHead, '', '', onGet);

        Statistics.getInstance().updateUserInfo(Global.getInstance().wxName, Global.getInstance().wxHead, onGet);
    }

    onEnable(){
        if(this.WXInfoButton){
            this.WXInfoButton.show();
        }
    }

    onDisable(){
      if(this.WXInfoButton){
          this.WXInfoButton.hide();
      }
    }

    // update (dt) {}
}
