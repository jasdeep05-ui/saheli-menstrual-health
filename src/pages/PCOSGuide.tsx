import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronDown, Heart, Brain, Activity, Stethoscope, Pill,
  Baby, ShieldAlert, Sparkles, CalendarClock, ExternalLink, CheckCircle2,
  Circle, MessageCircle, Flower2, BookOpen, Lightbulb,
} from 'lucide-react';

interface GuideSection {
  id: string;
  label: string;
  icon: typeof Heart;
  title: string;
  paragraphs: { heading?: string; body: string }[];
  callout?: { type: 'reassure' | 'important'; text: string };
}

const SECTIONS: GuideSection[] = [
  {
    id: 'what-is-pcos',
    label: 'What is PCOS?',
    icon: Flower2,
    title: 'Start here: What is PCOS/PCOD?',
    paragraphs: [
      {
        body: 'PCOS stands for Polycystic Ovary Syndrome. It is a common hormonal condition that can affect menstrual cycles, ovulation, skin, hair growth, and metabolic health. In India, you will often hear the term PCOD (Polycystic Ovarian Disease). Many people use PCOD and PCOS interchangeably, and while PCOS is the internationally recognised medical term, both generally refer to the same condition.',
      },
      {
        body: 'PCOS affects people differently — not everyone experiences the same symptoms, and the severity can range from mild to more noticeable. Some people may have only irregular periods, while others may notice changes in their skin, hair, or weight. There is no single "typical" experience.',
      },
      {
        heading: 'What about the name?',
        body: 'The word "polycystic" can be misleading. It does not mean that everyone with PCOS has ovarian cysts. "Polycystic" refers to many small follicles (tiny fluid-filled sacs) that can sometimes be seen on the ovaries during an ultrasound. These follicles are a normal part of the ovary, and their presence alone does not confirm PCOS.',
      },
      {
        heading: 'A simple analogy',
        body: 'Think of your menstrual cycle like a monthly schedule. Hormones act as messengers, telling the ovaries when to prepare and release an egg. In PCOS, these messengers can get out of sync — the signals for ovulation may be delayed or disrupted, which can affect the timing of your period. It is like a clock that sometimes runs a little late, not a broken clock.',
      },
      {
        body: 'Most importantly: PCOS is not caused by a personal failure, poor character, or lack of discipline. It is a medical condition influenced by complex biological factors — not something anyone chooses or causes.',
      },
    ],
    callout: { type: 'reassure', text: 'PCOS is common, it is not your fault, and it is something you can learn to manage with the right information and support.' },
  },
  {
    id: 'hormones-cycle',
    label: 'Hormones & cycle',
    icon: Brain,
    title: 'Understanding hormones and the menstrual cycle',
    paragraphs: [
      {
        heading: 'What hormones do',
        body: 'Hormones are chemical messengers that travel through your bloodstream and tell different parts of your body what to do. In the menstrual cycle, hormones like estrogen, progesterone, follicle-stimulating hormone (FSH), and luteinizing hormone (LH) work together to prepare the body for a possible pregnancy each month.',
      },
      {
        heading: 'What is ovulation?',
        body: 'Ovulation is when an ovary releases a mature egg, usually around the middle of your cycle. The egg then travels through the fallopian tube, where it could be fertilised. If no pregnancy occurs, hormone levels drop, and the lining of the uterus is shed as your period.',
      },
      {
        heading: 'How hormonal changes affect you',
        body: 'When hormones are in balance, the cycle follows a relatively predictable rhythm. When certain hormones are higher or lower than typical, you might notice changes in period timing, acne or oilier skin, increased facial or body hair, hair thinning on the scalp, or changes in mood and energy.',
      },
      {
        heading: 'Irregular cycles are not always PCOS',
        body: 'Cycles can be irregular for many reasons unrelated to PCOS — stress, significant weight changes, intense exercise, thyroid conditions, certain medications, or the natural variability of the first few years after periods begin. A single delayed period or one episode of acne cannot establish a diagnosis of PCOS or any other condition.',
      },
      {
        heading: 'Common variation vs. persistent changes',
        body: 'It is normal for cycles to vary by a few days from month to month. What may be worth discussing with a healthcare professional is a persistent pattern — cycles that are consistently shorter than 21 days or longer than 35 days, going months without a period, or sudden changes from your usual pattern that last for several cycles.',
      },
    ],
  },
  {
    id: 'signs-symptoms',
    label: 'Signs & symptoms',
    icon: Activity,
    title: 'Signs and symptoms: What might someone notice?',
    paragraphs: [
      { body: 'PCOS can involve a range of possible symptoms. Each one is listed below individually, along with an important reminder: every symptom listed here has multiple possible causes and does not automatically indicate PCOS.' },
      {
        heading: 'Irregular, infrequent, or absent periods',
        body: 'Periods that are consistently far apart (more than 35 days), very unpredictable, or sometimes stop entirely for months. This is one of the most common reasons people seek evaluation. However, irregular periods alone can also be caused by stress, thyroid issues, weight changes, or natural cycle variation.',
      },
      {
        heading: 'Acne or oilier skin',
        body: 'Persistent acne, especially along the jawline, or skin that has become oilier than usual. Acne has many causes including hormonal fluctuations, diet, stress, and skincare habits — it does not automatically mean PCOS.',
      },
      {
        heading: 'Increased facial or body hair',
        body: 'Hair growth on the chin, upper lip, chest, or abdomen that is thicker or darker than before. This is called hirsutism and can be linked to higher androgen levels, but it also runs in families and varies by ethnicity.',
      },
      {
        heading: 'Hair thinning on the scalp',
        body: 'Hair that becomes thinner, especially around the crown or temples. Scalp hair thinning can also result from nutritional deficiencies, stress, thyroid conditions, or genetics.',
      },
      {
        heading: 'Changes in weight',
        body: 'Some people with PCOS find it harder to manage weight, but many people with PCOS do not have weight concerns, and many people without PCOS do. Weight changes have countless causes and do not define whether someone has PCOS.',
      },
      {
        heading: 'Darkened, thicker skin patches',
        body: 'Dark, velvety patches of skin, often in skin folds like the neck, underarms, or groin. This is called acanthosis nigricans and can be associated with insulin resistance. It can also occur in people without PCOS.',
      },
      {
        heading: 'Difficulties with ovulation or becoming pregnant',
        body: 'PCOS can make ovulation less predictable, which may make conception more difficult for some people. However, many people with PCOS conceive naturally, and effective fertility support is widely available.',
      },
      {
        heading: 'Emotional distress, anxiety, or body-image concerns',
        body: 'Living with visible symptoms like acne, hair changes, or weight fluctuations can affect confidence and emotional well-being. These feelings are valid and deserve care and support, regardless of whether they are linked to PCOS.',
      },
    ],
    callout: { type: 'reassure', text: 'Not everyone with PCOS will experience every symptom. Some people have only a few. Each symptom listed above has many possible causes — noticing one or more does not mean you have PCOS.' },
  },
  {
    id: 'causes',
    label: 'What causes it?',
    icon: Brain,
    title: 'What causes PCOS?',
    paragraphs: [
      {
        heading: 'The honest answer',
        body: 'The exact cause of PCOS is not fully understood. Research suggests that it results from a combination of factors, including genetics, hormonal regulation, and how the body responds to insulin. No single factor has been identified as the sole cause.',
      },
      {
        heading: 'Genetics',
        body: 'PCOS tends to run in families. If a close family member has PCOS or related symptoms, the likelihood of having it may be higher. However, many people with no family history also develop PCOS, and having a family history does not guarantee you will have it.',
      },
      {
        heading: 'Insulin resistance, explained simply',
        body: 'Insulin is a hormone that helps your body use sugar (glucose) from food for energy. In some people with PCOS, the body does not respond to insulin as effectively — this is called insulin resistance. When cells do not respond well, the body may produce more insulin to compensate. Higher insulin levels can in turn affect the ovaries and increase androgen production, which may influence symptoms like irregular periods or acne.',
      },
      {
        heading: 'What does NOT cause PCOS',
        body: 'PCOS is not caused by eating sugar, eating particular foods, having a certain body size, or making poor lifestyle choices. While nutrition and movement can play a role in managing symptoms for some people, they do not cause the condition. Blaming sugar, specific foods, or body size is inaccurate and can create unnecessary shame.',
      },
      {
        body: 'PCOS is a complex medical condition, not a lifestyle consequence. Understanding this can help reduce the self-blame that many people feel.',
      },
    ],
  },
  {
    id: 'diagnosis',
    label: 'Diagnosis',
    icon: Stethoscope,
    title: 'PCOS diagnosis: What actually happens?',
    paragraphs: [
      {
        body: 'Symptoms alone cannot confirm PCOS. A qualified healthcare professional evaluates your medical history, symptoms, a physical examination where appropriate, and relevant investigations before making any assessment.',
      },
      {
        heading: 'What a clinical evaluation may include',
        body: 'Your clinician will typically take a detailed menstrual and symptom history — when your periods started, how often they come, how long they last, and any changes you have noticed. They may ask about skin, hair, weight, mood, and family history. A physical examination may be offered where clinically appropriate.',
      },
      {
        heading: 'Blood tests',
        body: 'Blood tests may be used to assess hormone levels (such as androgens, thyroid function, prolactin, and others) and to check for other conditions that can cause similar symptoms. These tests help the clinician build a complete picture rather than relying on any single number.',
      },
      {
        heading: 'Metabolic assessment',
        body: 'When clinically appropriate, your clinician may recommend blood sugar tests (such as a fasting glucose or HbA1c) or a lipid profile to assess metabolic health. This is because insulin resistance and related metabolic factors can be associated with PCOS for some people.',
      },
      {
        heading: 'When an ultrasound may be useful',
        body: 'An ultrasound may be used as part of the evaluation, but it is not always necessary. Importantly, an ultrasound alone does not establish PCOS. The presence of many small follicles on the ovaries can be a normal finding and is seen in people without PCOS as well. A clinician combines ultrasound findings with your history, symptoms, and blood test results — not any one of these in isolation.',
      },
      {
        heading: 'Why cysts are not required',
        body: 'You can have PCOS without having polycystic ovaries on an ultrasound, and you can have polycystic ovaries without having PCOS. The diagnosis is based on the overall clinical picture, not on a single test result.',
      },
      {
        heading: 'Ruling out other conditions',
        body: 'Several other conditions — thyroid disorders, elevated prolactin, non-classical congenital adrenal hyperplasia, and others — can cause symptoms similar to PCOS. Part of the diagnostic process involves checking for these, so that you receive the correct assessment and care.',
      },
      {
        heading: 'Adolescents need particular care',
        body: 'Normal puberty can overlap with some PCOS symptoms. Irregular periods, acne, and changes in hair growth are common during adolescence and do not necessarily indicate PCOS. Adult diagnostic criteria should not be applied to teenagers without appropriate clinical assessment by a qualified professional experienced in adolescent health.',
      },
    ],
    callout: { type: 'reassure', text: 'Having some of these symptoms does not mean you have PCOS. You deserve clear answers, and a healthcare professional can help you understand what is happening.' },
  },
  {
    id: 'treatment',
    label: 'Treatment & management',
    icon: Pill,
    title: 'Treatment and management: What help is available?',
    paragraphs: [
      {
        body: 'There is no single treatment that suits everyone with PCOS. The good news is that symptoms can often be managed effectively, and associated health risks can be monitored. Treatment is tailored to each person based on their specific symptoms, medical history, preferences, and goals.',
      },
      {
        heading: 'Sustainable, balanced nutrition',
        body: 'A balanced approach to eating — one that includes a variety of foods and supports overall well-being — can help some people manage symptoms. This is not about restrictive diets or shame-based eating rules. Working with a registered dietitian who understands PCOS can be helpful if you choose to explore nutritional support.',
      },
      {
        heading: 'Physical activity',
        body: 'Regular movement that you enjoy and can sustain — whether that is walking, yoga, swimming, dancing, or anything else — can support metabolic and emotional well-being. The goal is finding activities that fit your body, abilities, and preferences, not punishing exercise routines.',
      },
      {
        heading: 'Sleep, stress, and emotional well-being',
        body: 'Sleep quality and stress levels can influence hormones and overall health. Prioritising rest, finding stress-management strategies that work for you, and addressing emotional well-being are important parts of caring for yourself — not optional extras.',
      },
      {
        heading: 'Clinician-guided treatment for irregular periods',
        body: 'If irregular or infrequent periods are a concern, a clinician may discuss options to help regulate your cycle. The right approach depends on your individual situation, whether or not you are trying to conceive, and other health factors. This is a conversation to have with your healthcare provider.',
      },
      {
        heading: 'Treatments for acne or unwanted hair',
        body: 'For skin and hair concerns, a dermatologist or your healthcare provider can discuss a range of options, from topical treatments to other approaches. What works best varies from person to person.',
      },
      {
        heading: 'Medical support for insulin resistance',
        body: 'When insulin resistance or metabolic concerns are identified, a clinician may discuss medications or other strategies. This is always based on individual assessment — not something to start on your own.',
      },
      {
        heading: 'Fertility support',
        body: 'For people who want to become pregnant and are experiencing difficulties, effective fertility treatments are available. These are tailored to individual circumstances and managed by fertility specialists.',
      },
    ],
    callout: { type: 'important', text: 'Medication choices depend on your symptoms, medical history, preferences, and goals. Always discuss treatment options with a qualified healthcare professional. Do not start, stop, or change any prescribed treatment without medical guidance.' },
  },
  {
    id: 'fertility',
    label: 'PCOS & fertility',
    icon: Baby,
    title: 'PCOS and future fertility',
    paragraphs: [
      {
        body: 'PCOS can make ovulation less predictable, which may make conception more difficult for some people. This is a real concern, and it is understandable to feel worried about it.',
      },
      {
        heading: 'PCOS does not mean you cannot become pregnant',
        body: 'Many people with PCOS conceive naturally. For those who need support, a range of effective fertility treatments is available, including medications that can help stimulate ovulation and other approaches guided by fertility specialists. Having PCOS does not mean infertility is inevitable.',
      },
      {
        heading: 'When to seek fertility support',
        body: 'If you have been trying to conceive for a year or more (or six months if you are over 35) without success, speaking with a healthcare provider or fertility specialist is a reasonable and positive step. They can assess your situation and discuss options with you.',
      },
      {
        heading: 'Sensitive and respectful care',
        body: 'Fertility is a deeply personal topic. Whether or not you want to have children now or in the future, you deserve respectful, non-judgmental care. Your fertility goals — whatever they are — are valid.',
      },
    ],
    callout: { type: 'reassure', text: 'PCOS can make ovulation less predictable, but it does not mean you cannot become pregnant. Effective clinical support is available.' },
  },
  {
    id: 'long-term-health',
    label: 'Long-term health',
    icon: ShieldAlert,
    title: 'PCOS and long-term health',
    paragraphs: [
      {
        body: 'PCOS can be associated with a higher risk of certain metabolic conditions for some people. This is not meant to frighten you — it is information that empowers you to take proactive steps with your healthcare provider.',
      },
      {
        heading: 'Insulin resistance and type 2 diabetes',
        body: 'Some people with PCOS have insulin resistance, which can be associated with a higher risk of developing type 2 diabetes over time. This does not mean everyone with PCOS will develop diabetes. Regular check-ups and blood sugar monitoring, when recommended by your clinician, can help catch any changes early.',
      },
      {
        heading: 'Persistent infrequent periods',
        body: 'When periods are very infrequent or absent for long stretches, the lining of the uterus may be exposed to estrogen without the balancing effect of progesterone for extended periods. Over time, this may warrant medical management. A clinician may discuss options to help protect the uterine lining, depending on your situation.',
      },
      {
        heading: 'Monitoring, not anxiety',
        body: 'These are risks to discuss and monitor with your healthcare provider — not outcomes that every person with PCOS will experience. Appropriate follow-up and individualised screening help you stay informed and healthy without encouraging unnecessary or excessive testing.',
      },
      {
        body: 'Leading with worst-case outcomes or statistics is not the goal here. The goal is balanced awareness: knowing what to keep an eye on, and knowing that you have the power to work with your healthcare provider on prevention and early care.',
      },
    ],
  },
  {
    id: 'emotional-wellbeing',
    label: 'Emotional well-being',
    icon: Heart,
    title: 'Emotional well-being and self-confidence',
    paragraphs: [
      {
        body: 'Living with symptoms like acne, unwanted hair, weight changes, or unpredictable periods can take a real emotional toll. Add social pressure, comments from others, and the stress of navigating healthcare, and it is completely understandable to feel overwhelmed sometimes.',
      },
      {
        heading: 'PCOS does not define you',
        body: 'PCOS is a part of your health picture — it is not your identity, your worth, or your future. You are a complete person with strengths, relationships, dreams, and value that go far beyond a medical label.',
      },
      {
        heading: 'Symptoms are not a moral failing',
        body: 'Acne, hair growth, weight changes, or irregular periods are not signs that you are lazy, undisciplined, or doing something wrong. They are medical symptoms — biological in nature — and they deserve the same compassion you would offer a friend.',
      },
      {
        heading: 'It is reasonable to seek support',
        body: 'If you are struggling emotionally — with body image, anxiety, fertility-related worries, or just the day-to-day experience of managing a health condition — reaching out for emotional support is a sign of strength, not weakness. This might mean talking to a trusted friend or family member, a counsellor, a therapist, or a support group.',
      },
      {
        heading: 'You deserve respectful healthcare',
        body: 'Regardless of your appearance, body size, or fertility goals, you have the right to be treated with dignity and respect by every healthcare professional you encounter. If you feel dismissed or judged, it is okay to seek a second opinion or find a provider who listens to you.',
      },
    ],
    callout: { type: 'reassure', text: 'You are not alone. Your feelings are valid, your worth is not determined by your symptoms, and you deserve compassion — from others and from yourself.' },
  },
  {
    id: 'when-to-seek-advice',
    label: 'When to seek advice',
    icon: CalendarClock,
    title: 'When should someone seek medical advice?',
    paragraphs: [
      {
        heading: 'Routine appointments — when to arrange a visit',
        body: 'Consider scheduling a healthcare appointment if you experience any of the following on a persistent or recurring basis: periods that are consistently shorter than 21 days or longer than 35 days; long gaps between periods (3 months or more); troublesome acne or hair-growth changes that concern you; repeated bleeding between periods; or symptoms that are affecting your daily life, mood, or confidence.',
      },
      {
        heading: 'A missed period',
        body: 'A missed period can have many causes, including stress, weight changes, hormonal shifts, illness, or pregnancy when relevant. If pregnancy is possible, a test may be appropriate. If you miss several periods in a row, or if missed periods are a new pattern for you, speaking with a healthcare professional can help identify the cause.',
      },
      {
        heading: 'Urgent concerns — when to seek prompt care',
        body: 'Seek urgent medical care if you experience: severe pelvic or abdominal pain that is different from your usual cramps; very heavy bleeding accompanied by weakness, dizziness, or fainting; a sudden high fever with pelvic pain; or any other symptom that feels alarming or rapidly worsening. These situations need prompt evaluation.',
      },
      {
        heading: 'Not every irregular cycle is an emergency',
        body: 'Some variation in your cycle is normal and does not require urgent care. The distinction is between occasional variation (usually fine to mention at a routine appointment) and persistent, severe, or sudden changes (worth addressing sooner).',
      },
    ],
    callout: { type: 'important', text: 'Saheli provides education, not a medical diagnosis. If you are concerned about your symptoms, please consult a qualified healthcare professional.' },
  },
  {
    id: 'preparing-appointment',
    label: 'Preparing for a visit',
    icon: Stethoscope,
    title: 'Preparing for a healthcare appointment',
    paragraphs: [
      {
        body: 'A little preparation can make your appointment more productive and help you feel more confident. Here is a practical checklist you can review before your visit. You do not need to have every item ready — these are suggestions, not requirements.',
      },
    ],
  },
];

