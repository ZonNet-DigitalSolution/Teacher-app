import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_BASE_HEIGHT = 68;

export function useTabBarHeight(): number {
  const { bottom } = useSafeAreaInsets();
  return TAB_BAR_BASE_HEIGHT + bottom;
}
