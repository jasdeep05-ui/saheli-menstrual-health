const QUOTES: string[] = [
  "Hey, lovely! You deserve all the softness you give others. 💗",
  "A little reminder: you're doing better than you think. 🌷",
  "Dear girl, your pace is perfect for your journey. ✨",
  "You don't have to bloom every day to be growing. 🌸",
  "Your feelings matter, your rest matters, and YOU matter. 💕",
  "Hello, sunshine! Make today a little kinder to yourself. ☀️",
  "You're allowed to take up space, dream big, and shine. 🦋",
  "One small step is still progress, beautiful. 🌷",
  "Be gentle with yourself, just like you'd be with your best friend. 💖",
  "Today, remember that you are worthy of care, always. 🌼",
  "Your strength is quieter than you think — and deeper than you know. 🌙",
  "Breathe. You've handled every hard day so far. 🌿",
  "You are not too much. You are just enough, exactly as you are. 🌺",
  "Soft hearts are strong hearts. Don't let anyone tell you otherwise. 💗",
  "Rest is not a reward. It's a right. 🌸",
  "You are blooming in your own season, and that's beautiful. 🌻",
  "Be proud of yourself for showing up today. That counts. ✨",
  "You carry warmth wherever you go. Don't forget to save some for yourself. 🕯️",
  "It's okay to not be okay. Tomorrow is a fresh page. 📖",
  "Your body is doing its best. Thank it today. 💕",
  "You are loved more than you know, in ways you may never see. 💗",
  "Every wave you've weathered has made you wiser. 🌊",
  "Trust your timing. Your story is unfolding beautifully. 🌸",
  "You don't need to be perfect to be deeply loved. 🌷",
  "Small acts of self-care are big acts of self-respect. 💖",
  "Your sensitivity is your superpower. Wear it proudly. 🦋",
  "Even on cloudy days, you are someone's rainbow. 🌈",
  "You are allowed to change your mind, your pace, and your plans. 🌿",
  "Your voice matters. Use it softly, but use it. 🗣️",
  "Be the girl who believes in herself a little more today. ✨",
  "You are not behind. You are on your own path. 🌼",
  "Your kindness changes the world — one gentle moment at a time. 💗",
  "Today is a new chance to be kind to yourself. Take it. 🌸",
  "You are stronger than the storm you're walking through. 🌷",
  "Your presence is a gift. Don't shrink it for anyone. 🎁",
  "Let go of what you can't control. Hold on to what brings you peace. 🕊️",
];

const STORAGE_KEY = 'saheli_last_quote_index';

function getTimeGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getGreeting(date: Date = new Date()): string {
  return getTimeGreeting(date.getHours());
}

export function getDailyQuote(): string {
  let lastIndex: number | null = null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored !== null) lastIndex = parseInt(stored, 10);
  } catch {
    // sessionStorage may be unavailable — continue without it
  }

  let index: number;
  if (QUOTES.length <= 1) {
    index = 0;
  } else {
    index = Math.floor(Math.random() * QUOTES.length);
    if (index === lastIndex) {
      index = (index + 1) % QUOTES.length;
    }
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, String(index));
  } catch {
    // Ignore storage errors
  }

  return QUOTES[index];
}
