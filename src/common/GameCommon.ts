/**
 *
 * @author 
 *
 */
class GameCommon {
    private static instance = null;
    private gameWorld: GameWorld;
    public static Quality_Color_String: Array<string> = ["e2e2e2", "5aff91", "55c4ff", "ea4aff", "FFDB28", "ff4633", 'FF9F0F'];
    public constructor() {
    }
    public static getInstance(): GameCommon {
        if (this.instance == null) {
            this.instance = new GameCommon();
        }
        return this.instance;
    }
    public setGameWorld(gameWorld) {
        this.gameWorld = gameWorld;
    }
    public static getFontFamily() {
        return "SimHei";
    }
    //设置面板字体
    // public setComponentAllTextFont(component: egret.DisplayObjectContainer, fontFamily: string = GameCommon.getFontFamily()): void {
    //     for (var i: number = 0; i < component.numChildren; i++) {
    //         var childDisplayObj = component.getChildAt(i);
    //         if (egret.is(childDisplayObj, "eui.Label")) {
    //             var componentLabel: eui.Label = childDisplayObj as eui.Label;
    //             this.setLabelCommonFont(componentLabel);
    //         } else if (egret.is(childDisplayObj, "egret.DisplayObjectContainer")) {
    //             var windowComponent: egret.DisplayObjectContainer = childDisplayObj as egret.DisplayObjectContainer;
    //             this.setComponentAllTextFont(windowComponent);
    //         }
    //     }
    // }
    //通用的字体样式
    // public setLabelCommonFont(label: eui.Label): void {
    //     label.fontFamily = GameCommon.getFontFamily();
    //     label.stroke = 1;
    //     label.strokeColor = 0x700b0b;
    // }
    //发送协议到服务器
    public sendMsgToServer(msg: Message): void {
        this.gameWorld.sendMessage(msg);
    }
    //服务器协议通知到view
    public receiveMsgToClient(message: Message, data: any = null): void {
        var event: GameMessageEvent = new GameMessageEvent(message.getCmdId().toString(), data == null ? message : data);
        this.gameWorld.dispatchEvent(event);
        event = null;
    }
    public onDispatchEvent(cmdID: number, data: any = null): void {
        var event: GameMessageEvent = new GameMessageEvent(cmdID.toString(), data == null ? null : data);
        this.gameWorld.dispatchEvent(event);
        event = null;
    }
    public addMsgEventListener(messageId: string, callFunc, callObj): void {
        this.gameWorld.addEventListener(messageId, callFunc, callObj);
    }
    public removeMsgEventListener(messageId: string, callFunc, callObj): void {
        this.gameWorld.removeEventListener(messageId, callFunc, callObj);
    }
    /**创建通用 LABEL**/
    public createNormalLabel(fontSize: number = 14, fontColor: number = 0xFFFFFF, stroke: number = 0, strokeColor: number = 0x3E0909,
        textAlign: string = egret.HorizontalAlign.LEFT, verticalAlign: string = egret.VerticalAlign.MIDDLE, text: string = "", fontFamily: string = ""): eui.Label {
        var textlabel: eui.Label = new eui.Label();
        textlabel.size = fontSize;
        textlabel.textColor = fontColor;
        textlabel.stroke = stroke;
        textlabel.strokeColor = strokeColor;
        textlabel.textAlign = textAlign;
        textlabel.verticalAlign = verticalAlign;
        textlabel.text = text;
        if (fontFamily)
            textlabel.fontFamily = fontFamily;
        else
            textlabel.fontFamily = GameCommon.getFontFamily();
        return textlabel;
    }
    /**给按钮设置不可使用状态**/
    public onButtonEnable(button: eui.Button, enable: boolean): void {
        button.enabled = enable;
        // if (enable)
        //     button.filters = null;
        // else
        //     button.filters = [GameDefine.GaryColorFlilter];
    }
    /**图片置灰 别用了卡 以后再说**/
    public onImgSetGray(img: eui.Image, bl: boolean) {
        // if (bl)
        //     img.filters = [GameDefine.GaryColorFlilter];
        // else
        //     img.filters = null;
    }
    /**根据职业获取玩家名字**/
    public static Occupation_RoleName(occupation): string {
        var model: Modelfighter = ModelManager.getInstance().getModelFigher(occupation + 1);
        return model ? model.name : "";
    }
    /**根据职业获取对应的职业名字图标**/
    public getOccpationIcon(occupation): string {
        // if (occupation < 0)
        //     return;
        // return `juese_name_back${occupation}_png`;
        return "";
    }
    /**根据职业获取对应的矩形头像**/
    public getHeadIconByIndex(index): string {
        return `r${index}_headIcon_jpg`;
    }
    /**根据职业获取对应的圆形头像**/
    public getBigHeadByOccpation(index): string {
        return `mainview_hero_head${index}_png`;
    }
    public getHeadFrameByIndex(index): string {
        return `head_frame_${index}_png`;
    }
    /**获取一个初始化的属性数组**/
    public getAttributeAry(attrObj?: Object): number[] {
        var attributes: number[] = [];
        for (var i: number = 0; i < GameDefine.ATTR_OBJ_KEYS.length; i++) {
            var keystr: string = GameDefine.ATTR_OBJ_KEYS[i];
            if (attrObj && attrObj[keystr]) {
                attributes[i] = attrObj[keystr];
            } else {
                attributes[i] = 0;
            }
        }
        return attributes;
    }
    /**解析属性配置**/
    public onParseAttributeStr(str: string) {
        var ary;
        if (str.indexOf("#") >= 0) {
            ary = str.split("#");
        } else {
            ary = str.split(";");
        }
        var model = this.getAttributeAry();
        var one: string[];
        for (var i: number = 0; i < ary.length; i++) {
            one = ary[i].split(",");
            model[one[0]] = parseInt(one[1]);
        }
        return model;
    }
    /**合并数据模型**/
    public mergeAry(param) {
        var info = this.getAttributeAry();
        var index: number;
        var val: number;
        for (var i = 0; i < param.length; i++) {
            for (var key in param[i]) {
                info[key] += param[i][key];
            }
        }
        return info;
    }
    /**获取一个装备的附加属性数组**/
    public getRedEquipAddAttr(modelId: number): number[] {
        var attributes: number[] = GameCommon.getInstance().getAttributeAry();
        var modelEquip: Modelequipment = JsonModelManager.instance.getModelequipment()[modelId];
        if (!modelEquip || modelEquip.position < GameDefine.Equip_Slot_Num)
            return attributes;
        for (var i: number = 0; i < ATTR_TYPE.SIZE; i++) {
            var value: number = modelEquip.attrAry[i];
            if (value > 0) {
                var rate: number = 0.1;
                value = Tool.toInt(value * rate);
                attributes[i] = value;
            }
        }
        return attributes;
    }
    /**通过人物的模板id获取头像**/
    public getHeadIconByModelid(monsterId: number): string {
        var modelfightter: Modelfighter = ModelManager.getInstance().getModelFigher(monsterId);
        var headiconRes: string = modelfightter.avata + "_icon_png";
        return headiconRes;
    }
    /**根据职业获取伤害字体**/
    public getDamageFntByOccp(occupation: number = 1): string {
        return `hero_damage_fnt${occupation}_fnt`;
    }
    /**属性标题**/
    public getPropertyTitle(temp: number): string {
        var a: string;
        switch (temp) {
            case ATTR_TYPE.ATTACK:
                a = "攻 击：";
                break;
            case ATTR_TYPE.PHYDEF:
                a = "物 防：";
                break;
            case ATTR_TYPE.MAGICDEF:
                a = "法 防：";
                break;
            case ATTR_TYPE.HP:
                a = "生 命：";
                break;
            case ATTR_TYPE.HIT:
                a = "命 中：";
                break;
            case ATTR_TYPE.DODGE:
                a = "闪 避：";
                break;
            case ATTR_TYPE.BLOCK:
                a = "招 架：";
                break;
            case ATTR_TYPE.BREAK:
                a = "破 招：";
                break;
            case ATTR_TYPE.CRIT:
                a = "暴 击：";
                break;
            case ATTR_TYPE.DUCT:
                a = "抗 暴：";
                break;
        }
        return a;
    }
    /**对比两件装备**/
    public compareEquip(equip1: EquipThing, equip2: EquipThing, checkLevel: boolean = true): EquipThing {
        let _player: Player = DataManager.getInstance().playerManager.player;
        if (equip1 && !equip1.model)
            equip1 = null;
        if (equip2 && !equip2.model)
            equip2 = null;
        if (checkLevel) {
            let playerZhuanshengLv: number = Math.max(_player.coatardLv, 1);
            if (equip1 && equip1.model.coatardLv > playerZhuanshengLv) {
                equip1 = null;
            }
            if (equip2 && equip2.model.coatardLv > playerZhuanshengLv) {
                equip2 = null;
            }
        }

        if (equip1 && equip2) {
            if (equip1 === equip2)
                return null;
            if (equip2.pingfenValue > equip1.pingfenValue)
                return equip2;
            return equip1;
        }
        return equip1 || equip2;
    }
    //根据id 和 type 获取物品的model
    private _modelthingDict = {};
    public getThingModel(type, modelId, quality?: number): ModelThing {
        var modelkey: string = Tool.isNumber(quality) ? `${type}_${modelId}_${quality}` : `${type}_${modelId}`;
        let modelthing: ModelThing;
        if (this._modelthingDict[modelkey]) {
            modelthing = this._modelthingDict[modelkey]
            if (Tool.isNumber(quality)) {
                modelthing.quality = quality;
            }
            return modelthing;
        }
        let model;
        let manager: JsonModelManager = JsonModelManager.instance;
        switch (type) {
            case GOODS_TYPE.MASTER_EQUIP:
                // if (GoodsQuality.Gold == quality) {
                //     model = manager.getModeltianshenzhuangbei()[modelId];
                // } else {
                model = manager.getModelequipment()[modelId];
                // }
                break;
            case GOODS_TYPE.SERVANT_EQUIP:
                model = manager.getModelmountEquipment()[modelId];
                break;
            case GOODS_TYPE.BOX:
                model = manager.getModelbox()[modelId];
                break;
            case GOODS_TYPE.ITEM:
                model = manager.getModelitem()[modelId];
                break;
            case GOODS_TYPE.SHENTONG:
                // model = manager.getModelshentong()[modelId];
                break;
            case GOODS_TYPE.YUANSHEN:
                model = manager.getModelyuanshen()[modelId];
                break;
            case GOODS_TYPE.SHOW:
                model = manager.getModelshow()[modelId];
                break;
            case GOODS_TYPE.GEM://宝石
                model = manager.getModelbaoshi()[modelId];
                break;
            case GOODS_TYPE.GOLD:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.quality = GoodsQuality.Purple;
                model.icon = "yuanbao_png";
                model.Dropicon = "yuanbao_png";
                model.type = type;
                model.des = "罕见货币，通过活动及游戏内系统产出，可以在商场中购买各种道具。";
                break;
            case GOODS_TYPE.DIAMOND:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "zuanshi_png";
                model.Dropicon = "zuanshi_png";
                model.quality = GoodsQuality.Orange;
                model.type = type;
                model.des = "珍稀的货币，仅可通过充值获得，可用于在商城中购买各种道具以及参与各类活动。";
                break;
            case GOODS_TYPE.EXP:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "jingyan_png";
                model.Dropicon = "djinyanzhi_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "通过挂机和参与各类玩法可以获得，累计足够经验可以提升角色等级。";
                break;
            case GOODS_TYPE.SHENGWANG:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "shengwang_png";
                model.Dropicon = "shengwang_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.tujing = "92";
                model.des = "参加跨服竞技场可获得，可在跨服商城中兑换全新永久时装和伏魔、诛仙碎片！";
                break;
            case GOODS_TYPE.ANIMA:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "lingqi_png";
                model.Dropicon = "dlingqi_png";
                model.quality = GoodsQuality.Blue;
                model.type = type;
                model.tujing = "8";
                model.des = "通过分解装备，探索boss等玩法产出，可用于装备注灵。";
                break;
            case GOODS_TYPE.YUELI:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "yueli_png";
                model.Dropicon = "dyueli_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "";
                break;
            case GOODS_TYPE.RONGYU:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "gongxun_png";
                model.Dropicon = "dgongxun_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "通过参与天梯，可在荣誉商城中购买道具。";
                break;
            case GOODS_TYPE.SHOJIFEN:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "jifen_png";
                model.Dropicon = "djifen_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "通过商城消耗钻石获得。";
                break;
            case GOODS_TYPE.VIPEXP:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "vipjingyanka_png";
                model.Dropicon = "dvipjingyanka_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "充值获得";
                break;
            case GOODS_TYPE.ARENA:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "jingjidian_png";
                model.Dropicon = "djingjidian_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "通过参与跨服竞技场，可在竞技商城中购买道具。";
                break;
            case GOODS_TYPE.POINTS:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "turnplate_integral_icon_png";
                model.Dropicon = "turnplate_integral_icon_png";
                model.quality = GoodsQuality.Green;
                model.type = type;
                model.des = "转盘积分,可以在积分商城兑换道具";
                break;
            case GOODS_TYPE.DONATE://帮会贡献
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "banggong_icon_png";
                model.Dropicon = "union_donate_icon_png";
                model.quality = GoodsQuality.Green;
                model.type = type;
                model.des = "仙盟贡献";
                model.tujing = '35';
                break;
            case GOODS_TYPE.SAVVY://悟性
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "wuxing_png";
                model.Dropicon = "union_donate_icon_png";
                model.quality = GoodsQuality.Green;
                model.type = type;
                model.des = "悟性";
                model.tujing = '36';
                break;
            case GOODS_TYPE.VIGOUR://修为
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "yuanqi_png";
                model.Dropicon = "coatard_icon_png";
                model.quality = GoodsQuality.Green;
                model.type = type;
                model.des = "修为";
                model.tujing = "36";
                break;
            case GOODS_TYPE.TLINTEGRAL://限时积分
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "jingfen_png";
                model.Dropicon = "djifen_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "限时积分";
                break;
            case GOODS_TYPE.HUANQI:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "jingfen_png";
                model.Dropicon = "djifen_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "元气";
                break;
            case GOODS_TYPE.CAOYAO:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "jingfen_png";
                model.Dropicon = "djifen_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "草药";
                break;
            case GOODS_TYPE.FAHUN:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "fahun_png";
                model.Dropicon = "fahun_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "在武坛圣座中可获得此元素，用来为心法升级，带来更多属性加成！";
                break;
            // case GOODS_TYPE.ZHULIBI:
            //     model = new Object();
            //     model.name = Language.instance.getText(`currency${type}`);
            //     model.icon = "zhulizhi_icon_png";
            //     model.Dropicon = "zhulizhi_icon_d_png";
            //     model.quality = GoodsQuality.Orange;
            //     model.type = type;
            //     model.des = "邀请好友获得助力币，可在助力商城中换购超值道具！";
            //     break;
            case GOODS_TYPE.DANYAO:
                model = manager.getModelxiandan()[modelId];
                model.des = model.desc;
                break;
            case GOODS_TYPE.RNUES:
                model = manager.getModelzhanwen()[modelId];
                model.des = model.des;
                break;
            case GOODS_TYPE.ZHANGONG:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "zhangong_png";
                model.Dropicon = "zhangong_png";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "战功";
                break;
            case GOODS_TYPE.SHAREEXP:
                model = new Object();
                model.name = Language.instance.getText(`currency${type}`);
                model.icon = "";
                model.Dropicon = "";
                model.quality = GoodsQuality.Purple;
                model.type = type;
                model.des = "";
                break;
        }
        if (model) {
            modelthing = new ModelThing(model, type);
            if (Tool.isNumber(quality)) {
                modelthing.quality = quality;
            }
            this._modelthingDict[modelkey] = modelthing;
        }

        return modelthing;
    }
    //根据字符串获取ModelThing
    public getModelThingByParam(param: string): ModelThing {
        let awarditem: AwardItem = GameCommon.parseAwardItem(param);
        return this.getThingModel(awarditem.type, awarditem.id, awarditem.quality);
    }
    //根据物品
    public CreateNameColer(quality: number): number {
        var color: number = 0;
        switch (quality) {
            case GoodsQuality.White:
                color = 0xe2e2e2;
                break;
            case GoodsQuality.Green:
                color = 0x5aff91;
                break;
            case GoodsQuality.Blue:
                color = 0x55c4ff;
                break;
            case GoodsQuality.Purple:
                color = 0xea4aff;
                break;
            case GoodsQuality.Orange:
                color = 0xFFDB28;
                break;
            case GoodsQuality.Red:
                color = 0xff4633;
                break;
            case GoodsQuality.Gold:
                color = 0xFF9F0F;
                break;
            default:
                Tool.log("CreateNameColer: " + quality);
                break;
        }
        return color;
    }
    //获取物品品质框
    public getIconFrame(quality: number): string {
        var str: string = "";
        switch (quality) {
            case GoodsQuality.White:
                str = "bag_whiteframe_png";
                break;
            case GoodsQuality.Green:
                str = "bag_greenframe_png";
                break;
            case GoodsQuality.Blue:
                str = "bag_blueframe_png";
                break;
            case GoodsQuality.Purple:
                str = "bag_purpleframe_png";
                break;
            case GoodsQuality.Orange:
                str = "bag_orangeframe_png";
                break;
            case GoodsQuality.Red:
                str = "bag_redframe_png";
                break;
            case GoodsQuality.Gold:
                str = "bag_goldframe_png";
                break;
        }
        return str;
    }
    //获取物品品质框等级底
    public getIconFrameDi(quality: number): string {
        var str: string = "";
        switch (quality) {
            case GoodsQuality.White:
                str = "equip_dengjikuang_bai_png";
                break;
            case GoodsQuality.Green:
                str = "equip_dengjikuang_lv_png";
                break;
            case GoodsQuality.Blue:
                str = "equip_dengjikuang_lan_png";
                break;
            case GoodsQuality.Purple:
                str = "equip_dengjikuang_zi_png";
                break;
            case GoodsQuality.Orange:
                str = "equip_dengjikuang_cheng_png";
                break;
            case GoodsQuality.Red:
                str = "equip_dengjikuang_hong_png";
                break;
            case GoodsQuality.Gold:
                str = "equip_dengjikuang_jin_png";
                break;
        }
        return str;
    }
    // //获得上古套装框
    // public getDomIconFrame(tier: number): string {
    //     var str: string = `dominate_quailty${tier}_png`;
    //     return str;
    // }
    // //获得上古套装框
    // public getDomIconBack(tier: number): string {
    //     var str: string = "";
    //     switch (tier) {
    //         case 0:
    //             str = "bag_purpleback_jpg";
    //             break;
    //         case 1:
    //             str = "bag_orangeback_jpg";
    //             break;
    //     }
    //     return str;
    // }
    //获取元魂品质框
    public getPsychIconFrame(quality: number): string {
        var str: string = "";
        switch (quality) {
            case GoodsQuality.White:
                str = "psych_quality_bg_white_png";
                break;
            case GoodsQuality.Green:
                str = "psych_quality_bg_green_png";
                break;
            case GoodsQuality.Blue:
                str = "psych_quality_bg_blue_png";
                break;
            case GoodsQuality.Purple:
                str = "psych_quality_bg_purple_png";
                break;
            case GoodsQuality.Orange:
                str = "psych_quality_bg_orange_png";
                break;
            case GoodsQuality.Red:
                str = "psych_quality_bg_red_png";
                break;
        }
        return str;
    }

