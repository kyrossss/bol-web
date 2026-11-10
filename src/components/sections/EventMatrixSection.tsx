import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowUpRight,
  RotateCcw,
  Bell,
  BellRing,
  Sparkles,
  Check,
  Bookmark,
  CalendarPlus,
  CalendarCheck2,
  SlidersHorizontal,
  ChevronDown,
  X,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { CURATED_EVENTS, EVENT_SERIES_TABS } from '../../content';
import {
  BOL_SCHEDULE_STORAGE_KEY,
  buildAnnualEventStreamlineData,
  buildPersonalWishlistSummary,
  buildSmartFilterSummary,
  buildSubscriptionPreferenceSummary,
  filterCuratedEvents,
  syncScheduledEventIds,
  toggleWishlistEventIds,
  transitionEventSubscription,
} from '../../lib/curationEngine';
import {
  BolEvent,
  CityName,
  EventSeriesId,
  EventSubscriptionState,
  EventSubscriptionTrigger,
} from '../../types/bol';
import { EventReservationSlipModal } from '../modals/EventReservationSlipModal';
import { AnnualEventStreamlineChart } from '../visuals/AnnualEventStreamlineChart';
import { BolCard } from '../visuals/BolCard';
import { EventSceneArt } from '../visuals/EventSceneArt';
import { HapticButton } from '../visuals/HapticButton';
import { PersonalWishlistSidebar } from '../visuals/PersonalWishlistSidebar';
import { WishlistExpectationMicroPopover } from '../visuals/WishlistExpectationMicroPopover';

interface EventMatrixSectionProps {
  selectedSeries: EventSeriesId;
  onSelectSeries: (series: EventSeriesId) => void;
  selectedCity: CityName;
  onSelectCity: (city: CityName) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onInspectEvent: (event: BolEvent) => void;
  onReserveEvent: (event: BolEvent) => void;
}

interface CardGoldRipple {
  id: number;
  eventId: string;
  x: number;
  y: number;
  size: number;
}

