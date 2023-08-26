/**
 * @classdesc 超级简单的 HttpRequest 工具，不完美，但一般可用
 * @author caizhitao
 * @version 0.1.0
 * @since 2019-03-07
 * @description
 *
 * 用法：
 *
       1. 发起 GET 请求
       ```
       HttpRequest.newGetRequest({
           host: "https://www.baidu.com",
           body: {
               key1: value1,
               key2: value2
           },
           header: {
               header1: value1,
               header2: value2
           }
       }).then((respJson: any) => {
           console.log(respJson)
       }).catch((error: Error) => {
           console.error(error)
       })
       ```
  
       2. 发起 POST 请求
       ```
       HttpRequest.newPostRequest({
           host: "https://www.baidu.com",
           body: {
               key1: value1,
               key2: value2
           },
           header: {
               header1: value1,
               header2: value2
           }
       }).then((respJson: any) => {
           console.log(respJson)
       }).catch((error: Error) => {
           console.error(error)
       })
       ```
 */
export class HttpRequest {
    
    /**
     * 通用 HTTP GET 请求
     *
     * @param host 请求地址
     * @param params 请求参数
     */
    static newGetRequest(params: {
        /**
         * 请求地址
         */
        host: string;

        /**
         * 请求参数
         */
        body?: any;

        /**
         * 请求header
         */
        header?: any;
    }) {
        return new Promise<any>((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (true) {
                        cc.log(`请求 ${params.host}：结束，返回结果如下：`);
                        cc.log("code: " + xhr.status);
                        cc.log("codestatus: " + xhr.statusText);
                        cc.log("resposeStr: " + xhr.responseText);
                    }
                    if (xhr.status >= 200 && xhr.status < 400) {
                        try {
                            let respJson = JSON.parse(xhr.responseText);
                            resolve(respJson);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error(`Error! Http Code: ${xhr.status}`));
                    }
                }
            };
            let reqUrl = params.host;
            if (params.body != null) {
                let keys = Object.keys(params.body);
                if (keys.length > 0) {
                    reqUrl += `?${keys[0]}=${params.body[keys[0]]}`;
                    for (let i = 1; i < keys.length; i++) {
                        reqUrl += `&${keys[i]}=${params.body[keys[i]]}`;
                    }
                }
            }
            if (true) {
                cc.log(`请求 ${params.host}：开始`);
                cc.log(`请求参数:`);
                cc.log(params);
                cc.log(`请求地址: ${reqUrl}`);
            }
            xhr.open("GET", reqUrl, true);
            // xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
            if (params.header != null) {
                let keys = Object.keys(params.header);
                if (keys.length > 0) {
                    for (let i = 0; i < keys.length; i++) {
                        xhr.setRequestHeader(keys[i], params.header[keys[i]]);
                    }
                }
            }
            xhr.send();
        });
    }

    /**
     * 通用 HTTP POST 请求
     *
     * @param host 请求地址
     * @param params 请求参数
     */
    static newPostRequest(params: {
        /**
         * 请求地址
         */
        host: string;

        /**
         * 请求参数
         */
        body?: any;

        /**
         * 请求header
         */
        header?: any;
    }) {
        return new Promise<any>((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (CC_DEBUG) {
                        cc.log(`请求 ${params.host}：结束，返回结果如下：`);
                        cc.log("code: " + xhr.status);
                        cc.log("codestatus: " + xhr.statusText);
                        cc.log("resposeStr: " + xhr.responseText);
                    }
                    if (xhr.status >= 200 && xhr.status < 400) {
                        try {
                            let respJson = JSON.parse(xhr.responseText);
                            resolve(respJson);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error(`Error! Http Code: ${xhr.status}`));
                    }
                }
            };
            let reqBodyJsonString = null;
            if (params.body != null) {
                reqBodyJsonString = JSON.stringify(params.body);
            }
            if (CC_DEBUG) {
                cc.log(`请求 ${params.host}：开始`);
                cc.log(`请求参数:`);
                cc.log(params.body);
            }
            xhr.open("POST", params.host, true);

            if (params.header != null) {
                let keys = Object.keys(params.header);
                if (keys.length > 0) {
                    for (let i = 0; i < keys.length; i++) {
                        xhr.setRequestHeader(keys[i], params.header[keys[i]]);
                    }
                }
            }
            if (reqBodyJsonString == null) {
                xhr.send();
            } else {
                xhr.send(reqBodyJsonString);
            }
        });
    }
}
