/**
 * 数据管理
 */
class DataManager {
	/**  
	 * 版本号 提审时的版本号
	 * 第一位：资料片版本
	 * 第二位：维护版本
	 * 第三位：发版批次
	 * 规则：前后端版本号一致时 为提审版本  过审后服务器修改为下一次的版本号
	 */
	public static get version(): string {
		return '1_0_0';
	}
	//资源文件版本号
	public static get res_ver(): string {
		return '1_0_0';
	}
	/** 游戏是否为正式版本 **/
	public static isRelease: boolean;
	/**是否为PC版本**/
	public static IS_PC_Game: boolean;
	/**IOS充值是否开启**/
	public static IOS_PAY_ISOPEN: boolean = true;
	/**IOS开启的关数限制**/
	public static IOS_PAY_OPENMISSION: number = 0;
	/**IOS开启的等级限制**/
	public static IOS_PAY_LEVEL: number = 0;
	/**IOS支付开启的时间显示**/
	public static IOS_PAY_OPENDATE: string[];
	public static IOS_PAY_ZONETIME: string[];

	private static _instance: DataManager;

	public constructor() {
		// SDKManager先于其他数据使用,为了不修改之前的代码在这里赋值,后续的修改须要再更新
	}

	public static getInstance(): DataManager {
		if (this._instance == null) {
			this._instance = new DataManager();
		}
		return this._instance;
	}

	private _playerManager: PlayerManager;
	public get playerManager(): PlayerManager {
		if (!this._playerManager) {
			this._playerManager = new PlayerManager();
		}
		return this._playerManager;
	}

	private _serverManager: ServerManager;
	public get serverManager(): ServerManager {
		if (!this._serverManager) {
			this._serverManager = new ServerManager();
		}
		return this._serverManager;
	}

	private _strongerManager;
	public get strongerManager(): StrongerMonterManager {
		if (!this._strongerManager) {
			this._strongerManager = new StrongerMonterManager();
		}
		return this._strongerManager;
	}

	private _yewaipvpManager: YewaiPvPManager;
	public get yewaipvpManager(): YewaiPvPManager {
		if (!this._yewaipvpManager) {
			this._yewaipvpManager = new YewaiPvPManager();
		}
		return this._yewaipvpManager;
	}

	private _bagManager: BagManager;
	public get bagManager(): BagManager {
		if (!this._bagManager) {
			this._bagManager = new BagManager();
		}
		return this._bagManager;
	}

	private _forgeManager: ForgeManager;
	public get forgeManager(): ForgeManager {
		if (!this._forgeManager) {
			this._forgeManager = new ForgeManager();
		}
		return this._forgeManager;
	}

	private _dupManager: DupManager;
	public get dupManager(): DupManager {
		if (!this._dupManager) {
			this._dupManager = new DupManager();
		}
		return this._dupManager;
	}

	private _legendManager: LegendManager;
	public get legendManager(): LegendManager {
		if (!this._legendManager) {
			this._legendManager = new LegendManager();
		}
		return this._legendManager;
	}

	private _xiandanManager: XianDanManager;
	public get xiandanManager(): XianDanManager {
		if (!this._xiandanManager) {
			this._xiandanManager = new XianDanManager();
		}
		return this._xiandanManager;
	}

	private _pulseManager: PulseManager;
	public get pulseManager(): PulseManager {
		if (!this._pulseManager) {
			this._pulseManager = new PulseManager();
		}
		return this._pulseManager;
	}

	private _arenaManager: ArenaManager;
	public get arenaManager(): ArenaManager {
		if (!this._arenaManager) {
			this._arenaManager = new ArenaManager();
		}
		return this._arenaManager;
	}

	private _localArenaManager: LocalArenaManager;
	public get localArenaManager(): LocalArenaManager {
		if (!this._localArenaManager) {
			this._localArenaManager = new LocalArenaManager();
		}
		return this._localArenaManager;
	}

	private _shopManager: ShopManager;
	public get shopManager(): ShopManager {
		if (!this._shopManager) {
			this._shopManager = new ShopManager();
		}
		return this._shopManager;
	}