export const EventMatrixSection: React.FC<EventMatrixSectionProps> = ({
  selectedSeries,
  onSelectSeries,
  selectedCity,
  onSelectCity,
  searchQuery,
  onSearchChange,
  onInspectEvent,
  onReserveEvent,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const cities: CityName[] = ['全部城市', '深圳', '广州', '香港', '上海'];

  // Floating Smart Filter Dropdown State
  const [isSmartFilterOpen, setIsSmartFilterOpen] = useState<boolean>(false);
  const [isStreamlineCollapsed, setIsStreamlineCollapsed] = useState<boolean>(false);
  const filterContainerRef = useRef<HTMLDivElement | null>(null);

  // State Machine map for per-event "关注邀约" (Invitation Alert Subscription)
  const [subscriptionMap, setSubscriptionMap] = useState<
    Record<string, EventSubscriptionState>
  >({
    'bol-sz-ai-wine': 'subscribed_alert',
  });

  // Temporary Personal Wishlist ("收藏 / 临时个人心愿单") + Expectation Dimension Sliders + Right-Hand Sidebar state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['bol-sz-ai-wine']);
  const [expectationSliders, setExpectationSliders] = useState<
    Record<string, number>
  >({
    'bol-sz-ai-wine': 18,
  });
  const [activeExpectationEventId, setActiveExpectationEventId] = useState<
    string | null
  >(null);
  const [isWishlistSidebarOpen, setIsWishlistSidebarOpen] = useState<boolean>(false);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [cardRipples, setCardRipples] = useState<CardGoldRipple[]>([]);
  const [streamlineFocusedEventId, setStreamlineFocusedEventId] = useState<
    string | null
  >('bol-sz-ai-wine');

  // LocalStorage-synced Schedule ("加入日程") & Bespoke Reservation Slip Modal state
  const [scheduledEventIds, setScheduledEventIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(BOL_SCHEDULE_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });
  const [activeSlipEvent, setActiveSlipEvent] = useState<BolEvent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        BOL_SCHEDULE_STORAGE_KEY,
        JSON.stringify(scheduledEventIds)
      );
    } catch {
      // Ignore storage quota errors in restricted sandboxes
    }
  }, [scheduledEventIds]);

  // Close floating smart filter dropdown on outside click or Escape
  useEffect(() => {
    if (!isSmartFilterOpen) return;
    const handlePointerDownOutside = (e: MouseEvent) => {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(e.target as Node)
      ) {
        setIsSmartFilterOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSmartFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSmartFilterOpen]);

  const filteredEvents = filterCuratedEvents(
    CURATED_EVENTS,
    selectedSeries,
    selectedCity,
    searchQuery
  );

  const smartFilterSummary = buildSmartFilterSummary(
    selectedSeries,
    selectedCity,
    searchQuery,
    filteredEvents.length
  );

  const annualStreamlineData = buildAnnualEventStreamlineData(
    CURATED_EVENTS,
    selectedSeries,
    selectedCity
  );

  const preferenceSummary = buildSubscriptionPreferenceSummary(
    subscriptionMap,
    CURATED_EVENTS
  );

  const wishlistSummary = buildPersonalWishlistSummary(
    wishlistIds,
    CURATED_EVENTS,
    expectationSliders
  );
  const totalFavorited = wishlistSummary.totalCount;

  const handleLocateEventFromStreamline = (targetEventId: string) => {
    setStreamlineFocusedEventId(targetEventId);
    const isCurrentlyVisible = filteredEvents.some((ev) => ev.id === targetEventId);
    if (!isCurrentlyVisible) {
      onSelectSeries('all');
      onSelectCity('全部城市');
      onSearchChange('');
    }

    window.setTimeout(() => {
      const cardEl = document.getElementById(`event-card-anchor-${targetEventId}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  const spawnCardGoldRipple = (
    eventId: string,
    e: React.MouseEvent<HTMLElement>
  ) => {
    if (prefersReducedMotion) return;
    const cardEl = e.currentTarget.closest('[data-event-card]') as HTMLElement | null;
    const rect = cardEl?.getBoundingClientRect() || e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.15;
    const clientX = e.clientX || rect.left + rect.width * 0.78;
    const clientY = e.clientY || rect.top + rect.height * 0.38;
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    const ripple: CardGoldRipple = {
      id: Date.now() + Math.random(),
      eventId,
      x,
      y,
      size,
    };

    setCardRipples((prev) => [...prev.slice(-4), ripple]);
    window.setTimeout(() => {
      setCardRipples((prev) => prev.filter((item) => item.id !== ripple.id));
    }, 680);
  };

  const handleToggleFavorite = (
    eventId: string,
    e: React.MouseEvent<HTMLElement>
  ) => {
    spawnCardGoldRipple(eventId, e);
    const { nextIds, added } = toggleWishlistEventIds(wishlistIds, eventId);
    setWishlistIds(nextIds);
    if (added) {
      setActiveExpectationEventId(eventId);
      setIsWishlistSidebarOpen(false);
    } else if (activeExpectationEventId === eventId) {
      setActiveExpectationEventId(null);
    }
  };

  const handleExpectationSliderChange = (eventId: string, value: number) => {
    setExpectationSliders((prev) => ({
      ...prev,
      [eventId]: value,
    }));
  };

  const handleOpenExpectationFromSidebar = (eventId: string) => {
    setIsWishlistSidebarOpen(false);
    setActiveExpectationEventId(eventId);
    handleLocateEventFromStreamline(eventId);
  };

  const handleRemoveFromWishlist = (eventId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== eventId));
    if (activeExpectationEventId === eventId) {
      setActiveExpectationEventId(null);
    }
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    setActiveExpectationEventId(null);
  };

  const handleDispatchSubscription = (
    eventId: string,
    trigger: EventSubscriptionTrigger,
    e?: React.MouseEvent<HTMLElement>
  ) => {
    if (e) {
      spawnCardGoldRipple(eventId, e);
    }
    setSubscriptionMap((prev) => {
      const currentState = prev[eventId] || 'idle';
      const nextState = transitionEventSubscription(currentState, trigger);
      return {
        ...prev,
        [eventId]: nextState,
      };
    });
  };

  const handleUpgradeAllToPriority = () => {
    setSubscriptionMap((prev) => {
      const updated: Record<string, EventSubscriptionState> = { ...prev };
      Object.keys(updated).forEach((id) => {
        if (updated[id] === 'subscribed_alert') {
          updated[id] = transitionEventSubscription(
            updated[id],
            'UPGRADE_PRIORITY_PUSH'
          );
        }
      });
      return updated;
    });
  };

  const handleResetFilters = () => {
    onSelectSeries('all');
    onSelectCity('全部城市');
    onSearchChange('');
  };

  const handleAddToScheduleAndOpenSlip = (
    event: BolEvent,
    e: React.MouseEvent<HTMLElement>
  ) => {
    spawnCardGoldRipple(event.id, e);
    const { nextIds } = syncScheduledEventIds(scheduledEventIds, event.id, 'add');
    setScheduledEventIds(nextIds);
    try {
      window.localStorage.setItem(BOL_SCHEDULE_STORAGE_KEY, JSON.stringify(nextIds));
    } catch {
      // Ignore storage errors
    }
    setActiveSlipEvent(event);
  };

  const handleRemoveFromSchedule = (eventId: string) => {
    const { nextIds } = syncScheduledEventIds(scheduledEventIds, eventId, 'remove');
    setScheduledEventIds(nextIds);
    try {
      window.localStorage.setItem(BOL_SCHEDULE_STORAGE_KEY, JSON.stringify(nextIds));
    } catch {
      // Ignore storage errors
    }
    if (activeSlipEvent?.id === eventId) {
      const nextRemaining = CURATED_EVENTS.find((ev) => nextIds.includes(ev.id)) || null;
      setActiveSlipEvent(nextRemaining);
    }
  };

  const scheduledEventsList = CURATED_EVENTS.filter((ev) =>
    scheduledEventIds.includes(ev.id)
  );

  return (
    <section
      id="gatherings"
      className="bol-snap-section py-24 lg:py-32 px-6 lg:px-12 max-w-[1360px] mx-auto border-t border-[#2A2A2E]"
    >
      {/* Editorial Section Header with Generous Negative Space */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs text-[#D8B98A] tracking-widest">
            02. CURATED GATHERINGS · 近期私享聚会与关注邀约
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] font-medium text-[#F2EFE9] leading-[1.18]">
            克制人数与议题密度，让每一场聚会都保有私密仪式感
          </h2>
        </div>

        {/* Floating Smart Filter Trigger & Status Bar */}
        <div
          ref={filterContainerRef}
          data-testid="smart-filter-dropdown-container"
          className="relative z-30 flex flex-wrap items-center gap-3 self-start lg:self-end"
        >
          <div className="flex items-center gap-2.5 text-xs text-[#A3A09A] pr-2">
            <span
              data-testid="filtered-events-count"
              className="tabular-nums font-semibold text-[#D8B98A]"
            >
              {filteredEvents.length} 场近期聚会
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              data-testid="favorited-events-count"
              onClick={() => setIsWishlistSidebarOpen((prev) => !prev)}
              className="tabular-nums text-[#F2EFE9] hover:text-[#D8B98A] underline-offset-4 hover:underline transition-colors cursor-pointer"
            >
              已收藏 {totalFavorited} 场（心愿单）
            </button>
            <span aria-hidden="true">·</span>
            <span
              data-testid="scheduled-events-count"
              className="tabular-nums text-[#D8B98A]"
            >
              已入日程 {scheduledEventIds.length} 场
            </span>
          </div>

          {/* Floating Smart Dropdown Trigger Button */}
          <HapticButton
            type="button"
            rippleTone="champagne"
            data-testid="smart-filter-trigger-btn"
            aria-expanded={isSmartFilterOpen}
            onClick={() => setIsSmartFilterOpen((prev) => !prev)}
            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all cursor-pointer ${
              isSmartFilterOpen || smartFilterSummary.activeFilterCount > 0
                ? 'bg-[#151517] text-[#F2EFE9] border-[#D8B98A] shadow-[0_12px_32px_rgba(0,0,0,0.55)]'
                : 'bg-[#151517]/90 text-[#F2EFE9] border-[#2A2A2E] hover:border-[#D8B98A]/70'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D8B98A]" />
            <span data-testid="smart-filter-summary-label">
              智能筛选：{smartFilterSummary.summaryText}
            </span>
            {smartFilterSummary.activeFilterCount > 0 && (
              <span
                data-testid="smart-filter-active-badge"
                className="tabular-nums px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#D8B98A] text-[#0B0B0C]"
              >
                {smartFilterSummary.activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#D8B98A] transition-transform duration-200 ${
                isSmartFilterOpen ? 'rotate-180' : ''
              }`}
            />
          </HapticButton>

          {smartFilterSummary.activeFilterCount > 0 && (
            <button
              type="button"
              data-testid="smart-filter-quick-reset"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs text-[#A3A09A] hover:text-[#F2EFE9] bg-[#0B0B0C] border border-[#2A2A2E] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置</span>
            </button>
          )}

          {/* Floating Smart Filter Dropdown Menu Panel */}
          <AnimatePresence>
            {isSmartFilterOpen && (
              <motion.div
                data-testid="smart-filter-dropdown-panel"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 8, scale: 0.98 }
                }
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 lg:left-auto lg:right-0 top-full mt-3 w-[calc(100vw-3rem)] max-w-[540px] rounded-[12px] bg-[#151517]/98 border border-[#D8B98A]/60 p-6 shadow-[0_28px_64px_rgba(0,0,0,0.82)] backdrop-blur-xl space-y-6"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2E]">
                  <div>
                    <p className="text-[11px] text-[#D8B98A] tracking-wider font-medium">
                      SMART CONCIERGE FILTER · 悬浮式智能场次筛选器
                    </p>
                    <p className="text-xs text-[#A3A09A] mt-0.5">
                      合并系列、城市与议题检索，保持活动画廊的纯粹负空间
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="关闭智能筛选面板"
                    data-testid="smart-filter-close-btn"
                    onClick={() => setIsSmartFilterOpen(false)}
                    className="p-1.5 rounded-full text-[#A3A09A] hover:text-[#F2EFE9] bg-[#0B0B0C] border border-[#2A2A2E] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 01. Series Filter */}
                <div className="space-y-2.5">
                  <span className="text-xs font-medium text-[#D8B98A] block">
                    01 · 选择聚会系列（Curated Series）
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_SERIES_TABS.map((tab) => {
                      const isActive = selectedSeries === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          data-testid={`smart-filter-series-${tab.id}`}
                          onClick={() => onSelectSeries(tab.id)}
                          className={`px-3.5 py-2 rounded-[6px] text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            isActive
                              ? 'bg-[#D8B98A] text-[#0B0B0C]'
                              : 'bg-[#0B0B0C] text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 02. City Coordinate Filter */}
                <div className="space-y-2.5">
                  <span className="text-xs font-medium text-[#D8B98A] block">
                    02 · 选择城市坐标（City Coordinates）
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((city) => {
                      const isCityActive = selectedCity === city;
                      return (
                        <button
                          key={city}
                          type="button"
                          data-testid={`smart-filter-city-${city}`}
                          onClick={() => onSelectCity(city)}
                          className={`px-3.5 py-1.5 rounded-[6px] text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            isCityActive
                              ? 'bg-[#F2EFE9] text-[#0B0B0C]'
                              : 'bg-[#0B0B0C] text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                          }`}
                        >
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 03. Keyword Search */}
                <div className="space-y-2">
                  <label
                    htmlFor="event-search-input"
                    className="text-xs font-medium text-[#D8B98A] block"
                  >
                    03 · 搜索活动主题或议题关键词
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#A3A09A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="event-search-input"
                      data-testid="smart-filter-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="搜索 AI、出海、私宴、帆船..."
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#0B0B0C] border border-[#2A2A2E] rounded-[6px] text-[#F2EFE9] placeholder:text-[#A3A09A]/60 focus:outline-none focus:border-[#D8B98A]"
                    />
                  </div>
                </div>

                {/* Popover Footer */}
                <div className="pt-3 border-t border-[#2A2A2E] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 text-xs text-[#A3A09A] hover:text-[#F2EFE9] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置全部条件</span>
                  </button>
                  <button
                    type="button"
                    data-testid="smart-filter-apply-btn"
                    onClick={() => setIsSmartFilterOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                  >
                    查看 {filteredEvents.length} 场匹配聚会
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* State-Machine Invitation Subscription & Targeted Push Console ("关注邀约状态机") */}
      <BolCard
        data-testid="invitation-subscription-console"
        hoverElevation={false}
        className="p-5 sm:p-6 border-[#D8B98A]/45 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#D8B98A] inline-flex items-center gap-1.5 font-medium">
              <BellRing className="w-3.5 h-3.5" />
              <span>关注邀约 · 偏好状态机引擎</span>
            </span>
            <span aria-hidden="true" className="text-[#A3A09A]">
              ·
            </span>
            <span
              data-testid="subscription-fsm-status"
              className="tabular-nums text-[#F2EFE9]"
            >
              {preferenceSummary.fsmStateLabel}
            </span>
          </div>

          <p
            data-testid="subscription-push-copy"
            className="text-xs text-[#A3A09A] leading-relaxed"
          >
            {preferenceSummary.pushTargetingCopy}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {preferenceSummary.totalSubscribed > 0 && (
            <HapticButton
              type="button"
              data-testid="upgrade-priority-push-btn"
              onClick={handleUpgradeAllToPriority}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>升级为高优定向推送</span>
            </HapticButton>
          )}
          <button
            type="button"
            data-testid="toggle-streamline-view-btn"
            onClick={() => setIsStreamlineCollapsed((prev) => !prev)}
            className="px-3 py-2 rounded-full text-xs text-[#A3A09A] hover:text-[#F2EFE9] bg-[#0B0B0C] border border-[#2A2A2E] transition-colors cursor-pointer"
          >
            {isStreamlineCollapsed ? '展开年度活动流线图' : '收起流线图 · 纯享负空间画廊'}
          </button>
        </div>
      </BolCard>

      {/* D3.js Annual Event Streamline Chart ("年度活动流线图") */}
      {!isStreamlineCollapsed && (
        <div className="mb-14">
          <AnnualEventStreamlineChart
            streamlineData={annualStreamlineData}
            selectedSeries={selectedSeries}
            activeEventId={streamlineFocusedEventId}
            onSelectSeriesFilter={onSelectSeries}
            onLocateEventCard={handleLocateEventFromStreamline}
          />
        </div>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 ? (
        <BolCard className="p-16 text-center space-y-5">
          <p className="font-editorial text-2xl text-[#F2EFE9]">
            当前筛选条件下暂无对应场次
          </p>
          <p className="text-sm text-[#A3A09A] max-w-md mx-auto">
            您可以切换至「全部城市」或重置系列筛选，查看深圳、广州、香港与上海的全部近期聚会。
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] rounded-full transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置全部筛选</span>
          </button>
        </BolCard>
      ) : (
        /* Negative Space Refactored Event Cards Gallery (2-Column Editorial Layout with Expansive Breathing Room) */
        <div
          data-testid="negative-space-event-grid"
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 pt-2"
        >
          {filteredEvents.map((ev, idx) => {
            const subState: EventSubscriptionState = subscriptionMap[ev.id] || 'idle';
            const isSubscribed =
              subState === 'subscribed_alert' || subState === 'priority_push_queued';
            const isPriority = subState === 'priority_push_queued';
            const isFavorited = wishlistIds.includes(ev.id);
            const isScheduled = scheduledEventIds.includes(ev.id);
            const isCardHovered = hoveredEventId === ev.id;
            const isStreamlineFocused = streamlineFocusedEventId === ev.id;
            const activeRipplesForCard = cardRipples.filter((r) => r.eventId === ev.id);

            return (
              <div
                key={ev.id}
                id={`event-card-anchor-${ev.id}`}
                data-streamline-focused={isStreamlineFocused ? 'true' : 'false'}
                className="h-full"
              >
                <BolCard
                  as="article"
                  delay={idx * 0.06}
                  data-testid={`event-card-${ev.id}`}
                  onMouseEnter={() => setHoveredEventId(ev.id)}
                  onMouseLeave={() =>
                    setHoveredEventId((prev) => (prev === ev.id ? null : prev))
                  }
                  className={`group relative h-full flex flex-col justify-between overflow-hidden rounded-[12px] transition-all ${
                    isStreamlineFocused
                      ? 'border-[#D8B98A] ring-1 ring-[#D8B98A]/60 shadow-[0_0_36px_rgba(216,185,138,0.22)]'
                      : isSubscribed || isFavorited || isScheduled
                      ? 'border-[#D8B98A]/80'
                      : ''
                  }`}
                >
                  {/* Hover Shimmer Effect Layer (微光掠过动效) */}
                  <motion.div
                    aria-hidden="true"
                    data-testid={`event-card-shimmer-${ev.id}`}
                    data-shimmer-active={isCardHovered ? 'true' : 'false'}
                    initial={{ x: '-120%', opacity: 0 }}
                    animate={
                      !prefersReducedMotion && isCardHovered
                        ? {
                            x: ['-120%', '120%'],
                            opacity: [0, 0.95, 0],
                          }
                        : { x: '-120%', opacity: 0 }
                    }
                    transition={{
                      duration: 0.92,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="bol-shimmer-sweep pointer-events-none absolute inset-0 z-20"
                  />

                  {/* Lightweight Golden Ripple Feedback on Favorite / Subscribe / Schedule Click */}
                  <AnimatePresence>
                    {activeRipplesForCard.map((ripple) => (
                      <motion.span
                        key={ripple.id}
                        aria-hidden="true"
                        data-testid={`gold-ripple-${ev.id}`}
                        initial={{ scale: 0, opacity: 0.72 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.64,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{
                          left: ripple.x,
                          top: ripple.y,
                          width: ripple.size,
                          height: ripple.size,
                        }}
                        className="bol-gold-ripple-burst pointer-events-none absolute rounded-full z-20"
                      />
                    ))}
                  </AnimatePresence>

                  <div data-event-card={ev.id} className="relative z-10">
                    <EventSceneArt
                      mood={ev.visualMood}
                      atmosphereNote={ev.atmosphereNote}
                      code={ev.code}
                    />

                    {/* Amplified Negative Space & Editorial Ritual Content Area */}
                    <div className="p-8 sm:p-10 lg:p-12 space-y-7">
                      {/* Quiet Unboxed Metadata Line + Right-side Action Shortcuts */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A09A] tracking-wide">
                          <span className="text-[#D8B98A] font-medium">
                            {ev.seriesLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#F2EFE9]">{ev.city}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{ev.date}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums text-[#D8B98A]">
                            余 {ev.remainingSeats}/{ev.capacity} 席
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Favorite Button with Golden Ripple Feedback ("收藏") */}
                          <HapticButton
                            type="button"
                            rippleTone="champagne"
                            data-testid={`favorite-event-${ev.id}`}
                            aria-pressed={isFavorited}
                            aria-label={
                              isFavorited ? `取消收藏 ${ev.title}` : `收藏 ${ev.title}`
                            }
                            onClick={(e) => handleToggleFavorite(ev.id, e)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isFavorited
                                ? 'bg-[#D8B98A]/20 text-[#D8B98A] border border-[#D8B98A]'
                                : 'bg-[#0B0B0C] text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                            }`}
                          >
                            <Bookmark
                              className={`w-3 h-3 ${
                                isFavorited ? 'fill-[#D8B98A] text-[#D8B98A]' : ''
                              }`}
                            />
                            <span>{isFavorited ? '已收藏' : '收藏'}</span>
                          </HapticButton>

                           {/* Re-open Expectation Micro-Popover button when already favorited */}
                          {isFavorited && wishlistSummary.expectationsByEventId[ev.id] && (
                            <button
                              type="button"
                              data-testid={`open-expectation-popover-${ev.id}`}
                              onClick={() =>
                                setActiveExpectationEventId((prev) =>
                                  prev === ev.id ? null : ev.id
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#D8B98A] bg-[#5A1A1E]/45 hover:bg-[#5A1A1E]/75 border border-[#D8B98A]/45 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <span>
                                维度：{wishlistSummary.expectationsByEventId[ev.id].dimensionLabel}
                              </span>
                            </button>
                          )}

                          <HapticButton
                            type="button"
                            rippleTone={isPriority ? 'dark' : 'champagne'}
                            data-testid={`subscribe-invite-${ev.id}`}
                            aria-pressed={isSubscribed}
                            onClick={(e) =>
                              handleDispatchSubscription(ev.id, 'TOGGLE_SUBSCRIBE', e)
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isPriority
                                ? 'bg-[#BF8943] text-[#0B0B0C]'
                                : isSubscribed
                                ? 'bg-[#D8B98A]/20 text-[#D8B98A] border border-[#D8B98A]'
                                : 'bg-[#0B0B0C] text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                            }`}
                          >
                            {isSubscribed ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>{isPriority ? '高优推送中' : '已关注邀约'}</span>
                              </>
                            ) : (
                              <>
                                <Bell className="w-3 h-3" />
                                <span>关注邀约</span>
                              </>
                            )}
                          </HapticButton>

                          {/* Right-side "加入日程" Shortcut with LocalStorage Sync & Bespoke Slip Preview */}
                          <HapticButton
                            type="button"
                            rippleTone="champagne"
                            data-testid={`add-to-schedule-${ev.id}`}
                            aria-pressed={isScheduled}
                            aria-label={`加入日程并预览 ${ev.title} 活动预约单`}
                            onClick={(e) => handleAddToScheduleAndOpenSlip(ev, e)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              isScheduled
                                ? 'bg-[#D8B98A] text-[#0B0B0C] border border-[#D8B98A]'
                                : 'bg-[#0B0B0C] text-[#D8B98A] hover:bg-[#D8B98A]/15 border border-[#D8B98A]/60'
                            }`}
                          >
                            {isScheduled ? (
                              <>
                                <CalendarCheck2 className="w-3 h-3" />
                                <span>预约单</span>
                              </>
                            ) : (
                              <>
                                <CalendarPlus className="w-3 h-3" />
                                <span>加入日程</span>
                              </>
                            )}
                          </HapticButton>
                        </div>
                      </div>

                      {/* Micro-Interaction Popover on Favoriting Event ("点击收藏活动后弹出微型交互层，滑动选择预期维度") */}
                      <AnimatePresence>
                        {isFavorited &&
                          activeExpectationEventId === ev.id &&
                          wishlistSummary.expectationsByEventId[ev.id] && (
                            <WishlistExpectationMicroPopover
                              event={ev}
                              expectation={wishlistSummary.expectationsByEventId[ev.id]}
                              onChangeSliderValue={(eventId, nextVal) =>
                                handleExpectationSliderChange(eventId, nextVal)
                              }
                              onConfirmAndOpenSidebar={() => {
                                setActiveExpectationEventId(null);
                                setIsWishlistSidebarOpen(true);
                              }}
                              onClosePopover={() => setActiveExpectationEventId(null)}
                            />
                          )}
                      </AnimatePresence>

                      {/* Ritualistic Editorial Title & Venue Space */}
                      <div className="space-y-2.5">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#D8B98A]/80">
                          {ev.englishSubtitle}
                        </p>
                        <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#F2EFE9] leading-[1.24] tracking-tight">
                          {ev.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#A3A09A] pt-0.5">
                          {ev.venue} · {ev.timeRange} · 着装建议：{ev.dressCode}
                        </p>
                      </div>

                      {/* Breathing Editorial Narrative & Host Signature */}
                      <div className="space-y-4 pt-6 border-t border-[#2A2A2E]/80 text-sm">
                        <p className="text-[#F2EFE9]/90 leading-[1.8]">
                          {ev.formula.whatIsIt} {ev.formula.whoIsItFor}
                        </p>
                        <p className="text-xs sm:text-sm text-[#A3A09A] leading-[1.75]">
                          <span className="text-[#D8B98A] font-medium">赴约仪式感：</span>
                          {ev.formula.whyAttend}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-xs text-[#A3A09A]">
                          <span>
                            本场主理：{ev.hostName}（{ev.hostRole}）
                          </span>
                          <span className="text-[#D8B98A]">{ev.curatedTopics[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacious Card Footer: Member Gold Price & Ritual Actions */}
                  <div className="relative z-10 px-8 sm:px-10 lg:px-12 py-6 bg-[#0B0B0C]/65 border-t border-[#2A2A2E] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-[#A3A09A] block mb-0.5">
                        会籍优享 / 标准席位
                      </span>
                      <div className="flex items-baseline gap-2.5">
                        <span className="tabular-nums text-xl font-semibold text-[#BF8943]">
                          ¥{ev.memberPrice}
                        </span>
                        <span className="tabular-nums text-xs text-[#A3A09A] line-through">
                          ¥{ev.standardPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <HapticButton
                        type="button"
                        rippleTone="champagne"
                        onClick={() => onInspectEvent(ev)}
                        className="px-4 py-2.5 text-xs font-medium text-[#F2EFE9] bg-[#151517] hover:border-[#D8B98A] border border-[#2A2A2E] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        查阅席位与语境
                      </HapticButton>
                      <HapticButton
                        type="button"
                        onClick={() => onReserveEvent(ev)}
                        aria-label={`预约 ${ev.title}`}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>赴约</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </HapticButton>
                    </div>
                  </div>
                </BolCard>
              </div>
            );
          })}
        </div>
      )}

      {/* Right-Hand Temporary Personal Wishlist Sidebar ("页面右侧侧边栏展示心愿单") */}
      <PersonalWishlistSidebar
        summary={wishlistSummary}
        isOpen={isWishlistSidebarOpen}
        onToggleOpen={() => setIsWishlistSidebarOpen((prev) => !prev)}
        onRemoveEvent={handleRemoveFromWishlist}
        onClearAll={handleClearWishlist}
        onInspectEvent={onInspectEvent}
        onReserveEvent={onReserveEvent}
        onOpenExpectationPopover={handleOpenExpectationFromSidebar}
      />

      {/* Minimalist BoL Bespoke Editorial "活动预约单" Preview Modal */}
      <EventReservationSlipModal
        activeEvent={activeSlipEvent}
        scheduledEvents={scheduledEventsList}
        onSelectScheduledEvent={(ev) => setActiveSlipEvent(ev)}
        onRemoveFromSchedule={handleRemoveFromSchedule}
        onClose={() => setActiveSlipEvent(null)}
        onProceedToReserve={(ev) => {
          setActiveSlipEvent(null);
          onReserveEvent(ev);
        }}
      />
    </section>
  );
};
