import {
  BolEvent,
  BrandTension,
  EventSeriesId,
  FieldNoteArchive,
  IndustryDomainId,
  MemberStoryJourney,
  MembershipTier,
  SocialRhythmId,
} from './types/bol';

export const BRAND_META = {
  enName: 'BoL Club',
  zhName: 'BoL 俱乐部',
  miniProgramName: 'BoL万象博联',
  domain: 'bo-link.com',
  oneLinePositioning:
    '面向各行业海归与菁英的商业与生活平台，以线下活动为入口，让更多人彼此遇见、深度连接、共同成长。',
  coreValueProposition: '把“认识人”变成值得赴约的体验，把一次见面变成可以持续的连接。',
  brandIntroCopy:
    'BoL 以高质量线下活动为入口，连接各行业海归与职场菁英。我们在酒会、沙龙、运动和私宴中，创造更自然、更有内容的认识方式。',
  etymologyNote:
    '“Bo（博）”寓意多元、丰富与广阔；“L（Link）”代表链接与长期联系。在粤港澳大湾区（深圳、广州、香港）与上海的真实场域里，我们用恰当的人数、审美与议题密度，让跨行业交流自然发生。',
  icpNotice:
    '域名 bo-link.com 正在进行 ICP 备案审核；当前为品牌数字门户预览环境，正式报名与会籍服务请通过微信小程序「BoL万象博联」完成。',
};

export const EVENT_SERIES_TABS: Array<{
  id: EventSeriesId;
  label: string;
  enLabel: string;
  countHint: string;
}> = [
  { id: 'all', label: '全部系列', enLabel: 'All Curations', countHint: '06' },
  { id: 'networking', label: 'Networking 酒会', enLabel: 'Evening Mixer', countHint: '02' },
  { id: 'ai-global', label: 'AI 与品牌出海', enLabel: 'AI & Global Growth', countHint: '01' },
  { id: 'private-dinner', label: '闭门私宴', enLabel: 'Private Table', countHint: '01' },
  { id: 'yacht-sport', label: '游艇与城市运动', enLabel: 'Yacht & Sport', countHint: '01' },
  { id: 'culture-lifestyle', label: '先锋生活与沙龙', enLabel: 'Culture & Salon', countHint: '01' },
];

