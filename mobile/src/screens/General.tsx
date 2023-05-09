import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { VStack, Text, HStack, FlatList } from "native-base";
import { Header } from "../components/Header";

import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { maskRealNumber } from "../utils/masks";
import { CategoryCard, CategoryProps } from "../components/CategoryCard";
import { VictoryPie, VictoryTooltip } from "victory-native";
import { EmptyDashboard } from "../components/EmptyDashboard";
import { useAuth } from "../hooks/useAuth";

interface DataProps {
  patrimonyValue: number;
  sumByCategory: CategoryProps[];
}

export function General() {  
  const [data, setData] = useState<DataProps>(null);
  const [dataChart, setDataChart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userPreferences } = useAuth();

  async function fetchData() {
    try {
      setIsLoading(true);

      const response = await api.get("/movements/agg");

      setData(response.data);
      setDataChart(response.data.sumByCategory.filter(e => e.sum?.value < 0).map(e => ({
        name: e.name,
        sum: e.sum?.value ? -e.sum.value : 0,
        color: e.color
      })));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <VStack flex={1} bgColor={userPreferences.theme === "DARK" ? "gray.800" : "indigo.200"}>
      <Header title="Geral" key={"general"} />
      <VStack flex={1} p={7} alignItems="center" justifyContent="flex-start">
        {
          isLoading ? 
          <Loading /> : 
          <VStack
            w="full"
            h={16}
            bgColor={userPreferences.theme === "DARK" ? "gray.700" : "indigo.800"}
            rounded="xl"
            justifyContent="center"
            alignItems="center"
          >
            <Text
              color="indigo.100"
              fontSize="xs"
              >
              Seu patrimônio é de:
            </Text>
            <Text
              color="indigo.100"
              fontFamily="heading"
              fontSize="xl"
            >
              R$ {maskRealNumber(data.patrimonyValue)}
            </Text>
          </VStack>
        }
        {
          !isLoading && (data.sumByCategory || []).length > 0 ?
          <VStack
            w="full"
            mt={4}
            alignItems="center"
            justifyContent="flex-start"
          >
            <HStack
              w="full"
              h={12}
              justifyContent="space-between"
            >
              <VStack
                w="48%"
                h="full"
                alignItems="center"
                justifyContent="center"
                bgColor="green.400"
                rounded="xl"
                p={2}
              >
                <Text color="white" fontFamily="heading" fontSize="lg">R$ {maskRealNumber(data.sumByCategory.reduce((acc, cur) => acc + (cur?.sum?.value > 0 ? cur.sum.value : 0), 0))}</Text>
                <Text color="white" fontSize="xs">Ganhos (últimos 30 dias)</Text>
              </VStack>
              <VStack
                w="48%"
                h="full"
                alignItems="center"
                justifyContent="center"
                bgColor="grayRed.400"
                rounded="xl"
                p={2}
              >
                <Text color="white" fontFamily="heading" fontSize="lg">-R$ {maskRealNumber(data.sumByCategory.reduce((acc, cur) => acc - (cur?.sum?.value < 0 ? cur.sum.value : 0), 0))}</Text>
                <Text color="white" fontSize="xs">Gastos (últimos 30 dias)</Text>
              </VStack>
            </HStack>
            <VictoryPie 
              height={280}
              data={dataChart}
              x="name"
              y="sum"
              colorScale={dataChart.map((e) => e.color)}
              innerRadius={70}
              padAngle={2}
              labelComponent={
                <VictoryTooltip
                  renderInPortal={false}
                  flyoutStyle={{
                    stroke: 0,
                    fill: ({ datum }) => datum.color,
                    padding: 4,
                  }}
                />
              }
              style={{
                labels: {
                  fill: "white",
                }
              }}
            />
            <FlatList 
              data={data.sumByCategory.filter(e => e.sum?.value < 0)}
              keyExtractor={item => item.id}
              renderItem={({item}) => <CategoryCard data={item} />}
              h={200}
              _contentContainerStyle={{
                pb: 10
              }}
              w="full"
            />
          </VStack>
          : (isLoading ? "" : <EmptyDashboard />)
        }
      </VStack>
    </VStack>
  );
}