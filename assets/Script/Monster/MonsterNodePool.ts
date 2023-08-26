import Main from "../Main";
import Game from "../Game";
import Monster from "./Monster";

const {ccclass, property} = cc._decorator;

const POOLCOUNT: number = 10;

@ccclass
export default class MonsterNodePool extends cc.Component {

    static instance: MonsterNodePool = null;

    @property(cc.Prefab)
    monsterPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    berserkerPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    elephantPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    eaglePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    xuchuPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    caocaoPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    xiahoudunPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    fangshuPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bossShowPrefab: cc.Prefab = null;

    monsterPool: cc.NodePool;
    
    poolArrs: cc.NodePool[];
    berserkerPool: cc.NodePool;
    elephantPool: cc.NodePool;
    eaglePool: cc.NodePool;
    fangshuPool: cc.NodePool;

    // LIFE-CYCLE CALLBACKS:

    init(){
        this.monsterPool = new cc.NodePool();
        for(let i: number = 0; i < POOLCOUNT; i ++){
            let n: cc.Node = cc.instantiate(this.monsterPrefab);
            n.getComponent(Monster).init();
            this.monsterPool.put(n);
        }

        this.berserkerPool = new cc.NodePool();
        for (let j = 0; j < POOLCOUNT / 2; j++) {
            let b: cc.Node = cc.instantiate(this.berserkerPrefab);
            b.getComponent(Monster).init();
            this.berserkerPool.put(b);
        }

        this.elephantPool = new cc.NodePool();
        for (let k = 0; k < POOLCOUNT / 2; k++) {
            let e: cc.Node = cc.instantiate(this.elephantPrefab);
            e.getComponent(Monster).init();
            this.elephantPool.put(e);
        }

        this.eaglePool = new cc.NodePool();
        for (let l = 0; l < POOLCOUNT / 2; l++) {
            let e: cc.Node = cc.instantiate(this.eaglePrefab);
            e.getComponent(Monster).init();
            this.eaglePool.put(e);
        }

        this.fangshuPool = new cc.NodePool();
        for (let m = 0; m < POOLCOUNT / 2; m++) {
            let e: cc.Node = cc.instantiate(this.fangshuPrefab);
            e.getComponent(Monster).init();
            this.fangshuPool.put(e);
        }
    }

    onLoad () {
        MonsterNodePool.instance = this;
        this.init();
    }

    create(monsterId: number, pos: cc.Vec2, color?: number){
        let m: cc.Node = null;
        let type = Game.instance.getMonsterIndex(monsterId);
        if(type == 99){
            m = this.getXuchuInstance();
        }else if(type == 98){
            m = this.getCaocaoInstance();
        }else if(type == 97){
            m = this.getXiahoudunInstance();
        }else if(type == 4 || type == 5){
            m = this.getBerserkerInstance();
        }else if(type == 6){
            m = this.getElephantInstance();
        }else if(type == 7){
            m = this.getEagleInstance();
        }else if(type == 8){
            m = this.getFangshuInstance();
        }
        else{
            m = this.getMonsterInstance();
        }

        


        m.type = type;
        
        m.parent = Game.instance.gameEventNode;
        m.position = pos;
        m.getComponent(Monster).use(monsterId);
        
    }

    getBossShow(){
        let b = cc.instantiate(this.bossShowPrefab);
        b.parent = Game.instance.gameEventNode;
        return b;
    }

    getXuchuInstance(): cc.Node{
        let b = cc.instantiate(this.xuchuPrefab);
        b.getComponent(Monster).init();
        return b;
    }

    getCaocaoInstance(): cc.Node{
        let b = cc.instantiate(this.caocaoPrefab);
        b.getComponent(Monster).init();
        return b;
    }

    getXiahoudunInstance(): cc.Node{
        let b = cc.instantiate(this.xiahoudunPrefab);
        b.getComponent(Monster).init();
        return b;
    }

    getMonsterInstance(): cc.Node{
        let m: cc.Node = null;
        if(this.monsterPool.size() > 0){
            m = this.monsterPool.get();
        }else{
            m = cc.instantiate(this.monsterPrefab);
            m.getComponent(Monster).init();
        }
        return m;
    }

    getBerserkerInstance(): cc.Node{
        let b: cc.Node = null;
        if(this.berserkerPool.size() > 0){
            b = this.berserkerPool.get();
        }else{
            b = cc.instantiate(this.berserkerPrefab);
            b.getComponent(Monster).init();
        }
        return b;
    }

    getElephantInstance(): cc.Node{
        let e: cc.Node = null;
        if(this.elephantPool.size() > 0){
            e = this.elephantPool.get();
        }else{
            e = cc.instantiate(this.elephantPrefab);
            e.getComponent(Monster).init();
        }
        return e;
    }

    getEagleInstance(): cc.Node{
        let e: cc.Node = null;
        if(this.eaglePool.size() > 0){
            e = this.eaglePool.get();
        }else{
            e = cc.instantiate(this.eaglePrefab);
            e.getComponent(Monster).init();
        }
        return e;
    }

    getFangshuInstance(): cc.Node{
        let e: cc.Node = null;
        if(this.fangshuPool.size() > 0){
            e = this.fangshuPool.get();
        }else{
            e = cc.instantiate(this.fangshuPrefab);
            e.getComponent(Monster).init();
        }
        return e;
    }

    start () {

    }

    GCAll(){
        let arrs: cc.Node[] = Game.instance.gameEventNode.children;
        for(let i: number = arrs.length - 1; i >= 0; i --){
            this.recycle(arrs[i]);
        }
    }

    recycle(monster: cc.Node){
        // if(monster.name != 'boss' && monster.name != 'berserker' && monster.name != 'elephant' && monster.name != 'eagle'){
        //     this.monsterPool.put(monster);
        // }else{
        //     monster.destroy();
        // }
        switch (monster.name) {
            case 'boss':
                monster.destroy();
                break;
            case 'berserker':
                this.berserkerPool.put(monster);
                break;
            case 'elephant':
                this.elephantPool.put(monster);
                break;
            case 'eagle':
                this.eaglePool.put(monster);
                break;  
            case 'monster':
                this.monsterPool.put(monster);
                break; 
            case 'fangshu':
                this.fangshuPool.put(monster);
                break; 
            default:
                monster.destroy();
                break;
        }
    }

    // update (dt) {}
}
