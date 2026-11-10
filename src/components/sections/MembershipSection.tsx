import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  ShieldCheck,
  Clock,
  Layers,
  BarChart3,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MEMBERSHIP_TIERS } from '../../content';
import {
  buildDeterministicAiAssessment,
  calculateAnnualMembershipSavings,
  getPrivilegeComparisonDetail,
  getTierIndustryDistribution,
  MEMBERSHIP_PRIVILEGE_COMPARISON_MATRIX,
  resolveNextTierByDragOffset,
  TIER_ORDER,
} from '../../lib/curationEngine';
import { AiMembershipAssessment, MembershipTier } from '../../types/bol';
import { BolLogoMark } from '../visuals/BolLogo';
import { BolCard } from '../visuals/BolCard';
import { HapticButton } from '../visuals/HapticButton';

interface MembershipSectionProps {
  onSelectTierForApplication: (tier: MembershipTier) => void;
}

const CAREER_PRESETS = [
  {
    label: 'AI 硬件创始人 / 硅谷海归',
    careerBackground: '智能硬件出海品牌联合创始人兼产品负责人，管理深圳研发与北美线下商超渠道',
    overseasExperience: '加州大学伯克利分校计算机硕士 · 前硅谷硬件工程师',
    socialGoal: '希望结识北美渠道操盘手、跨境硬件供应链合伙人及早期美元基金投资人',
    city: '深圳',
  },
  {
    label: '跨境 DTC 增长总监 / 英美校友',
    careerBackground: '新消费与家居独立站品牌增长负责人，负责欧美与东南亚本土化内容营销',
    overseasExperience: '伦敦艺术大学品牌策略硕士',
    socialGoal: '每月定期参加晚间微醺酒会与 AI 出海实战沙龙，拓展同频操盘手人脉',
    city: '广州',
  },
  {
    label: '家族企业接班 / 跨境并购与投资',
    careerBackground: '珠三角精密智造家族企业接班人及单一家族办公室合伙人，关注实业转型与出海并购',
    overseasExperience: '伦敦政经学院金融硕士 · 常驻香港与深圳',
    socialGoal: '偏好高私密度的 12 人长桌私宴与维港帆船航行，寻找长期战略合作伙伴',
    city: '香港',
  },
];

/**
 * 遵循 VI 手册 6.1 & 6.3 规范：
 * 清晰说明免费会员、专项次卡、星光会籍、星辰黑金会籍的关系，不单纯罗列价格；
 * 会员卡采用 1.6:1 横向比例，统一三圆标志、等级名与权益入口，隐藏真实会员号以保护隐私。
 */
export const MembershipSection: React.FC<MembershipSectionProps> = ({
  onSelectTierForApplication,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [selectedTierId, setSelectedTierId] = useState<MembershipTier['id']>('starlight');
  const [hoveredTierId, setHoveredTierId] = useState<MembershipTier['id'] | null>(null);
  const [monthlyFreq, setMonthlyFreq] = useState<number>(1);
  const [selectedPrivilegeId, setSelectedPrivilegeId] = useState<string>(
    MEMBERSHIP_PRIVILEGE_COMPARISON_MATRIX[0].id
  );

  // AI Eligibility Self-Assessment State
  const [careerBackground, setCareerBackground] = useState<string>(
    CAREER_PRESETS[0].careerBackground
  );
  const [overseasExperience, setOverseasExperience] = useState<string>(
    CAREER_PRESETS[0].overseasExperience
  );
  const [socialGoal, setSocialGoal] = useState<string>(CAREER_PRESETS[0].socialGoal);
  const [assessCity, setAssessCity] = useState<string>('深圳');
  const [assessError, setAssessError] = useState<string>('');
  const [isAssessing, setIsAssessing] = useState<boolean>(false);
  const [aiAssessment, setAiAssessment] = useState<AiMembershipAssessment>(() =>
    buildDeterministicAiAssessment(CAREER_PRESETS[0])
  );

  const activeTier =
    MEMBERSHIP_TIERS.find((t) => t.id === selectedTierId) || MEMBERSHIP_TIERS[2];
  const activeTierIndex = TIER_ORDER.indexOf(selectedTierId);
  const savings = calculateAnnualMembershipSavings(monthlyFreq);
  const activePrivilegeDetail = getPrivilegeComparisonDetail(
    selectedPrivilegeId,
    selectedTierId
  );

  const handleStepTier = (direction: 'prev' | 'next') => {
    const nextTier = resolveNextTierByDragOffset(
      selectedTierId,
      direction === 'next' ? -60 : 60,
      40
    );
    setSelectedTierId(nextTier);
  };

  const cardSurfaceStyles: Record<MembershipTier['id'], string> = {
    'free-guest': 'bg-gradient-to-br from-[#1C1C20] via-[#151517] to-[#0B0B0C] border-[#2A2A2E]',
    'salon-pass': 'bg-gradient-to-br from-[#5A1A1E]/75 via-[#1C1518] to-[#0B0B0C] border-[#D8B98A]/45',
    starlight: 'bg-gradient-to-br from-[#2B241B] via-[#171513] to-[#0B0B0C] border-[#D8B98A]',
    celestial: 'bg-gradient-to-br from-[#0B0B0C] via-[#1F1912] to-[#3B2A15] border-[#BF8943]',
  };

  const handleRunAiAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerBackground || careerBackground.trim().length < 4) {
      setAssessError('请至少填写 4 个字符的职业背景或核心职责描述，以便 AI 主理人为您生成评估。');
      return;
    }

    setAssessError('');
    setIsAssessing(true);

    try {
      const response = await fetch('/api/membership/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerBackground: careerBackground.trim(),
          city: assessCity,
          overseasExperience: overseasExperience.trim(),
          socialGoal: socialGoal.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || '评估请求暂时繁忙');
      }

      const data: AiMembershipAssessment = await response.json();
      setAiAssessment(data);
      setSelectedTierId(data.recommendedTierId);
    } catch {
      const fallback = buildDeterministicAiAssessment({
        careerBackground: careerBackground.trim(),
        city: assessCity,
        overseasExperience: overseasExperience.trim(),
        socialGoal: socialGoal.trim(),
      });
      setAiAssessment(fallback);
      setSelectedTierId(fallback.recommendedTierId);
    } finally {
      setIsAssessing(false);
    }
  };

  const handleApplyRecommendedTier = () => {
    const targetTier =
      MEMBERSHIP_TIERS.find((t) => t.id === aiAssessment.recommendedTierId) || activeTier;
    setSelectedTierId(targetTier.id);
    onSelectTierForApplication(targetTier);
  };

  return (
    <section
      id="membership"
      className="bol-snap-section py-16 lg:py-24 px-6 lg:px-12 max-w-[1360px] mx-auto border-t border-[#2A2A2E]"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs text-[#D8B98A] tracking-widest mb-2">
            04. MEMBERSHIP ARCHITECTURE · 会籍体系与长期关系
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#F2EFE9]">
            从第一次单场体验，到跨城市、跨行业的长期同行
          </h2>
        </div>
        <p className="text-sm text-[#A3A09A] max-w-md leading-relaxed">
          我们把「自由访客会员」「酒会优享次卡」与「星光 / 星辰年度会籍」设计为清晰递进的关系阶梯，让每一份投入都对应实在的场域权益与主理人引荐服务。
        </p>
      </div>

      {/* AI-Driven Membership Eligibility Self-Assessment Studio */}
      <BolCard
        data-testid="ai-membership-assessor"
        className="mb-10 p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#D8B98A]/45 bol-champagne-glow"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#2A2A2E]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D8B98A] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI MEMBERSHIP CONCIERGE · AI 驱动入会资格自测与等级定制</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#F2EFE9]">
              输入您的职业背景，获取主理人个性化入会建议与会籍推荐
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#A3A09A]">快速带入典型背景：</span>
            {CAREER_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setCareerBackground(preset.careerBackground);
                  setOverseasExperience(preset.overseasExperience);
                  setSocialGoal(preset.socialGoal);
                  setAssessCity(preset.city);
                  setAssessError('');
                }}
                className="px-3 py-1.5 rounded-[6px] text-xs bg-[#0B0B0C] border border-[#2A2A2E] text-[#F2EFE9] hover:border-[#D8B98A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Career Background Input Form (6 cols) */}
          <form
            onSubmit={handleRunAiAssessment}
            noValidate
            className="lg:col-span-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="ai-career-input"
                  className="block text-xs font-medium text-[#F2EFE9] mb-1.5"
                >
                  您的职业背景与当前核心职责 *
                </label>
                <textarea
                  id="ai-career-input"
                  rows={3}
                  value={careerBackground}
                  onChange={(e) => setCareerBackground(e.target.value)}
                  placeholder="例如：海外名校毕业，目前在深圳从事生成式 AI 硬件产品研发与欧美渠道出海..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] placeholder:text-[#A3A09A]/50 focus:outline-none focus:border-[#D8B98A]"
                />
                {assessError && (
                  <p role="alert" className="text-xs text-[#D8B98A] mt-1">
                    {assessError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="ai-assess-city" className="block text-xs text-[#A3A09A] mb-1">
                    常驻或目标城市
                  </label>
                  <select
                    id="ai-assess-city"
                    value={assessCity}
                    onChange={(e) => setAssessCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] focus:outline-none focus:border-[#D8B98A]"
                  >
                    <option value="深圳">深圳</option>
                    <option value="广州">广州</option>
                    <option value="香港">香港</option>
                    <option value="上海">上海</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="ai-overseas-input"
                    className="block text-xs text-[#A3A09A] mb-1"
                  >
                    留学/海外工作经历（选填）
                  </label>
                  <input
                    id="ai-overseas-input"
                    type="text"
                    value={overseasExperience}
                    onChange={(e) => setOverseasExperience(e.target.value)}
                    placeholder="例如：哥伦比亚大学校友 / 伦敦工作 3 年"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] placeholder:text-[#A3A09A]/50 focus:outline-none focus:border-[#D8B98A]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ai-goal-input" className="block text-xs text-[#A3A09A] mb-1">
                  核心社交与资源连接诉求（选填）
                </label>
                <input
                  id="ai-goal-input"
                  type="text"
                  value={socialGoal}
                  onChange={(e) => setSocialGoal(e.target.value)}
                  placeholder="例如：希望参加 12 人闭门私宴，结识跨境渠道与早期投资人"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] placeholder:text-[#A3A09A]/50 focus:outline-none focus:border-[#D8B98A]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <span className="text-xs text-[#A3A09A]">
                由 Gemini AI 主理人模型实时评估匹配
              </span>
              <HapticButton
                type="submit"
                disabled={isAssessing}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isAssessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在分析职业画像...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>启动 AI 入会资格自测</span>
                  </>
                )}
              </HapticButton>
            </div>
          </form>

          {/* Right: AI Personalized Assessment Result Card (6 cols) */}
          <div
            data-testid="ai-assessment-result"
            className="lg:col-span-6 p-6 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#2A2A2E]">
                <div>
                  <span className="text-xs text-[#D8B98A] block mb-0.5">
                    {aiAssessment.statusLabel}
                  </span>
                  <h4 className="font-editorial text-2xl font-semibold text-[#F2EFE9]">
                    推荐等级：{aiAssessment.recommendedTierName}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#A3A09A] block">社群同频契合度</span>
                  <span
                    data-testid="ai-eligibility-score"
                    className="tabular-nums text-2xl font-semibold text-[#BF8943]"
                  >
                    {aiAssessment.eligibilityScore}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#D8B98A] mb-1">个性化入会建议</p>
                <p className="text-sm text-[#F2EFE9]/95 leading-relaxed">
                  {aiAssessment.personalizedAdvice}
                </p>
              </div>

              <div className="p-3.5 rounded-[6px] bg-[#151517] border border-[#2A2A2E] text-xs">
                <span className="text-[#A3A09A]">建议首场切入场景：</span>
                <span className="text-[#D8B98A] font-medium ml-1">
                  {aiAssessment.curatedFirstScene}
                </span>
              </div>

              <div>
                <p className="text-xs text-[#A3A09A] mb-2">匹配该等级的核心权益支点：</p>
                <ul className="space-y-1.5">
                  {aiAssessment.valueHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-[#F2EFE9]/90">
                      <Check className="w-3.5 h-3.5 text-[#D8B98A] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2A2A2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-[#A3A09A]">
                已同步高亮下方 {aiAssessment.recommendedTierName} 1.6:1 实体会籍卡
              </span>
              <HapticButton
                type="button"
                onClick={handleApplyRecommendedTier}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>采纳建议并申请 {aiAssessment.recommendedTierName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </HapticButton>
            </div>
          </div>
        </div>
      </BolCard>

      {/* Top Interactive Showcase: 1.6:1 Horizontal Card + Annual ROI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
        {/* Left: 1.6:1 Physical-Grade Membership Card Preview (5 cols) */}
        <BolCard
          delay={0.04}
          className="lg:col-span-5 p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#2A2A2E] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs text-[#A3A09A] mb-4">
            <span>1.6:1 标准横版会籍卡预览</span>
            <span className="text-[#D8B98A]">{activeTier.categoryLabel}</span>
          </div>

          {/* 1.6:1 Aspect Ratio Card Container */}
          <div
            className={`relative w-full aspect-[1.6/1] rounded-[8px] border p-6 flex flex-col justify-between transition-all duration-200 ${cardSurfaceStyles[activeTier.id]}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <BolLogoMark size={26} tone="champagne" />
                <div>
                  <span className="font-editorial text-lg font-semibold text-[#F2EFE9] block leading-none">
                    BoL Club
                  </span>
                  <span className="text-[10px] text-[#A3A09A] tracking-widest">
                    BRIDGE OF LINKS
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-[#D8B98A]">
                {activeTier.categoryLabel}
              </span>
            </div>

            <div className="my-auto">
              <p className="text-xs text-[#A3A09A] mb-0.5">{activeTier.englishName}</p>
              <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#F2EFE9]">
                {activeTier.name}
              </h3>
            </div>

            <div className="flex items-end justify-between text-xs pt-3 border-t border-[#F2EFE9]/10">
              <div>
                <span className="text-[10px] text-[#A3A09A] block">隐私保护席位序列</span>
                <span className="tabular-nums text-[#F2EFE9]">BOL · **** · PRIVACY</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#A3A09A] block">大湾区 & 上海通用</span>
                <span className="tabular-nums text-sm font-semibold text-[#BF8943]">
                  {activeTier.priceDisplay}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#A3A09A] mt-4">
            {activeTier.cardRatioNote}
          </p>
        </BolCard>

        {/* Right: Interactive Attendance Frequency & Value Calculator (7 cols) */}
        <BolCard
          delay={0.08}
          className="lg:col-span-7 p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#2A2A2E] flex flex-col justify-between space-y-6"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <p className="text-xs text-[#D8B98A] mb-1">
                  VALUE CALCULATOR · 会籍与次卡层级关系测算
                </p>
                <h3 className="font-editorial text-2xl font-medium text-[#F2EFE9]">
                  我不确定该选单场报名、次卡还是年度会籍？
                </h3>
              </div>
              <span className="tabular-nums text-xs text-[#A3A09A]">
                预计每月参与 <strong className="text-[#D8B98A] text-sm">{monthlyFreq}</strong> 场（全年 {savings.annualAttendances} 场）
              </span>
            </div>

            <div className="p-4 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] mb-5">
              <label
                htmlFor="monthly-attendance-slider"
                className="flex items-center justify-between text-xs text-[#F2EFE9] mb-2"
              >
                <span>拖动滑块设定您预计每月的线下赴约频次：</span>
                <span className="tabular-nums text-[#D8B98A]">
                  {monthlyFreq} 场 / 月
                </span>
              </label>
              <input
                id="monthly-attendance-slider"
                type="range"
                min={1}
                max={4}
                step={1}
                value={monthlyFreq}
                onChange={(e) => setMonthlyFreq(Number(e.target.value))}
                className="w-full accent-[#D8B98A] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#A3A09A] mt-1 tabular-nums">
                <span>每月 1 场（轻度体验）</span>
                <span>每月 2 场（深度社交）</span>
                <span>每月 3 场（高频拓展）</span>
                <span>每月 4 场（每周赴约）</span>
              </div>
            </div>

            {/* 3-Column Comparison Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E]">
                <p className="text-xs text-[#A3A09A] mb-1">自由访客按单场原价</p>
                <p className="tabular-nums text-xl font-semibold text-[#F2EFE9]">
                  ¥{savings.payAsYouGoCost.toLocaleString()}
                  <span className="text-xs font-normal text-[#A3A09A]"> / 年</span>
                </p>
                <p className="text-[11px] text-[#A3A09A] mt-1">适合首场试水体验</p>
              </div>

              <div className="p-4 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E]">
                <p className="text-xs text-[#A3A09A] mb-1">使用酒会优享次卡折算</p>
                <p className="tabular-nums text-xl font-semibold text-[#D8B98A]">
                  ¥{savings.salonPassEffectiveCost.toLocaleString()}
                  <span className="text-xs font-normal text-[#A3A09A]"> / 年</span>
                </p>
                <p className="text-[11px] text-[#A3A09A] mt-1">单场折算 ¥170 · 可携友共享</p>
              </div>

              <div className="p-4 rounded-[6px] bg-[#0B0B0C] border border-[#BF8943]">
                <p className="text-xs text-[#D8B98A] mb-1">星光年度会籍综合成本</p>
                <p className="tabular-nums text-xl font-semibold text-[#BF8943]">
                  ¥{savings.starlightNetCost.toLocaleString()}
                  <span className="text-xs font-normal text-[#A3A09A]"> / 年</span>
                </p>
                <p className="text-[11px] text-[#F2EFE9] mt-1 tabular-nums">
                  预计立省 ¥{savings.estimatedSavingsWithStarlight.toLocaleString()} + 含 2 张免单券
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#A3A09A]">
            架构说明：所有成员均可在「BoL万象博联」小程序免费注册成为访客会员；当您希望锁定热门场次席位并获得主理人长期 1V1 引荐时，可随时升级为次卡或年度会籍。
          </p>
        </BolCard>
      </div>

      {/* 4-Tier Detailed Cards Grid with Hover-Reveal Industry Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {MEMBERSHIP_TIERS.map((tier, idx) => {
          const isSelected = tier.id === selectedTierId;
          const isHoverRevealed = hoveredTierId === tier.id;
          const industryDist = getTierIndustryDistribution(tier.id);

          return (
            <BolCard
              key={tier.id}
              delay={idx * 0.05}
              data-testid={`tier-card-${tier.id}`}
              data-hover-revealed={isHoverRevealed ? 'true' : 'false'}
              onMouseEnter={() => setHoveredTierId(tier.id)}
              onMouseLeave={() =>
                setHoveredTierId((prev) => (prev === tier.id ? null : prev))
              }
              onClick={() => setSelectedTierId(tier.id)}
              className={`group relative p-6 rounded-[8px] border transition-colors flex flex-col justify-between cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-[#151517] border-[#D8B98A]'
                  : 'bg-[#151517]/70 border-[#2A2A2E] hover:border-[#D8B98A]/60'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D8B98A] font-medium">{tier.categoryLabel}</span>
                  <span className="text-[#A3A09A]">{tier.englishName}</span>
                </div>

                <div>
                  <h3 className="font-editorial text-2xl font-medium text-[#F2EFE9] mb-1">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="tabular-nums text-2xl font-semibold text-[#BF8943]">
                      {tier.priceDisplay}
                    </span>
                    <span className="text-xs text-[#A3A09A]">{tier.billingCycle}</span>
                  </div>
                </div>

                <p className="text-xs text-[#A3A09A] leading-relaxed">
                  {tier.positioning}
                </p>

                {/* Hover-Reveal Industry Distribution Proportion Chart ("Hover 揭秘") */}
                <div
                  data-testid={`tier-hover-reveal-container-${tier.id}`}
                  className="pt-3 border-t border-[#2A2A2E]"
                >
                  <button
                    type="button"
                    data-testid={`tier-hover-reveal-trigger-${tier.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredTierId((prev) => (prev === tier.id ? null : tier.id));
                    }}
                    className="w-full flex items-center justify-between text-[11px] text-[#D8B98A] mb-2 cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Hover 揭秘 · 当前层级行业分布</span>
                    </span>
                    <span className="tabular-nums text-[#A3A09A]">
                      {isHoverRevealed ? '已展开图谱' : `N=${industryDist.verifiedSampleSize}`}
                    </span>
                  </button>

                  {/* Stacked Brand-Gradient Proportion Preview Bar (Always visible, glows on hover) */}
                  <div
                    data-testid={`tier-stacked-bar-${tier.id}`}
                    className="h-2 w-full rounded-full bg-[#0B0B0C] overflow-hidden flex gap-[2px] p-[1px] border border-[#2A2A2E]"
                  >
                    {industryDist.segments.map((seg) => (
                      <motion.div
                        key={`${tier.id}-stack-${seg.industryId}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${seg.sharePct}%` }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        style={{ background: seg.gradientCss }}
                        title={`${seg.label}: ${seg.sharePct}%`}
                        className="h-full first:rounded-l-full last:rounded-r-full"
                      />
                    ))}
                  </div>

                  {/* Expanded Hover-Reveal Dynamic Industry Breakdown */}
                  <AnimatePresence initial={false}>
                    {isHoverRevealed && (
                      <motion.div
                        key={`hover-reveal-chart-${tier.id}`}
                        data-testid={`tier-hover-reveal-chart-${tier.id}`}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1, height: 'auto' }
                            : { opacity: 0, height: 0 }
                        }
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0, height: 0 }
                            : { opacity: 0, height: 0 }
                        }
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-3.5 rounded-[6px] bg-[#0B0B0C] border border-[#D8B98A]/45 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#2A2A2E]">
                            <span className="text-[#F2EFE9] font-medium">
                              {industryDist.dominantSummary}
                            </span>
                            <span className="tabular-nums text-[#D8B98A]">
                              跨城活跃 {industryDist.crossCityRatioPct}%
                            </span>
                          </div>

                          <div className="space-y-2">
                            {industryDist.segments.map((seg) => (
                              <div key={seg.industryId} className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-[#F2EFE9]/90 truncate pr-2">
                                    {seg.label}
                                  </span>
                                  <span
                                    data-testid={`tier-segment-pct-${tier.id}-${seg.industryId}`}
                                    className="tabular-nums font-semibold text-[#D8B98A]"
                                  >
                                    {seg.sharePct}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-[#151517] overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${seg.sharePct}%` }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ background: seg.gradientCss }}
                                    className="h-full rounded-full"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <ul className="space-y-2.5 pt-3 border-t border-[#2A2A2E]">
                  {tier.privileges.map((priv) => (
                    <li key={priv} className="flex items-start gap-2 text-xs text-[#F2EFE9]/90">
                      <Check className="w-3.5 h-3.5 text-[#D8B98A] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{priv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[#2A2A2E]">
                <HapticButton
                  type="button"
                  rippleTone={
                    tier.id === 'celestial' || tier.id === 'starlight'
                      ? 'dark'
                      : 'champagne'
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTierId(tier.id);
                    onSelectTierForApplication(tier);
                  }}
                  className={`w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    tier.id === 'celestial' || tier.id === 'starlight'
                      ? 'bg-[#D8B98A] text-[#0B0B0C] hover:bg-[#F2EFE9]'
                      : 'bg-[#0B0B0C] text-[#F2EFE9] border border-[#2A2A2E] hover:border-[#D8B98A]'
                  }`}
                >
                  <span>申请 {tier.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </HapticButton>
              </div>
            </BolCard>
          );
        })}
      </div>

      {/* Interactive Membership Privilege Comparison Table & Deep Service Detail Inspector */}
      <BolCard
        delay={0.12}
        data-testid="membership-privilege-comparison-studio"
        className="mt-10 p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#D8B98A]/40 space-y-6"
      >
        {/* Top Header & Drag-to-Switch Tier Controller */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#2A2A2E]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D8B98A] mb-1.5">
              <MoveHorizontal className="w-3.5 h-3.5" />
              <span>
                PRIVILEGE COMPARISON MATRIX · 交互式会员权益对比矩阵（支持左右拖动切换等级 · 点击条目查阅深度服务细节）
              </span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#F2EFE9]">
              六大核心服务维度对比 · 当前聚焦：{activeTier.name}（{activeTier.priceDisplay}）
            </h3>
          </div>

          {/* Step Controls & Active Tier Indicator */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              data-testid="privilege-prev-tier-btn"
              disabled={activeTierIndex <= 0}
              onClick={() => handleStepTier('prev')}
              aria-label="切换到上一会籍等级"
              className="p-2 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] text-[#F2EFE9] hover:border-[#D8B98A] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3.5 py-1.5 rounded-[6px] bg-[#0B0B0C] border border-[#D8B98A]/50 text-xs">
              <span className="text-[#A3A09A]">左右拖动切换：</span>
              <span
                data-testid="comparison-active-tier-name"
                className="text-[#D8B98A] font-medium ml-1 tabular-nums"
              >
                0{activeTierIndex + 1} / 04 · {activeTier.name}
              </span>
            </div>

            <button
              type="button"
              data-testid="privilege-next-tier-btn"
              disabled={activeTierIndex >= TIER_ORDER.length - 1}
              onClick={() => handleStepTier('next')}
              aria-label="切换到下一会籍等级"
              className="p-2 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] text-[#F2EFE9] hover:border-[#D8B98A] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Draggable Tier Switcher Track + Interactive Comparison Table */}
        <motion.div
          data-testid="privilege-tier-drag-surface"
          drag={prefersReducedMotion ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            const nextTier = resolveNextTierByDragOffset(
              selectedTierId,
              info.offset.x,
              40
            );
            if (nextTier !== selectedTierId) {
              setSelectedTierId(nextTier);
            }
          }}
          className="space-y-4 cursor-grab active:cursor-grabbing"
        >
          {/* 4-Tier Interactive Column Selector Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {MEMBERSHIP_TIERS.map((tier, idx) => {
              const isCurrent = tier.id === selectedTierId;
              return (
                <button
                  key={tier.id}
                  type="button"
                  data-testid={`comparison-tier-tab-${tier.id}`}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`relative text-left p-3.5 rounded-[6px] border transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0B0B0C] border-[#D8B98A] text-[#F2EFE9]'
                      : 'bg-[#0B0B0C]/50 border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="tabular-nums text-[#D8B98A]">
                      TIER 0{idx + 1}
                    </span>
                    <span className="tabular-nums font-semibold text-[#BF8943]">
                      {tier.priceDisplay}
                    </span>
                  </div>
                  <p className="font-editorial text-base font-medium text-[#F2EFE9]">
                    {tier.name}
                  </p>
                  {isCurrent && (
                    <motion.div
                      layoutId={
                        prefersReducedMotion
                          ? undefined
                          : 'privilege-table-active-tier-bar'
                      }
                      className="mt-2 h-[2px] w-full rounded-full bg-gradient-to-r from-[#BF8943] via-[#D8B98A] to-[#F4EFE6]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Deep Service Detail Inspector Drawer (updates immediately when any privilege row or tier is clicked/dragged) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activePrivilegeDetail.privilege.id}-${selectedTierId}`}
              data-testid="privilege-deep-service-panel"
              initial={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: -4 }
              }
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 sm:p-6 rounded-[8px] bg-[#0B0B0C] border border-[#D8B98A]/60 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-[#2A2A2E]">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#D8B98A] mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>
                      DEEP SERVICE PROTOCOL · {activePrivilegeDetail.privilege.code} 权益深度服务细节描述
                    </span>
                  </div>
                  <h4
                    data-testid="privilege-detail-headline"
                    className="font-editorial text-xl sm:text-2xl font-medium text-[#F2EFE9]"
                  >
                    {activePrivilegeDetail.privilege.deepServiceDetail.serviceHeadline}
                  </h4>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#A3A09A]">
                    当前检视等级：<strong className="text-[#D8B98A]">{activeTier.name}</strong>
                  </span>
                  <HapticButton
                    type="button"
                    data-testid="privilege-detail-apply-btn"
                    onClick={() => onSelectTierForApplication(activeTier)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                  >
                    <span>锁定 {activeTier.name} 席位</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </HapticButton>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Column 1: Execution Protocol */}
                <div className="p-4 rounded-[6px] bg-[#151517] border border-[#2A2A2E] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#D8B98A] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>标准化执行流程与控场细节</span>
                  </div>
                  <p
                    data-testid="privilege-detail-protocol"
                    className="text-xs text-[#F2EFE9]/90 leading-relaxed"
                  >
                    {activePrivilegeDetail.privilege.deepServiceDetail.executionProtocol}
                  </p>
                </div>

                {/* Column 2: Concierge SLA & Real-World Scenario */}
                <div className="p-4 rounded-[6px] bg-[#151517] border border-[#2A2A2E] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#D8B98A] font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>主理人响应 SLA 与真实场域切片</span>
                  </div>
                  <p className="text-xs text-[#F2EFE9] leading-relaxed">
                    {activePrivilegeDetail.privilege.deepServiceDetail.conciergeSla}
                  </p>
                  <p className="text-[11px] text-[#A3A09A] pt-2 border-t border-[#2A2A2E] leading-relaxed">
                    真实案例：{activePrivilegeDetail.privilege.deepServiceDetail.realWorldScenario}
                  </p>
                </div>

                {/* Column 3: Active Tier Specific Delivery Rule */}
                <div className="p-4 rounded-[6px] bg-[#151517] border border-[#D8B98A]/50 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#D8B98A] font-medium">
                      【{activeTier.name}】专属兑现细则
                    </span>
                    <span className="tabular-nums text-[11px] text-[#BF8943] font-semibold">
                      {activePrivilegeDetail.activeCell.badgeLabel}
                    </span>
                  </div>
                  <p
                    data-testid="privilege-detail-tier-note"
                    className="text-xs text-[#F2EFE9] leading-relaxed"
                  >
                    {activePrivilegeDetail.activeTierNote}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto rounded-[8px] border border-[#2A2A2E] bg-[#0B0B0C]">
            <table
              data-testid="membership-privilege-table"
              className="w-full min-w-[780px] text-left border-collapse"
            >
              <thead>
                <tr className="border-b border-[#2A2A2E] bg-[#151517]/90 text-xs">
                  <th className="py-3.5 px-4 font-medium text-[#A3A09A] w-[26%]">
                    权益条目（点击行切换上方深度服务细则）
                  </th>
                  {MEMBERSHIP_TIERS.map((tier) => {
                    const isColActive = tier.id === selectedTierId;
                    return (
                      <th
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`py-3.5 px-4 font-medium transition-colors cursor-pointer w-[18.5%] ${
                          isColActive
                            ? 'bg-[#D8B98A]/12 text-[#D8B98A] border-b-2 border-b-[#D8B98A]'
                            : 'text-[#F2EFE9] hover:text-[#D8B98A]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span>{tier.name}</span>
                          <span className="tabular-nums text-[11px] text-[#BF8943]">
                            {tier.priceDisplay}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2E]">
                {MEMBERSHIP_PRIVILEGE_COMPARISON_MATRIX.map((priv) => {
                  const isRowSelected = priv.id === selectedPrivilegeId;
                  return (
                    <tr
                      key={priv.id}
                      data-testid={`privilege-row-${priv.id}`}
                      data-selected={isRowSelected ? 'true' : 'false'}
                      onClick={() => setSelectedPrivilegeId(priv.id)}
                      className={`transition-colors cursor-pointer ${
                        isRowSelected
                          ? 'bg-[#151517]'
                          : 'bg-[#0B0B0C] hover:bg-[#151517]/60'
                      }`}
                    >
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center justify-between text-[11px] text-[#D8B98A] mb-1">
                          <span className="tabular-nums font-medium">{priv.code}</span>
                          <span className="text-[#A3A09A]">{priv.category}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPrivilegeId(priv.id);
                          }}
                          className="text-left font-editorial text-base font-medium text-[#F2EFE9] hover:text-[#D8B98A] transition-colors cursor-pointer block"
                        >
                          {priv.title}
                        </button>
                        <p className="text-[11px] text-[#A3A09A] mt-1 leading-relaxed">
                          {priv.shortDesc}
                        </p>
                      </td>

                      {MEMBERSHIP_TIERS.map((tier) => {
                        const cell = priv.tierCells[tier.id];
                        const isColActive = tier.id === selectedTierId;
                        return (
                          <td
                            key={tier.id}
                            className={`py-4 px-4 align-top transition-colors ${
                              isColActive
                                ? 'bg-[#D8B98A]/10 border-x border-[#D8B98A]/30'
                                : ''
                            }`}
                          >
                            <div className="space-y-1.5">
                              <span
                                className={`inline-block text-[11px] font-medium ${
                                  isColActive ? 'text-[#D8B98A]' : 'text-[#BF8943]'
                                }`}
                              >
                                {cell.badgeLabel}
                              </span>
                              <p
                                className={`text-xs leading-relaxed ${
                                  isColActive ? 'text-[#F2EFE9] font-medium' : 'text-[#A3A09A]'
                                }`}
                              >
                                {cell.summary}
                              </p>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </BolCard>
    </section>
  );
};

