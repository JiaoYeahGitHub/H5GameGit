class BodyFactory {
	private static _instance = null;
	private _bodyFactoryCache;
	private _damagefntCache: FlyFontBody[];//伤害字体缓存
	private _shadowbodyCache: ShadowBody[];//影子缓存
	private _dropbodyCache: DropBody[];//掉落图标缓存

	public constructor() {
		this._bodyFactoryCache = {};
		this._damagefntCache = [];
		this._shadowbodyCache = [];
		this._dropbodyCache = [];
	}

	public static get instance(): BodyFactory {
		if (this._instance == null) {
			this._instance = new BodyFactory();
		}
		return this._instance;
	}
	//获取body的类名
	private getBodyActionType(bodyType: BODY_TYPE): string {
		var type: string = "";
		switch (bodyType) {
			case BODY_TYPE.PLAYER:
			case BODY_TYPE.ROBOT:
				type = "PlayerBody";
				break;
			case BODY_TYPE.MONSTER:
				type = "MonsterBody";
				break;
			case BODY_TYPE.BOSS:
				type = "BossBody"
				break;
			case BODY_TYPE.NPC:
			case BODY_TYPE.COLLECTION:
				type = "NpcBody";
				break;
			case BODY_TYPE.PET:
				type = "PetBody";
				break;
			case BODY_TYPE.RETINUE:
				type = "RetinueBody";
				break;
			case BODY_TYPE.MAGIC:
				type = "MagicBody";
				break;
		}
		return type;
	}
	/**创建活体**/
	public createMonsterBody(id, bodyType: BODY_TYPE): ActionBody {
		var bodyClassName: string = this.getBodyActionType(bodyType);
		var bodyThing: ActionBody;
		var bodysAry: Array<ActionBody>;
		if (this._bodyFactoryCache[bodyClassName])
			bodysAry = this._bodyFactoryCache[bodyClassName];
		else
			bodysAry = [];
		this._bodyFactoryCache[bodyClassName] = bodysAry;
		if (bodysAry.length > 0) {
			bodyThing = bodysAry.shift();
			bodyThing.data.updateData(id, bodyType);
			bodyThing.onRefreshData();
		} else {
			var bodyData: BodyData;
			switch (bodyType) {
				case BODY_TYPE.MONSTER:
					bodyData = new MonsterData(id, bodyType);
					break;
				case BODY_TYPE.BOSS:
					bodyData = new MonsterData(id, bodyType);
					break;
				case BODY_TYPE.NPC:
				case BODY_TYPE.COLLECTION:
					bodyData = new NpcData(id, bodyType);
					break;
			}
			bodyThing = new window[bodyClassName]();
			bodyThing.data = bodyData;
		}
		return bodyThing;
	}
	//创建出其他角色
	public createPlayerBody(type: BODY_TYPE, playerdata: PlayerData): PlayerBody {
		var bodyClassName: string = this.getBodyActionType(type);
		var playerbody: PlayerBody;
		if (!this._bodyFactoryCache[bodyClassName])
			this._bodyFactoryCache[bodyClassName] = [];
		var bodysAry: Array<PlayerBody> = this._bodyFactoryCache[bodyClassName];
		if (bodysAry.length == 0) {
			bodysAry.push(new PlayerBody());
		}
		playerbody = bodysAry.shift();
		playerbody.data = playerdata;
		playerbody.onUpdateAvatar();
		return playerbody;
	}
	//创建宠物
	public createPetBody(playerdata: PlayerData): PetBody {
		let bodyClassName: string = this.getBodyActionType(BODY_TYPE.PET);
		let petBody: PetBody;
		if (!this._bodyFactoryCache[bodyClassName])
			this._bodyFactoryCache[bodyClassName] = [];
		var bodysAry: Array<PetBody> = this._bodyFactoryCache[bodyClassName];
		if (bodysAry.length == 0) {
			petBody = new PetBody();
			petBody.data = new PetBodyData(playerdata);
		} else {
			petBody = bodysAry.shift();
			petBody.data.playerData = playerdata;
		}
		return petBody;
	}
	//创建随从
	public createRetinueBody(playerdata: PlayerData): RetinueBody {
		let bodyClassName: string = this.getBodyActionType(BODY_TYPE.RETINUE);
		let retinueBody: RetinueBody;
		if (!this._bodyFactoryCache[bodyClassName])
			this._bodyFactoryCache[bodyClassName] = [];
		var bodysAry: Array<RetinueBody> = this._bodyFactoryCache[bodyClassName];
		if (bodysAry.length == 0) {
			retinueBody = new RetinueBody();
			retinueBody.data = new RetinueBodyData(playerdata);
		} else {
			retinueBody = bodysAry.shift();
			retinueBody.data.playerData = playerdata;
		}
		return retinueBody;
	}
	//创建随从箭只
	private _retinueArrows: Animation[];
	public createRetinueArrow(): Animation {
		if (!this._retinueArrows) {
			this._retinueArrows = [];
		}
		if (this._retinueArrows.length == 0) {
			this._retinueArrows.push(new Animation('pet_skill_1'));
		}
		return this._retinueArrows.shift();
	}
	public onRecoverRetinueArrow(arrowAnim: Animation): Animation {
		if (!this._retinueArrows) return;
		if (this._retinueArrows.indexOf(arrowAnim) >= 0) {
			return;
		}
		egret.Tween.removeTweens(arrowAnim);
		if (arrowAnim.parent) {
			arrowAnim.parent.removeChild(arrowAnim);
		}
		if (this._dropbodyCache.length > 20) {
			arrowAnim.onDestroy();
			arrowAnim = null;
		} else {
			this._retinueArrows.push(arrowAnim);
		}
	}
	//回收对象
	public onRecovery(body: ActionBody): void {
		if (!body) {
			return;
		}
		if (body.data.bodyType == BODY_TYPE.SELF) {
			return;
		}
		if (body.parent) {
			body.parent.removeChild(body);
		}
		body.onClearTargets();
		body.onDestroy();

		let bodyClassName: string = this.getBodyActionType(body.data.bodyType);
		let bodysAry: Array<ActionBody>;
		bodysAry = this._bodyFactoryCache[bodyClassName];
		if (bodysAry.indexOf(body) >= 0) {
			return;
		}
		if (bodysAry.length > 20) {
			body = null;
			return;
		}
		body.onReset();
		bodysAry.push(body);
		if (body.data.bodyType != BODY_TYPE.RETINUE) {
			body.onHideHeadBar(true);
		}
	}
	/**创建影子**/
	public onCreateShadow(body: ActionBody): ShadowBody {
		let shadowbody: ShadowBody;
		if (this._shadowbodyCache.length > 0) {
			shadowbody = this._shadowbodyCache.shift();
		} else {
			shadowbody = new ShadowBody();
		}
		shadowbody.onRefresh(body);
		return shadowbody;
	}
	/**回收影子**/
	public onRecoveryShadow(body: ShadowBody): void {
		body.onRemove();
		this._shadowbodyCache.push(body);
	}
	/**创建伤害字体**/
	public onCreateDamageFont(): FlyFontBody {
		if (this._damagefntCache.length > 0) {
			return this._damagefntCache.shift();
		}
		return new FlyFontBody();
	}
	/**回收伤害字体**/
	public onRecoveryDamageFont(dmgFont: FlyFontBody): void {
		dmgFont.floatGC();
		if (this._damagefntCache.indexOf(dmgFont) >= 0) {
			return;
		}
		if (this._damagefntCache.length > 100) {
			dmgFont = null;
		} else {
			this._damagefntCache.push(dmgFont);
		}
	}
	/**创建掉落物品**/
	public onCreateDropBody(type, id, quality): DropBody {
		if (this._dropbodyCache.length > 0) {
			let dropbody: DropBody = this._dropbodyCache.shift();
			dropbody.onUpdate(type, id, quality);
			return this._dropbodyCache.shift();
		}
		return new DropBody(type, id, quality);
	}
	/**回收掉落物品**/
	public onRecoveryDropBody(body: DropBody): void {
		body.onDestroy();
		if (this._dropbodyCache.indexOf(body) >= 0) {
			return;
		}
		if (this._dropbodyCache.length > 20) {
			body = null;
		} else {
			this._dropbodyCache.push(body);
		}
	}
	//The end
}
//生物类型
enum BODY_TYPE {
	SELF = 0,
	PLAYER = 1,
	MONSTER = 2,
	BOSS = 3,
	ROBOT = 4,
	NPC = 5,
	COLLECTION = 6,
	PET = 7,//宠物
	RETINUE = 8,//随从
	MAGIC = 9,//法宝
	SHADOW = 1001,//影子
}