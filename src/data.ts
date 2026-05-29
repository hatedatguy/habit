import { Difficulty, Habit, Enemy, ShopItem, CalendarDay, FoodItem } from "./types";

export const initialHabits: Habit[] = [
  {
    id: "habit-sleep",
    name: "Sleep 8hrs",
    emoji: "😴",
    difficulty: Difficulty.HARD,
    rewardXp: 10,
    rewardCoins: 20,
    buttonLabel: "🔒 Lock Device",
    completedButtonLabel: "✓ Completed",
    progress: 80,
    isCompleted: false,
    buttonColorClass: "bg-accent-blue text-[#0E0E1A] hover:bg-[#8bc0ff] btn-glow-blue"
  },
  {
    id: "habit-posture",
    name: "Camera Posture Scan",
    emoji: "📷",
    difficulty: Difficulty.MEDIUM,
    rewardXp: 15,
    rewardCoins: 10,
    buttonLabel: "🤖 Scan Posture",
    completedButtonLabel: "✓ Completed",
    progress: 30,
    isCompleted: false,
    isAiPowered: true,
    aiScanMessage: "AI is analyzing camera perspective for spinal alignment & ergonomics...",
    buttonColorClass: "bg-accent-pink text-[#0E0E1A] hover:bg-[#e2adff] btn-glow-pink"
  },
  {
    id: "habit-voice",
    name: "Voice Journal Analysis",
    emoji: "🎙️",
    difficulty: Difficulty.MEDIUM,
    rewardXp: 15,
    rewardCoins: 10,
    buttonLabel: "🤖 Analyze Voice",
    completedButtonLabel: "✓ Completed",
    progress: 50,
    isCompleted: false,
    isAiPowered: true,
    aiScanMessage: "AI NLP is transcribing & analyzing vocal pitch for focus levels...",
    buttonColorClass: "bg-accent-blue text-[#0E0E1A] hover:bg-[#8bc0ff] btn-glow-blue"
  },
  {
    id: "habit-mindfulness",
    name: "Mind – 10m Silence",
    emoji: "🧘",
    difficulty: Difficulty.MEDIUM,
    rewardXp: 10,
    rewardCoins: 5,
    buttonLabel: "🤖 Start AI Verification",
    completedButtonLabel: "✓ Completed",
    progress: 40,
    isCompleted: false,
    isAiPowered: true,
    aiScanMessage: "AI is scanning alpha zen brainwaves & bio-rhythm stillness...",
    buttonColorClass: "bg-secondary-color text-[#F0EEFF] hover:bg-[#9a8bf7] btn-glow-purple"
  },
  {
    id: "habit-discipline",
    name: "Discipline – Task Focus",
    emoji: "🎯",
    difficulty: Difficulty.MEDIUM,
    rewardXp: 15,
    rewardCoins: 0,
    buttonLabel: "📵 Distraction Blocker",
    completedButtonLabel: "✓ Completed",
    progress: 45,
    isCompleted: false,
    buttonColorClass: "bg-accent-pink text-[#0E0E1A] hover:bg-[#e2adff] btn-glow-pink"
  }
];

export const initialEnemies: Enemy[] = [
  {
    id: "enemy-wraith",
    name: "The Void Wraith",
    status: "ACTIVE",
    badgeText: "⚠️ ACTIVE",
    description: "You missed 3+ habits. The Void Wraith is draining your progress.",
    avatarEmoji: "👻",
    punishments: [
      "-50 Cumulative XP stolen",
      "Streak frozen for 24 hours",
      "Avatar Void Curse — complete 3 habits to break"
    ],
    defeatCondition: "Complete ALL daily rituals tomorrow",
    activePulse: true
  },
  {
    id: "enemy-goblin",
    name: "The Procrastination Goblin",
    status: "DORMANT",
    badgeText: "😴 DORMANT",
    description: "Appears when you complete habits outside their time window for 2+ days.",
    avatarEmoji: "👺",
    punishments: [
      "Habit XP halved if completed late",
      "20 Coins stolen as Goblin Tax",
      "Lazy Label badge on profile for 24hrs"
    ],
    defeatCondition: "Complete 2 habits on-time for 3 days straight",
    activePulse: false
  },
  {
    id: "enemy-demon",
    name: "The Distraction Demon",
    status: "DORMANT",
    badgeText: "😴 DORMANT",
    description: "Triggers when banned apps are opened during a focus habit.",
    avatarEmoji: "😈",
    punishments: [
      "Habit voided — no XP or coins awarded",
      "Reward Shop locked for 12 hours",
      "30% chance to burn 1 streak day if streak ≥ 7"
    ],
    defeatCondition: "Pass 3 AI-verified focus sessions in a row",
    activePulse: false
  }
];

