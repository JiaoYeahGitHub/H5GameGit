class Emoji extends eui.Component {
	private animLayer: eui.Group;
	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
		this.skinName = skins.EmojiSkin;
	}
	private onComplete(): void {
	}
	public set source(res: string) {
		this.onLoad(res, 0);
	}
	public set anim(res: string) {
		this.onLoad(res, 1);
	}
	private onLoad(res: string, type: number): void {
		this.animLayer.removeChildren();
		var emoji;
		switch (type) {
			case 0:
				emoji = new eui.Image();
				emoji.source = res;
				break;
			case 1:
				emoji = new Animation(res);
				break;
		}
		emoji.width = emoji.height = 52;
		this.animLayer.addChild(emoji);
	}
}