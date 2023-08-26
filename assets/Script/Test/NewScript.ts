import { HeroSpName } from "../nativets/Config";
import { loadSpinePromise } from "../Tool/LoadPromise";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    baseNode: cc.Node;
    sk: sp.Skeleton;
    slot: any;
    bNode: cc.Node;
    bone: any;
    anims: string[];
    animIndex: number;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, 0);

        
    }

    sfRect(){
        let sp = this.node.getChildByName('sf').getComponent(cc.Sprite);
        cc.loader.loadRes('test/1',cc.SpriteFrame,(err,sf)=>{
            cc.log(err, sf);
            sp.spriteFrame = new cc.SpriteFrame(sf._texture, new cc.Rect(93,0,82,82));
        });
    }

    start () {
        this.baseNode = this.node.getChildByName('A');
        // let act = cc.sequence(cc.moveTo(3,cc.v2(640,0), cc.moveTo(3,cc.v2(-640,0))
        let act = cc.sequence(cc.moveTo(3,cc.v2(640,0)), cc.moveTo(3,cc.v2(-640,0)));
        this.baseNode.runAction(act.repeatForever());

        this.sk = this.node.getChildByName('sp').getComponent(sp.Skeleton);
        
        // this.slot = this.sk.findSlot('N');
        // this.bone = this.sk.findBone('bone12');
        // this.bone = this.sk.findSlot('guangbo').bone;
        // cc.log(this.slot);
        cc.log(this.sk, this.sk._skeleton.data.animations);
        this.animIndex = 0;
        this.bNode = this.node.getChildByName('sp').getChildByName('B');
        // this.bNode.y = this.slot.bone.y;

        // this.setGray();
        // this.testVec();
        // this.sfRect();

        this.testAnims();
        // this.testWorld();
        this.testWidget();

        this.testAsync();
    }

    setGray(){
        let sp = this.node.getChildByName('img').getComponent(cc.Sprite);
        sp.setMaterial(0, cc.MaterialVariant.createWithBuiltin('2d-gray-sprite', sp));
        
        cc.log(sp);

    }

    testVec(){
        let vec1: cc.Vec2 = cc.v2(0, 100);
        let vec2: cc.Vec2 = vec1.rotateSelf(-Math.PI / 6);
        cc.log(Math.atan2(0, 1),'  ', vec2);
        this.node.getChildByName('dot').position = vec2;
    }

    testAnims(){
        let arrs = this.sk._skeleton.data.animations;
        this.anims = [];
        arrs.forEach(element => {
            this.anims.push(element.name);
        });

        this.sk.setEventListener((track, event)=>{
            let ename: string = event.data.name;
            cc.log('skevent',ename);
        })

        this.node.on('touchend',()=>{
            if(this.animIndex < this.anims.length - 1){
                this.animIndex ++;
            }else{
                this.animIndex = 0;
            }
            this.sk.setAnimation(0, this.anims[this.animIndex], true);
            // cc.log(this.anims[this.animIndex]);
        });
    }

    testWorld(){
        let n = this.node.getChildByName('widget').getChildByName('node');
        let pos = n.convertToWorldSpace(cc.v2(0, n.height));
        cc.log(pos.x, pos.y);
        cc.find('sf').position = pos;
    }

    testWidget(){
        let widget = this.node.getChildByName('aaa').getComponent(cc.Widget);
        // widget.isAlignHorizontalCenter = true;
        widget.isAlignHorizontalCenter = false;
        widget.isAlignRight = true;
        widget.isAbsoluteRight = true;
        
        widget.right = 28;
    }

    async testAsync(){
        await this.loadMenuHeroSp(2);
        console.log('111');
    }

    async loadMenuHeroSp(index: number){
        let sp: any = await loadSpinePromise(HeroSpName[index]);
        console.log('loadsp');
    }

    update (dt) {
        // this.baseNode.x += dt * 200;
        // if(this.baseNode.x > 640){
        //     this.baseNode.x = -640;
        // }
        // cc.log(this.bone.worldX,this.slot.bone.worldY);
        // this.bNode.x = this.slot.bone.x;
        // this.bNode.x = this.bone.worldX;
    }
}
