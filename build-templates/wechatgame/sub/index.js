let Consts = {
	OpenDataKeys: {
		InitKey: "initKey",
		Grade: "testkey",
		LevelKey: "reachlevel",
		ScoreKey: "levelScore", // json.string
		KillKey: "KillRank",
		StarKey: "StarRank"
	},
	DomainAction: {
		FetchFriend: "FetchFriend",
		FetchGroup: "FetchGroup",
		FetchFriendLevel: "FetchFriendLevel", //好友关卡进度排行
		FetchFriendScore: "FetchFriendScore", //好友关卡得分排行
		HorConmpar: "HorConmpar", //横向比较 horizontal comparison
		Paging: "Paging",
		Scrolling: "Scrolling",
		KillRank: "KillRank",
        StarRank: "StarRank"
	},
}

const PAGE_SIZE = 3;
const ITEM_WIDTH = 800;
const ITEM_HEIGHT = 117;
const ITEM_BGH = 101;
let Max_Page = 0;
const RANK_PAGE_HEIGHT = ITEM_HEIGHT * PAGE_SIZE;

const dataSorter = (gameDatas, field = Consts.OpenDataKeys.KillKey) => {
	let data = []
	for (let i = 0; i < gameDatas.length; i++) {
		if (gameDatas[i].KVDataList[0]) {
			data.push(gameDatas[i])
		}
	}
	// Max_Page = Math.ceil(data.length / PAGE_SIZE) - 1
	// console.log(Max_Page, "Max_Page")
	// return data

	let newData = data.sort((a, b) => {
		let va = a.KVDataList[0] ? a.KVDataList[0].value - 0 : 0
		let vb = b.KVDataList[0] ? b.KVDataList[0].value - 0 : 0
		return vb - va;

		// const kvDataA = a.KVDataList.find(kvData => kvData.key === field);
		// const kvDataB = b.KVDataList.find(kvData => kvData.key === field);
		// const gradeA = kvDataA ? parseInt(kvDataA.value || 0) : 0;
		// const gradeB = kvDataB ? parseInt(kvDataB.value || 0) : 0;
		// return gradeA > gradeB ? -1 : gradeA < gradeB ? 1 : 0;
	});
	Max_Page = Math.ceil(data.length / PAGE_SIZE) - 1
	console.log(Max_Page, "Max_Page")
	return newData
}

let testData = [{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "2"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
		{key: "reachlevel", value: "24"}]},
		{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "22"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "12"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "24"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "72"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "972"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "3"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "432"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "9"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "345"}]},
	{openid: "orgkW0R_bIFbSEzGh6UzVKPJfbaQ", nickname: "sdak设计费_", avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/zfPWvGGiaH9Bz3dKe…uzcicLS0ib0nibNcbkgsrQMEhatQ1x7oR17tY3lAEeNXg/132", KVDataList: [
	{key: "reachlevel", value: "23"}]},

]

class RankListRenderer {
	constructor() {
		this.clearFlag = false
		this.offsetY = 0;
		this.maxOffsetY = 0;
		this.gameDatas = [];    //https://developers.weixin.qq.com/minigame/dev/document/open-api/data/UserGameData.html
		// this.gameLevelDatas = [];
		this.curDataType = Consts.OpenDataKeys.KillKey
		this.curPageIndex = 0; //当前页码
		this.drawIconCount = 0;
		this.rankCanvasList = [];

		this.selfUserInfo = null //avatarUrl //https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getUserInfo.html

		this.init();
	}

	init() {
		this.sharedCanvas = wx.getSharedCanvas();
		this.sharedCtx = this.sharedCanvas.getContext('2d');
		this.sharedCtx["canvas"]["Test"] = "abc123";
		this.fetchSelfInfo();

		this.loadImg();
		// wx.getUserCloudStorage({
		// 	keyList:[Consts.OpenDataKeys.KillKey],
		// 	success: res => {
		// 		console.log("wx.getUserCloudStorage success", res);
		// 		if(!res.KVDataList[0]){
		// 			wx.setUserCloudStorage({
		// 				KVDataList:[{key:Consts.OpenDataKeys.KillKey, value:"1"}],
		// 				success: res => {
		// 					console.log("wx.setUserCloudStorage success", res);
		// 				},
		// 				fail: res => {
		// 					console.log("wx.setUserCloudStorage fail", res);
		// 				},
		// 			})
		// 		}
		// 	},
		// 	fail: res => {
		// 		console.log("wx.getUserCloudStorage fail", res);
		// 	},
		// })
	}


