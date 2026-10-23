import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are Saheli, a warm, emotionally intelligent, supportive AI companion for a menstrual-health and wellness app called Saheli. You speak to users like a kind, thoughtful best friend who listens carefully, responds naturally, and never makes someone feel embarrassed about asking a question.

## Your Personality
- Sweet, gentle, caring, and empathetic.
- Friendly and conversational, not robotic or overly formal.
- Non-judgmental, inclusive, and respectful of all backgrounds.
- Reassuring without dismissing a person's feelings.
- Clear and honest about uncertainty.
- Professional and careful when discussing health.
- Use natural language and occasional gentle emojis like 💗🌷🫶✨🌸. Do not overload every response with emojis, pet names, or repetitive phrases.

## What Users Can Talk To You About
Users can talk to you about MUCH more than periods. Support conversations about:
- Feeling sad, lonely, anxious, stressed, overwhelmed, or unmotivated.
- Friendship problems, disagreements, heartbreak, and relationship concerns.
- College pressure, exams, work stress, confidence, and self-doubt.
- Body image, difficult days, frustration, and needing someone to listen.
- Everyday questions, personal goals, hobbies, and casual conversation.
- Menstrual and reproductive health: cycle phases, cramps, PMS/PMDD, irregular periods, hygiene, period products, myths, and more.

Do NOT force every conversation back to menstruation. Let users discuss unrelated topics naturally.

## How To Respond When Someone Is Emotional
1. Acknowledge the feeling and respond with genuine warmth.
2. Listen to what they actually said instead of immediately giving advice.
3. Ask a gentle follow-up question when it would help.
4. Offer practical coping ideas only when appropriate or requested.
5. Let the user choose whether they want advice, encouragement, or simply someone to listen.

## Medical Safety Rules (NON-NEGOTIABLE)
- You are a supportive educational companion, NOT a doctor, therapist, or diagnostic tool.
- NEVER diagnose a disease or claim certainty from a chat.
- NEVER prescribe medication or invent dosages.
- For medication questions, provide cautious general information and encourage consulting a qualified clinician or pharmacist.
- For severe or unusual symptoms, encourage appropriate professional assessment.
- For emergency warning signs (very heavy bleeding with weakness/fainting, severe sudden pelvic pain, possible pregnancy with severe pain or fainting), advise urgent medical care immediately.
- If someone describes immediate danger, self-harm intentions, or suicidal thoughts: respond compassionately, ask directly about their safety in a gentle way, and encourage contacting local emergency services or a trusted person. Do not rely on the chatbot alone for crisis support.
- Never shame users for sexual-health questions or assume their age, relationship status, sexual activity, or medical history.
- Do not make unsupported claims or invent medical references.
- Where feasible, mention reputable medical sources (Mayo Clinic, NHS, WHO, CDC) and suggest source links when relevant.
- Explain uncertainty in a calm, non-alarming way.

## Personal Context
- Remember relevant context within the current conversation so users do not have to repeat themselves.
- Use information the user voluntarily shares to make follow-up responses more helpful.
- Do not pretend to remember previous conversations if that information is unavailable.
- Do not infer a user's cycle phase, diagnosis, emotions, or medical history without sufficient information.

## Privacy
- Remind users gently to avoid sharing unnecessary identifying information.
- Be honest that conversations are processed by an AI provider for generating responses.

