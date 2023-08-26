import TextureMgr from "./TextureMgr";
import Equipment from "./Equipment";
import HeroGlobal from "./Hero/HeroGlobal";
import AudioMgr from "./Audio";
import Hero from "./Hero/Hero";
import { save } from "./nativets/SaveMgr";

const {ccclass, property} = cc._decorator;
const POSXARRS: number[] = [-110.5, 0, 110.5];

@ccclass
export default class MenuSelect extends cc.Component {
    static instance: MenuSelect = null;

    selectNode: cc.Node;
    icons: cc.Sprite[] = [];
    selectIndex: number;
    isPet: number = 0;
    lockNode: cc.Node;


    // LIFE-CYCLE CALLBACKS:

    init(){
        this.selectNode = this.node.getChildByName('select');
        for (let i = 0; i < 3; i++) {
            this.icons.push(this.node.getChildByName('' + i).getComponent(cc.Sprite));
        }
        this.lockNode = this.node.getChildByName('lock');
        this.lockNode.getComponent(cc.Sprite).spriteFrame = TextureMgr.instance.lockSf;
        this.lockNode.active = false;
        // this.setSelect(HeroGlobal.instance.MainHeroIndex);

        cc.director.on('RefreshIcon', this.refreshIcon, this);
    }

    onLoad () {
        MenuSelect.instance = this;
        this.init();
    }

    start () {

    }

    refreshIcon(){
        if(Equipment.instance && Equipment.instance.listIndex == 3){
            this.setIcons(1);
        }else{
            this.setIcons(0);
        }
    }

    setIcons(type: number){
        // if(this.isPet == type){
        //     return;
        // }
        this.isPet = type;
        cc.log('ispetMenus', MenuSelect.instance.isPet);
        let arrs: cc.SpriteFrame[] = type == 0 ? TextureMgr.instance.heroIconSf : TextureMgr.instance.petIconSf;
        for (let i = 0; i < 3; i++) {
            this.icons[i].spriteFrame = arrs[i];
        }
        this.lockNode.active = (type == 0 && HeroGlobal.instance.Level < 10);
        if(this.lockNode.active)
        this.icons[2].spriteFrame = null;
    }

    setSelect(index: number){
        this.selectIndex = index;
        this.selectNode.x = POSXARRS[index];
        cc.director.emit('RefreshSelect', index);
    }

    onBtnSelect(event: cc.Event){
        AudioMgr.instance.playAudio('BtnClick');
        let index: number = parseInt(event.target.name);
        if(this.isPet == 0 && index == 2){
            // 大乔未解锁
            if(HeroGlobal.instance.Level < 10)
            return;
        }
        this.setSelect(index);
        // cc.director.emit('RefreshSelect', index);
    }

    onEnable(){
        
    }

    onDestroy(){
        cc.director.off('RefreshIcon', this.refreshIcon, this);
    }

    // update (dt) {}
}
