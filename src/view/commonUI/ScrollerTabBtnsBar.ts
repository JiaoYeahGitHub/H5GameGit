class ScrollerTabBtnsBar extends eui.Component {
	private imgFrameName: string = "iconFrame";
	private imgIconName: string = "iconDisplay";
	private imgGroup: string = "iconGroup";
	private iconTitle: string = "iconTitle";
	private iconName: string = "iconName";

	private scroller: eui.Scroller;
	private btnGroup: eui.Group;
	private buttonList: eui.Button[];
	private tabBtnList: RegisterTabBtnParam[];
	private buttonIndex: number = 0;
	private preImg: eui.Image;
	private nextImg: eui.Image;
	private func;
	private thisObj;
	public constructor() {
		super();
		this.buttonList = [];
		this.tabBtnList = [];
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.skinName = skins.ScrollerTabBarSkin;
	}
	private onLoadComplete(): void {
		// this.scroller.horizontalScrollBar.autoVisibility = false;
		// this.scroller.horizontalScrollBar.visible = false;
		// this.scroller.verticalScrollBar.autoVisibility = false;
		// this.scroller.verticalScrollBar.visible = false;
	}
	public setListenerBack(func, thisObj) {
		this.func = func;
		this.thisObj = thisObj;
	}
	//添加TabButton 
	public addTabButton(tabBtn: RegisterTabBtnParam, isActivity: boolean = false): eui.Button {
		let button: eui.Button = new eui.Button();
		button.skinName = skins.ScrollerTabBtnSkin;
		button.name = this.tabBtnList.length.toString();
		button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBtn, this);
		(button[this.imgIconName] as eui.Image).source = tabBtn.tabBtnRes;
		if (tabBtn.tabFrame) {
			(button[this.imgFrameName] as eui.Image).source = tabBtn.tabFrame;
		}
		if (isActivity) {
			let selectedAnim = new Animation("gonghuijineng_1", -1);
			selectedAnim.x = 40;
			selectedAnim.y = 49;
			selectedAnim.scaleX = selectedAnim.scaleY = 0.61;
			selectedAnim.onPlay();
			(button[this.imgGroup] as eui.Group).addChild(selectedAnim);
			(button[this.iconName] as eui.Label).text = tabBtn.title;
			(button[this.iconTitle] as eui.Group).visible = true;
		}

		this.btnGroup.addChild(button);
		this.buttonList.push(button);
		this.tabBtnList.push(tabBtn);
		return button;
	}
	private onEventBtn(event: egret.TouchEvent) {
		let idx = parseInt(event.target.name);
		if (this.buttonIndex != idx) {
			if (this.func && this.thisObj) {
				Tool.callback(this.func, this.thisObj, this.tabBtnList[idx]);
			}
		}
	}
	//移除所有的TabButton
	public removeChildrenAll(): void {
		for (let i = 0; i < this.buttonList.length; ++i) {
			this.buttonList[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBtn, this);
		}
		this.btnGroup.removeChildren();
		this.buttonList = [];
		this.tabBtnList = [];
		this.scroller.stopAnimation();
	}
	public setTagIndex(idx: number) {
		this.buttonIndex = idx;
		for (let i = 0; i < this.buttonList.length; ++i) {
			this.buttonList[i][this.imgFrameName].visible =
				this.buttonList[i][this.imgGroup].visible = idx == i;
		}
	}
	//点击左右按钮
	private onTouchLeftBtn(event: egret.TouchEvent): void {
		this.scroller.stopAnimation();
	}
	private onTouchRightBtn(event: egret.TouchEvent): void {
		this.scroller.stopAnimation();
	}
	//设置左箭头是否可见
	public setPreImgVisible(visib: boolean): void {
		this.preImg.visible = visib;
	}
	//设置右箭头是否可见
	public setNextImgVisible(visib: boolean): void {
		this.nextImg.visible = visib;
	}
	//The end
}