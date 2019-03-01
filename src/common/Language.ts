class Language {
	public static ALERT_DISCONNECT_1: string = '网络中断，请重新登录';
	public static ALERT_DISCONNECT_2: string = '该账户已在其他地方登录，请重新登录';
	public static ALERT_DISCONNECT_3: string = '登录超时，请重新登录';
	public static ALERT_DISCONNECT_4: string = '与服务器通信异常';
	public static ALERT_DISCONNECT_5: string = '服务器维护中，请稍后再试';
	public static ALERT_DISCONNECT_6: string = '账户异常，请联系客服';

	private static _instance = null;

	public static get instance(): Language {
		if (this._instance == null) {
			this._instance = new Language();
		}
		return this._instance;
	}

	public constructor() {
	}
	/**从Text配置文件中获取文字**/
	public getText(...texts): string {
		var text: string = "";
		for (var tId in texts) {
			var _textStr: string = texts[tId];
			var _textDict = JsonModelManager.instance.getModeltext();
			if (_textDict && _textDict[_textStr]) {
				text += _textDict[_textStr].text;
			} else {
				text += _textStr;
			}
		}
		return text;
	}
	/**获取属性名**/
	public getAttrName(attrType): string {
		return this.getText(`attr${attrType}_name`);
	}
	/**将数组字符串 插入 {0}、{1}..**/
	public parseInsertText(oldStr: string, ...texts): string {
		var _oldText: string = this.getText(oldStr);
		for (var tId in texts) {
			var text: string = this.getText(texts[tId]);
			_oldText = _oldText.replace(`{${tId}}`, text);
		}
		return _oldText;
	}
	//The end
}