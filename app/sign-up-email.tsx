import { MainButton } from '@/components/customButton';
import { CustomInput, CustomPassword } from '@/components/customInput';
import { API } from '@/constants/api';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, ScrollView,KeyboardAvoidingView, Platform , Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUpEmail = () => {
    const [email, setEmail] = useState('');
    const [fullName, setName] = useState('');
    const [password, setPassword] = useState('');

    const sendConfirmation = async()  =>{
        try {
            const requestBody = {
                firstName: fullName.split(' ').slice(1).join(' '),
                lastName:fullName.split(' ')[0] , 
                email: email,
                password: password,
            };
            console.log(requestBody);
            const response = await fetch(API+"/registration", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            
            
            const data = await response.text();
            if (!response.ok) throw new Error(data);

            Alert.alert(
                "Перевірте пошту",
                "Підтвердьте пошту й увійдіть в додаток.",
                [{ text: "OK", onPress: () => router.push('/sign-in')
                }]
            );
        } catch (error: any) {
            Alert.alert('Помилка', error.message);
        }
    }

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
                    <Text className=' text-center font-philosopher text-xl'>Вкажіть повне ім'я, електронну пошту і пароль</Text>
                    <CustomInput label="Прізвище ім'я:" placeholder='Шевченко Тарас' value={fullName} setValue={setName} type='name' />
                    <CustomInput label='Електронна пошта:' placeholder='user@gmail.com' value={email} setValue={setEmail} type='email' />
                    <CustomPassword label='Пароль:' placeholder='Pass1234' value={password} setValue={setPassword} type='password'/>
                    <MainButton text='Підтвердити' onPress={sendConfirmation} />
                    <Text className=' font-philosopher text-center text-black-200'>Натискаючи «Підтвердити», ви погоджуєтеся з нашими 
                        <Link href={'/terms-of-use'} className=' font-philosopher-bold text-black'> Умовами надання послуг</Link> та <Link href={'/privacy-policy'} className='text-black font-philosopher-bold'>Політикою конфіденційності</Link>
                    </Text>
                </View>
                
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignUpEmail;