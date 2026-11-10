import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { NavSectionId } from '../../types/bol';
import { HapticButton } from '../visuals/HapticButton';

interface TopNavProps {
  activeSectionId?: NavSectionId;
  isScrolled?: boolean;
  onNavigateSection?: (sectionId: NavSectionId) => void;
  onOpenApplication: () => void;
}

const NAV_ITEMS: Array<{ id: NavSectionId; label: string; href: string }> = [
  { id: 'philosophy', label: '品牌叙事', href: '#philosophy' },
  { id: 'gatherings', label: '活动矩阵', href: '#gatherings' },
  { id: 'sandbox', label: '同频沙盘', href: '#sandbox' },
  { id: 'membership', label: '会籍体系', href: '#membership' },
  { id: 'field-notes', label: '现场纪实', href: '#field-notes' },
];

/**
 * 严格遵循 Top Bar Contract：
 * 单行三区结构（Zone 1: 单一品牌字符元素 | Zone 2: 5 个单行纯文本锚点链接 | Zone 3: 1 个主行动按钮）
 * 并集成基于滚动板块 ID（#philosophy, #gatherings, #sandbox, #membership, #field-notes）的
 * Framer Motion 动态悬浮高亮指示条。
 */
export const TopNav: React.FC<TopNavProps> = ({
  activeSectionId = 'top',
  isScrolled = false,
  onNavigateSection,
  onOpenApplication,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: NavSectionId
  ) => {
    if (onNavigateSection) {
      e.preventDefault();
      onNavigateSection(sectionId);
    }
  };

  return (
    <motion.header
      data-testid="floating-dynamic-topnav"
      data-active-section={activeSectionId}
      data-scrolled={isScrolled ? 'true' : 'false'}
      initial={false}
      animate={{
        backgroundColor: isScrolled
          ? 'rgba(11, 11, 12, 0.94)'
          : 'rgba(11, 11, 12, 0.84)',
        borderColor: isScrolled
          ? 'rgba(216, 185, 138, 0.28)'
          : 'rgba(42, 42, 46, 1)',
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 h-16 flex items-center justify-between gap-8 px-6 lg:px-12 backdrop-blur-md border-b shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
    >
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#top"
        onClick={(e) => handleLinkClick(e, 'top')}
        className={`font-editorial text-2xl font-semibold tracking-tight transition-colors whitespace-nowrap shrink-0 ${
          activeSectionId === 'top'
            ? 'text-[#F2EFE9]'
            : 'text-[#F2EFE9] hover:text-[#D8B98A]'
        }`}
      >
        BoL Club
      </a>

      {/* Zone 2: 5 concise single-line text navigation links with Framer Motion scroll-spy highlight */}
      <nav
        aria-label="主导航"
        className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A3A09A]"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSectionId === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              data-testid={`topnav-link-${item.id}`}
              data-active={isActive ? 'true' : 'false'}
              aria-current={isActive ? 'location' : undefined}
              onClick={(e) => handleLinkClick(e, item.id)}
              className={`relative py-2 transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-[#D8B98A] font-semibold'
                  : 'text-[#A3A09A] hover:text-[#F2EFE9]'
              }`}
            >
              <span>{item.label}</span>

              {isActive && (
                <motion.span
                  layoutId={
                    prefersReducedMotion
                      ? undefined
                      : 'bol-topnav-active-indicator'
                  }
                  data-testid="topnav-active-indicator"
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 32,
                  }}
                  className="pointer-events-none absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-[#BF8943] via-[#D8B98A] to-[#F4EFE6] shadow-[0_0_12px_rgba(216,185,138,0.65)]"
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center shrink-0">
        <HapticButton
          type="button"
          data-testid="topnav-apply-btn"
          onClick={onOpenApplication}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
            activeSectionId === 'apply'
              ? 'text-[#0B0B0C] bg-[#F2EFE9] ring-2 ring-[#D8B98A]'
              : 'text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9]'
          }`}
        >
          申请赴约
        </HapticButton>
      </div>
    </motion.header>
  );
};

