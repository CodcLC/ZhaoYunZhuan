import NodePool from "../nativets/NodePool";
import Game from "../Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterFactory extends cc.Component {
    static instance: MonsterFactory = null;
    @property(cc.Prefab)
    monsterPrefab: cc.Prefab = null;
    monsterPool: any;
    // LIFE-CYCLE CALLBACKS:

    init(){
        this.monsterPool = new NodePool();
        for (let i = 0; i < 3; i++) {
            let m: cc.Node = cc.instantiate(this.monsterPrefab);
            m.parent = Game.instance.gameEventNode;
            this.monsterPool.put(m);
        }
        
    }

    onLoad () {
        MonsterFactory.instance = this;
        this.init();
    }

    start () {

    }

    getMonsterItem(): cc.Node{
        let prefab: cc.Prefab = this.monsterPrefab;
        let pool: any = this.monsterPool;

        let m: cc.Node = pool.get();
        if(!m){
            m = cc.instantiate(prefab);
            m.parent = Game.instance.gameEffectNode;
            pool.put(m);
        }
        return m;
    }

    create(){
        let m: cc.Node = this.getMonsterItem();
        
    }

    // update (dt) {}
}
