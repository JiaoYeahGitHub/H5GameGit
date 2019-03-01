class PlayerHeadPanel extends eui.Component{
	public imgHead: eui.Image;
	public imgFrame: eui.Image;
	private isListener: boolean;
	public constructor(headId: number = 1, frameId: number = -1) {
		super();
		this.isListener = false;
		this.skinName = skins.PlayerHeadSkin;
		this.setHead(headId, frameId);
	}
	public setHead(headId: number = -1, frameId: number = -1): void {
		if(headId == -1){
			headId = DataManager.getInstance().playerManager.player.headIndex;
		}
		if(headId == 0){
			headId = 2;
		}
		if(frameId == -1){
			frameId = DataManager.getInstance().playerManager.player.headFrameIndex;
		}
		if(frameId == 0){
			frameId = 1;
		}
		this.imgFrame.source = GameCommon.getInstance().getHeadFrameByIndex(frameId);
		this.imgHead.source = GameCommon.getInstance().getBigHeadByOccpation(headId);
	}
	public setHeadSystem(){
		this.imgFrame.source = "head_icon_system_png";
		this.imgFrame.source = GameCommon.getInstance().getHeadFrameByIndex(1);
	}
	public onClear(){
		this.imgFrame.source = null;
		this.imgHead.source = null;
	}
	public addClickListener(listener, thisObj){
		if(!this.isListener){
			this.imgHead.touchEnabled = this.imgFrame.touchEnabled = true;
			this.imgHead.addEventListener(egret.TouchEvent.TOUCH_TAP, listener, thisObj);
			this.imgFrame.addEventListener(egret.TouchEvent.TOUCH_TAP, listener, thisObj);
			this.isListener = true;
		}
	}
}