// Saheli AI — conversational AI companion with safety-first response engine
// Calls a Supabase Edge Function that securely proxies to an AI provider.
// Safety checks (urgent symptoms, crisis, diagnosis, medication) run client-side first.
// Falls back to curated content retrieval when the AI service is unavailable.

import { articles, getArticleById, type LearnArticle } from './content';

export interface SaheliResponse {
  text: string;
  sources: { name: string; url: string }[];
  relatedArticleIds: string[];
  isUrgent: boolean;
  urgentMessage?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Urgent symptom keywords that require immediate care guidance
const URGENT_KEYWORDS = [
  'severe pain', 'unbearable pain', 'sudden severe', 'fainting', 'faint',
  'can\'t breathe', 'chest pain', 'soaking through', 'soaking a pad',
  'passing out', 'loss of consciousness', 'heavy bleeding', 'very heavy',
  'blood clot', 'large clots', 'severe dizziness',
  'high fever', 'vomiting blood', 'severe weakness',
];

// Crisis keywords — self-harm, suicidal ideation
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself',
  'don\'t want to live', 'dont want to live', 'want to die', 'ending it all',
  'no reason to live', 'better off dead',
];

// Diagnosis-seeking keywords
const DIAGNOSIS_KEYWORDS = [
  'do i have', 'am i pregnant', 'is it pcos', 'do i have pcos',
  'is it endometriosis', 'do i have endometriosis', 'am i anemic',
  'diagnose me', 'what condition do i have', 'is something wrong with me',
  'confirm pregnancy', 'confirm ovulation', 'am i fertile', 'am i ovulating',
];

// Medication dosage keywords
const MEDICATION_KEYWORDS = [
  'how many pills', 'what dose', 'how much medicine', 'how much ibuprofen',
  'how many tablets', 'max dose', 'maximum dose', 'overdose', 'mixing medications',
];

// Question-to-article mapping for retrieval
const KEYWORD_MAP: { keywords: string[]; articleIds: string[] }[] = [
  {
    keywords: ['late period', 'missed period', 'period late', 'no period', 'delayed period', 'skip period', 'missed my period'],
    articleIds: ['late-period', 'irregular-cycles'],
  },
  {
    keywords: ['irregular', 'irregular cycle', 'irregular period', 'unpredictable', 'cycle varies', 'cycle length changing'],
    articleIds: ['irregular-cycles', 'what-is-menstruation'],
  },
  {
    keywords: ['cramp', 'pain', 'painful period', 'period pain', 'dysmenorrhea', 'stomach pain', 'belly pain', 'pelvic pain'],
    articleIds: ['period-pain', 'when-to-seek-care'],
  },
  {
    keywords: ['first period', 'menarche', 'started my period', 'daughter period', 'young period', 'early period', 'teenager period'],
    articleIds: ['first-period', 'what-is-menstruation'],
  },
  {
    keywords: ['product', 'pad', 'tampon', 'cup', 'menstrual cup', 'period underwear', 'sanitary', 'napkin', 'which product'],
    articleIds: ['products-safe-use', 'hygiene-basics'],
  },
  {
    keywords: ['hygiene', 'clean', 'wash', 'infection', 'smell', 'odor', 'discharge', 'itching'],
    articleIds: ['hygiene-basics', 'products-safe-use'],
  },
  {
    keywords: ['pcos', 'polycystic', 'ovary syndrome', 'cyst'],
    articleIds: ['pcos-basics', 'irregular-cycles'],
  },
  {
    keywords: ['endometriosis', 'endo', 'endometrioma'],
    articleIds: ['endometriosis-basics', 'period-pain'],
  },
  {
    keywords: ['anemia', 'iron', 'tired', 'fatigue', 'weak', 'pale', 'dizzy'],
    articleIds: ['anemia-basics', 'when-to-seek-care'],
  },
  {
    keywords: ['myth', 'myths', 'facts', 'misconception', 'false', 'rumor', 'superstition'],
    articleIds: ['myths-facts'],
  },
  {
    keywords: ['mood', 'emotional', 'sad', 'anxious', 'irritable', 'pms', 'pmdd', 'depression', 'mental health', 'stress'],
    articleIds: ['emotional-wellbeing'],
  },
  {
    keywords: ['pregnant', 'pregnancy', 'conceive', 'fertility', 'conception'],
    articleIds: ['myths-facts', 'late-period'],
  },
  {
    keywords: ['heavy', 'heavy bleeding', 'heavy flow', 'too much blood', 'bleeding a lot'],
    articleIds: ['when-to-seek-care', 'anemia-basics'],
  },
  {
    keywords: ['when to see', 'when to go', 'doctor', 'medical care', 'emergency', 'seek help', 'worried', 'should i be worried', 'serious'],
    articleIds: ['when-to-seek-care', 'symptom-guidance'],
  },
  {
    keywords: ['stigma', 'shame', 'embarrassed', 'talk about', 'taboo', 'culturally', 'society'],
    articleIds: ['emotional-wellbeing', 'myths-facts'],
  },
  {
    keywords: ['safe use', 'toxic shock', 'tss', 'tampon safety', 'change tampon'],
    articleIds: ['products-safe-use'],
  },
  {
    keywords: ['cycle', 'menstrual cycle', 'what is menstruation', 'how does period work', 'period work'],
    articleIds: ['what-is-menstruation'],
  },
  {
    keywords: ['affordable', 'free products', 'cost', 'money', 'cheap', 'access', 'help getting'],
    articleIds: [],
  },
];

