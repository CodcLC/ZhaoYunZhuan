import Game from "./Game";
import NodePool from "./nativets/NodePool";
import Hero from "./Hero/Hero";
import HeroSkill from "./Hero/HeroSkill";
import HeroGlobal from "./Hero/HeroGlobal";
import Global from "./nativets/Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillMgr extends cc.Component {
    static instance: SkillMgr = null;
    @property(cc.Prefab)
    skillPrefab: cc.Prefab = null;
    SkillPool: any;

    @property(cc.Prefab)
    ZYskillPrefab: cc.Prefab = null;
    ZYSkillPool: any;

    @property(cc.Prefab)
    DQskillPrefab: cc.Prefab = null;
    DQSkillPool: any;

    // LIFE-CYCLE CALLBACKS:

    init(){

        switch (HeroGlobal.instance.MainHeroIndex) {
            case 1:
                this.SkillPool = new NodePool();
                let s: cc.Node = cc.instantiate(this.skillPrefab);
                s.parent = Game.instance.gameEffectNode;
                this.SkillPool.put(s);
                break;
            case 0:
                this.ZYSkillPool = new NodePool();
                let s1: cc.Node = cc.instantiate(this.ZYskillPrefab);
                s1.parent = Game.instance.gameEffectNode;
                this.ZYSkillPool.put(s1);
                break;
            case 2:
                this.DQSkillPool = new NodePool();
                let s2: cc.Node = cc.instantiate(this.DQskillPrefab);
                s2.parent = Game.instance.gameEffectNode;
                this.DQSkillPool.put(s2);
                break;
            default:
                break;
        }
        

        

        

    }
    

    onLoad () {
        SkillMgr.instance = this;
        this.init();
    }

    start () {

    }

    getSkillPool(index: number){
        // let index: number = HeroGlobal.instance.MainHeroIndex;
        if(index == 0){
            return this.ZYSkillPool;
        }else if(index == 1){
            return this.SkillPool;
        }else{
            return this.DQSkillPool;
        }
    }

    getSkillItem(): cc.Node{
        let index: number = HeroGlobal.instance.MainHeroIndex;
        let prefab: cc.Prefab = null;
        let pool: any = null;
        if(index == 0){
            prefab = this.ZYskillPrefab;
            pool = this.ZYSkillPool;
        }else if(index == 1){
            prefab = this.skillPrefab;
            pool = this.SkillPool;
        }else{
            prefab = this.DQskillPrefab;
            pool = this.DQSkillPool;
        }
        let s: cc.Node = pool.get();
        if(!s){
            s = cc.instantiate(prefab);
            s.parent = Game.instance.gameEffectNode;
            pool.put(s);
        }
        return s;
    }

    create(anim: string){
        let s: cc.Node = this.getSkillItem();
        let pos = Hero.instance.node.position;
        if(anim == 'jump_middle_attack'){
            if(HeroGlobal.instance.MainHeroIndex == 1){
                Hero.instance.speedY = 100;
                Global.getInstance().gravity = 200;
                // pos.y += 80;
                // pos.x += Hero.instance.node.scaleX * 20;
            }else if(HeroGlobal.instance.MainHeroIndex == 2){
                // pos.x += Hero.instance.node.scaleX > 0 ? 400 : -400;
                pos.y = -200;
            }
        }
        
        s.position = pos;
        // cc.log(s.position);
        s.scaleX = Hero.instance.node.scaleX;
        s.getComponent(HeroSkill).play(anim);
    }

    // update (dt) {}
}
