class PetLingDanPanel extends BaseWindowPanel {
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
		this.skinName = skins.MagicLingDanSkin;
	}
	protected onInit(): void {
		super.onInit();

		this.onRefresh();


	}
	private models: ModelchongwuDan;
	public onShowWithParam(param): void {
		this.blessType = param;
		this.models = JsonModelManager.instance.getModelchongwuDan()[2];
		this.indexId = 0;
		this.onShow();
	}
	protected onRegist(): void {
		super.onRegist();
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.upBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpSkill, this);

		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_DAN_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.upBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpSkill, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_DAN_MESSAGE.toString(), this.onRefresh, this);
	}
	public onHide(): void {
		super.onHide();
	}


	//更新外形展示
	private updateAvatarAnim(): void {
		this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
		}
		let pData: PetData = DataManager.getInstance().playerManager.player.petData;
		var lvModel: Modelchongwujinjie = pData.gradeModel;
		GameCommon.getInstance().addAnimation('petbig' + lvModel.waixing1, null, this.avatar_grp, -1);
		this.avatar_grp.y = 270;
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
		var curr: ModelchongwuDan = this.models;

		this.skillName.text = curr.name;
		let pData: PetData = DataManager.getInstance().playerManager.player.petData;
		var lvNum = pData.danDic[2];
		//属性显示
		var attrAry: number[] = curr.attrAry;
		var str: string = '';
		var nextStr: string = '';
		let i: number = 0;
		this.skillLv.text = '等级:' + lvNum;
		if (lvNum > 0) {
			str = "宠物全属性:" + (curr.harm * lvNum / 100) + '%\n';
			nextStr = '宠物全属性:' + (curr.harm * (lvNum + 1) / 100) + '%\n';
		}
		else {
			str = "宠物全属性:0%\n";
			nextStr = '宠物全属性:' + (curr.harm / 100) + '%\n';
		}
		this.curPro.text = str;
		this.nextPro.text = nextStr;
		this.consumItem.setCostByAwardItem(curr.cost);
	}
	private onTouchBtnUpSkill(): void {
		if (!GameCommon.getInstance().onCheckItemConsume(this.models.cost.id, this.models.cost.num, this.models.cost.type)) return;
		var message = new Message(MESSAGE_ID.PET_DAN_MESSAGE);
		message.setByte(2);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
}