class TopRankManager {
	public remainTime: number;
	public myRanks = {};
	public lists = {};
	public outline1st = {};
	public isAddCoolDown: boolean = false;
	public otherindex: Otherindex;
	public zaoyuList: TopRankBase[];
	public constructor() {
	}
	public getTabInfo(tab) {
		return this.lists[tab];
	}
	// byte   榜单类型
	// int  距离下次刷新剩余多少秒   停留在该界面，时间到了向服务器请求
	// int  自己的排名
	// short   长度
	// 循环读取   SimplePlayer 
	// int   排名
	// long   数据
	// int   数据2   坐骑榜时为坐骑阶数
	// 第一名外形数据
	// 全是byte   见714消息的  5个byte
	public parseMessage(msg: Message) {
		var base: TopRankBase;
		var type: number = msg.getByte();
		var remainTime: number = msg.getInt();
		var myRank: number = msg.getInt();
		var len: number = msg.getShort();
		var info: TopRankBase[] = [];
		for (var i: number = 0; i < len; i++) {
			base = new TopRankBase();
			base.parseMessage(msg);
			info.push(base);
		}
		this.myRanks[type] = myRank;
		this.lists[type] = info;
		if (remainTime > 0) {
			if (!this.isAddCoolDown) {
				this.remainTime = remainTime;
				this.isAddCoolDown = true;
				Tool.addTimer(this.onCountDown, this);
			}
		} else {
			this.remainTime = 0;
			this.onCountDown();
		}
		if (len == 0) return;
		var AppearData: PlayerAppears = new PlayerAppears();
		AppearData.parseMsg(msg);
		this.outline1st[type] = AppearData.appears[0];
	}

	public lastRankType: number = TopRankManager.RANK_SIMPLE_TYPE_MAPSTAGE;
	public lastDataList = [];
	//地图关卡排行榜
	public mapStageList = [];
	public mapStageMy: number = 0;
	public static RANK_SIMPLE_TYPE_MAPSTAGE: number = 1;
	//诛仙台排行榜
	public dekaronList = [];
	public dekaronMy: number = 0;
	public static RANK_SIMPLE_TYPE_DEKARON: number = 2;
	//达标活动排行榜
	public static RANK_SIMPLE_TYPE_DABIAO: number = 3;
	//节日达标活动排行榜
	public static RANK_SIMPLE_TYPE_FESTIVAL_TARGET: number = 4;
	//节日充值达标活动排行榜
	public static RANK_SIMPLE_TYPE_FESTIVAL_PAYTARGET: number = 5;
	//节日转盘排行榜
	public static RANK_SIMPLE_TYPE_FESTIVAL_ZHUANPAN: number = 6;
	//跨服消费排行榜
	public static RANK_SIMPLE_TYPE_CONSUME: number = 7;
	//跨服充值排行
	public static RANK_SIMPLE_TYPE_CROSSPAY: number = 8;
	//跨服消耗排行榜
	public static RANK_SIMPLE_TYPE_CONSUMEITEM: number = 9;
	//拉霸排行榜
	public static RANK_SIMPLE_TYPE_LABA: number = 100;
	//帮会排行榜
	public static RANK_SIMPLE_TYPE_UNIONDUP: number = 999;

	//简易排行榜信息
	public parseSimpleMessage(msg: Message) {
		this.lastRankType = msg.getByte();
		var showAll: boolean = msg.getBoolean();
		var size: number = msg.getShort();
		var rankList = [];
		for (var i: number = 0; i < size; i++) {
			var rankSimple: TopRankSimple = new TopRankSimple();
			rankSimple.parseMessage(msg);
			rankList.push(rankSimple);
		}
		var myRank: number = msg.getShort();

		//地图关卡排行榜
		if (this.lastRankType == TopRankManager.RANK_SIMPLE_TYPE_MAPSTAGE) {
			this.mapStageMy = myRank;
			this.mapStageList = rankList;
			this.lastDataList = this.mapStageList;
		}
		//诛仙台排行榜 
		else if (this.lastRankType == TopRankManager.RANK_SIMPLE_TYPE_DEKARON) {
			this.dekaronMy = myRank;
			this.dekaronList = rankList;
			this.lastDataList = this.dekaronList;
		}
		if (this.lastRankType != TopRankManager.RANK_SIMPLE_TYPE_DABIAO && showAll) {
			TopRankSimplePanel.NAME2_VISIBLE = true;
			TopRankSimplePanel.ADD_STR = "关";
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TopRankSimplePanel");
		}
	}

