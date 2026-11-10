import { CURATED_EVENTS, EVENT_SERIES_TABS, MEMBER_STORIES, MEMBERSHIP_TIERS } from '../content';
import {
  ActiveCircleFitItem,
  ActivityFrequencyId,
  AiConnectionPotentialAnalysis,
  AiDeepCircleFitReport,
  AiInterestClusterMatrix,
  AiMembershipAssessment,
  AnnualEventStreamlineData,
  AnnualStreamEventPin,
  AnnualStreamMonthPoint,
  ApplicationEventTrigger,
  ApplicationStageId,
  ApplicationStageMetric,
  ApplicationTrackerState,
  BolEvent,
  BolEventReservationSlip,
  BrandMicroVideoReel,
  CityName,
  ConciergeSuggestionPayload,
  ConnectionRadarDimension,
  ConstellationAnimatedLink,
  ConstellationStageNode,
  CrossIndustryOpportunityNode,
  CurationRecommendation,
  CuratorDialogueQuestion,
  CuratorMoodDialogueInput,
  CuratorMoodRecommendationResult,
  DigitalFootprintParticle,
  DigitalFootprintVisualization,
  EventSeriesId,
  EventSubscriptionState,
  EventSubscriptionTrigger,
  FirstScreenSkeletonBlockSpec,
  FirstScreenSkeletonPhaseId,
  FirstScreenSkeletonState,
  HeroPoeticBreathingChapter,
  HeroPoeticThemeId,
  IndustryDomainId,
  InterestClusterItem,
  InterestConnectionPath,
  LiveCommunityConnectionItem,
  LoungeZonePolarity,
  MemberGrowthConstellationData,
  MembershipPrivilegeItem,
  MembershipTier,
  NavSectionId,
  ParallaxLayerOffsets,
  PersonalWishlistSummary,
  PointerPressureRippleProfile,
  PotentialSocialPath,
  SectionChiaroscuroProfile,
  SmartFilterSummary,
  SocialRhythmId,
  SubscriptionPreferenceSummary,
  TierIndustryDistributionProfile,
  TierIndustrySegment,
  WishlistExpectationEntry,
  WishlistGrowthDimensionId,
} from '../types/bol';

