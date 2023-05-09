import { TouchableOpacity, TouchableOpacityProps, Alert } from "react-native";
import { HStack, VStack, Text, Image } from "native-base";
import { maskRealNumber } from "../utils/masks";
import { Trash } from 'phosphor-react-native';
import { CircleButton } from "./CircleButton";

import moment from "moment";
import { useAuth } from "../hooks/useAuth";

export interface ExtractProps {
  id: string;
  value: number;
  date: string;
  accountId: string;
  userId: string;
  categoryId: string;
  subcategoryId: string;
  account: {
    name: string;
    institutionId: string;
    institution: {
      image: string;
    };
  };
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
}

interface Props extends TouchableOpacityProps {
  data: ExtractProps;
  selectedExtract?: string; 
  setSelectedExtract?: any;
  deleteExtract? : any;
}

export function ExtractCard({ data, selectedExtract, setSelectedExtract, deleteExtract, ...rest }: Props) {
  const { userPreferences } = useAuth();

  async function deleteExtractConfirm() {
    Alert.alert(
      "Excluir extrato",
      "Tem certeza que deseja excluir este extrato?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            if(deleteExtract) {
              deleteExtract(data.id);
            }
          }
        }
      ]
    );
  }

  return (
    <TouchableOpacity {...rest} onPress={() => setSelectedExtract(selectedExtract === data.id ? null : data.id)}>
      <VStack
        w="full"
        h={selectedExtract === data.id ? 26 : 20}
        bgColor={userPreferences.theme === "DARK" ? "gray.700" : "indigo.100"}
        justifyContent="flex-start"
        alignItems="center"
        rounded="sm"
        mb={3}
        p={4}
      >
        <HStack
          w="full"
          h={12}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Image
            source={{
              uri: data.account.institution.image,
            }}
            alt={`${data.id}_image_account`}
            size={12}
          />
          <VStack pl={4} w="2/5" h="full" justifyContent="space-between">
            <Text fontSize="sm" color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}>{data.category?.name}</Text>
          </VStack>
          <VStack
            w="3/6"
            h="full"
            justifyContent="space-between"
            alignItems="flex-end"
            pr={6}
          >
            <Text color={userPreferences.theme === "DARK" ? "indigo.100" : "black"}>{moment.utc(data.date).format("DD/MM/YYYY")}</Text>
            <Text color={data.value < 0 ? "red.500" : "green.500"}>
              {(data.value < 0 ? "-" : "+")}R$ {maskRealNumber(Math.abs(data.value))}
            </Text>
          </VStack>
        </HStack>
        {
          selectedExtract === data.id ? 
          <HStack justifyContent="flex-end" w="full" mt={2}>
            <CircleButton icon={Trash} type="SECONDARY" onPress={deleteExtractConfirm}/>
          </HStack> : ""
        }
      </VStack>
      
    </TouchableOpacity>
  );
}
