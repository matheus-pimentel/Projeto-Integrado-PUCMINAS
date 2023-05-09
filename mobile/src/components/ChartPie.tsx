import { useState, useEffect } from "react";
import { VStack, Text } from "native-base";
import {
  VictoryPie,
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryTooltip,
} from "victory-native";
import { Loading } from "./Loading";

export interface DataChartPieProps {
  name: string;
  value: number;
  color: string;
  month: string;
}

interface Props {
  data: DataChartPieProps[];
  accountSelected: string;
  isLoading?: boolean;
}

export function ChartPie({ data, isLoading, accountSelected }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(data.filter(e => e.name === accountSelected || !accountSelected).reduce((acc, cur) => acc + cur.value, 0).toFixed(0));
  }, [data, accountSelected]);

  return (
    <VStack
      justifyContent="space-between"
      alignItems="center"
    >
      { isLoading ? (
        <Loading />
      ) : (
        <VStack
          h="2/6"
          alignItems="center"
        >
          <VictoryPie
            data={data}
            height={400}
            x="name"
            y="value"
            startAngle={90}
            endAngle={-90}
            innerRadius={140}
            animate={{
              easing: "bounce",
            }}
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
            colorScale={data.map((e) => e.color)}
            style={{
              labels: {
                fill: "white",
              },
              data: {
                fillOpacity: ({ datum }) =>
                  datum.name === accountSelected ? 1 : (!accountSelected ? 0.5 : 0.2),
                stroke: ({ datum }) =>
                  datum.name === accountSelected ? datum.color : "none",
                strokeOpacity: 0.5,
                strokeWidth: 10,
              },
            }}
          />
        </VStack>
      )}
      {
        isLoading ? 
        "" : 
        <Text
          fontFamily="heading"
          fontSize="xl"
        >
          R$ {value}
        </Text>
      }
    </VStack>
  );
}
