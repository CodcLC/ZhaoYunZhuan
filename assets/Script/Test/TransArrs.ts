const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    edit: cc.EditBox;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.edit = this.node.getComponent(cc.EditBox);
    }

    onBtnOut(){
        var str = this.edit.string;
        var newarrs = [];
        var arrs = str.replace(' ','').split('\n');
        cc.log(arrs);
        for(var i in arrs){
            if(arrs[i].length > 0){
                newarrs.push(parseInt(arrs[i].replace(' ','')));
            }
        }
        cc.log(newarrs);
        this.edit.string = '[' + newarrs.toString() + ']';
    }

    // update (dt) {}
}
