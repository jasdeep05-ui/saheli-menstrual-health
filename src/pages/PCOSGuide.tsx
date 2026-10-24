import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/app-context';
import {
  ChevronLeft, ChevronDown, Heart, Brain, Activity, Stethoscope, Pill,
  Baby, ShieldAlert, Sparkles, CalendarClock, ExternalLink, CheckCircle2,
  Circle, MessageCircle, Flower2, BookOpen, Lightbulb,
} from 'lucide-react';


interface BilingualText { en: string; hi: string }

interface GuideSection {
  id: string;
  label: BilingualText;
  icon: typeof Heart;
  title: BilingualText;
  paragraphs: { heading?: BilingualText; body: BilingualText }[];
  callout?: { type: 'reassure' | 'important'; text: BilingualText };
}

const SECTIONS: GuideSection[] = [
  {
    id: 'what-is-pcos',
    label: { en: 'What is PCOS?', hi: 'PCOS क्या है?' },
    icon: Flower2,
    title: {
      en: 'Start here: What is PCOS/PCOD?',
      hi: 'यहां से शुरू करें: PCOS/PCOD क्या है?',
    },
    paragraphs: [
      {
        body: {
          en: 'PCOS stands for Polycystic Ovary Syndrome. It is a common hormonal condition that can affect menstrual cycles, ovulation, skin, hair growth, and metabolic health. In India, you will often hear the term PCOD (Polycystic Ovarian Disease). Many people use PCOD and PCOS interchangeably, and while PCOS is the internationally recognised medical term, both generally refer to the same condition.',
          hi: 'PCOS का पूरा नाम Polycystic Ovary Syndrome (पॉलीसिस्टिक ओवरी सिंड्रोम) है। यह एक आम हार्मोनल स्थिति है जो मासिक चक्र, ओव्यूलेशन, त्वचा, बाल वृद्धि, और चयापचय स्वास्थ्य को प्रभावित कर सकती है। भारत में, आप अक्सर PCOD (Polycystic Ovarian Disease) शब्द सुनेंगे। कई लोग PCOD और PCOS को एक ही अर्थ में उपयोग करते हैं, और जबकि PCOS अंतरराष्ट्रीय स्तर पर मान्यता प्राप्त चिकित्सकीय शब्द है, दोनों आमतौर पर एक ही स्थिति के लिए उपयोग होते हैं।',
        },
      },
      {
        body: {
          en: 'PCOS affects people differently — not everyone experiences the same symptoms, and the severity can range from mild to more noticeable. Some people may have only irregular periods, while others may notice changes in their skin, hair, or weight. There is no single "typical" experience.',
          hi: 'PCOS हर व्यक्ति पर अलग तरह से असर डालता है — हर कोई एक ही लक्षण अनुभव नहीं करता, और गंभीरता हल्के से अधिक ध्यान देने लायक तक हो सकती है। कुछ लोगों को केवल अनियमित अवधि हो सकती है, जबकि अन्य अपनी त्वचा, बाल, या वजन में बदलाव देख सकते हैं। कोई एक "सामान्य" अनुभव नहीं है।',
        },
      },
      {
        heading: { en: 'What about the name?', hi: 'नाम के बारे में क्या?' },
        body: {
          en: 'The word "polycystic" can be misleading. It does not mean that everyone with PCOS has ovarian cysts. "Polycystic" refers to many small follicles (tiny fluid-filled sacs) that can sometimes be seen on the ovaries during an ultrasound. These follicles are a normal part of the ovary, and their presence alone does not confirm PCOS.',
          hi: '"पॉलीसिस्टिक" शब्द भ्रामक हो सकता है। इसका मतलब यह नहीं कि PCOS वाले हर व्यक्ति को ओवरी सिस्ट हैं। "पॉलीसिस्टिक" का मतलब कई छोटे फॉलिकल्स (छोटे तरल से भरे थैले) हैं जो अल्ट्रासाउंड में अंडाशय पर देखे जा सकते हैं। ये फॉलिकल्स अंडाशय का एक सामान्य हिस्सा हैं, और केवल इनकी उपस्थिति PCOS की पुष्टि नहीं करती।',
        },
      },
      {
        heading: { en: 'A simple analogy', hi: 'एक सरल उदाहरण' },
        body: {
          en: 'Think of your menstrual cycle like a monthly schedule. Hormones act as messengers, telling the ovaries when to prepare and release an egg. In PCOS, these messengers can get out of sync — the signals for ovulation may be delayed or disrupted, which can affect the timing of your period. It is like a clock that sometimes runs a little late, not a broken clock.',
          hi: 'अपने मासिक चक्र को एक मासिक कार्यक्रम की तरह सोचें। हार्मोन संदेशवाहक की तरह काम करते हैं, अंडाशय को बताते हैं कि अंडे की तैयारी कब करें और छोड़ें। PCOS में, ये संदेशवाहक संतुलन से बाहर हो सकते हैं — ओव्यूलेशन के संकेत देरी से या बाधित हो सकते हैं, जिससे आपकी अवधि का समय प्रभावित हो सकता है। यह ऐसी घड़ी की तरह है जो कभी-कभी थोड़ी देरी से चलती है, टूटी हुई घड़ी नहीं।',
        },
      },
      {
        body: {
          en: 'Most importantly: PCOS is not caused by a personal failure, poor character, or lack of discipline. It is a medical condition influenced by complex biological factors — not something anyone chooses or causes.',
          hi: 'सबसे महत्वपूर्ण बात: PCOS किसी व्यक्तिगत विफलता, खराब चरित्र, या अनुशासन की कमी के कारण नहीं होता। यह एक चिकित्सकीय स्थिति है जो जटिल जैविक कारकों से प्रभावित होती है — यह कुछ है जिसे कोई चुनता या कारण बनता नहीं है।',
        },
      },
    ],
    callout: { type: 'reassure', text: { en: 'PCOS is common, it is not your fault, and it is something you can learn to manage with the right information and support.', hi: 'PCOS आम है, यह आपकी गलती नहीं है, और सही जानकारी और समर्थन के साथ आप इसे प्रबंधित करना सीख सकती हैं।' } },
  },
  {
    id: 'hormones-cycle',
    label: { en: 'Hormones & cycle', hi: 'हार्मोन और चक्र' },
    icon: Brain,
    title: { en: 'Understanding hormones and the menstrual cycle', hi: 'हार्मोन और मासिक चक्र को समझना' },
    paragraphs: [
      {
        heading: { en: 'What hormones do', hi: 'हार्मोन क्या करते हैं' },
        body: {
          en: 'Hormones are chemical messengers that travel through your bloodstream and tell different parts of your body what to do. In the menstrual cycle, hormones like estrogen, progesterone, follicle-stimulating hormone (FSH), and luteinizing hormone (LH) work together to prepare the body for a possible pregnancy each month.',
          hi: 'हार्मोन रासायनिक संदेशवाहक हैं जो आपके रक्तप्रवाह में यात्रा करते हैं और आपके शरीर के विभिन्न हिस्सों को बताते हैं कि क्या करना है। मासिक चक्र में, एस्ट्रोजन, प्रोजेस्टेरोन, फॉलिकल-स्टिम्यूलेटिंग हार्मोन (FSH), और ल्यूटिनाइजिंग हार्मोन (LH) मिलकर हर महीने शरीर को संभावित गर्भावस्था के लिए तैयार करते हैं।',
        },
      },
      {
        heading: { en: 'What is ovulation?', hi: 'ओव्यूलेशन क्या है?' },
        body: {
          en: 'Ovulation is when an ovary releases a mature egg, usually around the middle of your cycle. The egg then travels through the fallopian tube, where it could be fertilised. If no pregnancy occurs, hormone levels drop, and the lining of the uterus is shed as your period.',
          hi: 'ओव्यूलेशन तब होता है जब एक अंडाशय परिपक्व अंडा छोड़ता है, आमतौर पर आपके चक्र के बीच में। फिर अंडा फैलोपियन ट्यूब से गुजरता है, जहां इसका निषेचन हो सकता है। यदि गर्भावस्था नहीं होती, तो हार्मोन स्तर गिर जाते हैं, और गर्भाशय की परत आपकी अवधि के रूप में बाहर आती है।',
        },
      },
      {
        heading: { en: 'How hormonal changes affect you', hi: 'हार्मोनल बदलाव आपको कैसे प्रभावित करते हैं' },
        body: {
          en: 'When hormones are in balance, the cycle follows a relatively predictable rhythm. When certain hormones are higher or lower than typical, you might notice changes in period timing, acne or oilier skin, increased facial or body hair, hair thinning on the scalp, or changes in mood and energy.',
          hi: 'जब हार्मोन संतुलित होते हैं, तो चक्र अपेक्षाकृत पूर्वानुमेय रिदम पर चलता है। जब कुछ हार्मोन सामान्य से अधिक या कम होते हैं, तो आप अवधि समय, मुहांसे या तैली त्वचा, चेहरे या शरीर पर बाल वृद्धि, सिर पर बाल पतले होने, या मूड और ऊर्जा में बदलाव देख सकती हैं।',
        },
      },
      {
        heading: { en: 'Irregular cycles are not always PCOS', hi: 'अनियमित चक्र का मतलब हमेशा PCOS नहीं' },
        body: {
          en: 'Cycles can be irregular for many reasons unrelated to PCOS — stress, significant weight changes, intense exercise, thyroid conditions, certain medications, or the natural variability of the first few years after periods begin. A single delayed period or one episode of acne cannot establish a diagnosis of PCOS or any other condition.',
          hi: 'चक्र PCOS से असंबंधित कई कारणों से अनियमित हो सकते हैं — तनाव, वजन में बड़े बदलाव, तीव्र व्यायाम, थायराइड स्थितियां, कुछ दवाएं, या अवधि शुरू होने के बाद पहले कुछ वर्षों की प्राकृतिक विविधता। एक देरी से आई अवधि या एक बार मुहांसे आना PCOS या किसी अन्य स्थिति का निदान नहीं स्थापित कर सकता।',
        },
      },
      {
        heading: { en: 'Common variation vs. persistent changes', hi: 'सामान्य विविधता बनाम लगातार बदलाव' },
        body: {
          en: 'It is normal for cycles to vary by a few days from month to month. What may be worth discussing with a healthcare professional is a persistent pattern — cycles that are consistently shorter than 21 days or longer than 35 days, going months without a period, or sudden changes from your usual pattern that last for several cycles.',
          hi: 'महीने-दर-महीने कुछ दिनों का चक्र में बदलाव सामान्य है। एक चिकित्सक से चर्चा करने योग्य बात एक लगातार पैटर्न हो सकता है — चक्र जो लगातार 21 दिन से छोटे या 35 दिन से लंबे हों, महीनों तक अवधि न आना, या आपके सामान्य पैटर्न से अचानक बदलाव जो कई चक्रों तक रहें।',
        },
      },
    ],
  },
  {
    id: 'signs-symptoms',
    label: { en: 'Signs & symptoms', hi: 'संकेत और लक्षण' },
    icon: Activity,
    title: { en: 'Signs and symptoms: What might someone notice?', hi: 'संकेत और लक्षण: कोई क्या नोटिस कर सकता है?' },
    paragraphs: [
      {
        body: {
          en: 'PCOS can involve a range of possible symptoms. Each one is listed below individually, along with an important reminder: every symptom listed here has multiple possible causes and does not automatically indicate PCOS.',
          hi: 'PCOS में कई संभावित लक्षण हो सकते हैं। नीचे प्रत्येक व्यक्तिगत रूप से सूचीबद्ध है, साथ में एक महत्वपूर्ण अनुस्मारक: यहां सूचीबद्ध प्रत्येक लक्षण के कई संभावित कारण हैं और यह स्वतः ही PCOS का संकेत नहीं है।',
        },
      },
      {
        heading: { en: 'Irregular, infrequent, or absent periods', hi: 'अनियमित, दुर्लभ, या अनुपस्थित अवधि' },
        body: {
          en: 'Periods that are consistently far apart (more than 35 days), very unpredictable, or sometimes stop entirely for months. This is one of the most common reasons people seek evaluation. However, irregular periods alone can also be caused by stress, thyroid issues, weight changes, or natural cycle variation.',
          hi: 'अवधि जो लगातार बहुत दूर हों (35 दिन से अधिक), बहुत अनिश्चित हों, या कभी-कभी महीनों के लिए पूरी तरह बंद हो जाएं। यह मूल्यांकन लेने का सबसे आम कारण है। हालांकि, केवल अनियमित अवधि तनाव, थायराइड समस्याएं, वजन बदलाव, या स्वाभाविक चक्र विविधता के कारण भी हो सकती है।',
        },
      },
      {
        heading: { en: 'Acne or oilier skin', hi: 'मुहांसे या अधिक तैली त्वचा' },
        body: {
          en: 'Persistent acne, especially along the jawline, or skin that has become oilier than usual. Acne has many causes including hormonal fluctuations, diet, stress, and skincare habits — it does not automatically mean PCOS.',
          hi: 'लगातार मुहांसे, खासकर जबड़ी की रेखा पर, या त्वचा जो आम से अधिक तैली हो गई है। मुहांसे के कई कारण हैं जिनमें हार्मोनल उतार-चढ़ाव, आहार, तनाव, और स्किनकेयर आदतें शामिल हैं — इसका मतलब स्वतः ही PCOS नहीं है।',
        },
      },
      {
        heading: { en: 'Increased facial or body hair', hi: 'चेहरे या शरीर पर बाल वृद्धि' },
        body: {
          en: 'Hair growth on the chin, upper lip, chest, or abdomen that is thicker or darker than before. This is called hirsutism and can be linked to higher androgen levels, but it also runs in families and varies by ethnicity.',
          hi: 'ठोड़ी, ऊपरी होंठ, छाती, या पेट पर बाल वृद्धि जो पहले से मोटे या गहरे हों। इसे हिर्सुटिज्म कहते हैं और यह उच्च एंड्रोजन स्तर से जुड़ा हो सकता है, लेकिन यह परिवार में भी चलता है और जाति अनुसार भिन्न होता है।',
        },
      },
      {
        heading: { en: 'Hair thinning on the scalp', hi: 'सिर पर बाल पतले होना' },
        body: {
          en: 'Hair that becomes thinner, especially around the crown or temples. Scalp hair thinning can also result from nutritional deficiencies, stress, thyroid conditions, or genetics.',
          hi: 'बाल जो पतले हो जाते हैं, खासकर ताज या कनपट्टी के आसपास। सिर पर बाल पतले होना पोषण की कमी, तनाव, थायराइड स्थितियां, या आनुवंशिकता के कारण भी हो सकता है।',
        },
      },
      {
        heading: { en: 'Changes in weight', hi: 'वजन में बदलाव' },
        body: {
          en: 'Some people with PCOS find it harder to manage weight, but many people with PCOS do not have weight concerns, and many people without PCOS do. Weight changes have countless causes and do not define whether someone has PCOS.',
          hi: 'PCOS वाले कुछ लोगों को वजन प्रबंधित करना कठिन लगता है, लेकिन कई PCOS वाले लोगों को वजन की चिंता नहीं होती, और कई बिना PCOS वाले लोगों को होती है। वजन बदलाव के अनगिनत कारण हैं और यह तय नहीं करता कि किसी को PCOS है या नहीं।',
        },
      },
      {
        heading: { en: 'Darkened, thicker skin patches', hi: 'त्वचा पर काले, मोटे धब्बे' },
        body: {
          en: 'Dark, velvety patches of skin, often in skin folds like the neck, underarms, or groin. This is called acanthosis nigricans and can be associated with insulin resistance. It can also occur in people without PCOS.',
          hi: 'त्वचा पर काले, मखमली धब्बे, अक्सर गर्दन, बगल, या जांघ की तहों पर। इसे एकैंथोसिस नाइग्रिकन्स कहते हैं और यह इंसुलिन प्रतिरोध से जुड़ा हो सकता है। यह बिना PCOS वाले लोगों में भी हो सकता है।',
        },
      },
      {
        heading: { en: 'Difficulties with ovulation or becoming pregnant', hi: 'ओव्यूलेशन या गर्भधारण में कठिनाई' },
        body: {
          en: 'PCOS can make ovulation less predictable, which may make conception more difficult for some people. However, many people with PCOS conceive naturally, and effective fertility support is widely available.',
          hi: 'PCOS ओव्यूलेशन को कम पूर्वानुमेय बना सकता है, जिससे कुछ लोगों के लिए गर्भधारण अधिक कठिन हो सकता है। हालांकि, कई PCOS वाले लोग स्वाभाविक रूप से गर्भधारण करते हैं, और प्रभावी प्रजनन समर्थन व्यापक रूप से उपलब्ध है।',
        },
      },
      {
        heading: { en: 'Emotional distress, anxiety, or body-image concerns', hi: 'भावनात्मक संकट, चिंता, या शरीर-छवि संबंधी चिंताएं' },
        body: {
          en: 'Living with visible symptoms like acne, hair changes, or weight fluctuations can affect confidence and emotional well-being. These feelings are valid and deserve care and support, regardless of whether they are linked to PCOS.',
          hi: 'मुहांसे, बाल बदलाव, या वजन उतार-चढ़ाव जैसे दिखने वाले लक्षणों के साथ जीना आत्मविश्वास और भावनात्मक कल्याण को प्रभावित कर सकता है। ये भावनाएं वैध हैं और देखभाल और समर्थन की हकदार हैं, चाहे वे PCOS से जुड़ी हों या नहीं।',
        },
      },
    ],
    callout: { type: 'reassure', text: { en: 'Not everyone with PCOS will experience every symptom. Some people have only a few. Each symptom listed above has many possible causes — noticing one or more does not mean you have PCOS.', hi: 'हर PCOS वाले व्यक्ति को हर लक्षण नहीं होता। कुछ लोगों को केवल कुछ होते हैं। ऊपर सूचीबद्ध प्रत्येक लक्षण के कई संभावित कारण हैं — एक या अधिक नोटिस करने का मतलब यह नहीं कि आपको PCOS है।' } },
  },
  {
    id: 'causes',
    label: { en: 'What causes it?', hi: 'इसका कारण क्या है?' },
    icon: Brain,
    title: { en: 'What causes PCOS?', hi: 'PCOS का कारण क्या है?' },
    paragraphs: [
      {
        heading: { en: 'The honest answer', hi: 'ईमानदार जवाब' },
        body: {
          en: 'The exact cause of PCOS is not fully understood. Research suggests that it results from a combination of factors, including genetics, hormonal regulation, and how the body responds to insulin. No single factor has been identified as the sole cause.',
          hi: 'PCOS का सटीक कारण पूरी तरह समझा नहीं गया है। शोध बताता है कि यह कई कारकों के संयोजन का परिणाम है, जिनमें आनुवंशिकी, हार्मोनल नियमन, और शरीर इंसुलिन पर कैसे प्रतिक्रिया करता है शामिल हैं। किसी एक कारक को एकमात्र कारण नहीं पहचाना गया है।',
        },
      },
      {
        heading: { en: 'Genetics', hi: 'आनुवंशिकता' },
        body: {
          en: 'PCOS tends to run in families. If a close family member has PCOS or related symptoms, the likelihood of having it may be higher. However, many people with no family history also develop PCOS, and having a family history does not guarantee you will have it.',
          hi: 'PCOS परिवारों में चलता है। यदि किसी नजदीकी परिवारिक सदस्य को PCOS या संबंधित लक्षण हैं, तो इसके होने की संभावना अधिक हो सकती है। हालांकि, बिना पारिवारिक इतिहास वाले कई लोगों को भी PCOS होता है, और पारिवारिक इतिहास होने का मतलब यह नहीं कि आपको जरूर होगा।',
        },
      },
      {
        heading: { en: 'Insulin resistance, explained simply', hi: 'इंसुलिन प्रतिरोध, सरल शब्दों में' },
        body: {
          en: 'Insulin is a hormone that helps your body use sugar (glucose) from food for energy. In some people with PCOS, the body does not respond to insulin as effectively — this is called insulin resistance. When cells do not respond well, the body may produce more insulin to compensate. Higher insulin levels can in turn affect the ovaries and increase androgen production, which may influence symptoms like irregular periods or acne.',
          hi: 'इंसुलिन एक हार्मोन है जो आपके शरीर को भोजन से मिले चीनी (ग्लूकोज) को ऊर्जा के लिए उपयोग करने में मदद करता है। PCOS वाले कुछ लोगों में, शरीर इंसुलिन पर उतना प्रभावी ढंग से प्रतिक्रिया नहीं करता — इसे इंसुलिन प्रतिरोध कहते हैं। जब कोशिकाएं अच्छी तरह प्रतिक्रिया नहीं करतीं, तो शरीर भरपाई के लिए अधिक इंसुलिन बना सकता है। उच्च इंसुलिन स्तर बदले में अंडाशय को प्रभावित कर सकते हैं और एंड्रोजन उत्पादन बढ़ा सकते हैं, जो अनियमित अवधि या मुहांसे जैसे लक्षणों को प्रभावित कर सकता है।',
        },
      },
      {
        heading: { en: 'What does NOT cause PCOS', hi: 'PCOS का कारण क्या नहीं है' },
        body: {
          en: 'PCOS is not caused by eating sugar, eating particular foods, having a certain body size, or making poor lifestyle choices. While nutrition and movement can play a role in managing symptoms for some people, they do not cause the condition. Blaming sugar, specific foods, or body size is inaccurate and can create unnecessary shame.',
          hi: 'PCOS चीनी खाने, विशेष खाद्य पदार्थ खाने, एक निश्चित शरीर के आकार, या खराब जीवनशैली चुनाव के कारण नहीं होता। जबकि पोषण और शारीरिक गतिविधि कुछ लोगों में लक्षण प्रबंधित करने में भूमिका निभा सकते हैं, वे स्थिति का कारण नहीं बनते। चीनी, विशेष खाद्य पदार्थों, या शरीर के आकार को दोष देना गलत है और अनावश्यक शर्म पैदा कर सकता है।',
        },
      },
      {
        body: {
          en: 'PCOS is a complex medical condition, not a lifestyle consequence. Understanding this can help reduce the self-blame that many people feel.',
          hi: 'PCOS एक जटिल चिकित्सकीय स्थिति है, जीवनशैली का परिणाम नहीं। यह समझना कई लोगों द्वारा महसूस की जाने वाली आत्म-दोष को कम करने में मदद कर सकता है।',
        },
      },
    ],
  },
  {
    id: 'diagnosis',
    label: { en: 'Diagnosis', hi: 'निदान' },
    icon: Stethoscope,
    title: { en: 'PCOS diagnosis: What actually happens?', hi: 'PCOS निदान: वास्तव में क्या होता है?' },
    paragraphs: [
      {
        body: {
          en: 'Symptoms alone cannot confirm PCOS. A qualified healthcare professional evaluates your medical history, symptoms, a physical examination where appropriate, and relevant investigations before making any assessment.',
          hi: 'केवल लक्षण PCOS की पुष्टि नहीं कर सकते। एक योग्य चिकित्सक कोई आकलन करने से पहले आपका चिकित्सा इतिहास, लक्षण, जहां उपयुक्त हो शारीरिक परीक्षण, और संबंधित जांचें मूल्यांकन करता है।',
        },
      },
      {
        heading: { en: 'What a clinical evaluation may include', hi: 'चिकित्सकीय मूल्यांकन में क्या शामिल हो सकता है' },
        body: {
          en: 'Your clinician will typically take a detailed menstrual and symptom history — when your periods started, how often they come, how long they last, and any changes you have noticed. They may ask about skin, hair, weight, mood, and family history. A physical examination may be offered where clinically appropriate.',
          hi: 'आपका चिकित्सक आमतौर पर विस्तृत मासिक और लक्षण इतिहास लेगा — आपकी अवधि कब शुरू हुई, कितनी बार आती हैं, कितनी देर तक रहती हैं, और आपने कौन से बदलाव नोटिस किए हैं। वे त्वचा, बाल, वजन, मूड, और पारिवारिक इतिहास के बारे में पूछ सकते हैं। जहां चिकित्सकीय रूप से उपयुक्त हो वहां शारीरिक परीक्षण की पेशकश की जा सकती है।',
        },
      },
      {
        heading: { en: 'Blood tests', hi: 'रक्त परीक्षण' },
        body: {
          en: 'Blood tests may be used to assess hormone levels (such as androgens, thyroid function, prolactin, and others) and to check for other conditions that can cause similar symptoms. These tests help the clinician build a complete picture rather than relying on any single number.',
          hi: 'रक्त परीक्षण हार्मोन स्तर (जैसे एंड्रोजन, थायराइड कार्य, प्रोलैक्टिन, और अन्य) का आकलन करने और समान लक्षण उत्पन्न करने वाली अन्य स्थितियों की जांच के लिए उपयोग किए जा सकते हैं। ये परीक्षण चिकित्सक को किसी एक संख्या पर निर्भर रहे बिना पूरी तस्वीर बनाने में मदद करते हैं।',
        },
      },
      {
        heading: { en: 'Metabolic assessment', hi: 'चयापचय मूल्यांकन' },
        body: {
          en: 'When clinically appropriate, your clinician may recommend blood sugar tests (such as a fasting glucose or HbA1c) or a lipid profile to assess metabolic health. This is because insulin resistance and related metabolic factors can be associated with PCOS for some people.',
          hi: 'जब चिकित्सकीय रूप से उपयुक्त हो, तो आपका चिकित्सक चयापचय स्वास्थ्य का आकलन करने के लिए रक्त शर्करा परीक्षण (जैसे फास्टिंग ग्लूकोज या HbA1c) या लिपिड प्रोफाइल की सिफारिश कर सकता है। यह इसलिए क्योंकि इंसुलिन प्रतिरोध और संबंधित चयापचय कारक कुछ लोगों में PCOS से जुड़े हो सकते हैं।',
        },
      },
      {
        heading: { en: 'When an ultrasound may be useful', hi: 'अल्ट्रासाउंड कब उपयोगी हो सकता है' },
        body: {
          en: 'An ultrasound may be used as part of the evaluation, but it is not always necessary. Importantly, an ultrasound alone does not establish PCOS. The presence of many small follicles on the ovaries can be a normal finding and is seen in people without PCOS as well. A clinician combines ultrasound findings with your history, symptoms, and blood test results — not any one of these in isolation.',
          hi: 'अल्ट्रासाउंड मूल्यांकन के हिस्से के रूप में उपयोग किया जा सकता है, लेकिन यह हमेशा आवश्यक नहीं है। महत्वपूर्ण रूप से, केवल अल्ट्रासाउंड PCOS स्थापित नहीं करता। अंडाशय पर कई छोटे फॉलिकल्स की उपस्थिति एक सामान्य निष्कर्ष हो सकती है और बिना PCOS वाले लोगों में भी देखी जाती है। एक चिकित्सक अल्ट्रासाउंड निष्कर्षों को आपके इतिहास, लक्षणों, और रक्त परीक्षण परिणामों के साथ मिलाता है — इनमें से किसी एक को अलग नहीं।',
        },
      },
      {
        heading: { en: 'Why cysts are not required', hi: 'सिस्ट क्यों आवश्यक नहीं हैं' },
        body: {
          en: 'You can have PCOS without having polycystic ovaries on an ultrasound, and you can have polycystic ovaries without having PCOS. The diagnosis is based on the overall clinical picture, not on a single test result.',
          hi: 'आपको अल्ट्रासाउंड पर पॉलीसिस्टिक ओवरी के बिना PCOS हो सकता है, और PCOS के बिना पॉलीसिस्टिक ओवरी हो सकती हैं। निदान समग्र चिकित्सकीय तस्वीर पर आधारित है, किसी एक परीक्षण परिणाम पर नहीं।',
        },
      },
      {
        heading: { en: 'Ruling out other conditions', hi: 'अन्य स्थितियों को खारिज करना' },
        body: {
          en: 'Several other conditions — thyroid disorders, elevated prolactin, non-classical congenital adrenal hyperplasia, and others — can cause symptoms similar to PCOS. Part of the diagnostic process involves checking for these, so that you receive the correct assessment and care.',
          hi: 'कई अन्य स्थितियां — थायराइड विकार, उच्च प्रोलैक्टिन, नॉन-क्लासिकल कांजेनिटल एड्रेनल हाइपरप्लासिया, और अन्य — PCOS के समान लक्षण उत्पन्न कर सकती हैं। निदान प्रक्रिया का हिस्सा इनकी जांच करना शामिल है, ताकि आपको सही मूल्यांकन और देखभाल मिले।',
        },
      },
      {
        heading: { en: 'Adolescents need particular care', hi: 'किशोरों को विशेष देखभाल चाहिए' },
        body: {
          en: 'Normal puberty can overlap with some PCOS symptoms. Irregular periods, acne, and changes in hair growth are common during adolescence and do not necessarily indicate PCOS. Adult diagnostic criteria should not be applied to teenagers without appropriate clinical assessment by a qualified professional experienced in adolescent health.',
          hi: 'सामान्य यौवन कुछ PCOS लक्षणों के साथ ओवरलैप हो सकता है। अनियमित अवधि, मुहांसे, और बाल वृद्धि में बदलाव किशोरावस्था में आम हैं और जरूरी नहीं कि PCOS का संकेत हों। वयस्क निदान मानदंड किशोरों पर किशोर स्वास्थ्य में अनुभवी योग्य विशेषज्ञ द्वारा उपयुक्त चिकित्सकीय आकलन के बिना लागू नहीं होने चाहिए।',
        },
      },
    ],
    callout: { type: 'reassure', text: { en: 'Having some of these symptoms does not mean you have PCOS. You deserve clear answers, and a healthcare professional can help you understand what is happening.', hi: 'इनमें से कुछ लक्षण होने का मतलब यह नहीं कि आपको PCOS है। आप स्पष्ट जवाब की हकदार हैं, और एक योग्य चिकित्सक आपको समझने में मदद कर सकता है कि क्या हो रहा है।' } },
  },
  {
    id: 'treatment',
    label: { en: 'Treatment & management', hi: 'उपचार और प्रबंधन' },
    icon: Pill,
    title: { en: 'Treatment and management: What help is available?', hi: 'उपचार और प्रबंधन: कौन सी सहायता उपलब्ध है?' },
    paragraphs: [
      {
        body: {
          en: 'There is no single treatment that suits everyone with PCOS. The good news is that symptoms can often be managed effectively, and associated health risks can be monitored. Treatment is tailored to each person based on their specific symptoms, medical history, preferences, and goals.',
          hi: 'PCOS वाले हर व्यक्ति के लिए एक ही उपचार उपयुक्त नहीं है। अच्छी बात यह है कि लक्षणों को अक्सर प्रभावी ढंग से प्रबंधित किया जा सकता है, और संबंधित स्वास्थ्य जोखिमों पर निगरानी रखी जा सकती है। उपचार प्रत्येक व्यक्ति के विशिष्ट लक्षणों, चिकित्सा इतिहास, पसंदों, और लक्ष्यों के आधार पर तैयार किया जाता है।',
        },
      },
      {
        heading: { en: 'Sustainable, balanced nutrition', hi: 'टिकाऊ, संतुलित पोषण' },
        body: {
          en: 'A balanced approach to eating — one that includes a variety of foods and supports overall well-being — can help some people manage symptoms. This is not about restrictive diets or shame-based eating rules. Working with a registered dietitian who understands PCOS can be helpful if you choose to explore nutritional support.',
          hi: 'खाने का एक संतुलित दृष्टिकोण — जिसमें विभिन्न प्रकार के खाद्य पदार्थ शामिल हों और समग्र कल्याण का समर्थन करे — कुछ लोगों को लक्षण प्रबंधित करने में मदद कर सकता है। यह प्रतिबंधात्मक आहार या शर्म-आधारित खाने के नियमों के बारे में नहीं है। PCOS को समझने वाले एक पंजीकृत आहार विशेषज्ञ के साथ काम करना मददगार हो सकता है यदि आप पोषण संबंधी समर्थन तलाशना चाहें।',
        },
      },
      {
        heading: { en: 'Physical activity', hi: 'शारीरिक गतिविधि' },
        body: {
          en: 'Regular movement that you enjoy and can sustain — whether that is walking, yoga, swimming, dancing, or anything else — can support metabolic and emotional well-being. The goal is finding activities that fit your body, abilities, and preferences, not punishing exercise routines.',
          hi: 'नियमित शारीरिक गतिविधि जो आपको आनंद दे और जिसे आप बनाए रख सकें — चाहे वह टहलना, योग, तैराकी, नृत्य, या कुछ और हो — चयापचय और भावनात्मक कल्याण का समर्थन कर सकती है। लक्ष्य ऐसी गतिविधियां खोजना है जो आपके शरीर, क्षमताओं, और पसंदों के अनुरूप हों, दंडात्मक व्यायाम दिनचर्या नहीं।',
        },
      },
      {
        heading: { en: 'Sleep, stress, and emotional well-being', hi: 'नींद, तनाव, और भावनात्मक कल्याण' },
        body: {
          en: 'Sleep quality and stress levels can influence hormones and overall health. Prioritising rest, finding stress-management strategies that work for you, and addressing emotional well-being are important parts of caring for yourself — not optional extras.',
          hi: 'नींद की गुणवत्ता और तनाव स्तर हार्मोन और समग्र स्वास्थ्य को प्रभावित कर सकते हैं। आराम को प्राथमिकता देना, ऐसी तनाव-प्रबंधन रणनीतियां खोजना जो आपके लिए काम करें, और भावनात्मक कल्याण पर ध्यान देना अपनी देखभाल के महत्वपूर्ण हिस्से हैं — वैकल्पिक अतिरिक्त नहीं।',
        },
      },
      {
        heading: { en: 'Clinician-guided treatment for irregular periods', hi: 'अनियमित अवधि के लिए चिकित्सक-निर्देशित उपचार' },
        body: {
          en: 'If irregular or infrequent periods are a concern, a clinician may discuss options to help regulate your cycle. The right approach depends on your individual situation, whether or not you are trying to conceive, and other health factors. This is a conversation to have with your healthcare provider.',
          hi: 'यदि अनियमित या दुर्लभ अवधि चिंता है, तो एक चिकित्सक आपके चक्र को विनियमित करने में मदद के लिए विकल्पों पर चर्चा कर सकता है। सही दृष्टिकोण आपकी व्यक्तिगत स्थिति, आप गर्भधारण का प्रयास कर रही हैं या नहीं, और अन्य स्वास्थ्य कारकों पर निर्भर करता है। यह आपके चिकित्सक के साथ चर्चा का विषय है।',
        },
      },
      {
        heading: { en: 'Treatments for acne or unwanted hair', hi: 'मुहांसे या अवांछित बालों के लिए उपचार' },
        body: {
          en: 'For skin and hair concerns, a dermatologist or your healthcare provider can discuss a range of options, from topical treatments to other approaches. What works best varies from person to person.',
          hi: 'त्वचा और बालों की चिंताओं के लिए, एक चर्म रोग विशेषज्ञ या आपका चिकित्सक कई विकल्पों पर चर्चा कर सकता है, टॉपिकल उपचार से लेकर अन्य दृष्टिकोणों तक। सबसे अच्छा कौन सा काम करता है यह व्यक्ति-दर-व्यक्ति भिन्न होता है।',
        },
      },
      {
        heading: { en: 'Medical support for insulin resistance', hi: 'इंसुलिन प्रतिरोध के लिए चिकित्सकीय समर्थन' },
        body: {
          en: 'When insulin resistance or metabolic concerns are identified, a clinician may discuss medications or other strategies. This is always based on individual assessment — not something to start on your own.',
          hi: 'जब इंसुलिन प्रतिरोध या चयापचय चिंताओं की पहचान होती है, तो एक चिकित्सक दवाएं या अन्य रणनीतियों पर चर्चा कर सकता है। यह हमेशा व्यक्तिगत आकलन पर आधारित होता है — अपने आप शुरू करने के लिए नहीं।',
        },
      },
      {
        heading: { en: 'Fertility support', hi: 'प्रजनन समर्थन' },
        body: {
          en: 'For people who want to become pregnant and are experiencing difficulties, effective fertility treatments are available. These are tailored to individual circumstances and managed by fertility specialists.',
          hi: 'गर्भवती होना चाहने वाले और कठिनाई अनुभव कर रहे लोगों के लिए, प्रभावी प्रजनन उपचार उपलब्ध हैं। ये व्यक्तिगत परिस्थितियों के अनुरूप होते हैं और प्रजनन विशेषज्ञों द्वारा प्रबंधित होते हैं।',
        },
      },
    ],
    callout: { type: 'important', text: { en: 'Medication choices depend on your symptoms, medical history, preferences, and goals. Always discuss treatment options with a qualified healthcare professional. Do not start, stop, or change any prescribed treatment without medical guidance.', hi: 'दवा चुनाव आपके लक्षणों, चिकित्सा इतिहास, पसंदों, और लक्ष्यों पर निर्भर करते हैं। उपचार विकल्पों पर हमेशा एक योग्य चिकित्सक से चर्चा करें। चिकित्सकीय मार्गदर्शन के बिना किसी निर्धारित उपचार को शुरू, बंद, या बदल न करें।' } },
  },
  {
    id: 'fertility',
    label: { en: 'PCOS & fertility', hi: 'PCOS और प्रजनन' },
    icon: Baby,
    title: { en: 'PCOS and future fertility', hi: 'PCOS और भविष्य की प्रजनन क्षमता' },
    paragraphs: [
      {
        body: {
          en: 'PCOS can make ovulation less predictable, which may make conception more difficult for some people. This is a real concern, and it is understandable to feel worried about it.',
          hi: 'PCOS ओव्यूलेशन को कम पूर्वानुमेय बना सकता है, जिससे कुछ लोगों के लिए गर्भधारण अधिक कठिन हो सकता है। यह एक वास्तविक चिंता है, और इसके बारे में चिंतित महसूस करना समझदारी है।',
        },
      },
      {
        heading: { en: 'PCOS does not mean you cannot become pregnant', hi: 'PCOS का मतलब यह नहीं कि आप गर्भवती नहीं हो सकतीं' },
        body: {
          en: 'Many people with PCOS conceive naturally. For those who need support, a range of effective fertility treatments is available, including medications that can help stimulate ovulation and other approaches guided by fertility specialists. Having PCOS does not mean infertility is inevitable.',
          hi: 'कई PCOS वाले लोग स्वाभाविक रूप से गर्भधारण करते हैं। समर्थन की आवश्यकता वालों के लिए, प्रभावी प्रजनन उपचारों की एक श्रृंखला उपलब्ध है, जिसमें ओव्यूलेशन को उत्तेजित करने में मदद करने वाली दवाएं और प्रजनन विशेषज्ञों द्वारा निर्देशित अन्य दृष्टिकोण शामिल हैं। PCOS होने का मतलब बांझपन अनिवार्य है, नहीं।',
        },
      },
      {
        heading: { en: 'When to seek fertility support', hi: 'प्रजनन समर्थन कब लें' },
        body: {
          en: 'If you have been trying to conceive for a year or more (or six months if you are over 35) without success, speaking with a healthcare provider or fertility specialist is a reasonable and positive step. They can assess your situation and discuss options with you.',
          hi: 'यदि आप एक वर्ष या अधिक (या 35 वर्ष से अधिक उम्र में छह महीने) से गर्भधारण का प्रयास कर रही हैं और सफल नहीं हुई हैं, तो एक चिकित्सक या प्रजनन विशेषज्ञ से बात करना एक उचित और सकारात्मक कदम है। वे आपकी स्थिति का आकलन कर सकते हैं और आपके साथ विकल्पों पर चर्चा कर सकते हैं।',
        },
      },
      {
        heading: { en: 'Sensitive and respectful care', hi: 'संवेदनशील और सम्मानजनक देखभाल' },
        body: {
          en: 'Fertility is a deeply personal topic. Whether or not you want to have children now or in the future, you deserve respectful, non-judgmental care. Your fertility goals — whatever they are — are valid.',
          hi: 'प्रजनन क्षमता एक गहराई से व्यक्तिगत विषय है। चाहे आप अब या भविष्य में बच्चे चाहती हैं या नहीं, आप सम्मानजनक, निष्पक्ष देखभाल की हकदार हैं। आपके प्रजनन लक्ष्य — जो कुछ भी हैं — वैध हैं।',
        },
      },
    ],
    callout: { type: 'reassure', text: { en: 'PCOS can make ovulation less predictable, but it does not mean you cannot become pregnant. Effective clinical support is available.', hi: 'PCOS ओव्यूलेशन को कम पूर्वानुमेय बना सकता है, लेकिन इसका मतलब यह नहीं कि आप गर्भवती नहीं हो सकतीं। प्रभावी चिकित्सकीय समर्थन उपलब्ध है।' } },
  },
  {
    id: 'long-term-health',
    label: { en: 'Long-term health', hi: 'दीर्घकालिक स्वास्थ्य' },
    icon: ShieldAlert,
    title: { en: 'PCOS and long-term health', hi: 'PCOS और दीर्घकालिक स्वास्थ्य' },
    paragraphs: [
      {
        body: {
          en: 'PCOS can be associated with a higher risk of certain metabolic conditions for some people. This is not meant to frighten you — it is information that empowers you to take proactive steps with your healthcare provider.',
          hi: 'PCOS कुछ लोगों में कुछ चयापचय स्थितियों के उच्च जोखिम से जुड़ा हो सकता है। यह आपको डराने के लिए नहीं है — यह जानकारी है जो आपको अपने चिकित्सक के साथ सक्रिय कदम उठाने के लिए सशक्त बनाती है।',
        },
      },
      {
        heading: { en: 'Insulin resistance and type 2 diabetes', hi: 'इंसुलिन प्रतिरोध और टाइप 2 मधुमेह' },
        body: {
          en: 'Some people with PCOS have insulin resistance, which can be associated with a higher risk of developing type 2 diabetes over time. This does not mean everyone with PCOS will develop diabetes. Regular check-ups and blood sugar monitoring, when recommended by your clinician, can help catch any changes early.',
          hi: 'PCOS वाले कुछ लोगों को इंसुलिन प्रतिरोध होता है, जो समय के साथ टाइप 2 मधुमेह के विकास के उच्च जोखिम से जुड़ा हो सकता है। इसका मतलब यह नहीं कि PCOS वाले हर व्यक्ति को मधुमेह होगा। नियमित जांच और रक्त शर्करा निगरानी, जब आपके चिकित्सक द्वारा अनुशंसित हो, किसी भी बदलाव को जल्दी पकड़ने में मदद कर सकती है।',
        },
      },
      {
        heading: { en: 'Persistent infrequent periods', hi: 'लगातार दुर्लभ अवधि' },
        body: {
          en: 'When periods are very infrequent or absent for long stretches, the lining of the uterus may be exposed to estrogen without the balancing effect of progesterone for extended periods. Over time, this may warrant medical management. A clinician may discuss options to help protect the uterine lining, depending on your situation.',
          hi: 'जब अवधि बहुत दुर्लभ होती है या लंबे समय तक अनुपस्थित रहती है, तो गर्भाशय की परत लंबे समय तक प्रोजेस्टेरोन के संतुलन प्रभाव के बिना एस्ट्रोजन के संपर्क में रह सकती है। समय के साथ, इसके लिए चिकित्सकीय प्रबंधन आवश्यक हो सकता है। एक चिकित्सक आपकी स्थिति के अनुसार गर्भाशय की परत की रक्षा के विकल्पों पर चर्चा कर सकता है।',
        },
      },
      {
        heading: { en: 'Monitoring, not anxiety', hi: 'निगरानी, चिंता नहीं' },
        body: {
          en: 'These are risks to discuss and monitor with your healthcare provider — not outcomes that every person with PCOS will experience. Appropriate follow-up and individualised screening help you stay informed and healthy without encouraging unnecessary or excessive testing.',
          hi: 'ये जोखिम हैं जिन्हें आपके चिकित्सक के साथ चर्चा और निगरानी करनी चाहिए — ऐसे परिणाम नहीं जो PCOS वाले हर व्यक्ति को होंगे। उपयुक्त फॉलो-अप और व्यक्तिगत स्क्रीनिंग आपको जानकार और स्वस्थ रखने में मदद करती है बिना अनावश्यक या अत्यधिक परीक्षण को प्रोत्साहित किए।',
        },
      },
      {
        body: {
          en: 'Leading with worst-case outcomes or statistics is not the goal here. The goal is balanced awareness: knowing what to keep an eye on, and knowing that you have the power to work with your healthcare provider on prevention and early care.',
          hi: 'यहां सबसे खराब परिणामों या आंकड़ों से शुरू करना लक्ष्य नहीं है। लक्ष्य संतुलित जागरूकता है: जानना कि किस पर नजर रखनी है, और जानना कि आपके पास रोकथाम और शीघ्र देखभाल पर अपने चिकित्सक के साथ काम करने की शक्ति है।',
        },
      },
    ],
  },
  {
    id: 'emotional-wellbeing',
    label: { en: 'Emotional well-being', hi: 'भावनात्मक कल्याण' },
    icon: Heart,
    title: { en: 'Emotional well-being and self-confidence', hi: 'भावनात्मक कल्याण और आत्मविश्वास' },
    paragraphs: [
      {
        body: {
          en: 'Living with symptoms like acne, unwanted hair, weight changes, or unpredictable periods can take a real emotional toll. Add social pressure, comments from others, and the stress of navigating healthcare, and it is completely understandable to feel overwhelmed sometimes.',
          hi: 'मुहांसे, अवांछित बाल, वजन बदलाव, या अनिश्चित अवधि जैसे लक्षणों के साथ जीना वास्तव में भावनात्मक नुकसान दे सकता है। सामाजिक दबाव, दूसरों की टिप्पणियां, और स्वास्थ्य सेवा तलाशने का तनाव जोड़ें, और कभी-कभी अभिभूत महसूस करना पूरी तरह समझदारी है।',
        },
      },
      {
        heading: { en: 'PCOS does not define you', hi: 'PCOS आपको परिभाषित नहीं करता' },
        body: {
          en: 'PCOS is a part of your health picture — it is not your identity, your worth, or your future. You are a complete person with strengths, relationships, dreams, and value that go far beyond a medical label.',
          hi: 'PCOS आपके स्वास्थ्य चित्र का एक हिस्सा है — यह आपकी पहचान, आपका मूल्य, या आपका भविष्य नहीं है। आप एक पूर्ण व्यक्ति हैं जिसमें ताकतें, रिश्ते, सपने, और मूल्य हैं जो एक चिकित्सकीय लेबल से कहीं आगे जाते हैं।',
        },
      },
      {
        heading: { en: 'Symptoms are not a moral failing', hi: 'लक्षण एक नैतिक विफलता नहीं हैं' },
        body: {
          en: 'Acne, hair growth, weight changes, or irregular periods are not signs that you are lazy, undisciplined, or doing something wrong. They are medical symptoms — biological in nature — and they deserve the same compassion you would offer a friend.',
          hi: 'मुहांसे, बाल वृद्धि, वजन बदलाव, या अनियमित अवधि यह संकेत नहीं हैं कि आप आलसी, अनुशासनहीन, या कुछ गलत कर रही हैं। ये चिकित्सकीय लक्षण हैं — जैविक प्रकृति के — और वे उसी करुणा के हकदार हैं जो आप एक दोस्त को देंगी।',
        },
      },
      {
        heading: { en: 'It is reasonable to seek support', hi: 'समर्थन लेना उचित है' },
        body: {
          en: 'If you are struggling emotionally — with body image, anxiety, fertility-related worries, or just the day-to-day experience of managing a health condition — reaching out for emotional support is a sign of strength, not weakness. This might mean talking to a trusted friend or family member, a counsellor, a therapist, or a support group.',
          hi: 'यदि आप भावनात्मक रूप से संघर्ष कर रही हैं — शरीर की छवि, चिंता, प्रजनन-संबंधी चिंताओं, या बस एक स्वास्थ्य स्थिति प्रबंधित करने के दैनिक अनुभव के साथ — तो भावनात्मक समर्थन के लिए पहुंचना ताकत का संकेत है, कमजोरी का नहीं। इसका मतलब किसी भरोसेमंद मित्र या परिवारिक सदस्य, काउंसलर, थेरेपिस्ट, या समर्थन समूह से बात करना हो सकता है।',
        },
      },
      {
        heading: { en: 'You deserve respectful healthcare', hi: 'आप सम्मानजनक स्वास्थ्य सेवा की हकदार हैं' },
        body: {
          en: 'Regardless of your appearance, body size, or fertility goals, you have the right to be treated with dignity and respect by every healthcare professional you encounter. If you feel dismissed or judged, it is okay to seek a second opinion or find a provider who listens to you.',
          hi: 'आपकी उपस्थिति, शरीर के आकार, या प्रजनन लक्ष्यों के बावजूद, आपके सामने आने वाले हर चिकित्सक द्वारा सम्मान और आदर के साथ व्यवहार किए जाने का अधिकार आपके पास है। यदि आप नजरअंदाज या न्याय किए गए महसूस करती हैं, तो दूसरी राय लेना या ऐसा चिकित्सक खोजना ठीक है जो आपकी बात सुने।',
        },
      },
    ],
    callout: { type: 'reassure', text: { en: 'You are not alone. Your feelings are valid, your worth is not determined by your symptoms, and you deserve compassion — from others and from yourself.', hi: 'आप अकेले नहीं हैं। आपकी भावनाएं वैध हैं, आपका मूल्य आपके लक्षणों से तय नहीं होता, और आप करुणा की हकदार हैं — दूसरों से और खुद से।' } },
  },
  {
    id: 'when-to-seek-advice',
    label: { en: 'When to seek advice', hi: 'सलाह कब लें' },
    icon: CalendarClock,
    title: { en: 'When should someone seek medical advice?', hi: 'किसी को चिकित्सकीय सलाह कब लेनी चाहिए?' },
    paragraphs: [
      {
        heading: { en: 'Routine appointments — when to arrange a visit', hi: 'नियमित नियुक्तियां — दौरा कब तय करें' },
        body: {
          en: 'Consider scheduling a healthcare appointment if you experience any of the following on a persistent or recurring basis: periods that are consistently shorter than 21 days or longer than 35 days; long gaps between periods (3 months or more); troublesome acne or hair-growth changes that concern you; repeated bleeding between periods; or symptoms that are affecting your daily life, mood, or confidence.',
          hi: 'निम्नलिखित में से कोई भी लगातार या आवर्ती आधार पर अनुभव करने पर एक चिकित्सकीय नियुक्ति तय करने पर विचार करें: अवधि जो लगातार 21 दिन से छोटी या 35 दिन से लंबी हों; अवधि के बीच लंबे अंतराल (3 महीने या अधिक); चिंताजनक मुहांसे या बाल वृद्धि बदलाव; अवधि के बीच बार-बार रक्तस्राव; या लक्षण जो आपके दैनिक जीवन, मूड, या आत्मविश्वास को प्रभावित कर रहे हों।',
        },
      },
      {
        heading: { en: 'A missed period', hi: 'छूटी हुई अवधि' },
        body: {
          en: 'A missed period can have many causes, including stress, weight changes, hormonal shifts, illness, or pregnancy when relevant. If pregnancy is possible, a test may be appropriate. If you miss several periods in a row, or if missed periods are a new pattern for you, speaking with a healthcare professional can help identify the cause.',
          hi: 'छूटी हुई अवधि के कई कारण हो सकते हैं, जिनमें तनाव, वजन बदलाव, हार्मोनल बदलाव, बीमारी, या प्रासंगिक होने पर गर्भावस्था शामिल हैं। यदि गर्भावस्था संभव है, तो परीक्षण उपयुक्त हो सकता है। यदि आपको लगातार कई अवधियां छूट जाएं, या छूटी हुई अवधि आपके लिए एक नया पैटर्न है, तो एक चिकित्सक से बात करना कारण पहचानने में मदद कर सकता है।',
        },
      },
      {
        heading: { en: 'Urgent concerns — when to seek prompt care', hi: 'तत्काल चिंताएं — तुरंत सहायता कब लें' },
        body: {
          en: 'Seek urgent medical care if you experience: severe pelvic or abdominal pain that is different from your usual cramps; very heavy bleeding accompanied by weakness, dizziness, or fainting; a sudden high fever with pelvic pain; or any other symptom that feels alarming or rapidly worsening. These situations need prompt evaluation.',
          hi: 'तुरंत चिकित्सकीय सहायता लें यदि आप अनुभव करें: तेज श्रोणि या पेट दर्द जो आपकी आम ऐंठन से अलग हो; बहुत भारी रक्तस्राव जिसके साथ कमजोरी, चक्कर, या बेहोशी हो; श्रोणि दर्द के साथ अचानक तेज बुखार; या कोई अन्य लक्षण जो खतरनाक या तेजी से बिगड़ता महसूस हो। इन स्थितियों के लिए तुरंत मूल्यांकन आवश्यक है।',
        },
      },
      {
        heading: { en: 'Not every irregular cycle is an emergency', hi: 'हर अनियमित चक्र आपातकाल नहीं है' },
        body: {
          en: 'Some variation in your cycle is normal and does not require urgent care. The distinction is between occasional variation (usually fine to mention at a routine appointment) and persistent, severe, or sudden changes (worth addressing sooner).',
          hi: 'आपके चक्र में कुछ विविधता सामान्य है और इसके लिए तत्काल देखभाल की आवश्यकता नहीं है। अंतर अवसरवश विविधता (आमतौर पर नियमित नियुक्ति में उल्लेख करना ठीक है) और लगातार, गंभीर, या अचानक बदलाव (जल्द बताना उचित) के बीच है।',
        },
      },
    ],
    callout: { type: 'important', text: { en: 'Saheli provides education, not a medical diagnosis. If you are concerned about your symptoms, please consult a qualified healthcare professional.', hi: 'Saheli शिक्षा प्रदान करता है, चिकित्सकीय निदान नहीं। यदि आप अपने लक्षणों के बारे में चिंतित हैं, तो कृपया एक योग्य चिकित्सक से परामर्श करें।' } },
  },
  {
    id: 'preparing-appointment',
    label: { en: 'Preparing for a visit', hi: 'दौरे की तैयारी' },
    icon: Stethoscope,
    title: { en: 'Preparing for a healthcare appointment', hi: 'चिकित्सकीय नियुक्ति की तैयारी' },
    paragraphs: [
      {
        body: {
          en: 'A little preparation can make your appointment more productive and help you feel more confident. Here is a practical checklist you can review before your visit. You do not need to have every item ready — these are suggestions, not requirements.',
          hi: 'थोड़ी तैयारी आपकी नियुक्ति को अधिक उत्पादक बना सकती है और आपको अधिक आत्मविश्वास दे सकती है। यहां एक व्यावहारिक चेकलिस्ट है जिसे आप अपने दौरे से पहले देख सकती हैं। आपको हर आइटम तैयार रखने की आवश्यकता नहीं — ये सुझाव हैं, आवश्यकताएं नहीं।',
        },
      },
    ],
  },
];

