import Menu from "../Menu";

import HeroGlobal from "../Hero/HeroGlobal";


const {ccclass, property} = cc._decorator;

@ccclass
export default class God extends cc.Component {
    count: number;

    // onLoad () {}

    // start () {

    // }

    onEnable(){
        this.count = 0;
    }

    onBtnClick(){
        this.count ++;
        if(this.count == 20){
            Menu.instance.addLife(99);
            HeroGlobal.instance.isGod = true;
        }
    }

    // update (dt) {}
}
