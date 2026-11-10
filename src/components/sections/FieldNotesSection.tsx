import React from 'react';
import { FIELD_NOTES_ARCHIVE } from '../../content';
import { BolCard } from '../visuals/BolCard';

export const FieldNotesSection: React.FC = () => {
  return (
    <section
      id="field-notes"
      className="bol-snap-section py-16 lg:py-24 px-6 lg:px-12 max-w-[1360px] mx-auto border-t border-[#2A2A2E]"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs text-[#D8B98A] tracking-widest mb-2">
            05. FIELD NOTES & PROOF · 现场余韵与真实连接证据
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#F2EFE9]">
            散场之后仍然持续生长的关系
          </h2>
        </div>
        <p className="text-sm text-[#A3A09A] max-w-md leading-relaxed">
          我们尊重每一位到场嘉宾的隐私边界，不把未授权合照作为宣传噱头，而是记录每一次聚会真实发生的跨界合作与同频回响。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {FIELD_NOTES_ARCHIVE.map((note, idx) => (
          <BolCard
            as="article"
            key={note.id}
            delay={idx * 0.06}
            className="p-6 sm:p-7 rounded-[8px] bg-[#151517] border border-[#2A2A2E] flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              {/* Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#A3A09A]">
                <span className="tabular-nums text-[#D8B98A]">ARCHIVE 0{idx + 1}</span>
                <span aria-hidden="true">·</span>
                <span>{note.seriesLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{note.cityAndDate}</span>
              </div>

              <h3 className="font-editorial text-2xl font-medium text-[#F2EFE9] leading-snug">
                {note.gatheringTitle}
              </h3>

              <p className="text-xs text-[#A3A09A] leading-relaxed pb-3 border-b border-[#2A2A2E]">
                嘉宾构成：{note.participantComposition}
              </p>

              <blockquote className="text-sm text-[#F2EFE9]/95 leading-relaxed">
                “{note.reflectionQuote}”
              </blockquote>
            </div>

            <div className="pt-4 border-t border-[#2A2A2E] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-[#F2EFE9]">{note.memberName}</p>
                  <p className="text-[#A3A09A]">{note.memberRole}</p>
                </div>
                <span className="text-[11px] text-[#D8B98A] text-right">
                  {note.memberBackground}
                </span>
              </div>

              <div className="p-3 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] text-xs">
                <span className="text-[#D8B98A] font-medium">后续连接追踪：</span>
                <span className="text-[#F2EFE9]">{note.outcomeMetric}</span>
              </div>
            </div>
          </BolCard>
        ))}
      </div>
    </section>
  );
};
