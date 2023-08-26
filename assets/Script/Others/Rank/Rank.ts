import Statistics from "../../Tool/Statistics";
import HeroGlobal from "../../Hero/HeroGlobal";
import Global from "../../nativets/Global";

const {ccclass, property} = cc._decorator;

const myItemY = -244;
const titleArrs = ['全区战力榜', '全区成就榜', '全区杀戮榜'];

@ccclass
export default class Rank extends cc.Component {
    static instance: Rank = null;
    myItem: cc.Node = null;

    layoutNode: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    id: number = 2;
    selectNode: cc.Node;
    titleLabel: cc.Label;
    selectArrs: cc.Node[];
    selectTexts: cc.Node[];
    isNewbie: boolean;

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.layoutNode = this.node.getChildByName('ScrollView').getChildByName('view').getChildByName('content');
        this.selectNode = this.node.getChildByName('select');
        this.titleLabel = this.node.getChildByName('Title').getComponent(cc.Label);
        this.selectArrs = [];
        this.selectTexts = [];
        for (let i = 0; i < 3; i++) {
            this.selectArrs.push(this.selectNode.getChildByName('' + i));
            this.selectTexts.push(this.selectNode.getChildByName('t' + i));
        }
        this.createMyItem();
    }

    onLoad () {
        Rank.instance = this;
        this.init();
    }

    start () {
        
    }

    createMyItem(){
        let item = cc.instantiate(this.itemPrefab);
        item.parent = this.node;
        item.position = cc.v2(0, myItemY);
        this.myItem = item;
        item.active = false;
    }

    onBtnRankSelect(event){
        // let parent: cc.Node = event.target.parent;
        // for (let i = 0; i < 3; i++) {
        //     parent.getChildByName(i + '').getComponent(cc.Button).interactable = true;
        // }
        // parent.getChildByName(event.target.name).getComponent(cc.Button).interactable = false;
        if(this.id == parseInt(event.target.name)){
            return;
        }
        this.id = parseInt(event.target.name);

        this.refreshRank(this.id);
    }

    refreshState(id: number){
        this.titleLabel.string = titleArrs[id];
        for (let i = 0; i < 3; i++) {
            this.selectArrs[i].active = id == i;
            this.selectTexts[i].color = id == i ? cc.Color.WHITE : cc.color(108, 109, 117);
        }
    }

    refreshRank(id: number){
        // this.setLoadingState(true);
        this.refreshState(id);
        this.layoutNode.removeAllChildren();
        let onGet = (ret: any) => {
            console.log(ret);
            if(ret.code == 1){

                //刷新自己的
                // if(this.isNewbie){
                //     this.showNewbie(id + 1,ret.data);
                // }else{

                    for (let i = 0; i < ret.data.length; i++) {
                        let n: cc.Node = cc.instantiate(this.itemPrefab);
                        this.initItem(n,i + 1,ret.data[i].name,ret.data[i].score,ret.data[i].headpic);
                        n.parent = this.layoutNode;
                    }
                    
                    if(ret.mypos != 0){
                        // console.log("mypos= ",ret);
                        if(HeroGlobal.instance.AchieveCountData[4] == 0){
                            HeroGlobal.instance.AchieveCountData[4] = ret.mypos;
                        }else{
                            if(ret.mypos < HeroGlobal.instance.AchieveCountData[4]){
                                HeroGlobal.instance.AchieveCountData[4] = ret.mypos;
                            }
                        }
                        this.initItem(this.myItem,ret.mypos,ret.myname,ret.myscore,ret.myheadpic);
                        this.myItem.active = true;
                    }
                    else
                    this.myItem.active = false;

                // }
                
            }else{
                cc.log(ret.error);
                this.myItem.active = false;
            }
            // this.setLoadingState(false);
        }
        
        // 战力 1
        // 通关 2
        // 杀戮 3

        // 阈值
        // 90231
        // 124
        // 1053
        let isNewbie = true;
        switch (id) {
            case 0:
                isNewbie = HeroGlobal.instance.HighestCE < 90231;
                break;
            case 1:
                isNewbie = HeroGlobal.instance.StarCount < 124;
                break;
            case 2:
                isNewbie = HeroGlobal.instance.MonsterKillCount < 1053;
                break;
            default:
                break;
        }
        this.isNewbie = isNewbie;
        Statistics.getInstance().getRank(id + 1,onGet, isNewbie);
    }

    initItem(node: cc.Node,rank: number,name?: string,score?: number,headpic?: string){
        console.log('HEAD',headpic);
        for (let i = 1; i <= 3; i++) {
            node.getChildByName('' + i).active = false;
            node.getChildByName('rank').getComponent(cc.Label).string = '';
        }
        if(rank == 1 || rank == 2 || rank == 3){
            node.getChildByName('' + rank).active = true;
        }else{
            let str = '' + rank;
            if(rank > 50){
                str = '100+';
            }
            node.getChildByName('rank').getComponent(cc.Label).string = str;
        }
        if(!name){
            name = '';
        }

        // let topArrs = ['iconbg1', 'bg1']

        node.getChildByName('iconbg1').active = rank == 1;
        node.getChildByName('bg1').active = rank == 1;

        node.getChildByName('name').getComponent(cc.Label).string = name;
        let strArrs = ['战力 ', '星数 ', '杀敌 '];
        node.getChildByName('text').getComponent(cc.Label).string = strArrs[this.id] + score + '';

        node.getChildByName('good').getComponent(cc.Label).string = Math.floor(Math.random() * 18) + '';

        if(headpic){
            cc.loader.load(headpic,(err,tex)=> {
                let spriteFrame: cc.SpriteFrame = new cc.SpriteFrame(tex);
                if(tex){
                    node.getChildByName('icon').setContentSize(74, 74);
                    node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    node.getChildByName('icon').setContentSize(74, 74);
                }
            });
        }
    }

    // update (dt) {}

    sortRank(a: any, b: any){
        return parseInt(b.score) - parseInt(a.score);
    }

    showNewbie(rid: number, data: any){
        let visiable = true;
        let mypos = 101;
        let myscore = 0;
        switch (rid) {
            case 1:
                visiable = HeroGlobal.instance.HighestCE > 0;
                myscore = HeroGlobal.instance.HighestCE;
                break;
            case 2:
                visiable = HeroGlobal.instance.StarCount > 0;
                myscore = HeroGlobal.instance.StarCount;
                break;
            case 3:
                visiable = HeroGlobal.instance.MonsterKillCount > 0;
                myscore = HeroGlobal.instance.MonsterKillCount;
            default:
                break;
        }

        if(visiable){
            let json = {
                name: Global.getInstance().registerName,
                headpic: Global.getInstance().registerHead,
                score: myscore
            }
            data.push(json);
            data.sort(this.sortRank);
            mypos = data.indexOf(json) + 1;
            cc.log(mypos, data);
        }

        for (let i = 0; i < 50; i++) {
            let n: cc.Node = cc.instantiate(this.itemPrefab);
            this.initItem(n, i + 1, data[i].name, data[i].score, data[i].headpic);
            n.parent = this.layoutNode;
        }

        if(mypos != 0){
            // console.log("mypos= ",ret);
            if(HeroGlobal.instance.AchieveCountData[4] == 0){
                HeroGlobal.instance.AchieveCountData[4] = mypos;
            }else{
                if(mypos < HeroGlobal.instance.AchieveCountData[4]){
                    HeroGlobal.instance.AchieveCountData[4] = mypos;
                }
            }
            this.initItem(this.myItem, mypos, Global.getInstance().registerName, myscore, Global.getInstance().registerHead);
            this.myItem.active = true;
        }
        else
        this.myItem.active = false;
    }

    onEnable(){
        this.refreshRank(this.id);
    }
}
