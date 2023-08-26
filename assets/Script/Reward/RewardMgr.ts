// 战斗场景的掉落物
import NodePool from "../nativets/NodePool";
import Game from "../Game";
import RewardItem from "./RewardItem";
import HeroPet from "../Hero/HeroPet";
import MapSelect from "../Map/MapSelect";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RewardMgr extends cc.Component {
    static instance: RewardMgr = null;

    @property(cc.Prefab)
    rewardPrefab: cc.Prefab = null;
    rewardPool: any;
    unColleted: cc.Node[];

    init(){
        RewardMgr.instance = this;

        this.rewardPool = new NodePool();
        for (let i = 0; i < 15; i++) {
            let r = cc.instantiate(this.rewardPrefab);
            r.parent = Game.instance.rewardEventNode;
            this.rewardPool.put(r);
        }

        this.unColleted = [];

        // cc.director.on('dmgGC', this.GCAll, this); 
    }

    onLoad () {
        this.init();

    }

    createCoins(id: number, pos: cc.Vec2){
        let r: cc.Node = this.rewardPool.get();
        if(!r){
            r = cc.instantiate(this.rewardPrefab);
            r.parent = Game.instance.rewardEventNode;
            this.rewardPool.put(r);
        }
        r.stopAllActions();
        r.position = pos;
        r.y += 80;
        r.opacity = 255;

        let direct = Math.random() < .5 ? 1 : -1;
        let bezier = [cc.v2(0, 0), cc.v2(direct * (40 + Math.random() * 20), (40 + Math.random() * 20)), cc.v2(direct * (100 + Math.random() * 20), -80)];
        r.runAction(cc.sequence(cc.bezierBy(.3, bezier), cc.callFunc(()=>{
            this.pushInUncollected(r);
        })));

        r.getComponent(RewardItem).setById(id);
        
    }

    createReward(id: number, pos: cc.Vec2){
        let r: cc.Node = this.rewardPool.get();
        if(!r){
            r = cc.instantiate(this.rewardPrefab);
            r.parent = Game.instance.rewardEventNode;
            this.rewardPool.put(r);
        }
        r.position = pos;
        r.opacity = 255;
        r.getComponent(RewardItem).setById(id);
        this.pushInUncollected(r);
    }

    createRewardEnd(id: number){
        let r: cc.Node = null;
        
        r = cc.instantiate(this.rewardPrefab);
        r.parent = Game.instance.gameEndLayout;
        
        r.opacity = 255;
        r.getComponent(RewardItem).setByIdLayout(id);
    }

    createRewardMap(id: number){
        let r: cc.Node = null;
        
        r = cc.instantiate(this.rewardPrefab);
        r.parent = MapSelect.instance.rightLayout;
        
        r.opacity = 255;
        r.getComponent(RewardItem).setByIdLayout(id);
    }



    pushInUncollected(n: cc.Node){
        if(n && -1 == this.unColleted.indexOf(n)){
            this.unColleted.push(n);
        }
    }

    recycle(n: cc.Node){
        let index: number = this.unColleted.indexOf(n);
        if(-1 != index){
            this.unColleted.splice(index, 1);
            // cc.log(this.unColleted);
        }
        this.rewardPool.put(n);
    }

    GCAll(){
        let arrs: cc.Node[] = Game.instance.rewardEventNode.children;
        for(let i: number = arrs.length - 1; i >= 0; i --){
            this.rewardPool.put(arrs[i]);
            
        }
        this.unColleted = [];
    }

    start () {

    }

    onDestroy(){
        // cc.director.off('dmgGC', this.GCAll, this); 
    }

    // update (dt) {}
}
