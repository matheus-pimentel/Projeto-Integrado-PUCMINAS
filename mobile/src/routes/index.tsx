import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./app.routes";
import { useAuth } from "../hooks/useAuth";
import { SignIn } from "../screens/SignIn";

export function Routes() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {(user.name ? <AppRoutes /> : <SignIn />)}
    </NavigationContainer>
  );
}
