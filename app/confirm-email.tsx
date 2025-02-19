import React, { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Alert, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API } from "@/constants/api";
import icons from "@/constants/icons";
import { useAuth } from "@/lib/useAuth";


const ConfirmEmail = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const router = useRouter();
    const { email } = useLocalSearchParams(); 
    const credentials = useAuth().auth;


    useEffect(() => {
       
        const checkEmailStatus = async () => {
            try {
                console.log("Відправка запиту...");
    
                const response = await fetch(API + `/user/status?email=${email}`,{
                    method: 'GET',
                    headers: {
                     'Authorization': `Basic ${credentials}`,
                     'Content-Type': 'application/json',
                    },
                });
                console.log("Запит відправлено, статус:", response.status);
    
                if (!response.ok) {
                    console.error("Помилка сервера:", response.status, await response.text());
                    return;
                }
    
                const data = await response.json();
                console.log("Отримано відповідь:", data);
    
                if (data.confirmed) {
                    setIsConfirmed(true);
                }
            } catch (error) {
                console.error("Помилка перевірки підтвердження:", error);
            }
        };
    
        const interval = setInterval(checkEmailStatus, 2000);
    
        return () => clearInterval(interval); // Завжди очищаємо інтервал при розмонтуванні
    }, []);
    
    useEffect(() => {
        if (isConfirmed) {
         // Очищаємо інтервал, щоб не було зайвих запитів
            Alert.alert("Пошта підтверджена", "", [
                { text: "OK", onPress: () => router.push("/") }
            ]);
        }
    }, [isConfirmed]);

    return (
        <View className="flex-1 justify-start items-center bg-primary pt-56 gap-16">
            <Image source={icons.logo} className="size-36" resizeMode="contain" />
            <View>
                <Text className="text-2xl font-philosopher-bold text-black mb-4">Очікуємо підтвердження пошти...</Text>
                <ActivityIndicator size="large" color="#828282" />
            </View>
        </View>
    );
};

export default ConfirmEmail;
