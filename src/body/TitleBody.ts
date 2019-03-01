class TitleBody extends egret.DisplayObjectContainer {
	private model: Modelchenghao;
	private _animBack: Animation;
	private _fontImg: eui.Image;
	public constructor(model: Modelchenghao) {
		super();
		this.onupdate(model);
	}
	public onupdate(model: Modelchenghao): void {
		if (!model) {
			this.onDestroy();
			return;
		}
		if (!this.model || this.model.id != model.id) {
			this.model = model;
			let dituRes: string = 'chenghaodi_' + this.model.ditu;
			if (!this._animBack) {
				this._animBack = new Animation(dituRes);
				this.addChild(this._animBack);
			} else {
				this._animBack.onUpdateRes(dituRes, -1);
			}

			if (this.model.wenzi > 0) {
				if (!this._fontImg) {
					this._fontImg = new eui.Image();
					this.addChild(this._fontImg);
				} else {
					this._fontImg.source = '';
				}
				this._fontImg.source = `chenghaozi_${this.model.wenzi}_png`;
				let size: string[] = this.model.size.split(',');
				this._fontImg.anchorOffsetX = parseInt(size[0]) / 2;
				this._fontImg.anchorOffsetY = parseInt(size[1]) / 2;
			} else {
				if (this._fontImg) {
					if (this._fontImg.parent) {
						this._fontImg.parent.removeChild(this._fontImg);
					}
					this._fontImg = null;
				}
			}
		}
	}
	public onDestroy(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		if (this._animBack) {
			this._animBack.onDestroy();
			this._animBack = null;
		}
		if (this._fontImg) {
			if (this._fontImg.parent) {
				this._fontImg.parent.removeChild(this._fontImg);
			}
			this._fontImg = null;
		}
	}
	//The end
}