	public topzaoyulistdate(msg: Message) {
		this.zaoyuList = [];
		this.myRanks[TOPRANK_TYPE.FIELD_PVP] = msg.getShort();
		var len: number = msg.getShort();
		for (var i = 0; i < len; i++) {
			var rankData: TopRankBase = new TopRankBase();
			rankData.rank = i + 1;
			rankData.id = msg.getInt();
			rankData.info1 = msg.getInt();
			rankData.name = msg.getString();
			rankData.level = msg.getShort();
			rankData.rebirthLv = msg.getShort();
			rankData.viplevel = msg.getByte();
			if (i == 0) {
				var AppearData: PlayerAppears = new PlayerAppears();
				AppearData.parseMsg(msg);
				this.outline1st[TOPRANK_TYPE.FIELD_PVP] = AppearData.appears[0];
			}
			this.zaoyuList.push(rankData);
		}
	}
	public otherMessage(msg: Message) {
		this.otherindex = new Otherindex();
		this.otherindex.otherid = msg.getInt();//int	playerId
		this.otherindex.othername = msg.getString();//string	名字
		this.otherindex.otherzhuan = msg.getShort();//short	转生
		this.otherindex.otherlv = msg.getShort();//short	等级	
		this.otherindex.othervip = msg.getInt();//int	vip
		this.otherindex.zhangongLv = msg.getInt();
		var len: number = msg.getByte();//byte	角色数量
		this.otherindex.Otherplayerarr = [];
		for (var i = 0; i < len; i++) {
			var otherplayer: Otherplayer = new Otherplayer();
			otherplayer.teshu = [];
			otherplayer.occupation = msg.getByte();//职业
			otherplayer.sex = msg.getByte();

			this.otherindex.attributes = [];
			for(var h=0;h<ATTR_TYPE.SIZE;h++)
			{
				this.otherindex.attributes.push(msg.getLong());
			}
			otherplayer.figthPower = msg.getLong();//long 战力
			// otherplayer.jingmailv = msg.getShort();//short	经脉等级
			// otherplayer.tongjing = msg.getShort();//short	铜镜
			// otherplayer.teshu.push(otherplayer.tongjing);
			// otherplayer.yudi = msg.getShort();//short	玉笛	
			// otherplayer.teshu.push(otherplayer.yudi);
			// otherplayer.lefteye = msg.getShort();//short	左眼
			// otherplayer.teshu.push(otherplayer.lefteye);
			// otherplayer.Righteye = msg.getShort();//short	右眼	
			// otherplayer.teshu.push(otherplayer.Righteye);
			otherplayer.equipdatearr = [];
			for (var j = 0; j < GameDefine.Equip_Slot_Num * 2 + 4; j++) { //一共24件
				var equipdate: Equipdate = new Equipdate();
				equipdate.isequip = msg.getBoolean();//bool	是否有装备	
				var equipThing: EquipThing = new EquipThing();
				if (equipdate.isequip == true) {
					equipThing.parseEquipMessage(msg);
				}
				otherplayer.equipdatearr.push(equipThing);
			}
			otherplayer.equipgroovearr = [];
			for (var x = 0; x < GameDefine.Equip_Slot_Num; x++) {
				var equipgroove: Equipgroove = new Equipgroove();
				equipgroove.zhuling = msg.getInt();//int	注灵等级	
				equipgroove.zhulingExp = msg.getInt();//int	注灵经验	
				equipgroove.qianghua = msg.getInt();//int	强化等级
				equipgroove.baoshi = msg.getInt();//int	宝石等级					
				equipgroove.zhuhun = msg.getByte();//byte	铸魂
				equipgroove.quenchingLv = msg.getByte();	//淬炼等级
				equipgroove.quenchingExp = msg.getInt();	//淬炼经验
				otherplayer.equipgroovearr.push(equipgroove);
			}
			// var zzlen: number = msg.getByte();
			// otherplayer.zhuzaidatearr = [];
			// for (var y = 0; y < zzlen; y++) {
			// 	var zhuzaidate: Zhuzaidate = new Zhuzaidate();
			// 	zhuzaidate.zhuzailv = msg.getShort();//short	主宰等级
			// 	zhuzaidate.zhuzaijieji = msg.getShort();//short	主宰阶级	循环结束
			// 	otherplayer.zhuzaidatearr.push(zhuzaidate);
			// }
			//祝福值的阶
			otherplayer.blessStardata = [];
			otherplayer.blessstagedata = [];
			otherplayer.blessPowerdata = [];
			for (var z = 0; z < BLESS_TYPE.SIZE; z++) {
				otherplayer.blessStardata[z] = msg.getShort();
				otherplayer.blessstagedata[z] = msg.getShort();
				otherplayer.blessPowerdata[z] = msg.getLong();
			}
			this.otherindex.Otherplayerarr.push(otherplayer);
		}

		var AppearData: PlayerAppears = new PlayerAppears();
		AppearData.parseMsg(msg);
		this.otherindex.appearData = AppearData.appears;


	}

