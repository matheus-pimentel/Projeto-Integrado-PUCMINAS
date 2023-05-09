import { VStack, Text } from "native-base";
import { useAuth } from "../hooks/useAuth";

export function EmptyExtract() {
  const { userPreferences } = useAuth();

  return (
    <VStack>
      <Text color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}>
        No momento você não tem nenhum extrato lançado. Cadastre seu primeiro extrato no botão +.
      </Text>
    </VStack>
  )
}