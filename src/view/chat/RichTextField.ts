class RichTextField extends eui.Component {
    public label_content: eui.Label;
    private animLayer: eui.Group;
    private placeholder: string = "Ω";
    private htmlPlaceHolder: string = `<font color=0x336699 size=40>Ω</font>`;
    private expressObj;
    private expressPos;
    private faceSize;
    private faceCodeExRes = {
        "#001": "jingmaidan_png",
        "#002": "ronghunshi_png"
    }
    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onComplete, this);
        this.skinName = skins.RichTextFieldSkin;
    }
    private onComplete(): void {
        // this.label_content.addEventListener(egret.TextEvent.LINK, this.onTouchRichTextLink, this);
    }
    public appendEmojiText(str: string, isOpen: boolean = false) {
        if (isOpen) {
            var chatManager = DataManager.getInstance().chatManager;
            this.faceSize = chatManager.getChatWH(this.placeholder, 40);
            var replace = this.onCollectFace(str);
            var has: boolean = false;
            for (var key in this.expressObj) {
                has = true;
                break;
            }
            if (has) {
                this.onCalculate(replace);
                this.addFaces();
            }
            this.addTextFlow(replace)
        } else {
            this.label_content.text = str;
        }
    }
    private addFaces(): void {
        this.animLayer.removeChildren();
        var n: number = 0;
        var param: number[];
        var faceCode: string;
        var img: Emoji;
        var h: number = 0;
        var len: number = Math.round(this.height / this.label_content.size);
        for (var line: number = 0; line < len; line++) {
            param = this.expressPos[line];
            if (param) {
                for (var i: number = 0; i < param.length; i++) {
                    faceCode = this.expressObj[n];
                    if (this.faceCodeExRes[faceCode]) {
                        img = new Emoji();
                        img.source = this.faceCodeExRes[faceCode];
                        img.x = param[i];
                        img.y = h;
                        this.animLayer.addChild(img);
                        n++;
                    }
                }
                h += 40;
            } else {
                h += this.label_content.size;
            }
        }
    }
    private addTextFlow(str: string): void {
        var reg = /Ω/g;
        str = str.replace(reg, this.htmlPlaceHolder);
        this.label_content.textFlow = new egret.HtmlTextParser().parser(str);
    }
    private onCalculate(str: string) {
        var chatManager = DataManager.getInstance().chatManager;
        var w: number = 0;
        var h: number = 0;
        var faceX: number;
        var line: number = 0;
        var size;
        var chats: string[] = str.split("");
        var n: number = 0;
        this.expressPos = {};
        for (var i: number = 0; i < chats.length; i++) {
            var isFace: boolean = false;
            if (chats[i] == this.placeholder) {
                isFace = true;
                size = chatManager.getChatWH(chats[i], 40);
            } else {
                size = chatManager.getChatWH(chats[i], this.label_content.size);
            }
            if ((w + size[0]) <= this.width) {
                faceX = w;
                w = w + size[0];
            } else {
                w = size[0];
                faceX = 0;
                line++;
            }
            if (isFace) {
                if (!this.expressPos[line]) {
                    this.expressPos[line] = [];
                }
                this.expressPos[line].push(faceX);
            }
        }
    }
    private onCollectFace(str: string): string {
        var i: number = 0;
        var n: number = 0;
        var reg = /#[0-9]{3}/g;
        this.expressObj = {};
        this.expressObj = str.match(reg);
        var replace: string = str.replace(reg, this.placeholder);
        return replace;
    }
    public set textFlow(obj: egret.ITextElement[]) {
        this.label_content.textFlow = obj;
    }
}