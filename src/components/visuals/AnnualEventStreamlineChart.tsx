import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { motion, useReducedMotion } from 'motion/react';
import { Compass, ArrowDownRight, Sparkles } from 'lucide-react';
import {
  AnnualEventStreamlineData,
  AnnualStreamEventPin,
  AnnualStreamMonthPoint,
  EventSeriesId,
} from '../../types/bol';
import { BolCard } from './BolCard';
import { HapticButton } from './HapticButton';

interface AnnualEventStreamlineChartProps {
  streamlineData: AnnualEventStreamlineData;
  selectedSeries: EventSeriesId;
  activeEventId: string | null;
  onSelectSeriesFilter: (series: EventSeriesId) => void;
  onLocateEventCard: (eventId: string) => void;
}

const SERIES_STREAM_CONFIG: Array<{
  id: Exclude<EventSeriesId, 'all'>;
  label: string;
  stroke: string;
  dash?: string;
}> = [
  { id: 'networking', label: 'Networking 酒会', stroke: '#D8B98A' },
  { id: 'ai-global', label: 'AI 与品牌出海', stroke: '#BF8943' },
  { id: 'private-dinner', label: '闭门私宴', stroke: '#C86D74', dash: '4 3' },
  { id: 'yacht-sport', label: '游艇与城市运动', stroke: '#8AB6D8', dash: '3 3' },
  { id: 'culture-lifestyle', label: '先锋生活与沙龙', stroke: '#B9A3D8', dash: '2 3' },
];

/**
 * AnnualEventStreamlineChart
 * D3.js-driven flowing spline chart ("年度活动流线图") displaying 12-month
 * event density and category distribution, with interactive event nodes on the
 * curve that scroll/locate directly to the corresponding event card.
 */