function checkUrgent(query: string): boolean {
  const q = query.toLowerCase();
  return URGENT_KEYWORDS.some(k => q.includes(k));
}

function checkCrisis(query: string): boolean {
  const q = query.toLowerCase();
  return CRISIS_KEYWORDS.some(k => q.includes(k));
}

function checkDiagnosis(query: string): boolean {
  const q = query.toLowerCase();
  return DIAGNOSIS_KEYWORDS.some(k => q.includes(k));
}

function checkMedication(query: string): boolean {
  const q = query.toLowerCase();
  return MEDICATION_KEYWORDS.some(k => q.includes(k));
}

function retrieveArticles(query: string): LearnArticle[] {
  const q = query.toLowerCase();
  const matchedIds = new Set<string>();

  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some(k => q.includes(k))) {
      entry.articleIds.forEach(id => matchedIds.add(id));
    }
  }

  const direct = articles.filter(a =>
    a.title.en.toLowerCase().includes(q) ||
    a.summary.en.toLowerCase().includes(q) ||
    a.sections.some(s => s.en.heading.toLowerCase().includes(q) || s.en.body.toLowerCase().includes(q)) ||
    a.title.hi.includes(q) ||
    a.summary.hi.includes(q) ||
    a.sections.some(s => s.hi.heading.includes(q) || s.hi.body.includes(q))
  );
  direct.forEach(a => matchedIds.add(a.id));

  return Array.from(matchedIds).map(id => getArticleById(id)).filter(Boolean) as LearnArticle[];
}

