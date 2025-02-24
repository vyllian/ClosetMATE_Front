import { Text, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableHighlight } from "react-native";
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

export default function Index() {
  const {profile, loading , setProfile } = useProfile();
  
  
  if(profile) console.log(profile);
  const handleLogout = async () => {
        await removeAuth();
        Alert.alert('Вихід виконано');
        router.replace('/sign-in');
    };

  return (
    <SafeAreaView className='px-5 h-full bg-primary ' >
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            ></KeyboardAvoidingView> */}
            {loading && (
                            <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                                <ActivityIndicator size="large" color="#828282" />
                            </View>
                        )}
        <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'flex-start', alignContent:'center' }} >
              <Text>yyyyy</Text>
              <TouchableHighlight onPress={handleLogout} className='pt-1'>
                            <View className='flex-row justify-between items-center'>
                                <Text className='font-philosopher text-xl text-danger'>Вийти</Text>
                                <MaterialIcons name="logout" size={20} color="#BC4444" />
                            </View>
                        </TouchableHighlight>
        </ScrollView>
            
    </SafeAreaView>
  );
}
