import {Button as NativeBaseButton, Text, IButtonProps} from "native-base";
import { useAuth } from "../hooks/useAuth";

interface Props extends IButtonProps {
  title: string;
}

export function Button({ title, ...rest }: Props) {
  const { userPreferences } = useAuth();

  return (
    <NativeBaseButton 
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      textTransform="uppercase"
      bg={userPreferences.theme === "DARK" ? "indigo.200" : "indigo.800"}
      color={userPreferences.theme === "DARK" ? "gray.900" : "indigo.200"}
      _pressed={{
        bg: userPreferences.theme === "DARK" ? "indigo.300" : "indigo.900"
      }}
      _loading={{
        _spinner: {
          color:"black"
        }
      }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={userPreferences.theme === "DARK" ? "gray.900" : "indigo.200"}
        textTransform="uppercase"
      >
        {title}
      </Text>
    </NativeBaseButton>
  );
}