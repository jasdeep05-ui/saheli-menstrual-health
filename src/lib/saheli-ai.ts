// Saheli AI — curated knowledge base with safety-first response engine
// Uses retrieval from educational content + safety rules
// No external AI API keys are exposed. Falls back to curated content when no API is configured.

import { articles, getArticleById, type LearnArticle } from './content';

export interface SaheliResponse {
  text: string;
  sources: { name: string; url: string }[];
  relatedArticleIds: string[];
  isUrgent: boolean;
  urgentMessage?: string;
}

// Urgent symptom keywords that require immediate care guidance
const URGENT_KEYWORDS = [
  'severe pain', 'unbearable pain', 'sudden severe', 'fainting', 'faint',
  'can\'t breathe', 'chest pain', 'soaking through', 'soaking a pad',
  'passing out', 'loss of consciousness', 'heavy bleeding', 'very heavy',
  'blood clot', 'large clots', 'dizziness', 'severe dizziness',
  'high fever', 'vomiting blood', 'severe weakness',
];

// Diagnosis-seeking keywords
const DIAGNOSIS_KEYWORDS = [
  'do i have', 'am i pregnant', 'is it pcos', 'do i have pcos',
  'is it endometriosis', 'do i have endometriosis', 'am i anemic',
  'diagnose me', 'what condition do i have', 'is something wrong with me',
  'confirm pregnancy', 'confirm ovulation', 'am i fertile', 'am i ovulating',
  'what hormone', 'hormone levels',
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
    articleIds: ['when-to-seek-care', 'symptom-guidance' ],
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

  // Also search article content directly
  const direct = articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    a.sections.some(s => s.heading.toLowerCase().includes(q) || s.body.toLowerCase().includes(q))
  );
  direct.forEach(a => matchedIds.add(a.id));

  return Array.from(matchedIds).map(id => getArticleById(id)).filter(Boolean) as LearnArticle[];
}

function buildResponseFromArticles(matchedArticles: LearnArticle[]): string {
  if (matchedArticles.length === 0) {
    return "I don't have enough specific information to answer that question well. I'd recommend exploring the Learning Hub for curated articles from trusted health sources, or speaking with a healthcare professional for personalized guidance. You can also try rephrasing your question.";
  }

  const primary = matchedArticles[0];
  let text = primary.summary + '\n\n';

  // Include the most relevant section
  const firstSection = primary.sections[0];
  if (firstSection) {
    text += firstSection.body;
  }

  if (matchedArticles.length > 1) {
    text += '\n\nYou can learn more about this in the Learning Hub.';
  }

  return text;
}

export function getSaheliResponse(query: string): SaheliResponse {
  const isUrgent = checkUrgent(query);
  const isDiagnosis = checkDiagnosis(query);
  const isMedication = checkMedication(query);

  // Safety-first: urgent symptoms get immediate care guidance
  if (isUrgent) {
    return {
      text: "What you're describing may need prompt medical attention. Based on general health guidance, severe or sudden symptoms during your period should not be dismissed. Please contact a healthcare provider or emergency services right away.\n\nIf you are experiencing: severe pain that is different from your usual cramps, very heavy bleeding (soaking through a pad every hour for 2-3 hours), fainting, fever, or difficulty breathing — seek emergency care immediately.\n\nDo not wait. Your safety comes first.",
      sources: [
        { name: 'Mayo Clinic — When to seek care', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047190' },
        { name: 'NHS — Emergency care', url: 'https://www.nhs.uk/using-the-nhs/nhs-services/urgent-and-emergency-care/' },
      ],
      relatedArticleIds: ['when-to-seek-care', 'period-pain'],
      isUrgent: true,
      urgentMessage: 'This sounds like it may need urgent care. Please contact a healthcare provider or emergency services now.',
    };
  }

  // Safety: redirect diagnosis-seeking questions
  if (isDiagnosis) {
    const matchedArticles = retrieveArticles(query);
    const relevantArticle = matchedArticles[0];
    return {
      text: `I can't diagnose conditions or determine your hormonal or pregnancy status — that requires a proper medical evaluation by a healthcare professional. What I can share is general educational information.${relevantArticle ? `\n\nBased on your question, here's what I can tell you: ${relevantArticle.summary}` : ''}\n\nIf you're concerned about a specific condition, please speak with a healthcare provider. They can perform the right tests and give you an accurate answer. Self-diagnosing from an app or online information is not reliable.`,
      sources: relevantArticle ? relevantArticle.sources : [
        { name: 'Mayo Clinic — Find a doctor', url: 'https://www.mayoclinic.org/appointments' },
      ],
      relatedArticleIds: matchedArticles.slice(0, 3).map(a => a.id),
      isUrgent: false,
    };
  }

  // Safety: redirect medication dosage questions
  if (isMedication) {
    return {
      text: "I can't provide specific medication dosing instructions — the right dose depends on your individual health, other medications, and medical history. For safe medication guidance:\n\n• Follow the instructions on the medicine package\n• Consult a pharmacist — they can advise you for free\n• Talk to your healthcare provider if you have health conditions or take other medications\n\nNever exceed the recommended dose on the label without professional advice.",
      sources: [
        { name: 'FDA — Medication safety', url: 'https://www.fda.gov/consumers/consumer-updates' },
        { name: 'Mayo Clinic — Drug information', url: 'https://www.mayoclinic.org/drugs-supplements' },
      ],
      relatedArticleIds: ['period-pain'],
      isUrgent: false,
    };
  }

  // Normal retrieval-based response
  const matchedArticles = retrieveArticles(query);
  const text = buildResponseFromArticles(matchedArticles);
  const sources = matchedArticles.length > 0 ? matchedArticles[0].sources : [];
  const relatedArticleIds = matchedArticles.slice(0, 3).map(a => a.id);

  return {
    text,
    sources,
    relatedArticleIds,
    isUrgent: false,
  };
}

// Suggested questions for the chat interface
export const SUGGESTED_QUESTIONS = [
  'Why might my period be late?',
  'What can I do for period cramps?',
  'What does an irregular cycle mean?',
  'How do I use a tampon safely?',
  'What should I know about my first period?',
  'When should I see a doctor?',
  'How can I talk to someone about periods?',
  'What is PCOS?',
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
