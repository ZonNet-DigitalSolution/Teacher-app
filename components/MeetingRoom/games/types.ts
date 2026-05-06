import { ComponentType } from "react";

export type GameId = "complete" | "match" | "wheel" | "truefalse" | "race";
export type MainTab = "games" | "quick";
export type SubTab = "ai" | "preset";
export type SettingsType = "question" | "match" | "wheel" | "truefalse";

export type Game = {
  id: GameId;
  label: string;
  Icon: ComponentType<{ width?: number; height?: number }>;
  settingsType: SettingsType;
};

export type Option = { id: number; label: string; letter: string };

export const ARABIC_LETTERS = ["أ", "ب", "ج", "د"];
