import React from "react";
import { Circle, Ellipse, Line, Path, Rect, Svg } from "react-native-svg";

export const BackIcon = () => (
  <Svg width="18" height="16" viewBox="0 0 18 16" fill="none">
    <Path
      d="M0.527811 15.7406C0.783152 15.7406 1.00485 15.556 1.04753 15.3C1.42806 13.078 3.57969 9.19992 9.03752 8.9733V11.8242C9.03752 11.9211 9.06422 12.0161 9.11468 12.0989C9.16514 12.1816 9.23741 12.2488 9.32357 12.2931C9.40972 12.3375 9.50643 12.3572 9.60307 12.3502C9.69971 12.3432 9.79255 12.3097 9.87139 12.2533L17.7792 6.6049C17.8475 6.5561 17.9032 6.4917 17.9416 6.41707C17.98 6.34243 18 6.2597 18 6.17576C18 6.09182 17.98 6.0091 17.9416 5.93446C17.9032 5.85982 17.8475 5.79542 17.7792 5.74663L9.87136 0.0982123C9.79251 0.0419002 9.69968 0.0083984 9.60304 0.00138398C9.50641 -0.00563045 9.40971 0.0141137 9.32356 0.0584493C9.23741 0.102785 9.16514 0.169998 9.11468 0.252711C9.06422 0.335424 9.03753 0.43044 9.03752 0.52733V3.42122C5.66382 3.75773 1.14441e-05 6.19293 1.14441e-05 15.2133C1.14441e-05 15.4876 0.210421 15.7162 0.483866 15.7388C0.498596 15.74 0.513256 15.7406 0.527811 15.7406Z"
      fill="#D18C2D"
    />
  </Svg>
);

export const EndIcon = ({ color = "white" }: { color?: string }) => (
  <Svg width="14" height="16" viewBox="0 0 14 16" fill="none">
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.69839 12.808V13.5672C6.69839 14.176 6.39497 14.7016 5.86767 15.006C5.61398 15.1525 5.33086 15.2342 5.03728 15.2343C4.74342 15.2345 4.46039 15.1526 4.20652 15.006L0.830719 13.057C0.303375 12.7526 0 12.2271 0 11.6182V1.66144C0 0.745266 0.745266 0 1.66144 0H9.09623C10.0125 0 10.7578 0.745172 10.7578 1.66144V3.76027C10.7578 4.06134 10.5133 4.30584 10.2122 4.30584C9.91106 4.30584 9.6668 4.06139 9.6668 3.76027V1.66144C9.6668 1.34681 9.41081 1.09088 9.09619 1.09088H2.58141L5.86767 2.98852C6.39478 3.29287 6.69839 3.81839 6.69839 4.42706V11.7171H9.09623C9.41081 11.7171 9.66684 11.4612 9.66684 11.1466V9.30675C9.66684 9.00548 9.91092 8.76122 10.2123 8.76122C10.5135 8.76122 10.7578 9.00553 10.7578 9.30675V11.1466C10.7578 12.0629 10.0125 12.8081 9.09628 12.8081H6.69839V12.808ZM11.7532 6.94941L11.1525 7.55016C10.9395 7.76316 10.9395 8.10848 11.1525 8.32153C11.2031 8.37222 11.2632 8.41241 11.3294 8.4398C11.3956 8.46719 11.4665 8.48124 11.5381 8.48114C11.6833 8.48114 11.8213 8.42428 11.924 8.32153L13.4558 6.78952C13.6687 6.57656 13.6687 6.23138 13.4558 6.01842L11.924 4.48669C11.711 4.27364 11.3656 4.27373 11.1525 4.48664C10.9395 4.69945 10.9396 5.04492 11.1525 5.25778L11.7533 5.85839H7.72861C7.4272 5.85839 7.18317 6.10261 7.18317 6.40397C7.18317 6.70533 7.42725 6.94941 7.72861 6.94941H11.7532Z"
      fill="white"
    />
  </Svg>
);

export const ResetIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12C3 7 7 3 12 3C15.3 3 18.2 4.7 20 7.3" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M20 3V8H15" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PlayIcon = ({ paused }: { paused: boolean }) => (
  <Svg width={16} height={18} viewBox="0 0 18 20" fill="none">
    {paused ? (
      <Path d="M4 2L16 10L4 18V2Z" fill="#555" />
    ) : (
      <>
        <Rect x="2" y="2" width="5" height="16" rx="1" fill="#555" />
        <Rect x="11" y="2" width="5" height="16" rx="1" fill="#555" />
      </>
    )}
  </Svg>
);

export const TimerIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="13" r="9" stroke="#8180BD" strokeWidth="1.8" />
    <Path d="M12 8V13L15 16" stroke="#8180BD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 2H15M12 2V4" stroke="#8180BD" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

