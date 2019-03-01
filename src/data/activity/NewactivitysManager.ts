class NewactivitysManager {
	public classify;
	public _date;

	public shenmiarr;
	public model;
	public record = {};
	public xiangou = {};
	public vipxiangou = {};
	public chongji = {};
	public denglu = [];
	public leiji = {};
	public chongzhi = {};
	public qianbei_record = {};
	public activitysday: number;
	public _id;
	public isBuyInvestment: boolean;
	public investmentDays: number;
	public zhizunxiangou = {};
	public zhizunDay: number;
	//限购
	// public xiangouobj;
	//vip3礼包
	// public vip3date;
	//登录奖励
	public denglumodel;
	//红包返利
	public hongbaodate;
	//累计充值
	// public leijichongzhidate;
	//充值盛宴
	// public chongzhishengyandate;
	//摇钱树
	public yaoqianshuXmldate;
	public activityarr = [];
	public activityfuliarr = [];
	public xiangouarr = [];
	public zhizunxiangouArr = [];
	public vipxiangouarr = [];
	public chongjiarr = [];
	public dengluarr = [];
	public hongbaoarr = [];
	public yaoqian1000: Yaoqianshuinit;
	public yaoqian170: YaoqianshuYaoqian;
	public yaoqianshuBoom: number;
	//达标活动数据开始
	//达标排行榜
	public dabiao_ranks = [];
	//达标排行对应的Model
	public dabiao_model: Modeldabiaorewards;
	//个人目标对应的Model
	public personal_dabiao_model: Modeldabiaohuodong;
	//当前奖励的记录
	public dabiao_reward: number[] = [];
	//100元冲榜奖励的记录
	public charge100: boolean;
	public chargeMoneyNum: number;
	//自身当前值
	public dabiao_value: number;
	//目标值
	public dabiao_target: number;
	//达标活动数据结束

	//签到
	public signId: number;
	public signRewards: number[] = [];
	public payToday: boolean;

	//累计登录
	public loginDay: number;
	public loginRewardDay: number;
	public currLoginMode: Modeldenglu2;

	//限时登录
	public limitLoginDay: number;
	public limitLoginRewardDay: number[] = [];

	//冲关先锋领取
	public xianfengReward: number[] = [];
	public blessTp: number = 0;
	public constructor() {
		this.activityarr = [];
		this.chargeMoneyNum = -1;
		this.gooditemnewactivity();
		// this.goodsxiangouitem();
		// this.vip3datefunction();
		this.dengludatefunction();
		// this.leijijchongzhi();
		// this.chongzhishengyan();
		this.yaoqianshufunction();
		this.yaoqian1000 = new Yaoqianshuinit;
		this.yaoqian1000.lingjiangarr = [];
		// this.activityfuliarr.push(1);
		this.activityfuliarr.push(2);
	}
	private timerComFunc() {

	}
	/*物品分类*/
	public chongxinlianjie() {
		this.activityarr = [];
	}

	public gooditemnewactivity() {
		// this.classify = {};
		// var model: NewactivitysTehuiModel;
		// var data = JsonModelManager.instance.getModeltehuilibao();
		// for (var key in data) {
		// 	model = data[key];
		// 	if (!this.classify[model.id]) {
		// 		this.classify[model.id] = [];
		// 	}
		// 	this.classify[model.id].push(model);
		// }
		// for(){

		// }

	}
	//摇钱树
	public yaoqianshufunction() {
		this.yaoqianshuXmldate = {};
		var model: Modelyaoqianshu;
		var data = JsonModelManager.instance.getModelyaoqianshu();
		for (var key in data) {
			model = data[key];
			if (!this.yaoqianshuXmldate[model.id]) {
				this.yaoqianshuXmldate[model.id] = [];
			}
			this.yaoqianshuXmldate[model.id].push(model);
		}
	}
	// //vip3礼包
	// public vip3datefunction() {
	// 	this.vip3date = {};
	// 	var model: Newactivitysvip3Model;
	// 	var data = ModelManager.getInstance().modelvip3Newactivitys;
	// 	for (var key in data) {
	// 		model = data[key];
	// 		if (!this.vip3date[model.id]) {
	// 			this.vip3date[model.id] = [];
	// 		}
	// 		this.vip3date[model.id].push(model);
	// 	}
	// }
	// //累计充值
	// public leijijchongzhi() {
	// 	this.leijichongzhidate = {};
	// 	var model: NewactivitysleijiModel;
	// 	var data = ModelManager.getInstance().modelleijiNewactivitys;
	// 	for (var key in data) {
	// 		model = data[key];
	// 		if (!this.leijichongzhidate[model.id]) {
	// 			this.leijichongzhidate[model.id] = [];
	// 		}
	// 		this.leijichongzhidate[model.id].push(model);
	// 	}
	// }
	//充值盛宴
	// public chongzhishengyan() {
	// 	this.chongzhishengyandate = {};
	// 	var model: Modelchongzhishengyan;
	// 	var data = JsonModelManager.instance.getModelchongzhishengyan();
	// 	for (var key in data) {
	// 		model = data[key];
	// 		if (!this.chongzhishengyandate[model.cost]) {
	// 			this.chongzhishengyandate[model.cost] = [];
	// 		}
	// 		this.chongzhishengyandate[model.cost].push(model);
	// 	}
	// }
	//登录
	public dengludatefunction() {
		this.denglumodel = {};
		var model: Modeldenglu;
		var data = JsonModelManager.instance.getModeldenglu();
		for (var key in data) {
			model = data[key];
			if (!this.denglumodel[model.id]) {
				this.denglumodel[model.id] = [];
			}
			this.denglumodel[model.id].push(model);
		}
	}
	//限购
	// public goodsxiangouitem() {
	// 	this.xiangouobj = {};
	// 	var model: NewactivitysxiangouModel;
	// 	var data = ModelManager.getInstance().modelNewactivitysxiangou;
	// 	for (var key in data) {
	// 		model = data[key];
	// 		if (!this.xiangouobj[model.id]) {
	// 			this.xiangouobj[model.id] = [];
	// 		}
	// 		this.xiangouobj[model.id].push(model);
	// 	}
	// }
	public get activityfuli() {
		this.activityfuliarr.sort();
		return this.activityfuliarr;
	}
	public get xiangoudate() {
		return this.xiangou;
	}
	public get vipxiangoudate() {
		return this.vipxiangou;
	}
	public get chongjidate() {
		return this.chongji;
	}
	public get dengludate() {
		return this.denglu;
	}
	public get zhizunxiangoudate() {
		return this.zhizunxiangou;
	}
	public parseMessage(msg: Message) {
		if (this.activityarr.indexOf(0) == -1) {
			this.activityarr.push(0);
		} else {

		}

		// this.activityarr[0]=0;
		// this.activityarr[0]=0;
		this.record = {};
		var id: number;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			id = msg.getByte();
			this.record[id] = id;
		}
	}
	/**当前第几天  byte
byte  已领取的长度
循环读取：byte   已领取第几天*/
	public parsedenglu(msg: Message) {
		this.denglu = [];
		//var atday="atday";
		this.denglu.push(msg.getByte());
		//var atboo="atboo";
		this.dengluarr = [];
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {

			var day: number = msg.getByte();
			this.dengluarr.push(day);
		}
		this.denglu.push(this.dengluarr)

	}
	/**int    当前消费多少
byte  轮次 */
	public parseleiji(msg: Message) {
		if (this.activityarr.indexOf(5) == -1) {
			this.activityarr.push(5);
		} else {

		}

		this.leiji = {};
		this.leiji["atyuanbao"] = msg.getInt();
		this.leiji["lunci"] = msg.getByte();
	}
	/**
	 *充值好礼 
	 **/
	public payDays: number = 0;//连续充值天数
	public parsePayGift(msg: Message): void {
		this.payDays = msg.getByte();
	}
	/**
	 *七日充值活动 
	 **/
	public sevenpayId: number = ACTIVITY_BRANCH_TYPE.SEVENDAYPAY;//每日连续充值活动id
	public sevenpayDay: number;//活动处于第几天
	public sevenpayGold: number;//活动当天充值
	public getawardDays: number[];//已达成条件的有哪些天
	private _sevenpayTime: number;//当天的活动剩余时间
	public parseSevenDayPay(msg: Message): void {
		this.sevenpayDay = msg.getByte();
		this.sevenpayGold = msg.getInt();
		this.getawardDays = [];
		var getSize: number = msg.getByte();
		for (var i: number = 0; i < getSize; i++) {
			this.getawardDays.push(msg.getByte());
		}
		this._sevenpayTime = msg.getInt() * 1000 + egret.getTimer();
	}

	public get sevenpayTime(): number {
		return Math.max(0, Math.ceil((this._sevenpayTime - egret.getTimer()) / 1000));
	}

	public parsechongzhi(msg: Message) {
		this.chongzhi = {};
		var i: number = msg.getInt();
		var b: number = msg.getByte();
		this.chongzhi["yuanbao"] = i;
		this.chongzhi["boo"] = b;
	}
	/**消息：当前第几天  byte
	累计可领取  int
	byte  领取奖励状态  0--不可领取  1--已领取  2--可领取
	byte  已存元宝长度
	循环读取   byte  第几天
					int    已存多少元宝 */
	public parsehongbao(msg: Message) {
		if (this.activityarr.indexOf(4) == -1) {
			this.activityarr.push(4);
		}
		this.hongbaoarr = [];
		this.hongbaodate = {};
		this.hongbaodate["atday"] = msg.getByte();
		this.hongbaodate["dangqian"] = msg.getInt();
		this.hongbaodate["boo"] = msg.getByte();
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			var obj = {};
			obj["day"] = msg.getByte();
			obj["yuanbao"] = msg.getInt();
			this.hongbaoarr.push(obj);
		}
		this.hongbaodate["arr"] = this.hongbaoarr;
	}
	/**限购礼包  消息
	byte    当前轮次
	byte    已经购买的长度
	循环读取   byte    id
                short   已购买个数 */
	public parsexiangou(msg: Message) {
		if (this.activityarr.indexOf(1) == -1) {
			this.activityarr.push(1);
		} else {

		}
		this.xiangou = {};
		var day: number = msg.getByte();
		this.activitysday = day;


		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			this.xiangouarr = [];
			var id: number = msg.getByte();
			var num: number = msg.getShort();
			this.xiangouarr.push(id);
			this.xiangouarr.push(num);
			this.xiangou[id] = this.xiangouarr;
		}

	}
	/**限购礼包  消息
	byte    当前轮次
	byte    已经购买的长度
	循环读取   byte    id
                short   已购买个数 */
	public parseZhiZunxiangou(msg: Message) {
		// if (this.activityarr.indexOf(1) == -1) {
		// 	this.activityarr.push(1);
		// } else {

		// }
		this.zhizunxiangou = {};
		var day: number = msg.getByte();
		this.zhizunDay = day;


		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			this.zhizunxiangouArr = [];
			var id: number = msg.getByte();
			var num: number = msg.getShort();
			this.zhizunxiangouArr.push(id);
			this.zhizunxiangouArr.push(num);
			this.zhizunxiangou[id] = this.zhizunxiangouArr;
		}

	}
	/**
	 * byte	第几轮
	 * byte 当前该领取第几个奖励  0--无奖励  1 2 3
	 */
	public parsedabiao(msg: Message) {
		var dabiao_id = msg.getByte();
		this.personal_dabiao_model = JsonModelManager.instance.getModeldabiaohuodong()[dabiao_id];
		var size: number = msg.getByte();
		for (var i = 0; i < size; i++) {
			this.dabiao_reward[i] = msg.getByte();
		}
	}

	/**
	 * byte	第几轮
	 * byte 当前该领取第几个奖励  0--无奖励  1 2 3
	 */
	public parseinvest(msg: Message) {
		this.isBuyInvestment = msg.getBoolean();
		//第几天
		if (this.isBuyInvestment) {
			this.investmentDays = msg.getByte();
		}
	}

	/*神器累充 
	*/
	public shenqiData: ShenQiData = new ShenQiData();
	public parseShenqi(msg: Message) {
		this.shenqiData.round = msg.getByte();
		this.shenqiData.sum = msg.getInt();
		this.shenqiData.isgoal = msg.getBoolean();
		this.shenqiData.isreward = (msg.getByte() == 1);
	}
	/*神器累充 
	*/
	public shenqiData1: ShenQiData = new ShenQiData();
	public parseShenqi1(msg: Message) {
		this.shenqiData1.round = msg.getByte();
		this.shenqiData1.sum = msg.getInt();
		this.shenqiData1.isgoal = msg.getBoolean();
		this.shenqiData1.isreward = (msg.getByte() == 1);
	}

	/**
 * byte	第几轮
 * byte 当前该领取第几个奖励  0--无奖励  1 2 3
 */
	public parsedabiaoRank(msg: Message) {
		var dabiao_id = msg.getByte();
		this.blessTp = dabiao_id;
		this.dabiao_model = JsonModelManager.instance.getModeldabiaorewards()[dabiao_id];
	}
	//红装、四象、经脉、宠物、宝石
	public static DABIAO_TYPE_REDEQUIP: number = 10;	//红装
	public static DABIAO_TYPE_SIXIANG: number = 11;	//四象
	public static DABIAO_TYPE_MERIDIAN: number = 12;	//经脉
	public static DABIAO_TYPE_PET: number = 13;	//宠物
	public static DABIAO_TYPE_JEWEL: number = 14;	//宝石
	// public static DABIAO_TYPE_HORSE: number = 2;	//坐骑
	// public static DABIAO_TYPE_YUDI: number = 3;		//玉笛
	// public static DABIAO_TYPE_FABAO: number = 4;	//法宝
	// public static DABIAO_TYPE_REIN: number = 5;		//转生
	// public static DABIAO_TYPE_FIGHT: number = 6;	//战力
	// public static DABIAO_TYPE_CONSUME: number = 7;	//消费

	/**
	 * 刷新达标活动数据
	 */
	public refreshDabiaoData() {
		if (!this.dabiao_model) {
			return;
		}
		//玩家目标值
		// if (this.dabiao_reward == 1) {
		// 	this.dabiao_target = this.dabiao_model.mubiao1;
		// } else if (this.dabiao_reward == 2) {
		// 	this.dabiao_target = this.dabiao_model.mubiao2;
		// } else if (this.dabiao_reward == 3) {
		// 	this.dabiao_target = this.dabiao_model.mubiao3;
		// } else {
		// 	this.dabiao_target = -1;
		// }
		var i: number = 1;
		while (this.dabiao_model['mubiao' + i]) {
			if (this.dabiao_reward[i - 1] == 0) {
				this.dabiao_target = this.dabiao_model['mubiao' + i];
				break;
			}
			i++;
		}

		//玩家当前值
		var playerData: PlayerData = DataManager.getInstance().playerManager.player.getPlayerData(0);
		// this.dabiao_value = playerData.blessinfos[this.dabiao_model.type].grade;
		switch (this.dabiao_model.type) {
			case NewactivitysManager.DABIAO_TYPE_REDEQUIP:
				this.dabiao_value = playerData.seniorEquipsPower + playerData.qihunPower;
				break;
			case NewactivitysManager.DABIAO_TYPE_SIXIANG:
				this.dabiao_value = playerData.fourinagesPower;
				break;
			case NewactivitysManager.DABIAO_TYPE_MERIDIAN:
				this.dabiao_value = DataManager.getInstance().pulseManager.pulsePower();
				break;
			case NewactivitysManager.DABIAO_TYPE_PET:
				this.dabiao_value = DataManager.getInstance().petManager.power;
				break;
			case NewactivitysManager.DABIAO_TYPE_JEWEL:
				this.dabiao_value = DataManager.getInstance().forgeManager.getRoleGemPower();
				break;
			default:
				this.dabiao_value = playerData.blessinfos[this.dabiao_model.type].grade;
				break;
		}

		// switch (this.dabiao_model.type) {
		// 	case NewactivitysManager.DABIAO_TYPE_JEWEL:
		// 		//宝石总等级
		// 		var total: number = 0;
		// 		for (var i = 0; i < player.playerDatas.length; i++) {
		// 			var pd: PlayerData = player.playerDatas[i];
		// 			total += pd.getGemTotalLv();
		// 		}
		// 		this.dabiao_value.push(total);
		// 		break;
		// 	case NewactivitysManager.DABIAO_TYPE_HORSE:
		// 		//坐骑总战力
		// 		var total: number = 0;
		// 		for (var i = 0; i < player.playerDatas.length; i++) {
		// 			var pd: PlayerData = player.playerDatas[i];
		// 			total += pd.getBlessFightingByType(BLESS_TYPE.HORSE);
		// 		}
		// 		this.dabiao_value.push(total);
		// 		break;
		// 	case NewactivitysManager.DABIAO_TYPE_YUDI:
		// 		//玉笛总等级
		// 		var total: number = 0;
		// 		// for (var i = 0; i < player.playerDatas.length; i++) {
		// 		// 	var pd: PlayerData = player.playerDatas[i];
		// 		// 	total += pd.fourinages[1];
		// 		// }
		// 		this.dabiao_value.push(total);
		// 		break;
		// 	case NewactivitysManager.DABIAO_TYPE_FABAO:
		// 		//法宝阶数星级
		// 		this.dabiao_value.push(player.magicTier * 10 + player.magicTierStar);
		// 		break;
		// 	case NewactivitysManager.DABIAO_TYPE_REIN:
		// 		//转生
		// 		this.dabiao_value.push(player.rebirthLv);
		// 		//等级
		// 		this.dabiao_value.push(player.level);
		// 		if (this.dabiao_target != -1) {
		// 			var limitLevelObj = GameCommon.getInstance().getLimitLevelObj(this.dabiao_target);
		// 			this.dabiao_target = limitLevelObj.zsLevel;
		// 		}
		// 		break;
		// 	case NewactivitysManager.DABIAO_TYPE_FIGHT:
		// 		//战力
		// 		this.dabiao_value.push(player.playerTotalPower);
		// 		break;
		// 	case NewactivitysManager.DABIAO_TYPE_CONSUME:
		// 		//消费元宝
		// 		// this.dabiao_value.push(player.playerTotalPower);
		// 		break;
		// }
	}

	// /**获取达标是否可领取 */
	// public isDabiaoReward(): boolean {

	// 	if (this.dabiao_target == -1)
	// 		return false;
	// 	return this.dabiao_value[0] >= this.dabiao_target;
	// }

	public parseyueka(msg: Message) {
		if (this.activityfuliarr.indexOf(1) == -1) {
			this.activityfuliarr.push(1);
		} else {

		}
	}
	/**170  摇钱树摇钱
	上行：无
	下行：short  摇了多少次
			int    产出多少金币


	171     摇钱树领奖
	上行：byte  第几个
	下行：byte  第几个

	张嘎 2017/3/30 18:07:46
	1000消息
	short   摇钱树摇了多少次
	byte   领奖长度
	循环读取   byte  第几个 */
	public parseyaoqianshu(msg: Message) {
		if (this.activityfuliarr.indexOf(0) == -1) {
			this.activityfuliarr.push(0);
		} else {

		}
		// if (this.activityfuliarr.indexOf(1) == -1) {
		// 	this.activityfuliarr.push(1);
		// } else {

		// }

		this.yaoqian1000.yaoqianshuindex = msg.getShort();
		var len: number = msg.getByte();
		for (var i = 0; i < len; i++) {
			this.yaoqian1000.lingjiangarr.push(msg.getByte());
		}
	}
	/**170  摇钱树摇钱
	上行：无
	下行：short  摇了多少次
          int    产出多少金币 */
	public yaoqianshuyaoqian(msg: Message) {
		this.yaoqian1000.yaoqianshuindex = msg.getShort();
		var duoshao: number = msg.getInt();
		this.yaoqianshuBoom = msg.getByte();
	}
	public parseyaoqianlingjiang(msg: Message) {
		this.yaoqian170 = new YaoqianshuYaoqian
		this.yaoqian170.yaoqianindex = msg.getShort();
		this.yaoqian170.chanchu = msg.getInt();
		this.yaoqian1000.yaoqianshuindex = this.yaoqian170.yaoqianindex;
	}
	public parseyaoqianshulingjiang(msg: Message) {
		var num: number = msg.getByte();
		this.yaoqian1000.lingjiangarr.push(num);
	}
	public parseQianbeiMessage(msg: Message): void {
		this.qianbei_record = {};
		var id: number;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			id = msg.getByte();
			this.qianbei_record[id] = id;
		}
	}
	public get itemid(): number {
		return this._id;
	}
	public set itemid($id: number) {
		this._id = $id;
	}
	public parseBuyMessage(msg: Message) {
		var id: number = msg.getByte();
		this._id = id;
		this.record[id] = id;
	}
	public parseBuyxiangouMessage(msg: Message) {
		var id: number = msg.getByte();
		var geshu: number = msg.getShort();
		this.xiangou[id] = [id, geshu];

	}
	public parseBuyVipxiangouMessage(msg: Message) {
		var id: number = msg.getByte();
		var geshu: number = msg.getShort();
		this.vipxiangou[id] = [id, geshu];

	}
	public parseBuyzhizunxiangouMessage(msg: Message) {
		this.zhizunxiangouArr = [];
		var id: number = msg.getByte();
		var num: number = msg.getShort();
		this.zhizunxiangouArr.push(id);
		this.zhizunxiangouArr.push(num);
		this.zhizunxiangou[id] = this.zhizunxiangouArr;
	}

	public parseBuychongjiMessage(msg: Message) {
		var id: number = msg.getByte();
		var geshu: number = msg.getShort();
		this.chongji[id] = [id, geshu];

	}
	/**
	 * 当前领取到第几个
	 */
	public parseBuydabiaoMessage(msg: Message) {
		var size: number = msg.getByte();
		for (var i = 0; i < size; i++) {
			this.dabiao_reward[i] = msg.getByte();
		}
	}
	public parsedabiaopaihangMessage(msg: Message) {
		var arr = [];

		var a = msg.getInt();
		var len: number = msg.getByte();
		for (var i = 0; i < len; i++) {
			var itemarr = [];
			itemarr.push(msg.getByte());//rank
			itemarr.push(msg.getInt()); //id
			itemarr.push(msg.getString());//name
			itemarr.push(msg.getByte());//vip
			itemarr.push(msg.getInt());//value1
			itemarr.push(msg.getInt());//value2
			arr.push(itemarr);
		}
		this.dabiao_ranks = arr;
	}

	public getMyRank(id): number {
		for (var key in this.dabiao_ranks) {
			var itemarr = this.dabiao_ranks[key];
			if (itemarr[1] == id) {
				return itemarr[0];
			}
		}
		return -1;
	}

	public parseSignEveryDay(msg: Message) {
		this.signId = msg.getByte();
		for (var i = 0; i < 3; i++) {
			this.signRewards[i] = msg.getByte(); //三个领取的状态
		}
		this.payToday = msg.getByte() == 1;
	}

	public parseLogonAdd(msg: Message) {
		this.loginDay = msg.getShort(); //用于计算的数
		this.loginRewardDay = msg.getByte(); //已经领取的次数
		this.currLoginMode = null;
		var models: Modeldenglu2[] = JsonModelManager.instance.getModeldenglu2();
		for (var key in models) {
			var model = models[key];
			if (model.days > this.loginRewardDay) {
				this.currLoginMode = model;
				break;
			}
		}
	}

	public parseLogonLimit(msg: Message) {
		this.limitLoginDay = msg.getShort(); //用于计算的数
		var size = msg.getByte();
		for (var i = 0; i < size; i++) {
			this.limitLoginRewardDay[i] = msg.getByte(); //已经领取的次数
		}
	}

	public chongbangLiBaoId: number;
	public parseChongBang(msg: Message) {
		this.chongbangLiBaoId = msg.getByte();
		this.chargeMoneyNum = msg.getInt();
	}

	public parseXianFeng(msg: Message) {
		var size = msg.getShort();
		for (var i = 0; i < size; i++) {
			this.xianfengReward[i] = msg.getByte();
		}
	}

	/**限购礼包  消息
byte    当前轮次
byte    已经购买的长度
循环读取   byte    id
			short   已购买个数 */
	public parsevipxiangou(msg: Message) {
		if (this.activityarr.indexOf(1) == -1) {
			this.activityarr.push(1);
		} else {

		}
		this.vipxiangou = {};
		msg.getByte()
		// var day: number = msg.getByte();
		// this.activitysday = day;

		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			this.vipxiangouarr = [];
			var id: number = msg.getByte();
			var num: number = msg.getShort();
			this.vipxiangouarr.push(id);
			this.vipxiangouarr.push(num);
			this.vipxiangou[id] = this.vipxiangouarr;
		}

	}

	//================各种红点判定
	public checkRedPointForTarget(): boolean {
		if (this.dabiao_model) {
			for (var i = 0; i < this.dabiao_reward.length; i++) {
				if (this.dabiao_reward[i] == 0 && this.dabiao_model['mubiao' + (i + 1)] <= this.dabiao_value) {
					return true;
				}
			}
		}
		return false;
	}

	public checkRedPointForCoatard(): boolean {
		// var models: Modellevel2coatardLv[] = JsonModelManager.instance.getModellevel2coatardLv();
		// for (var key in models) {
		// 	if (models[key].rewards && models[key].rewards.length > 0) {
		// 		var model: Modellevel2coatardLv = models[key];
		// 		if (!DataManager.getInstance().playerManager.getCoatardRewardStatus(model.coatardLv - 1) &&
		// 			model.coatardLv <= DataManager.getInstance().playerManager.player.getPlayerData(0).coatardLv) {
		// 			return true;
		// 		}
		// 	}
		// }
		return false;
	}

	public checkRedPointForSign(): boolean {
		for (var i = 0; i < this.signRewards.length; i++) {
			if (this.signRewards[i] == 0) {
				if (i == 0) {
					return true;
				} else if (i == 1 && DataManager.getInstance().playerManager.player.viplevel > 0) {
					return true;
				} else if (i == 2 && this.payToday) {
					return true;
				}
			}
		}
		return false;
	}

	public checkRedPointForYao1000(): boolean {
		if (this.yaoqian1000.lingjiangarr) {
			if (this.yaoqian1000.lingjiangarr.indexOf(2) != -1) {
				return false;
			} else if (this.yaoqian1000.lingjiangarr.indexOf(1) != -1) {
				return this.yaoqian1000.yaoqianshuindex >= 50;
			} else if (this.yaoqian1000.lingjiangarr.indexOf(0) != -1) {
				return this.yaoqian1000.yaoqianshuindex >= 20;
			} else {
				return this.yaoqian1000.yaoqianshuindex >= 5;
			}
		}
	}

	public checkRedPointForXiangou(): boolean {
		var xiangoumodel = JsonModelManager.instance.getModelxiangoulibao();
		for (var key in xiangoumodel) {
			var model: Modelxiangoulibao = xiangoumodel[key];
			if (model.round == this.activitysday) {//天数
				var moneynum = GameCommon.getInstance().onParseAwardItemstr(model.price);
				var index: number = 0;
				if (this.xiangoudate[model.id]) {
					index = this.xiangoudate[model.id][1];
					if (index < model.max) {
						if (DataManager.getInstance().playerManager.player.getICurrency(moneynum[0].type) >= moneynum[0].num) {
							return true;
						}
					}
				} else {
					if (DataManager.getInstance().playerManager.player.viplevel >= model.vip) {
						if (DataManager.getInstance().playerManager.player.getICurrency(moneynum[0].type) >= moneynum[0].num) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	public checkRedPointForXianfeng(): boolean {
		var models = JsonModelManager.instance.getModelguanqiaxianfeng();
		for (var key in models) {
			var model: Modelguanqiaxianfeng = models[key];
			if (DataManager.getInstance().newactivitysManager.xianfengReward[model.id - 1] == 0 &&
				model.mapId <= GameFight.getInstance().yewai_waveIndex) {
				return true;
			}
		}
		return false;
	}

	public checkRedPointForSign8(): boolean {
		var models = JsonModelManager.instance.getModeldenglu();
		var idx = 0;
		for (var key in models) {
			var model: Modeldenglu = models[key];
			if (model.days <= this.limitLoginDay) {
				if (this.limitLoginRewardDay[idx] == 0) {
					return true;
				}
			}
			idx++;
		}
		return false;
	}

	public checkRedPointForFund(): boolean {
		if (!DataManager.getInstance().investManager.fundBuy) return false;

		var models: Modelfund = JsonModelManager.instance.getModelfund();
		var fundArray: number[] = DataManager.getInstance().investManager.fundReward;
		var item: FundItem;
		var model: Modelfund;
		for (var key in models) {
			model = models[key];
			if (DataManager.getInstance().playerManager.player.getPlayerData(0).coatardLv >= model.id && fundArray[model.id - 2] == 0) {
				return true;
			}
		}
		return false;
	}
}
/**1000消息
short   摇钱树摇了多少次
byte   领奖长度
循环读取   byte  第几个 */
class Yaoqianshuinit {
	/**摇了多少次 */
	yaoqianshuindex: number = 0;

	lingjiangarr: number[];
}
/**170  摇钱树摇钱
上行：无
下行：short  摇了多少次
          int    产出多少金币*/
class YaoqianshuYaoqian {
	yaoqianindex: number;

	chanchu: number;
}
/**171     摇钱树领奖
上行：byte  第几个
下行：byte  第几个 */


class ShenQiData {
	round: number;
	sum: number;
	isgoal: boolean;
	isreward: boolean = false;
}
