
import icons from '@/constants/icons';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsItemProps{
    icon: ImageSourcePropType;
    title: string; 
    onPress?: () =>void;
    textStyle?: string;
    showArrow?: boolean;
}

const SettingsItem = ({
    icon, title, onPress, textStyle, showArrow=true
}: SettingsItemProps) =>(
    <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between py-3'>
        <View className='flex flex-row items-center gap-3'>
            <Image source={icon} className='size-6'/>
            <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
        </View>
        {/* {showArrow && <Image source={icons.rightArrow} className='size-5'/>} */}
    </TouchableOpacity>
)

const Profile = () => {
    const [info, setInfo] = useState<any>({});
    const [loading, setLoading] = useState(true);


   
    const fetchData = async () => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem("userId"); 
            if (!userId) throw new Error("User ID not found");
            const profileURL='http://localhost:8080/api/profile/detailed/${userId}'

            const response = await axios.get(profileURL);
            const data = response.data;
            setInfo(data);
            console.log(data);
        } catch (error: any) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchData();
    },[]);
    
    const handleLogout = async () => {};

    return (
        <SafeAreaView className='h-full bg-white'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName='pb-32 px-7'
            >
                <View className='flex flex-row items-center justify-between mt-5'>
                    <Text className='text-xl '>
                        Profile
                    </Text>
                    {/* <Image source={icons.bell} className='size-5' /> */}
                </View>
                <View className='flex-row justify-center flex mt-5'>
                    <View className='flex flex-col items-center relative mt-5'>
                        <Image source={icons.avatar} className='size-44 relative rounded-full' />
                        {/* <TouchableOpacity className='absolute bottom-11 right-2'>
                            <Image source={icons.edit} className='size-9'/>
                        </TouchableOpacity> */}
                        <Text className='text-2xl mt-2'>
                            Adrian | JSM
                        </Text>
                    </View>
                </View>
                <View className='flex flex'>
                    {/* <SettingsItem icon={icons.calendar} title='My Bookings'></SettingsItem>
                    <SettingsItem icon={icons.wallet} title='Payments'></SettingsItem> */}

                </View>
                {/* <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
                    {settings.slice(2).map((item, index) =>(
                        <SettingsItem key={index} {... item} />
                    ))}
                </View> */}
                <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
                    <SettingsItem icon={icons.logout} title='Logout' textStyle='text-danger' showArrow={false} onPress={handleLogout}/>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile;