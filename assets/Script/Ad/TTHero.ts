const {ccclass, property} = cc._decorator;

@ccclass
export default class TTHero extends cc.Component {
    @property([sp.SkeletonData])
    heroArrs: sp.SkeletonData[] = [];
}
