import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './screens/LogInScreen';
// import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useContext, useEffect, useState } from 'react';
import IconButton from './components/ui/IconButton'
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext)
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
        headerRight: ({ tintColor }) =>
          <IconButton icon="exit"
            color={tintColor}
            size={24}
            onPress={authCtx.logout} />

      }} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>

  );
}
// function Root() {
//   const [isTryingLogIn, setIsTryingLogIn] = useState(true)
//   const authCtx = useContext(AuthContext);
//   useEffect(() => {
//     async function fetchToken() {
//       const storedToken = await AsyncStorage.getItem('token');

//       if (storedToken) {
//         authCtx.authenticate(storedToken);
//       }
//       setIsTryingLogIn(false)
//     }
//     fetchToken();
//   }, []);
//   if (isTryingLogIn){
//     return <AppLoading />
//   }
//   return <Navigation />;

// }

SplashScreen.preventAutoHideAsync();

function Root() {
  const [isTryingLogIn, setIsTryingLogIn] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      // Prevent auto-hiding the splash screen
      await SplashScreen.preventAutoHideAsync();

      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }
      setIsTryingLogIn(false);
      await SplashScreen.hideAsync(); // Hide the splash screen after loading
    }
    fetchToken();
  }, []);

  if (isTryingLogIn) {
    return null; // Return null while loading; splash screen is shown
  }

  return <Navigation />;
}
export default function App() {

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}


