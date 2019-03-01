class MarryEquipSuitQHDS extends BaseWindowPanel{
	private imgMask: eui.Image;
	private tzTitleCurr: eui.Label;
	private tzProCurr0: eui.Label;
	private tzProCurr1: eui.Label;
	private tzewCurr: eui.Label;
	private tzTitleNext: eui.Label;
	private tzProNext0: eui.Label;
	private tzProNext1: eui.Label;
	private tzewNext: eui.Label;
	private tzMax: eui.Label;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private id: number;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MarryEquipSuitQHDS;
	}
	public onShowWithParam(_id: number = 0): void {
		this.id = _id;
		if (this.id) {
			super.onShowWithParam(_id);
		}
	}
	protected onRegist(): void {
		super.onRegist();
		this.imgMask.touchEnabled = true;
		this.imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.updateTZDS(this.id);
	}
	protected onRemove(): void {
		super.onRemove();
		this.imgMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
	}
	private updateTZDS(id: number){
		this.setTitle("marry_tz_qhds_title_png");
		let level = this.ringManager.getQHDSLevel(id);
		let models:Modelqianghuadashi[] = this.ringManager.getQHDSModels(id, level);
		this.tzTitleCurr.text = "当前阶段套装等级：" + level + "级";
		let modelTSXG: Modelteshuxiaoguo = null;
		let model: Modelqianghuadashi = models[0];
		if(model){
			this.tzProCurr0.text = GameDefine.Attr_FontName[0] + "：+" + model.attrAry[0] + "\n"
							+ GameDefine.Attr_FontName[2] + "：+" + model.attrAry[2];
			this.tzProCurr1.text = GameDefine.Attr_FontName[1] + "：+" + model.attrAry[1] + "\n"
							+ GameDefine.Attr_FontName[3] + "：+" + model.attrAry[3];
			modelTSXG = JsonModelManager.instance.getModelteshuxiaoguo()[model.teshuxiaoguoId];
			if(modelTSXG){
				this.tzewCurr.text = LegendDefine.getLegendDescByType(modelTSXG.type, modelTSXG.gailv, modelTSXG.xiaoguo);
				this.tzewCurr.visible = true;
			} else {
				this.tzewCurr.text = "无附加属性";
			}
		} else {
			this.tzProCurr0.text = GameDefine.Attr_FontName[0] + "：+" +0 + "\n"
							+ GameDefine.Attr_FontName[2] + "：+" + 0;
			this.tzProCurr1.text = GameDefine.Attr_FontName[1] + "：+" + 0 + "\n"
							+ GameDefine.Attr_FontName[3] + "：+" + 0;
			this.tzewCurr.text = "无附加属性";
		}
		model = models[1];
		if(model){
			this.tzTitleNext.text = "下阶段套装等级达到" + model.mubiao + "级";
			this.tzProNext0.text = GameDefine.Attr_FontName[0] + "：+" + model.attrAry[0] + "\n"
							+ GameDefine.Attr_FontName[2] + "：+" + model.attrAry[2];
			this.tzProNext1.text = GameDefine.Attr_FontName[1] + "：+" + model.attrAry[1] + "\n"
							+ GameDefine.Attr_FontName[3] + "：+" + model.attrAry[3];
			this.tzTitleNext.visible = this.tzProNext0.visible = this.tzProNext1.visible = true;
			
			modelTSXG = JsonModelManager.instance.getModelteshuxiaoguo()[model.teshuxiaoguoId];
			if(modelTSXG){
				this.tzewNext.text = LegendDefine.getLegendDescByType(modelTSXG.type, modelTSXG.gailv, modelTSXG.xiaoguo);
				this.tzewNext.visible = true;
			} else {
				this.tzewNext.visible = false;
			}
			this.currentState = "stateDefault";
		} else {
			// this.tzTitleNext.visible = this.tzProNext0.visible = this.tzProNext1.visible = this.tzewNext.visible = false;
			// this.tzMax.visible = true;
			this.currentState = "stateMax";
		}
	}
    private get ringManager(){
        return DataManager.getInstance().ringManager;
    }
}