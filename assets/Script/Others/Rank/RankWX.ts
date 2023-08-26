import AudioMgr from "../../Audio";


let Consts = {
	OpenDataKeys: {
		InitKey: "initKey",
		Grade: "testkey",
		LevelKey: "reachlevel",
        ScoreKey: "levelScore", // json.string
        KillKey: "KillRank",
		StarKey: "StarRank"
	},
	DomainAction: {
		FetchFriend: "FetchFriend",
		FetchGroup: "FetchGroup",
		FetchFriendLevel: "FetchFriendLevel", //好友关卡进度排行
		FetchFriendScore: "FetchFriendScore", //好友关卡得分排行
		HorConmpar: "HorConmpar", //横向比较 horizontal comparison
		Paging: "Paging",
        Scrolling: "Scrolling",
        KillRank: "KillRank",
        StarRank: "StarRank"
	},
}

// 这个换成自己的逻辑
let utils = {
    curLevel : 1,
    getScore : _=>{return 1}
}


const { ccclass, property } = cc._decorator;

@ccclass
export default class RankWX extends cc.Component {

    static instance: RankWX=null;

    @property(cc.Sprite)
    rankRender:cc.Sprite=null; // render spr
    @property(cc.Node)
    rankListNode:cc.Node=null;

    // @property(cc.Node)
    // rankBgNode:cc.Node=null;

    // @property(Boolean)
    enableScroll = true;//

    _timeCounter=0;
    rendInterval=0.5;//刷新排行画布间隔s

    rankTexture:cc.Texture2D=null;
    rankSpriteFrame : cc.SpriteFrame=null;
    closeBackRank=0; // 关闭后操作

    id: number = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        RankWX.instance = this;
        
