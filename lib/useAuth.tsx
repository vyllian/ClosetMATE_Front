import { useEffect, useState } from 'react';
import { getAuth } from '@/lib/authService';
import { API } from '@/constants/api';

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
        if (!credentials) throw new Error('Користувач не авторизований');

        const response = await fetch(API+'/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });

        if (!response.ok) throw new Error('Не вдалося отримати дані користувача');

        return await response.json();
    } catch (error:any) {
        console.error('Помилка отримання користувача:', error.message);
        return null;
    }
};

export const fetchProfileData = async (id:string) => {
    try {
        const credentials = await getAuth();
        if (!credentials) throw new Error('Користувач не авторизований');

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
        return null;
    }
};