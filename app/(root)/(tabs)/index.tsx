import { Text, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableHighlight, Image } from "react-native";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";
import { fetchProfileData, fetchUserData, useAuth } from "@/lib/useAuth";
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
import dayjs from "dayjs";
import { API } from "@/constants/api";
import Outfit from "@/constants/outfitType";

export default function Index() {
  const {profile, loading , setProfile } = useProfile();
  const { auth, loading: authLoading } = useAuth();

  const { user, loading:userLoading } = useUser();
  const [outfits, setOutfits] = useState<Outfit[]>([]); 
  const [planed, setPlaned] = useState<Record<string, { selected?: boolean }>>({});
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [optionsShown, setOptionsShown] = useState(false);

  
  useEffect(()=>{
    if (!user && !userLoading){      
      removeAuth();
      AsyncStorage.removeItem('user');
      // router.replace('/sign-in');
    }
    if (user) {
      fetchOutfits();
    }
  },[]);

  const fetchOutfits = async () => {
    try {
      const response = await fetch(API + '/outfit/by-date?date='+dayjs(selectedDate).format('DD-MM-YYYY'), {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        console.log(response.status, response);
        
        throw new Error('Cannot fetch outfits');
      }
      const data = await response.json(); 
      setOutfits(data)  
      const mapped: Record<string, { selected?: boolean }> = {};
      data.forEach((outfit:Outfit) => {
        outfit.planningToWear.forEach((dateObj) => {
          const dateStr = new Date(dateObj).toISOString().split("T")[0];
          mapped[dateStr] = { selected: true }; 
        });
      });

      setPlaned(mapped)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    if (user)
      fetchOutfits();
  }, [selectedDate])
  
  const toggleOptions = ()=>{
    setOptionsShown(!optionsShown)
  }

  return (
    <SafeAreaView className='px-5 h-full bg-primary ' >    
        {loading && (
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                <ActivityIndicator size="large" color="#828282" />
            </View>
        )}
        <ScrollView contentContainerStyle={{ height:"95%", justifyContent:'space-evenly', alignContent:'center',  alignItems:'center', position:'relative' }} >
          
            <Image  source={icons.logo} className="size-32" resizeMode="contain"/>
            <View className="gap-4">
              <Text className="font-philosopher-bold text-2xl text-center">
                Календар
              </Text>
              <Text className="font-philosopher text-xl">
                Оберіть дату, щоб додати образ
              </Text>
            </View>
            <CalendarComponent plannedOutfits={planed} selectedDate={selectedDate} setSelectedDate={setSelectedDate}  />
          
            <View className="bg-white w-full rounded-xl min-h-24 flex-row items-center justify-start py-2 px-4">
              {outfits.length===0 ?(
                <Text className="font-philosopher text-black-100 text-xl self-center ml-16">
                  Немає запланованих образів
                </Text>
              ):(
                <ScrollView horizontal >
                  {outfits.map((outfit, i)=>(
                    <View key={i} className="size-20 border border-black-300 rounded-xl mr-3">
                      <TouchableHighlight underlayColor='white' onPress={()=>{}} className="rounded-xl">
                        <Image source={{uri:outfit.publicUrl}} className="w-full h-full" resizeMode="contain"/>
                      </TouchableHighlight>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
            <View className="self-end">
              <PlusButton onPress={()=>toggleOptions()} size={44}/>
            </View>
            {optionsShown && (
                    <View className='bg-white rounded-xl border border-black-300 w-68 px-3 py-2 absolute bottom-20 right-16  z-50'>
                        <TouchableHighlight onPress={()=>router.push({pathname:'/create-outfit', params: { date: selectedDate}})} underlayColor='#d9d9d9' className='border-black-300 border-b pb-1'>
                            <Text className='font-philosopher text-xl'>Створити самостійно</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>router.push({pathname:'/test', params: { date: selectedDate}})} underlayColor='#d9d9d9' className='pb-1'>
                            <Text className='font-philosopher text-xl'>Пройти тест</Text>
                        </TouchableHighlight>
                    </View>
                )}
        </ScrollView>
    </SafeAreaView>
  );
}