	private _taskManager: TaskManager;
	public get taskManager(): TaskManager {
		if (!this._taskManager) {
			this._taskManager = new TaskManager();
		}
		return this._taskManager;
	}

	private _mailManager: MailManager;
	public get mailManager(): MailManager {
		if (!this._mailManager) {
			this._mailManager = new MailManager();
		}
		return this._mailManager;
	}

	private _chatManager: ChatManager;
	public get chatManager(): ChatManager {
		if (!this._chatManager) {
			this._chatManager = new ChatManager();
		}
		return this._chatManager;
	}

	private _unionManager: UnionManager;
	public get unionManager(): UnionManager {
		if (!this._unionManager) {
			this._unionManager = new UnionManager();
		}
		return this._unionManager;
	}

	private _broadcastManager: BroadcastManager;
	public get broadcastManager(): BroadcastManager {
		if (!this._broadcastManager) {
			this._broadcastManager = new BroadcastManager();
		}
		return this._broadcastManager;
	}

	private _hintManager: HintManager;
	public get hintManager(): HintManager {
		if (!this._hintManager) {
			this._hintManager = new HintManager();
		}
		return this._hintManager;
	}

	private _psychManager: PsychManager;
	public get psychManager(): PsychManager {
		if (!this._psychManager) {
			this._psychManager = new PsychManager();
		}
		return this._psychManager;
	}
	private _fateManager: FateManager;
	public get fateManager(): FateManager {
		if (!this._fateManager) {
			this._fateManager = new FateManager();
		}
		return this._fateManager;
	}
	private _redPointManager: RedPointManager;
	public get redPointManager(): RedPointManager {
		if (!this._redPointManager) {
			this._redPointManager = new RedPointManager();
		}
		return this._redPointManager;
	}

	private _blessManager: BlessManager;
	public get blessManager(): BlessManager {
		if (!this._blessManager) {
			this._blessManager = new BlessManager();
		}
		return this._blessManager;
	}

	private _skillManager: SkillManager;
	public get skillManager(): SkillManager {
		if (!this._skillManager) {
			this._skillManager = new SkillManager();
		}
		return this._skillManager;
	}

	private _skillEnhantM: SkillEnchantManager;
	public get skillEnhantM(): SkillEnchantManager {
		if (!this._skillEnhantM) {
			this._skillEnhantM = new SkillEnchantManager();
		}
		return this._skillEnhantM;
	}

	private _escortManager: EscortManager;
	public get escortManager(): EscortManager {
		if (!this._escortManager) {
			this._escortManager = new EscortManager();
		}
		return this._escortManager;
	}

	private _activityManager: ActivityManager;
	public get activityManager(): ActivityManager {
		if (!this._activityManager) {
			this._activityManager = new ActivityManager();
		}
		return this._activityManager;
	}

	private _sevenDayCarnivalManager: SevenDayCarnivalManager;
	public get sevenDayCarnivalManager(): SevenDayCarnivalManager {
		if (!this._sevenDayCarnivalManager) {
			this._sevenDayCarnivalManager = new SevenDayCarnivalManager();
		}
		return this._sevenDayCarnivalManager;
	}

	private _topRankManager: TopRankManager;
	public get topRankManager(): TopRankManager {
		if (!this._topRankManager) {
			this._topRankManager = new TopRankManager();
		}
		return this._topRankManager;
	}
	private _newactivitysManager: NewactivitysManager;
	public get newactivitysManager(): NewactivitysManager {
		if (!this._newactivitysManager) {
			this._newactivitysManager = new NewactivitysManager();
		}
		return this._newactivitysManager;
	}

	private _monthCardManager: MonthCardManager;
	public get monthCardManager(): MonthCardManager {
		if (!this._monthCardManager) {
			this._monthCardManager = new MonthCardManager();
		}
		return this._monthCardManager;
	}

	private _vipManager: VipManager;
	public get vipManager(): VipManager {
		if (!this._vipManager) {
			this._vipManager = new VipManager();
		}
		return this._vipManager;
	}

	private _rechargeManager: RechargeManager;
	public get rechargeManager(): RechargeManager {
		if (!this._rechargeManager) {
			this._rechargeManager = new RechargeManager();
		}
		return this._rechargeManager;
	}

	private _welfareManager: WelfareManager;
	public get welfareManager(): WelfareManager {
		if (!this._welfareManager) {
			this._welfareManager = new WelfareManager();
		}
		return this._welfareManager;
	}

	private _hallActivityManager: HallActivityManager;
	public get hallActivityManager(): HallActivityManager {
		if (!this._hallActivityManager) {
			this._hallActivityManager = new HallActivityManager();
		}
		return this._hallActivityManager;
	}

	private _totalRechargeManager: TotalRechargeManager;
	public get totalRechargeManager(): TotalRechargeManager {
		if (!this._totalRechargeManager) {
			this._totalRechargeManager = new TotalRechargeManager();
		}
		return this._totalRechargeManager;
	}

	private _investManager: InvestManager;
	public get investManager(): InvestManager {
		if (!this._investManager) {
			this._investManager = new InvestManager();
		}
		return this._investManager;
	}

	private _rebateManager: RebateManager;
	public get rebateManager(): RebateManager {
		if (!this._rebateManager) {
			this._rebateManager = new RebateManager();
		}
		return this._rebateManager;
	}

	private _lianxuLeiChongManager: LianXuLeiChongManager;
	public get lianxuChongManager(): LianXuLeiChongManager {
		if (!this._lianxuLeiChongManager) {
			this._lianxuLeiChongManager = new LianXuLeiChongManager();
		}
		return this._lianxuLeiChongManager;
	}

	private _openServerLeiChongManager: OpenServerLeiChongManager;
	public get openServerLeiChongManager(): OpenServerLeiChongManager {
		if (!this._openServerLeiChongManager) {
			this._openServerLeiChongManager = new OpenServerLeiChongManager();
		}
		return this._openServerLeiChongManager;
	}
	private _tLShopManager: TLShopManager;
	public get tLShopManager(): TLShopManager {
		if (!this._tLShopManager) {
			this._tLShopManager = new TLShopManager();
		}
		return this._tLShopManager;
	}

	private _tLGiftManager: TLGiftManager;
	public get tLGiftManager(): TLGiftManager {
		if (!this._tLGiftManager) {
			this._tLGiftManager = new TLGiftManager();
		}
		return this._tLGiftManager;
	}

	private _tOPRankGiftManager: TOPRankGiftManager;
	public get tOPRankGiftManager(): TOPRankGiftManager {
		if (!this._tOPRankGiftManager) {
			this._tOPRankGiftManager = new TOPRankGiftManager();
		}
		return this._tOPRankGiftManager;
	}

	private _turnplateManager: TurnplateManager;
	public get turnplateManager(): TurnplateManager {
		if (!this._turnplateManager) {
			this._turnplateManager = new TurnplateManager();
		}
		return this._turnplateManager;
	}

	private _timeGoodsManager: TimeGoodsManager;
	public get timeGoodsManager(): TimeGoodsManager {
		if (!this._timeGoodsManager) {
			this._timeGoodsManager = new TimeGoodsManager();
		}
		return this._timeGoodsManager;
	}
	private _vipTLGiftManager: VIPTLGiftManager;
	public get vipTLGiftManager(): VIPTLGiftManager {
		if (!this._vipTLGiftManager) {
			this._vipTLGiftManager = new VIPTLGiftManager();
		}
		return this._vipTLGiftManager;
	}
	private _vipTLShopManager: VIPTLShopManager;
	public get vipTLShopManager(): VIPTLShopManager {
		if (!this._vipTLShopManager) {
			this._vipTLShopManager = new VIPTLShopManager();
		}
		return this._vipTLShopManager;
	}

