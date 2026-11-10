import React from 'react';
import {
  ArrowUpRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BolEvent, PersonalWishlistSummary } from '../../types/bol';
import { HapticButton } from './HapticButton';

interface PersonalWishlistSidebarProps {
  summary: PersonalWishlistSummary;
  isOpen: boolean;
  onToggleOpen: () => void;
  onRemoveEvent: (eventId: string) => void;
  onClearAll: () => void;
  onInspectEvent: (event: BolEvent) => void;
  onReserveEvent: (event: BolEvent) => void;
  onOpenExpectationPopover?: (eventId: string) => void;
}

export const PersonalWishlistSidebar: React.FC<PersonalWishlistSidebarProps> = ({
  summary,
  isOpen,
  onToggleOpen,
  onRemoveEvent,
  onClearAll,
  onInspectEvent,
  onReserveEvent,
  onOpenExpectationPopover,
}) => {
  return (
    <aside
      aria-label="临时个人心愿单右侧侧边栏"
      data-testid="personal-wishlist-sidebar"
      data-open={isOpen ? 'true' : 'false'}
      data-wishlist-count={summary.totalCount}
      className="fixed right-0 top-24 z-30 flex items-start pointer-events-none"
    >
      {/* Persistent Right-Edge Docked Tab Trigger */}
      <button
        type="button"
        aria-label={isOpen ? '收起个人心愿单侧边栏' : '展开个人心愿单侧边栏'}
        data-testid="wishlist-sidebar-toggle-btn"
        onClick={onToggleOpen}
        className="pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 rounded-l-full border border-r-0 border-[#D8B98A]/60 bg-[#151517]/95 text-[#F2EFE9] hover:bg-[#1E1A18] transition-all shadow-[0_12px_32px_rgba(0,0,0,0.75)] backdrop-blur-md cursor-pointer"
      >
        {isOpen ? (
          <ChevronRight className="w-3.5 h-3.5 text-[#D8B98A]" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-[#D8B98A]" />
        )}
        <Bookmark className="w-3.5 h-3.5 text-[#D8B98A] fill-[#D8B98A]" />
        <span className="text-xs font-medium whitespace-nowrap">个人心愿单</span>
        <span
          data-testid="wishlist-count-badge"
          className="tabular-nums px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#D8B98A] text-[#0B0B0C]"
        >
          {summary.totalCount}
        </span>
      </button>

      {/* Expandable Right-Hand Sidebar Drawer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            data-testid="wishlist-sidebar-panel"
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-[316px] sm:w-[368px] max-h-[calc(100vh-7.5rem)] rounded-bl-[12px] border border-r-0 border-[#D8B98A]/55 bg-[#151517]/98 text-[#F2EFE9] shadow-[-18px_24px_64px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Top Champagne Accent Line */}
            <div
              aria-hidden="true"
              className="h-1 w-full bg-gradient-to-r from-[#5A1A1E] via-[#D8B98A] to-[#BF8943]"
            />

            {/* Sidebar Header */}
            <div className="p-4 sm:p-5 border-b border-[#2A2A2E] flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#D8B98A] tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>PERSONAL WISHLIST · 临时心愿单与成长提示</span>
                </div>
                <h3 className="font-editorial text-lg font-medium text-[#F2EFE9] mt-0.5">
                  我的心仪聚会收藏夹（{summary.totalCount}）
                </h3>
              </div>

              <button
                type="button"
                aria-label="关闭心愿单侧边栏"
                data-testid="wishlist-sidebar-close-btn"
                onClick={onToggleOpen}
                className="p-1.5 rounded-full bg-[#0B0B0C] border border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9] hover:border-[#D8B98A] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Wishlist Items Scrollable List */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
              {summary.items.length === 0 ? (
                <div
                  data-testid="wishlist-empty-state"
                  className="py-8 px-4 text-center rounded-[8px] bg-[#0B0B0C]/70 border border-dashed border-[#2A2A2E] space-y-2"
                >
                  <Bookmark className="w-5 h-5 text-[#D8B98A]/60 mx-auto" />
                  <p className="text-xs font-medium text-[#F2EFE9]">
                    心愿单暂未收录活动
                  </p>
                  <p className="text-[11px] text-[#A3A09A] leading-relaxed">
                    在左侧活动矩阵中点击任意卡片的「收藏」按钮，滑动选择您的个人成长预期维度，即可获取专属赴约提示。
                  </p>
                </div>
              ) : (
                summary.items.map((ev) => {
                  const exp = summary.expectationsByEventId[ev.id];
                  return (
                    <div
                      key={ev.id}
                      data-testid={`wishlist-item-${ev.id}`}
                      data-expectation-dimension={exp?.dimensionId ?? 'expanding-network'}
                      className="p-3.5 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] hover:border-[#D8B98A]/60 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#D8B98A]">
                            <span>{ev.city}</span>
                            <span aria-hidden="true">·</span>
                            <span>{ev.seriesLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums text-[#A3A09A]">{ev.date}</span>
                          </div>
                          <h4 className="font-editorial text-sm sm:text-base font-medium text-[#F2EFE9] leading-snug mt-0.5 truncate">
                            {ev.title}
                          </h4>
                        </div>

                        <button
                          type="button"
                          aria-label={`从心愿单移除 ${ev.title}`}
                          data-testid={`wishlist-remove-${ev.id}`}
                          onClick={() => onRemoveEvent(ev.id)}
                          className="p-1 text-[#A3A09A] hover:text-[#C86D74] transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Personalized Growth Expectation Mini-Tip Box */}
                      {exp && (
                        <div
                          data-testid={`wishlist-item-tip-box-${ev.id}`}
                          className="p-2.5 rounded-[6px] bg-[#151517] border border-[#D8B98A]/35 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-[#D8B98A] font-medium">
                              预期维度：
                              <strong data-testid={`wishlist-item-dimension-${ev.id}`}>
                                {exp.dimensionLabel}
                              </strong>
                              <span className="tabular-nums text-[#A3A09A] ml-1">
                                ({exp.intensityPct}%)
                              </span>
                            </span>

                            {onOpenExpectationPopover && (
                              <button
                                type="button"
                                data-testid={`wishlist-adjust-expectation-${ev.id}`}
                                onClick={() => onOpenExpectationPopover(ev.id)}
                                className="inline-flex items-center gap-1 text-[10px] text-[#A3A09A] hover:text-[#D8B98A] transition-colors cursor-pointer"
                              >
                                <SlidersHorizontal className="w-2.5 h-2.5" />
                                <span>重调维度</span>
                              </button>
                            )}
                          </div>

                          <p
                            data-testid={`wishlist-item-tip-${ev.id}`}
                            className="text-[11px] text-[#F2EFE9]/90 leading-relaxed"
                          >
                            {exp.personalizedTip}
                          </p>
                          <p className="text-[10px] text-[#D8B98A]/90">
                            {exp.actionPreparationNote}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#2A2A2E]/70 text-xs">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[11px] text-[#A3A09A]">会籍价</span>
                          <span className="tabular-nums font-semibold text-[#BF8943]">
                            ¥{ev.memberPrice}
                          </span>
                          <span className="tabular-nums text-[10px] text-[#A3A09A] line-through">
                            ¥{ev.standardPrice}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            data-testid={`wishlist-inspect-${ev.id}`}
                            onClick={() => onInspectEvent(ev)}
                            className="px-2.5 py-1 rounded-full text-[11px] text-[#F2EFE9] bg-[#151517] border border-[#2A2A2E] hover:border-[#D8B98A] transition-colors cursor-pointer"
                          >
                            详情
                          </button>
                          <button
                            type="button"
                            data-testid={`wishlist-reserve-${ev.id}`}
                            onClick={() => onReserveEvent(ev)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                          >
                            <span>赴约</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Portfolio Personalized Growth Tip + Concierge Bundle Advice */}
              <div className="p-3 rounded-[8px] bg-[#0B0B0C]/90 border border-[#D8B98A]/45 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-[#D8B98A] font-medium">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>心愿单个人成长锦囊</span>
                </div>
                <p
                  data-testid="wishlist-portfolio-growth-tip"
                  className="text-[11px] text-[#F2EFE9]/90 leading-relaxed"
                >
                  {summary.portfolioGrowthTip}
                </p>
                <p className="text-[10px] text-[#A3A09A] leading-relaxed pt-1 border-t border-[#2A2A2E]">
                  {summary.conciergeBundleAdvice}
                </p>
              </div>
            </div>

            {/* Sidebar Footer Summary & Actions */}
            {summary.items.length > 0 && (
              <div className="p-4 sm:p-5 bg-[#0B0B0C] border-t border-[#2A2A2E] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A3A09A]">会籍预计总计（立省 ¥{summary.memberSavingsAmount}）</span>
                  <div className="flex items-baseline gap-2">
                    <span
                      data-testid="wishlist-total-member-cost"
                      className="tabular-nums text-base font-semibold text-[#D8B98A]"
                    >
                      ¥{summary.totalMemberCost}
                    </span>
                    <span className="tabular-nums text-xs text-[#A3A09A] line-through">
                      ¥{summary.totalStandardCost}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    data-testid="wishlist-clear-btn"
                    onClick={onClearAll}
                    className="px-3 py-2 rounded-full text-xs text-[#A3A09A] hover:text-[#F2EFE9] bg-[#151517] border border-[#2A2A2E] transition-colors cursor-pointer"
                  >
                    清空心愿单
                  </button>

                  <HapticButton
                    type="button"
                    data-testid="wishlist-proceed-apply-btn"
                    onClick={() => {
                      if (summary.items[0]) {
                        onReserveEvent(summary.items[0]);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                  >
                    <span>预约首选心愿场次</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </HapticButton>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