export const initialShopItems: ShopItem[] = [
  // TOPS
  {
    id: "default-tee",
    name: "White Basic Tee",
    price: 0,
    emoji: "👕",
    type: "top",
    isOwned: true,
    effects: ["+5 Comfort", "+2 Basic Presence", "Default Outfit Style"]
  },
  {
    id: "midnight-hoodie",
    name: "Midnight Hoodie",
    price: 80,
    emoji: "🌙",
    type: "top",
    isOwned: false,
    effects: ["+50 Stealth", "+15 Cozy Aura", "Ideal for deep work focus"]
  },
  {
    id: "lavender-crop",
    name: "Lavender Crop",
    price: 60,
    emoji: "💜",
    type: "top",
    isOwned: false,
    effects: ["+30 Mind Power", "+25 Agility", "Delicately styled lavender fabric"]
  },
  {
    id: "celestial-jacket",
    name: "Celestial Jacket",
    price: 150,
    emoji: "⭐",
    type: "top",
    isOwned: false,
    effects: ["+100 Magic Armor", "+15% Cosmic Fortune", "Shines with the power of stars"]
  },
  {
    id: "sakura-kimono",
    name: "Sakura Kimono",
    price: 200,
    emoji: "🌸",
    type: "top",
    isOwned: false,
    effects: ["+120 Zen Spirit", "+25% Flow State Sync", "Blessed by springtime flower petals"],
    requiredLevel: 3
  },
  {
    id: "solar-hoodie",
    name: "Solar Hoodie",
    price: 300,
    emoji: "🔥",
    type: "top",
    isOwned: false,
    effects: ["+210 Solar Spark", "+20% Active XP Boost", "Infused with radiant star embers"],
    requiredLevel: 5
  },

  // BOTTOMS
  {
    id: "default-shorts",
    name: "Grey Shorts",
    price: 0,
    emoji: "🩳",
    type: "bottom",
    isOwned: true,
    effects: ["+5 Footwork", "Default Active Garment"]
  },
  {
    id: "midnight-pants",
    name: "Midnight Pants",
    price: 70,
    emoji: "👖",
    type: "bottom",
    isOwned: false,
    effects: ["+40 Defense", "+25 Shadow Walk"]
  },
  {
    id: "lavender-skirt",
    name: "Lavender Skirt",
    price: 90,
    emoji: "👗",
    type: "bottom",
    isOwned: false,
    effects: ["+55 Wisdom", "+15% Focus Multiplier"]
  },
  {
    id: "star-leggings",
    name: "Star Leggings",
    price: 120,
    emoji: "🌌",
    type: "bottom",
    isOwned: false,
    effects: ["+65 Speed", "+20% Cosmic Fortune", "Deep black leggings with glowing constellations"]
  },
  {
    id: "floral-skirt",
    name: "Floral Skirt",
    price: 180,
    emoji: "🌺",
    type: "bottom",
    isOwned: false,
    effects: ["+90 Mental Vitality", "+10% Flow State Sync", "Delicate pink cherry blossoms print"],
    requiredLevel: 3
  },
  {
    id: "solar-joggers",
    name: "Solar Joggers",
    price: 250,
    emoji: "🏃",
    type: "bottom",
    isOwned: false,
    effects: ["+110 Stamina", "+15% Active XP Boost", "Blazing orange-gold athletic wear"],
    requiredLevel: 5
  },

  // ACCESSORIES
  {
    id: "none",
    name: "None (Accessory)",
    price: 0,
    emoji: "❌",
    type: "accessory",
    isOwned: true,
    effects: ["No item equipped"]
  },
  {
    id: "star-halo",
    name: "Star Halo",
    price: 100,
    emoji: "⭐",
    type: "accessory",
    isOwned: false,
    effects: ["+65 Attack Aura", "+20% Focus Amplification", "Golden halo with orbiting star sparks"]
  },
  {
    id: "mystic-shield",
    name: "Mystic Shield",
    price: 120,
    emoji: "🛡️",
    type: "accessory",
    isOwned: false,
    effects: ["+80 Shield Protection", "Reduce feedback damage by 50%!", "A glowing runic ward made in Stitch."]
  },
  {
    id: "focus-elixir",
    name: "Focus Elixir",
    price: 50,
    emoji: "🧪",
    type: "accessory",
    isOwned: false,
    effects: ["+40 Concentration", "Unlocks passive +10% XP bonus", "Swirling purple energetic concentration juice."]
  },
  {
    id: "homework-scroll",
    name: "Homework Scroll",
    price: 75,
    emoji: "📜",
    type: "accessory",
    isOwned: false,
    effects: ["+60 Academic Focus", "Prevents Procrastination taxes", "Scroll containing ancestral mathematical symbols."]
  },
  {
    id: "real-life-break",
    name: "Real-life Break",
    price: 40,
    emoji: "🎟️",
    type: "accessory",
    isOwned: false,
    effects: ["+30 Spirit Stamina", "15-min guilt-free screen refresh", "Ticket grants cozy break of cloudwatching."]
  },
  {
    id: "moon-crown",
    name: "Moon Crown",
    price: 130,
    emoji: "🌙",
    type: "accessory",
    isOwned: false,
    effects: ["+75 Celestial Focus", "+50 Astral Shield", "Crescent silver crown of moonlight aura"]
  },
  {
    id: "cosmic-bow",
    name: "Cosmic Bow",
    price: 80,
    emoji: "🎀",
    type: "accessory",
    isOwned: false,
    effects: ["+45 Adorability Speed", "+30 Mind Spell", "Big purple silk ribbon for hair"]
  },
  {
    id: "crystal-crown",
    name: "Crystal Crown",
    price: 200,
    emoji: "👑",
    type: "accessory",
    isOwned: false,
    effects: ["+150 Archmage Intellect", "+95 Arcane Shield", "Prismatic crystals of magical starlight"],
    requiredLevel: 4
  },
  {
    id: "astral-wings",
    name: "Astral Wings",
    price: 350,
    emoji: "🔮",
    type: "accessory",
    isOwned: false,
    effects: ["+250 Astral Flight", "+35% Focus Amplification", "Ethereal translucent floating wings of energy"],
    requiredLevel: 5
  },

  // AURAS
  {
    id: "lavender",
    name: "Lavender Glow",
    price: 0,
    emoji: "✨",
    type: "aura",
    isOwned: true,
    effects: ["+10 Chill Aura", "Soft lavender visual light presence"]
  },
  {
    id: "ocean-aura",
    name: "Ocean Aura",
    price: 60,
    emoji: "💙",
    type: "aura",
    isOwned: false,
    effects: ["+40 Water Surge", "+10% Flow State Sync", "Cascading blue aquatic ripples"]
  },
  {
    id: "forest-aura",
    name: "Forest Aura",
    price: 60,
    emoji: "💚",
    type: "aura",
    isOwned: false,
    effects: ["+40 Healing Pulse", "+5% Zen Recovery Rate", "Warm green woodland visual glow"]
  },
  {
    id: "sakura-aura",
    name: "Sakura Aura",
    price: 90,
    emoji: "🌸",
    type: "aura",
    isOwned: false,
    effects: ["+55 Blossom Power", "+15% Active XP Boost", "Soft pink cherry blossoms aura particles"]
  },
  {
    id: "celestial-aura",
    name: "Celestial Aura",
    price: 150,
    emoji: "💫",
    type: "aura",
    isOwned: false,
    effects: ["+100 Stellar Protection", "+25% Cosmic Fortune", "Galaxy sparkles and rotating stars"]
  },
  {
    id: "solar-aura",
    name: "Solar Aura",
    price: 300,
    emoji: "🔥",
    type: "aura",
    isOwned: false,
    effects: ["+200 Sunfire Ward", "Requires Level 5", "Blazing golden solar glare"],
    requiredLevel: 5
  },

  // THEMES
  {
    id: "default",
    name: "Default Celestial",
    price: 0,
    emoji: "🌌",
    type: "theme",
    isOwned: true,
    effects: ["Original Style Theme", "Dusk slate blue backdrop with stars"]
  },
  {
    id: "theme-sakura",
    name: "Sakura Theme",
    price: 50,
    emoji: "🌸",
    type: "theme",
    isOwned: false,
    effects: ["+15 Spring Aura", "+5% Zen Recovery Rate"]
  },
  {
    id: "theme-ocean",
    name: "Ocean Depths",
    price: 90,
    emoji: "🌊",
    type: "theme",
    isOwned: false,
    effects: ["+25 Tidal Power", "+10% Flow State Sync"]
  },
  {
    id: "theme-solar",
    name: "Solar Flare",
    price: 150,
    emoji: "🔥",
    type: "theme",
    isOwned: false,
    effects: ["+45 Solar Spark", "+15% Active XP Boost"]
  },
  {
    id: "theme-void",
    name: "Void Dark",
    price: 300,
    emoji: "🌑",
    type: "theme",
    isOwned: false,
    effects: ["+80 Void Shield", "+25% Threat Deterrence"]
  }
];

