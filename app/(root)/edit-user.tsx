import { MainButton } from '@/components/customButton';
import { CustomInput, CustomPassword } from '@/components/customInput';
import { useAuth } from '@/lib/useAuth';
import { useUser } from '@/lib/useUser';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TouchableHighlight, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditUser = () => {
    const credentials = useAuth().auth;
    const { user, loading:userLoading, error } = useUser();

    const [firstName, setFirstname] = useState('');
    const [lastName, setLasttname] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword]=useState('');

    useEffect(()=>{
        console.log(user);
        // setFirstname(user.firstName);
        // setLasttname(user.lastName);

    },[]);
    
    const deleteUser = async()=>{

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
                <View className='flex-row justify-between items-center w-full mt-4 '>
                    <TouchableHighlight onPress={()=>router.push('/(root)/(tabs)/profile')} underlayColor='#fbcce7' className='size-fit'>
                        <AntDesign name="arrowleft" size={32} color="black" />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>deleteUser()} underlayColor='#fbcce7' className=''>
                        <MaterialCommunityIcons name="trash-can-outline" size={32} color="#bc4444" />
                    </TouchableHighlight>
                </View>
                <View className='flex items-center gap-5'>
                    {/* <Text className=' text-center font-philosopher text-xl'>Вкажіть повне ім'я, електронну пошту і пароль</Text>
                    <CustomInput label="Прізвище ім'я:" placeholder='Шевченко Тарас' value={fullName} setValue={setName} type='name' />
                    <CustomInput label='Електронна пошта:' placeholder='user@gmail.com' value={email} setValue={setEmail} type='email' />
                    <CustomPassword label='Пароль:' placeholder='Pass1234' value={password} setValue={setPassword} type='password'/>
                    <MainButton text='Підтвердити' onPress={sendConfirmation} />
                    <Text className=' font-philosopher text-center text-black-200'>Натискаючи «Підтвердити», ви погоджуєтеся з нашими 
                        <Link href={'..'} className=' font-philosopher-bold text-black'> Умовами надання послуг</Link> та <Link href={'..'} className='text-black font-philosopher-bold'>Політикою конфіденційності</Link>
                    </Text> */}
                </View>
                
            </ScrollView>
            )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default EditUser;