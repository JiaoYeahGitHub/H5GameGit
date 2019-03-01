class ConsumeBar2 extends eui.Component {
	public label_l: eui.Label;
	public label_r: eui.Label;
	public constructor() {
		super();
		this.skinName = skins.ConsumeBar2Skin;
	}
	public set arr(param) {
		if (param[0]) {
			if (typeof param[0] === 'string') {
				this.label_l.text = param[0];
			} else {
				this.label_l.textFlow = param[0];
			}
		}
		if (param[1]) {
			if (typeof param[0] === 'string') {
				this.label_r.text = param[1];
			} else {
				this.label_r.textFlow = param[1];
			}
		}
	}
	public set thing(param: ThingBase) {
		var model = GameCommon.getInstance().getThingModel(param.type, param.modelId);
		this.label_l.text = `消耗${model.name}`;
		var _useNum: number = param.num;
		var _hasitemNum: number = 0;
		switch (param.type) {
			case GOODS_TYPE.ITEM:
				var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(model.id);
				_hasitemNum = _itemThing ? _itemThing.num : 0;
				break;
			default:
				_hasitemNum = DataManager.getInstance().playerManager.player.getICurrency(param.type);
				break;
		}
		this.label_r.text = `${_hasitemNum}/${_useNum}`;
	}
}