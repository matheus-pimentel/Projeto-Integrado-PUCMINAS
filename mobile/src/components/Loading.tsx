import { Center, Spinner, ICenterProps } from "native-base";
import { useAuth } from "../hooks/useAuth";

interface Props extends ICenterProps{}

export function Loading({...rest}: Props) {
  const { userPreferences } = useAuth();

  return (
    <Center flex={1} bgColor={userPreferences.theme === "DARK" ? "gray.800" : "indigo.200"} {...rest}>
      <Spinner color={userPreferences.theme === "DARK" ? "indigo.200" : "indigo.900"} />
    </Center>
  );
}
