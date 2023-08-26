import Game from "./Game";
import BulletItem from "./BulletItem";
import NodePool from "./nativets/NodePool";
import MonsterBulletItem from "./Monster/MonsterBulletItem";
import { MonsterATK } from "./nativets/Config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BulletMgr extends cc.Component {
    static instance: BulletMgr = null;
    @property(cc.Prefab)
    arrowPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    monsterArrowPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    monsterFirePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    monsterIcePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    towerArrowPrefab: cc.Prefab = null;

    OUTY: number;
    bulletPool: any;
    monsterbulletPool: any;
    towerbulletPool: any;

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.OUTY = cc.winSize.height;

        this.bulletPool = new NodePool();
        for (let i = 0; i < 3; i++) {
            let b = cc.instantiate(this.arrowPrefab);
            b.parent = Game.instance.gameEffectNode;
            this.bulletPool.put(b);
        }

        this.monsterbulletPool = new NodePool();
        for (let j = 0; j < 3; j++) {
            let m = cc.instantiate(this.monsterArrowPrefab);
            m.parent = Game.instance.gameEffectNode;
            this.monsterbulletPool.put(m);
        }

        // this.towerbulletPool = new NodePool();
        // for (let k = 0; k < 3; k++) {
        //     let t = cc.instantiate(this.towerArrowPrefab);
        //     t.parent = Game.instance.gameEffectNode;
        //     this.towerbulletPool.put(t);
        // }
    }

    onLoad () {
        BulletMgr.instance = this;
        this.init();
    }

    create(index: number, pos: cc.Vec2, dir: number){
        let b: cc.Node = this.bulletPool.get();
        if(!b){
            b = cc.instantiate(this.arrowPrefab);
            b.parent = Game.instance.gameEffectNode;
            this.bulletPool.put(b);
        }
        b.position = pos;
        b.scaleX = dir * .7;
        b.getComponent(BulletItem).init(index);
    }

    createForMonster(index: number, pos: cc.Vec2, dir: number, dmg?: number){
        let m = this.monsterbulletPool.get();
        if(!m){
            m = cc.instantiate(this.monsterArrowPrefab);
            m.parent = Game.instance.gameEffectNode;
            this.monsterbulletPool.put(m);
        }
        m.position = pos;
        m.scaleX = dir * .5;
        m.getComponent(cc.BoxCollider).tag = dmg;
        m.getComponent(MonsterBulletItem).init(index);
    }

    createForMonsterFire(posX: number, dmg: number){
        let f = cc.instantiate(this.monsterFirePrefab);
        f.getComponent(cc.CircleCollider).tag = dmg;
        f.parent = Game.instance.gameEffectNode;
        f.x = posX;
        let anim = f.getComponent(cc.Animation);
        anim.stop();
        anim.play();
        anim.on(cc.Animation.EventType.FINISHED, ()=>{
            f.destroy();
        });
        // anim.on('finished',()=>{
        //     f.destroy();
        // });
    }

    createForMonsterIce(posX: number, dmg: number){
        let f = cc.instantiate(this.monsterIcePrefab);
        f.getComponent(cc.CircleCollider).tag = dmg;
        f.parent = Game.instance.gameEffectNode;
        f.x = posX;
        f.y = -205;
        let anim = f.getComponent(cc.Animation);
        anim.stop();
        anim.play();
        anim.on(cc.Animation.EventType.FINISHED, ()=>{
            f.destroy();
        });
    }

    createForTower(index: number, pos: cc.Vec2, dir: number, dmg?: number){
        let t = this.towerbulletPool.get();
        if(!t){
            t = cc.instantiate(this.towerArrowPrefab)
        }

    }

    start () {

    }

    update (dt) {
        // cc.log(this.bulletPool);
    }
}
