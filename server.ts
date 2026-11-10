import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  buildAiInterestClusterMatrix,
  buildDeterministicAiAssessment,
  buildDeterministicDeepFitReport,
  CURATOR_DIALOGUE_QUESTIONS,
  evaluateCuratorMoodDialogue,
} from './src/lib/curationEngine';
import { CURATED_EVENTS } from './src/content';
import {
  AiDeepCircleFitReport,
  AiInterestClusterMatrix,
  AiMembershipAssessment,
  CityName,
  CuratorMoodRecommendationResult,
  IndustryDomainId,
  MembershipTier,
  SocialRhythmId,
} from './src/types/bol';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.post('/api/membership/assess', async (req, res) => {
    const {
      careerBackground = '',
      city = '深圳',
      overseasExperience = '',
      socialGoal = '',
    } = req.body || {};

    if (!careerBackground || String(careerBackground).trim().length < 4) {
      res.status(400).json({
        error: '请至少输入 4 个字符的职业背景或行业经历描述，以便生成个性化评估。',
      });
      return;
    }

    const fallbackResult = buildDeterministicAiAssessment({
      careerBackground: String(careerBackground),
      city: String(city),
      overseasExperience: String(overseasExperience),
      socialGoal: String(socialGoal),
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json(fallbackResult);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `
你是 BoL Club（BoL 俱乐部 · BoL万象博联）的首席社群主理人。
BoL 是面向各行业海归与菁英的商业与生活连接平台，活跃在深圳、广州、香港与上海。
请根据以下申请人的职业背景与诉求，进行入会资格契合度自测，并推荐最适合的会籍等级。

会籍体系包含四个等级（recommendedTierId 必须严格从以下 4 个值中选择一个）：
1. "free-guest" -> 自由访客会员（¥0，适合初次体验单场酒会）
2. "salon-pass" -> 酒会优享次卡（¥680/4次，适合高频参与晚间微醺酒会与AI/出海沙龙）
3. "starlight" -> 星光年度会籍（¥1,680/年，适合深度融入跨城跨行业网络，含全年会员价、2张免单券与6次主理人1V1引荐）
4. "celestial" -> 星辰黑金会籍（¥4,800/年，适合创始人、合伙人、投资人、企业高管与家族接班人，含常规酒会无限畅行、2席12人闭门私宴与12次联合创始人1V1定向商业引荐）

申请人信息：
- 常驻城市：${city}
- 职业背景与职责：${careerBackground}
- 海外/留学或跨国经历：${overseasExperience || '未额外注明'}
- 核心社交与连接诉求：${socialGoal || '拓展高质量同频商业与生活连接'}

文案要求：
- 语气克制、真诚、有品位，像一位懂活动、愿意介绍朋友认识的主理人，说人话、不端架子。
- 禁用“顶尖、唯一、稳赚、保证认识大佬”等夸张词汇。
- 返回约 120 字以内的个性化入会建议（personalizedAdvice）、推荐首场体验场景（curatedFirstScene）以及 3 条具体的价值亮点（valueHighlights）。
`.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            '你是 BoL Club 首席社群主理人，负责为海归与跨行业专业人士提供精准、克制、具体的入会资格评估与会籍等级建议。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              eligibilityScore: {
                type: Type.INTEGER,
                description: '契合度评分（88 到 99 之间的整数）',
              },
              statusLabel: {
                type: Type.STRING,
                description: '简短的资格状态标签，例如：优先邀约入席 · 跨界高契合',
              },
              recommendedTierId: {
                type: Type.STRING,
                description: '推荐等级ID：free-guest, salon-pass, starlight, celestial 四选一',
              },
              recommendedTierName: {
                type: Type.STRING,
                description: '推荐等级中文名称，例如：星光年度会籍',
              },
              personalizedAdvice: {
                type: Type.STRING,
                description: '针对申请人职业背景的个性化入会与破圈建议（80-130字）',
              },
              curatedFirstScene: {
                type: Type.STRING,
                description: '推荐首场参加的线下活动场景名称',
              },
              valueHighlights: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: '3条针对该申请人职业阶段的会籍核心权益价值点',
              },
            },
            required: [
              'eligibilityScore',
              'statusLabel',
              'recommendedTierId',
              'recommendedTierName',
              'personalizedAdvice',
              'curatedFirstScene',
              'valueHighlights',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      const parsed = JSON.parse(rawText);

      const validTierIds: Array<MembershipTier['id']> = [
        'free-guest',
        'salon-pass',
        'starlight',
        'celestial',
      ];
      const safeTierId: MembershipTier['id'] = validTierIds.includes(parsed.recommendedTierId)
        ? parsed.recommendedTierId
        : fallbackResult.recommendedTierId;

      const assessment: AiMembershipAssessment = {
        eligibilityScore:
          typeof parsed.eligibilityScore === 'number'
            ? Math.max(85, Math.min(99, parsed.eligibilityScore))
            : fallbackResult.eligibilityScore,
        statusLabel: parsed.statusLabel || fallbackResult.statusLabel,
        recommendedTierId: safeTierId,
        recommendedTierName: parsed.recommendedTierName || fallbackResult.recommendedTierName,
        personalizedAdvice: parsed.personalizedAdvice || fallbackResult.personalizedAdvice,
        curatedFirstScene: parsed.curatedFirstScene || fallbackResult.curatedFirstScene,
        valueHighlights:
          Array.isArray(parsed.valueHighlights) && parsed.valueHighlights.length > 0
            ? parsed.valueHighlights.slice(0, 3)
            : fallbackResult.valueHighlights,
        evaluationSource: 'gemini-ai',
      };

      res.json(assessment);
    } catch (err) {
      console.warn('Gemini assessment fallback triggered:', err);
      res.json(fallbackResult);
    }
  });

  app.post('/api/sandbox/interest-clusters', async (req, res) => {
    const {
      careerData = '',
      industry = 'cross-border',
      rhythm = 'tipsy-salon',
      city = '深圳',
    } = req.body || {};

    const validCities: Array<Exclude<CityName, '全部城市'>> = ['深圳', '广州', '香港', '上海'];
    const safeCity: Exclude<CityName, '全部城市'> = validCities.includes(city) ? city : '深圳';

    const validIndustries: IndustryDomainId[] = [
      'ai-tech',
      'cross-border',
      'investment-family',
      'creative-arch',
      'biotech-health',
    ];
    const safeIndustry: IndustryDomainId = validIndustries.includes(industry)
      ? industry
      : 'cross-border';

    const validRhythms: SocialRhythmId[] = [
      'tipsy-salon',
      'closed-banquet',
      'coastal-sport',
      'frontier-forum',
    ];
    const safeRhythm: SocialRhythmId = validRhythms.includes(rhythm)
      ? rhythm
      : 'tipsy-salon';

    const fallbackMatrix = buildAiInterestClusterMatrix({
      careerData: String(careerData),
      industry: safeIndustry,
      rhythm: safeRhythm,
      city: safeCity,
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json(fallbackMatrix);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `
你是 BoL Club（万象博联）的首席社交图谱与兴趣聚类主理人。
请根据以下用户的职业数据与社交偏好，生成 4 个高契合度的「连接兴趣聚类（Interest Clusters）」以及对应的社交推荐矩阵数据。

用户信息：
- 常驻城市：${safeCity}
- 所属行业领域：${safeIndustry}
- 偏好社交节奏：${safeRhythm}
- 职业背景与关注焦点：${careerData || '海归创业者与跨行业核心决策者'}

要求：
- 语气克制、具体、有质感，符合深圳/广州/香港/上海海归与创业菁英的真实交流语境。
- 严格返回 4 个聚类项（clusters），每个包含：
  - clusterName（10字以内的中文聚类名）
  - enTag（简短英文副标）
  - affinityPct（90 到 99 之间的整数）
  - peerPersona（该聚类内典型同频成员画像）
  - catalystTopic（现场破冰与深度共鸣议题）
  - bridgeTopic（连接路径上的核心价值桥梁，如：柔性供应链 × 海外渠道共创）
`.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            '你是 BoL Club 首席社交图谱主理人，负责根据职业背景生成精准、克制的 4 维社交兴趣聚类矩阵。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              clusterThemeTitle: {
                type: Type.STRING,
                description: '本次兴趣聚类的总标题',
              },
              overallResonance: {
                type: Type.INTEGER,
                description: '整体同频指数（92 到 99 之间）',
              },
              clusters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    clusterName: { type: Type.STRING },
                    enTag: { type: Type.STRING },
                    affinityPct: { type: Type.INTEGER },
                    peerPersona: { type: Type.STRING },
                    catalystTopic: { type: Type.STRING },
                    bridgeTopic: { type: Type.STRING },
                  },
                  required: [
                    'clusterName',
                    'enTag',
                    'affinityPct',
                    'peerPersona',
                    'catalystTopic',
                    'bridgeTopic',
                  ],
                },
              },
            },
            required: ['clusterThemeTitle', 'overallResonance', 'clusters'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      const parsed = JSON.parse(rawText);

      if (!Array.isArray(parsed.clusters) || parsed.clusters.length < 4) {
        res.json(fallbackMatrix);
        return;
      }

      const mergedClusters = fallbackMatrix.clusters.map((baseCluster, idx) => {
        const aiItem = parsed.clusters[idx] || {};
        return {
          ...baseCluster,
          clusterName: aiItem.clusterName || baseCluster.clusterName,
          enTag: aiItem.enTag || baseCluster.enTag,
          affinityPct:
            typeof aiItem.affinityPct === 'number'
              ? Math.max(88, Math.min(99, aiItem.affinityPct))
              : baseCluster.affinityPct,
          peerPersona: aiItem.peerPersona || baseCluster.peerPersona,
          catalystTopic: aiItem.catalystTopic || baseCluster.catalystTopic,
        };
      }) as AiInterestClusterMatrix['clusters'];

      const mergedPaths = fallbackMatrix.connectionPaths.map((basePath, idx) => {
        const aiItem = parsed.clusters[idx] || {};
        return {
          ...basePath,
          toLabel: mergedClusters[idx].clusterName,
          bridgeTopic: aiItem.bridgeTopic || basePath.bridgeTopic,
          synergyStrength: mergedClusters[idx].affinityPct,
        };
      }) as AiInterestClusterMatrix['connectionPaths'];

      const resultMatrix: AiInterestClusterMatrix = {
        clusterThemeTitle: parsed.clusterThemeTitle || fallbackMatrix.clusterThemeTitle,
        careerInputSummary: fallbackMatrix.careerInputSummary,
        overallResonance:
          typeof parsed.overallResonance === 'number'
            ? Math.max(90, Math.min(99, parsed.overallResonance))
            : fallbackMatrix.overallResonance,
        clusters: mergedClusters,
        connectionPaths: mergedPaths,
        evaluationSource: 'gemini-ai',
      };

      res.json(resultMatrix);
    } catch (err) {
      console.warn('Gemini interest clusters fallback triggered:', err);
      res.json(fallbackMatrix);
    }
  });

  app.post('/api/sandbox/deep-fit-report', async (req, res) => {
    const {
      careerDescription = '',
      city = '深圳',
      industry = 'ai-tech',
      rhythm = 'tipsy-salon',
    } = req.body || {};

    const validCities: Array<Exclude<CityName, '全部城市'>> = ['深圳', '广州', '香港', '上海'];
    const safeCity: Exclude<CityName, '全部城市'> = validCities.includes(city) ? city : '深圳';

    const validIndustries: IndustryDomainId[] = [
      'ai-tech',
      'cross-border',
      'investment-family',
      'creative-arch',
      'biotech-health',
    ];
    const safeIndustry: IndustryDomainId = validIndustries.includes(industry)
      ? industry
      : 'ai-tech';

    const validRhythms: SocialRhythmId[] = [
      'tipsy-salon',
      'closed-banquet',
      'coastal-sport',
      'frontier-forum',
    ];
    const safeRhythm: SocialRhythmId = validRhythms.includes(rhythm)
      ? rhythm
      : 'tipsy-salon';

    const fallbackReport = buildDeterministicDeepFitReport({
      careerDescription: String(careerDescription),
      city: safeCity,
      industry: safeIndustry,
      rhythm: safeRhythm,
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json(fallbackReport);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `
你是 BoL Club（万象博联）的首席圈层策展主理人。
请根据用户模拟输入的「个人职业描述」，生成一份针对 BoL 现有活跃圈层的《深度契合度分析报告》。

用户输入：
- 常驻城市：${safeCity}
- 个人职业描述：${careerDescription || '海归创业者与跨行业核心主理人'}
- 关注领域：${safeIndustry}
- 社交节奏偏好：${safeRhythm}

要求：
- 语气克制、真诚、具体，像熟悉俱乐部每位成员背景的主理人在做私密案头分析，禁用浮夸口号。
- 返回：
  - overallFitScore（92-99 之间的整数）
  - primaryMatchedCircle（最核心匹配的 BoL 活跃圈层名称）
  - executiveVerdict（80-110字的主理人深度契合度综述）
  - circleBreakdown（严格 3 个现有活跃圈层匹配明细，每项包含 circleName、enTag、fitPct、activeMemberComposition、resonanceReason）
  - whatYouBring（您能为该圈层带来的独特价值）
  - whatYouGain（您能从该圈层直接获得的资源或视野支持）
  - recommendedEntryScene（首场推荐入席的线下活动场景）
  - icebreakerTopic（为您定制的破冰切入话题）
`.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            '你是 BoL Club 首席圈层策展主理人，负责根据用户的个人职业描述生成针对 BoL 现有活跃圈层的深度契合度分析报告。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallFitScore: { type: Type.INTEGER },
              primaryMatchedCircle: { type: Type.STRING },
              executiveVerdict: { type: Type.STRING },
              circleBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    circleName: { type: Type.STRING },
                    enTag: { type: Type.STRING },
                    fitPct: { type: Type.INTEGER },
                    activeMemberComposition: { type: Type.STRING },
                    resonanceReason: { type: Type.STRING },
                  },
                  required: [
                    'circleName',
                    'enTag',
                    'fitPct',
                    'activeMemberComposition',
                    'resonanceReason',
                  ],
                },
              },
              whatYouBring: { type: Type.STRING },
              whatYouGain: { type: Type.STRING },
              recommendedEntryScene: { type: Type.STRING },
              icebreakerTopic: { type: Type.STRING },
            },
            required: [
              'overallFitScore',
              'primaryMatchedCircle',
              'executiveVerdict',
              'circleBreakdown',
              'whatYouBring',
              'whatYouGain',
              'recommendedEntryScene',
              'icebreakerTopic',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      const parsed = JSON.parse(rawText);

      if (!Array.isArray(parsed.circleBreakdown) || parsed.circleBreakdown.length < 3) {
        res.json(fallbackReport);
        return;
      }

      const mergedCircles = fallbackReport.circleBreakdown.map((baseItem, idx) => {
        const aiItem = parsed.circleBreakdown[idx] || {};
        return {
          circleCode: `CIRCLE 0${idx + 1}`,
          circleName: aiItem.circleName || baseItem.circleName,
          enTag: aiItem.enTag || baseItem.enTag,
          fitPct:
            typeof aiItem.fitPct === 'number'
              ? Math.max(88, Math.min(99, aiItem.fitPct))
              : baseItem.fitPct,
          activeMemberComposition:
            aiItem.activeMemberComposition || baseItem.activeMemberComposition,
          resonanceReason: aiItem.resonanceReason || baseItem.resonanceReason,
        };
      }) as AiDeepCircleFitReport['circleBreakdown'];

      const finalReport: AiDeepCircleFitReport = {
        ...fallbackReport,
        overallFitScore:
          typeof parsed.overallFitScore === 'number'
            ? Math.max(90, Math.min(99, parsed.overallFitScore))
            : fallbackReport.overallFitScore,
        primaryMatchedCircle:
          parsed.primaryMatchedCircle || fallbackReport.primaryMatchedCircle,
        executiveVerdict: parsed.executiveVerdict || fallbackReport.executiveVerdict,
        circleBreakdown: mergedCircles,
        valueExchange: {
          whatYouBring: parsed.whatYouBring || fallbackReport.valueExchange.whatYouBring,
          whatYouGain: parsed.whatYouGain || fallbackReport.valueExchange.whatYouGain,
        },
        recommendedEntryScene:
          parsed.recommendedEntryScene || fallbackReport.recommendedEntryScene,
        icebreakerTopic: parsed.icebreakerTopic || fallbackReport.icebreakerTopic,
        evaluationSource: 'gemini-ai',
      };

      res.json(finalReport);
    } catch (err) {
      console.warn('Gemini deep fit report fallback triggered:', err);
      res.json(fallbackReport);
    }
  });

  app.post('/api/curator/mood-dialogue', async (req, res) => {
    const {
      city = '深圳',
      round1OptionId = 'r1-tipsy-unwind',
      round2OptionId = 'r2-ai-global',
      round3OptionId = 'r3-two-confidants',
      customMoodNote = '',
    } = req.body || {};

    const validCities: Array<Exclude<CityName, '全部城市'>> = ['深圳', '广州', '香港', '上海'];
    const safeCity: Exclude<CityName, '全部城市'> = validCities.includes(city) ? city : '深圳';

    const fallbackResult = evaluateCuratorMoodDialogue({
      city: safeCity,
      round1OptionId: String(round1OptionId),
      round2OptionId: String(round2OptionId),
      round3OptionId: String(round3OptionId),
      customMoodNote: String(customMoodNote),
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json(fallbackResult);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const r1 =
        CURATOR_DIALOGUE_QUESTIONS[0].options.find((o) => o.id === round1OptionId) ||
        CURATOR_DIALOGUE_QUESTIONS[0].options[0];
      const r2 =
        CURATOR_DIALOGUE_QUESTIONS[1].options.find((o) => o.id === round2OptionId) ||
        CURATOR_DIALOGUE_QUESTIONS[1].options[0];
      const r3 =
        CURATOR_DIALOGUE_QUESTIONS[2].options.find((o) => o.id === round3OptionId) ||
        CURATOR_DIALOGUE_QUESTIONS[2].options[0];

      const eventsCatalog = CURATED_EVENTS.map(
        (ev) =>
          `- ID: "${ev.id}" | 标题: ${ev.title} (${ev.city} · ${ev.seriesLabel}) | 简介: ${ev.formula.whatIsIt}`
      ).join('\n');

      const prompt = `
你是 BoL Club（万象博联）的首席社群主理人。你刚与一位来访者在会所前厅完成了三轮深度心境对话，请为对方挑选最契合当下心境的 BoL 线下活动，并写一段温暖、克制、有品位的主理人私语回信。

用户在三轮深度提问中的回答：
- 意向城市：${safeCity}
- 第 1 轮（当下夜晚能量场）：${r1.label}（${r1.subtitle}）
- 第 2 轮（最令眼睛发亮的深夜议题）：${r2.label}（${r2.subtitle}）
- 第 3 轮（散场时最想带走的余韵）：${r3.label}（${r3.subtitle}）
- 补充心境留言：${customMoodNote || '未额外填写'}

当前可选的 BoL 活动档期列表（primaryEventId 必须从以下 ID 中选择）：
${eventsCatalog}

要求：
- 语气真诚、松弛、有分寸，像一位审美在线的老友主理人在深夜吧台旁娓娓道来。
- 返回 JSON 格式：moodPersonaTitle、resonanceScore（93-99）、curatorWhisperReply（70-110字）、moodMatchReason（60-90字）、curatedIcebreaker（40-70字）、primaryEventId。
`.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            '你是 BoL Club 首席社群主理人，擅长通过三轮深度心境提问洞察来访者当下的社交状态，并匹配最合适的私密酒会、长桌私宴或帆船航行。',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              moodPersonaTitle: { type: Type.STRING },
              resonanceScore: { type: Type.INTEGER },
              curatorWhisperReply: { type: Type.STRING },
              moodMatchReason: { type: Type.STRING },
              curatedIcebreaker: { type: Type.STRING },
              primaryEventId: { type: Type.STRING },
            },
            required: [
              'moodPersonaTitle',
              'resonanceScore',
              'curatorWhisperReply',
              'moodMatchReason',
              'curatedIcebreaker',
              'primaryEventId',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      const parsed = JSON.parse(rawText);

      const matchedPrimary =
        CURATED_EVENTS.find((ev) => ev.id === parsed.primaryEventId) ||
        fallbackResult.primaryEvent;

      const aiResult: CuratorMoodRecommendationResult = {
        moodPersonaTitle: parsed.moodPersonaTitle || fallbackResult.moodPersonaTitle,
        resonanceScore:
          typeof parsed.resonanceScore === 'number'
            ? Math.max(92, Math.min(99, parsed.resonanceScore))
            : fallbackResult.resonanceScore,
        curatorWhisperReply:
          parsed.curatorWhisperReply || fallbackResult.curatorWhisperReply,
        moodMatchReason: parsed.moodMatchReason || fallbackResult.moodMatchReason,
        curatedIcebreaker: parsed.curatedIcebreaker || fallbackResult.curatedIcebreaker,
        primaryEvent: matchedPrimary,
        secondaryEvent: fallbackResult.secondaryEvent,
        evaluationSource: 'gemini-ai',
      };

      res.json(aiResult);
    } catch (err) {
      console.warn('Gemini curator mood dialogue fallback triggered:', err);
      res.json(fallbackResult);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BoL Club full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
