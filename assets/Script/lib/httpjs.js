var _URL = 'https://api.goodgame360.com/index.php';
var _METHOD='POST';

var _SECRETKEY='cfKb@MIL2SnUhy#0Bnd#V1ClRdGgOaxh'; //密钥
var _PID=24; //产品ID(每个产品对应配置)
var _PID2 = 62; //产品ID2
var _PLATID=1; //游戏平台ID(1:微信小游戏; 2:QQ小游戏，3：Oppo小游戏,4:Vivo小游戏,5:头条小游戏;)


var _STRIKEID=62; //穿透控制id
var HTTPTJ = cc.Class({
    extends: cc.Component,

    statics:{
        sendRequest : function(path,data,CallBack,timeoutCallback){
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
        },
        md5 : require('md5'),

        //获取第三方OPENID
        getOpenid : function(platid,code,CallBack){

            var sign=this.md5(_PID+''+platid+code+_SECRETKEY);
            var path='?r=api/getopenid&pid='+_PID+'&platid='+platid+'&code='+code+'&sign='+sign;
            this.sendRequest(path, '', function(ret){
                if(CallBack!=undefined && CallBack!=null){
                    CallBack(JSON.parse(ret));
                }
            });
        },

        //获取微信误点开关是否打开(同时受ip和概率控制，只有当前ip不在黑名单并且误点概率大于0并且版本号与黑名单版本号不匹配时开关为打开状态)
        isSwitchOn : function(CallBack){
            this.getStrikeId(function(ret){
                if(CallBack!=undefined&&CallBack!=null){
                    console.log(ret);
                    console.log("当前城市："+cc.sys.localStorage.getItem('city'));
                    if(ret.code==200){
                        // console.log("城市黑名单："+ret.data.area);
                        // console.log("当前城市："+cc.sys.localStorage.getItem('city'));
                        // console.log("是否为黑名单："+ret.data.area.search(cc.sys.localStorage.getItem('city'))==-1);
                        // console.log("概率："+ret.data.rate);
                        CallBack(((ret.data.area.search(cc.sys.localStorage.getItem('city'))==-1)&&ret.data.rate>0&&(ret.data.version.search(',1.0.4,')==-1))?true:false);//当前ip不在城市黑名单且误点概率不为0
                    }else{
                        CallBack(false);
                    }
                }
            });
        },
        //获取广告开关ID
        getSwitch : function(id,CallBack){
            console.log("getSwithch = ",id);
            var path='?r=api/getswitch&id='+ id;
            this.sendRequest(path, '', function(ret){
                if(CallBack!=undefined && CallBack!=null){
                    console.log("开关配置信息: "+JSON.parse(ret));
                    CallBack(JSON.parse(ret));
                }
            });
        },
        //获取误点概率
        getRate :function(CallBack){
            this.getStrikeId(function(ret){
                if(CallBack!=undefined&&CallBack!=null){
                    if(ret.code==200){
                        // console.log("概率"+ret.data.rate);
                        CallBack(ret.data.rate);
                    }else{
                        CallBack(0);
                    }
                }
            });
        },
        //获取广告开关ID
        getStrikeId : function(CallBack){
            console.log("getStrike,_STRIKEID = "+_STRIKEID);
            var path='?r=api/getswitch&id='+ _STRIKEID;
            this.sendRequest(path, '', function(ret){
                if(CallBack!=undefined && CallBack!=null){
                    cc.log("开关配置信息: "+JSON.parse(ret));
                    CallBack(JSON.parse(ret));
                }
            });
        },
        //注册、更新用户
        register : function(platid,uuid,name,headpic,sceneid,openid,CallBack){

            var sign=this.md5(_PID+uuid+name+headpic+platid+sceneid+openid+_SECRETKEY);
            var path='?r=api/register&pid='+_PID+'&uuid='+uuid+'&name='+name+'&headpic='+headpic+'&platid='+platid+'&sceneid='+sceneid+'&openid='+openid+'&sign='+sign;
            this.sendRequest(path, '', function(ret){
                if(CallBack!=undefined && CallBack!=null){
                    CallBack(JSON.parse(ret));
                }
            });
            console.log("register");
        },

        //退出游戏
        exit : function(uuid){
            var sign=this.md5(_PID+uuid+_SECRETKEY);
            var path='?r=api/exit&pid='+_PID+'&uuid='+uuid+'&sign='+sign;
            this.sendRequest(path);
        },

        //上报游戏排行榜数据
        report : function(rid,uuid,score){
            var sign=this.md5(_PID+''+rid+uuid+score+_SECRETKEY);
            var path='?r=api/report&pid='+_PID+'&rid='+rid+'&uuid='+uuid+'&score='+score+'&sign='+sign;
            this.sendRequest(path, '',function(ret){
                // console.log('GAMERANK',ret);
            });
        },

        //获取排行榜
        getRank : function(rid,num,uuid,CallBack){
            var path='?r=api/getrank&pid='+_PID+'&rid='+rid+'&num='+num+'&uuid='+uuid;
            this.sendRequest(path, '', function(ret){
                if(CallBack!=undefined && CallBack!=null){
                    CallBack(JSON.parse(ret));
                    // console.log('GETGAMERANK',ret);
                }
            });
        },

        //上报游戏关卡数据
        // 事件,取值如下：
        // complete:成功
        // fail:失败

        reportStage : function(uuid,stageid,stagename,event){
            var sign=this.md5(_PID+uuid+stageid+stagename+event+_SECRETKEY);
            var path='?r=api/reportstage&pid='+_PID+'&uuid='+uuid+'&stageid='+stageid+'&stagename='+stagename+'&event='+event+'&sign='+sign;
            this.sendRequest(path);
        },

        //上报自定义事件数据
        reportEvent : function(uuid,event){
            console.log("reportEvent");
            var sign=this.md5(_PID+uuid+event+_SECRETKEY);
            var path='?r=api/reportevent&pid='+_PID+'&uuid='+uuid+'&event='+event+'&sign='+sign;
            this.sendRequest(path);
        },

        //上报广告数据
        reportAdv : function(uuid,event){
            var sign=this.md5(_PID+uuid+event+_SECRETKEY);
            var path='?r=api/reportadv&pid='+_PID+'&uuid='+uuid+'&event='+event+'&sign='+sign;
            this.sendRequest(path);
        },

        // 上报订阅记录
        reportSubs : function(platid,uuid,tpl_id,version){
            var sign=this.md5(_PID+''+_PID2+''+platid+uuid+tpl_id+version+_SECRETKEY);
            var path='?r=api/reportsubscribe&pid='+_PID+'&pid2='+_PID2+'&platid='+platid+'&openid='+uuid+'&tpl_id='+tpl_id+'&version='+version+'&sign='+sign;
            // this.sendRequest(path);
            this.sendRequest(path, '', function(ret){
                cc.log(ret, JSON.parse(ret));
            });
        },
    },
});