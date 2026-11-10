import React, { useState } from 'react';
import { BRAND_TENSIONS } from '../../content';
import { BolCard } from '../visuals/BolCard';
import { BrandMicroVideoStream } from '../visuals/BrandMicroVideoStream';

export const BrandPhilosophySection: React.FC = () => {
  const [selectedTensionId, setSelectedTensionId] = useState<string>(BRAND_TENSIONS[0].id);
  const [customBalances, setCustomBalances] = useState<Record<string, number>>(() =>
    Object.fromEntries(BRAND_TENSIONS.map((t) => [t.id, t.defaultBalance]))
  );

  const activeTension =
    BRAND_TENSIONS.find((t) => t.id === selectedTensionId) || BRAND_TENSIONS[0];

  const comparisonRows = [
    {
      dimension: '内容呈现',
      ordinary: '只罗列时间、地点与票价，缺乏人群语境',
      bol: '完整呈现活动语境、适合人群、现场流程与主理人视角',
    },
    {
      dimension: '关系延续',
      ordinary: '单场活动彼此孤立，散场即结束',
      bol: '通过星光/星辰会籍、次卡与主理人复盘形成长期跨界网络',
    },
    {
      dimension: '核心导向',
      ordinary: '以流量规模和低价促销为中心',
      bol: '以嘉宾同频度、人数边界（12–45 人）与交流信任感为中心',
    },
    {
      dimension: '场域调性',
      ordinary: '过度商业推销或刻板的头衔攀比',
      bol: '商业智识与城市生活方式并置，克制、真诚且有吸引力',
    },
  ];

  return (
    <section
      id="philosophy"
      className="bol-snap-section py-16 lg:py-24 px-6 lg:px-12 max-w-[1360px] mx-auto border-t border-[#2A2A2E]"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-xs text-[#D8B98A] tracking-widest mb-2">
            01. BRAND PHILOSOPHY & TENSION · 品牌角色与调性张力
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#F2EFE9]">
            在正式与松弛之间，建立克制而鲜活的连接场域
          </h2>
        </div>
        <p className="text-sm text-[#A3A09A] max-w-md leading-relaxed">
          BoL 的识别度来自四组同时成立的张力：既有精致的暗调光影与私密审核边界，又有说人话的真诚与微醺夜话的松弛感。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Interactive Tension Selector & Balance Studio (7 cols) */}
        <BolCard className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A3A09A] mb-4">
              <span>点击切换 BoL 四大调性张力维度</span>
              <span className="tabular-nums text-[#D8B98A]">TENSION STUDIO</span>
            </div>

            {/* Segmented Tension Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {BRAND_TENSIONS.map((t) => {
                const isSelected = t.id === selectedTensionId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTensionId(t.id)}
                    className={`p-3 rounded-[6px] border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B0B0C] border-[#D8B98A] text-[#F2EFE9]'
                        : 'bg-[#0B0B0C]/40 border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9]'
                    }`}
                  >
                    <span className="tabular-nums text-[11px] text-[#D8B98A] block mb-1">
                      {t.index}.
                    </span>
                    <span className="text-xs font-medium block whitespace-nowrap truncate">
                      {t.leftPole} × {t.rightPole}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Tension Detail Card */}
            <div className="p-6 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#A3A09A] block">{activeTension.leftEn}</span>
                  <span className="font-editorial text-2xl font-medium text-[#F2EFE9]">
                    {activeTension.leftPole}
                  </span>
                </div>

                <div className="text-xs text-[#D8B98A] tabular-nums">
                  张力配比 {customBalances[activeTension.id]} :{' '}
                  {100 - customBalances[activeTension.id]}
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#A3A09A] block">{activeTension.rightEn}</span>
                  <span className="font-editorial text-2xl font-medium text-[#D8B98A]">
                    {activeTension.rightPole}
                  </span>
                </div>
              </div>

              {/* Interactive Range Slider for exploring the tension balance */}
              <div>
                <label htmlFor="tension-balance-slider" className="sr-only">
                  调节场域张力配比
                </label>
                <input
                  id="tension-balance-slider"
                  type="range"
                  min={25}
                  max={75}
                  value={customBalances[activeTension.id]}
                  onChange={(e) =>
                    setCustomBalances((prev) => ({
                      ...prev,
                      [activeTension.id]: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#D8B98A] cursor-pointer"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-[#2A2A2E]">
                <div>
                  <p className="text-xs text-[#D8B98A] mb-1">执行原则</p>
                  <p className="text-sm text-[#F2EFE9] leading-relaxed">
                    {activeTension.principle}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#A3A09A] mb-1">真实场域切片</p>
                  <p className="text-xs sm:text-sm text-[#A3A09A] leading-relaxed">
                    “{activeTension.sceneExample}”
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#A3A09A]">
            注：在 BoL 的语境里，“高级”是指议题选择与体验的质感，而非炫耀性消费；“菁英”是指人的经历、能力与好奇心，而非刻板标签。
          </p>
        </BolCard>

        {/* Right: Differentiation Matrix (5 cols) */}
        <BolCard
          delay={0.08}
          className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs text-[#D8B98A] tracking-wider mb-2">
              DIFFERENTIATION · 差异化价值坐标
            </p>
            <h3 className="font-editorial text-2xl font-medium text-[#F2EFE9] mb-6">
              为什么 BoL 不是泛泛的活动售票平台？
            </h3>

            <div className="space-y-4">
              {comparisonRows.map((row) => (
                <div
                  key={row.dimension}
                  className="p-4 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#D8B98A] font-medium">{row.dimension}</span>
                    <span className="text-[#A3A09A]">普通活动平台 vs BoL Club</span>
                  </div>
                  <p className="text-xs text-[#A3A09A] line-through">{row.ordinary}</p>
                  <p className="text-xs sm:text-sm text-[#F2EFE9] font-medium leading-relaxed">
                    {row.bol}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </BolCard>
      </div>

      {/* Auto-Playing Low-Saturation Micro-Video Stream showcasing offline gathering details */}
      <BrandMicroVideoStream />
    </section>
  );
};

