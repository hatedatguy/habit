/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  difficulty: Difficulty;
  rewardXp: number;
  rewardCoins: number;
  buttonLabel: string;
  progress: number; // 0 to 100
  isCompleted: boolean;
  isMissed?: boolean;
  buttonColorClass: string;
  completedButtonLabel: string;
  isAiPowered?: boolean;
  aiScanMessage?: string;
}

export interface Enemy {
  id: string;
  name: string;
  status: "ACTIVE" | "DORMANT";
  badgeText: string;
  description: string;
  avatarEmoji: string;
  punishments: string[];
  defeatCondition: string;
  activePulse: boolean;
}

export type ShopItemType = "top" | "bottom" | "accessory" | "aura" | "theme";

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  type: ShopItemType;
  isOwned: boolean;
  effects?: string[];
  requiredLevel?: number;
}

export interface CalendarDay {
  dayNum: number;
  status: "completed" | "missed" | "empty" | "today";
}

export interface ToastMessage {
  id: string;
  message: string;
  xpReward?: number;
  coinsReward?: number;
  type?: "reward" | "purchase" | "error" | "info";
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
  buffType: "attack" | "shield" | "xp" | "streak";
  buffValue: string;
}
