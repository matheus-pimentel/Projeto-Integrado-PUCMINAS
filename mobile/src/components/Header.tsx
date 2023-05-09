import { Text, HStack, Box, Image, Menu, Pressable } from 'native-base';
import { CaretLeft } from 'phosphor-react-native';
import { useNavigation } from "@react-navigation/native";

import { ButtonIcon } from './ButtonIcon';
import { useAuth } from '../hooks/useAuth';

import Logo from "../assets/logo.svg";
import LightLogo from "../assets/lightLogo.svg";

interface Props {
  title: string;
  backButtonNavigate?: keyof ReactNavigation.RootParamList;
}

export function Header({ title, backButtonNavigate }: Props) {
  const { navigate } = useNavigation();
  const { user, userPreferences, signOut } = useAuth();

  async function handleLogout() {
    signOut();
  }

  return (
    <HStack w="full" h={24} bgColor={userPreferences.theme === "DARK" ? "gray.700" : "indigo.800"} alignItems="flex-end" pb={2} px={5}>
      <HStack w="full" alignItems="center" justifyContent="space-between">
      {
        backButtonNavigate
          ? <ButtonIcon icon={CaretLeft} onPress={() => navigate(backButtonNavigate)} />
          : (userPreferences.theme === "DARK" ? 
            <LightLogo width={28} height={28} /> : 
            <Logo width={28} height={28} />)
      }

        <Text color="indigo.200" fontFamily="medium" fontSize="lg" textAlign="center">
          {title}
        </Text>
        
        <Menu
          mt={12}
          placement="bottom right"
          trigger={triggerProps => {
            return (
              <Pressable {...triggerProps}>
                <Image 
                  source={{
                    uri: user.imageUrl
                  }} 
                  alt="UserImage" 
                  size={12} 
                  borderRadius={24}
                />
              </Pressable>
            )
          }}
        >
          <Menu.Item onPress={handleLogout}>Sair</Menu.Item>
        </Menu>
      </HStack>
    </HStack>
  );
}