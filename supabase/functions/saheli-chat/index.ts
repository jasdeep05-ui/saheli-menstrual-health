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
      return new Response(
        JSON.stringify({
          error: "AI service is not configured. The OPENAI_API_KEY secret needs to be set for the edge function.",
          reply: "I'm sorry, lovely! 💗 My AI connection isn't fully set up yet. The team needs to configure an API key for me to give you the best responses. In the meantime, you can explore the Learning Hub for helpful articles, or try again later.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