        this.rankTexture = new cc.Texture2D();
        this.rankSpriteFrame = new cc.SpriteFrame();
        this.resizeSharedCanvas(this.rankRender.node.width, this.rankRender.node.height)
    }

    onBtnRankSelect(event){
        let parent: cc.Node = event.target.parent;
        parent.getChildByName('0').getComponent(cc.Button).interactable = !parent.getChildByName('0').getComponent(cc.Button).interactable;
        parent.getChildByName('1').getComponent(cc.Button).interactable = !parent.getChildByName('1').getComponent(cc.Button).interactable;
        this.id = this.id == 0 ? 1:0;
        // this.refreshRank(parseInt(event.target.name));
        this.showRank(this.id);
    }

    refreshRank(id: number){

    }

    // start() {
    // }

    update(dt) {
        this.updateRankList()
    }

    resizeSharedCanvas(width, height){
        if(!window["wx"]) return;
        let sharedCanvas = window["wx"].getOpenDataContext().canvas
        sharedCanvas.width = width
        sharedCanvas.height = height
        console.log(sharedCanvas)
    }

    changeRender(renderNode:cc.Node){
        this.rankRender.node.width = renderNode.width
        this.rankRender.node.height = renderNode.height
        this.rankRender.node.position = renderNode.position
        this.resizeSharedCanvas(renderNode.width, renderNode.height)
    }

    updateRankList() {
        if(!window["wx"]) return;
        if(!this.rankTexture) return;
        let sharedCanvas = window["wx"].getOpenDataContext().canvas;
        this.rankTexture.initWithElement(sharedCanvas);
        this.rankTexture.handleLoadedTexture();
        if(!this.rankSpriteFrame){
            this.rankSpriteFrame = new cc.SpriteFrame();
            // this.rankSpriteFrame._sprite
        }
        this.rankSpriteFrame.setTexture(this.rankTexture);
        
        this.rankRender.spriteFrame = this.rankSpriteFrame;
    }

    onEnable() {
        this.rankRender.spriteFrame = null;
        this.changeRender(this.rankListNode);
        if (this.enableScroll) {
            this.rankRender.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        }
        this.showRank(this.id);
        // this.refreshRank(this.id);
        // this.postMessage(Consts.DomainAction.FetchFriendLevel)
    }

    onDisable() {
        if (this.enableScroll) {
            this.rankRender.node.off(cc.Node.EventType.TOUCH_MOVE)
        }
        this.rankRender.spriteFrame = null;
    }

    onPageUp() {
        cc.log(this)
        this.postMessage("Paging", -1)
    }

    onPageDown() {
        this.postMessage("Paging", 1)
    }


    onTouchMove(event) {
        const deltaY = event.getDeltaY();
        // console.log("rank touchmove:", deltaY);
        this.postMessage("Scrolling", deltaY)
    }

    onBtnClose(){
        AudioMgr.instance.playAudio('BtnClick');
        // this.node.active=false;
        var n = this.node;
        var act = cc.sequence(cc.scaleTo(0.12,1.1),cc.scaleTo(0.1,0.5),cc.callFunc(()=>{
            n.active  = false;
            n.scaleX = 1;
            n.scaleY = 1;
        }));
        n.runAction(act);
    }

    //获取关卡进度排行
    loadLevelOpenRank(){
        this.node.active = true;
        this.onEnable()
        this.changeRender(this.rankListNode)        
        this.postMessage(Consts.DomainAction.FetchFriendLevel)
    }

    showRank(id: number){
        
        if(id == 0){
            this.postMessage(Consts.DomainAction.KillRank);
        }else{
            this.postMessage(Consts.DomainAction.StarRank);
        }
    }

    //向子域发送消息
    postMessage(action, data=null, dataEx=null) {
        if(!window["wx"]) return;
        let openDataContext = window["wx"].getOpenDataContext()
        openDataContext.postMessage({
            action: action,
            data: data,
            dataEx:dataEx,
        })
    }

    //wx api
    // 上传关卡分数
    uploadScore(level, score) {
        if(!window["wx"]) return;
        score = score.toString()
        window["wx"].setUserCloudStorage({
            KVDataList: [
                { key: Consts.OpenDataKeys.ScoreKey+level, value: score },
            ],
            success: (res) => {
                console.log("uploadScore success:res=>", res)
            },
            fail: (res) => {
                console.log("uploadScore fail:res=>", res)
            }
        })
    }

    // 上传关卡开启进度
    uploadLevelOpen(level){
        if (!window.window["wx"]) return
        level = level.toString()
        window["wx"].setUserCloudStorage({
            KVDataList: [
                { key: Consts.OpenDataKeys.LevelKey, value: level },
            ],
            success: (res) => {
                console.log("uploadScore success:res=>", res)
            },
            fail: (res) => {
                console.log("uploadScore fail:res=>", res)
            }
        })
    }

    //上传击杀数
    static uploadWXKill(kill: number){
        if (!window.window["wx"]) return
        let v: string = kill + '';
        window["wx"].setUserCloudStorage({
            KVDataList: [
                { key: Consts.OpenDataKeys.KillKey, value: v },
            ],
            success: (res) => {
                console.log("uploadScore Kill success:res=>", res)
            },
            fail: (res) => {
                console.log("uploadScore Kill fail:res=>", res)
            }
        })
    }

    //上传星数
    uploadWXStar(star: number){
        if (!window.window["wx"]) return
        let v: string = star + '';
        window["wx"].setUserCloudStorage({
            KVDataList: [
                { key: Consts.OpenDataKeys.StarKey, value: v },
            ],
            success: (res) => {
                console.log("uploadScore Star success:res=>", res)
            },
            fail: (res) => {
                console.log("uploadScore Star fail:res=>", res)
            }
        })
    }

    //删除微信数据
    removeUserKey(key_or_keys) {
        if (!window.window["wx"]) return
        if(typeof(key_or_keys)==="string"){
            key_or_keys = [key_or_keys]
        }
        window["wx"].removeUserCloudStorage({
            keyList: key_or_keys,
            success: (res) => {
                console.log("uploadScore success:res=>", res)
            },
            fail: (res) => {
                console.log("uploadScore fail:res=>", res)
            }
        })
    }


}
