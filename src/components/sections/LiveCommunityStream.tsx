import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp, Pause, Play, Radio } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CURATED_EVENTS } from '../../content';
import { getLiveCommunityStream } from '../../lib/curationEngine';
import { BolEvent, CityName, LiveCommunityConnectionItem } from '../../types/bol';

interface LiveCommunityStreamProps {
  activeCity: CityName;
  onSelectCityFilter: (city: CityName) => void;
  onInspectRelatedEvent: (event: BolEvent) => void;
}

export const LiveCommunityStream: React.FC<LiveCommunityStreamProps> = ({
  activeCity,
  onSelectCityFilter,
  onInspectRelatedEvent,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [tickerIndex, setTickerIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const streamState = getLiveCommunityStream(activeCity, tickerIndex);
  const { items, activeItem, normalizedIndex, nextIndex, prevIndex, activeTonightCount } =
    streamState;

  useEffect(() => {
    setTickerIndex(0);
  }, [activeCity]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || items.length <= 1) return;
    const timer = window.setInterval(() => {
      setTickerIndex((prev) => prev + 1);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isPaused, items.length]);

  const handleOpenRelatedGathering = (item: LiveCommunityConnectionItem) => {
    const matched =
      CURATED_EVENTS.find((ev) => ev.id === item.relatedEventId) || CURATED_EVENTS[0];
    if (matched) {
      onInspectRelatedEvent(matched);
    }
  };

  const cities: CityName[] = ['全部城市', '深圳', '广州', '香港', '上海'];

  return (
    <section
      aria-label="实时社群动态流"
      data-testid="live-community-stream"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="px-6 lg:px-12 max-w-[1360px] mx-auto pb-14 lg:pb-20"
    >
      <div className="rounded-[10px] bg-[#151517]/95 border border-[#2A2A2E] bol-champagne-glow px-5 py-5 sm:px-8 sm:py-6 space-y-4">
        {/* Top Row: Live Pulse Status + Micro-Scroll Viewport + Step Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left 3 cols: Live Pulse Indicator & Active Tonight Counter */}
          <div className="lg:col-span-3 flex items-center justify-between lg:justify-start gap-4 lg:border-r lg:border-[#2A2A2E] lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D8B98A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D8B98A]" />
              </span>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] tracking-widest text-[#D8B98A] font-medium">
                  <Radio className="w-3 h-3" />
                  <span>LIVE PULSE · 实时社群动态流</span>
                </div>
                <p className="text-xs text-[#A3A09A] mt-0.5">
                  今夜在场同频连接 ·{' '}
                  <span
                    data-testid="live-pulse-tonight-count"
                    className="tabular-nums text-[#F2EFE9] font-medium"
                  >
                    {activeTonightCount} 组正在发生
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Center 7 cols: Elegant Vertical Micro-Scroll Connection Stage */}
          <div
            data-testid="live-community-micro-scroller"
            className="lg:col-span-7 relative min-h-[76px] sm:min-h-[68px] flex items-center overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                data-testid="live-community-active-item"
                data-connection-id={activeItem.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 16, filter: 'blur(2px)' }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -16, filter: 'blur(2px)' }
                }
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="w-full space-y-1.5"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="tabular-nums text-[#D8B98A] font-medium">
                    {activeItem.timestampLabel}
                  </span>
                  <span aria-hidden="true" className="text-[#2A2A2E]">
                    ·
                  </span>
                  <span className="text-[#F2EFE9]/90">{activeItem.sceneTag}</span>
                  <span aria-hidden="true" className="text-[#2A2A2E]">
                    ·
                  </span>
                  <span className="text-[#A3A09A]">
                    {activeItem.initiatorRole} × {activeItem.counterpartRole}
                  </span>
                </div>

                <p
                  data-testid="live-community-consensus-headline"
                  className="font-editorial text-lg sm:text-xl text-[#F2EFE9] leading-snug"
                >
                  “{activeItem.consensusHeadline}”
                </p>

                <p className="text-xs text-[#A3A09A] leading-relaxed">
                  {activeItem.consensusDetail}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right 2 cols: Micro-Scroll Controls & Scene Link */}
          <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#2A2A2E]">
            <button
              type="button"
              data-testid="live-stream-inspect-scene-btn"
              onClick={() => handleOpenRelatedGathering(activeItem)}
              className="inline-flex items-center gap-1 text-xs text-[#D8B98A] hover:text-[#F2EFE9] transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>同款场域</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="上一条实时连接"
                data-testid="live-stream-prev-btn"
                onClick={() => setTickerIndex(prevIndex)}
                className="p-1.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9] hover:border-[#D8B98A] transition-colors cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                aria-label={isPaused ? '继续滚动实时动态' : '暂停滚动实时动态'}
                data-testid="live-stream-pause-btn"
                onClick={() => setIsPaused((p) => !p)}
                className="p-1.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9] hover:border-[#D8B98A] transition-colors cursor-pointer"
              >
                {isPaused ? (
                  <Play className="w-3 h-3 text-[#D8B98A]" />
                ) : (
                  <Pause className="w-3 h-3" />
                )}
              </button>
              <button
                type="button"
                aria-label="下一条实时连接"
                data-testid="live-stream-next-btn"
                onClick={() => setTickerIndex(nextIndex)}
                className="p-1.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9] hover:border-[#D8B98A] transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Micro-Scroll Index Strip & City Quick Switch */}
        <div className="pt-3.5 border-t border-[#2A2A2E]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Interactive Micro-Scroll Dots & Direct Connection Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {items.map((conn, idx) => {
              const isCurrent = idx === normalizedIndex;
              return (
                <button
                  key={conn.id}
                  type="button"
                  data-testid={`live-stream-pill-${idx}`}
                  onClick={() => setTickerIndex(idx)}
                  className={`px-2.5 py-1 rounded-[5px] text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#D8B98A]/18 text-[#D8B98A] border border-[#D8B98A]/60'
                      : 'bg-[#0B0B0C]/70 text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                  }`}
                >
                  <span className="tabular-nums font-medium">{conn.city}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate max-w-[165px]">
                    {conn.initiatorRole} × {conn.counterpartRole}
                  </span>
                </button>
              );
            })}
          </div>

          {/* City Coordinate Filter for Live Pulse */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-[#A3A09A]">场域切换：</span>
            {cities.map((c) => {
              const isCitySelected = activeCity === c;
              return (
                <button
                  key={`pulse-city-${c}`}
                  type="button"
                  data-testid={`live-stream-city-${c}`}
                  onClick={() => onSelectCityFilter(c)}
                  className={`px-2 py-0.5 rounded-[4px] text-[11px] transition-colors cursor-pointer ${
                    isCitySelected
                      ? 'text-[#D8B98A] font-medium underline underline-offset-4'
                      : 'text-[#A3A09A] hover:text-[#F2EFE9]'
                  }`}
                >
                  {c === '全部城市' ? '四城同步' : c}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
