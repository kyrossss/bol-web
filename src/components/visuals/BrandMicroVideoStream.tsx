import React, { useEffect, useRef, useState } from 'react';
import { Film, Pause, Play, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  BRAND_MICRO_VIDEO_REELS,
  getBrandMicroVideoStreamState,
} from '../../lib/curationEngine';
import { MicroVideoSceneType } from '../../types/bol';

export const BrandMicroVideoStream: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const phaseRef = useRef<number>(0);

  const streamState = getBrandMicroVideoStreamState(activeReelIndex, isPlaying);
  const { activeReel, reels } = streamState;

  // Auto-advance micro-video reels every 6.5 seconds while playing
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveReelIndex((prev) => (prev + 1) % BRAND_MICRO_VIDEO_REELS.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPlaying, prefersReducedMotion]);

  // Procedural low-saturation cinema frame renderer + HTML5 <video> captureStream binding
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Bind canvas stream to the <video> element if supported by the browser
    const videoEl = videoRef.current;
    if (
      videoEl &&
      typeof (canvas as HTMLCanvasElement & { captureStream?: (fps?: number) => MediaStream })
        .captureStream === 'function' &&
      !videoEl.srcObject
    ) {
      try {
        const stream = (
          canvas as HTMLCanvasElement & { captureStream: (fps?: number) => MediaStream }
        ).captureStream(24);
        videoEl.srcObject = stream;
        videoEl.play().catch(() => {});
      } catch {
        // Fallback to direct canvas display if captureStream is restricted
      }
    }

    let rafId: number | null = null;
    const sceneType: MicroVideoSceneType = activeReel.sceneType;

    const drawFrame = () => {
      const w = canvas.width;
      const h = canvas.height;
      const t = phaseRef.current;

      ctx.clearRect(0, 0, w, h);

      // Desaturated obsidian & warm sepia film base
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.42, 18, w * 0.5, h * 0.5, w * 0.72);
      bgGrad.addColorStop(0, 'rgba(72, 58, 46, 0.52)');
      bgGrad.addColorStop(0.55, 'rgba(22, 20, 21, 0.94)');
      bgGrad.addColorStop(1, 'rgba(11, 11, 12, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle vertical film framing lines
      ctx.strokeStyle = 'rgba(216, 185, 138, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 12; i++) {
        const x = (w / 12) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      if (sceneType === 'clinking-glasses') {
        // Scene 1: Clinking Crystal Glasses & Amber Ice Silhouette
        const clinkOffset = Math.sin(t * 1.8) * 14;
        const leftX = w * 0.43 + clinkOffset;
        const rightX = w * 0.57 - clinkOffset;
        const centerY = h * 0.56;

        // Warm pendant light cone from above
        const coneGrad = ctx.createLinearGradient(w * 0.5, 0, w * 0.5, h);
        coneGrad.addColorStop(0, 'rgba(216, 185, 138, 0.22)');
        coneGrad.addColorStop(1, 'rgba(11, 11, 12, 0)');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(w * 0.38, 0);
        ctx.lineTo(w * 0.62, 0);
        ctx.lineTo(w * 0.78, h);
        ctx.lineTo(w * 0.22, h);
        ctx.closePath();
        ctx.fill();

        // Left & Right Rocks Glasses Silhouettes
        const drawRocksGlass = (gx: number, gy: number, tiltRad: number) => {
          ctx.save();
          ctx.translate(gx, gy);
          ctx.rotate(tiltRad);

          // Glass body
          ctx.strokeStyle = 'rgba(232, 222, 206, 0.68)';
          ctx.fillStyle = 'rgba(28, 25, 24, 0.72)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.roundRect(-34, -44, 68, 82, 6);
          ctx.fill();
          ctx.stroke();

          // Amber whisky liquid level
          ctx.fillStyle = 'rgba(182, 142, 88, 0.42)';
          ctx.beginPath();
          ctx.roundRect(-31, -8, 62, 42, 4);
          ctx.fill();

          // Hand-carved ice sphere silhouette
          ctx.strokeStyle = 'rgba(242, 239, 233, 0.45)';
          ctx.fillStyle = 'rgba(216, 185, 138, 0.16)';
          ctx.beginPath();
          ctx.arc(0, 6, 19, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        };

        drawRocksGlass(leftX, centerY, 0.09);
        drawRocksGlass(rightX, centerY, -0.09);

        // Clink contact acoustic ripple when glasses approach
        if (clinkOffset > 6) {
          const ringAlpha = ((clinkOffset - 6) / 8) * 0.65;
          const ringRadius = 12 + (clinkOffset - 6) * 3.2;
          ctx.strokeStyle = `rgba(216, 185, 138, ${ringAlpha.toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(w * 0.5, centerY - 12, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (sceneType === 'private-talk-silhouette') {
        // Scene 2: Candlelit Long-Table Private Talk Silhouettes
        const leanShift = Math.sin(t * 1.1) * 5;

        // Table horizon
        ctx.fillStyle = 'rgba(18, 17, 18, 0.95)';
        ctx.fillRect(0, h * 0.72, w, h * 0.28);
        ctx.strokeStyle = 'rgba(216, 185, 138, 0.35)';
        ctx.beginPath();
        ctx.moveTo(w * 0.12, h * 0.72);
        ctx.lineTo(w * 0.88, h * 0.72);
        ctx.stroke();

        // Left & Right leaning member silhouettes
        const drawMemberSilhouette = (mx: number, facing: 1 | -1) => {
          ctx.save();
          ctx.translate(mx + facing * leanShift, h * 0.72);
          ctx.fillStyle = 'rgba(24, 22, 24, 0.92)';
          ctx.strokeStyle = 'rgba(216, 185, 138, 0.38)';
          ctx.lineWidth = 1.3;

          // Shoulders & torso leaning in
          ctx.beginPath();
          ctx.moveTo(-48, 0);
          ctx.quadraticCurveTo(-36, -68, facing * 12, -74);
          ctx.quadraticCurveTo(44, -66, 48, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Head profile silhouette
          ctx.beginPath();
          ctx.arc(facing * 14, -102, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        };

        drawMemberSilhouette(w * 0.31, 1);
        drawMemberSilhouette(w * 0.69, -1);

        // Center candle flame & warm halo
        const flameFlicker = Math.sin(t * 4.2) * 2.5;
        const candleGlow = ctx.createRadialGradient(
          w * 0.5,
          h * 0.56,
          2,
          w * 0.5,
          h * 0.56,
          75 + flameFlicker * 3
        );
        candleGlow.addColorStop(0, 'rgba(232, 198, 148, 0.65)');
        candleGlow.addColorStop(0.45, 'rgba(191, 137, 67, 0.18)');
        candleGlow.addColorStop(1, 'rgba(11, 11, 12, 0)');
        ctx.fillStyle = candleGlow;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.56, 78, 0, Math.PI * 2);
        ctx.fill();

        // Candle stem
        ctx.fillStyle = 'rgba(216, 185, 138, 0.7)';
        ctx.fillRect(w * 0.5 - 3, h * 0.59, 6, h * 0.13);
      } else {
        // Scene 3: Vinyl Record Groove & Harbor Dusk Reflections
        const cx = w * 0.38;
        const cy = h * 0.52;
        const maxR = Math.min(w, h) * 0.32;

        // Spinning vinyl concentric grooves
        for (let r = 18; r <= maxR; r += 9) {
          ctx.strokeStyle =
            r === 18
              ? 'rgba(191, 137, 67, 0.68)'
              : 'rgba(216, 185, 138, 0.22)';
          ctx.lineWidth = r === 18 ? 4 : 1;
          ctx.beginPath();
          ctx.arc(cx, cy, r, t * 0.8, t * 0.8 + Math.PI * 1.65);
          ctx.stroke();
        }

        // Harbor dusk water shimmer lines on the right
        for (let row = 0; row < 7; row++) {
          const ry = h * 0.34 + row * 16;
          const waveX = Math.sin(t * 1.4 + row) * 12;
          ctx.strokeStyle = `rgba(216, 185, 138, ${(0.42 - row * 0.04).toFixed(2)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(w * 0.62 + waveX, ry);
          ctx.lineTo(w * 0.84 - waveX, ry);
          ctx.stroke();
        }
      }

      // Vignette border
      const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.25, w * 0.5, h * 0.5, w * 0.65);
      vig.addColorStop(0, 'rgba(11, 11, 12, 0)');
      vig.addColorStop(1, 'rgba(11, 11, 12, 0.68)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    };

    drawFrame();

    if (!isPlaying || prefersReducedMotion) {
      return;
    }

    const animate = () => {
      phaseRef.current += 0.035;
      drawFrame();
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [activeReel.sceneType, isPlaying, prefersReducedMotion]);

  return (
    <div
      data-testid="brand-micro-video-stream"
      data-autoplay={isPlaying ? 'true' : 'false'}
      data-active-reel={activeReel.id}
      data-saturation-level="low-desaturated"
      data-saturation-pct={activeReel.saturationPct}
      className="mt-10 rounded-[10px] border border-[#2A2A2E] bg-[#151517]/95 p-6 sm:p-8 space-y-6"
    >
      {/* Top Bar: Film Stream Header & Play/Pause Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2A2E] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#D8B98A] tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span>AMBIENT MICRO-VIDEO STREAM · 线下聚会细节微型视频流</span>
            <span aria-hidden="true">·</span>
            <span
              data-testid="micro-video-saturation-badge"
              className="px-2 py-0.5 rounded-full text-[10px] bg-[#0B0B0C] border border-[#D8B98A]/40 text-[#D8B98A]"
            >
              {streamState.saturationModeLabel}
            </span>
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl text-[#F2EFE9] font-medium">
            酒杯轻碰与长桌私谈的低饱和度光影切片
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#A3A09A]">
            <span
              className={`h-2 w-2 rounded-full ${
                isPlaying ? 'bg-[#D8B98A] animate-pulse' : 'bg-[#A3A09A]'
              }`}
            />
            <span>{isPlaying ? 'AUTO-PLAYING LOOP' : 'PAUSED'}</span>
          </span>

          <button
            type="button"
            aria-label={isPlaying ? '暂停微型视频流' : '播放微型视频流'}
            data-testid="micro-video-play-toggle"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#0B0B0C] border border-[#2A2A2E] text-[#F2EFE9] hover:border-[#D8B98A] transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#D8B98A]" />
                <span>暂停流媒体</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#D8B98A]" />
                <span>自动播放</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split: Left Low-Saturation Micro-Video Viewport (7 cols) + Right 3 Reel Selectors (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Auto-Playing Low-Saturation Cinema Viewport */}
        <div
          data-testid="micro-video-viewport"
          style={{
            filter: activeReel.filterCss,
          }}
          className="lg:col-span-7 relative min-h-[260px] sm:min-h-[300px] rounded-[8px] overflow-hidden border border-[#2A2A2E] bg-[#0B0B0C] flex flex-col justify-between p-5"
        >
          {/* Synchronized Canvas + HTML5 Video Stream */}
          <canvas
            ref={canvasRef}
            width={680}
            height={340}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            aria-label={activeReel.title}
            data-testid="brand-micro-video-element"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-95"
          />

          {/* Top Cinema Timecode Overlay */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-[#F2EFE9]/80">
            <span className="px-2.5 py-0.5 rounded bg-[#0B0B0C]/80 border border-[#2A2A2E] tabular-nums font-mono">
              {activeReel.reelCode}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#0B0B0C]/80 border border-[#2A2A2E]">
              {activeReel.locationTag}
            </span>
          </div>

          {/* Bottom Caption Overlay */}
          <motion.div
            key={activeReel.id}
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 p-4 rounded-[6px] bg-[#0B0B0C]/85 border border-[#2A2A2E]/90 backdrop-blur-sm space-y-1"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[#D8B98A] font-medium">
                {activeReel.enSubtitle}
              </span>
              <span className="text-[11px] text-[#A3A09A]">
                {activeReel.atmosphereDetail}
              </span>
            </div>
            <p
              data-testid="micro-video-active-title"
              className="font-editorial text-lg text-[#F2EFE9] font-medium"
            >
              {activeReel.title}
            </p>
            <p
              data-testid="micro-video-active-caption"
              className="text-xs text-[#A3A09A] leading-relaxed"
            >
              {activeReel.visualCaption}
            </p>
          </motion.div>
        </div>

        {/* Right: 3 Interactive Micro-Video Reel Strips */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {reels.map((reel, idx) => {
            const isSelected = idx === streamState.normalizedIndex;
            return (
              <button
                key={reel.id}
                type="button"
                data-testid={`micro-video-reel-${idx}`}
                onClick={() => setActiveReelIndex(idx)}
                className={`text-left p-4 rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#0B0B0C] border-[#D8B98A] shadow-[0_0_24px_rgba(216,185,138,0.16)]'
                    : 'bg-[#0B0B0C]/55 border-[#2A2A2E] hover:border-[#D8B98A]/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-[#D8B98A] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>{reel.reelCode}</span>
                  </span>
                  <span className="text-[#A3A09A] tabular-nums">
                    饱和度 {reel.saturationPct}%
                  </span>
                </div>

                <div>
                  <h4 className="font-editorial text-base font-medium text-[#F2EFE9]">
                    {reel.title}
                  </h4>
                  <p className="text-xs text-[#A3A09A] line-clamp-2 mt-1 leading-relaxed">
                    {reel.visualCaption}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
