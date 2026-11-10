import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  QrCode,
  Sparkles,
  Send,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Clock,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import {
  BRAND_META,
  CURATED_EVENTS,
  INDUSTRY_OPTIONS,
  MEMBERSHIP_TIERS,
  RHYTHM_OPTIONS,
} from '../../content';
import {
  buildApplicationTrackerState,
  generateBolInvitationCode,
  transitionApplicationStage,
  validateApplicationForm,
} from '../../lib/curationEngine';
import {
  ApplicationEventTrigger,
  ApplicationStageId,
  ApplicationSubmission,
  BolEvent,
  CityName,
  IndustryDomainId,
  MembershipTier,
  SocialRhythmId,
} from '../../types/bol';
import { BolLogoMark } from '../visuals/BolLogo';
import { BolCard } from '../visuals/BolCard';
import { HapticButton } from '../visuals/HapticButton';

interface ApplicationConciergeSectionProps {
  preselectedEvent: BolEvent | null;
  preselectedTier: MembershipTier | null;
  prefilledCity?: Exclude<CityName, '全部城市'>;
  prefilledIndustry?: IndustryDomainId;
  prefilledRhythm?: SocialRhythmId;
}

export const ApplicationConciergeSection: React.FC<ApplicationConciergeSectionProps> = ({
  preselectedEvent,
  preselectedTier,
  prefilledCity,
  prefilledIndustry,
  prefilledRhythm,
}) => {
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState<Exclude<CityName, '全部城市'>>('深圳');
  const [industryDomain, setIndustryDomain] = useState<IndustryDomainId>('ai-tech');
  const [preferredRhythm, setPreferredRhythm] = useState<SocialRhythmId>('tipsy-salon');
  const [backgroundSummary, setBackgroundSummary] = useState('');
  const [wechatId, setWechatId] = useState('');
  const [targetEventId, setTargetEventId] = useState<string>(CURATED_EVENTS[0].id);
  const [targetTierId, setTargetTierId] = useState<MembershipTier['id']>('starlight');

  const [errors, setErrors] = useState<
    Partial<Record<'fullName' | 'backgroundSummary' | 'wechatId', string>>
  >({});

  const [submissions, setSubmissions] = useState<ApplicationSubmission[]>([
    {
      id: 'seed-01',
      fullName: 'Evelyn Lin',
      city: '深圳',
      backgroundSummary: '伦敦政经校友，目前在南山从事跨境消费电子品牌增长',
      industryDomain: 'cross-border',
      preferredRhythm: 'tipsy-salon',
      wechatId: 'Evelyn_GBA',
      targetEventId: 'bol-sz-ai-wine',
      targetTierId: 'starlight',
      invitationCode: 'BOL-SZ-GLB-0108',
      submittedAt: '2026-11-07 20:15',
      stage: 'background_check',
    },
  ]);

  // State Machine state for the currently tracked application
  const [currentStage, setCurrentStage] = useState<ApplicationStageId>('background_check');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (preselectedEvent) {
      setTargetEventId(preselectedEvent.id);
      setCity(preselectedEvent.city);
    }
  }, [preselectedEvent]);

  useEffect(() => {
    if (preselectedTier) {
      setTargetTierId(preselectedTier.id);
    }
  }, [preselectedTier]);

  useEffect(() => {
    if (prefilledCity) setCity(prefilledCity);
    if (prefilledIndustry) setIndustryDomain(prefilledIndustry);
    if (prefilledRhythm) setPreferredRhythm(prefilledRhythm);
  }, [prefilledCity, prefilledIndustry, prefilledRhythm]);

  const dispatchStageTrigger = (trigger: ApplicationEventTrigger) => {
    setIsTransitioning(true);
    setCurrentStage((prevStage) => {
      const nextStage = transitionApplicationStage(prevStage, trigger);
      setSubmissions((prevSubs) =>
        prevSubs.map((sub, idx) => (idx === 0 ? { ...sub, stage: nextStage } : sub))
      );
      return nextStage;
    });
    window.setTimeout(() => {
      setIsTransitioning(false);
    }, 360);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateApplicationForm({
      fullName,
      backgroundSummary,
      wechatId,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const invitationCode = generateBolInvitationCode(
      city,
      industryDomain,
      submissions.length + 1
    );

    const newEntry: ApplicationSubmission = {
      id: `sub-${Date.now()}`,
      fullName: fullName.trim(),
      city,
      backgroundSummary: backgroundSummary.trim(),
      industryDomain,
      preferredRhythm,
      wechatId: wechatId.trim(),
      targetEventId,
      targetTierId,
      invitationCode,
      submittedAt: '刚刚提交 · 状态机已启动核验',
      stage: 'document_review',
    };

    setIsTransitioning(true);
    setSubmissions((prev) => [newEntry, ...prev]);
    setCurrentStage('document_review');
    setFullName('');
    setBackgroundSummary('');
    setWechatId('');

    window.setTimeout(() => {
      setIsTransitioning(false);
    }, 360);
  };

  const latestSubmission = submissions[0];
  const selectedEventObj = CURATED_EVENTS.find((e) => e.id === targetEventId);
  const selectedTierObj = MEMBERSHIP_TIERS.find((t) => t.id === targetTierId);
  const trackerState = buildApplicationTrackerState(currentStage);

  const stageTriggerMap: Record<
    'document_review' | 'background_check' | 'invitation_issued',
    ApplicationEventTrigger
  > = {
    document_review: 'SET_DOCUMENT_REVIEW',
    background_check: 'SET_BACKGROUND_CHECK',
    invitation_issued: 'SET_INVITATION_ISSUED',
  };

  return (
    <section
      id="apply"
      className="bol-snap-section py-16 lg:py-24 px-6 lg:px-12 max-w-[1360px] mx-auto border-t border-[#2A2A2E]"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs text-[#D8B98A] tracking-widest mb-2">
            06. APPLICATION & CONCIERGE · 席位预约与状态机核验中心
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#F2EFE9]">
            开启您的第一场 BoL 线下赴约
          </h2>
        </div>
        <p className="text-sm text-[#A3A09A] max-w-md leading-relaxed">
          填写基础背景档案后，系统将即时生成您的专属赴约编码，并启动三阶状态机审核流程（资料审核 · 背景调研 · 入会邀约），全程透明可追踪。
        </p>
      </div>

      {/* Top Row: Form (7 cols) + WeChat Pass & Queue (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
        {/* Left: Application Form (7 cols) */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#2A2A2E] space-y-5 flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#2A2A2E] pb-4">
              <h3 className="font-editorial text-2xl font-medium text-[#F2EFE9]">
                嘉宾背景登记与席位申请表
              </h3>
              <span className="text-xs text-[#D8B98A]">隐私加密保护 · 状态机实时响应</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="applicant-name" className="block text-xs text-[#F2EFE9] mb-1.5">
                  您的称谓 / 姓名 *
                </label>
                <input
                  id="applicant-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="例如：Julian Chen / 林女士"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] placeholder:text-[#A3A09A]/50 focus:outline-none focus:border-[#D8B98A]"
                />
                {errors.fullName && (
                  <p role="alert" className="text-xs text-[#D8B98A] mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="applicant-wechat" className="block text-xs text-[#F2EFE9] mb-1.5">
                  微信号（用于主理人发送审核结果与定位） *
                </label>
                <input
                  id="applicant-wechat"
                  type="text"
                  value={wechatId}
                  onChange={(e) => setWechatId(e.target.value)}
                  placeholder="例如：Julian_BoL2026"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] placeholder:text-[#A3A09A]/50 focus:outline-none focus:border-[#D8B98A]"
                />
                {errors.wechatId && (
                  <p role="alert" className="text-xs text-[#D8B98A] mt-1">
                    {errors.wechatId}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="applicant-city" className="block text-xs text-[#F2EFE9] mb-1.5">
                  常驻城市
                </label>
                <select
                  id="applicant-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value as Exclude<CityName, '全部城市'>)}
                  className="w-full px-3 py-2.5 text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] focus:outline-none focus:border-[#D8B98A]"
                >
                  <option value="深圳">深圳</option>
                  <option value="广州">广州</option>
                  <option value="香港">香港</option>
                  <option value="上海">上海</option>
                </select>
              </div>

              <div>
                <label htmlFor="applicant-event" className="block text-xs text-[#F2EFE9] mb-1.5">
                  意向首场活动
                </label>
                <select
                  id="applicant-event"
                  value={targetEventId}
                  onChange={(e) => setTargetEventId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] focus:outline-none focus:border-[#D8B98A]"
                >
                  {CURATED_EVENTS.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      [{ev.city}] {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="applicant-tier" className="block text-xs text-[#F2EFE9] mb-1.5">
                  意向会籍或权益卡
                </label>
                <select
                  id="applicant-tier"
                  value={targetTierId}
                  onChange={(e) => setTargetTierId(e.target.value as MembershipTier['id'])}
                  className="w-full px-3 py-2.5 text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] focus:outline-none focus:border-[#D8B98A]"
                >
                  {MEMBERSHIP_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name}（{tier.priceDisplay}）
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="applicant-industry" className="block text-xs text-[#F2EFE9] mb-1.5">
                  行业领域
                </label>
                <select
                  id="applicant-industry"
                  value={industryDomain}
                  onChange={(e) => setIndustryDomain(e.target.value as IndustryDomainId)}
                  className="w-full px-3 py-2.5 text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] focus:outline-none focus:border-[#D8B98A]"
                >
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="applicant-rhythm" className="block text-xs text-[#F2EFE9] mb-1.5">
                  偏好社交状态
                </label>
                <select
                  id="applicant-rhythm"
                  value={preferredRhythm}
                  onChange={(e) => setPreferredRhythm(e.target.value as SocialRhythmId)}
                  className="w-full px-3 py-2.5 text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] focus:outline-none focus:border-[#D8B98A]"
                >
                  {RHYTHM_OPTIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="applicant-bg" className="block text-xs text-[#F2EFE9] mb-1.5">
                海外/留学背景、行业经历或希望认识的同频朋友 *
              </label>
              <textarea
                id="applicant-bg"
                rows={3}
                value={backgroundSummary}
                onChange={(e) => setBackgroundSummary(e.target.value)}
                placeholder="请简述您的留学院校/海外工作经历、目前从事的方向，或希望在现场交流的话题..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] placeholder:text-[#A3A09A]/50 focus:outline-none focus:border-[#D8B98A]"
              />
              {errors.backgroundSummary && (
                <p role="alert" className="text-xs text-[#D8B98A] mt-1">
                  {errors.backgroundSummary}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#2A2A2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-[#A3A09A]">
              当前已选：<span className="text-[#F2EFE9]">{selectedEventObj?.title}</span> ·{' '}
              <span className="text-[#D8B98A]">{selectedTierObj?.name}</span>
            </p>

            <HapticButton
              type="submit"
              data-testid="application-submit-btn"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>提交申请并生成赴约编码</span>
            </HapticButton>
          </div>
        </form>

        {/* Right: WeChat Mini-Program Digital Pass & Live Submissions Archive (5 cols) */}
        <BolCard
          delay={0.05}
          className="lg:col-span-5 p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#2A2A2E] flex flex-col justify-between space-y-6"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#2A2A2E] pb-4">
              <div className="flex items-center gap-2.5">
                <BolLogoMark size={26} tone="champagne" />
                <div>
                  <h3 className="font-editorial text-xl font-medium text-[#F2EFE9]">
                    微信小程序「{BRAND_META.miniProgramName}」凭证
                  </h3>
                  <p className="text-[11px] text-[#A3A09A]">
                    微信搜索小程序输入下方编码，快速接通主理人服务
                  </p>
                </div>
              </div>
              <QrCode className="w-5 h-5 text-[#D8B98A]" />
            </div>

            {/* Active Pass Card */}
            <div
              data-testid="latest-invitation-pass"
              className="p-5 rounded-[8px] bg-[#0B0B0C] border border-[#D8B98A]/60 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#D8B98A] inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>最新生成赴约通行证</span>
                </span>
                <span className="text-[#A3A09A]">{latestSubmission.submittedAt}</span>
              </div>

              <div className="py-2 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-[#A3A09A] block">专属席位核验编码</span>
                  <p className="tabular-nums text-2xl font-semibold text-[#F2EFE9] tracking-wider">
                    {latestSubmission.invitationCode}
                  </p>
                </div>
                <span className="tabular-nums text-xs text-[#D8B98A]">
                  完成度 {trackerState.progressPercentage}%
                </span>
              </div>

              <div className="text-xs text-[#A3A09A] space-y-1 pt-2 border-t border-[#2A2A2E]">
                <p>
                  申请人：<span className="text-[#F2EFE9] font-medium">{latestSubmission.fullName}</span>（{latestSubmission.city}）
                </p>
                <p className="truncate">背景摘要：{latestSubmission.backgroundSummary}</p>
              </div>
            </div>

            {/* Submissions Log */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#A3A09A] mb-2.5">
                <span>近期赴约登记记录（已登记 {submissions.length} 份）</span>
                <span className="tabular-nums text-[#D8B98A]">LIVE QUEUE</span>
              </div>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-[6px] bg-[#0B0B0C]/60 border border-[#2A2A2E] flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-[#F2EFE9] font-medium truncate">
                        {sub.fullName} · {sub.city}
                      </p>
                      <p className="text-[11px] text-[#A3A09A] truncate">
                        {sub.backgroundSummary}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="tabular-nums text-[#D8B98A] block">
                        {sub.invitationCode}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#A3A09A]">
                        <CheckCircle2 className="w-3 h-3 text-[#D8B98A]" />
                        已建档
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] text-xs text-[#A3A09A]">
            提示：在微信搜索 <strong className="text-[#F2EFE9]">「{BRAND_META.miniProgramName}」</strong> 小程序，即可随时查阅完整活动日历、我的权益卡包与私宴席位状态。
          </div>
        </BolCard>
      </div>

      {/* Bottom Row: State-Machine Progress Tracker + Recharts Progress Dashboard */}
      <BolCard
        delay={0.08}
        data-testid="application-progress-dashboard"
        className="p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#2A2A2E] space-y-8"
      >
        {/* Header & FSM Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2A2A2E] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#D8B98A] tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>STATE-MACHINE CONCIERGE TRACKER · 申请进度追踪器与可视化仪表盘</span>
            </div>
            <h3 className="font-editorial text-2xl font-medium text-[#F2EFE9]">
              当前追踪档案：{latestSubmission.fullName}（{latestSubmission.invitationCode}）
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <HapticButton
              type="button"
              data-testid="fsm-advance-btn"
              disabled={!trackerState.canAdvance}
              onClick={() => dispatchStageTrigger('ADVANCE_STAGE')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                trackerState.canAdvance
                  ? 'bg-[#D8B98A] text-[#0B0B0C] hover:bg-[#F2EFE9]'
                  : 'bg-[#2A2A2E] text-[#A3A09A] cursor-not-allowed'
              }`}
            >
              <span>{trackerState.nextTriggerLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </HapticButton>

            <HapticButton
              type="button"
              rippleTone="champagne"
              data-testid="fsm-reset-btn"
              onClick={() => dispatchStageTrigger('RESET_TRACKER')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E] hover:border-[#D8B98A]/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置至初审阶段</span>
            </HapticButton>
          </div>
        </div>

        {/* Dynamic Animated Application Progress Bar ("申请进度条") */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A3A09A]">当前状态机节点：</span>
              <span
                data-testid="fsm-current-stage-label"
                className="text-sm font-medium text-[#D8B98A] transition-opacity duration-300"
              >
                {trackerState.stageLabel}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#A3A09A]">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D8B98A]" />
                <span>{trackerState.estimatedSla}</span>
              </span>
              <span
                data-testid="fsm-progress-pct"
                className="tabular-nums text-base font-semibold text-[#F2EFE9]"
              >
                {trackerState.progressPercentage}%
              </span>
            </div>
          </div>

          {/* Progress Bar Track with Smooth Cubic-Bezier Transition */}
          <div
            role="progressbar"
            aria-valuenow={trackerState.progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="申请审核进度条"
            className="relative h-2.5 w-full rounded-full bg-[#0B0B0C] border border-[#2A2A2E] overflow-hidden"
          >
            <div
              data-testid="animated-progress-bar-fill"
              style={{
                width: `${trackerState.progressPercentage}%`,
                transition: 'width 650ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="h-full rounded-full bg-gradient-to-r from-[#5A1A1E] via-[#BF8943] to-[#D8B98A]"
            />
          </div>

          {/* 3 Interactive Stage Nodes (资料审核 -> 背景调研 -> 入会邀约) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {trackerState.stageMetrics.map((metric, index) => {
              const isCurrent = trackerState.activeStepIndex === index;
              const isDone = metric.status === 'completed';

              return (
                <button
                  key={metric.stageKey}
                  type="button"
                  data-testid={`stage-node-${metric.stageKey}`}
                  onClick={() => dispatchStageTrigger(stageTriggerMap[metric.stageKey])}
                  className={`text-left p-4 rounded-[8px] border transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0B0B0C] border-[#D8B98A]'
                      : isDone
                      ? 'bg-[#0B0B0C]/70 border-[#BF8943]/50 hover:border-[#D8B98A]'
                      : 'bg-[#0B0B0C]/40 border-[#2A2A2E] hover:border-[#A3A09A]/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="tabular-nums text-[#D8B98A] font-medium">
                      0{index + 1} · {metric.enName}
                    </span>
                    <span
                      className={`tabular-nums text-[11px] ${
                        isCurrent || isDone ? 'text-[#D8B98A]' : 'text-[#A3A09A]'
                      }`}
                    >
                      {metric.statusLabel} · {metric.completionPct}%
                    </span>
                  </div>
                  <p className="font-editorial text-lg font-medium text-[#F2EFE9] mb-1">
                    {metric.stageName}
                  </p>
                  <p className="text-xs text-[#A3A09A] leading-relaxed">
                    {metric.auditDetail}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lower Split: Recharts Stage Dashboard (7 cols) + Live Audit Details (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
          {/* Recharts Visualization */}
          <div className="lg:col-span-7 p-5 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="text-sm font-medium text-[#F2EFE9] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#D8B98A]" />
                  <span>申请进度仪表盘（资料审核 · 背景调研 · 入会邀约）</span>
                </h4>
                <p className="text-xs text-[#A3A09A] mt-0.5">
                  柱状图展示各阶段实时完成率（%），折线展示主理人核验严谨度指数
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#A3A09A]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#D8B98A] inline-block" />
                  阶段完成率
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#BF8943] inline-block" />
                  严谨度指数
                </span>
              </div>
            </div>

            <div className="w-full h-[230px]" data-testid="recharts-stage-chart-container">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart
                  data={trackerState.stageMetrics}
                  margin={{ top: 12, right: 16, left: -12, bottom: 4 }}
                >
                  <CartesianGrid stroke="#2A2A2E" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="stageName"
                    stroke="#A3A09A"
                    tick={{ fill: '#F2EFE9', fontSize: 12 }}
                    axisLine={{ stroke: '#2A2A2E' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#A3A09A"
                    tick={{ fill: '#A3A09A', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151517',
                      borderColor: '#D8B98A',
                      borderRadius: '6px',
                      color: '#F2EFE9',
                      fontSize: '12px',
                    }}
                    formatter={(value, name) => [
                      `${value ?? 0}%`,
                      name === 'completionPct' ? '阶段完成度' : '核验严谨度指数',
                    ]}
                  />
                  <Bar
                    dataKey="completionPct"
                    name="completionPct"
                    barSize={42}
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={550}
                  >
                    {trackerState.stageMetrics.map((entry) => (
                      <Cell
                        key={entry.stageKey}
                        fill={
                          entry.status === 'completed'
                            ? '#D8B98A'
                            : entry.status === 'active'
                            ? '#BF8943'
                            : '#2A2A2E'
                        }
                      />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="rigorIndex"
                    name="rigorIndex"
                    stroke="#F2EFE9"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#D8B98A', stroke: '#0B0B0C', strokeWidth: 1.5 }}
                    activeDot={{ r: 6, fill: '#F2EFE9' }}
                    isAnimationActive={true}
                    animationDuration={550}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Concierge Live Audit Note & SLA Metrics */}
          <div
            className={`lg:col-span-5 p-5 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col justify-between transition-opacity duration-300 ${
              isTransitioning ? 'opacity-75' : 'opacity-100'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2E] pb-3">
                <span className="text-xs text-[#D8B98A] tracking-wider">
                  CONCIERGE AUDIT DOSSIER · 主理人核验简报
                </span>
                <span className="tabular-nums text-xs text-[#A3A09A]">
                  STEP 0{trackerState.activeStepIndex + 1} / 03
                </span>
              </div>

              <p
                data-testid="concierge-stage-note"
                className="text-sm text-[#F2EFE9] leading-relaxed"
              >
                {trackerState.conciergeNote}
              </p>

              <div className="space-y-2.5 pt-2">
                {trackerState.stageMetrics.map((m) => (
                  <div
                    key={m.stageKey}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-[#2A2A2E]/60 last:border-none"
                  >
                    <span className="text-[#A3A09A]">
                      {m.stageName}（{m.enName}）
                    </span>
                    <div className="flex items-center gap-3 tabular-nums">
                      <span className="text-[#A3A09A]">SLA ≤ {m.slaHours}h</span>
                      <span
                        className={
                          m.completionPct === 100
                            ? 'text-[#D8B98A] font-medium'
                            : 'text-[#F2EFE9]'
                        }
                      >
                        {m.completionPct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#2A2A2E] flex items-center justify-between text-xs text-[#A3A09A]">
              <span>审核标准：同频度 · 真实背景 · 桌友多元平衡</span>
              <span className="text-[#D8B98A] tabular-nums">100% 实名核验</span>
            </div>
          </div>
        </div>
      </BolCard>
    </section>
  );
};

