const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    hero: cc.Node = null;
    @property(cc.Node)
    ad: cc.Node = null;
    sk: sp.Skeleton;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.sk = this.hero.getComponent(sp.Skeleton);
        cc.log(this.sk.skeletonData.skeletonJson);
    }

    onBtnTest(){
        
        // this.sk._skeleton.slots[0].color = {a: 1, r: 1, g: 0, b: 1};


        let slot = this.sk.findSlot('W');
        

        let skData = this.sk.skeletonData.getRuntimeData();
        let skin = skData.findSkin('003');
        let index = skData.findSlotIndex('W');
        let atta = skin.getAttachment(index,'W');
        slot.setAttachment(atta);

        let slot2 = this.sk.findSlot('chibang_zuo');
        let index2 = skData.findSlotIndex('chibang_zuo');
        let atta2 = skin.getAttachment(index2,'chibang_zuo');
        slot2.setAttachment(atta2);
        cc.log(skin,slot2,index2,atta2);

        let slot3= this.sk.findSlot('AF');
        let index3 = skData.findSlotIndex('AF');
        let atta3 = skin.getAttachment(index3,'AF');
        slot3.setAttachment(atta3);
    }

    onbtnACT(){
        // this.ad.active = !this.ad.active;
        this.ad.opacity = this.ad.opacity == 255 ? 0 : 255;
    }

    // update (dt) {}
}