export function filterCuratedEvents(
  events: BolEvent[],
  series: EventSeriesId,
  city: CityName,
  searchQuery = ''
): BolEvent[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return events.filter((ev) => {
    const matchesSeries = series === 'all' || ev.series === series;
    const matchesCity = city === '全部城市' || ev.city === city;
    if (!matchesSeries || !matchesCity) return false;

    if (!normalizedQuery) return true;

    const haystack = [
      ev.title,
      ev.englishSubtitle,
      ev.city,
      ev.venue,
      ev.seriesLabel,
      ev.formula.whatIsIt,
      ev.formula.whoIsItFor,
      ...ev.curatedTopics,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function computeSocialResonance(
  industry: IndustryDomainId,
  rhythm: SocialRhythmId,
  preferredCity: Exclude<CityName, '全部城市'> = '深圳'
): CurationRecommendation {
  const rhythmToSeriesMap: Record<SocialRhythmId, Exclude<EventSeriesId, 'all'>> = {
    'tipsy-salon': 'networking',
    'closed-banquet': 'private-dinner',
    'coastal-sport': 'yacht-sport',
    'frontier-forum': industry === 'creative-arch' ? 'culture-lifestyle' : 'ai-global',
  };

  const primarySeries =
    industry === 'cross-border' && rhythm === 'tipsy-salon'
      ? 'ai-global'
      : rhythmToSeriesMap[rhythm];

  // Score events by relevance to primarySeries, industry keywords, and preferredCity
  const scoredEvents = CURATED_EVENTS.map((ev) => {
    let score = 0;
    if (ev.series === primarySeries) score += 50;
    if (ev.city === preferredCity) score += 30;
    if (
      (industry === 'ai-tech' || industry === 'cross-border') &&
      ev.series === 'ai-global'
    ) {
      score += 25;
    }
    if (industry === 'investment-family' && (ev.series === 'private-dinner' || ev.series === 'yacht-sport')) {
      score += 20;
    }
    if (industry === 'creative-arch' && (ev.series === 'culture-lifestyle' || ev.series === 'private-dinner')) {
      score += 20;
    }
    return { ev, score };
  })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.ev);

  const recommendedEvents = scoredEvents.slice(0, 2);

  // Recommend tier based on rhythm and industry
  let targetTierId: MembershipTier['id'] = 'starlight';
  if (rhythm === 'closed-banquet' || industry === 'investment-family') {
    targetTierId = 'celestial';
  } else if (rhythm === 'tipsy-salon' && industry !== 'cross-border') {
    targetTierId = 'salon-pass';
  }

  const recommendedTier =
    MEMBERSHIP_TIERS.find((t) => t.id === targetTierId) || MEMBERSHIP_TIERS[2];

  const baseScores: Record<IndustryDomainId, number> = {
    'ai-tech': 95,
    'cross-border': 96,
    'investment-family': 94,
    'creative-arch': 93,
    'biotech-health': 92,
  };
  const rhythmBonus: Record<SocialRhythmId, number> = {
    'tipsy-salon': 2,
    'closed-banquet': 3,
    'coastal-sport': 2,
    'frontier-forum': 1,
  };
  const matchScore = Math.min(99, baseScores[industry] + rhythmBonus[rhythm]);

  const rationaleByRhythm: Record<SocialRhythmId, string> = {
    'tipsy-salon': `针对常驻${preferredCity}的背景，建议从 28–45 人密度的晚间主题酒会切入，通过「连接线索卡」在自然微醺氛围里建立第一层真实信任。`,
    'closed-banquet': `偏好深度对话与高信任边界，建议直接锁定 12 人审核制长桌私宴，在主理人控场的五道式晚宴中与跨行业决策者深聊。`,
    'coastal-sport': `跳出写字楼与会议室语境，在维港帆船协作或城市运动场景中，用共同体验替代生硬寒暄，沉淀深港及湾区长期友谊。`,
    'frontier-forum': `兼具智识密度与破圈趣味，建议优先参与一线操盘手实战复盘夜话或「乱讲 PPT」跨学科灵感夜，快速识别同频合作伙伴。`,
  };

  const peerClusters: Record<IndustryDomainId, string> = {
    'ai-tech': '硅谷/名校理工海归 · 深圳南山智能硬件主理人 · 早期硬科技基金合伙人',
    'cross-border': '北美/东南亚本土化渠道操盘手 · DTC 独立站品牌创始人 · 跨境供应链二代',
    'investment-family': '美元/人民币双币投资人 · 家族制造企业接班人 · 香港跨境并购与家办顾问',
    'creative-arch': '独立建筑师与空间策展人 · 买手零售与生活方式品牌创始人 · 视觉艺术总监',
    'biotech-health': '生命科学研究者 · 医疗器械出海创业者 · 帆船与耐力运动社群核心成员',
  };

  const suggestedConnectionsMap: Record<
    IndustryDomainId,
    Array<{ role: string; city: string; sharedTopic: string }>
  > = {
    'ai-tech': [
      { role: '多模态消费硬件联合创始人（前湾区工程师）', city: '深圳', sharedTopic: '海外众筹与北美商超入驻' },
      { role: '跨境 DTC 家居品牌增长负责人', city: '广州', sharedTopic: 'AI 驱动的本土化内容工作流' },
      { role: '早期科技美元基金 VP', city: '香港', sharedTopic: '新一代硬件交互与跨城团队搭建' },
    ],
    'cross-border': [
      { role: '智能音频品牌海外渠道合伙人', city: '深圳', sharedTopic: 'BestBuy 与欧洲线下分销体系' },
      { role: '珠三角精密制造企业二代主理人', city: '广州', sharedTopic: 'OEM 工厂向自有品牌转型路径' },
      { role: '独立空间视觉与包装策展人', city: '上海', sharedTopic: '出海品牌的东方审美叙事' },
    ],
    'investment-family': [
      { role: '香港单一家办资产配置总监', city: '香港', sharedTopic: '跨境结构设计与帆船运动' },
      { role: '大湾区新材料与智造企业接班人', city: '深圳', sharedTopic: '传统实业的并购与出海新增长' },
      { role: '独立商业地产与非标商业主理人', city: '广州', sharedTopic: '城市更新项目与长线现金流' },
    ],
    'creative-arch': [
      { role: '独立建筑事务所主持建筑师（AA 校友）', city: '上海', sharedTopic: '历史街区改造与威士忌廊设计' },
      { role: '东方香氛与器物品牌创始人', city: '广州', sharedTopic: '线下买手空间策展与出海快闪' },
      { role: '生成式视觉与交互装置艺术家', city: '深圳', sharedTopic: '科技硬件与空间美学的跨界联名' },
    ],
    'biotech-health': [
      { role: '便携健康监测设备创始人（JHU 校友）', city: '深圳', sharedTopic: '运动恢复算法与欧美合规出海' },
      { role: '香港私人医疗与抗衰中心主理人', city: '香港', sharedTopic: '深港双城健康生活方式与帆船赛' },
      { role: '功能性食品与新消费品牌合伙人', city: '上海', sharedTopic: '科学叙事与高粘性运动社群运营' },
    ],
  };

  return {
    matchScore,
    primarySeries,
    recommendedEvents,
    recommendedTier,
    rationale: rationaleByRhythm[rhythm],
    peerClusterDescription: peerClusters[industry],
    suggestedConnections: suggestedConnectionsMap[industry],
  };
}

export interface AnnualSavingsComparison {
  annualAttendances: number;
  payAsYouGoCost: number;
  salonPassEffectiveCost: number;
  starlightNetCost: number;
  estimatedSavingsWithStarlight: number;
  recommendedTierId: MembershipTier['id'];
}

export function calculateAnnualMembershipSavings(
  monthlyAttendances: number
): AnnualSavingsComparison {
  const clampedMonthly = Math.max(1, Math.min(8, Math.round(monthlyAttendances)));
  const annualAttendances = clampedMonthly * 12;
  const avgStandardTicket = 380;
  const avgMemberTicket = 220;

  const payAsYouGoCost = annualAttendances * avgStandardTicket;
  // Salon pass: 680 per 4 events = 170 per event
  const salonPassEffectiveCost = annualAttendances * 170;
  // Starlight: 1680 annual fee + 2 free tickets + member price for remaining
  const chargeableStarlightEvents = Math.max(0, annualAttendances - 2);
  const starlightNetCost = 1680 + chargeableStarlightEvents * avgMemberTicket;

  const estimatedSavingsWithStarlight = Math.max(0, payAsYouGoCost - starlightNetCost);

  let recommendedTierId: MembershipTier['id'] = 'free-guest';
  if (annualAttendances >= 18) {
    recommendedTierId = 'celestial';
  } else if (annualAttendances >= 8) {
    recommendedTierId = 'starlight';
  } else if (annualAttendances >= 4) {
    recommendedTierId = 'salon-pass';
  }

  return {
    annualAttendances,
    payAsYouGoCost,
    salonPassEffectiveCost,
    starlightNetCost,
    estimatedSavingsWithStarlight,
    recommendedTierId,
  };
}

export interface ApplicationValidationResult {
  isValid: boolean;
  errors: Partial<Record<'fullName' | 'backgroundSummary' | 'wechatId', string>>;
}

export function validateApplicationForm(input: {
  fullName: string;
  backgroundSummary: string;
  wechatId: string;
}): ApplicationValidationResult {
  const errors: Partial<Record<'fullName' | 'backgroundSummary' | 'wechatId', string>> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = '请填写您的真实姓名或常用英文称谓（至少 2 个字符）';
  }

  if (!input.backgroundSummary || input.backgroundSummary.trim().length < 6) {
    errors.backgroundSummary = '请简述您的留学/海外经历或当前从事的行业方向（至少 6 个字符）';
  }

  const wechatClean = (input.wechatId || '').trim();
  if (!wechatClean || wechatClean.length < 4 || !/^[a-zA-Z0-9_-]+$/.test(wechatClean)) {
    errors.wechatId = '请填写有效的微信号（4 位以上字母、数字或下划线），以便主理人定向联系';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateBolInvitationCode(
  city: Exclude<CityName, '全部城市'>,
  industry: IndustryDomainId,
  sequence = 1
): string {
  const cityCodeMap: Record<Exclude<CityName, '全部城市'>, string> = {
    深圳: 'SZ',
    广州: 'GZ',
    香港: 'HK',
    上海: 'SH',
  };
  const indCodeMap: Record<IndustryDomainId, string> = {
    'ai-tech': 'AI',
    'cross-border': 'GLB',
    'investment-family': 'CAP',
    'creative-arch': 'ART',
    'biotech-health': 'BIO',
  };

  const seqPadded = String(108 + sequence).padStart(4, '0');
  return `BOL-${cityCodeMap[city]}-${indCodeMap[industry]}-${seqPadded}`;
}

export function calculateParallaxOffsets(
  scrollY: number,
  reducedMotion = false
): ParallaxLayerOffsets {
  if (reducedMotion || scrollY <= 0) {
    return {
      backdropY: 0,
      orbitalRingY: 0,
      editorialTextY: 0,
      canvasCardY: 0,
      pillarsY: 0,
      ambientScale: 1,
    };
  }

  const clampedScroll = Math.min(900, Math.max(0, scrollY));
  return {
    backdropY: Math.round(clampedScroll * 0.24 * 10) / 10,
    orbitalRingY: Math.round(clampedScroll * -0.18 * 10) / 10,
    editorialTextY: Math.round(clampedScroll * -0.08 * 10) / 10,
    canvasCardY: Math.round(clampedScroll * 0.06 * 10) / 10,
    pillarsY: Math.round(clampedScroll * -0.04 * 10) / 10,
    ambientScale: Number((1 + clampedScroll * 0.00012).toFixed(4)),
  };
}

export function buildDeterministicAiAssessment(input: {
  careerBackground: string;
  city: string;
  overseasExperience: string;
  socialGoal: string;
}): AiMembershipAssessment {
  const text = `${input.careerBackground} ${input.overseasExperience} ${input.socialGoal}`.toLowerCase();
  const cityClean = input.city || '深圳';

  const isExecutiveOrInvestor =
    /创始人|合伙人|投资|家办|董事|ceo|vp|总裁|家族|并购|基金|接班/.test(text);
  const isHighFreqNetworker =
    /出海|跨境|硬件|ai|增长|渠道|主理人|独立站|算法|建筑|策展/.test(text);
  const isCasualExplorer = /初来|刚回|了解|尝试|单场|偶尔/.test(text);

  let recommendedTierId: MembershipTier['id'] = 'starlight';
  let eligibilityScore = 94;
  let statusLabel = '优先邀约入席 · 核心同频成员';

  if (isExecutiveOrInvestor) {
    recommendedTierId = 'celestial';
    eligibilityScore = 97;
    statusLabel = '黑金定邀通道 · 深度共创契合';
  } else if (isCasualExplorer && !isHighFreqNetworker) {
    recommendedTierId = 'salon-pass';
    eligibilityScore = 91;
    statusLabel = '开放欢迎入席 · 晚间酒会优选';
  } else if (isHighFreqNetworker) {
    recommendedTierId = 'starlight';
    eligibilityScore = 95;
    statusLabel = '优先邀约入席 · 跨界连接高契合';
  }

  const tierObj =
    MEMBERSHIP_TIERS.find((t) => t.id === recommendedTierId) || MEMBERSHIP_TIERS[2];

  const adviceByTier: Record<MembershipTier['id'], string> = {
    'free-guest': `结合您在${cityClean}的职业轨迹，建议先注册成为自由访客会员，从一场 30 人规模的晚间主题酒会开始体验 BoL 的现场破冰氛围。`,
    'salon-pass': `您的职业背景非常适合在松弛的微醺夜话中拓展跨行业视角。建议配置「酒会优享次卡」，以更高性价比灵活参与${cityClean}近期 4 场精品酒会与沙龙。`,
    starlight: `您的行业积淀与国际化视野与 BoL 大湾区及上海的核心社群高度同频。「星光年度会籍」不仅能为您锁定全年活动会员价，更可通过主理人 6 次 1V1 定向引荐，快速对接跨城优质伙伴。`,
    celestial: `鉴于您在业务决策或资源配置上的深度需求，「星辰黑金会籍」最为匹配。除全年公开酒会畅行外，您可直接入席 12 人审核制长桌私宴，并由联合创始人团队跟进全年 12 次定向商业引荐与专场共创。`,
  };

  const sceneByTier: Record<MembershipTier['id'], string> = {
    'free-guest': `${cityClean}站 · 湾区海归跨界 Networking 爵士酒会`,
    'salon-pass': `${cityClean}站 · AI 硬件与品牌出海微醺夜话 / 先锋灵感沙龙`,
    starlight: `${cityClean}站 · AI 与品牌出海微醺夜话 + 维港日落帆船社交航行`,
    celestial: `${cityClean}站 · 12 人跨界主理人闭门长桌私宴 + 岁末黑金之夜`,
  };

  return {
    eligibilityScore,
    statusLabel,
    recommendedTierId,
    recommendedTierName: tierObj.name,
    personalizedAdvice: adviceByTier[recommendedTierId],
    curatedFirstScene: sceneByTier[recommendedTierId],
    valueHighlights: tierObj.privileges.slice(0, 3),
    evaluationSource: 'curated-engine',
  };
}

/**
 * Deterministic Finite State Machine (FSM) for BoL Club Application Progress Tracker.
 * Models the three core hospitality review stages:
 * 资料审核 (document_review) -> 背景调研 (background_check) -> 入会邀约 (invitation_issued)
 */
const FSM_TRANSITION_TABLE: Record<
  ApplicationStageId,
  Partial<Record<ApplicationEventTrigger, ApplicationStageId>>
> = {
  submitted: {
    ADVANCE_STAGE: 'document_review',
    SET_DOCUMENT_REVIEW: 'document_review',
    SET_BACKGROUND_CHECK: 'background_check',
    SET_INVITATION_ISSUED: 'invitation_issued',
    RESET_TRACKER: 'document_review',
  },
  document_review: {
    ADVANCE_STAGE: 'background_check',
    SET_DOCUMENT_REVIEW: 'document_review',
    SET_BACKGROUND_CHECK: 'background_check',
    SET_INVITATION_ISSUED: 'invitation_issued',
    RESET_TRACKER: 'document_review',
  },
  background_check: {
    ADVANCE_STAGE: 'invitation_issued',
    SET_DOCUMENT_REVIEW: 'document_review',
    SET_BACKGROUND_CHECK: 'background_check',
    SET_INVITATION_ISSUED: 'invitation_issued',
    RESET_TRACKER: 'document_review',
  },
  invitation_issued: {
    ADVANCE_STAGE: 'invitation_issued',
    SET_DOCUMENT_REVIEW: 'document_review',
    SET_BACKGROUND_CHECK: 'background_check',
    SET_INVITATION_ISSUED: 'invitation_issued',
    RESET_TRACKER: 'document_review',
  },
};

export function transitionApplicationStage(
  currentStage: ApplicationStageId,
  trigger: ApplicationEventTrigger
): ApplicationStageId {
  const nextStage = FSM_TRANSITION_TABLE[currentStage]?.[trigger];
  return nextStage || currentStage;
}

export function buildApplicationTrackerState(
  stage: ApplicationStageId
): ApplicationTrackerState {
  const normalizedStage: Exclude<ApplicationStageId, 'submitted'> =
    stage === 'submitted' ? 'document_review' : stage;

  const configMap: Record<
    Exclude<ApplicationStageId, 'submitted'>,
    {
      stageLabel: string;
      progressPercentage: number;
      activeStepIndex: number;
      canAdvance: boolean;
      nextTriggerLabel: string;
      conciergeNote: string;
      estimatedSla: string;
      metrics: [number, number, number]; // completionPct for [资料审核, 背景调研, 入会邀约]
    }
  > = {
    document_review: {
      stageLabel: '阶段 01 · 资料审核（Dossier Verification）',
      progressPercentage: 36,
      activeStepIndex: 0,
      canAdvance: true,
      nextTriggerLabel: '推进至「背景调研」阶段',
      conciergeNote:
        '主理人案头已接收您的申请档案，正在核验海外院校/职业履历完整性及意向活动席位余量。',
      estimatedSla: '预计 4 小时内完成初审建档',
      metrics: [100, 28, 0],
    },
    background_check: {
      stageLabel: '阶段 02 · 背景调研（Peer Resonance & Due Diligence）',
      progressPercentage: 72,
      activeStepIndex: 1,
      canAdvance: true,
      nextTriggerLabel: '推进至「入会邀约」阶段',
      conciergeNote:
        '初审已通过。联合创始人团队正在根据您的行业赛道与社交偏好，匹配当期同场嘉宾结构与 1V1 引荐名单。',
      estimatedSla: '预计 12 小时内完成同频嘉宾配比核验',
      metrics: [100, 100, 45],
    },
    invitation_issued: {
      stageLabel: '阶段 03 · 入会邀约（Private Invitation & Seat Locked）',
      progressPercentage: 100,
      activeStepIndex: 2,
      canAdvance: false,
      nextTriggerLabel: '已完成全部审核 · 邀约生效',
      conciergeNote:
        '恭喜入席！您的专属赴约编码与会籍通道已正式激活，主理人将通过微信定向发送私宴/酒会隐秘坐标。',
      estimatedSla: '审核已完结 · 席位凭证永久有效',
      metrics: [100, 100, 100],
    },
  };

  const currentConfig = configMap[normalizedStage];
  const [docPct, bgPct, invitePct] = currentConfig.metrics;

  const stageMetrics: ApplicationStageMetric[] = [
    {
      stageKey: 'document_review',
      stageName: '资料审核',
      enName: 'Dossier Review',
      completionPct: docPct,
      rigorIndex: 92,
      slaHours: 4,
      status:
        normalizedStage === 'document_review'
          ? 'active'
          : 'completed',
      statusLabel:
        normalizedStage === 'document_review' ? '审核进行中' : '核验已通过',
      auditDetail: '留学/海外背景核实 · 实名微信号与常驻城市校验',
    },
    {
      stageKey: 'background_check',
      stageName: '背景调研',
      enName: 'Background Check',
      completionPct: bgPct,
      rigorIndex: 98,
      slaHours: 12,
      status:
        normalizedStage === 'document_review'
          ? 'pending'
          : normalizedStage === 'background_check'
          ? 'active'
          : 'completed',
      statusLabel:
        normalizedStage === 'document_review'
          ? '待启动调研'
          : normalizedStage === 'background_check'
          ? '同频匹配中'
          : '调研已完结',
      auditDetail: '行业垂直度评估 · 当期桌友结构平衡度与破冰话题建模',
    },
    {
      stageKey: 'invitation_issued',
      stageName: '入会邀约',
      enName: 'Membership Invite',
      completionPct: invitePct,
      rigorIndex: 96,
      slaHours: 24,
      status:
        normalizedStage === 'invitation_issued' ? 'completed' : 'pending',
      statusLabel:
        normalizedStage === 'invitation_issued' ? '邀约已签发' : '待签发编码',
      auditDetail: '专属赴约编码激活 · 微信小程序「BoL Club」席位与会籍解锁',
    },
  ];

  return {
    currentStage: normalizedStage,
    stageLabel: currentConfig.stageLabel,
    progressPercentage: currentConfig.progressPercentage,
    activeStepIndex: currentConfig.activeStepIndex,
    canAdvance: currentConfig.canAdvance,
    nextTriggerLabel: currentConfig.nextTriggerLabel,
    conciergeNote: currentConfig.conciergeNote,
    estimatedSla: currentConfig.estimatedSla,
    stageMetrics,
  };
}

/**
 * Deterministic Finite State Machine for Event Invitation Alert Subscription ("关注邀约").
 * Transitions:
 * - idle --(TOGGLE_SUBSCRIBE)--> subscribed_alert
 * - subscribed_alert --(UPGRADE_PRIORITY_PUSH)--> priority_push_queued
 * - subscribed_alert --(TOGGLE_SUBSCRIBE | UNSUBSCRIBE)--> idle
 * - priority_push_queued --(TOGGLE_SUBSCRIBE | UNSUBSCRIBE)--> idle
 */
const EVENT_SUBSCRIPTION_FSM: Record<
  EventSubscriptionState,
  Record<EventSubscriptionTrigger, EventSubscriptionState>
> = {
  idle: {
    TOGGLE_SUBSCRIBE: 'subscribed_alert',
    UPGRADE_PRIORITY_PUSH: 'priority_push_queued',
    UNSUBSCRIBE: 'idle',
  },
  subscribed_alert: {
    TOGGLE_SUBSCRIBE: 'idle',
    UPGRADE_PRIORITY_PUSH: 'priority_push_queued',
    UNSUBSCRIBE: 'idle',
  },
  priority_push_queued: {
    TOGGLE_SUBSCRIBE: 'idle',
    UPGRADE_PRIORITY_PUSH: 'priority_push_queued',
    UNSUBSCRIBE: 'idle',
  },
};

export function transitionEventSubscription(
  currentState: EventSubscriptionState = 'idle',
  trigger: EventSubscriptionTrigger
): EventSubscriptionState {
  return EVENT_SUBSCRIPTION_FSM[currentState]?.[trigger] ?? 'idle';
}

export function buildSubscriptionPreferenceSummary(
  subscriptionMap: Record<string, EventSubscriptionState>,
  events: BolEvent[] = CURATED_EVENTS
): SubscriptionPreferenceSummary {
  const activeEvents = events.filter((ev) => {
    const st = subscriptionMap[ev.id];
    return st === 'subscribed_alert' || st === 'priority_push_queued';
  });

  const priorityCount = activeEvents.filter(
    (ev) => subscriptionMap[ev.id] === 'priority_push_queued'
  ).length;

  const preferredCities = Array.from(new Set(activeEvents.map((ev) => ev.city)));
  const preferredSeriesLabels = Array.from(
    new Set(activeEvents.map((ev) => ev.seriesLabel))
  );

  if (activeEvents.length === 0) {
    return {
      totalSubscribed: 0,
      priorityCount: 0,
      subscribedEventIds: [],
      subscribedTitles: [],
      preferredCities: [],
      preferredSeriesLabels: [],
      fsmStateLabel: 'IDLE · 尚未订阅场次邀约',
      pushTargetingCopy:
        '点击任意活动卡片上的「关注邀约」，系统状态机将自动记录您的城市与主题偏好，并在席位释放或同类新场次开启时定向推送。',
    };
  }

  const fsmStateLabel =
    priorityCount > 0
      ? `PRIORITY PUSH · 已启用高优定向推送（${activeEvents.length} 场关注 / ${priorityCount} 场高优候补）`
      : `SUBSCRIBED ALERT · 已记录邀约提醒偏好（${activeEvents.length} 场）`;

  const cityText = preferredCities.join(' / ');
  const seriesText = preferredSeriesLabels.join(' · ');

  return {
    totalSubscribed: activeEvents.length,
    priorityCount,
    subscribedEventIds: activeEvents.map((ev) => ev.id),
    subscribedTitles: activeEvents.map((ev) => ev.title),
    preferredCities,
    preferredSeriesLabels,
    fsmStateLabel,
    pushTargetingCopy: `状态机已锁定您的偏好画像：【${cityText}】×【${seriesText}】。当对应场次释放余席或下期同系列私宴/酒会定档时，将通过「BoL万象博联」小程序为您优先推送入会邀约。`,
  };
}

/**
 * Generates an AI-driven Connection Interest Cluster Matrix ("连接兴趣聚类")
 * and SVG Bezier connection paths based on the user's career data, industry, rhythm, and city.
 */
export function buildAiInterestClusterMatrix(input: {
  careerData: string;
  industry: IndustryDomainId;
  rhythm: SocialRhythmId;
  city: Exclude<CityName, '全部城市'>;
}): AiInterestClusterMatrix {
  const cleanCareer = (input.careerData || '').trim();
  const text = cleanCareer.toLowerCase();
  const city = input.city || '深圳';

  const hasAiOrHardware = /ai|硬件|算法|机器人|大模型|硅谷|芯片|穿戴/.test(text);
  const hasCapitalOrFamily = /投资|基金|并购|家办|家族|vc|pe|一级市场|资产|接班/.test(text);
  const hasDesignOrSpace = /建筑|设计|空间|策展|艺术|香氛|买手|美学/.test(text);
  const hasBioOrHealth = /生物|医疗|抗衰|临床|健康|生命科学|器械/.test(text);
  const hasGlobalOrDtc = /独立站|dtc|北美|欧洲|东南亚|商超|亚马逊|tiktok/.test(text);

  let effectiveDomain: IndustryDomainId = input.industry;
  if (hasCapitalOrFamily) {
    effectiveDomain = 'investment-family';
  } else if (hasDesignOrSpace) {
    effectiveDomain = 'creative-arch';
  } else if (hasBioOrHealth) {
    effectiveDomain = 'biotech-health';
  } else if (hasAiOrHardware) {
    effectiveDomain = 'ai-tech';
  } else if (hasGlobalOrDtc) {
    effectiveDomain = 'cross-border';
  }

  const rhythmSceneMap: Record<SocialRhythmId, string> = {
    'tipsy-salon': `${city} · 微醺威士忌夜话（28 人控场）`,
    'closed-banquet': `${city} · 12 人审核制跨界长桌私宴`,
    'coastal-sport': `${city === '香港' ? '维港' : city} · 日落帆船与海岸社交航行`,
    'frontier-forum': `${city} · 一线操盘手闭门复盘沙龙`,
  };

  const clusterPresets: Record<
    IndustryDomainId,
    {
      themeTitle: string;
      baseResonance: number;
      items: Array<{
        code: string;
        clusterName: string;
        enTag: string;
        affinityPct: number;
        peerPersona: string;
        catalystTopic: string;
        bridgeTopic: string;
      }>;
    }
  > = {
    'ai-tech': {
      themeTitle: `${city}站 · 智能硬件出海 × 具身算法 × 早期美元资本同频簇`,
      baseResonance: 97,
      items: [
        {
          code: 'CLUSTER 01',
          clusterName: '多模态硬件与产品工程簇',
          enTag: 'AI Hardware & Edge',
          affinityPct: 98,
          peerPersona: '硅谷/名校海归硬件创始人 · 声学与穿戴产品负责人',
          catalystTopic: '端侧大模型交互落地与珠三角敏捷打样供应链',
          bridgeTopic: '软硬一体产品定义 × 供应链快速迭代',
        },
        {
          code: 'CLUSTER 02',
          clusterName: '欧美线下商超与众筹增长簇',
          enTag: 'Global Retail & Crowdfunding',
          affinityPct: 95,
          peerPersona: '千万美金众筹操盘手 · BestBuy/Target 北美渠道合伙人',
          catalystTopic: 'Kickstarter 破圈冷启动与北美本土线下货架入驻',
          bridgeTopic: '高客单价科技单品 × 海外本土化叙事',
        },
        {
          code: 'CLUSTER 03',
          clusterName: '早期硬科技美元与双币基金簇',
          enTag: 'Early-Stage DeepTech VC',
          affinityPct: 93,
          peerPersona: '深港早期科技美元基金 VP · 产业战投负责人',
          catalystTopic: 'AI 硬件商业化毛利模型与跨国双总部架构搭建',
          bridgeTopic: '技术壁垒验证 × Pre-A / A 轮跨境资本协同',
        },
        {
          code: 'CLUSTER 04',
          clusterName: '工业设计与空间交互美学簇',
          enTag: 'Industrial Design & Craft',
          affinityPct: 90,
          peerPersona: '红点/iF 获奖独立工业设计师 · 先锋买手空间主理人',
          catalystTopic: '去数码味的家居化硬件美学与高溢价包装体验',
          bridgeTopic: '工程精度 × 东方当代审美表达',
        },
      ],
    },
    'cross-border': {
      themeTitle: `${city}站 · 全球化 DTC 品牌 × 柔性智造供应链 × 海外内容增长簇`,
      baseResonance: 96,
      items: [
        {
          code: 'CLUSTER 01',
          clusterName: '欧美独立站与本土化品牌簇',
          enTag: 'Global DTC Brand Leaders',
          affinityPct: 97,
          peerPersona: '年营收过亿独立站创始人 · 欧美本土视觉创意总监',
          catalystTopic: '告别低价内卷后的品牌溢价构建与海外社区运营',
          bridgeTopic: '品牌资产沉淀 × 跨文化用户心智共鸣',
        },
        {
          code: 'CLUSTER 02',
          clusterName: '大湾区精密智造与二代转型簇',
          enTag: 'GBA Precision Manufacturing',
          affinityPct: 95,
          peerPersona: '珠三角隐形冠军制造企业接班人 · 柔性供应链合伙人',
          catalystTopic: 'OEM/ODM 核心产能向出海自有品牌联合孵化升级',
          bridgeTopic: '柔性产能壁垒 × 联合出品分润机制',
        },
        {
          code: 'CLUSTER 03',
          clusterName: 'AI 内容工作流与红人矩阵簇',
          enTag: 'AI Growth & Creator Network',
          affinityPct: 93,
          peerPersona: 'TikTok 美区头部 MCN 合伙人 · AIGC 营销工具主理人',
          catalystTopic: '生成式视频流与北美本土 KOC 联盟的高转化打法',
          bridgeTopic: '算法化内容投放 × 本土真实口碑裂变',
        },
        {
          code: 'CLUSTER 04',
          clusterName: '跨境税务合规与并购财务簇',
          enTag: 'Cross-Border Structuring',
          affinityPct: 91,
          peerPersona: '香港执业跨境并购律师 · 离岸架构与家办税务顾问',
          catalystTopic: '出海品牌红筹/ODI 合规路径与海外渠道并购避坑',
          bridgeTopic: '全球化资金流合规 × 跨境并购安全边界',
        },
      ],
    },
    'investment-family': {
      themeTitle: `${city}站 · 双币家族办公室 × 实业并购接班 × 深港跨境资产同频簇`,
      baseResonance: 96,
      items: [
        {
          code: 'CLUSTER 01',
          clusterName: '单一与联合家族办公室配置簇',
          enTag: 'Family Office & Allocation',
          affinityPct: 97,
          peerPersona: '香港/新加坡单一家办合伙人 · 跨境资产配置总监',
          catalystTopic: '降息周期下的全球另类资产配置与硬科技直投协同',
          bridgeTopic: '长周期耐心资本 × 稀缺标的联合尽调',
        },
        {
          code: 'CLUSTER 02',
          clusterName: '实业家族接班与新增长并购簇',
          enTag: 'Next-Gen Industrial Leaders',
          affinityPct: 95,
          peerPersona: '大湾区与长三角制造业家族二代 · 产投基金主理人',
          catalystTopic: '传统实业现金流与海外成长期品牌/技术的控股型并购',
          bridgeTopic: '产业上下游整合 × 二代经营视野破圈',
        },
        {
          code: 'CLUSTER 03',
          clusterName: '深港帆船与耐力运动生活簇',
          enTag: 'Yachting & Endurance Sports',
          affinityPct: 92,
          peerPersona: '维港帆船赛船东 · 铁人三项与高尔夫私享俱乐部成员',
          catalystTopic: '脱离会议室语境的海上航行协作与身心长期主义',
          bridgeTopic: '高信任度户外同行 × 低防备感深度友谊',
        },
        {
          code: 'CLUSTER 04',
          clusterName: '非标商业地产与艺术收藏簇',
          enTag: 'Bespoke Space & Art Patron',
          affinityPct: 90,
          peerPersona: '城市更新非标商业主理人 · 当代青年艺术藏家',
          catalystTopic: '存量物业的审美活化、主理人业态引入与长线现金流',
          bridgeTopic: '空间资产审美溢价 × 线下高净值客群互通',
        },
      ],
    },
    'creative-arch': {
      themeTitle: `${city}站 · 先锋空间建筑 × 东方买手零售 × 跨学科感官叙事簇`,
      baseResonance: 95,
      items: [
        {
          code: 'CLUSTER 01',
          clusterName: '独立建筑与威士忌隐室设计簇',
          enTag: 'Architecture & Spatial Mood',
          affinityPct: 97,
          peerPersona: 'AA/GSD 海归主持建筑师 · 暗调餐饮与酒廊空间导演',
          catalystTopic: '历史街区旧改与极具戏剧张力的社交光影场域营造',
          bridgeTopic: '空间叙事张力 × 沉浸式线下体验赋能',
        },
        {
          code: 'CLUSTER 02',
          clusterName: '东方香氛、器物与买手品牌簇',
          enTag: 'Olfactory & Craft Brands',
          affinityPct: 94,
          peerPersona: '独立沙龙香氛创始人 · 巴黎/东京展买手店策展人',
          catalystTopic: '东方在地手工艺的当代转译与海外买手渠道入驻',
          bridgeTopic: '五感审美产品力 × 全球精品零售网络',
        },
        {
          code: 'CLUSTER 03',
          clusterName: '科技艺术交互与跨界联名簇',
          enTag: 'Interactive Art & Co-Branding',
          affinityPct: 92,
          peerPersona: '新媒体装置艺术家 · 消费电子品牌美学顾问',
          catalystTopic: '冷峻智能硬件与温润自然材质的跨界联名快闪',
          bridgeTopic: '艺术稀缺性 × 商业品牌破圈溢价',
        },
        {
          code: 'CLUSTER 04',
          clusterName: '黑胶爵士、侍酒与深夜食堂簇',
          enTag: 'Vinyl Jazz & Sommelier Table',
          affinityPct: 90,
          peerPersona: '独立自然酒馆主理人 · 黑胶厂牌策展人与私厨主理',
          catalystTopic: '20 人以内的城市深夜精神角落与高粘性审美社群',
          bridgeTopic: '味觉与听觉策展 × 长期主理人内容共创',
        },
      ],
    },
    'biotech-health': {
      themeTitle: `${city}站 · 生命科学转化 × 智能穿戴健康 × 海岸耐力运动同频簇`,
      baseResonance: 95,
      items: [
        {
          code: 'CLUSTER 01',
          clusterName: '数字健康与智能监测设备簇',
          enTag: 'Digital Health & Wearables',
          affinityPct: 97,
          peerPersona: '欧美名校生物医学工程海归 · 睡眠与运动监测硬件创始人',
          catalystTopic: '医疗级生物传感算法在消费级穿戴设备中的出海合规',
          bridgeTopic: '临床级数据洞察 × 全球高客单健康消费',
        },
        {
          code: 'CLUSTER 02',
          clusterName: '深港精准医疗与抗衰诊所簇',
          enTag: 'Longevity & Private Clinic',
          affinityPct: 94,
          peerPersona: '香港专科医疗集团合伙人 · 细胞抗衰与预防医学主理人',
          catalystTopic: '深港双城高净值人群健康管理闭环与跨境医疗服务',
          bridgeTopic: '前沿生命科学转化 × 高信任度私域服务',
        },
        {
          code: 'CLUSTER 03',
          clusterName: '功能性营养与运动消费品牌簇',
          enTag: 'Functional Nutrition & Recovery',
          affinityPct: 92,
          peerPersona: '新一代运动补剂品牌创始人 · 严肃跑者与骑行社群主理',
          catalystTopic: '清洁标签配方研发与高复购户外运动社群运营',
          bridgeTopic: '科学实证配方 × 运动生活方式场景渗透',
        },
        {
          code: 'CLUSTER 04',
          clusterName: '生命科学早期基金与专利转化簇',
          enTag: 'BioVenture & Tech Transfer',
          affinityPct: 90,
          peerPersona: '生物医药双币基金投资总监 · 高校实验室成果转化顾问',
          catalystTopic: '高校前沿科研专利的商业化分拆与深港生物科技政策协同',
          bridgeTopic: '科研学术深度 × 商业化里程碑融资',
        },
      ],
    },
  };

  const preset = clusterPresets[effectiveDomain];

  // Coordinates in 640x240 SVG topology space (Center hub at x: 320, y: 120)
  const nodeCoords: Array<{ x: number; y: number; path: string }> = [
    { x: 108, y: 52, path: 'M 320 120 C 245 120, 185 52, 108 52' },
    { x: 532, y: 52, path: 'M 320 120 C 395 120, 455 52, 532 52' },
    { x: 108, y: 188, path: 'M 320 120 C 245 120, 185 188, 108 188' },
    { x: 532, y: 188, path: 'M 320 120 C 395 120, 455 188, 532 188' },
  ];

  const clusters = preset.items.map((item, idx) => ({
    id: `cluster-${effectiveDomain}-0${idx + 1}`,
    code: item.code,
    clusterName: item.clusterName,
    enTag: item.enTag,
    affinityPct: item.affinityPct,
    peerPersona: item.peerPersona,
    catalystTopic: item.catalystTopic,
    recommendedScene: rhythmSceneMap[input.rhythm],
    nodeX: nodeCoords[idx].x,
    nodeY: nodeCoords[idx].y,
  })) as [
    InterestClusterItem,
    InterestClusterItem,
    InterestClusterItem,
    InterestClusterItem,
  ];

  const connectionPaths = preset.items.map((item, idx) => ({
    id: `path-${effectiveDomain}-0${idx + 1}`,
    targetClusterId: `cluster-${effectiveDomain}-0${idx + 1}`,
    fromLabel: `${city} · 您的职业坐标`,
    toLabel: item.clusterName,
    bridgeTopic: item.bridgeTopic,
    synergyStrength: item.affinityPct,
    svgPath: nodeCoords[idx].path,
    startX: 320,
    startY: 120,
    endX: nodeCoords[idx].x,
    endY: nodeCoords[idx].y,
  })) as [
    InterestConnectionPath,
    InterestConnectionPath,
    InterestConnectionPath,
    InterestConnectionPath,
  ];

  const careerInputSummary =
    cleanCareer.length > 0
      ? cleanCareer
      : `${city} · ${preset.themeTitle.split('·')[1]?.trim() || '跨行业海归与创业主理人'}`;

  return {
    clusterThemeTitle: preset.themeTitle,
    careerInputSummary,
    overallResonance: preset.baseResonance,
    clusters,
    connectionPaths,
    evaluationSource: 'curated-engine',
  };
}

/**
 * Generates the AI Connection Potential Radar Chart ("连接潜能雷达图")
 * and 3-Stage Potential Social Paths based on user's selected interest domain, social rhythm, and city.
 */
export function buildConnectionPotentialRadar(input: {
  industry: IndustryDomainId;
  rhythm: SocialRhythmId;
  city: Exclude<CityName, '全部城市'>;
  careerData?: string;
}): AiConnectionPotentialAnalysis {
  const { industry, rhythm, city } = input;

  const domainRadarScores: Record<
    IndustryDomainId,
    [number, number, number, number, number, number]
  > = {
    'ai-tech': [97, 94, 96, 91, 95, 96],
    'cross-border': [95, 96, 98, 92, 96, 95],
    'investment-family': [94, 97, 95, 98, 97, 98],
    'creative-arch': [96, 92, 93, 96, 94, 93],
    'biotech-health': [95, 93, 94, 93, 96, 94],
  };

  const rhythmAdjustments: Record<
    SocialRhythmId,
    [number, number, number, number, number, number]
  > = {
    'tipsy-salon': [1, 2, 1, 2, 0, 1],
    'closed-banquet': [2, 1, 2, 3, 2, 2],
    'coastal-sport': [0, 3, 1, 2, 2, 1],
    'frontier-forum': [3, 1, 2, 0, 2, 1],
  };

  const base = domainRadarScores[industry];
  const adj = rhythmAdjustments[rhythm];
  const dimensionNames = [
    '行业智识共鸣',
    '跨城圈层渗透',
    '资源互补密度',
    '私宴破冰契合',
    '长期共创潜能',
    '主理人引荐指数',
  ];
  const benchmarks = [82, 79, 81, 80, 78, 83];

  const radarData: ConnectionRadarDimension[] = dimensionNames.map((dim, idx) => ({
    dimension: dim,
    userScore: Math.min(99, base[idx] + adj[idx]),
    clubBenchmark: benchmarks[idx],
    fullMark: 100,
  }));

  const compositeScore = Math.round(
    radarData.reduce((acc, item) => acc + item.userScore, 0) / radarData.length
  );

  const domainConfig: Record<
    IndustryDomainId,
    {
      title: string;
      fitLabel: string;
      summary: string;
      paths: [PotentialSocialPath, PotentialSocialPath, PotentialSocialPath];
    }
  > = {
    'ai-tech': {
      title: `${city}站 · AI 与硬科技圈层连接潜能看板`,
      fitLabel: '高密度智识共鸣 · 软硬协同核心圈',
      summary: `AI 分析显示您与${city}及深港双城的「多模态硬件 × 具身算法 × 早期美元基金」圈层契合度达 ${compositeScore}%，在资源互补密度与行业智识共鸣维度显著高于俱乐部均值。`,
      paths: [
        {
          stepCode: 'PATH 01 · 破冰入席',
          stageTitle: '28 人微醺夜话 · 技术与产品同频破冰',
          targetCircle: '硅谷/名校理工海归 · 深圳南山智能硬件主理人',
          actionCatalyst: '通过现场「连接线索卡」锁定 3–4 位正在攻关相似海外众筹与硬件打样的同行',
          conversionPct: 96,
        },
        {
          stepCode: 'PATH 02 · 定向引荐',
          stageTitle: '主理人 1V1 撮合 · 跨境渠道与供应链互访',
          targetCircle: '北美线下商超渠道合伙人 · 珠三角精密声学/光学制造二代',
          actionCatalyst: '会后 14 天内由主理人安排小范围实地参访与产品原型内测交流',
          conversionPct: 93,
        },
        {
          stepCode: 'PATH 03 · 长期共创',
          stageTitle: '12 人闭门长桌私宴 · 资本与战略联名沉淀',
          targetCircle: '深港早期硬科技美元基金 VP · 跨界工业设计主理人',
          actionCatalyst: '在季度黑金私宴中完成 Pre-A/A 轮资本对接或海外旗舰快闪联合出品',
          conversionPct: 91,
        },
      ],
    },
    'cross-border': {
      title: `${city}站 · 跨境出海与全球增长圈层潜能看板`,
      fitLabel: '强渠道互补 · 品牌与供应链双向赋能',
      summary: `您的职业方向在「资源互补密度（${radarData[2].userScore}%）」与「跨城圈层渗透（${radarData[1].userScore}%）」表现突出，极易在大湾区制造产能与欧美本土化营销之间形成闭环合作。`,
      paths: [
        {
          stepCode: 'PATH 01 · 破冰入席',
          stageTitle: '出海实战复盘夜话 · 渠道痛点直连',
          targetCircle: '年营收过亿 DTC 独立站创始人 · TikTok 美区增长负责人',
          actionCatalyst: '围绕北美/东南亚本土合规与获客成本，直接交换一线真实投放数据与避坑经验',
          conversionPct: 97,
        },
        {
          stepCode: 'PATH 02 · 定向引荐',
          stageTitle: '大湾区柔性产能 × 海外品牌联合孵化',
          targetCircle: '珠三角隐形冠军工厂接班人 · 跨境物流与离岸税务专家',
          actionCatalyst: '主理人定向匹配具备海外审美溢价能力的设计团队与高配合度产线',
          conversionPct: 94,
        },
        {
          stepCode: 'PATH 03 · 长期共创',
          stageTitle: '深港双城跨界私宴 · 海外线下分销联盟',
          targetCircle: '欧美商超买手代表 · 跨境并购基金合伙人',
          actionCatalyst: '共同发起海外线下 Pop-up 集合空间或达成区域分销战略协同',
          conversionPct: 92,
        },
      ],
    },
    'investment-family': {
      title: `${city}站 · 一级市场投资与家族实业圈层潜能看板`,
      fitLabel: '高信任私密边界 · 耐心资本与实业并购',
      summary: `在「私宴破冰契合（${radarData[3].userScore}%）」与「主理人引荐指数（${radarData[5].userScore}%）」两个维度达到顶格水平，最适合通过低防备感的私密长桌与帆船场景建立长期信任。`,
      paths: [
        {
          stepCode: 'PATH 01 · 破冰入席',
          stageTitle: '12 人审核制长桌私宴 / 维港日落帆船',
          targetCircle: '香港单一家办合伙人 · 珠三角实业家族二代接班人',
          actionCatalyst: '在无推销打扰的五道式晚宴或甲板航行中，自然探讨代际传承与全球资产配置',
          conversionPct: 97,
        },
        {
          stepCode: 'PATH 02 · 定向引荐',
          stageTitle: '联合创始人 1V1 闭门引荐 · 标的共研',
          targetCircle: '双币 VC/PE 董事总经理 · 跨境控股型并购法律顾问',
          actionCatalyst: '针对成长期硬科技与出海消费标的，组建 4–6 人小范围联合尽调交流组',
          conversionPct: 95,
        },
        {
          stepCode: 'PATH 03 · 长期共创',
          stageTitle: '岁末黑金之夜 · 产业并购与家族长期同盟',
          targetCircle: '大湾区与上海核心产业资本代表 · 非标商业主理人',
          actionCatalyst: '促成传统制造现金流与新锐出海技术团队的战略参股或合资共创',
          conversionPct: 93,
        },
      ],
    },
    'creative-arch': {
      title: `${city}站 · 建筑空间与先锋生活美学圈层潜能看板`,
      fitLabel: '高审美同频 · 空间叙事与品牌联名',
      summary: `您的兴趣向量在「行业智识共鸣」与「私宴破冰契合」上优势明显，能够快速与独立建筑师、买手店策展人及高溢价消费品牌创始人产生深度审美共振。`,
      paths: [
        {
          stepCode: 'PATH 01 · 破冰入席',
          stageTitle: '建筑剧场 / 威士忌暗调空间灵感夜',
          targetCircle: 'AA/GSD 海归建筑师 · 独立香氛与东方器物品牌创始人',
          actionCatalyst: '围绕城市更新、五感策展与去数码味的硬件包装美学展开跨学科漫谈',
          conversionPct: 96,
        },
        {
          stepCode: 'PATH 02 · 定向引荐',
          stageTitle: '主理人跨界撮合 · 空间与科技消费品联名',
          targetCircle: '高客单智能硬件创始人 · 商业地产非标策展总监',
          actionCatalyst: '将空间视觉语言注入新消费与出海科技产品，打造具备传播力的线下快闪场域',
          conversionPct: 93,
        },
        {
          stepCode: 'PATH 03 · 长期共创',
          stageTitle: '跨城生活美学联盟 · 联合出品人计划',
          targetCircle: '深/穗/港/沪四城买手空间主理人 · 艺术藏家',
          actionCatalyst: '受邀担任 BoL 季度主题沙龙联合出品人，共享跨城高净值审美人群网络',
          conversionPct: 91,
        },
      ],
    },
    'biotech-health': {
      title: `${city}站 · 生命科学转化与耐力运动圈层潜能看板`,
      fitLabel: '科学实证共鸣 · 身心长期主义共同体',
      summary: `您在「长期共创潜能（${radarData[4].userScore}%）」与「资源互补密度」维度得分优异，适合在海岸运动与闭门沙龙中连接生命科学学者、医疗器械创业者与双币投资人。`,
      paths: [
        {
          stepCode: 'PATH 01 · 破冰入席',
          stageTitle: '海岸帆船航行 / 耐力运动与科学夜话',
          targetCircle: '欧美名校生物医学海归 · 智能穿戴与恢复算法创始人',
          actionCatalyst: '在共同完成海上航行或运动恢复工作坊后，深入探讨数字健康产品出海合规',
          conversionPct: 95,
        },
        {
          stepCode: 'PATH 02 · 定向引荐',
          stageTitle: '深港跨境医疗与硬件供应链精准对接',
          targetCircle: '香港专科与抗衰诊所合伙人 · 医疗级传感器供应链负责人',
          actionCatalyst: '主理人协助对接深港两地临床验证资源与高粘性健康消费社群',
          conversionPct: 92,
        },
        {
          stepCode: 'PATH 03 · 长期共创',
          stageTitle: '生命科学早期资本与户外俱乐部共创',
          targetCircle: '生物医药双币基金合伙人 · 维港帆船赛船队核心成员',
          actionCatalyst: '沉淀为兼具科研转化支持与跨城户外运动的长期同行伙伴',
          conversionPct: 90,
        },
      ],
    },
  };

  const selectedConfig = domainConfig[industry];

  return {
    boardTitle: selectedConfig.title,
    compositeScore,
    circleFitLabel: selectedConfig.fitLabel,
    aiSummary: selectedConfig.summary,
    radarData,
    potentialPaths: selectedConfig.paths,
  };
}

export const TIER_ORDER: Array<MembershipTier['id']> = [
  'free-guest',
  'salon-pass',
  'starlight',
  'celestial',
];

export const MEMBERSHIP_PRIVILEGE_COMPARISON_MATRIX: MembershipPrivilegeItem[] = [
  {
    id: 'priv-salon-access',
    code: 'PRIV 01',
    title: '城市社交酒会与主题沙龙通行',
    category: '场域入席与票务权益',
    shortDesc: '覆盖 Networking 爵士酒会、AI 出海夜话与先锋生活沙龙的席位锁定与票价优享',
    tierCells: {
      'free-guest': {
        summary: '单场原价报名（需逐场审核）',
        badgeLabel: '标准报名',
        highlightLevel: 'basic',
      },
      'salon-pass': {
        summary: '任选 4 场通兑（单场折算 ¥170，可携友 1 人）',
        badgeLabel: '4 场通兑',
        highlightLevel: 'included',
      },
      starlight: {
        summary: '全年会员优享价（约 6.5–7.5 折）+ 赠 2 张免单券',
        badgeLabel: '全年优享 + 2 免单',
        highlightLevel: 'priority',
      },
      celestial: {
        summary: '全系酒会/沙龙无限次优先入席 + 专属亲友免单礼遇',
        badgeLabel: '全系优先畅行',
        highlightLevel: 'exclusive',
      },
    },
    deepServiceDetail: {
      serviceHeadline: '全城精品酒会与主题沙龙 · 席位配比与破冰动线保障',
      executionProtocol:
        '每场酒会严控 24–45 人密度，入场前 24 小时由主理人向会员定向发送《当期同场嘉宾行业分布与共鸣线索简报》，现场配备定制破冰线索卡与侍酒师导览，杜绝盲目搭讪与硬性推销。',
      conciergeSla: '热门场次提前 72 小时向次卡及年度会籍开放锁席通道；开场前 48 小时支持无损改期。',
      realWorldScenario:
        '在深圳南山隐室威士忌廊的「AI 硬件与品牌出海夜话」中，主理人根据您的行业标签提前为您预留圆桌邻座，入座 15 分钟内即可进入高质量专业探讨。',
      tierSpecificNotes: {
        'free-guest':
          '自由访客可通过小程序查阅公开活动日历并按单场原价提交报名，每场均需经过基础背景核验后发放定位。',
        'salon-pass':
          '酒会优享次卡含 4 次标准酒会/沙龙核销权益（有效期 180 天），支持单场核销 2 次携带一位同频好友共同入席。',
        starlight:
          '星光年度会籍全年享受所有酒会与沙龙会员专享价，并直接获赠 2 张价值 ¥298 的社交酒会免单券，热门场次享候补第一顺位。',
        celestial:
          '星辰黑金会籍享有全年所有城市酒会与主题沙龙最高优先级席位预留，每季度额外获赠携友同行贵宾礼遇。',
      },
    },
  },
  {
    id: 'priv-closed-banquet',
    code: 'PRIV 02',
    title: '12 人审核制闭门长桌私宴席位',
    category: '高私密深度场域',
    shortDesc: '严控 12 席的五道式定制晚宴与私厨包厢，聚焦跨界决策者深度长谈',
    tierCells: {
      'free-guest': {
        summary: '仅限特邀或候补申请（通过率约 15%）',
        badgeLabel: '候补申请',
        highlightLevel: 'basic',
      },
      'salon-pass': {
        summary: '支持补差价升级预约闭门私宴席位',
        badgeLabel: '差价升级',
        highlightLevel: 'included',
      },
      starlight: {
        summary: '优先审核通道 + 提前 48h 锁定每季私宴余席',
        badgeLabel: '优先锁席',
        highlightLevel: 'priority',
      },
      celestial: {
        summary: '全年含 2 场闭门私宴免单席位 + 定制桌友配比',
        badgeLabel: '含 2 席免单私宴',
        highlightLevel: 'exclusive',
      },
    },
    deepServiceDetail: {
      serviceHeadline: '12 人定制长桌私宴 · 严选同桌结构与五道式侍酒叙事',
      executionProtocol:
        '私宴选址于珠江新城、南山华侨城、中环及静安的私密艺术私厨包厢。主理人团队在晚宴前对 12 位入席嘉宾进行一对一背景交叉校验，确保同桌无直接恶性竞争，且具备极强的跨行业互补性。',
      conciergeSla: '审核通过后单独发送加密门牌与泊车指引；现场禁止未经授权的商业拍摄与录音。',
      realWorldScenario:
        '广州珠江秋夜私宴中，主理人在第三道热菜呈上时引导「实业产能与海外独立站品牌联名」命题，单场促成 3 组跨界供应链实地互访。',
      tierSpecificNotes: {
        'free-guest':
          '访客会员需提交完整职业履历与近期关注议题，当期桌友结构空缺匹配时方可获得入席邀约。',
        'salon-pass':
          '次卡持有人可使用 1 次卡内权益叠加会员差价申请入席，享优先于普通访客的背景核验通道。',
        starlight:
          '星光会员每月可提前 48 小时收到私宴拟邀嘉宾画像简报，并享受会员专属席位价与快速通道核验。',
        celestial:
          '星辰黑金会员全年直接包含 2 场高定闭门私宴免单席位（或维港帆船航行），并可向主理人提出希望同桌交流的特定行业方向。',
      },
    },
  },
  {
    id: 'priv-concierge-intro',
    code: 'PRIV 03',
    title: '联合创始人与主理人 1V1 跨界引荐',
    category: '定向人脉撮合服务',
    shortDesc: '脱离活动现场的日常精准建联，由主理人背书完成高信任度双向破冰',
    tierCells: {
      'free-guest': {
        summary: '仅限活动现场破冰卡自主交流',
        badgeLabel: '现场交流',
        highlightLevel: 'basic',
      },
      'salon-pass': {
        summary: '每场活动现场主理人定向口头引荐 1–2 位同频桌友',
        badgeLabel: '现场口头引荐',
        highlightLevel: 'included',
      },
      starlight: {
        summary: '全年 3 次主理人 1V1 线上/线下精准需求撮合',
        badgeLabel: '全年 3 次定向引荐',
        highlightLevel: 'priority',
      },
      celestial: {
        summary: '联合创始人全年无限次深度引荐 + 专属私董顾问群',
        badgeLabel: '创始人深度撮合',
        highlightLevel: 'exclusive',
      },
    },
    deepServiceDetail: {
      serviceHeadline: '主理人双盲许可制 1V1 引荐 · 让关键人脉连接更有分寸感',
      executionProtocol:
        '遵循严格的「双盲需求确认机制（Double Opt-in）」：当您提出希望结识北美渠道商、家族办公室或特定技术合伙人时，主理人先在内部会员库中筛选匹配对象，双向沟通确认意愿后再建立三方专属微信群并附详尽背景背书。',
      conciergeSla: '收到引荐诉求后 24 小时内反馈匹配人选画像，72 小时内完成双向意愿确认与拉群破冰。',
      realWorldScenario:
        '深圳 AI 穿戴硬件创始人通过星辰会籍引荐通道，在 5 天内精准对接到香港单一家办消费科技负责人与北美商超买手合伙人。',
      tierSpecificNotes: {
        'free-guest':
          '在已成功入席的线下活动中，可通过现场「连接线索卡」由当场主理人协助引导共同话题。',
        'salon-pass':
          '每次核销次卡出席活动前，可在报名备注中填写 1 个期望认识的行业角色，现场主理人将为您重点留心介绍。',
        starlight:
          '享有全年 3 次正式的跨城市、跨行业 1V1 主理人定向引荐额度，即使当月未出席活动亦可随时发起需求。',
        celestial:
          '由 BoL 联合创始人团队亲自担任您的私人连接顾问，提供全年不限次高优人脉撮合、投融资标的对接与供应链互访安排。',
      },
    },
  },
  {
    id: 'priv-cross-city-network',
    code: 'PRIV 04',
    title: '大湾区（深/穗/港）与上海跨城互通',
    category: '跨地域圈层漫游',
    shortDesc: '一卡打通深圳、广州、香港与上海四城核心场域，差旅途中无缝接入在地圈层',
    tierCells: {
      'free-guest': {
        summary: '支持跨城报名，需按异地场次重新提交初审',
        badgeLabel: '单城独立审核',
        highlightLevel: 'basic',
      },
      'salon-pass': {
        summary: '深/穗/港/沪四城通用核销，免异地重复初审',
        badgeLabel: '四城通用核销',
        highlightLevel: 'included',
      },
      starlight: {
        summary: '四城身份免审互通 + 差旅落地在地主理人接待指引',
        badgeLabel: '四城免审漫游',
        highlightLevel: 'priority',
      },
      celestial: {
        summary: '四城黑金特权互通 + 临时差旅专属小局定制发起权',
        badgeLabel: '差旅专属组局',
        highlightLevel: 'exclusive',
      },
    },
    deepServiceDetail: {
      serviceHeadline: '深 / 穗 / 港 / 沪四城无缝漫游 · 让每一次跨城差旅都有同频东道主',
      executionProtocol:
        'BoL 的会员档案在粤港澳大湾区（深圳、广州、香港）与上海四城完全打通。当您前往另一座城市出差或看展时，无需重新经历陌生审核，即可一键接入当地当周的微醺酒会、帆船航行或私厨晚宴。',
      conciergeSla: '提前 48 小时告知差旅行程，当地城市主理人即为您推送当周在地活动与可约见的同频会员名单。',
      realWorldScenario:
        '常驻上海的独立建筑师前往深圳与香港考察项目期间，通过跨城漫游权益连续参与南山威士忌夜话与维港日落帆船，迅速建立大湾区业主网络。',
      tierSpecificNotes: {
        'free-guest':
          '可在小程序任意切换四城活动日历并提交单场申请，历史良好出席记录将加速异地审核。',
        'salon-pass':
          '卡内 4 次权益可在深圳、广州、香港、上海四城任意标准酒会与沙龙中无差别核销使用。',
        starlight:
          '四城会籍身份自动互认，跨城差旅期间可向目的地主理人索取在地私藏餐厅、威士忌吧与同频会员引荐建议。',
        celestial:
          '若您在深/穗/港/沪差旅期间无恰当公开场次，可申请由当地主理人为您临时召集 4–8 人的高规格闭门微醺局。',
      },
    },
  },
  {
    id: 'priv-yacht-lifestyle',
    code: 'PRIV 05',
    title: '维港日落帆船与海岸运动优先权',
    category: '先锋生活方式场景',
    shortDesc: '涵盖香港维港帆船、深圳湾网球/高尔夫、审美策展与黑胶爵士夜的稀缺席位',
    tierCells: {
      'free-guest': {
        summary: '仅开放少量公开余席（原价申请）',
        badgeLabel: '余席申请',
        highlightLevel: 'basic',
      },
      'salon-pass': {
        summary: '支持次卡折抵 + 户外/游艇专项差价优先报名',
        badgeLabel: '次卡折抵报名',
        highlightLevel: 'included',
      },
      starlight: {
        summary: '海上帆船与运动局优先锁席 + 会员专属优享价',
        badgeLabel: '优先锁席优享',
        highlightLevel: 'priority',
      },
      celestial: {
        summary: '支持将免单私宴权益等额置换为维港帆船贵宾席',
        badgeLabel: '帆船贵宾置换',
        highlightLevel: 'exclusive',
      },
    },
    deepServiceDetail: {
      serviceHeadline: '脱离会议室与写字楼 · 在海风、甲板与运动多巴胺中卸下防备',
      executionProtocol:
        '针对帆船航行、网球友谊赛与器物香氛沙龙等重体验场次，每场严格限制 12–18 人。由专业船长、运动教练与生活美学主理人联合带队，在协作升帆或运动切磋后自然过渡到香槟暮色交流。',
      conciergeSla: '如遇台风或恶劣海况，提前 24 小时启动室内隐室威士忌品鉴备选方案或全额无损退改。',
      realWorldScenario:
        '在香港中环至南丫岛的日落航行中，16 位深港金融、法律与生物科技海归共同完成掌舵协作，沉淀出长期活跃的深港海上运动与读书小组。',
      tierSpecificNotes: {
        'free-guest':
          '可在每期游艇或运动场次释放公开席位后提交申请，按单场标准票价参与。',
        'salon-pass':
          '可使用 1 次卡内额度折抵基础票价，仅需补齐游艇/私享场地差额即可优先锁定名额。',
        starlight:
          '享有所有海岸运动、帆船与生活美学沙龙的首批报名通道与年度会员折扣。',
        celestial:
          '全年 2 次高定场域免单额度可自由在「12 人长桌私宴」与「维港日落帆船贵宾席」之间灵活切换，并支持企业/家办包船定制。',
      },
    },
  },
  {
    id: 'priv-co-curation',
    code: 'PRIV 06',
    title: '年度沙龙联合出品与私董共创',
    category: '品牌共创与影响力赋能',
    shortDesc: '从参与者升级为场域共建者，联合发起行业专题夜话、品牌快闪与岁末黑金盛典',
    tierCells: {
      'free-guest': {
        summary: '作为受邀听众与交流嘉宾参与现场互动',
        badgeLabel: '现场交流嘉宾',
        highlightLevel: 'basic',
      },
      'salon-pass': {
        summary: '可申请成为「乱讲 PPT」或行业沙龙单期分享嘉宾',
        badgeLabel: '单期分享申请',
        highlightLevel: 'included',
      },
      starlight: {
        summary: '优先受邀担任主题沙龙分享嘉宾 + 岁末黑金之夜入场权',
        badgeLabel: '沙龙嘉宾 + 盛典',
        highlightLevel: 'priority',
      },
      celestial: {
        summary: '年度专题沙龙联合出品人权益 + 品牌跨界联名策展支持',
        badgeLabel: '联合出品人特权',
        highlightLevel: 'exclusive',
      },
    },
    deepServiceDetail: {
      serviceHeadline: '成为 BoL 联合出品人 · 把您的行业洞察与品牌审美转化为圈层号召力',
      executionProtocol:
        'BoL 鼓励优质会员从“赴约者”走向“共创者”。主理人团队提供从议题打磨、场地视觉统筹、定向嘉宾邀约到会后《现场纪实档案》撰写的全流程策展支持，助力您的新产品内测、品牌出海故事或学术洞察触达高净值同频人群。',
      conciergeSla: '联合出品提案通过后，由专属策展小组提前 21 天启动定向嘉宾邀约与视觉物料定制。',
      realWorldScenario:
        '某智能穿戴品牌创始人在升级星辰会籍后，与 BoL 联合出品「硅谷硬件众筹复盘夜话」，单场锁定 2 位海外渠道合伙人并完成首批 30 位种子高管内测。',
      tierSpecificNotes: {
        'free-guest':
          '欢迎在活动现场互动环节分享您的专业见解，表现优异者将进入主理人重点关注人才库。',
        'salon-pass':
          '若您有独特的行业实战经验或跨学科趣味课题，可随时向主理人自荐成为单期沙龙主讲嘉宾。',
        starlight:
          '享有年度压轴「岁末黑金之夜」优先锁席权，并可在全年主题沙龙中优先申请议题主讲与资源共创。',
        celestial:
          '享有每年 1 次「BoL 专题沙龙/闭门夜话联合出品人」权益，由俱乐部全案协助定向邀约 20–30 位目标行业决策者共同入席。',
      },
    },
  },
];

/**
 * Steps to the previous or next membership tier based on horizontal drag offset.
 */
export function resolveNextTierByDragOffset(
  currentTierId: MembershipTier['id'],
  dragOffsetX: number,
  threshold = 45
): MembershipTier['id'] {
  const currentIndex = TIER_ORDER.indexOf(currentTierId);
  if (currentIndex === -1) return 'starlight';

  if (dragOffsetX <= -threshold && currentIndex < TIER_ORDER.length - 1) {
    return TIER_ORDER[currentIndex + 1];
  }
  if (dragOffsetX >= threshold && currentIndex > 0) {
    return TIER_ORDER[currentIndex - 1];
  }
  return currentTierId;
}

/**
 * Returns the selected privilege item along with the active tier's cell & deep service note.
 */
export function getPrivilegeComparisonDetail(
  privilegeId: string,
  tierId: MembershipTier['id']
): {
  privilege: MembershipPrivilegeItem;
  activeCell: MembershipPrivilegeItem['tierCells'][MembershipTier['id']];
  activeTierNote: string;
} {
  const found =
    MEMBERSHIP_PRIVILEGE_COMPARISON_MATRIX.find((item) => item.id === privilegeId) ||
    MEMBERSHIP_PRIVILEGE_COMPARISON_MATRIX[0];

  return {
    privilege: found,
    activeCell: found.tierCells[tierId],
    activeTierNote: found.deepServiceDetail.tierSpecificNotes[tierId],
  };
}

/**
 * Deterministically resolves which navigation section ID should be highlighted
 * based on each section's bounding client rect (top/bottom relative to viewport)
 * and a focal line near the top of the viewport.
 */
export function resolveActiveSectionFromScroll(
  sectionBounds: Array<{ id: NavSectionId; top: number; bottom: number }>,
  viewportFocusY = 180
): NavSectionId {
  if (!sectionBounds || sectionBounds.length === 0) {
    return 'top';
  }

  // First check if any section straddles the viewportFocusY line
  for (const sec of sectionBounds) {
    if (sec.top <= viewportFocusY && sec.bottom > viewportFocusY) {
      return sec.id;
    }
  }

  // Otherwise pick the section whose top is closest to viewportFocusY without being far below
  let closestId: NavSectionId = sectionBounds[0].id;
  let minDistance = Number.POSITIVE_INFINITY;

  for (const sec of sectionBounds) {
    const distance = Math.abs(sec.top - viewportFocusY);
    if (distance < minDistance) {
      minDistance = distance;
      closestId = sec.id;
    }
  }

  return closestId;
}

/**
 * Builds the 12-month annual event density, category breakdown, and interactive
 * flagship event anchor pins for the D3.js Annual Event Streamline Chart.
 */
export function buildAnnualEventStreamlineData(
  events: BolEvent[] = CURATED_EVENTS,
  selectedSeries: EventSeriesId = 'all',
  selectedCity: CityName = '全部城市'
): AnnualEventStreamlineData {
  const rawMonths: Array<{
    monthLabel: string;
    seasonTag: string;
    seriesBreakdown: Record<Exclude<EventSeriesId, 'all'>, number>;
  }> = [
    {
      monthLabel: '01月',
      seasonTag: '新岁启幕',
      seriesBreakdown: {
        networking: 4,
        'ai-global': 3,
        'private-dinner': 2,
        'yacht-sport': 1,
        'culture-lifestyle': 2,
      },
    },
    {
      monthLabel: '02月',
      seasonTag: '春茗微醺',
      seriesBreakdown: {
        networking: 3,
        'ai-global': 2,
        'private-dinner': 3,
        'yacht-sport': 1,
        'culture-lifestyle': 2,
      },
    },
    {
      monthLabel: '03月',
      seasonTag: '春潮破冰',
      seriesBreakdown: {
        networking: 5,
        'ai-global': 4,
        'private-dinner': 2,
        'yacht-sport': 2,
        'culture-lifestyle': 3,
      },
    },
    {
      monthLabel: '04月',
      seasonTag: '跨界沙龙',
      seriesBreakdown: {
        networking: 4,
        'ai-global': 5,
        'private-dinner': 3,
        'yacht-sport': 2,
        'culture-lifestyle': 3,
      },
    },
    {
      monthLabel: '05月',
      seasonTag: '维港扬帆',
      seriesBreakdown: {
        networking: 5,
        'ai-global': 4,
        'private-dinner': 3,
        'yacht-sport': 4,
        'culture-lifestyle': 3,
      },
    },
    {
      monthLabel: '06月',
      seasonTag: '仲夏夜话',
      seriesBreakdown: {
        networking: 5,
        'ai-global': 5,
        'private-dinner': 2,
        'yacht-sport': 4,
        'culture-lifestyle': 4,
      },
    },
    {
      monthLabel: '07月',
      seasonTag: '海岸运动',
      seriesBreakdown: {
        networking: 4,
        'ai-global': 4,
        'private-dinner': 3,
        'yacht-sport': 5,
        'culture-lifestyle': 3,
      },
    },
    {
      monthLabel: '08月',
      seasonTag: '灵感剧场',
      seriesBreakdown: {
        networking: 5,
        'ai-global': 5,
        'private-dinner': 3,
        'yacht-sport': 4,
        'culture-lifestyle': 4,
      },
    },
    {
      monthLabel: '09月',
      seasonTag: '秋夜私宴',
      seriesBreakdown: {
        networking: 6,
        'ai-global': 6,
        'private-dinner': 4,
        'yacht-sport': 3,
        'culture-lifestyle': 3,
      },
    },
    {
      monthLabel: '10月',
      seasonTag: '出海峰聚',
      seriesBreakdown: {
        networking: 6,
        'ai-global': 7,
        'private-dinner': 4,
        'yacht-sport': 3,
        'culture-lifestyle': 4,
      },
    },
    {
      monthLabel: '11月',
      seasonTag: '同频高潮',
      seriesBreakdown: {
        networking: 7,
        'ai-global': 7,
        'private-dinner': 5,
        'yacht-sport': 4,
        'culture-lifestyle': 5,
      },
    },
    {
      monthLabel: '12月',
      seasonTag: '岁末黑金',
      seriesBreakdown: {
        networking: 8,
        'ai-global': 5,
        'private-dinner': 5,
        'yacht-sport': 2,
        'culture-lifestyle': 5,
      },
    },
  ];

  const cityMultiplier: Record<CityName, number> = {
    全部城市: 1,
    深圳: 0.42,
    广州: 0.22,
    香港: 0.18,
    上海: 0.18,
  };
  const mult = cityMultiplier[selectedCity] || 1;

  const months: AnnualStreamMonthPoint[] = rawMonths.map((item, idx) => {
    const scaledBreakdown: Record<Exclude<EventSeriesId, 'all'>, number> = {
      networking: Math.max(1, Math.round(item.seriesBreakdown.networking * mult)),
      'ai-global': Math.max(1, Math.round(item.seriesBreakdown['ai-global'] * mult)),
      'private-dinner': Math.max(
        1,
        Math.round(item.seriesBreakdown['private-dinner'] * mult)
      ),
      'yacht-sport': Math.max(1, Math.round(item.seriesBreakdown['yacht-sport'] * mult)),
      'culture-lifestyle': Math.max(
        1,
        Math.round(item.seriesBreakdown['culture-lifestyle'] * mult)
      ),
    };

    const totalDensity =
      selectedSeries === 'all'
        ? Object.values(scaledBreakdown).reduce((acc, v) => acc + v, 0)
        : scaledBreakdown[selectedSeries];

    return {
      monthIndex: idx,
      monthLabel: item.monthLabel,
      seasonTag: item.seasonTag,
      totalDensity,
      seriesBreakdown: scaledBreakdown,
    };
  });

  // Spread the 6 flagship curated events across representative seasonal anchor points
  // so every curated event has a distinct, clickable milestone node along the annual curve
  const anchorMonthSlots = [1, 3, 5, 7, 9, 11];
  const eventPins: AnnualStreamEventPin[] = events.map((ev, idx) => {
    const slotMonth = anchorMonthSlots[idx % anchorMonthSlots.length];
    const monthObj = months[slotMonth] || months[10];
    return {
      eventId: ev.id,
      code: ev.code,
      title: ev.title,
      city: ev.city,
      series: ev.series,
      seriesLabel: ev.seriesLabel,
      date: ev.date,
      monthIndex: slotMonth,
      densityValue: monthObj.totalDensity,
      remainingSeats: ev.remainingSeats,
      capacity: ev.capacity,
    };
  });

  const annualTotalGatherings = months.reduce((acc, m) => acc + m.totalDensity, 0);
  const peakMonth = months.reduce(
    (best, m) => (m.totalDensity > best.totalDensity ? m : best),
    months[0]
  );

  return {
    months,
    eventPins,
    annualTotalGatherings,
    peakMonthLabel: `${peakMonth.monthLabel}（${peakMonth.seasonTag}）`,
  };
}

const SECTION_SUGGESTION_CONFIG: Record<
  NavSectionId,
  Omit<ConciergeSuggestionPayload, 'dwellSharePct' | 'dwellSeconds'>
> = {
  top: {
    sectionId: 'top',
    sectionLabel: '首屏与城市坐标',
    headline: '正在浏览大湾区与上海四城线下场域？',
    suggestionCopy:
      '为您推荐近期高热度「AI 硬件与品牌出海微醺夜话（深圳）」，仅余 6 席。',
    ctaLabel: '查阅近期精选活动矩阵',
    actionType: 'scroll_to_gatherings',
    relatedEventId: 'bol-sz-ai-wine',
  },
  philosophy: {
    sectionId: 'philosophy',
    sectionLabel: '品牌叙事与调性张力',
    headline: '认同「正式与松弛并存」的社交边界？',
    suggestionCopy:
      '体验 12–45 人严控密度的真实聚会，或通过同频沙盘测算您的跨界连接路径。',
    ctaLabel: '进入同频连接沙盘定制',
    actionType: 'scroll_to_sandbox',
  },
  gatherings: {
    sectionId: 'gatherings',
    sectionLabel: '近期活动矩阵',
    headline: '正在关注当期热门酒会与闭门私宴？',
    suggestionCopy:
      '您已在活动矩阵停留较长时间，可一键调阅「AI 硬件与品牌出海微醺夜话」完整席位档案。',
    ctaLabel: '查阅当期热门场次详情',
    actionType: 'open_featured_event',
    relatedEventId: 'bol-sz-ai-wine',
  },
  sandbox: {
    sectionId: 'sandbox',
    sectionLabel: '同频连接沙盘',
    headline: '希望将连接潜能雷达转化为 1V1 主理人引荐？',
    suggestionCopy:
      '星光年度会籍与星辰黑金会籍享有优先席位锁定与跨行业校友定向破冰服务。',
    ctaLabel: '深入了解会籍与权益对比',
    actionType: 'scroll_to_membership',
    relatedTierId: 'starlight',
  },
  membership: {
    sectionId: 'membership',
    sectionLabel: '会籍与权益体系',
    headline: '正在比选星光年度会籍与星辰黑金权益？',
    suggestionCopy:
      '立即锁定「星光年度会籍（¥1,680/年）」进入申请通道，享全年 36+ 场优享票价与主理人引荐。',
    ctaLabel: '申请星光会籍并生成编码',
    actionType: 'scroll_to_apply',
    relatedTierId: 'starlight',
  },
  'field-notes': {
    sectionId: 'field-notes',
    sectionLabel: '现场纪实与连接档案',
    headline: '向往档案中的维港帆船或珠江 12 人长桌？',
    suggestionCopy:
      '11 月香港维港日落帆船与广州主理人长桌私宴正在开放审核，余席仅剩 2–4 席。',
    ctaLabel: '查阅维港帆船场次档案',
    actionType: 'open_featured_event',
    relatedEventId: 'bol-hk-yacht-sunset',
  },
  apply: {
    sectionId: 'apply',
    sectionLabel: '席位预约与核验中心',
    headline: '正在筹备您的首场 BoL 线下赴约登记？',
    suggestionCopy:
      '若尚未确定首场意向活动，可先回看近期 6 场大湾区与上海聚会语境。',
    ctaLabel: '回看近期 6 场活动语境',
    actionType: 'scroll_to_gatherings',
  },
};

/**
 * Evaluates user dwell time proportions across sections and returns a lightweight
 * 'Concierge Suggestion' bubble payload when the active or dominant section reaches
 * a meaningful dwell share threshold.
 */
export function evaluateSectionDwellSuggestion(
  dwellMsBySection: Partial<Record<NavSectionId, number>>,
  currentSectionId: NavSectionId,
  dismissedSectionIds: NavSectionId[] = [],
  minTotalDwellMs = 1800,
  minSharePct = 24
): ConciergeSuggestionPayload | null {
  const entries = Object.entries(dwellMsBySection) as Array<[NavSectionId, number]>;
  const validEntries = entries.filter(([, ms]) => typeof ms === 'number' && ms > 0);
  const totalDwellMs = validEntries.reduce((sum, [, ms]) => sum + ms, 0);

  if (totalDwellMs < minTotalDwellMs) {
    return null;
  }

  const currentMs = dwellMsBySection[currentSectionId] || 0;
  const currentSharePct = Math.round((currentMs / totalDwellMs) * 100);

  // Prefer the currently focused section if it has accumulated sufficient dwell share
  let targetSection: NavSectionId | null = null;
  let targetMs = 0;

  if (
    !dismissedSectionIds.includes(currentSectionId) &&
    currentMs >= 900 &&
    currentSharePct >= minSharePct
  ) {
    targetSection = currentSectionId;
    targetMs = currentMs;
  } else {
    // Otherwise pick the non-dismissed section with the highest dwell time share
    const sorted = validEntries
      .filter(([secId]) => !dismissedSectionIds.includes(secId))
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length > 0) {
      const [bestSection, bestMs] = sorted[0];
      const bestShare = Math.round((bestMs / totalDwellMs) * 100);
      if (bestMs >= 1000 && bestShare >= minSharePct) {
        targetSection = bestSection;
        targetMs = bestMs;
      }
    }
  }

  if (!targetSection) {
    return null;
  }

  const dwellSharePct = Math.max(
    1,
    Math.min(100, Math.round((targetMs / totalDwellMs) * 100))
  );
  const dwellSeconds = Math.max(1, Math.round(targetMs / 1000));
  const baseConfig =
    SECTION_SUGGESTION_CONFIG[targetSection] || SECTION_SUGGESTION_CONFIG.gatherings;

  return {
    ...baseConfig,
    dwellSharePct,
    dwellSeconds,
  };
}

/**
 * Computes a dynamic ripple animation profile based on W3C Pointer Events pressure (`e.pressure`).
 * Adjusts expansion speed (shorter duration & larger scale on higher pressure) and
 * color concentration (`colorIntensity`, border alpha, glow shadow, and inner gradient)
 * for pressure-capable touch/pen/Force Touch hardware while providing a poised baseline on mouse.
 */
export function computePointerPressureRippleProfile(
  rawPressure: number | undefined,
  pointerType = 'mouse',
  isInteractiveClick = false
): PointerPressureRippleProfile {
  const hasValidNumericPressure =
    typeof rawPressure === 'number' && !Number.isNaN(rawPressure) && rawPressure > 0;

  // W3C Pointer Events reports 0.5 as the default active state on non-pressure-sensitive mice/touch
  const isPressureSensitive =
    hasValidNumericPressure &&
    (Math.abs((rawPressure as number) - 0.5) > 0.02 ||
      pointerType === 'pen' ||
      pointerType === 'touch');

  const basePressure = hasValidNumericPressure ? (rawPressure as number) : 0.5;
  const interactiveBoost = isInteractiveClick ? 0.08 : 0;
  const normalizedPressure = Number(
    Math.min(1, Math.max(0.15, basePressure + interactiveBoost)).toFixed(2)
  );

  const pressureLevelLabel: 'light' | 'medium' | 'firm' =
    normalizedPressure >= 0.72
      ? 'firm'
      : normalizedPressure <= 0.36
        ? 'light'
        : 'medium';

  // Higher pressure => faster expansion speed (shorter duration, larger radius)
  const expansionDurationSec = Number(
    Math.max(0.28, Math.min(0.68, 0.68 - normalizedPressure * 0.36)).toFixed(2)
  );
  const maxScale = Number((1.85 + normalizedPressure * 1.15).toFixed(2));

  // Higher pressure => richer champagne-gold & burgundy-gold color concentration
  const colorIntensity = Number(
    Math.min(0.98, Math.max(0.42, 0.38 + normalizedPressure * 0.58)).toFixed(2)
  );

  const borderAlpha = Number(Math.min(0.96, 0.45 + normalizedPressure * 0.5).toFixed(2));
  const glowAlpha = Number(Math.min(0.82, 0.24 + normalizedPressure * 0.54).toFixed(2));
  const innerCoreAlpha = Number(
    Math.min(0.56, 0.12 + normalizedPressure * 0.4).toFixed(2)
  );
  const glowSpreadPx = Math.round(12 + normalizedPressure * 20);

  const borderColor =
    pressureLevelLabel === 'firm'
      ? `rgba(191, 137, 67, ${borderAlpha})`
      : `rgba(216, 185, 138, ${borderAlpha})`;

  const glowShadow = `0 0 ${glowSpreadPx}px rgba(216, 185, 138, ${glowAlpha})`;
  const backgroundGradient = `radial-gradient(circle, rgba(216,185,138,${innerCoreAlpha}) 0%, rgba(191,137,67,${Number(
    (innerCoreAlpha * 0.6).toFixed(2)
  )}) 52%, rgba(90,26,30,0) 100%)`;

  const hapticDurationMs = Math.round(6 + normalizedPressure * 18);

  return {
    normalizedPressure,
    isPressureSensitive,
    pressureLevelLabel,
    expansionDurationSec,
    maxScale,
    colorIntensity,
    borderColor,
    glowShadow,
    backgroundGradient,
    hapticDurationMs,
  };
}

export const BOL_SCHEDULE_STORAGE_KEY = 'bol_club_scheduled_reservations_v1';

/**
 * Pure helper to add, toggle, or remove an event ID in the user's scheduled list.
 */
export function syncScheduledEventIds(
  currentIds: string[],
  targetEventId: string,
  mode: 'add' | 'toggle' | 'remove' = 'add'
): { nextIds: string[]; isScheduled: boolean } {
  const uniqueIds = Array.from(new Set(currentIds.filter(Boolean)));
  const exists = uniqueIds.includes(targetEventId);

  if (mode === 'remove') {
    const nextIds = uniqueIds.filter((id) => id !== targetEventId);
    return { nextIds, isScheduled: false };
  }

  if (mode === 'toggle' && exists) {
    const nextIds = uniqueIds.filter((id) => id !== targetEventId);
    return { nextIds, isScheduled: false };
  }

  if (exists) {
    return { nextIds: uniqueIds, isScheduled: true };
  }

  const nextIds = [...uniqueIds, targetEventId];
  return { nextIds, isScheduled: true };
}

/**
 * Builds a minimalist BoL bespoke editorial Event Reservation Slip ('活动预约单')
 * for previewing and confirming a scheduled gathering.
 */
export function buildEventReservationSlip(
  event: BolEvent,
  scheduleOrderIndex = 1
): BolEventReservationSlip {
  const cleanSuffix = event.code.replace(/^BOL-/, '');
  const orderDigits = String(Math.max(1, scheduleOrderIndex)).padStart(2, '0');
  const slipNo = `RSV-2026-${cleanSuffix}-${orderDigits}`;

  return {
    slipNo,
    eventId: event.id,
    eventCode: event.code,
    title: event.title,
    englishSubtitle: event.englishSubtitle,
    seriesLabel: event.seriesLabel,
    city: event.city,
    date: event.date,
    timeRange: event.timeRange,
    venue: event.venue,
    dressCode: event.dressCode,
    hostSignature: `${event.hostName}（${event.hostRole}）`,
    memberPrice: event.memberPrice,
    standardPrice: event.standardPrice,
    seatQuotaNote: `余 ${event.remainingSeats}/${event.capacity} 席 · 12–45 人严控密度`,
    curatedTopics: event.curatedTopics,
    checkInProtocol:
      '本预约单已同步至本地日程。正式赴约前请凭「BoL万象博联」小程序专属核验编码于开场前 15 分钟签到入席。',
    scheduleOrderIndex: Math.max(1, scheduleOrderIndex),
  };
}

/**
 * Generates Framer Motion "Digital Footprint" ("数字足迹") airflow trajectory curves
 * and animated particles in the Radar Chart background based on the member's
 * activity frequency and domain in BoL Club.
 */
export function buildDigitalFootprintParticles(input: {
  activityFrequency: ActivityFrequencyId;
  industry: IndustryDomainId;
  city: Exclude<CityName, '全部城市'>;
}): DigitalFootprintVisualization {
  const { activityFrequency, industry, city } = input;

  const domainVisualMap: Record<
    IndustryDomainId,
    {
      domainLabel: string;
      primaryColor: string;
      secondaryColor: string;
      tagPrefix: string;
    }
  > = {
    'ai-tech': {
      domainLabel: 'AI、硬科技与数字化产品',
      primaryColor: '#D8B98A',
      secondaryColor: '#BF8943',
      tagPrefix: 'AI-LINK',
    },
    'cross-border': {
      domainLabel: '跨境电商、品牌出海与全球增长',
      primaryColor: '#BF8943',
      secondaryColor: '#D8B98A',
      tagPrefix: 'GLOBAL-DTC',
    },
    'investment-family': {
      domainLabel: '一级市场投资、金融与家族企业',
      primaryColor: '#C86D74',
      secondaryColor: '#D8B98A',
      tagPrefix: 'CAPITAL-FO',
    },
    'creative-arch': {
      domainLabel: '建筑空间、先锋设计与生活方式主理',
      primaryColor: '#9E8BC8',
      secondaryColor: '#D8B98A',
      tagPrefix: 'ARCH-CRAFT',
    },
    'biotech-health': {
      domainLabel: '生命科学、医疗健康与耐力运动',
      primaryColor: '#6B99A8',
      secondaryColor: '#D8B98A',
      tagPrefix: 'BIO-SAIL',
    },
  };

  const frequencyMeta: Record<
    ActivityFrequencyId,
    {
      label: string;
      annualSessions: number;
      particleCount: number;
      velocityMultiplier: number;
      velocityLabel: string;
      baseDurationSec: number;
    }
  > = {
    'monthly-1-2': {
      label: '1–2 场/月 · 精选深聊',
      annualSessions: 18,
      particleCount: 8,
      velocityMultiplier: 1.0,
      velocityLabel: '舒缓微醺气流 (1.0x)',
      baseDurationSec: 5.4,
    },
    'biweekly-3-4': {
      label: '3–4 场/月 · 高频同频',
      annualSessions: 42,
      particleCount: 14,
      velocityMultiplier: 1.45,
      velocityLabel: '高频同频气流 (1.45x)',
      baseDurationSec: 3.7,
    },
    'weekly-5-plus': {
      label: '5+ 场/月 · 核心主理共创',
      annualSessions: 68,
      particleCount: 20,
      velocityMultiplier: 1.9,
      velocityLabel: '核心主理涡流 (1.9x)',
      baseDurationSec: 2.6,
    },
  };

  const domainCfg = domainVisualMap[industry] || domainVisualMap['ai-tech'];
  const freqCfg = frequencyMeta[activityFrequency] || frequencyMeta['biweekly-3-4'];

  // 3 flowing SVG orbital airflow streams behind the radar chart (viewBox 0 0 360 280, center 180,140)
  const airflowSvgPaths: [string, string, string] = [
    'M 36 140 C 88 52, 272 52, 324 140 C 272 228, 88 228, 36 140 Z',
    'M 64 78 C 148 34, 246 82, 296 198 C 212 242, 114 194, 64 78 Z',
    'M 68 202 C 122 86, 238 42, 294 82 C 242 196, 134 238, 68 202 Z',
  ];

  // Waypoint loops corresponding to the 3 orbital airflow streams around the radar center (180, 140)
  const streamWaypoints: Array<{
    x: [number, number, number, number];
    y: [number, number, number, number];
  }> = [
    {
      x: [48, 180, 312, 180],
      y: [140, 62, 140, 218],
    },
    {
      x: [74, 212, 286, 148],
      y: [84, 66, 192, 210],
    },
    {
      x: [76, 152, 288, 206],
      y: [196, 70, 88, 208],
    },
  ];

  const particles: DigitalFootprintParticle[] = Array.from(
    { length: freqCfg.particleCount },
    (_, idx) => {
      const pathIndex = idx % 3;
      const wp = streamWaypoints[pathIndex];
      // Offset phase along the loop so particles form a continuous flowing stream
      const shift = idx % 4;
      const rotatedX: [number, number, number, number] = [
        wp.x[shift % 4],
        wp.x[(shift + 1) % 4],
        wp.x[(shift + 2) % 4],
        wp.x[(shift + 3) % 4],
      ];
      const rotatedY: [number, number, number, number] = [
        wp.y[shift % 4],
        wp.y[(shift + 1) % 4],
        wp.y[(shift + 2) % 4],
        wp.y[(shift + 3) % 4],
      ];

      const isPrimary = idx % 2 === 0;
      const radiusPx = Number((2.2 + (idx % 3) * 0.9).toFixed(1));
      const durationSec = Number(
        (freqCfg.baseDurationSec + (idx % 4) * 0.35).toFixed(2)
      );
      const delaySec = Number(((idx * 0.22) % 2.4).toFixed(2));
      const peakOpacity = Number(
        Math.min(0.92, 0.48 + freqCfg.velocityMultiplier * 0.2).toFixed(2)
      );

      return {
        id: `fp-${activityFrequency}-${industry}-${idx}`,
        pathIndex,
        waypointsX: rotatedX,
        waypointsY: rotatedY,
        radiusPx,
        durationSec,
        delaySec,
        colorHex: isPrimary ? domainCfg.primaryColor : domainCfg.secondaryColor,
        peakOpacity,
        domainTag: `${domainCfg.tagPrefix}-${String(idx + 1).padStart(2, '0')}`,
      };
    }
  );

  const footprintNarrative = `在【${city}】×【${domainCfg.domainLabel}】场域下，按「${freqCfg.label}」节奏赴约，预计全年沉淀 ${freqCfg.annualSessions} 场数字足迹，激活 ${freqCfg.particleCount} 组跨界连接气流粒子。`;

  return {
    activityFrequency,
    frequencyLabel: freqCfg.label,
    industry,
    domainLabel: domainCfg.domainLabel,
    domainColorHex: domainCfg.primaryColor,
    secondaryColorHex: domainCfg.secondaryColor,
    annualFootprintSessions: freqCfg.annualSessions,
    airflowVelocityMultiplier: freqCfg.velocityMultiplier,
    airflowVelocityLabel: freqCfg.velocityLabel,
    footprintNarrative,
    airflowSvgPaths,
    particles,
  };
}

/**
 * Generates a deterministic Deep Circle Fit Analysis Report ("深度契合度"分析报告)
 * against BoL Club's active member circles based on a simulated personal career description.
 */
export function buildDeterministicDeepFitReport(input: {
  careerDescription: string;
  city: Exclude<CityName, '全部城市'>;
  industry: IndustryDomainId;
  rhythm: SocialRhythmId;
}): AiDeepCircleFitReport {
  const cleanText = (input.careerDescription || '').trim();
  const lower = cleanText.toLowerCase();
  const city = input.city || '深圳';

  const cityCodeMap: Record<Exclude<CityName, '全部城市'>, string> = {
    深圳: 'SZ',
    广州: 'GZ',
    香港: 'HK',
    上海: 'SH',
  };

  let detectedDomain: IndustryDomainId = input.industry;
  if (/投资|基金|并购|家办|家族|vc|pe|一级市场|资产|接班/.test(lower)) {
    detectedDomain = 'investment-family';
  } else if (/建筑|设计|空间|策展|艺术|香氛|买手|美学/.test(lower)) {
    detectedDomain = 'creative-arch';
  } else if (/生物|医疗|抗衰|临床|健康|生命科学|器械/.test(lower)) {
    detectedDomain = 'biotech-health';
  } else if (/独立站|dtc|北美|欧洲|东南亚|商超|亚马逊|tiktok|跨境/.test(lower)) {
    detectedDomain = 'cross-border';
  } else if (/ai|硬件|算法|机器人|大模型|硅谷|芯片|穿戴/.test(lower)) {
    detectedDomain = 'ai-tech';
  }

  const rhythmSceneMap: Record<SocialRhythmId, string> = {
    'tipsy-salon': `${city}站 · 28 人微醺威士忌主题夜话`,
    'closed-banquet': `${city}站 · 12 人审核制跨界长桌私宴`,
    'coastal-sport': `${city === '香港' ? '维港' : city} · 日落帆船社交航行`,
    'frontier-forum': `${city}站 · 一线操盘手闭门复盘夜话`,
  };

  const presetMap: Record<
    IndustryDomainId,
    {
      overallScore: number;
      primaryCircle: string;
      verdict: string;
      circles: [ActiveCircleFitItem, ActiveCircleFitItem, ActiveCircleFitItem];
      whatYouBring: string;
      whatYouGain: string;
      icebreakerTopic: string;
    }
  > = {
    'ai-tech': {
      overallScore: 97,
      primaryCircle: `${city} · 多模态 AI 硬件与深港早期美元资本圈`,
      verdict: `您的技术与产品履历与 BoL 在${city}及深港双城最活跃的「硅谷/名校理工海归 × 硬件出海主理人」圈层高度咬合，无需寒暄即可切入供应链打样与海外渠道共创。`,
      circles: [
        {
          circleCode: 'CIRCLE 01',
          circleName: '南山/深港 AI 硬件创始人闭门圈',
          enTag: 'AI Hardware Founders',
          fitPct: 98,
          activeMemberComposition: '前湾区硬件工程师、消费级穿戴/声学设备 CEO、端侧算法负责人（活跃成员 64 人）',
          resonanceReason: '共同面临端侧大模型交互定义、珠三角敏捷打样与北美众筹冷启动议题。',
        },
        {
          circleCode: 'CIRCLE 02',
          circleName: '欧美本土商超与 DTC 渠道操盘圈',
          enTag: 'Global Retail & DTC',
          fitPct: 95,
          activeMemberComposition: 'BestBuy/Target 线下分销合伙人、千万美金 Kickstarter 操盘手（活跃成员 48 人）',
          resonanceReason: '您的产品技术壁垒可与渠道操盘手的海外本土货架网络形成直接互补。',
        },
        {
          circleCode: 'CIRCLE 03',
          circleName: '深港早期硬科技双币基金圈',
          enTag: 'Early-Stage DeepTech VC',
          fitPct: 93,
          activeMemberComposition: '美元科技基金 VP、产业战投总监、香港家族办公室直投顾问（活跃成员 36 人）',
          resonanceReason: '围绕 AI 硬件毛利模型与跨国双总部架构，适合在 12 人私宴中深度建联。',
        },
      ],
      whatYouBring: '前沿软硬一体产品定义能力、海外技术视野与工程化落地经验',
      whatYouGain: '珠三角高配合度精密制造供应链引荐、欧美线下商超入驻经验与早期美元资本直连',
      icebreakerTopic: '「消费级 AI 硬件如何在去掉数码味的同时，守住 60% 以上的海外综合毛利？」',
    },
    'cross-border': {
      overallScore: 96,
      primaryCircle: `${city} · 全球化 DTC 品牌主理人与大湾区柔性供应链圈`,
      verdict: `您在跨境品牌增长与本土化运营上的实战经验，恰是当前 BoL 珠三角精密制造二代与新消费出海圈层最渴求的「联合出品」拼图。`,
      circles: [
        {
          circleCode: 'CIRCLE 01',
          circleName: '欧美/东南亚独立站品牌主理人圈',
          enTag: 'Global DTC Brand Leaders',
          fitPct: 97,
          activeMemberComposition: '年营收过亿 DTC 创始人、海外本土视觉创意总监、TikTok 美区负责人（活跃成员 72 人）',
          resonanceReason: '可直接交换海外本土合规、红人联盟裂变与高溢价品牌叙事的一线数据。',
        },
        {
          circleCode: 'CIRCLE 02',
          circleName: '大湾区隐形冠军智造二代圈',
          enTag: 'GBA Manufacturing Next-Gen',
          fitPct: 95,
          activeMemberComposition: '珠三角声学/家居/个护核心工厂接班人、柔性供应链合伙人（活跃成员 52 人）',
          resonanceReason: '工厂二代急需懂海外审美与渠道的品牌操盘手共同孵化自有品牌。',
        },
        {
          circleCode: 'CIRCLE 03',
          circleName: '深港离岸架构与跨境并购顾问圈',
          enTag: 'Cross-Border Structuring',
          fitPct: 91,
          activeMemberComposition: '香港执业并购律师、ODI/红筹税务合伙人、跨境支付主理人（活跃成员 34 人）',
          resonanceReason: '为品牌出海提供全球化资金回流、海外商标架构与渠道并购合规护航。',
        },
      ],
      whatYouBring: '海外本土用户心智洞察、可验证的独立站/全渠道增长模型与品牌视觉审美',
      whatYouGain: '珠三角源头柔性产线深度绑定、跨品类联合联名流量池与离岸财税合规方案',
      icebreakerTopic: '「当流量红利见顶，出海品牌如何靠线下买手体验与本土社区沉淀复购？」',
    },
    'investment-family': {
      overallScore: 97,
      primaryCircle: `${city} · 深港双币家族办公室与实业并购接班人圈`,
      verdict: `您的资本配置视野与产业背景高度契合 BoL 最私密的「12 人长桌私宴」与「维港帆船航行」核心圈层，适合在低防备感场域中沉淀长期共同投资伙伴。`,
      circles: [
        {
          circleCode: 'CIRCLE 01',
          circleName: '香港/新加坡单一家办与双币 GP 圈',
          enTag: 'Single Family Office & GP',
          fitPct: 98,
          activeMemberComposition: '香港单一家办 CIO、美元/人民币并购基金合伙人、私人银行董事（活跃成员 42 人）',
          resonanceReason: '在降息周期与跨境资产配置语境下，可共享稀缺标的池与联合尽调网络。',
        },
        {
          circleCode: 'CIRCLE 02',
          circleName: '大湾区与长三角实业接班人圈',
          enTag: 'Industrial Next-Gen Circle',
          fitPct: 95,
          activeMemberComposition: '先进制造/新材料上市企业二代、产业孵化器主理人（活跃成员 46 人）',
          resonanceReason: '围绕传统实业现金流向硬科技及海外渠道控股型并购转型展开深度协同。',
        },
        {
          circleCode: 'CIRCLE 03',
          circleName: '维港帆船与非标商业藏家圈',
          enTag: 'Yachting & Art Patron',
          fitPct: 92,
          activeMemberComposition: '维港帆船赛船东、城市更新非标商业主理人、当代艺术藏家（活跃成员 38 人）',
          resonanceReason: '脱离会议室与路演语境，在海上协作或艺术夜宴中建立跨代际信任。',
        },
      ],
      whatYouBring: '长期主义耐心资本视角、跨境资产结构经验与产业上下游整合资源',
      whatYouGain: '经过背景核验的同辈家办联合直投网络、优质出海现金流标的与私密同频社交场',
      icebreakerTopic: '「二代接班与家办配置中，如何平衡稳健现金流实业与早期硬科技直投？」',
    },
    'creative-arch': {
      overallScore: 95,
      primaryCircle: `${city} · 先锋建筑空间导演与东方买手品牌主理人圈`,
      verdict: `您的空间审美与文化策展背景是 BoL 社群中最具吸引力的「感官催化剂」，极易与寻求品牌美学升级的科技创始人及非标商业地产主理人产生深度化学反应。`,
      circles: [
        {
          circleCode: 'CIRCLE 01',
          circleName: '独立建筑师与暗调空间主理人圈',
          enTag: 'Architecture & Spatial Mood',
          fitPct: 97,
          activeMemberComposition: 'AA/GSD/UCL 海归建筑师、威士忌廊与精品酒店空间导演（活跃成员 44 人）',
          resonanceReason: '共同探索历史街区活化、光影叙事张力与高粘性线下社交场域营造。',
        },
        {
          circleCode: 'CIRCLE 02',
          circleName: '东方香氛、器物与买手零售圈',
          enTag: 'Olfactory & Craft Curators',
          fitPct: 94,
          activeMemberComposition: '独立沙龙香氛创始人、巴黎/上海买手店策展人、黑胶厂牌主理（活跃成员 50 人）',
          resonanceReason: '在五感体验、东方手工艺当代转译与高净值私域审美社群运营上高度同频。',
        },
        {
          circleCode: 'CIRCLE 03',
          circleName: '高溢价科技硬件与商业地产联名圈',
          enTag: 'Tech-Art Co-Branding',
          fitPct: 91,
          activeMemberComposition: '消费电子品牌美学顾问、非标商业地产主理人、新媒体装置艺术家（活跃成员 39 人）',
          resonanceReason: '为硬科技出海单品与存量商业空间注入稀缺的艺术联名溢价。',
        },
      ],
      whatYouBring: '高辨识度的空间与视觉叙事美学、跨学科策展能力与高品位审美社群号召力',
      whatYouGain: '出海消费品牌美学顾问委托、城市更新非标商业合作机会与跨界艺术联名资源',
      icebreakerTopic: '「在线下体验稀缺的今天，什么样的空间光影与气味能让人瞬间卸下社交防备？」',
    },
    'biotech-health': {
      overallScore: 95,
      primaryCircle: `${city} · 数字健康硬件转化与深港预防医学圈`,
      verdict: `您的生命科学或健康科技背景与 BoL 兼具科研严谨度与耐力运动热情的「生物传感 × 深港私享医疗 × 帆船耐力」圈层高度契合。`,
      circles: [
        {
          circleCode: 'CIRCLE 01',
          circleName: '智能穿戴监测与数字健康创业圈',
          enTag: 'Bio-Wearables & Digital Health',
          fitPct: 97,
          activeMemberComposition: '欧美名校生物医学海归、睡眠/运动恢复硬件创始人（活跃成员 38 人）',
          resonanceReason: '围绕医疗级生物传感算法在消费级硬件中的 FDA/CE 合规与商业化深度交流。',
        },
        {
          circleCode: 'CIRCLE 02',
          circleName: '深港精准医疗与抗衰诊所主理圈',
          enTag: 'Longevity & Private Clinic',
          fitPct: 94,
          activeMemberComposition: '香港专科医疗合伙人、细胞抗衰中心主理人、功能医学顾问（活跃成员 35 人）',
          resonanceReason: '打通前沿生命科学科研转化与大湾区高净值人群健康管理私域闭环。',
        },
        {
          circleCode: 'CIRCLE 03',
          circleName: '海岸帆船与耐力运动消费品牌圈',
          enTag: 'Endurance Sport & Nutrition',
          fitPct: 91,
          activeMemberComposition: '功能性补剂品牌创始人、铁三/帆船赛核心成员、双币医疗基金总监（活跃成员 45 人）',
          resonanceReason: '在真实户外运动场景中验证产品体验，对接早期生命科学耐心资本。',
        },
      ],
      whatYouBring: '严谨的生命科学/临床级数据壁垒、健康产品研发能力与专业公信力',
      whatYouGain: '深港跨境私享医疗渠道合作、硬件工程化供应链协同与高净值运动社群种子用户',
      icebreakerTopic: '「当硬核生物传感技术走向日常穿戴，如何平衡临床严谨度与生活方式美感？」',
    },
  };

  const preset = presetMap[detectedDomain];
  const careerInputEcho =
    cleanText.length > 0
      ? cleanText
      : `${city} · ${preset.primaryCircle.split('·')[1]?.trim() || '海归创业与跨界主理人'}`;

  return {
    reportNo: `FIT-2026-${cityCodeMap[city]}-${detectedDomain.slice(0, 3).toUpperCase()}`,
    careerInputEcho,
    city,
    overallFitScore: preset.overallScore,
    primaryMatchedCircle: preset.primaryCircle,
    executiveVerdict: preset.verdict,
    circleBreakdown: preset.circles,
    valueExchange: {
      whatYouBring: preset.whatYouBring,
      whatYouGain: preset.whatYouGain,
    },
    recommendedEntryScene: rhythmSceneMap[input.rhythm],
    icebreakerTopic: preset.icebreakerTopic,
    evaluationSource: 'curated-engine',
  };
}

export const LIVE_COMMUNITY_CONNECTIONS: LiveCommunityConnectionItem[] = [
  {
    id: 'pulse-sz-01',
    code: 'LIVE · SZ-01',
    timestampLabel: '刚刚 · 深圳南山',
    city: '深圳',
    sceneTag: '威士忌微醺夜话',
    initiatorRole: '某双币并购基金合伙人',
    counterpartRole: '独立空间建筑师（AA 校友）',
    consensusHeadline: '某位金融合伙人刚与某位建筑师就存量街区暗调威士忌廊改造达成联合出品共识',
    consensusDetail: '双方在华侨城夜话吧台旁深聊 40 分钟，约定下周实地勘察蛇口旧厂房改造标的。',
    relatedEventId: 'bol-sz-ai-wine',
  },
  {
    id: 'pulse-hk-02',
    code: 'LIVE · HK-02',
    timestampLabel: '9 分钟前 · 香港维港',
    city: '香港',
    sceneTag: '维港日落帆船航行',
    initiatorRole: '前硅谷 AI 穿戴硬件创始人',
    counterpartRole: '北美线下商超渠道合伙人',
    consensusHeadline: '某位 AI 硬件创始人刚与北美商超渠道负责人在帆船甲板敲定感恩节 300 店试点共识',
    consensusDetail: '伴随中环至南丫岛海风完成样机实测，主理人已协助建群跟进首批海外分销协议。',
    relatedEventId: 'bol-hk-yacht-sunset',
  },
  {
    id: 'pulse-gz-03',
    code: 'LIVE · GZ-03',
    timestampLabel: '21 分钟前 · 广州珠江新城',
    city: '广州',
    sceneTag: '12 人闭门长桌私宴',
    initiatorRole: '珠三角精密声学智造二代',
    counterpartRole: '东方沙龙香氛品牌主理人',
    consensusHeadline: '某位制造业家族接班人刚与某位香氛主理人在长桌私宴达成车载香氛硬件联名共识',
    consensusDetail: '在第三道主菜命题交流中碰撞出「东方木质调 × 智能座舱声学」跨界产品线定义。',
    relatedEventId: 'bol-gz-private-table',
  },
  {
    id: 'pulse-sh-04',
    code: 'LIVE · SH-04',
    timestampLabel: '34 分钟前 · 上海静安',
    city: '上海',
    sceneTag: '跨学科反严肃灵感夜',
    initiatorRole: '香港单一家办资产配置总监',
    counterpartRole: '生成式视觉与交互装置艺术家',
    consensusHeadline: '某位家办配置总监刚与某位新媒体艺术家就「外滩非标商业空间策展」达成委托共识',
    consensusDetail: '从一场 8 分钟「乱讲 PPT」破冰延展至年度青年艺术驻留计划与私享藏家夜宴。',
    relatedEventId: 'bol-sh-unserious-ppt',
  },
  {
    id: 'pulse-sz-05',
    code: 'LIVE · SZ-05',
    timestampLabel: '48 分钟前 · 深圳湾',
    city: '深圳',
    sceneTag: '海归爵士酒会',
    initiatorRole: '哥大生物医学工程海归创业者',
    counterpartRole: '早期硬科技美元基金 VP',
    consensusHeadline: '某位医疗穿戴创业者刚与某位美元基金投资人就临床传感算法出海达成尽调共识',
    consensusDetail: '通过主理人 1V1 引荐卡在爵士乐歇场间隙完成核心毛利模型与 FDA 路径核对。',
    relatedEventId: 'bol-sz-jazz-mixer',
  },
];

export function getLiveCommunityStream(
  cityFilter: CityName = '全部城市',
  currentIndex = 0
): {
  items: LiveCommunityConnectionItem[];
  activeItem: LiveCommunityConnectionItem;
  normalizedIndex: number;
  nextIndex: number;
  prevIndex: number;
  activeTonightCount: number;
} {
  const filtered =
    cityFilter === '全部城市'
      ? LIVE_COMMUNITY_CONNECTIONS
      : LIVE_COMMUNITY_CONNECTIONS.filter((item) => item.city === cityFilter);

  const safeList = filtered.length > 0 ? filtered : LIVE_COMMUNITY_CONNECTIONS;
  const normalizedIndex =
    ((currentIndex % safeList.length) + safeList.length) % safeList.length;
  const activeItem = safeList[normalizedIndex];
  const nextIndex = (normalizedIndex + 1) % safeList.length;
  const prevIndex = (normalizedIndex - 1 + safeList.length) % safeList.length;

  return {
    items: safeList,
    activeItem,
    normalizedIndex,
    nextIndex,
    prevIndex,
    activeTonightCount: cityFilter === '全部城市' ? 42 : 12 + safeList.length * 4,
  };
}

export function buildSmartFilterSummary(
  selectedSeries: EventSeriesId,
  selectedCity: CityName,
  searchQuery: string,
  matchedCount: number
): SmartFilterSummary {
  const seriesObj = EVENT_SERIES_TABS.find((t) => t.id === selectedSeries);
  const seriesLabel = seriesObj ? seriesObj.label : '全部系列';
  const cityLabel = selectedCity || '全部城市';
  const cleanQuery = (searchQuery || '').trim();
  const hasKeyword = cleanQuery.length > 0;

  let activeFilterCount = 0;
  if (selectedSeries !== 'all') activeFilterCount += 1;
  if (selectedCity !== '全部城市') activeFilterCount += 1;
  if (hasKeyword) activeFilterCount += 1;

  const parts = [seriesLabel, cityLabel];
  if (hasKeyword) {
    parts.push(`“${cleanQuery.slice(0, 10)}”`);
  }

  return {
    seriesLabel,
    cityLabel,
    hasKeyword,
    keywordPreview: cleanQuery,
    activeFilterCount,
    summaryText: `${parts.join(' · ')} · ${matchedCount} 场候席`,
    matchedCount,
  };
}

const TIER_INDUSTRY_DISTRIBUTION_MAP: Record<
  MembershipTier['id'],
  TierIndustryDistributionProfile
> = {
  'free-guest': {
    tierId: 'free-guest',
    tierName: '自由访客会员',
    dominantSummary: '青年海归与跨行业探索者占比 60%',
    verifiedSampleSize: 420,
    crossCityRatioPct: 38,
    segments: [
      {
        industryId: 'cross-border',
        label: '跨境出海与全球增长',
        enLabel: 'Global DTC',
        sharePct: 32,
        colorHex: '#D8B98A',
        gradientCss: 'linear-gradient(90deg, #D8B98A 0%, #BF8943 100%)',
      },
      {
        industryId: 'ai-tech',
        label: 'AI、硬科技与数字产品',
        enLabel: 'AI & Hardware',
        sharePct: 28,
        colorHex: '#BF8943',
        gradientCss: 'linear-gradient(90deg, #BF8943 0%, #8C622B 100%)',
      },
      {
        industryId: 'creative-arch',
        label: '建筑空间与先锋主理',
        enLabel: 'Architecture & Craft',
        sharePct: 18,
        colorHex: '#C86D74',
        gradientCss: 'linear-gradient(90deg, #5A1A1E 0%, #C86D74 100%)',
      },
      {
        industryId: 'investment-family',
        label: '一级市场投资与金融',
        enLabel: 'Capital & Finance',
        sharePct: 12,
        colorHex: '#9E8BC8',
        gradientCss: 'linear-gradient(90deg, #6E5B9A 0%, #D8B98A 100%)',
      },
      {
        industryId: 'biotech-health',
        label: '生命科学与运动社群',
        enLabel: 'Bio & Endurance',
        sharePct: 10,
        colorHex: '#6B99A8',
        gradientCss: 'linear-gradient(90deg, #4B7482 0%, #D8B98A 100%)',
      },
    ],
  },
  'salon-pass': {
    tierId: 'salon-pass',
    tierName: '酒会优享次卡',
    dominantSummary: 'AI 硬件与出海业务操盘手占比 64%',
    verifiedSampleSize: 268,
    crossCityRatioPct: 54,
    segments: [
      {
        industryId: 'ai-tech',
        label: 'AI 硬件与端侧算法',
        enLabel: 'AI & Edge Tech',
        sharePct: 34,
        colorHex: '#D8B98A',
        gradientCss: 'linear-gradient(90deg, #D8B98A 0%, #BF8943 100%)',
      },
      {
        industryId: 'cross-border',
        label: '独立站与海外渠道操盘',
        enLabel: 'Cross-Border Growth',
        sharePct: 30,
        colorHex: '#C86D74',
        gradientCss: 'linear-gradient(90deg, #5A1A1E 0%, #C86D74 100%)',
      },
      {
        industryId: 'creative-arch',
        label: '空间策展与买手品牌',
        enLabel: 'Curated Lifestyle',
        sharePct: 18,
        colorHex: '#BF8943',
        gradientCss: 'linear-gradient(90deg, #BF8943 0%, #D8B98A 100%)',
      },
      {
        industryId: 'investment-family',
        label: '早期科技美元基金',
        enLabel: 'Early-Stage VC',
        sharePct: 10,
        colorHex: '#9E8BC8',
        gradientCss: 'linear-gradient(90deg, #6E5B9A 0%, #D8B98A 100%)',
      },
      {
        industryId: 'biotech-health',
        label: '数字健康与穿戴创新',
        enLabel: 'Digital Health',
        sharePct: 8,
        colorHex: '#6B99A8',
        gradientCss: 'linear-gradient(90deg, #4B7482 0%, #D8B98A 100%)',
      },
    ],
  },
  starlight: {
    tierId: 'starlight',
    tierName: '星光年度会籍',
    dominantSummary: '跨城创业主理人与供应链合伙人占比 64%',
    verifiedSampleSize: 196,
    crossCityRatioPct: 76,
    segments: [
      {
        industryId: 'ai-tech',
        label: 'AI 与硬科技联合创始人',
        enLabel: 'AI Founders',
        sharePct: 36,
        colorHex: '#D8B98A',
        gradientCss: 'linear-gradient(90deg, #F4EFE6 0%, #D8B98A 55%, #BF8943 100%)',
      },
      {
        industryId: 'cross-border',
        label: '跨境品牌与柔性智造合伙人',
        enLabel: 'Global Supply & Brand',
        sharePct: 28,
        colorHex: '#BF8943',
        gradientCss: 'linear-gradient(90deg, #D8B98A 0%, #BF8943 100%)',
      },
      {
        industryId: 'investment-family',
        label: '双币基金 VP 与跨境并购',
        enLabel: 'Cross-Border Capital',
        sharePct: 18,
        colorHex: '#C86D74',
        gradientCss: 'linear-gradient(90deg, #5A1A1E 0%, #C86D74 100%)',
      },
      {
        industryId: 'creative-arch',
        label: '建筑事务所与美学顾问',
        enLabel: 'Spatial & Design',
        sharePct: 10,
        colorHex: '#9E8BC8',
        gradientCss: 'linear-gradient(90deg, #6E5B9A 0%, #D8B98A 100%)',
      },
      {
        industryId: 'biotech-health',
        label: '医疗器械出海与帆船社',
        enLabel: 'MedTech & Sailing',
        sharePct: 8,
        colorHex: '#6B99A8',
        gradientCss: 'linear-gradient(90deg, #4B7482 0%, #D8B98A 100%)',
      },
    ],
  },
  celestial: {
    tierId: 'celestial',
    tierName: '星辰黑金会籍',
    dominantSummary: '双币 GP、家办合伙人与实业二代占比 66%',
    verifiedSampleSize: 84,
    crossCityRatioPct: 92,
    segments: [
      {
        industryId: 'investment-family',
        label: '双币基金 GP 与单一家族办公室',
        enLabel: 'Family Office & GP',
        sharePct: 38,
        colorHex: '#BF8943',
        gradientCss: 'linear-gradient(90deg, #BF8943 0%, #D8B98A 65%, #F4EFE6 100%)',
      },
      {
        industryId: 'cross-border',
        label: '大湾区实业接班人与跨国渠道董事',
        enLabel: 'Industrial Next-Gen',
        sharePct: 28,
        colorHex: '#D8B98A',
        gradientCss: 'linear-gradient(90deg, #D8B98A 0%, #BF8943 100%)',
      },
      {
        industryId: 'ai-tech',
        label: '硬科技独角兽与具身智能 CEO',
        enLabel: 'DeepTech CEOs',
        sharePct: 20,
        colorHex: '#C86D74',
        gradientCss: 'linear-gradient(90deg, #5A1A1E 0%, #C86D74 100%)',
      },
      {
        industryId: 'creative-arch',
        label: '非标商业地产主理与当代藏家',
        enLabel: 'Bespoke Space & Patron',
        sharePct: 8,
        colorHex: '#9E8BC8',
        gradientCss: 'linear-gradient(90deg, #6E5B9A 0%, #D8B98A 100%)',
      },
      {
        industryId: 'biotech-health',
        label: '深港私人医疗与细胞抗衰主理',
        enLabel: 'Longevity Clinic',
        sharePct: 6,
        colorHex: '#6B99A8',
        gradientCss: 'linear-gradient(90deg, #4B7482 0%, #D8B98A 100%)',
      },
    ],
  },
};

export function getTierIndustryDistribution(
  tierId: MembershipTier['id']
): TierIndustryDistributionProfile {
  return (
    TIER_INDUSTRY_DISTRIBUTION_MAP[tierId] ||
    TIER_INDUSTRY_DISTRIBUTION_MAP.starlight
  );
}

export const HERO_POETIC_CHAPTERS: Array<
  Omit<HeroPoeticBreathingChapter, 'chapterIndex' | 'scrollProgressRatio'>
> = [
  {
    id: 'midnight',
    chapterCode: 'ACT I · MIDNIGHT',
    themeWord: '午夜',
    enWord: 'MIDNIGHT',
    poeticPhrase: '当写字楼的灯光渐次熄灭，城市真正有质感的对话才刚刚醒来。',
    subWhisper: '21:30 · 华侨城隐室与外滩暗调剧场，为同频者留一盏温润的琥珀光',
  },
  {
    id: 'salon',
    chapterCode: 'ACT II · SALON',
    themeWord: '酒会',
    enWord: 'SALON',
    poeticPhrase: '单一麦芽在冰球上轻轻旋转，二十八人的微醺恰好卸下所有头衔与防备。',
    subWhisper: '22:15 · 没有生硬的寒暄与推销，只有恰当的酒意、爵士与跨界好奇心',
  },
  {
    id: 'private-talk',
    chapterCode: 'ACT III · PRIVATE TALK',
    themeWord: '私谈',
    enWord: 'PRIVATE TALK',
    poeticPhrase: '不必交换三十张冷冰冰的名片，在长桌尾声的一次颔首，足以开启三年的同行。',
    subWhisper: '23:10 · 从一次微醺夜话到跨城深聊，让每一次初次相识都像久别重逢',
  },
];

export function resolveHeroPoeticBreathingPhrase(
  scrollY: number,
  overrideIndex?: number | null
): HeroPoeticBreathingChapter {
  const clampedScroll = Math.max(0, Math.min(600, scrollY || 0));
  const scrollProgressRatio = Number((clampedScroll / 600).toFixed(3));

  let chapterIndex = 0;
  if (typeof overrideIndex === 'number' && overrideIndex >= 0 && overrideIndex < 3) {
    chapterIndex = overrideIndex;
  } else if (clampedScroll >= 240) {
    chapterIndex = 2;
  } else if (clampedScroll >= 90) {
    chapterIndex = 1;
  } else {
    chapterIndex = 0;
  }

  const chapter = HERO_POETIC_CHAPTERS[chapterIndex] || HERO_POETIC_CHAPTERS[0];

  return {
    ...chapter,
    chapterIndex,
    scrollProgressRatio,
  };
}

export const CLUB_LOUNGE_ZONES: Array<{
  sectionId: string;
  zoneTitle: string;
  polarity: LoungeZonePolarity;
}> = [
  {
    sectionId: 'top',
    zoneTitle: 'ZONE 01 · 前厅琥珀光廊 (Amber Foyer)',
    polarity: 'amber-glow',
  },
  {
    sectionId: 'live-stream',
    zoneTitle: 'ZONE 02 · 吧台微光走廊 (Whisper Corridor)',
    polarity: 'obsidian-shadow',
  },
  {
    sectionId: 'philosophy',
    zoneTitle: 'ZONE 03 · 威士忌暗影阁 (Chiaroscuro Salon)',
    polarity: 'amber-glow',
  },
  {
    sectionId: 'gatherings',
    zoneTitle: 'ZONE 04 · 烛光画廊展厅 (Candlelight Gallery)',
    polarity: 'obsidian-shadow',
  },
  {
    sectionId: 'sandbox',
    zoneTitle: 'ZONE 05 · 私密沙盘书房 (Curator Study)',
    polarity: 'amber-glow',
  },
  {
    sectionId: 'membership',
    zoneTitle: 'ZONE 06 · 黑金典藏内室 (Obsidian Vault)',
    polarity: 'obsidian-shadow',
  },
  {
    sectionId: 'stories',
    zoneTitle: 'ZONE 07 · 壁炉夜话回廊 (Hearthside Alcove)',
    polarity: 'amber-glow',
  },
  {
    sectionId: 'field-notes',
    zoneTitle: 'ZONE 08 · 留声档案暗房 (Archive Darkroom)',
    polarity: 'obsidian-shadow',
  },
  {
    sectionId: 'apply',
    zoneTitle: 'ZONE 09 · 主理人迎宾席 (Concierge Sanctum)',
    polarity: 'amber-glow',
  },
];

export function computeSectionChiaroscuroProfile(
  sectionIndex: number,
  scrollY: number,
  sectionTopRelativeToViewport = 0,
  viewportHeight = 900,
  reducedMotion = false
): SectionChiaroscuroProfile {
  const safeIdx = Math.max(0, Math.min(CLUB_LOUNGE_ZONES.length - 1, sectionIndex));
  const zoneMeta = CLUB_LOUNGE_ZONES[safeIdx] || {
    sectionId: `section-${safeIdx}`,
    zoneTitle: `ZONE 0${safeIdx + 1}`,
    polarity: safeIdx % 2 === 0 ? 'amber-glow' : 'obsidian-shadow',
  };

  if (reducedMotion) {
    return {
      sectionIndex: safeIdx,
      sectionId: zoneMeta.sectionId,
      zoneTitle: zoneMeta.zoneTitle,
      polarity: zoneMeta.polarity,
      luminanceDelta: 1,
      boundaryBlurPx: 0,
      parallaxShiftY: 0,
      ambientGlowOpacity: 0.1,
      ambientGradientCss:
        zoneMeta.polarity === 'amber-glow'
          ? 'radial-gradient(circle at 24% 30%, rgba(216, 185, 138, 0.11) 0%, rgba(11, 11, 12, 0) 70%)'
          : 'radial-gradient(circle at 76% 35%, rgba(90, 26, 30, 0.14) 0%, rgba(11, 11, 12, 0) 70%)',
    };
  }

  const safeViewport = Math.max(400, viewportHeight || 900);
  const clampedScroll = Math.max(0, scrollY || 0);

  // Alternating phase (+1 for even amber-glow sections, -1 for odd obsidian-shadow sections)
  const polaritySign = zoneMeta.polarity === 'amber-glow' ? 1 : -1;

  // Normalized scroll wave so adjacent sections breathe in opposite light/dark rhythm
  const waveAngle = (clampedScroll / 380) + safeIdx * 1.35;
  const waveOscillation = Math.sin(waveAngle);

  // Subtle brightness fluctuation between 0.94 and 1.06
  const rawLuminance = 1 + polaritySign * waveOscillation * 0.048;
  const luminanceDelta = Number(Math.max(0.94, Math.min(1.06, rawLuminance)).toFixed(3));

  // Distance from viewport center determines transition threshold blur
  const normalizedOffset = Math.min(
    1.2,
    Math.abs(sectionTopRelativeToViewport) / (safeViewport * 0.75)
  );
  // Subtle scroll-parallax blur when crossing between sections (0.4px at rest/center, up to 2.8px at seam)
  const scrollVelocityFactor = Math.abs(Math.sin(clampedScroll / 220)) * 0.9;
  const boundaryBlurPx = Number(
    Math.min(3.0, Math.max(0.3, normalizedOffset * 1.9 + scrollVelocityFactor)).toFixed(2)
  );

  // Parallax vertical float for the inter-section light-and-shadow veil (-14px to +14px)
  const parallaxShiftY = Number(
    (Math.cos(waveAngle) * 11 * polaritySign).toFixed(1)
  );

  const ambientGlowOpacity = Number(
    (0.09 + (luminanceDelta - 0.94) * 1.15).toFixed(3)
  );

  const focalX = zoneMeta.polarity === 'amber-glow' ? 24 : 76;
  const ambientGradientCss =
    zoneMeta.polarity === 'amber-glow'
      ? `radial-gradient(circle at ${focalX}% 32%, rgba(216, 185, 138, ${ambientGlowOpacity}) 0%, rgba(191, 137, 67, 0.05) 45%, rgba(11, 11, 12, 0) 74%)`
      : `radial-gradient(circle at ${focalX}% 38%, rgba(90, 26, 30, ${Number((ambientGlowOpacity * 1.25).toFixed(3))}) 0%, rgba(21, 21, 23, 0.22) 52%, rgba(11, 11, 12, 0) 76%)`;

  return {
    sectionIndex: safeIdx,
    sectionId: zoneMeta.sectionId,
    zoneTitle: zoneMeta.zoneTitle,
    polarity: zoneMeta.polarity,
    luminanceDelta,
    boundaryBlurPx,
    parallaxShiftY,
    ambientGlowOpacity,
    ambientGradientCss,
  };
}

export const CURATOR_DIALOGUE_QUESTIONS: [
  CuratorDialogueQuestion,
  CuratorDialogueQuestion,
  CuratorDialogueQuestion,
] = [
  {
    roundNumber: 1,
    roundCode: 'ROUND 01 / 03 · 夜晚能量场',
    dimensionTitle: '当下心境与社交距离',
    curatorPrompt:
      '“很高兴在今晚的会所廊道遇见你。走出白天的繁忙日程，此刻你内心更渴望怎样的能量场与相处距离？”',
    options: [
      {
        id: 'r1-tipsy-unwind',
        label: '微醺松弛 · 卸下头衔与防备',
        subtitle: '想在黑胶爵士与单一麦芽的微醺光影里，自然遇见聊得来的同频新朋友',
        mappedRhythm: 'tipsy-salon',
        mappedSeries: 'networking',
        moodTag: '微醺松弛',
      },
      {
        id: 'r1-closed-depth',
        label: '闭门深谈 · 12 人长桌智识共鸣',
        subtitle: '不想应付泛泛寒暄，渴望在控场严密的长桌私宴上与操盘手深聊真问题',
        mappedRhythm: 'closed-banquet',
        mappedSeries: 'private-dinner',
        moodTag: '闭门深谈',
      },
      {
        id: 'r1-coastal-breeze',
        label: '海风破界 · 吹散焦虑的海岸航行',
        subtitle: '想彻底跳出写字楼与会议室，在维港日落帆船或甲板海风中建立真实信任',
        mappedRhythm: 'coastal-sport',
        mappedSeries: 'yacht-sport',
        moodTag: '海风破界',
      },
      {
        id: 'r1-unserious-spark',
        label: '反严肃灵感 · 跨学科奇思妙想',
        subtitle: '厌倦了千篇一律的商业路演，想听建筑师、艺术家与创业者聊聊「不务正业」的热爱',
        mappedRhythm: 'frontier-forum',
        mappedSeries: 'culture-lifestyle',
        moodTag: '跨界灵感',
      },
    ],
  },
  {
    roundNumber: 2,
    roundCode: 'ROUND 02 / 03 · 精神张力',
    dimensionTitle: '最令你眼睛发亮的深夜议题',
    curatorPrompt:
      '“明白了。如果今晚邻座恰好坐着一位背景契合的同路人，哪一个话题最能让你立刻放下手机、倾身深聊？”',
    options: [
      {
        id: 'r2-ai-global',
        label: 'AI 硬件破局与全球化货架',
        subtitle: '从硅谷与深圳湾的产品工程，聊到欧美本土渠道入驻与众筹冷启动实战',
        mappedIndustry: 'ai-tech',
        mappedSeries: 'ai-global',
        moodTag: '硬科技与出海',
      },
      {
        id: 'r2-capital-legacy',
        label: '跨周期资本配置与实业接班',
        subtitle: '双币家办视角、珠三角制造家族新增长并购，以及不急于求成的耐心资本',
        mappedIndustry: 'investment-family',
        mappedSeries: 'private-dinner',
        moodTag: '长线资本与实业',
      },
      {
        id: 'r2-spatial-aesthetics',
        label: '空间建筑美学与五感买手品牌',
        subtitle: '存量街区暗调威士忌廊改造、东方沙龙香氛，以及当代设计与商业的平衡',
        mappedIndustry: 'creative-arch',
        mappedSeries: 'culture-lifestyle',
        moodTag: '空间与审美叙事',
      },
      {
        id: 'r2-returnee-life',
        label: '海归身份重构与双城生活主义',
        subtitle: '从伦敦、纽约或湾区归来后的真实落差、深港沪跨城节奏与长期生活伙伴',
        mappedIndustry: 'cross-border',
        mappedSeries: 'networking',
        moodTag: '海归双城共鸣',
      },
    ],
  },
  {
    roundNumber: 3,
    roundCode: 'ROUND 03 / 03 · 离场余韵',
    dimensionTitle: '今晚散场时最想带走的收获',
    curatorPrompt:
      '“最后一个问题：当夜色渐深、今晚的聚会圆满散场时，你最希望自己带着哪一种余韵离开？”',
    options: [
      {
        id: 'r3-two-confidants',
        label: '一两位可随时约酒的长期挚友',
        subtitle: '不必交换三十张冷冰冰的名片，只要有一两个人能约下周的深夜威士忌或早咖',
        moodTag: '知己长谈',
      },
      {
        id: 'r3-business-spark',
        label: '一个可落地的跨境/跨界合作火花',
        subtitle: '在微醺与长桌间自然敲定一次样品内测、渠道互访或联合出品共识',
        moodTag: '共创火花',
      },
      {
        id: 'r3-aesthetic-recharge',
        label: '一次抽离日常的感官与审美充电',
        subtitle: '被考究的侍酒、黑胶爵士与多元人生故事治愈，重新找回对生活敏锐的感知力',
        moodTag: '审美治愈',
      },
      {
        id: 'r3-curator-intro',
        label: '由主理人提前铺垫的 1V1 精准引见',
        subtitle: '希望主理人预先了解我的阶段诉求，在现场自然地为我引荐最互补的那位嘉宾',
        moodTag: '定向引荐',
      },
    ],
  },
];

export function evaluateCuratorMoodDialogue(
  input: CuratorMoodDialogueInput
): CuratorMoodRecommendationResult {
  const safeCity: Exclude<CityName, '全部城市'> = input.city || '深圳';

  const r1Option =
    CURATOR_DIALOGUE_QUESTIONS[0].options.find((o) => o.id === input.round1OptionId) ||
    CURATOR_DIALOGUE_QUESTIONS[0].options[0];
  const r2Option =
    CURATOR_DIALOGUE_QUESTIONS[1].options.find((o) => o.id === input.round2OptionId) ||
    CURATOR_DIALOGUE_QUESTIONS[1].options[0];
  const r3Option =
    CURATOR_DIALOGUE_QUESTIONS[2].options.find((o) => o.id === input.round3OptionId) ||
    CURATOR_DIALOGUE_QUESTIONS[2].options[0];

  const cleanNote = (input.customMoodNote || '').trim();

  // Score all curated events based on the 3-round answers and city preference
  const scored = CURATED_EVENTS.map((ev) => {
    let score = 0;

    // City match
    if (ev.city === safeCity) {
      score += 36;
    }

    // Round 1 series match (energy & intimacy distance)
    if (r1Option.mappedSeries && ev.series === r1Option.mappedSeries) {
      score += 42;
    }

    // Round 2 topic/series match (intellectual tension)
    if (r2Option.mappedSeries && ev.series === r2Option.mappedSeries) {
      score += 38;
    }

    // Round 3 aftertaste nuance
    if (r3Option.id === 'r3-business-spark' && (ev.series === 'ai-global' || ev.series === 'private-dinner')) {
      score += 24;
    } else if (r3Option.id === 'r3-two-confidants' && (ev.series === 'networking' || ev.series === 'yacht-sport')) {
      score += 24;
    } else if (r3Option.id === 'r3-aesthetic-recharge' && (ev.series === 'culture-lifestyle' || ev.series === 'networking')) {
      score += 24;
    } else if (r3Option.id === 'r3-curator-intro' && ev.series === 'private-dinner') {
      score += 26;
    }

    // Custom note keyword boost
    if (cleanNote.length > 0) {
      const lowerNote = cleanNote.toLowerCase();
      if (/帆船|海|运动|游艇|香港/.test(lowerNote) && ev.series === 'yacht-sport') score += 35;
      if (/私宴|长桌|闭门|投资|家办/.test(lowerNote) && ev.series === 'private-dinner') score += 35;
      if (/ai|硬件|出海|跨境|科技/.test(lowerNote) && ev.series === 'ai-global') score += 35;
      if (/建筑|艺术|乱讲|ppt|设计|灵感/.test(lowerNote) && ev.series === 'culture-lifestyle') score += 35;
      if (/爵士|微醺|酒会|认识/.test(lowerNote) && ev.series === 'networking') score += 35;
    }

    return { ev, score };
  }).sort((a, b) => b.score - a.score);

  const primaryEvent = scored[0]?.ev || CURATED_EVENTS[0];
  const secondaryEvent = scored[1]?.ev || CURATED_EVENTS[1] || CURATED_EVENTS[0];

  const resonanceScore = Math.min(
    99,
    Math.max(93, 94 + (primaryEvent.city === safeCity ? 3 : 1) + (cleanNote.length > 2 ? 1 : 0))
  );

  const moodPersonaTitle = `${r1Option.moodTag} × ${r2Option.moodTag} · ${r3Option.moodTag}寻觅者`;

  const noteEcho =
    cleanNote.length > 0
      ? `特别是你提到「${cleanNote.slice(0, 28)}」，`
      : '';

  const curatorWhisperReply = `听完你的三轮选择，${noteEcho}我非常理解你此刻的心境——你不希望被拉进喧闹却空洞的应酬局，而是需要在【${r1Option.moodTag}】的尺度里，围绕【${r2Option.moodTag}】遇见真正能聊出【${r3Option.moodTag}】的人。我为你从本季档期中挑出了最契合你今夜频率的席位：`;

  const moodMatchReason = `本场「${primaryEvent.title}」控制在 ${primaryEvent.capacity} 人以内（当前仅余 ${primaryEvent.remainingSeats} 席），场域选在${primaryEvent.city}${primaryEvent.venue}。现场既有与你关注的「${r2Option.label}」高度同频的嘉宾结构，又保留了你期待的「${r3Option.label}」留白感。`;

  const curatedIcebreaker = `主理人将在你入场签到时，为你递上一张定制线索卡，并自然引见本场对「${primaryEvent.curatedTopics[0] || r2Option.label}」同样着迷的 2 位同频成员。`;

  return {
    moodPersonaTitle,
    resonanceScore,
    curatorWhisperReply,
    moodMatchReason,
    curatedIcebreaker,
    primaryEvent,
    secondaryEvent,
    evaluationSource: 'curated-engine',
  };
}

export function toggleWishlistEventIds(
  currentIds: string[],
  targetEventId: string
): {
  nextIds: string[];
  added: boolean;
} {
  const cleanIds = Array.from(new Set(currentIds.filter(Boolean)));
  const exists = cleanIds.includes(targetEventId);
  if (exists) {
    return {
      nextIds: cleanIds.filter((id) => id !== targetEventId),
      added: false,
    };
  }
  return {
    nextIds: [...cleanIds, targetEventId],
    added: true,
  };
}

export const WISHLIST_GROWTH_DIMENSION_STOPS: Array<{
  dimensionId: WishlistGrowthDimensionId;
  label: '寻求合作' | '扩充人脉' | '生活美学';
  enLabel: 'COLLABORATION' | 'NETWORKING' | 'AESTHETICS';
  defaultSliderValue: number;
  rangeMin: number;
  rangeMax: number;
  accentHex: string;
}> = [
  {
    dimensionId: 'seeking-collaboration',
    label: '寻求合作',
    enLabel: 'COLLABORATION',
    defaultSliderValue: 18,
    rangeMin: 0,
    rangeMax: 33,
    accentHex: '#BF8943',
  },
  {
    dimensionId: 'expanding-network',
    label: '扩充人脉',
    enLabel: 'NETWORKING',
    defaultSliderValue: 50,
    rangeMin: 34,
    rangeMax: 66,
    accentHex: '#D8B98A',
  },
  {
    dimensionId: 'lifestyle-aesthetics',
    label: '生活美学',
    enLabel: 'AESTHETICS',
    defaultSliderValue: 84,
    rangeMin: 67,
    rangeMax: 100,
    accentHex: '#C86D74',
  },
];

export function resolveWishlistGrowthExpectation(
  event: BolEvent,
  rawSliderValue = 50
): WishlistExpectationEntry {
  const sliderValue = Math.max(0, Math.min(100, Math.round(rawSliderValue)));

  let dimensionId: WishlistGrowthDimensionId = 'expanding-network';
  let dimensionLabel: '寻求合作' | '扩充人脉' | '生活美学' = '扩充人脉';
  let dimensionEn: 'COLLABORATION' | 'NETWORKING' | 'AESTHETICS' = 'NETWORKING';
  let accentColorHex = '#D8B98A';

  if (sliderValue <= 33) {
    dimensionId = 'seeking-collaboration';
    dimensionLabel = '寻求合作';
    dimensionEn = 'COLLABORATION';
    accentColorHex = '#BF8943';
  } else if (sliderValue >= 67) {
    dimensionId = 'lifestyle-aesthetics';
    dimensionLabel = '生活美学';
    dimensionEn = 'AESTHETICS';
    accentColorHex = '#C86D74';
  }

  // Compute focus intensity within the chosen dimension (72% to 99%)
  const centerMap: Record<WishlistGrowthDimensionId, number> = {
    'seeking-collaboration': 17,
    'expanding-network': 50,
    'lifestyle-aesthetics': 84,
  };
  const distanceFromCenter = Math.abs(sliderValue - centerMap[dimensionId]);
  const intensityPct = Math.max(76, Math.min(99, Math.round(98 - distanceFromCenter * 0.85)));

  const primaryTopic = event.curatedTopics[0] || event.seriesLabel;

  let personalizedTip = '';
  let actionPreparationNote = '';

  if (dimensionId === 'seeking-collaboration') {
    personalizedTip = `【寻求合作 · 商业共创提示】针对「${event.title}」，主理人建议您在签到前锁定「${primaryTopic}」议题，现场将优先为您引见同场具备上下游供应链、渠道或资本协同潜力的操盘手。`;
    actionPreparationNote = '建议准备：1 句话业务互补切入点 · 可申请主理人中场 1V1 定向撮合';
  } else if (dimensionId === 'expanding-network') {
    personalizedTip = `【扩充人脉 · 跨界同频提示】本场（${event.city} · ${event.capacity}人边界）将启用「同频连接线索卡」，为您跨行业匹配 3–4 位非同业但认知同频的海归校友与主理人。`;
    actionPreparationNote = '建议准备：开放好奇的破冰问题 · 散场后自动接入同场校友微醺小群';
  } else {
    personalizedTip = `【生活美学 · 审美松弛提示】在「${event.venue}」的暗调光影里，建议卸下商务KPI，沉浸体验侍酒师特调与「${primaryTopic}」的感官碰撞，让高质量关系在松弛余韵中自然生长。`;
    actionPreparationNote = `建议着装：${event.dressCode} · 提前 15 分钟入场享迎宾微醺时刻`;
  }

  return {
    eventId: event.id,
    sliderValue,
    dimensionId,
    dimensionLabel,
    dimensionEn,
    intensityPct,
    personalizedTip,
    actionPreparationNote,
    accentColorHex,
  };
}

export function buildPersonalWishlistSummary(
  wishlistIds: string[],
  allEvents: BolEvent[] = CURATED_EVENTS,
  rawSliderByEventId: Record<string, number> = {}
): PersonalWishlistSummary {
  const cleanIds = Array.from(new Set((wishlistIds || []).filter(Boolean)));
  const items: BolEvent[] = [];

  for (const id of cleanIds) {
    const found = allEvents.find((ev) => ev.id === id);
    if (found) {
      items.push(found);
    }
  }

  const citiesCovered = Array.from(
    new Set(items.map((ev) => ev.city))
  ) as Array<Exclude<CityName, '全部城市'>>;
  const seriesCovered = Array.from(new Set(items.map((ev) => ev.seriesLabel)));

  const totalMemberCost = items.reduce((sum, ev) => sum + ev.memberPrice, 0);
  const totalStandardCost = items.reduce((sum, ev) => sum + ev.standardPrice, 0);
  const memberSavingsAmount = Math.max(0, totalStandardCost - totalMemberCost);

  const expectationsByEventId: Record<string, WishlistExpectationEntry> = {};
  const dimensionCount: Record<WishlistGrowthDimensionId, number> = {
    'seeking-collaboration': 0,
    'expanding-network': 0,
    'lifestyle-aesthetics': 0,
  };

  for (const ev of items) {
    const defaultVal =
      ev.series === 'ai-global' || ev.series === 'private-dinner'
        ? 18
        : ev.series === 'networking'
          ? 50
          : 84;
    const sliderVal =
      typeof rawSliderByEventId[ev.id] === 'number'
        ? rawSliderByEventId[ev.id]
        : defaultVal;
    const entry = resolveWishlistGrowthExpectation(ev, sliderVal);
    expectationsByEventId[ev.id] = entry;
    dimensionCount[entry.dimensionId] += 1;
  }

  let conciergeBundleAdvice =
    '点击任一活动卡片上的「收藏」，即可滑动设定个人成长预期维度，并在右侧心愿单获取专属赴约提示。';

  if (items.length === 1) {
    conciergeBundleAdvice = `心愿单已收录「${items[0].title}」。持 BoL 会员或酒会次卡入席本场立省 ¥${memberSavingsAmount}，主理人可提前为您锁定同频桌友。`;
  } else if (items.length >= 2) {
    const cityStr = citiesCovered.join(' / ');
    conciergeBundleAdvice = `已跨【${cityStr}】收录 ${items.length} 场心仪聚会。使用星光会籍或优享次卡组合预约预计立省 ¥${memberSavingsAmount}，主理人将为您串联多场次连续引荐。`;
  }

  let portfolioGrowthTip =
    '暂未设定心愿单预期维度。收藏活动后滑动选择「寻求合作 / 扩充人脉 / 生活美学」，系统将为您生成定制化赴约锦囊。';

  if (items.length > 0) {
    const activeDims = (
      Object.entries(dimensionCount) as Array<[WishlistGrowthDimensionId, number]>
    )
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    const dimNameMap: Record<WishlistGrowthDimensionId, string> = {
      'seeking-collaboration': '寻求合作',
      'expanding-network': '扩充人脉',
      'lifestyle-aesthetics': '生活美学',
    };

    const topDim = activeDims[0]?.[0] || 'expanding-network';
    const breakdownStr = activeDims
      .map(([dim, cnt]) => `${dimNameMap[dim]}×${cnt}`)
      .join(' · ');

    if (topDim === 'seeking-collaboration') {
      portfolioGrowthTip = `您的心愿单重心偏向【寻求合作】（${breakdownStr}）：建议优先升级「星光/星辰会籍」，启用主理人会前 1V1 商业诉求建档，精准对接同场产业与渠道决策者。`;
    } else if (topDim === 'lifestyle-aesthetics') {
      portfolioGrowthTip = `您的心愿单重心偏向【生活美学】（${breakdownStr}）：主理人已为您标记微醺侍酒与空间艺术动线，助您在低防备感的感官共鸣中沉淀长期精神知己。`;
    } else {
      portfolioGrowthTip = `您的心愿单重心偏向【扩充人脉】（${breakdownStr}）：系统将为您跨场次避免重复同桌，最大化连接深、穗、港、沪四城多元行业海归校友。`;
    }
  }

  return {
    wishlistIds: items.map((ev) => ev.id),
    items,
    totalCount: items.length,
    citiesCovered,
    seriesCovered,
    totalMemberCost,
    totalStandardCost,
    memberSavingsAmount,
    conciergeBundleAdvice,
    expectationsByEventId,
    portfolioGrowthTip,
  };
}

export const BRAND_MICRO_VIDEO_REELS: [
  BrandMicroVideoReel,
  BrandMicroVideoReel,
  BrandMicroVideoReel,
] = [
  {
    id: 'reel-clinking-glasses',
    reelCode: 'REEL 01 · 00:08 LOOP',
    sceneType: 'clinking-glasses',
    title: '琥珀微光 · 酒杯轻碰的破冰瞬间',
    enSubtitle: 'CLINKING CRYSTAL & AMBER ICE',
    locationTag: '深圳南山 · 华侨城威士忌隐室',
    durationSec: 8,
    saturationPct: 35,
    visualCaption: '手凿冰球在古典杯中缓慢旋转，两只酒杯在暖金暗光下轻轻相碰，没有喧哗劝酒，只有恰到好处的颔首致意。',
    atmosphereDetail: '低饱和度暗金影调 · 35% 饱和度 · 28 人微醺控场切片',
    filterCss: 'saturate(0.35) contrast(1.08) brightness(0.95)',
  },
  {
    id: 'reel-private-talk',
    reelCode: 'REEL 02 · 00:10 LOOP',
    sceneType: 'private-talk-silhouette',
    title: '长桌私谈 · 烛光里的倾身深聊剪影',
    enSubtitle: 'CANDLELIT LONG-TABLE SILHOUETTE',
    locationTag: '广州珠江新城 · 12 人闭门私宴厅',
    durationSec: 10,
    saturationPct: 32,
    visualCaption: '烛火在醒酒器皿与「连接线索卡」边缘投下温润暗影，两位跨行业主理人倾身低语，散场后关系仍在生长。',
    atmosphereDetail: '低饱和度暖褐胶片感 · 32% 饱和度 · 12 人严选长桌切片',
    filterCss: 'saturate(0.32) contrast(1.12) brightness(0.94)',
  },
  {
    id: 'reel-vinyl-harbor',
    reelCode: 'REEL 03 · 00:09 LOOP',
    sceneType: 'vinyl-harbor-dusk',
    title: '黑胶与暮色 · 唱针落下时的甲板夜话',
    enSubtitle: 'VINYL GROOVE & HARBOR TWILIGHT',
    locationTag: '香港维港 / 上海静安暗调剧场',
    durationSec: 9,
    saturationPct: 36,
    visualCaption: '黑胶唱针缓缓落入爵士慢板，远处维港暮色与室内暖光交叠，同频者在松弛的节奏里卸下整周的防备。',
    atmosphereDetail: '低饱和度银盐暗调 · 36% 饱和度 · 跨城夜话余韵切片',
    filterCss: 'saturate(0.36) contrast(1.10) brightness(0.95)',
  },
];

export function getBrandMicroVideoStreamState(
  activeReelIndex = 0,
  isPlaying = true
): {
  reels: [BrandMicroVideoReel, BrandMicroVideoReel, BrandMicroVideoReel];
  activeReel: BrandMicroVideoReel;
  normalizedIndex: number;
  nextIndex: number;
  isPlaying: boolean;
  saturationModeLabel: string;
} {
  const total = BRAND_MICRO_VIDEO_REELS.length;
  const normalizedIndex = ((activeReelIndex % total) + total) % total;
  const activeReel = BRAND_MICRO_VIDEO_REELS[normalizedIndex];
  const nextIndex = (normalizedIndex + 1) % total;

  return {
    reels: BRAND_MICRO_VIDEO_REELS,
    activeReel,
    normalizedIndex,
    nextIndex,
    isPlaying,
    saturationModeLabel: `LOW-SATURATION ARCHIVE · 低饱和度影调 (${activeReel.saturationPct}%)`,
  };
}

export const BOL_FIRST_SCREEN_SKELETON_BLOCKS: [
  FirstScreenSkeletonBlockSpec,
  FirstScreenSkeletonBlockSpec,
  FirstScreenSkeletonBlockSpec,
  FirstScreenSkeletonBlockSpec,
] = [
  {
    id: 'skeleton-topnav-zone',
    zoneKey: 'topnav',
    label: '顶部品牌导航流光骨架构件',
    enLabel: 'TOP NAVIGATION BAR · WINE & CHAMPAGNE FILAMENT',
    gridSpanClass: 'col-span-12',
    shimmerDelayMs: 0,
    lusterGradientCss:
      'linear-gradient(110deg, rgba(21,21,23,0.94) 10%, rgba(90,26,30,0.62) 36%, rgba(216,185,138,0.52) 50%, rgba(191,137,67,0.38) 64%, rgba(21,21,23,0.94) 88%)',
    borderAccentCss: 'rgba(216, 185, 138, 0.34)',
  },
  {
    id: 'skeleton-hero-editorial-zone',
    zoneKey: 'hero-editorial',
    label: '首屏主叙事与午夜酒会私谈诗学骨架',
    enLabel: 'HERO EDITORIAL & NOCTURNE RITUAL STAGE',
    gridSpanClass: 'col-span-12 lg:col-span-7',
    shimmerDelayMs: 110,
    lusterGradientCss:
      'linear-gradient(112deg, rgba(21,21,23,0.95) 14%, rgba(90,26,30,0.68) 38%, rgba(216,185,138,0.56) 52%, rgba(191,137,67,0.42) 66%, rgba(21,21,23,0.95) 88%)',
    borderAccentCss: 'rgba(216, 185, 138, 0.42)',
  },
  {
    id: 'skeleton-hero-atmosphere-zone',
    zoneKey: 'hero-atmosphere',
    label: '三环同频场与四城光影坐标骨架',
    enLabel: 'THREE-RING ORBITAL & FOUR-CITY SANCTUM',
    gridSpanClass: 'col-span-12 lg:col-span-5',
    shimmerDelayMs: 220,
    lusterGradientCss:
      'linear-gradient(114deg, rgba(21,21,23,0.95) 12%, rgba(90,26,30,0.72) 34%, rgba(191,137,67,0.50) 50%, rgba(216,185,138,0.54) 64%, rgba(21,21,23,0.95) 88%)',
    borderAccentCss: 'rgba(90, 26, 30, 0.68)',
  },
  {
    id: 'skeleton-live-stream-zone',
    zoneKey: 'live-stream',
    label: '实时社群动态微缩流骨架',
    enLabel: 'LIVE COMMUNITY CONSENSUS TICKER',
    gridSpanClass: 'col-span-12',
    shimmerDelayMs: 310,
    lusterGradientCss:
      'linear-gradient(108deg, rgba(21,21,23,0.94) 16%, rgba(90,26,30,0.58) 40%, rgba(216,185,138,0.46) 54%, rgba(191,137,67,0.34) 68%, rgba(21,21,23,0.94) 88%)',
    borderAccentCss: 'rgba(191, 137, 67, 0.36)',
  },
];

export function computeFirstScreenSkeletonState(
  elapsedMs: number,
  totalDurationMs = 960,
  options?: {
    autostart?: boolean;
    holdSkeleton?: boolean;
    reducedMotion?: boolean;
    forceDismissed?: boolean;
  }
): FirstScreenSkeletonState {
  const safeDuration = Math.max(240, totalDurationMs);
  const safeElapsed = Math.max(0, elapsedMs);

  const primaryLusterGradientCss =
    'linear-gradient(112deg, #151517 8%, #5A1A1E 34%, #D8B98A 50%, #BF8943 66%, #151517 92%)';
  const ambientBackdropCss =
    'radial-gradient(circle at 22% 24%, rgba(90, 26, 30, 0.52) 0%, rgba(216, 185, 138, 0.16) 36%, rgba(11, 11, 12, 1) 74%), linear-gradient(180deg, #0B0B0C 0%, #0B0B0C 100%)';

  if (options?.forceDismissed || options?.autostart) {
    return {
      isVisible: false,
      phaseId: 'complete',
      phaseLabel: '首屏流光序幕已启幕 · 欢迎入席',
      ritualSubcopy: '深港广沪四城私密同频场域已就绪',
      progressPct: 100,
      burgundyHex: '#5A1A1E',
      champagneHex: '#D8B98A',
      memberGoldHex: '#BF8943',
      primaryLusterGradientCss,
      ambientBackdropCss,
      blocks: BOL_FIRST_SCREEN_SKELETON_BLOCKS,
    };
  }

  if (options?.holdSkeleton) {
    return {
      isVisible: true,
      phaseId: 'champagne-flow',
      phaseLabel: '酒红与香槟金流光溢彩 · 正在校准四城夜话场域',
      ritualSubcopy: '勃艮第酒红 (#5A1A1E) 奠定私宴暗调，香槟金 (#D8B98A) 点亮同频三环',
      progressPct: 68,
      burgundyHex: '#5A1A1E',
      champagneHex: '#D8B98A',
      memberGoldHex: '#BF8943',
      primaryLusterGradientCss,
      ambientBackdropCss,
      blocks: BOL_FIRST_SCREEN_SKELETON_BLOCKS,
    };
  }

  const rawRatio = Math.min(1, safeElapsed / safeDuration);
  const progressPct = Math.min(100, Math.max(8, Math.round(rawRatio * 100)));

  if (rawRatio >= 1) {
    return {
      isVisible: false,
      phaseId: 'complete',
      phaseLabel: '首屏流光序幕已启幕 · 欢迎入席',
      ritualSubcopy: '深港广沪四城私密同频场域已就绪',
      progressPct: 100,
      burgundyHex: '#5A1A1E',
      champagneHex: '#D8B98A',
      memberGoldHex: '#BF8943',
      primaryLusterGradientCss,
      ambientBackdropCss,
      blocks: BOL_FIRST_SCREEN_SKELETON_BLOCKS,
    };
  }

  let phaseId: FirstScreenSkeletonPhaseId = 'wine-ignition';
  let phaseLabel = '勃艮第酒红底蕴 · 正在铺陈会所暗调骨架构件';
  let ritualSubcopy = '以 #5A1A1E 勃艮第酒红晕染大湾区与上海四城夜色轮廓';

  if (rawRatio >= 0.35 && rawRatio < 0.78) {
    phaseId = 'champagne-flow';
    phaseLabel = '酒红与香槟金流光溢彩 · 正在点亮三环同频场';
    ritualSubcopy = '以 #D8B98A 香槟金与 #BF8943 会员金流光掠过首屏叙事骨架';
  } else if (rawRatio >= 0.78) {
    phaseId = 'sanctum-unveil';
    phaseLabel = '流光敛入席位 · 即将为您揭幕今夜聚会选集';
    ritualSubcopy = '正在对齐深圳 · 广州 · 香港 · 上海实时社群动态与席位档案';
  }

  return {
    isVisible: true,
    phaseId,
    phaseLabel,
    ritualSubcopy,
    progressPct,
    burgundyHex: '#5A1A1E',
    champagneHex: '#D8B98A',
    memberGoldHex: '#BF8943',
    primaryLusterGradientCss,
    ambientBackdropCss,
    blocks: BOL_FIRST_SCREEN_SKELETON_BLOCKS,
  };
}

const STORY_COLLISION_PRESETS: Record<
  string,
  {
    graphHeadline: string;
    opportunities: [
      Omit<CrossIndustryOpportunityNode, 'id' | 'opportunityIndex' | 'x' | 'y'>,
      Omit<CrossIndustryOpportunityNode, 'id' | 'opportunityIndex' | 'x' | 'y'>,
      Omit<CrossIndustryOpportunityNode, 'id' | 'opportunityIndex' | 'x' | 'y'>,
    ];
  }
> = {
  'story-ethan-ai': {
    graphHeadline: '从硅谷 AI 硬件破冰，到打通北美商超货架与珠三角精密声学智造',
    opportunities: [
      {
        code: 'SPARK 01 · 渠道破壁',
        memberIndustryTag: '多模态 AI 硬件',
        counterpartIndustryTag: '北美线下商超渠道',
        collisionHeadline: 'AI 穿戴硬件 × 北美 BestBuy 零售网络',
        opportunityDetail:
          '在华侨城威士忌夜话通过「同频线索卡」同桌深聊，跳过中间代理直接对接北美本土买手团队。',
        commercialOutcome: '敲定感恩节季北美 300+ 线下门店联合陈列试点',
        synergyScorePct: 97,
        linkedStageOrder: 1,
        accentHex: '#D8B98A',
      },
      {
        code: 'SPARK 02 · 智造咬合',
        memberIndustryTag: '硅谷端侧算法',
        counterpartIndustryTag: '大湾区精密声学制造二代',
        collisionHeadline: '硅谷交互工程 × 珠三角隐形冠军柔性产线',
        opportunityDetail:
          '升级星辰黑金会籍后，在 12 人闭门长桌私宴上由主理人引见东莞/深圳声学大厂接班人。',
        commercialOutcome: '打样周期缩短 45%，联合定义新一代智能音频单品',
        synergyScorePct: 98,
        linkedStageOrder: 2,
        accentHex: '#BF8943',
      },
      {
        code: 'SPARK 03 · 资本共振',
        memberIndustryTag: '出海硬件主理人',
        counterpartIndustryTag: '深港早期硬科技美元基金',
        collisionHeadline: '高毛利硬件现金流 × 跨境双币耐心资本',
        opportunityDetail:
          '联合出品第 14 期硬件出海夜话期间，与同场深港双币基金合伙人完成海外实地尽调闭环。',
        commercialOutcome: '完成 Pre-A 轮战略协同融资并建立常设硬件沙龙',
        synergyScorePct: 95,
        linkedStageOrder: 3,
        accentHex: '#C86D74',
      },
    ],
  },
  'story-chloe-arch': {
    graphHeadline: '从一场反严肃「乱讲 PPT」，到跨城执掌东方香氛与买手百货空间策展',
    opportunities: [
      {
        code: 'SPARK 01 · 五感转译',
        memberIndustryTag: '独立建筑空间设计',
        counterpartIndustryTag: '东方沙龙香氛品牌',
        collisionHeadline: '建筑结构力学 × 东方木质调嗅觉叙事',
        opportunityDetail:
          '在上海静安「乱讲 PPT」分享威士忌酒杯建筑力学后，与台下广州香氛创始人一拍即合。',
        commercialOutcome: '受邀担任该香氛品牌年度器物与气味展空间导演',
        synergyScorePct: 96,
        linkedStageOrder: 1,
        accentHex: '#D8B98A',
      },
      {
        code: 'SPARK 02 · 跨城买手',
        memberIndustryTag: '先锋策展事务所',
        counterpartIndustryTag: '独立买手百货主理人',
        collisionHeadline: '暗调剧场光影 × 沪穗双城非标商业零售',
        opportunityDetail:
          '凭星光会籍跨城赴约珠江秋夜 12 人长桌私宴，与买手百货主理人碰撞存量老建筑活化方案。',
        commercialOutcome: '承接深圳与上海双城旗舰买手空间整体建筑改造',
        synergyScorePct: 97,
        linkedStageOrder: 2,
        accentHex: '#BF8943',
      },
      {
        code: 'SPARK 03 · 艺术驻留',
        memberIndustryTag: '空间美学主理人',
        counterpartIndustryTag: '生成式视觉装置艺术',
        collisionHeadline: '实体水泥肌理 × 实时数字光影交互装置',
        opportunityDetail:
          '在社群主理人引荐下联合新媒体艺术家，将动态光影植入线下复合美学空间。',
        commercialOutcome: '联合出资落地双城快闪空间，成为 BoL 常驻线下据点',
        synergyScorePct: 94,
        linkedStageOrder: 3,
        accentHex: '#C86D74',
      },
    ],
  },
  'story-victor-capital': {
    graphHeadline: '从维港日落帆船协作，到深港双城家族实业并购与早期科技联合直投',
    opportunities: [
      {
        code: 'SPARK 01 · 航线破冰',
        memberIndustryTag: '香港单一家办配置',
        counterpartIndustryTag: '深圳便携医疗器械出海',
        collisionHeadline: '离岸家族耐心资本 × 医疗穿戴全球化现金流',
        opportunityDetail:
          '在中环至南丫岛日落帆船上共同拉帆破冰，卸下写字楼防御感，深度核对欧美合规渠道模型。',
        commercialOutcome: '完成首笔跨境可转债结构支持与欧洲分销引荐',
        synergyScorePct: 96,
        linkedStageOrder: 1,
        accentHex: '#D8B98A',
      },
      {
        code: 'SPARK 02 · 实业升级',
        memberIndustryTag: '跨境并购顾问',
        counterpartIndustryTag: '珠三角精密智造接班人',
        collisionHeadline: '香港离岸架构 × 大湾区制造家族二代转型',
        opportunityDetail:
          '通过星辰黑金 1V1 引荐实地走访 3 家大湾区先进制造企业，梳理海外品牌控股型并购路径。',
        commercialOutcome: '促成 2 宗跨国品牌并购架构搭建与家办联合跟投',
        synergyScorePct: 98,
        linkedStageOrder: 2,
        accentHex: '#BF8943',
      },
      {
        code: 'SPARK 03 · 智囊复利',
        memberIndustryTag: '双币资产管理',
        counterpartIndustryTag: '跨境税务与法律合规',
        collisionHeadline: '深港资本俱乐部 × 全球合规护航网络',
        opportunityDetail:
          '联合社群内跨境律师与科技创始人在深湾私宴发起常设闭门读书会，沉淀长期互助智囊。',
        commercialOutcome: '形成 18 位深港核心成员的月度跨境投融共创网络',
        synergyScorePct: 95,
        linkedStageOrder: 3,
        accentHex: '#C86D74',
      },
    ],
  },
  'story-sophia-dtc': {
    graphHeadline: '从海归爵士酒会着陆，到组建百万美金独立站核心团队与海岸运动社群',
    opportunities: [
      {
        code: 'SPARK 01 · 美学招募',
        memberIndustryTag: 'DTC 独立站增长',
        counterpartIndustryTag: '伦敦海归视觉艺术总监',
        collisionHeadline: '北美增长漏斗模型 × 欧洲买手级品牌视觉',
        opportunityDetail:
          '在深圳湾海归爵士酒会通过破冰分组结识刚从伦敦归国的视觉导演，当晚聊透品牌调性升级。',
        commercialOutcome: '成功邀请其作为联合创始人加盟，品牌客单价提升 65%',
        synergyScorePct: 97,
        linkedStageOrder: 1,
        accentHex: '#D8B98A',
      },
      {
        code: 'SPARK 02 · 流量共振',
        memberIndustryTag: '生活方式出海品牌',
        counterpartIndustryTag: '海外红人营销机构创始人',
        collisionHeadline: '独立站私域复购 × 欧美本土创作者联盟',
        opportunityDetail:
          '在沪深双城 AI 出海实战复盘沙龙上，与多位百万美金操盘手互换北美本土红人白名单。',
        commercialOutcome: 'Q3 海外自然流量占比翻倍，CAC 获客成本下降 32%',
        synergyScorePct: 96,
        linkedStageOrder: 2,
        accentHex: '#BF8943',
      },
      {
        code: 'SPARK 03 · 运动联名',
        memberIndustryTag: '耐力运动社群领队',
        counterpartIndustryTag: '新消费基金投资经理',
        collisionHeadline: '网球与海岸帆船场景 × 运动生活方式资本',
        opportunityDetail:
          '担任 BoL 周末城市运动领队期间，在球场与海上与消费投资人建立深厚信任与产品实测反馈。',
        commercialOutcome: '获早期消费基金追加投资并开启跨品类联名产品线',
        synergyScorePct: 94,
        linkedStageOrder: 3,
        accentHex: '#C86D74',
      },
    ],
  },
};

export function buildMemberGrowthConstellation(
  storyId: string,
  activeOpportunityIndex = 0
): MemberGrowthConstellationData {
  const story =
    MEMBER_STORIES.find((s) => s.id === storyId) || MEMBER_STORIES[0];
  const preset =
    STORY_COLLISION_PRESETS[story.id] || STORY_COLLISION_PRESETS['story-ethan-ai'];

  // 3 sequential growth stage spine nodes along the upper-middle trajectory (SVG viewBox 0 0 680 280)
  const stageCoords: Array<{ x: number; y: number }> = [
    { x: 115, y: 74 },
    { x: 340, y: 62 },
    { x: 565, y: 74 },
  ];

  const stageNodes: [
    ConstellationStageNode,
    ConstellationStageNode,
    ConstellationStageNode,
  ] = [0, 1, 2].map((idx) => {
    const ms = story.milestones[idx];
    const coord = stageCoords[idx];
    return {
      id: `${story.id}-stage-${idx + 1}`,
      stageOrder: (idx + 1) as 1 | 2 | 3,
      stageCode: `STAGE 0${idx + 1}`,
      stageTitle: ms.phase,
      sceneSubtitle: ms.sceneTitle,
      timeAndCity: ms.timepoint,
      x: coord.x,
      y: coord.y,
    };
  }) as [ConstellationStageNode, ConstellationStageNode, ConstellationStageNode];

  // 3 Cross-Industry Collision Opportunity nodes along the lower resonance arc
  const oppCoords: Array<{ x: number; y: number }> = [
    { x: 145, y: 212 },
    { x: 340, y: 224 },
    { x: 535, y: 212 },
  ];

  const opportunityNodes: [
    CrossIndustryOpportunityNode,
    CrossIndustryOpportunityNode,
    CrossIndustryOpportunityNode,
  ] = [0, 1, 2].map((idx) => {
    const item = preset.opportunities[idx];
    const coord = oppCoords[idx];
    return {
      ...item,
      id: `${story.id}-opp-${idx + 1}`,
      opportunityIndex: idx,
      x: coord.x,
      y: coord.y,
    };
  }) as [
    CrossIndustryOpportunityNode,
    CrossIndustryOpportunityNode,
    CrossIndustryOpportunityNode,
  ];

  // Build gentle curved SVG links:
  // 1) 2 Growth Spine curves connecting Stage 1 -> Stage 2 -> Stage 3
  // 2) 3 Cross-Industry Collision curves connecting each Stage to its Opportunity Node + cross-stage bridges
  const svgLinks: ConstellationAnimatedLink[] = [
    {
      id: `${story.id}-spine-1-2`,
      kind: 'growth-spine',
      fromNodeId: stageNodes[0].id,
      toNodeId: stageNodes[1].id,
      svgPath: `M ${stageNodes[0].x} ${stageNodes[0].y} C 200 32, 255 32, ${stageNodes[1].x} ${stageNodes[1].y}`,
      startX: stageNodes[0].x,
      startY: stageNodes[0].y,
      endX: stageNodes[1].x,
      endY: stageNodes[1].y,
      strokeHex: '#D8B98A',
      pulseDurationSec: 3.4,
    },
    {
      id: `${story.id}-spine-2-3`,
      kind: 'growth-spine',
      fromNodeId: stageNodes[1].id,
      toNodeId: stageNodes[2].id,
      svgPath: `M ${stageNodes[1].x} ${stageNodes[1].y} C 425 32, 480 32, ${stageNodes[2].x} ${stageNodes[2].y}`,
      startX: stageNodes[1].x,
      startY: stageNodes[1].y,
      endX: stageNodes[2].x,
      endY: stageNodes[2].y,
      strokeHex: '#BF8943',
      pulseDurationSec: 3.6,
    },
    ...opportunityNodes.map((opp, idx) => {
      const stage = stageNodes[idx];
      const ctrlX = (stage.x + opp.x) / 2 + (idx === 1 ? 26 : idx === 0 ? -24 : 24);
      const ctrlY = (stage.y + opp.y) / 2;
      return {
        id: `${story.id}-collision-${idx + 1}`,
        kind: 'industry-collision' as const,
        fromNodeId: stage.id,
        toNodeId: opp.id,
        svgPath: `M ${stage.x} ${stage.y} C ${ctrlX} ${ctrlY - 18}, ${ctrlX} ${ctrlY + 18}, ${opp.x} ${opp.y}`,
        startX: stage.x,
        startY: stage.y,
        endX: opp.x,
        endY: opp.y,
        strokeHex: opp.accentHex,
        pulseDurationSec: 2.8 + idx * 0.35,
        opportunityIndex: idx,
      };
    }),
    // Gentle cross-industry harmonic bridge between Opportunity 1 -> Opportunity 2 -> Opportunity 3
    {
      id: `${story.id}-opp-bridge-1-2`,
      kind: 'industry-collision',
      fromNodeId: opportunityNodes[0].id,
      toNodeId: opportunityNodes[1].id,
      svgPath: `M ${opportunityNodes[0].x} ${opportunityNodes[0].y} C 225 250, 265 250, ${opportunityNodes[1].x} ${opportunityNodes[1].y}`,
      startX: opportunityNodes[0].x,
      startY: opportunityNodes[0].y,
      endX: opportunityNodes[1].x,
      endY: opportunityNodes[1].y,
      strokeHex: '#5A1A1E',
      pulseDurationSec: 4.1,
      opportunityIndex: 1,
    },
    {
      id: `${story.id}-opp-bridge-2-3`,
      kind: 'industry-collision',
      fromNodeId: opportunityNodes[1].id,
      toNodeId: opportunityNodes[2].id,
      svgPath: `M ${opportunityNodes[1].x} ${opportunityNodes[1].y} C 415 250, 455 250, ${opportunityNodes[2].x} ${opportunityNodes[2].y}`,
      startX: opportunityNodes[1].x,
      startY: opportunityNodes[1].y,
      endX: opportunityNodes[2].x,
      endY: opportunityNodes[2].y,
      strokeHex: '#5A1A1E',
      pulseDurationSec: 4.3,
      opportunityIndex: 2,
    },
  ];

  const normalizedIdx = ((activeOpportunityIndex % 3) + 3) % 3;

  return {
    storyId: story.id,
    memberName: story.memberName,
    memberCoreIndustry: story.industryLabel,
    graphHeadline: preset.graphHeadline,
    stageNodes,
    opportunityNodes,
    svgLinks,
    activeOpportunityIndex: normalizedIdx,
    activeOpportunity: opportunityNodes[normalizedIdx],
  };
}




