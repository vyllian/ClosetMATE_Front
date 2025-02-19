import { Text, View, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";
import { fetchProfileData, fetchUserData } from "@/lib/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [profile, setProfile] = useState();
  const [loadingIn, setLoading] = useState(true);
  const { user, loading, error } = useUser();
  
  useEffect(() => {
      const loadProfile = async () => {
          if(loading) return;
          try {
              const profileId = await AsyncStorage.getItem('selectedProfileId');
              if (!profileId) {
                 if (user.profiles.lenght===1){
                  const data = await fetchProfileData(user.profiles[0].id);
                  if (data) setProfile(data);            
                }
                else{
                  router.push({pathname:'/choose-profile', params: { profiles: user.profiles }});
                }
              }
              else{
                const data = await fetchProfileData(profileId);
                if (data) setProfile(data);
              }
          } catch (error) {
              console.error('Помилка завантаження профілю:', error);
          } finally {
              setLoading(false);
          }
      };

      loadProfile();
  }, [user, loading]);

  if (loadingIn || loading) return <ActivityIndicator size="large" color="#828282" />;
  if(profile) console.log(profile);

  return (
    <SafeAreaView className='px-5 h-full bg-primary ' >
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            ></KeyboardAvoidingView> */}
        <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'flex-start', alignContent:'center' }} >
          
        </ScrollView>
            
    </SafeAreaView>
  );
}
