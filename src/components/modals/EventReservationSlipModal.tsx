import React from 'react';
import { X, CalendarCheck2, ArrowUpRight, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { buildEventReservationSlip } from '../../lib/curationEngine';
import { BolEvent } from '../../types/bol';
import { BolLogoMark } from '../visuals/BolLogo';
import { HapticButton } from '../visuals/HapticButton';

interface EventReservationSlipModalProps {
  activeEvent: BolEvent | null;
  scheduledEvents: BolEvent[];
  onSelectScheduledEvent: (event: BolEvent) => void;
  onRemoveFromSchedule: (eventId: string) => void;
  onClose: () => void;
  onProceedToReserve: (event: BolEvent) => void;
}

export const EventReservationSlipModal: React.FC<EventReservationSlipModalProps> = ({
  activeEvent,
  scheduledEvents,
  onSelectScheduledEvent,
  onRemoveFromSchedule,
  onClose,
  onProceedToReserve,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (!activeEvent) return null;

  const orderIndex =
    scheduledEvents.findIndex((ev) => ev.id === activeEvent.id) + 1 || 1;
  const slip = buildEventReservationSlip(activeEvent, orderIndex);

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bol-reservation-slip-title"
        data-testid="event-reservation-slip-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={
            prefersReducedMotion
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 16, scale: 0.98 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-[10px] bg-[#151517] border border-[#D8B98A]/65 shadow-[0_28px_80px_rgba(0,0,0,0.85)] overflow-hidden text-[#F2EFE9]"
        >
          {/* Top Champagne-Gold Hairline Bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[#5A1A1E] via-[#D8B98A] to-[#BF8943]" />

          {/* Slip Header Bar */}
          <div className="px-6 py-4 bg-[#0B0B0C] border-b border-[#2A2A2E] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <BolLogoMark size={26} tone="champagne" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#D8B98A]">
                  <span className="font-medium tracking-wider">
                    BOL BESPOKE RESERVATION SLIP · 专属活动预约单
                  </span>
                  <span aria-hidden="true" className="text-[#A3A09A]">
                    ·
                  </span>
                  <span
                    data-testid="reservation-slip-sync-badge"
                    className="inline-flex items-center gap-1 text-[#F2EFE9]"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#D8B98A]" />
                    <span>已同步本地日程（共 {scheduledEvents.length} 场）</span>
                  </span>
                </div>
                <p
                  data-testid="reservation-slip-no"
                  className="tabular-nums text-xs text-[#A3A09A] mt-0.5"
                >
                  预约单编号：{slip.slipNo}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="关闭活动预约单预览"
              data-testid="close-reservation-slip-btn"
              onClick={onClose}
              className="p-2 rounded-full text-[#A3A09A] hover:text-[#F2EFE9] hover:bg-[#151517] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Multi-Event Schedule Switcher (if multiple events in localStorage) */}
          {scheduledEvents.length > 1 && (
            <div className="px-6 py-2.5 bg-[#0B0B0C]/60 border-b border-[#2A2A2E] flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] text-[#A3A09A] whitespace-nowrap shrink-0">
                日程切换：
              </span>
              {scheduledEvents.map((item, idx) => {
                const isCurrent = item.id === activeEvent.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-testid={`slip-switch-${item.id}`}
                    onClick={() => onSelectScheduledEvent(item)}
                    className={`px-2.5 py-1 rounded-[5px] text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#D8B98A] text-[#0B0B0C] font-medium'
                        : 'bg-[#151517] text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                    }`}
                  >
                    0{idx + 1} · {item.city} · {item.code.replace('BOL-', '')}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Bespoke Editorial Slip Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Event Title & Quiet Unboxed Metadata */}
            <div className="space-y-2 pb-5 border-b border-dashed border-[#2A2A2E]">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A09A]">
                <span className="text-[#D8B98A] font-medium">{slip.seriesLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#F2EFE9] font-medium">{slip.city}站</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums text-[#F2EFE9]">{slip.date}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{slip.timeRange}</span>
              </div>

              <h3
                id="bol-reservation-slip-title"
                data-testid="reservation-slip-event-title"
                className="font-editorial text-2xl sm:text-3xl font-medium text-[#F2EFE9] leading-snug"
              >
                {slip.title}
              </h3>

              <p className="font-editorial text-sm text-[#D8B98A]/90 tracking-wide">
                {slip.englishSubtitle}
              </p>
            </div>

            {/* 2x2 Architectural Slip Coordinates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-1">
                <span className="text-[11px] text-[#A3A09A] block">
                  VENUE · 线下赴约场域
                </span>
                <p className="text-xs sm:text-sm font-medium text-[#F2EFE9]">
                  {slip.venue}
                </p>
              </div>

              <div className="p-3.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-1">
                <span className="text-[11px] text-[#A3A09A] block">
                  DRESS CODE · 场域着装建议
                </span>
                <p className="text-xs sm:text-sm font-medium text-[#D8B98A]">
                  {slip.dressCode}
                </p>
              </div>

              <div className="p-3.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-1">
                <span className="text-[11px] text-[#A3A09A] block">
                  HOST CURATOR · 当期主理人署名
                </span>
                <p className="text-xs sm:text-sm font-medium text-[#F2EFE9]">
                  {slip.hostSignature}
                </p>
              </div>

              <div className="p-3.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-1">
                <span className="text-[11px] text-[#A3A09A] block">
                  SEAT BOUNDARY · 席位配额状态
                </span>
                <p className="tabular-nums text-xs sm:text-sm font-medium text-[#BF8943]">
                  {slip.seatQuotaNote}
                </p>
              </div>
            </div>

            {/* Curated Topics & Check-in Protocol */}
            <div className="p-4 rounded-[6px] bg-[#0B0B0C]/80 border border-[#2A2A2E] space-y-2.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="text-[#D8B98A] font-medium">当期破冰议题：</span>
                {slip.curatedTopics.map((topic, idx) => (
                  <React.Fragment key={topic}>
                    {idx > 0 && (
                      <span aria-hidden="true" className="text-[#A3A09A]">
                        /
                      </span>
                    )}
                    <span className="text-[#F2EFE9]">{topic}</span>
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[11px] text-[#A3A09A] pt-2 border-t border-[#2A2A2E] leading-relaxed">
                {slip.checkInProtocol}
              </p>
            </div>
          </div>

          {/* Slip Footer: Pricing & Primary Ritual Actions */}
          <div className="px-6 py-4 bg-[#0B0B0C] border-t border-[#2A2A2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[11px] text-[#A3A09A] block">
                  会籍优享票 / 标准单场票
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="tabular-nums text-xl font-semibold text-[#BF8943]">
                    ¥{slip.memberPrice}
                  </span>
                  <span className="tabular-nums text-xs text-[#A3A09A] line-through">
                    ¥{slip.standardPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                data-testid="remove-from-schedule-btn"
                onClick={() => onRemoveFromSchedule(activeEvent.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs text-[#A3A09A] hover:text-[#F2EFE9] bg-[#151517] border border-[#2A2A2E] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>移出日程</span>
              </button>

              <HapticButton
                type="button"
                data-testid="confirm-slip-reserve-btn"
                onClick={() => onProceedToReserve(activeEvent)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              >
                <CalendarCheck2 className="w-3.5 h-3.5" />
                <span>确认预约并生成核验码</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </HapticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
