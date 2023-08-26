import { getPlatform } from "./Platform";


let save = function save(key: string,value: string) {
    cc.sys.localStorage.setItem(key,value);        
}

let load = function load(key: string): string {
    return cc.sys.localStorage.getItem(key);
}

export {save,load}
