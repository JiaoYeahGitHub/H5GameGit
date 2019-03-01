class PlayerBody extends ActionBody {
    private _mountBody: BodyAnimation;
    private _weaponBody: BodyAnimation;
    private _wingBody: BodyAnimation;
    private _titlebody: TitleBody;

    //--------旧的 暂时不用
    // private _mountHeadBody: BodyAnimation;

    public constructor() {
        super();
    }
    //角色数据
    public set data(data: PlayerData) {
        egret.superSetter(PlayerBody, this, "data", data);
    }
    public get data(): PlayerData {
        return this._data as PlayerData;
    }
    //更新生物血量
    protected onResetHeadInfo(): void {
        super.onResetHeadInfo();
        if (this.data.bodyType != BODY_TYPE.SELF && GameFight.getInstance().isPVPFightScene) {
            this.bodyHead.hpProBarSkinName(skins.HpProgressBar2);
        } else {
            this.bodyHead.hpProBarSkinName(skins.HpProgressBar1);
        }
        this.onRefreshLevelShow();
    }
    public onRefreshLevelShow(): void {
        let coatardLv: number = this.data.coatardLv;
        // let coatardmodel: Modellevel2coatardLv = JsonModelManager.instance.getModellevel2coatardLv()[coatardLv - 1];
        // if (coatardmodel) {
        //     this.bodyHead.bodyGrade = Language.instance.getText('coatard_level' + coatardLv) + "·" + coatardmodel.name;
        // } else {
        //     this.bodyHead.bodyGrade = '';
        // }
    }
    public onRefreshData(): void {
        this._mountOffY = -45;
        this.onCheckDeath();

        this.onResetHeadInfo();
        this.onChangeTitleBody();
        this.onRefreshShield();
        this.onCheckRetinue();
    }
    public onCheckRetinue(): void {
        this.createMagic();
        // this.createRetinue();
        this.createPets();
    }
    //更新护盾
    public onRefreshShield(): void {
        if (this.data.shieldValue > 0) {
            if (!this._shieldAnim) {
                this._shieldAnim = new EffectBody(`hudunEffect`, null, -1);
                this._shieldAnim.y = -(this.data.model.high / 2) + this.mountOffY;
                this.addEffectToSprite(this._shieldAnim, this, 'TOP');
            }
        } else {
            this.removeShieldAnim();
        }
    }
    //外形更新
    public onUpdateAvatar(): void {
        super.onUpdateAvatar();
    }
    //更换动作
    protected updateAction(): void {
        super.updateAction();
        this.onChangeBody();
        this.onChangeMountBody();
        this.onChangeWeaponBody();
        this.onChangeWingBody();
        this.refreshBodyHeight();
    }
    //更换人物模型
    private onChangeBody(): void {
        if (this.data && this.data.cloth_res) {
            var actionName: string = this.actionName;
            if (actionName) {
                var resName: string = LoadManager.getInstance().getClothResUrl(this.data.cloth_res, actionName, this.getDirectionFrame());
                if (!this._body) {
                    this._body = new BodyAnimation(resName, this._actionPlayNum, this.getDirectionFrame());
                } else {
                    this._body.onUpdateRes(resName, this._actionPlayNum, this.getDirectionFrame());
                }
            } else {
                if (this._body) {
                    this._body.onUpdateRes(ChannelDefine.cdnUrl + "resource/model/model_action_null", 0, null);
                }
            }

            if (this._body) {
                this.addLayerOrder(this._body, PLAYER_LAYER.BODY);
            }
        }
    }
    //更换武器模型
    private onChangeWeaponBody(): void {
        if (this.data && this.data.weapon_res) {
            var actionName: string = this.actionName;
            if (this.data.sex == SEX_TYPE.MALE) {
                switch (actionName) {
                    case "stand":
                        actionName = actionName + "Nan";
                        break;
                    case "attack1":
                        actionName = "attack7";
                        break;
                    case "attack2":
                        actionName = "attack8";
                        break;
                    case "attack3":
                        actionName = "attack9";
                        break;
                    case "attack5":
                        actionName = "";
                        break;
                }
            }
            if (!actionName || this._atkAcitonIdx == 6) {
                if (this._weaponBody) {
                    this._weaponBody.onUpdateRes(ChannelDefine.cdnUrl + "resource/model/model_action_null", 0, null);
                }
            } else {
                var resName = LoadManager.getInstance().getWeaponResUrl(this.data.weapon_res, actionName, this.getDirectionFrame());
                if (!this._weaponBody) {
                    this._weaponBody = new BodyAnimation(resName, this._actionPlayNum, this.getDirectionFrame());
                } else {
                    this._weaponBody.onUpdateRes(resName, this._actionPlayNum, this.getDirectionFrame());
                }

                let _weaponLayer: number = PLAYER_LAYER.WEAPON;
                if (this.direction == Direction.DOWN || this.direction == Direction.LEFTUP || this.direction == Direction.LEFT || this.direction == Direction.LEFTDOWN) {
                    _weaponLayer = PLAYER_LAYER.MOUNT + 1;
                }
                this.addLayerOrder(this._weaponBody, _weaponLayer);
            }
        } else {
            if (this._weaponBody) {
                this._weaponBody.onDestroy();
                this._weaponBody = null;
            }
        }
    }
    //翅膀模型
    private _wingResName: string;
    private onChangeWingBody(): void {
        if (this.data && this.data.wing_res) {
            let actionName: string = 'ride_stand';
            if (this._action == ACTION.JUMP) {
                if (this._wingBody) {
                    this._wingBody.onUpdateRes(ChannelDefine.cdnUrl + "resource/model/model_action_null", 0, null);
                }
            } else {
                let resName: string = LoadManager.getInstance().getWingResUrl(this.data.wing_res, actionName, this.getDirectionFrame());
                if (resName != this._wingResName) {
                    this._wingResName = resName;
                    if (!this._wingBody) {
                        this._wingBody = new BodyAnimation(resName, -1, this.getDirectionFrame());
                    } else {
                        this._wingBody.onUpdateRes(resName, -1, this.getDirectionFrame());
                    }
                }
                let _wingLayer: number = PLAYER_LAYER.WING;
                if (this.direction == Direction.DOWN || this.direction == Direction.RIGHTDOWN || this.direction == Direction.LEFTDOWN) {
                    _wingLayer = PLAYER_LAYER.MOUNT + 1;
                }
                this.addLayerOrder(this._wingBody, _wingLayer);
            }
        } else {
            if (this._wingBody) {
                this._wingBody.onDestroy();
                this._wingBody = null;
            }
        }
    }
    /**隐藏翅膀**/
    public onHideWing(isHide): void {
        if (this._wingBody) {
            this._wingBody.visible = !isHide;
        }
    }
    public showWingEffect(): void {
        if (this._wingBody) {
            this._wingBody.visible = true;
            this._wingBody.alpha = 0;
            egret.Tween.get(this._wingBody).to({ alpha: 1 }, 500).call(function () {
                if (this._wingBody) {
                    egret.Tween.removeTweens(this._wingBody);
                }
            }, this);
        }
    }
    /**乘骑逻辑**/
    //更换乘骑模型
    private onChangeMountBody(): void {
        var resName: string;
        if (this.data) {
            var actionName: string = 'stand';
            resName = LoadManager.getInstance().getFeijianUrl(this.data.feijian_Res, actionName, this.getDirectionFrame());
            // if (this.mountType == MOUNT_TYPE.RIDE_MOUNT) {
            //     if (this.data.mount_Res) {
            //         resName = LoadManager.getInstance().getMountResUrl(this.data.mount_Res, actionName, this.getDirectionFrame());
            //     }
            // } else if (this.mountType == MOUNT_TYPE.STAND_MOUNT) {
            //     if (this.data.feijian_Res) {
            //         resName = LoadManager.getInstance().getFeijianUrl(this.data.feijian_Res, actionName, this.getDirectionFrame());
            //     }
            // }
        }

        if (resName) {
            if (!this._mountBody) {
                this._mountBody = new BodyAnimation(resName, -1, this.getDirectionFrame());
            } else {
                this._mountBody.onUpdateRes(resName, -1, this.getDirectionFrame());
            }
            this.addLayerOrder(this._mountBody, PLAYER_LAYER.MOUNT);
        } else {
            if (this._mountBody) {
                this._mountBody.onDestroy();
                this._mountBody = null;
            }
        }
    }
    /**隐藏坐骑**/
    public onHideRide(isHide): void {
        if (this._mountBody) {
            this._mountBody.visible = !isHide;
        }
    }
    public showRideEffect(): void {
        if (this._mountBody) {
            this._mountBody.visible = true;
            this._mountBody.alpha = 0;
            egret.Tween.get(this._mountBody).to({ alpha: 1 }, 500).call(function () {
                if (this._mountBody) {
                    egret.Tween.removeTweens(this._mountBody);
                }
            }, this);
        }
    }
    // protected get mountRideActName(): string {
    //     let mountAppearId: number = this.data.getAppearID(BLESS_TYPE.HORSE);
    //     let mountoptmodel: Modelmountparam = JsonModelManager.instance.getModelmountparam()[mountAppearId];
    //     if (this.isMoving) {
    //         return mountoptmodel ? mountoptmodel['monut_run'] : "move";
    //     } else {
    //         return mountoptmodel ? mountoptmodel['mount_stand'] : "stand";
    //     }
    // }
    // protected get roleStandAction(): string {
    //     let mountAppearId: number = this.data.getAppearID(BLESS_TYPE.HORSE);
    //     let mountoptmodel: Modelmountparam = JsonModelManager.instance.getModelmountparam()[mountAppearId];
    //     let actionName: string = "";
    //     if (mountoptmodel) {
    //         actionName = mountoptmodel['p_stand'];
    //     } else {
    //         actionName = "ride_stand";
    //     }
    //     return actionName;
    // }
    // protected get roleMoveAction(): string {
    //     let mountAppearId: number = this.data.getAppearID(BLESS_TYPE.HORSE);
    //     let mountoptmodel: Modelmountparam = JsonModelManager.instance.getModelmountparam()[mountAppearId];
    //     let actionName: string = "";
    //     if (mountoptmodel) {
    //         actionName = mountoptmodel['p_run'];
    //     } else {
    //         actionName = "ride_walk";
    //     }
    //     return actionName;
    // }
    // private onChangeMountHeadBody(): void {
    //     if (this.data && this.data.mount_Res) {
    //         var actionName: string = this.mountRideActName;
    //         if (actionName == "" && this._mountHeadBody) {
    //             return;
    //         }
    //         var resName: string;
    //         resName = LoadManager.getInstance().getMountResUrl(this.data.mount_Res, actionName, this.getDirectionFrame(), true);

    //         if (!this._mountHeadBody) {
    //             this._mountHeadBody = new BodyAnimation(resName, -1, this.getDirectionFrame());
    //             this._mountHeadBody.scaleX = 1.25;
    //             this._mountHeadBody.scaleY = 1.25;
    //         } else {
    //             this._mountHeadBody.onUpdateRes(resName, -1, this.getDirectionFrame());
    //         }
    //         this.addLayerOrder(this._mountHeadBody, PLAYER_LAYER.MOUNT_UP);
    //     } else {
    //         if (this._mountHeadBody) {
    //             this._mountHeadBody.onDestroy();
    //             this._mountHeadBody = null;
    //         }
    //     }
    // }
    //更新人物的身高
    private refreshBodyHeight(): void {
        let action_offY: number = this._mountOffY;
        if (this._action == ACTION.ATTACK && this._atkAcitonIdx == 5) {
            action_offY = this._mountOffY - 30;
        }

        if (this._body && this._body.y != this._mountOffY) {
            this._body.y = this._mountOffY;
        }
        if (this._weaponBody && this._weaponBody.y != this._mountOffY) {
            this._weaponBody.y = this._mountOffY;
        }
        if (this._wingBody && this._wingBody.y != action_offY) {
            this._wingBody.y = action_offY;
        }
        if (this._magicBody) {
            this._magicBody.refreshBodyHeight(this._mountOffY);
        }
        this.onUpdateHeadPos();
    }
    //更新称号
    public onChangeTitleBody(): void {
        let modelTitle: Modelchenghao;
        if (this.data) {
            modelTitle = JsonModelManager.instance.getModelchenghao()[this.data.titleId];
        }
        if (modelTitle) {
            if (!this._titlebody) {
                this._titlebody = new TitleBody(modelTitle);
                this.bodyHead.addTitleToHead(this._titlebody);
            } else {
                this._titlebody.onupdate(modelTitle);
            }
        } else {
            if (this._titlebody) {
                this._titlebody.onDestroy();
                this._titlebody = null;
            }
        }
    }
    //更新人物头顶位置
    protected onUpdateHeadPos(): void {
        if (this.data) {
            let action_offY: number = this._mountOffY;
            if (this._action == ACTION.ATTACK && this._atkAcitonIdx == 5) {
                action_offY = this._mountOffY - 30;
            }
            this.bodyHead.x = -this.bodyHead.width / 2;
            this.bodyHead.y = action_offY - this.data.model.high - 30;
        }
    }
    //设置路径
    public setMove(pointPaths: Array<egret.Point>) {
        super.setMove(pointPaths);
        if (pointPaths) {
            let movePoint: egret.Point = pointPaths.length > 0 ? pointPaths[pointPaths.length - 1] : this.moveTarget;
            if (this._magicBody && movePoint) {
                let targetPoint: egret.Point = Tool.randomPosByDistance(movePoint.x, movePoint.y, 60);
                this._magicBody.setFollowPaths(targetPoint);
            }
            if (this._petbody && movePoint && !this.isPlayJump) {
                this._petbody.setFollowPaths(movePoint);
            }
        }
    }
    //跳跃的处理
    protected _jumpFrameCount: number;
    protected _jumpFrameTime: number;
    protected _jumpDist: number;
    public onJump(point: egret.Point, onlyWalk: boolean = false): void {
        if (!point || this.isPlayJump) { return; }
        let startPos: egret.Point = this.selfPoint;
        let atkDist: number = this.data.useSkill ? this.data.useSkill.model.dist : 0;
        while (egret.Point.distance(startPos, point) > GameDefine.PLAYER_JUMP_DIST + atkDist) {
            let jumpPos: egret.Point = Tool.getPosByTwoPoint(startPos.x, startPos.y, point.x, point.y, GameDefine.PLAYER_JUMP_DIST);
            if (!this._jumpPoints) {
                this._jumpPoints = [];
            }
            this._jumpPoints.push(jumpPos);
            startPos = jumpPos;
        }

        if (this.isPlayJump) {
            this._jumpPoints.push(point);
            this.onHideRide(true);
            if (onlyWalk) {
                this.walkOn = true;
            }
            this.onInitJump();
            super.onJump(point, onlyWalk);
        } else {
            this.playChagre([point], onlyWalk);
        }
    }
    protected onInitJump(): void {
        if (!this.isPlayJump) {
            return;
        }

        let curTargetPos: egret.Point = this._jumpPoints.shift();
        if (this._jumpPoints.length == 0) {
            this.onFinishJump();
            this.playChagre([curTargetPos], this.walkOn);
        } else {
            this.setMove([curTargetPos]);
            this._jumpDist = this.getDistToTarget();
            this._jumpFrameCount = 0;
            this._jumpFrameTime = 0;
        }
    }
    protected onJumpHandler(): void {
        if (egret.getTimer() - this.walkLogicTime < 20) {
            return;
        }
        this.moveSpeed = this._jumpDist * 1.2;
        //Y的位移
        let upTime: number = 250 - (this._dt * this._jumpFrameCount);
        if (upTime > 0) {//起跳
            this.childOffY = Math.ceil(this.childOffY - (upTime / 10));
        } else {//下落
            this.childOffY = Math.min(0, this.childOffY + 20);
        }
        //变帧
        if (egret.getTimer() - this._jumpFrameTime >= 60) {
            if (this._jumpFrameCount >= 0 && this._jumpFrameCount <= 6) {
                if (this._body)
                    this._body.gotoAndStop(this._jumpFrameCount);
                if (this._weaponBody)
                    this._weaponBody.gotoAndStop(this._jumpFrameCount);
                this._jumpFrameTime = egret.getTimer();
                //幻影
                let ghostContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
                this.modelGhostHandler(this._body, ghostContainer);
                this.modelGhostHandler(this._weaponBody, ghostContainer);
                this.modelGhostHandler(this._wingBody, ghostContainer);
                ghostContainer.scaleX = this.bodyLayer.scaleX;
                ghostContainer.scaleY = this.bodyLayer.scaleY;
                ghostContainer.alpha = 0.8;
                this.addEffectToSprite(ghostContainer, this.parent, "BOTTOM");
                ghostContainer.x = this.x;
                ghostContainer.y = this.y;
                TweenLiteUtil.onHideTween(ghostContainer, this.disposeGhoseHandler, this);

                this._jumpFrameCount++;
            }
        }

        this.walkLogicTime = egret.getTimer();
        super.logicMove(this._dt);
    }
    protected onFinishJump(): void {
        this.showRideEffect();
        this.showWingEffect();
        super.onFinishJump();
    }
    //攻击
    public onAttack(): void {
        super.onAttack();
        //随从技能
        if (this._petbody && this.hurtBody) {
            this._petbody.onAddEnemyBodyList(this.data.targets);
            this._petbody.currTarget = this.hurtBody;
            this._petbody.onAttack();
            this._petbody.onClearTargets();
        }
    }
    //进行冲锋
    private _isChagre: boolean;
    public playChagre(pointPaths: Array<egret.Point>, onlyWalk: boolean = false): void {
        if (!this._isChagre) {
            this._isChagre = true;
            this.moveSpeed = GameDefine.CHONGFENG_SPEED;
            if (this._retinuebody) {
                this._retinuebody.moveSpeed = GameDefine.CHONGFENG_SPEED;
            }
        }
        this.onActionReset();

        if (onlyWalk) {
            this.setWalkOn(pointPaths);
        } else {
            this.setMove(pointPaths);
        }

        if (this.data.bodyType == BODY_TYPE.SELF) {
            if (this.ctGhostTime == 0) {
                this.ctGhostTime = egret.getTimer() + 100;
            }
        }
    }
    //结束冲锋
    public overChagre(): void {
        this._isChagre = false;
        this.ctGhostTime = 0;
        this.moveSpeed = GameDefine.Define_Move_Speed;
    }
    //判断是不是在冲锋
    public get isChagre(): boolean {
        return this._isChagre;
    }
    //创建幻影
    private ctGhostTime: number = 0;
    public onCreateGhost(): void {
        if (this.ctGhostTime - egret.getTimer() > 0)
            return;
        this.ctGhostTime = egret.getTimer() + 100;
        var ghostContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

        this.modelGhostHandler(this._mountBody, ghostContainer);
        this.modelGhostHandler(this._wingBody, ghostContainer);
        this.modelGhostHandler(this._body, ghostContainer);
        this.modelGhostHandler(this._weaponBody, ghostContainer);
        // this.modelGhostHandler(this._mountHeadBody, ghostContainer);

        ghostContainer.scaleX = this.bodyLayer.scaleX;
        ghostContainer.scaleY = this.bodyLayer.scaleY;
        ghostContainer.alpha = 0.8;
        this.addEffectToSprite(ghostContainer, this.parent, "BOTTOM");
        ghostContainer.x = this.x;
        ghostContainer.y = this.y;
        TweenLiteUtil.onHideTween(ghostContainer, this.disposeGhoseHandler, this);
    }
    private modelGhostHandler(body: BodyAnimation, parentContainer: egret.DisplayObjectContainer): void {
        if (!body)
            return;
        let bodyTexture: egret.Texture = body.currFrameTexture;
        if (bodyTexture) {
            let ghostBmp: egret.Bitmap = new egret.Bitmap(bodyTexture);
            ghostBmp.x = body.x + body.currFrameData.x;
            ghostBmp.y = body.y + body.currFrameData.y;
            parentContainer.addChild(ghostBmp);
        }
    }
    private disposeGhoseHandler(ghostContainer: egret.DisplayObjectContainer): void {
        for (var i: number = ghostContainer.numChildren - 1; i >= 0; i--) {
            var ghostBmp: egret.Bitmap = ghostContainer.getChildAt(i) as egret.Bitmap;
            ghostContainer.removeChild(ghostBmp);
            ghostBmp = null;
        }
        if (ghostContainer.parent)
            ghostContainer.parent.removeChild(ghostContainer);
        ghostContainer = null;
    }
    //清除目标将 随从的目标也清除
    public onClearTargets(): void {
        super.onClearTargets();
        if (this._retinuebody) {
            this._retinuebody.onClearTargets();
        }
    }
    /**
     * 宠物相关 
     **/
    private _petbody: PetBody;
    //添加一个跟随宠物
    private createPets(): void {
        if (this._data && this._data.petGrade >= 0) {
            if (this._petbody) {
                this._petbody.data.playerData = this._data;
            } else {
                this._petbody = BodyFactory.instance.createPetBody(this._data);
            }
        } else if (this._petbody) {
            this.removePetBody();
        }
    }
    public removePetBody(): void {
        if (this._petbody) {
            BodyFactory.instance.onRecovery(this._petbody);
            this._petbody = null;
        }
    }
    public get petBody(): PetBody {
        return this._petbody;
    }
    /**
     * 随从相关 
     **/
    private _retinuebody: RetinueBody;
    private createRetinue(): void {
        let retinueAvatar: number = this.data.getAppearID(BLESS_TYPE.RETINUE_CLOTHES);
        if (retinueAvatar < 0) {
            this.removeRetinue();
            return;
        }

        if (!this._retinuebody) {
            this._retinuebody = BodyFactory.instance.createRetinueBody(this.data);
        } else {
            this._retinuebody.onRefreshData();
        }
    }
    public removeRetinue(): void {
        if (this._retinuebody) {
            BodyFactory.instance.onRecovery(this._retinuebody);
            this._retinuebody = null;
        }
    }
    public get retinuebody(): RetinueBody {
        return this._retinuebody;
    }
    /**
     * 
     * 法宝相关
     * 
     * **/
    private _magicBody: MagicBody;
    private createMagic(): void {
        let magicAvatar: number = this.data.getAppearID(BLESS_TYPE.MAGIC);
        if (magicAvatar < 0) {
            this.removeMagic();
            return;
        }

        if (!this._magicBody) {
            this._magicBody = new MagicBody();
        }
        this._magicBody.data = this.data;
    }
    public removeMagic(): void {
        if (this._magicBody) {
            this._magicBody.onDestroy();
            this._magicBody = null;
        }
    }
    public get magicbody(): MagicBody {
        return this._magicBody;
    }

    /**是否为假的伤害**/
    public set isDamageFalse(bool: boolean) {
        this._isDamageFalse = bool;
        if (this._retinuebody) {
            this._retinuebody.isDamageFalse = bool;
        }
    }
    public get isDamageFalse(): boolean {
        return this._isDamageFalse;
    }
    //被击处理
    public onHurt(damage: DamageData): void {
        super.onHurt(damage);
        if (this.data.shieldValue <= 0) {
            this.removeShieldAnim();
        }
    }
    //移除护盾特效
    private _shieldAnim: EffectBody;
    public removeShieldAnim(): void {
        if (this._shieldAnim) {
            this._shieldAnim.onDestroy();
            this._shieldAnim = null;
        }
    }
    protected allBodyStop(): void {
        if (this._body) {
            this._body.onStop();
        }
        if (this._weaponBody) {
            this._weaponBody.onStop();
        }
        if (this._mountBody) {
            this._mountBody.onStop();
        }
        // if (this._mountHeadBody) {
        //     this._mountHeadBody.onStop();
        // }
        if (this._wingBody) {
            this._wingBody.onStop();
        }
    }
    //隐藏角色
    public set bodyVisible(bool: boolean) {
        egret.superSetter(PlayerBody, this, "bodyVisible", bool);
        if (this._body) {
            this._body.visible = bool;
        }
        if (this._weaponBody) {
            this._weaponBody.visible = bool;
        }
        if (this._mountBody) {
            this._mountBody.visible = bool;
        }
        // if (this._mountHeadBody) {
        //     this._mountHeadBody.visible = bool;
        // }
        if (this._wingBody) {
            this._wingBody.visible = bool;
        }
        if (this._titlebody) {
            this._titlebody.visible = bool
        }
        if (this._retinuebody) {
            this._retinuebody.bodyVisible = bool;
        }
        if (this._petbody) {
            this._petbody.bodyVisible = bool;
        }
        this.onshoworhideShodow(bool);
        this.onHideHeadBar(bool);
    }

    public onDestroy(): void {
        super.onDestroy();

        if (this._mountBody) {
            this._mountBody.onDestroy();
            this._mountBody = null;
        }
        if (this._weaponBody) {
            this._weaponBody.onDestroy();
            this._weaponBody = null;
            this._wingResName = null;
        }
        if (this._wingBody) {
            this._wingBody.onDestroy();
            this._wingBody = null;
        }
        if (this._titlebody) {
            this._titlebody.onDestroy();
            this._titlebody = null;
        }
        this.removeRetinue();
        this.removeMagic();
    }
    //返回乘骑类型
    protected get mountType(): MOUNT_TYPE {
        return MOUNT_TYPE.STAND_MOUNT;
    }
    //状态重置
    public onReset(): void {
        super.onReset();
        this.overChagre();
        this.removeShieldAnim();
        this.onShowOrHideHpBar(true);
    }
    //The end
}
enum PLAYER_LAYER {
    MOUNT = 0,
    BODY = 1,
    WEAPON = 2,
    WING = 3,
}