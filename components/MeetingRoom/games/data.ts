import CompleteSvg from "@/assets/svg/complete.svg";
import CorrectSvg from "@/assets/svg/correct.svg";
import LuckSvg from "@/assets/svg/luck.svg";
import PuzzleSvg from "@/assets/svg/puzzle.svg";
import RaceSvg from "@/assets/svg/race.svg";
import { Game } from "./types";

export const GAMES: Game[] = [
  { id: "complete",  label: "اكمل الجملة",   Icon: CompleteSvg as Game["Icon"], settingsType: "question"  },
  { id: "match",     label: "طابق الكلمات",  Icon: PuzzleSvg   as Game["Icon"], settingsType: "match"     },
  { id: "wheel",     label: "عجلة الحظ",     Icon: LuckSvg     as Game["Icon"], settingsType: "wheel"     },
  { id: "truefalse", label: "صحيح أم خطأ",   Icon: CorrectSvg  as Game["Icon"], settingsType: "truefalse" },
  { id: "race",      label: "سباق الاجابات", Icon: RaceSvg     as Game["Icon"], settingsType: "question"  },
];
