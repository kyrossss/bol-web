import React from 'react';
import { BRAND_META } from '../../content';
import { BolLogoMark } from '../visuals/BolLogo';

interface FooterSectionProps {
  onOpenViModal: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenViModal }) => {
  return (
    <footer className="border-t border-[#2A2A2E] bg-[#0B0B0C] py-12 lg:py-16 px-6 lg:px-12">
      <div className="max-w-[1360px] mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-3">
              <BolLogoMark size={28} tone="champagne" />
              <span className="font-editorial text-2xl font-semibold text-[#F2EFE9]">
                {BRAND_META.enName}
              </span>
              <span className="text-xs text-[#A3A09A]">·</span>
              <span className="text-sm text-[#F2EFE9]">{BRAND_META.zhName}</span>
              <span className="text-xs text-[#A3A09A]">·</span>
              <span className="text-xs text-[#D8B98A]">小程序：{BRAND_META.miniProgramName}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#A3A09A] leading-relaxed">
              {BRAND_META.oneLinePositioning}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#A3A09A]">
            <a href="#philosophy" className="hover:text-[#F2EFE9] transition-colors">
              品牌叙事
            </a>
            <a href="#gatherings" className="hover:text-[#F2EFE9] transition-colors">
              近期活动
            </a>
            <a href="#sandbox" className="hover:text-[#F2EFE9] transition-colors">
              同频沙盘
            </a>
            <a href="#membership" className="hover:text-[#F2EFE9] transition-colors">
              会籍与次卡
            </a>
            <button
              type="button"
              onClick={onOpenViModal}
              className="text-[#D8B98A] hover:underline underline-offset-4 cursor-pointer"
            >
              查阅《BoL 品牌 VI 规范核验台》
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2A2A2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#A3A09A]">
          <p>{BRAND_META.icpNotice}</p>
          <p className="tabular-nums shrink-0">
            © 2026 {BRAND_META.enName} ({BRAND_META.domain}) · All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
