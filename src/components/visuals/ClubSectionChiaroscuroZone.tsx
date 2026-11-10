import React, { useEffect, useRef, useState } from 'react';
import { computeSectionChiaroscuroProfile } from '../../lib/curationEngine';

interface ClubSectionChiaroscuroZoneProps {
  sectionIndex: number;
  scrollY: number;
  reducedMotion?: boolean;
  children: React.ReactNode;
}

export const ClubSectionChiaroscuroZone: React.FC<ClubSectionChiaroscuroZoneProps> = ({
  sectionIndex,
  scrollY,
  reducedMotion = false,
  children,
}) => {
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const [sectionTopRel, setSectionTopRel] = useState<number>(0);
  const [viewportH, setViewportH] = useState<number>(900);

  useEffect(() => {
    if (typeof window === 'undefined' || !zoneRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();
    setSectionTopRel(rect.top);
    setViewportH(window.innerHeight || 900);
  }, [scrollY]);

  const profile = computeSectionChiaroscuroProfile(
    sectionIndex,
    scrollY,
    sectionTopRel,
    viewportH,
    reducedMotion
  );

  // Compute subtle alternating surface tint from luminanceDelta (0.94..1.06)
  const isWarmPhase = profile.luminanceDelta >= 1;
  const deltaStrength = Math.min(0.18, Math.abs(profile.luminanceDelta - 1) * 2.4);
  const dynamicZoneBg = isWarmPhase
    ? `rgba(216, 185, 138, ${Number((deltaStrength * 0.35).toFixed(4))})`
    : `rgba(5, 5, 6, ${Number((deltaStrength * 0.85).toFixed(4))})`;

  return (
    <div
      ref={zoneRef}
      data-testid={`club-lounge-zone-${profile.sectionId}`}
      data-zone-index={profile.sectionIndex}
      data-zone-polarity={profile.polarity}
      data-luminance={profile.luminanceDelta}
      data-scroll-blur-px={profile.boundaryBlurPx}
      style={{
        backgroundColor: reducedMotion ? undefined : dynamicZoneBg,
      }}
      className="relative transition-colors duration-200 ease-out"
    >
      {/* Inter-Section Scroll-Parallax Blur Transition Veil (rendered above sections 1..8) */}
      {sectionIndex > 0 && (
        <div
          aria-hidden="true"
          data-testid={`section-parallax-blur-transition-${sectionIndex}`}
          data-blur-px={profile.boundaryBlurPx}
          data-parallax-shift-y={profile.parallaxShiftY}
          style={{
            transform: `translate3d(0, ${profile.parallaxShiftY}px, 0)`,
            backdropFilter: `blur(${profile.boundaryBlurPx}px)`,
            WebkitBackdropFilter: `blur(${profile.boundaryBlurPx}px)`,
          }}
          className="pointer-events-none relative z-20 -my-5 h-10 w-full overflow-hidden flex items-center justify-center transition-transform duration-150 ease-out"
        >
          <div
            className="w-full h-full opacity-85"
            style={{
              background:
                profile.polarity === 'amber-glow'
                  ? 'linear-gradient(180deg, rgba(11,11,12,0) 0%, rgba(216,185,138,0.07) 50%, rgba(11,11,12,0) 100%)'
                  : 'linear-gradient(180deg, rgba(11,11,12,0) 0%, rgba(90,26,30,0.10) 50%, rgba(11,11,12,0) 100%)',
            }}
          />
          <div className="absolute inset-x-12 lg:inset-x-32 h-[1px] bg-gradient-to-r from-transparent via-[#D8B98A]/25 to-transparent" />
        </div>
      )}

      {/* Alternating Chiaroscuro Ambient Light & Shadow Floating Backdrop */}
      <div
        aria-hidden="true"
        data-testid={`club-lounge-ambient-${profile.sectionId}`}
        style={{
          background: profile.ambientGradientCss,
        }}
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
      />

      {/* Section Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