	private _shentongManager: ShenTongManager;
	public get shentongManager(): ShenTongManager {
		if (!this._shentongManager) {
			this._shentongManager = new ShenTongManager();
		}
		return this._shentongManager;
	}
	private _coatardManager: CoatardManager;
	public get coatardManager(): CoatardManager {
		if (!this._coatardManager) {
			this._coatardManager = new CoatardManager();
		}
		return this._coatardManager;
	}
	private _collectWordManager: CollectWordManager;
	public get collectWordManager(): CollectWordManager {
		if (!this._collectWordManager) {
			this._collectWordManager = new CollectWordManager();
		}
		return this._collectWordManager;
	}
	private _tLDogzManager: TLDogzManager;
	public get tLDogzManager(): TLDogzManager {
		if (!this._tLDogzManager) {
			this._tLDogzManager = new TLDogzManager();
		}
		return this._tLDogzManager;
	}
	private _springActivityManager: SpringActivityManager;
	public get springActivityManager(): SpringActivityManager {
		if (!this._springActivityManager) {
			this._springActivityManager = new SpringActivityManager();
		}
		return this._springActivityManager;
	}
	private _signInManager: SignInManager;
	public get signInManager(): SignInManager {
		if (!this._signInManager) {
			this._signInManager = new SignInManager();
		}
		return this._signInManager;
	}
	private _springTLShopManager: SpringTLShopManager;
	public get springTLShopManager(): SpringTLShopManager {
		if (!this._springTLShopManager) {
			this._springTLShopManager = new SpringTLShopManager();
		}
		return this._springTLShopManager;
	}

	private _crossConsumeRankManager: CrossConsumeRankManager;
	public get crossConsumeRankManager(): CrossConsumeRankManager {
		if (!this._crossConsumeRankManager) {
			this._crossConsumeRankManager = new CrossConsumeRankManager();
		}
		return this._crossConsumeRankManager;
	}

	private _totalConsumeManager: TotalConsumeManager;
	public get totalConsumeManager(): TotalConsumeManager {
		if (!this._totalConsumeManager) {
			this._totalConsumeManager = new TotalConsumeManager();
		}
		return this._totalConsumeManager;
	}
	private _oneDollarManager: OneDollarManager;
	public get oneDollarManager(): OneDollarManager {
		if (!this._oneDollarManager) {
			this._oneDollarManager = new OneDollarManager();
		}
		return this._oneDollarManager;
	}
	private _luckTurnplateManager: LuckTurnplateManager;
	public get luckTurnplateManager(): LuckTurnplateManager {
		if (!this._luckTurnplateManager) {
			this._luckTurnplateManager = new LuckTurnplateManager();
		}
		return this._luckTurnplateManager;
	}
	private _gemManager: GemManager;
	public get gemManager(): GemManager {
		if (!this._gemManager) {
			this._gemManager = new GemManager();
		}
		return this._gemManager;
	}
	private _spatBloodsManager: SpatBloodManager;
	public get spatBloodsManager(): SpatBloodManager {
		if (!this._spatBloodsManager) {
			this._spatBloodsManager = new SpatBloodManager();
		}
		return this._spatBloodsManager;
	}
	private _oneRebateSTManager: OneRebateSTManager;
	public get oneRebateSTManager(): OneRebateSTManager {
		if (!this._oneRebateSTManager) {
			this._oneRebateSTManager = new OneRebateSTManager();
		}
		return this._oneRebateSTManager;
	}
	private _orangeFeastManager: OrangeFeastManager;
	public get orangeFeastManager(): OrangeFeastManager {
		if (!this._orangeFeastManager) {
			this._orangeFeastManager = new OrangeFeastManager();
		}
		return this._orangeFeastManager;
	}
	private _rebirthManager: RebirthManager;
	public get rebirthManager(): RebirthManager {
		if (!this._rebirthManager) {
			this._rebirthManager = new RebirthManager();
		}
		return this._rebirthManager;
	}
	private _dominateManager: DominateManager;
	public get dominateManager(): DominateManager {
		if (!this._dominateManager) {
			this._dominateManager = new DominateManager();
		}
		return this._dominateManager;
	}
	private _magicManager: MagicManager;
	public get magicManager(): MagicManager {
		if (!this._magicManager) {
			this._magicManager = new MagicManager();
		}
		return this._magicManager;
	}
	private _celestialManager: CelestialManager;
	public get celestialManager(): CelestialManager {
		if (!this._celestialManager) {
			this._celestialManager = new CelestialManager();
		}
		return this._celestialManager;
	}
	private _shenqiZhuanPanManager: ShenQiZhuanPanManager
	public get shenqiZhuanPanManager(): ShenQiZhuanPanManager {
		if (!this._shenqiZhuanPanManager) {
			this._shenqiZhuanPanManager = new ShenQiZhuanPanManager();
		}
		return this._shenqiZhuanPanManager;
	}
	public _tianGongManager: TianGongManager;
	public get tianGongManager(): TianGongManager {
		if (!this._tianGongManager) {
			this._tianGongManager = new TianGongManager();
		}
		return this._tianGongManager;
	}
	private _fuLingManager: FuLingManager;
	public get fuLingManager(): FuLingManager {
		if (!this._fuLingManager) {
			this._fuLingManager = new FuLingManager();
		}
		return this._fuLingManager;
	}

