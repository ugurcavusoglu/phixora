import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootStackParamList } from './src/navigation/types';
import { colors } from './src/theme/colors';
import { useAuthStore } from './src/store/authStore';
import { useImageStore } from './src/store/imageStore';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DemoScreen from './src/screens/DemoScreen';
import UploadScreen from './src/screens/UploadScreen';
import ToolsScreen from './src/screens/ToolsScreen';
import ProcessScreen from './src/screens/ProcessScreen';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import PricingScreen from './src/screens/PricingScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ContactScreen from './src/screens/ContactScreen';
import FeaturesScreen from './src/screens/FeaturesScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import NotFoundScreen from './src/screens/NotFoundScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg },
};

export default function App() {
  const { token, ready, loadToken } = useAuthStore();
  const isDemo = useImageStore((s) => s.isDemo);

  useEffect(() => {
    loadToken();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.violetHi} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          {token ? (
            <>
              <Stack.Screen name="Upload" component={UploadScreen} />
              <Stack.Screen name="Tools" component={ToolsScreen} />
              <Stack.Screen name="Process" component={ProcessScreen} />
              <Stack.Screen name="Result" component={ResultScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="Pricing" component={PricingScreen} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Contact" component={ContactScreen} />
              <Stack.Screen name="Features" component={FeaturesScreen} />
              <Stack.Screen name="Tutorial" component={TutorialScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          ) : isDemo ? (
            <>
              <Stack.Screen name="Tools" component={ToolsScreen} />
              <Stack.Screen name="Process" component={ProcessScreen} />
              <Stack.Screen name="Result" component={ResultScreen} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Demo" component={DemoScreen} />
              <Stack.Screen name="Pricing" component={PricingScreen} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Contact" component={ContactScreen} />
              <Stack.Screen name="Features" component={FeaturesScreen} />
              <Stack.Screen name="Tutorial" component={TutorialScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Demo" component={DemoScreen} />
              <Stack.Screen name="Pricing" component={PricingScreen} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Contact" component={ContactScreen} />
              <Stack.Screen name="Features" component={FeaturesScreen} />
              <Stack.Screen name="Tutorial" component={TutorialScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
