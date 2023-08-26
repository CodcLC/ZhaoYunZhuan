import Hero from "./Hero";
import HeroFSM from "./HeroFSM";
import BulletItem from "../BulletItem";
import Box from "../Map/Box";
import ComboMgr from "../ComboMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroHit extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
    }

    onCollisionEnter(other, self){
        // let dmg: number = Hero.instance.dmg - Math.floor(Math.random() * 100);
        let dmg: number = Hero.instance.ATK - Math.floor(Math.random() * 5);
        console.log(Hero.instance.ATK)
        if(self.tag != 0){
            cc.log('SKILLDMG');
            dmg = self.tag * Hero.instance.ATK * 0.01;
        }
        let isCR: boolean = Hero.instance.isCR;
        if(Math.random()<.2){
            isCR = true;
        }else{
            isCR = false;
        }
        let canPushAway: boolean = HeroFSM.instance.canPushAway();
        
        other.node.emit('Hit',dmg, isCR, false);
        Hero.instance.onBS(dmg, isCR);

        //如果是子弹
        if(this.node.getComponent(BulletItem)){
            this.node.getComponent(BulletItem).unuse();
            // this.node.destroy();
        }

        if(other.node.parent.name == 'box'){
            other.node.parent.getComponent(Box).openBox();
            return;
        }

        if(other.node.parent.name == 'tower'){
            other.node.parent.destroy();
            cc.director.emit('TowerDestroy');
            return;
        }
        Hero.instance.bloodAnim.node.x = other.node.parent.x;
        Hero.instance.bloodAnim.play();
        ComboMgr.instance.attack();
    }


    // update (dt) {}
}
