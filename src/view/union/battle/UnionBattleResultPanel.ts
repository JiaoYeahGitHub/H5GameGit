class UnionBattleResultPanel extends BaseWindowPanel {
	private result_des_lab: eui.Label;
	private special_des_lab: eui.Label;
	private labelAlert: eui.Label;
	private btn_sure: eui.Button;
	private btn_back: eui.Button;
	private award_Scroller: eui.Scroller;
	private award_groud: eui.Group;
	private btnbar_grp: eui.Group;
	private anim_grp1: eui.Group;
	private anim_grp2: eui.Group;
	private anim_grp3: eui.Group;
	private special_awd_grp: eui.Group;

	private param: UnionBattleResultParam;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionBattleWinSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	public onRemove(): void {
		super.onRemove();
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	public onShowWithParam(param): void {
		if (this.isloadComp) {
			this.result_des_lab.text = "";
			this.special_des_lab.text = "";
			for (let i: number = this.award_groud.numChildren - 1; i >= 0; i--) {
				let instance = this.award_groud.getChildAt(i);
				egret.Tween.removeTweens(instance);
				this.award_groud.removeChild(instance);
				instance = null;
			}
			for (let i: number = this.special_awd_grp.numChildren - 1; i >= 0; i--) {
				let instance = this.special_awd_grp.getChildAt(i);
				egret.Tween.removeTweens(instance);
				this.special_awd_grp.removeChild(instance);
				instance = null;
			}
		}
		this.param = param;
		super.onShowWithParam(param);
	}
	public onHide(): void {
		super.onHide();
		Tool.removeTimer(this.onCloseTimedown, this, 1000);
		if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.UNION_BATTLE) {
			GameFight.getInstance().fightScene.onQuitScene();
		}
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		if (this.param.contiuneDesc) {
			this.currentState = 'contiune';
			this.labelAlert.text = this.param.contiuneDesc;
		} else {
			this.currentState = 'result';

			/**第一步：战斗结果**/
			this.anim_grp1.x = 550;
			this.anim_grp1.alpha = 0;
			this.result_des_lab.textFlow = (new egret.HtmlTextParser).parser(this.param.resultParam);
			egret.Tween.get(this.anim_grp1).to({ x: 90, alpha: 1 }, 1000, egret.Ease.cubicIn);

			/**第二步：获得物品**/
			this.anim_grp2.x = 550;
			this.anim_grp2.alpha = 0;
			egret.Tween.get(this.anim_grp2).to({ x: 550 }, 500).to({ x: 90, alpha: 1 }, 1000, egret.Ease.cubicIn)
				.call(function () {
					if (this.param.awardList.length > 0) {
						this.onPlayAwardAnim(this.param.awardList, this.award_groud);
					}
				}, this);

			/**第三步：特殊奖励**/
			this.anim_grp3.x = 550;
			this.anim_grp3.alpha = 0;
			// this.special_des_lab.textFlow = (new egret.HtmlTextParser).parse(GameCommon.getInstance().readStringToHtml(this.param.specialDesc));
			egret.Tween.get(this.anim_grp3).to({ x: 550 }, 1000).to({ x: 90, alpha: 1 }, 1000, egret.Ease.cubicIn).call(function () {
				if (this.param.specialAwdList) {
					this.onPlayAwardAnim(this.param.specialAwdList, this.special_awd_grp);
				}
			}, this);
		}
		this._showleftTime = 11;
		Tool.addTimer(this.onCloseTimedown, this, 1000);
	}
	private onPlayAwardAnim(awardlist: AwardItem[], awdGrp: eui.Group): void {
		for (let i: number = 0; i < awardlist.length; i++) {
			let awarditem: AwardItem = awardlist[i];
			let goodsInstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
			let goodsGrp: eui.Group = new eui.Group();
			goodsGrp.width = 90;
			goodsGrp.height = 110;
			goodsGrp.addChild(goodsInstance);
			goodsInstance.y = 200;
			goodsInstance.alpha = 0;
			awdGrp.addChild(goodsGrp);
			egret.Tween.get(goodsInstance).to({ y: 200 }, i * 100).to({ alpha: 1, y: 0 }, 300, egret.Ease.sineInOut);
		}
	}
	private _showleftTime: number;
	private onCloseTimedown(): void {
		this._showleftTime--;
		if (this._showleftTime < 0) {
			Tool.removeTimer(this.onCloseTimedown, this, 1000);
			this.onTouchCloseBtn();
			return;
		}
		this.btn_sure.label = Language.instance.getText('sure') + `(${this._showleftTime})`;
	}
	//The end
}
class UnionBattleResultParam {
	public contiuneDesc: string;//观战结果
	public resultParam: string;//结果
	public awardList: AwardItem[];//奖励
	public specialAwdList: AwardItem[];//特殊奖励
}