//特定无法区分的平台直接改这里
var platform = '';

let getPlatform = (): string => {
    if(platform == ''){
        if(CC_WECHATGAME){
            platform = Platform.WX;
        }
        if(CC_NATIVERENDERER && (cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_LINUX == cc.sys.os)){
            platform = Platform.Android;
        }
        if(CC_NATIVERENDERER && (cc.sys.OS_IOS == cc.sys.os || cc.sys.OS_OSX == cc.sys.os)){
            platform = Platform.IOS;
        }
        if(window.qq){
            platform = Platform.QQ;
        }
        if(cc.sys.platform === cc.sys.OPPO_GAME){
            platform = Platform.OPPO;
        }
        if(cc.sys.platform === cc.sys.VIVO_GAME){
            platform = Platform.VIVO;
        }
        if(window.tt){
            platform = Platform.TT;
        }
        if(window.FBInstant){
            platform = Platform.FB;
        }
        if(CC_PREVIEW){
            platform = Platform.WEB;
        }
        
    }
    
    return platform;
}

let Platform = cc.Enum({
    WX: 'wx',
    Android: 'Android',
    IOS: 'IOS',
    QQ: 'qq',
    FB: 'fb',
    WEB: 'web',
    OPPO: 'oppo',
    VIVO: 'vivo',
    TT: 'tt',
    m4399: '4399'
});

//游戏平台ID(1:微信小游戏; 2:QQ小游戏，3：Oppo小游戏,4:Vivo小游戏,5:头条小游戏;)

let getPLATID = (): number => {
    switch (getPlatform()) {
        case Platform.WEB:
            return 2;
        case Platform.WX:
            return 1;
            break;
        case Platform.QQ:
            return 4;
            break;
        case Platform.OPPO:
            return 2;
            break;
        case Platform.VIVO:
            return 1;
            break;
        case Platform.TT:
            return 3;
        default:
            return 99;
            break;
    }
    
    
}

//激励视频
// let VIDEOADLIST = cc.Enum({
//     武器升级: 1,
//     护甲升级: 2,
//     饰品升级: 3,
//     翅膀升级: 4,
//     技能升级: 5,
//     试用装备: 6,
//     成就奖励: 7,
//     结束三倍: 8,
//     攻击Buff: 9,
//     防御Buff: 10,
//     复活: 11,
//     补签: 12,
//     加金币: 13,
//     加体力: 14,
//     任务奖励: 15,
//     首页宝箱: 16,
//     签到: 17,
//     结束宝箱: 18
// })

export {getPlatform, getPLATID, Platform}
