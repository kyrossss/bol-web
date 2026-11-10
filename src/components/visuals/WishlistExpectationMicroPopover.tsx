import React from 'react';
import { motion } from 'motion/react';
import { Check, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { WISHLIST_GROWTH_DIMENSION_STOPS } from '../../lib/curationEngine';
import { BolEvent, WishlistExpectationEntry } from '../../types/bol';

interface WishlistExpectationMicroPopoverProps {
  event: BolEvent;
  expectation: WishlistExpectationEntry;
  onChangeSliderValue: (eventId: string, nextValue: number) => void;
  onConfirmAndOpenSidebar: (eventId: string) => void;
  onClosePopover: () => void;
}

export const WishlistExpectationMicroPopover: React.FC<
  WishlistExpectationMicroPopoverProps
> = ({
  event,
  expectation,
  onChangeSliderValue,
  onConfirmAndOpenSidebar,
  onClosePopover,
}) => {
  return (
    <motion.div
      role="dialog"
      aria-label={`设定 ${event.title} 的个人成长预期维度`}
      data-testid={`wishlist-expectation-popover-${event.id}`}
      data-dimension={expectation.dimensionId}
      data-dimension-label={expectation.dimensionLabel}
      data-slider-value={expectation.sliderValue}
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mt-4 p-4 sm:p-5 rounded-[10px] bg-[#151517] border border-[#D8B98A]/70 shadow-[0_18px_48px_rgba(0,0,0,0.82)] space-y-3.5 relative z-30"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#2A2A2E] pb-2.5">
        <div className="flex items-center gap-1.5 text-xs text-[#D8B98A] font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
          <span>GROWTH EXPECTATION · 滑动选择本场个人成长预期维度</span>
        </div>
        <button
          type="button"
          aria-label="关闭预期维度微型交互层"
          data-testid={`close-expectation-popover-${event.id}`}
          onClick={onClosePopover}
          className="p-1 text-[#A3A09A] hover:text-[#F2EFE9] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Dimension Quick Stops + Active Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="grid grid-cols-3 gap-1.5 flex-1">
          {WISHLIST_GROWTH_DIMENSION_STOPS.map((stop) => {
            const isSelected = expectation.dimensionId === stop.dimensionId;
            return (
              <button
                key={stop.dimensionId}
                type="button"
                data-testid={`expectation-stop-${event.id}-${stop.dimensionId}`}
                onClick={() => onChangeSliderValue(event.id, stop.defaultSliderValue)}
                className={`px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-[#D8B98A] text-[#0B0B0C] font-semibold shadow-[0_0_12px_rgba(216,185,138,0.35)]'
                    : 'bg-[#0B0B0C] text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                }`}
              >
                {stop.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continuous Tactile Range Slider (0 - 100) */}
      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center justify-between text-[11px] text-[#A3A09A]">
          <label
            htmlFor={`expectation-range-${event.id}`}
            className="flex items-center gap-1.5 text-[#F2EFE9]"
          >
            <span>当前滑动锁定：</span>
            <strong
              data-testid={`expectation-active-label-${event.id}`}
              className="text-[#D8B98A]"
            >
              {expectation.dimensionLabel}
            </strong>
          </label>
          <span
            data-testid={`expectation-intensity-${event.id}`}
            className="tabular-nums text-[#D8B98A]"
          >
            预期聚焦度 {expectation.intensityPct}%（刻度 {expectation.sliderValue}/100）
          </span>
        </div>

        <input
          id={`expectation-range-${event.id}`}
          data-testid={`expectation-slider-${event.id}`}
          aria-label={`滑动调节 ${event.title} 的个人成长预期维度`}
          type="range"
          min={0}
          max={100}
          step={1}
          value={expectation.sliderValue}
          onChange={(e) => onChangeSliderValue(event.id, Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none bg-[#0B0B0C] border border-[#2A2A2E] accent-[#D8B98A] cursor-pointer"
        />

        <div className="flex items-center justify-between text-[10px] text-[#A3A09A] font-mono">
          <span>0 · 寻求合作 (0–33)</span>
          <span>50 · 扩充人脉 (34–66)</span>
          <span>100 · 生活美学 (67–100)</span>
        </div>
      </div>

      {/* Live Preview of Personalized Tip Synced to Wishlist Sidebar */}
      <div className="p-3 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] text-[#D8B98A]">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>已同步至右侧心愿单的个性化提示预览：</span>
        </div>
        <p
          data-testid={`expectation-preview-tip-${event.id}`}
          className="text-xs text-[#F2EFE9]/90 leading-relaxed"
        >
          {expectation.personalizedTip}
        </p>
      </div>

      {/* Footer Confirm Action */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-[11px] text-[#A3A09A] truncate">
          {expectation.actionPreparationNote}
        </span>
        <button
          type="button"
          data-testid={`confirm-expectation-${event.id}`}
          onClick={() => onConfirmAndOpenSidebar(event.id)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>确认并查看心愿单提示</span>
        </button>
      </div>
    </motion.div>
  );
};
