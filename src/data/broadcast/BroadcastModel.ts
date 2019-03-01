enum EBroadcastId {
    // 枚举是键值相互的两个映射
    Message_ServerClose = -1,//服务器即将关闭
    Message_Server = 0,      //服务器发送
    Message_FirstPay = 1,   //首充
    Message_VIP = 2,        //vip
    Message_BlessHorseUp = 3,   //战骑培养
    Message_BlessWeaponUp = 4,  //神兵强化
    Message_BlessClothesUp = 5, //神装培养
    Message_BlessWingUp = 6,//神羽培养
    Message_EquipStrengthen = 7,//装备强化
    Message_BossCall = 8,   //召唤BOSS
    Message_BossKill = 9,   //击杀BOSS
    Message_GodArtifactUp = 10,  //神器进阶
    Message_MagicUp = 11,  //法宝进阶
    Message_CreateUnion = 12,//创建帮会
    Message_XunBao = 13,//寻宝1转以上装备
    Message_OrangeUp = 14,//30级开始橙装升级
    Message_LadderGold = 15,//JJC到黄金段位
    Message_LadderDiamond = 16,//JJC到钻石段位
    Message_BossOrange = 17,//击杀BOSS获得橙装
    Message_ShenQiJiHuo = 18,//神器激活
    Message_LianHua = 19,//炼化
    Message_DuJieFuChou = 20,//渡劫复仇
    Message_OrangeMix = 21,//橙装合成
    Message_WishingWell = 22,//许愿池
    Message_GangChampion = 23,//帮派战冠军
    Message_GangPersonal = 24,//帮派战个人冠军
    Message_FestZhuanPan = 25,//节日转盘
    Message_PetLottery = 26,//宠物抽奖
};

class BroadcastModel {
    public static getBroadcastStr(message: BroadcastBase): string {
        var _messageDesc: string = Language.instance.getText("EBroadcast_" + message.id);
        if (_messageDesc) {
            _messageDesc = Language.instance.parseInsertText(_messageDesc, ...message.messageParams);
            if (_messageDesc.indexOf("[player]") >= 0) {
                _messageDesc = _messageDesc.replace("[player]", message.getPlayerInfoDesc());
            }
            if (_messageDesc.indexOf("[society]") >= 0) {
                _messageDesc = _messageDesc.replace("[society]", "[#c586c0" + message.society + "]");
            }
            if (_messageDesc.indexOf("[gamename]") >= 0) {
                _messageDesc = _messageDesc.replace("[gamename]", SDKManager.gamename);
            }
            _messageDesc = GameCommon.getInstance().readStringToHtml(_messageDesc);
        }
        return _messageDesc;
    }
    //The end
}



