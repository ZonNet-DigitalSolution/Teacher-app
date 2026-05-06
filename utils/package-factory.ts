import MathIcon from "@/assets/packages/math.svg";
import ArabicIcon from "@/assets/packages/arabic.svg";
import EnglishIcon from "@/assets/packages/english.svg";
import ScienceIcon from "@/assets/packages/science.svg";
import QuranIcon from "@/assets/packages/quran.svg";
import ToothIcon from "@/assets/packages/tooth.svg";
import GameIcon from "@/assets/packages/game.svg";
import TalentIcon from "@/assets/packages/talent.svg";
import SkratchIcon from "@/assets/packages/skratch.svg";
import SpecialIcon from "@/assets/packages/special.svg";
import ReadingIcon from "@/assets/packages/reading.svg";
import { SvgProps } from "react-native-svg";
import React from "react";

type PackageStyle = {
  image: React.FC<SvgProps>;
  bgColor: string;
};

const PACKAGE_MAP: { keywords: string[]; style: PackageStyle }[] = [
  {
    keywords: ["قرآن", "quran", "تلاوة", "حفظ", "تجويد", "ركن المسلم"],
    style: { bgColor: "#2E7D32", image: QuranIcon },
  },
  {
    keywords: ["أسنان", "tooth", "صحة", "طبي", "الصحة العامة"],
    style: { bgColor: "#0077B6", image: ToothIcon },
  },
  {
    keywords: ["إنجليزي", "english", "انجليزي", "لغة إنجليزية"],
    style: { bgColor: "#BCA7F5", image: EnglishIcon },
  },
  {
    keywords: ["رياضيات", "math", "حساب", "جبر", "هندسة", "الرياضيات"],
    style: { bgColor: "#DFBE37", image: MathIcon },
  },
  {
    keywords: ["موهبة", "talent", "إبداع", "فن", "رسم"],
    style: { bgColor: "#F5EAD7", image: TalentIcon },
  },
  {
    keywords: ["لعبة", "game", "ألعاب", "ترفيه", "الروضة"],
    style: { bgColor: "#D8D8EB", image: GameIcon },
  },
  {
    keywords: ["سكراتش", "scratch", "برمجة", "كمبيوتر"],
    style: { bgColor: "#D47C7C", image: SkratchIcon },
  },
  {
    keywords: ["خاص", "special", "مميز", "متقدم"],
    style: { bgColor: "#CD6036", image: SpecialIcon },
  },
  {
    keywords: ["علوم", "science", "فيزياء", "كيمياء", "أحياء"],
    style: { bgColor: "#F99E54", image: ScienceIcon },
  },
  {
    keywords: ["عربي", "عربية", "arabic", "لغة عربية", "نحو", "لغتي"],
    style: { bgColor: "#C51162", image: ArabicIcon },
  },
];

const DEFAULT_STYLE: PackageStyle = { bgColor: "#144b6b", image: ReadingIcon };

export function getPackageStyle(subject: string): PackageStyle {
  if (!subject) return DEFAULT_STYLE;
  const lower = subject.toLowerCase();
  for (const entry of PACKAGE_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return entry.style;
    }
  }
  return DEFAULT_STYLE;
}
