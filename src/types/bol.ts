export type EventSeriesId =
  | 'all'
  | 'networking'
  | 'ai-global'
  | 'private-dinner'
  | 'yacht-sport'
  | 'culture-lifestyle';

export type CityName = '全部城市' | '深圳' | '广州' | '香港' | '上海';

export type IndustryDomainId =
  | 'ai-tech'
  | 'cross-border'
  | 'investment-family'
  | 'creative-arch'
  | 'biotech-health';

export type SocialRhythmId =
  | 'tipsy-salon'
  | 'closed-banquet'
  | 'coastal-sport'
  | 'frontier-forum';

export interface EventFormula {
  /** 主题是什么 */
  whatIsIt: string;
  /** 适合谁来 */
  whoIsItFor: string;
  /** 现场会发生什么 */
  whatHappens: string;
  /** 为什么值得赴约 */
  whyAttend: string;
}

export interface BolEvent {
  id: string;
  code: string;
  title: string;
  englishSubtitle: string;
  series: Exclude<EventSeriesId, 'all'>;
  seriesLabel: string;
  city: Exclude<CityName, '全部城市'>;
  venue: string;
  date: string;
  timeRange: string;
  capacity: number;
  remainingSeats: number;
  memberPrice: number;
  standardPrice: number;
  dressCode: string;
  visualMood: 'wine-velvet' | 'champagne-noir' | 'harbor-amber' | 'emerald-obsidian' | 'warm-brass' | 'salon-glow';
  atmosphereNote: string;
  formula: EventFormula;
  curatedTopics: string[];
  hostName: string;
  hostRole: string;
}

export interface BrandTension {
  id: string;
  index: string;
  leftPole: string;
  leftEn: string;
  rightPole: string;
  rightEn: string;
  principle: string;
  sceneExample: string;
  defaultBalance: number; // 0 to 100
}

export interface MembershipTier {
  id: 'free-guest' | 'starlight' | 'celestial' | 'salon-pass';
  name: string;
  englishName: string;
  categoryLabel: '基础身份' | '年度会籍' | '年度黑金会籍' | '专项权益次卡';
  priceDisplay: string;
  billingCycle: string;
  positioning: string;
  targetAudience: string;
  accentColor: 'muted' | 'champagne' | 'member-gold' | 'wine';
  privileges: string[];
  cardRatioNote: string;
}

export interface FieldNoteArchive {
  id: string;
  gatheringTitle: string;
  cityAndDate: string;
  seriesLabel: string;
  participantComposition: string;
  reflectionQuote: string;
  memberName: string;
  memberRole: string;
  memberBackground: string;
  outcomeMetric: string;
  visualPlateType: 'glassware-light' | 'roundtable-shadow' | 'harbor-dusk';
}

export type ApplicationStageId =
  | 'submitted'
  | 'document_review'
  | 'background_check'
  | 'invitation_issued';

export type ApplicationEventTrigger =
  | 'ADVANCE_STAGE'
  | 'SET_DOCUMENT_REVIEW'
  | 'SET_BACKGROUND_CHECK'
  | 'SET_INVITATION_ISSUED'
  | 'RESET_TRACKER';

export interface ApplicationStageMetric {
  stageKey: 'document_review' | 'background_check' | 'invitation_issued';
  stageName: '资料审核' | '背景调研' | '入会邀约';
  enName: string;
  completionPct: number;
  rigorIndex: number;
  slaHours: number;
  status: 'completed' | 'active' | 'pending';
  statusLabel: string;
  auditDetail: string;
}

export interface ApplicationTrackerState {
  currentStage: ApplicationStageId;
  stageLabel: string;
  progressPercentage: number;
  activeStepIndex: number;
  canAdvance: boolean;
  nextTriggerLabel: string;
  conciergeNote: string;
  estimatedSla: string;
  stageMetrics: ApplicationStageMetric[];
}

export interface ApplicationSubmission {
  id: string;
  fullName: string;
  city: Exclude<CityName, '全部城市'>;
  backgroundSummary: string;
  industryDomain: IndustryDomainId;
  preferredRhythm: SocialRhythmId;
  wechatId: string;
  targetEventId?: string;
  targetTierId?: MembershipTier['id'];
  invitationCode: string;
  submittedAt: string;
  stage?: ApplicationStageId;
}

