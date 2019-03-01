class UnionMemberInfoView extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private union_name_label: eui.Label;
	private union_level_label: eui.Label;
	private union_postion_label: eui.Label;
	private online_label: eui.Label;
	private playerHead: PlayerHeadPanel;
	private vip_group: eui.Group;
	private power_label: eui.Label;
	private donate_label: eui.Label;
	private appoint_btn: eui.Button;
	private delete_btn: eui.Button;
	private opt_group: eui.Group;
	private impeachmentBtn: eui.Button;
	private data: UnionMemberInfo;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionMemberInfoSkin;
	}
    public onShowWithParam(param): void {
		this.data = param;
        this.onShow();
    }
	//供子类覆盖
	protected onInit(): void {
		super.onInit();
		this.setTitle("仙盟成员");
	}
	protected onRegist(): void {
		super.onRegist();
		this.appoint_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAppoint, this);
		this.delete_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
		this.impeachmentBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onImpeachment, this);
		// this.exit_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuitOrDissolved, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		this.updateInfo();
	}
	protected onRemove(): void {
		super.onRemove();
		// this.exit_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuitOrDissolved, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		this.appoint_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAppoint, this);
		this.delete_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDelete, this);
		this.impeachmentBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onImpeachment, this);
	}
    // protected onRefresh(): void {
	// 	this.updateInfo();
	// }
    protected updateInfo(): void {
		var memberInfo: UnionMemberInfo = this.data;

		this.playerHead.setHead(memberInfo.playerdata.headindex, memberInfo.playerdata.headFrame);
		this.union_name_label.text = memberInfo.playerdata.name;
		this.union_level_label.text = "等级：" + memberInfo.playerdata.level;
		this.union_postion_label.text = "职位：" + UnionDefine.Union_Postions[memberInfo.postion];
		this.power_label.text = "战力：" + memberInfo.playerdata.fightvalue;
		this.donate_label.text = "贡献：" + memberInfo.donate;
		var txtArray: string[] = DataManager.getInstance().friendManager.getOnlineTime(memberInfo.offLineTime).split("|");
		if (txtArray[1] == "online") {
			this.online_label.text = "贡献：在线";
		} else {
			this.online_label.text = "贡献：" + txtArray[0] + DataManager.getInstance().friendManager.getOnlineStr(txtArray[1]);
		}
		if (memberInfo.playerdata.viplevel > 0) {
			this.vip_group.visible = true;
		} else {
			this.vip_group.visible = false;
		}
		// this.opt_group.removeChildren();
		this.impeachmentBtn.visible = this.opt_group.visible = false;
		if(memberInfo.playerdata.id != DataManager.getInstance().playerManager.player.id){
			var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
			if (memberInfo.postion > DataManager.getInstance().unionManager.unionInfo.selfData.postion
					 && (myUnionData.postion == UNION_POSTION.WANG || myUnionData.postion == UNION_POSTION.FUBANG || myUnionData.postion == UNION_POSTION.ZHANGLAO)) {
				// this.opt_group.addChild(this.delete_btn);
				// this.opt_group.addChild(this.appoint_btn);
				this.opt_group.visible = true;
			}
			if (memberInfo.postion == UNION_POSTION.WANG && DataManager.getInstance().unionManager.unionInfo.isImpeachment == 1) {
				// this.opt_group.addChild(this.impeachmentBtn);
				this.impeachmentBtn.visible = true;
			}
		}
	}
	//任命操作
	private onAppoint(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionAppPointPanel", this.data))
		this.onHide();
	}
	//踢出帮会操作
	private onDelete(): void {
		let instance = this;
		var deleteNotice = [{ text: `是否将${this.data.playerdata.name}请离仙盟？（请慎重考虑）`, style: { textColor: 0xe63232 } }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(deleteNotice, function (playerId: number) {
				var deleteMsg: Message = new Message(MESSAGE_ID.UNION_DELETE_MEMBER_MESSAGE);
				deleteMsg.setInt(playerId);
				GameCommon.getInstance().sendMsgToServer(deleteMsg);
				instance.onHide();
			}, this, this.data.playerdata.id))
		);
	}
	//弹劾
	private onImpeachment(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam("此位不负责盟主已经连续7天未上线了，上仙是否准备消耗500钻石将其弹劾取代其盟主之位？", this.sendImpeachment, this)));
	}
	private sendImpeachment(): void {
		var message: Message = new Message(MESSAGE_ID.UNION_IMPEACHMENT_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	//The end
}
