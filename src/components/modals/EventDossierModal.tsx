import React from 'react';
import { X, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { BolEvent } from '../../types/bol';
import { EventSceneArt } from '../visuals/EventSceneArt';

interface EventDossierModalProps {
  event: BolEvent | null;
  onClose: () => void;
  onProceedToReserve: (event: BolEvent) => void;
}

export const EventDossierModal: React.FC<EventDossierModalProps> = ({
  event,
  onClose,
  onProceedToReserve,
}) => {
  if (!event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B0B0C]/85 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-[#151517] border border-[#2A2A2E] rounded-[8px] overflow-hidden my-8">
        <EventSceneArt
          mood={event.visualMood}
          atmosphereNote={event.atmosphereNote}
          code={event.code}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="关闭活动档案弹窗"
          className="absolute top-3.5 right-4 z-20 p-2 rounded-full bg-[#0B0B0C]/85 border border-[#2A2A2E] text-[#F2EFE9] hover:border-[#D8B98A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Unboxed Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A09A] mb-2">
              <span className="text-[#D8B98A] font-medium">{event.seriesLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{event.city}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{event.date} {event.timeRange}</span>
              <span aria-hidden="true">·</span>
              <span>着装建议：{event.dressCode}</span>
            </div>

            <h2
              id="dossier-modal-title"
              className="font-editorial text-2xl sm:text-3xl font-semibold text-[#F2EFE9] mb-1"
            >
              {event.title}
            </h2>
            <p className="text-sm text-[#A3A09A]">{event.englishSubtitle}</p>
          </div>

          {/* Key Venue & Capacity Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D8B98A] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#A3A09A] mb-0.5">精选场地</p>
                <p className="text-[#F2EFE9] font-medium">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-[#D8B98A] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#A3A09A] mb-0.5">人数与交流密度控制</p>
                <p className="text-[#F2EFE9] font-medium tabular-nums">
                  限额 {event.capacity} 席 · 仅余 {event.remainingSeats} 席
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#D8B98A] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#A3A09A] mb-0.5">本期主理人</p>
                <p className="text-[#F2EFE9] font-medium">
                  {event.hostName}（{event.hostRole}）
                </p>
              </div>
            </div>
          </div>

          {/* 4-Part BoL Event Formula (VI Manual Section 5.4) */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-[#D8B98A] tracking-wider">
              活动叙事四步结构（主题 · 适合人群 · 现场流程 · 赴约价值）
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[8px] bg-[#0B0B0C]/60 border border-[#2A2A2E]">
                <p className="text-xs text-[#D8B98A] mb-1">01. 主题是什么</p>
                <p className="text-sm text-[#F2EFE9] leading-relaxed">{event.formula.whatIsIt}</p>
              </div>
              <div className="p-4 rounded-[8px] bg-[#0B0B0C]/60 border border-[#2A2A2E]">
                <p className="text-xs text-[#D8B98A] mb-1">02. 适合谁来</p>
                <p className="text-sm text-[#F2EFE9] leading-relaxed">{event.formula.whoIsItFor}</p>
              </div>
              <div className="p-4 rounded-[8px] bg-[#0B0B0C]/60 border border-[#2A2A2E]">
                <p className="text-xs text-[#D8B98A] mb-1">03. 现场会发生什么</p>
                <p className="text-sm text-[#F2EFE9] leading-relaxed">{event.formula.whatHappens}</p>
              </div>
              <div className="p-4 rounded-[8px] bg-[#0B0B0C]/60 border border-[#2A2A2E]">
                <p className="text-xs text-[#D8B98A] mb-1">04. 为什么值得赴约</p>
                <p className="text-sm text-[#F2EFE9] leading-relaxed">{event.formula.whyAttend}</p>
              </div>
            </div>
          </div>

          {/* Curated Topics */}
          <div className="pt-2 border-t border-[#2A2A2E]">
            <p className="text-xs text-[#A3A09A] mb-2">本期核心交流命题：</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#F2EFE9]">
              {event.curatedTopics.map((topic, idx) => (
                <React.Fragment key={topic}>
                  <span>{topic}</span>
                  {idx < event.curatedTopics.length - 1 && (
                    <span className="text-[#A3A09A]" aria-hidden="true">
                      /
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bottom Pricing & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#2A2A2E]">
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-xs text-[#A3A09A] mr-1.5">会籍优享价</span>
                <span className="tabular-nums text-2xl font-semibold text-[#BF8943]">
                  ¥{event.memberPrice}
                </span>
              </div>
              <div className="text-xs text-[#A3A09A]">
                <span>单场标准票 </span>
                <span className="tabular-nums line-through">¥{event.standardPrice}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                返回矩阵
              </button>
              <button
                type="button"
                onClick={() => onProceedToReserve(event)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>申请本场席位</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
