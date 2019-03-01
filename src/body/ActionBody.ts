/**
 * 生物对象的父类
 * **/
abstract class ActionBody extends BaseBody implements IMapOrder {
	public mapOrder: number = 0;
	public mapY: number;
	public updateY(): void {
		this.mapY = this.y;
	}
	/**-----旧的不再使用的属性----**/
	// protected _hasMount: boolean = false;//是否有坐骑
	// protected _action2: ACTION;
	// private _isRide: boolean = false;//是否是乘骑状态

	protected isFace5: boolean = true;
	protected bodyLayer: egret.DisplayObjectContainer;//模型层
	protected bottomLayer: egret.DisplayObjectContainer;//模型下层
	protected foreLayer: egret.DisplayObjectContainer;//模型前层
	protected topLayer: egret.DisplayObjectContainer;//头顶层
	protected _data;
	protected bodyHead: BodyHead;
	protected _body: BodyAnimation;
	protected _action: ACTION = ACTION.STAND;
	protected _skillEffectsDict;
	protected _direction: Direction = Direction.DOWN;
	protected _isFlip: boolean = false;
	protected _atkAcitonIdx: number = 1;//攻击动作编号
	protected _actionPlayNum: number = 1;//播放次数
	protected _mountOffY: number = 0;//坐骑Y轴的偏移
	private _jumpTime: number = 1000;//跳跃用时
	private _jumpSpeed: number = 400;
	private _jumpOffsetY: number = 0;
	private _jumpIsDown: boolean;
	private _shifaEffect: EffectBody;
	private _skillFontEft: Animation;

	public ignoreDist: boolean = false;//是否可以忽视攻击距离
	public walkOn: boolean;//行进（优先级高于攻击）
	public inMap: boolean = true;//是不是在地图上的生物

