import TaskItem from "./TaskItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Task extends cc.Component {
    static instance: Task = null;

    @property(cc.Prefab)
    taskItem: cc.Prefab = null;
    layoutNode: cc.Node;
    taskScripts: TaskItem[];


    init(){
        this.layoutNode = this.node.getChildByName('ScrollView').getChildByName('view').getChildByName('content');
        this.initLayout();
    }

    initLayout(){
        this.taskScripts = [];
        for (let i = 0; i < 9; i++) {
            let t = cc.instantiate(this.taskItem);
            t.parent = this.layoutNode;
            this.taskScripts.push(t.getComponent(TaskItem));
            this.taskScripts[i].init(i);
        }
    }

    onLoad () {
        Task.instance = this;
        this.init();
    }

    onRefresh(){
        for (let i = 0; i < 9; i++) {
            this.taskScripts[i].onRefresh(i);
            
        }
    }

    onEnable(){
        this.onRefresh();
    }

    start () {

    }

    // update (dt) {}
}