export const CURATED_EVENTS: BolEvent[] = [
  {
    id: 'bol-sz-ai-wine',
    code: 'BOL-SZ-1114',
    title: 'BoL · AI 硬件与品牌出海微醺夜话',
    englishSubtitle: 'AI Product & Cross-Border Brand Evening Salon',
    series: 'ai-global',
    seriesLabel: 'AI 与品牌出海',
    city: '深圳',
    venue: '南山区华侨城创意园 · 隐室暗调威士忌廊',
    date: '2026-11-14',
    timeRange: '20:00 — 23:00',
    capacity: 28,
    remainingSeats: 6,
    memberPrice: 198,
    standardPrice: 298,
    dressCode: 'Smart Casual · 深色或大地色系',
    visualMood: 'wine-velvet',
    atmosphereNote: '活动氛围示意 · 暗酒红吧台与小组圆桌交流',
    formula: {
      whatIsIt: '一场围绕生成式 AI 硬件落地与欧美/东南亚品牌出海策略的晚间交流酒会。',
      whoIsItFor:
        '适合正在做智能硬件产品、独立站增长、海外渠道拓展或跨境投融资的海归创业者与业务负责人。',
      whatHappens:
        '前 45 分钟由两位一线出海主理人拆解真实踩坑案例，随后按“北美渠道 / 硬件供应链 / AI 营销流”分桌自由微醺交谈，主理人现场协助破冰引荐。',
      whyAttend:
        '告别千篇一律的宏大行业峰会，在 28 人严控密度的灯光与酒杯之间，直接认识正在解决相似跨境问题的人。',
    },
    curatedTopics: ['北美线下渠道入驻实操', '多模态硬件交互与客单价溢价', '海外本土化内容团队搭建'],
    hostName: 'Julian Chen',
    hostRole: '前硅谷产品负责人 · 现深圳出海消费电子联合创始人',
  },
  {
    id: 'bol-gz-private-table',
    code: 'BOL-GZ-1120',
    title: 'BoL · 珠江秋夜跨界主理人长桌私宴',
    englishSubtitle: 'Canton Autumn Cross-Industry Founders Private Dinner',
    series: 'private-dinner',
    seriesLabel: '闭门私宴',
    city: '广州',
    venue: '天河区珠江新城 · 艺术私厨包厢（审核通过后发送具体门牌）',
    date: '2026-11-20',
    timeRange: '19:00 — 22:30',
    capacity: 12,
    remainingSeats: 3,
    memberPrice: 520,
    standardPrice: 680,
    dressCode: 'Cocktail Attire · 雅致正装或质感便服',
    visualMood: 'champagne-noir',
    atmosphereNote: '活动氛围示意 · 12 人定制长桌与暖烛光侍酒',
    formula: {
      whatIsIt: '一席仅限 12 位嘉宾入座的审核制跨行业深度晚宴，聚焦新消费、空间设计与制造业转型。',
      whoIsItFor:
        '适合在大湾区经营实体品牌、买手空间、建筑设计事务所或家族制造企业的创始团队与核心决策者。',
      whatHappens:
        '五道式岭南新派融合料理佐配自然酒，每道菜肴之间设置一个由主理人引导的真实商业或生活命题，全场共同倾听与回应。',
      whyAttend:
        '在没有外部打扰的私密包厢内，把社交从“匆忙交换微信”还原为一顿有温度、有智识回响的慢节奏晚宴。',
    },
    curatedTopics: ['大湾区供应链的品牌化转身', '线下商业空间的非标体验设计', '长期主义者的精力管理'],
    hostName: 'Clara Lin',
    hostRole: '伦敦艺术大学校友 · 独立商业空间策展人',
  },
  {
    id: 'bol-sz-networking-noir',
    code: 'BOL-SZ-1122',
    title: 'BoL · 湾区海归跨界 Networking 爵士酒会',
    englishSubtitle: 'Greater Bay Area Alumni & Professionals Jazz Networking',
    series: 'networking',
    seriesLabel: 'Networking 酒会',
    city: '深圳',
    venue: '福田区平安金融中心高层 · 云端景观 Lounge',
    date: '2026-11-22',
    timeRange: '20:30 — 23:30',
    capacity: 45,
    remainingSeats: 11,
    memberPrice: 168,
    standardPrice: 258,
    dressCode: 'Chic Evening · 建议佩戴一件有故事的配饰',
    visualMood: 'salon-glow',
    atmosphereNote: '活动氛围示意 · 城市夜景天际线与黑胶爵士现场',
    formula: {
      whatIsIt: 'BoL 经典城市社交系列，融合现场黑胶爵士乐与结构化破冰卡片的跨行业海归酒会。',
      whoIsItFor:
        '适合刚回到深圳/香港发展、或希望跳出原有金融/科技/法律单一圈层，结识多元背景同频朋友的海归与职场菁英。',
      whatHappens:
        '入场即领取定制「连接线索卡」，根据共同留学地区与生活兴趣自然分组；中场设有 3 轮无压力的开放式微醺对话。',
      whyAttend:
        '即使一个人赴约也无需局促，现场主理人与线索机制让每一次碰杯都有真实话题可聊。',
    },
    curatedTopics: ['跨城生活与双城通勤灵感', '从海外大厂到本土创业的心态切换', '小众威士忌与黑胶审美'],
    hostName: 'Marcus Wu',
    hostRole: '港大金融硕士 · BoL 深圳常驻社群主理人',
  },
  {
    id: 'bol-hk-yacht-sunset',
    code: 'BOL-HK-1128',
    title: 'BoL · 维港日落帆船与海岸社交航行',
    englishSubtitle: 'Victoria Harbour Sunset Sailing & Coastal Social',
    series: 'yacht-sport',
    seriesLabel: '游艇与城市运动',
    city: '香港',
    venue: '中环 9 号公众码头登船 · 途经南丫岛海湾',
    date: '2026-11-28',
    timeRange: '15:30 — 19:30',
    capacity: 18,
    remainingSeats: 4,
    memberPrice: 680,
    standardPrice: 880,
    dressCode: 'Resort Linen · 航海风米白/深蓝轻便着装',
    visualMood: 'harbor-amber',
    atmosphereNote: '活动氛围示意 · 甲板海风、香槟冰桶与落日余晖',
    formula: {
      whatIsIt: '一场结合深水湾帆船航行、甲板香槟品鉴与深港双城金融科技交流的海上半日聚会。',
      whoIsItFor:
        '适合常驻香港与深圳、热爱水上运动与户外生活方式，同时关注家族办公室、Web3 合规与跨境资产配置的专业人士。',
      whatHappens:
        '午后自中环启航，体验扬帆掌舵协作；日落时分停泊静谧海湾，开启冰镇香槟与海风甲板夜话。',
      whyAttend:
        '摆脱写字楼会议室的拘谨，在海风、浪声与落日余晖中建立更松弛、更值得信赖的深港跨城友谊。',
    },
    curatedTopics: ['深港双城生活方式指南', '全球宏观波动下的个人资产视角', '帆船、网球与城市耐力运动'],
    hostName: 'Evelyn Ho',
    hostRole: '剑桥校友 · 香港资管机构副总裁',
  },
  {
    id: 'bol-sh-ppt-salon',
    code: 'BOL-SH-1205',
    title: 'BoL · 「乱讲 PPT」跨学科反严肃灵感夜',
    englishSubtitle: 'Unscripted Slide Night & Interdisciplinary Wit Salon',
    series: 'culture-lifestyle',
    seriesLabel: '先锋生活与沙龙',
    city: '上海',
    venue: '静安区武定路 · 独立建筑实验室剧场',
    date: '2026-12-05',
    timeRange: '19:30 — 22:00',
    capacity: 32,
    remainingSeats: 9,
    memberPrice: 128,
    standardPrice: 198,
    dressCode: 'Creative Relaxed · 自由松弛',
    visualMood: 'warm-brass',
    atmosphereNote: '活动氛围示意 · 剧场暖光投影与松弛哄笑瞬间',
    formula: {
      whatIsIt: '把严肃职场工具变成幽默社交媒介的创意夜话：每位分享者用 5 分钟讲一个非工作领域的奇思妙想。',
      whoIsItFor:
        '适合厌倦了商业互吹、拥有强烈好奇心与有趣灵魂的建筑师、算法工程师、主厨、主理人与策略人。',
      whatHappens:
        '6 位跨界会员带来“如何科学挑选人生第一把古董椅”到“用博弈论解释猫咪社交”的即兴分享，以及全盲抽幻灯片接龙挑战。',
      whyAttend:
        '当一个人放下职业头衔谈论真正痴迷的小事时，你才能最快认出谁是值得深交一辈子的同频朋友。',
    },
    curatedTopics: ['反效率主义的城市漫游', '当代生活里的手工与器物审美', '跨学科思维如何反哺商业直觉'],
    hostName: 'Sora Tang',
    hostRole: '哥伦比亚大学建筑系校友 · 独立策展与视觉艺术总监',
  },
  {
    id: 'bol-sz-founder-mixer',
    code: 'BOL-SZ-1212',
    title: 'BoL · 岁末黑金之夜：长期主义者年度沙龙酒会',
    englishSubtitle: 'Year-End Black & Champagne Gala Salon',
    series: 'networking',
    seriesLabel: 'Networking 酒会',
    city: '深圳',
    venue: '南山区深圳湾一号 · 艺术策展空间',
    date: '2026-12-12',
    timeRange: '19:30 — 23:30',
    capacity: 60,
    remainingSeats: 14,
    memberPrice: 368,
    standardPrice: 528,
    dressCode: 'Black & Champagne · 墨黑与香槟金主题着装',
    visualMood: 'emerald-obsidian',
    atmosphereNote: '活动氛围示意 · 墨黑空间、香槟金微光与年度连接纪念',
    formula: {
      whatIsIt: '汇聚大湾区与上海核心会籍成员的年度主题沙龙与爵士晚宴酒会。',
      whoIsItFor:
        '适合过去一年曾在 BoL 相遇的老朋友，以及希望在岁末深度接入大湾区核心商业与生活网络的优质新成员。',
      whatHappens:
        '包含年度跨行业商业复盘对谈、侍酒师香槟盲品互动，以及“一人一封年度引荐信”实名连接环节。',
      whyAttend:
        '把一整年零散的遇见沉淀为可长期复利的信任关系，为下一年的合作与生活打开新的叙事篇章。',
    },
    curatedTopics: ['2027 跨境与本土新机会展望', '从一次活动相识到长期商业合伙', '大湾区城市人文生活提案'],
    hostName: 'BoL 联合主理团',
    hostRole: '深圳 · 广州 · 香港 · 上海四城主理人联袂主持',
  },
];

