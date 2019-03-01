/**
 *
 * @author 
 *
 */
class Modelmount extends JsonModelTemplet { }

class ModelManager {
    public configJson;
    public JOSN_GID = {};

    private static instance: ModelManager;
    // public modelMapWave = [];

    public constructor() {
        this.init();
    }

    public static getInstance(): ModelManager {
        if (this.instance == null) {
            this.instance = new ModelManager();
        }
        return this.instance;
    }
    private init(): void {
        /**JSON表中需要二级ID的请在这里填一下**/
        this.JOSN_GID["baoshi"] = "postion";
        this.JOSN_GID["lianhua"] = "type";
        this.JOSN_GID["ronghun"] = "postion";
        this.JOSN_GID["mount"] = "type";
        this.JOSN_GID["story"] = "stage";
        this.JOSN_GID['chongwu'] = "id";
        this.JOSN_GID['mountEqianghua'] = "postion";
        this.JOSN_GID['sixiang'] = "postion";
        this.JOSN_GID['sixiangjinjie'] = "postion";
        this.JOSN_GID['skilltupo'] = "skillId";
        this.JOSN_GID['shanggutaozhuang'] = "position";
        this.JOSN_GID['shenqi'] = "id";
        this.JOSN_GID["guildSkill"] = "id";
        this.JOSN_GID["tianshenzhuangbei"] = "coatardLv";
        this.JOSN_GID["fabaojinjie"] = "jieduan";
        this.JOSN_GID["fabaoshengji"] = "Lv";
        this.JOSN_GID["qianghuadashi"] = "type";
        this.JOSN_GID["tujiantaozhuang"] = "type";
        this.JOSN_GID["chongwujinjie"] = "jieduan";
        this.JOSN_GID["mounttaozhuang"] = "type";
        this.JOSN_GID["chengjiuMubiao"] = "type";
    }

    private _modelfighterDict;
    private _fighterNodeDataType;
    public getModelFigher(id: number): Modelfighter {
        if (!this._modelfighterDict) {
            this._modelfighterDict = {};
        }
        if (!this._modelfighterDict[id]) {
            let _figherjson = Tool.readZipToJson('fighter.json');
            let json = _figherjson[id.toString()];
            if (json) {
                if (!this._fighterNodeDataType) {
                    this._fighterNodeDataType = {};
                    for (let subkey in json) {
                        let subVal = json[subkey];
                        if (Tool.stringIsNum(subVal)) {
                            this._fighterNodeDataType[subkey] = "Int";
                        } else {
                            this._fighterNodeDataType[subkey] = "String";
                        }
                    }
                }

                let model: Modelfighter = new Modelfighter(json);
                for (let subkey in this._fighterNodeDataType) {
                    let subVal = json[subkey];
                    if (this._fighterNodeDataType[subkey] == "Int") {
                        subVal = parseInt(subVal);
                    } else {
                        subVal = subVal == "*" ? "" : subVal;
                    }
                    model[subkey] = subVal;
                }
                this._modelfighterDict[id] = model;
            }
        }
        return this._modelfighterDict[id];
    }

    private _modelmountDict;
    private _mountNodeDataType;
    public getModelMount(type: BLESS_TYPE, grade: number, level: number): Modelmount {
        if (type >= BLESS_TYPE.SIZE) return;
        if (!this._modelmountDict) {
            this._modelmountDict = {};
        }
        if (!this._modelmountDict[type]) {
            this._modelmountDict[type] = {};
        }
        let id: string = grade + '_' + level;
        let jsonname: string = `mount${type}.json`;
        if (!this._modelmountDict[type][id]) {
            let _mountJson = Tool.readZipToJson(jsonname);
            let json = _mountJson[id];
            if (json) {
                if (!this._mountNodeDataType) {
                    this._mountNodeDataType = {};
                    for (let subkey in json) {
                        let subVal = json[subkey];
                        if (Tool.stringIsNum(subVal)) {
                            this._mountNodeDataType[subkey] = "Int";
                        } else {
                            this._mountNodeDataType[subkey] = "String";
                        }
                    }
                }

                let model: Modelmount = new Modelmount(json);
                for (let subkey in this._mountNodeDataType) {
                    let subVal = json[subkey];
                    if (this._mountNodeDataType[subkey] == "Int") {
                        subVal = parseInt(subVal);
                    } else {
                        subVal = subVal == "*" ? "" : subVal;
                    }
                    model[subkey] = subVal;
                }
                this._modelmountDict[type][id] = model;
            }
        }
        return this._modelmountDict[type][id];
    }
    /**数据存储**/
    private allModelsHashMap = {};
    public onCreateModelHashMap(hashKey: string): any {
        let json_mode_dataType;
        if (!this.allModelsHashMap[hashKey]) {
            this.allModelsHashMap[hashKey] = {};
            let curHashMap = this.allModelsHashMap[hashKey];
            let jsonData = Tool.readZipToJson(hashKey + ".json");
            let groupID: string = this.JOSN_GID[hashKey];
            this.allModelsHashMap[hashKey + "_Lenth"] = groupID ? {} : 0;
            let _dictKey;
            let _Idx: number = 0;
            for (let key in jsonData) {
                let nodeJson: JSON = jsonData[key];
                let model: JsonModelTemplet = new JsonModelTemplet(nodeJson);
                if (!json_mode_dataType) {
                    json_mode_dataType = {};
                    for (let subkey in nodeJson) {
                        let subVal = nodeJson[subkey];
                        if (Tool.stringIsNum(subVal)) {
                            json_mode_dataType[subkey] = "Int";
                        } else {
                            json_mode_dataType[subkey] = "String";
                        }
                    }
                }
                for (let subkey in json_mode_dataType) {
                    let subVal = nodeJson[subkey];
                    if (json_mode_dataType[subkey] == "Int") {
                        subVal = parseInt(subVal);
                    } else {
                        subVal = subVal == "*" ? "" : subVal;
                    }
                    model[subkey] = subVal;
                }
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!curHashMap[model[groupID]]) {
                        curHashMap[model[groupID]] = {};
                        _Idx = 0;
                    }
                    _dictKey = _dictKey ? _dictKey : _Idx;
                    _Idx++;
                    curHashMap[model[groupID]][_dictKey] = model;
                    this.allModelsHashMap[hashKey + "_Lenth"] = _Idx;
                } else {
                    _dictKey = _dictKey ? _dictKey : _Idx;
                    curHashMap[_dictKey] = model;
                    _Idx++;
                    this.allModelsHashMap[hashKey + "_Lenth"] = _Idx;
                }
            }
        }
        return this.allModelsHashMap[hashKey];
    }
    /**获取数据长度**/
    public getModelLength(name: string): number {
        if (!this.allModelsHashMap[name + "_Lenth"]) {
            this.onCreateModelHashMap(name);
        }
        return this.allModelsHashMap[name + "_Lenth"];
    }
    /**实时解析类型**/
    public parseXmlToModel(map, classz, xml, isAll = false): void {
        if (map && classz && xml) {
            var res: egret.XML = <egret.XML>RES.getRes(xml);
            var mapType = 0;
            if (map instanceof Array) {
                mapType = 1;
            }
            for (var i = 0; i < res.children.length; ++i) {
                var model = new classz();
                model.parseXML(<egret.XML>res.children[i]);
                if (isAll) {
                    map.push(model);
                    map[model.id] = model;
                } else {
                    switch (mapType) {
                        case 0:
                            map[model.id] = model;
                            break;
                        case 1:
                            map.push(model);
                            break;
                    }
                }
            }
        } else {
            Tool.throwException();
        }
    }
    //The end
}