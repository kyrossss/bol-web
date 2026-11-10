import React, { useState, useEffect } from 'react';
import { ArrowRight, Network, Sparkles, Loader2, GitBranch, Compass, FileText } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { INDUSTRY_OPTIONS, RHYTHM_OPTIONS } from '../../content';
import {
  buildAiInterestClusterMatrix,
  buildConnectionPotentialRadar,
  buildDeterministicDeepFitReport,
  buildDigitalFootprintParticles,
  computeSocialResonance,
} from '../../lib/curationEngine';
import {
  ActivityFrequencyId,
  AiDeepCircleFitReport,
  AiInterestClusterMatrix,
  BolEvent,
  CityName,
  IndustryDomainId,
  SocialRhythmId,
} from '../../types/bol';
import { BolLogoMark } from '../visuals/BolLogo';
import { BolCard } from '../visuals/BolCard';
import { HapticButton } from '../visuals/HapticButton';
import { InteractiveGlowZone } from '../visuals/InteractiveGlowZone';

interface ConnectionSandboxSectionProps {
  onSelectRecommendedEvent: (event: BolEvent) => void;
  onApplyWithProfile: (
    industry: IndustryDomainId,
    rhythm: SocialRhythmId,
    city: Exclude<CityName, '全部城市'>
  ) => void;
}

const SANDBOX_CAREER_PRESETS: Array<{
  label: string;
  careerData: string;
  industry: IndustryDomainId;
  rhythm: SocialRhythmId;
  city: Exclude<CityName, '全部城市'>;
}> = [
  {
    label: 'AI 穿戴硬件创始人 · 深圳',
    careerData: '前硅谷硬件工程师，现居深圳南山，主导多模态 AI 穿戴设备研发与北美商超渠道拓展',
    industry: 'ai-tech',
    rhythm: 'tipsy-salon',
    city: '深圳',
  },
  {
    label: '全球 DTC 品牌操盘手 · 广州',
    careerData: '伦敦政经校友，负责新消费家居独立站欧美增长与珠三角柔性供应链升级',
    industry: 'cross-border',
    rhythm: 'frontier-forum',
    city: '广州',
  },
  {
    label: '实业接班与家办配置 · 香港',
    careerData: '大湾区精密制造企业二代及香港单一家办合伙人，关注跨境控股并购与维港帆船',
    industry: 'investment-family',
    rhythm: 'closed-banquet',
    city: '香港',
  },
  {
    label: '独立建筑与买手空间 · 上海',
    careerData: 'AA 建筑联盟学院校友，在上海主理历史街区改造、威士忌暗调空间与东方香氛策展',
    industry: 'creative-arch',
    rhythm: 'tipsy-salon',
    city: '上海',
  },
];

export const ConnectionSandboxSection: React.FC<ConnectionSandboxSectionProps> = ({
  onSelectRecommendedEvent,
  onApplyWithProfile,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [industry, setIndustry] = useState<IndustryDomainId>('ai-tech');
  const [rhythm, setRhythm] = useState<SocialRhythmId>('tipsy-salon');
  const [city, setCity] = useState<Exclude<CityName, '全部城市'>>('深圳');
  const [activityFrequency, setActivityFrequency] =
    useState<ActivityFrequencyId>('biweekly-3-4');

  // AI-Driven Connection Interest Clustering State
  const [careerData, setCareerData] = useState<string>(
    SANDBOX_CAREER_PRESETS[0].careerData
  );
  const [isClustering, setIsClustering] = useState<boolean>(false);
  const [clusterMatrix, setClusterMatrix] = useState<AiInterestClusterMatrix>(() =>
    buildAiInterestClusterMatrix({
      careerData: SANDBOX_CAREER_PRESETS[0].careerData,
      industry: 'ai-tech',
      rhythm: 'tipsy-salon',
      city: '深圳',
    })
  );
  const [activeClusterIndex, setActiveClusterIndex] = useState<number>(0);

  // Deep Fit Analysis Widget ("深度契合度"分析小部件) State
  const [deepFitInput, setDeepFitInput] = useState<string>(
    SANDBOX_CAREER_PRESETS[0].careerData
  );
  const [isAnalyzingDeepFit, setIsAnalyzingDeepFit] = useState<boolean>(false);
  const [deepFitReport, setDeepFitReport] = useState<AiDeepCircleFitReport>(() =>
    buildDeterministicDeepFitReport({
      careerDescription: SANDBOX_CAREER_PRESETS[0].careerData,
      city: '深圳',
      industry: 'ai-tech',
      rhythm: 'tipsy-salon',
    })
  );

  // Sync deterministic cluster matrix and deep fit report when city / industry / rhythm buttons change
  useEffect(() => {
    setClusterMatrix(
      buildAiInterestClusterMatrix({
        careerData,
        industry,
        rhythm,
        city,
      })
    );
    setDeepFitReport(
      buildDeterministicDeepFitReport({
        careerDescription: deepFitInput,
        city,
        industry,
        rhythm,
      })
    );
  }, [industry, rhythm, city]);

  const handleRunDeepFitReport = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsAnalyzingDeepFit(true);
    try {
      const response = await fetch('/api/sandbox/deep-fit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerDescription: deepFitInput.trim(),
          city,
          industry,
          rhythm,
        }),
      });

      if (!response.ok) {
        throw new Error('深度契合度分析暂时繁忙');
      }

      const data: AiDeepCircleFitReport = await response.json();
      setDeepFitReport(data);
    } catch {
      const fallback = buildDeterministicDeepFitReport({
        careerDescription: deepFitInput.trim(),
        city,
        industry,
        rhythm,
      });
      setDeepFitReport(fallback);
    } finally {
      setIsAnalyzingDeepFit(false);
    }
  };

  const handleRunAiClustering = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsClustering(true);
    try {
      const response = await fetch('/api/sandbox/interest-clusters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerData: careerData.trim(),
          industry,
          rhythm,
          city,
        }),
      });

      if (!response.ok) {
        throw new Error('聚类生成暂时繁忙');
      }

      const data: AiInterestClusterMatrix = await response.json();
      setClusterMatrix(data);
      setActiveClusterIndex(0);
    } catch {
      const fallback = buildAiInterestClusterMatrix({
        careerData: careerData.trim(),
        industry,
        rhythm,
        city,
      });
      setClusterMatrix(fallback);
      setActiveClusterIndex(0);
    } finally {
      setIsClustering(false);
    }
  };

  const recommendation = computeSocialResonance(industry, rhythm, city);
  const potentialAnalysis = buildConnectionPotentialRadar({
    industry,
    rhythm,
    city,
    careerData,
  });
  const digitalFootprint = buildDigitalFootprintParticles({
    activityFrequency,
    industry,
    city,
  });
  const frequencyOptions: Array<{ id: ActivityFrequencyId; label: string }> = [
    { id: 'monthly-1-2', label: '1–2 场/月 · 精选深聊' },
    { id: 'biweekly-3-4', label: '3–4 场/月 · 高频同频' },
    { id: 'weekly-5-plus', label: '5+ 场/月 · 核心主理共创' },
  ];
  const cities: Array<Exclude<CityName, '全部城市'>> = ['深圳', '广州', '香港', '上海'];
  const activeCluster =
    clusterMatrix.clusters[activeClusterIndex] || clusterMatrix.clusters[0];
  const activePath =
    clusterMatrix.connectionPaths[activeClusterIndex] ||
    clusterMatrix.connectionPaths[0];

  return (
    <section
      id="sandbox"
      className="bol-snap-section py-16 lg:py-24 px-6 lg:px-12 max-w-[1360px] mx-auto border-t border-[#2A2A2E]"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs text-[#D8B98A] tracking-widest mb-2">
            03. CONNECTION SANDBOX · 万象同频连接沙盘与 AI 连接潜能看板
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#F2EFE9]">
            输入您的行业背景与社交状态，推演未来 90 天的真实连接
          </h2>
        </div>
        <p className="text-sm text-[#A3A09A] max-w-md leading-relaxed">
          BoL 不做随机盲盒式的社交堆积。通过行业语境、常驻城市、AI 连接潜能雷达图与兴趣聚类引擎，为您实时展示与当前俱乐部圈层的契合度及潜在社交路径。
        </p>
      </div>

      <InteractiveGlowZone className="rounded-[10px]">
        {/* Top 2-Column Sandbox Control & Resonance Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          {/* Left Control Column (5 cols) */}
          <BolCard
            delay={0.04}
            className="lg:col-span-5 p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#2A2A2E] flex flex-col justify-between space-y-6"
          >
            <div className="space-y-6">
              {/* Step 1: City Selection */}
              <div>
                <p className="text-xs font-medium text-[#D8B98A] mb-2.5">
                  STEP 01 · 选择常驻或高频往返城市
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {cities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(c)}
                      className={`py-2 px-3 rounded-[6px] text-xs font-medium border transition-colors cursor-pointer ${
                        city === c
                          ? 'bg-[#D8B98A] text-[#0B0B0C] border-[#D8B98A]'
                          : 'bg-[#0B0B0C] text-[#A3A09A] border-[#2A2A2E] hover:text-[#F2EFE9]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Industry Background */}
              <div>
                <p className="text-xs font-medium text-[#D8B98A] mb-2.5">
                  STEP 02 · 您的行业背景或关注领域
                </p>
                <div className="space-y-2">
                  {INDUSTRY_OPTIONS.map((item) => {
                    const isSelected = industry === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIndustry(item.id)}
                        className={`w-full text-left p-3.5 rounded-[6px] border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B0B0C] border-[#D8B98A] text-[#F2EFE9]'
                            : 'bg-[#0B0B0C]/40 border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-medium text-[#F2EFE9] mb-0.5">
                          <span>{item.label}</span>
                          <span className="text-[11px] text-[#D8B98A]">{item.enLabel}</span>
                        </div>
                        <p className="text-[11px] text-[#A3A09A]">{item.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Preferred Social Rhythm */}
              <div>
                <p className="text-xs font-medium text-[#D8B98A] mb-2.5">
                  STEP 03 · 偏好的线下交流状态
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RHYTHM_OPTIONS.map((item) => {
                    const isSelected = rhythm === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRhythm(item.id)}
                        className={`text-left p-3 rounded-[6px] border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B0B0C] border-[#D8B98A] text-[#F2EFE9]'
                            : 'bg-[#0B0B0C]/40 border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9]'
                        }`}
                      >
                        <p className="text-xs font-medium text-[#F2EFE9] mb-0.5">{item.label}</p>
                        <p className="text-[11px] text-[#A3A09A] truncate">{item.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <HapticButton
              type="button"
              data-testid="sandbox-generate-invite-btn"
              onClick={() => onApplyWithProfile(industry, rhythm, city)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs sm:text-sm font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
            >
              <span>以当前画像生成专属赴约邀请码</span>
              <ArrowRight className="w-4 h-4" />
            </HapticButton>
          </BolCard>

          {/* Right Output & Link Graph Column (7 cols) */}
          <BolCard
            delay={0.1}
            className="lg:col-span-7 p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#2A2A2E] bol-wine-glow flex flex-col justify-between space-y-6"
          >
            {/* Top Summary Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2A2A2E]">
              <div className="flex items-center gap-3">
                <BolLogoMark size={32} tone="champagne" />
                <div>
                  <p className="text-xs text-[#A3A09A]">主理人连接沙盘推演结果</p>
                  <h3 className="font-editorial text-2xl font-medium text-[#F2EFE9]">
                    {city}站 · 同频人群与场域匹配提案
                  </h3>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#A3A09A] block">场域同频指数</span>
                <span
                  data-testid="resonance-match-score"
                  className="tabular-nums text-2xl font-semibold text-[#D8B98A]"
                >
                  {recommendation.matchScore}%
                </span>
              </div>
            </div>

            {/* Rationale & Peer Cluster */}
            <div className="p-4 rounded-[6px] bg-[#0B0B0C]/80 border border-[#2A2A2E] space-y-2">
              <p className="text-xs text-[#D8B98A] font-medium">主理人定制建议</p>
              <p className="text-sm text-[#F2EFE9] leading-relaxed">{recommendation.rationale}</p>
              <p className="text-xs text-[#A3A09A] pt-1 border-t border-[#2A2A2E]/70">
                <span>高频共处人群构成：</span>
                <span className="text-[#F2EFE9]">{recommendation.peerClusterDescription}</span>
              </p>
            </div>

            {/* 3 Suggested Cross-Industry Connections */}
            <div>
              <div className="flex items-center gap-2 text-xs text-[#D8B98A] mb-3">
                <Network className="w-3.5 h-3.5" />
                <span>典型同桌嘉宾画像（保护真实隐私，展示连接维度）</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendation.suggestedConnections.map((conn, idx) => (
                  <div
                    key={conn.role}
                    className="p-3.5 rounded-[6px] bg-[#0B0B0C]/90 border border-[#2A2A2E] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#A3A09A] mb-1.5">
                        <span className="tabular-nums text-[#D8B98A]">LINK 0{idx + 1}</span>
                        <span>{conn.city}</span>
                      </div>
                      <p className="text-xs font-medium text-[#F2EFE9] leading-snug mb-2">
                        {conn.role}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#A3A09A] pt-2 border-t border-[#2A2A2E]">
                      共鸣话题：{conn.sharedTopic}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Gatherings & Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#2A2A2E]">
              {recommendation.recommendedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#A3A09A] mb-1">
                      <span className="text-[#D8B98A]">{ev.seriesLabel}</span>
                      <span className="tabular-nums">{ev.city} · {ev.date}</span>
                    </div>
                    <h4 className="font-editorial text-lg font-medium text-[#F2EFE9] mb-2">
                      {ev.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectRecommendedEvent(ev)}
                    className="text-xs text-[#D8B98A] hover:text-[#F2EFE9] inline-flex items-center gap-1 cursor-pointer self-start"
                  >
                    <span>查看该场次完整语境</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </BolCard>
        </div>

        {/* Middle AI Analysis Dashboard: Connection Potential Radar Chart (Recharts) & Potential Social Paths */}
        <BolCard
          delay={0.12}
          data-testid="ai-connection-potential-board"
          className="p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#D8B98A]/40 mb-8 space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#2A2A2E]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#D8B98A] mb-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>
                  AI CONNECTION POTENTIAL RADAR & DIGITAL FOOTPRINT · AI 连接潜能雷达与「数字足迹」气流可视化
                </span>
              </div>
              <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#F2EFE9] text-balance">
                {city}圈层契合度评估 · {potentialAnalysis.circleFitLabel}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              {/* Digital Footprint Activity Frequency Selector */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-[7px] bg-[#0B0B0C] border border-[#2A2A2E]">
                <span className="text-[11px] text-[#A3A09A] px-2">
                  会员活跃频率：
                </span>
                {frequencyOptions.map((freq) => {
                  const isActiveFreq = activityFrequency === freq.id;
                  return (
                    <button
                      key={freq.id}
                      type="button"
                      data-testid={`digital-footprint-freq-${freq.id}`}
                      onClick={() => setActivityFrequency(freq.id)}
                      className={`px-2.5 py-1 rounded-[5px] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActiveFreq
                          ? 'bg-[#D8B98A] text-[#0B0B0C]'
                          : 'text-[#A3A09A] hover:text-[#F2EFE9]'
                      }`}
                    >
                      {freq.label}
                    </button>
                  );
                })}
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[#A3A09A] block">综合连接潜能指数</span>
                <span
                  data-testid="radar-composite-score"
                  className="tabular-nums text-2xl font-semibold text-[#D8B98A]"
                >
                  {potentialAnalysis.compositeScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 5 cols: Recharts Connection Potential Radar Chart + Framer Motion Digital Footprint Airflow Background */}
            <div
              data-testid="connection-potential-radar-chart"
              className="lg:col-span-5 p-5 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs border-b border-[#2A2A2E] pb-3 mb-2">
                <span className="text-[#D8B98A] font-medium">
                  六维连接潜能雷达图 · 数字足迹气流粒子
                </span>
                <div className="flex items-center gap-3 text-[11px] text-[#A3A09A]">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#D8B98A]" />
                    <span>当前您的潜能</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#BF8943]" />
                    <span>俱乐部基准</span>
                  </span>
                </div>
              </div>

              {/* Radar Viewport with Framer Motion Digital Footprint Airflow Particles in Background */}
              <div className="relative w-full h-[270px] sm:h-[290px] overflow-hidden rounded-[6px]">
                {/* Framer Motion Digital Footprint Airflow Particle Background Layer */}
                <svg
                  data-testid="digital-footprint-airflow-canvas"
                  data-activity-frequency={digitalFootprint.activityFrequency}
                  data-industry-domain={digitalFootprint.industry}
                  data-particle-count={digitalFootprint.particles.length}
                  viewBox="0 0 360 280"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 w-full h-full z-0"
                >
                  <defs>
                    <radialGradient
                      id={`footprintCoreGlow-${industry}`}
                      cx="50%"
                      cy="50%"
                      r="55%"
                    >
                      <stop
                        offset="0%"
                        stopColor={digitalFootprint.domainColorHex}
                        stopOpacity="0.22"
                      />
                      <stop
                        offset="65%"
                        stopColor={digitalFootprint.secondaryColorHex}
                        stopOpacity="0.06"
                      />
                      <stop offset="100%" stopColor="#0B0B0C" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Ambient Domain Core Aura */}
                  <circle
                    cx="180"
                    cy="140"
                    r="118"
                    fill={`url(#footprintCoreGlow-${industry})`}
                  />

                  {/* 3 Orbital Connection Airflow Trajectories */}
                  {digitalFootprint.airflowSvgPaths.map((pathD, pIdx) => (
                    <motion.path
                      key={`airflow-track-${industry}-${activityFrequency}-${pIdx}`}
                      d={pathD}
                      fill="none"
                      stroke={
                        pIdx % 2 === 0
                          ? digitalFootprint.domainColorHex
                          : digitalFootprint.secondaryColorHex
                      }
                      strokeWidth={1.1}
                      strokeDasharray="4 6"
                      initial={{ opacity: 0.14 }}
                      animate={
                        prefersReducedMotion
                          ? { opacity: 0.24 }
                          : { opacity: [0.14, 0.34, 0.14] }
                      }
                      transition={{
                        duration: 3.4 / digitalFootprint.airflowVelocityMultiplier,
                        repeat: Infinity,
                        delay: pIdx * 0.4,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}

                  {/* Animated Digital Footprint Airflow Particles along Connection Paths */}
                  {digitalFootprint.particles.map((particle) => (
                    <motion.circle
                      key={particle.id}
                      data-testid={`digital-footprint-particle-${particle.id}`}
                      r={particle.radiusPx}
                      fill={particle.colorHex}
                      initial={{
                        cx: particle.waypointsX[0],
                        cy: particle.waypointsY[0],
                        opacity: 0.25,
                      }}
                      animate={
                        prefersReducedMotion
                          ? {
                              cx: particle.waypointsX[1],
                              cy: particle.waypointsY[1],
                              opacity: particle.peakOpacity,
                            }
                          : {
                              cx: particle.waypointsX,
                              cy: particle.waypointsY,
                              opacity: [
                                0.2,
                                particle.peakOpacity,
                                particle.peakOpacity * 0.85,
                                0.2,
                              ],
                              scale: [0.85, 1.35, 1.05, 0.85],
                            }
                      }
                      transition={{
                        duration: particle.durationSec,
                        delay: particle.delaySec,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  ))}
                </svg>

                {/* Foreground Recharts Connection Potential Radar */}
                <div className="relative z-10 w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="72%"
                      data={potentialAnalysis.radarData}
                    >
                      <PolarGrid stroke="#2A2A2E" />
                      <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fill: '#F2EFE9', fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[60, 100]}
                        tick={{ fill: '#A3A09A', fontSize: 10 }}
                        axisLine={false}
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
                          name === 'userScore' ? '您的连接潜能' : '俱乐部圈层基准',
                        ]}
                      />
                      <Radar
                        name="clubBenchmark"
                        dataKey="clubBenchmark"
                        stroke="#BF8943"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        fill="#BF8943"
                        fillOpacity={0.14}
                      />
                      <Radar
                        name="userScore"
                        dataKey="userScore"
                        stroke={digitalFootprint.domainColorHex}
                        strokeWidth={2.2}
                        fill={digitalFootprint.domainColorHex}
                        fillOpacity={0.32}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Digital Footprint Airflow Summary Strip */}
              <div
                data-testid="digital-footprint-summary"
                className="pt-2.5 pb-2 border-t border-[#2A2A2E] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A3A09A]"
              >
                <span>
                  数字足迹：<strong className="text-[#D8B98A] font-medium">{digitalFootprint.airflowVelocityLabel}</strong>
                </span>
                <span className="tabular-nums text-[#F2EFE9]">
                  气流粒子 {digitalFootprint.particles.length} 组 · 年化 {digitalFootprint.annualFootprintSessions} 场
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#2A2A2E]">
                {potentialAnalysis.radarData.slice(0, 3).map((dim) => (
                  <div key={dim.dimension} className="text-xs">
                    <span className="text-[11px] text-[#A3A09A] block truncate">
                      {dim.dimension}
                    </span>
                    <span className="tabular-nums font-semibold text-[#D8B98A]">
                      {dim.userScore}%
                    </span>
                    <span className="tabular-nums text-[10px] text-[#A3A09A] ml-1">
                      / 基准 {dim.clubBenchmark}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 7 cols: AI Executive Summary & 3-Stage Potential Social Paths */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="p-4 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D8B98A] font-medium">
                    AI 圈层契合度诊断摘要 · {potentialAnalysis.boardTitle}
                  </span>
                  <span className="tabular-nums text-[11px] text-[#A3A09A]">
                    实时同步：{city} · {INDUSTRY_OPTIONS.find((i) => i.id === industry)?.label}
                  </span>
                </div>
                <p
                  data-testid="radar-ai-summary"
                  className="text-xs sm:text-sm text-[#F2EFE9] leading-relaxed"
                >
                  {potentialAnalysis.aiSummary}
                </p>
              </div>

              <div
                data-testid="potential-social-paths-list"
                className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1"
              >
                {potentialAnalysis.potentialPaths.map((stepItem, idx) => (
                  <div
                    key={stepItem.stepCode}
                    data-testid={`potential-social-path-${idx}`}
                    className="p-4 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] hover:border-[#D8B98A]/60 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#D8B98A] font-medium">{stepItem.stepCode}</span>
                        <span className="tabular-nums text-xs font-semibold text-[#BF8943]">
                          契合度 {stepItem.conversionPct}%
                        </span>
                      </div>

                      <h4 className="font-editorial text-lg font-medium text-[#F2EFE9]">
                        {stepItem.stageTitle}
                      </h4>

                      <p className="text-xs text-[#F2EFE9]/90 leading-relaxed">
                        <span className="text-[#A3A09A]">核心圈层：</span>
                        {stepItem.targetCircle}
                      </p>
                    </div>

                    <p className="text-[11px] text-[#A3A09A] pt-2.5 border-t border-[#2A2A2E] leading-relaxed">
                      <span className="text-[#D8B98A]">催化路径：</span>
                      {stepItem.actionCatalyst}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BolCard>

        {/* Bottom Full-Width Studio: AI-Driven "连接兴趣聚类" & Framer Motion Dynamic Connection Paths */}
        <BolCard
          delay={0.14}
          data-testid="ai-interest-cluster-studio"
          className="p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#D8B98A]/45 bol-champagne-glow space-y-6"
        >
          {/* Studio Header & Career Profile Input Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#2A2A2E]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#D8B98A] mb-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                <span>AI INTEREST CLUSTERING & PATH MATRIX · AI 驱动「连接兴趣聚类」与动态社交推荐矩阵</span>
              </div>
              <h3
                data-testid="interest-cluster-theme-title"
                className="font-editorial text-2xl sm:text-3xl font-medium text-[#F2EFE9]"
              >
                {clusterMatrix.clusterThemeTitle}
              </h3>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[11px] text-[#A3A09A] block">AI 兴趣聚类共鸣度</span>
                <span
                  data-testid="interest-cluster-resonance"
                  className="tabular-nums text-2xl font-semibold text-[#BF8943]"
                >
                  {clusterMatrix.overallResonance}%
                </span>
              </div>
            </div>
          </div>

          {/* Career Data Input + Presets + AI Trigger */}
          <form
            onSubmit={handleRunAiClustering}
            className="p-4 sm:p-5 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="sandbox-career-data-input"
                className="text-xs font-medium text-[#F2EFE9]"
              >
                输入您的具体职业数据与近期关注议题（AI 将实时重算兴趣聚类与连接路径）：
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-[#A3A09A]">典型职业模板：</span>
                {SANDBOX_CAREER_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.label}
                    type="button"
                    data-testid={`sandbox-career-preset-${idx}`}
                    onClick={() => {
                      setCareerData(preset.careerData);
                      setIndustry(preset.industry);
                      setRhythm(preset.rhythm);
                      setCity(preset.city);
                      setClusterMatrix(
                        buildAiInterestClusterMatrix({
                          careerData: preset.careerData,
                          industry: preset.industry,
                          rhythm: preset.rhythm,
                          city: preset.city,
                        })
                      );
                      setActiveClusterIndex(0);
                    }}
                    className="px-2.5 py-1 rounded-[6px] text-[11px] bg-[#151517] border border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9] hover:border-[#D8B98A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                id="sandbox-career-data-input"
                data-testid="sandbox-career-data-input"
                type="text"
                value={careerData}
                onChange={(e) => setCareerData(e.target.value)}
                placeholder="例如：前硅谷 AI 硬件工程师，目前在深圳负责多模态穿戴设备研发与北美商超渠道..."
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#151517] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] placeholder:text-[#A3A09A]/50 focus:outline-none focus:border-[#D8B98A]"
              />

              <HapticButton
                type="submit"
                disabled={isClustering}
                data-testid="run-ai-clustering-btn"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isClustering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在生成兴趣聚类...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>生成 AI 连接兴趣聚类</span>
                  </>
                )}
              </HapticButton>
            </div>
          </form>

          {/* Main Split: Left Framer Motion Dynamic Connection Path Topology (5 cols) + Right 2x2 Social Recommendation Matrix (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Framer Motion Dynamic Connection Path Visualization */}
            <div
              data-testid="framer-motion-connection-paths"
              className="lg:col-span-5 p-5 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between text-xs border-b border-[#2A2A2E] pb-3">
                <span className="text-[#D8B98A] font-medium">
                  DYNAMIC CONNECTION PATHS · 动态连接路径图谱
                </span>
                <span className="tabular-nums text-[#A3A09A]">
                  已激活路径 0{activeClusterIndex + 1} / 04
                </span>
              </div>

              {/* Interactive SVG Topology Canvas with Framer Motion Animated Paths */}
              <div className="relative w-full aspect-[8/3] sm:aspect-[16/7] lg:aspect-[8/4] bg-[#151517]/75 rounded-[6px] border border-[#2A2A2E] overflow-hidden flex items-center justify-center">
                <svg
                  viewBox="0 0 640 240"
                  className="w-full h-full"
                  role="img"
                  aria-label="AI 连接兴趣聚类动态路径拓扑图"
                >
                  <defs>
                    <radialGradient id="bolCenterHubGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#D8B98A" stopOpacity="0.38" />
                      <stop offset="100%" stopColor="#D8B98A" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Subtle Coordinate Grid Lines */}
                  <line x1="320" y1="0" x2="320" y2="240" stroke="#2A2A2E" strokeDasharray="3 5" />
                  <line x1="0" y1="120" x2="640" y2="120" stroke="#2A2A2E" strokeDasharray="3 5" />

                  {/* Animated Bezier Connection Paths */}
                  {clusterMatrix.connectionPaths.map((pathItem, idx) => {
                    const isActivePath = idx === activeClusterIndex;
                    return (
                      <g key={`${pathItem.id}-${clusterMatrix.clusterThemeTitle}`}>
                        {/* Base Track Path */}
                        <path
                          d={pathItem.svgPath}
                          fill="none"
                          stroke="#2A2A2E"
                          strokeWidth={isActivePath ? 2.5 : 1.5}
                        />

                        {/* Framer Motion Animated Gold Connection Path */}
                        <motion.path
                          data-testid={`dynamic-connection-path-${idx}`}
                          d={pathItem.svgPath}
                          fill="none"
                          stroke={isActivePath ? '#D8B98A' : '#BF8943'}
                          strokeWidth={isActivePath ? 2.8 : 1.5}
                          strokeOpacity={isActivePath ? 1 : 0.45}
                          initial={
                            prefersReducedMotion
                              ? { pathLength: 1, opacity: 1 }
                              : { pathLength: 0, opacity: 0.2 }
                          }
                          animate={{
                            pathLength: 1,
                            opacity: isActivePath ? 1 : 0.45,
                          }}
                          transition={{
                            duration: 0.75,
                            delay: idx * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </g>
                    );
                  })}

                  {/* 4 Outer Interest Cluster Nodes */}
                  {clusterMatrix.clusters.map((cluster, idx) => {
                    const isSelected = idx === activeClusterIndex;
                    return (
                      <g
                        key={cluster.id}
                        onClick={() => setActiveClusterIndex(idx)}
                        className="cursor-pointer"
                      >
                        <motion.circle
                          cx={cluster.nodeX}
                          cy={cluster.nodeY}
                          r={isSelected ? 22 : 16}
                          fill="#0B0B0C"
                          stroke={isSelected ? '#D8B98A' : '#2A2A2E'}
                          strokeWidth={isSelected ? 2 : 1.2}
                          initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
                          animate={{ scale: isSelected ? 1.08 : 1, opacity: 1 }}
                          transition={{ duration: 0.35 }}
                        />
                        <text
                          x={cluster.nodeX}
                          y={cluster.nodeY + 4}
                          textAnchor="middle"
                          fill={isSelected ? '#D8B98A' : '#F2EFE9'}
                          fontSize="11"
                          fontWeight="600"
                        >
                          {cluster.affinityPct}%
                        </text>
                        <text
                          x={cluster.nodeX}
                          y={cluster.nodeY < 120 ? cluster.nodeY - 28 : cluster.nodeY + 36}
                          textAnchor="middle"
                          fill={isSelected ? '#F2EFE9' : '#A3A09A'}
                          fontSize="11"
                        >
                          {cluster.clusterName}
                        </text>
                      </g>
                    );
                  })}

                  {/* Center User Career Hub Node */}
                  <g>
                    <circle cx="320" cy="120" r="44" fill="url(#bolCenterHubGlow)" />
                    <circle
                      cx="320"
                      cy="120"
                      r="24"
                      fill="#151517"
                      stroke="#D8B98A"
                      strokeWidth="2"
                    />
                    <text
                      x="320"
                      y="124"
                      textAnchor="middle"
                      fill="#F2EFE9"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {city} · 您
                    </text>
                  </g>
                </svg>
              </div>

              {/* Active Connection Path Inspector Card */}
              <div
                data-testid="active-connection-path-detail"
                className="p-3.5 rounded-[6px] bg-[#151517] border border-[#D8B98A]/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D8B98A] font-medium">
                    当前高亮路径：{activePath.fromLabel} → {activePath.toLabel}
                  </span>
                  <span className="tabular-nums text-[#BF8943] font-semibold">
                    同频强度 {activePath.synergyStrength}%
                  </span>
                </div>
                <p className="text-xs text-[#F2EFE9]">
                  连接价值桥梁：<span className="text-[#D8B98A]">{activePath.bridgeTopic}</span>
                </p>
                <p className="text-[11px] text-[#A3A09A]">
                  推荐落地场景：{activeCluster.recommendedScene}
                </p>
              </div>
            </div>

            {/* Right: 2x2 Dynamic Social Recommendation Matrix */}
            <div
              data-testid="dynamic-social-recommendation-matrix"
              className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {clusterMatrix.clusters.map((cluster, idx) => {
                const isSelected = idx === activeClusterIndex;
                const pathObj = clusterMatrix.connectionPaths[idx];
                return (
                  <motion.div
                    key={`${cluster.id}-${cluster.clusterName}`}
                    data-testid={`interest-cluster-card-${idx}`}
                    onClick={() => setActiveClusterIndex(idx)}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 12 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={
                      prefersReducedMotion ? undefined : { y: -3, scale: 1.005 }
                    }
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`p-5 rounded-[8px] border flex flex-col justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#0B0B0C] border-[#D8B98A]'
                        : 'bg-[#0B0B0C]/65 border-[#2A2A2E] hover:border-[#D8B98A]/50'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Unboxed Single-Line Metadata Header */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="tabular-nums text-[#D8B98A] font-medium truncate">
                          {cluster.code} · {cluster.enTag}
                        </span>
                        <span className="tabular-nums text-xs sm:text-sm font-semibold text-[#BF8943] whitespace-nowrap shrink-0">
                          契合度 {cluster.affinityPct}%
                        </span>
                      </div>

                      <h4 className="font-editorial text-xl font-medium text-[#F2EFE9]">
                        {cluster.clusterName}
                      </h4>

                      <p className="text-xs text-[#F2EFE9]/90 leading-relaxed">
                        <span className="text-[#A3A09A]">同频成员构成：</span>
                        {cluster.peerPersona}
                      </p>

                      <p className="text-xs text-[#A3A09A] leading-relaxed">
                        <span className="text-[#D8B98A]">破冰共鸣议题：</span>
                        {cluster.catalystTopic}
                      </p>
                    </div>

                    <div className="pt-3 mt-4 border-t border-[#2A2A2E] flex items-center justify-between text-[11px]">
                      <span className="text-[#A3A09A] truncate pr-2">
                        桥梁：{pathObj.bridgeTopic}
                      </span>
                      <span className="text-[#D8B98A] whitespace-nowrap shrink-0">
                        {isSelected ? '路径已高亮' : '点击查看路径'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </BolCard>

        {/* Deep Fit Analysis Widget ("深度契合度"分析小部件) */}
        <BolCard
          delay={0.16}
          data-testid="deep-circle-fit-widget"
          className="mt-8 p-6 sm:p-8 rounded-[8px] bg-[#151517] border border-[#D8B98A]/50 space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#2A2A2E]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#D8B98A] mb-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>
                  DEEP CIRCLE FIT DOSSIER · AI「深度契合度」分析小部件（针对 BoL 现有活跃圈层）
                </span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#F2EFE9]">
                模拟输入您的个人职业描述，实时生成 BoL 活跃圈层契合度报告
              </h3>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[#A3A09A] block">
                  档案编号 · {deepFitReport.reportNo}
                </span>
                <span
                  data-testid="deep-fit-overall-score"
                  className="tabular-nums text-2xl font-semibold text-[#D8B98A]"
                >
                  深度契合度 {deepFitReport.overallFitScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 5 cols: Simulated Career Description Input & Quick Persona Simulation */}
            <form
              onSubmit={handleRunDeepFitReport}
              className="lg:col-span-5 p-5 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="deep-fit-career-textarea"
                    className="block text-xs font-medium text-[#D8B98A] mb-2"
                  >
                    模拟输入个人职业描述（包含海外背景、当前主理业务或寻找的跨界资源）：
                  </label>
                  <textarea
                    id="deep-fit-career-textarea"
                    data-testid="deep-fit-career-textarea"
                    rows={4}
                    value={deepFitInput}
                    onChange={(e) => setDeepFitInput(e.target.value)}
                    placeholder="例如：哥大硕士，前硅谷 AI 穿戴硬件产品负责人，现居深圳南山创业，希望对接珠三角精密供应链与北美线下渠道合伙人..."
                    className="w-full p-3.5 text-xs sm:text-sm bg-[#151517] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] placeholder:text-[#A3A09A]/50 focus:outline-none focus:border-[#D8B98A] leading-relaxed resize-none"
                  />
                </div>

                <div>
                  <p className="text-[11px] text-[#A3A09A] mb-2">
                    快速模拟典型海归/主理人履历：
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SANDBOX_CAREER_PRESETS.map((preset, idx) => (
                      <button
                        key={`deep-fit-preset-${preset.label}`}
                        type="button"
                        data-testid={`deep-fit-preset-${idx}`}
                        onClick={() => {
                          setDeepFitInput(preset.careerData);
                          setCity(preset.city);
                          setIndustry(preset.industry);
                          setRhythm(preset.rhythm);
                          setDeepFitReport(
                            buildDeterministicDeepFitReport({
                              careerDescription: preset.careerData,
                              city: preset.city,
                              industry: preset.industry,
                              rhythm: preset.rhythm,
                            })
                          );
                        }}
                        className="text-left px-3 py-2 rounded-[6px] text-xs bg-[#151517] border border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9] hover:border-[#D8B98A] transition-colors truncate cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2A2A2E] space-y-2.5">
                <HapticButton
                  type="submit"
                  disabled={isAnalyzingDeepFit}
                  data-testid="generate-deep-fit-report-btn"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs sm:text-sm font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {isAnalyzingDeepFit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI 正在比对 BoL 活跃圈层档案...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>生成 AI 深度契合度报告</span>
                    </>
                  )}
                </HapticButton>
                <p className="text-[11px] text-[#A3A09A] text-center">
                  基于 BoL 深圳 / 广州 / 香港 / 上海 现有实名核验会员库实时测算
                </p>
              </div>
            </form>

            {/* Right 7 cols: Real-Time Deep Circle Fit Analysis Report */}
            <div
              data-testid="deep-fit-analysis-report"
              className="lg:col-span-7 p-5 sm:p-6 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col justify-between space-y-5"
            >
              {/* Primary Matched Circle & Executive Verdict */}
              <div className="p-4 rounded-[6px] bg-[#151517] border border-[#D8B98A]/40 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#D8B98A] font-medium">
                    首选匹配圈层 · PRIMARY ACTIVE CIRCLE
                  </span>
                  <span className="tabular-nums text-[11px] text-[#A3A09A]">
                    评估引擎：{deepFitReport.evaluationSource === 'gemini-ai' ? 'Gemini AI 实时研判' : 'BoL 圈层策展引擎'}
                  </span>
                </div>
                <h4
                  data-testid="deep-fit-primary-circle"
                  className="font-editorial text-xl sm:text-2xl font-medium text-[#F2EFE9]"
                >
                  {deepFitReport.primaryMatchedCircle}
                </h4>
                <p
                  data-testid="deep-fit-executive-verdict"
                  className="text-xs sm:text-sm text-[#F2EFE9]/90 leading-relaxed"
                >
                  {deepFitReport.executiveVerdict}
                </p>
              </div>

              {/* 3 Active BoL Circles Fit Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {deepFitReport.circleBreakdown.map((circleItem, idx) => (
                  <div
                    key={circleItem.circleCode}
                    data-testid={`deep-fit-circle-card-${idx}`}
                    className="p-3.5 rounded-[6px] bg-[#151517]/90 border border-[#2A2A2E] flex flex-col justify-between space-y-2.5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#D8B98A] font-medium">
                          {circleItem.circleCode}
                        </span>
                        <span className="tabular-nums font-semibold text-[#BF8943]">
                          契合度 {circleItem.fitPct}%
                        </span>
                      </div>
                      <h5 className="font-editorial text-base font-medium text-[#F2EFE9] leading-snug">
                        {circleItem.circleName}
                      </h5>
                      <p className="text-[11px] text-[#A3A09A] leading-relaxed">
                        <span className="text-[#F2EFE9]">在场构成：</span>
                        {circleItem.activeMemberComposition}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#A3A09A] pt-2 border-t border-[#2A2A2E] leading-relaxed">
                      <span className="text-[#D8B98A]">同频支点：</span>
                      {circleItem.resonanceReason}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bidirectional Value Exchange & Recommended Entry Scene */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-[#2A2A2E]">
                <div className="p-3.5 rounded-[6px] bg-[#151517]/70 border border-[#2A2A2E] space-y-1">
                  <span className="text-[11px] text-[#D8B98A] block font-medium">
                    双向价值交换 · VALUE EXCHANGE
                  </span>
                  <p className="text-xs text-[#F2EFE9] leading-relaxed">
                    <span className="text-[#A3A09A]">您可注入：</span>
                    {deepFitReport.valueExchange.whatYouBring}
                  </p>
                  <p className="text-xs text-[#F2EFE9] leading-relaxed">
                    <span className="text-[#A3A09A]">您可收获：</span>
                    {deepFitReport.valueExchange.whatYouGain}
                  </p>
                </div>

                <div className="p-3.5 rounded-[6px] bg-[#151517]/70 border border-[#2A2A2E] space-y-1">
                  <span className="text-[11px] text-[#D8B98A] block font-medium">
                    首场入席与破冰切口 · ENTRY & ICEBREAKER
                  </span>
                  <p className="text-xs text-[#F2EFE9] leading-relaxed">
                    <span className="text-[#A3A09A]">推荐首场：</span>
                    {deepFitReport.recommendedEntryScene}
                  </p>
                  <p className="text-xs text-[#D8B98A] leading-relaxed">
                    <span className="text-[#A3A09A]">破冰话题：</span>
                    {deepFitReport.icebreakerTopic}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BolCard>
      </InteractiveGlowZone>
    </section>
  );
};

