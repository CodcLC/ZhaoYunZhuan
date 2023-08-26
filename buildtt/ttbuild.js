var fs = require( 'fs' ),
config = require('./config')
stat = fs.stat;

// var rootPath = 'J:/CocosProject/TestSub/build';
var rootPath = config.path;

// console.log(config.path);

// 1.将分包目录下的raw-assets复制到res/assets
readFileList(rootPath + '/wechatgame/subpackages/');

// 2.settings.js中的分包path置空
changeSettings(rootPath + '/wechatgame/src/settings.js');

// 3.清除game.json里的分包信息
changeGameJson(rootPath + '/wechatgame/game.json');


/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var copy = function( src, dst ){
    // 读取目录中的所有文件/目录
    fs.readdir( src, function( err, paths ){
        if( err ){
            throw err;
        }
        paths.forEach(function( path ){
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;      
            stat( _src, function( err, st ){
                if( err ){
                    throw err;
                }
                // 判断是否为文件
                if( st.isFile() ){
                    // 创建读取流
                    readable = fs.createReadStream( _src );
                    // 创建写入流
                    writable = fs.createWriteStream( _dst ); 
                    // 通过管道来传输流
                    readable.pipe( writable );
                }
                // 如果是目录则递归调用自身
                else if( st.isDirectory() ){
                    exists( _src, _dst, copy );
                }
            });
        });
    });
};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录

var exists = function( src, dst, callback ){
    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            callback( src, dst );
        }
        // 不存在
        else{
            fs.mkdir( dst, function(){
                callback( src, dst );
            });
        }
    });
};

function readFileList(path) {
    fs.exists( path, function( es ){
        // console.log(exists);
        if(es){
            var files = fs.readdirSync(path);
            files.forEach(function (itm, index) {
                var stat = fs.statSync(path + itm);
                if (stat.isDirectory()) {
                //递归读取文件
                    // readFileList(path + itm + "/")
                    console.log(itm);
                    exists( rootPath + '/wechatgame/subpackages/' + itm + '/raw-assets/', rootPath + '/wechatgame/res/raw-assets/', copy );
                }
            })
            // deleteAll(rootPath + '/wechatgame/subpackages');
        }
    });
    
}

function changeSettings(jsonpath){
    fs.readFile(jsonpath, 'utf8', (err, data) => {
    if (err) throw err;
    data = data.replace(/path:"\w*\/\w*\/"/g, 'path:""');
    fs.writeFileSync(jsonpath,data);
  });
}

function deleteAll(path) {
	var files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file, index) {
			var curPath = path + "/" + file;
			if(fs.statSync(curPath).isDirectory()) { // recurse
				deleteAll(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
    }
};

function changeGameJson(jsonpath){
    fs.readFile(jsonpath, 'utf8', (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data);
    delete json.subpackages;
    // console.log(json);
    fs.writeFileSync(jsonpath,JSON.stringify(json));
  });
}



// 4.删除分包文件
// deleteAll(rootPath + '/wechatgame/subpackages');



// 复制目录
// exists( './sub', './haha', copy );
