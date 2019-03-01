class WaitLoadingPanel extends eui.Component {
	private imgLoading: eui.Image;
	private isLoading: boolean;
	public constructor() {
		super();
		this.skinName = skins.WaitLoadingPanel;
	}
	public resetPanel(width: number, height: number) {
		this.width = width;
		this.height = height;
	}
	public loadStart() {
		if (!this.isLoading) {
			this.isLoading = true;
			this.visible = true;
			this.start();
		}
	}
	public loadClose() {
		this.visible = false;
		this.isLoading = false;
		this.stop();
	}
	private start() {
		let img = this.imgLoading;
		img.rotation = 0;
		let tw = egret.Tween.get(img, { loop: true });
		tw.to({ rotation: 360 }, 3600);
		tw.call(() => {
			img.rotation = 0;
		}, this);
	}
	private stop() {
		egret.Tween.removeTweens(this.imgLoading);
	}
}