import icons from '@/constants/icons';
import React from 'react';
import { View, Image, Text, TouchableHighlight } from 'react-native';



export const ClothesCategory = ({type, onPress}:{type:string, onPress:()=>void})=>{
    let imgSrc;
    let text;
    const categorise = (type: string) => {
        switch (type) {
            case 'outter':
                imgSrc=icons.outers
                text='Верхній одяг'
                break;
            case 'top':
                imgSrc=icons.tshirt
                text='Верх'
                break;
            case 'bottom':
                imgSrc=icons.pants
                text='Низ'
                break;
            case 'overall':
                imgSrc=icons.dress
                text='Суцільне'
                break;
            case 'shoes':
                imgSrc=icons.shoes
                text='Взуття'
                break;
            case 'accessory':
                imgSrc=icons.bag
                text='Аксесуари'
                break;
            default:
                break;
        }
        
    };
    categorise(type);

    return(
        <TouchableHighlight onPress={onPress} underlayColor="#d9d9d9" className='bg-white rounded-xl border border-black-100 p-3 '>
            <View className='items-center justify-center size-32 '>
                <Image source={imgSrc} resizeMode='contain' />
                <Text className='font-philosopher text-2xl text-center'>{text}</Text>
            </View>
        </TouchableHighlight>
    )
}