// 战斗场景的掉落物
import NodePool from "../nativets/NodePool";
import Game from "../Game";
import RewardItem from "./RewardItem";
import HeroPet from "../Hero/HeroPet";
import MapSelect from "../Map/MapSelect";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RewardMapMgr extends cc.Component {
    static instance: RewardMapMgr = null;

    @property(cc.Prefab)
    rewardPrefab: cc.Prefab = null;


    init(){
        RewardMapMgr.instance = this;


        // cc.director.on('dmgGC', this.GCAll, this); 
    }

    onLoad () {
        this.init();

    }


    createRewardMap(id: number){
        let r: cc.Node = null;
        
        r = cc.instantiate(this.rewardPrefab);
        r.parent = MapSelect.instance.rightLayout;
        
        r.opacity = 255;
        cc.log('REWARD',id);
        r.getComponent(RewardItem).setByIdLayout(id);
    }


    start () {

    }

    onDestroy(){
        // cc.director.off('dmgGC', this.GCAll, this); 
    }

    // update (dt) {}
}
