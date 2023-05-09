import { useCallback, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { VStack, FlatList, Icon } from "native-base";
import { ExtractCard, ExtractProps } from "../components/ExtractCard";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { Loading } from "../components/Loading";

import { EmptyExtract } from "../components/EmptyExtract";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";

import { Fontisto } from "@expo/vector-icons";

export function Extract() {
  const [selectedExtract, setSelectedExtract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [extracts, setExtracts] = useState<ExtractProps[]>([]);

  const { navigate } = useNavigation();
  const { userPreferences } = useAuth();

  async function fetchExtracts() {
    try {
      setIsLoading(true);

      const response = await api.get("/movements/");

      setExtracts(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteExtract(id: string) {
    await api.delete(`/movements/${id}`);
    fetchExtracts();
  }

  useFocusEffect(
    useCallback(() => {
      fetchExtracts();
    }, [])
  )

  return (
    <VStack flex={1} bgColor={userPreferences.theme === "DARK" ? "gray.800" : "indigo.200"}>
      <Header title="Extrato" key={"extract"} />
      <VStack p={7} flex={1} alignItems="center" justifyContent="center">
        {(
          isLoading ? 
          <Loading/> : 
          <FlatList
            data={extracts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExtractCard 
                data={item} 
                selectedExtract={selectedExtract} 
                setSelectedExtract={setSelectedExtract} 
                deleteExtract={deleteExtract} 
              />
            )}
            _contentContainerStyle={{
                pb: 10
            }}
            h="3/4"
            w="full"
            ListEmptyComponent={() => <EmptyExtract />}
          />
        )}
        <Button 
          title="Lançar extrato"
          leftIcon={<Icon as={Fontisto} name="plus-a" color={userPreferences.theme === "DARK" ? "gray.900" : "indigo.200"} size="md" />}
          onPress={() => navigate("launchExtract")}
        />
      </VStack>
    </VStack>
  );
}
