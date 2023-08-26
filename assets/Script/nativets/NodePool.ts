
var NodePool = function NodePool() {
    this.pool = [];
}

NodePool.prototype = {
    constructor: NodePool,
    size(){
        return this.pool.length;
    },

    get(){
        let obj: cc.Node = null;
        let last: number = this.pool.length - 1;

        if(this.pool.length <= 0){
            return null;
        }

        if(last >= 0){
            obj = this.pool[last];
            this.pool.length = last;  
        }
        return obj;
    },

    put(n: cc.Node){
        if(n && -1 == this.pool.indexOf(n)){
            //移除屏幕外
            n.opacity = 0;
            n.y = 900;
            this.pool.push(n);
        }else{
            cc.log('没put');
            if(n && n.name == 'rewardItem'){
                n.y = 900;
            }
            n.opacity = 0;
        }
    }
}
export default NodePool;