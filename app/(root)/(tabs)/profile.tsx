
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, ActivityIndicator, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeAuth } from '@/lib/authService';
import { useUser } from "@/lib/useUser";
import { Alert } from 'react-native';
import { router, Router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useProfile } from '@/components/ProfileContext';
import icons from '@/constants/icons';
import { API } from '@/constants/api';
import { useAuth } from '@/lib/useAuth';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';



const Profile = () => {
    const {profile, loading  } = useProfile();
    const credentials = useAuth().auth;

    const [image, setImage] =useState<string | null>(null); 
    const [imageLoading, setImageLoading] =useState(true); 
    const [setShown, setSetShown] = useState(false);
    // const [itemsShown, setItemsShown] = useState(false);

  
    if (profile) {console.log('profile '+profile); console.log(profile)};
    
    useEffect(()=>{
        if (!profile.image) {
            setImageLoading(false);
            return;
        }
        if(moment(profile.urlExpiryDate)>moment()){
            setImage(profile.publicUrl);
            setImageLoading(false);
        }else{
            const fetchUrl = async()=>{
                try {
                    const response = await fetch(API+'/profile/'+profile.id+'/photoUrl',{
                        method: 'GET',
                            headers: {
                                'Authorization': `Basic ${credentials}`,
                            },
                    });
                    if (!response.ok){
                        throw new Error("Помилка отримання фото for profile");
                    }
                    const imageUrl = await response.text(); 
                    setImage(imageUrl);
                } catch (error) {
                    console.error("Помилка при отриманні посилання на фото:", error);
                }finally{
                    setImageLoading(false);
                }
            }
            fetchUrl();
        }
        
    }, [profile.image, profile.urlExpiryDate]);

    
    const toggleSettings = async()=>{
        setSetShown(!setShown);
    }

    const handleLogout = async () => {
        await removeAuth();
        Alert.alert('Вихід виконано');
        router.replace('/sign-in');
    };

    const tempopary = async ()=>{

    }

    return (
        <SafeAreaView className=' h-full bg-primary '>
            {loading || imageLoading && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                    <ActivityIndicator size="large" color="#828282" />
                </View>
            )}
            <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'center', alignContent:'center' }} >
                <View className='mx-4 flex-row items-start justify-between mb-2'>
                    <Image source={icons.logo} className='size-24' resizeMode='contain' />
                    <TouchableHighlight onPress={toggleSettings} underlayColor='#D9D9D9' className='size-fit m-4'>
                        <Ionicons name="settings-outline" size={32} color="black" />
                    </TouchableHighlight>
                </View>
                {setShown && (
                    <View className='bg-white rounded-xl w-68 px-3 py-2 absolute top-14 right-12 z-50'>
                        <TouchableHighlight onPress={()=>router.push('/edit-profile')} className='border-black-300 border-b pb-1'>
                            <Text className='font-philosopher text-xl'>Редагувати профіль</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>router.push('/sign-up-profile')} className='border-black-300 border-b py-1'>
                            <Text className='font-philosopher text-xl'>Додати профіль</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={()=>router.push('/edit-user')} className='border-black-300 border-b py-1'>
                            <Text className='font-philosopher text-xl'>Налаштування користувача</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={handleLogout} className='pt-1'>
                            <View className='flex-row justify-between items-center'>
                                <Text className='font-philosopher text-xl text-danger'>Вийти</Text>
                                <MaterialIcons name="logout" size={20} color="#BC4444" />
                            </View>
                        </TouchableHighlight>
                    </View>
                )}
                <View className='items-center min-h-64 gap-2 border-b border-black-200'>
                    {image ?(
                        <Image source={{uri: image}} className='size-36 rounded-full border-white border-solid border-4' resizeMode='contain' />
                    ):(
                        <View className='flex items-center justify-center rounded-full border-white border-solid border-4 size-36 bg-white'>
                            <MaterialCommunityIcons name='star-face' size={96}  />
                        </View>
                    )}
                    <Text className='font-philosopher-bold text-lg'>
                        @{profile.username}
                    </Text>
                    {profile.bio &&(
                        <Text className='font-philosopher text-center text-base text-black-100 max-w-36'>
                            {profile.bio}
                        </Text>
                    )}
                </View>
                <View className='flex-1 bg-white'>


                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile;