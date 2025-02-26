import { useEffect, useState } from 'react';
import { fetchUserData } from '@/lib/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUser = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                const userData = await fetchUserData();
                if (userData) {
                    setUser(userData);
                }
            } catch (err) {
                setError('Помилка завантаження користувача');
            } finally {
                setLoading(false);
            }
        };
        getUser();
        console.log(user);
    }, []);

    return { user, loading, error };
};