    //获得物品提示
    private NOT_SHOW_TYPE: number[] = [GOODS_CHANGE_TYPE.XIANSHAN_ADD, GOODS_CHANGE_TYPE.RNUES_EQUIP_PACKAGE_ADD, GOODS_CHANGE_TYPE.TAKEOFF_ADD, GOODS_CHANGE_TYPE.DIAL_ADD, GOODS_CHANGE_TYPE.MAGIC_TURNPLATE_ADD, GOODS_CHANGE_TYPE.WISHINGWELL_ADD, GOODS_CHANGE_TYPE.SERVER_ARENA_ADD, GOODS_CHANGE_TYPE.BLESS_EQUIP_ADD, GOODS_CHANGE_TYPE.VIPZHUANPAN_ADD];
    private Show_DelayType: number[] = [GOODS_CHANGE_TYPE.FIGHT_BRUSH_MONSTER_ADD, GOODS_CHANGE_TYPE.FIGHT_BRUSH_BOSS_ADD, GOODS_CHANGE_TYPE.YEWAI_PVP_ADD];
    public onGetThingAlert(thing: ModelThing, num: number, thingFrom: number): void {
        if (this.NOT_SHOW_TYPE.indexOf(thingFrom) >= 0) {
            return;
        }
        var showdalay: number = this.Show_DelayType.indexOf(thingFrom) >= 0 ? 1600 : 0;
        var addThingNum: number = num > 0 ? num : 1;
        Tool.callbackTime(this.addThingAlertText, this, showdalay, thing, addThingNum, thingFrom);
    }
    private addThingAlertText(thing: ModelThing, num: number, thingFrom: number): void {
        var addThingText: egret.ITextElement[] = [];
        addThingText.push({ text: "获得：", style: { textColor: 0xffffff } });
        addThingText.push({ text: thing.name + "*" + num, style: { textColor: GameCommon.getInstance().CreateNameColer(thing.quality) } });
        PromptPanel.getInstance().addPromptGain(addThingText);
        if (thing.type == GOODS_TYPE.MASTER_EQUIP && thing.quality >= GoodsQuality.Red
            && thingFrom != GOODS_CHANGE_TYPE.CELESTIAL_COMPOUND
            && thingFrom != GOODS_CHANGE_TYPE.ORANGE_COMPOUND
            && thingFrom != GOODS_CHANGE_TYPE.RNUES_EQUIP_ADD) {
            let rare: RareEquip = new RareEquip();
            rare.data = thing;
            PromptPanel.getInstance().getRareEquipShow(rare);
        }
    }
    //获得元魂提示
    public onGetPsychAlert(thing: Modelyuanshen, thingFrom: number): void {
        if (thingFrom == PSYCH_CHANGE_TYPE.CHANGE_ADD) return;
        var showdalay: number = 0;
        var addThingAlertFunc: Function = function (thingItem: ThingBase) {
            var addThingText: egret.ITextElement[] = [];
            addThingText.push({ text: "获得：", style: { textColor: 0xffffff } });
            addThingText.push({ text: thing.name, style: { textColor: GameCommon.getInstance().CreateNameColer(thing.pinzhi) } });
            PromptPanel.getInstance().addPromptGain(addThingText);
        };
        Tool.callbackTime(addThingAlertFunc, this, showdalay, thing);
    }
    public onGetPillAlert(dropawardItem: AwardItem): void {
        var addThingAlertFunc: Function = function (thingItem: ThingBase) {
            var addThingText: egret.ITextElement[] = [];
            addThingText.push({ text: "获得：", style: { textColor: 0xffffff } });
            addThingText.push({ text: '草药', style: { textColor: GameCommon.getInstance().CreateNameColer(3) } });
            PromptPanel.getInstance().addPromptGain(addThingText);
        };
    }
    //获得命格提示
    public onGetFateAlert(thing: Modelmingge, fateFrom: number): void {
        if (fateFrom == 10126) return;
        var showdalay: number = 0;
        var addThingAlertFunc: Function = function (thingItem: ThingBase) {
            var addThingText: egret.ITextElement[] = [];
            addThingText.push({ text: "获得：", style: { textColor: 0xffffff } });
            addThingText.push({ text: thing.name, style: { textColor: GameCommon.getInstance().CreateNameColer(thing.pinzhi) } });
            PromptPanel.getInstance().addPromptGain(addThingText);
        };
        Tool.callbackTime(addThingAlertFunc, this, showdalay, thing);
    }

