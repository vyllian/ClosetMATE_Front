import { Text, TouchableHighlight, View } from "react-native";
import React from 'react';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";



export const MainButton = (
    {text, onPress, color
    }:
    {text:string, onPress:() => void , color?:string
    }) => {
        const bgColor = color ? color : "black";
        return(
            <TouchableHighlight onPress={onPress} className="w-full min-h-12 flex items-center justify-center bg-black rounded-lg" style={{backgroundColor:bgColor}}>
                <Text className="text-white font-philosopher text-xl ">{text}</Text>
            </TouchableHighlight>
        );
    }

export const PlusButton = ({size, onPress}:{size:number, onPress:()=>void})=>{
    let btnSize = size>40 ? 'size-16' : 'size-10';
    return(
        <TouchableHighlight onPress={onPress} underlayColor="#bc4444" className={`bg-accent-100 ${btnSize} items-center justify-center rounded-full self-end`}>
            <MaterialCommunityIcons name="plus" size={size} color="white" />
        </TouchableHighlight>
    )
}

export const SearchButton=({ onPress}:{ onPress:()=>void})=>{
    return(
        <TouchableHighlight onPress={onPress} underlayColor="#d9d9d9" className="bg-white rounded-lg self-end px-2 py-1">
            <View className="flex-row items-center justify-center gap-x-1.5">
                <Text className="font-philosopher text-xl">Пошук</Text>
                <Ionicons name="search" size={20} color="black" />        
            </View>
        </TouchableHighlight>
    )
}
