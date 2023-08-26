import { getPLATID } from "../nativets/Platform";

var _URL = 'https://h5admin.goodgame360.com';
var _METHOD='POST';

var _SECRETKEY='cfKb@MIL2SnUhy#0Bnd#V1ClRdGgOaxh'; //密钥
// var _PID=24; //产品ID(每个产品对应配置)
// var _PID2 = 62; //产品ID2
var game_id = getPLATID(); //产品ID(每个产品对应配置)
var _PLATID=1; //游戏平台ID(1:微信小游戏; 2:QQ小游戏，3：Oppo小游戏,4:Vivo小游戏,5:头条小游戏;)

// http状态码 1成功 2失败

export default class NewHttp{
   
    static md5 = require('md5');

    static sendRequest(path, data, CallBack, timeoutCallback?){
        let url=_URL;
        if(path!=undefined && path!=null && path!='')
            url+=path;
        if(data==undefined || data==null || data=='')
            _METHOD='GET';
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        // if (cc.sys.isNative){
        //     xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
        // }
        
        xhr.onreadystatechange = function() {
            if(xhr.readyState==4 && xhr.status==200){
                if(CallBack!=undefined && CallBack!=null){
                    CallBack(xhr.responseText);
                }
            }
        };

        xhr.ontimeout=function(){
            if(timeoutCallback!=undefined && timeoutCallback!=null){
                timeoutCallback();
            }
        }
        
        xhr.open(_METHOD, url, true);

        xhr.send(data);
    }

    static postRequest(path, data, CallBack, timeoutCallback?){
        let url=_URL;
        if(path!=undefined && path!=null && path!='')
            url+=path;
        if(data==undefined || data==null || data=='')
            _METHOD='GET';
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        // if (cc.sys.isNative){
        //     xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
        // }
        
        xhr.onreadystatechange = function() {
            if(xhr.readyState==4 && xhr.status==200){
                if(CallBack!=undefined && CallBack!=null){
                    CallBack(xhr.responseText);
                }
            }
        };

        xhr.ontimeout=function(){
            if(timeoutCallback!=undefined && timeoutCallback!=null){
                timeoutCallback();
            }
        }
        
        xhr.open('POST', url, true);

        xhr.send(data);
    }

    /**获取广告开关ID*/
    static getSwitch(id, CallBack){
        // console.log("getSwithch = ",id);
        let head = '/index.php/Game/Game_switch/getSwitch';
        var path= head + '?game_id='+ game_id +'&id='+ id;
        this.sendRequest(path, '', function(ret){
            if(CallBack!=undefined && CallBack!=null){
                console.log("开关配置信息: ",JSON.parse(ret));
                CallBack(JSON.parse(ret));
            }
        });
    }

    /**上报自定义事件 */
    static reportEvent(uuid, event){
        let head = '/index.php/Game/report/reportEvent';
        var sign=this.md5(game_id+uuid+event+_SECRETKEY);
        var path= head + '?game_id='+game_id+'&uuid='+uuid+'&event='+event+'&sign='+sign;
        this.sendRequest(path, '', null);
    }

    /**上报关卡 */
    static reportStage(uuid,stageid,stagename,event){
        let head = '/index.php/Game/report/reportStage';
        var sign=this.md5(game_id+uuid+stageid+stagename+event+_SECRETKEY);
        var path= head + '?game_id='+game_id+'&uuid='+uuid+'&stageid='+stageid+'&stagename='+stagename+'&event='+event+'&sign='+sign;
        this.sendRequest(path, '', null);
    }

    /**注册用户 */
    static register(platid,uuid,name,headpic,sceneid,openid,CallBack){
        let head = '/index.php/Game/user/register';
        var sign=this.md5(game_id+uuid+name+headpic+platid+sceneid+openid+_SECRETKEY);
        var path=head + '?game_id='+game_id+'&uuid='+uuid+'&name='+name+'&headpic='+headpic+'&platid='+platid+'&sceneid='+sceneid+'&openid='+openid+'&sign='+sign;
        console.log(path);
        this.sendRequest(path, '', function(ret){
            if(CallBack!=undefined && CallBack!=null){
                CallBack(JSON.parse(ret));
                // console.log("注册: ",JSON.parse(ret));
            }
        });
    }

