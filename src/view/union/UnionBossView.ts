class UnionBossView extends BaseTabView {
	private boss_name_lab: eui.Label;
	private reborn_time_lab: eui.Label;
	private belongers_lab: eui.Label;
	private boss_hp_probar: eui.ProgressBar;
	private challenge_btn: eui.Button;
	private reward_grp: eui.Group;
	// private unopne_desc_lab: eui.Label;
	// private fight_info_grp: eui.Group;
	private boss_avatar_grp: eui.Group;
	private bossAnim: BodyAnimation;
	private selectIndex: number;
	private tabs: eui.RadioButton[];
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionBossViewSkin;
	}
	protected onInit(): void {
		// (this['tab' + 0] as eui.RadioButton).selected = true;
		this.selectIndex = 0;
		this.tabs = [];
		for(let i = 0; i < 6; ++i){
			let unionbossItem: ModelguildBoss = this.models[i];
			this.tabs[i] = this['tab' + i];
			this.tabs[i].name = i.toString();
			this.tabs[i].label = unionbossItem.name;
		}
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onRequetBossInfoMsg();
	}
	protected onRegist(): void {
		super.onRegist();
		for (var i: number = 0; i < this.tabs.length; i++) {
			this.tabs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
		this.challenge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BOSS_INFO_MESSAGE.toString(), this.onReciveBossInfoMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BOSS_LIST_MESSAGE.toString(), this.onReciveBossListMsg, this);
		this.onchangeTab(0);
	}
	protected onRemove(): void {
		for (var i: number = 0; i < this.tabs.length; i++) {
			this.tabs[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
		Tool.removeTimer(this.refreshTimeDown, this, 1000);
		this.challenge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BOSS_INFO_MESSAGE.toString(), this.onReciveBossInfoMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BOSS_LIST_MESSAGE.toString(), this.onReciveBossListMsg, this);
		this.isRequst = false;
		// if (this.selectIndex) {
		// 	this.tabs[this.selectIndex].selected = false;
		// 	this.tabs[0].selected = true;
		// }
		// this.selectIndex = 0;
	}
	private onChallenge(): void {
		GameFight.getInstance().onEnterUnionBossScene(this.curBossInfo.id)
	}
	private onTouchTab(event: egret.Event): void {
		let idx = parseInt(event.currentTarget.name);
		if (this.selectIndex != idx) {
			this.onchangeTab(idx);
			this.runTimerDown();
		}
	}
	//计时器
	private runTimerDown(): void {
		// let info: XuezhanBossInfo = DataManager.getInstance().dupManager.allpeoplebossData.xuezhanInfos[this.selectIndex];
		// if (info && info.rebirthTime > 0) {
		// 	this.reborn_time_lab.text = Language.instance.getText('fuhuoshijian') + "：" + Tool.getTimeStr(info.rebirthTime);
		// } else if (this.reborn_time_lab.text != '') {
		// 	this.reborn_time_lab.text = '';
		// 	this.onUpdateStatus();
		// }
	}
	private curBossInfo: ModelguildBoss;
	private onchangeTab(index: number): void {
		this.tabs[this.selectIndex].selected = false;
		this.tabs[index].selected = true;
		this.selectIndex = index;
		this.curBossInfo = this.models[index];
		let info: XuezhanBossInfo = DataManager.getInstance().dupManager.allpeoplebossData.xuezhanInfos[index];
		let modelfighter: Modelfighter = ModelManager.getInstance().getModelFigher(this.curBossInfo.bossId);
		this.boss_name_lab.text = this.curBossInfo.name;
		this.belongers_lab.text = '挑战次数:' + DataManager.getInstance().unionManager.unionbossCount;
		// this.belongers_lab.text = Language.instance.getText('dangqianguishuzhe', '：', (info.guishuName ? info.guishuName : 'zanwu'));
		this.bossAnim = GameCommon.getInstance().getMonsterBody(this.bossAnim, this.curBossInfo.bossId);
		if (!this.bossAnim.parent) {
			this.boss_avatar_grp.addChild(this.bossAnim);
		}
		this.reward_grp.removeChildren();
		for (let i: number = 0; i < this.curBossInfo.rewards.length; i++) {
			let awarditem: AwardItem = this.curBossInfo.rewards[i];
			let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
			this.reward_grp.addChild(goodsinstance);
		}
		this.boss_hp_probar.maximum = modelfighter.hp;
		this.boss_hp_probar.minimum = modelfighter.hp;
		this.boss_hp_probar.value = 100;
		this.onUpdateStatus(this.models[index].unionBossStatus);
	}
	private onUpdateStatus(num: number) {
		Tool.removeTimer(this.refreshTimeDown, this);
		this.reborn_time_lab.text = '';
		switch (num) {
			case UNION_BOSS_STATUS.REBORN:
				this.challenge_btn.label = "挑战";
				this.challenge_btn.enabled = true;
				break;
			case UNION_BOSS_STATUS.FIGTHING:
				break;
			case UNION_BOSS_STATUS.DEATH:
				this.challenge_btn.label = "等待刷新";
				this.challenge_btn.enabled = false;
				if (this.leftRefreshTime > 0) {
					Tool.addTimer(this.refreshTimeDown, this, 1000);
				}
				break;
			case UNION_BOSS_STATUS.CLOSE:
				this.challenge_btn.label = "未开启";
				this.challenge_btn.enabled = false;
				break;
		}
	}
	//获取对应标签的数据结构
	private guildBossArr: Array<ModelguildBoss> = new Array<ModelguildBoss>();
	private get models(): ModelguildBoss[] {
		var models: ModelguildBoss[];
		models = JsonModelManager.instance.getModelguildBoss();
		var i = 0;
		for (let k in models) {
			this.guildBossArr[i] = models[k]
			i = i + 1;
		}
		return this.guildBossArr;
	}
	/**请求BOSS数据**/
	private isRequst: boolean;
	private onRequetBossInfoMsg(): void {
		if (!this.isRequst) {
			this.isRequst = true;
			this.reborn_time_lab.text = '正在刷新';
			var bossinfoMsg: Message = new Message(MESSAGE_ID.UNION_BOSS_INFO_MESSAGE);
			GameCommon.getInstance().sendMsgToServer(bossinfoMsg);
		}
	}
	//返回BOSS信息协议
	private onReciveBossInfoMsg(): void {
		this.isRequst = false;
		// if (this.leftRefreshTime > 0) {
		// 	Tool.addTimer(this.refreshTimeDown, this, 1000);
		// }
		// this.reborn_time_lab.text = '复活时间：'+`${DataManager.getInstance().unionManager.unionbossCount}/${UnionDefine.Union_Boss_Max}`;
	}
	//返回Boss列表协议
	private onReciveBossListMsg(): void {
		if (!this.selectIndex) {
			this.onchangeTab(0);
		}
		else
			this.onchangeTab(this.selectIndex);
	}
	//计时器刷新
	private refreshTimeDown(): void {
		this.reborn_time_lab.text = '复活时间：' + GameCommon.getInstance().getTimeStrForSec2(this.leftRefreshTime, false);
		if (this.leftRefreshTime <= 0) {
			this.onRequetBossInfoMsg();
			Tool.removeTimer(this.refreshTimeDown, this, 1000);
		}
	}
	//获取当前剩余的刷新秒数
	private get leftRefreshTime(): number {
		return Math.floor((DataManager.getInstance().unionManager.unionbossTime - egret.getTimer()) / 1000);
	}
	//The end
}
class UnionBossItem extends eui.Component {
	public model: ModelguildBoss;
	private monsterIcon_img: eui.Image;
	private monster_name_label: eui.Label;
	private award_group: eui.Button;
	private btn_enter: eui.Button;
	private nanduImg: eui.Image;
	private isInit: boolean = true;
	public constructor(model: ModelguildBoss) {
		super();
		this.model = model;
		this.once(egret.Event.COMPLETE, this.onComplete, this);
		this.skinName = skins.UnionBossItemSkin;
	}
	private onComplete(): void {
		this.isInit = false;
		for (var i: number = 0; i < this.model.rewards.length; i++) {
			var rewardItem: AwardItem = this.model.rewards[i];
			var goodsInstace: GoodsInstance = new GoodsInstance();
			goodsInstace.onUpdate(rewardItem.type, rewardItem.id, 0, rewardItem.quality, rewardItem.num);
			this.award_group.addChild(goodsInstace);
		}
		this.dataChanged();
	}
	public dataChanged(): void {
		if (this.isInit)
			return;

		this.monsterIcon_img.source = this.model.icon;
		this.monster_name_label.text = this.model.name;
		this.nanduImg.source = `unionboss_nandu${this.model.nandu}_png`;
		var btnLabel: string = "";
		var enable: boolean = false;
		switch (this.model.unionBossStatus) {
			case UNION_BOSS_STATUS.REBORN:
				btnLabel = "挑战";
				enable = true;
				break;
			case UNION_BOSS_STATUS.FIGTHING:
				btnLabel = "正在被挑战";
				break;
			case UNION_BOSS_STATUS.DEATH:
				btnLabel = "等待刷新";
				break;
			case UNION_BOSS_STATUS.CLOSE:
				btnLabel = "未开启";
				break;
		}
		GameCommon.getInstance().onButtonEnable(this.btn_enter, enable);
		this.btn_enter.label = btnLabel;
	}
	public registTouchBtn(): void {
		this.btn_enter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChanllenge, this);
	}
	public removeTouchBtn(): void {
		this.btn_enter.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChanllenge, this);
	}
	private onChanllenge(): void {
		GameFight.getInstance().onEnterUnionBossScene(this.model.id);
	}
	//The end
}