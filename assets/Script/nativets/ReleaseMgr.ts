/**
 * 从这里统一释放资源，避免公共资源被释放
 * 如果动了白名单上的资源，比如合图发生变化，要手动修改这里的uuid头
 */

// 武器icon合图
const w1: string = '12/1234';

// 地图选择界面合图
// const w2: string = '1a/1a693';
const w2: string = '18/188b4';

// 技能icon合图
// const w3: string = 'res/import/1f/1fe3';

// 特殊字体
const w4: string = '43/43e41f41';

const w5: string = '17/17d04';

const whiteList: string[] = [w1, w2, w4];

let CustomRelease = (url: string)=>{
    if(CC_NATIVERENDERER){
        return;
    }
    for (let i = 0; i < whiteList.length; i++) {
        if(url.indexOf(whiteList[i]) != -1){
            console.log('notreslease', url);
            return;
        }
        // cc.log('CustomReleas',url);
        cc.loader.release(url);
    }
}

export default CustomRelease;