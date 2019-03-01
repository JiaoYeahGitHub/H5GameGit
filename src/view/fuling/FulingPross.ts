class FulingPross extends egret.DisplayObjectContainer {
    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
    }

    private init():void {
        // this.addToContainer(this.getArc(false));
        // this.addToContainer(this.getArc(true));

        // this.addToContainer(this.getArch(false));
        // this.addToContainer(this.getArch(true));

        // this.addToContainer(this.getSector(false, 1));
        // this.addToContainer(this.getSector(true, 1));
        // this.addToContainer(this.getSector(false, -1));
        // this.addToContainer(this.getSector(true, -1));

        // this.addToContainer(this.getArcProgress(false, 1));
        // this.addToContainer(this.getArcProgress(true, 1));
        // this.addToContainer(this.getArcProgress(false, -1));
        // this.addToContainer(this.getArcProgress(true, -1));
         this.addToContainer(this.getArcProgress(false, 1));
        this.addToContainer(this.getSectorProgress(false, 1));
        this.addToContainer(this.drawBorderProgress("jindutiaoqiu_png", false, 1));
    }

    private addToContainer(child:egret.DisplayObject):void {
        child.x = Math.floor(this.numChildren % 4) * 120 + 10;
        child.y = Math.floor(this.numChildren / 4) * 120 + 10;

        this.addChild(child);
    }

    private getArc(anticlockwise:boolean):egret.Shape {
        var shape:egret.Shape = new egret.Shape();
        shape.graphics.lineStyle(2, 0xffff00);
        shape.graphics.drawArc(50, 50, 50, 0, 30 * Math.PI / 180, anticlockwise);
        shape.graphics.endFill();
        return shape;
    }

    private getArch(anticlockwise:boolean):egret.Shape {
        var shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000);
        shape.graphics.drawArc(50, 50, 50, 0, Math.PI / 180 * 60, anticlockwise);
        shape.graphics.endFill();
        return shape;
    }

    private getSector(anticlockwise:boolean, dic:number):egret.Shape {
        var shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000);
        shape.graphics.moveTo(50, 50);
        shape.graphics.lineTo(100, 50);
        shape.graphics.drawArc(50, 50, 50, 0, 260 * Math.PI / 180 * dic, anticlockwise);
        shape.graphics.lineTo(50, 50);
        shape.graphics.endFill();

        return shape;
    }

    private getArcProgress(anticlockwise:boolean, dic:number):egret.Shape {
        var shape:egret.Shape = new egret.Shape();
        var angle = 0;
        egret.startTick(function (timeStamp:number):boolean {
            angle += 1 * dic;
            changeGraphics(angle);
            angle = angle % 360;

            return true;
        }, this);

        return shape;

        function changeGraphics(angle) {
            shape.graphics.clear();

            shape.graphics.lineStyle(2, 0x0000ff, 1);
            shape.graphics.drawArc(50, 50, 50, 0, angle * Math.PI / 180, anticlockwise);
            shape.graphics.endFill();

        }
    }

    private getSectorProgress(anticlockwise:boolean, dic:number):egret.Shape {
        var shape:egret.Shape = new egret.Shape();

        var angle = 0;
        egret.startTick(function (timeStamp:number):boolean {
            angle += 1 * dic;
            changeGraphics(angle);
            angle = angle % 360;
            return true;
        }, this);
        return shape;

        function changeGraphics(angle) {
            shape.graphics.clear();

            shape.graphics.beginFill(0xff0000);

            shape.graphics.moveTo(50, 50);
            shape.graphics.lineTo(100, 50);
            shape.graphics.drawArc(50, 50, 50, 0, angle * Math.PI / 180, anticlockwise);
            shape.graphics.lineTo(50, 50);

            shape.graphics.endFill();
        }
    }

    private drawMaskWithPic(key:string):egret.DisplayObjectContainer {
        var container:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

        var w = 100;
        var h = 100;
        var pic:egret.Bitmap = new egret.Bitmap(RES.getRes(key));
        container.addChild(pic);
        pic.width = w;
        pic.height = h;

        var progress = this.drawBorderProgress("club2_png", true, 1);
        container.addChild(progress);
        progress.alpha = 1;

        return container;
    }

    private drawBorderWithPic(picKey:string):egret.DisplayObjectContainer {
        var container:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

        var w = 96;
        var h = 96;
        var pic:egret.Bitmap = new egret.Bitmap(RES.getRes(picKey));
        container.addChild(pic);
        pic.width = w;
        pic.height = h;
        pic.x = 3;
        pic.y = 3;

        var progress = this.drawBorderProgress("club_png", false, 1);
        container.addChild(progress);

        return container;
    }

    private drawBgWithPic(key:string):egret.DisplayObjectContainer {
        var container:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

        var w = 100;
        var h = 100;
        var pic:egret.Bitmap = new egret.Bitmap(RES.getRes(key));
        container.addChild(pic);
        pic.width = w;
        pic.height = h;
        pic.alpha = 0.5;

        var progress = this.drawBorderProgress(key, false, 1);
        container.addChild(progress);

        return container;
    }

    private drawBorderProgress(key:string, anticlockwise:boolean, dic:number):egret.DisplayObjectContainer {
        var container:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        var w = 100;
        var h = 100;
        var r = Math.max(w, h) / 2 * 1.5;
        var bitmap = new egret.Bitmap(RES.getRes(key));
        container.addChild(bitmap);
        bitmap.width = w;
        bitmap.height = h;
        var shape:egret.Shape = new egret.Shape();
        shape.x = bitmap.width / 2;
        shape.y = bitmap.height / 2;

        bitmap.mask = shape;
        container.addChild(shape);

        var angle = 0;
        egret.startTick(function (timeStamp:number):boolean {
            angle += 1 * dic;
            changeGraphics(angle);
            angle = angle % 360;
            return true;
        }, this);
        return container;
        function changeGraphics(angle) {
            shape.graphics.clear();
            shape.graphics.beginFill(0x00ffff, 1);
            shape.graphics.lineTo(r, 0);
            shape.graphics.drawArc(0, 0, r, 0, angle * Math.PI / 180, anticlockwise);
            shape.graphics.lineTo(0, 0);
            shape.graphics.endFill();
        }
    }
}