const FAQS: { question: BilingualText; answer: BilingualText }[] = [
  {
    question: { en: 'Does having irregular periods mean I have PCOS?', hi: 'क्या अनियमित अवधि का मतलब मुझे PCOS है?' },
    answer: {
      en: 'No. Irregular periods can be caused by many factors including stress, weight changes, intense exercise, thyroid conditions, medications, and the natural variability of the first few years after periods begin. PCOS is one possible cause among many. A healthcare professional can help determine the reason for your irregular cycles through a proper evaluation.',
      hi: 'नहीं। अनियमित अवधि कई कारकों से हो सकती है जिनमें तनाव, वजन बदलाव, तीव्र व्यायाम, थायराइड स्थितियां, दवाएं, और अवधि शुरू होने के बाद पहले कुछ वर्षों की प्राकृतिक विविधता शामिल हैं। PCOS कई में से एक संभावित कारण है। एक योग्य चिकित्सक उचित मूल्यांकन के माध्यम से आपके अनियमित चक्र का कारण निर्धारित करने में मदद कर सकता है।',
    },
  },
  {
    question: { en: 'Can someone have PCOS without ovarian cysts?', hi: 'क्या किसी को ओवरी सिस्ट के बिना PCOS हो सकता है?' },
    answer: {
      en: 'Yes. The term "polycystic" is misleading — you can have PCOS without any visible cysts or follicles on an ultrasound. The diagnosis is based on a combination of your medical history, symptoms, blood tests, and sometimes ultrasound, not on any single finding. Conversely, having ovarian cysts does not automatically mean you have PCOS.',
      hi: 'हां। "पॉलीसिस्टिक" शब्द भ्रामक है — आपको अल्ट्रासाउंड पर किसी भी दिखने वाले सिस्ट या फॉलिकल्स के बिना PCOS हो सकता है। निदान आपके चिकित्सा इतिहास, लक्षणों, रक्त परीक्षणों, और कभी-कभी अल्ट्रासाउंड के संयोजन पर आधारित है, किसी एक निष्कर्ष पर नहीं। इसके विपरीत, ओवरी सिस्ट होने का मतलब स्वतः ही PCOS नहीं है।',
    },
  },
  {
    question: { en: 'Does PCOS always cause weight gain?', hi: 'क्या PCOS हमेशा वजन बढ़ने का कारण बनता है?' },
    answer: {
      en: 'No. While some people with PCOS experience weight changes or find weight management more challenging, many people with PCOS do not have weight concerns. Weight changes have many causes and do not define whether someone has PCOS. Assuming that everyone with PCOS has a particular body type is inaccurate.',
      hi: 'नहीं। जबकि PCOS वाले कुछ लोग वजन बदलाव अनुभव करते हैं या वजन प्रबंधन अधिक चुनौतीपूर्ण पाते हैं, कई PCOS वाले लोगों को वजन की चिंता नहीं होती। वजन बदलाव के कई कारण हैं और यह तय नहीं करता कि किसी को PCOS है या नहीं। यह मानना कि PCOS वाले हर व्यक्ति का शरीर का एक विशेष प्रकार होता है, गलत है।',
    },
  },
  {
    question: { en: 'Can PCOS cause acne?', hi: 'क्या PCOS मुहांसे का कारण बन सकता है?' },
    answer: {
      en: 'Yes, acne can be associated with PCOS, particularly when androgen levels are higher than typical. However, acne is extremely common and has many causes — hormones, genetics, skincare, stress, and diet can all play a role. Having acne does not automatically mean you have PCOS.',
      hi: 'हां, मुहांसे PCOS से जुड़े हो सकते हैं, खासकर जब एंड्रोजन स्तर सामान्य से अधिक होते हैं। हालांकि, मुहांसे अत्यंत आम हैं और इनके कई कारण हैं — हार्मोन, आनुवंशिकी, स्किनकेयर, तनाव, और आहार सभी भूमिका निभा सकते हैं। मुहांसे होने का मतलब स्वतः ही PCOS नहीं है।',
    },
  },
  {
    question: { en: 'Does PCOS mean I cannot get pregnant?', hi: 'क्या PCOS का मतलब मैं गर्भवती नहीं हो सकती?' },
    answer: {
      en: 'No. PCOS can make ovulation less predictable, which may make conception more difficult for some people. However, many people with PCOS conceive naturally, and effective fertility treatments are available for those who need support. PCOS does not mean infertility is inevitable.',
      hi: 'नहीं। PCOS ओव्यूलेशन को कम पूर्वानुमेय बना सकता है, जिससे कुछ लोगों के लिए गर्भधारण अधिक कठिन हो सकता है। हालांकि, कई PCOS वाले लोग स्वाभाविक रूप से गर्भधारण करते हैं, और समर्थन की आवश्यकता वालों के लिए प्रभावी प्रजनन उपचार उपलब्ध हैं। PCOS का मतलब बांझपन अनिवार्य है, नहीं।',
    },
  },
  {
    question: { en: 'Can teenagers have symptoms that resemble PCOS?', hi: 'क्या किशोरों में PCOS जैसे लक्षण हो सकते हैं?' },
    answer: {
      en: 'Yes. During normal puberty, irregular periods, acne, and changes in hair growth are common and do not necessarily indicate PCOS. Adult diagnostic criteria should not be applied to adolescents without careful assessment by a qualified professional experienced in adolescent health. If you are a teenager with concerns, talk to a healthcare provider who understands adolescent development.',
      hi: 'हां। सामान्य यौवन के दौरान, अनियमित अवधि, मुहांसे, और बाल वृद्धि में बदलाव आम हैं और जरूरी नहीं कि PCOS का संकेत हों। वयस्क निदान मानदंड किशोरों पर किशोर स्वास्थ्य में अनुभवी योग्य विशेषज्ञ द्वारा सावधानीपूर्वक आकलन के बिना लागू नहीं होने चाहिए। यदि आप चिंताओं वाली किशोर हैं, तो एक ऐसे चिकित्सक से बात करें जो किशोर विकास को समझता है।',
    },
  },
  {
    question: { en: 'Can PCOS symptoms be managed?', hi: 'क्या PCOS लक्षणों को प्रबंधित किया जा सकता है?' },
    answer: {
      en: 'Yes. While there is no single cure, symptoms can often be managed effectively through a combination of approaches tailored to your individual needs. These may include balanced nutrition, regular physical activity, sleep and stress management, and clinician-guided treatments. Many people with PCOS lead full, healthy lives.',
      hi: 'हां। हालांकि कोई एक इलाज नहीं है, लक्षणों को अक्सर आपकी व्यक्तिगत आवश्यकताओं के अनुरूप दृष्टिकोणों के संयोजन के माध्यम से प्रभावी ढंग से प्रबंधित किया जा सकता है। इनमें संतुलित पोषण, नियमित शारीरिक गतिविधि, नींद और तनाव प्रबंधन, और चिकित्सक-निर्देशित उपचार शामिल हो सकते हैं। कई PCOS वाले लोग पूर्ण, स्वस्थ जीवन जीते हैं।',
    },
  },
  {
    question: { en: 'Is PCOS the same as having a single ovarian cyst?', hi: 'क्या PCOS एक ओवरी सिस्ट होने जैसा है?' },
    answer: {
      en: 'No. A single ovarian cyst is a fluid-filled sac that can develop on an ovary and is often harmless and resolves on its own. PCOS is a complex hormonal condition involving multiple factors. The "polycystic" in PCOS refers to many small follicles, not large cysts, and having a single cyst does not mean you have PCOS.',
      hi: 'नहीं। एक ओवरी सिस्ट एक तरल से भरा थैला है जो अंडाशय पर विकसित हो सकता है और अक्सर हानिरहित होता है और अपने आप ठीक हो जाता है। PCOS एक जटिल हार्मोनल स्थिति है जिसमें कई कारक शामिल होते हैं। PCOS में "पॉलीसिस्टिक" का मतलब कई छोटे फॉलिकल्स हैं, बड़े सिस्ट नहीं, और एक सिस्ट होने का मतलब PCOS है, नहीं।',
    },
  },
  {
    question: { en: 'When should I talk to a healthcare professional?', hi: 'मुझे चिकित्सक से कब बात करनी चाहिए?' },
    answer: {
      en: 'Consider arranging a visit if you have persistent or recurring irregular periods (consistently shorter than 21 days or longer than 35 days), long gaps between periods (3 months or more), troublesome acne or hair changes, repeated bleeding between periods, or symptoms affecting your daily life. Seek urgent care for severe pelvic pain, very heavy bleeding with dizziness or fainting, or other alarming symptoms.',
      hi: 'नियुक्ति तय करने पर विचार करें यदि आपको लगातार या आवर्ती अनियमित अवधि हैं (लगातार 21 दिन से छोटी या 35 दिन से लंबी), अवधि के बीच लंबे अंतराल (3 महीने या अधिक), चिंताजनक मुहांसे या बाल बदलाव, अवधि के बीच बार-बार रक्तस्राव, या दैनिक जीवन को प्रभावित करने वाले लक्षण। तेज श्रोणि दर्द, चक्कर या बेहोशी के साथ बहुत भारी रक्तस्राव, या अन्य खतरनाक लक्षणों के लिए तत्काल सहायता लें।',
    },
  },
  {
    question: { en: 'Can Saheli diagnose PCOS?', hi: 'क्या Saheli PCOS का निदान कर सकता है?' },
    answer: {
      en: 'No. Saheli provides educational information only. It cannot diagnose PCOS or any other medical condition. A diagnosis requires evaluation by a qualified healthcare professional using your medical history, physical examination, and appropriate tests. If you suspect you may have PCOS, please consult a healthcare provider.',
      hi: 'नहीं। Saheli केवल शैक्षिक जानकारी प्रदान करता है। यह PCOS या किसी अन्य चिकित्सकीय स्थिति का निदान नहीं कर सकता। निदान के लिए आपके चिकित्सा इतिहास, शारीरिक परीक्षण, और उपयुक्त परीक्षणों का उपयोग करके एक योग्य चिकित्सक द्वारा मूल्यांकन आवश्यक है। यदि आपको PCOS होने का संदेह है, तो कृपया एक चिकित्सक से परामर्श करें।',
    },
  },
];

