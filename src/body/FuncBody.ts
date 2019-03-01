class FuncBody extends egret.DisplayObjectContainer {
	private icon: eui.Image;
	public id: number;
	public constructor(id) {
		super();

		this.id = id;

		var funcModel = JsonModelManager.instance.getModelfunctionLv()[id];
		this.icon = new eui.Image();
		this.icon.source = funcModel.icon;
		this.addChild(this.icon);
	}

	public onDestroy(): void {
		this.removeChildren();
		if (this.parent)
			this.parent.removeChild(this);
		this.icon = null;
	}
	//The end
}