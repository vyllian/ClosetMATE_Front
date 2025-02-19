import { TextInput, View, Text, Image, TouchableHighlight } from "react-native";
import {useState} from 'react';
import Entypo from '@expo/vector-icons/Entypo';

const validateInput = (type: "email" | "password" | "name", text: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const nameRegex = /^([А-ЩЮЯЇІЄҐ’A-Z][а-щьюяїієґ'’a-z]+)\s([А-ЩЮЯЇІЄҐ’A-Z][а-щьюяїієґ'’a-z]+)$/; 
  
    if (type === "email" && !emailRegex.test(text)) {
      return "Некоректна пошта";
    } else if (type === "password" && !passwordRegex.test(text)) {
        if(text.length>=8){
            const hasDigit = (str: string): boolean => str.match(/\d/) !== null;
            const hasCapLet = (str: string): boolean => str.match(/[A-Z]/) !== null;
            const hasSmalLet = (str: string): boolean => str.match(/[a-z]/) !== null;
            if(!hasDigit(text))
                return "Пароль має містити хоча б 1 цифру";
            if(!hasCapLet(text))
                return "Пароль має містити хоча б 1 велику літеру";
            if (!hasSmalLet)
                return "Пароль має містити хоча б 1 малу літеру"
        }
        else {
            return "Пароль має містити мінімум 8 символів";
        }
    }else if(type=== "name" && !nameRegex.test(text)){
        return "Перевірте написання";
    }
    return "";
  };

export const CustomInput = (
    {label, placeholder, value, setValue, type
    }:
    {label:string, placeholder:string, value:string|null, setValue:(text: string) => void, type?: "email" | "password" | "name";
    }) => {
    
        const [error, setError] = useState("");

        const handleChange = (text: string) => {
          setValue(text);
          if (type) {
            setError(validateInput(type, text));
          }
        };

        return (
        <View className="mb-0">
            <Text className="font-philosopher text-xl">{label}</Text>
            <View className={`relative flex flex-row items-center justify-start min-h-12 w-full bg-white border ${
                    error ? "border-red-500" : "border-black-300"
                    } border-solid rounded-lg px-3`}>
                <TextInput value={value ? value :""} onChangeText={handleChange} placeholder={placeholder} className='w-full h-full py-0 flex-1 leading-5  placeholder:text-black-200 placeholder:font-philosopher placeholder:text-xl ' />
                
            </View>
            {error ? <Text className="absolute -bottom-5 font-philosopher text-red-500 text-base">{error}</Text> : null}
        </View>
    );
}

export const CustomPassword = ( {label, placeholder, value, setValue, type
}:
{label:string, placeholder:string, value:string, setValue:(text: string) => void, type?: "password"
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (text: string) => {
        setValue(text);
        if (type) {
            setError(validateInput(type, text));
          }
    };
    return (
        <View  className="mb-3">
            <Text className="font-philosopher text-xl">{label}</Text>
            <View className="relative flex flex-row items-center justify-start min-h-12 w-full bg-white border border-black-300 border-solid rounded-lg px-3 pr-4 ">
                <TextInput secureTextEntry={!isVisible} value={value} onChangeText={handleChange} placeholder={placeholder} className=' w-full h-full  py-0 flex-1 leading-5  placeholder:text-black-200 placeholder:font-philosopher placeholder:text-xl ' />
                <TouchableHighlight onPress={() => setIsVisible(!isVisible)}>
                    <Entypo name={isVisible?"eye":"eye-with-line" } size={20} color="#636363" />
                </TouchableHighlight>
            </View>
            {error ? <Text className="absolute -bottom-5 font-philosopher text-red-500 text-base">{error}</Text> : null}
        </View>
    );
}