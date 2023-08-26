import Main from "./Main";
import Global from "./nativets/Global";
import MapItem from "./Map/MapItem";
import HeroGlobal from "./Hero/HeroGlobal";
import { MapTitle, MapBox } from "./nativets/Config";
import MapSelect from "./Map/MapSelect";
import AudioMgr from "./Audio";
import Message from "./Message";
import Statistics from "./Tool/Statistics";
import MapBoxLayout from "./Map/MapBox";
import AdMgr from "./Ad/AdMgr";
import { getPlatform, Platform } from "./nativets/Platform";


const {ccclass, property} = cc._decorator;
const POSDOWN: cc.Vec2[] = [cc.v2(-450, 200), cc.v2(-450, 30), cc.v2(-450, -140), 
    cc.v2(-150, -60), cc.v2(-150, 110), 
    cc.v2(150, 200), cc.v2(150, 30), cc.v2(150, -140), 
    cc.v2(450, -60), cc.v2(450, 110), 
];
const POSUP: cc.Vec2[] = [cc.v2(-450, -140), cc.v2(-450, 30),  cc.v2(-450, 200),
    cc.v2(-150, 110), cc.v2(-150, -60),
    cc.v2(150, -140), cc.v2(150, 30), cc.v2(150, 200), 
    cc.v2(450, 110), cc.v2(450, -60), 
];

@ccclass
export default class Map extends cc.Component {
    static instance: Map = null;
    @property(cc.Sprite)
    dotsf: cc.Sprite = null;

    @property(cc.Sprite)
    lightsf: cc.Sprite = null;

    @property(cc.Prefab)
    mapItem: cc.Prefab = null;

    layout: cc.Node;
    index: number;
    btnLeft: cc.Node;
    btnRight: cc.Node;
    MapItemArrs: MapItem[] = [];
    titleLabel: cc.Label;
    bottom: cc.Node;
    starLabel: cc.Label;
    difficultyButton: cc.Button[] = [];
    boxArrs: cc.Sprite[] = [];
    boxLightArrs: cc.Node[] = [];

    base: cc.Node;
    line: cc.Node;
    mapSelect: cc.Node;
    boxStateArrs: number[];
    curStar: number;
    boxBtnArrs: cc.Button[] = [];
    moreBtn: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(){
        Map.instance = this;
        this.index = 0;
        this.base = this.node.getChildByName('base');
        this.mapSelect = this.node.getChildByName('mapSelect');
        this.layout = this.base.getChildByName('Layout');
        this.line = this.base.getChildByName('line');
        this.btnLeft = this.base.getChildByName('Left');
        this.btnRight = this.base.getChildByName('Right');
        this.titleLabel = this.base.getChildByName('titleText').getComponent(cc.Label);
        this.bottom = this.base.getChildByName('bottom');
        this.moreBtn = this.bottom.getChildByName('more');
        this.moreBtn.active = getPlatform() == Platform.WX || getPlatform() == Platform.QQ;
        this.starLabel = this.bottom.getChildByName('text').getComponent(cc.Label);
        for (let i = 0; i < 3; i++) {
            this.difficultyButton.push(this.bottom.getChildByName('' + i).getComponent(cc.Button));
            this.boxArrs.push(this.bottom.getChildByName('box' + i).getComponent(cc.Sprite));
            this.boxBtnArrs.push(this.bottom.getChildByName('box' + i).getComponent(cc.Button));
            this.boxLightArrs.push(this.bottom.getChildByName('light' + i));
        }
        this.mapSelect.getComponent(MapSelect).init();
        this.initLayout();
    }