export const CameraIcon = ({ on }: { on: boolean }) => (
  <Svg width={22} height={18} viewBox="0 0 24 20" fill="none">
    <Path d="M23 4.5L16 9L23 13.5V4.5Z" stroke={on ? "#E89B32" : "#555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="1" y="2" width="15" height="16" rx="3" stroke={on ? "#E89B32" : "#555"} strokeWidth="1.8" />
    {!on && (
      <Line x1="2" y1="2" x2="22" y2="18" stroke="#E84040" strokeWidth="1.8" strokeLinecap="round" />
    )}
  </Svg>
);

export const MicIcon = ({ on }: { on: boolean }) => (
  <Svg width={18} height={22} viewBox="0 0 24 28" fill="none">
    <Rect x="7" y="1" width="10" height="16" rx="5" stroke={on ? "#E89B32" : "#555"} strokeWidth="1.8" />
    <Path d="M3 13C3 18.5 21 18.5 21 13" stroke={on ? "#E89B32" : "#555"} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="12" y1="20" x2="12" y2="26" stroke={on ? "#E89B32" : "#555"} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="8" y1="26" x2="16" y2="26" stroke={on ? "#E89B32" : "#555"} strokeWidth="1.8" strokeLinecap="round" />
    {!on && (
      <Line x1="3" y1="3" x2="21" y2="21" stroke="#E84040" strokeWidth="1.8" strokeLinecap="round" />
    )}
  </Svg>
);

export const BoardIcon = ({ active }: { active: boolean }) => (
  <Svg width={22} height={20} viewBox="0 0 24 22" fill="none">
    <Rect x="2" y="2" width="20" height="14" rx="2" stroke={active ? "#E89B32" : "#555"} strokeWidth="1.8" />
    <Line x1="12" y1="16" x2="12" y2="20" stroke={active ? "#E89B32" : "#555"} strokeWidth="1.8" strokeLinecap="round" />
    <Line x1="8" y1="20" x2="16" y2="20" stroke={active ? "#E89B32" : "#555"} strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M6 10L9 7L12 10L15 7" stroke={active ? "#E89B32" : "#555"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ShareIcon = () => (
  <Svg width={20} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M4 12V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V12" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M12 3L12 15M12 3L8 7M12 3L16 7" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const StudentsIcon = ({ active }: { active: boolean }) => (
  <Svg width={22} height={18} viewBox="0 0 15 11" fill="none">
    <Path
      d="M14.6667 10C14.6667 10.1768 14.5964 10.3464 14.4714 10.4714C14.3464 10.5964 14.1768 10.6667 14 10.6667H6C5.82319 10.6667 5.65362 10.5964 5.5286 10.4714C5.40357 10.3464 5.33333 10.1768 5.33333 10C5.33333 8.93913 5.75476 7.92172 6.50491 7.17157C7.25505 6.42143 8.27247 6 9.33333 6H10.6667C11.7275 6 12.7449 6.42143 13.4951 7.17157C14.2452 7.92172 14.6667 8.93913 14.6667 10ZM10 0C9.47258 0 8.95701 0.156397 8.51848 0.449414C8.07995 0.742431 7.73815 1.15891 7.53632 1.64618C7.33449 2.13345 7.28168 2.66962 7.38457 3.18691C7.48747 3.70419 7.74144 4.17935 8.11438 4.55229C8.48732 4.92523 8.96248 5.1792 9.47976 5.28209C9.99704 5.38499 10.5332 5.33218 11.0205 5.13035C11.5078 4.92851 11.9242 4.58672 12.2173 4.14819C12.5103 3.70966 12.6667 3.19408 12.6667 2.66667C12.6667 1.95942 12.3857 1.28115 11.8856 0.781048C11.3855 0.280951 10.7072 0 10 0ZM4 0C3.47258 0 2.95701 0.156397 2.51848 0.449414C2.07995 0.742431 1.73816 1.15891 1.53632 1.64618C1.33449 2.13345 1.28168 2.66962 1.38457 3.18691C1.48747 3.70419 1.74144 4.17935 2.11438 4.55229C2.48732 4.92523 2.96248 5.1792 3.47976 5.28209C3.99704 5.38499 4.53322 5.33218 5.02049 5.13035C5.50776 4.92851 5.92424 4.58672 6.21725 4.14819C6.51027 3.70966 6.66667 3.19408 6.66667 2.66667C6.66667 1.95942 6.38572 1.28115 5.88562 0.781048C5.38552 0.280951 4.70724 0 4 0ZM4 10C3.99901 9.29974 4.13697 8.60624 4.4059 7.95968C4.67482 7.31312 5.06936 6.72634 5.56667 6.23333C5.15969 6.07968 4.72835 6.00064 4.29333 6H3.70667C2.72414 6.00176 1.78236 6.39285 1.0876 7.0876C0.392851 7.78236 0.00176239 8.72414 0 9.70667V10C0 10.1768 0.0702379 10.3464 0.195262 10.4714C0.320286 10.5964 0.489856 10.6667 0.666667 10.6667H4.12C4.04239 10.4529 4.0018 10.2274 4 10Z"
      fill="#D18C2D"
    />
  </Svg>
);

export const ToolsIcon = ({ active }: { active: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 13 13" fill="none">
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.8815 7.911L10.6465 5.1465L11.3535 5.8535L8.69 8.5175L9 8.75V10.5H7V13H0V9C0 8.46957 0.210714 7.96086 0.585786 7.58579C0.960859 7.21071 1.46957 7 2 7H6C6.4325 7 6.854 7.1405 7.2 7.4L7.8815 7.911ZM3.5 2C4.604 2 5.5 2.896 5.5 4C5.5 5.104 4.604 6 3.5 6C2.396 6 1.5 5.104 1.5 4C1.5 2.896 2.396 2 3.5 2ZM3.5 1V0H13V9.5H11V8.5H12V1H3.5ZM10.5 2.5V3.5H7V2.5H10.5ZM9 4.5V5.5H7V4.5H9Z"
      fill="#D18C2D"
    />
  </Svg>
);

export const ChatIcon = ({ active }: { active: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
    <Path
      d="M6.59359 4.84375C2.97506 4.84375 3.07272e-07 7.33209 3.07272e-07 10.3908C3.07272e-07 11.6135 0.47425 12.8561 1.34397 13.8192L0.115813 15.2226C0.0565189 15.2904 0.0180278 15.3738 0.00495747 15.4628C-0.00811291 15.5519 0.00479244 15.6429 0.0421253 15.7248C0.0792691 15.8068 0.139265 15.8764 0.214929 15.9252C0.290593 15.974 0.378717 15.9999 0.46875 15.9999H7.06234C9.73406 15.9999 13.1872 13.6993 13.1872 10.3908C13.1872 7.33209 10.2121 4.84375 6.59359 4.84375ZM3.74991 11.25C3.23309 11.25 2.81244 10.8293 2.81244 10.3125C2.81244 9.79572 3.23313 9.37506 3.74991 9.37506C4.26669 9.37506 4.68738 9.79575 4.68738 10.3125C4.68741 10.8293 4.26672 11.25 3.74991 11.25ZM6.59359 11.25C6.07678 11.25 5.65613 10.8293 5.65613 10.3125C5.65613 9.79572 6.07681 9.37506 6.59359 9.37506C7.11038 9.37506 7.53106 9.79575 7.53106 10.3125C7.53106 10.8293 7.11041 11.25 6.59359 11.25ZM9.43728 11.25C8.92047 11.25 8.49981 10.8293 8.49981 10.3125C8.49981 9.79572 8.9205 9.37506 9.43728 9.37506C9.95406 9.37506 10.3748 9.79575 10.3748 10.3125C10.3748 10.8293 9.95409 11.25 9.43728 11.25Z"
      fill="#D18C2D"
    />
    <Path
      d="M15.8866 9.53819L14.7829 8.25053C15.5707 7.36159 15.9997 6.27759 15.9997 5.15613C15.9996 2.31303 13.2659 0 9.90603 0C6.86775 0 4.28647 1.89341 3.83069 4.35781C4.67844 4.06975 5.62916 3.906 6.59363 3.906C10.6984 3.906 14.0708 6.77303 14.1201 10.3122H15.5309C15.9313 10.3123 16.1463 9.84078 15.8866 9.53819Z"
      fill="#D18C2D"
    />
  </Svg>
);

export const GameIcon = ({ active }: { active: boolean }) => (
  <Svg width={22} height={16} viewBox="0 0 26 18" fill="none">
    <Path
      d="M6 9H10M8 7V11M16 9H18M15 8H17M3 5H23C24.1 5 25 5.9 25 7V13C25 15.2 23.2 17 21 17H5C2.8 17 1 15.2 1 13V7C1 5.9 1.9 5 3 5Z"
      stroke={active ? "#fff" : "#E89B32"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DotsIcon = ({ active }: { active: boolean }) => (
  <Svg width={20} height={6} viewBox="0 0 24 6" fill="none">
    <Circle cx="3" cy="3" r="3" fill={active ? "#fff" : "#E89B32"} />
    <Circle cx="12" cy="3" r="3" fill={active ? "#fff" : "#E89B32"} />
    <Circle cx="21" cy="3" r="3" fill={active ? "#fff" : "#E89B32"} />
  </Svg>
);

// Whiteboard icons
export const PenIcon = () => (
  <Svg width={16} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 20H21M16.5 3.5L19.5 6.5L7 19H4V16L16.5 3.5Z" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const EraserIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M20 20H7L3 16L13 6L21 14L17 18" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TextIcon = () => (
  <Svg width={16} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20M12 6V20M9 20H15" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SquareIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="2" stroke="#555" strokeWidth="1.6" />
  </Svg>
);

export const ArrowIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const EllipseIcon = () => (
  <Svg width={18} height={14} viewBox="0 0 24 18" fill="none">
    <Ellipse cx="12" cy="9" rx="10" ry="7" stroke="#555" strokeWidth="1.6" />
  </Svg>
);

export const UndoIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12C3 7 7 3 12 3C15.3 3 18.2 4.7 20 7.3" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M3 3V8H8" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const RedoIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12C21 7 17 3 12 3C8.7 3 5.8 4.7 4 7.3" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M21 3V8H16" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TrashIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H21M8 6V4H16V6M19 6L18 20H6L5 6" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
