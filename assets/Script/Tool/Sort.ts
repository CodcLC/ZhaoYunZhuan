// 从小到大
let sortByLv = (a: number, b: number)=>{
    if(a < b){
        return -1;
    }else if(a == b){
        return 0;
    }else{
        return 1;
    }
}

export default sortByLv;