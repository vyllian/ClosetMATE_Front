import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView,Alert, Platform } from "react-native";
import { SafeAreaView  } from 'react-native-safe-area-context';
import { Link, Redirect, useRouter } from 'expo-router';
import { saveAuth } from '@/lib/authService';
import {CustomInput, CustomPassword } from "@/components/customInput";
import { MainButton } from '@/components/customButton';
import { API } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';



const SignIn = () =>{
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const credentials = btoa(`${email}:${password}`);

            const response = await fetch(API+'/user/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (!response.ok) {
                throw new Error('Неправильний email або пароль');
            }
            await saveAuth(email, password); 
           
            const profilesResponse = await fetch(API + '/user/profiles', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });
    
            if (!profilesResponse.ok) {
                throw new Error('Не вдалося отримати профілі');
            }
            const profiles = await profilesResponse.json(); 
            console.log(profiles)
            if (profiles.length === 1) {
                console.log('sign-in: '+profiles[0].id);
                await AsyncStorage.setItem('selectedProfileId', profiles[0].id);
                router.push('/(root)/(tabs)');
            } else {
                // Якщо немає профілів або їх більше одного — йдемо на сторінку вибору профілю
                router.push({pathname:'/choose-profile', params: { profiles: profiles }});
            }
        } catch (error:any) {
            Alert.alert('Помилка входу', error.message);
        }
    };


    return(
        <SafeAreaView className='px-5 h-full bg-primary ' >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
            <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'center', alignContent:'center' }} >
                <View className='items-center mb-11'>
                    <Text className='font-philosopher-bold text-2xl' >Вітаємо у</Text>
                    <View className='flex flex-row items-center justify-center' >
                        <Text className='font-anticdidone text-4xl leading-none'>Closet</Text><Text className='font-limelight text-4xl '>MATE</Text>
                    </View>
                </View>
                <View className='flex items-center gap-5'>
                    <Text className=' font-philosopher text-xl'>Не зареєстровані? <Link href='/sign-up-email' className='font-philosopher-bold'>Створіть акаунт!</Link></Text>
                    <CustomInput label='Електронна пошта:' placeholder='user@gmail.com' value={email} setValue={setEmail} />
                    <CustomPassword label='Пароль:' placeholder='Pass1234' value={password} setValue={setPassword} />
                    <MainButton text='Увійти' onPress={handleLogin} />
                    <Text className='text-center font-philosopher text-bage text-black-200'>Натискаючи «Увійти», ви погоджуєтеся з нашими 
                        <Link href={'..'} className=' font-philosopher-bold text-black-100'> Умовами надання послуг</Link> та <Link href={'..'} className='text-black-100 font-philosopher-bold'>Політикою конфіденційності</Link>
                    </Text>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignIn;