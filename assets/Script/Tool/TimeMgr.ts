export default class TimeMgr{
    static getFullYMD(date): string{
        var m=date.getMonth();
        if(m<10) m='0'+m;
        var d=date.getDate();
        if(d<10) d='0'+d;
        return ""+date.getFullYear()+m+d;
    }

    static getFullYMDToday(): string{
        return this.getFullYMD(new Date());
    }

    static getFullYMDYesterday(): string{
        return this.getFullYMD(new Date(Date.now() - 24 * 3600 * 1000));
    }

    static getFullYMDTomorrow(): string{
        return this.getFullYMD(new Date(Date.now() + 24 * 3600 * 1000));
    }

    static getDelayNow(pre: string): number{
        return TimeMgr.getDelayDay(pre, TimeMgr.getFullYMD(new Date()));
    }

    static getDelayDay(pre: string,now: string): number{
        var y1 = parseInt(pre.substr(0,4));
        var m1=parseInt(pre.substr(4,2));
        var d1=parseInt(pre.substr(6,2));
        var date1=new Date(y1,m1,d1);

        var y2=parseInt(now.substr(0,4));
        var m2=parseInt(now.substr(4,2));
        var d2=parseInt(now.substr(6,2));
        var date2=new Date(y2,m2,d2);

        var delay=(date2.getTime()-date1.getTime()) / (24*3600*1000);
        return delay;
    }


    /**
     * 返回分：秒
     * @param time 秒数
     */
    static formatTime(time: number): string{

        let s: string = (time % 60) < 10 ? ('0' + Math.floor(time % 60)) : ('' + Math.floor(time % 60));
        // var h = time/3600 < 10 ? ('0' + parseInt(time/3600)) : parseInt(time/3600);
        let h: number = 0;
        // let m: string = (time - h * 3600) / 60 < 10 ? ('0' + (time - h * 60)) : ('' + (time - h * 3600) / 60);
        let m: string = time / 60 < 10 ? ('0' + Math.floor(time / 60)) : ('' + Math.floor(time / 60));
        var ret: string = m + ':' + s;
        return ret;
    }

    static formatTimeH(time: number): string{
        let s: string = (time % 60) < 10 ? ('0' + Math.floor(time % 60)) : ('' + Math.floor(time % 60));
        // var h = time/3600 < 10 ? ('0' + parseInt(time/3600)) : parseInt(time/3600);
        let h: number = Math.floor(time / 3600);
        // let m: string = (time - h * 3600) / 60 < 10 ? ('0' + (time - h * 60)) : ('' + (time - h * 3600) / 60);
        let m: string = (time - h * 3600)  / 60 < 10 ? ('0' + Math.floor((time - h * 3600)  / 60)) : ('' + Math.floor((time - h * 3600)  / 60));
        var ret: string = h + ':' + m + ':' + s;
        return ret;
    }
}