const APPOINTMENT_CHECKLIST: BilingualText[] = [
  { en: 'Dates of your recent periods and how long each lasted', hi: 'आपकी हाल की अवधियों की तिथियां और प्रत्येक कितनी देर चली' },
  { en: 'How your flow has been — lighter, heavier, or different from usual', hi: 'आपका फ्लो कैसा रहा — हल्का, भारी, या आम से अलग' },
  { en: 'Any spotting between periods', hi: 'अवधि के बीच कोई स्पॉटिंग' },
  { en: 'Cramps, pain, or other physical symptoms and when they occur', hi: 'ऐंठन, दर्द, या अन्य शारीरिक लक्षण और वे कब होते हैं' },
  { en: 'Changes in acne, hair growth, or hair thinning', hi: 'मुहांसे, बाल वृद्धि, या बाल पतले होने में बदलाव' },
  { en: 'Current medicines, supplements, or herbal remedies you take', hi: 'वर्तमान दवाएं, सप्लीमेंट, या जड़ी-बूटी जो आप लेती हैं' },
  { en: 'Relevant health history, including family history of PCOS or similar symptoms', hi: 'संबंधित स्वास्थ्य इतिहास, जिसमें PCOS या समान लक्षणों का पारिवारिक इतिहास शामिल है' },
  { en: 'Questions you would like answered (see the suggestions below)', hi: 'वे सवाल जिनके जवाब आप जानना चाहेंगी (नीचे सुझाव देखें)' },
];

