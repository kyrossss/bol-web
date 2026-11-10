import React, { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Compass, X } from 'lucide-react';
import { TopNav } from './components/layout/TopNav';
import { FooterSection } from './components/layout/FooterSection';
import { HeroSection } from './components/sections/HeroSection';
import { LiveCommunityStream } from './components/sections/LiveCommunityStream';
import { BrandPhilosophySection } from './components/sections/BrandPhilosophySection';
import { EventMatrixSection } from './components/sections/EventMatrixSection';
import { ConnectionSandboxSection } from './components/sections/ConnectionSandboxSection';
import { MembershipSection } from './components/sections/MembershipSection';
import { MemberStoriesSection } from './components/sections/MemberStoriesSection';
import { FieldNotesSection } from './components/sections/FieldNotesSection';
import { ApplicationConciergeSection } from './components/sections/ApplicationConciergeSection';
import { EventDossierModal } from './components/modals/EventDossierModal';
import { ViGovernanceModal } from './components/modals/ViGovernanceModal';
import { ClubSectionChiaroscuroZone } from './components/visuals/ClubSectionChiaroscuroZone';
import { FirstScreenRitualSkeleton } from './components/visuals/FirstScreenRitualSkeleton';
import { CURATED_EVENTS, MEMBERSHIP_TIERS } from './content';
import {
  computeFirstScreenSkeletonState,
  computePointerPressureRippleProfile,
  evaluateSectionDwellSuggestion,
  resolveActiveSectionFromScroll,
} from './lib/curationEngine';
import {
  BolEvent,
  CityName,
  ConciergeSuggestionPayload,
  EventSeriesId,
  IndustryDomainId,
  MembershipTier,
  NavSectionId,
  PointerPressureRippleProfile,
  SocialRhythmId,
} from './types/bol';

interface ClickShockwave {
  id: number;
  x: number;
  y: number;
  pressureProfile: PointerPressureRippleProfile;
}