const FAQS: { question: string; answer: string }[] = [
  {
    question: 'Does having irregular periods mean I have PCOS?',
    answer: 'No. Irregular periods can be caused by many factors including stress, weight changes, intense exercise, thyroid conditions, medications, and the natural variability of the first few years after periods begin. PCOS is one possible cause among many. A healthcare professional can help determine the reason for your irregular cycles through a proper evaluation.',
  },
  {
    question: 'Can someone have PCOS without ovarian cysts?',
    answer: 'Yes. The term "polycystic" is misleading — you can have PCOS without any visible cysts or follicles on an ultrasound. The diagnosis is based on a combination of your medical history, symptoms, blood tests, and sometimes ultrasound, not on any single finding. Conversely, having ovarian cysts does not automatically mean you have PCOS.',
  },
  {
    question: 'Does PCOS always cause weight gain?',
    answer: 'No. While some people with PCOS experience weight changes or find weight management more challenging, many people with PCOS do not have weight concerns. Weight changes have many causes and do not define whether someone has PCOS. Assuming that everyone with PCOS has a particular body type is inaccurate.',
  },
  {
    question: 'Can PCOS cause acne?',
    answer: 'Yes, acne can be associated with PCOS, particularly when androgen levels are higher than typical. However, acne is extremely common and has many causes — hormones, genetics, skincare, stress, and diet can all play a role. Having acne does not automatically mean you have PCOS.',
  },
  {
    question: 'Does PCOS mean I cannot get pregnant?',
    answer: 'No. PCOS can make ovulation less predictable, which may make conception more difficult for some people. However, many people with PCOS conceive naturally, and effective fertility treatments are available for those who need support. PCOS does not mean infertility is inevitable.',
  },
  {
    question: 'Can teenagers have symptoms that resemble PCOS?',
    answer: 'Yes. During normal puberty, irregular periods, acne, and changes in hair growth are common and do not necessarily indicate PCOS. Adult diagnostic criteria should not be applied to adolescents without careful assessment by a qualified professional experienced in adolescent health. If you are a teenager with concerns, talk to a healthcare provider who understands adolescent development.',
  },
  {
    question: 'Can PCOS symptoms be managed?',
    answer: 'Yes. While there is no single cure, symptoms can often be managed effectively through a combination of approaches tailored to your individual needs. These may include balanced nutrition, regular physical activity, sleep and stress management, and clinician-guided treatments. Many people with PCOS lead full, healthy lives.',
  },
  {
    question: 'Is PCOS the same as having a single ovarian cyst?',
    answer: 'No. A single ovarian cyst is a fluid-filled sac that can develop on an ovary and is often harmless and resolves on its own. PCOS is a complex hormonal condition involving multiple factors. The "polycystic" in PCOS refers to many small follicles, not large cysts, and having a single cyst does not mean you have PCOS.',
  },
  {
    question: 'When should I talk to a healthcare professional?',
    answer: 'Consider arranging a visit if you have persistent or recurring irregular periods (consistently shorter than 21 days or longer than 35 days), long gaps between periods (3 months or more), troublesome acne or hair changes, repeated bleeding between periods, or symptoms affecting your daily life. Seek urgent care for severe pelvic pain, very heavy bleeding with dizziness or fainting, or other alarming symptoms.',
  },
  {
    question: 'Can Saheli diagnose PCOS?',
    answer: 'No. Saheli provides educational information only. It cannot diagnose PCOS or any other medical condition. A diagnosis requires evaluation by a qualified healthcare professional using your medical history, physical examination, and appropriate tests. If you suspect you may have PCOS, please consult a healthcare provider.',
  },
];