const DOCTOR_QUESTIONS: BilingualText[] = [
  { en: 'What could be causing my irregular periods?', hi: 'मेरी अनियमित अवधि का कारण क्या हो सकता है?' },
  { en: 'Do I need any tests, and why?', hi: 'क्या मुझे किसी परीक्षण की आवश्यकता है, और क्यों?' },
  { en: 'What treatment options fit my symptoms and goals?', hi: 'मेरे लक्षणों और लक्ष्यों के अनुरूप कौन से उपचार विकल्प हैं?' },
  { en: 'Are there lifestyle changes that might help my specific situation?', hi: 'क्या ऐसे जीवनशैली बदलाव हैं जो मेरी विशिष्ट स्थिति में मदद कर सकते हैं?' },
  { en: 'Should I have follow-up checks, and if so, how often?', hi: 'क्या मुझे फॉलो-अप जांच करानी चाहिए, और यदि हां, तो कितनी बार?' },
  { en: 'When should I return if my symptoms continue or change?', hi: 'यदि मेरे लक्षण जारी रहें या बदलें तो मुझे कब लौटना चाहिए?' },
];

const SOURCES: { name: string; url: string }[] = [
  { name: 'World Health Organization (WHO) — Polycystic Ovary Syndrome', url: 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome' },
  { name: 'American College of Obstetricians and Gynecologists (ACOG) — PCOS FAQ', url: 'https://www.acog.org/womens-health/faqs/polycystic-ovary-syndrome-pcos' },
  { name: 'National Institute of Child Health and Human Development (NICHD) — PCOS', url: 'https://www.nichd.nih.gov/health/topics/pcos' },
];

const UI = {
  backToHub: { en: 'Back to Learning Hub', hi: 'लर्निंग हब में वापस' },
  conditionsBadge: { en: 'Conditions', hi: 'स्थितियां' },
  heroTitle: { en: 'Understanding PCOS/PCOD', hi: 'PCOS/PCOD को समझना' },
  heroSubtitle: { en: 'Knowledge Without Fear', hi: 'बिना डर के ज्ञान' },
  heroBody: { en: 'Learn about your hormones, understand your cycle, and discover the support available to you.', hi: 'अपने हार्मोन के बारे में जानें, अपने चक्र को समझें, और आपके लिए उपलब्ध समर्थन की खोज करें।' },
  exploreTopics: { en: 'Explore topics', hi: 'विषय देखें' },
  checklistTitle: { en: 'What to bring or prepare', hi: 'क्या लाएं या तैयार करें' },
  doctorQTitle: { en: 'Questions to ask your doctor', hi: 'अपने डॉक्टर से पूछने के सवाल' },
  doctorQHint: { en: 'Tap to mark questions you want to remember.', hi: 'याद रखना चाहती हैं ऐसे सवाल चिह्नित करने के लिए टैप करें।' },
  doctorQFootnote: { en: 'You do not need to answer every question or complete every test before seeking help. Your provider is there to guide you through the process.', hi: 'सहायता लेने से पहले आपको हर सवाल का जवाब देने या हर परीक्षण पूरा करने की आवश्यकता नहीं है। आपका चिकित्सक प्रक्रिया में आपका मार्गदर्शन करने के लिए है।' },
  faqTitle: { en: 'Frequently asked questions', hi: 'अक्सर पूछे जाने वाले सवाल' },
  askTitle: { en: 'Have more questions?', hi: 'और सवाल हैं?' },
  askBody: { en: 'Ask Saheli for general educational questions about your cycle and health.', hi: 'अपने चक्र और स्वास्थ्य के बारे में सामान्य शैक्षिक सवालों के लिए Saheli से पूछें।' },
  askBtn: { en: 'Ask', hi: 'पूछें' },
  sourcesTitle: { en: 'Sources and further reading', hi: 'स्रोत और अतिरिक्त पठन' },
  sourcesIntro: { en: 'The content in this guide is based on publicly available information from reputable health organisations. We encourage you to explore these original sources for more detailed information.', hi: 'इस मार्गदर्शक की सामग्री प्रतिष्ठित स्वास्थ्य संगठनों की सार्वजनिक रूप से उपलब्ध जानकारी पर आधारित है। हम आपको अधिक विस्तृत जानकारी के लिए इन मूल स्रोतों को देखने के लिए प्रोत्साहित करते हैं।' },
  footerTitle: { en: 'You are not alone in this', hi: 'आप इसमें अकेले नहीं हैं' },
  footerBody: { en: 'Understanding your body is an act of self-care. Whether or not you have PCOS, you deserve clear information, compassionate care, and the confidence to make informed decisions about your health. Saheli is here to support you on that journey.', hi: 'अपने शरीर को समझना आत्म-देखभाल का एक कार्य है। आपको PCOS है या नहीं, आप स्पष्ट जानकारी, करुणामय देखभाल, और अपने स्वास्थ्य के बारे में जानकारीपूर्वक निर्णय लेने के आत्मविश्वास की हकदार हैं। Saheli उस यात्रा पर आपका समर्थन करने के लिए यहां है।' },
};

export function PCOSGuide() {
  const navigate = useNavigate();
  const { lang } = useApp();
  const L = (text: BilingualText) => text[lang];
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
        <ChevronLeft size={18} /> {L(UI.backToHub)}
      </button>

      {/* Hero header */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-blush-100 via-lavender-100 to-mint-100 px-5 py-7">
          <div className="flex items-center gap-2">
            <Flower2 size={22} className="text-coral-400" />
            <span className="badge bg-white/60 text-plum-500">{L(UI.conditionsBadge)}</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-plum-700">
            {L(UI.heroTitle)}
          </h1>
          <p className="mt-1 font-display text-lg text-coral-500">{L(UI.heroSubtitle)}</p>
          <p className="mt-2 text-sm leading-relaxed text-plum-500">
            {L(UI.heroBody)}
          </p>
        </div>
      </div>

      {/* Table of contents */}
      <div className="card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-plum-400">{L(UI.exploreTopics)}</p>
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
                <span className="leading-tight">{L(section.label)}</span>
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
                <h2 className="font-display text-lg font-semibold text-plum-700">{L(section.title)}</h2>
              </div>

              <div className="space-y-3">
                {section.paragraphs.map((para, i) => (
                  <div key={i}>
                    {para.heading && (
                      <h3 className="mb-1 text-sm font-semibold text-plum-600">{L(para.heading)}</h3>
                    )}
                    <p className="text-sm leading-relaxed text-plum-500">{L(para.body)}</p>
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
                      {L(section.callout.text)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Appointment checklist — rendered after the preparing section */}
            {section.id === 'preparing-appointment' && (
              <div className="mt-3 space-y-3">
                <div className="card p-5">
                  <h3 className="mb-3 text-sm font-semibold text-plum-600">{L(UI.checklistTitle)}</h3>
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
                          {L(item)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card p-5">
                  <h3 className="mb-1 text-sm font-semibold text-plum-600">{L(UI.doctorQTitle)}</h3>
                  <p className="mb-3 text-xs text-plum-400">{L(UI.doctorQHint)}</p>
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
                          {L(q)}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-plum-300">
                    {L(UI.doctorQFootnote)}
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
          <h2 className="font-display text-lg font-semibold text-plum-700">{L(UI.faqTitle)}</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-cream-200">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 bg-cream-50 px-4 py-3.5 text-left transition-colors hover:bg-cream-100"
                aria-expanded={openFaq === i}
              >
                <span className="text-sm font-medium text-plum-600">{L(faq.question)}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-plum-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="animate-fade-in px-4 py-3.5">
                  <p className="text-sm leading-relaxed text-plum-500">{L(faq.answer)}</p>
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
            <h2 className="text-sm font-semibold text-plum-600">{L(UI.askTitle)}</h2>
            <p className="text-xs text-plum-400">{L(UI.askBody)}</p>
          </div>
          <button onClick={() => navigate('/ask')} className="btn-primary px-4 py-2.5 text-sm">
            {L(UI.askBtn)}
          </button>
        </div>
      </div>

      {/* Sources and further reading */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-coral-400" />
          <h2 className="text-sm font-semibold text-plum-600">{L(UI.sourcesTitle)}</h2>
        </div>
        <p className="mb-3 text-xs text-plum-400">
          {L(UI.sourcesIntro)}
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
            <p className="text-sm font-medium text-plum-600">{L(UI.footerTitle)}</p>
            <p className="mt-1 text-xs leading-relaxed text-plum-500">
              {L(UI.footerBody)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
