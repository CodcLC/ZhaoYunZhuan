let baseArrs: string[] = ['hp', 'ls', 'sp', 'cr', 'arp', 'bonus', 'cd', 'miss', 'exp', 'gold'];



let getDataFromJson = (json: any, type: string, lv: number)=>{
    let count: number = 0;
    
    let j
    for (let i = 0; i < baseArrs.length; i++) {
        let item = baseArrs[i];
        if(json[item]){
            
            count ++;
            
        }
    }
    return str;
}

export default getDataFromJson;