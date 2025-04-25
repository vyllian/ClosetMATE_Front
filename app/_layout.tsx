import { SplashScreen, Stack } from "expo-router";
import {useFonts} from 'expo-font';
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../globals.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Philosopher-Regular": require('../assets/fonts/philosopher-v20-cyrillic_latin-regular.ttf'),
    "Philosopher-Bold": require('../assets/fonts/philosopher-v20-cyrillic_latin-700.ttf'),
    "Antic-Didone-Regular":require('../assets/fonts/antic-didone-v16-latin-regular.ttf'),
    "Limelight-Regular":require('../assets/fonts/limelight-v19-latin-regular.ttf'),
  })
  useEffect(()=>{
    if(fontsLoaded){
      SplashScreen.hideAsync();
    }
  },[fontsLoaded]);
  if(!fontsLoaded) return null;

  return (
    <GestureHandlerRootView >
      <Stack screenOptions={{headerShown: false}}  />;
    </GestureHandlerRootView>
  )

}
