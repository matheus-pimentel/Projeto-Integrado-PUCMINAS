import { HStack, VStack, Text } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { maskRealNumber } from "../utils/masks";

export interface CategoryProps {
  id: string;
  name: string;
  type?: "CATEGORY" | "SUBCATEGORY";
  groupId: string;
  color: string;
  userId: string;
  user?: {
    email: string;
  },
  sum?: {
    value: number;
  }
}

interface Props extends TouchableOpacityProps {
  data: CategoryProps;
}

export function CategoryCard({data, ...rest}: Props) {
  const { userPreferences } = useAuth();

  return (
    <TouchableOpacity {...rest} >
      <HStack
        w="full"
        h={12}
        bgColor={userPreferences.theme === "DARK" ? "gray.700" : "indigo.100"}
        justifyContent="flex-start"
        alignItems="center"
        rounded="sm"
        borderLeftColor={data.color}
        borderLeftWidth={6}
        mb={3}
        p={2}
      >
        <VStack
          h="full"
          w="full"
          justifyContent="center"
          alignItems="flex-start"
          pl={4}
        >
          <HStack
            flex={1}
            h="full"
            w="full"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize="sm" color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}>{data.name}</Text>
            {
              data.sum?.value ? 
              <Text fontSize="sm" color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}>{`${data.sum.value < 0 ? "-" : ""}R$ ${maskRealNumber(Math.abs(data.sum.value))}`}</Text> : 
              ""
            }
          </HStack>
        </VStack>
      </HStack>
    </TouchableOpacity>
  )
}