// Empathetic fallback response patterns for emotional support conversations
// Used when the AI service is unavailable, so the chat still feels supportive
const EMOTIONAL_PATTERNS: { keywords: string[]; responses: string[] }[] = [
  {
    keywords: ['listen', 'vent', 'someone to talk', 'need to talk', 'just want to talk'],
    responses: [
      "I'm here to listen, lovely. 💗 You don't have to make it sound neat or explain everything perfectly. Tell me what's on your mind.",
      "I'm right here with you. Whatever you're feeling, this is a safe space to let it out. What's been going on? 🌷",
    ],
  },
  {
    keywords: ['overwhelmed', 'too much', 'can\'t cope', 'cant cope', 'drowning', 'everything at once'],
    responses: [
      "It sounds like you're carrying a lot right now, and that's completely valid. 💗 You don't have to figure everything out at once. What feels the heaviest right now?",
      "When everything piles up, it's okay to just pause and breathe. You're not failing — you're human. Would it help to talk through what's on your plate, or do you just need a moment to be heard? 🫶",
    ],
  },
  {
    keywords: ['sad', 'low', 'down', 'depressed', 'unhappy', 'miserable', 'empty'],
    responses: [
      "I'm sorry today feels so heavy, lovely. 💗 You don't have to figure everything out right now. Do you want to tell me what's been going on, or would you prefer a little distraction?",
      "It takes courage to say that. I'm here with you in this. Sometimes just naming how we feel is a small step forward. What's been pulling you down? 🌷",
    ],
  },
  {
    keywords: ['anxious', 'anxiety', 'worried', 'nervous', 'panic', 'stressed', 'stress'],
    responses: [
      "Anxiety can feel so overwhelming, like your mind won't switch off. 💗 You're not alone in this. Would it help to talk about what's making you anxious, or would you like a quick grounding exercise?",
      "I hear you. Stress has a way of making everything feel urgent. Let's take a breath together. What's the thing that's worrying you most right now? 🌸",
    ],
  },
  {
    keywords: ['lonely', 'alone', 'no one', 'nobody', 'isolated', 'left out'],
    responses: [
      "Feeling lonely is one of the hardest things, and it doesn't mean you're unlovable. 💗 I'm here with you right now. Do you want to talk about what's making you feel this way?",
      "You're not alone in feeling alone, if that makes sense. 🫶 I'm right here. Sometimes loneliness comes from feeling unseen — would you like to tell me more about what's happening?",
    ],
  },
  {
    keywords: ['useless', 'worthless', 'not good enough', 'failure', 'failed', 'failure', 'can\'t do anything', 'cant do anything', 'not enough'],
    responses: [
      "That result must hurt, especially if you were hoping for something different. But one moment doesn't define your intelligence or your future. 🫶 Do you want to talk about what happened, or shall we work out your next step together?",
      "I hear you, and I want you to know — you are enough, exactly as you are. 💗 One setback doesn't erase everything you're capable of. What happened? I'm here to listen.",
    ],
  },
  {
    keywords: ['feel better', 'cheer up', 'sad and want', 'help me feel', 'having a bad day', 'rough day', 'tough day', 'bad day'],
    responses: [
      "I'm sorry today has been hard. 💗 Sometimes the bravest thing is just being gentle with yourself. Would you like to talk about it, or would a little distraction help?",
      "Bad days don't make you a bad person. You're doing the best you can, and that's enough. 🌷 What would feel comforting right now — talking it through, or something to lift your spirits?",
    ],
  },
  {
    keywords: ['friend', 'fight', 'argument', 'betrayed', 'left out', 'bullied', 'ignored'],
    responses: [
      "Friendship problems can hurt so deeply because friends matter to us. 💗 Do you want to tell me what happened? I'm here to listen without judgment.",
      "I'm sorry you're going through this. Relationships are complicated, and it's okay to feel hurt or confused. What happened between you? 🌸",
    ],
  },
  {
    keywords: ['exam', 'college', 'study', 'work stress', 'deadline', 'pressure', 'grades', 'test'],
    responses: [
      "That pressure sounds really intense. 💗 Remember that your worth isn't tied to one exam or one deadline. Would you like to talk through what's stressing you, or brainstorm some ways to manage it?",
      "It's completely understandable to feel stressed about this. What would help most right now — talking it out, or coming up with a small plan together? 🌷",
    ],
  },
  {
    keywords: ['body image', 'ugly', 'fat', 'thin', 'appearance', 'look', 'hate my body', 'insecure'],
    responses: [
      "I hear you, and I want you to know — your body deserves kindness, not criticism. 💗 The way you look is the smallest part of who you are. What's been making you feel this way?",
      "Body image struggles are so common and so painful. You are worthy exactly as you are. 🫶 Would you like to talk about what's been bothering you?",
    ],
  },
  {
    keywords: ['tired', 'exhausted', 'burnt out', 'burnout', 'no energy', 'drained'],
    responses: [
      "It sounds like you're running on empty, lovely. 💗 Rest isn't a reward — it's a need. What's been draining you the most?",
      "Being that tired is your body asking for care. You're allowed to rest without earning it first. 🌸 Would you like to talk about what's been wearing you out?",
    ],
  },
];

