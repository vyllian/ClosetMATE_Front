import { useEffect, useState } from 'react';
import { getAuth } from '@/lib/authService';
import { API } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const useAuth = () => {
    const [auth, setAuth] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuth = async () => {
            const credentials = await getAuth();
            setAuth(credentials);
            setLoading(false);
        };
        fetchAuth();
    }, []);

    return { auth, loading };
};

export const fetchUserData = async () => {
    try {
        const credentials = await getAuth();
        if (!credentials) {
            Alert.alert("Здійсніть вхід ще раз."); 
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
        console.error('Помилка отримання користувача:', error.message);
        // const storedUser = await AsyncStorage.getItem('user');
        // return storedUser ? JSON.parse(storedUser) : null;
    }
};

export const fetchProfileData = async (id:string) => {
    try {
        const credentials = await getAuth();
        if (!credentials) {
            Alert.alert("Здійсніть вхід ще раз."); 
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
      //  console.error('Помилка отримання профілю:', error.message);
        return null;
    }
};