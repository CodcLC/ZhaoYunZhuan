/**
 * 不同英雄的数据
 */
import { save } from "../nativets/SaveMgr";
import HeroGlobal from "./HeroGlobal";
import MenuSelect from "../MenuSelect";
import { getDataById, getJsonId, getUpgradeId, getSoulId, getSoulDataById, AttArrs, Pet, getWhoId } from "../nativets/Config";
import Tips from "../Tips";
import Hero from "./Hero";
import Statistics from "../Tool/Statistics";
import Menu from "../Menu";
import { getPlatform, Platform } from "../nativets/Platform";
import RankWX from "../Others/Rank/RankWX";


const HERO_SPEED: number = 500;

export default class HeroData{
    Type: number;

    Armor: number;
    Wing: number;
    Ornament: number;
    Weapon: number;
    Ring: number;

    ATK: number;
    DEF: number;
    CR: number;
    SP: number;
    LS: number;

    ARP: number;  //固定穿
    BONUS: number;  //伤害百分比
    CD: number;     //所有技能减
    MISS: number; //闪避率

    CE: number; //战斗力
    
    SkillCount: number;
    HP: number;
    SkillArrs: number[];

    tempHP: number;
    EXP: number;
    GOLD: number;
    equipedArrs: number[];
    
    
    /**
     *
     */
    constructor(type: number, data: any) {
        this.Type = type;
        this.Armor = data.Armor;
        this.Wing = data.Wing;
        this.Ornament = data.Ornament;
        this.Weapon = data.Weapon;
        this.Ring = data.Ring;
        this.SkillArrs = data.SkillArrs;

        // 兼容技能
        for (let i = 0; i < this.SkillArrs.length; i++) {
            if(this.SkillArrs[i] == -1){
                this.SkillArrs[i] = 0;
            }
            
        }

        // 兼容存档
        let defaultWeapon = [111010000, 121040000, 131070000];
        let defaultArmor = [211010000, 221040000, 232080000];
        if(this.Armor < 10){
            this.Armor = defaultArmor[type];
        }
        if(this.Weapon < 10){
            this.Weapon = defaultWeapon[type];
        }
        if(this.Wing > -1 && this.Wing < 10){
            this.Wing = -1;
        }
        if(this.Ornament > -1 && this.Ornament < 10){
            this.Ornament = -1;
        }
        if(this.Ring > -1 && this.Ring < 10){
            this.Ring = -1;
        }

        this.updateAttribute();
    }



    init(){
        this.Armor = -1,
        this.Wing = -1,
        this.Ornament = -1,
        this.ATK = 10,
        this.DEF = 0;
        this.CR = 10;
        this.SP = 440;
        this.LS = 0;
        this.Weapon = 0;
        this.SkillCount = 1;
        this.SkillArrs = [1];

        this.ARP = 0;
        this.BONUS = 0;
        this.CD = 0;
        this.MISS = 0;
    }

    getBaseAttribute(){
        this.ATK = 10 + 2 * (HeroGlobal.instance.Level - 1);
        this.HP = 400 + 18 * (HeroGlobal.instance.Level - 1);
        this.DEF = 5;
        this.LS = 0;
        this.CR = 5;
        this.SP = HERO_SPEED;

        this.ARP = 0;
        this.BONUS = 0;
        this.CD = 0;
        this.MISS = 0;

        this.EXP = 0;
        this.GOLD = 0;
    }

    // reSetHP(){
    //     this.tempHP = 200 + 35 * (HeroGlobal.instance.Level - 1);
    // }

    