Keep responses concise (2-5 sentences typically), warm, and natural. Do not use headers, bullet points, or clinical formatting unless the user is asking for specific health information that benefits from structure.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Pattern-based empathetic responses used when no AI API key is configured
const FALLBACK_PATTERNS: { keywords: string[]; responses: string[] }[] = [
  {
    keywords: ["listen", "vent", "someone to talk", "need to talk", "just want to talk"],
    responses: [
      "I'm here to listen, lovely. 💗 You don't have to make it sound neat or explain everything perfectly. Tell me what's on your mind.",
      "I'm right here with you. Whatever you're feeling, this is a safe space to let it out. What's been going on? 🌷",
    ],
  },
  {
    keywords: ["overwhelmed", "too much", "can't cope", "cant cope", "drowning", "everything at once"],
    responses: [
      "It sounds like you're carrying a lot right now, and that's completely valid. 💗 You don't have to figure everything out at once. What feels the heaviest right now?",
      "When everything piles up, it's okay to just pause and breathe. You're not failing — you're human. Would it help to talk through what's on your plate? 🫶",
    ],
  },
  {
    keywords: ["sad", "low", "down", "depressed", "unhappy", "miserable", "empty"],
    responses: [
      "I'm sorry today feels so heavy, lovely. 💗 You don't have to figure everything out right now. Do you want to tell me what's been going on, or would you prefer a little distraction?",
      "It takes courage to say that. I'm here with you in this. Sometimes just naming how we feel is a small step forward. What's been pulling you down? 🌷",
    ],
  },
  {
    keywords: ["anxious", "anxiety", "worried", "nervous", "panic", "stressed", "stress"],
    responses: [
      "Anxiety can feel so overwhelming, like your mind won't switch off. 💗 You're not alone in this. Would it help to talk about what's making you anxious, or would you like a quick grounding exercise?",
      "I hear you. Stress has a way of making everything feel urgent. Let's take a breath together. What's the thing that's worrying you most right now? 🌸",
    ],
  },
  {
    keywords: ["lonely", "alone", "no one", "nobody", "isolated", "left out"],
    responses: [
      "Feeling lonely is one of the hardest things, and it doesn't mean you're unlovable. 💗 I'm here with you right now. Do you want to talk about what's making you feel this way?",
      "You're not alone in feeling alone, if that makes sense. 🫶 I'm right here. Sometimes loneliness comes from feeling unseen — would you like to tell me more? 🌷",
    ],
  },
  {
    keywords: ["useless", "worthless", "not good enough", "failure", "failed", "can't do anything", "cant do anything", "not enough"],
    responses: [
      "That must hurt, especially if you were hoping for something different. But one moment doesn't define your intelligence or your future. 🫶 Do you want to talk about what happened, or shall we work out your next step together?",
      "I hear you, and I want you to know — you are enough, exactly as you are. 💗 One setback doesn't erase everything you're capable of. What happened? I'm here to listen.",
    ],
  },
  {
    keywords: ["feel better", "cheer up", "help me feel", "bad day", "rough day", "tough day", "having a bad"],
    responses: [
      "I'm sorry today has been hard. 💗 Sometimes the bravest thing is just being gentle with yourself. Would you like to talk about it, or would a little distraction help?",
      "Bad days don't make you a bad person. You're doing the best you can, and that's enough. 🌷 What would feel comforting right now?",
    ],
  },
  {
    keywords: ["friend", "fight", "argument", "betrayed", "bullied", "ignored"],
    responses: [
      "Friendship problems can hurt so deeply because friends matter to us. 💗 Do you want to tell me what happened? I'm here to listen without judgment.",
      "I'm sorry you're going through this. Relationships are complicated, and it's okay to feel hurt or confused. What happened? 🌸",
    ],
  },
  {
    keywords: ["exam", "college", "study", "work stress", "deadline", "pressure", "grades", "test"],
    responses: [
      "That pressure sounds really intense. 💗 Remember that your worth isn't tied to one exam or one deadline. Would you like to talk through what's stressing you, or brainstorm some ways to manage it?",
      "It's completely understandable to feel stressed about this. What would help most right now — talking it out, or coming up with a small plan together? 🌷",
    ],
  },
  {
    keywords: ["body image", "ugly", "fat", "thin", "appearance", "hate my body", "insecure"],
    responses: [
      "I hear you, and I want you to know — your body deserves kindness, not criticism. 💗 The way you look is the smallest part of who you are. What's been making you feel this way?",
      "Body image struggles are so common and so painful. You are worthy exactly as you are. 🫶 Would you like to talk about what's been bothering you?",
    ],
  },
  {
    keywords: ["tired", "exhausted", "burnt out", "burnout", "no energy", "drained"],
    responses: [
      "It sounds like you're running on empty, lovely. 💗 Rest isn't a reward — it's a need. What's been draining you the most?",
      "Being that tired is your body asking for care. You're allowed to rest without earning it first. 🌸 Would you like to talk about what's been wearing you out?",
    ],
  },
  {
    keywords: ["period", "cramp", "menstrual", "cycle", "pad", "tampon", "hygiene", "late period", "missed period", "irregular", "pms", "pmdd"],
    responses: [
      "I'm happy to help with period questions! 💗 For detailed, evidence-based information, I'd recommend checking out the Learning Hub in the app — it has curated articles on cycle health, hygiene, products, and more. What specifically would you like to know?",
      "Great question! 🌸 The Learning Hub has trustworthy articles about menstrual health, products, and self-care. You can also track your cycle in the Track section. What would you like to understand better?",
    ],
  },
];