	listen() {
		// cc.log('Listen');
		//msg -> {action, data}
		wx.onMessage(msg => {
			console.log("ranklist wx.onMessage", msg);
			switch (msg.action) {
				case Consts.DomainAction.KillRank:
					this.clearFlag = true;
					// this.TestKillRank();
					this.sharedCtx.clearRect(0, 0, this.sharedCanvas.width, this.sharedCanvas.height);
					this.selectType = 'kill';
					this.getKillData();
					break;

				case Consts.DomainAction.StarRank:
					this.clearFlag = true;
					// this.TestKillRank();
					this.sharedCtx.clearRect(0, 0, this.sharedCanvas.width, this.sharedCanvas.height);
					this.selectType = 'star';
					this.getStarData();
					break;

				case Consts.DomainAction.Scrolling:
					this.clearFlag = false
					if (!this.gameDatas.length) {
						return;
					}
					const deltaY = msg.data;
					const newOffsetY = this.offsetY + deltaY;
					if (newOffsetY < 0) {
						//   console.log("前面没有更多了");
						return;
					}
					if (newOffsetY + PAGE_SIZE * ITEM_HEIGHT > this.maxOffsetY) {
						//   console.log("后面没有更多了");
						return;
					}
					this.offsetY = newOffsetY;
					this.showRanks(newOffsetY);
					break;

				default:
					console.log(`未知消息类型:msg.action=${msg.action}`);
					break;
			}
		});
	}

	fetchSelfInfo() {
		wx.getUserInfo({
			openIdList: ["selfOpenId"],
			success: res => {
				console.log("fetchSelfCloudData success res=>", res)
				this.selfUserInfo = res.data[0]
			}
		})
	}

	//取出所有好友数据 关卡进度
	getKillData() {
		wx.getFriendCloudStorage({
			keyList: [
				Consts.OpenDataKeys.KillKey,
			],
			success: res => {
				console.log("getKillData success", res);
				this.curDataType = Consts.OpenDataKeys.KillKey
				this.gameDatas = dataSorter(res.data);
				// this.gameDatas = dataSorter(testData);
				const dataLen = this.gameDatas.length;
				this.offsetY = 0;
				this.maxOffsetY = dataLen * ITEM_HEIGHT;
				if (dataLen) {
					this.showRanks(0);
					setTimeout(() => {
						this.showRanks(this.offsetY);
					}, 300);
				}
			},
			fail: res => {
				console.log("getKillData fail", res);
			},
		});
	}

	getStarData() {
		wx.getFriendCloudStorage({
			keyList: [
				Consts.OpenDataKeys.StarKey,
			],
			success: res => {
				console.log("getStarData success", res);
				this.curDataType = Consts.OpenDataKeys.StarKey
				this.gameDatas = dataSorter(res.data);
				// this.gameDatas = dataSorter(testData);
				const dataLen = this.gameDatas.length;
				this.offsetY = 0;
				this.maxOffsetY = dataLen * ITEM_HEIGHT;
				if (dataLen) {
					this.showRanks(0);
					setTimeout(() => {
						this.showRanks(this.offsetY);
					}, 300);
				}
			},
			fail: res => {
				console.log("getStarData fail", res);
			},
		});
	}

