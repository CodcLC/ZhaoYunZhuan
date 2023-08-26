import Menu from "../Menu";
import TextureMgr from "../TextureMgr";
import AllText from "../i18n/Language";
import AudioMgr from "../Audio";
import Global from "../nativets/Global";
import HeroGlobal from "../Hero/HeroGlobal";
import Statistics from "../Tool/Statistics";
import Main from "../Main";
import { save } from "../nativets/SaveMgr";
import AdMgr from "../Ad/AdMgr";

const {ccclass, property} = cc._decorator;

const LEN = [[230, 250, 250, 200],[240, 230, 220, 250]];
const DC = [240, 230, 220, 250];
let SkillNameArrs: string[][] = [[AllText.skillZY0, AllText.skillZY1, AllText.skillZY2, AllText.skillZY3, AllText.skillZY4, AllText.skillZY5, AllText.skillZY6],
[AllText.skillDC0, AllText.skillDC1, AllText.skillDC2, AllText.skillDC3, AllText.skillDC4, AllText.skillDC5, AllText.skillDC6],
[AllText.skillDQ0, AllText.skillDQ1, AllText.skillDQ2, AllText.skillDQ3, AllText.skillDQ4, AllText.skillDQ5, AllText.skillDQ6],
]

let heroName: string[] = ['赵云', '貂蝉'];
let heroAudio: string[] = [Global.getInstance().ZYAudio.出场, Global.getInstance().DCAudio.出场,
                            ]

@ccclass
export default class FirstSelect extends cc.Component {
    static instance: FirstSelect = null;
    heroName: cc.Label;
    arrs1: cc.Node[];
    arrs2: cc.Sprite[];
    arrs3: cc.Label[];

    init(){
        this.heroName = this.node.getChildByName('name').getComponent(cc.Label);
        let leftNode = this.node.getChildByName('Left');
        let rightNode = this.node.getChildByName('Right');
        this.arrs1 = [];
        this.arrs2 = [];
        this.arrs3 = [];
        for (let i = 0; i < 4; i++) {
            this.arrs1.push(rightNode.getChildByName('' + i));
            this.arrs2.push(leftNode.getChildByName('' + i).getComponent(cc.Sprite));
            this.arrs3.push(leftNode.getChildByName('t' + i).getComponent(cc.Label));
        }
        this.initIcon();
        cc.director.on('RefreshSelect', this.onSelect, this);
    }

    initIcon(){
        let selectNode = this.node.getChildByName('select');
        for (let i = 0; i < 3; i++) {
            selectNode.getChildByName('' + i).getComponent(cc.Sprite).spriteFrame = TextureMgr.instance.heroIconSf[i];
        }
        selectNode.getChildByName('' + 2).getComponent(cc.Sprite).spriteFrame = TextureMgr.instance.lockSf;
    }

    onLoad () {
        FirstSelect.instance = this;
        this.init();
        this.onOpen();
        
    }

    

    start () {
        this.onSelect(0);
        
    }


    setLength(){

    }

    onSelect(index: number){
        cc.log(index);
        AudioMgr.instance.playFirst(heroAudio[index]);
        this.heroName.string = heroName[index];
        for (let i = 0; i < 4; i++) {
            this.arrs1[i].width = LEN[index][i];
            this.arrs2[i].spriteFrame = TextureMgr.instance.skillArrs[index][i];
            this.arrs3[i].string = SkillNameArrs[index][i];
        }
        HeroGlobal.instance.MainHeroIndex = index;
    }

    onBtnCLose(){
        Main.instance.loadingNode.active = true;
        this.onClose();
        Statistics.getInstance().reportEvent('进入游戏');
        Global.getInstance().gameDifficulty = 0;
        Global.getInstance().BgIndex = Global.getInstance().gameDifficulty;
        Global.getInstance().nowLevel = 1;
        Main.instance.loadGame(()=>{});
    }

    onOpen(){
        //Menu界面的人物位移
        Menu.instance.BottomNode.active = false;
        Menu.instance.RightNode.active = false;
        Menu.instance.LeftRoot.x = 0;
    }

    onClose(){
        cc.director.off('RefreshSelect', this.onSelect, this);
        Menu.instance.BottomNode.active = true;
        Menu.instance.RightNode.active = true;
        this.node.active = false;
        Menu.instance.LeftRoot.x = -330;
        save('FirstSelect', 'true');
        this.hideBanner();
    }

    hideBanner(){
        if(AdMgr.instance){
            AdMgr.instance.hideBanner();
        }
    }

    // update (dt) {}
}