export default function App() {
  const [selectedSeries, setSelectedSeries] = useState<EventSeriesId>('all');
  const [selectedCity, setSelectedCity] = useState<CityName>('全部城市');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [inspectedEvent, setInspectedEvent] = useState<BolEvent | null>(null);
  const [isViModalOpen, setIsViModalOpen] = useState<boolean>(false);

  const [preselectedEvent, setPreselectedEvent] = useState<BolEvent | null>(null);
  const [preselectedTier, setPreselectedTier] = useState<MembershipTier | null>(null);
  const [prefilledCity, setPrefilledCity] = useState<Exclude<CityName, '全部城市'> | undefined>(
    undefined
  );
  const [prefilledIndustry, setPrefilledIndustry] = useState<IndustryDomainId | undefined>(
    undefined
  );
  const [prefilledRhythm, setPrefilledRhythm] = useState<SocialRhythmId | undefined>(
    undefined
  );

  // Global Immersive Click Haptic Vibration, Pressure Profile & Cursor Shimmer Bubble State
  const [isGlobalVibrating, setIsGlobalVibrating] = useState<boolean>(false);
  const [clickShockwaves, setClickShockwaves] = useState<ClickShockwave[]>([]);
  const [lastPressureProfile, setLastPressureProfile] =
    useState<PointerPressureRippleProfile | null>(null);
  const [isInInteractiveZone, setIsInInteractiveZone] = useState<boolean>(false);

  // Floating TopNav Scroll-Spy & Section Dwell-Ratio Concierge Suggestion State
  const [activeSectionId, setActiveSectionId] = useState<NavSectionId>('top');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [globalScrollY, setGlobalScrollY] = useState<number>(0);
  const [conciergeSuggestion, setConciergeSuggestion] =
    useState<ConciergeSuggestionPayload | null>(null);

  const dwellMsBySectionRef = useRef<Partial<Record<NavSectionId, number>>>({
    top: 400,
  });
  const activeSectionRef = useRef<NavSectionId>('top');
  const dismissedSectionsRef = useRef<NavSectionId[]>([]);
  const lastDwellTimestampRef = useRef<number>(Date.now());
  const hasUserScrolledRef = useRef<boolean>(false);

  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  // Bespoke First-Screen Burgundy Wine & Champagne Gold Flowing Luster Skeleton State
  const [skeletonElapsedMs, setSkeletonElapsedMs] = useState<number>(0);
  const [isSkeletonDismissed, setIsSkeletonDismissed] = useState<boolean>(false);
  const [holdSkeletonMode, setHoldSkeletonMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('skeleton') === 'hold';
  });
  const [autostartSkipMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (autostartSkipMode || isSkeletonDismissed || holdSkeletonMode) return;
    if (skeletonElapsedMs >= 960) return;

    const timerId = window.setInterval(() => {
      setSkeletonElapsedMs((prev) => {
        const next = prev + 160;
        if (next >= 960) {
          window.clearInterval(timerId);
          return 960;
        }
        return next;
      });
    }, 140);

    return () => {
      window.clearInterval(timerId);
    };
  }, [autostartSkipMode, isSkeletonDismissed, holdSkeletonMode, skeletonElapsedMs]);

  const skeletonState = computeFirstScreenSkeletonState(skeletonElapsedMs, 960, {
    autostart: autostartSkipMode,
    holdSkeleton: holdSkeletonMode,
    reducedMotion: Boolean(prefersReducedMotion),
    forceDismissed: isSkeletonDismissed,
  });

  const handleSkipSkeleton = useCallback(() => {
    setHoldSkeletonMode(false);
    setIsSkeletonDismissed(true);
    setSkeletonElapsedMs(960);
  }, []);

  const handleReplaySkeleton = useCallback(() => {
    setHoldSkeletonMode(false);
    setIsSkeletonDismissed(false);
    setSkeletonElapsedMs(0);
  }, []);

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const smoothCursorX = useSpring(cursorX, { stiffness: 280, damping: 30, mass: 0.4 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 280, damping: 30, mass: 0.4 });

  const handleGlobalMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      const interactiveMatch = Boolean(
        target?.closest(
          'button, a, input, select, textarea, [data-testid="interactive-glow-zone"], #sandbox, #gatherings, #membership, #apply'
        )
      );
      if (interactiveMatch !== isInInteractiveZone) {
        setIsInInteractiveZone(interactiveMatch);
      }
    },
    [prefersReducedMotion, cursorX, cursorY, isInInteractiveZone]
  );

  const handleGlobalPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement | null;
      const isInteractiveClick = Boolean(
        target?.closest('button, a, input, select, textarea, [role="button"], g.cursor-pointer')
      );

      // Compute Pointer Events pressure-sensitive profile (expansion speed & color concentration)
      const rawPressure = typeof e.pressure === 'number' ? e.pressure : undefined;
      const pointerType = e.pointerType || 'mouse';
      const pressureProfile = computePointerPressureRippleProfile(
        rawPressure,
        pointerType,
        isInteractiveClick
      );
      setLastPressureProfile(pressureProfile);

      // Trigger Haptic API if supported by the device, scaled by touch pressure
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate(pressureProfile.hapticDurationMs);
        } catch {
          // Ignore browser permission restrictions on desktop
        }
      }

      if (prefersReducedMotion) return;

      if (isInteractiveClick) {
        setIsGlobalVibrating(true);
        window.setTimeout(() => {
          setIsGlobalVibrating(false);
        }, 160);
      }

      const waveId = Date.now() + Math.floor(Math.random() * 1000);
      const nextWave: ClickShockwave = {
        id: waveId,
        x: e.clientX,
        y: e.clientY,
        pressureProfile,
      };
      setClickShockwaves((prev) => [...prev.slice(-3), nextWave]);
      const cleanupDelayMs = Math.round(pressureProfile.expansionDurationSec * 1000) + 320;
      window.setTimeout(() => {
        setClickShockwaves((prev) => prev.filter((item) => item.id !== waveId));
      }, cleanupDelayMs);
    },
    [prefersReducedMotion]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });
    lenisRef.current = lenis;

    let rafId: number | null = null;
    let activeFrames = 0;

    const stepRaf = (time: number) => {
      lenis.raf(time);
      activeFrames += 1;
      if (lenis.isScrolling || activeFrames < 24) {
        rafId = window.requestAnimationFrame(stepRaf);
      } else {
        rafId = null;
        activeFrames = 0;
      }
    };

    const kickRaf = () => {
      activeFrames = 0;
      if (rafId === null) {
        rafId = window.requestAnimationFrame(stepRaf);
      }
    };

    window.addEventListener('wheel', kickRaf, { passive: true });
    window.addEventListener('touchmove', kickRaf, { passive: true });
    kickRaf();

    return () => {
      window.removeEventListener('wheel', kickRaf);
      window.removeEventListener('touchmove', kickRaf);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll-Spy observer for floating TopNav active section highlighting & dwell-time ratio Concierge Suggestion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const trackedIds: NavSectionId[] = [
      'top',
      'philosophy',
      'gatherings',
      'sandbox',
      'membership',
      'field-notes',
      'apply',
    ];

    const recordDwellAndEvaluate = (sectionId: NavSectionId, bonusMs = 0) => {
      const now = Date.now();
      const elapsed = Math.min(1600, Math.max(80, now - lastDwellTimestampRef.current));
      lastDwellTimestampRef.current = now;

      const prevMs = dwellMsBySectionRef.current[sectionId] || 0;
      dwellMsBySectionRef.current[sectionId] = prevMs + elapsed + bonusMs;

      if (!hasUserScrolledRef.current) return;

      const nextSuggestion = evaluateSectionDwellSuggestion(
        dwellMsBySectionRef.current,
        sectionId,
        dismissedSectionsRef.current
      );
      setConciergeSuggestion(nextSuggestion);
    };

    const evaluateScrollPosition = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const scrolledDown = scrollY > 24;
      setIsScrolled(scrolledDown);
      setGlobalScrollY(Math.round(scrollY));

      if (scrollY > 80) {
        hasUserScrolledRef.current = true;
      }

      if (scrollY < 100) {
        activeSectionRef.current = 'top';
        setActiveSectionId('top');
        recordDwellAndEvaluate('top');
        return;
      }

      const bounds: Array<{ id: NavSectionId; top: number; bottom: number }> = [];
      for (const id of trackedIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          bounds.push({ id, top: rect.top, bottom: rect.bottom });
        }
      }

      if (bounds.length > 0) {
        const nextActive = resolveActiveSectionFromScroll(bounds, 200);
        const sectionChanged = activeSectionRef.current !== nextActive;
        activeSectionRef.current = nextActive;
        setActiveSectionId(nextActive);
        // Grant a focus-intent dwell weight when scrolling onto a content section
        recordDwellAndEvaluate(nextActive, sectionChanged ? 650 : 180);
      }
    };

    const dwellIntervalId = window.setInterval(() => {
      if (hasUserScrolledRef.current) {
        recordDwellAndEvaluate(activeSectionRef.current, 240);
      }
    }, 600);

    window.addEventListener('scroll', evaluateScrollPosition, { passive: true });
    evaluateScrollPosition();

    return () => {
      window.removeEventListener('scroll', evaluateScrollPosition);
      window.clearInterval(dwellIntervalId);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const validIds: NavSectionId[] = [
      'top',
      'philosophy',
      'gatherings',
      'sandbox',
      'membership',
      'field-notes',
      'apply',
    ];
    if (validIds.includes(sectionId as NavSectionId)) {
      const typedId = sectionId as NavSectionId;
      activeSectionRef.current = typedId;
      setActiveSectionId(typedId);
      if (typedId !== 'top') {
        hasUserScrolledRef.current = true;
        dwellMsBySectionRef.current[typedId] =
          (dwellMsBySectionRef.current[typedId] || 0) + 1400;
        const nextSuggestion = evaluateSectionDwellSuggestion(
          dwellMsBySectionRef.current,
          typedId,
          dismissedSectionsRef.current
        );
        setConciergeSuggestion(nextSuggestion);
      }
    }

    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -64, duration: 1.05 });
      let frames = 0;
      const driveScrollTo = (time: number) => {
        lenisRef.current?.raf(time);
        frames += 1;
        if (frames < 50 && lenisRef.current) {
          window.requestAnimationFrame(driveScrollTo);
        }
      };
      window.requestAnimationFrame(driveScrollTo);
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCityFromHero = (city: '深圳' | '广州' | '香港' | '上海') => {
    setSelectedCity(city);
  };

  const handleReserveEvent = (event: BolEvent) => {
    setPreselectedEvent(event);
    setInspectedEvent(null);
    scrollToSection('apply');
  };

  const handleSelectTierForApplication = (tier: MembershipTier) => {
    setPreselectedTier(tier);
    scrollToSection('apply');
  };

  const handleApplyWithProfile = (
    industry: IndustryDomainId,
    rhythm: SocialRhythmId,
    city: Exclude<CityName, '全部城市'>
  ) => {
    setPrefilledIndustry(industry);
    setPrefilledRhythm(rhythm);
    setPrefilledCity(city);
    scrollToSection('apply');
  };

  const handleDismissConciergeSuggestion = () => {
    if (!conciergeSuggestion) return;
    const secId = conciergeSuggestion.sectionId;
    if (!dismissedSectionsRef.current.includes(secId)) {
      dismissedSectionsRef.current = [...dismissedSectionsRef.current, secId];
    }
    setConciergeSuggestion(null);
  };

  const handleTriggerConciergeSuggestionAction = () => {
    if (!conciergeSuggestion) return;
    const { actionType, relatedEventId, relatedTierId } = conciergeSuggestion;

    if (actionType === 'open_featured_event') {
      const targetEv =
        CURATED_EVENTS.find((ev) => ev.id === relatedEventId) || CURATED_EVENTS[0];
      if (targetEv) {
        setInspectedEvent(targetEv);
      }
      return;
    }

    if (actionType === 'scroll_to_apply') {
      if (relatedTierId) {
        const targetTier = MEMBERSHIP_TIERS.find((t) => t.id === relatedTierId);
        if (targetTier) {
          setPreselectedTier(targetTier);
        }
      }
      scrollToSection('apply');
      return;
    }

    if (actionType === 'scroll_to_membership') {
      scrollToSection('membership');
      return;
    }

    if (actionType === 'scroll_to_sandbox') {
      scrollToSection('sandbox');
      return;
    }

    scrollToSection('gatherings');
  };

  return (
    <div
      data-lenis-root="true"
      data-last-pressure-level={lastPressureProfile?.pressureLevelLabel ?? 'none'}
      data-last-expansion-duration={lastPressureProfile?.expansionDurationSec ?? ''}
      data-last-color-intensity={lastPressureProfile?.colorIntensity ?? ''}
      onMouseMove={handleGlobalMouseMove}
      onPointerDown={handleGlobalPointerDown}
      className="relative min-h-screen bg-[#0B0B0C] text-[#F2EFE9] flex flex-col"
    >
      {/* Global Cursor-Following Shimmer Bubble & Pressure-Sensitive Click Ripple Layer */}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        >
          <motion.div
            data-testid="global-cursor-glow-bubble"
            style={{
              x: smoothCursorX,
              y: smoothCursorY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{
              opacity: isInInteractiveZone ? 0.22 : 0.08,
              scale: isInInteractiveZone ? 1 : 0.72,
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 h-44 w-44 rounded-full blur-2xl"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(216,185,138,0.58) 0%, rgba(191,137,67,0.22) 48%, rgba(11,11,12,0) 76%)',
              }}
            />
          </motion.div>

          <AnimatePresence>
            {clickShockwaves.map((wave) => (
              <motion.span
                key={wave.id}
                data-testid="immersive-click-haptic-ring"
                data-pressure-level={wave.pressureProfile.pressureLevelLabel}
                data-pressure-value={wave.pressureProfile.normalizedPressure}
                data-expansion-duration={wave.pressureProfile.expansionDurationSec}
                data-color-intensity={wave.pressureProfile.colorIntensity}
                initial={{
                  opacity: wave.pressureProfile.colorIntensity,
                  scale: 0.18,
                }}
                animate={{
                  opacity: 0,
                  scale: wave.pressureProfile.maxScale,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: wave.pressureProfile.expansionDurationSec,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  left: wave.x - 20,
                  top: wave.y - 20,
                  borderColor: wave.pressureProfile.borderColor,
                  boxShadow: wave.pressureProfile.glowShadow,
                  background: wave.pressureProfile.backgroundGradient,
                }}
                className="fixed h-10 w-10 rounded-full border"
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightweight Scroll-Dwell Ratio 'Concierge Suggestion' Floating Bubble */}
      <AnimatePresence mode="wait">
        {conciergeSuggestion && !inspectedEvent && !isViModalOpen && (
          <motion.aside
            key={conciergeSuggestion.sectionId}
            aria-label="BoL 主理人导览建议"
            data-testid="concierge-suggestion-bubble"
            data-suggested-section={conciergeSuggestion.sectionId}
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-5 left-5 z-30 w-[calc(100vw-2.5rem)] max-w-[356px] rounded-[10px] border border-[#2A2A2E] bg-[#151517]/95 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.68)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-2 text-xs text-[#A3A09A]">
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                <Compass className="w-3.5 h-3.5 text-[#D8B98A] shrink-0" />
                <span className="text-[#D8B98A] font-medium whitespace-nowrap">
                  Concierge Suggestion
                </span>
                <span aria-hidden="true">·</span>
                <span
                  data-testid="concierge-suggestion-ratio"
                  className="tabular-nums text-[#F2EFE9] whitespace-nowrap"
                >
                  停留占比 {conciergeSuggestion.dwellSharePct}%
                </span>
              </div>
              <button
                type="button"
                aria-label="关闭主理人建议气泡"
                data-testid="concierge-suggestion-dismiss"
                onClick={handleDismissConciergeSuggestion}
                className="p-1 text-[#A3A09A] hover:text-[#F2EFE9] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-2 space-y-1">
              <p
                data-testid="concierge-suggestion-headline"
                className="text-sm font-semibold text-[#F2EFE9] leading-snug"
              >
                {conciergeSuggestion.headline}
              </p>
              <p className="text-xs text-[#A3A09A] leading-relaxed">
                {conciergeSuggestion.suggestionCopy}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#2A2A2E] flex items-center justify-between gap-3">
              <span className="text-[11px] text-[#A3A09A] truncate">
                关注板块：{conciergeSuggestion.sectionLabel}
              </span>
              <button
                type="button"
                data-testid="concierge-suggestion-cta"
                onClick={handleTriggerConciergeSuggestionAction}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{conciergeSuggestion.ctaLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Bespoke First-Screen Burgundy Wine (#5A1A1E) & Champagne Gold (#D8B98A) Flowing Luster Skeleton */}
      <FirstScreenRitualSkeleton
        skeletonState={skeletonState}
        reducedMotion={Boolean(prefersReducedMotion)}
        onSkipSkeleton={handleSkipSkeleton}
      />

      <motion.div
        data-testid="bol-page-transition-shell"
        data-skeleton-active={skeletonState.isVisible ? 'true' : 'false'}
        data-vibrating={isGlobalVibrating ? 'true' : 'false'}
        initial={{ opacity: 1, y: 0 }}
        animate={
          isGlobalVibrating && !prefersReducedMotion
            ? { opacity: 1, y: [0, -1.2, 1, -0.5, 0], x: [0, -0.8, 0.8, 0] }
            : { opacity: 1, y: 0, x: 0 }
        }
        transition={{
          duration: isGlobalVibrating ? 0.16 : 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="min-h-screen flex flex-col"
      >
        <TopNav
          activeSectionId={activeSectionId}
          isScrolled={isScrolled}
          onNavigateSection={(id) => scrollToSection(id)}
          onOpenApplication={() => scrollToSection('apply')}
        />

        <main
          data-testid="bol-chiaroscuro-main"
          data-scroll-y={globalScrollY}
          className="flex-1"
        >
          <ClubSectionChiaroscuroZone
            sectionIndex={0}
            scrollY={globalScrollY}
            reducedMotion={Boolean(prefersReducedMotion)}
          >
            <HeroSection
              activeCity={selectedCity}
              onSelectCityFromHero={handleSelectCityFromHero}
              onExploreEvents={() => scrollToSection('gatherings')}
              onOpenSandbox={() => scrollToSection('sandbox')}
              onInspectEvent={(ev) => setInspectedEvent(ev)}
              onReserveEvent={handleReserveEvent}
              onReplaySkeleton={handleReplaySkeleton}
            />
          </ClubSectionChiaroscuroZone>

          <ClubSectionChiaroscuroZone
            sectionIndex={1}
            scrollY={globalScrollY}
            reducedMotion={Boolean(prefersReducedMotion)}
          >
            <LiveCommunityStream
              activeCity={selectedCity}
              onSelectCityFilter={setSelectedCity}
              onInspectRelatedEvent={(ev) => setInspectedEvent(ev)}
            />
          </ClubSectionChiaroscuroZone>

          <ClubSectionChiaroscuroZone
            sectionIndex={2}
            scrollY={globalScrollY}
            reducedMotion={Boolean(prefersReducedMotion)}
          >
            <BrandPhilosophySection />
          </ClubSectionChiaroscuroZone>

          <ClubSectionChiaroscuroZone
            sectionIndex={3}
            scrollY={globalScrollY}
            reducedMotion={Boolean(prefersReducedMotion)}
          >
            <EventMatrixSection
              selectedSeries={selectedSeries}
              onSelectSeries={setSelectedSeries}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onInspectEvent={(ev) => setInspectedEvent(ev)}
              onReserveEvent={handleReserveEvent}
            />
          </ClubSectionChiaroscuroZone>

          <ClubSectionChiaroscuroZone
            sectionIndex={4}
            scrollY={globalScrollY}
            reducedMotion={Boolean(prefersReducedMotion)}
          >
            <ConnectionSandboxSection
              onSelectRecommendedEvent={(ev) => setInspectedEvent(ev)}
              onApplyWithProfile={handleApplyWithProfile}
            />
          </ClubSectionChiaroscuroZone>

          <ClubSectionChiaroscuroZone
            sectionIndex={5}
            scrollY={globalScrollY}
            reducedMotion={Boolean(prefersReducedMotion)}
          >
            <MembershipSection
              onSelectTierForApplication={handleSelectTierForApplication}
            />
          </ClubSectionChiaroscuroZone>

          <ClubSectionChiaroscuroZone
            sectionIndex={6}
            scrollY={globalScrollY}
            reducedMotion={Boolean(prefersReducedMotion)}
          >
            <MemberStoriesSection
              onSelectTierFromStory={handleSelectTierForApplication}
            />
          </ClubSectionChiaroscuroZone>

          <ClubSectionChiaroscuroZone
            sectionIndex={7}
            scrollY={globalScrollY}
            reducedMotion={Boolean(prefersReducedMotion)}
          >
            <FieldNotesSection />
          </ClubSectionChiaroscuroZone>

          <ClubSectionChiaroscuroZone
            sectionIndex={8}
            scrollY={globalScrollY}
            reducedMotion={Boolean(prefersReducedMotion)}
          >
            <ApplicationConciergeSection
              preselectedEvent={preselectedEvent}
              preselectedTier={preselectedTier}
              prefilledCity={prefilledCity}
              prefilledIndustry={prefilledIndustry}
              prefilledRhythm={prefilledRhythm}
            />
          </ClubSectionChiaroscuroZone>
        </main>

        <FooterSection onOpenViModal={() => setIsViModalOpen(true)} />
      </motion.div>

      <EventDossierModal
        event={inspectedEvent}
        onClose={() => setInspectedEvent(null)}
        onProceedToReserve={handleReserveEvent}
      />

      <ViGovernanceModal
        isOpen={isViModalOpen}
        onClose={() => setIsViModalOpen(false)}
      />
    </div>
  );
}


