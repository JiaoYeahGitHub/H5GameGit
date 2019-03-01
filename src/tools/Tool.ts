// 工具类
class Tool {
    private static timerManager = {};
    private static callbacktimeManager = {};

    public static logClassName(str) {
        if (platform.isLocalTest()) {
            egret.log("className: " + str);
        }
    }
    public static log(str) {
        // if (SDKManager.isLocal) {
        //     egret.log("log: " + str);
        // }
    }
    public static randomInt(a, b) {
        return a + Math.floor((Math.random() * (b - a)));
    }
    public static randomFloat(a, b) {
        return a + (Math.random() * (b - a));
    }
    public static callback(callback, target, ...param) {
        egret.callLater(callback, target, ...param);
        // callback.call(target, ...param);
    }
    public static callbackTime(callback, target, time, ...param) {
        var timeoutKey = -1;
        if (time > 0) {
            var callbackObj = { intervalId: 0, callback: callback, target: target, time: time, args: param };
            var callbackFunc = function (callbackObj): void {
                this.callback(callbackObj.callback, callbackObj.target, ...callbackObj.args);
                egret.clearTimeout(callbackObj.intervalId);
            }
            callbackObj.intervalId = egret.setTimeout(callbackFunc, this, time, callbackObj);
            timeoutKey = callbackObj.intervalId;
        } else {
            this.callback(callback, target, ...param);
        }
        return timeoutKey;
    }
    public static throwException(logstr = undefined, classz = ExceptionBase) {
        if (logstr) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
                alert(logstr);
            } else {
                egret.log(logstr);
            }
        }
        throw new classz();
    }
    public static addTimer(callback, thisObject, time: number = 1000) {
        if (!Tool.timerManager[time.toString()]) {
            var timer: egret.Timer = new egret.Timer(time);
            timer.start();
            Tool.timerManager[time.toString()] = timer;
        }
        Tool.callback(callback, thisObject);
        Tool.timerManager[time.toString()].addEventListener(egret.TimerEvent.TIMER, callback, thisObject);
    }
    public static removeTimer(callback, thisObject, time: number = 1000) {
        if (Tool.timerManager[time.toString()]) {
            Tool.timerManager[time.toString()].removeEventListener(egret.TimerEvent.TIMER, callback, thisObject);
        }
    }
    public static removeArrayObj(array: any[], obj) {
        var idx = array.indexOf(obj);
        if (idx >= 0) {
            array.splice(idx, 1);
        }
    }
    public static isNumber(num: number): boolean {
        if (num != null) return !isNaN(num);//egret.NumberUtils.isNumber(value)
        return false;
    }
    public static stringIsNum(val): boolean {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        return regPos.test(val);
    }
    //计算朝向
    public static checkFace8(startx, starty, endx, endy) {// 角度0-360
        var angle = (-(Math.atan2((endy - starty), (endx - startx))) * (180 / Math.PI));
        return Tool.getFaceByAngle(angle);
    }
    //根据角度计算出朝向 angle角度 X逆时针0~180；X轴顺时针0~-180
    public static getFaceByAngle(angle: number): Direction {
        var _diretion: Direction;
        if (angle > 67.5 && angle < 112.5) {
            _diretion = Direction.UP;
        }
        else {
            if (angle > 22.5 && angle < 67.5) {
                _diretion = Direction.RIGHTUP;
            }
            else {
                if (angle > -22.5 && angle < 22.5) {
                    _diretion = Direction.RIGHT;
                } else {
                    if (angle > -67.5 && angle < -22.5) {
                        _diretion = Direction.RIGHTDOWN;
                    } else {
                        if (angle > -112.5 && angle < -67.5) {
                            _diretion = Direction.DOWN;
                        } else {
                            if (angle > -157.5 && angle < -112.5) {
                                _diretion = Direction.LEFTDOWN;
                            } else {
                                if (angle > 112.5 && angle < 157.5) {
                                    _diretion = Direction.LEFTUP;
                                } else {
                                    _diretion = Direction.LEFT;
                                }
                            }
                        }
                    }
                }
            }
        }
        return _diretion;
    }
    //根据方向获取角度
    public static getAngleByDir(diretion: Direction): number {
        switch (diretion) {
            case Direction.DOWN:
                return 0;
            case Direction.RIGHTDOWN:
                return 60;
            case Direction.RIGHT:
                return 90;
            case Direction.RIGHTUP:
                return 120;
            case Direction.UP:
                return 180;
            case Direction.LEFTUP:
                return 240;
            case Direction.LEFT:
                return 270;
            case Direction.LEFTDOWN:
                return 300;
        }
    }
    //计算击退后的坐标
    public static beelinePoint(x: number, y: number, fromDire: Direction, distance: number): egret.Point {
        var targetPoint: egret.Point = new egret.Point();
        var radianValue: number = Math.floor(Math.sin(45 * Math.PI / 180) * distance);
        switch (fromDire) {
            case Direction.DOWN:
                targetPoint.x = x;
                targetPoint.y = y + distance;
                break;
            case Direction.LEFTDOWN:
                targetPoint.x = x - radianValue;
                targetPoint.y = y + radianValue;
                break;
            case Direction.LEFT:
                targetPoint.x = x - distance;
                targetPoint.y = y;
                break;
            case Direction.LEFTUP:
                targetPoint.x = x - radianValue;
                targetPoint.y = y - radianValue;
                break;
            case Direction.UP:
                targetPoint.x = x;
                targetPoint.y = y - distance;
                break;
            case Direction.RIGHTUP:
                targetPoint.x = x + radianValue;
                targetPoint.y = y - radianValue;
                break;
            case Direction.RIGHT:
                targetPoint.x = x + distance;
                targetPoint.y = y;
                break;
            case Direction.RIGHTDOWN:
                targetPoint.x = x + radianValue;
                targetPoint.y = y + radianValue;
                break;
        }
        return targetPoint;
    }
    //根据角度和距离计算坐标   angle是从计算机坐标系 0 - 360;
    public static beelinePointByAngle(x: number, y: number, angle: number, distance: number): egret.Point {
        var targetPoint: egret.Point = new egret.Point();
        var radian: number = 0;
        if (angle <= 90) {
            radian = angle * (Math.PI / 180);
            targetPoint.x = x + Math.sin(radian) * distance;
            radian = (90 - angle) * (Math.PI / 180);
            targetPoint.y = y + Math.sin(radian) * distance;
        } else if (angle <= 180) {
            radian = (180 - angle) * (Math.PI / 180);
            targetPoint.x = x + Math.sin(radian) * distance;
            radian = (angle - 90) * (Math.PI / 180);
            targetPoint.y = y - Math.sin(radian) * distance;
        } else if (angle <= 270) {
            radian = (angle - 180) * (Math.PI / 180);
            targetPoint.x = x - Math.sin(radian) * distance;
            radian = (270 - angle) * (Math.PI / 180);
            targetPoint.y = y - Math.sin(radian) * distance;
        } else {
            radian = (Math.max(0, 360 - angle)) * (Math.PI / 180);
            targetPoint.x = x - Math.sin(radian) * distance;
            radian = (angle - 270) * (Math.PI / 180);
            targetPoint.y = y + Math.sin(radian) * distance;
        }
        return targetPoint;
    }
    //根据中心点 + 半径 + 角度 计算圆上的一点
    public static randomPosByDistance(x: number, y: number, distance: number, point: egret.Point = null): egret.Point {
        let angle: number = Math.floor(Math.random() * 360);
        return this.getPosByRadiiAndAngle(x, y, angle, distance, point);
    }
    //根据角度算出圆上一点
    public static getPosByRadiiAndAngle(x: number, y: number, angle: number, distance: number, point: egret.Point = null): egret.Point {
        if (!point) point = new egret.Point();
        point.x = Math.ceil(x + distance * Math.cos(angle * Math.PI / 180));
        point.y = Math.ceil(y - distance * Math.sin(angle * Math.PI / 180));
        return point;
    }
    //根据起始到终止点的方向 算出距离n的坐标
    public static getPosByTwoPoint(startX: number, startY: number, endX: number, endY: number, distance: number): egret.Point {
        let angle = (-(Math.atan2((endY - startY), (endX - startX))) * (180 / Math.PI));
        angle = angle < 0 ? 360 + angle : angle;
        return this.getPosByRadiiAndAngle(startX, startY, angle, distance);
    }
    //解压ZIP
    // public static readZipToXml(xmlName: string): egret.XML {
    //     try {
    //         var zip = new JSZip().load(RES.getRes("model_bin"), new GameJSZipLoadOptions());
    //         var xml = zip.file(xmlName).asText();
    //         xml = xml.replace(/\<?.*?\/?>/, "");
    //         return egret.XML.parse(xml);
    //     } catch (e) {
    //         Tool.log("read zip to xml Error!! name: " + xmlName);
    //         this.throwException();
    //     }
    // }
    public static readZipToJson(jsonname: string) {
        // let config = RES.getRes('config_json');
        // if (jsonname) {
        //     jsonname = jsonname.replace('.json', '');
        //     return config[jsonname];
        // }
        // return null;
        try {
            if (jsonname) {
                return ModelManager.getInstance().configJson[jsonname];
            }
            return null;
        } catch (e) {
            Tool.log("read zip to json Error!! name: " + jsonname);
            this.throwException();
        }
    }
    //异步加载配置文件内的资源
    public static getResAsync(key: string, compFunc, thisObject: any): void {
        if (RES.hasRes(key)) {
            if (RES.getRes(key)) {
                Tool.callback(compFunc, thisObject);
            } else {
                RES.getResAsync(key, compFunc, thisObject);
            }
        } else {
            Tool.callback(compFunc, thisObject);
        }
    }
    //截屏绘制
    public static onDrawDisObjToTexture(obj: egret.DisplayObject, clipBounds?: egret.Rectangle, scale: number = 1): egret.RenderTexture {
        var rt: egret.RenderTexture = new egret.RenderTexture;
        rt.drawToTexture(obj, clipBounds, scale);
        return rt;
    }
    /**属性对象转数组**/
    public static Object2Ary(param) {
        var arr: number[] = [];
        for (var key in param) {
            arr.push(param[key]);
        }
        return arr;
    }
    /**拼接属性加成字符串提示**/
    public static jointHintAttributeAddStr(arr) {
        var len = arr.length;
        var ret: egret.ITextElement[] = [];
        for (var i = 0; i < len; i++) {
            ret.push({ text: arr[i][0], style: { textColor: 0XFFFFFF } });
            ret.push({ text: "+" + arr[i][1], style: { textColor: 0X00FF00 } });
            ret.push({ text: "\n", style: {} });
        }
        ret.pop();
        return ret;
    }
    public static getCurrTime() {
        return new Date().getTime();
    }
    /**
     * 得到时间格式字符串
     * @param time 秒数 
     */
    public static getTimeStr(time: number): string {
        if (time > 0) {
            var hour = Math.floor(time / 3600);
            var minute = Math.floor((time % 3600) / 60);
            var second = Math.floor(time % 60);
            return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
        }
        return "00:00:00";
    }
    /**
     * 得到时间格式字符串
     * @param time 秒数 
     */
    public static getDayHourMinuteTimeStr(time: number): string {
        if (time > 0) {
            var day = Math.floor(time / 86400);
            var hour = Math.floor((time % 86400) / 3600);
            var minute = Math.floor((time % 3600) / 60);
            var second = Math.floor(time % 60);
            return day + "天" + (hour < 10 ? "0" + hour : hour) + "时" + (minute < 10 ? "0" + minute : minute) + "分";
        }
        return "00:00:00";
    }
    /**
     * 
     * 时间归为今天0点毫秒数
     * 
     */
    public static formatZeroDate(date: Date) {
        var str: string = date.toString();
        var reg = /[0-9]{2}:[0-9]{2}:[0-9]{2}/g;
        str = str.replace(reg, "00:00:00");
        date = new Date(Date.parse(str));
        return date;
    }
    /***
     * 返回一个HTML颜色格式字符串
     */
    public static getHtmlColorStr(desc: string, color: string): string {
        return `<font color='#${color}'>${desc}</font>`;
    }
    /***
     * 将HTML文本格式转化成富文本
     */
    private static _htmlParser: egret.HtmlTextParser;
    public static getHtmlITextElement(htmlTxt: string): egret.ITextElement[] {
        if (!this._htmlParser) {
            this._htmlParser = new egret.HtmlTextParser();
        }
        return this._htmlParser.parse(htmlTxt);
    }
    /**
     * 判断地址是不是IP地址
     * */
    public static isIPUrl(url: string): boolean {
        let reg = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/g;
        let matchStrAry = url.match(reg);
        return matchStrAry && matchStrAry.length > 0;
    }
    /**版本号比对 v1当前版本号， v2目标版本号**/
    public static compareVersion(v1, v2): number {
        if (!v1) return -1;
        if (!v2) return -1;

        v1 = v1.split('.');
        v2 = v2.split('.');
        var len = Math.max(v1.length, v2.length);

        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }

        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i]);
            var num2 = parseInt(v2[i]);

            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }

        return 0;
    }
    /**
     * 向下取整型
     */
    public static toInt(num: number): number {
        let floorvalue: number = Math.floor(num);
        return floorvalue > num ? floorvalue - 1 : floorvalue;
    }
    public static getChineseByImgNum(num): string {
        var chinese_digit: string = '' + (num);
        if (chinese_digit.length == 2) {
            if (chinese_digit[0] == '1') {
                if (chinese_digit[1] != '9')
                    chinese_digit = '9' + chinese_digit[1];
            }
            //  else if (num % 10 == 0) {
            // 	chinese_digit = chinese_digit;
            // } else {
            // 	chinese_digit = chinese_digit[0] + '0' + chinese_digit[1];
            // }
        }
        return chinese_digit;
    }
    //转换成汉字格式数字
    public static toChineseNum(num: number): string {
        var chinese_digit: string = '' + num;
        if (chinese_digit.length == 2) {
            if (num < 20) {
                chinese_digit = '0' + (chinese_digit[1] != '0' ? chinese_digit[1] : "");
            } else if (num % 10 == 0) {
                chinese_digit = chinese_digit;
            } else {
                chinese_digit = chinese_digit[0] + '0' + chinese_digit[1];
            }
        }
        return chinese_digit;
    }
    public static getChineseByNum(num: number): string {
        if (num <= 0) {
            return GameDefine.Chinese_Company_Ary[0];
        }
        if (num < 10) {
            return GameDefine.Chinese_Number_Ary[num];
        }
        if (num < 20) {
            return GameDefine.Chinese_Company_Ary[1] + GameDefine.Chinese_Number_Ary[num % 10];
        }
        let result = "";
        let numStr: string = num.toString();
        let length = numStr.length;
        let lastChar: number = -1;
        let wei = 0;
        for (let i = length - 1; i >= 0; --i) {
            let char = parseInt(numStr[i]);
            if (char == 0) {
                if (result.length > 0 && lastChar != 0) {
                    result = GameDefine.Chinese_Company_Ary[0] + result;
                }
            } else {
                if (wei > 0) {
                    result = GameDefine.Chinese_Number_Ary[char] + GameDefine.Chinese_Company_Ary[wei] + result;
                } else {
                    result = GameDefine.Chinese_Number_Ary[char] + result;
                }
            }
            wei++;
            lastChar = char;
        }
        return result;
    }
    public static currencyTo(sNum): string {
        var nNum = parseFloat(sNum);
        if (!isNaN(nNum)) {
            return nNum.toFixed(2);
        }
    }
    private static colorMatrix = [
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0, 0, 0, 1, 0
    ];
    public static setDisplayGray(disp: egret.DisplayObject, isGray: boolean = true) {
        if (disp) {
            if (isGray) {
                disp.filters = [new egret.ColorMatrixFilter(Tool.colorMatrix)];
            } else {
                disp.filters = [];
            }
        }
    }
    //The end
}
class ExceptionBase implements ExceptionInformation { }

class GameJSZipLoadOptions implements JSZipLoadOptions { }