export interface CurationRecommendation {
  matchScore: number;
  primarySeries: Exclude<EventSeriesId, 'all'>;
  recommendedEvents: BolEvent[];
  recommendedTier: MembershipTier;
  rationale: string;
  peerClusterDescription: string;
  suggestedConnections: Array<{
    role: string;
    city: string;
    sharedTopic: string;
  }>;
}

export interface AiMembershipAssessment {
  eligibilityScore: number;
  statusLabel: string;
  recommendedTierId: MembershipTier['id'];
  recommendedTierName: string;
  personalizedAdvice: string;
  curatedFirstScene: string;
  valueHighlights: string[];
  evaluationSource: 'gemini-ai' | 'curated-engine';
}

export interface ParallaxLayerOffsets {
  backdropY: number;
  orbitalRingY: number;
  editorialTextY: number;
  canvasCardY: number;
  pillarsY: number;
  ambientScale: number;
}

export type EventSubscriptionState =
  | 'idle'
  | 'subscribed_alert'
  | 'priority_push_queued';

export type EventSubscriptionTrigger =
  | 'TOGGLE_SUBSCRIBE'
  | 'UPGRADE_PRIORITY_PUSH'
  | 'UNSUBSCRIBE';

export interface SubscriptionPreferenceSummary {
  totalSubscribed: number;
  priorityCount: number;
  subscribedEventIds: string[];
  subscribedTitles: string[];
  preferredCities: string[];
  preferredSeriesLabels: string[];
  fsmStateLabel: string;
  pushTargetingCopy: string;
}

export interface MemberStoryMilestone {
  phase: string;
  timepoint: string;
  sceneTitle: string;
  detail: string;
}

export interface MemberStoryJourney {
  id: string;
  memberName: string;
  roleTitle: string;
  almaMaterAndCity: string;
  industryLabel: string;
  tierProgression: string;
  currentTierId: MembershipTier['id'];
  headlineQuote: string;
  storyNarrative: string;
  milestones: [MemberStoryMilestone, MemberStoryMilestone, MemberStoryMilestone];
  keyMetrics: Array<{
    label: string;
    value: string;
  }>;
  connectedPeers: string[];
}

export interface InterestClusterItem {
  id: string;
  code: string;
  clusterName: string;
  enTag: string;
  affinityPct: number;
  peerPersona: string;
  catalystTopic: string;
  recommendedScene: string;
  nodeX: number;
  nodeY: number;
}

