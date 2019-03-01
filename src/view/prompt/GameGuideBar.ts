class GameGuideBar extends eui.Component {
	public static YEWAI_BOSS_GUIDE: number = 1001;
	public static YEWAI_AUTO_FIGHT: number = 1002;

	private owner: ModuleLayer;
	private panel: eui.Component;

	private guide_arrow_img: eui.Image;
	private desc_lab: eui.Label;
	private desc_grp: eui.Group;
	private anim_grp: eui.Group;
	private targetButton: egret.DisplayObject;
	private guideAnim: Animation;
	private param: GuideParam;
	private compTimes: number = 0;//完成次数

	private OFF_GAP: number = 20;
	private ARROW_START_X: number = 25;
	private ARROW_START_Y: number = 50;
	private autoCloseTime: number;

	public constructor(owner: ModuleLayer) {
		super();
		this.owner = owner;
		this.skinName = skins.FuncGuideBarSkin;
	}
	public onShow(param: GuideParam): void {
		if (!param) return;
		// if (this.param && this.param.jackarooId == param.jackarooId) return;
		if (this.targetButton) {
			this.targetButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRemove, this);
			this.targetButton = null;
		}
		if (this.panel) {
			this.panel = null;
		}
		this.param = param;
		if (!this.param.model.target) {
			this.owner.onCompleteGuide();
			return;
		}
		let model: Modelxinshou = param.model;
		this.compTimes = Math.max(model.time, 1);
		if (model.panel == "$TabView") {
			if (egret.is(param.parentContainer, 'BaseSystemPanel')) {
				this.panel = (param.parentContainer as BaseSystemPanel).currTabPanel;
			} else {
				this.panel = param.parentContainer;
			}
		} else if (model.panel == "$Mainview" || model.panel == "$MainviewBtnsBar" || model.panel == "$BaseTab") {
			this.panel = param.parentContainer;
		} else if (model.panel.indexOf('$List=') >= 0) {
			let startIdx: number;
			let endIdx: number;
			let childNum: number = 0;
			if (model.panel.indexOf('$Idx=')) {
				startIdx = model.panel.indexOf('$Idx=');
				endIdx = model.panel.indexOf(',', startIdx);
				endIdx = endIdx < 0 ? model.panel.length : endIdx;
				childNum = parseInt(model.panel.slice(startIdx + '$Idx='.length, endIdx));
			}
			startIdx = model.panel.indexOf('$List=');
			endIdx = model.panel.indexOf(',', startIdx);
			endIdx = endIdx < 0 ? model.panel.length : endIdx;
			let listName: string = model.panel.slice(startIdx + '$List='.length, endIdx);
			let listGroup: eui.Component;
			if (egret.is(param.parentContainer, 'BaseSystemPanel')) {
				listGroup = (param.parentContainer as BaseSystemPanel).currTabPanel[listName];
			} else {
				listGroup = param.parentContainer[listName];
			}

			if (listGroup) {
				for (let i: number = 0; i < listGroup.numChildren; i++) {
					let itemDisplay: eui.Component = listGroup.getChildAt(i) as eui.Component;
					if (itemDisplay && childNum == i) {
						this.panel = itemDisplay;
						break;
					}
				}
			}
		} else if (model.panel.indexOf('$Component=') >= 0) {
			let startIdx: number = model.panel.indexOf('$Component=');
			let component: string = model.panel.slice(startIdx + '$Component='.length, model.panel.length);
			if (egret.is(param.parentContainer, 'BaseSystemPanel')) {
				this.panel = (param.parentContainer as BaseSystemPanel).currTabPanel[component];
			} else {
				this.panel = param.parentContainer[component];
			}
		}
		if (!model || !this.panel || !this.panel.parent || !this.panel.parent.parent) {
			param.againCount = GameDefine.JACKAROO_GUIDE_NUM;
			this.param = null;
			return;
		}
		let btnWidth: number;// = model.kuan;
		let btnHeight: number; //= model.gao;
		if (model.target == '$close' && this.panel['basic']) {
			let basic = this.panel['basic'];
			if (basic['closeBtn1']) {
				this.targetButton = basic['closeBtn1'];
			} else if (basic['closeBtn2']) {
				this.targetButton = basic['closeBtn2'];
			}
		} else if (egret.is(this.panel, 'BaseSystemPanel') && Tool.isNumber(parseInt(model.target))) {
			this.targetButton = (this.panel as BaseSystemPanel).getTabBtnGrp(parseInt(model.target));
		} else {
			this.targetButton = this.panel[model.target];
		}
		if (!this.targetButton) {
			param.againCount = GameDefine.JACKAROO_GUIDE_NUM;
			this.param = null;
			return;
		}
		if (!Tool.isNumber(btnWidth)) {
			btnWidth = this.targetButton.width;
		}
		if (!Tool.isNumber(btnHeight)) {
			btnHeight = this.targetButton.height;
		}
		let point: egret.Point = this.targetButton.localToGlobal();
		if (egret.is(param.parentContainer, 'BaseSystemPanel') && (param.parentContainer as BaseSystemPanel).priority == PANEL_HIERARCHY_TYPE.I) {
			point.x += (this.panel.width - GameDefine.GAME_STAGE_WIDTH) / 2;
		} else if (model.panel == '$MainviewBtnsBar' && egret.is(this.panel.parent, 'BaseSystemPanel')) {
			point.x += (this.panel.width - GameDefine.GAME_STAGE_WIDTH) / 2;
		}
		let animPos: egret.Point;
		let targetRot: number = 0;
		let viewDir: string = 'down';
		if (point.x + btnWidth < 100) {
			viewDir = 'left';
			if (model.texiao > 0) {
				animPos = new egret.Point(-btnWidth / 2, 0);
			}
			point.x = point.x + this.OFF_GAP + btnWidth;
			point.y = point.y + btnHeight / 2 - this.height / 2;
			targetRot = -90;
		} else if (point.x + btnWidth > size.width - 100) {
			viewDir = 'right';
			if (model.texiao > 0) {
				animPos = new egret.Point(btnWidth / 2, 0);
			}
			point.x = point.x - this.OFF_GAP - this.height * 0.75;
			point.y = point.y + btnHeight / 2 - this.height / 2;
			targetRot = 90;
		} else if (point.y + btnHeight < 200) {
			viewDir = 'up';
			if (model.texiao > 0) {
				animPos = new egret.Point(0, -btnHeight / 2);
			}
			point.x = point.x + btnWidth / 2 - this.width / 2;
			point.y = point.y + this.OFF_GAP + btnHeight;
			targetRot = 0;
		} else {
			if (model.texiao > 0) {
				animPos = new egret.Point(0, btnHeight / 2);
			}
			point.x = point.x + btnWidth / 2 - this.width / 2;
			point.y = point.y - this.OFF_GAP - this.height;
			targetRot = 180;
		}

		let oldRotation: number = this.guide_arrow_img.rotation;
		if (model.panel == '$Mainview') {
			point.x = point.x - this.panel.x;
			point.y = point.y - this.panel.y;
		} else if (model.panel == '$MainviewBtnsBar') {
			point.x = point.x - param.parentContainer.parent.x;
			point.y = point.y - this.panel.localToGlobal().y;
		} else {
			point.x = point.x - param.parentContainer.parent.x;
			if (!DataManager.IS_PC_Game) {
				if (size.height <= GameDefine.GAME_STAGE_HEIGHT) {
					if ((model.panel == "$TabView" && egret.is(param.parentContainer, 'BaseSystemPanel')) || model.panel.indexOf('$Component=') >= 0) {
						point.y = point.y - 20;
					} else if (model.panel.indexOf('$List=') >= 0) {
						point.y = point.y - 30;
					} else if (model.target == '$close' && this.panel['basic'] && this.targetButton == this.panel['basic']['closeBtn2']) {
						point.y = point.y - 50;
					}
				} else {
					point.y = point.y - param.parentContainer.localToGlobal().y;
				}
			}
		}
		this.currentState = viewDir;

		if (this.parent && this.parent === param.parentContainer && !this.targetPos) {
			this.targetPos = point;
			egret.Tween.removeTweens(this);
			egret.Tween.removeTweens(this.guide_arrow_img);
			this.stopMoveFrame();
			this.guide_arrow_img.rotation = oldRotation;
			this.anim_grp.visible = false;
			egret.Tween.get(this).to({ x: point.x, y: point.y }, 260).call(this.toNextTweenEnd, this);
			egret.Tween.get(this.guide_arrow_img).to({ rotation: targetRot }, 250);
		} else {
			this.x = point.x;
			this.y = point.y;
			param.parentContainer.addChild(this);
			this.startMoveFrame();
		}
		this.targetButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRemove, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		if (this.guideAnim) {
			if (animPos) {
				this.guideAnim.x = animPos.x;
				this.guideAnim.y = animPos.y;
			} else {
				this.guideAnim.onDestroy();
				this.guideAnim = null;
			}
		} else {
			if (animPos) {
				this.guideAnim = GameCommon.getInstance().addAnimation('xinshouyindao', animPos, this.anim_grp, -1);
			}
		}

		if (model.desc != "") {
			this.desc_grp.visible = true;
			this.desc_lab.text = model.desc;
		} else {
			this.desc_grp.visible = false;
		}

		// this.autoCloseTime = 11;
		// Tool.addTimer(this.onCloseTimeDown, this, 100);
	}
	/**过度的动画结束**/
	private targetPos: egret.Point;
	private toNextTweenEnd(): void {
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.guide_arrow_img);
		this.anim_grp.visible = true;
		this.startMoveFrame();
		// this.oncheckTargetBtnPos();
	}
	/**二次检测按钮的位置**/
	// private oncheckTargetBtnPos(): void {
	// 	if (!this.param) return;
	// 	if (!this.targetButton) return;
	// 	let model: Modelxinshou = this.param.model;
	// 	if (!model) return;
	// 	if (model.target == '$close' || model.panel == '$Mainview' || model.panel == '$MainviewBtnsBar') return;
	// 	let btnWidth: number = this.targetButton.width;// = model.kuan;
	// 	let btnHeight: number = this.targetButton.height;// = model.gao;
	// 	let point: egret.Point = this.targetButton.localToGlobal();
	// 	if (egret.is(this.param.parentContainer, 'BaseSystemPanel') && (this.param.parentContainer as BaseSystemPanel).priority == PANEL_HIERARCHY_TYPE.I) {
	// 		point.x += (this.panel.width - GameDefine.GAME_STAGE_WIDTH) / 2;
	// 	}
	// 	if (point.x + btnWidth < 100) {
	// 		point.x = point.x + this.OFF_GAP + btnWidth;
	// 		point.y = point.y + btnHeight / 2 - this.height / 2;
	// 	} else if (point.x + btnWidth > size.width - 100) {
	// 		point.x = point.x - this.OFF_GAP - this.height * 0.75;
	// 		point.y = point.y + btnHeight / 2 - this.height / 2;
	// 	} else if (point.y + btnHeight < 200) {
	// 		point.x = point.x + btnWidth / 2 - this.width / 2;
	// 		point.y = point.y + this.OFF_GAP + btnHeight;
	// 	} else {
	// 		point.x = point.x + btnWidth / 2 - this.width / 2;
	// 		point.y = point.y - this.OFF_GAP - this.height;
	// 	}
	// 	point.x = point.x - this.param.parentContainer.parent.x;
	// 	point.y = point.y;
	// 	if (this.x != point.x) {
	// 		this.x = point.x;
	// 	}
	// 	if (this.y != point.y) {
	// 		this.y = point.y;
	// 	}
	// }

	// private onCloseTimeDown(): void {
	// 	// if (this.autoCloseTime <= 0) {
	// 	// 	Tool.removeTimer(this.onCloseTimeDown, this, 1000);
	// 	// 	this.owner.onCompleteGuide();
	// 	// 	return;
	// 	// }
	// 	// this.autoCloseTime--;
	// 	if (!this.targetButton || !this.targetButton.parent) {
	// 		this.owner.onCompleteGuide();
	// 	}
	// 	if (this.panel && !this.panel.parent) {
	// 		this.owner.onCompleteGuide();
	// 	}
	// }
	private _isMoving: boolean;
	private startMoveFrame(): void {
		if (!this._isMoving) {
			this._isMoving = true;
			this.guide_arrow_img.x = this.ARROW_START_X;
			this.guide_arrow_img.y = this.ARROW_START_Y;
			this.moveBack = false;
			this.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		}
	}
	private stopMoveFrame(): void {
		this._isMoving = false;
		this.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
	}
	private moveBack: boolean;
	private onFrame(): void {
		switch (this.currentState) {
			case 'up':
				if (this.moveBack) {
					this.guide_arrow_img.y += 2;
					if (this.guide_arrow_img.y > this.ARROW_START_Y + 12) {
						this.moveBack = false;
					}
				} else {
					this.guide_arrow_img.y -= 2;
					if (this.guide_arrow_img.y < this.ARROW_START_Y - 12) {
						this.moveBack = true;
					}
				}
				break;
			case 'down':
				if (this.moveBack) {
					this.guide_arrow_img.y -= 2;
					if (this.guide_arrow_img.y < this.ARROW_START_Y - 12) {
						this.moveBack = false;
					}
				} else {
					this.guide_arrow_img.y += 2;
					if (this.guide_arrow_img.y > this.ARROW_START_Y + 12) {
						this.moveBack = true;
					}
				}
				break;
			case 'left':
				if (this.moveBack) {
					this.guide_arrow_img.x += 2;
					if (this.guide_arrow_img.x > this.ARROW_START_X + 12) {
						this.moveBack = false;
					}
				} else {
					this.guide_arrow_img.x -= 2;
					if (this.guide_arrow_img.x < this.ARROW_START_X - 12) {
						this.moveBack = true;
					}
				}
				break;
			case 'right':
				if (this.moveBack) {
					this.guide_arrow_img.x -= 2;
					if (this.guide_arrow_img.x < this.ARROW_START_X - 12) {
						this.moveBack = false;
					}
				} else {
					this.guide_arrow_img.x += 2;
					if (this.guide_arrow_img.x > this.ARROW_START_X + 12) {
						this.moveBack = true;
					}
				}
				break;
		}
	}
	private onRemove(): void {
		this.compTimes--;
		if (this.compTimes > 0) {
			return;
		}
		this.targetPos = null;
		if (this.param) {
			this.param.isComplete = true;
		}
		this.owner.onContiuneGuide();
	}
	public onDestroy(): void {
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.guide_arrow_img);
		this.param = null;
		this.panel = null;
		this.targetPos = null;
		this.onHide();
	}
	public onHide(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		if (this.targetButton) {
			this.targetButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRemove, this);
			this.targetButton = null;
		}
		if (this.guideAnim) {
			this.guideAnim.onDestroy();
			this.guideAnim = null;
		}
		this.stopMoveFrame();
		// Tool.removeTimer(this.onCloseTimeDown, this, 100);
		this.panel = null;
	}
	private onTouch(): void {
		if (this.targetButton) {
			if (egret.is(this.targetButton, 'eui.CheckBox')) {
				(this.targetButton as eui.CheckBox).selected = true;
			}
			this.targetButton.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP));
		}
	}
	//The end
}
class GuideParam {
	public jackarooId: number;//新手引导ID
	public models: Modelxinshou[];//新手引导列表
	public parentContainer: eui.Component;//父级容器
	public isComplete: boolean = false;//已点击
	public againCount: number;
	private progress: number = 0;//当前进度

	public constructor(jackarooId: number) {
		this.jackarooId = jackarooId;
		this.progress = 0;
		this.againCount = GameDefine.JACKAROO_GUIDE_NUM;
		this.models = FunDefine.getGuideModels(jackarooId);
	}
	//当前的model
	public get model(): Modelxinshou {
		return this.models[this.progress];
	}
	//完成一项
	public onContiune(): void {
		this.progress = Math.min(this.models.length, this.progress + 1);
		this.againCount = GameDefine.JACKAROO_GUIDE_NUM;
	}
	//是否做完
	public get isEnd(): boolean {
		if (!this.models) return true;
		return this.models.length == this.progress;
	}
	//是不是最后一个
	public get isLastOne(): boolean {
		return !this.models[this.progress + 1];
	}
	//特殊规则：如果此新手引导是根据条件判断的 当条件不满足 如果下一个步骤也有判断条件那么到下一步检测  反之如果没有下一步或者下一步没有条件则结束引导
	// public get nextIsOver(): boolean {
	// 	let nextmodel: Modelxinshou = this.models[this.progress + 1];
	// 	if (!nextmodel) return true;
	// 	if (!nextmodel.func) return true;
	// 	return false;
	// }
	//The end
}