// Pre-fill last 12 days as completed (May 16 to May 27) and 3 days before as missed (May 13, 14, 15)
// Let's model May 2026. May 1st was a Friday. May 31st was Sunday.
export const generateCalendarDays = (): CalendarDay[] => {
  const days: CalendarDay[] = [];
  
  // May 2026 dates (1 to 31)
  for (let i = 1; i <= 31; i++) {
    let status: "completed" | "missed" | "empty" | "today" = "empty";
    
    if (i === 28) {
      status = "today";
    } else if (i >= 16 && i <= 27) {
      status = "completed"; // 12-day completed streak
    } else if (i >= 13 && i <= 15) {
      status = "missed"; // 3 missed days prior
    } else if (i > 28) {
      status = "empty"; // Future days are empty
    } else {
      status = "empty"; // Far past days are empty or missed, let's keep empty
    }
    
    days.push({
      dayNum: i,
      status
    });
  }
  
  return days;
};

export const initialFoodItems: FoodItem[] = [
  {
    id: "food-muffin",
    name: "Nebula Muffin",
    price: 15,
    emoji: "🧁",
    description: "Baked with sparkly stardust. Fluffy, warm, and highly energizing.",
    buffType: "attack",
    buffValue: "+20% Attack Power vs Void Bosses"
  },
  {
    id: "food-juice",
    name: "Cosmic Soda",
    price: 25,
    emoji: "🍹",
    description: "Fizzing with celestial bubbles. Purges bad thoughts.",
    buffType: "shield",
    buffValue: "+30% Defense against Void Curses"
  },
  {
    id: "food-ramen",
    name: "Starry Ramen",
    price: 45,
    emoji: "🍜",
    description: "Steam rising with galaxy broth. Restores focus instantly.",
    buffType: "streak",
    buffValue: "Banish Void Wraith instantly once"
  },
  {
    id: "food-elixir",
    name: "Supernova Elixir",
    price: 65,
    emoji: "🧪",
    description: "Distilled solar prominence energy. Unlocks ultimate powers.",
    buffType: "xp",
    buffValue: "+50% bonus XP from Bosses and Tasks"
  }
];

