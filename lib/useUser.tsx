import { useEffect, useState } from 'react';
import { fetchUserData } from '@/lib/useAuth';

export const useUser = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const userData = await fetchUserData();
                setUser(userData);
            } catch (err) {
                setError('Помилка завантаження користувача');
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

    return { user, loading, error };
};
