/**
* LYJ.2017.11.1
* @数据结构存储管理类
* 注：自动生成请勿修改；
*     配置ID自动为Key值，否则按照数组索引当Key
*     如果需要二级嵌套结构如二维数组，请策划配置上groupID字段
*/
class JsonModelManager {
	private static _instance: JsonModelManager;

	public constructor() { }

	public static get instance(): JsonModelManager {
		if (this._instance == null) {
			this._instance = new JsonModelManager();
		}
		return this._instance;
	}

	public getMap(name): any {return ModelManager.getInstance().onCreateModelHashMap(name); }
	public getModelarenaRankReward(): any {return this.getMap("arenaRankReward"); }
	public getModelarenaReward(): any {return this.getMap("arenaReward"); }
	public getModelbaoshi(): any {return this.getMap("baoshi"); }
	public getModelboss(): any {return this.getMap("boss"); }
	public getModelbossConfig(): any {return this.getMap("bossConfig"); }
	public getModelbossrewards(): any {return this.getMap("bossrewards"); }
	public getModelbox(): any {return this.getMap("box"); }
	public getModelbuff(): any {return this.getMap("buff"); }
	public getModelcailiaofuben(): any {return this.getMap("cailiaofuben"); }
	public getModelcdkey(): any {return this.getMap("cdkey"); }
	public getModelchenghao(): any {return this.getMap("chenghao"); }
	public getModelchengjiu(): any {return this.getMap("chengjiu"); }
	public getModelchengjiuLv(): any {return this.getMap("chengjiuLv"); }
	public getModelchengjiuMubiao(): any {return this.getMap("chengjiuMubiao"); }
	public getModelchongwuDan(): any {return this.getMap("chongwuDan"); }
	public getModelchongwujinjie(): any {return this.getMap("chongwujinjie"); }
	public getModelchongwupeiyang(): any {return this.getMap("chongwupeiyang"); }
	public getModelchongwushengji(): any {return this.getMap("chongwushengji"); }
	public getModelchongzhishengyan(): any {return this.getMap("chongzhishengyan"); }
	public getModelchouqian(): any {return this.getMap("chouqian"); }
	public getModelconstant(): any {return this.getMap("constant"); }
	public getModelcopy(): any {return this.getMap("copy"); }
	public getModelcuilian(): any {return this.getMap("cuilian"); }
	public getModeldifu(): any {return this.getMap("difu"); }
	public getModeldifubuff(): any {return this.getMap("difubuff"); }
	public getModeldingshihuodong(): any {return this.getMap("dingshihuodong"); }
	public getModeldujie(): any {return this.getMap("dujie"); }
	public getModelequipment(): any {return this.getMap("equipment"); }
	public getModelfabaojinjie(): any {return this.getMap("fabaojinjie"); }
	public getModelfabaoshengji(): any {return this.getMap("fabaoshengji"); }
	public getModelfabaozhuanpan(): any {return this.getMap("fabaozhuanpan"); }
	public getModelfashion(): any {return this.getMap("fashion"); }
	public getModelfeastShopBox(): any {return this.getMap("feastShopBox"); }
	public getModelfengce(): any {return this.getMap("fengce"); }
	public getModelfenxiang(): any {return this.getMap("fenxiang"); }
	public getModelfirstPay(): any {return this.getMap("firstPay"); }
	public getModelfuling(): any {return this.getMap("fuling"); }
	public getModelfunctionLv(): any {return this.getMap("functionLv"); }
	public getModelgain(): any {return this.getMap("gain"); }
	public getModelgerenboss(): any {return this.getMap("gerenboss"); }
	public getModelgongfa(): any {return this.getMap("gongfa"); }
	public getModelguanqiakaiqi(): any {return this.getMap("guanqiakaiqi"); }
	public getModelguildBoss(): any {return this.getMap("guildBoss"); }
	public getModelguildfuben(): any {return this.getMap("guildfuben"); }
	public getModelguildLv(): any {return this.getMap("guildLv"); }
	public getModelguildreward(): any {return this.getMap("guildreward"); }
	public getModelguildShangxiang(): any {return this.getMap("guildShangxiang"); }
	public getModelguildSkill(): any {return this.getMap("guildSkill"); }
	public getModelguildspecialreward(): any {return this.getMap("guildspecialreward"); }
	public getModelguildTask(): any {return this.getMap("guildTask"); }
	public getModelhongzhuang(): any {return this.getMap("hongzhuang"); }
	public getModelhunjie(): any {return this.getMap("hunjie"); }
	public getModelitem(): any {return this.getMap("item"); }
	public getModeljianchi(): any {return this.getMap("jianchi"); }
	public getModeljiehuntaozhuang(): any {return this.getMap("jiehuntaozhuang"); }
	public getModeljingjie(): any {return this.getMap("jingjie"); }
	public getModeljingmai(): any {return this.getMap("jingmai"); }
	public getModelkuafuboss(): any {return this.getMap("kuafuboss"); }
	public getModelkuafubossrewards(): any {return this.getMap("kuafubossrewards"); }
	public getModelkuafujingjichang(): any {return this.getMap("kuafujingjichang"); }
	public getModelkuafureward(): any {return this.getMap("kuafureward"); }
	public getModellevelup(): any {return this.getMap("levelup"); }
	public getModellianhua(): any {return this.getMap("lianhua"); }
	public getModellingxing(): any {return this.getMap("lingxing"); }
	public getModellonghun(): any {return this.getMap("longhun"); }
	public getModellvyaoqing(): any {return this.getMap("lvyaoqing"); }
	public getModelmail(): any {return this.getMap("mail"); }
	public getModelmap(): any {return this.getMap("map"); }
	public getModelmingge(): any {return this.getMap("mingge"); }
	public getModelminggelv(): any {return this.getMap("minggelv"); }
	public getModelmountDan(): any {return this.getMap("mountDan"); }
	public getModelmountEqianghua(): any {return this.getMap("mountEqianghua"); }
	public getModelmountEquipment(): any {return this.getMap("mountEquipment"); }
	public getModelmountparam(): any {return this.getMap("mountparam"); }
	public getModelmountSkill(): any {return this.getMap("mountSkill"); }
	public getModelmounttaozhuang(): any {return this.getMap("mounttaozhuang"); }
	public getModelpay(): any {return this.getMap("pay"); }
	public getModelpeishiboss(): any {return this.getMap("peishiboss"); }
	public getModelPVPLV(): any {return this.getMap("PVPLV"); }
	public getModelqianghua(): any {return this.getMap("qianghua"); }
	public getModelqianghuadashi(): any {return this.getMap("qianghuadashi"); }
	public getModelqihun(): any {return this.getMap("qihun"); }
	public getModelquanminboss(): any {return this.getMap("quanminboss"); }
	public getModelronghun(): any {return this.getMap("ronghun"); }
	public getModelshanggutaozhuang(): any {return this.getMap("shanggutaozhuang"); }
	public getModelshareMaster(): any {return this.getMap("shareMaster"); }
	public getModelshenmishop(): any {return this.getMap("shenmishop"); }
	public getModelshenqi(): any {return this.getMap("shenqi"); }
	public getModelshop(): any {return this.getMap("shop"); }
	public getModelshow(): any {return this.getMap("show"); }
	public getModelsixiang(): any {return this.getMap("sixiang"); }
	public getModelsixiangfuben(): any {return this.getMap("sixiangfuben"); }
	public getModelsixiangjinjie(): any {return this.getMap("sixiangjinjie"); }
	public getModelskill(): any {return this.getMap("skill"); }
	public getModelskilldmg(): any {return this.getMap("skilldmg"); }
	public getModelskilltupo(): any {return this.getMap("skilltupo"); }
	public getModelstory(): any {return this.getMap("story"); }
	public getModeltaskDaily(): any {return this.getMap("taskDaily"); }
	public getModeltaskhuodong(): any {return this.getMap("taskhuodong"); }
	public getModeltehuilibao2(): any {return this.getMap("tehuilibao2"); }
	public getModelteshuxiaoguo(): any {return this.getMap("teshuxiaoguo"); }
	public getModeltext(): any {return this.getMap("text"); }
	public getModeltianshenzhuangbei(): any {return this.getMap("tianshenzhuangbei"); }
	public getModeltianshushengji(): any {return this.getMap("tianshushengji"); }
	public getModeltianshutupo(): any {return this.getMap("tianshutupo"); }
	public getModeltips(): any {return this.getMap("tips"); }
	public getModeltouxiang(): any {return this.getMap("touxiang"); }
	public getModeltouxiangkuang(): any {return this.getMap("touxiangkuang"); }
	public getModeltouxiangkuangshengji(): any {return this.getMap("touxiangkuangshengji"); }
	public getModeltouxiangshengji(): any {return this.getMap("touxiangshengji"); }
	public getModelttjjc(): any {return this.getMap("ttjjc"); }
	public getModelttre(): any {return this.getMap("ttre"); }
	public getModeltujian(): any {return this.getMap("tujian"); }
	public getModeltujian2(): any {return this.getMap("tujian2"); }
	public getModeltujiantaozhuang(): any {return this.getMap("tujiantaozhuang"); }
	public getModelvip(): any {return this.getMap("vip"); }
	public getModelvipboss(): any {return this.getMap("vipboss"); }
	public getModelvipshenqi(): any {return this.getMap("vipshenqi"); }
	public getModelvipShopXianShi(): any {return this.getMap("vipShopXianShi"); }
	public getModelwutan(): any {return this.getMap("wutan"); }
	public getModelwuxing(): any {return this.getMap("wuxing"); }
	public getModelxiandan(): any {return this.getMap("xiandan"); }
	public getModelxiangsishu(): any {return this.getMap("xiangsishu"); }
	public getModelxianshan(): any {return this.getMap("xianshan"); }
	public getModelxianshanzhaohuan(): any {return this.getMap("xianshanzhaohuan"); }
	public getModelxinfajinjie(): any {return this.getMap("xinfajinjie"); }
	public getModelxinfaLv(): any {return this.getMap("xinfaLv"); }
	public getModelxinshou(): any {return this.getMap("xinshou"); }
	public getModelxinshourenwu(): any {return this.getMap("xinshourenwu"); }
	public getModelxuezhanboss(): any {return this.getMap("xuezhanboss"); }
	public getModelxunbao(): any {return this.getMap("xunbao"); }
	public getModelxunbaobang(): any {return this.getMap("xunbaobang"); }
	public getModelxunbaobang2(): any {return this.getMap("xunbaobang2"); }
	public getModelxuyuanchi(): any {return this.getMap("xuyuanchi"); }
	public getModelxuyuanchi2(): any {return this.getMap("xuyuanchi2"); }
	public getModelyuanjie(): any {return this.getMap("yuanjie"); }
	public getModelyuanjielv(): any {return this.getMap("yuanjielv"); }
	public getModelyuanshen(): any {return this.getMap("yuanshen"); }
	public getModelyueka(): any {return this.getMap("yueka"); }
	public getModelzaoyubang(): any {return this.getMap("zaoyubang"); }
	public getModelzhanwen(): any {return this.getMap("zhanwen"); }
	public getModelzhaohuanboss(): any {return this.getMap("zhaohuanboss"); }
	public getModelzhaohuanrewards(): any {return this.getMap("zhaohuanrewards"); }
	public getModelzhenghun(): any {return this.getMap("zhenghun"); }
	public getModelzhuanpanvip(): any {return this.getMap("zhuanpanvip"); }
	public getModelzhuansheng(): any {return this.getMap("zhuansheng"); }
	public getModelzhuanshengrewards(): any {return this.getMap("zhuanshengrewards"); }
	public getModelzhufuzhifuben(): any {return this.getMap("zhufuzhifuben"); }
	public getModelzhuxiantai(): any {return this.getMap("zhuxiantai"); }
	public getModelzuduifuben(): any {return this.getMap("zuduifuben"); }
	public getModelactivity(): any {return this.getMap("activity"); }
	public getModelactivityFunction(): any {return this.getMap("activityFunction"); }
	public getModelactivityGroup(): any {return this.getMap("activityGroup"); }
	public getModelactivityjuexingdan(): any {return this.getMap("activityjuexingdan"); }
	public getModelactivityxianlvlaba(): any {return this.getMap("activityxianlvlaba"); }
	public getModelactivityxianlvshenqi(): any {return this.getMap("activityxianlvshenqi"); }
	public getModelchongbanglibao(): any {return this.getMap("chongbanglibao"); }
	public getModeldabiaohuodong(): any {return this.getMap("dabiaohuodong"); }
	public getModeldabiaorewards(): any {return this.getMap("dabiaorewards"); }
	public getModeldanbichongzhi(): any {return this.getMap("danbichongzhi"); }
	public getModeldanbichongzhi2(): any {return this.getMap("danbichongzhi2"); }
	public getModeldenglu(): any {return this.getMap("denglu"); }
	public getModeldenglu2(): any {return this.getMap("denglu2"); }
	public getModeldengluhuodong(): any {return this.getMap("dengluhuodong"); }
	public getModelfeastjizi(): any {return this.getMap("feastjizi"); }
	public getModelfeastShopRound(): any {return this.getMap("feastShopRound"); }
	public getModelfeastzhuanpan(): any {return this.getMap("feastzhuanpan"); }
	public getModelfund(): any {return this.getMap("fund"); }
	public getModelguanqiaxianfeng(): any {return this.getMap("guanqiaxianfeng"); }
	public getModelhefuchongzhi(): any {return this.getMap("hefuchongzhi"); }
	public getModelhefuleichong(): any {return this.getMap("hefuleichong"); }
	public getModelhefuzhuanpan(): any {return this.getMap("hefuzhuanpan"); }
	public getModelinvest(): any {return this.getMap("invest"); }
	public getModelkaifuduihuan(): any {return this.getMap("kaifuduihuan"); }
	public getModelkaifuleichong(): any {return this.getMap("kaifuleichong"); }
	public getModelkaifuTask(): any {return this.getMap("kaifuTask"); }
	public getModelkuafuchongzhi(): any {return this.getMap("kuafuchongzhi"); }
	public getModelkuafuxiaohao(): any {return this.getMap("kuafuxiaohao"); }
	public getModellabahuodong(): any {return this.getMap("labahuodong"); }
	public getModellabapaihangbang(): any {return this.getMap("labapaihangbang"); }
	public getModelleichonghaoli(): any {return this.getMap("leichonghaoli"); }
	public getModelleijichongzhi(): any {return this.getMap("leijichongzhi"); }
	public getModelleijixiaohao(): any {return this.getMap("leijixiaohao"); }
	public getModelleijixiaohaopaihang(): any {return this.getMap("leijixiaohaopaihang"); }
	public getModellianxuleichong(): any {return this.getMap("lianxuleichong"); }
	public getModelqiandao(): any {return this.getMap("qiandao"); }
	public getModelshenqichouqian(): any {return this.getMap("shenqichouqian"); }
	public getModelshenqileichong(): any {return this.getMap("shenqileichong"); }
	public getModelshenqileichong2(): any {return this.getMap("shenqileichong2"); }
	public getModeltaskhefu(): any {return this.getMap("taskhefu"); }
	public getModeltaskround(): any {return this.getMap("taskround"); }
	public getModeltehuilibaohuodong(): any {return this.getMap("tehuilibaohuodong"); }
	public getModeltuangouhuodong(): any {return this.getMap("tuangouhuodong"); }
	public getModelxiangoulibao(): any {return this.getMap("xiangoulibao"); }
	public getModelxiangoulibao2(): any {return this.getMap("xiangoulibao2"); }
	public getModelxiangoulibao3(): any {return this.getMap("xiangoulibao3"); }
	public getModelxianlvpaihang(): any {return this.getMap("xianlvpaihang"); }
	public getModelyaoqianshu(): any {return this.getMap("yaoqianshu"); }
	public getModelzhoumofenxiang(): any {return this.getMap("zhoumofenxiang"); }
	public getModelzhuanpanhuodong(): any {return this.getMap("zhuanpanhuodong"); }

}
class ModelarenaRankReward extends JsonModelTemplet {}
class ModelarenaReward extends JsonModelTemplet {}
class Modelbaoshi extends JsonModelTemplet {}
class Modelboss extends JsonModelTemplet {}
class ModelbossConfig extends JsonModelTemplet {}
class Modelbossrewards extends JsonModelTemplet {}
class Modelbox extends JsonModelTemplet {}
class Modelbuff extends JsonModelTemplet {}
class Modelcailiaofuben extends JsonModelTemplet {}
class Modelcdkey extends JsonModelTemplet {}
class Modelchenghao extends JsonModelTemplet {}
class Modelchengjiu extends JsonModelTemplet {}
class ModelchengjiuLv extends JsonModelTemplet {}
class ModelchengjiuMubiao extends JsonModelTemplet {}
class ModelchongwuDan extends JsonModelTemplet {}
class Modelchongwujinjie extends JsonModelTemplet {}
class Modelchongwupeiyang extends JsonModelTemplet {}
class Modelchongwushengji extends JsonModelTemplet {}
class Modelchongzhishengyan extends JsonModelTemplet {}
class Modelchouqian extends JsonModelTemplet {}
class Modelconstant extends JsonModelTemplet {}
class Modelcopy extends JsonModelTemplet {}
class Modelcuilian extends JsonModelTemplet {}
class Modeldifu extends JsonModelTemplet {}
class Modeldifubuff extends JsonModelTemplet {}
class Modeldingshihuodong extends JsonModelTemplet {}
class Modeldujie extends JsonModelTemplet {}
class Modelequipment extends JsonModelTemplet {}
class Modelfabaojinjie extends JsonModelTemplet {}
class Modelfabaoshengji extends JsonModelTemplet {}
class Modelfabaozhuanpan extends JsonModelTemplet {}
class Modelfashion extends JsonModelTemplet {}
class ModelfeastShopBox extends JsonModelTemplet {}
class Modelfengce extends JsonModelTemplet {}
class Modelfenxiang extends JsonModelTemplet {}
class Modelfighter extends JsonModelTemplet {}
class ModelfirstPay extends JsonModelTemplet {}
class Modelfuling extends JsonModelTemplet {}
class ModelfunctionLv extends JsonModelTemplet {}
class Modelgain extends JsonModelTemplet {}
class Modelgerenboss extends JsonModelTemplet {}
class Modelgongfa extends JsonModelTemplet {}
class Modelguanqiakaiqi extends JsonModelTemplet {}
class ModelguildBoss extends JsonModelTemplet {}
class Modelguildfuben extends JsonModelTemplet {}
class ModelguildLv extends JsonModelTemplet {}
class Modelguildreward extends JsonModelTemplet {}
class ModelguildShangxiang extends JsonModelTemplet {}
class ModelguildSkill extends JsonModelTemplet {}
class Modelguildspecialreward extends JsonModelTemplet {}
class ModelguildTask extends JsonModelTemplet {}
class Modelhongzhuang extends JsonModelTemplet {}
class Modelhunjie extends JsonModelTemplet {}
class Modelitem extends JsonModelTemplet {}
class Modeljianchi extends JsonModelTemplet {}
class Modeljiehuntaozhuang extends JsonModelTemplet {}
class Modeljingjie extends JsonModelTemplet {}
class Modeljingmai extends JsonModelTemplet {}
class Modelkuafuboss extends JsonModelTemplet {}
class Modelkuafubossrewards extends JsonModelTemplet {}
class Modelkuafujingjichang extends JsonModelTemplet {}
class Modelkuafureward extends JsonModelTemplet {}
class Modellevelup extends JsonModelTemplet {}
class Modellianhua extends JsonModelTemplet {}
class Modellingxing extends JsonModelTemplet {}
class Modellonghun extends JsonModelTemplet {}
class Modellvyaoqing extends JsonModelTemplet {}
class Modelmail extends JsonModelTemplet {}
class Modelmap extends JsonModelTemplet {}
class Modelmingge extends JsonModelTemplet {}
class Modelminggelv extends JsonModelTemplet {}
class Modelmount0 extends JsonModelTemplet {}
class Modelmount1 extends JsonModelTemplet {}
class Modelmount2 extends JsonModelTemplet {}
class Modelmount3 extends JsonModelTemplet {}
class Modelmount4 extends JsonModelTemplet {}
class ModelmountDan extends JsonModelTemplet {}
class ModelmountEqianghua extends JsonModelTemplet {}
class ModelmountEquipment extends JsonModelTemplet {}
class Modelmountparam extends JsonModelTemplet {}
class ModelmountSkill extends JsonModelTemplet {}
class Modelmounttaozhuang extends JsonModelTemplet {}
class Modelpay extends JsonModelTemplet {}
class Modelpeishiboss extends JsonModelTemplet {}
class ModelPVPLV extends JsonModelTemplet {}
class Modelqianghua extends JsonModelTemplet {}
class Modelqianghuadashi extends JsonModelTemplet {}
class Modelqihun extends JsonModelTemplet {}
class Modelquanminboss extends JsonModelTemplet {}
class Modelronghun extends JsonModelTemplet {}
class Modelshanggutaozhuang extends JsonModelTemplet {}
class ModelshareMaster extends JsonModelTemplet {}
class Modelshenmishop extends JsonModelTemplet {}
class Modelshenqi extends JsonModelTemplet {}
class Modelshop extends JsonModelTemplet {}
class Modelshow extends JsonModelTemplet {}
class Modelsixiang extends JsonModelTemplet {}
class Modelsixiangfuben extends JsonModelTemplet {}
class Modelsixiangjinjie extends JsonModelTemplet {}
class Modelskill extends JsonModelTemplet {}
class Modelskilldmg extends JsonModelTemplet {}
class Modelskilltupo extends JsonModelTemplet {}
class Modelstory extends JsonModelTemplet {}
class ModeltaskDaily extends JsonModelTemplet {}
class Modeltaskhuodong extends JsonModelTemplet {}
class Modeltehuilibao2 extends JsonModelTemplet {}
class Modelteshuxiaoguo extends JsonModelTemplet {}
class Modeltext extends JsonModelTemplet {}
class Modeltianshenzhuangbei extends JsonModelTemplet {}
class Modeltianshushengji extends JsonModelTemplet {}
class Modeltianshutupo extends JsonModelTemplet {}
class Modeltips extends JsonModelTemplet {}
class Modeltouxiang extends JsonModelTemplet {}
class Modeltouxiangkuang extends JsonModelTemplet {}
class Modeltouxiangkuangshengji extends JsonModelTemplet {}
class Modeltouxiangshengji extends JsonModelTemplet {}
class Modelttjjc extends JsonModelTemplet {}
class Modelttre extends JsonModelTemplet {}
class Modeltujian extends JsonModelTemplet {}
class Modeltujian2 extends JsonModelTemplet {}
class Modeltujiantaozhuang extends JsonModelTemplet {}
class Modelvip extends JsonModelTemplet {}
class Modelvipboss extends JsonModelTemplet {}
class Modelvipshenqi extends JsonModelTemplet {}
class ModelvipShopXianShi extends JsonModelTemplet {}
class Modelwutan extends JsonModelTemplet {}
class Modelwuxing extends JsonModelTemplet {}
class Modelxiandan extends JsonModelTemplet {}
class Modelxiangsishu extends JsonModelTemplet {}
class Modelxianshan extends JsonModelTemplet {}
class Modelxianshanzhaohuan extends JsonModelTemplet {}
class Modelxinfajinjie extends JsonModelTemplet {}
class ModelxinfaLv extends JsonModelTemplet {}
class Modelxinshou extends JsonModelTemplet {}
class Modelxinshourenwu extends JsonModelTemplet {}
class Modelxuezhanboss extends JsonModelTemplet {}
class Modelxunbao extends JsonModelTemplet {}
class Modelxunbaobang extends JsonModelTemplet {}
class Modelxunbaobang2 extends JsonModelTemplet {}
class Modelxuyuanchi extends JsonModelTemplet {}
class Modelxuyuanchi2 extends JsonModelTemplet {}
class Modelyuanjie extends JsonModelTemplet {}
class Modelyuanjielv extends JsonModelTemplet {}
class Modelyuanshen extends JsonModelTemplet {}
class Modelyueka extends JsonModelTemplet {}
class Modelzaoyubang extends JsonModelTemplet {}
class Modelzhanwen extends JsonModelTemplet {}
class Modelzhaohuanboss extends JsonModelTemplet {}
class Modelzhaohuanrewards extends JsonModelTemplet {}
class Modelzhenghun extends JsonModelTemplet {}
class Modelzhuanpanvip extends JsonModelTemplet {}
class Modelzhuansheng extends JsonModelTemplet {}
class Modelzhuanshengrewards extends JsonModelTemplet {}
class Modelzhufuzhifuben extends JsonModelTemplet {}
class Modelzhuxiantai extends JsonModelTemplet {}
class Modelzuduifuben extends JsonModelTemplet {}
class Modelactivity extends JsonModelTemplet {}
class ModelactivityFunction extends JsonModelTemplet {}
class ModelactivityGroup extends JsonModelTemplet {}
class Modelactivityjuexingdan extends JsonModelTemplet {}
class Modelactivityxianlvlaba extends JsonModelTemplet {}
class Modelactivityxianlvshenqi extends JsonModelTemplet {}
class Modelchongbanglibao extends JsonModelTemplet {}
class Modeldabiaohuodong extends JsonModelTemplet {}
class Modeldabiaorewards extends JsonModelTemplet {}
class Modeldanbichongzhi extends JsonModelTemplet {}
class Modeldanbichongzhi2 extends JsonModelTemplet {}
class Modeldenglu extends JsonModelTemplet {}
class Modeldenglu2 extends JsonModelTemplet {}
class Modeldengluhuodong extends JsonModelTemplet {}
class Modelfeastjizi extends JsonModelTemplet {}
class ModelfeastShopRound extends JsonModelTemplet {}
class Modelfeastzhuanpan extends JsonModelTemplet {}
class Modelfund extends JsonModelTemplet {}
class Modelguanqiaxianfeng extends JsonModelTemplet {}
class Modelhefuchongzhi extends JsonModelTemplet {}
class Modelhefuleichong extends JsonModelTemplet {}
class Modelhefuzhuanpan extends JsonModelTemplet {}
class Modelinvest extends JsonModelTemplet {}
class Modelkaifuduihuan extends JsonModelTemplet {}
class Modelkaifuleichong extends JsonModelTemplet {}
class ModelkaifuTask extends JsonModelTemplet {}
class Modelkuafuchongzhi extends JsonModelTemplet {}
class Modelkuafuxiaohao extends JsonModelTemplet {}
class Modellabahuodong extends JsonModelTemplet {}
class Modellabapaihangbang extends JsonModelTemplet {}
class Modelleichonghaoli extends JsonModelTemplet {}
class Modelleijichongzhi extends JsonModelTemplet {}
class Modelleijixiaohao extends JsonModelTemplet {}
class Modelleijixiaohaopaihang extends JsonModelTemplet {}
class Modellianxuleichong extends JsonModelTemplet {}
class Modelqiandao extends JsonModelTemplet {}
class Modelshenqichouqian extends JsonModelTemplet {}
class Modelshenqileichong extends JsonModelTemplet {}
class Modelshenqileichong2 extends JsonModelTemplet {}
class Modeltaskhefu extends JsonModelTemplet {}
class Modeltaskround extends JsonModelTemplet {}
class Modeltehuilibaohuodong extends JsonModelTemplet {}
class Modeltuangouhuodong extends JsonModelTemplet {}
class Modelxiangoulibao extends JsonModelTemplet {}
class Modelxiangoulibao2 extends JsonModelTemplet {}
class Modelxiangoulibao3 extends JsonModelTemplet {}
class Modelxianlvpaihang extends JsonModelTemplet {}
class Modelyaoqianshu extends JsonModelTemplet {}
class Modelzhoumofenxiang extends JsonModelTemplet {}
class Modelzhuanpanhuodong extends JsonModelTemplet {}
