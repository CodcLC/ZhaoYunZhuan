const {ccclass, property} = cc._decorator;

@ccclass
export default class UVMove extends cc.Component {
    material: cc.Material;
    time: number = 0;

    onLoad () {
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0);
    }

    start () {

    }

    effect(){
        this.schedule(this.upd, 0, cc.macro.REPEAT_FOREVER, 1);
    }

    upd(){
        this.time += 0.01;
        this.material.effect.setProperty('time', this.time);
    }

    onEnable(){
        this.effect();
    }

    // update (dt) {}
}
