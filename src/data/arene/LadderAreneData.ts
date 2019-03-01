class LadderAreneData {
	public scoreCount: number;
	public inspireCount: number = 0;//鼓舞次数
	public ladderStatus: number;//0是正在进行中 1是待开启中
	public statusTime: number = 0;//状态的剩余时间 秒
	public leftRelive: number = 0;//复活时间
	public wincount: number = 0;//连胜场次
	public heroHpNum: number = 0;//主角的血量
	public heroShieldNum: number = 0;//主角护盾值
	public heroRebornNum: number = 0;//主角的复活次数
	public fightCount: number;//剩余战斗次数
	public leftRecover: number;//剩余恢复战斗时间
	/**-----旧的-----**/
	public levelMax: number;//当前段位总级数
	public fightCountMax: number;//战斗场次上限
	public buyCount: number;//购买次数
	/**------------**/

	private _model: Modelttre;
	private _score: number;

	public constructor() {
	}

	public parseInitMsg(msg: Message): void {
		this.scoreCount = msg.getInt();
		this.inspireCount = msg.getInt();
		this.ladderStatus = msg.getByte();
		this.statusTime = msg.getInt() * 1000 + egret.getTimer();
		this.leftRelive = msg.getInt();
		this.leftRelive = (this.leftRelive - 1) * 1000 + egret.getTimer();
		this.wincount = msg.getInt();
		this.heroHpNum = msg.getLong();
		this.heroShieldNum = msg.getLong();
		this.heroRebornNum = msg.getByte();
		this.fightCount = msg.getByte();
		this.leftRecover = msg.getShort();
		this.leftRecover = (this.leftRecover - 1) * 1000 + egret.getTimer();

		this.onUpdateScore();
	}

	public onUpdateScore(): void {
		let count_score: number = 0;
		this._score = this.scoreCount;
		let laddermodels = JsonModelManager.instance.getModelttre();
		let model: Modelttre;
		for (let idx in laddermodels) {
			model = laddermodels[idx];
			count_score = model.maxjifen;
			if (count_score > this.scoreCount) {
				this._model = model;
				break;
			}
		}
	}

	public get model(): Modelttre {
		return this._model;
	}

	public get score(): number {
		return this._score;
	}
	//The end
}
enum LADDER_GRADE {
	Bronze = 1,//青铜
	Silver = 2,//白银
	Gold = 3,//黄金
	Diamond = 4,//钻石
}