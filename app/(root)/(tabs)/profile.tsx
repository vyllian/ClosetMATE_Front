
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeAuth } from '@/lib/authService';
import { useUser } from "@/lib/useUser";
import { Alert } from 'react-native';
import { router, Router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


interface SettingsItemProps{
    icon: ImageSourcePropType;
    title: string; 
    onPress?: () =>void;
    textStyle?: string;
    showArrow?: boolean;
}



const Profile = () => {
    const { user, loading, error } = useUser();

    if (loading) return <ActivityIndicator size="large" />;
    if (error) return <Text>{error}</Text>;
    
    const handleLogout = async () => {
        await removeAuth();
        Alert.alert('Вихід виконано');
        router.replace('/sign-in');
    };

    return (
        <SafeAreaView className='px-5 h-full bg-primary '>
            <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'flex-start', alignContent:'center' }} >
            
                

            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile;