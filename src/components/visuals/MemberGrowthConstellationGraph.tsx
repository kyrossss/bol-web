import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GitMerge, Sparkles } from 'lucide-react';
import { MemberGrowthConstellationData } from '../../types/bol';

interface MemberGrowthConstellationGraphProps {
  constellation: MemberGrowthConstellationData;
  onSelectOpportunity: (opportunityIndex: number) => void;
}

export const MemberGrowthConstellationGraph: React.FC<
  MemberGrowthConstellationGraphProps
> = ({ constellation, onSelectOpportunity }) => {
  const prefersReducedMotion = useReducedMotion();
  const {
    stageNodes,
    opportunityNodes,
    svgLinks,
    activeOpportunityIndex,
    activeOpportunity,
  } = constellation;

  return (
    <div
      data-testid="member-growth-constellation-graph"
      data-story-id={constellation.storyId}
      data-active-opportunity-index={activeOpportunityIndex}
      className="mt-8 p-6 sm:p-8 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-6"
    >
      {/* Header & Opportunity Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2A2A2E] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#D8B98A] tracking-wider">
            <GitMerge className="w-3.5 h-3.5 shrink-0" />
            <span>
              CROSS-INDUSTRY GROWTH CONSTELLATION · 成员成长路径与跨行业机会点动态图谱
            </span>
          </div>
          <h4 className="font-editorial text-xl sm:text-2xl font-medium text-[#F2EFE9]">
            {constellation.graphHeadline}
          </h4>
        </div>

        {/* Interactive Cross-Industry Opportunity Selector Buttons */}
        <div
          role="group"
          aria-label="切换跨行业碰撞机会点"
          className="flex flex-wrap items-center gap-2"
        >
          {opportunityNodes.map((opp, idx) => {
            const isSelected = idx === activeOpportunityIndex;
            return (
              <button
                key={opp.id}
                type="button"
                data-testid={`constellation-opportunity-btn-${idx}`}
                onClick={() => onSelectOpportunity(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#D8B98A] text-[#0B0B0C] shadow-[0_0_16px_rgba(216,185,138,0.36)]'
                    : 'bg-[#151517] text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                }`}
              >
                {opp.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: 7-Col Animated SVG Constellation Map + 5-Col Active Collision Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Cols: Interactive SVG Growth & Cross-Industry Collision Graph */}
        <div className="lg:col-span-7 rounded-[8px] bg-[#151517]/90 border border-[#2A2A2E] p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A3A09A] mb-2">
            <span>上层轨迹：初入社群 → 深度商业连接三阶主轴</span>
            <span className="text-[#D8B98A]">
              下层星轨：跨行业碰撞机会点（点击节点可切换详情）
            </span>
          </div>

          <svg
            viewBox="0 0 680 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label={`${constellation.memberName} 跨行业成长路径与机会点图谱`}
            className="w-full h-auto select-none"
          >
            <defs>
              <linearGradient
                id="constellationSpineGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#5A1A1E" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#D8B98A" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#BF8943" stopOpacity="0.95" />
              </linearGradient>
              <radialGradient id="opportunityGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D8B98A" stopOpacity="0.34" />
                <stop offset="60%" stopColor="#5A1A1E" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#0B0B0C" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Subtle Architectural Grid Lines */}
            <line
              x1="40"
              y1="74"
              x2="640"
              y2="74"
              stroke="#2A2A2E"
              strokeWidth="0.75"
              strokeDasharray="3 6"
            />
            <line
              x1="40"
              y1="216"
              x2="640"
              y2="216"
              stroke="#2A2A2E"
              strokeWidth="0.75"
              strokeDasharray="3 6"
            />

            {/* Gentle Animated Connection Curves (轻柔的连线动画) */}
            {svgLinks.map((link) => {
              const isHighlighted =
                link.kind === 'growth-spine' ||
                link.opportunityIndex === activeOpportunityIndex;

              return (
                <g key={link.id}>
                  {/* Base Soft Curve */}
                  <path
                    d={link.svgPath}
                    stroke={
                      link.kind === 'growth-spine'
                        ? 'url(#constellationSpineGrad)'
                        : link.strokeHex
                    }
                    strokeWidth={isHighlighted ? 2 : 1.15}
                    strokeOpacity={isHighlighted ? 0.55 : 0.24}
                    strokeLinecap="round"
                  />

                  {/* Flowing Gentle Dash Stream Animation */}
                  <motion.path
                    d={link.svgPath}
                    stroke={link.kind === 'growth-spine' ? '#D8B98A' : link.strokeHex}
                    strokeWidth={isHighlighted ? 2.2 : 1.25}
                    strokeOpacity={isHighlighted ? 0.92 : 0.38}
                    strokeDasharray="8 14"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 44 }}
                    animate={
                      prefersReducedMotion
                        ? { strokeDashoffset: 0 }
                        : { strokeDashoffset: [44, 0] }
                    }
                    transition={{
                      duration: link.pulseDurationSec,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  {/* Gentle Traveling Luminous Particle Along Active Paths */}
                  {!prefersReducedMotion && isHighlighted && (
                    <motion.circle
                      r={link.kind === 'growth-spine' ? 3.2 : 3.8}
                      fill="#F2EFE9"
                      initial={{
                        cx: link.startX,
                        cy: link.startY,
                        opacity: 0.2,
                      }}
                      animate={{
                        cx: [link.startX, (link.startX + link.endX) / 2, link.endX],
                        cy: [link.startY, (link.startY + link.endY) / 2, link.endY],
                        opacity: [0.25, 0.95, 0.25],
                      }}
                      transition={{
                        duration: link.pulseDurationSec,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* Upper Row: 3 Growth Stage Spine Nodes */}
            {stageNodes.map((stage, idx) => {
              const isLinkedToActiveOpp = idx === activeOpportunityIndex;
              return (
                <g
                  key={stage.id}
                  data-testid={`constellation-stage-node-${idx}`}
                  onClick={() => onSelectOpportunity(idx)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={stage.x}
                    cy={stage.y}
                    r={isLinkedToActiveOpp ? 26 : 20}
                    fill="url(#opportunityGlow)"
                  />
                  <circle
                    cx={stage.x}
                    cy={stage.y}
                    r={14}
                    fill="#0B0B0C"
                    stroke={isLinkedToActiveOpp ? '#D8B98A' : '#A3A09A'}
                    strokeWidth={isLinkedToActiveOpp ? 2 : 1.2}
                  />
                  <text
                    x={stage.x}
                    y={stage.y + 4}
                    textAnchor="middle"
                    fill="#D8B98A"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    0{stage.stageOrder}
                  </text>
                  <text
                    x={stage.x}
                    y={stage.y - 24}
                    textAnchor="middle"
                    fill="#F2EFE9"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {stage.stageTitle}
                  </text>
                  <text
                    x={stage.x}
                    y={stage.y + 30}
                    textAnchor="middle"
                    fill="#A3A09A"
                    fontSize="10"
                  >
                    {stage.timeAndCity}
                  </text>
                </g>
              );
            })}

            {/* Lower Row: 3 Cross-Industry Collision Opportunity Nodes */}
            {opportunityNodes.map((opp, idx) => {
              const isSelected = idx === activeOpportunityIndex;
              return (
                <g
                  key={opp.id}
                  data-testid={`constellation-opportunity-node-${idx}`}
                  onClick={() => onSelectOpportunity(idx)}
                  className="cursor-pointer"
                >
                  {/* Soft Breathing Halo for Selected Opportunity */}
                  {isSelected && (
                    <motion.circle
                      cx={opp.x}
                      cy={opp.y}
                      r={34}
                      fill="url(#opportunityGlow)"
                      animate={
                        prefersReducedMotion
                          ? { scale: 1, opacity: 0.8 }
                          : { scale: [0.92, 1.12, 0.92], opacity: [0.55, 0.95, 0.55] }
                      }
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  <rect
                    x={opp.x - 86}
                    y={opp.y - 24}
                    width="172"
                    height="48"
                    rx="8"
                    fill={isSelected ? '#1E1816' : '#0B0B0C'}
                    stroke={isSelected ? '#D8B98A' : '#2A2A2E'}
                    strokeWidth={isSelected ? 1.6 : 1}
                  />

                  <text
                    x={opp.x}
                    y={opp.y - 5}
                    textAnchor="middle"
                    fill={isSelected ? '#D8B98A' : '#F2EFE9'}
                    fontSize="10.5"
                    fontWeight="600"
                  >
                    {opp.memberIndustryTag} ×
                  </text>
                  <text
                    x={opp.x}
                    y={opp.y + 12}
                    textAnchor="middle"
                    fill={isSelected ? '#F2EFE9' : '#A3A09A'}
                    fontSize="10.5"
                    fontWeight="500"
                  >
                    {opp.counterpartIndustryTag}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="pt-2 border-t border-[#2A2A2E]/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A3A09A]">
            <span>
              当前成员行业：<strong className="text-[#F2EFE9]">{constellation.memberCoreIndustry}</strong>
            </span>
            <span className="tabular-nums text-[#D8B98A]">
              跨界协同度 {activeOpportunity.synergyScorePct}%
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Active Cross-Industry Collision Opportunity Detail Panel */}
        <div
          data-testid="constellation-opportunity-detail-card"
          className="lg:col-span-5 rounded-[8px] bg-[#151517] border border-[#D8B98A]/45 p-5 sm:p-6 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 text-[#D8B98A] font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span data-testid="constellation-active-opportunity-code">
                  {activeOpportunity.code}
                </span>
              </span>
              <span className="tabular-nums text-xs text-[#BF8943] font-semibold">
                碰撞契合度 {activeOpportunity.synergyScorePct}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-[#A3A09A]">
                <span>{activeOpportunity.memberIndustryTag}</span>
                <span aria-hidden="true" className="mx-1.5 text-[#D8B98A]">
                  ×
                </span>
                <span className="text-[#F2EFE9]">
                  {activeOpportunity.counterpartIndustryTag}
                </span>
              </div>
              <h5
                data-testid="constellation-active-opportunity-title"
                className="font-editorial text-xl font-medium text-[#F2EFE9] leading-snug"
              >
                {activeOpportunity.collisionHeadline}
              </h5>
            </div>

            <p
              data-testid="constellation-active-opportunity-detail"
              className="text-xs sm:text-sm text-[#A3A09A] leading-relaxed"
            >
              {activeOpportunity.opportunityDetail}
            </p>
          </div>

          <div className="p-3.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-1">
            <span className="text-[11px] text-[#D8B98A] block">
              达成深度商业连接成果（Verified Outcome）
            </span>
            <p
              data-testid="constellation-active-opportunity-outcome"
              className="text-xs sm:text-sm font-medium text-[#F2EFE9]"
            >
              {activeOpportunity.commercialOutcome}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
