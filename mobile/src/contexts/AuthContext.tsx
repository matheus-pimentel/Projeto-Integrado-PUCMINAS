import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { api } from "../services/api";
import Constants from 'expo-constants';

const EXPO_REDIRECT_PARAMS = { useProxy: true };
const NATIVE_REDIRECT_PARAMS = { native: "com.matheus.pimentel.mobile://" };
const REDIRECT_PARAMS = Constants.appOwnership === 'expo' ? EXPO_REDIRECT_PARAMS : NATIVE_REDIRECT_PARAMS;

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  email: string;
  imageUrl: string;
}

interface UserPreferencesProps {
  theme: "DARK" | "LIGHT";
  userId: String;
  id: String;
}

export interface AuthContextDataProps {
  user: UserProps;
  userPreferences: UserPreferencesProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setConfig: (value: UserPreferencesProps) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps);
 
export function AuthContextProvider({ children }: AuthProviderProps) {
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [userPreferences, setUserPreferences] = useState<UserPreferencesProps>({
    theme: "LIGHT"
  } as UserPreferencesProps);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '50299761387-8dn4qsrm4e22uea459r8h6kmo1epnuuu.apps.googleusercontent.com',
    androidClientId: '50299761387-8mgbeeqqfgtrqd57pph7r2ntifsg2aqa.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri(REDIRECT_PARAMS),
    scopes: ["profile", "email"]
  });
  
  async function setConfig(value: UserPreferencesProps) {
    setUserPreferences(value);
  }

  async function signIn() {
    try {
      setIsUserLoading(true);

      // await otherSignIn();
      await promptAsync();
    } catch(err) {
      console.log(err);

      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signOut() {
    setUser({} as UserProps);
    setUserPreferences({} as UserPreferencesProps);
  }

  async function otherSignIn() {
    api.defaults.headers.common["Authorization"] = `Bearer {}`;
      
    const userInfoResponse = await api.get("/me");
    setUser(userInfoResponse.data.user);
    setUserPreferences(userInfoResponse.data.userPreferences || {});
  }

  async function signInWithGoogle(accessToken: string) {
    try {
      setIsUserLoading(true);
      
      const tokenResponse = await api.post("/auth/users", { accessToken });

      console.log(tokenResponse.data.token);

      api.defaults.headers.common["Authorization"] = `Bearer ${tokenResponse.data.token}`;
      
      const userInfoResponse = await api.get("/me");
      setUser(userInfoResponse.data.user);
      setUserPreferences(userInfoResponse.data.userPreferences || {});
    } catch(err) {
        console.log(err);

        throw err;
    } finally {
        setIsUserLoading(false);
    }
  }

  useEffect(() => {
    if(response?.type === "success" && response?.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isUserLoading: isUserLoading,
        user: user,
        userPreferences,
        setConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