    //更新属性
    updateAttribute(t?: boolean){
        this.getBaseAttribute();

        let weaponId: number = this.Weapon;
        let armorId: number = this.Armor;
        let wingId: number = null;
        if(this.Wing > -1){
            wingId = this.Wing;
        }
        let ornamentId: number = null;
        if(this.Ornament > -1){
            ornamentId = this.Ornament;
        }
        let ringId: number = null;
        if(this.Ring > -1){
            ringId = this.Ring;
        }
        let arrs: number[] = [weaponId, armorId, wingId, ornamentId, ringId];
        let localArrs = new Array(this.ATK, this.DEF, this.HP, this.LS, this.SP, this.CR, this.ARP, this.BONUS, this.CD, this.MISS, this.EXP, this.GOLD);
        
        cc.log('arrrrrrs',localArrs);
        for (let i = 0; i < 6; i++) {
            let jsonData = null;
            let lv = 0;
            if(i < 5){
                if(arrs[i] == null) continue;
                jsonData = getDataById(getJsonId(arrs[i]));
                lv = getUpgradeId(arrs[i]);
            }else{
                if(HeroGlobal.instance.PetIndex > -1){
                    jsonData = Pet[HeroGlobal.instance.PetIndex];
                    lv = HeroGlobal.instance.PetLvArrs[HeroGlobal.instance.PetIndex];
                }
            }
            

            if(!jsonData) continue;
            // cc.log(jsonData);
            if(jsonData.atk){
                this.ATK += parseFloat(jsonData.atk) + lv * parseFloat(jsonData.atkup);
            }
            if(jsonData.def){
                this.DEF += parseFloat(jsonData.def) + lv * parseFloat(jsonData.defup);
            }
            if(jsonData.hp){
                this.HP += parseFloat(jsonData.hp) + lv * parseFloat(jsonData.hpup);
            }
            if(jsonData.ls){
                this.LS += parseFloat(jsonData.ls) + lv * parseFloat(jsonData.lsup);
            }
            if(jsonData.sp){
                this.SP += parseFloat(jsonData.sp) + lv * parseFloat(jsonData.spup);
            }
            if(jsonData.cr){
                this.CR += parseFloat(jsonData.cr) + lv * parseFloat(jsonData.crup);
            }
            if(jsonData.arp){
                this.ARP += parseFloat(jsonData.arp) + lv * parseFloat(jsonData.arpup);
            }
            if(jsonData.Bonus){
                this.BONUS += parseFloat(jsonData.bonus) + lv * parseFloat(jsonData.bonusup);
            }
            if(jsonData.cd){
                this.CD += parseFloat(jsonData.cd) + lv * parseFloat(jsonData.cdup);
            }
            if(jsonData.miss){
                this.MISS += parseFloat(jsonData.miss) + lv * parseFloat(jsonData.missup);
            }
            if(jsonData.exp){
                this.EXP += parseFloat(jsonData.exp) + lv * parseFloat(jsonData.expup);
            }
            if(jsonData.gold){
                this.GOLD += parseFloat(jsonData.gold) + lv * parseFloat(jsonData.goldup);
            }

            if(i < 5){
                let soulStr: string = '';
                let soulIndex: number = getSoulId(arrs[i]);
                if(soulIndex != 0){
                    let soulData: any = getSoulDataById(soulIndex - 1);
                    if(soulData.atk){
                        this.ATK += parseFloat(soulData.atk);
                    }
                    if(soulData.def){
                        this.DEF += parseFloat(soulData.def);
                    }
                    if(soulData.hp){
                        this.HP += parseFloat(soulData.hp);
                    }
                    if(soulData.ls){
                        this.LS += parseFloat(soulData.ls);
                    }
                    if(soulData.sp){
                        this.SP += parseFloat(soulData.sp);
                    }
                    if(soulData.cr){
                        this.CR += parseFloat(soulData.cr);
                    }
                    if(soulData.arp){
                        this.ARP += parseFloat(soulData.arp);
                    }
                    if(soulData.Bonus){
                        this.BONUS += parseFloat(soulData.bonus);
                    }
                    if(soulData.cd){
                        this.CD += parseFloat(soulData.cd);
                    }
                    if(soulData.miss){
                        this.MISS += parseFloat(soulData.miss);
                    }
                    if(soulData.exp){
                        this.EXP += parseFloat(soulData.exp);
                    }
                    if(soulData.gold){
                        this.GOLD += parseFloat(soulData.gold);
                    }
                }
            }
            

            

        }

        // 秘籍永久提升
        for (let i = 0; i < HeroGlobal.instance.BookArrs.length; i++) {
            let bookData = getDataById(HeroGlobal.instance.BookArrs[i]);
            if(bookData.atk){
                this.ATK += parseFloat(bookData.atk);
            }
            if(bookData.def){
                this.DEF += parseFloat(bookData.def);
            }
            if(bookData.hp){
                this.HP += parseFloat(bookData.hp);
            }
            if(bookData.ls){
                this.LS += parseFloat(bookData.ls);
            }
            if(bookData.sp){
                this.SP += parseFloat(bookData.sp);
            }
            if(bookData.cr){
                this.CR += parseFloat(bookData.cr);
            }
            if(bookData.arp){
                this.ARP += parseFloat(bookData.arp);
            }
            if(bookData.Bonus){
                this.BONUS += parseFloat(bookData.bonus);
            }
            if(bookData.cd){
                this.CD += parseFloat(bookData.cd);
            }
            if(bookData.miss){
                this.MISS += parseFloat(bookData.miss);
            }
            if(bookData.exp){
                this.EXP += parseFloat(bookData.exp);
            }
            if(bookData.gold){
                this.GOLD += parseFloat(bookData.gold);
            }
        }

        this.CE = this.getCE();
        
    }

