import { VStack, Text } from "native-base";
import { useAuth } from "../hooks/useAuth";

export function EmptyDashboard() {
  const { userPreferences } = useAuth();

  return (
    <VStack mt={4}>
      <Text color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}>
        No momento você não tem nenhum extrato lançado.{"\n\n"}Cadastre seu primeiro extrato na aba de 'Extrato'!{"\n\n"}Não se esqueça de cria uma conta antes de cadastrar os extratos!
      </Text>
    </VStack>
  )
}