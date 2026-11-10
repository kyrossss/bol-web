import test from 'node:test';
import assert from 'node:assert/strict';
import { CURATED_EVENTS } from '../content';
import {
  buildAiInterestClusterMatrix,
  buildAnnualEventStreamlineData,
  buildApplicationTrackerState,
  buildConnectionPotentialRadar,
  buildDeterministicAiAssessment,
  buildDeterministicDeepFitReport,
  buildDigitalFootprintParticles,
  buildEventReservationSlip,
  buildMemberGrowthConstellation,
  buildPersonalWishlistSummary,
  buildSmartFilterSummary,
  buildSubscriptionPreferenceSummary,
  BRAND_MICRO_VIDEO_REELS,
  BOL_FIRST_SCREEN_SKELETON_BLOCKS,
  calculateAnnualMembershipSavings,
  calculateParallaxOffsets,
  computeFirstScreenSkeletonState,
  computePointerPressureRippleProfile,
  computeSectionChiaroscuroProfile,
  computeSocialResonance,
  CURATOR_DIALOGUE_QUESTIONS,
  evaluateCuratorMoodDialogue,
  evaluateSectionDwellSuggestion,
  filterCuratedEvents,
  generateBolInvitationCode,
  getBrandMicroVideoStreamState,
  getLiveCommunityStream,
  getPrivilegeComparisonDetail,
  getTierIndustryDistribution,
  MEMBERSHIP_PRIVILEGE_COMPARISON_MATRIX,
  resolveActiveSectionFromScroll,
  resolveHeroPoeticBreathingPhrase,
  resolveNextTierByDragOffset,
  resolveWishlistGrowthExpectation,
  syncScheduledEventIds,
  toggleWishlistEventIds,
  transitionApplicationStage,
  transitionEventSubscription,
  validateApplicationForm,
} from './curationEngine';

test('filterCuratedEvents filters accurately by series and city', () => {
  const allEvents = filterCuratedEvents(CURATED_EVENTS, 'all', '全部城市');
  assert.equal(allEvents.length, 6);

  const szEvents = filterCuratedEvents(CURATED_EVENTS, 'all', '深圳');
  assert.equal(szEvents.length, 3);
  assert.ok(szEvents.every((e) => e.city === '深圳'));

  const aiEvents = filterCuratedEvents(CURATED_EVENTS, 'ai-global', '全部城市');
  assert.equal(aiEvents.length, 1);
  assert.equal(aiEvents[0].id, 'bol-sz-ai-wine');
});

test('computeSocialResonance returns tailored events, tier, and high match score', () => {
  const rec = computeSocialResonance('cross-border', 'tipsy-salon', '深圳');
  assert.ok(rec.matchScore >= 90 && rec.matchScore <= 99);
  assert.equal(rec.primarySeries, 'ai-global');
  assert.equal(rec.recommendedEvents.length, 2);
  assert.equal(rec.recommendedEvents[0].city, '深圳');
  assert.equal(rec.suggestedConnections.length, 3);

  const privateRec = computeSocialResonance('investment-family', 'closed-banquet', '广州');
  assert.equal(privateRec.recommendedTier.id, 'celestial');
  assert.equal(privateRec.recommendedEvents[0].city, '广州');
});

test('calculateAnnualMembershipSavings computes deterministic cost comparisons', () => {
  const lowFreq = calculateAnnualMembershipSavings(1);
  assert.equal(lowFreq.annualAttendances, 12);
  assert.ok(lowFreq.estimatedSavingsWithStarlight > 0);
  assert.equal(lowFreq.recommendedTierId, 'starlight');

  const highFreq = calculateAnnualMembershipSavings(2);
  assert.equal(highFreq.annualAttendances, 24);
  assert.equal(highFreq.recommendedTierId, 'celestial');
});