    //配置带颜色的HTML字 格式：[#00ff00XXXXXXXX] 转化成<font color='#00ff00'>XXXXXXX</font>
    public readStringToHtml(oldString: string): string {
        var _newHtmlString: string = "";
        if (oldString) {
            var matchStrAry: RegExpMatchArray = oldString.match(/\[#[0-9a-fA-F]{6}.*?]/g);
            if (matchStrAry) {
                for (var i: number = 0; i < matchStrAry.length; i++) {
                    var matchStr: string = matchStrAry[i];
                    var _colorStr: string = matchStr.slice(1, 8);
                    var _descStr: string = matchStr.slice(8, matchStr.length - 1);
                    var _htmlStr: string = "<font color='" + _colorStr + "'>" + _descStr + "</font>";
                    oldString = oldString.replace(/\[#[0-9a-fA-F]{6}.*?]/, _htmlStr);
                }
            }
            _newHtmlString = oldString;
        }
        return _newHtmlString;
    }
    /**解析字符串物品结构 ;代表多个物品 ,分隔物品类型 物品id 物品数量**/
    public onParseAwardItemstr(itemdropstr: string): AwardItem[] {
        if (!itemdropstr || itemdropstr == "0" || itemdropstr == "*")
            return null;
        var awardStrItems: AwardItem[] = [];
        var awardStrAry: string[];
        if (itemdropstr.indexOf("#") >= 0) {
            awardStrAry = itemdropstr.split("#");
        } else {
            awardStrAry = itemdropstr.split(";");
        }
        for (var i: number = 0; i < awardStrAry.length; i++) {
            var awardstrItem: string[] = awardStrAry[i].split(",");
            var awarditem: AwardItem = new AwardItem();
            awarditem.type = parseInt(awardstrItem[0]);
            awarditem.id = parseInt(awardstrItem[1]);
            switch (awarditem.type) {
                case GOODS_TYPE.YUANSHEN:
                    awarditem.num = awardstrItem.length > 2 ? parseInt(awardstrItem[2]) : 0;
                    awardStrItems.push(awarditem);
                    break;
                default:
                    awarditem.num = awardstrItem.length > 2 ? parseInt(awardstrItem[2]) : 0;
                    awarditem.quality = awardstrItem.length > 3 ? parseInt(awardstrItem[3]) : -1;
                    awardStrItems.push(awarditem);
                    break;
            }
        }
        return awardStrItems;
    }
    /**获取单件物品奖励**/
    public static parseAwardItem(str: string): AwardItem {
        if (!str || str == "*" || str == "0") {
            return null;
        }
        var awardstrItem: string[] = str.split(",");
        var awarditem: AwardItem = new AwardItem();
        awarditem.type = parseInt(awardstrItem[0]);
        awarditem.id = parseInt(awardstrItem[1]);
        switch (awarditem.type) {
            case GOODS_TYPE.YUANSHEN:
                if (awardstrItem.length > 3) {
                    awarditem.num = awardstrItem.length > 2 ? parseInt(awardstrItem[2]) : 0;
                    awarditem.lv = awardstrItem.length > 3 ? parseInt(awardstrItem[3]) : 1;
                }
                break;
            default:
                awarditem.num = awardstrItem.length > 2 ? parseInt(awardstrItem[2]) : 0;
                awarditem.quality = awardstrItem.length > 3 ? parseInt(awardstrItem[3]) : -1;
                break;
        }
        return awarditem;
    }
    //合并两个奖励数组
    public concatAwardAry(awarditemAry: AwardItem[][]): AwardItem[] {
        let awardItemAry: AwardItem[] = [];
        let awarditemDict = {};
        for (let i: number = 0; i < awarditemAry.length; i++) {
            let rewardsAry: AwardItem[] = awarditemAry[i];
            for (let n: number = 0; n < rewardsAry.length; n++) {
                let awarditemobj: AwardItem = rewardsAry[n];
                if (awarditemDict[awarditemobj.type + "_" + awarditemobj.id]) {
                    awarditemDict[awarditemobj.type + "_" + awarditemobj.id].num += awarditemobj.num;
                } else {
                    awarditemDict[awarditemobj.type + "_" + awarditemobj.id] = awarditemobj;
                }
            }
        }
        for (let itemId in awarditemDict) {
            let awarditemobj: AwardItem = awarditemDict[itemId];
            awardItemAry.push(awarditemobj);
        }
        awarditemDict = null;
        return awardItemAry;
    }

    public static onParseVipBuyItemstr(itemdropstr: string) {
        if (!itemdropstr)
            return null;
        let vipitem: VipBuyItem;
        let vipStrItems = {};
        let awardStrAry: string[];
        if (itemdropstr.indexOf("#") >= 0) {
            awardStrAry = itemdropstr.split("#");
        } else {
            awardStrAry = itemdropstr.split(";");
        }
        for (let i: number = 0; i < awardStrAry.length; i++) {
            vipitem = GameCommon.parseVipBuyItem(awardStrAry[i]);
            vipStrItems[vipitem.lv] = vipitem;
        }
        return vipStrItems;
    }

    public static parseVipBuyItem(str: string): VipBuyItem {
        var vipstrItem: string[] = str.split(",");
        var awarditem: VipBuyItem = new VipBuyItem();
        awarditem.lv = parseInt(vipstrItem[0]);
        awarditem.max = parseInt(vipstrItem[1]);
        return awarditem;
    }

    public addHintBar(message: Message) {
        var code = message.getShort();
        Tool.log("400 - code:" + code);
        this.addAlert(GameErrorTip.getInstance().getGameErrorTip(code));
        switch (code) {
            case GameErrorTip.ERROR_ID_ARENA_CHANGE:
                var refreshEnemyListMsg: Message = new Message(MESSAGE_ID.ARENE_REFRESH_ENEMYLIST_MESSAGE);
                GameCommon.getInstance().sendMsgToServer(refreshEnemyListMsg);
                break;
            case GameErrorTip.ERROR_ID_PLUSE_FAIL:
                GameDispatcher.getInstance().dispatchEventWith(GameEvent.PULSE_UP_FAIL_EVENET);
                break;
            // case GameErrorTip.ERROR_ID_SAMSARA_REBORN:
            //     GameFight.getInstance().onBossFightReborn();
            //     break;
            case GameErrorTip.ERROR_ID_LADDER_END:
                if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.LODDER_ARENA) {
                    GameFight.getInstance().fightScene.onDestroyScene();
                }
                break;
            // case GameErrorTip.ERROR_ID_DIAMOND:
            //     this.addAlertDiamondBuy();
            //     break;
            // case GameErrorTip.ERROR_ID_UNIONCD:
            //     if (!this.gameWorld.logicManager.unionManager.isBuyJoinCD)
            //         this.showJoinUnionCDAlert();
            //     break;
        }
    }

    public addAlert(text: string): void {
        PromptPanel.getInstance().addPromptError(Language.instance.getText(text));
    }
    //The end
    /**
     * 快速购买
     */
    public onShowFastBuy(itemId: number, type: GOODS_TYPE = GOODS_TYPE.ITEM): void {
        var thingmodel: ModelThing = this.getThingModel(type, itemId);
        if (thingmodel && thingmodel.tujing) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("FastBuyPanel", thingmodel));
        }
    }
    //检查物品不足 自动弹出快速购买
    public onCheckItemConsume(itemId: number, consumenum: number, type: GOODS_TYPE = GOODS_TYPE.ITEM, limitGoodsId: number = -1): boolean {
        var checkHasCount: boolean = false;
        var player: Player = DataManager.getInstance().playerManager.player;
        var hasItenNum: number = 0;
        var itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(itemId) as ItemThing;
        switch (type) {
            case GOODS_TYPE.ITEM:
                hasItenNum = itemThing ? itemThing.num : 0;
                if (limitGoodsId != -1) {
                    var limitThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(limitGoodsId);
                    if (limitThing) {
                        hasItenNum += limitThing.num;
                    }
                }
                break;
            default:
                hasItenNum = player.getICurrency(type);
                break;
        }
        if (hasItenNum >= consumenum) {
            checkHasCount = true;
        }
        if (!checkHasCount) {
            if (type == GOODS_TYPE.DIAMOND) {
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
            } else if (type == GOODS_TYPE.GOLD) {
                //return this.onCheckItemConsume(0, consumenum, GOODS_TYPE.DIAMOND);
                this.addAlert(Language.instance.getText("currency4") + `不足`);
                return false;
            } else {
                this.onShowFastBuy(itemId);
                return false;
            }
            var itemModel = this.getThingModel(type, itemId);
            if (itemModel)
                this.addAlert(`${itemModel.name}数量不足`);
        }
        return checkHasCount;
    }
    /**
     * 调用新手引导
     **/
    public onSendGuideComplete(): void {//guideType: FUNCTIP_TYPE
        // var message: Message = new Message(MESSAGE_ID.NOVICE_GUIDE_UPDATE);
        // message.setByte(guideType);
        // message.setByte(1);
        // GameCommon.getInstance().sendMsgToServer(message);
        // DataManager.getInstance().playerManager.player.noviceGuide[guideType] = 1;
    }
    /**
     * 气泡提醒功能
    */
    public onShowFuncTipsBar(functipType: FUNCTIP_TYPE, desc: string): void {
        if (this.gameWorld.getGameScene().getModuleLayer()) {
            this.gameWorld.getGameScene().getModuleLayer().onShowFuncTipsBar(functipType, desc);
        }
    }
    public onHideFuncTipsBar(functipType: FUNCTIP_TYPE): void {
        if (this.gameWorld.getGameScene().getModuleLayer())
            this.gameWorld.getGameScene().getModuleLayer().onHideFuncTipsBar(functipType);
    }
    /**
     * 战斗力计算
     */
    public static calculationFighting(attr: number[]): number {
        var fighting: number = 0;
        fighting += attr[ATTR_TYPE.HP] * FightDefine.FIGHT_HP_FACTOR;
        fighting += attr[ATTR_TYPE.ATTACK] * FightDefine.FIGHT_ATTACK_FACTOR;
        fighting += attr[ATTR_TYPE.PHYDEF] * FightDefine.FIGHT_PHYDEF_FACTOR;
        fighting += attr[ATTR_TYPE.MAGICDEF] * FightDefine.FIGHT_MAGICDEF_FACTOR;
        fighting += attr[ATTR_TYPE.HIT] * FightDefine.FIGHT_HIT_FACTOR;
        fighting += attr[ATTR_TYPE.DODGE] * FightDefine.FIGHT_DODGE_FACTOR;
        fighting += attr[ATTR_TYPE.BLOCK] * FightDefine.FIGHT_BLOCK_FACTOR;
        fighting += attr[ATTR_TYPE.BREAK] * FightDefine.FIGHT_BREAK_FACTOR;
        fighting += attr[ATTR_TYPE.CRIT] * FightDefine.FIGHT_CRIT_FACTOR;
        fighting += attr[ATTR_TYPE.DUCT] * FightDefine.FIGHT_DUCT_FACTOR;
        fighting = Tool.toInt(fighting);
        return fighting;
    }
    //通过秒来获得时间格式 天时分秒，keep保持显示第几位 秒分时天
    public getTimeStrForSec1(sec: number, keepNum: number = 2) {
        var timeDesc: string = "";
        var _dayNum = Math.floor(sec / 86400);
        if (_dayNum > 0)
            timeDesc += _dayNum + "天";
        else if (keepNum >= 3)
            timeDesc += "0天";
        sec = sec - _dayNum * 86400;

        var _hoursNum = Math.floor(sec / 3600);
        if (_hoursNum > 0)
            timeDesc += _hoursNum + "小时";
        else if (keepNum >= 2)
            timeDesc += "0小时";
        sec = sec - _hoursNum * 3600;

        var _minutesNum = Math.floor(sec / 60);
        if (_minutesNum > 0) {
            timeDesc += _minutesNum < 10 ? "0" + _minutesNum + "分" : _minutesNum + "分";
        } else if (keepNum >= 1) {
            timeDesc += "00分";
        }
        sec = sec - _minutesNum * 60;

        var _secondsNum = Math.floor(sec);
        timeDesc += _secondsNum < 10 ? "0" + _secondsNum + "秒" : _secondsNum + "秒";

        return timeDesc;
    }
    //通过秒来获得时间格式 天时分秒，keep保持显示第几位 秒分时天
    public getTimeStrForSecHS(sec: number) {
        var timeDesc: string = "";
        var _dayNum = Math.floor(sec / 86400);
        if (_dayNum > 0)
            timeDesc += _dayNum + "天";
        sec = sec - _dayNum * 86400;

        var _hoursNum = Math.floor(sec / 3600);
        timeDesc += _hoursNum + "时";
        sec = sec - _hoursNum * 3600;

        var _minutesNum = Math.floor(sec / 60);
        if (_minutesNum > 0) {
            timeDesc += _minutesNum < 10 ? "0" + _minutesNum + "分" : _minutesNum + "分";
        } else {
            timeDesc += "00分";
        }

        if (sec < 60) {
            var _secondsNum = Math.floor(sec);
            timeDesc += _secondsNum < 10 ? "0" + _secondsNum + "秒" : _secondsNum + "秒";
        }

        return timeDesc;
    }
    public getTimeStrForSec2(sec: number, hasHours: boolean = true) {
        var timeDesc: string = "";

        var _hoursNum = Math.floor(sec / 3600);
        if (hasHours || _hoursNum > 0) {
            timeDesc += _hoursNum < 10 ? "0" + _hoursNum : _hoursNum + "";
            timeDesc += "：";
            sec = sec - _hoursNum * 3600;
        }

        var _minutesNum = Math.floor(sec / 60);
        timeDesc += _minutesNum < 10 ? "0" + _minutesNum : _minutesNum + "";
        timeDesc += "：";
        sec = sec - _minutesNum * 60;

        var _secondsNum = Math.floor(sec);
        timeDesc += _secondsNum < 10 ? "0" + _secondsNum : _secondsNum + "";

        return timeDesc;
    }
    /**为“获取途径”添加下划线**/
    public addUnderlineGet(label: eui.Label): void {
        label.stroke = 2;
        this.addUnderlineStr(label);
    }
    /**普通添加下划线**/
    public addUnderlineStr(label: eui.Label, text: string = null): void {
        if (!text) {
            text = label.text;
        }
        label.textFlow = (new egret.HtmlTextParser).parser(`<u>${text}</u>`);
    }
    /**
     * 得到黑色透明背景
     */
    public static getBlackTransparentBg(): egret.Shape {
        var bg: egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0x000000, 0.8);
        bg.graphics.drawRect(0, 0, size.width, size.height);
        bg.graphics.endFill();
        return bg;
    }
    /**
     * 战斗力还原属性
     */
    public static powerChangeAttribute(power: number): number[] {
        var attributes: number[] = GameCommon.getInstance().getAttributeAry();
        //生命战斗力
        var hpFight: number = power * 0.25 * 0.9;
        //生命
        attributes[ATTR_TYPE.HP] = Math.max(Tool.toInt(hpFight / FightDefine.FIGHT_HP_FACTOR), 100);
        //攻击战斗力
        var atkFight: number = power * 0.5 * 0.9;
        //攻击
        attributes[ATTR_TYPE.ATTACK] = Tool.toInt(atkFight / FightDefine.FIGHT_ATTACK_FACTOR);
        //防御战斗力
        var defFight: number = power * 0.125 * 0.9;
        //防御
        attributes[ATTR_TYPE.PHYDEF] = Tool.toInt(defFight / FightDefine.FIGHT_PHYDEF_FACTOR);
        attributes[ATTR_TYPE.MAGICDEF] = Tool.toInt(defFight / FightDefine.FIGHT_PHYDEF_FACTOR);
        return attributes;
    }
    /**
     * 对生物属性加成（减免）
     */
    public reviseBodyAttributesData(bodyData: BodyData, rateNum: number, fromIndex: number = ATTR_TYPE.HP, endIndex: number = ATTR_TYPE.BREAK): void {
        if (bodyData) {
            for (var i: number = fromIndex; i <= endIndex; i++) {
                var attrValue: number = bodyData.attributes[i];
                if (attrValue > 0) {
                    bodyData.attributes[i] = Math.max(0, Math.floor(rateNum * attrValue));
                }
            }
        }
    }