	// 根据滑动偏移绘制排行榜画布
	showRanks(offsetY) {
		this.curOffsetY = offsetY
		const sharedWidth = this.sharedCanvas.width;
		const sharedHeight = this.sharedCanvas.height;
		this.sharedCtx.clearRect(0, 0, sharedWidth, sharedHeight);
		if (this.clearFlag){
			this.clearFlag = false
			this.rankCanvasList = [];			
		}

		const pageY = offsetY % RANK_PAGE_HEIGHT;
		const pageIndex = Math.floor(offsetY / RANK_PAGE_HEIGHT);
		const isOverOnePage = pageY + sharedHeight > RANK_PAGE_HEIGHT;

		let rankCanvas = this.getCanvasByPageIndex(pageIndex);
		if (!isOverOnePage) {
			this.sharedCtx.drawImage(rankCanvas, 0, pageY, sharedWidth, sharedHeight, 0, 0, sharedWidth, sharedHeight);
		} else {
			//绘制当前页后半部分
			const partialHeight = RANK_PAGE_HEIGHT - pageY;
			this.sharedCtx.drawImage(rankCanvas, 0, pageY, sharedWidth, partialHeight, 0, 0, sharedWidth, partialHeight);

			//绘制下一页前半部分
			rankCanvas = this.getCanvasByPageIndex(pageIndex + 1);
			this.sharedCtx.drawImage(rankCanvas, 0, 0, sharedWidth, sharedHeight - partialHeight, 0, partialHeight, sharedWidth, sharedHeight - partialHeight);
		}
		// this.sharedCtx.clearRect(0,sharedHeight - 110,sharedWidth, 110);
		this.drawMy();
	}
	// 获取指定页码的排行榜
	getCanvasByPageIndex(pageIndex){
		let canvas = this.rankCanvasList[pageIndex];
		if (!canvas) {
			canvas = wx.createCanvas();
			canvas.width = this.sharedCanvas.width;
			canvas.height = RANK_PAGE_HEIGHT;
			this.rankCanvasList[pageIndex] = canvas;
			const ctx = canvas.getContext('2d');
			this.drawPagedRanks(ctx, pageIndex);
		}
		return canvas;
	}
	drawPagedRanks(ctx, pageIndex) {
		console.log('drawPage');
		for (let i = 0; i < PAGE_SIZE; i++) {
			const pageOffset = pageIndex * PAGE_SIZE;
			const data = this.gameDatas[pageOffset + i];
			if (!data) continue;
			this.drawRankItemEx(ctx, pageOffset+i+1, data, ITEM_HEIGHT * i)
		}
	}

	drawAvatar(ctx, avatarUrl, x, y, w, h, cb) {
		// avatarUrl = avatarUrl.substr(0, avatarUrl.lastIndexOf('/')) + "/132";
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(x - 5, y - 5, w + 10, h + 10);
		//5px边框
		const avatarImg = wx.createImage();
		avatarImg.src = avatarUrl;
		avatarImg.onload = () => {
			cb(avatarImg);
		};
	}