    initLayout(){
        // let eventHandler = new cc.Component.EventHandler();
        // eventHandler.target = this.node;
        // eventHandler.component = 'Map';
        // eventHandler.handler = 'onBtnLevel';

        for (let i = 1; i < 11; i++) {
            let m: cc.Node = cc.instantiate(this.mapItem);
            m.name = i + '';
            m.parent = this.layout;
            m.position = POSUP[i - 1];
            // m.getComponent(cc.Button).clickEvents.push(eventHandler);
            let mItem: MapItem = m.getComponent(MapItem);
            this.MapItemArrs.push(mItem);
            mItem.init();
            mItem.setLevel(i);
            mItem.setIsBoss(i % 5 == 0);
            mItem.setLockState(false);
        }
    }

    start () {
        // this.getPos();
    }

    onBtnOpenHeroSelect(event: cc.Event){
        // AudioMgr.instance.playAudio('BtnClick');
        let lv: number = parseInt(event.target.name);
        lv = this.index * 10 + parseInt(event.target.name);
        // let trueLv: number = Global.getInstance().gameDifficulty * 40 + lv;
        MapSelect.instance.open(lv);
    }

    onBtnLevel(trueLv: number){
        AudioMgr.instance.playAudio('BtnClick');
        if(HeroGlobal.instance.Life < 5){
            //生命不足
            Message.instance.showLack('life');
            return;
        }
        HeroGlobal.instance.Life -= 5;
        HeroGlobal.instance.saveHeroGlobal();

        Statistics.getInstance().reportEvent('进入游戏');

        // let lv: number = parseInt(event.target.name);
        // let trueLv: number = Global.getInstance().gameDifficulty * 40 + lv;
        Global.getInstance().nowLevel = trueLv;
        
        Main.instance.loadGame(()=>{});
    }

    onBtnMode(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let i: number = parseInt(event.target.name);
        // if(i > Global.getInstance().unlockDifficulty){
        //     return;
        // }
        Global.getInstance().gameDifficulty = i;
        this.refreshDifficulty();
        this.refreshLayout()
    }

    onBtnMoreGame(){
        AudioMgr.instance.playAudio('BtnClick');
        if(AdMgr.instance){
            AdMgr.instance.showGamePortal();
            // AdMgr.instance.showGridAd();
        }
    }

    onBtnHome(){
        AudioMgr.instance.playAudio('BtnClick');
        Main.instance.mapNode.active = false;
        Main.instance.menuNode.active = true;
    }

    onBtnLeft(){
        AudioMgr.instance.playAudio('BtnClick');
        this.index --;
        this.refreshLayout();
    }

    onBtnRight(){
        AudioMgr.instance.playAudio('BtnClick');
        this.index ++;
        this.refreshLayout();
    }

    loadGame(){
        if(Main.instance.gameNode.children.length == 0){
            cc.loader.loadRes('Game',cc.Prefab,(err,prefab)=>{
                if(err) return;
                let n: cc.Node = cc.instantiate(prefab);
                n.parent = Main.instance.gameNode;
                Main.instance.gameNode.active = true;
                this.node.parent.active = false;
            });
        }else{
            Main.instance.gameNode.active = true;
            this.node.parent.active = false;
        }
    }

    ReleaseMap(){
        let uuidArrs: string[] = cc.loader.getDependsRecursively('Map');
        for (let i = 0; i < uuidArrs.length; i++) {
            cc.loader.release(uuidArrs[i]);
        }
    }

    refreshLayout(){
        Global.getInstance().BgIndex = this.index;
        if(this.index % 2 == 1){
            this.reverse(true);
        }else{
            this.reverse(false);
        }
        this.btnLeft.active = this.index == 0 ? false : true;
        this.btnRight.active = this.index == 3 ? false : true;

        let startIndex: number = this.index * 10 /*+ Global.getInstance().gameDifficulty * 40*/;
        let curData: number[] = HeroGlobal.instance.MapData[Global.getInstance().gameDifficulty].slice(startIndex, startIndex + 10);
        let curTotalStar: number = 0;
        //星星
        for (let i = 0; i < 10; i++) {
            let mItem = this.MapItemArrs[i];
            mItem.setSelect(false);
            mItem.setStar(curData[i]);
            curTotalStar += curData[i];
            
            if(i + startIndex < HeroGlobal.instance.Unlock - Global.getInstance().gameDifficulty * 40){
                if(i + startIndex == HeroGlobal.instance.Unlock - 1 - Global.getInstance().gameDifficulty * 40){
                    mItem.setSelect(true);
                }
                mItem.setLockState(false);
            }else{
                mItem.setLockState(true);
            }
        }
        this.curStar = curTotalStar;
        this.refreshMapBoxState(curTotalStar);
        this.refreshTitle();
    }