    public getBit2BooleanValue(value: number, index: number): boolean {
        if (index < 0) {
            return false;
        }
        return ((value >> index) & 0x01) > 0;
    }
    //通过VIP登记获得名字颜色
    public getColorByVIPLV(lv: number) {
        var color;
        if (lv == 0) {
            color = 0xffffff;
        } else if (lv >= 1 && lv <= 4) {
            color = 0x28e828;
        } else if (lv >= 5 && lv <= 8) {
            color = 0x289aea;
        } else if (lv >= 9 && lv <= 12) {
            color = 0xce2af1;
        } else if (lv >= 13 && lv <= 15) {
            color = 0xffae21;
        }
        return color;
    }
    public getNickname(str: string): string {
        var arr = str.split(".");
        arr.shift();
        return arr.join();
    }
    public getVipName(vipLv: number): number {
        return vipLv + VipDefine.VIP_START_LEVEL;
    }
    public getVipLevel(vipExp: number): number {
        var lv: number = 0;
        var model: Modelvip;
        var data = JsonModelManager.instance.getModelvip();
        model = data[0];
        if (vipExp < model.costNum) return 0;
        for (var i: number = (VipDefine.MAX_VIPLEVEL - 1); i >= 0; i--) {
            model = data[i];
            if (model.costNum <= vipExp) {
                break;
            }
        }
        return model.level;
    }
    /**
     * 创建一个GoodsInstance对象
     * */
    public createGoodsIntance(awarditem: AwardItem): GoodsInstance {
        var _goodsitem: GoodsInstance = new GoodsInstance();
        _goodsitem.onUpdate(awarditem.type, awarditem.id, awarditem.uid, awarditem.quality, awarditem.num);
        return _goodsitem;
    }
    /***
     *截取掉服前缀如S1.后的名称 
    */
    public getOutServerName(name: string): string {
        var outServerName: string = "";
        if (name) {
            var startIndex: number = name.indexOf(".") + 1;
            if (startIndex > 0)
                outServerName = name.slice(startIndex, name.length);
        }
        return outServerName;
    }
    /**
    * 更新或获取怪物的动画实例 默认方向向下 动作站立
    * */
    public getMonsterBody(monsterBody: BodyAnimation, monsterId: number, dirFrame = Direction.DOWN, aciton: string = "stand", playNum: number = -1): BodyAnimation {
        var _monsterFightter: Modelfighter = ModelManager.getInstance().getModelFigher(monsterId);

        var monsterBodyResUrl: string = LoadManager.getInstance().getMonsterResUrl(_monsterFightter.avata, aciton, dirFrame + "");
        if (monsterBody) {
            monsterBody.onUpdateRes(monsterBodyResUrl, playNum, dirFrame);
        } else {
            monsterBody = new BodyAnimation(monsterBodyResUrl, playNum, dirFrame);
        }
        if (_monsterFightter.avata.indexOf('boss') >= 0) {
            monsterBody.scaleX = 1.3;
            monsterBody.scaleY = 1.3;
        }
        return monsterBody;
    }
    /**
     * 添加动画到某层
     * 
     **/
    public addAnimation(res: string, pos: egret.Point, display: egret.DisplayObjectContainer, playnum: number = 1) {
        var anim = new Animation(res, playnum, playnum > 0 ? true : false);
        anim.x = pos ? pos.x : 0;
        anim.y = pos ? pos.y : 0;
        display.addChild(anim);
        return anim;
    }
    /**
     * 获取职业装备槽信息
     * 
     **/
    public getEquipSlotThingByIndexSlot(index: number, slot: number) {
        return DataManager.getInstance().playerManager.player.getPlayerData(index).getEquipSlotThings(slot);
    }
    /**
     * 获取格式化的数字显示
     */
    public getFormatNumberShow(num: number): string {
        if (num < 100000) {
            return num.toString();
        }
        if (num < 100000000) {
            var show: string = (num / 10000).toString();
            var pos: number = show.indexOf(".");
            if (pos > 0 && pos < 4)
                return show.substr(0, pos + 2) + "万";
            else
                return show.substr(0, 4) + "万";
        }
        var show: string = (num / 100000000).toString();
        var pos: number = show.indexOf(".");
        if (pos > 0 && pos < 4)
            return show.substr(0, pos + 3) + "亿";
        else
            return show.substr(0, 4) + "亿";
    }
    public objToArray(obj) {
        var ret = [];
        for (var key in obj) {
            ret.push(obj[key]);
        }
        return ret;
    }

