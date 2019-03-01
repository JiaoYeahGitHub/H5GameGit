//地图信息 处理地图逻辑
class MapInfo {
    public MAP_GRID_WIDTH: number = 128;
    public MAP_GRID_HEIGHT: number = 128;
    public MAP_WIDTH: number;
    public MAP_HEIGHT: number;
    public mapMaxX: number;
    public mapMaxY: number;
    public mapColNum: number;//地图列数
    public mapRowNum: number;//地图行数
    public heroPointType: CameraType = CameraType.CENTER;//角色屏幕定点类型
    public mapId;
    public fightId;//场景的怪物分部索引
    public bronNodeId: number;
    public mapResId: number;
    public yewaiprogress: number;

    private modelMapNodes: Array<ModelMapNode>;//数组更新需要彻底清除
    public MapNodeXmlData;

    public constructor() {
    }
    public onRefreshMapInfo(mapId): void {
        //删除旧的资源
        // if (Tool.isNumber(this.mapResId)) {
        //     RES.destroyRes(this.mapResId + "_map_xml");
        // }
        if (Tool.isNumber(this.fightId) && RES.getRes(this.fightId + "_fight_xml")) {
            RES.destroyRes(this.fightId + "_fight_xml");
        }

        this.mapId = mapId;
        var mapModel: Modelmap = JsonModelManager.instance.getModelmap()[mapId];
        if (!mapModel) {
            Tool.throwException("缺少地图配置文件！Mapid:" + mapId);
        }
        this.MAP_WIDTH = mapModel.width;
        this.MAP_HEIGHT = mapModel.height;
        this.bronNodeId = mapModel.bornPoint;
        this.mapResId = mapModel.resources;
        this.fightId = mapModel.fightid;
        this.mapMaxX = this.MAP_WIDTH - size.width;
        this.mapMaxY = this.MAP_HEIGHT - size.height;
        this.mapColNum = Math.ceil(this.MAP_WIDTH / this.MAP_GRID_WIDTH);
        this.mapRowNum = Math.ceil(this.MAP_HEIGHT / this.MAP_GRID_HEIGHT);
        this.yewaiprogress = mapModel.xiaoguai;
        //地表数据 （现在全图都无碰撞）
        // this.onloadingMapConfig();
        if (this.MapNodeXmlData) {
            for (var nodeId in this.MapNodeXmlData) {
                var cacheMapNode: ModelMapNode = this.MapNodeXmlData[nodeId];
                cacheMapNode = null;
                delete this.MapNodeXmlData[nodeId];
            }
        } else {
            this.MapNodeXmlData = {};
        }
        this.modelMapNodes = [];
        // ModelManager.getInstance().parseXmlToModel(this.MapNodeXmlData, ModelMapNode, key);
        var _allGridNum: number = this.mapRowNum * this.mapColNum;
        for (var index: number = 0; index < _allGridNum; index++) {
            var currNodeId: number = index + 1;
            var _modelMapNode: ModelMapNode = this.MapNodeXmlData[currNodeId];
            if (!_modelMapNode) {
                _modelMapNode = new ModelMapNode();
                _modelMapNode.nodeType = MAP_GRID_TYPE.NORMAL;
                _modelMapNode.nodeId = currNodeId;
            }
            _modelMapNode.colIndex = ((index % this.mapColNum) + 1);
            _modelMapNode.rowIndex = Math.ceil(_modelMapNode.nodeId / this.mapColNum);
            this.modelMapNodes.push(_modelMapNode);
        }
        GameFight.getInstance().fightScene.onLoadingSceneRes(this.mapId);
    }
    //加载地图区域表
    // private onloadingMapConfig(): void {
    //     var mapxmlRes: string = this.mapResId + "_map_xml";
    //     if (RES.getRes(mapxmlRes)) {
    //         this.onloadedMapConfig(null, mapxmlRes);
    //     } else {
    //         RES.getResAsync(mapxmlRes, this.onloadedMapConfig, this);
    //     }
    // }
    private onloadedMapConfig(data, key): void {
        if (this.MapNodeXmlData) {
            for (var nodeId in this.MapNodeXmlData) {
                var cacheMapNode: ModelMapNode = this.MapNodeXmlData[nodeId];
                cacheMapNode = null;
                delete this.MapNodeXmlData[nodeId];
            }
        } else {
            this.MapNodeXmlData = {};
        }
        this.modelMapNodes = [];
        ModelManager.getInstance().parseXmlToModel(this.MapNodeXmlData, ModelMapNode, key);
        var _allGridNum: number = this.mapRowNum * this.mapColNum;
        for (var index: number = 0; index < _allGridNum; index++) {
            var currNodeId: number = index + 1;
            var _modelMapNode: ModelMapNode = this.MapNodeXmlData[currNodeId];
            if (!_modelMapNode) {
                _modelMapNode = new ModelMapNode();
                _modelMapNode.nodeType = MAP_GRID_TYPE.COLLSION;
                _modelMapNode.nodeId = currNodeId;
            }
            _modelMapNode.colIndex = ((index % this.mapColNum) + 1);
            _modelMapNode.rowIndex = Math.ceil(_modelMapNode.nodeId / this.mapColNum);
            this.modelMapNodes.push(_modelMapNode);
        }
        GameFight.getInstance().fightScene.onLoadingSceneRes(this.mapId);
    }
    //根据地图坐标换算成格子编号
    public getGridIndexByXY(x: number, y: number): number {
        var colNum: number = Math.max(1, Math.ceil(x / this.MAP_GRID_WIDTH));
        var rowNum: number = Math.max(1, Math.ceil(y / this.MAP_GRID_HEIGHT));
        return (rowNum - 1) * this.mapColNum + colNum;
    }
    //根据格子获取当前格子所处地图坐标
    public getXYByGridIndex(gridIndex: number): egret.Point {
        var nodeModel: ModelMapNode = this.modelMapNodes.length >= gridIndex ? this.modelMapNodes[gridIndex - 1] : null;
        var _x: number = nodeModel ? nodeModel.colIndex * this.MAP_GRID_WIDTH - this.MAP_GRID_WIDTH / 2 : -1;
        var _y: number = nodeModel ? nodeModel.rowIndex * this.MAP_GRID_HEIGHT - this.MAP_GRID_HEIGHT / 2 : -1;
        if (_x == -1 || _y == -1)
            return null;
        return new egret.Point(_x, _y);
    }
    //根据格子返回一个点的相邻格子列表 Radius格子半径单位是格子数
    public getGridNearByNode(gridModel: ModelMapNode, colRadius: number = 1, rowRadius: number = 1): ModelMapNode[] {
        var nearGridList: ModelMapNode[] = [];
        var _startCol: number = Math.max(1, gridModel.colIndex - colRadius);
        var _endCol: number = Math.min(this.mapColNum, gridModel.colIndex + colRadius);
        var _startRow: number = Math.max(1, gridModel.rowIndex - rowRadius);
        var _endRow: number = Math.min(this.mapRowNum, gridModel.rowIndex + rowRadius);
        for (var row: number = _startRow; row <= _endRow; row++) {
            for (var col: number = _startCol; col <= _endCol; col++) {
                var _curGridIndex: number = this.mapColNum * (row - 1) + col;
                var _curGridModel: ModelMapNode = this.modelMapNodes[_curGridIndex - 1];
                if (gridModel.nodeId == _curGridModel.nodeId)
                    continue;
                if (_curGridModel.nodeType == MAP_GRID_TYPE.NORMAL && !this.getGridBetweenHasHit(gridModel, _curGridModel)) {
                    nearGridList.push(_curGridModel);
                }
            }
        }
        if (nearGridList.length == 0) {
            nearGridList.push(gridModel);
        }
        return nearGridList;
    }
    public getGridNearByIndex(index: number, colRadius: number = 1, rowRadius: number = 1): ModelMapNode[] {
        let nearGridList: ModelMapNode[] = [];
        let model: ModelMapNode = this.getNodeModelByIndex(index);
        nearGridList = this.getGridNearByNode(model, colRadius, rowRadius);
        return nearGridList;
    }
    //根据一个距离返回此距离的所有可行走点
    public getGridListByDistance(gridModel: ModelMapNode, distance: number): ModelMapNode[] {
        if (distance <= 0)
            return [];
        var gridList: ModelMapNode[] = [];
        var _startCol: number = Math.max(1, gridModel.colIndex - distance);
        var _endCol: number = Math.min(this.mapColNum, gridModel.colIndex + distance);
        var _startRow: number = Math.max(1, gridModel.rowIndex - distance);
        var _endRow: number = Math.min(this.mapRowNum, gridModel.rowIndex + distance);
        for (var row: number = _startRow; row <= _endRow;) {
            for (var col: number = _startCol; col <= _endCol; col++) {
                var _curGridIndex: number = this.mapColNum * (row - 1) + col;
                var _curGridModel: ModelMapNode = this.modelMapNodes[_curGridIndex - 1];
                if (_curGridModel.nodeType == MAP_GRID_TYPE.NORMAL) {
                    gridList.push(_curGridModel);
                }
            }
            row += (_endRow - _startRow);
        }
        for (var col: number = _startCol; col <= _endCol;) {
            for (var row: number = _startRow; row <= _endRow; row++) {
                var _curGridIndex: number = this.mapColNum * (row - 1) + col;
                var _curGridModel: ModelMapNode = this.modelMapNodes[_curGridIndex - 1];
                if (_curGridModel.nodeType == MAP_GRID_TYPE.NORMAL) {
                    gridList.push(_curGridModel);
                }
            }
            col += (_endCol - _startCol);
        }
        return gridList;
    }
    //根据格子编号取出此格子内的随机一点坐标
    public getGridRdXYByIndex(gridIndex: number): egret.Point {
        var radomPonit: egret.Point = this.getXYByGridIndex(gridIndex);
        radomPonit.x = Tool.toInt(Math.floor(radomPonit.x + Math.random() * this.MAP_GRID_WIDTH) - this.MAP_GRID_WIDTH / 2);
        radomPonit.y = Tool.toInt(Math.floor(radomPonit.y + Math.random() * this.MAP_GRID_HEIGHT) - this.MAP_GRID_HEIGHT / 2);
        return radomPonit;
    }
    //根据格子编号获取这个格子的数据
    public getNodeModelByIndex(index: number): ModelMapNode {
        return this.modelMapNodes[index - 1];
    }
    //根据坐标获取对应格子的数据
    public getNodeModelByXY(x: number, y: number): ModelMapNode {
        var _gridIndex: number = this.getGridIndexByXY(x, y);
        return this.modelMapNodes[_gridIndex - 1];
    }
    //根据两点寻出格子列表(起始点和终点我们可以不考虑它在不在碰撞里 只要他周围没有就可以)
    public findGridPath(startX: number, startY: number, endX: number, endY: number, cheackJump: boolean = true): number[] {
        var _startGridIndex: number = this.getGridIndexByXY(startX, startY);
        var _currGridIndex: number = _startGridIndex;
        var _endGridIndex: number = this.getGridIndexByXY(endX, endY);
        var _closePathList: number[] = [_currGridIndex];//close列表
        var _openPathList: number[] = [];//open列表
        while (_currGridIndex != _endGridIndex) {
            var nodeId: number = this.findNextGrid(_currGridIndex, _endGridIndex, _closePathList, _openPathList, (cheackJump && _startGridIndex != _currGridIndex));

            if (!nodeId || nodeId == _currGridIndex) {
                if (_openPathList.length == 0) {
                    break;
                }
                var _sortOpenList: Array<ModelMapNode> = [];
                for (var i: number = 0; i < _openPathList.length; i++) {
                    _sortOpenList[i] = this.modelMapNodes[_openPathList[i] - 1];
                }
                _sortOpenList.sort(function (a, b) {
                    return a.findnode.hValue - b.findnode.hValue;
                });
                nodeId = _sortOpenList.shift().nodeId;
                Tool.removeArrayObj(_openPathList, nodeId);
            }

            _currGridIndex = nodeId;
            if (_closePathList.indexOf(nodeId) < 0)
                _closePathList.push(nodeId);
        }
        var returnIndex: number = _closePathList[_closePathList.length - 1];
        var resultPath: number[] = [returnIndex];
        while (returnIndex != _startGridIndex) {
            var _resultNodeModel: ModelMapNode = this.modelMapNodes[returnIndex - 1];
            returnIndex = _resultNodeModel.findnode.parentnodeId;
            resultPath.push(returnIndex);
        }
        resultPath.reverse();
        return resultPath;
    }
    //根据两点寻出坐标列表 真正的走路点 cheackJump是用不用检查跳跃点
    public findPointPath(startX: number, startY: number, endX: number, endY: number, cheackJump: boolean = true): Array<egret.Point> {
        var _gridPathList: number[] = this.findGridPath(startX, startY, endX, endY, cheackJump);
        try {
            var _pointPathList: Array<egret.Point> = [];
            var _startNode: ModelMapNode = this.getNodeModelByIndex(_gridPathList[0]);
            for (var i: number = 0; i < _gridPathList.length; i++) {
                if (i == _gridPathList.length - 1) {
                    _pointPathList.push(new egret.Point(endX, endY));
                } else {
                    var _nodeModel: ModelMapNode = this.getNodeModelByIndex(_gridPathList[i]);
                    if (_nodeModel.isJump) {
                        while (_nodeModel && _nodeModel.isJump) {
                            _pointPathList.push(this.getXYByGridIndex(_nodeModel.nodeId));
                            i++;
                            _nodeModel = this.getNodeModelByIndex(_gridPathList[i]);
                        }
                        _pointPathList.push(this.getXYByGridIndex(_nodeModel.nodeId));
                        _startNode = _nodeModel;
                    } else if (this.getGridBetweenHasHit(_startNode, _nodeModel) == true) {
                        _pointPathList.push(this.getXYByGridIndex(_gridPathList[i - 1]));
                        _startNode = this.getNodeModelByIndex(_gridPathList[i - 1]);
                    }
                }
            }
            return _pointPathList;
        } catch (e) {
            return null;
        }
    }
    //寻路算法2D格子算法
    private findNextGrid(startGridIndex: number, endGridIndex: number, closePath: number[], openPath: number[], cheackJump: boolean = true): number {
        // Tool.log("=======起始格子：" + startGridIndex);
        // Tool.log("=======终点格子：" + endGridIndex);
        if (startGridIndex == endGridIndex)
            return endGridIndex;
        var _currGridModel: ModelMapNode = this.modelMapNodes[startGridIndex - 1];
        if (!_currGridModel) {
            if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL) {
                Tool.throwException(`地图格子${startGridIndex}不存在！`);
            }
            return null;
        }
        if (_currGridModel.isJump && cheackJump) {
            var _jumpNodeModel: ModelMapNode = this.modelMapNodes[_currGridModel.areaIndex - 1];
            if (!_jumpNodeModel || !_jumpNodeModel.isCanWalk) {
                if (SDKManager.getChannel() == EChannel.CHANNEL_LOCAL)
                    Tool.throwException("跳跃点配置错误！");
                return null;
            }
            _jumpNodeModel.findnode.parentnodeId = startGridIndex;
            return _jumpNodeModel.nodeId;
        }

