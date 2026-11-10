import React, { useEffect, useState } from 'react';
import { ArrowDownRight, Compass, MessageSquareHeart, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BRAND_META } from '../../content';
import {
  calculateParallaxOffsets,
  HERO_POETIC_CHAPTERS,
  resolveHeroPoeticBreathingPhrase,
} from '../../lib/curationEngine';
import { BolEvent, CityName } from '../../types/bol';
import { CuratorMoodDialogueModal } from '../modals/CuratorMoodDialogueModal';
import { BolCard } from '../visuals/BolCard';
import { BolLogoMark } from '../visuals/BolLogo';
import { HapticButton } from '../visuals/HapticButton';
import { HeroAtmosphereCanvas } from '../visuals/HeroAtmosphereCanvas';

interface HeroSectionProps {
  activeCity: CityName;
  onSelectCityFromHero: (city: '深圳' | '广州' | '香港' | '上海') => void;
  onExploreEvents: () => void;
  onOpenSandbox: () => void;
  onInspectEvent?: (event: BolEvent) => void;
  onReserveEvent?: (event: BolEvent) => void;
  onReplaySkeleton?: () => void;
}

const HERO_CITIES: Array<'深圳' | '广州' | '香港' | '上海'> = [
  '深圳',
  '广州',
  '香港',
  '上海',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCity,
  onSelectCityFromHero,
  onExploreEvents,
  onOpenSandbox,
  onInspectEvent,
  onReserveEvent,
  onReplaySkeleton,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [manualChapterIndex, setManualChapterIndex] = useState<number | null>(null);
  const [isCuratorDialogueOpen, setIsCuratorDialogueOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq?.matches) {
      setReducedMotion(true);
    }

    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      setScrollY(currentY);
      setManualChapterIndex(null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallax = calculateParallaxOffsets(scrollY, reducedMotion);
  const poeticChapter = resolveHeroPoeticBreathingPhrase(scrollY, manualChapterIndex);

  return (
    <section
      id="top"
      data-scroll-y={Math.round(scrollY)}
      data-poetic-chapter={poeticChapter.id}
      className="bol-snap-section relative overflow-hidden pt-8 pb-8 lg:pt-12 lg:pb-12 px-6 lg:px-12 max-w-[1360px] mx-auto"
    >
      {/* Multi-Layer Scroll Parallax Architectural Backdrop */}
      <div
        aria-hidden="true"
        data-testid="hero-parallax-backdrop"
        style={{
          transform: `translate3d(0, ${parallax.backdropY}px, 0) scale(${parallax.ambientScale})`,
        }}
        className="pointer-events-none absolute -inset-x-12 -top-20 -bottom-20 z-0 opacity-75 transition-transform duration-75 ease-out will-change-transform"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 18% 22%, rgba(216, 185, 138, 0.14) 0%, rgba(90, 26, 30, 0.18) 38%, rgba(11, 11, 12, 0) 72%)',
          }}
        />
        <svg
          viewBox="0 0 1440 720"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover opacity-35"
        >
          <line x1="180" y1="0" x2="180" y2="720" stroke="#2A2A2E" strokeWidth="1" />
          <line x1="720" y1="0" x2="720" y2="720" stroke="#2A2A2E" strokeWidth="0.75" strokeDasharray="4 6" />
          <line x1="1260" y1="0" x2="1260" y2="720" stroke="#2A2A2E" strokeWidth="1" />
          <circle cx="320" cy="240" r="210" stroke="#D8B98A" strokeOpacity="0.22" strokeWidth="1" />
          <circle cx="1090" cy="310" r="260" stroke="#BF8943" strokeOpacity="0.18" strokeWidth="1" />
        </svg>
      </div>

      {/* Counter-Parallax Floating Three-Ring Architectural Wireframe */}
      <div
        aria-hidden="true"
        data-testid="hero-parallax-rings"
        style={{
          transform: `translate3d(0, ${parallax.orbitalRingY}px, 0)`,
        }}
        className="pointer-events-none absolute right-12 top-6 z-0 w-96 h-96 opacity-25 transition-transform duration-75 ease-out will-change-transform hidden lg:block"
      >
        <svg viewBox="0 0 320 320" fill="none" className="w-full h-full">
          <circle cx="160" cy="115" r="78" stroke="#D8B98A" strokeWidth="1" />
          <circle cx="118" cy="192" r="78" stroke="#BF8943" strokeWidth="1" />
          <circle cx="202" cy="192" r="78" stroke="#F2EFE9" strokeWidth="0.75" />
        </svg>
      </div>

      {/* 2-Column Hero Split with Foreground vs Midground Parallax Depth */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Editorial Column (7 cols - Foreground Parallax Layer) */}
        <div
          data-testid="hero-parallax-text"
          style={{
            transform: `translate3d(0, ${parallax.editorialTextY}px, 0)`,
          }}
          className="lg:col-span-7 flex transition-transform duration-75 ease-out will-change-transform"
        >
          <BolCard className="w-full flex flex-col justify-between p-6 sm:p-10 bg-[#151517]/95 backdrop-blur-sm bol-champagne-glow">
            <div className="space-y-6">
              {/* Official Horizontal Brand Lockup + Interactive City Selector & '与主理人对话' Entry */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#A3A09A]">
                <div className="flex items-center gap-3">
                  <BolLogoMark size={28} tone="champagne" />
                  <span className="font-medium text-[#F2EFE9] tracking-wide">
                    {BRAND_META.enName} · {BRAND_META.zhName}
                  </span>
                </div>

                <div
                  data-testid="hero-city-and-curator-bar"
                  className="flex flex-wrap items-center gap-2"
                >
                  <div
                    role="group"
                    aria-label="Hero 城市选择器"
                    data-testid="hero-inline-city-selector"
                    className="inline-flex items-center gap-1 p-1 rounded-full bg-[#0B0B0C]/90 border border-[#2A2A2E]"
                  >
                    {HERO_CITIES.map((city) => {
                      const isSelected =
                        (activeCity === '全部城市' ? '深圳' : activeCity) === city;
                      return (
                        <button
                          key={city}
                          type="button"
                          data-testid={`hero-city-pill-${city}`}
                          onClick={() => onSelectCityFromHero(city)}
                          className={`px-2.5 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#D8B98A] text-[#0B0B0C] font-semibold'
                              : 'text-[#A3A09A] hover:text-[#F2EFE9]'
                          }`}
                        >
                          {city}
                        </button>
                      );
                    })}
                  </div>

                  <HapticButton
                    type="button"
                    rippleTone="champagne"
                    data-testid="hero-curator-dialogue-btn"
                    onClick={() => setIsCuratorDialogueOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#D8B98A] bg-[#0B0B0C] hover:bg-[#D8B98A] hover:text-[#0B0B0C] border border-[#D8B98A]/60 transition-all duration-150 cursor-pointer shadow-[0_0_16px_rgba(216,185,138,0.18)]"
                  >
                    <MessageSquareHeart className="w-3.5 h-3.5" />
                    <span>与主理人对话</span>
                  </HapticButton>
                </div>
              </div>

              {/* Display Headline */}
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-medium text-[#F2EFE9] leading-[1.14] tracking-tight">
                把“认识人”变成值得赴约的体验，把一次见面变成可以持续的连接。
              </h1>

              {/* Positioning Prose (Streamlined for Community Feel) */}
              <p className="text-base sm:text-lg text-[#F2EFE9]/90 leading-relaxed max-w-2xl">
                {BRAND_META.brandIntroCopy}
              </p>

              {/* Micro-Text Breathing Animation Narrative Stage: 「午夜 · 酒会 · 私谈」 */}
              <div
                data-testid="hero-poetic-breathing-stage"
                data-active-theme={poeticChapter.themeWord}
                className="p-4 sm:p-5 rounded-[8px] bg-[#0B0B0C]/90 border border-[#D8B98A]/40 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A2A2E] pb-2.5">
                  <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#D8B98A]">
                    <motion.span
                      aria-hidden="true"
                      animate={
                        reducedMotion
                          ? { opacity: 0.9, scale: 1 }
                          : { opacity: [0.38, 1, 0.38], scale: [0.88, 1.18, 0.88] }
                      }
                      transition={{
                        duration: 3.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="inline-flex h-2 w-2 rounded-full bg-[#D8B98A] shadow-[0_0_10px_#D8B98A]"
                    />
                    <Sparkles className="w-3 h-3" />
                    <span>NOCTURNE RITUAL · 随滚动呼吸切换的社群夜叙事</span>
                  </div>

                  {/* 3 Narrative Theme Nodes: 午夜 · 酒会 · 私谈 */}
                  <div className="flex items-center gap-1.5">
                    {HERO_POETIC_CHAPTERS.map((chap, idx) => {
                      const isActiveChap = poeticChapter.chapterIndex === idx;
                      return (
                        <button
                          key={chap.id}
                          type="button"
                          data-testid={`hero-poetic-node-${chap.id}`}
                          onClick={() => setManualChapterIndex(idx)}
                          className={`px-2.5 py-0.5 rounded-full text-xs transition-all cursor-pointer ${
                            isActiveChap
                              ? 'bg-[#D8B98A] text-[#0B0B0C] font-medium shadow-[0_0_14px_rgba(216,185,138,0.4)]'
                              : 'bg-[#151517] text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                          }`}
                        >
                          {chap.themeWord}
                        </button>
                      );
                    })}
                    {onReplaySkeleton && (
                      <button
                        type="button"
                        data-testid="replay-first-screen-skeleton-btn"
                        onClick={onReplaySkeleton}
                        className="ml-1 px-2.5 py-0.5 rounded-full text-[11px] bg-[#5A1A1E]/75 hover:bg-[#D8B98A] text-[#D8B98A] hover:text-[#0B0B0C] border border-[#D8B98A]/45 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        重演流光序幕
                      </button>
                    )}
                  </div>
                </div>

                {/* Breathing Poetic Phrase Display */}
                <div className="min-h-[60px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={poeticChapter.id}
                      initial={
                        reducedMotion
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 8, filter: 'blur(3px)' }
                      }
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={
                        reducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -8, filter: 'blur(3px)' }
                      }
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.p
                        data-testid="hero-poetic-phrase-text"
                        animate={
                          reducedMotion
                            ? { opacity: 1 }
                            : {
                                opacity: [0.82, 1, 0.82],
                                scale: [0.996, 1.006, 0.996],
                              }
                        }
                        transition={{
                          duration: 4.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        style={{ transformOrigin: '0% 50%' }}
                        className="font-editorial text-lg sm:text-xl text-[#F2EFE9] leading-snug tracking-wide"
                      >
                        「{poeticChapter.themeWord}」— “{poeticChapter.poeticPhrase}”
                      </motion.p>
                      <p
                        data-testid="hero-poetic-subwhisper"
                        className="text-xs text-[#A3A09A] mt-1.5"
                      >
                        {poeticChapter.subWhisper}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* CTA & WeChat Mini-Program Anchor */}
            <div className="pt-8 mt-8 border-t border-[#2A2A2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <HapticButton
                  type="button"
                  data-testid="hero-explore-events-btn"
                  onClick={onExploreEvents}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>查看近期活动</span>
                  <ArrowDownRight className="w-4 h-4" />
                </HapticButton>

                <HapticButton
                  type="button"
                  rippleTone="champagne"
                  data-testid="hero-open-sandbox-btn"
                  onClick={onOpenSandbox}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#F2EFE9] bg-[#0B0B0C] hover:border-[#D8B98A] border border-[#2A2A2E] rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#D8B98A]" />
                  <span>定制我的同频连接路径</span>
                </HapticButton>
              </div>

              <div className="text-xs text-[#A3A09A]">
                <span>会员服务入口：</span>
                <span className="text-[#D8B98A] font-medium">
                  微信小程序「{BRAND_META.miniProgramName}」
                </span>
              </div>
            </div>
          </BolCard>
        </div>

        {/* Right Interactive Atmosphere Column (5 cols - Counter-Depth Layer) */}
        <div
          data-testid="hero-parallax-media"
          style={{
            transform: `translate3d(0, ${parallax.canvasCardY}px, 0)`,
          }}
          className="lg:col-span-5 flex transition-transform duration-75 ease-out will-change-transform"
        >
          <HeroAtmosphereCanvas
            activeCity={activeCity === '全部城市' ? '深圳' : activeCity}
            onSelectCityHighlight={onSelectCityFromHero}
            onOpenCuratorDialogue={() => setIsCuratorDialogueOpen(true)}
          />
        </div>
      </div>

      <CuratorMoodDialogueModal
        isOpen={isCuratorDialogueOpen}
        initialCity={activeCity === '全部城市' ? '深圳' : activeCity}
        onClose={() => setIsCuratorDialogueOpen(false)}
        onSelectCity={onSelectCityFromHero}
        onInspectEvent={(ev) => {
          if (onInspectEvent) {
            onInspectEvent(ev);
          } else {
            onExploreEvents();
          }
        }}
        onReserveEvent={(ev) => {
          if (onReserveEvent) {
            onReserveEvent(ev);
          } else {
            onExploreEvents();
          }
        }}
      />
    </section>
  );
};
