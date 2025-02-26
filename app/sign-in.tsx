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
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        setErrorMessage("");
        try {
            const credentials = btoa(`${email}:${password}`);
            console.log('request');
            const response = await fetch(API+'/user/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            })

            if (response.status === 401) {
                throw new Error("Перевірте дані: неправильна пошта або пароль!");
            } else if (!response.ok) {
                throw new Error("Вибачте, сталася помилка на сервері, спробуйте пізніше");
            }
            await saveAuth(email, password); 
            
            const profilesResponse = await fetch(API + '/user/profiles', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    "Accept": "application/json",
                }
            });
            
            if (!profilesResponse.ok) {
                throw new Error('Не вдалося отримати профілі');
            }
           
            const profiles = await profilesResponse.json(); 
            if (profiles.length === 1) {
                await AsyncStorage.setItem('selectedProfileId', profiles[0].id);
                router.push('/(root)/(tabs)');
            } else {
                router.push({pathname:'/choose-profile', params: { profiles: JSON.stringify(profiles) }});
            }
        } catch (error:any) {
            setErrorMessage(error.message); 
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
                    <CustomInput label='Електронна пошта:' placeholder='user@gmail.com' value={email} setValue={setEmail} type='email' />
                    <CustomPassword label='Пароль:' placeholder='Pass1234' value={password} setValue={setPassword} />
                    {errorMessage && <Text className="-mt-5 font-philosopher text-red-500 text-xl">{errorMessage}</Text>}
                    <MainButton text='Увійти' onPress={()=>handleLogin()} />
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