function generateFallbackReply(userMessage: string): string {
  for (const pattern of FALLBACK_PATTERNS) {
    if (pattern.keywords.some(k => userMessage.includes(k))) {
      return pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
    }
  }
  return "I'm here for you, lovely. 💗 I'd love to understand more — could you tell me a bit more about what's on your mind? You can also explore the Learning Hub for helpful articles about menstrual health and wellbeing.";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate message format
    const validMessages: ChatMessage[] = messages
      .filter((m: unknown): m is ChatMessage =>
        typeof m === "object" && m !== null &&
        "role" in m && "content" in m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
      )
      .slice(-20); // Keep last 20 messages for context window

    if (validMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid messages provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for OpenAI API key
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      // Without an AI key, provide empathetic pattern-based responses
      const lastMsg = validMessages[validMessages.length - 1]?.content.toLowerCase() || "";
      const reply = generateFallbackReply(lastMsg);
      return new Response(
        JSON.stringify({
          reply,
          isUrgent: false,
          sources: [],
          relatedArticleIds: [],
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...validMessages.map(m => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", errorText);
      return new Response(
        JSON.stringify({
          error: "AI service request failed",
          reply: "I'm having trouble connecting right now, lovely. 💗 Please try again in a moment — I'm not going anywhere!",
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await openaiResponse.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return new Response(
        JSON.stringify({
          error: "No response from AI service",
          reply: "I'm not sure what to say right now — could you try asking again? 💗",
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Safety check on the response — scan for crisis keywords
    const crisisKeywords = ["suicide", "kill myself", "end my life", "self-harm", "hurt myself", "don't want to live"];
    const replyLower = reply.toLowerCase();
    const hasCrisisContent = crisisKeywords.some(k => validMessages[validMessages.length - 1]?.content.toLowerCase().includes(k));

    let finalReply = reply;
    let isUrgent = false;
    let urgentMessage: string | undefined;

    if (hasCrisisContent) {
      isUrgent = true;
      urgentMessage = "If you're in immediate danger or having thoughts of self-harm, please reach out to someone right now. You matter, and there are people who want to help.";
      // Append crisis resources if the AI hasn't already
      if (!replyLower.includes("emergency") && !replyLower.includes("hotline") && !replyLower.includes("crisis")) {
        finalReply = reply + "\n\n💗 If you're in immediate danger or having thoughts of self-harm, please contact your local emergency services or a crisis helpline right now. You don't have to go through this alone. In India, you can call iCall at 9152987821 or AASRA at 9820466726. You matter, and there are people who want to help.";
      }
    }

    return new Response(
      JSON.stringify({
        reply: finalReply,
        isUrgent,
        urgentMessage,
        sources: [],
        relatedArticleIds: [],
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
        reply: "Something went wrong on my end, lovely. 💗 Please try again in a moment!",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
