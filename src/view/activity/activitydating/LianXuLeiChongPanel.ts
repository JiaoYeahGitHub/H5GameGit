class LianXuLeiChongPanel extends BaseWindowPanel {
	private box: eui.Group;
	private timeLab: eui.Label;
	private goods: GoodsInstance;
	private itemGroup: eui.List;
	private index: number;
	private toDayMoney: eui.Label;
	private leichongDesc:eui.Image;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LianXuLeiChongSkin;
		this.setTitle('lianchongTitle_png')
	}
	protected onInit(): void {
		super.onInit();
		this.itemGroup.itemRenderer = ActivityLeiChongItem;
		this.itemGroup.itemRendererSkinName = skins.ActivityLeiChongItemSkin;
		this.itemGroup.useVirtualLayout = true;
		this.index = 1;
		this['tab1'].source = 'leiChong_buttonon_png';
		this.timeLab.text = 0 + "天" + "" + 0 + "时" + 0 + "分" + 0 + "";
		
		this.onRefresh();
	}
	protected onRefresh() {
		this.onShowAward();
	}
	protected onRegist(): void {
		super.onRegist();
		for (var i = 1; i < 4; i++) {
			this['tabBtn' + i].name = i;
			this['tabBtn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
		}

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
	private btns = [300, 2000, 5000]
	private onShowAward(): void {
			this.leichongDesc.source = 'leichongDesc'+this.index+'1_png';
		this.itemGroup.dataProvider = new eui.ArrayCollection(this.models);
		this.showdate();
	}
	private onTab(event: egret.Event): void {
		var name: number = Number(event.target.name);
		if (this.index == name)
			return;
		for (var i = 1; i < 4; i++) {
			this['tab' + i].source = 'leiChong_buttonoff_png';
		}
		this.index = name;
		this['tab' + this.index].source = 'leiChong_buttonon_png';
		this.onShowAward();
	}
	//获取对应标签的数据结构
	private rewardArr: Array<OpenServerLeiChongItemData> = new Array<OpenServerLeiChongItemData>();
	private get models(): OpenServerLeiChongItemData[] {
		this.rewardArr = [];
		var kaifuArrs = JsonModelManager.instance.getModellianxuleichong()
		for (let k in kaifuArrs) {
			if (kaifuArrs[k].gold == this.btns[this.index - 1]) {
				var awards: AwardItem[];
					for (var i = 1; i < 6; i++) {
					awards = GameCommon.getInstance().onParseAwardItemstr(kaifuArrs[k]['reward'+i]) 
					var leiChongItem :OpenServerLeiChongItemData = new OpenServerLeiChongItemData(awards,kaifuArrs[k].gold/10,i,DataManager.getInstance().lianxuChongManager.allMoney[kaifuArrs[k].id-1]);
					this.rewardArr.push(leiChongItem)	
					}
			}
		}
		return this.rewardArr;
	}
	private showdate() {
		this.toDayMoney.text = '今日已累计充值:' + DataManager.getInstance().lianxuChongManager.todayMoney;
		var itemarr: AwardItem[] = this.rewardArr[this.rewardArr.length - 1].awardItem;
		while (this.box.numChildren > 0) {
			let display = this.box.getChildAt(0);
			this.box.removeChild(display);
		}
		for (var i = 0; i < 1; i++) {
			this.goods = new GoodsInstance();
			this.goods.onUpdate(itemarr[i].type, itemarr[i].id, 0, itemarr[i].quality, itemarr[i].num);
			this.goods.item_frame.source = "welfare_frame_png";
			this.box.addChild(this.goods);
		}
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
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.LIANXU_LEICHONG);
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