test('validateApplicationForm rejects invalid inputs and accepts valid applications', () => {
  const invalid = validateApplicationForm({
    fullName: 'A',
    backgroundSummary: '太短',
    wechatId: '@@@',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.backgroundSummary);
  assert.ok(invalid.errors.wechatId);

  const valid = validateApplicationForm({
    fullName: 'Julian Chen',
    backgroundSummary: '哥伦比亚大学商学院校友，目前在深圳从事智能硬件出海',
    wechatId: 'Julian_BoL2026',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('generateBolInvitationCode creates deterministic formatted code', () => {
  const code = generateBolInvitationCode('深圳', 'ai-tech', 7);
  assert.equal(code, 'BOL-SZ-AI-0115');
});

test('calculateParallaxOffsets computes multi-layer depth offsets and respects reducedMotion', () => {
  const reduced = calculateParallaxOffsets(300, true);
  assert.equal(reduced.backdropY, 0);
  assert.equal(reduced.editorialTextY, 0);
  assert.equal(reduced.ambientScale, 1);

  const active = calculateParallaxOffsets(200, false);
  assert.equal(active.backdropY, 48);
  assert.equal(active.orbitalRingY, -36);
  assert.equal(active.editorialTextY, -16);
  assert.equal(active.canvasCardY, 12);
  assert.ok(active.ambientScale > 1);
});

test('buildDeterministicAiAssessment maps founder/investor and cross-border profiles to optimal tiers', () => {
  const founderAssess = buildDeterministicAiAssessment({
    careerBackground: '智能硬件出海品牌联合创始人兼CEO，管理供应链与北美渠道',
    city: '深圳',
    overseasExperience: '加州大学伯克利分校硕士，硅谷工作 4 年',
    socialGoal: '希望参与12人闭门私宴并对接跨境并购与渠道资源',
  });
  assert.equal(founderAssess.recommendedTierId, 'celestial');
  assert.ok(founderAssess.eligibilityScore >= 95);

  const crossBorderAssess = buildDeterministicAiAssessment({
    careerBackground: '独立站 DTC 品牌增长主理人，专注欧洲与东南亚 AI 营销',
    city: '广州',
    overseasExperience: '伦敦艺术大学校友',
    socialGoal: '拓展同频出海人脉与晚间沙龙交流',
  });
  assert.equal(crossBorderAssess.recommendedTierId, 'starlight');
  assert.equal(crossBorderAssess.valueHighlights.length, 3);
});

test('Application FSM transitions sequentially across 资料审核, 背景调研, and 入会邀约', () => {
  const stage1 = transitionApplicationStage('submitted', 'ADVANCE_STAGE');
  assert.equal(stage1, 'document_review');

  const stage2 = transitionApplicationStage(stage1, 'ADVANCE_STAGE');
  assert.equal(stage2, 'background_check');

  const stage3 = transitionApplicationStage(stage2, 'ADVANCE_STAGE');
  assert.equal(stage3, 'invitation_issued');

  const resetStage = transitionApplicationStage(stage3, 'RESET_TRACKER');
  assert.equal(resetStage, 'document_review');

  const tracker1 = buildApplicationTrackerState('document_review');
  assert.equal(tracker1.progressPercentage, 36);
  assert.equal(tracker1.stageMetrics.length, 3);
  assert.deepEqual(
    tracker1.stageMetrics.map((m) => m.stageName),
    ['资料审核', '背景调研', '入会邀约']
  );

  const tracker3 = buildApplicationTrackerState('invitation_issued');
  assert.equal(tracker3.progressPercentage, 100);
  assert.equal(tracker3.canAdvance, false);
  assert.ok(tracker3.stageMetrics.every((m) => m.completionPct === 100));
});

test('Event Invitation Subscription FSM tracks user preferences for targeted push', () => {
  const s1 = transitionEventSubscription('idle', 'TOGGLE_SUBSCRIBE');
  assert.equal(s1, 'subscribed_alert');

  const s2 = transitionEventSubscription(s1, 'UPGRADE_PRIORITY_PUSH');
  assert.equal(s2, 'priority_push_queued');

  const s3 = transitionEventSubscription(s2, 'TOGGLE_SUBSCRIBE');
  assert.equal(s3, 'idle');

  const summary = buildSubscriptionPreferenceSummary({
    'bol-sz-ai-wine': 'subscribed_alert',
    'bol-gz-private-table': 'priority_push_queued',
  });
  assert.equal(summary.totalSubscribed, 2);
  assert.equal(summary.priorityCount, 1);
  assert.deepEqual(summary.preferredCities, ['深圳', '广州']);
  assert.deepEqual(summary.preferredSeriesLabels, ['AI 与品牌出海', '闭门私宴']);
  assert.ok(summary.pushTargetingCopy.includes('深圳'));
});

test('buildAiInterestClusterMatrix generates 4 dynamic interest clusters and 4 SVG connection paths', () => {
  const matrix = buildAiInterestClusterMatrix({
    careerData: '前硅谷 AI 穿戴硬件工程师，现居深圳负责欧美商超渠道',
    industry: 'ai-tech',
    rhythm: 'tipsy-salon',
    city: '深圳',
  });
  assert.equal(matrix.clusters.length, 4);
  assert.equal(matrix.connectionPaths.length, 4);
  assert.ok(matrix.overallResonance >= 90 && matrix.overallResonance <= 99);
  assert.ok(matrix.clusterThemeTitle.includes('深圳'));
  assert.ok(matrix.connectionPaths[0].svgPath.startsWith('M 320 120 C'));

  const archMatrix = buildAiInterestClusterMatrix({
    careerData: '独立建筑师与东方香氛买手店策展人',
    industry: 'ai-tech',
    rhythm: 'closed-banquet',
    city: '上海',
  });
  assert.ok(archMatrix.clusterThemeTitle.includes('上海'));
  assert.ok(archMatrix.clusters[0].recommendedScene.includes('12 人审核制'));
});

test('buildConnectionPotentialRadar generates 6 radar dimensions and 3 potential social paths', () => {
  const radarAnalysis = buildConnectionPotentialRadar({
    industry: 'investment-family',
    rhythm: 'closed-banquet',
    city: '香港',
  });
  assert.equal(radarAnalysis.radarData.length, 6);
  assert.equal(radarAnalysis.potentialPaths.length, 3);
  assert.ok(radarAnalysis.compositeScore >= 90 && radarAnalysis.compositeScore <= 99);
  assert.ok(radarAnalysis.boardTitle.includes('香港'));
  assert.ok(
    radarAnalysis.radarData.every(
      (d) => d.userScore > d.clubBenchmark && d.fullMark === 100
    )
  );
});

test('Membership privilege comparison matrix and drag tier switcher work deterministically', () => {
  assert.equal(MEMBERSHIP_PRIVILEGE_COMPARISON_MATRIX.length, 6);

  // Drag left (negative offset) advances to next tier
  assert.equal(resolveNextTierByDragOffset('free-guest', -80), 'salon-pass');
  assert.equal(resolveNextTierByDragOffset('salon-pass', -80), 'starlight');
  assert.equal(resolveNextTierByDragOffset('starlight', -80), 'celestial');
  assert.equal(resolveNextTierByDragOffset('celestial', -80), 'celestial');

  // Drag right (positive offset) steps back to previous tier
  assert.equal(resolveNextTierByDragOffset('celestial', 80), 'starlight');
  assert.equal(resolveNextTierByDragOffset('starlight', 80), 'salon-pass');
  assert.equal(resolveNextTierByDragOffset('free-guest', 80), 'free-guest');

  // Small drag below threshold keeps current tier
  assert.equal(resolveNextTierByDragOffset('starlight', -15), 'starlight');

  // Deep service detail lookup returns tier-specific notes
  const detail = getPrivilegeComparisonDetail('priv-closed-banquet', 'celestial');
  assert.equal(detail.privilege.code, 'PRIV 02');
  assert.ok(detail.activeCell.summary.includes('2 场闭门私宴'));
  assert.ok(detail.activeTierNote.includes('星辰黑金会员'));
});

test('resolveActiveSectionFromScroll highlights the section straddling the viewport focal line', () => {
  const sampleBounds = [
    { id: 'top' as const, top: -1800, bottom: -1000 },
    { id: 'philosophy' as const, top: -1000, bottom: -200 },
    { id: 'gatherings' as const, top: -200, bottom: 650 },
    { id: 'sandbox' as const, top: 650, bottom: 1500 },
  ];
  assert.equal(resolveActiveSectionFromScroll(sampleBounds, 180), 'gatherings');

  const sandboxBounds = [
    { id: 'gatherings' as const, top: -900, bottom: -50 },
    { id: 'sandbox' as const, top: -50, bottom: 820 },
    { id: 'membership' as const, top: 820, bottom: 1700 },
  ];
  assert.equal(resolveActiveSectionFromScroll(sandboxBounds, 180), 'sandbox');
});

test('buildAnnualEventStreamlineData generates 12 monthly density points and 6 clickable event pins', () => {
  const streamline = buildAnnualEventStreamlineData(CURATED_EVENTS, 'all', '全部城市');
  assert.equal(streamline.months.length, 12);
  assert.equal(streamline.eventPins.length, 6);
  assert.ok(streamline.annualTotalGatherings > 100);
  assert.ok(streamline.peakMonthLabel.includes('11月'));

  const aiOnlyStreamline = buildAnnualEventStreamlineData(
    CURATED_EVENTS,
    'ai-global',
    '深圳'
  );
  assert.equal(aiOnlyStreamline.months.length, 12);
  assert.ok(aiOnlyStreamline.annualTotalGatherings < streamline.annualTotalGatherings);
});

test('evaluateSectionDwellSuggestion triggers tailored concierge suggestion by dwell time ratio', () => {
  // Insufficient total dwell time returns null
  const tooEarly = evaluateSectionDwellSuggestion(
    { top: 400, gatherings: 500 },
    'gatherings'
  );
  assert.equal(tooEarly, null);

  // Sufficient dwell time in gatherings triggers gatherings suggestion with accurate ratio
  const gatheringsSuggestion = evaluateSectionDwellSuggestion(
    { top: 800, gatherings: 2400, sandbox: 400 },
    'gatherings'
  );
  assert.ok(gatheringsSuggestion);
  assert.equal(gatheringsSuggestion.sectionId, 'gatherings');
  assert.equal(gatheringsSuggestion.dwellSharePct, 67);
  assert.equal(gatheringsSuggestion.actionType, 'open_featured_event');
  assert.equal(gatheringsSuggestion.relatedEventId, 'bol-sz-ai-wine');

  // If gatherings is dismissed, falls back to next highest non-dismissed section if above threshold
  const fallbackSuggestion = evaluateSectionDwellSuggestion(
    { gatherings: 2000, membership: 1600 },
    'gatherings',
    ['gatherings']
  );
  assert.ok(fallbackSuggestion);
  assert.equal(fallbackSuggestion.sectionId, 'membership');
  assert.equal(fallbackSuggestion.dwellSharePct, 44);
  assert.equal(fallbackSuggestion.relatedTierId, 'starlight');
});

test('computePointerPressureRippleProfile scales expansion speed and color concentration with pointer pressure', () => {
  const lightTouch = computePointerPressureRippleProfile(0.2, 'pen', false);
  const mediumMouse = computePointerPressureRippleProfile(0.5, 'mouse', false);
  const firmPress = computePointerPressureRippleProfile(0.92, 'touch', true);

  assert.equal(lightTouch.pressureLevelLabel, 'light');
  assert.equal(mediumMouse.pressureLevelLabel, 'medium');
  assert.equal(firmPress.pressureLevelLabel, 'firm');

  // Higher pressure => faster ripple expansion speed (shorter duration & larger maxScale)
  assert.ok(firmPress.expansionDurationSec < mediumMouse.expansionDurationSec);
  assert.ok(mediumMouse.expansionDurationSec < lightTouch.expansionDurationSec);
  assert.ok(firmPress.maxScale > mediumMouse.maxScale);
  assert.ok(mediumMouse.maxScale > lightTouch.maxScale);

  // Higher pressure => richer color concentration
  assert.ok(firmPress.colorIntensity > mediumMouse.colorIntensity);
  assert.ok(mediumMouse.colorIntensity > lightTouch.colorIntensity);
  assert.ok(firmPress.hapticDurationMs > lightTouch.hapticDurationMs);
});

test('syncScheduledEventIds and buildEventReservationSlip create deterministic BoL reservation slips', () => {
  const step1 = syncScheduledEventIds([], 'bol-sz-ai-wine', 'add');
  assert.deepEqual(step1.nextIds, ['bol-sz-ai-wine']);
  assert.equal(step1.isScheduled, true);

  const step2 = syncScheduledEventIds(step1.nextIds, 'bol-hk-yacht-sunset', 'add');
  assert.deepEqual(step2.nextIds, ['bol-sz-ai-wine', 'bol-hk-yacht-sunset']);

  const step3 = syncScheduledEventIds(step2.nextIds, 'bol-sz-ai-wine', 'remove');
  assert.deepEqual(step3.nextIds, ['bol-hk-yacht-sunset']);
  assert.equal(step3.isScheduled, false);

  const slip = buildEventReservationSlip(CURATED_EVENTS[0], 2);
  assert.equal(slip.eventId, 'bol-sz-ai-wine');
  assert.equal(slip.slipNo, 'RSV-2026-SZ-1114-02');
  assert.equal(slip.scheduleOrderIndex, 2);
  assert.ok(slip.seatQuotaNote.includes('余'));
});

test('buildDigitalFootprintParticles scales particle count and airflow velocity with member frequency and domain', () => {
  const lowFreq = buildDigitalFootprintParticles({
    activityFrequency: 'monthly-1-2',
    industry: 'ai-tech',
    city: '深圳',
  });
  const highFreq = buildDigitalFootprintParticles({
    activityFrequency: 'weekly-5-plus',
    industry: 'investment-family',
    city: '香港',
  });

  assert.equal(lowFreq.particles.length, 8);
  assert.equal(highFreq.particles.length, 20);
  assert.ok(highFreq.airflowVelocityMultiplier > lowFreq.airflowVelocityMultiplier);
  assert.ok(highFreq.annualFootprintSessions > lowFreq.annualFootprintSessions);
  assert.ok(highFreq.particles[0].durationSec < lowFreq.particles[0].durationSec);
  assert.equal(highFreq.domainColorHex, '#C86D74');
});

test('buildDeterministicDeepFitReport generates structured fit report against active BoL circles', () => {
  const aiHardwareReport = buildDeterministicDeepFitReport({
    careerDescription: '斯坦福硕士，前硅谷 AI 穿戴硬件工程师，现居深圳负责端侧大模型设备研发',
    city: '深圳',
    industry: 'ai-tech',
    rhythm: 'tipsy-salon',
  });
  assert.equal(aiHardwareReport.city, '深圳');
  assert.ok(aiHardwareReport.overallFitScore >= 90 && aiHardwareReport.overallFitScore <= 99);
  assert.equal(aiHardwareReport.circleBreakdown.length, 3);
  assert.ok(aiHardwareReport.primaryMatchedCircle.includes('AI 硬件'));
  assert.ok(aiHardwareReport.valueExchange.whatYouBring.length > 5);
  assert.ok(aiHardwareReport.valueExchange.whatYouGain.length > 5);

  const familyOfficeReport = buildDeterministicDeepFitReport({
    careerDescription: '香港单一家办合伙人及珠三角制造家族二代，关注跨境并购与维港帆船',
    city: '香港',
    industry: 'ai-tech',
    rhythm: 'closed-banquet',
  });
  assert.equal(familyOfficeReport.reportNo, 'FIT-2026-HK-INV');
  assert.ok(familyOfficeReport.primaryMatchedCircle.includes('家族办公室'));
  assert.ok(familyOfficeReport.recommendedEntryScene.includes('12 人审核制'));
});

test('getLiveCommunityStream cycles through real-time connections and filters by city', () => {
  const allStream = getLiveCommunityStream('全部城市', 0);
  assert.equal(allStream.items.length, 5);
  assert.equal(allStream.activeItem.id, 'pulse-sz-01');
  assert.equal(allStream.nextIndex, 1);
  assert.equal(allStream.prevIndex, 4);

  const szStream = getLiveCommunityStream('深圳', 1);
  assert.equal(szStream.items.length, 2);
  assert.equal(szStream.activeItem.id, 'pulse-sz-05');
  assert.equal(szStream.nextIndex, 0);
});

test('buildSmartFilterSummary computes floating smart filter summary and active filter count', () => {
  const defaultSummary = buildSmartFilterSummary('all', '全部城市', '', 6);
  assert.equal(defaultSummary.activeFilterCount, 0);
  assert.equal(defaultSummary.summaryText, '全部系列 · 全部城市 · 6 场候席');

  const activeSummary = buildSmartFilterSummary('ai-global', '深圳', '威士忌', 1);
  assert.equal(activeSummary.activeFilterCount, 3);
  assert.ok(activeSummary.summaryText.includes('AI 与品牌出海'));
  assert.ok(activeSummary.summaryText.includes('深圳'));
  assert.ok(activeSummary.summaryText.includes('“威士忌”'));
});

test('getTierIndustryDistribution returns 5 brand-gradient industry segments summing to 100%', () => {
  const starlightDist = getTierIndustryDistribution('starlight');
  assert.equal(starlightDist.segments.length, 5);
  const starlightSum = starlightDist.segments.reduce((acc, s) => acc + s.sharePct, 0);
  assert.equal(starlightSum, 100);
  assert.ok(starlightDist.segments[0].gradientCss.includes('linear-gradient'));

  const celestialDist = getTierIndustryDistribution('celestial');
  assert.equal(celestialDist.segments.length, 5);
  const celestialSum = celestialDist.segments.reduce((acc, s) => acc + s.sharePct, 0);
  assert.equal(celestialSum, 100);
  assert.equal(celestialDist.segments[0].industryId, 'investment-family');
});

test('resolveHeroPoeticBreathingPhrase transitions across 午夜, 酒会, and 私谈 with scrollY', () => {
  const midnightChapter = resolveHeroPoeticBreathingPhrase(20);
  assert.equal(midnightChapter.themeWord, '午夜');
  assert.equal(midnightChapter.chapterIndex, 0);

  const salonChapter = resolveHeroPoeticBreathingPhrase(150);
  assert.equal(salonChapter.themeWord, '酒会');
  assert.equal(salonChapter.chapterIndex, 1);

  const privateTalkChapter = resolveHeroPoeticBreathingPhrase(320);
  assert.equal(privateTalkChapter.themeWord, '私谈');
  assert.equal(privateTalkChapter.chapterIndex, 2);
});

test('computeSectionChiaroscuroProfile alternates zone polarity and computes scroll-parallax blur and luminance', () => {
  const zone0 = computeSectionChiaroscuroProfile(0, 180, -120, 900, false);
  const zone1 = computeSectionChiaroscuroProfile(1, 180, 320, 900, false);

  assert.equal(zone0.polarity, 'amber-glow');
  assert.equal(zone1.polarity, 'obsidian-shadow');
  assert.ok(zone0.luminanceDelta >= 0.94 && zone0.luminanceDelta <= 1.06);
  assert.ok(zone1.luminanceDelta >= 0.94 && zone1.luminanceDelta <= 1.06);
  assert.ok(zone1.boundaryBlurPx > 0);

  const reduced = computeSectionChiaroscuroProfile(2, 500, 200, 900, true);
  assert.equal(reduced.luminanceDelta, 1);
  assert.equal(reduced.boundaryBlurPx, 0);
});

test('evaluateCuratorMoodDialogue filters best BoL event across 3 rounds of deep mood questioning', () => {
  assert.equal(CURATOR_DIALOGUE_QUESTIONS.length, 3);
  assert.equal(CURATOR_DIALOGUE_QUESTIONS[0].options.length, 4);

  const hkYachtMatch = evaluateCuratorMoodDialogue({
    city: '香港',
    round1OptionId: 'r1-coastal-breeze',
    round2OptionId: 'r2-returnee-life',
    round3OptionId: 'r3-two-confidants',
    customMoodNote: '想在维港吹海风认识同频朋友',
  });
  assert.equal(hkYachtMatch.primaryEvent.city, '香港');
  assert.equal(hkYachtMatch.primaryEvent.series, 'yacht-sport');
  assert.ok(hkYachtMatch.resonanceScore >= 93);
  assert.ok(hkYachtMatch.curatorWhisperReply.includes('海风破界'));

  const gzDinnerMatch = evaluateCuratorMoodDialogue({
    city: '广州',
    round1OptionId: 'r1-closed-depth',
    round2OptionId: 'r2-capital-legacy',
    round3OptionId: 'r3-curator-intro',
  });
  assert.equal(gzDinnerMatch.primaryEvent.city, '广州');
  assert.equal(gzDinnerMatch.primaryEvent.series, 'private-dinner');
});

test('toggleWishlistEventIds and buildPersonalWishlistSummary manage temporary personal wishlist and compute member savings', () => {
  const step1 = toggleWishlistEventIds(['bol-sz-ai-wine'], 'bol-gz-private-table');
  assert.equal(step1.added, true);
  assert.deepEqual(step1.nextIds, ['bol-sz-ai-wine', 'bol-gz-private-table']);

  const summary = buildPersonalWishlistSummary(step1.nextIds);
  assert.equal(summary.totalCount, 2);
  assert.ok(summary.totalMemberCost > 0);
  assert.ok(summary.totalStandardCost > summary.totalMemberCost);
  assert.equal(
    summary.memberSavingsAmount,
    summary.totalStandardCost - summary.totalMemberCost
  );

  const step2 = toggleWishlistEventIds(step1.nextIds, 'bol-gz-private-table');
  assert.equal(step2.added, false);
  assert.deepEqual(step2.nextIds, ['bol-sz-ai-wine']);
});

test('getBrandMicroVideoStreamState returns 3 low-saturation micro-video reels for BrandPhilosophySection', () => {
  assert.equal(BRAND_MICRO_VIDEO_REELS.length, 3);
  assert.ok(BRAND_MICRO_VIDEO_REELS.every((r) => r.saturationPct <= 40));

  const state0 = getBrandMicroVideoStreamState(0, true);
  assert.equal(state0.activeReel.sceneType, 'clinking-glasses');
  assert.equal(state0.nextIndex, 1);

  const state1 = getBrandMicroVideoStreamState(1, true);
  assert.equal(state1.activeReel.sceneType, 'private-talk-silhouette');
  assert.ok(state1.activeReel.filterCss.includes('saturate(0.32)'));
});

test('computeFirstScreenSkeletonState progresses through Burgundy Wine & Champagne Gold luster phases and completes cleanly', () => {
  assert.equal(BOL_FIRST_SCREEN_SKELETON_BLOCKS.length, 4);

  const phase1 = computeFirstScreenSkeletonState(120, 960);
  assert.equal(phase1.isVisible, true);
  assert.equal(phase1.phaseId, 'wine-ignition');
  assert.equal(phase1.burgundyHex, '#5A1A1E');
  assert.equal(phase1.champagneHex, '#D8B98A');
  assert.ok(phase1.primaryLusterGradientCss.includes('#5A1A1E'));
  assert.ok(phase1.primaryLusterGradientCss.includes('#D8B98A'));

  const phase2 = computeFirstScreenSkeletonState(480, 960);
  assert.equal(phase2.isVisible, true);
  assert.equal(phase2.phaseId, 'champagne-flow');
  assert.equal(phase2.progressPct, 50);

  const phase3 = computeFirstScreenSkeletonState(820, 960);
  assert.equal(phase3.isVisible, true);
  assert.equal(phase3.phaseId, 'sanctum-unveil');

  const done = computeFirstScreenSkeletonState(960, 960);
  assert.equal(done.isVisible, false);
  assert.equal(done.phaseId, 'complete');
  assert.equal(done.progressPct, 100);

  const held = computeFirstScreenSkeletonState(1200, 960, { holdSkeleton: true });
  assert.equal(held.isVisible, true);
  assert.equal(held.phaseId, 'champagne-flow');

  const autostart = computeFirstScreenSkeletonState(0, 960, { autostart: true });
  assert.equal(autostart.isVisible, false);
  assert.equal(autostart.phaseId, 'complete');
});

test('buildMemberGrowthConstellation constructs 3 sequential growth stages, 3 cross-industry collision nodes, and gentle animated Bezier links', () => {
  const ethanGraph = buildMemberGrowthConstellation('story-ethan-ai', 0);
  assert.equal(ethanGraph.storyId, 'story-ethan-ai');
  assert.equal(ethanGraph.stageNodes.length, 3);
  assert.equal(ethanGraph.stageNodes[0].stageTitle, '01 · 初次赴约');
  assert.equal(ethanGraph.stageNodes[2].stageTitle, '03 · 长期共创');
  assert.equal(ethanGraph.opportunityNodes.length, 3);
  assert.equal(ethanGraph.svgLinks.length, 7);
  assert.ok(ethanGraph.svgLinks.every((l) => l.svgPath.startsWith('M ')));
  assert.equal(ethanGraph.activeOpportunity.id, ethanGraph.opportunityNodes[0].id);

  const chloeGraph = buildMemberGrowthConstellation('story-chloe-arch', 2);
  assert.equal(chloeGraph.storyId, 'story-chloe-arch');
  assert.equal(chloeGraph.activeOpportunity.id, chloeGraph.opportunityNodes[2].id);
  assert.ok(chloeGraph.activeOpportunity.commercialOutcome.length > 5);
});

test('resolveWishlistGrowthExpectation and buildPersonalWishlistSummary map slider values to personalized micro-tips in the wishlist sidebar', () => {
  const sampleEvent = CURATED_EVENTS[0];

  const coopEntry = resolveWishlistGrowthExpectation(sampleEvent, 16);
  assert.equal(coopEntry.dimensionId, 'seeking-collaboration');
  assert.equal(coopEntry.dimensionLabel, '寻求合作');
  assert.ok(coopEntry.personalizedTip.includes('商业共创提示'));

  const networkEntry = resolveWishlistGrowthExpectation(sampleEvent, 50);
  assert.equal(networkEntry.dimensionId, 'expanding-network');
  assert.equal(networkEntry.dimensionLabel, '扩充人脉');
  assert.ok(networkEntry.personalizedTip.includes('跨界同频提示'));

  const aestheticsEntry = resolveWishlistGrowthExpectation(sampleEvent, 88);
  assert.equal(aestheticsEntry.dimensionId, 'lifestyle-aesthetics');
  assert.equal(aestheticsEntry.dimensionLabel, '生活美学');
  assert.ok(aestheticsEntry.personalizedTip.includes('审美松弛提示'));

  const summary = buildPersonalWishlistSummary(
    ['bol-sz-ai-wine', 'bol-gz-private-table'],
    CURATED_EVENTS,
    {
      'bol-sz-ai-wine': 18,
      'bol-gz-private-table': 86,
    }
  );
  assert.equal(
    summary.expectationsByEventId['bol-sz-ai-wine'].dimensionLabel,
    '寻求合作'
  );
  assert.equal(
    summary.expectationsByEventId['bol-gz-private-table'].dimensionLabel,
    '生活美学'
  );
  assert.ok(summary.portfolioGrowthTip.includes('心愿单重心偏向'));
});
