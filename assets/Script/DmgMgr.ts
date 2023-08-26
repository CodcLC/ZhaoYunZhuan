const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    dmgPrefab: cc.Prefab = null;

    @property(cc.Font)
    normFont: cc.Font = null;

    @property(cc.Font)
    CRFont: cc.Font = null;

    @property(cc.Node)
    dmgEvent: cc.Node = null;
    dmgPool: cc.NodePool;
    count: number = 10;
    startDate: number;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.dmgPool = new cc.NodePool();
        for(let i: number = 0;i < this.count;i ++){
            let n: cc.Node = cc.instantiate(this.dmgPrefab);
            this.dmgPool.put(n);
        }

        cc.director.on('dmgGC', this.GCAll, this); 

        cc.director.on('showdmg', this.showDmg, this); 
    }

    showDmg(number: number,posx: number,isCR: boolean,isBoss: boolean,direct?: number){
        let d: cc.Node = this.create();
            d.parent = this.dmgEvent;
            let dlabel: cc.Label = d.getComponent(cc.Label);
            let dY: number = -30 + Math.random() * 30;
            dlabel.fontSize = 40;
            dlabel.font = this.normFont;
            // d.color = cc.color(255,255,255);
            d.scale = .3;
            if(isCR){
                dY = 40 + Math.random() * 60;
                dlabel.fontSize = 45;
                // d.color = cc.color(234,234,55);
                dlabel.font = this.CRFont;
            }
            if(isBoss){
                dY = 0;
            }
            d.position = cc.v2(posx,dY);
            
            // let deltaX = 30 + Math.random() * 40;
            // if(direct < 0){
            //     deltaX *= -1;
            // }
            
            if(isCR){
                dlabel.string = '暴' + number * 2 + '';
                var act4 = cc.moveBy(.5,cc.v2(0,90 /*+ Math.random() * 40*/));
                var act5 = cc.sequence(cc.scaleTo(.3,1.1),cc.delayTime(0.2),/*cc.scaleTo(.1,0)*/);
                var act6 = cc.spawn(act4,act5);
                    d.runAction(cc.sequence(act6,cc.delayTime(0),cc.callFunc(()=>{
                    dlabel.string = '';
                    this.recycle(d);
                })));
                
            }else{
                dlabel.string = '-' + number + '';
                var act1 = cc.moveBy(.3,cc.v2(0,70 /*+ Math.random() * 40*/));
                var act2 = cc.sequence(cc.scaleTo(.1,1.2),cc.delayTime(0.2),cc.scaleTo(.1,0));
                var act3 = cc.spawn(act1,act2);
                    d.runAction(cc.sequence(act3,cc.delayTime(0),cc.callFunc(()=>{
                    dlabel.string = '';
                    this.recycle(d);
                })));
            }
        
    }

    create(): cc.Node{
        let m: cc.Node = null;
        if(this.dmgPool.size() > 0){
            m = this.dmgPool.get();
        }else{
            m = cc.instantiate(this.dmgPrefab);
        }
        return m;
    }

    GCAll(){
        let arrs: cc.Node[] = this.dmgEvent.children;
        for(let i: number = arrs.length - 1; i >= 0; i --){
            this.recycle(arrs[i]);
        }
    }

    recycle(n: cc.Node){
        this.dmgPool.put(n);
    }

    update (dt) {
        this.startDate = Date.now();
    }

    onDestroy(){
        cc.director.off('dmgGC', this.GCAll, this); 

        cc.director.off('showdmg', this.showDmg, this); 
    }
}