export const BRAND_TENSIONS: BrandTension[] = [
  {
    id: 'luxury-intimacy',
    index: '01',
    leftPole: '高级审美',
    leftEn: 'Refined Craft',
    rightPole: '真实亲近',
    rightEn: 'Human Warmth',
    principle: '材质、光影与版式保持克制讲究，但文案与现场交流永远说人话、不端架子。',
    sceneExample: '侍酒师提供专业选酒讲解，而破冰卡上的第一个问题是“你最近一次纯粹因为好奇而学的技能是什么”。',
    defaultBalance: 54,
  },
  {
    id: 'business-life',
    index: '02',
    leftPole: '商业密度',
    leftEn: 'Commercial Rigor',
    rightPole: '松弛生活',
    rightEn: 'Effortless Living',
    principle: '既有聚焦 AI 与跨境出海的硬核行业复盘，也有微醺夜话、帆船出海与乱讲 PPT 的松弛呼吸。',
    sceneExample: '在南山谈完北美渠道策略的两个人，下一周可能在维港日落帆船上聊起各自钟爱的黑胶唱片。',
    defaultBalance: 50,
  },
  {
    id: 'privacy-openness',
    index: '03',
    leftPole: '私密边界',
    leftEn: 'Curated Privacy',
    rightPole: '开放友好',
    rightEn: 'Open Curiosity',
    principle: '严格审核出席名单并保护嘉宾肖像隐私；一旦进入现场，则放下防备、平等倾听多元背景。',
    sceneExample: '私宴包厢地址仅对审核通过嘉宾定向解锁，现场所有影像均经过授权确认或采用氛围光影记录。',
    defaultBalance: 62,
  },
  {
    id: 'restraint-vitality',
    index: '04',
    leftPole: '视觉克制',
    leftEn: 'Visual Restraint',
    rightPole: '现场热忱',
    rightEn: 'Live Energy',
    principle: '墨黑与香槟金构建安静的数字阅读体验，只为衬托线下碰杯、倾听与哄笑时的鲜活能量。',
    sceneExample: '拒绝廉价的霓虹促销与喧哗口号，让每一次线下重逢的谈笑成为唯一的主角。',
    defaultBalance: 48,
  },
];

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'free-guest',
    name: '自由访客会员',
    englishName: 'BoL Registered Guest',
    categoryLabel: '基础身份',
    priceDisplay: '¥0',
    billingCycle: '注册即享 · 按场次原价报名',
    positioning: '适合初次了解 BoL Club、希望先从单场公开酒会或主题沙龙体验现场氛围的新朋友。',
    targetAudience: '首次接触 BoL 的海归与跨行业专业人士',
    accentColor: 'muted',
    privileges: [
      '通过「BoL万象博联」小程序实名登记基础档案',
      '按单场标准票价申请参与公开 Networking 酒会与沙龙',
      '活动现场接入主理人破冰分组与同频引荐服务',
      '订阅双周城市精选活动日历与行业复盘纪要',
    ],
    cardRatioNote: '1.6:1 标准数字身份卡 · 隐藏真实编号保护隐私',
  },
  {
    id: 'salon-pass',
    name: '酒会优享次卡',
    englishName: 'Evening Salon 4-Pass',
    categoryLabel: '专项权益次卡',
    priceDisplay: '¥680',
    billingCycle: '含 4 次酒会/沙龙通用席位（180 天有效）',
    positioning: '专为高频参与城市晚间 Networking 酒会与 AI/出海主题沙龙的成员设计的灵活通兑卡。',
    targetAudience: '每月定期拓展行业人脉、偏好晚间微醺交流节奏的成员',
    accentColor: 'wine',
    privileges: [
      '4 次通用席位直兑（单场折算仅 ¥170，较标准票立省约 35%）',
      '热门 AI 出海与天际线酒会享提前 24 小时优先锁定席位',
      '支持携 1 位同频好友共享次卡名额（好友亦需通过基础背景审核）',
      '到期未用完次数可无缝折抵升级至年度星光或星辰会籍',
    ],
    cardRatioNote: '1.6:1 暗酒红金属质感次卡 · 聚焦晚间酒会场景',
  },
  {
    id: 'starlight',
    name: '星光年度会籍',
    englishName: 'Starlight Annual Membership',
    categoryLabel: '年度会籍',
    priceDisplay: '¥1,680',
    billingCycle: '365 天全城权益 · 含专属活动会员价',
    positioning: '建立长期社群关系的核心会籍，打通大湾区与上海跨城活动会员价及闭门沙龙优先权。',
    targetAudience: '希望深度融入 BoL 跨行业网络、持续参与全年多元活动的活跃成员',
    accentColor: 'champagne',
    privileges: [
      '全年所有公开酒会、沙龙与运动场次尊享会员专属优享价（平均节省 30%–40%）',
      '赠送 2 张价值 ¥298 的主题酒会免单礼遇券',
      '解锁审核制「闭门长桌私宴」与「维港帆船航行」席位候补与报名资格',
      '专属社群主理人 1V1 需求建档，全年提供 6 次精准跨行业人脉引荐',
    ],
    cardRatioNote: '1.6:1 香槟金拉丝纹数字会籍卡 · 跨城通用权益',
  },
  {
    id: 'celestial',
    name: '星辰黑金会籍',
    englishName: 'Celestial Black-Gold Patron',
    categoryLabel: '年度黑金会籍',
    priceDisplay: '¥4,800',
    billingCycle: '365 天全场景黑金礼遇 · 邀约与审核制',
    positioning: '面向创业者、投资人、企业高管与联合发起人的深度共创席位，享有闭门私宴与主题发起权。',
    targetAudience: '有高频资源对接需求、或希望共同担任沙龙/私宴出品人的商业领袖',
    accentColor: 'member-gold',
    privileges: [
      '全年常规 Networking 酒会与主题沙龙无限次免票畅行（需提前预约留座）',
      '含 2 席「12 人跨界主理人长桌私宴」或「海上帆船社交航行」正式席位',
      '全年 12 次由联合创始人团队跟进的 1V1 定向商业/投融资/出海资源引荐',
      '每年可联合 BoL 策展团队共同出品 1 场专属定制主题沙龙或品牌闭门夜话',
    ],
    cardRatioNote: '1.6:1 墨黑镶嵌会员金典藏卡 · 独立铸造序列',
  },
];