    /**解析字符串物品结构 ;代表多个物品 ,分隔物品类型 物品id 物品数量**/
    public onParseGainItemstr(itemdropstr: string, type: number): AwardItem[] {
        if (!itemdropstr || itemdropstr == "0")
            return null;
        var awardStrItems: AwardItem[] = [];
        var awardStrAry: string[];
        if (itemdropstr.indexOf("#") >= 0) {
            awardStrAry = itemdropstr.split("#");
        } else {
            awardStrAry = itemdropstr.split(";");
        }
        for (var i: number = 0; i < awardStrAry.length; i++) {
            var awardstrItem: string[] = awardStrAry[i].split(",");
            var awarditem: AwardItem = new AwardItem();
            awarditem.id = parseInt(awardstrItem[0]);
            awarditem.type = type;
            awarditem.quality = parseInt(awardstrItem[1]);
            awarditem.num = parseInt(awardstrItem[2]);
            awardStrItems.push(awarditem);
            // switch (type) {
            //     // case GOODS_TYPE.MASTER_EQUIP:
            //     // case GOODS_TYPE.SERVANT_EQUIP:
            //     //     awarditem.quality = parseInt(awardstrItem[2]);
            //     //     awardStrItems.push(awarditem);
            //     //     break;

            //     case GOODS_TYPE.YUANSHEN:
            //         awarditem.quality = parseInt(awardstrItem[1]);
            //         awarditem.num = parseInt(awardstrItem[2]);
            //         awardStrItems.push(awarditem);
            //         break;
            //     default:
            //         awarditem.quality = parseInt(awardstrItem[1]);
            //         awarditem.num = parseInt(awardstrItem[2]);
            //         awardStrItems.push(awarditem);
            //         break;
            // }
        }
        return awardStrItems;
    }

    //parse逗号间隔
    public static parseIntArray(str: string) {
        var tmp: string[] = str.split(",")
        var result: number[] = [];
        for (var key in tmp) {
            result.push(parseInt(tmp[key]));
        }
        return result;
    }
    //The end
    private static chatOrder: number = 0;
    public static addAndGetChatOrder(): number {
        GameCommon.chatOrder++;
        return GameCommon.chatOrder;
    }
}