    refreshMapBoxState(star: number){
        this.starLabel.string = star + '/30';
        let rewardStars = [9, 18, 30];
        let index = Global.getInstance().gameDifficulty * 4 + this.index;
        let boxArrs= HeroGlobal.instance.MapBox[index];
        cc.log('MapBox', index , boxArrs);
        this.boxStateArrs = [];
        for (let i = 0; i < boxArrs.length; i++) {
            if(boxArrs[i] == 0){
                // this.boxArrs[i].node.getComponent(cc.Button).interactable = true;
                this.boxBtnArrs[i].interactable = true;
                // this.boxArrs[i].setMaterial(0, cc.MaterialVariant.createWithBuiltin('2d-sprite', sp));
                this.boxLightArrs[i].active = star >= rewardStars[i];

                if(star >= rewardStars[i]){
                    this.boxStateArrs.push(0);
                }else{
                    this.boxStateArrs.push(-1);
                }
            }else{
                // this.boxArrs[i].setMaterial(0, cc.MaterialVariant.createWithBuiltin('2d-gray-sprite', sp));
                // this.boxArrs[i].node.getComponent(cc.Button).interactable = false;
                this.boxLightArrs[i].active = false;
                this.boxBtnArrs[i].interactable = false;
                this.boxStateArrs.push(1);
            }

        }

        
    }

    onBtnBox(event: cc.Event){
        let eventNum = parseInt(event.target.name[3]);
        let index = Global.getInstance().gameDifficulty * 4 + this.index;
        let boxArrs= HeroGlobal.instance.MapBox[index];
        let json = MapBox[eventNum];
        let state = this.boxStateArrs[eventNum];
        cc.log('BOXCLICK', json, state);
        MapBoxLayout.instance.onOpen(json, state, index, eventNum);
    }

    refreshTitle(){
        this.titleLabel.string = MapTitle[this.index];
    }

    refreshDifficulty(){
        for (let i = 0; i < 3; i++) {
            if(Global.getInstance().gameDifficulty == i){
                this.difficultyButton[i].interactable = false;
            }else /*if(Global.getInstance().gameDifficulty > i)*/{
                this.difficultyButton[i].interactable = true;
            }
            
            let sp = this.difficultyButton[i].node.getComponent(cc.Sprite);
            if(Global.getInstance().unlockDifficulty >= i){
                sp.setMaterial(0, cc.MaterialVariant.createWithBuiltin('2d-sprite', sp));
            }
            else{
                //未解锁变灰
                this.difficultyButton[i].interactable = false;
                sp.setMaterial(0, cc.MaterialVariant.createWithBuiltin('2d-gray-sprite', sp));
            }
            
            
        }
    }

    reverse(up: boolean){
        //颠倒
        this.line.scaleY = up ? 1 : -1;
        let pos: cc.Vec2[] = up ? POSUP : POSDOWN;
        for (let i = 0; i < 10; i++) {
            this.MapItemArrs[i].node.position = pos[i];
        }
    }

    onEnable(){
        if(!this.layout){
            this.init();
        }
        if(Global.getInstance().isMapFocus){
            this.index = Math.floor((HeroGlobal.instance.Unlock - 40 * Global.getInstance().unlockDifficulty - 1) / 10);
        }
        this.refreshDifficulty();
        this.refreshLayout();
    }

    // update (dt) {}
}
