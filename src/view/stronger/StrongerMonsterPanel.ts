class StrongerMonsterPanel extends BaseWindowPanel {
	public desc_lab: eui.Label;
	private curPro: eui.Group;
	private nextPro: eui.Group;
	private curStrongerType: STRONGER_MONSTER_TYPE;
	private param: {};
	private titleLab: eui.Label;
	private btnjiHuo: eui.Button;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private nextDesc: eui.Label;
	private powerBar: PowerBar;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.StrongerMonsterSkin;
	}
	protected onInit(): void {
		this.setTitle('进阶大师');
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();

		this.btnjiHuo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onJiHuo, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.STRONGER_ACT.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btnjiHuo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onJiHuo, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.STRONGER_ACT.toString(), this.onRefresh, this);
	}
	private onJiHuo(): void {
		let msg: Message = new Message(MESSAGE_ID.STRONGER_ACT);
		msg.setByte(this.curStrongerType);
		GameCommon.getInstance().sendMsgToServer(msg);
	}
	private get manager(): StrongerMonterManager {
		return DataManager.getInstance().strongerManager;
	}
	protected onRefresh(): void {
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		if (this.curStrongerType == STRONGER_MONSTER_TYPE.STRONGER_CHALLENGE_PASS) {
			this.showChallengePass()
		} else if (this.curStrongerType == STRONGER_MONSTER_TYPE.STRONGER_TUJIAN_SUIT) {
			this.showTuJianSuit()
		} else {
			this.showStrongerMonster()
		}
	}
	public onShowWithParam(param): void {
		if (param instanceof Array) {
			this.curStrongerType = param[0];
			this.param = param
		} else {
			this.curStrongerType = param;
		}
		this.onShow();
	}

	//强化大师属性
	private showStrongerMonster() {
		let currModel: Modelqianghuadashi = this.manager.getCurModelByType(this.curStrongerType);
		let nextModel: Modelqianghuadashi = this.manager.getNextModelByType(this.curStrongerType);
		let curProNum: number = this.manager.getStrongerValue(this.curStrongerType);


		if (DataManager.getInstance().playerManager.player.strongerDict[this.curStrongerType] && DataManager.getInstance().playerManager.player.strongerDict[this.curStrongerType].lv != 0) {
			this.titleLab.text = currModel ? '进阶大师' + (this.manager.getJiHuoModelByType(this.curStrongerType).id) + '级' : '进阶大师0级';
			if (!nextModel) {
				this.currentState = 'full'
				this.powerBar.power = GameCommon.calculationFighting(currModel.attrAry);
				this.fillCurrAttr(currModel, 0x00dd26)
				return;
			}
			this.currentState = 'normal';
			if (DataManager.getInstance().playerManager.player.strongerDict[this.curStrongerType].lv < curProNum) {
				this.btnjiHuo.label = '进 阶'
				this.titleLab.text = currModel ? '进阶大师' + (this.manager.getJiHuoModelByType(this.curStrongerType).id) + '级' : '进阶大师0级';
				this.btnjiHuo.visible = true;
				this.fillCurrAttr(this.manager.getJiHuoModelByType(this.curStrongerType), 0x00dd26)
				this.fillNextAttr(currModel)
				let str: string;

				if (currModel.mubiao > DataManager.getInstance().playerManager.player.strongerDict[this.curStrongerType].lv) {

					this.powerBar.power = GameCommon.calculationFighting(this.manager.getNoActPro(this.curStrongerType, DataManager.getInstance().playerManager.player.strongerDict[this.curStrongerType].lv));
					str = Language.instance.parseInsertText(`stronger_monster_type_${this.curStrongerType}`) + '(' + curProNum + '/' + currModel.mubiao + ')' + Tool.getHtmlColorStr('(可激活)', "00dd26");

					if (!nextModel) {
						if (currModel.mubiao == DataManager.getInstance().playerManager.player.strongerDict[this.curStrongerType].lv) {
							this.currentState = 'full'
							this.nextPro.removeChildren();
							return;
						}
					}
				}
				else//if(currModel.mubiao<DataManager.getInstance().playerManager.player.strongerDict[this.curStrongerType].lv)
				{
					this.powerBar.power = GameCommon.calculationFighting(currModel.attrAry);
					str = Language.instance.parseInsertText(`stronger_monster_type_${this.curStrongerType}`) + '(' + curProNum + '/' + currModel.mubiao + ')' + Tool.getHtmlColorStr('(已激活)', "00dd26");
				}
				nextStr = Language.instance.parseInsertText(`stronger_monster_type_${this.curStrongerType}`) + Tool.getHtmlColorStr('(' + curProNum + '/' + nextModel.mubiao + ')', "ff0000");
				this.nextDesc.textFlow = (new egret.HtmlTextParser).parse(nextStr);
				this.desc_lab.textFlow = (new egret.HtmlTextParser).parse(str);
			}
			else {
				this.btnjiHuo.label = '激 活'
				if (!nextModel) {
					this.currentState = 'full'
					this.powerBar.power = GameCommon.calculationFighting(currModel.attrAry);
					this.fillCurrAttr(currModel, 0x00dd26)
				}
				else {
					if (!currModel) {
						var str = Language.instance.parseInsertText(`stronger_monster_type_${this.curStrongerType}`) //+ "：" + Tool.getHtmlColorStr(curProNum+'/'+nextModel.mubiao , "ff0000");
						this.desc_lab.textFlow = (new egret.HtmlTextParser).parse(str);
						this.currentState = 'weijihuo';
						this.powerBar.power = 0;
						this.fillCurrAttr(nextModel)
					}
					else {
						this.powerBar.power = GameCommon.calculationFighting(currModel.attrAry);
						var str = Language.instance.parseInsertText(`stronger_monster_type_${this.curStrongerType}`) + '(' + curProNum + '/' + currModel.mubiao + ')' + Tool.getHtmlColorStr('(已激活)', "00dd26");
						var nextStr = Language.instance.parseInsertText(`stronger_monster_type_${this.curStrongerType}`) + Tool.getHtmlColorStr('(' + curProNum + '/' + nextModel.mubiao + ')', "ff0000");
						this.nextDesc.textFlow = (new egret.HtmlTextParser).parse(nextStr);
						this.desc_lab.textFlow = (new egret.HtmlTextParser).parse(str);
						this.fillCurrAttr(currModel, 0x00dd26)
					}
				}
				this.btnjiHuo.visible = false;
			}
		}
		else {
			this.titleLab.text = currModel ? '进阶大师' + 0 + '级' : '进阶大师0级';
			this.powerBar.power = 0;
			this.currentState = 'weijihuo';
			let str;
			if (currModel) {
				str = Language.instance.parseInsertText(`stronger_monster_type_${this.curStrongerType}`) + '(' + curProNum + '/' + currModel.mubiao + ')' + Tool.getHtmlColorStr('(可激活)', "00dd26");
				this.desc_lab.textFlow = (new egret.HtmlTextParser).parse(str);
				this.fillCurrAttr(currModel, 0x00dd26)
			}
			else {
				str = Language.instance.parseInsertText(`stronger_monster_type_${this.curStrongerType}`) + '(' + curProNum + '/' + nextModel.mubiao + ')' + Tool.getHtmlColorStr('(未激活)', "ff0000");
				this.desc_lab.textFlow = (new egret.HtmlTextParser).parse(str);
				this.fillCurrAttr(nextModel)
			}
			this.btnjiHuo.visible = true;
		}
	}

	//挑战副本通关属性
	private showChallengePass() {
		let challengeInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_CHALLENGE)[0];
		let zhuxianModels: Modelzhuxiantai[] = JsonModelManager.instance.getModelzhuxiantai();
		let curProNum: number = challengeInfo.pass < 1 ? 1 : challengeInfo.pass;

		let currModel: Modelzhuxiantai = zhuxianModels[curProNum - 1];
		let nextModel: Modelzhuxiantai = zhuxianModels[curProNum];
		var shuxingNums = [];
		if (!currModel) {
			for (var i: number = 0; i < 10; i++) {
				if (zhuxianModels[curProNum + i].shuxing[0] > 0) {
					nextModel = zhuxianModels[curProNum + i]
					break;
				}
			}
		}
		else {
			for (var i: number = 0; i < 10; i++) {
				if (zhuxianModels[curProNum + i].shuxing[0] > zhuxianModels[curProNum - 1].shuxing[0]) {
					nextModel = zhuxianModels[curProNum + i]
					break;
				}
			}
		}
		if (nextModel) {
			this.currentState = 'normal';
			if (!currModel) {
				this.desc_lab.text = '关卡第0关属性加成'
				this.nextDesc.text = '通关第' + nextModel.id + '关属性加成'
				this.powerBar.power = 0;
				// this.fillCurrAttr(zhuxianModels[curProNum], SHOW_ATTR_TYPE.SHUXING)
				this.fillNextAttr(nextModel, 0x4c504d, SHOW_ATTR_TYPE.SHUXING)
				var attributeItem: AttributesText;
				this.curPro.removeChildren();
				for (var i: number = 0; i < 4; ++i) {
					attributeItem = new AttributesText();
					attributeItem.scaleX = 0.7;
					attributeItem.scaleY = 0.7;
					attributeItem.updateAttr(i, 0, 0x00dd26);
					this.curPro.addChild(attributeItem);
				}
			}
			else {
				this.desc_lab.text = '第' + currModel.id + '关属性加成';
				this.nextDesc.text = '通关第' + nextModel.id + '关属性加成';

				if (currModel.shuxing[0] == 0) {
					var attributeItem: AttributesText;
					this.curPro.removeChildren();
					for (var i: number = 0; i < 4; ++i) {
						attributeItem = new AttributesText();
						attributeItem.scaleX = 0.7;
						attributeItem.scaleY = 0.7;
						attributeItem.updateAttr(i, 0, 0x00dd26);
						this.curPro.addChild(attributeItem);
					}
				}
				else {
					this.fillCurrAttr(currModel, 0x00dd26, SHOW_ATTR_TYPE.SHUXING);
				}
				this.fillNextAttr(nextModel, 0x4c504d, SHOW_ATTR_TYPE.SHUXING)
				for (var i: number = 0; i < 10; i++) {
					if (i >= currModel.shuxing.length) {
						currModel.shuxing.push(0);
					}
				}

				this.powerBar.power = GameCommon.calculationFighting(currModel.shuxing);
			}
		}
		else {
			this.fillCurrAttr(currModel, 0x00dd26, SHOW_ATTR_TYPE.SHUXING)
			// this.fillNextAttr(nextModel, SHOW_ATTR_TYPE.SHUXING)
			this.currentState = 'full';
			// this.desc_lab.text = '第'+nextModel.id+'关属性加成'
			// this.nextPro.text = '通关第'+nextModel.id+'关属性加成'
			for (var i: number = 0; i < 10; i++) {
				if (i >= currModel.shuxing.length) {
					currModel.shuxing.push(0);
				}
			}
			this.powerBar.power = GameCommon.calculationFighting(currModel.shuxing);
		}
		this.btnjiHuo.visible = false;
		this.titleLab.text = '挑战本等级'
	}
	//图鉴套装属性
	private showTuJianSuit() {
		let tujianType: number = this.param[1];
		let playerData: PlayerData = DataManager.getInstance().playerManager.player.getPlayerData();
		let num: number = 0;
		for (let tujianId in playerData.tujianDataDict) {
			let tujianData: TuJianData = playerData.tujianDataDict[tujianId];
			if (tujianData.level == 0 || tujianData.model.type != tujianType) continue;
			num++;
		}
		let models = JsonModelManager.instance.getModeltujiantaozhuang()[tujianType];
		let model: Modeltujiantaozhuang;
		let currModel: Modeltujiantaozhuang;
		let nextModel: Modeltujiantaozhuang;
		for (let key in models) {
			model = models[key]
			if (num >= model.num) {
				currModel = model
			} else {
				nextModel = model
				break
			}
		}
		this.fillCurrAttr(currModel)
		this.fillNextAttr(nextModel)
		if (!currModel) {
			this.currentState = 'weijihuo';
		}

		else if (!nextModel) {
			this.currentState = 'normal';
		}
		else {
			this.currentState = 'full';
		}


		this.desc_lab.text = nextModel ? `集齐${nextModel.num}张图鉴` : `图鉴套装属性已激活`
	}
	//填充当前属性
	private fillCurrAttr(model: ModelJsonBase, color: number = 0x4c504d, type: SHOW_ATTR_TYPE = SHOW_ATTR_TYPE.ATTR_ARY) {
		if (model) {
			this.fillAttr(this.curPro, color, model, type)
		}
	}
	//填充下级属性
	private fillNextAttr(model: ModelJsonBase, color: number = 0x4c504d, type: SHOW_ATTR_TYPE = SHOW_ATTR_TYPE.ATTR_ARY) {
		// if(model){
		// this.currentState = 'normal'
		this.fillAttr(this.nextPro, color, model, type)
		// }else{
		// 	this.currentState = 'full'
		// }
	}
	//填充属性
	private fillAttr(group: eui.Group, color: number = 0x4c504d, model: ModelJsonBase, type: SHOW_ATTR_TYPE = SHOW_ATTR_TYPE.ATTR_ARY) {
		let attr = model.attrAry
		if (type == SHOW_ATTR_TYPE.SHUXING) {
			attr = model.shuxing
		}

		let i = 0
		var attributeItem: AttributesText;
		group.removeChildren();
		for (; i < GameDefine.ATTR_OBJ_KEYS.length; ++i) {
			if (attr[i] > 0) {
				attributeItem = new AttributesText();
				attributeItem.scaleX = 0.7;
				attributeItem.scaleY = 0.7;
				attributeItem.updateAttr(i, attr[i], color);
				group.addChild(attributeItem);
			}
		}
		// for (; i < GameDefine.ATTR_OBJ_KEYS.length * 2; ++i) {
		// 	var keystr: string = GameDefine.getAttrPlusKey(i);
		// 	if (model[keystr] && model[keystr] > 0) {
		// 		text += GameDefine.Attr_FontName[i - 10] + "：" + (model[keystr] / 10000) + '%' + '  ';//万分级
		// 		++count
		// 		if (count % 2 == 0) {
		// 			text += '\n';
		// 		}
		// 	}
		// }
	}
	//The end
}

enum SHOW_ATTR_TYPE {
	ATTR_ARY,
	SHUXING
}