class MagicZiZhiDan extends BaseWindowPanel {
	private currency: ConsumeBar;
	private powerBar: PowerBar;
	private skillLv: eui.Label;
	private skillName: eui.Label;
	private upBtn: eui.Button;
	private blessType: number = 0;
	private curPro: eui.Label;
	private nextPro: eui.Label;
	private closeBtn1: eui.Button;
	private label_points: eui.Label;
	private consumItem: ConsumeBar;
	private avatar_grp: eui.Group;
	private titleName: eui.Label;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MagicZiZhiDanSkin;
	}
	protected onInit(): void {
		super.onInit();

		this.onRefresh();


	}
	// private onLoadComplete(): void {
	//     this.onloadComp = true;
	//     // if(this.onsetParam){
	//     //     this.onUpdate(this.param);
	//     // }
	//     this.onRegist();
	// }
	private models: ModelmountDan;
	public onShowWithParam(param): void {
		// this.allotParam = param as UnionAllotParam1;
		this.blessType = param;
		var models: ModelmountDan[];
		models = JsonModelManager.instance.getModelmountDan();
		for (let k in models) {
			if (models[k].type == this.blessType && models[k].subtype == 0) {
				this.models = models[k];
			}
		}

		this.indexId = 0;
		this.onShow();
	}
	protected onRegist(): void {
		super.onRegist();
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.upBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpSkill, this);

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_UP_DAN_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.upBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpSkill, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_UP_DAN_MESSAGE.toString(), this.onRefresh, this);
	}
	public onHide(): void {
		super.onHide();
	}


	//更新外形展示
	private updateAvatarAnim(): void {
		let resurl: string = "";
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		let model: Modelmount = manager.getBlessModelByData(blessData);
		model = model ? model : manager.getBlessModel(this.blessType, 1, 1);
		this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
		}
		var waixing: number = 0;
		let wearfashionId: number = DataManager.getInstance().playerManager.player.getPlayerData().fashionWearIds[this.blessType];
		let fashionmodel: Modelfashion = JsonModelManager.instance.getModelfashion()[wearfashionId];
		if (fashionmodel)
			waixing = fashionmodel.waixing1;
		switch (this.blessType) {
			case BLESS_TYPE.HORSE:
				resurl = `zuoqi_${waixing}`;
				let _mountBody: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_mountBody);
				this.avatar_grp.y = 200;
				break;
			case BLESS_TYPE.CLOTHES:
				let sex: string = this.getPlayer().getPlayerData(0).sex == SEX_TYPE.MALE ? "nan" : "nv";
				resurl = `shenzhuang_${sex}_${waixing}`;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 320;
				break;
			case BLESS_TYPE.WEAPON:
				// resurl = `jian${waixing}_png`;
				// let weaponimg: eui.Image = new eui.Image();
				// weaponimg.source = resurl;
				// this.avatar_grp.addChild(weaponimg);
				resurl = 'jian' + waixing;
				var anim = new Animation(resurl, -1);
				// anim.y = 360;
				// anim.x = 162;
				this.avatar_grp.y = 200;
				this.avatar_grp.addChild(anim);
				// this.onStartFloatAnim();
				break;
			case BLESS_TYPE.WING:
				resurl = LoadManager.getInstance().getWingResUrl("wing" + waixing, "ride_stand", Direction.DOWN + "");
				let _wingBody: BodyAnimation = new BodyAnimation(resurl, -1, Direction.DOWN);
				this.avatar_grp.addChild(_wingBody);
				this.avatar_grp.scaleX = 0.9;
				this.avatar_grp.scaleY = 0.9;
				this.avatar_grp.y = 300;
				break;
			case BLESS_TYPE.RING:
				resurl = `guanghuan_jiemian_${waixing}`;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 200;
				this.avatar_grp.scaleX = 0.9;
				this.avatar_grp.scaleY = 0.9;
				return;
			case BLESS_TYPE.RETINUE_HORSE:
				resurl = "sc_mount" + waixing;
				let _minmountBody: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_minmountBody);
				this.avatar_grp.y = 240;
				break;
			case BLESS_TYPE.RETINUE_CLOTHES:
				resurl = "sc_role" + waixing;
				var _body: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_body);
				this.avatar_grp.y = 310;
				break;
			case BLESS_TYPE.RETINUE_WEAPON:
				resurl = `weapon${waixing}_png`;
				let _weaponbody: eui.Image = new eui.Image();
				_weaponbody.source = resurl;
				this.avatar_grp.addChild(_weaponbody);
				this.avatar_grp.y = -100;
				this.onStartFloatAnim();
				break;
			case BLESS_TYPE.RETINUE_WING:
				resurl = 'sc_wing' + waixing;
				let _minwingBody: Animation = new Animation(resurl);
				_minwingBody.x = 30;
				this.avatar_grp.addChild(_minwingBody);
				this.avatar_grp.y = 340;
				break;
			case BLESS_TYPE.MAGIC:
				resurl = `sc_magic${waixing}`;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 200;
				break;
		}
		this.avatar_grp.scaleX = 0.8;
		this.avatar_grp.scaleY = 0.8;
	}
	private moveUp: boolean;
	private start_posY: number;
	private onStartFloatAnim(): void {
		this.moveUp = true;
		this.start_posY = this.avatar_grp.y;
		this.avatar_grp.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
	}
	private onFrame(): void {
		if (this.moveUp) {
			this.avatar_grp.y--;
			if (this.avatar_grp.y < this.start_posY - 50) {
				this.moveUp = false;
			}
		} else {
			this.avatar_grp.y++;
			if (this.avatar_grp.y > this.start_posY) {
				this.moveUp = true;
			}
		}
	}
	private indexId: number = 0;
	protected onRefresh(): void {
		this.updateAvatarAnim();
		this.onShowInfo(this.indexId);
	}
	private onShowInfo(idx: number): void {
		this.titleName.text = this.models.name;
		this.indexId = idx;
		var curr: ModelmountDan = this.models;

		this.skillName.text = curr.name;
		let blessData: BlessData = DataManager.getInstance().blessManager.getPlayerBlessData(this.blessType);
		var lvNum = blessData.danDic[0];
		//属性显示
		var attrAry: number[] = curr.attrAry;
		var str: string = '';
		var nextStr: string = '';
		let i: number = 0;
		this.skillLv.text = '等级:' + lvNum;
		if (lvNum > 0) {
			for (; i < GameDefine.ATTR_OBJ_KEYS.length; i++) {
				if (attrAry[i] > 0) {
					str = str + GameDefine.Attr_FontName[i] + "：" + (attrAry[i] * lvNum) + '\n';
					nextStr = nextStr + GameDefine.Attr_FontName[i] + "：" + (attrAry[i] * (lvNum + 1)) + '\n';
				}
			}
		}
		else {
			for (; i < GameDefine.ATTR_OBJ_KEYS.length; i++) {
				if (attrAry[i] > 0) {
					str = str + GameDefine.Attr_FontName[i] + '：0\n';
					nextStr = nextStr + GameDefine.Attr_FontName[i] + "：" + (attrAry[i]) + '\n';
				}
			}
		}
		this.curPro.text = str;
		this.nextPro.text = nextStr;
		this.consumItem.setCostByAwardItem(curr.cost);
	}
	private onTouchBtnUpSkill(): void {
		if (!GameCommon.getInstance().onCheckItemConsume(this.models.cost.id, this.models.cost.num, this.models.cost.type)) return;
		var message = new Message(MESSAGE_ID.BLESS_UP_DAN_MESSAGE);
		message.setByte(0);
		// message.setByte(this.models.id);
		message.setByte(this.blessType);
		message.setByte(this.models.subtype)
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
}