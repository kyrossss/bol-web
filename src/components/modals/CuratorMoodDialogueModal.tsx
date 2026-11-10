import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Compass,
  MapPin,
  MessageSquareHeart,
  RotateCcw,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CURATOR_DIALOGUE_QUESTIONS,
  evaluateCuratorMoodDialogue,
} from '../../lib/curationEngine';
import {
  BolEvent,
  CityName,
  CuratorMoodRecommendationResult,
} from '../../types/bol';
import { BolLogoMark } from '../visuals/BolLogo';
import { HapticButton } from '../visuals/HapticButton';

interface CuratorMoodDialogueModalProps {
  isOpen: boolean;
  initialCity: Exclude<CityName, '全部城市'>;
  onClose: () => void;
  onSelectCity?: (city: '深圳' | '广州' | '香港' | '上海') => void;
  onInspectEvent: (event: BolEvent) => void;
  onReserveEvent: (event: BolEvent) => void;
}

const DIALOGUE_CITIES: Array<'深圳' | '广州' | '香港' | '上海'> = [
  '深圳',
  '广州',
  '香港',
  '上海',
];

export const CuratorMoodDialogueModal: React.FC<CuratorMoodDialogueModalProps> = ({
  isOpen,
  initialCity,
  onClose,
  onSelectCity,
  onInspectEvent,
  onReserveEvent,
}) => {
  const [selectedCity, setSelectedCity] = useState<'深圳' | '广州' | '香港' | '上海'>(
    initialCity || '深圳'
  );
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1);
  const [round1OptionId, setRound1OptionId] = useState<string>(
    CURATOR_DIALOGUE_QUESTIONS[0].options[0].id
  );
  const [round2OptionId, setRound2OptionId] = useState<string>(
    CURATOR_DIALOGUE_QUESTIONS[1].options[0].id
  );
  const [round3OptionId, setRound3OptionId] = useState<string>(
    CURATOR_DIALOGUE_QUESTIONS[2].options[0].id
  );
  const [customMoodNote, setCustomMoodNote] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [recommendation, setRecommendation] =
    useState<CuratorMoodRecommendationResult | null>(null);

  useEffect(() => {
    if (initialCity) {
      setSelectedCity(initialCity);
    }
  }, [initialCity]);

  if (!isOpen) return null;

  const activeQuestion = CURATOR_DIALOGUE_QUESTIONS[currentRound - 1];

  const selectedR1Obj =
    CURATOR_DIALOGUE_QUESTIONS[0].options.find((o) => o.id === round1OptionId) ||
    CURATOR_DIALOGUE_QUESTIONS[0].options[0];
  const selectedR2Obj =
    CURATOR_DIALOGUE_QUESTIONS[1].options.find((o) => o.id === round2OptionId) ||
    CURATOR_DIALOGUE_QUESTIONS[1].options[0];
  const selectedR3Obj =
    CURATOR_DIALOGUE_QUESTIONS[2].options.find((o) => o.id === round3OptionId) ||
    CURATOR_DIALOGUE_QUESTIONS[2].options[0];

  const handleSelectOptionForRound = (round: 1 | 2 | 3, optionId: string) => {
    if (round === 1) {
      setRound1OptionId(optionId);
      setCurrentRound(2);
    } else if (round === 2) {
      setRound2OptionId(optionId);
      setCurrentRound(3);
    } else {
      setRound3OptionId(optionId);
    }
  };

  const handleGenerateRecommendation = async () => {
    setIsAnalyzing(true);
    const localFallback = evaluateCuratorMoodDialogue({
      city: selectedCity,
      round1OptionId,
      round2OptionId,
      round3OptionId,
      customMoodNote,
    });

    try {
      const response = await fetch('/api/curator/mood-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity,
          round1OptionId,
          round2OptionId,
          round3OptionId,
          customMoodNote,
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as CuratorMoodRecommendationResult;
        setRecommendation(data);
      } else {
        setRecommendation(localFallback);
      }
    } catch {
      setRecommendation(localFallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetDialogue = () => {
    setRecommendation(null);
    setCurrentRound(1);
    setCustomMoodNote('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="curator-dialogue-modal-title"
      data-testid="curator-dialogue-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B0B0C]/85 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl rounded-[10px] border border-[#D8B98A]/45 bg-[#151517] text-[#F2EFE9] shadow-[0_28px_80px_rgba(0,0,0,0.85)] overflow-hidden my-auto"
      >
        {/* Top Ambient Wine & Champagne Header Bar */}
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-[#5A1A1E] via-[#D8B98A] to-[#BF8943]"
        />

        <div className="p-6 sm:p-8 space-y-6 max-h-[88vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[#2A2A2E] pb-4">
            <div className="flex items-center gap-3">
              <BolLogoMark size={30} tone="champagne" />
              <div>
                <div className="flex items-center gap-2 text-xs text-[#D8B98A]">
                  <MessageSquareHeart className="w-3.5 h-3.5" />
                  <span>CURATOR SALON DIALOGUE · 与主理人三轮深谈</span>
                </div>
                <h2
                  id="curator-dialogue-modal-title"
                  className="font-editorial text-xl sm:text-2xl font-medium text-[#F2EFE9] mt-0.5"
                >
                  微醺入席前，聊聊你今夜的心境
                </h2>
              </div>
            </div>

            <button
              type="button"
              aria-label="关闭与主理人对话框"
              data-testid="curator-dialogue-close-btn"
              onClick={onClose}
              className="p-2 rounded-full border border-[#2A2A2E] bg-[#0B0B0C] text-[#A3A09A] hover:text-[#F2EFE9] hover:border-[#D8B98A] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* City Synchronizer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B0B0C]/80 border border-[#2A2A2E] rounded-[8px] px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-[#A3A09A]">
              <MapPin className="w-3.5 h-3.5 text-[#D8B98A]" />
              <span>当前对话坐标：</span>
            </div>
            <div className="flex items-center gap-1.5">
              {DIALOGUE_CITIES.map((city) => {
                const isActive = selectedCity === city;
                return (
                  <button
                    key={city}
                    type="button"
                    data-testid={`curator-dialogue-city-${city}`}
                    onClick={() => {
                      setSelectedCity(city);
                      onSelectCity?.(city);
                    }}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#D8B98A] text-[#0B0B0C] font-semibold'
                        : 'bg-[#151517] text-[#A3A09A] hover:text-[#F2EFE9] border border-[#2A2A2E]'
                    }`}
                  >
                    {city}站
                  </button>
                );
              })}
            </div>
          </div>

          {!recommendation ? (
            <div className="space-y-5">
              {/* 3-Round Step Progress Indicator */}
              <div
                data-testid="curator-dialogue-round-stepper"
                className="grid grid-cols-3 gap-2"
              >
                {CURATOR_DIALOGUE_QUESTIONS.map((q) => {
                  const isCurrent = currentRound === q.roundNumber;
                  const isCompleted = currentRound > q.roundNumber;
                  return (
                    <button
                      key={q.roundNumber}
                      type="button"
                      data-testid={`curator-round-tab-${q.roundNumber}`}
                      onClick={() => setCurrentRound(q.roundNumber)}
                      className={`text-left px-3 py-2 rounded-[6px] border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#D8B98A] bg-[#0B0B0C] text-[#F2EFE9]'
                          : isCompleted
                          ? 'border-[#D8B98A]/40 bg-[#0B0B0C]/60 text-[#D8B98A]'
                          : 'border-[#2A2A2E] bg-[#0B0B0C]/40 text-[#A3A09A]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium">第 {q.roundNumber} 轮提问</span>
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#D8B98A]" />}
                      </div>
                      <p className="text-xs font-medium truncate mt-0.5">{q.dimensionTitle}</p>
                    </button>
                  );
                })}
              </div>

              {/* Conversational Memory Strip (Previous Round Echoes) */}
              {currentRound > 1 && (
                <div
                  data-testid="curator-dialogue-history-strip"
                  className="space-y-2 rounded-[8px] bg-[#0B0B0C]/60 border border-[#2A2A2E] p-3.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 text-[#A3A09A]">
                    <span>第 1 轮 · 夜晚能量场</span>
                    <span className="text-[#D8B98A] font-medium">{selectedR1Obj.label}</span>
                  </div>
                  {currentRound > 2 && (
                    <div className="flex items-center justify-between gap-2 text-[#A3A09A] pt-1.5 border-t border-[#2A2A2E]/70">
                      <span>第 2 轮 · 深夜议题张力</span>
                      <span className="text-[#D8B98A] font-medium">{selectedR2Obj.label}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Active Round Question Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuestion.roundNumber}
                  data-testid={`curator-question-stage-round-${activeQuestion.roundNumber}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.24 }}
                  className="space-y-4"
                >
                  <div className="p-4 sm:p-5 rounded-[8px] bg-[#0B0B0C] border border-[#D8B98A]/35 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#D8B98A]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{activeQuestion.roundCode}</span>
                    </div>
                    <p
                      data-testid="curator-active-prompt"
                      className="font-editorial text-lg sm:text-xl text-[#F2EFE9] leading-relaxed"
                    >
                      {activeQuestion.curatorPrompt}
                    </p>
                  </div>

                  {/* 4 High-Quality Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeQuestion.options.map((opt) => {
                      const isSelected =
                        (currentRound === 1 && round1OptionId === opt.id) ||
                        (currentRound === 2 && round2OptionId === opt.id) ||
                        (currentRound === 3 && round3OptionId === opt.id);

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          data-testid={`curator-option-${opt.id}`}
                          onClick={() =>
                            handleSelectOptionForRound(activeQuestion.roundNumber, opt.id)
                          }
                          className={`text-left p-4 rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            isSelected
                              ? 'bg-[#0B0B0C] border-[#D8B98A] shadow-[0_0_20px_rgba(216,185,138,0.18)]'
                              : 'bg-[#0B0B0C]/65 border-[#2A2A2E] hover:border-[#D8B98A]/60'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-[#F2EFE9]">
                                {opt.label}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#151517] border border-[#2A2A2E] text-[#D8B98A] shrink-0">
                                {opt.moodTag}
                              </span>
                            </div>
                            <p className="text-xs text-[#A3A09A] leading-relaxed">
                              {opt.subtitle}
                            </p>
                          </div>

                          <div className="flex items-center justify-end text-[11px] text-[#D8B98A] pt-1">
                            <span>
                              {activeQuestion.roundNumber < 3
                                ? '选择并进入下一轮 →'
                                : isSelected
                                ? '已锁定此项心境'
                                : '选择此项余韵'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Round 3 Optional Mood Whisper Input & Final Submit */}
                  {currentRound === 3 && (
                    <div className="pt-2 space-y-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="curator-custom-mood-note"
                          className="block text-xs text-[#A3A09A]"
                        >
                          补充一句你今夜的心境或想认识的人（选填，AI 主理人将据此微调席位）：
                        </label>
                        <input
                          id="curator-custom-mood-note"
                          data-testid="curator-custom-mood-input"
                          type="text"
                          value={customMoodNote}
                          onChange={(e) => setCustomMoodNote(e.target.value)}
                          placeholder="例如：刚从硅谷回深圳，想在微醺爵士夜里认识做硬件出海或建筑设计的朋友..."
                          className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#0B0B0C] border border-[#2A2A2E] text-xs sm:text-sm text-[#F2EFE9] placeholder:text-[#A3A09A]/50 focus:outline-none focus:border-[#D8B98A]"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2A2A2E]">
                        <button
                          type="button"
                          onClick={() => setCurrentRound(2)}
                          className="text-xs text-[#A3A09A] hover:text-[#F2EFE9] transition-colors cursor-pointer"
                        >
                          ← 返回上一轮修改
                        </button>

                        <HapticButton
                          type="button"
                          data-testid="curator-dialogue-submit-btn"
                          disabled={isAnalyzing}
                          onClick={handleGenerateRecommendation}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>
                            {isAnalyzing
                              ? '主理人正在为你甄选席位...'
                              : '完成三轮对话 · 甄选最契合活动'}
                          </span>
                        </HapticButton>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* AI Curator Recommendation Result Panel */
            <motion.div
              data-testid="curator-dialogue-result-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32 }}
              className="space-y-5"
            >
              {/* Curator Whisper Card */}
              <div className="p-5 rounded-[8px] bg-[#0B0B0C] border border-[#D8B98A]/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D8B98A]/15 text-[#D8B98A] border border-[#D8B98A]/40">
                      {recommendation.moodPersonaTitle}
                    </span>
                    <span className="text-xs text-[#A3A09A]">
                      三轮问答轨迹：{selectedR1Obj.moodTag} · {selectedR2Obj.moodTag} ·{' '}
                      {selectedR3Obj.moodTag}
                    </span>
                  </div>
                  <span
                    data-testid="curator-result-resonance-score"
                    className="text-xs font-semibold text-[#D8B98A] tabular-nums"
                  >
                    心境契合度 {recommendation.resonanceScore}%
                  </span>
                </div>

                <p
                  data-testid="curator-result-whisper-reply"
                  className="text-sm text-[#F2EFE9]/95 leading-relaxed"
                >
                  {recommendation.curatorWhisperReply}
                </p>
              </div>

              {/* Primary Curated Event Showcase */}
              <div
                data-testid="curator-result-primary-event"
                data-event-id={recommendation.primaryEvent.id}
                className="p-5 sm:p-6 rounded-[8px] bg-gradient-to-br from-[#1A1617] via-[#151517] to-[#0B0B0C] border border-[#D8B98A] space-y-4 shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#D8B98A] font-medium tracking-wider">
                    TOP CURATED MATCH · 今夜首选心境席位
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0B0B0C] border border-[#2A2A2E] text-[#F2EFE9]">
                    {recommendation.primaryEvent.city} · {recommendation.primaryEvent.seriesLabel}
                  </span>
                </div>

                <div>
                  <h3
                    data-testid="curator-result-primary-title"
                    className="font-editorial text-2xl text-[#F2EFE9] font-medium leading-snug"
                  >
                    {recommendation.primaryEvent.title}
                  </h3>
                  <p className="text-xs text-[#A3A09A] mt-1">
                    {recommendation.primaryEvent.englishSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#A3A09A] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D8B98A] shrink-0" />
                    <span>
                      {recommendation.primaryEvent.date} · {recommendation.primaryEvent.timeRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D8B98A] shrink-0" />
                    <span className="truncate">{recommendation.primaryEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#D8B98A] shrink-0" />
                    <span>
                      限席 {recommendation.primaryEvent.capacity} 人（仅余{' '}
                      {recommendation.primaryEvent.remainingSeats} 席）
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-[6px] bg-[#0B0B0C]/85 border border-[#2A2A2E] space-y-2 text-xs">
                  <p className="text-[#F2EFE9]/90 leading-relaxed">
                    <strong className="text-[#D8B98A]">为何契合你此刻心境：</strong>
                    {recommendation.moodMatchReason}
                  </p>
                  <p className="text-[#A3A09A] leading-relaxed">
                    <strong className="text-[#D8B98A]">主理人现场破冰铺垫：</strong>
                    {recommendation.curatedIcebreaker}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    data-testid="curator-result-inspect-primary"
                    onClick={() => {
                      onClose();
                      onInspectEvent(recommendation.primaryEvent);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-[#F2EFE9] bg-[#0B0B0C] border border-[#2A2A2E] hover:border-[#D8B98A] transition-colors cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#D8B98A]" />
                    <span>查看活动完整档案</span>
                  </button>

                  <HapticButton
                    type="button"
                    data-testid="curator-result-reserve-primary"
                    onClick={() => {
                      onClose();
                      onReserveEvent(recommendation.primaryEvent);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-[#0B0B0C] bg-[#D8B98A] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                  >
                    <span>锁定本场私享席位</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </HapticButton>
                </div>
              </div>

              {/* Secondary Resonance Option & Reset Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#2A2A2E] text-xs">
                <div className="flex items-center gap-2 text-[#A3A09A] min-w-0">
                  <span className="shrink-0">同频备选场次：</span>
                  <button
                    type="button"
                    data-testid="curator-result-secondary-event"
                    onClick={() => {
                      onClose();
                      onInspectEvent(recommendation.secondaryEvent);
                    }}
                    className="text-[#D8B98A] hover:underline truncate cursor-pointer font-medium"
                  >
                    {recommendation.secondaryEvent.city} · {recommendation.secondaryEvent.title}
                  </button>
                </div>

                <button
                  type="button"
                  data-testid="curator-dialogue-reset-btn"
                  onClick={handleResetDialogue}
                  className="inline-flex items-center gap-1.5 text-[#A3A09A] hover:text-[#F2EFE9] transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重新进行三轮心境对话</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
