// Curated educational content for Saheli
// Bilingual (English + Hindi) — sources are real public-health organizations with verified URLs

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface BilingualSection {
  en: ArticleSection;
  hi: ArticleSection;
}

export interface LearnArticle {
  id: string;
  category: string;
  title: { en: string; hi: string };
  summary: { en: string; hi: string };
  sections: BilingualSection[];
  sources: { name: string; url: string }[];
  reviewedDate: string;
  relatedIds: string[];
  simpleExplanation: { en: string; hi: string };
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
    title: {
      en: 'What is menstruation?',
      hi: 'मासिक धर्म क्या है?',
    },
    summary: {
      en: 'Understanding the menstrual cycle, what happens in your body, and why periods occur.',
      hi: 'मासिक चक्र को समझना, आपके शरीर में क्या होता है, और अवधि क्यों आती है।',
    },
    sections: [
      {
        en: {
          heading: 'The menstrual cycle',
          body: 'The menstrual cycle is the natural process by which the body prepares for a possible pregnancy each month. It involves hormonal changes that cause the lining of the uterus to thicken. If pregnancy does not occur, this lining is shed through the vagina as menstrual bleeding — this is your period. A typical cycle lasts between 21 and 35 days, with bleeding lasting 2 to 7 days. However, variation is normal, especially in the first few years after periods begin.',
        },
        hi: {
          heading: 'मासिक चक्र',
          body: 'मासिक चक्र एक प्राकृतिक प्रक्रिया है जिसमें शरीर हर महीने संभावित गर्भावस्था के लिए तैयारी करता है। इसमें हार्मोनल बदलाव होते हैं जो गर्भाशय की परत को मोटा करते हैं। यदि गर्भावस्था नहीं होती, तो यह परत योनि से मासिक रक्तस्राव के रूप में बाहर आती है — यही आपकी अवधि है। एक सामान्य चक्र 21 से 35 दिनों का होता है, और रक्तस्राव 2 से 7 दिन तक रहता है। हालांकि, थोड़ा बदलाव सामान्य है, खासकर अवधि शुरू होने के पहले कुछ वर्षों में।',
        },
      },
      {
        en: {
          heading: 'Phases of the cycle',
          body: 'The cycle has phases: the menstrual phase (bleeding), the follicular phase (the body prepares an egg), ovulation (an egg is released), and the luteal phase (the body prepares for possible pregnancy). These phases are driven by hormones including estrogen and progesterone. The exact timing varies from person to person and can change over time.',
        },
        hi: {
          heading: 'चक्र के चरण',
          body: 'चक्र में चरण होते हैं: मासिक चरण (रक्तस्राव), फॉलिकुलर चरण (शरीर अंडे की तैयारी करता है), ओव्यूलेशन (अंडा छोड़ा जाता है), और ल्यूटियल चरण (शरीर संभावित गर्भावस्था के लिए तैयारी करता है)। ये चरण एस्ट्रोजन और प्रोजेस्टेरोन जैसे हार्मोन द्वारा नियंत्रित होते हैं। सटीक समय हर व्यक्ति में अलग हो सकता है और समय के साथ बदल सकता है।',
        },
      },
      {
        en: {
          heading: 'What is a "normal" cycle?',
          body: 'There is a wide range of normal. Cycles between 21 and 35 days are generally considered typical. Periods lasting 2 to 7 days are common. Flow can vary from light to heavy. What matters most is what is normal for you. Tracking your cycle can help you understand your own pattern and notice changes.',
        },
        hi: {
          heading: '"सामान्य" चक्र क्या है?',
          body: 'सामान्य की एक विस्तृत सीमा है। 21 से 35 दिन के चक्र आम तौर पर सामान्य माने जाते हैं। 2 से 7 दिन तक चलने वाली अवधि आम है। फ्लो हल्के से भारी तक हो सकता है। सबसे महत्वपूर्ण यह है कि आपके लिए सामान्य क्या है। अपने चक्र को ट्रैक करना आपको अपने पैटर्न को समझने और बदलाव देखने में मदद कर सकता है।',
        },
      },
    ],
    sources: [
      { name: 'World Health Organization (WHO)', url: 'https://www.who.int/health-topics/menstrual-health' },
      { name: 'Mayo Clinic — Menstrual cycle', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047190' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['irregular-cycles', 'first-period', 'myths-facts'],
    simpleExplanation: {
      en: 'Every month, your body gets ready for a possible pregnancy by building up a lining in the uterus. If no pregnancy happens, that lining comes out as your period. This is a normal, healthy process that usually happens every 21 to 35 days.',
      hi: 'हर महीने, आपका शरीर गर्भाशय में परत बनाकर संभावित गर्भावस्था के लिए तैयारी करता है। यदि गर्भावस्था नहीं होती, तो वह परत आपकी अवधि के रूप में बाहर आती है। यह एक सामान्य, स्वस्थ प्रक्रिया है जो आमतौर पर हर 21 से 35 दिन में होती है।',
    },
  },
  {
    id: 'first-period',
    category: 'puberty',
    title: {
      en: 'Your first period: what to expect',
      hi: 'आपकी पहली अवधि: क्या उम्मीद करें',
    },
    summary: {
      en: 'A guide for understanding your first period and how to prepare.',
      hi: 'अपनी पहली अवधि को समझने और तैयारी करने के लिए एक मार्गदर्शक।',
    },
    sections: [
      {
        en: {
          heading: 'When does it start?',
          body: 'Most people get their first period (menarche) between ages 9 and 15, with the average around age 12. It usually begins about 2 to 2.5 years after breast development starts. Every person is different, and starting earlier or later can be perfectly normal.',
        },
        hi: {
          heading: 'यह कब शुरू होती है?',
          body: 'अधिकांश लोगों को अपनी पहली अवधि (मेनार्के) 9 से 15 वर्ष की उम्र के बीच आती है, औसतन लगभग 12 वर्ष पर। यह आमतौर पर स्तन विकास शुरू होने के 2 से 2.5 वर्ष बाद शुरू होती है। हर व्यक्ति अलग होता है, और जल्दी या देर से शुरू होना बिल्कुल सामान्य हो सकता है।',
        },
      },
      {
        en: {
          heading: 'What does it look like?',
          body: 'Your first period might be light — just a few spots of blood, or it might be heavier. The blood can be red, brown, or pink. It may last a few days. Your first few periods may be irregular as your body establishes its pattern. This is completely normal.',
        },
        hi: {
          heading: 'यह कैसी दिखती है?',
          body: 'आपकी पहली अवधि हल्की हो सकती है — बस खून के कुछ धब्बे, या यह भारी भी हो सकती है। खून लाल, भूरा, या गुलाबी हो सकता है। यह कुछ दिनों तक रह सकती है। आपकी पहली कुछ अवधियां अनियमित हो सकती हैं क्योंकि आपका शरीर अपना रिदम स्थापित कर रहा होता है। यह पूरी तरह से सामान्य है।',
        },
      },
      {
        en: {
          heading: 'How to prepare',
          body: 'Keep a period kit at home and in your bag with pads, clean underwear, and tissues. Talk to a trusted adult — a parent, older sibling, school counselor, or healthcare provider. Tracking your period when it starts helps you understand your cycle. There is no need to feel embarrassed — menstruation is a normal part of life.',
        },
        hi: {
          heading: 'कैसे तैयारी करें',
          body: 'घर और बैग में पैड, साफ अंडरवियर, और टिश्यू के साथ एक अवधि किट रखें। किसी भरोसेमंद वयस्क से बात करें — माता-पिता, बड़े भाई-बहन, स्कूल काउंसलर, या चिकित्सक से। अवधि शुरू होने पर उसे ट्रैक करना आपको अपने चक्र को समझने में मदद करता है। शर्मिंदा महसूस करने की कोई जरूरत नहीं है — मासिक धर्म जीवन का एक सामान्य हिस्सा है।',
        },
      },
      {
        en: {
          heading: 'Talking to someone',
          body: 'If you feel scared or confused, talking to someone you trust can help. A parent, school nurse, counselor, or doctor can answer your questions. You can also explore the "Help me talk about it" section in this app for conversation guides.',
        },
        hi: {
          heading: 'किसी से बात करें',
          body: 'यदि आप डरी या हैरान हैं, तो किसी भरोसेमंद व्यक्ति से बात करना मदद कर सकता है। माता-पिता, स्कूल नर्स, काउंसलर, या डॉक्टर आपके सवालों के जवाब दे सकते हैं। आप इस ऐप में "बात करने में मदद करें" खंड में भी देख सकती हैं।',
        },
      },
    ],
    sources: [
      { name: 'NHS — Periods', url: 'https://www.nhs.uk/conditions/periods/' },
      { name: 'Mayo Clinic — First period', url: 'https://www.mayoclinic.org/healthy-lifestyle/tween-and-teen-health/in-depth/menstruation/art-20046023' },
      { name: 'UNICEF — Menstrual Hygiene', url: 'https://www.unicef.org/wash/menstrual-hygiene' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['what-is-menstruation', 'myths-facts', 'products-safe-use'],
    simpleExplanation: {
      en: 'Your first period usually happens between ages 9 and 15. It might be light at first, and the blood can be red or brown. Keep some pads ready, and tell a trusted adult. It is completely normal and nothing to be embarrassed about.',
      hi: 'आपकी पहली अवधि आमतौर पर 9 से 15 वर्ष की उम्र में आती है। शुरुआत में यह हल्की हो सकती है, और खून लाल या भूरा हो सकता है। कुछ पैड तैयार रखें, और किसी भरोसेमंद वयस्क को बताएं। यह पूरी तरह से सामान्य है और इसमें शर्मिंदा होने की कोई बात नहीं है।',
    },
  },
  {
    id: 'products-safe-use',
    category: 'products',
    title: {
      en: 'Menstrual products and their safe use',
      hi: 'मासिक उत्पाद और उनका सुरक्षित उपयोग',
    },
    summary: {
      en: 'Pads, tampons, cups, and period underwear — how to choose and use them safely.',
      hi: 'पैड, टैम्पन, कप, और पीरियड अंडरवियर — कैसे चुनें और सुरक्षित रूप से उपयोग करें।',
    },
    sections: [
      {
        en: {
          heading: 'Types of products',
          body: 'Pads (sanitary napkins) absorb blood externally and are worn inside underwear. Tampons are inserted into the vagina to absorb blood internally. Menstrual cups are reusable silicone cups that collect blood. Period underwear looks like regular underwear but has absorbent layers. All are safe when used correctly.',
        },
        hi: {
          heading: 'उत्पादों के प्रकार',
          body: 'पैड (सैनिटरी नैपकिन) बाहर से खून सोखते हैं और अंडरवियर के अंदर पहने जाते हैं। टैम्पन योनि के अंदर डाले जाते हैं ताकि खून अंदर से सोखा जा सके। मासिक कप पुन: उपयोग योग्य सिलिकॉन कप होते हैं जो खून इकट्ठा करते हैं। पीरियड अंडरवियर सामान्य अंडरवियर जैसा दिखता है लेकिन इसमें सोखने वाली परतें होती हैं। सभी सही उपयोग करने पर सुरक्षित हैं।',
        },
      },
      {
        en: {
          heading: 'Changing products',
          body: 'Pads should be changed every 3-4 hours. Tampons should be changed every 4-6 hours, and never left in for more than 8 hours. Menstrual cups can be worn for up to 12 hours. Period underwear can usually last a full day depending on flow. Changing regularly prevents odor, irritation, and infection.',
        },
        hi: {
          heading: 'उत्पाद बदलना',
          body: 'पैड हर 3-4 घंटे में बदलने चाहिए। टैम्पन हर 4-6 घंटे में बदलने चाहिए, और कभी भी 8 घंटे से ज्यादा नहीं छोड़ने चाहिए। मासिक कप 12 घंटे तक पहने जा सकते हैं। पीरियड अंडरवियर फ्लो के अनुसार पूरा दिन चल सकता है। नियमित बदलने से गंध, जलन, और संक्रमण से बचा जा सकता है।',
        },
      },
      {
        en: {
          heading: 'Toxic shock syndrome (TSS)',
          body: 'TSS is a rare but serious condition associated with tampon use. It is caused by bacteria, not the tampon itself. To reduce risk: use the lowest absorbency needed, change tampons regularly, and never leave a tampon in overnight. If you experience sudden high fever, vomiting, diarrhea, dizziness, or a rash while using a tampon, remove it immediately and seek medical care.',
        },
        hi: {
          heading: 'टॉक्सिक शॉक सिंड्रोम (TSS)',
          body: 'TSS टैम्पन उपयोग से जुड़ी एक दुर्लभ लेकिन गंभीर स्थिति है। यह बैक्टीरिया के कारण होता है, टैम्पन से नहीं। जोखिम कम करने के लिए: जितनी जरूरत हो उतनी ही सोखने क्षमता का टैम्पन इस्तेमाल करें, टैम्पन नियमित बदलें, और कभी भी टैम्पन रात भर न छोड़ें। टैम्पन उपयोग करते समय यदि अचानक तेज बुखार, उल्टी, दस्त, चक्कर, या चकत्ते हों, तो तुरंत टैम्पन निकालें और चिकित्सकीय सहायता लें।',
        },
      },
      {
        en: {
          heading: 'Safe disposal',
          body: 'Wrap used pads and tampons in tissue or the wrapper of the new product before disposing in a bin. Do not flush pads or tampons down the toilet as they can cause blockages. Always wash your hands before and after changing products.',
        },
        hi: {
          heading: 'सुरक्षित निपटान',
          body: 'इस्तेमाल किए पैड और टैम्पन को टिश्यू या नए उत्पाद के रैपर में लपेटकर बिन में डालें। पैड या टैम्पन को टॉयलेट में न फेंकें क्योंकि इससे ब्लॉकेज हो सकता है। उत्पाद बदलने से पहले और बाद में हमेशा अपने हाथ धोएं।',
        },
      },
    ],
    sources: [
      { name: 'FDA — Menstrual products', url: 'https://www.fda.gov/consumers/womens-health-topics/menstrual-tampons-and-pads-information-about-potential-health-risks' },
      { name: 'Mayo Clinic — Toxic shock syndrome', url: 'https://www.mayoclinic.org/diseases-conditions/toxic-shock-syndrome/symptoms-causes/syc-20355614' },
      { name: 'UNICEF — Menstrual Hygiene Management', url: 'https://www.unicef.org/wash/menstrual-hygiene' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['hygiene-basics', 'myths-facts', 'what-is-menstruation'],
    simpleExplanation: {
      en: 'There are pads, tampons, cups, and period underwear. Change pads every 3-4 hours and tampons every 4-6 hours. Always wash your hands before and after. Wrap used products before throwing them away. Never flush them.',
      hi: 'पैड, टैम्पन, कप, और पीरियड अंडरवियर उपलब्ध हैं। पैड हर 3-4 घंटे और टैम्पन हर 4-6 घंटे में बदलें। उत्पाद बदलने से पहले और बाद में हमेशा हाथ धोएं। इस्तेमाल किए उत्पाद को फेंकने से पहले लपेटें। उन्हें टॉयलेट में कभी न फेंकें।',
    },
  },
  {
    id: 'hygiene-basics',
    category: 'hygiene',
    title: {
      en: 'Menstrual hygiene basics',
      hi: 'मासिक स्वच्छता की मूल बातें',
    },
    summary: {
      en: 'Keeping clean and comfortable during your period.',
      hi: 'अवधि के दौरान साफ और आरामदायक रहना।',
    },
    sections: [
      {
        en: {
          heading: 'Washing',
          body: 'Wash your genital area with warm water. Mild, unscented soap can be used externally. Avoid douching or using scented products inside the vagina — these can disrupt the natural balance and cause infections. The vagina is self-cleaning.',
        },
        hi: {
          heading: 'धुलाई',
          body: 'अपने जननांग क्षेत्र को गर्म पानी से धोएं। हल्के, बिना खुशबू वाले साबुन का बाहरी उपयोग किया जा सकता है। योनि के अंदर डचिंग या सुगंधित उत्पाध उपयोग से बचें — ये प्राकृतिक संतुलन बिगाड़ सकते हैं और संक्रमण का कारण बन सकते हैं। योनि स्वयं-सफाई करती है।',
        },
      },
      {
        en: {
          heading: 'During your period',
          body: 'Change your menstrual product regularly. Bathe or shower daily as usual. Wash your hands before and after changing products. Wear clean, comfortable underwear. Cotton underwear is breathable and helps prevent irritation.',
        },
        hi: {
          heading: 'अवधि के दौरान',
          body: 'अपना मासिक उत्पाद नियमित बदलें। हर दिन नहाएं या शॉवर लें। उत्पाद बदलने से पहले और बाद में हाथ धोएं। साफ, आरामदायक अंडरवियर पहनें। सूती अंडरवियर हवादार होता है और जलन से बचने में मदद करता है।',
        },
      },
      {
        en: {
          heading: 'Disposal and sanitation',
          body: 'Dispose of used products properly — wrap them and put them in a bin. If you do not have access to proper disposal facilities, carry a small bag to wrap used products until you can dispose of them safely. This is especially important when traveling or in public restrooms.',
        },
        hi: {
          heading: 'निपटान और स्वच्छता',
          body: 'इस्तेमाल किए उत्पादों का सही ढंग से निपटान करें — उन्हें लपेटें और बिन में डालें। यदि उचित निपटान सुविधा नहीं है, तो एक छोटी थैली साथ रखें ताकि इस्तेमाल किए उत्पादों को तब तक लपेट कर रख सकें जब तक सुरक्षित रूप से निपटान न कर सकें। यह यात्रा करते समय या सार्वजनिक शौचालय में विशेष रूप से महत्वपूर्ण है।',
        },
      },
      {
        en: {
          heading: 'Access and dignity',
          body: 'Access to clean menstrual products and safe hygiene facilities is a basic right, not a luxury. Many organizations work to improve menstrual hygiene access. If you are struggling to access products, see the "Find support" section in this app.',
        },
        hi: {
          heading: 'पहुंच और सम्मान',
          body: 'साफ मासिक उत्पादों और सुरक्षित स्वच्छता सुविधाओं तक पहुंच एक बुनियादी अधिकार है, विलासिता नहीं। कई संगठन मासिक स्वच्छता की पहुंच सुधारने के लिए काम करते हैं। यदि आपको उत्पाद पाने में कठिनाई हो रही है, तो इस ऐप में "समर्थन खोजें" खंड देखें।',
        },
      },
    ],
    sources: [
      { name: 'UNICEF — Menstrual Hygiene', url: 'https://www.unicef.org/wash/menstrual-hygiene' },
      { name: 'WHO — Menstrual Health', url: 'https://www.who.int/health-topics/menstrual-health' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['products-safe-use', 'unexpected-period', 'myths-facts'],
    simpleExplanation: {
      en: 'Wash with warm water and mild soap outside only. Change products regularly. Always wash your hands. Wear clean cotton underwear. Wrap used products before throwing them away.',
      hi: 'केवल बाहर से गर्म पानी और हल्के साबुन से धोएं। उत्पाद नियमित बदलें। हमेशा हाथ धोएं। साफ सूती अंडरवियर पहनें। इस्तेमाल किए उत्पाद फेंकने से पहले लपेटें।',
    },
  },
  {
    id: 'irregular-cycles',
    category: 'symptoms',
    title: {
      en: 'Understanding irregular cycles',
      hi: 'अनियमित चक्र को समझना',
    },
    summary: {
      en: 'What irregular periods mean, common causes, and when to seek advice.',
      hi: 'अनियमित अवधि का क्या मतलब है, सामान्य कारण, और सलाह कब लें।',
    },
    sections: [
      {
        en: {
          heading: 'What is irregular?',
          body: 'An irregular cycle is one that varies significantly in length from month to month, or that falls outside the typical range of 21-35 days. Some variation is normal, especially in the first few years after your period begins, during perimenopause, or when under significant stress.',
        },
        hi: {
          heading: 'अनियमित क्या है?',
          body: 'अनियमित चक्र वह है जो महीने-दर-महीने लंबाई में काफी बदलता है, या 21-35 दिन की सामान्य सीमा से बाहर है। कुछ बदलाव सामान्य है, खासकर अवधि शुरू होने के पहले कुछ वर्षों में, पेरिमेनोपॉज के दौरान, या जब तनाव अधिक हो।',
        },
      },
      {
        en: {
          heading: 'Common causes',
          body: 'Irregular cycles can be caused by stress, significant weight changes, intense exercise, hormonal changes, thyroid conditions, polycystic ovary syndrome (PCOS), certain medications, and other factors. In the first 1-2 years after menarche, irregular periods are very common as the body establishes its rhythm.',
        },
        hi: {
          heading: 'सामान्य कारण',
          body: 'अनियमित चक्र तनाव, वजन में बड़े बदलाव, तीव्र व्यायाम, हार्मोनल बदलाव, थायराइड स्थितियां, पॉलीसिस्टिक ओवरी सिंड्रोम (PCOS), कुछ दवाएं, और अन्य कारणों से हो सकते हैं। मेनार्के के बाद पहले 1-2 वर्षों में अनियमित अवधि बहुत आम है क्योंकि शरीर अपना रिदम स्थापित कर रहा होता है।',
        },
      },
      {
        en: {
          heading: 'When to seek medical advice',
          body: 'Consider speaking with a healthcare provider if: your cycles are consistently shorter than 21 days or longer than 35 days, you miss periods for 3 or more months, your periods suddenly become very heavy or painful, or you have bleeding between periods. These do not necessarily mean something is wrong, but a healthcare professional can help determine the cause.',
        },
        hi: {
          heading: 'चिकित्सकीय सलाह कब लें',
          body: 'निम्नलिखित स्थितियों में चिकित्सक से बात करें: आपके चक्र लगातार 21 दिन से छोटे या 35 दिन से लंबे हों, आपको 3 या अधिक महीने अवधि न आए, आपकी अवधि अचानक बहुत भारी या दर्दनाक हो जाए, या अवधि के बीच रक्तस्राव हो। इसका मतलब जरूरी नहीं कि कुछ गलत है, लेकिन एक योग्य चिकित्सक कारण पता लगाने में मदद कर सकता है।',
        },
      },
      {
        en: {
          heading: 'Tracking helps',
          body: 'Keeping a record of your periods helps you and your healthcare provider understand your pattern. Saheli can help you track your cycle. Remember that having irregular periods does not mean something is wrong with you — it is a reason to gather information and talk to a professional.',
        },
        hi: {
          heading: 'ट्रैकिंग मदद करती है',
          body: 'अपनी अवधियों का रिकॉर्ड रखना आपको और आपके चिकित्सक को आपका पैटर्न समझने में मदद करता है। Saheli आपको अपना चक्र ट्रैक करने में मदद कर सकता है। याद रखें कि अनियमित अवधि का मतलब यह नहीं है कि आपमें कुछ गलत है — यह जानकारी जुटाने और किसी विशेषज्ञ से बात करने का एक कारण है।',
        },
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Irregular periods', url: 'https://www.mayoclinic.org/diseases-conditions/menstrual-cycle/expert-answers/irregular-periods/faq-20057911' },
      { name: 'ACOG — Menstrual Cycle', url: 'https://www.acog.org/womens-health/faqs/your-menstrual-period' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['what-is-menstruation', 'late-period', 'pcos-basics'],
    simpleExplanation: {
      en: 'An irregular period is when your cycle length changes a lot or is shorter than 21 days or longer than 35 days. This can be caused by stress, weight changes, or hormones. It is common in the first few years. If it keeps happening, talk to a doctor.',
      hi: 'अनियमित अवधि तब होती है जब आपके चक्र की लंबाई बहुत बदलती है या 21 दिन से छोटी या 35 दिन से लंबी हो। इसे तनाव, वजन बदलाव, या हार्मोन के कारण हो सकता है। पहले कुछ वर्षों में यह आम है। यदि यह लगातार होता रहे, तो डॉक्टर से बात करें।',
    },
  },
  {
    id: 'late-period',
    category: 'symptoms',
    title: {
      en: 'Why might my period be late?',
      hi: 'मेरी अवधि देरी से क्यों आ सकती है?',
    },
    summary: {
      en: 'Common reasons for a delayed period and what to do.',
      hi: 'अवधि में देरी के सामान्य कारण और क्या करें।',
    },
    sections: [
      {
        en: {
          heading: 'Common reasons',
          body: 'A period can be late for many reasons: stress, changes in weight or diet, increased exercise, travel, illness, changes in routine, hormonal fluctuations, certain medications, or pregnancy. A late period does not automatically mean something is wrong.',
        },
        hi: {
          heading: 'सामान्य कारण',
          body: 'अवधि कई कारणों से देरी से आ सकती है: तनाव, वजन या आहार में बदलाव, अधिक व्यायाम, यात्रा, बीमारी, दिनचर्या में बदलाव, हार्मोनल उतार-चढ़ाव, कुछ दवाएं, या गर्भावस्था। देरी से आने का मतलब स्वतः ही कुछ गलत होना नहीं है।',
        },
      },
      {
        en: {
          heading: 'When it is normal',
          body: 'It is normal for periods to occasionally be a few days early or late, especially during times of stress or life changes. In the first few years after your period starts, irregular timing is very common. A single late period is usually not a cause for concern.',
        },
        hi: {
          heading: 'जब यह सामान्य है',
          body: 'अवधि का कभी-कभी कुछ दिन जल्दी या देर से आना सामान्य है, खासकर तनाव या जीवन में बदलाव के समय। अवधि शुरू होने के पहले कुछ वर्षों में अनियमित समय बहुत आम है। एक बार देरी से आना आमतौर पर चिंता का कारण नहीं है।',
        },
      },
      {
        en: {
          heading: 'When to seek advice',
          body: 'If your period is more than 7 days late and you are sexually active, consider taking a pregnancy test if pregnancy is possible. If you miss 3 or more periods in a row, or if your cycle pattern changes significantly, speak with a healthcare provider. If you have severe pain, heavy bleeding when the period does come, or other concerning symptoms, seek medical care.',
        },
        hi: {
          heading: 'सलाह कब लें',
          body: 'यदि आपकी अवधि 7 दिन से अधिक देरी से आती है और आप यौन सक्रिय हैं, तो गर्भावस्था संभव होने पर गर्भावस्था परीक्षण करें। यदि आपको लगातार 3 या अधिक अवधियां छूट जाएं, या आपके चक्र पैटर्न में बड़ा बदलाव आए, तो चिकित्सक से बात करें। यदि तेज दर्द, अवधि आने पर भारी रक्तस्राव, या अन्य चिंताजनक लक्षण हों, तो चिकित्सकीय सहायता लें।',
        },
      },
      {
        en: {
          heading: 'What to do',
          body: 'Track your cycle to see patterns. Note any life changes, stress, or health events. Continue to take care of your body with adequate rest, nutrition, and hydration. If you are concerned, contact a healthcare professional — they can help identify the cause.',
        },
        hi: {
          heading: 'क्या करें',
          body: 'पैटर्न देखने के लिए अपना चक्र ट्रैक करें। जीवन में बदलाव, तनाव, या स्वास्थ्य घटनाओं को नोट करें। पर्याप्त आराम, पोषण, और जलयोग के साथ अपने शरीर की देखभाल जारी रखें। यदि चिंतित हैं, तो चिकित्सक से संपर्क करें — वे कारण पहचानने में मदद कर सकते हैं।',
        },
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Missed periods', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/expert-answers/menstrual-cycle/faq-20057911' },
      { name: 'NHS — Missed periods', url: 'https://www.nhs.uk/conditions/stopped-or-missed-periods/' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['irregular-cycles', 'when-to-seek-care', 'what-is-menstruation'],
    simpleExplanation: {
      en: 'A late period can happen because of stress, weight changes, exercise, illness, or pregnancy. One late period is usually fine. If you miss 3 in a row or have pain, talk to a doctor. If pregnancy is possible, take a test.',
      hi: 'अवधि तनाव, वजन बदलाव, व्यायाम, बीमारी, या गर्भावस्था के कारण देरी से आ सकती है। एक बार देरी से आना आमतौर पर ठीक है। यदि लगातार 3 छूट जाएं या दर्द हो, तो डॉक्टर से बात करें। यदि गर्भावस्था संभव है, तो परीक्षण करें।',
    },
  },
  {
    id: 'pcos-basics',
    category: 'conditions',
    title: {
      en: 'Understanding PCOS',
      hi: 'PCOS को समझना',
    },
    summary: {
      en: 'What polycystic ovary syndrome is, common signs, and how it is managed.',
      hi: 'पॉलीसिस्टिक ओवरी सिंड्रोम क्या है, सामान्य संकेत, और इसे कैसे प्रबंधित किया जाता है।',
    },
    sections: [
      {
        en: {
          heading: 'What is PCOS?',
          body: 'Polycystic ovary syndrome (PCOS) is a common hormonal condition that affects how the ovaries work. It is estimated to affect 1 in 10 people with ovaries of reproductive age. Despite the name, "polycystic" refers to many small follicles (not harmful cysts) that can be seen on an ultrasound.',
        },
        hi: {
          heading: 'PCOS क्या है?',
          body: 'पॉलीसिस्टिक ओवरी सिंड्रोम (PCOS) एक आम हार्मोनल स्थिति है जो अंडाशय के काम करने के तरीके को प्रभावित करती है। अनुमान है कि यह प्रजनन आयु के 10 में से 1 व्यक्ति को प्रभावित करता है। नाम के बावजूद, "पॉलीसिस्टिक" का मतलब कई छोटे फॉलिकल्स हैं (हानिकारक सिस्ट नहीं) जो अल्ट्रासाउंड पर देखे जा सकते हैं।',
        },
      },
      {
        en: {
          heading: 'Common signs',
          body: 'PCOS may involve irregular or infrequent periods, higher levels of androgens (which can cause acne or excess hair growth), and difficulty getting pregnant. Not everyone with PCOS has all these signs, and the condition exists on a spectrum. PCOS cannot be diagnosed from a period calendar alone.',
        },
        hi: {
          heading: 'सामान्य संकेत',
          body: 'PCOS में अनियमित या दुर्लभ अवधि, एंड्रोजन के उच्च स्तर (जिससे मुहांसे या अतिरिक्त बाल वृद्धि हो सकती है), और गर्भधारण में कठिनाई हो सकती है। हर PCOS वाले व्यक्ति में ये सभी संकेत नहीं होते, और यह स्थिति एक स्पेक्ट्रम पर मौजूद है। PCOS का निदान केवल अवधि कैलेंडर से नहीं किया जा सकता।',
        },
      },
      {
        en: {
          heading: 'Diagnosis and management',
          body: 'PCOS is diagnosed by a healthcare professional using a combination of medical history, physical examination, blood tests, and sometimes ultrasound. Management depends on individual symptoms and goals, and may include lifestyle changes, medications, and regular monitoring. PCOS is a manageable condition.',
        },
        hi: {
          heading: 'निदान और प्रबंधन',
          body: 'PCOS का निदान एक योग्य चिकित्सक चिकित्सा इतिहास, शारीरिक परीक्षण, रक्त परीक्षण, और कभी-कभी अल्ट्रासाउंड के संयोजन से करता है। प्रबंधन व्यक्तिगत लक्षणों और लक्ष्यों पर निर्भर करता है, और इसमें जीवनशैली बदलाव, दवाएं, और नियमित निगरानी शामिल हो सकती है। PCOS एक प्रबंधनीय स्थिति है।',
        },
      },
      {
        en: {
          heading: 'If you suspect PCOS',
          body: 'If you have irregular periods, acne, or other signs that concern you, speak with a healthcare provider. Do not self-diagnose based on an app or online information. A proper medical evaluation is needed. PCOS is common and treatable — seeking help is a positive step.',
        },
        hi: {
          heading: 'यदि आपको PCOS का संदेह है',
          body: 'यदि आपको अनियमित अवधि, मुहांसे, या अन्य संकेत हैं जो चिंतित करते हैं, तो चिकित्सक से बात करें। किसी ऐप या ऑनलाइन जानकारी के आधार पर स्व-निदान न करें। उचित चिकित्सकीय मूल्यांकन आवश्यक है। PCOS आम और उपचार योग्य है — सहायता लेना एक सकारात्मक कदम है।',
        },
      },
    ],
    sources: [
      { name: 'Mayo Clinic — PCOS', url: 'https://www.mayoclinic.org/diseases-conditions/pcos/symptoms-causes/syc-20353439' },
      { name: 'WHO — PCOS', url: 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['irregular-cycles', 'endometriosis-basics', 'when-to-seek-care'],
    simpleExplanation: {
      en: 'PCOS is a common hormone condition that can cause irregular periods, acne, and sometimes difficulty getting pregnant. It affects about 1 in 10 people. A doctor diagnoses it with blood tests and an ultrasound. It is manageable with the right care.',
      hi: 'PCOS एक आम हार्मोन स्थिति है जो अनियमित अवधि, मुहांसे, और कभी-कभी गर्भधारण में कठिनाई का कारण बन सकती है। यह लगभग 10 में से 1 व्यक्ति को प्रभावित करती है। डॉक्टर रक्त परीक्षण और अल्ट्रासाउंड से इसका निदान करता है। सही देखभाल से यह प्रबंधनीय है।',
    },
  },
  {
    id: 'endometriosis-basics',
    category: 'conditions',
    title: {
      en: 'Understanding endometriosis',
      hi: 'एंडोमेट्रियोसिस को समझना',
    },
    summary: {
      en: 'What endometriosis is, common symptoms, and why diagnosis matters.',
      hi: 'एंडोमेट्रियोसिस क्या है, सामान्य लक्षण, और निदान क्यों महत्वपूर्ण है।',
    },
    sections: [
      {
        en: {
          heading: 'What is endometriosis?',
          body: 'Endometriosis is a condition where tissue similar to the lining of the uterus grows outside the uterus, commonly on the ovaries, fallopian tubes, and other pelvic organs. This tissue responds to hormonal changes during the menstrual cycle, which can cause pain, inflammation, and sometimes scar tissue.',
        },
        hi: {
          heading: 'एंडोमेट्रियोसिस क्या है?',
          body: 'एंडोमेट्रियोसिस एक स्थिति है जिसमें गर्भाशय की परत के समान ऊतक गर्भाशय के बाहर बढ़ता है, आमतौर पर अंडाशय, फैलोपियन ट्यूब, और अन्य श्रोणि अंगों पर। यह ऊतक मासिक चक्र के दौरान हार्मोनल बदलावों का जवाब देता है, जिससे दर्द, सूजन, और कभी-कभी ऊतक की परत बन सकती है।',
        },
      },
      {
        en: {
          heading: 'Common symptoms',
          body: 'Symptoms may include severe period pain (dysmenorrhea), pain during or after sex, chronic pelvic pain, heavy periods, pain with bowel movements or urination during periods, and sometimes difficulty getting pregnant. The severity of pain does not always match the extent of the condition. Some people have no symptoms.',
        },
        hi: {
          heading: 'सामान्य लक्षण',
          body: 'लक्षणों में तेज अवधि दर्द (डिस्मेनोरिया), संभोग के दौरान या बाद में दर्द, लंबे समय का श्रोणि दर्द, भारी अवधि, अवधि के दौरान मल त्याग या पेशाब में दर्द, और कभी-कभी गर्भधारण में कठिनाई शामिल हो सकती है। दर्द की गंभीरता हमेशा स्थिति की सीमा से मेल नहीं खाती। कुछ लोगों में कोई लक्षण नहीं होता।',
        },
      },
      {
        en: {
          heading: 'Diagnosis',
          body: 'Endometriosis is typically diagnosed through medical history, pelvic examination, imaging, and sometimes laparoscopy (a minimally invasive surgical procedure). Diagnosis often takes years because symptoms can be mistaken for "normal" period pain. If your period pain significantly interferes with daily life, this is not normal and deserves medical evaluation.',
        },
        hi: {
          heading: 'निदान',
          body: 'एंडोमेट्रियोसिस का निदान आमतौर पर चिकित्सा इतिहास, श्रोणि परीक्षण, इमेजिंग, और कभी-कभी लैप्रोस्कोपी (एक न्यूनतम इनवेसिव सर्जिकल प्रक्रिया) से होता है। निदान में अक्सर वर्षों लग जाते हैं क्योंकि लक्षणों को "सामान्य" अवधि दर्द समझ लिया जाता है। यदि आपका अवधि दर्द दैनिक जीवन में काफी हस्तक्षेप करता है, तो यह सामान्य नहीं है और इसके लिए चिकित्सकीय मूल्यांकन आवश्यक है।',
        },
      },
      {
        en: {
          heading: 'Management',
          body: 'While there is no cure, endometriosis can be managed. Treatment options include pain management, hormonal medications, and in some cases surgery. The right approach depends on individual symptoms, goals, and the extent of the condition. A gynecologist or specialist can help develop a management plan.',
        },
        hi: {
          heading: 'प्रबंधन',
          body: 'हालांकि इसका कोई इलाज नहीं है, एंडोमेट्रियोसिस को प्रबंधित किया जा सकता है। उपचार विकल्पों में दर्द प्रबंधन, हार्मोनल दवाएं, और कुछ मामलों में सर्जरी शामिल है। सही दृष्टिकोण व्यक्तिगत लक्षणों, लक्ष्यों, और स्थिति की सीमा पर निर्भर करता है। एक स्त्री रोग विशेषज्ञ प्रबंधन योजना बनाने में मदद कर सकते हैं।',
        },
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Endometriosis', url: 'https://www.mayoclinic.org/diseases-conditions/endometriosis/symptoms-causes/syc-20354689' },
      { name: 'WHO — Endometriosis', url: 'https://www.who.int/news-room/fact-sheets/detail/endometriosis' },
      { name: 'Endometriosis Foundation of America', url: 'https://www.endofound.org' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['pcos-basics', 'when-to-seek-care', 'period-pain'],
    simpleExplanation: {
      en: 'Endometriosis is when tissue like the uterus lining grows outside the uterus. It can cause very painful periods and pelvic pain. If your period pain stops you from doing daily activities, see a doctor. It can be managed with treatment.',
      hi: 'एंडोमेट्रियोसिस तब होता है जब गर्भाशय की परत जैसा ऊतक गर्भाशय के बाहर बढ़ता है। इससे बहुत दर्दनाक अवधि और श्रोणि दर्द हो सकता है। यदि आपका अवधि दर्द आपको दैनिक काम करने से रोकता है, तो डॉक्टर को देखें। उपचार से इसे प्रबंधित किया जा सकता है।',
    },
  },
  {
    id: 'period-pain',
    category: 'symptoms',
    title: {
      en: 'Managing period pain',
      hi: 'अवधि दर्द का प्रबंधन',
    },
    summary: {
      en: 'Understanding period pain and general comfort measures.',
      hi: 'अवधि दर्द को समझना और सामान्य आराम के उपाय।',
    },
    sections: [
      {
        en: {
          heading: 'Types of period pain',
          body: 'Mild to moderate cramping during your period is common. This pain (dysmenorrhea) is caused by the uterus contracting to shed its lining. Primary dysmenorrhea is pain without an underlying condition. Secondary dysmenorrhea is pain caused by a condition like endometriosis or fibroids. Pain that is severe, worsening, or interferes with daily activities should be evaluated by a healthcare professional.',
        },
        hi: {
          heading: 'अवधि दर्द के प्रकार',
          body: 'अवधि के दौरान हल्के से मध्यम ऐंठन आम है। यह दर्द (डिस्मेनोरिया) गर्भाशय के सिकुड़ने से होता है जब वह अपनी परत बाहर निकालता है। प्राथमिक डिस्मेनोरिया बिना किसी अंतर्निहित स्थिति के दर्द है। द्वितीयक डिस्मेनोरिया एंडोमेट्रियोसिस या फाइब्रॉयड जैसी स्थिति के कारण दर्द है। गंभीर, बढ़ता, या दैनिक गतिविधियों में हस्तक्षेप करने वाले दर्द के लिए चिकित्सकीय मूल्यांकन होना चाहिए।',
        },
      },
      {
        en: {
          heading: 'General comfort measures',
          body: 'A warm heating pad on the lower abdomen can help relax muscles. Gentle exercise, like walking or stretching, may reduce cramps. Staying hydrated and getting adequate rest can help. Over-the-counter pain relievers like ibuprofen can be effective for many people — follow package instructions and consult a pharmacist if you have questions.',
        },
        hi: {
          heading: 'सामान्य आराम के उपाय',
          body: 'निचले पेट पर गर्म हीटिंग पैड रखने से मांसपेशियों को आराम मिल सकता है। हल्का व्यायाम, जैसे टहलना या खिंचाव, ऐंठन कम कर सकता है। भरपूर पानी पीना और पर्याप्त आराम करना मदद कर सकता है। बिना पर्ची वाली दर्द निवारक दवाएं जैसे आइबुप्रोफेन कई लोगों के लिए प्रभावी हो सकती हैं — पैकेज निर्देशों का पालन करें और यदि सवाल हों तो फार्मासिस्ट से पूछें।',
        },
      },
      {
        en: {
          heading: 'When pain is not normal',
          body: 'Period pain that forces you to miss school or work, pain that does not improve with over-the-counter medication, pain that worsens over time, or pain accompanied by heavy bleeding, fever, or other symptoms is not something to simply endure. These signs warrant a medical evaluation to check for underlying conditions.',
        },
        hi: {
          heading: 'जब दर्द सामान्य नहीं है',
          body: 'ऐसा अवधि दर्द जो आपको स्कूल या काम से गायब रहने पर मजबूर करे, बिना पर्ची वाली दवा से ठीक न हो, समय के साथ बढ़े, या भारी रक्तस्राव, बुखार, या अन्य लक्षणों के साथ हो — इसे बस सहन नहीं करना चाहिए। ये संकेत अंतर्निहित स्थितियों की जांच के लिए चिकित्सकीय मूल्यांकन के योग्य हैं।',
        },
      },
      {
        en: {
          heading: 'Do not suffer in silence',
          body: 'Severe period pain is often dismissed as "just part of being a woman," but it should not be. You deserve to have your pain taken seriously. If your pain is significant, seek care from a healthcare professional who can evaluate you properly.',
        },
        hi: {
          heading: 'चुपचाप दर्द न सहें',
          body: 'तेज अवधि दर्द को अक्सर "महिला होने का हिस्सा" कहकर नजरअंदाज कर दिया जाता है, लेकिन ऐसा नहीं होना चाहिए। आपके दर्द को गंभीरता से लिया जाना चाहिए। यदि आपका दर्द महत्वपूर्ण है, तो एक ऐसे चिकित्सक से सहायता लें जो आपका ठीक से मूल्यांकन कर सके।',
        },
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Menstrual cramps', url: 'https://www.mayoclinic.org/diseases-conditions/menstrual-cramps/symptoms-causes/syc-20374938' },
      { name: 'ACOG — Dysmenorrhea', url: 'https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['endometriosis-basics', 'when-to-seek-care', 'symptom-guidance'],
    simpleExplanation: {
      en: 'Mild period cramps are normal and can be helped with a heating pad, gentle exercise, and over-the-counter pain medicine. But if your pain is very bad, gets worse, or stops you from doing daily things, see a doctor. Severe pain is not something to just endure.',
      hi: 'हल्की अवधि ऐंठन सामान्य है और हीटिंग पैड, हल्के व्यायाम, और बिना पर्ची वाली दर्द दवा से राहत मिल सकती है। लेकिन यदि आपका दर्द बहुत तेज है, बढ़ रहा है, या आपको दैनिक काम करने से रोकता है, तो डॉक्टर को देखें। तेज दर्द को बस सहना नहीं चाहिए।',
    },
  },
  {
    id: 'myths-facts',
    category: 'myths',
    title: {
      en: 'Myths and facts about menstruation',
      hi: 'मासिक धर्म के बारे में मिथक और तथ्य',
    },
    summary: {
      en: 'Clearing up common misconceptions about periods.',
      hi: 'अवधि के बारे में आम भ्रांतियों को दूर करना।',
    },
    sections: [
      {
        en: {
          heading: 'Myth: You cannot get pregnant during your period',
          body: 'Fact: While less likely, pregnancy is possible during your period, especially if you have a short cycle. Sperm can survive in the body for several days. If you do not want to become pregnant, use contraception consistently regardless of where you are in your cycle.',
        },
        hi: {
          heading: 'मिथक: अवधि के दौरान आप गर्भवती नहीं हो सकतीं',
          body: 'तथ्य: संभावना कम होने के बावजूद, अवधि के दौरान गर्भावस्था संभव है, खासकर यदि आपका चक्र छोटा है। शुक्राणु शरीर में कई दिनों तक जीवित रह सकते हैं। यदि आप गर्भवती नहीं होना चाहतीं, तो चक्र के किसी भी चरण में निरंतर गर्भनिरोध का उपयोग करें।',
        },
      },
      {
        en: {
          heading: 'Myth: Periods are dirty or impure',
          body: 'Fact: Menstrual blood is a normal bodily fluid. Menstruation is a natural biological process, not something dirty or shameful. Cultural beliefs that restrict people during their period are based on tradition, not science. Everyone deserves to manage their period with dignity.',
        },
        hi: {
          heading: 'मिथक: अवधि गंदी या अशुद्ध है',
          body: 'तथ्य: मासिक रक्त एक सामान्य शारीरिक तरल पदार्थ है। मासिक धर्म एक प्राकृतिक जैविक प्रक्रिया है, कुछ गंदा या शर्मनाक नहीं। सांस्कृतिक मान्यताएं जो अवधि के दौरान लोगों को प्रतिबंधित करती हैं, परंपरा पर आधारित हैं, विज्ञान पर नहीं। हर किसी को अपनी अवधि को सम्मान के साथ प्रबंधित करने का अधिकार है।',
        },
      },
      {
        en: {
          heading: 'Myth: You should not exercise during your period',
          body: 'Fact: Exercise during your period is safe and can actually help reduce cramps and improve mood. Listen to your body — if you feel tired, lighter activity is fine, but there is no medical reason to avoid exercise.',
        },
        hi: {
          heading: 'मिथक: अवधि के दौरान व्यायाम नहीं करना चाहिए',
          body: 'तथ्य: अवधि के दौरान व्यायाम सुरक्षित है और वास्तव में ऐंठन कम करने और मूड सुधारने में मदद कर सकता है। अपने शरीर की सुनें — यदि थका हुआ महसूस करती हैं, तो हल्की गतिविधि ठीक है, लेकिन व्यायाम से बचने का कोई चिकित्सकीय कारण नहीं है।',
        },
      },
      {
        en: {
          heading: 'Myth: Irregular periods mean something is seriously wrong',
          body: 'Fact: Many people have irregular periods, especially in the first few years, during stress, or during perimenopause. While persistent irregularity should be discussed with a healthcare provider, it does not automatically mean something is seriously wrong.',
        },
        hi: {
          heading: 'मिथक: अनियमित अवधि का मतलब कुछ गंभीर गलत है',
          body: 'तथ्य: कई लोगों को अनियमित अवधि होती है, खासकर पहले कुछ वर्षों में, तनाव के दौरान, या पेरिमेनोपॉज में। जबकि लगातार अनियमितता को चिकित्सक से चर्चा करनी चाहिए, इसका मतलब स्वतः ही कुछ गंभीर गलत होना नहीं है।',
        },
      },
      {
        en: {
          heading: 'Myth: PMS is "all in your head"',
          body: 'Fact: Premenstrual syndrome (PMS) involves real physical and emotional changes driven by hormonal fluctuations. Symptoms like mood changes, bloating, and breast tenderness are experienced by many people and are biological, not imaginary.',
        },
        hi: {
          heading: 'मिथक: PMS "सब आपके दिमाग में है"',
          body: 'तथ्य: प्रीमेंस्ट्रुअल सिंड्रोम (PMS) में हार्मोनल उतार-चढ़ाव के कारण वास्तविक शारीरिक और भावनात्मक बदलाव होते हैं। मूड बदलाव, सूजन, और स्तन कोमलता जैसे लक्षण कई लोगों द्वारा अनुभव किए जाते हैं और जैविक हैं, काल्पनिक नहीं।',
        },
      },
    ],
    sources: [
      { name: 'UNICEF — Menstrual Health', url: 'https://www.unicef.org/wash/menstrual-hygiene' },
      { name: 'WHO — Menstrual Health', url: 'https://www.who.int/health-topics/menstrual-health' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['what-is-menstruation', 'hygiene-basics', 'first-period'],
    simpleExplanation: {
      en: 'Periods are not dirty, you can exercise during them, and you can get pregnant during your period. PMS is real, not imaginary. Irregular periods do not always mean something is wrong. These are facts, not myths.',
      hi: 'अवधि गंदी नहीं है, इसके दौरान व्यायाम कर सकती हैं, और अवधि के दौरान गर्भवती हो सकती हैं। PMS सच है, काल्पनिक नहीं। अनियमित अवधि का हमेशा कुछ गलत होना मतलब नहीं है। ये तथ्य हैं, मिथक नहीं।',
    },
  },
  {
    id: 'emotional-wellbeing',
    category: 'wellbeing',
    title: {
      en: 'Emotional well-being and your cycle',
      hi: 'भावनात्मक कल्याण और आपका चक्र',
    },
    summary: {
      en: 'How hormones affect mood and how to take care of yourself.',
      hi: 'हार्मोन कैसे मूड को प्रभावित करते हैं और अपना ख्याल कैसे रखें।',
    },
    sections: [
      {
        en: {
          heading: 'Hormones and mood',
          body: 'Hormonal changes during the menstrual cycle can affect your mood. Some people experience mood changes before their period (PMS) that can include irritability, sadness, anxiety, or sensitivity. These are linked to the natural rise and fall of hormones and are real experiences, not "imagined."',
        },
        hi: {
          heading: 'हार्मोन और मूड',
          body: 'मासिक चक्र के दौरान हार्मोनल बदलाव आपके मूड को प्रभावित कर सकते हैं। कुछ लोग अवधि से पहले मूड बदलाव (PMS) अनुभव करते हैं जिसमें चिड़चिड़ापन, उदासी, चिंता, या संवेदनशीलता हो सकती है। ये हार्मोन के प्राकृतिक उतार-चढ़ाव से जुड़े हैं और वास्तविक अनुभव हैं, "काल्पनिक" नहीं।',
        },
      },
      {
        en: {
          heading: 'PMDD',
          body: 'Premenstrual Dysphoric Disorder (PMDD) is a more severe form of PMS that causes significant emotional distress before a period. If mood changes severely impact your life, relationships, or ability to function, this deserves medical attention. PMDD is a recognized medical condition with treatment options.',
        },
        hi: {
          heading: 'PMDD',
          body: 'प्रीमेंस्ट्रुअल डिस्फोरिक डिसऑर्डर (PMDD) PMS का एक अधिक गंभीर रूप है जो अवधि से पहले महत्वपूर्ण भावनात्मक संकट का कारण बनता है। यदि मूड बदलाव आपके जीवन, रिश्तों, या काम करने की क्षमता पर गंभीर प्रभाव डालते हैं, तो इसके लिए चिकित्सकीय ध्यान आवश्यक है। PMDD एक मान्यता प्राप्त चिकित्सकीय स्थिति है जिसके उपचार विकल्प उपलब्ध हैं।',
        },
      },
      {
        en: {
          heading: 'Stigma and mental health',
          body: 'Menstruation is surrounded by cultural stigma in many societies. This stigma can cause shame, isolation, and reluctance to seek help. You are not alone in experiencing these feelings. Breaking the silence — even with one trusted person — can be powerful.',
        },
        hi: {
          heading: 'कलंक और मानसिक स्वास्थ्य',
          body: 'मासिक धर्म कई समाजों में सांस्कृतिक कलंक से घिरा है। यह कलंक शर्म, एकांत, और सहायता मांगने में संकोच का कारण बन सकता है। आप इन भावनाओं का अनुभव करने में अकेले नहीं हैं। चुप्पी तोड़ना — यहां तक कि एक भरोसेमंद व्यक्ति से — शक्तिशाली हो सकता है।',
        },
      },
      {
        en: {
          heading: 'Self-care during your cycle',
          body: 'Be gentle with yourself. Track your mood alongside your cycle to understand patterns. Prioritize rest, nourishing food, and activities you enjoy. If you are struggling emotionally, reach out — to a friend, a trusted adult, or a mental health professional. Emotional health is just as important as physical health.',
        },
        hi: {
          heading: 'चक्र के दौरान आत्म-देखभाल',
          body: 'अपने प्रति कोमल रहें। पैटर्न समझने के लिए अपने चक्र के साथ मूड ट्रैक करें। आराम, पौष्टिक भोजन, और अपनी पसंद की गतिविधियों को प्राथमिकता दें। यदि भावनात्मक रूप से संघर्ष कर रही हैं, तो किसी मित्र, भरोसेमंद वयस्क, या मानसिक स्वास्थ्य विशेषज्ञ से संपर्क करें। भावनात्मक स्वास्थ्य शारीरिक स्वास्थ्य के बराबर महत्वपूर्ण है।',
        },
      },
    ],
    sources: [
      { name: 'Mayo Clinic — PMS', url: 'https://www.mayoclinic.org/diseases-conditions/premenstrual-syndrome/symptoms-causes/syc-20374080' },
      { name: 'Mayo Clinic — PMDD', url: 'https://www.mayoclinic.org/diseases-conditions/premenstrual-dysphoric-disorder/symptoms-causes/syc-20376380' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['myths-facts', 'talk-about-it', 'what-is-menstruation'],
    simpleExplanation: {
      en: 'Hormone changes during your cycle can affect your mood. Feeling sad, irritable, or anxious before your period is real, not imagined. If mood changes are severe and affect your daily life, talk to a doctor. Be kind to yourself.',
      hi: 'चक्र के दौरान हार्मोन बदलाव आपके मूड को प्रभावित कर सकते हैं। अवधि से पहले उदास, चिड़चिड़ा, या चिंतित महसूस करना सच है, काल्पनिक नहीं। यदि मूड बदलाव गंभीर हैं और आपके दैनिक जीवन को प्रभावित करते हैं, तो डॉक्टर से बात करें। अपने प्रति दयालु रहें।',
    },
  },
  {
    id: 'when-to-seek-care',
    category: 'seekcare',
    title: {
      en: 'When to seek medical care',
      hi: 'चिकित्सकीय सहायता कब लें',
    },
    summary: {
      en: 'Signs that warrant a medical evaluation or urgent care.',
      hi: 'ऐसे संकेत जिनके लिए चिकित्सकीय मूल्यांकन या आपातकालीन सहायता आवश्यक है।',
    },
    sections: [
      {
        en: {
          heading: 'See a healthcare provider if you experience:',
          body: 'Periods consistently shorter than 21 days or longer than 35 days. Missing 3 or more consecutive periods. Periods that suddenly become much heavier or more painful than usual. Bleeding between periods or after sex. Periods that last longer than 7 days. Feeling dizzy, faint, or short of breath during your period (possible sign of anemia from heavy bleeding).',
        },
        hi: {
          heading: 'निम्नलिखित स्थितियों में चिकित्सक को देखें:',
          body: 'अवधि लगातार 21 दिन से छोटी या 35 दिन से लंबी। लगातार 3 या अधिक अवधियां छूटना। अवधि अचानक आम से कहीं अधिक भारी या दर्दनाक हो जाना। अवधि के बीच या संभोग के बाद रक्तस्राव। 7 दिन से अधिक चलने वाली अवधि। अवधि के दौरान चक्कर, बेहोशी, या सांस फूलना (भारी रक्तस्राव से एनीमिया का संभावित संकेत)।',
        },
      },
      {
        en: {
          heading: 'Seek urgent care if you experience:',
          body: 'Sudden, severe abdominal pain that is different from your usual cramps. Very heavy bleeding (soaking through a pad or tampon every hour for 2-3 hours). Fever with period pain. Fainting or severe dizziness. Chest pain or difficulty breathing. These symptoms need prompt medical evaluation.',
        },
        hi: {
          heading: 'निम्नलिखित स्थितियों में आपातकालीन सहायता लें:',
          body: 'अचानक, तेज पेट दर्द जो आपकी आम ऐंठन से अलग हो। बहुत भारी रक्तस्राव (2-3 घंटे तक हर घंटे पैड या टैम्पन सोख जाए)। अवधि दर्द के साथ बुखार। बेहोशी या तेज चक्कर। छाती दर्द या सांस लेने में कठिनाई। इन लक्षणों के लिए तुरंत चिकित्सकीय मूल्यांकन आवश्यक है।',
        },
      },
      {
        en: {
          heading: 'Do not dismiss severe symptoms',
          body: 'Severe, sudden, or worsening symptoms should never be dismissed as "just a bad period." You know your body. If something feels wrong or different, seek care. It is always better to be checked by a professional than to suffer in silence.',
        },
        hi: {
          heading: 'गंभीर लक्षणों को नजरअंदाज न करें',
          body: 'गंभीर, अचानक, या बिगड़ते लक्षणों को कभी "बस खराब अवधि" कहकर नजरअंदाज न करें। आप अपना शरीर जानती हैं। यदि कुछ गलत या अलग महसूस हो, तो सहायता लें। किसी विशेषज्ञ से जांच कराना हमेशा चुपचाप दर्द सहने से बेहतर है।',
        },
      },
      {
        en: {
          heading: 'Preparing for your appointment',
          body: 'Track your symptoms, cycle dates, and pain levels before your visit. Saheli can generate a symptom summary you can share with your provider. Write down your questions. Consider bringing a support person. You deserve to be heard and taken seriously.',
        },
        hi: {
          heading: 'अपनी नियुक्ति की तैयारी',
          body: 'अपने दौरे से पहले अपने लक्षण, चक्र तिथियां, और दर्द स्तर ट्रैक करें। Saheli आपको एक लक्षण सारांश बना सकता है जिसे आप अपने चिकित्सक के साथ साझा कर सकती हैं। अपने सवाल लिखें। एक सहयोगी व्यक्ति को साथ लाने पर विचार करें। आपकी बात सुनी और गंभीरता से ली जानी चाहिए।',
        },
      },
    ],
    sources: [
      { name: 'Mayo Clinic — When to see a doctor', url: 'https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047190' },
      { name: 'ACOG — Menstrual Cycle', url: 'https://www.acog.org/womens-health/faqs/your-menstrual-period' },
      { name: 'NHS — Heavy periods', url: 'https://www.nhs.uk/conditions/heavy-periods/' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['period-pain', 'symptom-guidance', 'irregular-cycles'],
    simpleExplanation: {
      en: 'See a doctor if your periods are very short, very long, very heavy, or very painful, or if you miss 3 in a row. Get urgent care for sudden severe pain, very heavy bleeding, fever, or fainting. Never dismiss severe symptoms as "just a period."',
      hi: 'यदि आपकी अवधि बहुत छोटी, बहुत लंबी, बहुत भारी, या बहुत दर्दनाक हो, या लगातार 3 छूट जाएं, तो डॉक्टर को देखें। अचानक तेज दर्द, बहुत भारी रक्तस्राव, बुखार, या बेहोशी के लिए आपातकालीन सहायता लें। गंभीर लक्षणों को "बस अवधि" कहकर कभी नजरअंदाज न करें।',
    },
  },
  {
    id: 'anemia-basics',
    category: 'conditions',
    title: {
      en: 'Iron deficiency and anemia',
      hi: 'आयरन की कमी और एनीमिया',
    },
    summary: {
      en: 'How heavy periods can lead to anemia and what to watch for.',
      hi: 'भारी अवधि कैसे एनीमिया का कारण बन सकती है और क्या ध्यान रखें।',
    },
    sections: [
      {
        en: {
          heading: 'The connection',
          body: 'Heavy menstrual bleeding can lead to iron deficiency and eventually anemia. Iron is lost through blood, and if the body cannot replace it fast enough, red blood cells decrease. This is one of the most common causes of anemia in people who menstruate.',
        },
        hi: {
          heading: 'संबंध',
          body: 'भारी मासिक रक्तस्राव से आयरन की कमी और अंततः एनीमिया हो सकता है। आयरन रक्त से खो जाता है, और यदि शरीर इसे जल्दी से पूरा नहीं कर पाता, तो लाल रक्त कोशिकाएं कम हो जाती हैं। यह मासिक धर्म वाले लोगों में एनीमिया के सबसे आम कारणों में से एक है।',
        },
      },
      {
        en: {
          heading: 'Signs to watch for',
          body: 'Signs of anemia include persistent fatigue, weakness, pale skin, dizziness, shortness of breath, headaches, and cold hands or feet. If you experience these, especially alongside heavy periods, a simple blood test can check your iron levels.',
        },
        hi: {
          heading: 'ध्यान रखने योग्य संकेत',
          body: 'एनीमिया के लक्षणों में लगातार थकान, कमजोरी, पीली त्वचा, चक्कर, सांस फूलना, सिरदर्द, और हाथ-पैर ठंडे होना शामिल हैं। यदि आप इनका अनुभव करती हैं, खासकर भारी अवधि के साथ, तो एक साधारण रक्त परीक्षण से आपके आयरन स्तर की जांच हो सकती है।',
        },
      },
      {
        en: {
          heading: 'What to do',
          body: 'If you suspect anemia, see a healthcare provider for a blood test. Treatment may include iron supplements and dietary changes. Iron-rich foods include leafy greens, lentils, beans, fortified cereals, and meat. Do not start high-dose iron supplements without medical advice, as excess iron can be harmful.',
        },
        hi: {
          heading: 'क्या करें',
          body: 'यदि आपको एनीमिया का संदेह है, तो रक्त परीक्षण के लिए चिकित्सक को देखें। उपचार में आयरन की खुराक और आहार बदलाव शामिल हो सकते हैं। आयरन से भरपूर खाद्य पदार्थों में हरी पत्तेदार सब्जियां, दाल, बीन्स, फोर्टिफाइड अनाज, और मांस शामिल हैं। चिकित्सकीय सलाह के बिना अधिक मात्रा में आयरन की खुराक न लें, क्योंकि अतिरिक्त आयरन हानिकारक हो सकता है।',
        },
      },
      {
        en: {
          heading: 'Addressing the root cause',
          body: 'While treating anemia is important, it is equally important to address heavy periods if they are the cause. Very heavy periods (soaking through a pad every 1-2 hours, passing large clots) should be evaluated by a healthcare provider to identify the underlying cause.',
        },
        hi: {
          heading: 'मूल कारण का समाधान',
          body: 'एनीमिया का इलाज जरूरी है, लेकिन यदि भारी अवधि इसका कारण है तो उसका भी समाधान उतना ही महत्वपूर्ण है। बहुत भारी अवधि (हर 1-2 घंटे में पैड सोख जाना, बड़े थक्के आना) के लिए अंतर्निहित कारण पहचानने हेतु चिकित्सकीय मूल्यांकन होना चाहिए।',
        },
      },
    ],
    sources: [
      { name: 'Mayo Clinic — Iron deficiency anemia', url: 'https://www.mayoclinic.org/diseases-conditions/iron-deficiency-anemia/symptoms-causes/syc-20471645' },
      { name: 'WHO — Anaemia', url: 'https://www.who.int/health-topics/anaemia' },
    ],
    reviewedDate: '2024-09-15',
    relatedIds: ['when-to-seek-care', 'period-pain', 'irregular-cycles'],
    simpleExplanation: {
      en: 'Heavy periods can cause low iron (anemia), which makes you tired, dizzy, and pale. If you feel very tired with heavy periods, ask a doctor for a blood test. Iron-rich foods like leafy greens and lentils can help, but do not take iron pills without medical advice.',
      hi: 'भारी अवधि से आयरन की कमी (एनीमिया) हो सकती है, जिससे थकान, चक्कर, और पीलापन होता है। यदि भारी अवधि के साथ बहुत थकान महसूस हो, तो डॉक्टर से रक्त परीक्षण कराएं। हरी सब्जियां और दाल जैसे आयरन-युक्त खाद्य मदद कर सकते हैं, लेकिन चिकित्सकीय सलाह के बिना आयरन की गोलियां न लें।',
    },
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
    a.title.en.toLowerCase().includes(q) ||
    a.title.hi.includes(q) ||
    a.summary.en.toLowerCase().includes(q) ||
    a.summary.hi.includes(q) ||
    a.sections.some(s =>
      s.en.body.toLowerCase().includes(q) || s.en.heading.toLowerCase().includes(q) ||
      s.hi.body.includes(q) || s.hi.heading.includes(q)
    )
  );
}
