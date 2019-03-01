class BaseListItem extends eui.ItemRenderer implements eui.UIComponent {
	protected isLoaded: boolean = false;
	public constructor() {
		super();
		this.initializeSize();
		this.once(eui.UIEvent.COMPLETE, this.onLoadComplete, this);
	}
	protected initializeSize(): void {
	}
	protected onInit(): void {
	}
	protected onLoadComplete(): void {
		this.isLoaded = true;
		this.onInit();
		if (this.data) {
			this.dataChanged();
		}
	}
	/**子类不要再使用dataChanged  请重写onUpdate方法**/
	protected dataChanged(): void {
		if (this.isLoaded) {
			this.onUpdate();
		}
	}
	protected onUpdate(): void {
	}
	//The end
}