export interface InterestConnectionPath {
  id: string;
  targetClusterId: string;
  fromLabel: string;
  toLabel: string;
  bridgeTopic: string;
  synergyStrength: number;
  svgPath: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface AiInterestClusterMatrix {
  clusterThemeTitle: string;
  careerInputSummary: string;
  overallResonance: number;
  clusters: [
    InterestClusterItem,
    InterestClusterItem,
    InterestClusterItem,
    InterestClusterItem,
  ];
  connectionPaths: [
    InterestConnectionPath,
    InterestConnectionPath,
    InterestConnectionPath,
    InterestConnectionPath,
  ];
  evaluationSource: 'gemini-ai' | 'curated-engine';
}

export interface ConnectionRadarDimension {
  dimension: string;
  userScore: number;
  clubBenchmark: number;
  fullMark: number;
}

export interface PotentialSocialPath {
  stepCode: string;
  stageTitle: string;
  targetCircle: string;
  actionCatalyst: string;
  conversionPct: number;
}

export interface AiConnectionPotentialAnalysis {
  boardTitle: string;
  compositeScore: number;
  circleFitLabel: string;
  aiSummary: string;
  radarData: ConnectionRadarDimension[];
  potentialPaths: [PotentialSocialPath, PotentialSocialPath, PotentialSocialPath];
}

export type NavSectionId =
  | 'top'
  | 'philosophy'
  | 'gatherings'
  | 'sandbox'
  | 'membership'
  | 'field-notes'
  | 'apply';

export interface PrivilegeTierCell {
  summary: string;
  badgeLabel: string;
  highlightLevel: 'basic' | 'included' | 'priority' | 'exclusive';
}

export interface MembershipPrivilegeItem {
  id: string;
  code: string;
  title: string;
  category: string;
  shortDesc: string;
  tierCells: Record<MembershipTier['id'], PrivilegeTierCell>;
  deepServiceDetail: {
    serviceHeadline: string;
    executionProtocol: string;
    conciergeSla: string;
    realWorldScenario: string;
    tierSpecificNotes: Record<MembershipTier['id'], string>;
  };
}

export interface AnnualStreamMonthPoint {
  monthIndex: number; // 0 to 11
  monthLabel: string; // '01月' to '12月'
  seasonTag: string;
  totalDensity: number;
  seriesBreakdown: Record<Exclude<EventSeriesId, 'all'>, number>;
}

export interface AnnualStreamEventPin {
  eventId: string;
  code: string;
  title: string;
  city: Exclude<CityName, '全部城市'>;
  series: Exclude<EventSeriesId, 'all'>;
  seriesLabel: string;
  date: string;
  monthIndex: number;
  densityValue: number;
  remainingSeats: number;
  capacity: number;
}

export interface AnnualEventStreamlineData {
  months: AnnualStreamMonthPoint[];
  eventPins: AnnualStreamEventPin[];
  annualTotalGatherings: number;
  peakMonthLabel: string;
}

export type ConciergeSuggestionActionType =
  | 'open_featured_event'
  | 'scroll_to_gatherings'
  | 'scroll_to_sandbox'
  | 'scroll_to_membership'
  | 'scroll_to_apply';

export interface ConciergeSuggestionPayload {
  sectionId: NavSectionId;
  sectionLabel: string;
  dwellSharePct: number;
  dwellSeconds: number;
  headline: string;
  suggestionCopy: string;
  ctaLabel: string;
  actionType: ConciergeSuggestionActionType;
  relatedEventId?: string;
  relatedTierId?: MembershipTier['id'];
}

export interface PointerPressureRippleProfile {
  normalizedPressure: number;
  isPressureSensitive: boolean;
  pressureLevelLabel: 'light' | 'medium' | 'firm';
  expansionDurationSec: number;
  maxScale: number;
  colorIntensity: number;
  borderColor: string;
  glowShadow: string;
  backgroundGradient: string;
  hapticDurationMs: number;
}

export interface BolEventReservationSlip {
  slipNo: string;
  eventId: string;
  eventCode: string;
  title: string;
  englishSubtitle: string;
  seriesLabel: string;
  city: Exclude<CityName, '全部城市'>;
  date: string;
  timeRange: string;
  venue: string;
  dressCode: string;
  hostSignature: string;
  memberPrice: number;
  standardPrice: number;
  seatQuotaNote: string;
  curatedTopics: string[];
  checkInProtocol: string;
  scheduleOrderIndex: number;
}

export type ActivityFrequencyId =
  | 'monthly-1-2'
  | 'biweekly-3-4'
  | 'weekly-5-plus';

export interface DigitalFootprintParticle {
  id: string;
  pathIndex: number;
  waypointsX: [number, number, number, number];
  waypointsY: [number, number, number, number];
  radiusPx: number;
  durationSec: number;
  delaySec: number;
  colorHex: string;
  peakOpacity: number;
  domainTag: string;
}

export interface DigitalFootprintVisualization {
  activityFrequency: ActivityFrequencyId;
  frequencyLabel: string;
  industry: IndustryDomainId;
  domainLabel: string;
  domainColorHex: string;
  secondaryColorHex: string;
  annualFootprintSessions: number;
  airflowVelocityMultiplier: number;
  airflowVelocityLabel: string;
  footprintNarrative: string;
  airflowSvgPaths: [string, string, string];
  particles: DigitalFootprintParticle[];
}

export interface ActiveCircleFitItem {
  circleCode: string;
  circleName: string;
  enTag: string;
  fitPct: number;
  activeMemberComposition: string;
  resonanceReason: string;
}

export interface AiDeepCircleFitReport {
  reportNo: string;
  careerInputEcho: string;
  city: Exclude<CityName, '全部城市'>;
  overallFitScore: number;
  primaryMatchedCircle: string;
  executiveVerdict: string;
  circleBreakdown: [ActiveCircleFitItem, ActiveCircleFitItem, ActiveCircleFitItem];
  valueExchange: {
    whatYouBring: string;
    whatYouGain: string;
  };
  recommendedEntryScene: string;
  icebreakerTopic: string;
  evaluationSource: 'gemini-ai' | 'curated-engine';
}

export interface LiveCommunityConnectionItem {
  id: string;
  code: string;
  timestampLabel: string;
  city: Exclude<CityName, '全部城市'>;
  sceneTag: string;
  initiatorRole: string;
  counterpartRole: string;
  consensusHeadline: string;
  consensusDetail: string;
  relatedEventId: string;
}

export interface SmartFilterSummary {
  seriesLabel: string;
  cityLabel: string;
  hasKeyword: boolean;
  keywordPreview: string;
  activeFilterCount: number;
  summaryText: string;
  matchedCount: number;
}

export interface TierIndustrySegment {
  industryId: IndustryDomainId;
  label: string;
  enLabel: string;
  sharePct: number;
  colorHex: string;
  gradientCss: string;
}

export interface TierIndustryDistributionProfile {
  tierId: MembershipTier['id'];
  tierName: string;
  dominantSummary: string;
  verifiedSampleSize: number;
  crossCityRatioPct: number;
  segments: TierIndustrySegment[];
}

export type HeroPoeticThemeId = 'midnight' | 'salon' | 'private-talk';

export interface HeroPoeticBreathingChapter {
  id: HeroPoeticThemeId;
  chapterCode: string;
  themeWord: '午夜' | '酒会' | '私谈';
  enWord: 'MIDNIGHT' | 'SALON' | 'PRIVATE TALK';
  poeticPhrase: string;
  subWhisper: string;
  chapterIndex: number;
  scrollProgressRatio: number;
}

export type LoungeZonePolarity = 'amber-glow' | 'obsidian-shadow';

export interface SectionChiaroscuroProfile {
  sectionIndex: number;
  sectionId: string;
  zoneTitle: string;
  polarity: LoungeZonePolarity;
  luminanceDelta: number; // e.g., 0.94 to 1.06
  boundaryBlurPx: number; // e.g., 0 to 3.2
  parallaxShiftY: number; // e.g., -14 to 14
  ambientGlowOpacity: number; // e.g., 0.06 to 0.24
  ambientGradientCss: string;
}

export interface CuratorDialogueOption {
  id: string;
  label: string;
  subtitle: string;
  mappedRhythm?: SocialRhythmId;
  mappedIndustry?: IndustryDomainId;
  mappedSeries?: Exclude<EventSeriesId, 'all'>;
  moodTag: string;
}

export interface CuratorDialogueQuestion {
  roundNumber: 1 | 2 | 3;
  roundCode: string;
  dimensionTitle: string;
  curatorPrompt: string;
  options: [
    CuratorDialogueOption,
    CuratorDialogueOption,
    CuratorDialogueOption,
    CuratorDialogueOption,
  ];
}

export interface CuratorMoodDialogueInput {
  city: Exclude<CityName, '全部城市'>;
  round1OptionId: string;
  round2OptionId: string;
  round3OptionId: string;
  customMoodNote?: string;
}

export interface CuratorMoodRecommendationResult {
  moodPersonaTitle: string;
  resonanceScore: number;
  curatorWhisperReply: string;
  moodMatchReason: string;
  curatedIcebreaker: string;
  primaryEvent: BolEvent;
  secondaryEvent: BolEvent;
  evaluationSource: 'gemini-ai' | 'curated-engine';
}

export type WishlistGrowthDimensionId =
  | 'seeking-collaboration'
  | 'expanding-network'
  | 'lifestyle-aesthetics';

export interface WishlistExpectationEntry {
  eventId: string;
  sliderValue: number; // 0 to 100
  dimensionId: WishlistGrowthDimensionId;
  dimensionLabel: '寻求合作' | '扩充人脉' | '生活美学';
  dimensionEn: 'COLLABORATION' | 'NETWORKING' | 'AESTHETICS';
  intensityPct: number;
  personalizedTip: string;
  actionPreparationNote: string;
  accentColorHex: string;
}

export interface PersonalWishlistSummary {
  wishlistIds: string[];
  items: BolEvent[];
  totalCount: number;
  citiesCovered: Array<Exclude<CityName, '全部城市'>>;
  seriesCovered: string[];
  totalMemberCost: number;
  totalStandardCost: number;
  memberSavingsAmount: number;
  conciergeBundleAdvice: string;
  expectationsByEventId: Record<string, WishlistExpectationEntry>;
  portfolioGrowthTip: string;
}

export type MicroVideoSceneType =
  | 'clinking-glasses'
  | 'private-talk-silhouette'
  | 'vinyl-harbor-dusk';

export interface BrandMicroVideoReel {
  id: string;
  reelCode: string;
  sceneType: MicroVideoSceneType;
  title: string;
  enSubtitle: string;
  locationTag: string;
  durationSec: number;
  saturationPct: number; // e.g., 32 to 38 (low-saturation grading)
  visualCaption: string;
  atmosphereDetail: string;
  filterCss: string;
}

export type FirstScreenSkeletonPhaseId =
  | 'wine-ignition'
  | 'champagne-flow'
  | 'sanctum-unveil'
  | 'complete';

export interface FirstScreenSkeletonBlockSpec {
  id: string;
  zoneKey: 'topnav' | 'hero-editorial' | 'hero-atmosphere' | 'live-stream';
  label: string;
  enLabel: string;
  gridSpanClass: string;
  shimmerDelayMs: number;
  lusterGradientCss: string;
  borderAccentCss: string;
}

export interface FirstScreenSkeletonState {
  isVisible: boolean;
  phaseId: FirstScreenSkeletonPhaseId;
  phaseLabel: string;
  ritualSubcopy: string;
  progressPct: number;
  burgundyHex: '#5A1A1E';
  champagneHex: '#D8B98A';
  memberGoldHex: '#BF8943';
  primaryLusterGradientCss: string;
  ambientBackdropCss: string;
  blocks: [
    FirstScreenSkeletonBlockSpec,
    FirstScreenSkeletonBlockSpec,
    FirstScreenSkeletonBlockSpec,
    FirstScreenSkeletonBlockSpec,
  ];
}

export interface ConstellationStageNode {
  id: string;
  stageOrder: 1 | 2 | 3;
  stageCode: string;
  stageTitle: string;
  sceneSubtitle: string;
  timeAndCity: string;
  x: number;
  y: number;
}

export interface CrossIndustryOpportunityNode {
  id: string;
  opportunityIndex: number; // 0, 1, 2
  code: string;
  memberIndustryTag: string;
  counterpartIndustryTag: string;
  collisionHeadline: string;
  opportunityDetail: string;
  commercialOutcome: string;
  synergyScorePct: number;
  linkedStageOrder: 1 | 2 | 3;
  x: number;
  y: number;
  accentHex: string;
}

export interface ConstellationAnimatedLink {
  id: string;
  kind: 'growth-spine' | 'industry-collision';
  fromNodeId: string;
  toNodeId: string;
  svgPath: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeHex: string;
  pulseDurationSec: number;
  opportunityIndex?: number;
}

export interface MemberGrowthConstellationData {
  storyId: string;
  memberName: string;
  memberCoreIndustry: string;
  graphHeadline: string;
  stageNodes: [ConstellationStageNode, ConstellationStageNode, ConstellationStageNode];
  opportunityNodes: [
    CrossIndustryOpportunityNode,
    CrossIndustryOpportunityNode,
    CrossIndustryOpportunityNode,
  ];
  svgLinks: ConstellationAnimatedLink[];
  activeOpportunityIndex: number;
  activeOpportunity: CrossIndustryOpportunityNode;
}




