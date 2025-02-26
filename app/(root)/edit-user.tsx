import { MainButton } from '@/components/customButton';
import { CustomInput, CustomPassword } from '@/components/customInput';
import { API } from '@/constants/api';
import { removeAuth } from '@/lib/authService';
import { useAuth } from '@/lib/useAuth';
import { useUser } from '@/lib/useUser';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TouchableHighlight, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditUser = () => {
    const credentials = useAuth().auth;
    const { user, loading:userLoading, error } = useUser();

    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [nameShown, setNameShown] = useState(false);
    const [email, setEmail] = useState('');
    const [emailShown, setEmailShown] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword]=useState('');
    const [passShown, setPassShown] = useState(false);


    useEffect(()=>{
        if(user){
            setFirstname(user.firstName);
            setLastname(user.lastName);
            setEmail(user.email);
        }
    },[]);

    const toggleName=async () => {
        setNameShown(!nameShown);
    }
    const toggleEmail=async () => {
        setEmailShown(!emailShown);
    }
    const togglePassword=async () => {
        setPassShown(!passShown);
    }

    const updateNames = async()=>{
        let newUser = user;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        try {
            const response = await fetch(API+'/user/edit/'+user.id,{
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            if (!response.ok){
                throw new Error("Помилка put users name");
            }
            Alert.alert("Ім'я успішно зміненно");
        } catch (error:any) {
            console.log(error.message);
        }finally{
            setNameShown(false);
        }
    }
    const updateEmail = async()=>{
        try {
            const response = await fetch(API+'/user/'+user.id+'/change-email',{
                method: 'PATCH',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    //'Content-Type': 'application/json',
                },
                body: email,
            });
            if (!response.ok){
                throw new Error("Помилка patch users email");
            }
            Alert.alert("Перевірте пошту",
                        "Підтвердьте пошту й увійдіть в додаток.",
                        [{ text: "OK", onPress: () => router.push('/sign-in')}]);
        } catch (error:any) {
            console.log(error.message);
        }finally{
            setEmailShown(false);
        }
    }
    const updatePassword = async()=>{
        try {
            const response = await fetch(API+'/user/'+user.id+'/change-password',{
                method: 'PATCH',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });
            console.log(response.status);
            if (!response.ok){
                const errorData = await response.json(); // Отримуємо текст помилки
                if (response.status === 400) {
                    throw new Error(errorData.message || "Старий пароль невірний");
                }
                throw new Error("Щось пішло не так");
            }
            Alert.alert("Здійсніть вхід в додаток",
                        "Підтвердьте новий пароль входом.",
                        [{ text: "OK", onPress: () => router.push('/sign-in')}]);
        } catch (error:any) {
            console.log(error.message);
        }finally{
            setPassShown(false);
        }
    }
    
    
    const deleteUser = async()=>{
        Alert.alert(
            "Видалити цього користувача і профілі пов'язані з ним?",
            "Цю дію неможливо скасувати.",
            [
                {text:"Видалити", style:'destructive', onPress: async()=>{
                    try {
                        const response = await fetch(API+'/user/delete/'+user.id,{
                            method:'DELETE',
                            headers:{
                                'Authorization': `Basic ${credentials}`,
                            },
                        });
                        if (!response.ok){
                            throw new Error("Помилка deelete user");
                        }
                        removeAuth();
                        AsyncStorage.removeItem('user');
                        router.replace('/sign-in')
                    } catch (error:any) {
                        console.log(error.message);
                    }
                }},
                {text:"Скасувати", style: 'cancel'}
            ]
        )
    };

    return(
        <SafeAreaView className='px-5 h-full bg-primary ' >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
            {userLoading ? (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary flex items-center justify-center z-50">
                    <ActivityIndicator size="large" color="#828282" />
                </View>
            ):(
            <ScrollView contentContainerStyle={{ height:"100%", justifyContent:'center', alignContent:'center' }} >
                <View className='flex-row justify-between items-center w-full absolute top-safe-or-0'>
                    <TouchableHighlight onPress={()=>router.push('/(root)/(tabs)/profile')} underlayColor='#fbcce7' className='size-fit'>
                        <AntDesign name="arrowleft" size={32} color="black" />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>deleteUser()} underlayColor='#fbcce7' className=''>
                        <MaterialCommunityIcons name="trash-can-outline" size={32} color="#bc4444" />
                    </TouchableHighlight>
                </View>
                <View className='flex items-center gap-5'>
                    <Text className=' text-center font-philosopher-bold text-2xl'>Дані про користувача</Text>
                    <MainButton text="Оновити ім'я" onPress={()=>toggleName()} />
                    <MainButton text='Оновити пошту' onPress={()=>toggleEmail()} />
                    <MainButton text='Оновити пароль' onPress={()=>togglePassword()} />
                </View>  
            </ScrollView>
            )}
            {nameShown && (
                <View className='bg-white rounded-xl absolute p-5 z-50 top-1/3 w-full'>
                    <TouchableHighlight underlayColor='#d9d9d9' onPress={()=>toggleName()} className='self-end'>
                            <AntDesign name="close" size={24} color="black" />
                    </TouchableHighlight>
                    <View className='flex  w-full h-fit gap-5 '>
                        <CustomInput label="Ім'я:" placeholder="Ім'я" value={firstName} setValue={setFirstname} />
                        <CustomInput label="Прізвище:" placeholder="Прізвище" value={lastName} setValue={setLastname} />
                        <MainButton text='Оновити' onPress={()=>updateNames()}/>
                    </View>
                </View>
            )}
            {emailShown && (
                <View  className='bg-white rounded-xl absolute p-5 z-50 top-1/3 w-full mt-20'>
                    <TouchableHighlight underlayColor='#d9d9d9' onPress={()=>toggleEmail()} className='self-end'>
                            <AntDesign name="close" size={24} color="black" />
                    </TouchableHighlight>
                    <View className='flex  w-full h-fit gap-5 '>
                        <CustomInput label="Електронна пошта:" placeholder="email@gmail.com" value={email} setValue={setEmail} />
                        <MainButton text='Оновити' onPress={()=>updateEmail()}/>
                    </View>
                </View>
            )}
            {passShown && (
                <View className='bg-white rounded-xl absolute p-5 z-50 top-1/3 w-full'>
                    <TouchableHighlight underlayColor='#d9d9d9' onPress={()=>togglePassword()} className='self-end'>
                            <AntDesign name="close" size={24} color="black" />
                    </TouchableHighlight>
                    <View className='flex  w-full h-fit gap-3 '>
                        <CustomPassword label="Старий пароль:" placeholder="oldPassword1" value={oldPassword} setValue={setOldPassword} />
                        <CustomPassword label="Новий пароль:" placeholder="newPassword2" value={newPassword} setValue={setNewPassword} />
                        <MainButton text='Оновити' onPress={()=>updatePassword()}/>
                    </View>
                </View>
            )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default EditUser;