	public constructor() {
		super();
		this._skillEffectsDict = {};
		//所有层级
		this.bottomLayer = new egret.DisplayObjectContainer();
		this.addChildAt(this.bottomLayer, 0);
		this.bodyLayer = new egret.DisplayObjectContainer();
		this.addChildAt(this.bodyLayer, 1);
		this.foreLayer = new egret.DisplayObjectContainer();
		this.addChildAt(this.foreLayer, 2);
		this.topLayer = new egret.DisplayObjectContainer();
		this.addChildAt(this.topLayer, 3);

		this.onInitBodyHead();
	}
	public set data(data: BodyData) {
		this._data = null;
		delete this._data;
		if (data) {
			this._data = data;
			this.onRefreshData();
		}
	}
	public get data(): BodyData {
		return this._data;
	}
	public onRefreshData(): void {
		this.onResetHeadInfo();
		this.onUpdateHeadPos();
		this.onUpdateAvatar();
		this.onCheckDeath();
	}
	//更换外形
	public onUpdateAvatar(): void {
		this.updateAction();
	}
	//初始化怪物血条
	protected onInitBodyHead(): void {
		this.bodyHead = new BodyHead();
		this.topLayer.addChildAt(this.bodyHead, 0);
	}
	//隐藏显示血条
	public onShowOrHideHpBar(bool: boolean): void {
		this.bodyHead.showorhideHpPro(bool);
	}
	//是否显示影子
	private _isshowShadow: boolean = true;
	public onshoworhideShodow(isshow: boolean): void {
		this._isshowShadow = isshow;
	}
	public get isshowShadow(): boolean {
		return this._isshowShadow;
	}
	//是否隐藏模型
	protected _bodyVisible: boolean = true;
	public set bodyVisible(bool: boolean) {
		this._bodyVisible = bool;
	}
	//更新模型方向
	public set direction(direction: Direction) {
		if (direction != this._direction) {
			this._direction = direction;
			this.directionHandler();
			this.onUpdateAvatar();
		}
	}
	private directionHandler(): void {
		var _fiip: boolean;
		if (this.direction == Direction.LEFTUP || this.direction == Direction.LEFT || this.direction == Direction.LEFTDOWN) {
			_fiip = true;
		} else {
			_fiip = false;
		}
		if (_fiip != this._isFlip) {
			this._isFlip = _fiip;
			this.bodyLayer.scaleX *= -1;
		}
	}
	public get direction(): Direction {
		return this._direction;
	}
	//获取当前方向的帧标签
	protected getDirectionFrame(): string {
		if (!this.isFace5) {
			switch (this._direction) {
				case Direction.RIGHTDOWN:
				case Direction.RIGHT:
					return Direction.RIGHTDOWN + '';
				case Direction.RIGHTUP:
				case Direction.UP:
					return Direction.RIGHTUP + '';
				case Direction.LEFTUP:
				case Direction.LEFT:
					return Direction.RIGHTUP + "";
				case Direction.LEFTDOWN:
				case Direction.DOWN:
					return Direction.RIGHTDOWN + "";
			}
		} else {
			switch (this.direction) {
				case Direction.LEFTUP:
					return Direction.RIGHTUP + "";
				case Direction.LEFT:
					return Direction.RIGHT + "";
				case Direction.LEFTDOWN:
					return Direction.RIGHTDOWN + "";
			}
		}
		return this.direction + "";
	}
	//更新模型动作
	private onChangeAction(action: ACTION): boolean {
		if (this.data.isStop) {
			action = ACTION.NULL;
		}
		/**不可被打断的动作 优先级最高**/
		if (this._action == ACTION.DEATH && this.data.isDie) {
			return false;
		}
		if (this._action == ACTION.JUMP && this.isPlayJump) {
			return false;
		}

		//状态关联
		if (action != ACTION.NULL) {
			if (this.data.isUseingSkill) {//攻击的动作
				if (action == ACTION.MOVE && this.walkOn) {
					this.onWalkHandler();
				}
				return false;
			}
		} else {
			action = ACTION.STAND;
		}

		if (this._action == ACTION.ATTACK) {
			this._action = ACTION.NULL;
			for (let i: number = 0; i < this.bodyLayer.numChildren; i++) {
				let targetbody = this.bodyLayer.getChildAt(i);
				if (targetbody['onRemoveCallBack'])
					targetbody['onRemoveCallBack']();
			}
			if (this._shifaEffect) {
				this._shifaEffect.onDestroy();
				this._shifaEffect = null;
			}
		}

		//更新模型
		if (this._action != action) {
			switch (action) {
				case ACTION.ATTACK:
					this._actionPlayNum = this.data.useSkill ? this.data.useSkill.model.playnum : 1;
					break;
				case ACTION.DEATH:
				case ACTION.JUMP:
					this._actionPlayNum = 0;
					break;
				default:
					this._actionPlayNum = -1;
					break;
			}
			this._action = action;
			this.onUpdateAvatar();
		}
		//处理逻辑
		switch (action) {
			case ACTION.STAND:
				this.onStandHandler();
				break;
			case ACTION.MOVE:
				this.onWalkHandler();
				break;
			case ACTION.ATTACK:
				this.onAttackHandler();
				break;
			case ACTION.JUMP:
				this.onJumpHandler();
				break;
			case ACTION.HURT:
				break;
			case ACTION.DEATH:
				break;
		}
		return true;
	}
	/** 动作更新 **/
	protected updateAction(): void {
		//供子类覆盖
	}
	//根据动作获取动作名 isMount是不是坐骑 true是  false不是
	protected get actionName(): string {
		var _actionName: string = "";
		switch (this._action) {
			case ACTION.STAND:
				switch (this.mountType) {
					case MOUNT_TYPE.RIDE_MOUNT:
						_actionName = "ride_stand";
						break;
					default:
						_actionName = "stand";
						break;
				}
				break;
			case ACTION.MOVE:
				switch (this.mountType) {
					case MOUNT_TYPE.NO_MOUNT:
						_actionName = "move";
						break;
					case MOUNT_TYPE.STAND_MOUNT:
						_actionName = "stand";
						break;
					case MOUNT_TYPE.RIDE_MOUNT:
						_actionName = "ride_walk";
						break;
				}
				break;
			case ACTION.ATTACK:
				_actionName = "attack" + (this._atkAcitonIdx > 0 ? this._atkAcitonIdx + "" : "");
				break;
			case ACTION.JUMP:
				_actionName = "jump";
				break;
			case ACTION.DEATH:
				if (this.data.bodyType == BODY_TYPE.BOSS || this.data.bodyType == BODY_TYPE.MONSTER) {
					_actionName = "stand";
				} else {
					_actionName = "";
				}
				break;
			case ACTION.HURT:
				_actionName = "";
				break;
		}
		return _actionName;
	}
	//更新人物头顶位置
	protected onUpdateHeadPos(): void {
		this.bodyHead.x = -75;
		this.bodyHead.y = - this.data.model.high - 30;
	}
	//层级管理target处理对象 order如果是number代表指定到哪一层，如果是Animation对象就指定到此对象上面
	protected addLayerOrder(body: egret.DisplayObject, order): void {
		let layerNum: number;
		if (Tool.isNumber(order)) {
			layerNum = order;
		} else if (egret.is(order, "egret.DisplayObject")) {
			if (this.bodyLayer.getChildIndex(order) >= 0) {
				layerNum = this.bodyLayer.getChildIndex(order) + 1;
			}
		}
		let oldLayerNum: number = this.bodyLayer.getChildIndex(body);
		if (oldLayerNum < 0) {
			if (Tool.isNumber(layerNum)) {
				this.bodyLayer.addChildAt(body, layerNum);
			} else {
				this.bodyLayer.addChild(body);
			}
		} else {
			if (Tool.isNumber(layerNum) && layerNum != oldLayerNum) {
				this.bodyLayer.setChildIndex(body, layerNum);
			}
		}
	}
	//从自身移除
	protected removeSelfBody(body: egret.DisplayObject): void {
		if (this.bodyLayer.getChildIndex(body) >= 0) {
			this.bodyLayer.removeChild(body);
		}
	}
	//根据自身坐标与目标坐标算出朝向
	public checkFace(x: number, y: number): Direction {
		return Tool.checkFace8(this.x, this.y, x, y);
	}
	//动作重置 等于强制站立
	public onActionReset(): void {
		if (this._action != ACTION.STAND) {
			this.onChangeAction(ACTION.NULL);
		}
	}
	//停止移动 但不能停止跳跃
	public onStand(): void {
		this.onChangeAction(ACTION.STAND);
	}
	private onStandHandler(): void {
		super.stopMove();
		this.walkOn = false;
		if (this._speedpathTime > 0) {
			this._speedpathTime = 0;
			this._speedTeapCount = 0;
		}
	}
	//路径终止
	protected stopMove(): void {
		if (this.isPlayJump) {
			this.onInitJump();
		} else {
			this.onStand();
		}
	}
	//判断生物是不是在移动（跳跃加行走）
	public get isMoving(): boolean {
		if (this.isMove() || this.isPlayJump)
			return true;
		return false;
	}
	//更新移动 首先setmove 再执行 onmove
	public setMove(pointPaths: Array<egret.Point>) {
		this.setMovePoint(pointPaths);
	}
	//设置强制路径 走完才能攻击
	public setWalkOn(pointPaths: Array<egret.Point>) {
		if (pointPaths) {
			this.walkOn = true;
			this.setMove(pointPaths);
		}
	}
	//设置加减速度的移动路径
	private _speedpathTime: number = 0;//加减速的时间
	private _speedTeapCount: number;
	private _changeSpeed: number;
	public setWalkWithSpeed(pointPaths: Array<egret.Point>, timeCount: number) {
		this._speedpathTime = timeCount;

		this.setWalkOn(pointPaths);

		this._speedTeapCount = Math.floor(timeCount / this._dt);
		this._changeSpeed = Math.ceil(this.getDistToTarget() * 2 / ((this._speedTeapCount + 1) * this._speedTeapCount));
	}
	public onMove(): void {
		if (this.isPlayJump) {
			this.onJumpHandler();
		} else if (this._moveTarget) {
			this.onChangeAction(ACTION.MOVE);
		}
	}
	protected _dt: number = 40;
	protected walkLogicTime: number = 0;
	private onWalkHandler(): void {
		var dt: number = this._dt;
		if (egret.getTimer() - this.walkLogicTime < 20) {
			return;
		}
		let oldSpeed: number = this.moveSpeed;
		if (this._speedTeapCount > 0) {
			dt = 1000;
			this.moveSpeed = this._speedTeapCount * this._changeSpeed;
			if (this._speedTeapCount > 0) {
				this._speedTeapCount--;
			} else {
				this._speedpathTime = 0;
				this._speedTeapCount = 0;
			}
		}
		this.walkLogicTime = egret.getTimer();
		super.logicMove(dt);
		if (oldSpeed != this.moveSpeed) {
			this.moveSpeed = oldSpeed;
		}
	}
	protected onChangeDir(): void {
		if (this._moveTarget && this._speedpathTime == 0) { //&& !this.data.isUseingSkill
			this.direction = this.checkFace(this._moveTarget.x, this._moveTarget.y);
		}
	}
	//跳跃逻辑
	protected _jumpPoints: Array<egret.Point>;
	public onJump(point: egret.Point, onlyWalk: boolean = false): void {
		this.onChangeAction(ACTION.JUMP);
	}
	protected onInitJump(): void {
	}
	protected onJumpHandler(): void {
	}
	protected onFinishJump(): void {
		this.childOffY = 0;
		this._jumpPoints = null;
	}
	public get isPlayJump(): boolean {
		return this._jumpPoints && this._jumpPoints.length > 0;
	}
	//位移所有子容器
	private _childOffY: number = 0;
	public set childOffY(y: number) {
		this._childOffY = y;
		// this.bodyLayer.y = this._childOffY;
		for (let i: number = 0; i < this.numChildren; i++) {
			let selfChildObj = this.getChildAt(i);
			selfChildObj.y = y;
		}
	}
	public get childOffY(): number {
		return this._childOffY;
	}
	//攻击
	/**当前释放的技能标识 id*100 同一技能1-99**/
	protected _curAtkSkIdx: number = 0;
	public onAttack(): void {
		let skillInfo: SkillInfo = this.data.useSkill;
		if (!skillInfo || !this.hurtBody) return;

		let pre_skillId: number = Tool.toInt(this._curAtkSkIdx / SkillDefine.MAX_ATKCOUNT);
		let atkIdx1: number = skillInfo.id * SkillDefine.MAX_ATKCOUNT;
		let atkIdx2: number = pre_skillId == skillInfo.id ? Math.max(0, this._curAtkSkIdx - atkIdx1 + 1) : 0;
		atkIdx2 = atkIdx2 >= SkillDefine.MAX_ATKCOUNT ? 0 : atkIdx2;
		if (skillInfo.model.actionIndex > 0) {
			this._atkAcitonIdx = skillInfo.model.actionIndex;
		} else {
			if (skillInfo.id == SkillDefine.COMMON_SKILL_ID) {
				if (pre_skillId == SkillDefine.COMMON_SKILL_ID) {
					this._atkAcitonIdx = (this._atkAcitonIdx % SkillDefine.Attack_Action_Max) + 1;
				} else {
					this._atkAcitonIdx = 1;
				}
			} else {
				if (this.data.bodyType == BODY_TYPE.BOSS) {
					this._atkAcitonIdx = 0;
				} else {
					this._atkAcitonIdx = Math.ceil(Math.random() * SkillDefine.Attack_Action_Max);
				}
			}
		}
		this._curAtkSkIdx = atkIdx1 + atkIdx2;

		this.onChangeAction(ACTION.ATTACK);
	}
	//添加攻击目标
	public onAddEnemyBodyList(enemybodys: ActionBody[]): void {
		for (var i in enemybodys) {
			var enemybody: ActionBody = enemybodys[i];
			if (this.data.targets.indexOf(enemybody) < 0) {
				this.data.targets.push(enemybody);
			}
		}
	}
	//清除攻击目标
	public onClearTargets(): void {
		for (var targetIdx in this.data.targets) {
			this.onRemoveTarget(this.data.targets[targetIdx])
		}
		if (this.hurtBody) {
			this.hurtBody = null;
		}
	}
	//清除单个的攻击目标
	public onRemoveTarget(enemybody: ActionBody): void {
		if (this.hurtBody && this.hurtBody === enemybody) {
			this.hurtBody = null;
			this.setMove(null);
			if (this.isChagre) {
				this.overChagre();
			}
		}
		Tool.removeArrayObj(this.data.targets, enemybody);
	}
	//获取当前的攻击目标
	protected hurtBody: ActionBody;
	public get currTarget(): ActionBody {
		return this.hurtBody;
	}
	//切换当前攻击目标
	public set currTarget(target: ActionBody) {
		if (this.data.targets.indexOf(target) < 0) {
			return;
		}
		this.hurtBody = target;
	}
	//攻击动作结束
	private onAttackPlayEnd(checkKey: number): void {
		if (this._action != ACTION.ATTACK)
			return;
		// if (this._curAtkSkIdx != checkKey) {
		// 	return;
		// }
		this.onActionReset();
	}
	private onAttackHandler(): void {
		this._body.playFinishCallBack(this.onAttackPlayEnd, this, this._curAtkSkIdx);

		let skill: SkillInfo = this.data.useSkill;
		if (!skill)
			return;

		if (!this.currTarget || this.data.isDie)
			return;

		this.data.onReleaseSkill();
		if (this.isChagre) {
			this.overChagre();
		}
		this.direction = this.checkFace(this.hurtBody.x, this.hurtBody.y);
		//特效显示逻辑
		skill.attackCount = 1;
		if (!this.inMap || GameFight.getInstance().onCheckPosInMapView(this.x, this.y)) {
			//自身施法特效
			if (skill.model.effect1) {
				this.onAddDelayFunc(this.playShifaSkillEft, this, skill.model.delay1, skill);
			}
			//技能特效
			if (skill.effectClass) {
				let specialSkillEff: SkillEffectBase = SkillEffectManager.getInstance().createSkillEffect(skill, this, this.hurtBody);
				if (specialSkillEff) {
					switch (skill.effectClass) {
						case "CommonSkillEffect":
							specialSkillEff.param.param1 = `skill_effect${skill.styleNum + 1}_${this._atkAcitonIdx}_${this.getDirectionFrame()}`;
							break;
						case "FeijianSkillEffect":
						case "ShenbingSkillEffect":
							specialSkillEff.param.param1 = this.getDirectionFrame();
							break;
					}
					this.onAddDelayFunc(this.playSpecialSkillEft, this, skill.model.delay2, specialSkillEff);
					skill.attackCount = specialSkillEff.attackCount;
				}
			} else {
				if (skill.model.effect2) {
					let _skflyParam: SkillParam = new SkillParam();
					_skflyParam.eftRes = skill.model.effect2;
					_skflyParam.dirType = skill.model.isDir;
					_skflyParam.target = this.parent;
					_skflyParam.x = this.hurtBody.x;
					_skflyParam.y = this.hurtBody.y;
					_skflyParam.isBottom = skill.model.bodyLayer == "BOTTOM";
					this.onAddDelayFunc(this.onCreateEffect, this, skill.model.delay2, _skflyParam);
					skill.attackCount = skill.model.duoduan;
				}
			}
		}

		//技能施法文字效果
		this.onRemoveSkillFontAnim();
		if (skill.model.fonteffect) {
			this._skillFontEft = new Animation(skill.model.fonteffect, 1, false);
			this._skillFontEft.x = this.x;
			this._skillFontEft.y = this.y - this.data.model.high + this._mountOffY - 80;
			GameFight.getInstance().addDropBodyToLayer(this._skillFontEft);
			egret.Tween.get(this._skillFontEft).wait(1000).to({ alpha: 0 }, 500);
			this.onAddDelayFunc(this.onRemoveSkillFontAnim, this, skill.model.castTime);
		}

		if (skill.model.targetType != 0) {//BUFF技能
			this.onAddDelayFunc(this.addBuffer, this, skill.model.castTime, skill);
			// this.addBuffer(skill, this._curAtkSkIdx);
		} else {//计算伤害
			this.onHurtHandler(skill);
		}

		if (this.data.bodyType == BODY_TYPE.SELF && skill.model.zhenping == 1) {
			Tool.callbackTime(this.onEarthQuake, this, skill.model.hurtdelay);
		}
	}
	//移除掉技能文字特效
	private onRemoveSkillFontAnim(): void {
		if (this._skillFontEft) {
			egret.Tween.removeTweens(this._skillFontEft);
			this._skillFontEft.onDestroy();
			this._skillFontEft = null;
		}
	}
	//震屏
	private onEarthQuake(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_EARTHQUAKE_STRAT));
	}
	private playShifaSkillEft(skill: SkillInfo): void {
		if (this._shifaEffect) {
			this._shifaEffect.onDestroy();
			this._shifaEffect = null;
		}
		let _shifaEftRes: string;
		switch (skill.model.isDir) {
			case SKILL_DIR_TYPE.FRAME:
				_shifaEftRes = skill.model.effect1 + "_" + this.getDirectionFrame();
				break;
			default:
				_shifaEftRes = skill.model.effect1;
				break;
		}
		let _shifaParam: SkillParam = new SkillParam();
		_shifaParam.eftRes = _shifaEftRes;
		_shifaParam.dirType = skill.model.isDir;
		_shifaParam.playNum = this._actionPlayNum;
		_shifaParam.scale = skill.model.fangda / 100;
		_shifaParam.layer = skill.model.bodyLayer;
		this._shifaEffect = this.onCreateEffect(_shifaParam);
	}
	private playSpecialSkillEft(specialSkillEff: ISkillEffect): void {
		specialSkillEff.play();
	}
	/**缓存人身上的技能特效**/
	public addSkillEffectByID(skillid: number, effect: SkillEffectBase): void {
		if (!this._skillEffectsDict[skillid]) {
			this._skillEffectsDict[skillid] = effect;
		}
	}
	/**获取缓存在人身上的技能特效**/
	public getSkillEffectByID(skillID: number): SkillEffectBase {
		return this._skillEffectsDict[skillID];
	}
	/**
	 * 添加技能特效
	 * res特效资源，cachekey延迟用的ID，target添加的对象
	*/
	private onCreateEffect(param: SkillParam) {
		if (!RES.hasRes(param.eftRes + '_json')) {
			Tool.log("没有技能特效资源：：：：" + param.eftRes);
			return;
		}
		let _rotation: number = 0;
		let _diretion = null;
		let _bodyLayer: string = param.layer;
		if (param.dirType == SKILL_DIR_TYPE.FRAME) {
			_diretion = this.direction;
		} else if (param.dirType == SKILL_DIR_TYPE.ANGLE) {
			let _rotationDir: number = parseInt(String(this.direction)) - 1;
			_rotation = _rotationDir * -45;
		} else if (param.dirType == SKILL_DIR_TYPE.RADOM_ANGLE) {
			_rotation = Math.floor(Math.random() * 360);
		}

		let _effect: EffectBody = new EffectBody(param.eftRes, _diretion, param.playNum);
		_effect.x = param.x;
		_effect.y = param.y;
		_effect.rotation = _rotation;
		_effect.isUnder = param.isBottom;
		_effect.scaleX = _effect.scaleY = param.scale;
		_effect.addEventListener(Action_Event.BODY_EFFECT_DESTROY, this.effectDisposeHanlder, this);
		this.addEffectToSprite(_effect, param.target ? param.target : this, _bodyLayer);
		return _effect;
	}
	//特效移除
	private effectDisposeHanlder(event: egret.Event): void {
		let _effect: EffectBody = event.currentTarget;
		_effect.removeEventListener(Action_Event.BODY_EFFECT_DESTROY, this.effectDisposeHanlder, this);
		if (this._hurtEffBody === _effect) {
			this._hurtEffBody = null;
		}
		_effect = null;
	}
	public addEffectToSprite(effect, target?: any, layer?: string): void {
		if (this.parent && target && target === this.parent) {
			let insertchild: number = -1;
			switch (layer) {
				case "BOTTOM":
					insertchild = this.parent.getChildIndex(this);
					break;
			}
			if (this.inMap) {
				GameFight.getInstance().addBodyToMapLayer(effect, insertchild);
			} else {
				if (insertchild < 0) {
					this.parent.addChild(effect);
				} else {
					this.parent.addChildAt(effect, insertchild);
				}
			}
		} else {
			this.addEffectToSelf(layer, effect);
		}
	}
	//添加一个BUFF
	private effectBuffers;
	public addBuffer(skillinfo: SkillInfo): void {
		var delayTime: number = skillinfo.model.delay1;
		var buffId: number = skillinfo.model.buffId;
		var modelBuffer: Modelbuff = JsonModelManager.instance.getModelbuff()[buffId];
		if (!modelBuffer) {
			return;
		}
		this.data.addBuffer(buffId, skillinfo.level);

		if (modelBuffer.effect) {
			this.onAddDelayFunc(this.delayAddBuffEff, this, skillinfo.model.hurtdelay, modelBuffer);
		}
	}
	//持续的特效
	private delayAddBuffEff(modelBuffer: Modelbuff): void {
		if (!this.effectBuffers) {
			this.effectBuffers = {};
		}

		if (!this.effectBuffers[modelBuffer.id]) {
			var _buffEffect: EffectBody = new EffectBody(modelBuffer.effect, null, -1);
			_buffEffect.x = 0;
			_buffEffect.y = this._body.y;
			this.addEffectToSprite(_buffEffect, this, "TOP");
			this.effectBuffers[modelBuffer.id] = _buffEffect;
		}
	}
	//移除一个BUFF
	private removeBuffer(buffId): void {
		if (this.effectBuffers && this.effectBuffers[buffId]) {
			var _buffEffect: EffectBody = this.effectBuffers[buffId];
			_buffEffect.onDestroy();
			_buffEffect = null;
			delete this.effectBuffers[buffId];
		}
		this.data.removeBuffer(buffId);
	}
	//检测BUFF
	public checkBuffer(): void {
		for (var buffId in this.data.bufferInfoDict) {
			var buffInfo: BuffInfo = this.data.bufferInfoDict[buffId];
			if (buffInfo.isOver) {
				this.removeBuffer(buffId);
			}
		}
	}
	//清楚掉所有的BUFF状态
	public clearAllBuffer(): void {
		for (var buffId in this.data.bufferInfoDict) {
			var buffInfo: BuffInfo = this.data.bufferInfoDict[buffId];
			this.removeBuffer(buffId);
		}
	}
	//缓存延迟特效ID
	private attackDelayAry;
	private onAddDelayFunc(callback, target, time, ...param): void {
		if (!this.attackDelayAry) {
			this.attackDelayAry = {};
		}
		if (time > 0) {
			var callbackObj = { intervalId: 0, callback: callback, target: target, args: param };
			callbackObj.intervalId = Tool.callbackTime(this.onDeleteDelayFunc, this, time, callbackObj);
			this.attackDelayAry[callbackObj.intervalId] = callbackObj;
		} else {
			Tool.callback(callback, target, ...param);
		}
	}
	//移除暂存的延迟ID
	private onDeleteDelayFunc(paramObj): void {
		if (!paramObj)
			return;
		if (!this.attackDelayAry)
			return;
		var intervalId: number = paramObj.intervalId;
		if (this.attackDelayAry[intervalId]) {
			Tool.callback(paramObj.callback, paramObj.target, ...paramObj.args);
			paramObj = null;
			delete this.attackDelayAry[intervalId];
		}
	}
	//移除所有延迟函数
	private onRemoveAllDalay(): void {
		if (!this.attackDelayAry)
			return;
		for (var id in this.attackDelayAry) {
			var intervalId: number = this.attackDelayAry[id].intervalId;
			egret.clearTimeout(intervalId);
			this.attackDelayAry[id] = null;
			delete this.attackDelayAry[id];
		}
	}
	//伤害逻辑处理
	private _hurtEffBody: EffectBody;
	private onHurtHandler(skill: SkillInfo): void {
		var attackTarget: ActionBody = this.currTarget;

		if (!attackTarget) return;

		if (skill.model.buffId != 0) {//对敌人释放的一个BUFF技能 逻辑暂时没有
			return;
		}
		var targets: Array<ActionBody> = [];
		if (!attackTarget.data.isDie) {
			targets.push(attackTarget);
		}

		if (skill.model.rectType > 0) {//群攻
			var _targetbody: ActionBody;
			for (var i: number = 0; i < this.data.targets.length; i++) {
				_targetbody = this.data.targets[i];
				if (attackTarget.data.isDie)
					continue;
				if (_targetbody === attackTarget)
					continue;
				if (this.ignoreDist) {
					targets.push(_targetbody);
					continue;
				}
				var _attackDist: number = 0;
				if (skill.model.attackType == 0) {//以攻击者为圆心的计算
					_attackDist = this.distanceToSelf(_targetbody);
				} else {//以目标为圆心的计算
					_attackDist = attackTarget.distanceToSelf(_targetbody);
				}

				if (skill.model.rectType >= _attackDist) {
					targets.push(_targetbody);
				}
			}
		}

		for (var tIndex: number = targets.length - 1; tIndex >= 0; tIndex--) {
			var _enemyTarget = targets[tIndex];

			let dmgFntRes: string = "herohpDown_fnt";
			switch (this.data.bodyType) {
				case BODY_TYPE.SELF:
					dmgFntRes = "hero_damage_fnt1_fnt";
					break;
				case BODY_TYPE.RETINUE:
				case BODY_TYPE.PET:
					dmgFntRes = "hero_damage_fnt2_fnt";
					break;
			}

			let globarDmg: DamageData = this.calculateDamage(_enemyTarget, skill);
			globarDmg.attacker = this;
			globarDmg.scenetype = GameFight.getInstance().fightsceneTpye;
			if (globarDmg.judge == FightDefine.JUDGE_DODGE || globarDmg.value == 0) {
				globarDmg.isDmgFalse = this.isDamageFalse;
				globarDmg.skill = skill;
				globarDmg.damageFnt = dmgFntRes;
				globarDmg.fromDire = this.checkFace(_enemyTarget.x, _enemyTarget.y);
				_enemyTarget.onHurt(globarDmg);
				continue;
			}
			//多段伤害
			let delay: number;
			let delaytime: number;
			let ackcount: number = skill.attackCount;//skill.model.duoduan;
			let duoduanRate: number = ackcount * 4;//前几段伤害降低四倍  最后一下显示的伤害多一些
			for (let actIdx: number = 1; actIdx <= ackcount; actIdx++) {
				let _actDmgData: DamageData = new DamageData();
				_actDmgData.attacker = this;
				_actDmgData.scenetype = GameFight.getInstance().fightsceneTpye;
				_actDmgData.isDmgFalse = this.isDamageFalse;
				_actDmgData.skill = skill;
				_actDmgData.damageFnt = dmgFntRes;
				_actDmgData.value = actIdx == ackcount ? globarDmg.value - (actIdx - 1) * Math.floor(globarDmg.value / duoduanRate) : Math.floor(globarDmg.value / duoduanRate);
				_actDmgData.pojia = actIdx == ackcount ? globarDmg.pojia - (actIdx - 1) * Math.floor(globarDmg.pojia / duoduanRate) : Math.floor(globarDmg.pojia / duoduanRate);
				_actDmgData.fromDire = this.checkFace(_enemyTarget.x, _enemyTarget.y);
				_actDmgData.floatingRD = actIdx == 1 ? globarDmg.floatingRD : 100;
				_actDmgData.judge = actIdx == 1 ? globarDmg.judge : FightDefine.JUDGE_DUODUAN;
				globarDmg.value = globarDmg.value - _actDmgData.value;
				delay = Math.max(0, skill.model.castTime - skill.model.hurtdelay);
				delaytime = skill.model.hurtdelay + Math.floor(delay / ackcount) * (actIdx - 1);
				this.onAddDelayFunc(_enemyTarget.onHurt, _enemyTarget, delaytime, _actDmgData);

				if (!_actDmgData.isDmgFalse && this.data.currentHp - _actDmgData.value <= 0) {
					break;
				}
			}
		}
		targets = null;
	}
	//计算伤害
	private calculateDamage(targetBody: ActionBody, skill: SkillInfo): DamageData {
		let damage: DamageData = new DamageData();
		let random: number = GameDefine.GAME_ADD_RATIO;
		//1.判断闪避 ((B闪避-A命中)/10000)%，上限50%
		let hitValue: number = Math.max(0, targetBody.data.currentAttributes[ATTR_TYPE.DODGE] - this.data.currentAttributes[ATTR_TYPE.HIT]) / random;
		//2.判断暴击 ((A暴击-B抗暴)*15*攻击者等级^-1.9)%，上限50%
		let critValue: number = Math.max(0, this.data.currentAttributes[ATTR_TYPE.CRIT] - targetBody.data.currentAttributes[ATTR_TYPE.DUCT]) / random;
		//3.判断招架 ((B招架-A破招)*15*被击者等级^-1.9）%，上限70%
		let blockValue: number = Math.max(0, targetBody.data.currentAttributes[ATTR_TYPE.BLOCK] - this.data.currentAttributes[ATTR_TYPE.BREAK]) / random;

		hitValue = Math.min(hitValue * random, 5000);
		critValue = Math.min(critValue * random, 5000);
		blockValue = Math.min(blockValue * random, 7000);

		random = this.data.randomValue;
		//麻痹概率
		let mabiValue: number = 0;
		if (targetBody.data.bodyType == BODY_TYPE.BOSS && GameFight.getInstance().unableArtifactBoss) {
			mabiValue = 0;
		} else {
			mabiValue = this.data.mabiRatio;
		}
		//沉默概率
		let chenmoValue: number = this.data.chenmoRatio;
		//得到判定结果
		damage.judge = FightDefine.getFightJudge(random, mabiValue, chenmoValue, hitValue, critValue, blockValue);
		if (damage.judge == FightDefine.JUDGE_CHENMO) {
			if (targetBody.data.bodyType == BODY_TYPE.PLAYER || targetBody.data.bodyType == BODY_TYPE.ROBOT || targetBody.data.bodyType == BODY_TYPE.SELF) {
			} else {
				damage.judge = -1;
			}
		}

		//闪避判定不计算伤害
		if (damage.judge != FightDefine.JUDGE_DODGE) {
			//特殊效果
			//基础判定*基础系数
			let judgeRatio: number = FightDefine.BASE_RATIO;

			if (FightDefine.JUDGE_CRIT == damage.judge) {//暴击判定*暴击系数
				judgeRatio = FightDefine.CRIT_RATIO;
			} else if (FightDefine.JUDGE_BLOCK == damage.judge) {//招架判定*招架系数
				judgeRatio = FightDefine.BLOCK_RATIO;
			} else if (FightDefine.JUDGE_MABI == damage.judge) {
				targetBody.data.onHitMaBi(this.data.mabiEffect);
			} else if (FightDefine.JUDGE_CHENMO == damage.judge) {
				targetBody.data.onHitChenMo(this.data.chenmoEffect);
			}
			//基础伤害 = A攻击>B防御*防御系数？A攻击：A攻击*攻击系数
			let defValue: number = skill.model.hurtType == SKILL_HURT_TYPE.PHY_HURT ? targetBody.data.currentAttributes[ATTR_TYPE.PHYDEF] : targetBody.data.currentAttributes[ATTR_TYPE.MAGICDEF];//防御值 物防还是法防
			damage.value = Tool.toInt(this.data.currentAttributes[ATTR_TYPE.ATTACK] - defValue);
			damage.value = damage.value > Tool.toInt(this.data.currentAttributes[ATTR_TYPE.ATTACK] * FightDefine.ATTACK_RATIO) ? damage.value : Tool.toInt(this.data.currentAttributes[ATTR_TYPE.ATTACK] * FightDefine.ATTACK_RATIO);

			//添加技能系数*技能基础伤害+技能额外伤害
			damage.value = Tool.toInt(damage.value * skill.getBaseDamage() + skill.getExtraDamage());
			//添加判定系数
			damage.value = Tool.toInt(damage.value * judgeRatio);

			//添加浮动值上下5% 
			if (random >= 0) {
				damage.floatingRD = 100 + 5 - Tool.toInt(random / 1000);
				damage.value = Tool.toInt(damage.value * (damage.floatingRD / 100));
			}
			//破甲
			let pojiaValue: number = Tool.toInt(damage.value * this.data.pojiaEffect / GameDefine.GAME_ADD_RATIO);
			damage.value = damage.value + pojiaValue;
			damage.pojia = pojiaValue;

			if (GameFight.getInstance().isPVPFightScene && egret.is(this, 'PlayerBody') && egret.is(targetBody, 'PlayerBody')) {
				damage.value = Tool.toInt(damage.value / FightDefine.PVPFIGHT_DAMAGE_RATE);
			}
		}

		return damage;
	}
	//被击
	public onHurt(damage: DamageData): void {
		if (this.data.isDie) return;
		if (damage.scenetype != GameFight.getInstance().fightsceneTpye) return;

		switch (damage.judge) {
			case FightDefine.JUDGE_MABI:
				if (!this._mabiAnim) {
					this._mabiAnim = new EffectBody(`mabiEffect`, null, -1);
					this._mabiAnim.y = -(this.data.model.high / 2) + this._mountOffY;
					this.addEffectToSprite(this._mabiAnim, this, 'TOP');
				}
				this.allBodyStop();
				break;
			case FightDefine.JUDGE_CHENMO:
				if (!this._chenmoAnim) {
					this._chenmoAnim = new EffectBody(`chenmoEffect`, null, -1);
					this._chenmoAnim.y = -(this.data.model.high / 2) + this._mountOffY;
					this.addEffectToSprite(this._chenmoAnim, this, 'TOP');
				}
				break;
			default:
				this.playHurtAnim(damage.skill);
				break;
		}

		if (!damage.isDmgFalse) {
			let _hasDeathCount: boolean = this.data.deathCount > 0;
			if (_hasDeathCount) {
				if (damage.judge != FightDefine.JUDGE_DUODUAN) {
					this.hp = this.data.currentHp - 1;
				}
			} else {
				let oldShield: number = this.data.shieldValue;
				let lostHp: number = Math.max(0, damage.value - this.data.shieldValue);
				this.data.shieldValue = Math.max(0, this.data.shieldValue - damage.value)
				this.hp = this.data.currentHp - lostHp;
				damage.xishou = Math.max(0, oldShield - this.data.shieldValue);
			}
			this.addFlyFont(damage);
		}

		//攻击通知
		GameFight.getInstance().fightScene.onBodyHurtHanlder(damage.attacker, this, damage);//我的攻击通知

		this.onCheckDeath();
	}
	//受创特效
	private playHurtAnim(skillInfo: SkillInfo): void {
		if (!GameFight.getInstance().onCheckPosInMapView(this.x, this.y)) return;
		//受创的特效
		if (skillInfo && skillInfo.model && skillInfo.model.hurteffect) {
			var _hurtEffX: number = 0;
			var _hurtEffY: number = 0;
			if (skillInfo.model.hurtpos == HURT_POS_TYPE.CENTER) {
				_hurtEffY += -(this.data.model.high / 2);
			} else if (skillInfo.model.hurtpos == HURT_POS_TYPE.CENTER_WITH_DIR) {
				_hurtEffY += -(this.data.model.high / 2);
			}
			if (this._hurtEffBody) {
				this._hurtEffBody.visible = false;
				this._hurtEffBody.onDestroy();
				this._hurtEffBody = null;
			}

			let _hurtParam: SkillParam = new SkillParam();
			_hurtParam.eftRes = skillInfo.model.hurteffect;
			_hurtParam.dirType = SKILL_DIR_TYPE.RADOM_ANGLE;
			_hurtParam.x = _hurtEffX;
			_hurtParam.y = _hurtEffY;
			this._hurtEffBody = this.onCreateEffect(_hurtParam);
		}
	}
	//中了麻痹的特效
	protected allBodyStop(): void {
		if (this._body) {
			this._body.onStop();
		}
	}
	private _mabiAnim: EffectBody;
	public removeMaBiAnim(): void {
		if (this._mabiAnim) {
			this._mabiAnim.onDestroy();
			this._mabiAnim = null;
		}
	}
	//中了沉默的特效
	private _chenmoAnim: EffectBody;
	public removeChenMoAnim(): void {
		if (this._chenmoAnim) {
			this._chenmoAnim.onDestroy();
			this._chenmoAnim = null;
		}
	}
	//处理飘字
	public addFlyFont(damage: DamageData): void {
		//麻痹 沉默
		if (damage.judge == FightDefine.JUDGE_MABI) {
			damage.value = 0;
			PromptPanel.getInstance().onCreateDamageFont(damage, this);
			damage.judge = -1;
		} else if (damage.judge == FightDefine.JUDGE_CHENMO) {
			damage.value = 0;
			PromptPanel.getInstance().onCreateDamageFont(damage, this);
			damage.judge = -1;
		}
		//吸收 破甲
		if (damage.xishou > 0) {
			damage.value = damage.value - damage.xishou;

			damage.judge = FightDefine.JUDGE_XISHOU;
			PromptPanel.getInstance().onCreateDamageFont(damage, this);
		} else if (damage.pojia > 0) {
			damage.value = damage.value - damage.pojia;
			Tool.callbackTime(function (damage: DamageData) {
				damage.judge = FightDefine.JUDGE_POJIA;
				PromptPanel.getInstance().onCreateDamageFont(damage, this);
			}, this, 100, damage);
		}
		if (damage.value > 0 || damage.judge == FightDefine.JUDGE_DODGE) {
			PromptPanel.getInstance().onCreateDamageFont(damage, this);
		}
	}
	// private removeFloatFont(floatFont: FlyFontBody) {
	// 	floatFont.floatGC();
	// 	floatFont = null;
	// }
	//检查死亡
	protected onCheckDeath(): boolean {
		if (this.data.isDie) {
			if (this.data.reborncount > 0) {
				this.data.onRebornEffect();
				this.onPlayRebornAnim();
			}

			if (this.data.isDie) {
				this.onDeath();
				return true;
			}
		}
		return false;
	}
	//死亡
	public onDeath(): void {
		if (this._action != ACTION.DEATH) {
			// this.onRide(false);//死亡下坐骑
			this.setMove(null);
			this.onChangeAction(ACTION.DEATH);
		}
		this.dispatchEvent(new egret.Event(Action_Event.BODY_DEATH_FINISH));
	}
	//播放复活特效
	public onPlayRebornAnim(): void {
		let _rebornParam: SkillParam = new SkillParam();
		_rebornParam.eftRes = `qihunshengji`;
		_rebornParam.dirType = SKILL_DIR_TYPE.NULL;
		_rebornParam.x = 0;
		_rebornParam.y = -(this.data.model.high / 2);
		var rebornDMG: DamageData = new DamageData();
		rebornDMG.judge = FightDefine.JUDGE_FUHUO;
		PromptPanel.getInstance().onCreateDamageFont(rebornDMG, this);
	}
	//乘骑动作(乘骑的开关只能通过这个方法来控制) 暂时屏蔽 永不下马
	public onRide(isRide: boolean): void {
		// if (this._isRide != isRide) {
		// 	this._isRide = this._hasMount ? isRide : false;
		// 	this.updateAction();
		// }
	}
	public get mountOffY(): number {
		return this._mountOffY;
	}
	//返回乘骑类型
	protected get mountType(): MOUNT_TYPE {
		return MOUNT_TYPE.NO_MOUNT;
	}
	//更新生物血量
	protected onResetHeadInfo(): void {
		this.bodyHead.bodyName = this.data.bodyType == BODY_TYPE.SELF ? "" : this.data.name;
		this.updateHP(this.data.currentHp, this.data.maxHp);
	}
	//隐藏名字血条
	public onHideHeadBar(visible: boolean): void {
		this.bodyHead.visible = visible;
	}
	public set hp(hpValue: number) {
		this.data.onRestHpInfo(hpValue);
		this.updateHP(hpValue);
	}
	//设置几刀砍死
	public setDeathCount(curr, max = 0): void {
		max = Math.max(max, curr);
		this.data.deathCount = max;
		this.updateHP(curr, max);
	}
	//更新血量 附带重置血条
	protected updateHP(hpValue: number, maxValue: number = 0) {
		this.data.onRestHpInfo(hpValue, maxValue);
		this.bodyHead.maximum = this.data.maxHp;
		this.bodyHead.value = this.data.currentHp;
	}
	//往生物身上加特效
	public addEffectToSelf(type: string, body): void {
		switch (type) {
			case "TOP":
				this.foreLayer.addChild(body);
				break;
			case "BOTTOM":
				this.bottomLayer.addChild(body);
				break;
			case "HEAD":
				this.bodyHead.addAnimToHead(body);
				break;
		}
	}
	//人物聊天泡泡
	private _bodytalkUI: eui.Component;
	private _talkIntervalId: number = -1;
	public bodySpeak(talkword: string): void {
		if (!this._bodytalkUI) {
			this._bodytalkUI = new eui.Component();
			this._bodytalkUI.skinName = skins.ChatBodySkin;
			this.bodyHead.addChild(this._bodytalkUI);
			this._bodytalkUI.bottom = 26;
		}
		let talkDir: string = 'right';
		this._bodytalkUI.x = 0;
		if (this.direction == Direction.LEFT || this.direction == Direction.LEFTDOWN || this.direction == Direction.LEFTUP) {
			talkDir = 'left';
		}
		this._bodytalkUI.currentState = talkDir;
		(this._bodytalkUI["talk_label"] as eui.Label).textFlow = (new egret.HtmlTextParser).parse(talkword);
		// if (this._bodytalkUI.currentState == "left") {
		// 	this._bodytalkUI.x = -this.data.model.width;
		// } else if (this._bodytalkUI.currentState == "right") {
		// 	this._bodytalkUI.x = this.data.model.width / 2;
		// }
		if (this._talkIntervalId >= 0) {
			egret.clearTimeout(this._talkIntervalId);
		}
		this._talkIntervalId = Tool.callbackTime(this.onRemoveSpeak, this, GameDefine.BodyChat_ShowTime);
	}
	private onRemoveSpeak(): void {
		this._talkIntervalId = -1;
		if (this._bodytalkUI) {
			this._bodytalkUI.removeChildren();
			if (this._bodytalkUI.parent)
				this._bodytalkUI.parent.removeChild(this._bodytalkUI);
			this._bodytalkUI = null;
		}
	}
	//进行冲锋
	public playChagre(pointPaths: Array<egret.Point>, onlyWalk: boolean = false): void {
	}
	//结束冲锋
	public overChagre(): void {
	}
	//判断是不是在冲锋
	public get isChagre(): boolean {
		return false;
	}
	protected _isDamageFalse: boolean = false;//只播发攻击但不能实际造成伤害的人
	public set isDamageFalse(bool: boolean) {
		this._isDamageFalse = bool;
	}
	public get isDamageFalse(): boolean {
		return this._isDamageFalse;
	}
	//设置被遮挡处理
	private _isCover: boolean;
	public onSetCover(iscover: boolean): void {
		if (iscover != this._isCover) {
			this._isCover = iscover;
			this.alpha = this._isCover ? GameDefine.Cover_Alpha_Value : 1;
		}
	}
	//这个是完全删除
	public onDestroy(): void {
		this.data.onRestHpInfo(0);
		if (this._body) {
			this._body.onDestroy();
			this._body = null;
		}
		this.onDestoryCacheSkillEft();
	}
	private onDestoryCacheSkillEft(): void {
		for (let effectID in this._skillEffectsDict) {
			let skilleffect: SkillEffectBase = this._skillEffectsDict[effectID];
			skilleffect.onDestory();
			skilleffect = null;
			delete this._skillEffectsDict[effectID];
		}
		this._skillEffectsDict = {};
	}
	public onResetSkillEffect(): void {
		this._atkAcitonIdx = 0;
		this.onDestoryCacheSkillEft();
	}
	//状态重置
	public onReset(): void {
		super.onReset();
		if (this.isPlayJump) {
			this.onFinishJump();
		}

		this.clearAllBuffer();
		this.onRemoveSpeak();
		this.onActionReset();
		this.onRemoveAllDalay();
		this.foreLayer.removeChildren();
		this.bottomLayer.removeChildren();
		this.data.isStop = null;
		this.data.hasArtifactEft = null;
		this.isDamageFalse = false;
		this.ignoreDist = false;
		this._hurtEffBody = null;
		if (this.alpha != 1) {
			this.alpha = 1;
		}
		if (!this.visible) {
			this.visible = true;
		}
		this.removeMaBiAnim();
		this.removeChenMoAnim();
		this.onRemoveSkillFontAnim();
	}
	//The end
}
class BodyHead extends eui.Component {
	private grade_lab: eui.Label;
	private nameLabel: eui.Label;
	private hpBar: eui.ProgressBar;
	private title_group: eui.Group;
	private anim_group: eui.Group;
	public damage_group: eui.Group;

