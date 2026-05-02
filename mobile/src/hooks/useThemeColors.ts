import { useNavStore } from '../store/navigationStore';
import { COLORS, DARK_COLORS } from '../utils/constants';

export function useThemeColors() {
  const theme = useNavStore((state) => state.theme);
  return theme === 'dark' ? DARK_COLORS : COLORS;
}
