import { Text, VStack, HStack } from "native-base"
import { TouchableOpacity } from "react-native";
import { useAuth } from "../hooks/useAuth";

interface Props {
  label?: string;
  offTrackLabel?: string;
  onTrackLabel?: string;
  value: boolean;
  onValueChange: any;
}

export function Switch({label, offTrackLabel, onTrackLabel, value, onValueChange}: Props) {
  const { userPreferences } = useAuth();
  
  function handleChange(v: boolean) {
    onValueChange(v);
  }

  return (
    <VStack w="full" mt={2} alignItems="flex-start" justifyContent="center">
      {label ? <Text color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}>{label}</Text> : ""}
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        p={1}
      >
        <VStack w="1/2" bgColor={!value ? (userPreferences.theme === "DARK" ? "indigo.200" : "indigo.800") : "transparent"} justifyContent="center" alignItems="center" p={2} rounded={4}>
          <TouchableOpacity onPress={() => handleChange(false)}>
            <Text
              w="full"
              justifyContent="center"
              alignItems="center"
              color={!value ? (userPreferences.theme === "DARK" ? "gray.900" : "indigo.200") : (userPreferences.theme === "DARK" ? "indigo.100" : "black")}
              fontFamily={!value ? "heading" : "body"}
            >
              {offTrackLabel}
            </Text>
          </TouchableOpacity>
        </VStack>
        <VStack w="1/2" bgColor={value ? (userPreferences.theme === "DARK" ? "indigo.200" : "indigo.800") : "transparent"} justifyContent="center" alignItems="center" p={2} rounded={4}>
          <TouchableOpacity onPress={() => handleChange(true)}>
            <Text
              w="full"
              justifyContent="center"
              alignItems="center"
              color={value ? (userPreferences.theme === "DARK" ? "gray.900" : "indigo.200") : (userPreferences.theme === "DARK" ? "indigo.100" : "black")}
              fontFamily={value ? "heading" : "body"}
            >
              {onTrackLabel}
            </Text>
          </TouchableOpacity>
        </VStack>
      </HStack>
    </VStack>
  )
}