function matchEmotionalResponse(query: string): string | null {
  const q = query.toLowerCase();
  for (const pattern of EMOTIONAL_PATTERNS) {
    if (pattern.keywords.some(k => q.includes(k))) {
      return pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
    }
  }
  return null;
}

function buildFallbackResponse(query: string): string {
  // Try emotional support patterns first
  const emotionalReply = matchEmotionalResponse(query);
  if (emotionalReply) {
    return emotionalReply;
  }

  // Then try article-based responses
  const matchedArticles = retrieveArticles(query);
  if (matchedArticles.length === 0) {
    return "I'm here for you, lovely. 💗 I might not have the perfect answer right now, but I'm always happy to listen. Could you tell me a little more about what's on your mind, or try exploring the Learning Hub for helpful articles?";
  }

  const primary = matchedArticles[0];
  let text = primary.summary.en + '\n\n';

  const firstSection = primary.sections[0];
  if (firstSection) {
    text += firstSection.en.body;
  }

  if (matchedArticles.length > 1) {
    text += '\n\nYou can learn more about this in the Learning Hub.';
  }

  return text;
}

// Urgent care response
function urgentResponse(): SaheliResponse {
  return {
    text: "What you're describing may need prompt medical attention. Based on general health guidance, severe or sudden symptoms during your period should not be dismissed. Please contact a healthcare provider or emergency services right away.\n\nIf you are experiencing: severe pain that is different from your usual cramps, very heavy bleeding (soaking through a pad every hour for 2-3 hours), fainting, fever, or difficulty breathing — seek emergency care immediately.\n\nDo not wait. Your safety comes first. 💗",
    sources: [
      { name: 'Mayo Clinic — When to seek care', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047190' },
      { name: 'NHS — Emergency care', url: 'https://www.nhs.uk/using-the-nhs/nhs-services/urgent-and-emergency-care/' },
    ],
    relatedArticleIds: ['when-to-seek-care', 'period-pain'],
    isUrgent: true,
    urgentMessage: 'This sounds like it may need urgent care. Please contact a healthcare provider or emergency services now.',
  };
}

// Crisis response
function crisisResponse(): SaheliResponse {
  return {
    text: "I hear you, and I'm really glad you're talking to me right now. 💗 What you're feeling matters, and you don't have to carry this alone.\n\nIf you're in immediate danger or having thoughts of self-harm, please reach out to someone right now:\n\n• In India: iCall at 9152987821 or AASRA at 9820466726\n• Emergency services: 112 (India), 911 (US), 999 (UK)\n• Or go to your nearest emergency room\n\nYou deserve support from someone who can be there for you. A trusted friend, family member, teacher, or counselor can help. Please don't go through this alone right now.",
    sources: [
      { name: 'iCall Helpline (India)', url: 'https://icallhelpline.org' },
      { name: 'AASRA Helpline (India)', url: 'https://www.aasra.info' },
      { name: 'International Association for Suicide Prevention', url: 'https://www.iasp.info/resources/Crisis_Centres/' },
    ],
    relatedArticleIds: ['emotional-wellbeing'],
    isUrgent: true,
    urgentMessage: 'If you are in immediate danger or having thoughts of self-harm, please contact emergency services or a crisis helpline right now. You matter.',
  };
}

// Diagnosis-seeking response (still sends to AI for the conversational part, but with guardrails)
function diagnosisGuardrail(): string {
  return "I can't diagnose conditions or determine your hormonal or pregnancy status — that requires a proper medical evaluation by a healthcare professional. What I can share is general educational information.\n\nIf you're concerned about a specific condition, please speak with a healthcare provider. They can perform the right tests and give you an accurate answer. Self-diagnosing from an app or online information is not reliable.";
}

// Medication dosage guardrail
function medicationGuardrail(): string {
  return "I can't provide specific medication dosing instructions — the right dose depends on your individual health, other medications, and medical history. For safe medication guidance:\n\n• Follow the instructions on the medicine package\n• Consult a pharmacist — they can advise you for free\n• Talk to your healthcare provider if you have health conditions or take other medications\n\nNever exceed the recommended dose on the label without professional advice.";
}

// Call the edge function for AI-powered conversational responses
async function callAI(
  messages: ConversationMessage[],
  safetyContext?: string
): Promise<string> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/saheli-chat`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  };

  // Add safety context as a system message if present
  const apiMessages = safetyContext
    ? [{ role: 'assistant', content: safetyContext }, ...messages]
    : messages;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages: apiMessages }),
  });

  const data = await response.json();

  // The edge function returns a `reply` field even in error responses (503, 502)
  if (data.reply && typeof data.reply === 'string') {
    return data.reply;
  }

  if (!response.ok) {
    throw new Error(`AI service returned ${response.status}`);
  }

  throw new Error('AI service returned no reply');
}

/**
 * Main entry point — sends a message to Saheli AI.
 * Runs safety pre-checks first, then calls the edge function for conversational responses.
 * Falls back to curated content if the AI service is unavailable.
 */
export async function getSaheliResponse(
  query: string,
  conversationHistory?: ConversationMessage[]
): Promise<SaheliResponse> {
  const isUrgent = checkUrgent(query);
  const isCrisis = checkCrisis(query);
  const isDiagnosis = checkDiagnosis(query);
  const isMedication = checkMedication(query);
  const matchedArticles = retrieveArticles(query);

  // Safety-first: urgent symptoms get immediate care guidance
  if (isUrgent && !isCrisis) {
    return urgentResponse();
  }

  // Safety-first: crisis gets immediate compassionate response with resources
  if (isCrisis) {
    return crisisResponse();
  }

  // Build safety context for the AI
  let safetyContext: string | undefined;
  if (isDiagnosis) {
    safetyContext = diagnosisGuardrail();
  } else if (isMedication) {
    safetyContext = medicationGuardrail();
  }

  // Build conversation messages for the AI
  const messages: ConversationMessage[] = [
    ...(conversationHistory || []),
    { role: 'user', content: query },
  ];

  try {
    const aiReply = await callAI(messages, safetyContext);

    return {
      text: aiReply,
      sources: matchedArticles.length > 0 ? matchedArticles[0].sources : [],
      relatedArticleIds: matchedArticles.slice(0, 3).map(a => a.id),
      isUrgent: false,
    };
  } catch {
    // Fallback to curated content if AI service is unavailable
    let text = buildFallbackResponse(query);

    if (isDiagnosis) {
      text = diagnosisGuardrail() + '\n\n' + (matchedArticles[0]?.summary.en || '');
    } else if (isMedication) {
      text = medicationGuardrail();
    }

    return {
      text,
      sources: matchedArticles.length > 0 ? matchedArticles[0].sources : [],
      relatedArticleIds: matchedArticles.slice(0, 3).map(a => a.id),
      isUrgent: false,
    };
  }
}

// Suggested conversation starters for the chat interface
export const SUGGESTED_QUESTIONS = [
  '💗 I need someone to listen',
  '🌸 Help me understand my period',
  '🫶 I\'m feeling overwhelmed',
  '🩷 My period is late',
  '✨ Help me feel better today',
  '🌷 Tell me about menstrual hygiene',
];

// Symptom guidance data for the "Should I be worried?" section
export interface SymptomGuidance {
  symptom: string;
  generalInfo: string;
  seeDoctor: string[];
  urgent: string[];
}

export const symptomGuidanceData: SymptomGuidance[] = [
  {
    symptom: 'Cramps',
    generalInfo: 'Mild to moderate cramps during your period are common. They are caused by the uterus contracting to shed its lining. A heating pad, gentle movement, and over-the-counter pain relief can help.',
    seeDoctor: ['Pain that does not improve with over-the-counter medication', 'Pain that interferes with daily activities', 'Pain that worsens over several cycles'],
    urgent: ['Sudden, severe pain that is different from your usual cramps', 'Pain with fever, vomiting, or fainting'],
  },
  {
    symptom: 'Heavy bleeding',
    generalInfo: 'Some people naturally have heavier flows. However, very heavy bleeding can lead to anemia and may indicate an underlying condition.',
    seeDoctor: ['Soaking through a pad or tampon every 2 hours', 'Periods lasting longer than 7 days', 'Passing large blood clots', 'Feeling tired, weak, or dizzy with periods'],
    urgent: ['Soaking through a pad every hour for 2-3 hours', 'Bleeding with severe dizziness or fainting', 'Bleeding with chest pain or shortness of breath'],
  },
  {
    symptom: 'Irregular cycles',
    generalInfo: 'Cycle length can vary, especially in the first few years after your period begins, during stress, or during perimenopause. Some variation is normal.',
    seeDoctor: ['Cycles consistently shorter than 21 days or longer than 35 days', 'Missing 3 or more periods in a row', 'Sudden change in your established cycle pattern'],
    urgent: ['Sudden severe bleeding after a missed period', 'Severe pain with an irregular cycle'],
  },
  {
    symptom: 'Severe pain',
    generalInfo: 'Period pain that is severe enough to interfere with daily life is not something to simply endure. It may be a sign of an underlying condition like endometriosis.',
    seeDoctor: ['Pain that makes you miss school or work', 'Pain that does not respond to medication', 'Pain that has gotten worse over time', 'Pain during sex or between periods'],
    urgent: ['Sudden, unbearable abdominal pain', 'Pain with fever, vomiting, or fainting', 'Pain after surgery or pregnancy'],
  },
  {
    symptom: 'Mood changes',
    generalInfo: 'Hormonal changes can affect mood. Some emotional shifts before your period are common. Significant mood changes that disrupt your life may need attention.',
    seeDoctor: ['Mood changes that significantly affect relationships or work', 'Feeling hopeless or unable to cope', 'Mood changes that occur only before your period and are severe'],
    urgent: ['Thoughts of self-harm', 'Feeling completely unable to function', 'Severe anxiety or panic attacks'],
  },
  {
    symptom: 'Fatigue',
    generalInfo: 'Feeling tired during your period can be normal, especially with heavy flow. Persistent fatigue could be a sign of iron deficiency.',
    seeDoctor: ['Persistent tiredness that does not improve with rest', 'Fatigue with heavy periods', 'Pale skin, dizziness, or shortness of breath'],
    urgent: ['Severe weakness with heavy bleeding', 'Fainting or near-fainting', 'Chest pain or rapid heartbeat'],
  },
  {
    symptom: 'Bleeding between periods',
    generalInfo: 'Spotting between periods can happen occasionally and may be harmless. However, persistent or unexplained bleeding between periods should be evaluated.',
    seeDoctor: ['Bleeding between periods that happens more than once', 'Bleeding after sex', 'Any unusual bleeding pattern that is new for you'],
    urgent: ['Heavy bleeding between periods', 'Bleeding with severe pain or fever'],
  },
  {
    symptom: 'Nausea or vomiting',
    generalInfo: 'Some people experience mild nausea with period pain. More severe nausea may need evaluation.',
    seeDoctor: ['Nausea that prevents eating or drinking for more than a day', 'Vomiting with period pain that is new for you'],
    urgent: ['Inability to keep any fluids down', 'Vomiting with severe pain and fever', 'Signs of dehydration'],
  },
];
