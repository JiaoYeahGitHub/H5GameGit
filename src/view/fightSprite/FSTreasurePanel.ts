class FSTreasurePanel extends BaseTabView {
	private disc_outside: eui.Group;
	private disc_outside1: eui.Group;
	private disc_inside: eui.Group;
	private img_selected: eui.Image;
	private btn_turn: eui.Button;
	private label_points: eui.Label;
	private img_cons: eui.Image;
	private boxLayer: eui.Group;
	private isRun: boolean = false;
	private playLayer: eui.Group;
	private currHasNum: number = 0;
	private model: Modelfabaozhuanpan;
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.FSTreasurePanelSkin;
	}
	protected onInit(): void {
		var item: FSTreasureItem;
		for (var i: number = 0; i < 5; i++) {
			item = new FSTreasureItem(i);
			this.boxLayer.addChild(item);
		}
		this.model = JsonModelManager.instance.getModelfabaozhuanpan()[1];
		this.points[0].register(this.btn_turn, GameDefine.RED_BTN_POS, DataManager.getInstance().magicManager, "checkMagicTurnplatePoint");
		super.onInit();
		this.onRefresh();
		// this.isRun = false;
		// this.onRotateback();
		// this.disc_inside.rotation = 45 * 1;
		// this.disc_outside.rotation = 90 * 1;
		// this.disc_inside.rotation = this.disc_inside.rotation + 85;
		// this.disc_outside.rotation = this.disc_outside.rotation+45;
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_turn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_MAGIC_TURNPLATE_MESSAGE.toString(), this.onRotateback, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_turn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTurn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_MAGIC_TURNPLATE_MESSAGE.toString(), this.onRotateback, this);
		// this.disc_inside.rotation = 45 * DataManager.getInstance().magicManager.multipleIndex;
		// this.disc_outside.rotation = 90 * DataManager.getInstance().magicManager.numIndex;
	}
	protected onRefresh(): void {
		this.onShowTurnplate();
		
	}
	private onPlayDone() {
		// this.img_selected.visible = true;
		this.onShowAward();
	}
	private onShowAward(): void {
		var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.model.itme)
		var add: number = DataManager.getInstance().bagManager.getGoodsThingNumById(_rewards[0].id, _rewards[0].type) - this.currHasNum;
		if (add > 0) {
			var model = GameCommon.getInstance().getThingModel(_rewards[0].type, _rewards[0].id);
			GameCommon.getInstance().onGetThingAlert(model, add, GOODS_CHANGE_TYPE.DELAY_ADD);
		}
	}
	private onRotateback() {
		if (!this.isRun) {
			this.isRun = true;
			// this.img_selected.visible = false;
			var numIndex: number = DataManager.getInstance().magicManager.numIndex;
			Tool.log("`````````````````````````````````````````````````````````:" + numIndex);
			var multipleIndex: number = DataManager.getInstance().magicManager.multipleIndex;
			// var multipleIndex: number = Math.floor(Math.random() * 4);
			// var numIndex: number = Math.floor(Math.random() * 8);
			var RotationLong;
			RotationLong = this.getRotationLong(4, 5, 6, multipleIndex, -1);//获取总长度
			egret.Tween.get(this.disc_inside).to({ rotation: RotationLong }, 3000, egret.Ease.sineInOut).call(this.onPlayDone, this).wait(3000).call(this.onReady, this);
			RotationLong = this.getRotationLong(8, 1, 1,numIndex, -1);//获取总长度
			egret.Tween.get(this.disc_outside).to({ rotation: RotationLong }, 2000, egret.Ease.sineInOut)
			
		}
	}
	//获取总长度函数
	private getRotationLong(Scores, Qmin, Qmax, Location, direction: number = 1) {
		var _location = (360 / Scores) * Location * direction;//目标奖区的起始点
		var _q = 360 * (Math.floor(Math.random() * (Qmax - Qmin)) + Qmin) * direction;//整圈长度
		return _q + _location;
	}
	private onTouchBtnTurn(): void {
		if (this.isRun) return;
		// this.onRotateback();
		DataManager.getInstance().magicManager.onSendTurnplateMessage();
	}
	private onReady(): void {
		this.onRefresh();
	}
	private onShowTurnplate(): void {
		// this.img_selected.visible = false;
		var magic = DataManager.getInstance().magicManager;
		for (i = 0; i < 5; i++) {
			(this.boxLayer.getChildAt(i) as FSTreasureItem).onUpdate();
		}
		this.playLayer.visible = false;
		this.isRun = false;
		if (magic.turnMax <=magic.turnTime) return;
		var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(this.model.itme)
		this.currHasNum = DataManager.getInstance().bagManager.getGoodsThingNumById(_rewards[0].id, _rewards[0].type);
		this.playLayer.visible = true;
		var model: Modelfabaozhuanpan = JsonModelManager.instance.getModelfabaozhuanpan()[magic.turnTime + 1];
		var arr = model.multiply.split("#");
		var i: number;
		var param;
		for (i = 0; i < arr.length; i++) {
			param = arr[i].split(",");
			(this[`img_multiple${i}`] as eui.BitmapLabel).text =param[0];//`sw_bml_${param[0]}b_png`;
		}
		arr = model.num.split("#");
		i = 0; 
		
		var _rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.itme)
		var iconModel = GameCommon.getInstance().getThingModel(_rewards[0].type, _rewards[0].id);
		for (i = 0; i < arr.length; i++) {
			param = arr[i].split(",");
			(this[`img_icon${i}`] as eui.Image).source = iconModel.dropicon;
			(this[`label_num${i}`] as eui.BitmapLabel).text =param[0];
		}
		iconModel = GameCommon.getInstance().getThingModel(model.cost.type, model.cost.id);
		this.img_cons.source = iconModel.dropicon;
		this.label_points.text = model.cost.num.toString();
		var _has: number = DataManager.getInstance().playerManager.player.getICurrency(model.cost.type);
		if (_has < model.cost.num) {
			this.label_points.textColor = 0xFF0000;
		} else {
			this.label_points.textColor = 0xe9deb3;
		}
	}
	
}

class FSTreasureItem extends eui.Component {
	private _index: number;
	private img_box: eui.Image;
	private img_arrow: eui.Image;
	private icons: number[] = [0, 0, 1, 2, 3];
	public constructor(index: number) {
		super();
		this._index = index;
		this.skinName = skins.FSTreasureItemSkin;
	}
	public onUpdate() {
		var magic = DataManager.getInstance().magicManager;
		this.img_arrow.visible = this._index == magic.turnTime;
		if (this._index + 1 > magic.turnTime) {
			this.img_box.source = `cross_pveboss_box_unopen_png`;
		} else if (this._index + 1 <= magic.turnTime) {
			this.img_box.source = `cross_pveboss_box_open_png`;
		}
		// else if (this._index + 1 == magic.turnTime) {
		// 	this.img_box.source = `fs_selected${this.icons[this._index]}_png`;
		// } 
	}
}