    /**更新用户 */
    static updateUserInfo(uuid,name,headpic,CallBack){
        let head = '/index.php/Game/user/updateUserInfo';
        var sign=this.md5(game_id+uuid+name+headpic+_SECRETKEY);
        var path=head + '?game_id='+game_id+'&uuid='+uuid+'&name='+name+'&headpic='+headpic+'&sign='+sign;
        // console.log('ttUD')
        this.sendRequest(path, '', function(ret){
            if(CallBack!=undefined && CallBack!=null){
                CallBack(JSON.parse(ret));
                console.log("更新: ",JSON.parse(ret));
            }
        });
    }

    /**上报排行榜 */
    static report(rid,uuid,score){
        let head = '/index.php/Game/tank/report';
        var sign=this.md5(game_id+''+rid+uuid+score+_SECRETKEY);
        var path=head + '?game_id='+game_id+'&rid='+rid+'&uuid='+uuid+'&score='+score+'&sign='+sign;
        this.sendRequest(path, '',function(ret){
        });
    }


    //上报游戏排行榜数据
    // report : function(rid,uuid,score){
    //     var sign=this.md5(_PID+''+rid+uuid+score+_SECRETKEY);
    //     var path='?r=api/report&pid='+_PID+'&rid='+rid+'&uuid='+uuid+'&score='+score+'&sign='+sign;
    //     this.sendRequest(path, '',function(ret){
    //         // console.log('GAMERANK',ret);
    //     });
    // },

    /**获取排行榜 */
    static getRank(rid,num,uuid,CallBack){
        let head = '/index.php/Game/tank/GetTank';
        var path=head+'?game_id='+game_id+'&rid='+rid+'&num='+num+'&uuid='+uuid;
        this.sendRequest(path, '', function(ret){
            if(CallBack!=undefined && CallBack!=null){
                CallBack(JSON.parse(ret));
                // console.log('GETGAMERANK',ret);
            }
        });
    }

    /**获取第三方OPENID */
    static getOpenid(platid,code,CallBack){
        let head = '/index.php/Game/user/getOpenid';
        var sign=this.md5(game_id+''+platid+code+_SECRETKEY);
        var path = head + '?game_id='+game_id+'&platid='+platid+'&code='+code+'&sign='+sign;
        this.sendRequest(path, '', function(ret){
            if(CallBack!=undefined && CallBack!=null){
                CallBack(JSON.parse(ret));
            }
        });
    }

    /**上报广告 */
    static reportAd(ad_id,event,uuid){
        let head = '/index.php/Game/report/reportAd';
        var sign=this.md5(game_id+''+uuid+event+ad_id+_SECRETKEY);
        var path = head + '?game_id='+game_id+'&uuid='+uuid+'&ad_id='+ad_id+'&event='+event+'&sign='+sign;
        console.log('ra',ad_id,event);
        this.sendRequest(path, '', function(ret){
            if(JSON.parse(ret).code == 0){
                console.log(_URL+path);
                // setTimeout(() => {
                //     this.sendRequest(path, '', null);
                // }, 30 + Math.random() * 100);
            }
            
        });
    }

    /**上报广告优化版 */
    static newReportAd(ad_info,uuid){
        if(ad_info == '{}') return;
        let head = '/index.php/Game/report/newReportAd';
        var sign=this.md5(game_id+''+uuid+_SECRETKEY);
        var path = head;
        console.log('ra',ad_info);
        let data = {
            game_id: game_id,
            uuid: uuid,
            sign: sign,
            ad_info: ad_info
        }
        this.postRequest(path, data, function(ret){
            if(JSON.parse(ret).code == 0){
                console.log(_URL+path);
                // setTimeout(() => {
                //     this.sendRequest(path, '', null);
                // }, 30 + Math.random() * 100);
            }
            
        });
    }
}
