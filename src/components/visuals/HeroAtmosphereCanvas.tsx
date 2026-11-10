import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles, Pause, Play, MessageSquareHeart } from 'lucide-react';

interface HeroAtmosphereCanvasProps {
  onSelectCityHighlight?: (city: '深圳' | '广州' | '香港' | '上海') => void;
  onOpenCuratorDialogue?: () => void;
  activeCity?: string;
}

export const HeroAtmosphereCanvas: React.FC<HeroAtmosphereCanvasProps> = ({
  onSelectCityHighlight,
  onOpenCuratorDialogue,
  activeCity = '深圳',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const phaseRef = useRef(0.85);
  const drawTriggerRef = useRef<() => void>(() => {});

  // Synthesize warm ambient lounge pad via Web Audio API when unmuted (VI Manual 4.2 & 4.6)
  const toggleAmbientSound = () => {
    if (isAudioPlaying) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.25);
      }
      setIsAudioPlaying(false);
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        const ctx = new AudioCtx();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.connect(ctx.destination);

        // Warm Fmaj9 jazz lounge chord frequencies
        const freqs = [174.61, 220.0, 261.63, 329.63, 392.0];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(420, ctx.currentTime);

          const voiceGain = ctx.createGain();
          voiceGain.gain.setValueAtTime(0.025 / freqs.length, ctx.currentTime);

          osc.connect(filter);
          filter.connect(voiceGain);
          voiceGain.connect(masterGain);
          osc.start();
        });

        audioCtxRef.current = ctx;
        gainNodeRef.current = masterGain;
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.18, audioCtxRef.current.currentTime, 0.4);
      }
      setIsAudioPlaying(true);
    } catch {
      setIsAudioPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderSingleFrame = () => {
      const t = phaseRef.current;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Deep ink & wine ambient backdrop
      const bgGrad = ctx.createRadialGradient(
        width * (0.55 + (pointerRef.current.x - 0.5) * 0.16),
        height * (0.42 + (pointerRef.current.y - 0.5) * 0.16),
        20,
        width * 0.5,
        height * 0.5,
        width * 0.78
      );
      bgGrad.addColorStop(0, 'rgba(90, 26, 30, 0.48)');
      bgGrad.addColorStop(0.52, 'rgba(21, 21, 23, 0.92)');
      bgGrad.addColorStop(1, 'rgba(11, 11, 12, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle architectural vertical louver lines (private salon glass texture)
      ctx.strokeStyle = 'rgba(216, 185, 138, 0.045)';
      ctx.lineWidth = 1;
      const louverCount = 24;
      for (let i = 1; i < louverCount; i++) {
        const x = (width / louverCount) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Three interconnected orbital rings (BoL Link philosophy)
      const cx = width * 0.52;
      const cy = height * 0.48;
      const baseRadius = Math.min(width, height) * 0.25;

      const ringOffsets = [
        { angle: t * 0.35, dist: baseRadius * 0.46, color: 'rgba(216, 185, 138, 0.52)' },
        {
          angle: t * 0.35 + (Math.PI * 2) / 3,
          dist: baseRadius * 0.46,
          color: 'rgba(191, 137, 67, 0.42)',
        },
        {
          angle: t * 0.35 + (Math.PI * 4) / 3,
          dist: baseRadius * 0.46,
          color: 'rgba(242, 239, 233, 0.26)',
        },
      ];

      ringOffsets.forEach((ring, idx) => {
        const rx =
          cx +
          Math.cos(ring.angle) * ring.dist +
          (pointerRef.current.x - 0.5) * 24 * (idx - 1);
        const ry =
          cy +
          Math.sin(ring.angle) * ring.dist +
          (pointerRef.current.y - 0.5) * 24;

        ctx.beginPath();
        ctx.arc(rx, ry, baseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Warm champagne node on each ring perimeter
        const nodeAngle = -t * 0.6 + idx * 2.1;
        const nx = rx + Math.cos(nodeAngle) * baseRadius;
        const ny = ry + Math.sin(nodeAngle) * baseRadius;

        const nodeGlow = ctx.createRadialGradient(nx, ny, 1, nx, ny, 18);
        nodeGlow.addColorStop(0, 'rgba(216, 185, 138, 0.95)');
        nodeGlow.addColorStop(0.4, 'rgba(216, 185, 138, 0.28)');
        nodeGlow.addColorStop(1, 'rgba(216, 185, 138, 0)');
        ctx.fillStyle = nodeGlow;
        ctx.beginPath();
        ctx.arc(nx, ny, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#F2EFE9';
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Warm bokeh light particles evoking evening clinking glasses & candlelight
      const bokehSeeds = [
        { x: 0.22, y: 0.3, r: 34, speed: 0.4 },
        { x: 0.78, y: 0.26, r: 46, speed: 0.28 },
        { x: 0.68, y: 0.72, r: 38, speed: 0.5 },
        { x: 0.3, y: 0.68, r: 28, speed: 0.35 },
        { x: 0.5, y: 0.5, r: 58, speed: 0.2 },
      ];

      bokehSeeds.forEach((b, i) => {
        const bx = width * b.x + Math.sin(t * b.speed + i) * 16;
        const by = height * b.y + Math.cos(t * b.speed + i * 1.3) * 12;
        const grad = ctx.createRadialGradient(bx, by, 2, bx, by, b.r);
        grad.addColorStop(0, 'rgba(216, 185, 138, 0.16)');
        grad.addColorStop(0.6, 'rgba(191, 137, 67, 0.05)');
        grad.addColorStop(1, 'rgba(11, 11, 12, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    drawTriggerRef.current = renderSingleFrame;
    renderSingleFrame();
  }, [activeCity, isPaused]);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPaused) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
    phaseRef.current += 0.03;
    drawTriggerRef.current();
  };

  const cities: Array<{ name: '深圳' | '广州' | '香港' | '上海'; venueHint: string; coords: string }> = [
    { name: '深圳', venueHint: '南山华侨城 · 深圳湾', coords: '22.54° N' },
    { name: '广州', venueHint: '珠江新城 · 艺术私厨', coords: '23.12° N' },
    { name: '香港', venueHint: '中环码头 · 维港航线', coords: '22.28° N' },
    { name: '上海', venueHint: '静安武定路 · 建筑剧场', coords: '31.23° N' },
  ];

  return (
    <div
      onMouseMove={handlePointerMove}
      data-testid="hero-atmosphere-canvas"
      className="relative w-full h-full min-h-[440px] lg:min-h-[540px] rounded-[8px] overflow-hidden border border-[#2A2A2E] bg-[#151517] flex flex-col justify-between p-6 sm:p-8"
    >
      <canvas
        ref={canvasRef}
        width={760}
        height={560}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Top Overlay: Atmosphere Caption & Audio/Motion Accessibility Controls */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[#2A2A2E]/80 pb-4">
        <div className="flex items-center gap-1.5 text-xs text-[#A3A09A] whitespace-nowrap shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#D8B98A] shrink-0" />
          <span>活动氛围示意</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#F2EFE9] font-medium">{activeCity}站</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleAmbientSound}
            aria-label={isAudioPlaying ? '静音环境声景' : '开启环境声景'}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium bg-[#0B0B0C]/85 border border-[#2A2A2E] text-[#F2EFE9] hover:border-[#D8B98A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#D8B98A]" />
                <span>声景开启</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#A3A09A]" />
                <span>试听微醺声景</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? '恢复光影动态' : '暂停光影动态'}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] text-xs bg-[#0B0B0C]/85 border border-[#2A2A2E] text-[#A3A09A] hover:text-[#F2EFE9] hover:border-[#D8B98A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? '恢复动态' : '减少动态'}</span>
          </button>
        </div>
      </div>

      {/* Center Editorial Glass Vignette */}
      <div className="relative z-10 my-auto py-8 max-w-md">
        <p className="text-xs tracking-widest text-[#D8B98A] mb-2">
          CURATED ENCOUNTERS · 真实场域
        </p>
        <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#F2EFE9] leading-snug mb-3">
          “在恰当的光线、酒杯与议题密度里，让每一次初次相识都像久别重逢。”
        </h2>
        <p className="text-sm text-[#A3A09A] leading-relaxed">
          点击下方城市坐标，即时切换大湾区与上海近期线下聚会场域。
        </p>
      </div>

      {/* Bottom Interactive City Coordinate 2x2 Grid + Beside City Selector: '与主理人对话' Entry */}
      <div className="relative z-10 pt-4 border-t border-[#2A2A2E]/80 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] tracking-wider text-[#A3A09A]">
            CITY SELECTOR · 城市坐标切换
          </span>
          {onOpenCuratorDialogue && (
            <button
              type="button"
              data-testid="canvas-curator-dialogue-btn"
              onClick={onOpenCuratorDialogue}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#D8B98A]/15 hover:bg-[#D8B98A] text-[#D8B98A] hover:text-[#0B0B0C] border border-[#D8B98A]/50 transition-all duration-150 cursor-pointer shrink-0 shadow-[0_0_16px_rgba(216,185,138,0.22)]"
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>与主理人对话</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {cities.map((c) => {
            const isSelected = activeCity === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  phaseRef.current += 0.45;
                  drawTriggerRef.current();
                  onSelectCityHighlight?.(c.name);
                }}
                className={`text-left px-3.5 py-2.5 rounded-[6px] border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B0B0C]/95 border-[#D8B98A] text-[#F2EFE9]'
                    : 'bg-[#0B0B0C]/65 border-[#2A2A2E] text-[#A3A09A] hover:border-[#D8B98A]/50 hover:text-[#F2EFE9]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs mb-0.5">
                  <span className="font-semibold text-[#F2EFE9] whitespace-nowrap">{c.name}</span>
                  <span className="tabular-nums text-[11px] text-[#D8B98A] whitespace-nowrap">
                    {c.coords}
                  </span>
                </div>
                <p className="text-[11px] text-[#A3A09A] truncate">{c.venueHint}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