export const AnnualEventStreamlineChart: React.FC<AnnualEventStreamlineChartProps> = ({
  streamlineData,
  selectedSeries,
  activeEventId,
  onSelectSeriesFilter,
  onLocateEventCard,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  const width = 1080;
  const height = 270;
  const margin = { top: 34, right: 44, bottom: 44, left: 44 };

  const {
    xScale,
    yScale,
    mainLinePath,
    mainAreaPath,
    categoryStreamPaths,
    pinCoordinates,
  } = useMemo(() => {
    const months = streamlineData.months;
    const maxDensity =
      d3.max(months, (d: AnnualStreamMonthPoint) => d.totalDensity) || 30;

    const x = d3
      .scaleLinear()
      .domain([0, Math.max(1, months.length - 1)])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, Math.ceil(maxDensity * 1.18)])
      .range([height - margin.bottom, margin.top]);

    const curveFactory = d3.curveCatmullRom.alpha(0.5);

    const lineGenerator = d3
      .line<AnnualStreamMonthPoint>()
      .x((d) => x(d.monthIndex))
      .y((d) => y(d.totalDensity))
      .curve(curveFactory);

    const areaGenerator = d3
      .area<AnnualStreamMonthPoint>()
      .x((d) => x(d.monthIndex))
      .y0(height - margin.bottom)
      .y1((d) => y(d.totalDensity))
      .curve(curveFactory);

    const catPaths = SERIES_STREAM_CONFIG.map((cfg) => {
      const catLine = d3
        .line<AnnualStreamMonthPoint>()
        .x((d) => x(d.monthIndex))
        .y((d) => y(d.seriesBreakdown[cfg.id] * 2.4))
        .curve(curveFactory);

      return {
        ...cfg,
        d: catLine(months) || '',
      };
    });

    const pins = streamlineData.eventPins.map((pin) => ({
      ...pin,
      cx: x(pin.monthIndex),
      cy: y(pin.densityValue),
    }));

    return {
      xScale: x,
      yScale: y,
      mainLinePath: lineGenerator(months) || '',
      mainAreaPath: areaGenerator(months) || '',
      categoryStreamPaths: catPaths,
      pinCoordinates: pins,
    };
  }, [streamlineData]);

  const inspectedPin: AnnualStreamEventPin =
    streamlineData.eventPins.find(
      (p) => p.eventId === (hoveredPinId || activeEventId)
    ) || streamlineData.eventPins[0];

  return (
    <BolCard
      data-testid="d3-annual-event-streamline"
      className="p-6 sm:p-7 rounded-[8px] bg-[#151517] border border-[#D8B98A]/45 mb-8 space-y-5"
    >
      {/* Top Header & Annual Density Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#2A2A2E]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#D8B98A] mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>
              D3.JS ANNUAL EVENT STREAMLINE · 年度活动流线图（动态曲线展示全年活动密度与类别分布 · 点击节点直达对应活动卡片）
            </span>
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#F2EFE9]">
            四城全年社交律动曲线 · 峰值月份：{streamlineData.peakMonthLabel}
          </h3>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-[#A3A09A] block">全年策划聚会总量</span>
            <span
              data-testid="streamline-annual-total"
              className="tabular-nums text-2xl font-semibold text-[#D8B98A]"
            >
              {streamlineData.annualTotalGatherings} 场 / 年
            </span>
          </div>
        </div>
      </div>

      {/* Category Distribution Legend & Quick Series Stream Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#A3A09A]">流线类别图例：</span>
          <button
            type="button"
            onClick={() => onSelectSeriesFilter('all')}
            className={`px-2.5 py-1 rounded-[6px] text-[11px] border transition-colors cursor-pointer ${
              selectedSeries === 'all'
                ? 'bg-[#D8B98A] text-[#0B0B0C] border-[#D8B98A] font-medium'
                : 'bg-[#0B0B0C] text-[#A3A09A] border-[#2A2A2E] hover:text-[#F2EFE9]'
            }`}
          >
            全部主干流线
          </button>
          {SERIES_STREAM_CONFIG.map((cfg) => {
            const isSelected = selectedSeries === cfg.id;
            return (
              <button
                key={cfg.id}
                type="button"
                onClick={() => onSelectSeriesFilter(cfg.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B0B0C] text-[#F2EFE9] border-[#D8B98A]'
                    : 'bg-[#0B0B0C]/60 text-[#A3A09A] border-[#2A2A2E] hover:text-[#F2EFE9]'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: cfg.stroke }}
                />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-[11px] text-[#D8B98A]">
          点击曲线上的金色坐标点位，即可平滑滚动并高亮对应活动卡片
        </span>
      </div>

      {/* D3.js SVG Flowing Streamline Canvas */}
      <div className="relative w-full rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] p-3 sm:p-4 overflow-hidden">
        <svg
          data-testid="d3-streamline-svg"
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[220px] sm:h-[260px] select-none"
          role="img"
          aria-label="BoL Club 年度活动流线图"
        >
          <defs>
            <linearGradient id="bolStreamAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D8B98A" stopOpacity="0.36" />
              <stop offset="55%" stopColor="#BF8943" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#5A1A1E" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="bolStreamStrokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#BF8943" />
              <stop offset="50%" stopColor="#D8B98A" />
              <stop offset="100%" stopColor="#F4EFE6" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Grid Lines */}
          {[0.25, 0.5, 0.75].map((ratio) => {
            const yPos =
              margin.top + (height - margin.top - margin.bottom) * ratio;
            return (
              <line
                key={ratio}
                x1={margin.left}
                y1={yPos}
                x2={width - margin.right}
                y2={yPos}
                stroke="#2A2A2E"
                strokeDasharray="3 6"
                strokeWidth={1}
              />
            );
          })}

          {/* Vertical Month Guide Ticks & Labels */}
          {streamlineData.months.map((m) => {
            const xPos = xScale(m.monthIndex);
            const yPos = yScale(m.totalDensity);
            return (
              <g key={m.monthLabel}>
                <line
                  x1={xPos}
                  y1={margin.top}
                  x2={xPos}
                  y2={height - margin.bottom}
                  stroke="#2A2A2E"
                  strokeOpacity={0.55}
                  strokeWidth={1}
                />
                <circle
                  cx={xPos}
                  cy={yPos}
                  r={2.5}
                  fill="#BF8943"
                  opacity={0.75}
                />
                <text
                  x={xPos}
                  y={height - 20}
                  textAnchor="middle"
                  fill="#F2EFE9"
                  fontSize="11"
                  fontWeight="500"
                >
                  {m.monthLabel}
                </text>
                <text
                  x={xPos}
                  y={height - 6}
                  textAnchor="middle"
                  fill="#A3A09A"
                  fontSize="9.5"
                >
                  {m.seasonTag}
                </text>
              </g>
            );
          })}

          {/* D3 Area Fill under Primary Annual Streamline */}
          <motion.path
            data-testid="d3-streamline-area"
            d={mainAreaPath}
            fill="url(#bolStreamAreaGrad)"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* 5 Category Distribution Flowing Streamlines */}
          {categoryStreamPaths.map((cat) => {
            const isHighlighted =
              selectedSeries === 'all' || selectedSeries === cat.id;
            return (
              <motion.path
                key={cat.id}
                data-testid={`d3-category-stream-${cat.id}`}
                d={cat.d}
                fill="none"
                stroke={cat.stroke}
                strokeWidth={selectedSeries === cat.id ? 2.4 : 1.35}
                strokeDasharray={cat.dash}
                initial={
                  prefersReducedMotion
                    ? { pathLength: 1, opacity: isHighlighted ? 0.65 : 0.16 }
                    : { pathLength: 0, opacity: 0 }
                }
                animate={{
                  pathLength: 1,
                  opacity:
                    selectedSeries === cat.id
                      ? 0.92
                      : isHighlighted
                      ? 0.48
                      : 0.14,
                }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}

          {/* Primary D3 Catmull-Rom Flowing Density Curve */}
          <motion.path
            data-testid="d3-streamline-main-curve"
            d={mainLinePath}
            fill="none"
            stroke="url(#bolStreamStrokeGrad)"
            strokeWidth={3}
            initial={
              prefersReducedMotion
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0.25 }
            }
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Interactive Clickable Flagship Event Nodes along the D3 Curve */}
          {pinCoordinates.map((pin) => {
            const isSelected =
              (hoveredPinId || activeEventId || streamlineData.eventPins[0].eventId) ===
              pin.eventId;

            return (
              <g
                key={pin.eventId}
                role="button"
                tabIndex={0}
                aria-label={`定位至活动卡片：${pin.title}（${pin.city}）`}
                data-testid={`streamline-event-node-${pin.eventId}`}
                data-active={isSelected ? 'true' : 'false'}
                onMouseEnter={() => setHoveredPinId(pin.eventId)}
                onMouseLeave={() =>
                  setHoveredPinId((prev) => (prev === pin.eventId ? null : prev))
                }
                onClick={() => onLocateEventCard(pin.eventId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onLocateEventCard(pin.eventId);
                  }
                }}
                className="cursor-pointer focus:outline-none"
              >
                {/* Vertical Stem to Baseline */}
                <line
                  x1={pin.cx}
                  y1={pin.cy}
                  x2={pin.cx}
                  y2={height - margin.bottom}
                  stroke={isSelected ? '#D8B98A' : '#BF8943'}
                  strokeDasharray="2 3"
                  strokeWidth={isSelected ? 1.5 : 1}
                  strokeOpacity={isSelected ? 0.9 : 0.45}
                />

                {/* Outer Halo Ring */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r={isSelected ? 15 : 10}
                  fill={isSelected ? 'rgba(216,185,138,0.22)' : 'rgba(11,11,12,0.75)'}
                  stroke={isSelected ? '#D8B98A' : '#BF8943'}
                  strokeWidth={isSelected ? 2 : 1.2}
                />

                {/* Core Node Dot */}
                <circle
                  cx={pin.cx}
                  cy={pin.cy}
                  r={isSelected ? 5.5 : 4}
                  fill={isSelected ? '#F2EFE9' : '#D8B98A'}
                />

                {/* Callout Tag Above Node */}
                <g transform={`translate(${pin.cx}, ${Math.max(18, pin.cy - 22)})`}>
                  <rect
                    x={-54}
                    y={-14}
                    width={108}
                    height={19}
                    rx={4}
                    fill={isSelected ? '#D8B98A' : '#151517'}
                    stroke={isSelected ? '#F2EFE9' : '#D8B98A'}
                    strokeWidth={0.9}
                  />
                  <text
                    x={0}
                    y={-1}
                    textAnchor="middle"
                    fill={isSelected ? '#0B0B0C' : '#F2EFE9'}
                    fontSize="10"
                    fontWeight="600"
                  >
                    {pin.city} · {pin.code.replace('BOL-', '')}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Active Curve Point Inspector & Quick-Jump Card Locator Bar */}
      <div
        data-testid="streamline-active-pin-banner"
        className="p-4 rounded-[8px] bg-[#0B0B0C] border border-[#2A2A2E] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#D8B98A] font-medium inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>当前流线聚焦节点：</span>
            </span>
            <span className="tabular-nums text-[#BF8943] font-semibold">
              {inspectedPin.code}
            </span>
            <span aria-hidden="true" className="text-[#A3A09A]">
              ·
            </span>
            <span className="text-[#F2EFE9] font-medium">{inspectedPin.city}</span>
            <span aria-hidden="true" className="text-[#A3A09A]">
              ·
            </span>
            <span className="text-[#D8B98A]">{inspectedPin.seriesLabel}</span>
            <span aria-hidden="true" className="text-[#A3A09A]">
              ·
            </span>
            <span className="tabular-nums text-[#A3A09A]">
              余 {inspectedPin.remainingSeats}/{inspectedPin.capacity} 席
            </span>
          </div>
          <p
            data-testid="streamline-inspected-title"
            className="font-editorial text-lg sm:text-xl font-medium text-[#F2EFE9]"
          >
            {inspectedPin.title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {streamlineData.eventPins.map((pin) => {
            const isCurrent = pin.eventId === inspectedPin.eventId;
            return (
              <button
                key={pin.eventId}
                type="button"
                data-testid={`streamline-quick-jump-${pin.eventId}`}
                onClick={() => onLocateEventCard(pin.eventId)}
                className={`px-2.5 py-1.5 rounded-[6px] text-xs border transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#D8B98A]/20 text-[#D8B98A] border-[#D8B98A] font-medium'
                    : 'bg-[#151517] text-[#A3A09A] border-[#2A2A2E] hover:text-[#F2EFE9]'
                }`}
              >
                {pin.city} · {pin.code.replace('BOL-', '')}
              </button>
            );
          })}

          <HapticButton
            type="button"
            data-testid="streamline-locate-card-btn"
            onClick={() => onLocateEventCard(inspectedPin.eventId)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <span>定位至该活动卡片</span>
            <ArrowDownRight className="w-3.5 h-3.5" />
          </HapticButton>
        </div>
      </div>
    </BolCard>
  );
};