export interface LevelDetail {
  lvl: number;
  name: string;
  region: string;
  multiplier: string;
  perks: string[];
  visualTheme: string;
  trophy: string;
}

export const levelMetadata: LevelDetail[] = [
  {
    lvl: 1,
    name: "The Beginning",
    region: "Novice Forest 🌲",
    multiplier: "1.0x baseline",
    perks: ["Unlock standard shirts", "Base HP protection limits"],
    visualTheme: "Emerald Leaves (Default Green)",
    trophy: "Cosmic Novice Medal 🥈"
  },
  {
    lvl: 2,
    name: "Cosmic Spark",
    region: "Novice Forest 🌲",
    multiplier: "1.2x coins scale",
    perks: ["Unlock basic robes", "+5 HP restoration offset"],
    visualTheme: "Emerald Leaves (Default Green)",
    trophy: "Cosmic Spark Emblem (Claimable)"
  },
  {
    lvl: 3,
    name: "Celestial Prodigy",
    region: "Iron Fortress 🏰",
    multiplier: "1.4x coins scale",
    perks: ["Unlock Mystic Shield 🛡️", "Gain 20% passive boss resistance"],
    visualTheme: "Royal Indigo Shielding",
    trophy: "Iron Focus Sigil 🛡️"
  },
  {
    lvl: 4,
    name: "Nebula Walker",
    region: "Iron Fortress 🏰",
    multiplier: "1.7x coins scale",
    perks: ["Unlock custom space caps", "Halve damage from missed posture scans"],
    visualTheme: "Royal Indigo Shielding",
    trophy: "Nebula Compass (Ascending)"
  },
  {
    lvl: 5,
    name: "Quantum Sovereign",
    region: "Cosmic Citadel 🌌",
    multiplier: "2.0x peak coins modifier",
    perks: ["Unlock Wraith Slayer Crown 👑", "Full customization items menu"],
    visualTheme: "Pulsing Obsidian Void",
    trophy: "Wraith Slayer Crown 👑"
  },
  {
    lvl: 10,
    name: "Solar Monarch",
    region: "Cosmic Citadel 🌌",
    multiplier: "3.0x supreme scale",
    perks: ["Unlock Moon Crown 👑", "Infinite stardust trails visual", "Shield absorbed feedback increased"],
    visualTheme: "Golden Zenith Eclipse",
    trophy: "Celestial Insignia 🔮"
  }
];