        var _startCol: number = Math.max(1, _currGridModel.colIndex - 1);
        var _endCol: number = Math.min(this.mapColNum, _currGridModel.colIndex + 1);
        var _startRow: number = Math.max(1, _currGridModel.rowIndex - 1);
        var _endRow: number = Math.min(this.mapRowNum, _currGridModel.rowIndex + 1);
        var _startPoint: egret.Point = this.getXYByGridIndex(startGridIndex);
        var _endPoint: egret.Point = this.getXYByGridIndex(endGridIndex);
        var hasNodes: Array<ModelMapNode> = [];
        var _tempGrid: ModelMapNode;

        for (var row: number = _startRow; row <= _endRow; row++) {
            for (var col: number = _startCol; col <= _endCol; col++) {
                var _gridIndex: number = this.mapColNum * (row - 1) + col;
                var _gridModel: ModelMapNode = this.modelMapNodes[_gridIndex - 1];
                if (endGridIndex == _gridIndex) {
                    _gridModel.findnode.parentnodeId = startGridIndex;
                    return endGridIndex;
                }
                if (_gridIndex == startGridIndex)
                    continue;
                if (!_gridModel.isCanWalk)
                    continue;
                var _isCloseNode: boolean = closePath.indexOf(_gridIndex) >= 0;
                if (_isCloseNode) {
                    continue;
                }
                if (openPath.indexOf(_gridIndex) < 0) {
                    var distanceParam: number[] = this.getGridBetweenDistance(_gridModel, _startPoint, _endPoint);
                    if (distanceParam.length == 0) {
                        continue;
                    }
                    var currGValue: number = distanceParam[0];
                    var currHValue: number = distanceParam[1];
                    _gridModel.findnode.gValue = currGValue;
                    _gridModel.findnode.hValue = currHValue;
                }
                if (!_tempGrid) {
                    _tempGrid = _gridModel;
                } else {
                    var temp_distance: number = _tempGrid.findnode.gValue + _tempGrid.findnode.hValue;
                    var curr_distance: number = _gridModel.findnode.gValue + _gridModel.findnode.hValue;
                    if (temp_distance > curr_distance || (temp_distance == curr_distance && _gridModel.findnode.gValue < _tempGrid.findnode.gValue)) {
                        _tempGrid = _gridModel;
                    }
                }
                hasNodes.push(_gridModel);
            }
        }

