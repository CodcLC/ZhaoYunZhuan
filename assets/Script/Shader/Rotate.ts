const {ccclass, property} = cc._decorator;

@ccclass
export default class Rotate extends cc.Component {
    static instance: Rotate = null;
    material: cc.Material;
    time: number;
    count: number;


    onLoad () {
        Rotate.instance = this;
        // 获取材质
        this.time = 0;
        this.count = 0;
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0);
    }

    updateEffect(dt){
        this.time += dt;
        this.material.effect.setProperty('time', this.time);
    }

    start () {

    }

    update (dt) {
        if(this.count < 4){
            this.count ++;
        }else{
            this.count = 0;
            this.updateEffect(dt);
        }
    }
}
