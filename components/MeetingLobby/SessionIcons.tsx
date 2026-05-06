import React, { memo } from "react";
import { Circle, Path, Rect, Svg } from "react-native-svg";

export const CalendarIcon = memo(function CalendarIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#888" strokeWidth="1.8" />
      <Path
        d="M16 2V6M8 2V6M3 10H21"
        stroke="#888"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
});

export const LobbyClockIcon = memo(function LobbyClockIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#888" strokeWidth="1.8" />
      <Path
        d="M12 7V12L15 15"
        stroke="#888"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const LobbyStudentsIcon = memo(function LobbyStudentsIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="7" r="4" stroke="#888" strokeWidth="1.8" />
      <Path
        d="M2 20C2 16.7 5.1 14 9 14"
        stroke="#888"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Circle cx="17" cy="8" r="3" stroke="#888" strokeWidth="1.8" />
      <Path
        d="M22 20C22 17.2 19.8 15 17 15"
        stroke="#888"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
});