        if (_tempGrid) {
            for (var i: number = 0; i < hasNodes.length; i++) {
                if (hasNodes[i].nodeId == _tempGrid.nodeId) {
                    var _openIndex: number = openPath.indexOf(_tempGrid.nodeId);
                    if (_openIndex >= 0) {
                        openPath.splice(_openIndex, 1);
                    } else {
                        _tempGrid.findnode.parentnodeId = startGridIndex;
                    }
                    // Tool.log("寻找到格子：" + hasNodes[i].nodeId);
                } else {
                    if (openPath.indexOf(hasNodes[i].nodeId) < 0) {
                        openPath.push(hasNodes[i].nodeId);
                        hasNodes[i].findnode.parentnodeId = _tempGrid.nodeId;
                    }
                }
            }
            return _tempGrid.nodeId;
        }

        return null;
        //The end
    }
    private getGridBetweenDistance(modelGrid: ModelMapNode, startPont: egret.Point, endPoint: egret.Point): number[] {
        var currPoint: egret.Point;
        var gValue: number;
        var hValue: number;
        if (modelGrid.isJump) {
            if (this.MapNodeXmlData[modelGrid.areaIndex]) {
                currPoint = this.getXYByGridIndex(modelGrid.nodeId);
                gValue = egret.Point.distance(currPoint, startPont);
                currPoint = this.getXYByGridIndex(modelGrid.areaIndex);
                hValue = egret.Point.distance(currPoint, endPoint);
            } else {
                return [];
            }
        } else {
            currPoint = this.getXYByGridIndex(modelGrid.nodeId);
            gValue = egret.Point.distance(currPoint, startPont);
            hValue = egret.Point.distance(currPoint, endPoint);
        }
        return [gValue, hValue];
    }
    //计算两格子之间是否有碰撞点 (以中心点相连计算)
    public getGridBetweenHasHit(startNode: ModelMapNode, endNode: ModelMapNode): boolean {
        if (startNode.nodeId == endNode.nodeId)
            return false;
        var startPoint: egret.Point = this.getXYByGridIndex(startNode.nodeId);
        var endPoint: egret.Point = this.getXYByGridIndex(endNode.nodeId);
        var totalXDis: number = Math.abs(endPoint.x - startPoint.x);
        var tatalYDis: number = Math.abs(endPoint.y - startPoint.y);
        var colDir: number = startNode.colIndex > endNode.colIndex ? -1 : 1;//-1左1右
        var rowDir: number = startNode.rowIndex > endNode.rowIndex ? -1 : 1;//-1上1下
        var curPosX: number = 0;
        var curPosY: number = 0;
        //横向计算 用Y来计算X
        var colDis: number = Math.abs(endNode.colIndex - startNode.colIndex);
        curPosX = startPoint.x;
        curPosY = startPoint.y;
        for (var i: number = 0; i < colDis; i++) {
            var gapXValue: number = i == 0 ? this.MAP_GRID_WIDTH / 2 : this.MAP_GRID_WIDTH;
            var gapYValue: number = gapXValue * tatalYDis / totalXDis;
            curPosX += gapXValue * colDir;
            curPosY += gapYValue * rowDir;

            //如果说正好在对角 看方向不把总线方向相对的点算进去
            if (curPosY % this.MAP_GRID_HEIGHT == 0) {
                var gridModel1: ModelMapNode = this.getNodeModelByXY(curPosX - (this.MAP_GRID_WIDTH / 2 * colDir), curPosY - (this.MAP_GRID_HEIGHT / 2 * rowDir))
                if (gridModel1.nodeType != MAP_GRID_TYPE.NORMAL)
                    return true;
                var gridModel2: ModelMapNode = this.getNodeModelByXY(curPosX + (this.MAP_GRID_WIDTH / 2 * colDir), curPosY + (this.MAP_GRID_HEIGHT / 2 * rowDir))
                if (gridModel2.nodeType != MAP_GRID_TYPE.NORMAL)
                    return true;
            } else {
                //左边点
                var leftGrid: ModelMapNode = this.getNodeModelByXY(curPosX - (this.MAP_GRID_WIDTH / 2), curPosY);
                if (leftGrid.nodeType != MAP_GRID_TYPE.NORMAL)
                    return true;
                //右边点
                var rightGrid: ModelMapNode = this.getNodeModelByXY(curPosX + (this.MAP_GRID_WIDTH / 2), curPosY);
                if (leftGrid.nodeType != MAP_GRID_TYPE.NORMAL)
                    return true;
            }
        }
        //纵向计算
        var rowDis: number = Math.abs(endNode.rowIndex - startNode.rowIndex);
        curPosX = startPoint.x;
        curPosY = startPoint.y;
        for (var i: number = 0; i < rowDis; i++) {
            var gapYValue: number = i == 0 ? this.MAP_GRID_HEIGHT / 2 : this.MAP_GRID_HEIGHT;
            var gapXValue: number = gapYValue * totalXDis / tatalYDis;
            curPosX += gapXValue * colDir;
            curPosY += gapYValue * rowDir;
            //如果说正好在对角 看方向不把总线方向相对的点算进去
            if (curPosX % this.MAP_GRID_HEIGHT == 0) {
                var gridModel1: ModelMapNode = this.getNodeModelByXY(curPosX - (this.MAP_GRID_WIDTH / 2 * colDir), curPosY - (this.MAP_GRID_HEIGHT / 2 * rowDir))
                if (gridModel1.nodeType != MAP_GRID_TYPE.NORMAL)
                    return true;
                var gridModel2: ModelMapNode = this.getNodeModelByXY(curPosX + (this.MAP_GRID_WIDTH / 2 * colDir), curPosY + (this.MAP_GRID_HEIGHT / 2 * rowDir))
                if (gridModel2.nodeType != MAP_GRID_TYPE.NORMAL)
                    return true;
            } else {
                //上边点
                var upGrid: ModelMapNode = this.getNodeModelByXY(curPosX, curPosY - (this.MAP_GRID_HEIGHT / 2));
                if (upGrid.nodeType != MAP_GRID_TYPE.NORMAL)
                    return true;
                //右边点
                var downGrid: ModelMapNode = this.getNodeModelByXY(curPosX, curPosY + (this.MAP_GRID_HEIGHT / 2));
                if (downGrid.nodeType != MAP_GRID_TYPE.NORMAL)
                    return true;
            }
        }
        return false;//能走到这就说明没有碰撞点
    }
    //算出两点之间第一个不是碰撞的点
    public getGridBetweenNotHit(startNode: ModelMapNode, endNode: ModelMapNode): ModelMapNode {
        if (startNode.nodeId == endNode.nodeId)
            return startNode;
        var startPoint: egret.Point = this.getXYByGridIndex(startNode.nodeId);
        var endPoint: egret.Point = this.getXYByGridIndex(endNode.nodeId);
        var totalXDis: number = Math.abs(endPoint.x - startPoint.x);
        var tatalYDis: number = Math.abs(endPoint.y - startPoint.y);
        var colDir: number = startNode.colIndex > endNode.colIndex ? -1 : 1;//-1左1右
        var rowDir: number = startNode.rowIndex > endNode.rowIndex ? -1 : 1;//-1上1下
        var curPosX: number = 0;
        var curPosY: number = 0;
        //横向计算 用Y来计算X
        var colDis: number = Math.abs(endNode.colIndex - startNode.colIndex);
        curPosX = startPoint.x;
        curPosY = startPoint.y;
        for (var i: number = 0; i < colDis; i++) {
            var gapXValue: number = i == 0 ? this.MAP_GRID_WIDTH / 2 : this.MAP_GRID_WIDTH;
            var gapYValue: number = gapXValue * tatalYDis / totalXDis;
            curPosX += gapXValue * colDir;
            curPosY += gapYValue * rowDir;

            //如果说正好在对角 看方向不把总线方向相对的点算进去
            if (curPosY % this.MAP_GRID_HEIGHT == 0) {
                var gridModel1: ModelMapNode = this.getNodeModelByXY(curPosX - (this.MAP_GRID_WIDTH / 2 * colDir), curPosY - (this.MAP_GRID_HEIGHT / 2 * rowDir))
                if (gridModel1.nodeType == MAP_GRID_TYPE.NORMAL)
                    return gridModel1;
                var gridModel2: ModelMapNode = this.getNodeModelByXY(curPosX + (this.MAP_GRID_WIDTH / 2 * colDir), curPosY + (this.MAP_GRID_HEIGHT / 2 * rowDir))
                if (gridModel2.nodeType == MAP_GRID_TYPE.NORMAL)
                    return gridModel2;
            } else {
                //左边点
                var leftGrid: ModelMapNode = this.getNodeModelByXY(curPosX - (this.MAP_GRID_WIDTH / 2), curPosY);
                if (leftGrid.nodeType == MAP_GRID_TYPE.NORMAL)
                    return leftGrid;
                //右边点
                var rightGrid: ModelMapNode = this.getNodeModelByXY(curPosX + (this.MAP_GRID_WIDTH / 2), curPosY);
                if (leftGrid.nodeType == MAP_GRID_TYPE.NORMAL)
                    return leftGrid;
            }
        }
        //纵向计算
        var rowDis: number = Math.abs(endNode.rowIndex - startNode.rowIndex);
        curPosX = startPoint.x;
        curPosY = startPoint.y;
        for (var i: number = 0; i < rowDis; i++) {
            var gapYValue: number = i == 0 ? this.MAP_GRID_HEIGHT / 2 : this.MAP_GRID_HEIGHT;
            var gapXValue: number = gapYValue * totalXDis / tatalYDis;
            curPosX += gapXValue * colDir;
            curPosY += gapYValue * rowDir;
            //如果说正好在对角 看方向不把总线方向相对的点算进去
            if (curPosX % this.MAP_GRID_HEIGHT == 0) {
                var gridModel1: ModelMapNode = this.getNodeModelByXY(curPosX - (this.MAP_GRID_WIDTH / 2 * colDir), curPosY - (this.MAP_GRID_HEIGHT / 2 * rowDir))
                if (gridModel1.nodeType == MAP_GRID_TYPE.NORMAL)
                    return gridModel1;
                var gridModel2: ModelMapNode = this.getNodeModelByXY(curPosX + (this.MAP_GRID_WIDTH / 2 * colDir), curPosY + (this.MAP_GRID_HEIGHT / 2 * rowDir))
                if (gridModel2.nodeType == MAP_GRID_TYPE.NORMAL)
                    return gridModel2;
            } else {
                //上边点
                var upGrid: ModelMapNode = this.getNodeModelByXY(curPosX, curPosY - (this.MAP_GRID_HEIGHT / 2));
                if (upGrid.nodeType == MAP_GRID_TYPE.NORMAL)
                    return upGrid;
                //右边点
                var downGrid: ModelMapNode = this.getNodeModelByXY(curPosX, curPosY + (this.MAP_GRID_HEIGHT / 2));
                if (downGrid.nodeType == MAP_GRID_TYPE.NORMAL)
                    return downGrid;
            }
        }
        return startNode;//能走到这就说明没有可行走点
    }
    //The end
}
enum MAP_GRID_TYPE {
    NORMAL = 0,//正常点
    COLLSION = 1,//碰撞点
    JUMP = 2,//跳跃点
    COVER = 3,//遮挡
}