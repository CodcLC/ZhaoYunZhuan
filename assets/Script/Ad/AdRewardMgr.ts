
import Game from "../Game";
import BizarreAdventure from "../BizarreAdventure/BizarreAdventure";
import Menu from "../Menu";
import DataMgr from "../DataMgr";
import AdList from "./AdList";
import Activity from "../Others/Activity";
import Sign from "../Others/Sign";
import MapBoxLayout from "../Map/MapBox";
import Equipment from "../Equipment";
import Global from "../nativets/Global";
import MapSelect from "../Map/MapSelect";
import HeroGlobal from "../Hero/HeroGlobal";
import TimeLimit from "../Others/TimeLimit/TimeLimit";
import BATips from "../BizarreAdventure/BATips";
import { save } from "../nativets/SaveMgr";
import Qimen from "../Others/Qimen/Qimen";


export default class AdRewradMgr{
    static instance: AdRewradMgr = null;
    

    static getInstance(){
        if(!this.instance){
            this.instance = new AdRewradMgr();
        }
        return this.instance;
    }

    onSuccess(index: number){
        switch (index) {
            case AdList.WXVIDEOLIST1.开局Buff:
                Global.getInstance().preBuff = true;
                MapSelect.instance.refreshBuff();
                break;
            case AdList.WXVIDEOLIST1.复活:
                Game.instance.onRevive();
                break;
            case AdList.WXVIDEOLIST2.全都要:
                BizarreAdventure.instance.getAll();
                break;
            case AdList.WXVIDEOLIST2.双倍领取:
                MapBoxLayout.instance.getAll();
                break;
            case AdList.WXVIDEOLIST2.加金币:
                // Menu.instance.addCoins(DataMgr.instance.coinsArrs[DataMgr.instance.coinsCount]);
                Menu.instance.addCoins(300 + HeroGlobal.instance.Level * 10);
                DataMgr.instance.coinsCount ++;
                DataMgr.instance.saveSaveDate();
                break;
            case AdList.WXVIDEOLIST2.加体力:
                Menu.instance.addLife(DataMgr.instance.lifeArrs[DataMgr.instance.lifeCount]);
                DataMgr.instance.lifeCount ++;
                DataMgr.instance.saveSaveDate();
                break;
            case AdList.WXVIDEOLIST2.加仙玉:
                Menu.instance.addJade(DataMgr.instance.jadeArrs[DataMgr.instance.jadeCount]);
                DataMgr.instance.jadeCount ++;
                DataMgr.instance.saveSaveDate();
                break;
            case AdList.WXVIDEOLIST2.每日:
                Activity.instance.onGet();
                DataMgr.instance.activityCount ++;
                DataMgr.instance.saveSaveDate();
                break;
            case AdList.WXVIDEOLIST2.补签:
                Sign.instance.onSuccess();
                break;
            case AdList.WXVIDEOLIST2.武魂合成:
                Equipment.instance.soulRateVideo = 1;
                Equipment.instance.refreshSoulCompressRate();
                break;
            case AdList.WXVIDEOLIST2.限时武魂:
                HeroGlobal.instance.unlockPet(1);
                TimeLimit.instance.onClose();
                break;
            case AdList.WXVIDEOLIST2.秘籍双倍:
                BATips.instance.onDoubleReward();
                break; 
            case AdList.WXVIDEOLIST2.神翅:
                HeroGlobal.instance.pushEquipmentData(502040000);
                HeroGlobal.instance.saveEquipmentArrs();
                save('WingReward','true');
                break;
            case AdList.WXVIDEOLIST2.收藏礼包:
                Menu.instance.addCoins(1000);
                break;
            case AdList.WXVIDEOLIST2.免费奇门:
                Qimen.instance.onOpen();
                break;
            case AdList.WXVIDEOLIST2.奇门抽奖:
                Qimen.instance.getAll();
                break;
            default:
                break;
        }
    }
}
