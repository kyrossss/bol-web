import React from 'react';
import { BolEvent } from '../../types/bol';

interface EventSceneArtProps {
  mood: BolEvent['visualMood'];
  atmosphereNote: string;
  code: string;
}

/**
 * 遵循 VI 手册 4.5 摄影与画面处理规范：
 * 低饱和、深背景、暖高光、保留暗部层次；明确标注“活动氛围示意”，保护真实嘉宾隐私。
 */
export const EventSceneArt: React.FC<EventSceneArtProps> = ({
  mood,
  atmosphereNote,
  code,
}) => {
  const moodGradients: Record<BolEvent['visualMood'], string> = {
    'wine-velvet':
      'radial-gradient(circle at 75% 28%, rgba(90, 26, 30, 0.72) 0%, rgba(21, 21, 23, 0.96) 65%, #0B0B0C 100%)',
    'champagne-noir':
      'radial-gradient(circle at 30% 25%, rgba(216, 185, 138, 0.28) 0%, rgba(21, 21, 23, 0.95) 68%, #0B0B0C 100%)',
    'salon-glow':
      'radial-gradient(circle at 65% 32%, rgba(191, 137, 67, 0.34) 0%, rgba(24, 22, 26, 0.95) 66%, #0B0B0C 100%)',
    'harbor-amber':
      'radial-gradient(circle at 25% 30%, rgba(191, 137, 67, 0.36) 0%, rgba(18, 26, 34, 0.94) 64%, #0B0B0C 100%)',
    'warm-brass':
      'radial-gradient(circle at 70% 35%, rgba(216, 185, 138, 0.25) 0%, rgba(45, 28, 22, 0.92) 65%, #0B0B0C 100%)',
    'emerald-obsidian':
      'radial-gradient(circle at 50% 25%, rgba(216, 185, 138, 0.32) 0%, rgba(17, 25, 23, 0.95) 68%, #0B0B0C 100%)',
  };

  return (
    <div
      className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#0B0B0C] border-b border-[#2A2A2E]"
      style={{ background: moodGradients[mood] }}
    >
      {/* Architectural SVG Composition */}
      <svg
        viewBox="0 0 400 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover opacity-85"
        aria-hidden="true"
      >
        {/* Subtle grid horizon */}
        <line x1="0" y1="155" x2="400" y2="155" stroke="#2A2A2E" strokeWidth="1" />
        <line x1="65" y1="0" x2="65" y2="210" stroke="#2A2A2E" strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="335" y1="0" x2="335" y2="210" stroke="#2A2A2E" strokeWidth="0.75" strokeDasharray="3 3" />

        {mood === 'wine-velvet' && (
          <>
            {/* Stemware & tabletop refraction */}
            <circle cx="290" cy="64" r="38" fill="#D8B98A" fillOpacity="0.12" />
            <circle cx="290" cy="64" r="18" stroke="#D8B98A" strokeOpacity="0.45" strokeWidth="1" />
            <path d="M145 75 L185 75 L170 112 L160 112 Z" stroke="#D8B98A" strokeOpacity="0.7" strokeWidth="1.2" />
            <line x1="165" y1="112" x2="165" y2="155" stroke="#D8B98A" strokeOpacity="0.7" strokeWidth="1.2" />
            <line x1="148" y1="155" x2="182" y2="155" stroke="#D8B98A" strokeOpacity="0.7" strokeWidth="1.2" />
            <circle cx="225" cy="108" r="24" stroke="#F2EFE9" strokeOpacity="0.25" strokeWidth="1" />
          </>
        )}

        {mood === 'champagne-noir' && (
          <>
            {/* Long private dinner table perspective & warm candles */}
            <polygon
              points="90,155 310,155 265,92 135,92"
              stroke="#D8B98A"
              strokeOpacity="0.55"
              strokeWidth="1.2"
              fill="#151517"
              fillOpacity="0.45"
            />
            <circle cx="170" cy="78" r="8" fill="#D8B98A" fillOpacity="0.35" />
            <circle cx="200" cy="72" r="11" fill="#BF8943" fillOpacity="0.45" />
            <circle cx="230" cy="78" r="8" fill="#D8B98A" fillOpacity="0.35" />
          </>
        )}

        {mood === 'harbor-amber' && (
          <>
            {/* Sail geometry & harbor water reflection */}
            <path
              d="M195 36 L195 145 L135 145 Z"
              stroke="#D8B98A"
              strokeOpacity="0.65"
              strokeWidth="1.3"
              fill="#D8B98A"
              fillOpacity="0.08"
            />
            <path
              d="M202 52 L202 145 L252 145 Z"
              stroke="#F2EFE9"
              strokeOpacity="0.4"
              strokeWidth="1.1"
            />
            <circle cx="295" cy="58" r="22" fill="#BF8943" fillOpacity="0.28" />
            <line x1="110" y1="168" x2="290" y2="168" stroke="#D8B98A" strokeOpacity="0.35" strokeWidth="1" />
            <line x1="145" y1="180" x2="255" y2="180" stroke="#D8B98A" strokeOpacity="0.2" strokeWidth="1" />
          </>
        )}

        {(mood === 'salon-glow' || mood === 'warm-brass' || mood === 'emerald-obsidian') && (
          <>
            {/* Three-ring resonance waves */}
            <circle cx="175" cy="96" r="36" stroke="#D8B98A" strokeOpacity="0.5" strokeWidth="1.2" />
            <circle cx="222" cy="96" r="36" stroke="#BF8943" strokeOpacity="0.4" strokeWidth="1.2" />
            <circle cx="198" cy="66" r="36" stroke="#F2EFE9" strokeOpacity="0.22" strokeWidth="1.2" />
            <circle cx="198" cy="86" r="3" fill="#D8B98A" />
          </>
        )}
      </svg>

      {/* Measured contrast scrim for text legibility */}
      <div className="absolute inset-0 bol-scrim pointer-events-none" />

      {/* Top Metadata Line (Unboxed clean typography per Zero-Pill rule) */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-xs text-[#A3A09A]">
        <span className="tabular-nums text-[#D8B98A]">{code}</span>
        <span>{atmosphereNote}</span>
      </div>
    </div>
  );
};
