export interface MoodLog {
  id: string;
  date: string;
  mood: number; // 1-5
  moodLabel: string;
  sleep: number; // hours
  description: string;
  timestamp: number;
}

export interface VoiceEntry {
  id: string;
  date: string;
  duration: number;
  transcript: string;
  sentiment: number; // -1 to 1
  keywords: string[];
  timestamp: number;
}

export interface AvatarConfig {
  skinTone: string;
  hairstyle: string;
  hairColor: string;
  eyes: string;
  eyeColor: string;
  mouth: string;
  outfit: string;
  outfitColor: string;
  accessory: string;
}

export interface UserProfile {
  name: string;
  email: string;
  joinedDate: string;
  avatar: AvatarConfig;
}

// LocalStorage keys
const MOOD_LOGS_KEY = "moodshift_mood_logs";
const VOICE_ENTRIES_KEY = "moodshift_voice_entries";
const USER_PROFILE_KEY = "moodshift_user_profile";
const ONBOARDING_KEY = "moodshift_onboarding_complete";

// Mood logs
export const getMoodLogs = (): MoodLog[] => {
  const data = localStorage.getItem(MOOD_LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveMoodLog = (log: MoodLog): void => {
  const logs = getMoodLogs();
  logs.push(log);
  localStorage.setItem(MOOD_LOGS_KEY, JSON.stringify(logs));
};

// Voice entries
export const getVoiceEntries = (): VoiceEntry[] => {
  const data = localStorage.getItem(VOICE_ENTRIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveVoiceEntry = (entry: VoiceEntry): void => {
  const entries = getVoiceEntries();
  entries.push(entry);
  localStorage.setItem(VOICE_ENTRIES_KEY, JSON.stringify(entries));
};

// User profile
export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(USER_PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
};

// Onboarding
export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === "true";
};

export const setOnboardingComplete = (complete: boolean): void => {
  localStorage.setItem(ONBOARDING_KEY, complete.toString());
};

// Clear all data
export const clearAllData = (): void => {
  localStorage.removeItem(MOOD_LOGS_KEY);
  localStorage.removeItem(VOICE_ENTRIES_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
};

// Generate demo data
export const generateDemoData = (): void => {
  const moodLabels = ["Terrible", "Bad", "Okay", "Good", "Excellent"];
  const descriptions = [
    "Feeling stressed from work deadlines",
    "Had a good workout today, feeling energized",
    "Rough day, lots of meetings",
    "Peaceful weekend, spent time with family",
    "Anxious about upcoming presentation",
    "Great day! Accomplished all my goals",
    "Feeling tired and overwhelmed"
  ];

  const transcripts = [
    "Today was really challenging. Work has been piling up and I feel like I can't catch a break. Need to find better ways to manage stress.",
    "I'm grateful for the support from my team today. Even though things were tough, having people to lean on made a difference.",
    "Feeling anxious about the upcoming deadline. My sleep hasn't been great and I'm noticing it affecting my mood.",
    "Had a wonderful morning meditation session. Starting to see the benefits of daily mindfulness practice.",
    "Work-life balance is becoming difficult. Need to set better boundaries and prioritize self-care.",
    "Celebrated a small win today! It's important to acknowledge progress, even the little things.",
    "Feeling burnt out. Taking things one day at a time but it's been tough lately."
  ];

  const logs: MoodLog[] = [];
  const entries: VoiceEntry[] = [];
  const now = Date.now();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    
    const mood = Math.floor(Math.random() * 3) + 2; // 2-4 for realistic variation
    const sleep = Math.random() * 3 + 5.5; // 5.5-8.5 hours
    
    logs.push({
      id: `log-${Date.now()}-${i}`,
      date: dateStr,
      mood,
      moodLabel: moodLabels[mood - 1],
      sleep: Math.round(sleep * 10) / 10,
      description: descriptions[i],
      timestamp: date.getTime(),
    });

    const sentiment = (mood - 3) / 2; // Convert mood to sentiment score
    entries.push({
      id: `entry-${Date.now()}-${i}`,
      date: dateStr,
      duration: 15,
      transcript: transcripts[i],
      sentiment,
      keywords: transcripts[i].toLowerCase().match(/\b(stress|work|anxious|grateful|mindfulness|burnout|overwhelm)\w*/g) || [],
      timestamp: date.getTime(),
    });
  }

  localStorage.setItem(MOOD_LOGS_KEY, JSON.stringify(logs));
  localStorage.setItem(VOICE_ENTRIES_KEY, JSON.stringify(entries));
};
