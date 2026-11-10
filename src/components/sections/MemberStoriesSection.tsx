import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { MEMBER_STORIES, MEMBERSHIP_TIERS } from '../../content';
import { buildMemberGrowthConstellation } from '../../lib/curationEngine';
import { MembershipTier } from '../../types/bol';
import { BolCard } from '../visuals/BolCard';
import { HapticButton } from '../visuals/HapticButton';
import { MemberGrowthConstellationGraph } from '../visuals/MemberGrowthConstellationGraph';

interface MemberStoriesSectionProps {
  onSelectTierFromStory: (tier: MembershipTier) => void;
}

export const MemberStoriesSection: React.FC<MemberStoriesSectionProps> = ({
  onSelectTierFromStory,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeOpportunityIndex, setActiveOpportunityIndex] = useState<number>(0);
  const storiesCount = MEMBER_STORIES.length;
  const currentStory = MEMBER_STORIES[activeIndex] || MEMBER_STORIES[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + storiesCount) % storiesCount);
    setActiveOpportunityIndex(0);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % storiesCount);
    setActiveOpportunityIndex(0);
  };

  const handleSelectStoryTab = (idx: number) => {
    setActiveIndex(idx);
    setActiveOpportunityIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const matchedTier =
    MEMBERSHIP_TIERS.find((t) => t.id === currentStory.currentTierId) ||
    MEMBERSHIP_TIERS[2];

  const constellationData = buildMemberGrowthConstellation(
    currentStory.id,
    activeOpportunityIndex
  );

  return (
    <section
      id="member-stories"
      data-testid="member-stories-section"
      onKeyDown={handleKeyDown}
      aria-label="成员旅程（Member Stories）"
      className="bol-snap-section py-16 lg:py-24 px-6 lg:px-12 max-w-[1360px] mx-auto border-t border-[#2A2A2E]"
    >
      {/* Section Header & Carousel Navigation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs text-[#D8B98A] tracking-widest mb-2">
            04B. MEMBER STORIES & JOURNEYS · 成员旅程与深度连接案例
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#F2EFE9]">
            从一场微醺相识，到跨行业长期共创的真实轨迹
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span
            data-testid="member-story-counter"
            className="tabular-nums text-xs text-[#A3A09A] mr-2"
          >
            0{activeIndex + 1} / 0{storiesCount}
          </span>
          <HapticButton
            type="button"
            rippleTone="champagne"
            data-testid="member-story-prev"
            aria-label="上一位成员旅程"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-[#151517] border border-[#2A2A2E] hover:border-[#D8B98A] text-[#F2EFE9] inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </HapticButton>
          <HapticButton
            type="button"
            rippleTone="champagne"
            data-testid="member-story-next"
            aria-label="下一位成员旅程"
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-[#151517] border border-[#2A2A2E] hover:border-[#D8B98A] text-[#F2EFE9] inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </HapticButton>
        </div>
      </div>

      {/* Industry Selector Tabs for Carousel */}
      <div
        role="tablist"
        aria-label="按行业切换成员旅程"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
      >
        {MEMBER_STORIES.map((story, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={story.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              data-testid={`member-story-tab-${idx}`}
              onClick={() => handleSelectStoryTab(idx)}
              className={`text-left p-4 rounded-[8px] border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-[#151517] border-[#D8B98A]'
                  : 'bg-[#151517]/50 border-[#2A2A2E] hover:border-[#D8B98A]/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#D8B98A] font-medium truncate">
                  {story.industryLabel}
                </span>
                <span className="tabular-nums text-[11px] text-[#A3A09A]">
                  0{idx + 1}
                </span>
              </div>
              <p className="font-editorial text-lg font-medium text-[#F2EFE9] truncate">
                {story.memberName}
              </p>
              <p className="text-[11px] text-[#A3A09A] truncate">
                {story.tierProgression}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Carousel Stage */}
      <BolCard
        key={currentStory.id}
        data-testid="active-member-story-card"
        className="p-6 sm:p-10 rounded-[8px] bg-[#151517] border border-[#2A2A2E] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch transition-opacity duration-300"
      >
        {/* Left Column: Member Dossier, Quote & Narrative (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A09A]">
              <span className="text-[#D8B98A] font-medium">
                {currentStory.industryLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#F2EFE9]">{currentStory.almaMaterAndCity}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#BF8943] font-medium">
                {currentStory.tierProgression}
              </span>
            </div>

            <div>
              <h3
                data-testid="active-story-member-name"
                className="font-editorial text-3xl sm:text-4xl font-medium text-[#F2EFE9] mb-1"
              >
                {currentStory.memberName}
              </h3>
              <p className="text-sm text-[#A3A09A]">{currentStory.roleTitle}</p>
            </div>

            {/* Editorial Pull Quote */}
            <blockquote className="p-5 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-2">
              <Quote className="w-5 h-5 text-[#D8B98A]/70" />
              <p className="font-editorial text-xl sm:text-2xl text-[#F2EFE9] leading-relaxed">
                {currentStory.headlineQuote}
              </p>
            </blockquote>

            {/* Story Narrative */}
            <p className="text-sm text-[#F2EFE9]/90 leading-relaxed">
              {currentStory.storyNarrative}
            </p>
          </div>

          {/* Bottom Metrics & Peer Connections */}
          <div className="pt-6 border-t border-[#2A2A2E] space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {currentStory.keyMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="p-3.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E]"
                >
                  <span className="text-[11px] text-[#A3A09A] block mb-0.5">
                    {metric.label}
                  </span>
                  <span className="tabular-nums text-lg sm:text-xl font-semibold text-[#D8B98A]">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-xs text-[#A3A09A]">
                <span>已深度连接同频角色：</span>
                <span className="text-[#F2EFE9]">
                  {currentStory.connectedPeers.join(' / ')}
                </span>
              </div>

              <HapticButton
                type="button"
                onClick={() => onSelectTierFromStory(matchedTier)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>申请同款「{matchedTier.name}」</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </HapticButton>
            </div>
          </div>
        </div>

        {/* Right Column: 3-Stage Member Growth Journey Timeline (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-[#2A2A2E] pb-3 mb-5">
              <span className="text-xs text-[#D8B98A] tracking-wider">
                MEMBER GROWTH TIMELINE · 三阶连接演进轨迹
              </span>
              <span className="tabular-nums text-xs text-[#A3A09A]">
                VERIFIED JOURNEY
              </span>
            </div>

            <div className="space-y-5 relative before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-px before:bg-[#2A2A2E]">
              {currentStory.milestones.map((ms, idx) => (
                <div key={ms.phase} className="relative pl-8">
                  <span
                    className={`absolute left-0 top-1.5 w-6 h-6 rounded-full text-[11px] tabular-nums font-medium flex items-center justify-center border ${
                      idx === 2
                        ? 'bg-[#D8B98A] text-[#0B0B0C] border-[#D8B98A]'
                        : 'bg-[#151517] text-[#D8B98A] border-[#D8B98A]/60'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div className="p-4 rounded-[6px] bg-[#151517] border border-[#2A2A2E] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#D8B98A] font-medium">{ms.phase}</span>
                      <span className="tabular-nums text-[#A3A09A]">{ms.timepoint}</span>
                    </div>
                    <h4 className="font-editorial text-lg font-medium text-[#F2EFE9]">
                      {ms.sceneTitle}
                    </h4>
                    <p className="text-xs text-[#A3A09A] leading-relaxed">
                      {ms.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-[6px] bg-[#151517] border border-[#2A2A2E] text-xs text-[#A3A09A] flex items-center justify-between">
            <span>会籍成长阶梯支持次卡折抵与跨城权益互通</span>
            <span className="text-[#D8B98A] tabular-nums">深 / 穗 / 港 / 沪</span>
          </div>
        </div>
      </BolCard>

      {/* Dynamic Member Growth Path & Cross-Industry Collision Opportunity Constellation Graph */}
      <MemberGrowthConstellationGraph
        constellation={constellationData}
        onSelectOpportunity={(idx) => setActiveOpportunityIndex(idx)}
      />
    </section>
  );
};

