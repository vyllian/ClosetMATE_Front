import { useEffect, useState } from 'react';
import { getAuth, removeAuth } from '@/lib/authService';
import { API } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export const useAuth = () => {
    const [auth, setAuth] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuth = async () => {
            const credentials = await getAuth();
            console.log('Отримані креденшіали:', credentials);
            setAuth(credentials);
            setLoading(false);
        };
        fetchAuth();
        console.log('useEf:'+auth);
        
    }, []);

    return { auth, loading };
};

export const fetchUserData = async () => {
    try {
        const credentials = await getAuth();
        if (!credentials) {
           // return;
            router.replace('/sign-in');            
        }

        const response = await fetch(API+'/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });

        if (!response.ok) throw new Error('Не вдалося отримати дані користувача');
        const userData = await response.json();

        await AsyncStorage.setItem('user', JSON.stringify(userData));

        return userData;
    } catch (error:any) {
        console.log('Помилка отримання користувача:', error.message);
        // await removeAuth();
        // await AsyncStorage.removeItem('user');
        // router.replace('/sign-in');
        // const storedUser = await AsyncStorage.getItem('user');
        // return storedUser ? JSON.parse(storedUser) : null;
    }
};

export const fetchProfileData = async (id:string) => {
    try {
        const credentials = await getAuth();
        if (!credentials) {
            return;
          //  router.push('/sign-in');            
        } 

        const response = await fetch(API+'/profile/'+id, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });

        if (!response.ok) throw new Error('Не вдалося отримати дані профілю');

        return await response.json();
    } catch (error:any) {
       console.error('Помилка отримання профілю:', error.message);
    //    await removeAuth();
    //    await AsyncStorage.removeItem('user');
    //    router.replace('/sign-in');
        return null;
    }
};