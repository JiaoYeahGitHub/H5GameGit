//地图层管理
class MapLayer extends egret.DisplayObjectContainer {
    private MapRes_Width: number = 384;
    private MapRes_Height: number = 384;
    private MapRes_RelaodNum: number = 1;//横竖多预加载几个图
    private RES_Col_Max: number;
    private RES_Row_Max: number;
    private mapsmallImg: eui.Image;
    private MapResImgs: MapImage[];
    private shadowBodys: ShadowBody[];

    private mapLayer: egret.DisplayObjectContainer;
    private _resLayer: egret.DisplayObjectContainer;
    private _bottomLayer: egret.DisplayObjectContainer;
    private _bodyLayer: egret.DisplayObjectContainer;
    private _dmgfntLayer: egret.DisplayObjectContainer;
    private _scrollLayer: egret.DisplayObjectContainer;
    private _mapInfo: MapInfo;
    private _mapmodel: Modelmap;
    private _mainScene: MainScene;
    private _ismovingMap: boolean;

    private heroPointX: number;
    private heroPointY: number;
    private mapimgColNum: number;
    private mapimgRowNum: number;
    private mapurlLoadingList;//正在加载的Image列表
    private old_x: number = 0;
    private old_y: number = 0;

    public constructor(scene: MainScene) {
        super();
        this._mainScene = scene;
        this.onInit();
    }
    private onInit(): void {
        this.mapLayer = new egret.DisplayObjectContainer();
        this.addChild(this.mapLayer);
        this._resLayer = new egret.DisplayObjectContainer();
        this.mapLayer.addChildAt(this._resLayer, 0);
        this._bottomLayer = new egret.DisplayObjectContainer();
        this.mapLayer.addChildAt(this._bottomLayer, 1);
        this._bodyLayer = new egret.DisplayObjectContainer();
        this.mapLayer.addChildAt(this._bodyLayer, 2);
        this._dmgfntLayer = new egret.DisplayObjectContainer();
        this.mapLayer.addChildAt(this._dmgfntLayer, 3);
        this.mapsmallImg = new eui.Image();
        this._resLayer.addChildAt(this.mapsmallImg, 0);
        this.MapResImgs = [];
        this.onResizeLayer();
    }
    public onRefreshMap() {
        this.old_x = this.old_y = 0;
        //清空当前资源
        for (let childNum: number = this._resLayer.numChildren - 1; childNum >= 0; childNum--) {
            if (!egret.is(this._resLayer.getChildAt(childNum), "MapImage")) continue;
            let mapimamge: MapImage = this._resLayer.getChildAt(childNum) as MapImage;
            this.onRecoveryMapImg(mapimamge);
            this._resLayer.removeChild(mapimamge);
        }
        this._layerRefreshTime = 0;
        this.mapurlLoadingList = [];

        this._mapInfo = this._mainScene.mapInfo;
        this._mapmodel = JsonModelManager.instance.getModelmap()[this._mapInfo.mapId];
        this.RES_Col_Max = Math.ceil(this._mapInfo.MAP_WIDTH / this.MapRes_Width);
        this.RES_Row_Max = Math.ceil(this._mapInfo.MAP_HEIGHT / this.MapRes_Height);
        if (this.mapsmallImg.source && this._mapmodel) {
            RES.destroyRes("map" + this._mapmodel.resources + "_small_jpg", false);
        }
        this.mapsmallImg.source = "map" + this._mapmodel.resources + "_small_jpg";
        this.mapsmallImg.width = this._mapmodel.width;
        this.mapsmallImg.height = this._mapmodel.height;
        this.mapsmallImg.x = this.mapsmallImg.y = 0;
        //镜头重置
        if (this.cameraIsFollow) {
            this.onCameraFollowForBody(null);
        }
        //是否为滚动地图
        this._ismovingMap = GameFight.getInstance().isPKEffectScene;
        if (this._ismovingMap) {
            if (!this._scrollLayer) {
                this._scrollLayer = new egret.DisplayObjectContainer();
                this.mapLayer.addChildAt(this._scrollLayer, this.mapLayer.getChildIndex(this._resLayer));
            }
            let _offestX: number = Math.max(0, (size.width - GameDefine.GAME_STAGE_WIDTH) / 2);
            let col_mapnum: number = Math.ceil((size.width + 40) / this._mapmodel.width);
            let row_mapnum: number = 2;
            for (let i: number = 0; i < row_mapnum; i++) {
                for (let j: number = 0; j < col_mapnum; j++) {
                    let scrollmap: eui.Image = new eui.Image("map" + this._mapmodel.resources + "_small_jpg");
                    scrollmap.width = this._mapmodel.width;
                    scrollmap.height = this._mapmodel.height;
                    scrollmap.x = j * this._mapmodel.width;//往右移动20 以免震屏露黑
                    scrollmap.y = i * -this._mapmodel.height;
                    this._scrollLayer.addChild(scrollmap);
                }
            }
            this._scrollLayer.x = -_offestX - 20;
            this.mapLayer.x = _offestX;
            this.mapLayer.y = 0;
            this.mapsmallImg.visible = false;
            this._bottomLayer.visible = false;
        } else {
            this.mapsmallImg.visible = true;
            this._bottomLayer.visible = true;
            if (this._scrollLayer) {
                this._scrollLayer.removeChildren();
                if (this._scrollLayer.parent) {
                    this._scrollLayer.parent.removeChild(this._scrollLayer);
                }
                this._scrollLayer = null;
            }
            this.onSetHeroStagePointType(this._mapInfo.heroPointType);
        }
    }
    /**设置摄像机为特点的位置**/
    public onSetHeroStagePointType(type: CameraType, x?: number, y?: number): void {
        switch (type) {
            case CameraType.CENTER:
                this.updateHeroPointInStage(size.width / 2, size.height / 2 + 100);
                break;
            case CameraType.CENTERLEFT:
                this.updateHeroPointInStage(size.width / 3, size.height / 2 + 100);
                break;
            case CameraType.CENTERRIGHT:
                this.updateHeroPointInStage(size.width / 1.5, size.height / 2 + 100);
                break;
            case CameraType.AUTO:
                if (Tool.isNumber(x) && Tool.isNumber(y)) {
                    this.updateHeroPointInStage(x, y);
                }
                break;
            case CameraType.OFFSET:
                if (Tool.isNumber(x) && Tool.isNumber(y)) {
                    this.updateHeroPointInStage(this.heroPointX + x, this.heroPointY + y);
                }
                break;
        }
        this.logicMove();
    }
    private updateHeroPointInStage(x: number, y: number): void {
        this.heroPointX = x;
        this.heroPointY = y;
    }
    /**设置摄像机跟随到人物上**/
    private cameraIsFollow: boolean;
    public onCameraFollowForBody(body: BaseBody): void {
        if (body) {
            if (!this.cameraIsFollow) {
                this.cameraIsFollow = true;
                this.onCheckBodyIsView();
            }

            let _moveX: number = -(body.x - this.heroPointX);
            this.mapLayer.x = _moveX;
            if (this.mapLayer.x <= -this._mapInfo.mapMaxX)
                this.mapLayer.x = -this._mapInfo.mapMaxX;
            else if (this.mapLayer.x >= 0)
                this.mapLayer.x = 0;

            let _moveY: number = -(body.y - this.heroPointY);
            this.mapLayer.y = _moveY;
            if (this.mapLayer.y <= -this._mapInfo.mapMaxY)
                this.mapLayer.y = -this._mapInfo.mapMaxY;
            else if (this.mapLayer.y >= 0)
                this.mapLayer.y = 0;

            this.onlogicShadow();
            this.moveMapResLayer();
            this.layerOrderHandler();
        } else {
            this.cameraIsFollow = false;
        }
    }
    //舞台更改处理
    public onResizeLayer(): void {
        if (this._ismovingMap) {

        } else {
            let new_imgColNum: number = Math.ceil(size.width / this.MapRes_Width) + 2 * this.MapRes_RelaodNum;
            let new_imgRowNum: number = Math.ceil(size.height / this.MapRes_Height) + 2 * this.MapRes_RelaodNum;
            if (new_imgColNum != this.mapimgColNum || this.mapimgRowNum != new_imgRowNum) {
                let isUpdate: boolean = Tool.isNumber(this.mapimgColNum);
                this.mapimgColNum = new_imgColNum;
                this.mapimgRowNum = new_imgRowNum;
                if (isUpdate) {
                    this.old_x = 0;
                    this.old_y = 0;
                    this.onSetHeroStagePointType(this._mapInfo.heroPointType);
                }
            }
        }
    }
    //更新地图层位置
    private onchangeMapLayerPos(): void {
        var heroBody: PlayerBody = this._mainScene.heroBody;
        var _moveX: number = -(heroBody.x - this.heroPointX);
        this.mapLayer.x = _moveX;
        if (this.mapLayer.x <= -this._mapInfo.mapMaxX)
            this.mapLayer.x = -this._mapInfo.mapMaxX;
        else if (this.mapLayer.x >= 0)
            this.mapLayer.x = 0;

        var _moveY: number = -(heroBody.y - this.heroPointY);
        this.mapLayer.y = _moveY;
        if (this.mapLayer.y <= -this._mapInfo.mapMaxY)
            this.mapLayer.y = -this._mapInfo.mapMaxY;
        else if (this.mapLayer.y >= 0)
            this.mapLayer.y = 0;
    }
    //地图滚动
    private onscrollMapimage(): void {
        if (!this._scrollLayer) return;
        for (let i: number = 0; i < this._scrollLayer.numChildren; i++) {
            let scrollmap = this._scrollLayer.getChildAt(i);
            scrollmap.y += 10;
            if (scrollmap.y >= scrollmap.height) {
                scrollmap.y = -scrollmap.height;
            }
        }
    }
    //实时刷新
    public logicMove(): boolean {
        if (this._ismovingMap) {
            this.onscrollMapimage();
            this.onlogicShadow();
            return false;
        }
        if (this.cameraIsFollow) return false;

        this.onchangeMapLayerPos();
        if (this.old_x != this.mapLayer.x || this.old_y != this.mapLayer.y) {
            this.moveMapResLayer();
            this.old_x = this.mapLayer.x;
            this.old_y = this.mapLayer.y;
            this.layerOrderHandler();
        }
        this.onlogicShadow();
        this.onCheckBodyIsView();

        return false;
    }
    /**
     * 计算图片编号
     * rowNum行数 colNum列数
     * **/
    private getMapImageIdx(rowNum: number, colNum: number): number {
        return rowNum * Math.ceil(this._mapInfo.MAP_WIDTH / this.MapRes_Width) + colNum + 1;
    }
    //回收地图图片资源
    private onRecoveryMapImg(mapimage: MapImage): void {
        if (mapimage.texture) {
            mapimage.texture.dispose();
            RES.destroyRes(mapimage.url);
        }
        mapimage.url = null;
        mapimage.texture = null;
        mapimage.rowNum = null;
        mapimage.colNum = null;
        if (this.MapResImgs.indexOf(mapimage) < 0) {
            this.MapResImgs.push(mapimage);
        }
    }
    //地图移动资源刷新
    private moveMapResLayer(): void {
        if (this._ismovingMap) return;
        //1.首先计算出显示范围
        let minPosX: number = (-this.mapLayer.x) - this.MapRes_Width * this.MapRes_RelaodNum;
        let minPosY: number = (-this.mapLayer.y) - this.MapRes_Height * this.MapRes_RelaodNum;
        let _startCol: number = Math.max(0, Math.floor(minPosX / this.MapRes_Width));
        let _startRow: number = Math.max(0, Math.floor(minPosY / this.MapRes_Height));
        let _endCol: number = Math.min(_startCol + this.mapimgColNum, this.RES_Col_Max);
        let _endRow: number = Math.min(_startRow + this.mapimgRowNum, this.RES_Row_Max);
        //2.检测哪些是已经不在舞台的
        let hasImgIdxs: number[] = [];//看下有哪些位置没有变化
        for (let childNum: number = this._resLayer.numChildren - 1; childNum >= 0; childNum--) {
            if (!egret.is(this._resLayer.getChildAt(childNum), "MapImage")) continue;
            let isdispose: boolean = false;
            let mapimamge: MapImage = this._resLayer.getChildAt(childNum) as MapImage;
            if (mapimamge.colNum < _startCol || mapimamge.colNum >= _endCol) {
                isdispose = true;
            } else if (mapimamge.rowNum < _startRow || mapimamge.rowNum >= _endRow) {
                isdispose = true;
            }

            if (isdispose) {
                this.onRecoveryMapImg(mapimamge);
            } else {
                let idxNum: number = this.getMapImageIdx(mapimamge.rowNum, mapimamge.colNum);
                hasImgIdxs.push(idxNum);
            }
        }
        //3.补上新增的资源
        //先缓存中拿 删掉之前的资源
        //没有缓存重新创建
        for (let row: number = _startRow; row < _endRow; row++) {
            for (let col: number = _startCol; col < _endCol; col++) {
                let imgIndex: number = this.getMapImageIdx(row, col);
                if (hasImgIdxs.indexOf(imgIndex) >= 0) continue;
                let mapimage: MapImage;
                if (this.MapResImgs.length == 0) {
                    mapimage = new MapImage();
                } else {
                    mapimage = this.MapResImgs.shift();
                }
                if (!mapimage.parent) {
                    this._resLayer.addChild(mapimage);
                }

                mapimage.rowNum = row;
                mapimage.colNum = col;
                mapimage.x = col * this.MapRes_Width;
                mapimage.y = row * this.MapRes_Height;
                let mapUrl: string = LoadManager.getInstance().getMapResUrl(this._mapmodel.resources, imgIndex);
                this.onLoadMapImage(mapimage, mapUrl);
            }
        }
    }
    /**地图加载**/
    private onLoadMapImage(mapImg: MapImage, mapUrl: string): void {
        for (let idx in this.mapurlLoadingList) {
            let loadimg: MapImage = this.mapurlLoadingList[idx][0];
            if (loadimg === mapImg) {
                let loadurl: string = this.mapurlLoadingList[idx][1];
                if (loadurl == mapUrl) {
                    return;
                } else {
                    this.mapurlLoadingList.splice(idx, 1);
                    break;
                }
            }
        }
        this.mapurlLoadingList.push([mapImg, mapUrl]);
        this.onLoadingMapImgHandler();
    }
    //地图资源加载逻辑
    private loadingMapImg: MapImage;
    private onLoadingMapImgHandler(): void {
        if (this.loadingMapImg) {
            return;
        }
        if (this.mapurlLoadingList.length == 0) {
            return;
        }

        let loadparam = this.mapurlLoadingList.shift();
        //删除缓存机制
        this.loadingMapImg = loadparam[0];
        let mapResUrl: string = loadparam[1];
        //开始进行加载
        RES.getResByUrl(mapResUrl, this.onLoadImgComplete, this, RES.ResourceItem.TYPE_IMAGE);
    }
    //加载完成
    private onLoadImgComplete(texture: egret.Texture, url: string): void {
        if (url.indexOf("resource/mapres/" + this._mapmodel.resources) >= 0) {
            this.loadingMapImg.url = url;
            this.loadingMapImg.texture = texture;
        } else {
            texture.dispose();
            RES.destroyRes(url);
            texture = null;
        }
        this.loadingMapImg = null;

        this.onLoadingMapImgHandler();
    }
    // //URL转成KEY
    // private mapCacheKey(mapUrl: string): string {
    //     var cachekey: string = "";
    //     var startIndex: number = mapUrl.lastIndexOf("/map");
    //     var endIndex: number = mapUrl.lastIndexOf(".jpg");
    //     cachekey = mapUrl.slice(startIndex + 4, endIndex);
    //     return cachekey;
    // }
    //添加生物到地图上
    public addBodyToMaplayer(targetBody, insertChild: number): void {
        if (egret.is(targetBody, "EffectBody")) {
            if ((targetBody as EffectBody).isUnder) {
                this._bodyLayer.addChildAt(targetBody, 0);
            } else {
                this._bodyLayer.addChild(targetBody);
            }
        } else {
            if (egret.is(targetBody, "IMapOrder")) {
                (targetBody as IMapOrder).mapOrder = -1;
            }
            if (insertChild < 0) {
                this.insertBodyToLayer(targetBody);
            } else {
                this._bodyLayer.addChildAt(targetBody, insertChild);
            }
        }

        if (egret.is(targetBody, "ActionBody")) {
            var _targetMapNode: ModelMapNode = this._mapInfo.getNodeModelByXY(targetBody.x, targetBody.y);

            if (_targetMapNode && _targetMapNode.isCover) {
                (targetBody as ActionBody).onSetCover(true);
            } else {
                (targetBody as ActionBody).onSetCover(false);
            }

            this.onCreateShadow(targetBody);
        }
    }
    private insertBodyToLayer(targetBody): void {
        if (egret.is(targetBody, "ActionBody") && (targetBody as ActionBody).data.bodyType == BODY_TYPE.SELF) {
            this._bodyLayer.addChild(targetBody);
            this._layerRefreshTime = 0;
            this.layerOrderHandler();
            return;
        }

        let isFind: boolean;
        for (let i: number = 0; i < this._bodyLayer.numChildren; i++) {
            let sceneDisObj: egret.DisplayObject = this._bodyLayer.getChildAt(i);
            if (egret.is(sceneDisObj, "IMapOrder")) {
                if (sceneDisObj.y >= targetBody.y) {
                    this._bodyLayer.addChildAt(targetBody, i - 1);
                    isFind = true;
                    break;
                }
            }
        }
        if (!isFind) {
            this._bodyLayer.addChild(targetBody);
        }
    }
    //添加到飘字层
    public addToDamageFntLayer(targetBody): void {
        this._dmgfntLayer.addChild(targetBody);
    }
    //移除生物层上的所有
    public removeBodyLayerAll(): void {
        this._bodyLayer.removeChildren();
        this._dmgfntLayer.removeChildren();
        this.removeAllShadow();
    }
    //不显示视野外的事物
    private onCheckBodyIsView(): void {
        let sceneDisObj: egret.DisplayObject;
        for (let i: number = 0; i < this._bodyLayer.numChildren; i++) {
            sceneDisObj = this._bodyLayer.getChildAt(i);
            if (this.onCheckPosInMapView(sceneDisObj.x, sceneDisObj.y)) {
                sceneDisObj.visible = true;
            } else {
                sceneDisObj.visible = false;
            }
        }
        for (let i: number = 0; i < this._bottomLayer.numChildren; i++) {
            sceneDisObj = this._bodyLayer.getChildAt(i);
            if (this.onCheckPosInMapView(sceneDisObj.x, sceneDisObj.y)) {
                sceneDisObj.visible = true;
            } else {
                sceneDisObj.visible = false;
            }
        }
    }
    //层级排序
    private _layerRefreshTime: number;
    private layerOrderHandler(): void {
        if (this._layerRefreshTime > egret.getTimer()) {
            return;
        }
        let bottomThing: egret.DisplayObject[] = [];
        let orderBodys = [];
        for (let i: number = 0; i < this._bodyLayer.numChildren; i++) {
            let sceneDisObj: egret.DisplayObject = this._bodyLayer.getChildAt(i);
            if (egret.is(sceneDisObj, "EffectBody") && (sceneDisObj as EffectBody).isUnder) {
                bottomThing.push(sceneDisObj);
            }
            else if (egret.is(sceneDisObj, "IMapOrder")) {
                orderBodys.push(sceneDisObj);
            }
        }
        this._layerRefreshTime = egret.getTimer() + 1000;
        for (let i: number = 0; i < orderBodys.length; i++) {
            let orderObj = orderBodys[i];
            if (orderObj.visible) {
                (orderObj as IMapOrder).updateY();
            }
        }
        orderBodys.sort(function (a, b) {
            return a.mapY - b.mapY;
        });
        for (let i: number = 0; i < orderBodys.length; i++) {
            let orderObj = orderBodys[i];
            let oldOrder: number = (orderObj as IMapOrder).mapOrder;
            if (oldOrder != i) {
                let layerIdx: number = bottomThing.length + i;
                this._bodyLayer.setChildIndex(orderObj, i);
                (orderObj as IMapOrder).mapOrder = i + 1;
            }
        }
        // egret.log('~~~~~this._bodyLayer.numChildren::::' + this._bodyLayer.numChildren);
    }
    //当前地图是否为PNG图
    // private getMapIsPng(): boolean {
    //     return (ModelManager.getInstance().modelMap[this._mapInfo.mapId] as ModelMap).isPng;
    // }
    /**创建影子**/
    private onCreateShadow(body: ActionBody): void {
        if (GameFight.getInstance().isPKEffectScene) return;
        if (!body) return;
        let shadowbody: ShadowBody;
        for (let i: number = this.shadowBodys.length - 1; i >= 0; i--) {
            let shadowbody: ShadowBody = this.shadowBodys[i];
            if (!shadowbody.ownerbody) {
                this.removeOneShadow(shadowbody);
            } else if (shadowbody.ownerbody === body) {
                return;
            }
        }
        shadowbody = BodyFactory.instance.onCreateShadow(body);
        this.shadowBodys.push(shadowbody);
        this._bottomLayer.addChild(shadowbody);
    }
    /**移动所有影子**/
    private onlogicShadow(): void {
        for (let i: number = this.shadowBodys.length - 1; i >= 0; i--) {
            let shadowbody: ShadowBody = this.shadowBodys[i];
            if (!shadowbody.ownerbody || !shadowbody.ownerbody.parent) {
                this.removeOneShadow(shadowbody);
            } else {
                shadowbody.updatePos();
            }
        }
    }
    /**清除单个的影子**/
    private removeOneShadow(shadowbody: ShadowBody): void {
        BodyFactory.instance.onRecoveryShadow(shadowbody);
        let shadowIdx: number = this.shadowBodys.indexOf(shadowbody);
        if (shadowIdx >= 0) {
            this.shadowBodys.splice(shadowIdx, 1);
        }
    }
    /**清除所有影子**/
    private removeAllShadow(): void {
        if (!this.shadowBodys) {
            this.shadowBodys = [];
        } else {
            for (let i: number = this.shadowBodys.length - 1; i >= 0; i--) {
                let shadowbody: ShadowBody = this.shadowBodys[i];
                this.removeOneShadow(shadowbody);
            }
        }
    }
    /**角色对应界面的点**/
    public get heroPosByModule(): number[] {
        var posAry: number[] = [];
        posAry[0] = this._mainScene.heroBody.x + this.mapLayer.x;
        posAry[1] = this._mainScene.heroBody.y + this.mapLayer.y;
        return posAry;
    }
    /**计算目标是不是在屏幕内**/
    public onCheckPosInMapView(x: number, y: number): boolean {
        if (this.cameraIsFollow) return true;
        let heroBody: PlayerBody = this._mainScene.heroBody;
        if (Math.abs(heroBody.x - x) > size.width / 2 + 50) return false;
        if (Math.abs(heroBody.y - y) > size.height / 2 + 50) return false;
        return true;
    }
    //地图昏暗效果
    private _mapGaryMask: egret.Shape;
    public onGary(isshow: boolean): void {
        if (isshow) {
            if (!this._mapGaryMask) {
                this._mapGaryMask = new egret.Shape();
                this._mapGaryMask.graphics.clear();
                this._mapGaryMask.graphics.beginFill(0, 0.8);
                this._mapGaryMask.graphics.drawRect(0, 0, size.width * 2, size.height * 2);
                this._mapGaryMask.graphics.endFill();
            }
            let heroBody: PlayerBody = this._mainScene.heroBody;
            this._mapGaryMask.x = heroBody.x - size.width;
            this._mapGaryMask.y = heroBody.y - size.height;
            this.mapLayer.addChildAt(this._mapGaryMask, 1);
        } else {
            if (this._mapGaryMask) {
                if (this._mapGaryMask.parent) {
                    this._mapGaryMask.parent.removeChild(this._mapGaryMask);
                }
            }
        }
    }
    //The end
}
enum CameraType {
    AUTO = 0,
    CENTER = 1,
    CENTERLEFT = 2,
    CENTERRIGHT = 3,
    OFFSET = 4,//偏移
}
class MapImage extends eui.Image {
    public colNum: number;//列
    public rowNum: number;//行
    public url: string;//当前资源URL
    public constructor() {
        super();
    }
}
/**接口IMapOrder 实现地图层排序规则**/
interface IMapOrder {
    mapOrder: number;
    mapY: number;
    updateY(): void;
}