export const FIELD_NOTES_ARCHIVE: FieldNoteArchive[] = [
  {
    id: 'fn-01',
    gatheringTitle: '深圳南山 · 生成式 AI 与跨境硬件闭门酒会（第 14 期）',
    cityAndDate: '深圳 · 2026 年 10 月 · 26 位出席嘉宾',
    seriesLabel: 'AI 与品牌出海',
    participantComposition: '海外名校理工与商科背景占比 88% · 涵盖硬件产品总监、独立站操盘手与早期美元基金投资人',
    reflectionQuote:
      '以前参加上百人的创业大会，加了三十个微信却聊不出三句真话。在 BoL 的威士忌吧台旁，我和同桌做北美线下商超渠道的校友聊了一个半小时，两周后我们就敲定了感恩节季的联合试点。',
    memberName: 'Kevin Z.',
    memberRole: '智能音频硬件品牌联合创始人',
    memberBackground: '加州大学伯克利分校校友 · 常驻深圳',
    outcomeMetric: '活动后 14 天内促成 3 组跨境渠道与供应链实地互访',
    visualPlateType: 'glassware-light',
  },
  {
    id: 'fn-02',
    gatheringTitle: '广州珠江新城 · 建筑、买手空间与新消费主理人秋夜私宴',
    cityAndDate: '广州 · 2026 年 10 月 · 12 位出席嘉宾',
    seriesLabel: '闭门私宴',
    participantComposition: '12 人严控长桌 · 涵盖独立建筑师、香氛品牌创始人、非遗器物策展人与家族制造企业接班人',
    reflectionQuote:
      '最打动我的是现场的边界感与尊重感。没有生硬的推销，主理人在第三道菜时抛出的命题让整张桌子自然打开了话匣子，散场时大家在珠江边又走了很久。',
    memberName: 'Linnea W.',
    memberRole: '独立商业空间与植物装置主理人',
    memberBackground: '伦敦艺术大学校友 · 常驻广州/深圳',
    outcomeMetric: '100% 出席嘉宾在次月继续赴约或升级年度星光会籍',
    visualPlateType: 'roundtable-shadow',
  },
  {
    id: 'fn-03',
    gatheringTitle: '香港中环至南丫岛 · 深港双城金融与科技帆船航行',
    cityAndDate: '香港 · 2026 年 09 月 · 16 位出席嘉宾',
    seriesLabel: '游艇与城市运动',
    participantComposition: '深港跨城专业人士 · 涵盖量化私募、跨境法律合规、家族办公室与生物科技研究者',
    reflectionQuote:
      '海风一吹，中环写字楼里的防备感就卸下了一半。一起拉过帆绳、看过维港落日的人，哪怕聊起严肃的跨境合规与宏观配置，也有一种难得的真诚。',
    memberName: 'Adrian L.',
    memberRole: '跨境并购与家族事务律师',
    memberBackground: '伦敦政经学院校友 · 常驻香港',
    outcomeMetric: '沉淀深港双城海上运动与投资读书长期小组',
    visualPlateType: 'harbor-dusk',
  },
];

