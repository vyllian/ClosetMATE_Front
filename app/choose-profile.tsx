import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, Image, TouchableHighlight } from 'react-native';
import { ProfilePreview } from "@/components/profilePreview";
import { API } from '@/constants/api';
import { getAuth } from '@/lib/authService';
import icons from '@/constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ChooseProfile = () => {
    const { profiles } = useLocalSearchParams();
    const router = useRouter();

    let parsedProfiles = [];
    if (typeof profiles === "string" && profiles.trim().length > 0) {
        try {
            parsedProfiles = JSON.parse(profiles);
        } catch (error) {
            console.error("Помилка парсингу profiles:", error);
        }
    }

    const openProfile = async (id: string) => {
        try {
            await AsyncStorage.setItem('selectedProfileId', id);
            router.replace('/(root)/(tabs)'); 
        } catch (error) {
            console.error("Помилка збереження профілю", error);
        }
    }
    const newProfile = async () => {
        router.push('/sign-up-profile');
    }

    return ( 
        <SafeAreaView className='px-5 h-full bg-primary ' >
            <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'flex-start', alignItems:'center' }} >
                <Image source={icons.logo} className='size-44 my-16' resizeMode='contain' />
                <Text className='text-2xl font-philosopher-bold text-black mb-8' >{parsedProfiles.length===0 ? "Потрібно створити профіль" : "Виберіть профіль"}</Text>
                <View className='flex flex-row flex-wrap gap-3'>
                    {parsedProfiles.length > 0 && (
                        parsedProfiles.map((profile: { image: string; username: string; id: string }) => (
                            <ProfilePreview key={profile.id} image={profile.image} username={profile.username} onPress={() => openProfile(profile.id)} />
                        ))
                    )}
                    <ProfilePreview username='Новий профіль' onPress={newProfile} newProfile={true} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ChooseProfile;