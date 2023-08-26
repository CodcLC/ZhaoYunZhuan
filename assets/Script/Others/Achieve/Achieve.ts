import AchieveItem from "./AchieveItem";
import AchieveLv from "./AchieveLv";
import HeroGlobal from "../../Hero/HeroGlobal";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Achieve extends cc.Component {
    static instance: Achieve = null;

    @property(cc.Prefab)
    achieveItem: cc.Prefab = null;
    layoutNode: cc.Node;
    achieveScripts: AchieveItem[];
    achieveLvScript: AchieveLv;


    init(){
        this.layoutNode = this.node.getChildByName('ScrollView').getChildByName('view').getChildByName('content');
        this.initLayout();
    }

    initLayout(){
        this.achieveScripts = [];
        for (let i = 0; i < 9; i++) {
            let t = cc.instantiate(this.achieveItem);
            t.parent = this.layoutNode;
            this.achieveScripts.push(t.getComponent(AchieveItem));
            this.achieveScripts[i].init(i);
        }
        this.achieveLvScript = this.node.getChildByName('lv').getComponent(AchieveLv);
        this.achieveLvScript.init(9);
    }

    onLoad () {
        Achieve.instance = this;
        this.init();
    }

    onRefresh(){
        for (let i = 0; i < 9; i++) {
            this.achieveScripts[i].onRefresh(i);
            
        }
        HeroGlobal.instance.setExp(HeroGlobal.instance.Exp);
        this.achieveLvScript.onRefresh(9);
    }

    onEnable(){
        this.onRefresh();
    }

    start () {

    }

    // update (dt) {}
}