export const INDUSTRY_OPTIONS: Array<{
  id: IndustryDomainId;
  label: string;
  enLabel: string;
  description: string;
}> = [
  {
    id: 'ai-tech',
    label: 'AI、硬科技与数字化产品',
    enLabel: 'AI & Deep Tech',
    description: '大模型应用、智能硬件、机器人、SaaS 与工程研发',
  },
  {
    id: 'cross-border',
    label: '跨境电商、品牌出海与全球增长',
    enLabel: 'Global Brand & Cross-Border',
    description: '欧美/东南亚渠道、DTC 独立站、海外本土化营销与供应链',
  },
  {
    id: 'investment-family',
    label: '一级市场投资、金融与家族企业',
    enLabel: 'Venture, Finance & Family Enterprise',
    description: '风险投资、并购咨询、家族办公室与实业转型升级',
  },
  {
    id: 'creative-arch',
    label: '建筑空间、先锋设计与生活方式主理',
    enLabel: 'Architecture, Design & Curation',
    description: '空间建筑、买手零售、策展艺术、新消费与餐酒文化',
  },
  {
    id: 'biotech-health',
    label: '生命科学、医疗健康与耐力运动',
    enLabel: 'Biotech, Longevity & Sport',
    description: '创新药械、精准健康管理、帆船网球与都市户外',
  },
];

