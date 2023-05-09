
import { Text, Center, Icon } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

import Logo from "../assets/logo.svg";
import LightLogo from "../assets/lightLogo.svg";
import { Button } from "../components/Button";

export function SignIn() {
    const { signIn, isUserLoading, userPreferences } = useAuth();
    return (
        <Center flex={1} bgColor={userPreferences.theme === "DARK" ? "gray.900" : "indigo.200"} p={7}>
            {
                userPreferences.theme === "DARK" ?
                <LightLogo height={90} /> :
                <Logo height={90} />
            }
            <Button 
                title="Entrar com google"
                leftIcon={<Icon as={Fontisto} name="google" color={userPreferences.theme === "DARK" ? "gray.800" : "indigo.200"} size="md" />}
                mt={12}
                onPress={signIn}
                isLoading={isUserLoading}
                _loading={{_spinner: { color: "black" }}}
            />
            <Text color={userPreferences.theme === "DARK" ? "indigo.200" : "black"} textAlign="center" mt={4}>
                Não utilizamos nenhuma informação além {"\n"} do seu e-mail para criação de sua conta. 
            </Text>
        </Center>
    )
}