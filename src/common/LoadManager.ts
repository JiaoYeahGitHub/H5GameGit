// TypeScript file 加载管理
class LoadManager {
    private static instance = null;

    private loadResList: LoadBody[];//特效加载队列
    private Res_NotLoad;//是否有正在加载的特效
    private Res_loadbody: LoadBody;//当前正在加载的特效结构

    public constructor() {
        this.loadResList = [];
        this.Res_NotLoad = true;
    }
    public static getInstance(): LoadManager {
        if (this.instance == null) {
            this.instance = new LoadManager();
        }
        return this.instance;
    }

    private getTexttrueUrlByVer(resUrl: string): string {
        //主角
        let playerUrls: string[] = ['player', 'weapon', 'feijian', 'wing'];
        for (let i: number = 0; i < playerUrls.length; i++) {
            if (resUrl.indexOf(`resource/model/${playerUrls[i]}/`) >= 0) {
                return resUrl + ".png";
            }
        }
        //怪物
        if (resUrl.indexOf(`resource/model/monster/`) >= 0) {
            return resUrl + ".png";
        }
        //随从
        if (resUrl.indexOf(`resource/model/sc_`) >= 0) {
            return resUrl + ".png";
        }
        return resUrl + ".png";
    }
    private getJsonUrlByVer(resUrl: string): string {
        //主角
        let playerUrls: string[] = ['player', 'weapon', 'feijian', 'wing'];
        for (let i: number = 0; i < playerUrls.length; i++) {
            if (resUrl.indexOf(`resource/model/${playerUrls[i]}/`) >= 0) {
                return resUrl + ".json";
            }
        }
        //怪物
        if (resUrl.indexOf(`resource/model/monster/`) >= 0) {
            return resUrl + ".json";
        }
        //随从
        if (resUrl.indexOf(`resource/model/sc_`) >= 0) {
            return resUrl + ".json";
        }
        return resUrl + ".json";
    }
    //获取CDN资源根目录
    public static get resourceRootUrl(): string {
        return ChannelDefine.cdnUrl + "resource/";
    }
    //获取地图资源URL
    public getMapResUrl(mapresid: number, mapidx: number): string {
        return ChannelDefine.cdnUrl + "resource/mapres/" + mapresid + "/map" + mapresid + "_" + mapidx + ".jpg";
    }
    //获取人物外形URL
    public getClothResUrl(avataRes: string, action: string, frame: string): string {
        if (!avataRes || !action || !frame)
            return;
        var clothRes: string = avataRes + "_" + action + "_" + frame;
        return ChannelDefine.cdnUrl + `resource/model/player/${clothRes}`;
    }
    //获取武器外形URL
    public getWeaponResUrl(avataRes: string, action: string, frame: string): string {
        if (!avataRes || !action || !frame)
            return;
        var weaponRes: string = avataRes + "_" + action + "_" + frame;
        return ChannelDefine.cdnUrl + `resource/model/weapon/${weaponRes}`;
    }
    //获取飞剑资源URL
    public getFeijianUrl(avataRes: string, action: string, frame: string): string {
        if (!avataRes || !action || !frame)
            return;
        var feijianRes: string = avataRes + "_" + action + "_" + frame;
        return ChannelDefine.cdnUrl + `resource/model/feijian/${feijianRes}`;
    }
    //获取坐骑资源URL
    public getMountResUrl(avataRes: string, action: string, frame: string, isZhedang: boolean = false): string {
        if (!avataRes || !action || !frame)
            return;
        action = isZhedang ? "top_" + action : action;
        var mountRes: string = avataRes + "_" + action + "_" + frame;
        return ChannelDefine.cdnUrl + `resource/model/ride/${mountRes}`;
    }
    //获取翅膀资源URL
    public getWingResUrl(avataRes: string, action: string, frame: string, isZhedang: boolean = false): string {
        if (!avataRes || !action || !frame)
            return;
        action = isZhedang ? "top_" + action : action;
        var wingRes: string = avataRes + "_" + action + "_" + frame;
        return ChannelDefine.cdnUrl + `resource/model/wing/${wingRes}`;
    }
    //获取法宝资源URL
    public getMagicResUrl(magicRes: string, action: string): string {
        return ChannelDefine.cdnUrl + `resource/model/fabao/${magicRes}` + (action ? "_" + action : "");
    }
    //获取光环资源URL
    public getRingResUrl(ringRes: string): string {
        return ChannelDefine.cdnUrl + `resource/model/guanghuan/${ringRes}`;
    }
    //获取怪物资源URL
    public getMonsterResUrl(avataRes: string, action: string, frame: string): string {
        if (!avataRes || !action || !frame)
            return;
        var monsterRes: string = avataRes + "_" + action + "_" + frame;
        return ChannelDefine.cdnUrl + `resource/model/monster/${monsterRes}`;
    }
    //获取NPC资源URL
    public getNpcResUrl(npcRes: string, action: string, frame: string = "1"): string {
        if (!npcRes || !action)
            return;
        return ChannelDefine.cdnUrl + `resource/model/npc/${npcRes + "_" + action + "_" + frame}`;
    }
    //获取宠物资源URL
    public getPetResUrl(petRes: string, action: string, frame: string): string {
        if (!petRes || !action || !frame)
            return;
        return ChannelDefine.cdnUrl + `resource/model/pet/pet${petRes + "_" + action + "_" + frame}`;
    }
    //获取随从的外形资源URL
    public getRetinueClothResUrl(avataRes: string, action: string, frame: string): string {
        if (!avataRes || !action || !frame)
            return;
        var clothRes: string = avataRes + "_" + action + "_" + frame;
        return ChannelDefine.cdnUrl + `resource/model/sc_role/${clothRes}`;
    }
    //获取随从的武器资源URL
    public getRetinueWeaponResUrl(avataRes: string, action: string, frame: string): string {
        if (!avataRes || !action || !frame)
            return;
        var weaponRes: string = avataRes + "_" + action + "_" + frame;
        return ChannelDefine.cdnUrl + `resource/model/sc_weapon/${weaponRes}`;
    }
    //获取随从的翅膀资源URL
    public getRetinueWingResUrl(avataRes: string, action: string, frame: string): string {
        if (!avataRes || !action || !frame)
            return;
        var wingRes: string = avataRes + "_" + action + "_" + frame;
        return ChannelDefine.cdnUrl + `resource/model/sc_wing/${wingRes}`;
    }
    //获取随从的坐骑资源URL
    public getRetinueMountResUrl(avataRes: string, action: string): string {
        if (!avataRes || !action)
            return;
        var wingRes: string = avataRes + "_" + action;
        return ChannelDefine.cdnUrl + `resource/model/sc_mount/${wingRes}`;
    }
    //获取随从的法宝资源URL
    public getRetinueMagicResUrl(avataRes: string, action: string): string {
        if (!avataRes || !action)
            return;
        var magicRes: string = avataRes + "_" + action;
        return ChannelDefine.cdnUrl + `resource/model/sc_magic/${magicRes}`;
    }
    //捕捉资源内容名
    private getResFileName(resUrl: string): string {
        let fileName: string = "";
        let headUrl: string = "resource/model/";
        let startIndex: number = resUrl.search(headUrl);
        // let endIndex: number = resUrl.lastIndexOf("?v=");
        fileName = resUrl.slice(startIndex + headUrl.length, resUrl.length);
        return fileName;
    }
    //根据资源获取URL
    // private getResUrl(fileName: string): string {
    //     let resurl: string = `resource/model/${fileName}`;
    //     if (fileName.indexOf('.png') >= 0) {
    //         resurl = this.getTexttrueUrlByVer(resurl.replace('.png', ''));
    //     } else if (fileName.indexOf('.json') >= 0) {
    //         resurl = this.getJsonUrlByVer(resurl.replace('.json', ''));
    //     }
    //     return resurl;
    // }
    /** 
     * 特效加载方法
     * resList加载列表
     * callback加载成功回调
     * thisObj回调函数对象
     * param回调参数
    */
    // private _uiAnimLoadedAry: string[] = [];
    public loadRes(anim: Animation) {
        // if (this._uiAnimLoadedAry.indexOf(anim.resName) < 0) {
        //     this._uiAnimLoadedAry.push(anim.resName);
        // }
        let resJson: string = anim.resName + "_json";
        let resPng: string = anim.resName + "_png";
        if (RES.getRes(resJson) && RES.getRes(resPng)) {
            Tool.callback(anim['onLoadComplete'], anim, anim.resName);
        } else {
            let _loadbody: LoadBody = new LoadBody([resJson, resPng], anim['onLoadComplete'], anim, anim.resName);
            this.loadResList.push(_loadbody);
            this.startLoading();
        }
    }
    //开始加载
    private startLoading() {
        if (this.Res_NotLoad) {
            if (this.loadResList.length > 0) {
                this.Res_NotLoad = false;
                this.Res_loadbody = this.loadResList.shift();
                this.onLoading();
            }
        }
    }
    //加载进行
    private onLoading(): void {
        if (this.Res_loadbody && this.Res_loadbody.resList.length > 0) {
            var res: string = this.Res_loadbody.resList.shift();
            if (RES.hasRes(res)) {
                if (RES.getRes(res)) {
                    this.onLoading();
                } else {
                    RES.getResAsync(res, this.onLoading, this);
                }
            } else {
                this.onLoading();
            }
        } else {
            this.loadingFinish();
        }
    }
    //加载完成处理
    private loadingFinish(): void {
        this.Res_NotLoad = true;
        if (this.Res_loadbody) {
            this.Res_loadbody.callback();
            this.Res_loadbody.destroy();
            this.Res_loadbody = null;
        }
        this.startLoading();
    }
    /** 
     * 模型加载方法
     * body 传入要加载的Body对象
    */
    private _cacheBodyAnimation = {};
    private _urlBodyAnimResAry = [];
    private loadThingList = {};//模型加载队列
    private _loadingThingURLs: string[] = [];
    private _loadingthingResUrl: string;
    public loadThingModel(body: BodyAnimation, resName: string) {
        if (!resName) return;
        let countKEY: string = resName.replace(ChannelDefine.cdnUrl + 'resource/model/', '');
        if (this._urlBodyAnimResAry.indexOf(countKEY) < 0) {
            this._urlBodyAnimResAry.push(countKEY);
        }
        let jsonResUrl: string = this.getJsonUrlByVer(resName);
        let texttureUrl: string = this.getTexttrueUrlByVer(resName);

        let jsonFileName: string = this.getResFileName(jsonResUrl);
        let animJson = this._cacheBodyAnimation[jsonFileName];
        let textureFileName: string = this.getResFileName(texttureUrl);
        let animTexture = this._cacheBodyAnimation[textureFileName];
        if (animJson && animTexture) {//已经加载过的资源直接回调
            Tool.callback(body['onLoadBodyComplete'], body, resName, animJson, animTexture);
            return;
        }
        let thingKey: string = jsonFileName.replace('.json', '');
        //正在加载的资源 只需新增的回调
        if (this.loadThingList[thingKey]) {
            this.loadThingList[thingKey].animBodys.push(body);
            return;
        } else {
            this.loadThingList[thingKey] = new LoadThingModel();
            this.loadThingList[thingKey].resName = resName;
        }

        this.loadThingList[thingKey].animBodys.push(body);
        if (this._loadingThingURLs.indexOf(jsonResUrl) < 0) {
            this._loadingThingURLs.push(jsonResUrl);
        }
        if (this._loadingThingURLs.indexOf(texttureUrl) < 0) {
            this._loadingThingURLs.push(texttureUrl);
        }

        this.onLoadThingModelHandler();
    }
    public loadModelByName(resName: string, callback, thisObj): void {
        let jsonResUrl: string = this.getJsonUrlByVer(resName);
        let texttureUrl: string = this.getTexttrueUrlByVer(resName);

        let jsonFileName: string = this.getResFileName(jsonResUrl);
        let animJson = this._cacheBodyAnimation[jsonFileName];
        let textureFileName: string = this.getResFileName(texttureUrl);
        let animTexture = this._cacheBodyAnimation[textureFileName];

        if (animJson && animTexture) {
            return;
        }

        RES.getResByUrl(jsonResUrl, function () { }, this, RES.ResourceItem.TYPE_JSON);
        RES.getResByUrl(texttureUrl, callback, thisObj, RES.ResourceItem.TYPE_IMAGE);
    }
    private onLoadThingModelHandler(): void {
        if (this._loadingThingURLs.length == 0) return;
        if (this._loadingthingResUrl) return;
        this._loadingthingResUrl = this._loadingThingURLs.shift();
        var filesName: string = this.getResFileName(this._loadingthingResUrl);
        var resType = null;
        if (this._loadingthingResUrl.indexOf(".png") > 0) {
            resType = RES.ResourceItem.TYPE_IMAGE;
        } else if (this._loadingthingResUrl.indexOf(".json") > 0) {
            resType = RES.ResourceItem.TYPE_JSON;
        }
        RES.getResByUrl(this._loadingthingResUrl, this.bodyResLoadComplete, this, resType);
    }
    /**模型资源加载完成缓存**/
    private bodyResLoadComplete(data, url): void {
        //如果在加载完成之前就被移除了
        let filesName: string = this.getResFileName(url);

        let loadKey: string = '';
        let jsonFileName: string = '';
        let textureFileName: string = '';
        if (filesName.indexOf(".png") > 0) {
            loadKey = filesName.replace(".png", "");
            textureFileName = filesName;
            jsonFileName = loadKey + ".json";
        } else if (filesName.indexOf(".json") > 0) {
            loadKey = filesName.replace(".json", "");
            jsonFileName = filesName;
            textureFileName = loadKey + ".png";
        }

        this._cacheBodyAnimation[filesName] = data;

        if (this.loadThingList[loadKey]) {
            let _loadbody: LoadThingModel = this.loadThingList[loadKey];
            let animBodys: BodyAnimation[] = _loadbody.animBodys;
            let resName: string = _loadbody.resName;
            let animJson = this._cacheBodyAnimation[jsonFileName];
            let animTexture = this._cacheBodyAnimation[textureFileName];
            if (animJson && animTexture) {
                for (let i: number = 0; i < animBodys.length; i++) {
                    let animbody: BodyAnimation = animBodys[i];
                    Tool.callback(animbody['onLoadBodyComplete'], animbody, resName, animJson, animTexture);
                }
                this.loadThingList[loadKey] = null;
                delete this.loadThingList[loadKey];
            }
        }

        this._loadingthingResUrl = null;
        this.onLoadThingModelHandler();
    }
    /**将没有引用的模型删除**/
    public onClearAllBodyAnimCache(removeEnemy: boolean = true): void {
        for (let i: number = 0; i < this._urlBodyAnimResAry.length; i++) {
            let urkKey: string = this._urlBodyAnimResAry[i];
            let resName: string = 'resource/model/' + urkKey;
            if (!this.onCheckHeroAvata(urkKey, removeEnemy)) {
                let imgUrl: string = this.getTexttrueUrlByVer(resName);
                let imgFile: string = this.getResFileName(imgUrl);
                RES.destroyRes(ChannelDefine.cdnUrl + imgUrl);
                this._cacheBodyAnimation[imgFile] = null;
                delete this._cacheBodyAnimation[imgFile];

                let jsonUrl: string = this.getJsonUrlByVer(resName);
                let jsonFile: string = this.getResFileName(jsonUrl);
                this._cacheBodyAnimation[jsonFile] = null;
                delete this._cacheBodyAnimation[jsonFile];
                RES.destroyRes(ChannelDefine.cdnUrl + jsonUrl);
            }
        }
        this._urlBodyAnimResAry = [];

        this._loadingThingURLs = [];
        for (let thingKey in this.loadThingList) {
            let modelthing: LoadThingModel = this.loadThingList[thingKey];
            for (let i: number = 0; i < modelthing.animBodys.length; i++) {
                modelthing.animBodys[i].onDisposeTextrue();
            }
        }
        this.loadThingList = {};
        this._loadingthingResUrl = null;
    }
    /**增加图片资源的引用计数**/
    private uiLoadedImageAry: string[] = [];
    public onCountImgSource(source: string): void {
        if (source.indexOf("map") >= 0 && source.indexOf("_small_jpg") >= 0) return;//小地图不释放
        if (source.indexOf('_png') >= 0 || source.indexOf('_jpg') >= 0) {
            if (this.uiLoadedImageAry.indexOf(source) < 0) {
                this.uiLoadedImageAry.push(source);
            }
        }
    }
    private _mainviewImageAry: eui.Image[] = [];
    public addMainvewImageAry(component): void {
        for (var i: number = 0; i < component.numChildren; i++) {
            var childDisplay = component.getChildAt(i);
            if (egret.is(childDisplay, "egret.DisplayObjectContainer")) {
                this.addMainvewImageAry(childDisplay as egret.DisplayObjectContainer);
            } else if (egret.is(childDisplay, "eui.Image")) {
                let image: eui.Image = childDisplay as eui.Image;
                if (this._mainviewImageAry.indexOf(image) < 0) {
                    this._mainviewImageAry.push(image);
                }
            }
        }
    }
    public reloadUIImageAndAnim(component): void {
        if (egret.is(component, "egret.DisplayObjectContainer")) {
            for (var i: number = 0; i < component.numChildren; i++) {
                var childDisplay = component.getChildAt(i);
                if (egret.is(childDisplay, "egret.DisplayObjectContainer")) {
                    this.reloadUIImageAndAnim(childDisplay as egret.DisplayObjectContainer);
                } else if (egret.is(childDisplay, "BodyAnimation") || egret.is(childDisplay, "Animation")) {
                    this.reloadUIAnimHandler(childDisplay);
                } else {
                    this.reloadImageHanlder(childDisplay);
                }
            }
        } else {
            this.reloadImageHanlder(component);
        }
    }
    private reloadImageHanlder(childDisplay): void {
        if (!childDisplay) return;
        if (egret.is(childDisplay, "eui.Image")) {
            let image: eui.Image = childDisplay as eui.Image;
            if (!image.source) return;
            if (typeof image.source == "string") {
                let source: string = image.source;
                image['_source'] = null;
                image.source = source;
            } else if (egret.is(image.source, "egret.Texture")) {
                let source: egret.Texture = new egret.Texture();
                source.bitmapData = image.source.bitmapData;
                image['_source'] = null;
                image.source = source;
            }
        }
    }
    private reloadUIAnimHandler(childDisplay): void {
        if (egret.is(childDisplay, "BodyAnimation") || egret.is(childDisplay, "Animation")) {
            let anim: Animation = childDisplay as Animation;
            anim.onReLoad();
        }
    }
    /**释放UI图片资源**/
    public removeloadAllUIImage(): void {
        let mainviewImages = [];
        for (let i: number = 0; i < this._mainviewImageAry.length; i++) {
            let image: eui.Image = this._mainviewImageAry[i];
            mainviewImages.push(image.source);
        }
        for (let i: number = this.uiLoadedImageAry.length - 1; i >= 0; i--) {
            let imageSourse: string = this.uiLoadedImageAry[i];
            if (mainviewImages.indexOf(imageSourse) >= 0) continue;
            RES.destroyRes(imageSourse, false);
            this.uiLoadedImageAry.splice(i, 1);
        }
        platform.triggerGC();
    }
    public resetAllUIResources(): void {
        for (let i: number = 0; i < this.uiLoadedImageAry.length; i++) {
            let imageSourse: string = this.uiLoadedImageAry[i];
            RES.destroyRes(imageSourse, false);
        }
        this.uiLoadedImageAry = [];
        this.onClearAllBodyAnimCache();
        platform.triggerGC();
        for (let i: number = 0; i < this._mainviewImageAry.length; i++) {
            let image: eui.Image = this._mainviewImageAry[i];
            this.reloadImageHanlder(image);
        }
    }
    //检测下是不是有当前人物正在使用的外形
    private onCheckHeroAvata(avataRes: string, removeEnemy: boolean): boolean {
        for (let i: number = 0; i < DataManager.getInstance().playerManager.player.playerDatas.length; i++) {
            let playerData: PlayerData = DataManager.getInstance().playerManager.player.playerDatas[i];
            let heroAvatars: string[] = [playerData.cloth_res, playerData.weapon_res, playerData.feijian_Res, playerData.wing_res, playerData.magic_res];
            for (let aIdx: number = 0; aIdx < heroAvatars.length; aIdx++) {
                let heroAvatar: string = heroAvatars[aIdx];
                if (!heroAvatar) continue;
                if (avataRes.indexOf(heroAvatar) >= 0) return true;
            }
            //主角宠物
            if (JsonModelManager.instance.getModelchongwujinjie()[playerData.petGrade]) {
                let petmodel: Modelchongwujinjie = JsonModelManager.instance.getModelchongwujinjie()[playerData.petGrade][0];
                if (petmodel && avataRes.indexOf('pet/pet' + petmodel.waixing1) >= 0) {
                    return true;
                }
            }
            //主角对手
            if (!removeEnemy) {
                for (let eIdx: number = 0; eIdx < playerData.targets.length; eIdx++) {
                    let enemyBody: ActionBody = playerData.targets[eIdx];
                    switch (enemyBody.data.bodyType) {
                        case BODY_TYPE.BOSS:
                        case BODY_TYPE.MONSTER:
                            if (avataRes.indexOf((enemyBody.data as MonsterData).avatar) >= 0) {
                                return true;
                            }
                            break;
                        case BODY_TYPE.PLAYER:
                        case BODY_TYPE.ROBOT:
                            let enemyData: PlayerData = enemyBody.data as PlayerData;
                            let enemyAvatars: string[] = [enemyData.cloth_res, enemyData.weapon_res, enemyData.feijian_Res, enemyData.wing_res, enemyData.magic_res];
                            for (let epIdx: number = 0; epIdx < enemyAvatars.length; epIdx++) {
                                let enemyAvatar: string = enemyAvatars[epIdx];
                                if (!enemyAvatar) continue;
                                if (avataRes.indexOf(enemyAvatar) >= 0) return true;
                            }
                            //宠物
                            if (JsonModelManager.instance.getModelchongwujinjie()[enemyData.petGrade]) {
                                let petmodel: Modelchongwujinjie = JsonModelManager.instance.getModelchongwujinjie()[enemyData.petGrade][0];
                                if (petmodel && avataRes.indexOf('pet/pet' + petmodel.waixing1) >= 0) {
                                    return true;
                                }
                            }
                            break;
                    }
                }
            }
        }
        return false;
    }
}
class LoadBody {
    private callbackFunc;
    private thisObject;
    private param;
    public resList: string[];
    public constructor(resList: string[], callbackFunc = null, thisObject = null, param = null) {
        this.resList = resList;
        this.callbackFunc = callbackFunc;
        this.thisObject = thisObject;
        this.param = param;
    }
    public callback() {
        Tool.callback(this.callbackFunc, this.thisObject, this.param);
    }
    public destroy(): void {
        this.resList = null;
        this.callbackFunc = null;
        this.thisObject = null;
        this.param = null;
    }
}
class LoadThingModel {
    public animBodys: BodyAnimation[] = [];
    public resName: string = '';
}