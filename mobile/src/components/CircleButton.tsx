import { Center, useTheme } from "native-base";
import { IconProps } from "phosphor-react-native";
import { TouchableOpacityProps } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { ButtonIcon } from "./ButtonIcon";

interface Props extends TouchableOpacityProps {
  icon: React.FC<IconProps>,
  type?: "PRIMARY" | "SECONDARY";
  color?: IconProps["color"];
}

export function CircleButton({icon, color, type = "PRIMARY", ...rest}: Props) {
  const { colors, sizes } = useTheme();
  const { userPreferences } = useAuth();

  return (
    <Center 
      h={type === "PRIMARY" ? 12 : 8} 
      w={type === "PRIMARY" ? 12 : 8} 
      bgColor={type === "PRIMARY" ? (userPreferences.theme === "DARK" ? "indigo.200" : "indigo.800") : (userPreferences.theme === "DARK" ? "gray.700" : "indigo.100")} 
      rounded={type === "PRIMARY" ? 24 : 16}
      borderWidth={type === "PRIMARY" ? 0 : 1}
      borderColor={"indigo.200"}
    >
      <ButtonIcon 
        icon={icon} 
        color={type === "PRIMARY" ? (userPreferences.theme === "DARK" ? colors.gray[900] : colors.indigo[200]) : (userPreferences.theme === "DARK" ? colors.indigo[200] : colors.gray[500])}
        size={type === "PRIMARY" ? sizes[6] : sizes[4]}
        {...rest} 
      />
    </Center>
  )
}