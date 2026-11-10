import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { VI_COLOR_TOKENS } from '../../content';
import { BolLogoMark } from '../visuals/BolLogo';

interface ViGovernanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ViGovernanceModal: React.FC<ViGovernanceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const publishChecklist = [
    '三圆连接图形 + BoL Club 横向锁定已应用，保留至少 0.25H 安全空间。',
    '色板严格执行 65% 墨黑/深炭、25% 暖白/灰米、8% 香槟金/会员金、2% 暗酒红。',
    '所有活动氛围图均已明确标注「活动氛围示意」，不泄露真实嘉宾未授权肖像。',
    '文案摒弃“唯一、顶级资源、稳赚”等绝对化词汇，采用四步公式具体呈现体验。',
    '备案期间遵循上线边界：提供「BoL万象博联」小程序引导与本地预览提示。',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vi-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B0B0C]/85 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-[#151517] border border-[#2A2A2E] rounded-[8px] p-6 sm:p-8 my-8 space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#2A2A2E] pb-4">
          <div className="flex items-center gap-3">
            <BolLogoMark size={32} tone="champagne" />
            <div>
              <h2 id="vi-modal-title" className="font-editorial text-2xl font-semibold text-[#F2EFE9]">
                BoL 品牌定位与 VI 视觉规范在线核验台
              </h2>
              <p className="text-xs text-[#A3A09A]">
                基于《BoL 品牌定位与 VI 手册 v0.1》构建 · 门户色彩、标志与合规自检
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="关闭 VI 规范弹窗"
            className="p-2 rounded-full bg-[#0B0B0C] border border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color Tokens Grid */}
        <div>
          <h3 className="text-sm font-semibold text-[#F2EFE9] mb-3">
            01. 门户标准色板（65% 墨黑/深炭 · 25% 暖白/灰米 · 8% 香槟金 · 2% 暗酒红）
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VI_COLOR_TOKENS.map((item) => (
              <div
                key={item.token}
                className="flex items-center gap-3 p-3 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E]"
              >
                <div
                  className="w-10 h-10 rounded-[4px] border border-[#2A2A2E] shrink-0"
                  style={{ backgroundColor: item.hex }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-[#F2EFE9]">{item.name}</span>
                    <span className="tabular-nums text-[#D8B98A]">{item.hex}</span>
                  </div>
                  <p className="text-[11px] text-[#A3A09A] truncate">{item.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-publish checklist */}
        <div className="pt-2 border-t border-[#2A2A2E]">
          <h3 className="text-sm font-semibold text-[#F2EFE9] mb-3">
            02. 门户发布前合规自检（Section 7.2 验收状态）
          </h3>
          <ul className="space-y-2">
            {publishChecklist.map((rule) => (
              <li key={rule} className="flex items-start gap-2.5 text-xs text-[#F2EFE9]">
                <CheckCircle2 className="w-4 h-4 text-[#D8B98A] shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#2A2A2E]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] rounded-full transition-colors cursor-pointer"
          >
            确认并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
