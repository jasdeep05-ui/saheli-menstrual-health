// Curated educational content for Saheli
// Sources are real public-health organizations with verified URLs

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface LearnArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  sections: ArticleSection[];
  sources: { name: string; url: string }[];
  reviewedDate: string;
  relatedIds: string[];
  simpleExplanation: string;
}

export const CATEGORIES = [
  'basics',
  'puberty',
  'hygiene',
  'symptoms',
  'conditions',
  'products',
  'myths',
  'wellbeing',
  'seekcare',
] as const;

export const articles: LearnArticle[] = [
  {
    id: 'what-is-menstruation',
    category: 'basics',
    title: 'What is menstruation?',
    summary: 'Understanding the menstrual cycle, what happens in your body, and why periods occur.',
    sections: [
      {
        heading: 'The menstrual cycle',
        body: 'The menstrual cycle is the natural process by which the body prepares for a possible pregnancy each month. It involves hormonal changes that cause the lining of the uterus to thicken. If pregnancy does not occur, this lining is shed through the vagina as menstrual bleeding — this is your period. A typical cycle lasts between 21 and 35 days, with bleeding lasting 2 to 7 days. However, variation is normal, especially in the first few years after periods begin.',
      },
      {
        heading: 'Phases of the cycle',
        body: 'The cycle has phases: the menstrual phase (bleeding), the follicular phase (the body prepares an egg), ovulation (an egg is released), and the luteal phase (the body prepares for possible pregnancy). These phases are driven by hormones including estrogen and progesterone. The exact timing varies from person to person and can change over time.',
      },
      {
        heading: 'What is a "normal" cycle?',
        body: 'There is a wide range of normal. Cycles between 21 and 35 days are generally considered typical. Periods lasting 2 to 7 days are common. Flow can vary from light to heavy. What matters most is what is normal for you. Tracking your cycle can help you understand your own pattern and notice changes.',
      },
    ],
    sources: [
      { name: 'World Health Organization (WHO)', url: 'https://www.who.int/health-topics/menstrual-health' },
      { name: 'Mayo Clinic — Menstrual cycle', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047190' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['irregular-cycles', 'first-period', 'myths-facts'],
    simpleExplanation: 'Every month, your body gets ready for a possible pregnancy by building up a lining in the uterus. If no pregnancy happens, that lining comes out as your period. This is a normal, healthy process that usually happens every 21 to 35 days.',
  },
  {
    id: 'first-period',
    category: 'puberty',
    title: 'Your first period: what to expect',
    summary: 'A guide for understanding your first period and how to prepare.',
    sections: [
      {
        heading: 'When does it start?',
        body: 'Most people get their first period (menarche) between ages 9 and 15, with the average around age 12. It usually begins about 2 to 2.5 years after breast development starts. Every person is different, and starting earlier or later can be perfectly normal.',
      },
      {
        heading: 'What does it look like?',
        body: 'Your first period might be light — just a few spots of blood, or it might be heavier. The blood can be red, brown, or pink. It may last a few days. Your first few periods may be irregular as your body establishes its pattern. This is completely normal.',
      },
      {
        heading: 'How to prepare',
        body: 'Keep a period kit at home and in your bag with pads, clean underwear, and tissues. Talk to a trusted adult — a parent, older sibling, school counselor, or healthcare provider. Tracking your period when it starts helps you understand your cycle. There is no need to feel embarrassed — menstruation is a normal part of life.',
      },
      {
        heading: 'Talking to someone',
        body: 'If you feel scared or confused, talking to someone you trust can help. A parent, school nurse, counselor, or doctor can answer your questions. You can also explore the "Help me talk about it" section in this app for conversation guides.',
      },
    ],
    sources: [
      { name: 'NHS — Periods', url: 'https://www.nhs.uk/conditions/periods/' },
      { name: 'Mayo Clinic — First period', url: 'https://www.mayoclinic.org/healthy-lifestyle/tween-and-teen-health/in-depth/menstruation/art-20046023' },
      { name: 'UNICEF — Menstrual Hygiene', url: 'https://www.unicef.org/wash/menstrual-hygiene' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['what-is-menstruation', 'myths-facts', 'products-safe-use'],
    simpleExplanation: 'Your first period usually happens between ages 9 and 15. It might be light at first, and the blood can be red or brown. Keep some pads ready, and tell a trusted adult. It is completely normal and nothing to be embarrassed about.',
  },
  {
    id: 'products-safe-use',
    category: 'products',
    title: 'Menstrual products and their safe use',
    summary: 'Pads, tampons, cups, and period underwear — how to choose and use them safely.',
    sections: [
      {
        heading: 'Types of products',
        body: 'Pads (sanitary napkins) absorb blood externally and are worn inside underwear. Tampons are inserted into the vagina to absorb blood internally. Menstrual cups are reusable silicone cups that collect blood. Period underwear looks like regular underwear but has absorbent layers. All are safe when used correctly.',
      },
      {
        heading: 'Changing products',
        body: 'Pads should be changed every 3-4 hours. Tampons should be changed every 4-6 hours, and never left in for more than 8 hours. Menstrual cups can be worn for up to 12 hours. Period underwear can usually last a full day depending on flow. Changing regularly prevents odor, irritation, and infection.',
      },
      {
        heading: 'Toxic shock syndrome (TSS)',
        body: 'TSS is a rare but serious condition associated with tampon use. It is caused by bacteria, not the tampon itself. To reduce risk: use the lowest absorbency needed, change tampons regularly, and never leave a tampon in overnight. If you experience sudden high fever, vomiting, diarrhea, dizziness, or a rash while using a tampon, remove it immediately and seek medical care.',
      },
      {
        heading: 'Safe disposal',
        body: 'Wrap used pads and tampons in tissue or the wrapper of the new product before disposing in a bin. Do not flush pads or tampons down the toilet as they can cause blockages. Always wash your hands before and after changing products.',
      },
    ],
    sources: [
      { name: 'FDA — Menstrual products', url: 'https://www.fda.gov/consumers/womens-health-topics/menstrual-tampons-and-pads-information-about-potential-health-risks' },
      { name: 'Mayo Clinic — Toxic shock syndrome', url: 'https://www.mayoclinic.org/diseases-conditions/toxic-shock-syndrome/symptoms-causes/syc-20355614' },
      { name: 'UNICEF — Menstrual Hygiene Management', url: 'https://www.unicef.org/wash/menstrual-hygiene' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['hygiene-basics', 'myths-facts', 'what-is-menstruation'],
    simpleExplanation: 'There are pads, tampons, cups, and period underwear. Change pads every 3-4 hours and tampons every 4-6 hours. Always wash your hands before and after. Wrap used products before throwing them away. Never flush them.',
  },
  {
    id: 'hygiene-basics',
    category: 'hygiene',
    title: 'Menstrual hygiene basics',
    summary: 'Keeping clean and comfortable during your period.',
    sections: [
      {
        heading: 'Washing',
        body: 'Wash your genital area with warm water. Mild, unscented soap can be used externally. Avoid douching or using scented products inside the vagina — these can disrupt the natural balance and cause infections. The vagina is self-cleaning.',
      },
      {
        heading: 'During your period',
        body: 'Change your menstrual product regularly. Bathe or shower daily as usual. Wash your hands before and after changing products. Wear clean, comfortable underwear. Cotton underwear is breathable and helps prevent irritation.',
      },
      {
        heading: 'Disposal and sanitation',
        body: 'Dispose of used products properly — wrap them and put them in a bin. If you do not have access to proper disposal facilities, carry a small bag to wrap used products until you can dispose of them safely. This is especially important when traveling or in public restrooms.',
      },
      {
        heading: 'Access and dignity',
        body: 'Access to clean menstrual products and safe hygiene facilities is a basic right, not a luxury. Many organizations work to improve menstrual hygiene access. If you are struggling to access products, see the "Find support" section in this app.',
      },
    ],
    sources: [
      { name: 'UNICEF — Menstrual Hygiene', url: 'https://www.unicef.org/wash/menstrual-hygiene' },
      { name: 'WHO — Menstrual Health', url: 'https://www.who.int/health-topics/menstrual-health' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['products-safe-use', 'unexpected-period', 'myths-facts'],
    simpleExplanation: 'Wash with warm water and mild soap outside only. Change products regularly. Always wash your hands. Wear clean cotton underwear. Wrap used products before throwing them away.',
  },
  {
    id: 'irregular-cycles',
    category: 'symptoms',
    title: 'Understanding irregular cycles',
    summary: 'What irregular periods mean, common causes, and when to seek advice.',
    sections: [
      {
        heading: 'What is irregular?',
        body: 'An irregular cycle is one that varies significantly in length from month to month, or that falls outside the typical range of 21-35 days. Some variation is normal, especially in the first few years after your period begins, during perimenopause, or when under significant stress.',
      },
      {
        heading: 'Common causes',
        body: 'Irregular cycles can be caused by stress, significant weight changes, intense exercise, hormonal changes, thyroid conditions, polycystic ovary syndrome (PCOS), certain medications, and other factors. In the first 1-2 years after menarche, irregular periods are very common as the body establishes its rhythm.',
      },
      {
        heading: 'When to seek medical advice',
        body: 'Consider speaking with a healthcare provider if: your cycles are consistently shorter than 21 days or longer than 35 days, you miss periods for 3 or more months, your periods suddenly become very heavy or painful, or you have bleeding between periods. These do not necessarily mean something is wrong, but a healthcare professional can help determine the cause.',
      },
      {
        heading: 'Tracking helps',
        body: 'Keeping a record of your periods helps you and your healthcare provider understand your pattern. Saheli can help you track your cycle. Remember that having irregular periods does not mean something is wrong with you — it is a reason to gather information and talk to a professional.',
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Irregular periods', url: 'https://www.mayoclinic.org/diseases-conditions/menstrual-cycle/expert-answers/irregular-periods/faq-20057911' },
      { name: 'ACOG — Menstrual Cycle', url: 'https://www.acog.org/womens-health/faqs/your-menstrual-period' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['what-is-menstruation', 'late-period', 'pcos-basics'],
    simpleExplanation: 'An irregular period is when your cycle length changes a lot or is shorter than 21 days or longer than 35 days. This can be caused by stress, weight changes, or hormones. It is common in the first few years. If it keeps happening, talk to a doctor.',
  },
  {
    id: 'late-period',
    category: 'symptoms',
    title: 'Why might my period be late?',
    summary: 'Common reasons for a delayed period and what to do.',
    sections: [
      {
        heading: 'Common reasons',
        body: 'A period can be late for many reasons: stress, changes in weight or diet, increased exercise, travel, illness, changes in routine, hormonal fluctuations, certain medications, or pregnancy. A late period does not automatically mean something is wrong.',
      },
      {
        heading: 'When it is normal',
        body: 'It is normal for periods to occasionally be a few days early or late, especially during times of stress or life changes. In the first few years after your period starts, irregular timing is very common. A single late period is usually not a cause for concern.',
      },
      {
        heading: 'When to seek advice',
        body: 'If your period is more than 7 days late and you are sexually active, consider taking a pregnancy test if pregnancy is possible. If you miss 3 or more periods in a row, or if your cycle pattern changes significantly, speak with a healthcare provider. If you have severe pain, heavy bleeding when the period does come, or other concerning symptoms, seek medical care.',
      },
      {
        heading: 'What to do',
        body: 'Track your cycle to see patterns. Note any life changes, stress, or health events. Continue to take care of your body with adequate rest, nutrition, and hydration. If you are concerned, contact a healthcare professional — they can help identify the cause.',
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Missed periods', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/expert-answers/menstrual-cycle/faq-20057911' },
      { name: 'NHS — Missed periods', url: 'https://www.nhs.uk/conditions/stopped-or-missed-periods/' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['irregular-cycles', 'when-to-seek-care', 'what-is-menstruation'],
    simpleExplanation: 'A late period can happen because of stress, weight changes, exercise, illness, or pregnancy. One late period is usually fine. If you miss 3 in a row or have pain, talk to a doctor. If pregnancy is possible, take a test.',
  },
  {
    id: 'pcos-basics',
    category: 'conditions',
    title: 'Understanding PCOS',
    summary: 'What polycystic ovary syndrome is, common signs, and how it is managed.',
    sections: [
      {
        heading: 'What is PCOS?',
        body: 'Polycystic ovary syndrome (PCOS) is a common hormonal condition that affects how the ovaries work. It is estimated to affect 1 in 10 people with ovaries of reproductive age. Despite the name, "polycystic" refers to many small follicles (not harmful cysts) that can be seen on an ultrasound.',
      },
      {
        heading: 'Common signs',
        body: 'PCOS may involve irregular or infrequent periods, higher levels of androgens (which can cause acne or excess hair growth), and difficulty getting pregnant. Not everyone with PCOS has all these signs, and the condition exists on a spectrum. PCOS cannot be diagnosed from a period calendar alone.',
      },
      {
        heading: 'Diagnosis and management',
        body: 'PCOS is diagnosed by a healthcare professional using a combination of medical history, physical examination, blood tests, and sometimes ultrasound. Management depends on individual symptoms and goals, and may include lifestyle changes, medications, and regular monitoring. PCOS is a manageable condition.',
      },
      {
        heading: 'If you suspect PCOS',
        body: 'If you have irregular periods, acne, or other signs that concern you, speak with a healthcare provider. Do not self-diagnose based on an app or online information. A proper medical evaluation is needed. PCOS is common and treatable — seeking help is a positive step.',
      },
    ],
    sources: [
      { name: 'Mayo Clinic — PCOS', url: 'https://www.mayoclinic.org/diseases-conditions/pcos/symptoms-causes/syc-20353439' },
      { name: 'WHO — PCOS', url: 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['irregular-cycles', 'endometriosis-basics', 'when-to-seek-care'],
    simpleExplanation: 'PCOS is a common hormone condition that can cause irregular periods, acne, and sometimes difficulty getting pregnant. It affects about 1 in 10 people. A doctor diagnoses it with blood tests and an ultrasound. It is manageable with the right care.',
  },
  {
    id: 'endometriosis-basics',
    category: 'conditions',
    title: 'Understanding endometriosis',
    summary: 'What endometriosis is, common symptoms, and why diagnosis matters.',
    sections: [
      {
        heading: 'What is endometriosis?',
        body: 'Endometriosis is a condition where tissue similar to the lining of the uterus grows outside the uterus, commonly on the ovaries, fallopian tubes, and other pelvic organs. This tissue responds to hormonal changes during the menstrual cycle, which can cause pain, inflammation, and sometimes scar tissue.',
      },
      {
        heading: 'Common symptoms',
        body: 'Symptoms may include severe period pain (dysmenorrhea), pain during or after sex, chronic pelvic pain, heavy periods, pain with bowel movements or urination during periods, and sometimes difficulty getting pregnant. The severity of pain does not always match the extent of the condition. Some people have no symptoms.',
      },
      {
        heading: 'Diagnosis',
        body: 'Endometriosis is typically diagnosed through medical history, pelvic examination, imaging, and sometimes laparoscopy (a minimally invasive surgical procedure). Diagnosis often takes years because symptoms can be mistaken for "normal" period pain. If your period pain significantly interferes with daily life, this is not normal and deserves medical evaluation.',
      },
      {
        heading: 'Management',
        body: 'While there is no cure, endometriosis can be managed. Treatment options include pain management, hormonal medications, and in some cases surgery. The right approach depends on individual symptoms, goals, and the extent of the condition. A gynecologist or specialist can help develop a management plan.',
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Endometriosis', url: 'https://www.mayoclinic.org/diseases-conditions/endometriosis/symptoms-causes/syc-20354689' },
      { name: 'WHO — Endometriosis', url: 'https://www.who.int/news-room/fact-sheets/detail/endometriosis' },
      { name: 'Endometriosis Foundation of America', url: 'https://www.endofound.org' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['pcos-basics', 'when-to-seek-care', 'period-pain'],
    simpleExplanation: 'Endometriosis is when tissue like the uterus lining grows outside the uterus. It can cause very painful periods and pelvic pain. If your period pain stops you from doing daily activities, see a doctor. It can be managed with treatment.',
  },
  {
    id: 'period-pain',
    category: 'symptoms',
    title: 'Managing period pain',
    summary: 'Understanding period pain and general comfort measures.',
    sections: [
      {
        heading: 'Types of period pain',
        body: 'Mild to moderate cramping during your period is common. This pain (dysmenorrhea) is caused by the uterus contracting to shed its lining. Primary dysmenorrhea is pain without an underlying condition. Secondary dysmenorrhea is pain caused by a condition like endometriosis or fibroids. Pain that is severe, worsening, or interferes with daily activities should be evaluated by a healthcare professional.',
      },
      {
        heading: 'General comfort measures',
        body: 'A warm heating pad on the lower abdomen can help relax muscles. Gentle exercise, like walking or stretching, may reduce cramps. Staying hydrated and getting adequate rest can help. Over-the-counter pain relievers like ibuprofen can be effective for many people — follow package instructions and consult a pharmacist if you have questions.',
      },
      {
        heading: 'When pain is not normal',
        body: 'Period pain that forces you to miss school or work, pain that does not improve with over-the-counter medication, pain that worsens over time, or pain accompanied by heavy bleeding, fever, or other symptoms is not something to simply endure. These signs warrant a medical evaluation to check for underlying conditions.',
      },
      {
        heading: 'Do not suffer in silence',
        body: 'Severe period pain is often dismissed as "just part of being a woman," but it should not be. You deserve to have your pain taken seriously. If your pain is significant, seek care from a healthcare professional who can evaluate you properly.',
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Menstrual cramps', url: 'https://www.mayoclinic.org/diseases-conditions/menstrual-cramps/symptoms-causes/syc-20374938' },
      { name: 'ACOG — Dysmenorrhea', url: 'https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['endometriosis-basics', 'when-to-seek-care', 'symptom-guidance'],
    simpleExplanation: 'Mild period cramps are normal and can be helped with a heating pad, gentle exercise, and over-the-counter pain medicine. But if your pain is very bad, gets worse, or stops you from doing daily things, see a doctor. Severe pain is not something to just endure.',
  },
  {
    id: 'myths-facts',
    category: 'myths',
    title: 'Myths and facts about menstruation',
    summary: 'Clearing up common misconceptions about periods.',
    sections: [
      {
        heading: 'Myth: You cannot get pregnant during your period',
        body: 'Fact: While less likely, pregnancy is possible during your period, especially if you have a short cycle. Sperm can survive in the body for several days. If you do not want to become pregnant, use contraception consistently regardless of where you are in your cycle.',
      },
      {
        heading: 'Myth: Periods are dirty or impure',
        body: 'Fact: Menstrual blood is a normal bodily fluid. Menstruation is a natural biological process, not something dirty or shameful. Cultural beliefs that restrict people during their period are based on tradition, not science. Everyone deserves to manage their period with dignity.',
      },
      {
        heading: 'Myth: You should not exercise during your period',
        body: 'Fact: Exercise during your period is safe and can actually help reduce cramps and improve mood. Listen to your body — if you feel tired, lighter activity is fine, but there is no medical reason to avoid exercise.',
      },
      {
        heading: 'Myth: Irregular periods mean something is seriously wrong',
        body: 'Fact: Many people have irregular periods, especially in the first few years, during stress, or during perimenopause. While persistent irregularity should be discussed with a healthcare provider, it does not automatically mean something is seriously wrong.',
      },
      {
        heading: 'Myth: PMS is "all in your head"',
        body: 'Fact: Premenstrual syndrome (PMS) involves real physical and emotional changes driven by hormonal fluctuations. Symptoms like mood changes, bloating, and breast tenderness are experienced by many people and are biological, not imaginary.',
      },
    ],
    sources: [
      { name: 'UNICEF — Menstrual Health', url: 'https://www.unicef.org/wash/menstrual-hygiene' },
      { name: 'WHO — Menstrual Health', url: 'https://www.who.int/health-topics/menstrual-health' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['what-is-menstruation', 'hygiene-basics', 'first-period'],
    simpleExplanation: 'Periods are not dirty, you can exercise during them, and you can get pregnant during your period. PMS is real, not imaginary. Irregular periods do not always mean something is wrong. These are facts, not myths.',
  },
  {
    id: 'emotional-wellbeing',
    category: 'wellbeing',
    title: 'Emotional well-being and your cycle',
    summary: 'How hormones affect mood and how to take care of yourself.',
    sections: [
      {
        heading: 'Hormones and mood',
        body: 'Hormonal changes during the menstrual cycle can affect your mood. Some people experience mood changes before their period (PMS) that can include irritability, sadness, anxiety, or sensitivity. These are linked to the natural rise and fall of hormones and are real experiences, not "imagined."',
      },
      {
        heading: 'PMDD',
        body: 'Premenstrual Dysphoric Disorder (PMDD) is a more severe form of PMS that causes significant emotional distress before a period. If mood changes severely impact your life, relationships, or ability to function, this deserves medical attention. PMDD is a recognized medical condition with treatment options.',
      },
      {
        heading: 'Stigma and mental health',
        body: 'Menstruation is surrounded by cultural stigma in many societies. This stigma can cause shame, isolation, and reluctance to seek help. You are not alone in experiencing these feelings. Breaking the silence — even with one trusted person — can be powerful.',
      },
      {
        heading: 'Self-care during your cycle',
        body: 'Be gentle with yourself. Track your mood alongside your cycle to understand patterns. Prioritize rest, nourishing food, and activities you enjoy. If you are struggling emotionally, reach out — to a friend, a trusted adult, or a mental health professional. Emotional health is just as important as physical health.',
      },
    ],
    sources: [
      { name: 'Mayo Clinic — PMS', url: 'https://www.mayoclinic.org/diseases-conditions/premenstrual-syndrome/symptoms-causes/syc-20374080' },
      { name: 'Mayo Clinic — PMDD', url: 'https://www.mayoclinic.org/diseases-conditions/premenstrual-dysphoric-disorder/symptoms-causes/syc-20376380' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['myths-facts', 'talk-about-it', 'what-is-menstruation'],
    simpleExplanation: 'Hormone changes during your cycle can affect your mood. Feeling sad, irritable, or anxious before your period is real, not imagined. If mood changes are severe and affect your daily life, talk to a doctor. Be kind to yourself.',
  },
  {
    id: 'when-to-seek-care',
    category: 'seekcare',
    title: 'When to seek medical care',
    summary: 'Signs that warrant a medical evaluation or urgent care.',
    sections: [
      {
        heading: 'See a healthcare provider if you experience:',
        body: 'Periods consistently shorter than 21 days or longer than 35 days. Missing 3 or more consecutive periods. Periods that suddenly become much heavier or more painful than usual. Bleeding between periods or after sex. Periods that last longer than 7 days. Feeling dizzy, faint, or short of breath during your period (possible sign of anemia from heavy bleeding).',
      },
      {
        heading: 'Seek urgent care if you experience:',
        body: 'Sudden, severe abdominal pain that is different from your usual cramps. Very heavy bleeding (soaking through a pad or tampon every hour for 2-3 hours). Fever with period pain. Fainting or severe dizziness. Chest pain or difficulty breathing. These symptoms need prompt medical evaluation.',
      },
      {
        heading: 'Do not dismiss severe symptoms',
        body: 'Severe, sudden, or worsening symptoms should never be dismissed as "just a bad period." You know your body. If something feels wrong or different, seek care. It is always better to be checked by a professional than to suffer in silence.',
      },
      {
        heading: 'Preparing for your appointment',
        body: 'Track your symptoms, cycle dates, and pain levels before your visit. Saheli can generate a symptom summary you can share with your provider. Write down your questions. Consider bringing a support person. You deserve to be heard and taken seriously.',
      },
    ],
    sources: [
      { name: 'Mayo Clinic — When to see a doctor', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047190' },
      { name: 'ACOG — Menstrual Cycle', url: 'https://www.acog.org/womens-health/faqs/your-menstrual-period' },
      { name: 'NHS — Heavy periods', url: 'https://www.nhs.uk/conditions/heavy-periods/' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['period-pain', 'symptom-guidance', 'irregular-cycles'],
    simpleExplanation: 'See a doctor if your periods are very short, very long, very heavy, or very painful, or if you miss 3 in a row. Get urgent care for sudden severe pain, very heavy bleeding, fever, or fainting. Never dismiss severe symptoms as "just a period."',
  },
  {
    id: 'anemia-basics',
    category: 'conditions',
    title: 'Iron deficiency and anemia',
    summary: 'How heavy periods can lead to anemia and what to watch for.',
    sections: [
      {
        heading: 'The connection',
        body: 'Heavy menstrual bleeding can lead to iron deficiency and eventually anemia. Iron is lost through blood, and if the body cannot replace it fast enough, red blood cells decrease. This is one of the most common causes of anemia in people who menstruate.',
      },
      {
        heading: 'Signs to watch for',
        body: 'Signs of anemia include persistent fatigue, weakness, pale skin, dizziness, shortness of breath, headaches, and cold hands or feet. If you experience these, especially alongside heavy periods, a simple blood test can check your iron levels.',
      },
      {
        heading: 'What to do',
        body: 'If you suspect anemia, see a healthcare provider for a blood test. Treatment may include iron supplements and dietary changes. Iron-rich foods include leafy greens, lentils, beans, fortified cereals, and meat. Do not start high-dose iron supplements without medical advice, as excess iron can be harmful.',
      },
      {
        heading: 'Addressing the root cause',
        body: 'While treating anemia is important, it is equally important to address heavy periods if they are the cause. Very heavy periods (soaking through a pad every 1-2 hours, passing large clots) should be evaluated by a healthcare provider to identify the underlying cause.',
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Iron deficiency anemia', url: 'https://www.mayoclinic.org/diseases-conditions/iron-deficiency-anemia/symptoms-causes/syc-20471645' },
      { name: 'WHO — Anaemia', url: 'https://www.who.int/health-topics/anaemia' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['when-to-seek-care', 'period-pain', 'irregular-cycles'],
    simpleExplanation: 'Heavy periods can cause low iron (anemia), which makes you tired, dizzy, and pale. If you feel very tired with heavy periods, ask a doctor for a blood test. Iron-rich foods like leafy greens and lentils can help, but do not take iron pills without medical advice.',
  },
];

export function getArticleById(id: string): LearnArticle | undefined {
  return articles.find(a => a.id === id);
}

export function getArticlesByCategory(category: string): LearnArticle[] {
  if (category === 'all') return articles;
  return articles.filter(a => a.category === category);
}

export function searchArticles(query: string): LearnArticle[] {
  const q = query.toLowerCase().trim();
  if (!q) return articles;
  return articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    a.sections.some(s => s.body.toLowerCase().includes(q) || s.heading.toLowerCase().includes(q))
  );
}