	drawRankItemEx(ctx, rank, data, itemGapY) {
		let offsetX = 85;

		const nick = data.nickname.length <= 5 ? data.nickname : data.nickname.substr(0, 10) + "...";
		const kvData = data.KVDataList[0];
		const grade = kvData ? kvData.value : 0;

		//背景颜色
		// if (rank % 2 == 1) {
			// ctx.fillStyle = "#c0d0d8";
			// ctx.fillRect(0, itemGapY, ITEM_WIDTH, ITEM_BGH);
		// }

		// const itembgImg = wx.createImage();
		// itembgImg.src = `sub/src/itembg.png`;
		// itembgImg.onload = () => {
		// 		// if (prevOffsetY == this.offsetY) {
		// 		ctx.drawImage(itembgImg, 0, itemGapY, ITEM_WIDTH, ITEM_BGH);
		// 		// }
		// 	};

		if(this.itembgImg){
			ctx.drawImage(this.itembgImg, 0 + offsetX, itemGapY, ITEM_WIDTH, ITEM_BGH);
		}

		//名次 这里可以设置前几名的名次背景
		if (rank <= 3) {
			const rankImg = wx.createImage();
			rankImg.src = `sub/src/${rank}.png`;
			rankImg.onload = () => {
				// if (prevOffsetY == this.offsetY) {
				ctx.drawImage(rankImg, 84 - 55 + offsetX, (117 - 39 - 5) / 2 + itemGapY, rank == 1 ? 22 : 27, 39);
				// }
			};
		} else {
			ctx.fillStyle = "#BDBDBD";
			ctx.textAlign = "right";
			ctx.baseLine = "middle";
			ctx.font = "40px Helvetica";
			ctx.fillText(`${rank}`, 84 + 10 + offsetX, 117 / 2 + 5 + itemGapY);
		}

		//头像
		const avatarW = 70;
		const avatarH = 70;
		const avatarX = 224 - avatarW / 2;
		const avatarY = itemGapY + (ITEM_HEIGHT - avatarH) / 4 + 1;
		
		this.drawAvatar(ctx, data.avatarUrl, avatarX, avatarY, avatarW, avatarH, (avatarImg) => {
			// if (prevOffsetY == this.offsetY) {
			ctx.drawImage(avatarImg, avatarX, avatarY, avatarW, avatarH);
			// }
			
			if(this.drawIconCount>=this.gameDatas.length-1 || this.drawIconCount >=PAGE_SIZE-1){
				this.drawIconCount = 0;
				this.showRanks(this.curOffsetY)
			}else{
				this.drawIconCount++;
			}
		})

		//名字
		ctx.fillStyle = "#777063";
		ctx.textAlign = "left";
		ctx.baseLine = "middle";
		ctx.font = "30px Helvetica";
		ctx.fillText(nick, 324 + offsetX, itemGapY + (ITEM_HEIGHT - 60) / 1 + 1);

		//分数
		ctx.fillStyle = "#777063";
		ctx.textAlign = "left";
		ctx.baseLine = "middle";
		ctx.font = "30px Helvetica";
		if (this.curDataType === Consts.OpenDataKeys.KillKey) {
			// ctx.fillText(`${grade}关`, 350, 80 + itemGapY);
			ctx.fillText(`战力 ${grade}`, 600 + offsetX, itemGapY + (ITEM_HEIGHT - 60) / 1 + 1);
		} else if (this.curDataType === Consts.OpenDataKeys.StarKey) {
			// ctx.fillText(`${grade}分`, 350, 80 + itemGapY);
			ctx.fillText(`星数:${grade}`, 600 + offsetX, itemGapY + (ITEM_HEIGHT - 60) / 1 + 1);
		}
	}

	loadImg(){
		const itembgImg = wx.createImage();
		itembgImg.src = `sub/src/itembg.png`;
		itembgImg.onload = () => {
			this.itembgImg = itembgImg;
		};
	}

	drawMy(){
		let maskHeight = 110;
		this.sharedCtx.clearRect(0 + 85,this.sharedCanvas.height - maskHeight,this.sharedCanvas.width, maskHeight);
		this.sharedCtx.drawImage(this.createMy(),0,sharedCanvas.height - maskHeight + 8);
		// this.sharedCtx.fillStyle = "#ffffff";
		// this.sharedCtx.fillRect(20, 0, 40, 550);
	}

	createMy(){
		if(!this.myCanvas || (this.curType != this.selectType)){
			this.myCanvas = wx.createCanvas();
			// this.myCanvas.width = ITEM_WIDTH;
			this.myCanvas.width = 971;
			this.myCanvas.height = ITEM_HEIGHT;
			const ctx = this.myCanvas.getContext('2d');
			
			this.drawRankItemEx(ctx,this.getMyIndex() + 1,this.gameDatas[this.getMyIndex()],0);
			this.curType = this.selectType;
		}
		return this.myCanvas;
	}

	 getMyIndex(){
		 if(!this.selfUserInfo) return;
		 if(!this.gameDatas) return;
		 let index = -1;
		 for (let i = 0; i < this.gameDatas.length; i++) {
			 const data = this.gameDatas[i];
			 if(this.selfUserInfo.nickname == data.nickname && this,this.selfUserInfo.avatarUrl == data.avatarUrl){
				 index = i;
				 break;
			 }
		 }
		 return index;
	 }

}

const rankList = new RankListRenderer();
rankList.listen();
