class UnionAppPointPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private cb_group: eui.Group;
	private btn_sure: eui.Button;
	private Postion_Size: number = 5;

	private optUnionMember: UnionMemberInfo;
	private postion_cbs: eui.CheckBox[];
	private postion_groups: eui.Group[];
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionAppPointSkin;
	}
	public onShowWithParam(param): void {
		this.optUnionMember = param as UnionMemberInfo;
		if (this.optUnionMember)
			super.onShowWithParam(param);
	}
	protected onInit(): void {
		this.postion_groups = [];
		this.postion_cbs = [];
		for (var i: number = 1; i <= this.Postion_Size; i++) {
			this.postion_cbs[i] = this["postion_cb" + i];
			this.postion_cbs[i].touchEnabled = false;
			this.postion_groups[i] = this["postion_group" + i];
			this.postion_groups[i].name = i + "";
		}
		this.setTitle("职位任命");
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		let postion = DataManager.getInstance().unionManager.unionInfo.selfData.postion;
		for (var i: number = 1; i <= this.Postion_Size; i++) {
			if (postion < i || postion == UNION_POSTION.WANG) {
				Tool.setDisplayGray(this.postion_groups[i], false);
				this.postion_groups[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckBox, this);
			} else {
				Tool.setDisplayGray(this.postion_groups[i], true);
			}
			this.postion_cbs[i].selected = false;
		}
		this.onChangePostionHandler(this.optUnionMember.postion);
	}
	protected onRegist(): void {
		super.onRegist();
		// for (var i: number = 1; i <= this.Postion_Size; i++) {
		// 	this.postion_groups[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckBox, this);
		// }
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAppPointHandler, this);
	}
	protected onRemove(): void {
		super.onRemove();
		for (var i: number = 1; i <= this.Postion_Size; i++) {
			this.postion_groups[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckBox, this);
		}
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAppPointHandler, this);
	}
	//选中职位checkbox
	private onTouchCheckBox(event: egret.Event): void {
		var postion: number = parseInt(event.currentTarget.name);
		this.onChangePostionHandler(postion);
	}
	//切换职位处理
	private _selectedPostion: number;
	private onChangePostionHandler(postion: number): void {
		for (var i: number = 1; i <= this.Postion_Size; i++) {
			this.postion_cbs[i].selected = false;
		}
		this.postion_cbs[postion].selected = true;
		this._selectedPostion = postion;
	}
	//任命协议
	private onTouchAppPointHandler(): void {
		if (this.optUnionMember.postion != this._selectedPostion) {
			var postionName: string = UnionDefine.Union_Postions[this._selectedPostion];
			var appPointNotice;
			if (this._selectedPostion == UNION_POSTION.WANG) {
				appPointNotice = [{ text: `您确定要将${postionName}职位转让给${this.optUnionMember.playerdata.name}？（转让成后您降职成为盟众，请慎重考虑）`, style: { textColor: 0xe63232 } }];
			} else {
				var upordownDesc: string = this.optUnionMember.postion > this._selectedPostion ? "提升" : "降职";
				appPointNotice = [{ text: `您确定要将${this.optUnionMember.playerdata.name}${upordownDesc}至${postionName}职位？`, style: { textColor: 0x28e828 } }];
			}
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("AlertFrameUI", new AlertFrameParam(appPointNotice, this.onAppPoint, this)));
		} else {
			this.onHide();
		}
	}
	private onAppPoint(): void {
		var appPointMsg: Message = new Message(MESSAGE_ID.UNION_POSTION_MESSAGE);
		appPointMsg.setInt(this.optUnionMember.playerdata.id);
		appPointMsg.setByte(this._selectedPostion);
		GameCommon.getInstance().sendMsgToServer(appPointMsg);
		this.onHide();
	}
	//The end
}