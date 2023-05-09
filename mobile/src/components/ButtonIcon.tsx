import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { IconProps } from "phosphor-react-native";
import { useTheme } from "native-base";

interface Props extends TouchableOpacityProps {
  icon: React.FC<IconProps>;
  color?: IconProps["color"];
  size?: IconProps["size"];
}

export function ButtonIcon({ icon: Icon, color, size, ...rest }: Props) {
  const { colors, sizes } = useTheme();

  return (
    <TouchableOpacity {...rest}>
      <Icon color={color || colors.indigo[200]} size={size || sizes[6]} />
    </TouchableOpacity>
  );
}