	private _titleManager: TitleManager;
	public get titleManager(): TitleManager {
		if (!this._titleManager) {
			this._titleManager = new TitleManager();
		}
		return this._titleManager;
	}

	private _tujianManager: TuJianManager;
	public get tujianManager(): TuJianManager {
		if (!this._tujianManager) {
			this._tujianManager = new TuJianManager();
		}
		return this._tujianManager;
	}
	private _treasureRankManager: TreasureRankManager;
	public get treasureRankManager(): TreasureRankManager {
		if (!this._treasureRankManager) {
			this._treasureRankManager = new TreasureRankManager();
		}
		return this._treasureRankManager;
	}
	private _functionManager: FunctionManager;
	public get functionManager(): FunctionManager {
		if (!this._functionManager) {
			this._functionManager = new FunctionManager();
		}
		return this._functionManager;
	}
	private _wishingWellManager: WishingWellManager;
	public get wishingWellManager(): WishingWellManager {
		if (!this._wishingWellManager) {
			this._wishingWellManager = new WishingWellManager();
		}
		return this._wishingWellManager;
	}
	private _friendManager: FriendManager;
	public get friendManager(): FriendManager {
		if (!this._friendManager) {
			this._friendManager = new FriendManager();
		}
		return this._friendManager;
	}
	private _festivalLoginManager: FestivalLoginManager;
	public get festivalLoginManager(): FestivalLoginManager {
		if (!this._festivalLoginManager) {
			this._festivalLoginManager = new FestivalLoginManager();
		}
		return this._festivalLoginManager;
	}
	private _festivalDanChongManager: FestivalDanChongManager;
	public get festivalDanChongManager(): FestivalDanChongManager {
		if (!this._festivalDanChongManager) {
			this._festivalDanChongManager = new FestivalDanChongManager();
		}
		return this._festivalDanChongManager;
	}
	private _wxDanChongManager: WXDanChongManager;
	public get wxDanChongManager(): WXDanChongManager {
		if (!this._wxDanChongManager) {
			this._wxDanChongManager = new WXDanChongManager();
		}
		return this._wxDanChongManager;
	}
	private _festivalFavorableManager: FestivalFavorableManager;
	public get festivalFavorableManager(): FestivalFavorableManager {
		if (!this._festivalFavorableManager) {
			this._festivalFavorableManager = new FestivalFavorableManager();
		}
		return this._festivalFavorableManager;
	}
	private _festivalWishingwellManager: FestivalWishingwellManager;
	public get festivalWishingwellManager(): FestivalWishingwellManager {
		if (!this._festivalWishingwellManager) {
			this._festivalWishingwellManager = new FestivalWishingwellManager();
		}
		return this._festivalWishingwellManager;
	}
	private _festivalTargetManager: FestivalTargetManager;
	public get festivalTargetManager(): FestivalTargetManager {
		if (!this._festivalTargetManager) {
			this._festivalTargetManager = new FestivalTargetManager();
		}
		return this._festivalTargetManager;
	}
	//节日商店
	private _festivalShopManager: FestivalShopManager;
	public get festivalShopManager(): FestivalShopManager {
		if (!this._festivalShopManager) {
			this._festivalShopManager = new FestivalShopManager();
		}
		return this._festivalShopManager;
	}
	private _festivalLuckyBagManager: FestivalLuckyBagManager;
	public get festivalLuckyBagManager(): FestivalLuckyBagManager {
		if (!this._festivalLuckyBagManager) {
			this._festivalLuckyBagManager = new FestivalLuckyBagManager();
		}
		return this._festivalLuckyBagManager;
	}
	private _festivalWuYiManager: FestivalWuYiManager;
	public get festivalWuYiManager(): FestivalWuYiManager {
		if (!this._festivalWuYiManager) {
			this._festivalWuYiManager = new FestivalWuYiManager();
		}
		return this._festivalWuYiManager;
	}
	private _hefuActManager: HefuActivtyManager;
	public get hefuActManager(): HefuActivtyManager {
		if (!this._hefuActManager) {
			this._hefuActManager = new HefuActivtyManager();
		}
		return this._hefuActManager;
	}
	private _tuangouActManager: ActivityTuangouManager;
	public get tuangouActManager(): ActivityTuangouManager {
		if (!this._tuangouActManager) {
			this._tuangouActManager = new ActivityTuangouManager();
		}
		return this._tuangouActManager;
	}