export const RHYTHM_OPTIONS: Array<{
  id: SocialRhythmId;
  label: string;
  enLabel: string;
  subtitle: string;
}> = [
  {
    id: 'tipsy-salon',
    label: '微醺夜话与爵士酒会',
    enLabel: 'Evening Whisky & Jazz Mixer',
    subtitle: '25–45 人 · 线索破冰 · 松弛自然的跨界碰杯',
  },
  {
    id: 'closed-banquet',
    label: '12 人定制长桌私宴',
    enLabel: '12-Seat Private Table',
    subtitle: '10–12 人 · 审核入席 · 整晚聚焦深度命题',
  },
  {
    id: 'coastal-sport',
    label: '海岸帆船与城市运动',
    enLabel: 'Harbor Sailing & Club Sport',
    subtitle: '15–20 人 · 阳光海风 · 在协作与运动中建立信任',
  },
  {
    id: 'frontier-forum',
    label: '前沿实战复盘与乱讲沙龙',
    enLabel: 'Case Study & Unscripted Salon',
    subtitle: '25–35 人 · 高密度干货或反严肃跨学科灵感碰撞',
  },
];

export const VI_COLOR_TOKENS = [
  { name: '墨黑 Ink', token: '--bol-ink', hex: '#0B0B0C', usage: '页面底色、深色导航（占比约 65% 主基底）' },
  { name: '深炭 Charcoal', token: '--bol-charcoal', hex: '#151517', usage: '卡片容器、浮层、内容分区' },
  { name: '暖白 Ivory', token: '--bol-ivory', hex: '#F2EFE9', usage: '主标题、主要正文（WCAG AAA 高对比）' },
  { name: '灰米 Muted', token: '--bol-muted', hex: '#A3A09A', usage: '辅助说明、日期、次要元数据' },
  { name: '香槟金 Champagne', token: '--bol-champagne', hex: '#D8B98A', usage: '三圆 Logo、按钮边框、重点锚点' },
  { name: '会员金 Member Gold', token: '--bol-member-gold', hex: '#BF8943', usage: '会籍价格、黑金权益重点' },
  { name: '暗酒红 Wine', token: '--bol-wine', hex: '#5A1A1E', usage: '酒会、私宴与微醺夜话情绪氛围色' },
  { name: '分隔线 Line', token: '--bol-line', hex: '#2A2A2E', usage: '1px 克制细线、结构边界' },
];

