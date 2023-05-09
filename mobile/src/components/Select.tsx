import { Select as NativeBaseSelect, ISelectProps, VStack, Text } from "native-base";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "./Loading";

interface DataProps {
  id: string;
  label: string;
}

interface Props extends ISelectProps {
  data: DataProps[];
  label? : string;
}

export function Select({data, label, ...rest}: Props) {
  const { userPreferences } = useAuth();

  return (
    <VStack w="full" mt={2}>
      {label ? <Text  color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}>{label}</Text> : ""}
      {
        data.length === 0 ? 
        <Loading p={4}/> :
        <NativeBaseSelect
          w="full" 
          borderColor="gray.500" 
          size="md" 
          placeholderTextColor="gray.500"
          isDisabled={data.length === 0 ? true : false}
          color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}
          {...rest}
        >
          {data.map(e => (
            <NativeBaseSelect.Item label={e.label} value={e.id} key={e.id} />
          ))}
        </NativeBaseSelect>
      }
    </VStack>
  )
}