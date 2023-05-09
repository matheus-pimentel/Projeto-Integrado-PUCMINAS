import { Text, Input as NativeBaseInput, VStack, IInputProps } from "native-base";
import { useAuth } from "../hooks/useAuth";
import { maskDate, maskValue } from "../utils/masks";

interface Props extends IInputProps {
  label?: string;
  typeInput?: "VALUE" | "TEXT" | "DATE";
  setValue?: any;
}

export function Input({label, typeInput = "TEXT", setValue, ...rest}: Props) {
  const { userPreferences } = useAuth();

  function handleValue(text: string) {
    if(!text) {
      setValue(null);
      return;
    }
    if(typeInput === "VALUE") {
      const value = maskValue(text);
      setValue(value);
    }

    if(typeInput === "DATE") {
      const value = maskDate(text);
      setValue(value);
    }

    if(typeInput === "TEXT") {
      setValue(text);
    }
  }
  
  return (
    <VStack w="full" mt={2}>
      { label ? <Text color={userPreferences.theme === "DARK" ? "indigo.100" : "black"} >{label}</Text> : "" }
      <NativeBaseInput 
        w="full"
        borderColor="gray.500" 
        size="md" 
        placeholderTextColor="gray.500"
        keyboardType={typeInput === "VALUE" || typeInput === "DATE" ? "numeric" : "default"}
        onChangeText={handleValue}
        maxLength={typeInput === "DATE" ? 10 : 100}
        color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}
        {...rest}
      />
    </VStack>
  )
}