const APPOINTMENT_CHECKLIST: string[] = [
  'Dates of your recent periods and how long each lasted',
  'How your flow has been — lighter, heavier, or different from usual',
  'Any spotting between periods',
  'Cramps, pain, or other physical symptoms and when they occur',
  'Changes in acne, hair growth, or hair thinning',
  'Current medicines, supplements, or herbal remedies you take',
  'Relevant health history, including family history of PCOS or similar symptoms',
  'Questions you would like answered (see the suggestions below)',
];

const DOCTOR_QUESTIONS: string[] = [
  'What could be causing my irregular periods?',
  'Do I need any tests, and why?',
  'What treatment options fit my symptoms and goals?',
  'Are there lifestyle changes that might help my specific situation?',
  'Should I have follow-up checks, and if so, how often?',
  'When should I return if my symptoms continue or change?',
];

const SOURCES: { name: string; url: string }[] = [
  { name: 'World Health Organization (WHO) — Polycystic Ovary Syndrome', url: 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome' },
  { name: 'American College of Obstetricians and Gynecologists (ACOG) — PCOS FAQ', url: 'https://www.acog.org/womens-health/faqs/polycystic-ovary-syndrome-pcos' },
  { name: 'National Institute of Child Health and Human Development (NICHD) — PCOS', url: 'https://www.nichd.nih.gov/health/topics/pcos' },
];

export function PCOSGuide() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('what-is-pcos');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [checkedQuestions, setCheckedQuestions] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleItem = (index: number, set: typeof setCheckedItems, get: typeof checkedItems) => {
    const next = new Set(get);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    set(next);
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/learn')} className="btn-ghost">
        <ChevronLeft size={18} /> Back to Learning Hub
      </button>

      {/* Hero header */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-blush-100 via-lavender-100 to-mint-100 px-5 py-7">
          <div className="flex items-center gap-2">
            <Flower2 size={22} className="text-coral-400" />
            <span className="badge bg-white/60 text-plum-500">Conditions</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-plum-700">
            Understanding PCOS/PCOD
          </h1>
          <p className="mt-1 font-display text-lg text-coral-500">Knowledge Without Fear</p>
          <p className="mt-2 text-sm leading-relaxed text-plum-500">
            Learn about your hormones, understand your cycle, and discover the support available to you.
          </p>
        </div>
      </div>

      {/* Table of contents */}
      <div className="card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-plum-400">Explore topics</p>
        <div className="grid grid-cols-2 gap-2">
          {SECTIONS.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-coral-50 text-coral-500 border border-coral-200'
                    : 'bg-cream-50 text-plum-500 border border-transparent hover:bg-cream-100'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-coral-400' : 'text-plum-300'} />
                <span className="leading-tight">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content sections */}
      {SECTIONS.map(section => {
        const Icon = section.icon;
        return (
          <div
            key={section.id}
            ref={el => { sectionRefs.current[section.id] = el; }}
            className="scroll-mt-20"
          >
            <div className="card p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender-100">
                  <Icon size={20} className="text-lavender-500" />
                </span>
                <h2 className="font-display text-lg font-semibold text-plum-700">{section.title}</h2>
              </div>

              <div className="space-y-3">
                {section.paragraphs.map((para, i) => (
                  <div key={i}>
                    {para.heading && (
                      <h3 className="mb-1 text-sm font-semibold text-plum-600">{para.heading}</h3>
                    )}
                    <p className="text-sm leading-relaxed text-plum-500">{para.body}</p>
                  </div>
                ))}
              </div>

              {section.callout && (
                <div className={`mt-4 rounded-xl p-4 ${
                  section.callout.type === 'reassure'
                    ? 'bg-mint-100 border border-mint-200'
                    : 'bg-peach-100 border border-peach-200'
                }`}>
                  <div className="flex items-start gap-2">
                    {section.callout.type === 'reassure' ? (
                      <Heart size={18} className="mt-0.5 flex-shrink-0 text-mint-500" />
                    ) : (
                      <Sparkles size={18} className="mt-0.5 flex-shrink-0 text-peach-500" />
                    )}
                    <p className={`text-sm leading-relaxed ${
                      section.callout.type === 'reassure' ? 'text-mint-500' : 'text-peach-500'
                    }`}>
                      {section.callout.text}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Appointment checklist — rendered after the preparing section */}
            {section.id === 'preparing-appointment' && (
              <div className="mt-3 space-y-3">
                <div className="card p-5">
                  <h3 className="mb-3 text-sm font-semibold text-plum-600">What to bring or prepare</h3>
                  <div className="space-y-2">
                    {APPOINTMENT_CHECKLIST.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => toggleItem(i, setCheckedItems, checkedItems)}
                        className="flex w-full items-start gap-2.5 rounded-xl bg-cream-50 px-4 py-3 text-left transition-colors hover:bg-cream-100"
                      >
                        {checkedItems.has(i) ? (
                          <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-mint-400" />
                        ) : (
                          <Circle size={20} className="mt-0.5 flex-shrink-0 text-plum-200" />
                        )}
                        <span className={`text-sm leading-relaxed ${
                          checkedItems.has(i) ? 'text-plum-400 line-through' : 'text-plum-500'
                        }`}>
                          {item}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <h3 className="mb-1 text-sm font-semibold text-plum-600">Questions to ask your doctor</h3>
                  <p className="mb-3 text-xs text-plum-400">Tap to mark questions you want to remember.</p>
                  <div className="space-y-2">
                    {DOCTOR_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => toggleItem(i, setCheckedQuestions, checkedQuestions)}
                        className="flex w-full items-start gap-2.5 rounded-xl bg-cream-50 px-4 py-3 text-left transition-colors hover:bg-cream-100"
                      >
                        {checkedQuestions.has(i) ? (
                          <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-coral-400" />
                        ) : (
                          <Circle size={20} className="mt-0.5 flex-shrink-0 text-plum-200" />
                        )}
                        <span className={`text-sm leading-relaxed ${
                          checkedQuestions.has(i) ? 'text-plum-400 line-through' : 'text-plum-600'
                        }`}>
                          {q}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-plum-300">
                    You do not need to answer every question or complete every test before seeking help.
                    Your provider is there to guide you through the process.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* FAQ section */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb size={20} className="text-coral-400" />
          <h2 className="font-display text-lg font-semibold text-plum-700">Frequently asked questions</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-cream-200">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 bg-cream-50 px-4 py-3.5 text-left transition-colors hover:bg-cream-100"
                aria-expanded={openFaq === i}
              >
                <span className="text-sm font-medium text-plum-600">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-plum-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="animate-fade-in px-4 py-3.5">
                  <p className="text-sm leading-relaxed text-plum-500">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ask Saheli link */}
      <div className="card p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lavender-100">
            <MessageCircle size={24} className="text-lavender-500" />
          </span>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-plum-600">Have more questions?</h2>
            <p className="text-xs text-plum-400">Ask Saheli for general educational questions about your cycle and health.</p>
          </div>
          <button onClick={() => navigate('/ask')} className="btn-primary px-4 py-2.5 text-sm">
            Ask
          </button>
        </div>
      </div>

      {/* Sources and further reading */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-coral-400" />
          <h2 className="text-sm font-semibold text-plum-600">Sources and further reading</h2>
        </div>
        <p className="mb-3 text-xs text-plum-400">
          The content in this guide is based on publicly available information from reputable health organisations. We encourage you to explore these original sources for more detailed information.
        </p>
        <div className="space-y-2.5">
          {SOURCES.map((src, i) => (
            <a
              key={i}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-cream-50 px-4 py-3 text-sm text-coral-500 transition-colors hover:bg-cream-100 hover:underline"
            >
              <ExternalLink size={16} className="flex-shrink-0" />
              <span>{src.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Reassurance footer */}
      <div className="card bg-gradient-to-br from-mint-100 to-lavender-100 p-5">
        <div className="flex items-start gap-3">
          <Heart size={24} className="mt-0.5 flex-shrink-0 text-mint-500" />
          <div>
            <p className="text-sm font-medium text-plum-600">You are not alone in this</p>
            <p className="mt-1 text-xs leading-relaxed text-plum-500">
              Understanding your body is an act of self-care. Whether or not you have PCOS, you deserve
              clear information, compassionate care, and the confidence to make informed decisions about
              your health. Saheli is here to support you on that journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
