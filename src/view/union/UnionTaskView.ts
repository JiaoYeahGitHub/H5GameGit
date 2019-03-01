class UnionTaskView extends BaseTabView {
	private list_scroll: eui.Scroller;
	private union_list: eui.List;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionTaskViewSkin;
	}
	protected onInit(): void {
		this.union_list.percentWidth = 620;
		this.union_list.percentHeight = 130;
		this.union_list.itemRenderer = UnionTaskItem;
		this.union_list.itemRendererSkinName = skins.UnionTaskItemSkin;
		this.union_list.useVirtualLayout = true;
		this.list_scroll.viewport = this.union_list;
		DataManager.getInstance().unionManager.onSendTaskMessage();
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.union_list.dataProvider = new eui.ArrayCollection(DataManager.getInstance().unionManager.getUnionTaskData());
	}
	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_TASK_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_TASK_UPDATE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_TASK_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_TASK_UPDATE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_TRIBUTE_MESSAGE.toString(), this.onRefresh, this);
	}
}
class UnionTaskItem extends eui.ItemRenderer {
	public data: UnionTask;
	private icon_task: eui.Image;
	private label_desc: eui.Label;
	private label_exp: eui.Label;
	private label_donate: eui.Label;
	private label_progress: eui.Label;
	private btn_goto: eui.Button;
	private isCanDo: boolean = false;
	private model: ModelguildTask;
	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
		this.btn_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
	}
	protected dataChanged(): void {
		this.isCanDo = false;
		var max: number;
		var showNum: number;
		if (this.data.id == 0) {
			max = 10;
			this.icon_task.source = "tongqian_png";
			this.label_desc.text = "消耗20万银币上一炷香";
			this.btn_goto.label = "捐献";
			this.label_exp.text = `帮会经验+${10}`;
			this.label_donate.text = `帮贡+${10}`;
		} else {
			this.icon_task.source = "union_task_icon_png";
			this.btn_goto.label = "前往";
			this.model = JsonModelManager.instance.getModelguildTask()[this.data.id];
			if (this.model) {
				max = this.model.count;
				this.label_desc.text = this.model.name;
				this.label_exp.text = `帮会经验+${this.model.guildExp}`;
				this.label_donate.text = `帮贡+${this.model.guildExp}`;
			}
		}
		showNum = this.data.param > max ? max : this.data.param;
		this.label_progress.text = `${showNum}/${max}`;
		if (showNum >= max) {//已完成
			this.btn_goto.label = "已完成";
			GameCommon.getInstance().onButtonEnable(this.btn_goto, false);
		} else {
			this.isCanDo = true;
			GameCommon.getInstance().onButtonEnable(this.btn_goto, true);
		}

	}
	private onTouchBtn(): void {
		if (this.isCanDo) {
			if (this.data.id == 0) {//去捐献
				var tributeMsg: Message = new Message(MESSAGE_ID.UNION_TRIBUTE_MESSAGE);
				tributeMsg.setByte(1);
				GameCommon.getInstance().sendMsgToServer(tributeMsg);
			} else {
				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this.model.goType);
			}
		}
	}
}