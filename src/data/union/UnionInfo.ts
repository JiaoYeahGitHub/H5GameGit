//帮会信息结构
class UnionInfo {
	public id: number;//帮会ID
	public name: string = "";//帮会名称
	public level: number = 0;//帮会等级
	public badgesIndex: number = 0;//帮会标识编号 颜色编号*颜色总数+图标编号 编号从0开始 资源从1开始
	public memberCount: number = 0;//成员数量
	public applyLevel: number = 0;//申请等级限制
	public xuanyan: string = "";//帮会宣言
	public wangName: string = "";//帮主名字
	public rebirthLv: number = 0;

	public constructor() {
	}

	public parseMsg(msg: Message): void {
		this.id = msg.getInt();
		this.name = msg.getString();
		this.wangName = msg.getString();
		this.level = msg.getShort();
		this.badgesIndex = msg.getByte();
		this.memberCount = msg.getShort();
		this.xuanyan = msg.getString();
		this.applyLevel = msg.getShort();
	}
	//The end
}
//帮会成员结构
class UnionMemberInfo {
	public playerdata: SimplePlayerData;
	public postion: number;//1帮主2副帮主3长老4护法5帮众
	public donate: number;//贡献值
	public offLineTime: number = 0;//离线时间
	public receiveSize: number = 0;
	public receiveId: number[];
	public receiveNum: number[];
	public constructor() {
		this.playerdata = new SimplePlayerData();
		this.receiveId = [];
		this.receiveNum = [];
	}

	public parseMsg(msg: Message): void {
		this.playerdata.parseMsg(msg);
		this.postion = msg.getByte();
		this.donate = msg.getInt();
		this.offLineTime = msg.getInt();
		this.receiveSize = msg.getByte();
		if (this.receiveSize > 0) {
			for (var i: number = 0; i < this.receiveSize; i++) {
				this.receiveId[i] = msg.getShort();
				this.receiveNum[this.receiveId[i]] = msg.getShort();
			}
		}
	}
}
//我的帮会信息结果
class MyUnionData {
	public info: UnionInfo;//我的帮会信息
	public selfData: UnionMemberInfo;//我的帮会职位信息
	public unionExp: number;//帮会经验
	public noticeStr: string = "";//工会公告
	public autoAdopt: boolean;//是否自动通过申请
	public tributeNum: number = 0;//帮会上香id
	public tributeVipNum: number = 0;//VIP上香次数
	public unionMemberList: UnionMemberInfo[];
	public turnplateNum: number = 0;
	public isImpeachment: number = 0;

	public constructor() {
		this.info = new UnionInfo();
		this.unionMemberList = [];
	}
	//解析帮会信息
	public parseMsg(msg: Message): void {
		this.info.id = msg.getInt();
		this.info.name = msg.getString();
		this.info.wangName = msg.getString();
		this.info.level = msg.getShort();
		this.unionExp = msg.getInt();
		this.info.badgesIndex = msg.getByte();
		this.info.memberCount = msg.getShort();
		this.info.xuanyan = msg.getString();
		this.noticeStr = msg.getString();
		this.info.applyLevel = msg.getShort();
		this.autoAdopt = msg.getBoolean();
		this.tributeNum = msg.getByte();
		this.tributeVipNum = msg.getByte();
		this.turnplateNum = msg.getByte();
	}
	//解析帮会成员列表
	public parseMemberList(msg: Message): void {
		for (var i: number = this.unionMemberList.length - 1; i >= 0; i--) {
			this.unionMemberList[i] = null;
			this.unionMemberList.splice(i, 1);
		}
		var membersize: number = msg.getShort();
		for (var i: number = 0; i < membersize; i++) {
			var memberInfo: UnionMemberInfo = new UnionMemberInfo();
			memberInfo.parseMsg(msg);
			this.unionMemberList.push(memberInfo);
			if (memberInfo.playerdata.id == DataManager.getInstance().playerManager.player.id) {
				this.selfData = memberInfo;
			}
		}
		this.isImpeachment = msg.getByte();
	}

	//修改帮众仓库分配数量
	// public parseMemberWarehouseNum(playerid: number, itemId: number,itemNum): void {
	// 	for (var i: number = this.unionMemberList.length - 1; i >= 0; i--) {
	// 		var memberinfo: UnionMemberInfo = this.unionMemberList[i];
	// 		if (memberinfo.playerdata.id == playerid) {
	// 			memberinfo.receiveId = itemId;

	// 			break;

	// 		}
	// 	}
	// }
	//修改某一成员职位
	public parseMemberPostion(playerid: number, postion: number): void {
		for (var i: number = this.unionMemberList.length - 1; i >= 0; i--) {
			var memberinfo: UnionMemberInfo = this.unionMemberList[i];
			if (memberinfo.playerdata.id == playerid) {
				memberinfo.postion = postion;
				break;
			}
		}
	}
	//删除某一位成员
	public onDeleteMember(playerid: number): string {
		for (var i: number = this.unionMemberList.length - 1; i >= 0; i--) {
			var memberinfo: UnionMemberInfo = this.unionMemberList[i];
			if (memberinfo.playerdata.id == playerid) {
				var playerName: string = memberinfo.playerdata.name;
				memberinfo = null;
				this.unionMemberList.splice(i, 1);
				return playerName;
			}
		}
		return "";
	}
	//获取帮会等级数据
	public getUnionLevelModel(): ModelguildLv {
		return JsonModelManager.instance.getModelguildLv()[this.info.level - 1];
	}
	//增加帮会经验
	public addUnionExp(expValue: number): void {
		var unionlevelModel: ModelguildLv = this.getUnionLevelModel();
		this.unionExp += expValue;
		if (unionlevelModel.exp <= this.unionExp && JsonModelManager.instance.getModelguildLv()[this.info.level]) {
			this.info.level = this.info.level + 1;
			this.unionExp = this.unionExp - unionlevelModel.exp;
		}
	}
	//销毁对象
	public onDestroy(): void {
		for (var i: number = this.unionMemberList.length - 1; i >= 0; i--) {
			this.unionMemberList[i] = null;
			this.unionMemberList.splice(i, 1);
		}
		this.unionMemberList = null;
		this.info = null;
		this.selfData = null;
		this.unionExp = null;
		this.noticeStr = null;
		this.autoAdopt = null;
	}
	//The end
}