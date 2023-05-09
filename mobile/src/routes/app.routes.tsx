import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "native-base";
import { ChartPie, ArrowsDownUp, CrosshairSimple, Bank } from "phosphor-react-native";
import { useAuth } from "../hooks/useAuth";

import { Extract } from "../screens/Extract";
import { General } from "../screens/General";
import { LaunchExtract } from "../screens/LaunchExtract";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors, sizes } = useTheme();
  const { userPreferences } = useAuth();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.indigo[200],
        tabBarInactiveTintColor: userPreferences.theme === "DARK" ? colors.gray[500] : colors.indigo[500],
        tabBarStyle: {
          position: "relative",
          height: sizes[22],
          borderTopWidth: 0,
          backgroundColor: userPreferences.theme === "DARK" ? colors.gray[700] : colors.indigo[800],
          paddingBottom: sizes[4]
        }
      }}
    >
      <Screen
        name={"general"}
        component={General}
        options={{ 
          tabBarIcon: ({ color }) => <ChartPie size={sizes[8]} color={color} />,
          tabBarLabel: "Geral"
        }}
      />
      <Screen
        name={"extract"}
        component={Extract}
        options={{ 
          tabBarIcon: ({ color }) => <ArrowsDownUp size={sizes[8]} color={color} />,
          tabBarLabel: "Extrato"
        }}
      />
      <Screen
        name={"launchExtract"}
        component={LaunchExtract}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
