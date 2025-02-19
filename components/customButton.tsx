import { Text, TouchableHighlight, View } from "react-native";
import React from 'react';



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
