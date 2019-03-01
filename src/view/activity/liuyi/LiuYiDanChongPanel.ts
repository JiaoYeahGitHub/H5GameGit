class LiuYiDanChongPanel extends BaseTabView {
	private box: eui.Group;
	private timeLab: eui.Label;
	private goods: GoodsInstance;
	private itemGroup: eui.List;
	private index: number;
	private toDayMoney: eui.Label;
	private leichongDesc: eui.Image;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LiuYiDanChongSkin;
		// this.setTitle('kaifuleichong_title_png')
	}
	protected onInit(): void {
		super.onInit();
		this.itemGroup.itemRenderer = ActivityDanChongItem;
		this.itemGroup.itemRendererSkinName = skins.LiuYiDanChongItemSkin;
		this.itemGroup.useVirtualLayout = true;
		this.index = 1;
		this.timeLab.text = 0 + "天" + "" + 0 + "时" + 0 + "分" + 0 + "";
		this.onRefresh();
	}
	protected onRefresh() {
		this.onShowAward();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onShowAward, this);
		// GameDispatcher.getInstance().addEventListener(GameEvent.LIEMING_EQUIP.toString(), this.onEquipSend, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onShowAward, this);
		// GameDispatcher.getInstance().removeEventListener(GameEvent.LIEMING_EQUIP.toString(), this.onEquipSend, this);
		this.examineCD(false);
	}
	private onShowAward(): void {
		// this.leichongDesc.source = 'leichongDesc'+this.index+'_png';
		this.itemGroup.dataProvider = new eui.ArrayCollection(this.models);
		this.showdate();
	}
	//获取对应标签的数据结构
	private rewardArr: Array<Modeldanbichongzhi> = new Array<Modeldanbichongzhi>();
	private get models(): Modeldanbichongzhi[] {
		this.rewardArr = [];
		var kaifuArrs = JsonModelManager.instance.getModeldanbichongzhi()
		for (let k in kaifuArrs) {
			if (kaifuArrs[k].round == DataManager.getInstance().festivalDanChongManager.day) {
				var awards: AwardItem[];

				// for (var i = 1; i < 6; i++) {
				// awards = GameCommon.getInstance().onParseAwardItemstr(kaifuArrs[k]['reward'+i]) 
				// var leiChongItem :OpenServerLeiChongItemData = new OpenServerLeiChongItemData(awards,kaifuArrs[k].gold/10,i,DataManager.getInstance().openServerLeiChongManager.allMoney[kaifuArrs[k].id-1]);
				this.rewardArr.push(kaifuArrs[k]);
				// }
			}
		}
		return this.rewardArr;
	}
	private showdate() {
		// this.toDayMoney.text = '今日已累计充值:' + DataManager.getInstance().openServerLeiChongManager.todayMoney;
		// var itemarr: AwardItem[] = this.rewardArr[this.rewardArr.length - 1].awardItem;
		// while (this.box.numChildren > 0) {
		// 	let display = this.box.getChildAt(0);
		// 	this.box.removeChild(display);
		// }
		// for (var i = 0; i < 1; i++) {
		// 	this.goods = new GoodsInstance();
		// 	this.goods.onUpdate(itemarr[i].type, itemarr[i].id, 0, itemarr[i].quality, itemarr[i].num);
		// 	this.goods.item_frame.source = "welfare_frame_png";
		// 	this.box.addChild(this.goods);
		// }
		//for()
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.LIUYIACTIVITDANCHONG);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
}
// class OpenServerLeiChongItemData{
// 	public awardItem: AwardItem[];
// 	public moneyNum:number;
// 	public day:number;
// 	public curMoey:number;
// 	public constructor(cfg: AwardItem[],num:number,day:number,curMoney:number) {
// 		this.awardItem = cfg;
//         this.moneyNum = num;
// 		this.day = day;
// 		this.curMoey = curMoney;
// 	}
// }
class ActivityDanChongItem extends BaseListItem {
	private name_label: eui.Label;
	private awards: eui.Group;
	private btn_reward: eui.Button;
	constructor() {
		super();
	}
	protected onInit(): void {
		this.touchEnabled = false;
		this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	protected onUpdate(): void {
		if (this.data) {
			if (this.data) {
				while (this.awards.numChildren > 0) {
					let display = this.awards.getChildAt(0);
					this.awards.removeChild(display);
				}
				// this.name_label.text = '单笔'+(this.data.day)+'天充值'+(this.data.moneyNum)+'元,可获得';
				if (DataManager.getInstance().festivalDanChongManager.record[this.data.num - 1] == 1) {
					this.btn_reward.label = '已达标';
					this.btn_reward.enabled = false;
				} else {
					this.btn_reward.label = '单笔' + this.data.rmb + '元';
					// this.btn_reward.label = '去充值';
					this.btn_reward.enabled = true;
				}
				var rewards: AwardItem[] = this.data.rewards;
				for (var i: number = 0; i < rewards.length; i++) {
					var goodsItem: GoodsInstance = new GoodsInstance();
					var awardItem: AwardItem = rewards[i];
					goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
					this.awards.addChild(goodsItem);
				}
			}
		}
	}
	private onTouch(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}
}