	private _PetManager: PetManager;
	public get petManager(): PetManager {
		if (!this._PetManager) {
			this._PetManager = new PetManager();
		}
		return this._PetManager;
	}

	private _PlayCafeManager: PlayCafeManager;
	public get playCafeManager(): PlayCafeManager {
		if (!this._PlayCafeManager) {
			this._PlayCafeManager = new PlayCafeManager();
		}
		return this._PlayCafeManager;
	}

	private _dragonSoulManager: DragonSoulManager;
	public get dragonSoulManager(): DragonSoulManager {
		if (!this._dragonSoulManager) {
			this._dragonSoulManager = new DragonSoulManager();
		}
		return this._dragonSoulManager;
	}
	private _labaManager: ActivityLabaManager;
	public get labaManager(): ActivityLabaManager {
		if (!this._labaManager) {
			this._labaManager = new ActivityLabaManager();
		}
		return this._labaManager;
	}
	private _wxgameManager: WXGameManager;
	public get wxgameManager(): WXGameManager {
		if (!this._wxgameManager) {
			this._wxgameManager = new WXGameManager();
		}
		return this._wxgameManager;
	}
	private _zqManager: ActivityZQManager;
	public get zqManager(): ActivityZQManager {
		if (!this._zqManager) {
			this._zqManager = new ActivityZQManager();
		}
		return this._zqManager;
	}
	private _yjManager: YuanJieManager;
	public get yuanjieManager(): YuanJieManager {
		if (!this._yjManager) {
			this._yjManager = new YuanJieManager();
		}
		return this._yjManager;
	}
	private _wtManager: WuTanManager;
	public get wuTanManager(): WuTanManager {
		if (!this._wtManager) {
			this._wtManager = new WuTanManager();
		}
		return this._wtManager;
	}
	private _jxdManager: ActJueXingDanManager;
	public get jxdManager(): ActJueXingDanManager {
		if (!this._jxdManager) {
			this._jxdManager = new ActJueXingDanManager();
		}
		return this._jxdManager;
	}
	private _activitySmeltManager: ActivitySmeltManager;
	public get activitySmeltManager(): ActivitySmeltManager {
		if (!this._activitySmeltManager) {
			this._activitySmeltManager = new ActivitySmeltManager();
		}
		return this._activitySmeltManager
	}
	private _a666Manager: Activity666Manager;
	public get a666Manager(): Activity666Manager {
		if (!this._a666Manager) {
			this._a666Manager = new Activity666Manager();
		}
		return this._a666Manager;
	}
	private _pvpManager: PVPManager;
	public get pvpManager(): PVPManager {
		if (!this._pvpManager) {
			this._pvpManager = new PVPManager();
		}
		return this._pvpManager;
	}
	private _ringManager: MarryRingManager;
	public get ringManager(): MarryRingManager {
		if (!this._ringManager) {
			this._ringManager = new MarryRingManager();
		}
		return this._ringManager;
	}
	private _marryManager: MarryManager;
	public get marryManager(): MarryManager {
		if (!this._marryManager) {
			this._marryManager = new MarryManager();
		}
		return this._marryManager;
	}
	//The end
}
