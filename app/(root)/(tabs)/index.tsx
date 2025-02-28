import { Text, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableHighlight, Image } from "react-native";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";
import { fetchProfileData, fetchUserData } from "@/lib/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "@/components/ProfileContext";
import { removeAuth } from "@/lib/authService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import icons from "@/constants/icons";
import { PlusButton } from "@/components/customButton";
import { CalendarComponent } from "@/components/calendar";

export default function Index() {
  const {profile, loading , setProfile } = useProfile();
  const { user, loading:userLoading } = useUser();
  
  useEffect(()=>{
    if (!user && !userLoading){
      removeAuth();
      AsyncStorage.removeItem('user');
     // router.replace('/sign-in');
    }
  },[]);
  
  
  
//  if(profile) console.log(profile);
  const handleLogout = async () => {
    await removeAuth();
    await AsyncStorage.removeItem('user');
   // Alert.alert('Вихід виконано');
    router.replace('/sign-in');
  };
  const tem= async()=>{

  }

  return (
    <SafeAreaView className='px-5 h-full bg-primary ' >    
        {loading && (
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                <ActivityIndicator size="large" color="#828282" />
            </View>
        )}
        <ScrollView contentContainerStyle={{ height:"95%", justifyContent:'space-evenly', alignContent:'center',  alignItems:'center' }} >
          
            <Image  source={icons.logo} className="size-32" resizeMode="contain"/>
            <View className="gap-4">
              <Text className="font-philosopher-bold text-2xl text-center">
                Календар
              </Text>
              <Text className="font-philosopher text-xl">
                Оберіть дату, щоб додати образ
              </Text>
            </View>
            <CalendarComponent />
          
            <View className="bg-white w-full rounded-xl min-h-20">

            </View>
            <PlusButton onPress={()=>tem()} size={44}/>
        </ScrollView>
    </SafeAreaView>
  );
}