    buff(){
        this.updateAttribute();
        if(Hero.instance){
            
            this.ATK *= Hero.instance.reviveCount * 1.2;
            this.DEF *= Hero.instance.reviveCount * 1.2;
            cc.log(this.ATK, this.DEF);
        }
    }

    setTempHP(){
        //满血
        this.tempHP = 200 + 35 * (HeroGlobal.instance.Level - 1);
    }

    setArmor(data: number){
        if(getWhoId(data) == 0 || getWhoId(data) == this.Type + 1){
            this.Armor = data;
            this.saveData();
        }
        
    }

    setWing(data: number){
        this.Wing = data;
        this.saveData();
    }

    setOrnament(data: number){
        this.Ornament = data;
        this.saveData();
    }

    setWeapon(data: number){
        if(getWhoId(data) == 0 || getWhoId(data) == this.Type + 1){
            this.Weapon = data;
            this.saveData();
        }
        
    }

    setRing(data: number){
        this.Ring = data;
        this.saveData();
    }

    setEquip(index: number, data: number){
        switch (index) {
            case 1:
                this.setWeapon(data);
                break;
            case 2:
                this.setArmor(data);
                break;
            case 3:
                this.setRing(data);
                break;
            case 4:
                this.setOrnament(data);
                break;
            case 5:
                this.setWing(data);
                break;
            default:
                break;
        }
    }

    getDataByType(type: number){
        switch (type) {
            case 1:
                return this.Weapon;
                break;
            case 2:
                return this.Armor;
                break;
            case 3:
                return this.Ring;
                break;
            case 4:
                return this.Ornament;
                break;
            case 5:
                return this.Wing;
                break;
            default:
                break;
        }
    }

    setSkillArrs(data: number[]){
        this.SkillArrs = data;
        this.saveData();
    }

    getType(){
        return this.Type;
    }

    // 战斗力=HP/[1-防御力/（1000+防御力)]/(1-闪避）+10*攻击力*（1+暴击)*(1+穿透/5000）+cd*15000
    getCE(){

        

        let ce: number = 0;
        // ce = this.HP / (1 - this.DEF / (1000 + this.DEF)) / ((100 - this.MISS) / 100) + 10 * this.ATK * (100 + this.CR) * 0.01 * (1 + this.ARP / 5000) + this.CD * 150;
        
        // 战力=攻击力*30+速度*50+暴击*500+攻击增幅*700+减cd*150+闪避*100+穿透+防御*2+生命+吸血*600
        ce = this.ATK * 30 + this.SP * 50 + this.CR * 500 + this.BONUS * 700 + this.CD * 150 + this.MISS * 100 + this.DEF * 2 + this.HP + this.LS * 600;
        
        if(ce > this.CE){
            let str = this.CE + '上' + (ce - this.CE);
            Tips.instance.showSuccess(str);
        }

        if(ce > HeroGlobal.instance.HighestCE){
            HeroGlobal.instance.setHighestCE(ce);
            HeroGlobal.instance.saveHeroGlobal();
            Statistics.getInstance().reportRank(Statistics.RANKLIST.战力榜, ce);
            if(getPlatform() == Platform.WX || getPlatform() == Platform.QQ){
                RankWX.uploadWXKill(ce);
            }
        }


        return Math.floor(ce);


    }

    saveData(){
        this.updateAttribute();
        if(MenuSelect.instance && MenuSelect.instance.selectIndex != null && MenuSelect.instance.selectIndex != undefined){
            cc.director.emit('RefreshSp', MenuSelect.instance.selectIndex);
        }else{
            cc.director.emit('RefreshSp', HeroGlobal.instance.MainHeroIndex);
        }
        
        if(this.Type != null){
            //装备这种要存的，HP这种临时的不存
            let data = {
                Armor: this.Armor,
                Wing: this.Wing,
                Ring: this.Ring,
                Ornament: this.Ornament,
                Weapon: this.Weapon,
                SkillArrs: this.SkillArrs,
            }
            save('HeroData' + this.Type, JSON.stringify(data));
        }
    }
}