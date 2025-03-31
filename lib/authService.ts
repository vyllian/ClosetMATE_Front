import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from 'base-64';

const AUTH_KEY = 'auth_credentials';

// Зберігаємо креденшіали в AsyncStorage
export const saveAuth = async (email: string, password: string): Promise<void> => {
    const credentials = encode(`${email}:${password}`);
    await AsyncStorage.setItem(AUTH_KEY, credentials);
};

// Отримуємо креденшіали
export const getAuth = async (): Promise<string | null> => {
    const auth = await AsyncStorage.getItem(AUTH_KEY);

    return auth;
};

// Видаляємо креденшіали при виході
export const removeAuth = async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_KEY);
};
