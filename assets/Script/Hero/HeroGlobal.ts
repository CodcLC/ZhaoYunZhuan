import { Exp, PetSpName, getTypeId, getSoulIds } from "../nativets/Config";
import { save, load } from "../nativets/SaveMgr";
import HeroData from "./HeroData";
import Global from "../nativets/Global";
import sortByLv from "../Tool/Sort";
import Statistics from "../Tool/Statistics";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HeroGlobal extends cc.Component {
    static instance: HeroGlobal = null;
    //需要存档
    Exp: number;
    Unlock: number;
    Life: number;
    Coins: number;
    Jade: number;
    MonsterKillCount: number = 0;

    HeroDataArrs: HeroData[] = [];
    MainHeroIndex: number;
    OtherHeroIndex: number;
    PetIndex: number;

    PetLvArrs: number[];

    MapData: number[][];

    WeaponArrs: number[];
    ArmorArrs: number[];
    RingArrs: number[];
    OrnamentArrs: number[];
    WingArrs: number[];


    EffectSwitch: boolean = true;
    BgmSwitch: boolean = true;
    //不需要存档
    Level: number = 0;
    SkillCount: number;
    SoulArrs: number[];
    BookArrs: any;
    MapBox: number[][];
    HighestCE: number;
    StarCount: number = 0;

    isGod: boolean = false;

    AchieveCountData: number[];
    AchieveGetCountData: number[];
    // HighestRank: number;

    // LIFE-CYCLE CALLBACKS:

    init(){
        // this.WeaponArrs = [111010203, 122052364, 131072123, 112020704, 113031292, 121042364, 123063231, 132083242, 133093632];
        // this.ArmorArrs = [211010203, 222052364, 231072123, 212032292, 213020704, 221042364, 223063231, 232083242, 233093632];
        // this.RingArrs = [303010203, 302020203, 302030203, 301040203, 301050203, 302060203, 301070203, 303080203];
        // this.OrnamentArrs = [401012403, 401022403, 401032403, 402042403, 403052403, 403062403, 402072403];
        // this.WingArrs = [501010203, 503022364, 503032123, 502040704, 501053292, 503062364];
        // this.PetLvArrs = [1, 1, 1];

        // this.WeaponArrs = [111010000, 122050000, 131070000, 112020000, 113030000, 121040000, 123060000, 132080000, 133090000];
        // this.ArmorArrs = [211010000, 222050000, 231070000, 212030000, 213020000, 221040000, 223060000, 232080000, 233090000];
        // this.RingArrs = [303010000, 302020000];
        // this.OrnamentArrs = [401010000,];
        // this.WingArrs = [501010000, 503020000, 503030000];
        // this.PetLvArrs = [1, 1, 1];

        
        // // this.SoulArrs = [6010103, 6010203, 6020203, 6020203, 6030203, 6030203, 6040103, 6040203, 6050203, 6050203, 6060203, 6060203];

        // this.SoulArrs = getSoulIds();

        // this.WeaponArrs.sort(sortByLv);
        // cc.log(this.WeaponArrs);
        // this.ArmorArrs.sort(sortByLv);
        // this.RingArrs.sort(sortByLv);
        // this.OrnamentArrs.sort(sortByLv);
        // this.WingArrs.sort(sortByLv);
        // this.SoulArrs.sort(sortByLv);
        this.loadEquipmentArrs();

    }

    onLoad () {
        HeroGlobal.instance = this;
        this.init();
    }

    start () {

    }

    onGameStart(){
        //开始全部满血
        for (let i = 0; i < 3; i++) {
            this.HeroDataArrs[i].setTempHP();
        }
    }

    loadEquipmentArrs(){
        let ea: string = load('EquipmentArrs');
        if(!ea){
            this.setEquipmentArrs(null);
        }else{
            this.setEquipmentArrs(JSON.parse(ea));
        }
    }

    setEquipmentArrs(data: any){
        if(data){
            this.WeaponArrs = data.WeaponArrs;
            this.ArmorArrs = data.ArmorArrs;
            this.RingArrs = data.RingArrs;
            this.OrnamentArrs = data.OrnamentArrs;
            this.WingArrs = data.WingArrs;
            this.PetLvArrs = data.PetLvArrs;
            this.SoulArrs = data.SoulArrs;
            // this.SoulArrs = getSoulIds();
            // 兼容
            if(data.BookArrs){
                this.BookArrs = data.BookArrs;
            }else{
                this.BookArrs = [];
            }
            

        }else{
            // this.WeaponArrs = [111010000, 122050000, 131070000, 112020000, 113030000, 121040000, 123060000, 132080000, 133090000];
            // this.ArmorArrs = [211010000, 222050000, 231070000, 212030000, 213020000, 221040000, 223060000, 232080000, 233090000];
            
            this.WeaponArrs = [111010000, 121040000, 131070000];
            this.ArmorArrs = [211010000, 221040000, 231070000];
            // this.RingArrs = [303010000, 302020000];
            // this.OrnamentArrs = [401010000,];
            this.RingArrs = [];
            this.OrnamentArrs = [];
            // this.WingArrs = [501010000, 503020000, 503030000];
            this.WingArrs = [];
            this.PetLvArrs = [0, 0, 0];
            this.BookArrs = [];
            
            // this.SoulArrs = [6010103, 6010203, 6020203, 6020203, 6030203, 6030203, 6040103, 6040203, 6050203, 6050203, 6060203, 6060203];

            // this.SoulArrs = getSoulIds();
            this.SoulArrs = [60108];
            this.WeaponArrs.sort(sortByLv);
            cc.log(this.WeaponArrs);
            this.ArmorArrs.sort(sortByLv);
            this.RingArrs.sort(sortByLv);
            this.OrnamentArrs.sort(sortByLv);
            this.WingArrs.sort(sortByLv);
            this.SoulArrs.sort(sortByLv);
        }
        
    }

    saveEquipmentArrs(){
        let data = {
            WeaponArrs: this.WeaponArrs,
            ArmorArrs: this.ArmorArrs,
            RingArrs: this.RingArrs,
            SoulArrs: this.SoulArrs,
            OrnamentArrs: this.OrnamentArrs,
            WingArrs: this.WingArrs,
            PetLvArrs: this.PetLvArrs,
            BookArrs: this.BookArrs,
        }
        save('EquipmentArrs', JSON.stringify(data));
    }

    setExp(exp: number){
        this.Exp = exp;
        let index: number = this.getIndex(exp, Exp);
        
        
        // if(this.Level < index){
            if(this.AchieveCountData)
            this.AchieveCountData[9] = index;
            // this.saveHeroGlobal();
        // }
        this.Level = index;
        if(index >= 2){
            this.SkillCount = 2;
        }
        if(index >= 5){
            this.SkillCount = 3;
        }
        if(index >= 10){
            this.SkillCount = 4;
        }
        if(index >= 15){
            this.SkillCount = 5;
        }
        
        // this.refreshExp();
        // this.refreshLevel();
    }

    setCoins(coins: number){
        this.Coins = coins;
        // save('Coins',coins + '');
        this.refreshCoins();
    }

    setLife(life: number,){
        this.Life = life;
    }

    setJade(jade: number,){
        if(!jade){
            jade = 20;
        }
        this.Jade = jade;
        
    }

    setUnlock(unlock: number){
        if(this.PetLvArrs[0] < 1 && unlock > 19){
            this.unlockPet(2);
        }
        this.Unlock = unlock;
        Global.getInstance().unlockDifficulty = Math.floor((unlock - 1) / 40);
        Global.getInstance().gameDifficulty = Global.getInstance().unlockDifficulty;
    }

    setHeroIndex(main: number, other: number){
        this.MainHeroIndex = main;
        this.OtherHeroIndex = other;
    }

    setPetIndex(PetIndex: number) {
        this.PetIndex = PetIndex;
    }

    setHeroData(type: number, data: any){
        this.HeroDataArrs[type] = new HeroData(type, data);
    }

    setMonsterKillCount(count: number){
        this.MonsterKillCount = count;
    }

    setHighestCE(ce: number){
        this.HighestCE = ce;
    }


    setAchieveCountData(data: number[]){
        this.AchieveCountData = data;
    }

    setAchieveGetCountData(data: number[]){
        this.AchieveGetCountData = data;
    }

    //获取奖励，存数组
    pushEquipmentData(id: number){
        let type: number = getTypeId(id);
        let arrs: any[] = this.getDataArrsByIndex(type);
        //秘籍只有一本
        // if(type == 7){
        //     if(arrs.indexOf(id) == -1){
        //         arrs.push(id);
        //     }
        // }else
        arrs.push(id);
        arrs.sort(sortByLv);
    }

    setHeroGlobal(data: any){
        this.setExp(data.Exp);
        this.setCoins(data.Coins);
        this.setLife(data.Life);
        this.setJade(data.Jade);
        this.setUnlock(data.Unlock);

        this.setHeroIndex(data.MainHeroIndex, data.OtherHeroIndex); //主副位英雄
        this.setPetIndex(data.PetIndex); //神宠

        if(data.MonsterKillCount){
            this.setMonsterKillCount(data.MonsterKillCount);
        }else{
            this.setMonsterKillCount(0);
        }

        if(data.HighestCE){
            this.setHighestCE(data.HighestCE);
        }else{
            this.setHighestCE(0);
        }

        if(data.AchieveCountData){
            this.setAchieveCountData(data.AchieveCountData);
        }else{
            this.setAchieveCountData([1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
        
        if(data.AchieveGetCountData){
            this.setAchieveGetCountData(data.AchieveGetCountData);
        }else{
            this.setAchieveGetCountData([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
        }
    }

    initMapBox(){
        this.MapBox = [];
        for (let i = 0; i < 12; i++) {
            this.MapBox[i] = [];
            for (let j = 0; j < 3; j++) {
                this.MapBox[i].push(0);
            }
        }
    }
    
    setMapBox(data: number[][]){
        this.MapBox = data;
        save('MapBox', JSON.stringify(data));
    }

    initMapData(){
        this.MapData = [[],[],[]];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 40; j++) {
                this.MapData[i].push(0);
            }
        }
    }

    setMapData(data: number[][]){
        this.MapData = data;

        let count = 0;
        for (let k = 0; k < 3; k++) {
            for (let j = 0; j < this.MapData[k].length; j++) {
                let num = this.MapData[k][j];
                if(num != 0){
                    count += num;
                }else{
                    break;
                }
            }
        }
        this.StarCount = count;
        Statistics.getInstance().reportRank(Statistics.RANKLIST.通关榜, count);
        save('MapData', JSON.stringify(data));
    }

    saveHeroGlobal(){
        let data = {
            Exp: this.Exp,
            Life: this.Life,
            Coins: this.Coins,
            Jade: this.Jade,
            Unlock: this.Unlock,
            MainHeroIndex: this.MainHeroIndex,
            OtherHeroIndex: this.OtherHeroIndex,
            PetIndex: this.PetIndex,
            MonsterKillCount: this.MonsterKillCount,
            HighestCE: this.HighestCE,
            // HighestRank: this.HighestRank,
            AchieveCountData: this.AchieveCountData,
            AchieveGetCountData: this.AchieveGetCountData,

        }
        save('HeroGlobal', JSON.stringify(data));
    }

    saveMapData(){
        save('MapData', JSON.stringify({data: this.MapData}));
    }

    refreshCoins(){
        cc.director.emit('RefreshCoins');
    }

    refreshLife(){
        cc.director.emit('RefreshLife');
    }

    getMainHeroData(){
        return this.HeroDataArrs[this.MainHeroIndex];
    }

    getOtherHeroData(){
        return this.HeroDataArrs[this.OtherHeroIndex];
    }

    unlockPet(index: number){
        if(this.PetLvArrs[index] < 1){
            this.PetLvArrs[index] = 1;
            this.saveEquipmentArrs();
            if(this.PetIndex < 0){
                this.PetIndex = index;
                this.saveHeroGlobal();
            }
        }
    }

    getDataArrsByIndex(index: number){
        switch (index) {
            case 1:
                return this.WeaponArrs;
            case 2:
                return this.ArmorArrs;
            case 3:
                return this.RingArrs;
            case 4:
                return this.OrnamentArrs;
            case 5:
                return this.WingArrs;
            case 6:
                return this.SoulArrs;
            case 7:
                return this.BookArrs;
            default:
                break;
        }
    }

    getIndex(value: number,arrs: number[]): number{
        for(let i: number = arrs.length - 1;i >= 0;i --){
            if(value >= arrs[i]){
                return i + 2;
            }
        }
        return 1;
    }

    getProgress(exp: number): number{
        let lvl: number = 0;
        if(this.getIndex(this.Exp - exp,Exp) < this.Level){
            lvl = this.Level - this.getIndex(this.Exp - exp,Exp);
        }
        if(this.Level - lvl == 1){
            return (this.Exp - exp) / Exp[0];
        }
        if(this.Level - lvl > 1 && this.Level - lvl < 100){
            return (this.Exp - exp - Exp[this.Level - lvl - 2]) / (Exp[this.Level - lvl - 1] - Exp[this.Level - lvl - 2]);
        }
        if(this.Level - lvl == 100){
            return 1;
        }
    }



    // update (dt) {}
}
