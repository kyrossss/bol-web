import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { FirstScreenSkeletonState } from '../../types/bol';
import { BolLogoMark } from './BolLogo';

interface FirstScreenRitualSkeletonProps {
  skeletonState: FirstScreenSkeletonState;
  reducedMotion?: boolean;
  onSkipSkeleton: () => void;
}

const SKELETON_CITIES = ['深圳 · SZ', '广州 · GZ', '香港 · HK', '上海 · SH'] as const;
const SKELETON_NOCTURNE_NODES = ['午夜', '酒会', '私谈'] as const;

export const FirstScreenRitualSkeleton: React.FC<FirstScreenRitualSkeletonProps> = ({
  skeletonState,
  reducedMotion = false,
  onSkipSkeleton,
}) => {
  return (
    <AnimatePresence>
      {skeletonState.isVisible && (
        <motion.div
          key="bol-first-screen-skeleton"
          role="region"
          aria-label="BoL 万象博联首屏流光骨架序幕"
          aria-busy="true"
          data-testid="bol-first-screen-skeleton"
          data-active="true"
          data-phase={skeletonState.phaseId}
          data-palette="burgundy-champagne-luster"
          data-burgundy-hex={skeletonState.burgundyHex}
          data-champagne-hex={skeletonState.champagneHex}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 1.012,
                  filter: 'blur(6px)',
                }
          }
          transition={{
            duration: reducedMotion ? 0.15 : 0.62,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            backgroundColor: '#0B0B0C',
            backgroundImage: skeletonState.ambientBackdropCss,
          }}
          className="fixed inset-0 z-50 overflow-hidden bg-[#0B0B0C] text-[#F2EFE9] flex flex-col justify-between select-none"
        >
          {/* Ambient Burgundy Wine (#5A1A1E) & Champagne Gold (#D8B98A) Luster Orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <motion.div
              animate={
                reducedMotion
                  ? { opacity: 0.45, scale: 1 }
                  : {
                      opacity: [0.36, 0.64, 0.36],
                      scale: [0.96, 1.08, 0.96],
                      x: [-18, 22, -18],
                    }
              }
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(circle, rgba(90, 26, 30, 0.64) 0%, rgba(90, 26, 30, 0.18) 48%, rgba(11, 11, 12, 0) 74%)',
              }}
              className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full blur-3xl"
            />
            <motion.div
              animate={
                reducedMotion
                  ? { opacity: 0.38, scale: 1 }
                  : {
                      opacity: [0.28, 0.54, 0.28],
                      scale: [1.04, 0.94, 1.04],
                      x: [16, -20, 16],
                    }
              }
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(circle, rgba(216, 185, 138, 0.36) 0%, rgba(191, 137, 67, 0.16) 46%, rgba(11, 11, 12, 0) 74%)',
              }}
              className="absolute -right-20 top-12 h-[480px] w-[480px] rounded-full blur-3xl"
            />
          </div>

          {/* Top Flowing Luster Progress Filament (#5A1A1E -> #D8B98A -> #BF8943) */}
          <div className="relative z-20 w-full">
            <div className="h-[3px] w-full bg-[#151517] overflow-hidden">
              <motion.div
                data-testid="skeleton-luster-progress-bar"
                initial={{ width: '12%' }}
                animate={{ width: `${skeletonState.progressPct}%` }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background:
                    'linear-gradient(90deg, #5A1A1E 0%, #D8B98A 52%, #BF8943 100%)',
                  boxShadow: '0 0 18px rgba(216, 185, 138, 0.65)',
                }}
                className="h-full"
              />
            </div>

            {/* Zone 1: Top Bar Skeleton Mirror */}
            <div
              data-testid="skeleton-topnav-zone"
              className="border-b border-[#2A2A2E]/90 bg-[#0B0B0C]/90 backdrop-blur-md px-6 lg:px-12 py-3.5"
            >
              <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8">
                {/* Brand Lockup Skeleton */}
                <div className="flex items-center gap-3 shrink-0">
                  <BolLogoMark size={26} tone="champagne" />
                  <div className="h-4 w-36 rounded-[4px] bol-brand-luster-bar" />
                </div>

                {/* 5 Nav Links Skeleton */}
                <div className="hidden md:flex items-center gap-6">
                  {[64, 72, 68, 64, 68].map((w, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${w}px` }}
                      className="h-3.5 rounded-[4px] bol-brand-luster-bar opacity-80"
                    />
                  ))}
                </div>

                {/* Right Primary CTA + Skip Action */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:block h-8 w-28 rounded-full bol-brand-luster-bar border border-[#D8B98A]/35" />
                  <button
                    type="button"
                    data-testid="skeleton-skip-btn"
                    onClick={onSkipSkeleton}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#F2EFE9] bg-[#151517]/95 hover:bg-[#D8B98A] hover:text-[#0B0B0C] border border-[#D8B98A]/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>立即入席</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main First-Screen Architectural Skeleton Container */}
          <div className="relative z-10 flex-1 w-full max-w-[1360px] mx-auto px-6 lg:px-12 pt-5 pb-6 flex flex-col justify-between gap-5 overflow-hidden">
            {/* Ceremonial Brand Luster Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-[8px] border border-[#D8B98A]/30 bg-[#151517]/90 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D8B98A] shrink-0" />
                <span className="font-medium text-[#D8B98A] tracking-wider">
                  BOL RITUAL SKELETON · 首屏流光序幕
                </span>
                <span aria-hidden="true" className="text-[#A3A09A]">
                  ·
                </span>
                <span
                  data-testid="skeleton-phase-label"
                  className="text-[#F2EFE9] font-medium"
                >
                  {skeletonState.phaseLabel}
                </span>
                <span
                   aria-hidden="true"
                  className="hidden xl:inline text-[#A3A09A]"
                >
                  ·
                </span>
                <span className="hidden xl:inline text-[#A3A09A]">
                  {skeletonState.ritualSubcopy}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#A3A09A]">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2.5 w-2.5 rounded-full bg-[#5A1A1E] border border-[#D8B98A]/50"
                  />
                  <span>勃艮第酒红 #5A1A1E</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2.5 w-2.5 rounded-full bg-[#D8B98A]"
                  />
                  <span>香槟金 #D8B98A</span>
                </span>
                <span aria-hidden="true">·</span>
                <span
                  data-testid="skeleton-progress-pct"
                  className="tabular-nums text-[#D8B98A] font-semibold"
                >
                  {skeletonState.progressPct}%
                </span>
              </div>
            </div>

            {/* 12-Column Hero Split Skeleton (7-col Editorial + 5-col Three-Ring Atmosphere) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch flex-1 min-h-0">
              {/* Zone 2: Left 7-Column Editorial Skeleton Card */}
              <div
                data-testid="skeleton-hero-editorial-zone"
                style={{
                  borderColor: skeletonState.blocks[1].borderAccentCss,
                }}
                className="lg:col-span-7 rounded-[8px] border p-6 sm:p-9 bol-brand-luster-surface flex flex-col justify-between gap-6 shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
              >
                <div className="space-y-5">
                  {/* Brand Lockup + City Pills + Curator Dialogue Skeleton */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-full bol-brand-luster-bar border border-[#D8B98A]/40" />
                      <div className="h-4 w-40 rounded-[4px] bol-brand-luster-bar" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 p-1 rounded-full bg-[#0B0B0C]/85 border border-[#2A2A2E]">
                        {SKELETON_CITIES.map((city, i) => (
                          <span
                            key={city}
                            className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                              i === 0
                                ? 'bg-[#D8B98A]/25 text-[#D8B98A] border border-[#D8B98A]/40'
                                : 'text-[#A3A09A]/70'
                            }`}
                          >
                            {city.split(' · ')[0]}
                          </span>
                        ))}
                      </div>
                      <div className="h-7 w-28 rounded-full bol-brand-luster-bar border border-[#D8B98A]/45" />
                    </div>
                  </div>

                  {/* Display Headline 3-Line Burgundy & Champagne Shimmer Bars */}
                  <div className="space-y-3 pt-1">
                    <div className="h-9 sm:h-11 w-[94%] rounded-[6px] bol-brand-luster-bar" />
                    <div className="h-9 sm:h-11 w-[88%] rounded-[6px] bol-brand-luster-bar" />
                    <div className="h-9 sm:h-11 w-[62%] rounded-[6px] bol-brand-luster-bar" />
                  </div>

                  {/* Positioning Prose Skeleton Lines */}
                  <div className="space-y-2.5 pt-1 max-w-2xl">
                    <div className="h-4 w-full rounded-[4px] bol-brand-luster-bar opacity-80" />
                    <div className="h-4 w-[90%] rounded-[4px] bol-brand-luster-bar opacity-75" />
                    <div className="h-4 w-[74%] rounded-[4px] bol-brand-luster-bar opacity-70" />
                  </div>

                  {/* Nocturne Ritual Stage Skeleton: 午夜 · 酒会 · 私谈 */}
                  <div className="p-4 sm:p-5 rounded-[8px] bg-[#0B0B0C]/85 border border-[#D8B98A]/35 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A2A2E] pb-2.5">
                      <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#D8B98A]/90">
                        <span>NOCTURNE RITUAL · 午夜 · 酒会 · 私谈流光校准</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {SKELETON_NOCTURNE_NODES.map((node, idx) => (
                          <span
                            key={node}
                            className={`px-2.5 py-0.5 rounded-full text-xs ${
                              idx === 0
                                ? 'bg-[#5A1A1E]/80 text-[#D8B98A] border border-[#D8B98A]/50'
                                : 'bg-[#151517] text-[#A3A09A]/75 border border-[#2A2A2E]'
                            }`}
                          >
                            {node}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="h-5 w-[84%] rounded-[4px] bol-brand-luster-bar" />
                      <div className="h-3.5 w-[66%] rounded-[4px] bol-brand-luster-bar opacity-75" />
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Row Skeleton */}
                <div className="pt-5 border-t border-[#2A2A2E] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-36 rounded-full bol-brand-luster-bar border border-[#D8B98A]/55" />
                    <div className="h-11 w-44 rounded-full bol-brand-luster-bar border border-[#2A2A2E]" />
                  </div>
                  <div className="h-4 w-48 rounded-[4px] bol-brand-luster-bar opacity-80" />
                </div>
              </div>

              {/* Zone 3: Right 5-Column Three-Ring Atmosphere Skeleton Card */}
              <div
                data-testid="skeleton-hero-atmosphere-zone"
                style={{
                  borderColor: skeletonState.blocks[2].borderAccentCss,
                }}
                className="lg:col-span-5 rounded-[8px] border p-6 sm:p-8 bol-brand-luster-surface flex flex-col justify-between gap-5 shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
              >
                {/* Top Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="text-[11px] tracking-widest text-[#D8B98A]/90 font-mono">
                      THREE-RING SANCTUM · 三环流光同频场
                    </div>
                    <div className="h-4 w-44 rounded-[4px] bol-brand-luster-bar" />
                  </div>
                  <div className="h-7 w-24 rounded-full bol-brand-luster-bar border border-[#D8B98A]/35" />
                </div>

                {/* Central Burgundy Wine & Champagne Gold Three-Ring SVG Stage */}
                <div className="relative my-auto py-4 flex items-center justify-center">
                  <svg
                    viewBox="0 0 320 250"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full max-w-[300px] h-auto"
                  >
                    <defs>
                      <linearGradient id="skeletonWineGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5A1A1E" stopOpacity="0.95" />
                        <stop offset="50%" stopColor="#D8B98A" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#BF8943" stopOpacity="0.85" />
                      </linearGradient>
                      <radialGradient id="skeletonCoreGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#D8B98A" stopOpacity="0.32" />
                        <stop offset="55%" stopColor="#5A1A1E" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#0B0B0C" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    <circle cx="160" cy="125" r="108" fill="url(#skeletonCoreGlow)" />

                    {/* Ring 1: Elite Density (Champagne Gold) */}
                    <circle
                      cx="160"
                      cy="92"
                      r="58"
                      stroke="url(#skeletonWineGoldGrad)"
                      strokeWidth="1.6"
                      strokeDasharray="6 4"
                    />
                    {/* Ring 2: Cross-Disciplinary Diversity (Burgundy Wine & Gold) */}
                    <circle
                      cx="126"
                      cy="148"
                      r="58"
                      stroke="#D8B98A"
                      strokeOpacity="0.68"
                      strokeWidth="1.4"
                    />
                    {/* Ring 3: Long-Term Connection (Member Gold) */}
                    <circle
                      cx="194"
                      cy="148"
                      r="58"
                      stroke="#BF8943"
                      strokeOpacity="0.72"
                      strokeWidth="1.4"
                    />

                    {/* Central Resonance Core */}
                    <circle
                      cx="160"
                      cy="128"
                      r="7"
                      fill="#D8B98A"
                    />
                    <circle
                      cx="160"
                      cy="128"
                      r="16"
                      stroke="#5A1A1E"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* 4 City Coordinate Skeletons + 3 Atmosphere Metrics */}
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {SKELETON_CITIES.map((cityLabel) => (
                      <div
                        key={cityLabel}
                        className="px-2.5 py-2 rounded-[6px] bg-[#0B0B0C]/85 border border-[#2A2A2E] text-center space-y-1"
                      >
                        <div className="text-[11px] text-[#D8B98A] font-medium">
                          {cityLabel}
                        </div>
                        <div className="h-2.5 w-12 mx-auto rounded-[3px] bol-brand-luster-bar" />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#2A2A2E]">
                    {[0, 1, 2].map((idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-[6px] bg-[#0B0B0C]/80 border border-[#2A2A2E] space-y-1.5"
                      >
                        <div className="h-3 w-14 rounded-[3px] bol-brand-luster-bar opacity-75" />
                        <div className="h-4 w-20 rounded-[3px] bol-brand-luster-bar" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Zone 4: Live Community Stream Skeleton Strip */}
            <div
              data-testid="skeleton-live-stream-zone"
              style={{
                borderColor: skeletonState.blocks[3].borderAccentCss,
              }}
              className="rounded-[8px] border p-4 bol-brand-luster-surface flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="px-2.5 py-1 rounded-[4px] bg-[#5A1A1E]/85 border border-[#D8B98A]/45 text-[11px] text-[#D8B98A] font-mono shrink-0">
                  LIVE CONSENSUS · 实时社群流光
                </span>
                <div className="h-4 w-full max-w-xl rounded-[4px] bol-brand-luster-bar" />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-6 w-24 rounded-full bol-brand-luster-bar" />
                <div className="h-6 w-20 rounded-full bol-brand-luster-bar opacity-80" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