export const MEMBER_STORIES: MemberStoryJourney[] = [
  {
    id: 'story-ethan-ai',
    memberName: 'Ethan Lin · 林哲远',
    roleTitle: '多模态消费级 AI 硬件联合创始人 & CEO',
    almaMaterAndCity: '斯坦福大学电子工程硕士 · 常驻深圳南山',
    industryLabel: 'AI、硬科技与跨境出海',
    tierProgression: '自由访客会员 → 星辰黑金会籍',
    currentTierId: 'celestial',
    headlineQuote:
      '“在硅谷待了六年回到深圳创业，最缺的不是技术讨论，而是既懂海外审美又掌握珠三角制造与北美线下渠道的同频战友。”',
    storyNarrative:
      '初次通过朋友推荐参加华侨城威士忌廊的「AI 硬件微醺夜话」时，我只抱着放松喝一杯的心态。没想到主理人根据我的破冰线索卡，把我和一位深耕北美 BestBuy 渠道的校友安排在同一圆桌。短短半年内，我从单场访客升级为星辰黑金会员，不仅在闭门长桌私宴上敲定了供应链战略合伙人，还联合 BoL 共同出品了第 14 期硬件出海专场夜话。',
    milestones: [
      {
        phase: '01 · 初次赴约',
        timepoint: '2026 年 04 月 · 深圳',
        sceneTitle: 'AI 硬件与品牌出海微醺夜话',
        detail: '通过现场连接线索卡破冰，结识北美商超渠道负责人与工业设计主理人。',
      },
      {
        phase: '02 · 深度连接',
        timepoint: '2026 年 07 月 · 广州/深圳',
        sceneTitle: '升级星辰黑金会籍 & 12 人闭门私宴',
        detail: '主理人团队定向引荐 4 位大湾区精密声学供应链接班人与早期美元基金合伙人。',
      },
      {
        phase: '03 · 长期共创',
        timepoint: '2026 年 10 月 · 大湾区',
        sceneTitle: '完成 Pre-A 轮协同并担任沙龙联合出品人',
        detail: '促成北美 300+ 线下门店渠道试点，并与社群内 2 家品牌达成跨界联名。',
      },
    ],
    keyMetrics: [
      { label: '累计参与场次', value: '8 场' },
      { label: '主理人定向引荐', value: '11 位' },
      { label: '落地商业合作', value: '3 项' },
    ],
    connectedPeers: ['北美线下商超渠道合伙人', '珠三角声学智造二代主理人', '早期硬科技美元基金 VP'],
  },
  {
    id: 'story-chloe-arch',
    memberName: 'Chloe Shen · 沈知夏',
    roleTitle: '独立建筑事务所主持建筑师 & 策展人',
    almaMaterAndCity: '英国 AA 建筑联盟学院校友 · 往返上海与广州',
    industryLabel: '建筑空间、先锋设计与新消费',
    tierProgression: '酒会优享次卡 → 星光年度会籍',
    currentTierId: 'starlight',
    headlineQuote:
      '“BoL 最珍贵的是它不把人异化成一张张功利的名片。我们在微醺和笑声里聊出的审美共识，反而成了最稳固的商业契约。”',
    storyNarrative:
      '我最初在上海静安参加了「乱讲 PPT 跨学科灵感夜」，当晚我用五分钟分享了“威士忌酒杯的建筑力学”，台下一位广州东方香氛品牌创始人主动在散场后找我深聊。升级星光年度会籍后，我借着出差大湾区的机会入席了珠江新城长桌私宴，最终承接了她们品牌在深圳与上海双城旗舰买手空间的整体策展。',
    milestones: [
      {
        phase: '01 · 破圈相识',
        timepoint: '2026 年 05 月 · 上海',
        sceneTitle: '「乱讲 PPT」跨学科反严肃灵感夜',
        detail: '放下建筑师的严肃图纸，在即兴分享中结识新消费品牌创始团队与视觉艺术家。',
      },
      {
        phase: '02 · 跨城联动',
        timepoint: '2026 年 08 月 · 广州',
        sceneTitle: '珠江秋夜 12 人跨界主理人长桌私宴',
        detail: '利用星光会籍跨城权益赴约广州，与本土器物及香氛主理人建立深度信任。',
      },
      {
        phase: '03 · 审美变现',
        timepoint: '2026 年 11 月 · 沪穗双城',
        sceneTitle: '联合打造双城非标商业快闪空间',
        detail: '由社群成员共同出资与策展的复合美学空间正式落地，成为 BoL 线下常驻据点之一。',
      },
    ],
    keyMetrics: [
      { label: '跨城赴约轨迹', value: '沪 / 穗 / 深' },
      { label: '深度同频好友', value: '16 位' },
      { label: '联合策展项目', value: '2 个' },
    ],
    connectedPeers: ['东方香氛与器物品牌创始人', '独立买手百货主理人', '生成式视觉装置艺术家'],
  },
  {
    id: 'story-victor-capital',
    memberName: 'Victor Kwok · 郭隽言',
    roleTitle: '香港单一家办资产配置总监 & 跨境并购顾问',
    almaMaterAndCity: '牛津大学金融经济硕士 · 常驻香港中环',
    industryLabel: '一级市场投资、家办与家族企业',
    tierProgression: '星光年度会籍 → 星辰黑金会籍',
    currentTierId: 'celestial',
    headlineQuote:
      '“中环的午餐会往往充满防御感，但维港帆船上的海风和深湾私宴里的慢节奏对谈，让我看到了大湾区创业者最真实、最有生命力的一面。”',
    storyNarrative:
      '过去我习惯在香港本地金融圈活动，对深圳和广州涌现的新一代出海与硬科技企业缺乏一手触角。加入 BoL 星辰黑金会籍后，我每月都会从香港过关参加深圳湾的闭门夜话，或邀请内地会员登上维港日落帆船。在共同拉帆协作与微醺夜聊中，我们完成了两笔极具价值的跨境结构咨询与早期跟投。',
    milestones: [
      {
        phase: '01 · 海上破冰',
        timepoint: '2026 年 06 月 · 香港',
        sceneTitle: '维港日落帆船与海岸社交航行',
        detail: '在中环至南丫岛航线上，与深圳硬科技及生物医疗创业者建立无隔阂友谊。',
      },
      {
        phase: '02 · 双城互访',
        timepoint: '2026 年 09 月 · 深圳/香港',
        sceneTitle: '主理人 1V1 定向引荐制造企业二代',
        detail: '实地走访大湾区 3 家精密智造与新材料企业，探讨家族实业出海并购路径。',
      },
      {
        phase: '03 · 长期智囊',
        timepoint: '2026 年 11 月 · 深港双城',
        sceneTitle: '发起「深港航海与跨境资本」常设读书会',
        detail: '沉淀 18 位深港核心成员的月度闭门互助网络，实现商业与生活方式双重复利。',
      },
    ],
    keyMetrics: [
      { label: '深港跨城互访', value: '12 次' },
      { label: '1V1 精准引荐', value: '12 次' },
      { label: '跨境投融对接', value: '4 宗' },
    ],
    connectedPeers: ['大湾区智造企业接班人', '便携医疗器械出海创始人', '跨境税务与合规合伙人'],
  },
  {
    id: 'story-sophia-dtc',
    memberName: 'Sophia Zhou · 周予安',
    roleTitle: '全球 DTC 生活方式品牌增长合伙人',
    almaMaterAndCity: '宾夕法尼亚大学沃顿商学院校友 · 常驻深圳/上海',
    industryLabel: '品牌全球化、DTC 独立站与耐力运动',
    tierProgression: '自由访客会员 → 星光年度会籍',
    currentTierId: 'starlight',
    headlineQuote:
      '“一个人刚回国创业时很容易陷入信息孤岛。BoL 像一个经过严选的城市客厅，每次推门进去，都能遇到正在翻越同一座山的人。”',
    storyNarrative:
      '从费城回到国内组建独立站团队初期，我在工作之外几乎没有社交时间。BoL 的活动严控在 20 到 40 人之间，且每次都有清晰的行业或生活方式命题。通过星光会籍的 6 次主理人定向引荐，我不仅找到了现在的海外视觉创意总监，还加入了俱乐部周末的网球与海岸运动小组，找回了久违的生活松弛感。',
    milestones: [
      {
        phase: '01 · 城市着陆',
        timepoint: '2026 年 03 月 · 深圳',
        sceneTitle: '湾区海归跨界 Networking 爵士酒会',
        detail: '回国首月独自赴约，在黑胶爵士与分组破冰中快速融入湾区海归核心社群。',
      },
      {
        phase: '02 · 智识共振',
        timepoint: '2026 年 07 月 · 深圳/上海',
        sceneTitle: 'AI 赋能海外本土化增长实战复盘',
        detail: '与多位月销百万美金的独立站操盘手深度拆解欧美 TikTok 与线下买手店策略。',
      },
      {
        phase: '03 · 团队与生活',
        timepoint: '2026 年 10 月 · 深圳',
        sceneTitle: '通过社群引荐招募核心合伙人',
        detail: '成功引入一位伦敦海归品牌总监，并成为 BoL 城市运动系列常驻领队。',
      },
    ],
    keyMetrics: [
      { label: '全年参与聚会', value: '9 场' },
      { label: '引荐核心人才', value: '2 位' },
      { label: '节省报名成本', value: '¥2,460' },
    ],
    connectedPeers: ['海外红人营销机构创始人', '伦敦海归视觉艺术总监', '消费基金投资经理'],
  },
];

