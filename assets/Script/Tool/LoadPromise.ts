let loadSpinePromise = (url: string)=>{
    return new Promise((resolve, reject) => {
        cc.loader.loadRes(url, sp.SkeletonData, (err, sp) => {
            if (err) {
                // cc.log(err);
                reject(err);
                return;
            }
            resolve(sp);
        })
    })
}

let loadSpritePromise = (url: string)=>{
    return new Promise((resolve, reject) => {
        cc.loader.loadRes(url, cc.SpriteFrame, (err, sf) => {
            if (err) {
                // cc.log(err);
                reject(err);
                return;
            }
            resolve(sf);
        });
    });
}

let loadWXSubPromise = (subname: string)=>{
    return new Promise((resolve, reject) => {
        const loadTask = wx.loadSubpackage({
            name: subname, // name 可以填 name 或者 root
            success: (res)=> {
                resolve(res);
            },
            fail: function(res) {
                // 分包加载失败通过 fail 回调
                reject(res);
            }
            
        })
        // loadTask.onProgressUpdate(res => {});
    });
}

export {loadSpinePromise, loadSpritePromise, loadWXSubPromise}