	public constructor() {
		super();
		this.skinName = skins.BodyHead;
	}
	public set bodyName(name: string) {
		if (this.nameLabel.text != name)
			this.nameLabel.text = name;
	}
	public set bodyGrade(name: string) {
		if (this.grade_lab.text != name)
			this.grade_lab.text = name;
	}
	public set nameColor(color) {
		if (this.nameLabel.textColor != color)
			this.nameLabel.textColor = color;
	}
	public set maximum(value: number) {
		value = Math.max(0, value);
		this.hpBar.maximum = value;
	}
	public set value(value: number) {
		if (value < 0) {
			return;
		}
		this.hpBar.value = value;
	}
	public showorhideHpPro(bool: boolean): void {
		this.hpBar.visible = bool;
	}
	// public updateThumbSource(source: string): void {
	// 	(this.hpBar["thumb"] as eui.Image).source = source;
	// }
	public hpProBarSkinName(skinName): void {
		this.hpBar.skinName = skinName;
	}
	//添加到Head层
	public addAnimToHead(body): void {
		this.onRefreshLayout();
		this.anim_group.addChild(body);
	}
	private onRefreshLayout(): void {
		var _height: number = 0;
		for (var i: number = 0; i < this.title_group.numChildren; i++) {
			_height += this.title_group.getChildAt(i).height / 2;
		}
		this.anim_group.y = -_height;
	}
	//添加称号
	public addTitleToHead(body): void {
		this.title_group.addChild(body);
		this.onRefreshLayout();
	}
}
enum Direction {
	DOWN = 1,
	RIGHTDOWN = 2,
	RIGHT = 3,
	RIGHTUP = 4,
	UP = 5,
	LEFTUP = 6,
	LEFT = 7,
	LEFTDOWN = 8,
}
enum ACTION {
	NULL = 0,
	STAND = 1,
	MOVE = 2,
	ATTACK = 3,
	DEATH = 4,
	JUMP = 5,
	HURT = 6,
}
enum MOUNT_TYPE {
	NO_MOUNT = 0,//无坐骑
	RIDE_MOUNT = 1,//骑坐骑
	STAND_MOUNT = 2,//踩坐骑
}
var Action_Event = {
	BODY_EFFECT_DESTROY: "game_effect_destroy",
	BODY_DEATH_FINISH: "game_body_death_finish",
};
enum HURT_POS_TYPE {
	BOTTOM = 0,//脚下
	CENTER = 1,//身子中心
	CENTER_WITH_DIR = 2,//击中且有方向的
}
enum SKILL_DIR_TYPE {
	NULL = 0,
	FRAME = 1,//按帧名
	ANGLE = 2,//按角度
	RADOM_ANGLE = 3,//随机角度
}