	public otherindexdate(): Otherindex {
		return this.otherindex;
	}
	public onCountDown() {
		this.remainTime -= 1;
		if (this.remainTime <= 0) {
			if (this.isAddCoolDown) {
				Tool.removeTimer(this.onCountDown, this);
			}
			this.isAddCoolDown = false;
			for (var key in this.lists) {
				delete this.lists[key];
			}
		}
	}
}

/**角色主信息 */
class Otherindex {
	/**角色id */
	public otherid: number;
	/** 角色名字 */
	public othername: String;
	/**转生 */
	public otherzhuan: number;
	/**角色等级 */
	public otherlv: number;
	/**角色vip */
	public othervip: number;
	public zhangongLv:number;
	/**人物列表 */
	public Otherplayerarr: Otherplayer[];
	/**外形信息 */
	public appearData: AppearPlayerData[];
	/**角色属性*/
	public attributes:number[];
}
/**各个人物信息 */
class Otherplayer {
	/**人物索引 */
	public occupation: number;
	/**人物性别**/
	public sex: SEX_TYPE;
	/**战斗力 */
	public figthPower: number;
	/**经脉等级 */
	public jingmailv: number;
	/**铜镜 */
	public tongjing: number;
	/**玉笛 */
	public yudi: number;
	/**左眼 */
	public lefteye: number;
	/**右眼 */
	public Righteye: number;
	/**特殊装备槽 */
	public teshu: number[];
	/**装备信息列表 */
	public equipdatearr: EquipThing[];
	/**装备坑列表 */
	public equipgroovearr: Equipgroove[];
	/**主宰列表 */
	public zhuzaidatearr: Zhuzaidate[];
	/**祝福值玩法阶 */
	public blessstagedata: number[];
	/**祝福值玩法星 */
	public blessStardata: number[];
	/**祝福值战斗力 */
	public blessPowerdata: number[];

}
/**装备信息 */
class Equipdate {
	/**是否有装备 */
	public isequip: boolean;
	/**史诗装备 */
	public ssid: number;
	/**装备ID */
	public equipid: number;
	/**装备品质 */
	public quality: number;
	/**装备属性列表 */
	public Equipdesarr: Equipdes[];


}
/**装备属性 */
class Equipdes {
	/**属性类型 */
	public destype: number;
	/**属性值 */
	public desdate: number;
}
/**装备坑 */
class Equipgroove {
	/**注灵等级 */
	public zhuling: number;
	/**注灵经验 */
	public zhulingExp: number;
	/**强化等级 */
	public qianghua: number;
	/**宝石等级 */
	public baoshi: number;
	/**铸魂 */
	public zhuhun: number;
	/**淬炼等级**/
	public quenchingLv: number;
	/**淬炼经验**/
	public quenchingExp: number;
}
/**主宰 */
class Zhuzaidate {
	/**主宰等级 */
	public zhuzailv: number;
	/**主宰阶级 */
	public zhuzaijieji: number;
}